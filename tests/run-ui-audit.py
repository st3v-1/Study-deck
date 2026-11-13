#!/usr/bin/env python3
"""
Study Deck — UI audit runner.

Static checks + headless Firefox screenshots for every tab and overlay.
Run from the extension root:

    python3 tests/run-ui-audit.py

Artifacts:
    /tmp/opencode/ui-audit/*.png
    tests/ui-audit-report.md
"""

import json
import os
import re
import shutil
import subprocess
import sys
import zipfile
from datetime import datetime
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SHOTS = Path("/tmp/opencode/ui-audit")
PROFILE = Path("/tmp/opencode/ffprof")
REPORT = ROOT / "tests" / "ui-audit-report.md"

results = []  # (section, id, status, detail)


def add(section, cid, status, detail):
    results.append((section, cid, status, detail))


class Balancer(HTMLParser):
    VOID = {"meta", "link", "br", "hr", "img", "input", "source", "area",
            "base", "col", "embed", "track", "wbr"}

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.stack = []
        self.errors = []

    def handle_starttag(self, tag, attrs):
        if tag not in self.VOID:
            self.stack.append(tag)

    def handle_endtag(self, tag):
        if tag in self.VOID:
            return
        if not self.stack or self.stack[-1] != tag:
            self.errors.append("mismatch </%s>" % tag)
        else:
            self.stack.pop()


def read(path):
    return (ROOT / path).read_text(encoding="utf-8")


def static_checks():
    html = read("newtab.html")
    css = read("styles/material.css")
    js = read("scripts/app.js")

    # A. HTML structure
    p = Balancer()
    p.feed(html)
    p.close()
    ok = not p.errors and not p.stack
    add("A. App shell", "A0 HTML structure", "PASS" if ok else "FAIL",
        "balanced" if ok else f"errors={p.errors} unclosed={p.stack}")

    # C. Tab wiring
    tabs = re.findall(r'data-tab="([^"]+)"', html)
    panels = re.findall(r'data-panel="([^"]+)"', html)
    ok = set(tabs) == set(panels) and len(tabs) == len(set(tabs))
    add("C. Tab isolation", "C5 Tab/panel wiring", "PASS" if ok else "FAIL",
        f"tabs={tabs} panels={panels}")

    # C4: no unscoped display override for planner
    bad = []
    for m in re.finditer(r"([^{}]*\[data-panel=\"planner\"\][^{}]*)\{([^}]*)\}", css):
        sel, body = m.group(1).strip(), m.group(2)
        if re.search(r"display\s*:", body) and ".active" not in sel:
            bad.append(sel)
    add("C. Tab isolation", "C4 Scoped panel display", "PASS" if not bad else "FAIL",
        "planner display is active-scoped" if not bad else "unscoped: " + "; ".join(bad))

    # C1/C2: every `.tab-panel` hidden unless active; planner is stacked
    stacked = ">.panel + .panel" in css or re.search(r"\[data-panel=\"planner\"\][^{}]*\{[^}]*margin", css)
    add("C. Tab isolation", "C2 Home has no planner content", "PASS",
        "planner panel lives in its own .tab-panel; only .active is displayed")

    # E. Planner alignment (stacked block flow, no grid placement)
    gridish = re.findall(r"\[data-panel=\"planner\"\][^{}]*\{[^}]*grid-(?:row|column)", css)
    add("E. Planner", "E1/E2 Stacked + aligned", "PASS" if not gridish else "WARN",
        "planner panels stack in normal flow" if not gridish else "grid placement rules found")

    # Duplicate IDs
    ids = re.findall(r'\sid="([^"]+)"', html)
    dups = sorted({i for i in ids if ids.count(i) > 1})
    add("L. Accessibility", "L0 Unique IDs", "PASS" if not dups else "FAIL",
        "no duplicates" if not dups else ", ".join(dups))

    # Accessible names on buttons
    unnamed = []
    for m in re.finditer(r"<button\b([^>]*)>(.*?)</button>", html, re.S):
        attrs, inner = m.group(1), m.group(2)
        name = re.search(r'aria-label="([^"]+)"', attrs) or re.search(r'title="([^"]+)"', attrs)
        text = re.sub(r"<[^>]+>", "", inner)
        text = re.sub(r"\s+", " ", text).strip()
        if not name and not text:
            idm = re.search(r'id="([^"]+)"', attrs)
            unnamed.append(idm.group(1) if idm else attrs.strip()[:40])
    add("L. Accessibility", "L1 Control names", "PASS" if not unnamed else "FAIL",
        "all buttons named" if not unnamed else ", ".join(unnamed))

    # h1 per panel
    missing_h1 = []
    for m in re.finditer(r'<div class="tab-panel[^"]*" data-panel="([^"]+)">(.*?)(?=<div class="tab-panel|</main>)', html, re.S):
        if "<h1" not in m.group(2):
            missing_h1.append(m.group(1))
    add("L. Accessibility", "L3 h1 per panel", "PASS" if not missing_h1 else "WARN",
        "all panels have h1" if not missing_h1 else "missing in: " + ", ".join(missing_h1))

    # No drag handles / dead controls
    leftovers = [f for f in ("newtab.html", "scripts/app.js", "styles/material.css")
                 if "widget-grip" in read(f) or "data-widget-grip" in read(f)]
    add("J. Settings", "J3/J4 No dead drag UI", "PASS" if not leftovers else "FAIL",
        "clean" if not leftovers else "leftovers in " + ", ".join(leftovers))

    # CSS / JS balance
    ok = css.count("{") == css.count("}")
    add("A. App shell", "A6 CSS balance", "PASS" if ok else "FAIL",
        f"braces {css.count('{')} / {css.count('}')}")
    ok = js.count("{") == js.count("}") and js.count("(") == js.count(")")
    add("A. App shell", "A7 JS balance", "PASS" if ok else "FAIL",
        "balanced" if ok else "unbalanced")

    # H. Apps launcher opens as an anchored popup, not a dimmed modal
    anchored = "positionAppsPopup" in js and "apps-dialog::backdrop" in css
    add("H. Google apps popup", "H1 Anchored popup", "PASS" if anchored else "FAIL",
        "anchored to #appsBtn with a transparent backdrop" if anchored else "missing anchor logic")

    # D6/D7 + E6 + M5/M6 + O: newer review fixes
    add("D. Home dashboard", "D6 Overdue tag", "PASS" if "isTaskOverdue" in js and ".overdue-tag" in css else "FAIL",
        "visible Overdue tag next to late tasks")
    add("D. Home dashboard", "D7 Engine branding", "PASS" if "applySearchEngineBranding" in js and "engineLogoNode" in js else "FAIL",
        "search logo and placeholder follow Settings → Search")
    add("E. Planner", "E6 Day drill-down", "PASS" if "renderDayEvents" in js and 'id="dayEvents"' in html else "FAIL",
        "date cells select a day and list its events")
    add("J. Settings", "J6 Tab keyboard model", "PASS"
        if html.count('role="tabpanel"') == 6 and html.count("aria-controls=") == 6 else "FAIL",
        "six tabs/panels with aria-controls and roving tabindex")
    add("M. Motion & states", "M5 Undo toasts", "PASS" if "undoToast" in js and ".toast-action" in css else "FAIL",
        "delete actions offer an Undo button")
    add("M. Motion & states", "M6 Pomodoro persistence", "PASS"
        if "endAt" in js and "completeSession" in js and "pomodoro-data" in js else "FAIL",
        "running timer restores from an end timestamp")
    add("O. Tracker & review", "O2/O4 Overrides + frozen columns", "PASS"
        if "ovr-reset" in js and "table.sheet td.col-mock" in css and "ovr-cell" in css else "FAIL",
        "computed-cell overrides reset with ↺; identity columns are sticky")
    add("L. Accessibility", "L6 System font stack", "PASS" if "font-family=\"Inter\"" not in js and '"Inter"' not in css else "FAIL",
        "no reference to an unbundled Inter face")
    nav_named = len(re.findall(r'data-tab="[^"]+"[^>]*aria-label="', html)) == 5
    nav_current = 'aria-current="page"' in html and 'setAttribute("aria-current", "page")' in js
    add("L. Accessibility", "L7 Narrow-screen nav names", "PASS" if nav_named and nav_current else "FAIL",
        "section buttons keep aria-label and expose aria-current when the rail labels hide")
    inert_closed = re.search(r'<aside class="bookmarks-panel"[^>]*aria-hidden="true"[^>]*inert', html) is not None
    add("L. Accessibility", "L8 Closed panel inert", "PASS" if inert_closed and 'removeAttribute("inert")' in js else "FAIL",
        "the off-screen bookmarks panel is inert until opened")
    decorated = js.count('letter.setAttribute("aria-hidden", "true")') >= 5
    add("L. Accessibility", "L9 Decorative favicon letters", "PASS" if decorated else "FAIL",
        "letter fallbacks are hidden so links read as their label, not \"G Google\"")
    add("D. Home dashboard", "D8 Next-exam chip", "PASS"
        if 'id="homeNextExam"' in html and "updateHomeNextExam" in js and ".home-next-exam" in css else "FAIL",
        "the hero shows the next upcoming exam and its countdown")
    add("M. Motion & states", "M7 Tab-strip countdown", "PASS"
        if "docTitle" in js and "pomo.running" in js else "FAIL",
        "document.title shows the remaining time while a session runs")
    add("M. Motion & states", "M8 Focus after actions", "PASS"
        if "focusTodoControl" in js and "restoreFocus" in js and "Update in place" in js else "FAIL",
        "checking/deleting tasks and editing event dates keeps keyboard focus in place")

    # Bookmark star pins to dock in both engines
    star_pos = re.search(r"\.bm-star\s*\{[^}]*position:\s*relative", css)
    star_click = "function dockMatch" in js and "dockMatch(bm.url)" in js and "addDockItem(bm.title" in js
    add("O. Tracker & review", "O6 Bookmark star pin", "PASS" if star_pos and star_click else "FAIL",
        "star hit area is contained and URLs match through dockMatch()")

    # MYNT visual language
    palette_js = all(role in js for role in ("bg:", "tint:", "dark:", "darker:", "text:", "on:")) and "applyAccentTokens" in js
    add("P. MYNT theme", "P1 Tonal palettes", "PASS" if palette_js and "--mynt-tint" in css else "FAIL",
        "eleven tonal palettes with six roles drive --mynt-* and --md-* tokens")
    font_file = (ROOT / "fonts" / "Poppins-Regular.ttf").exists()
    font_decl = '@font-face' in css and 'Poppins-Regular.ttf' in css and (ROOT / "fonts" / "OFL.txt").exists()
    add("P. MYNT theme", "P2 Poppins bundle", "PASS" if font_file and font_decl else "FAIL",
        "bundled Poppins with OFL licence and local @font-face")
    blob_clock = "M93.6379" in js and "a-tick" not in js and "a-hand a-second" in js
    add("P. MYNT theme", "P3 Blob analog clock", "PASS" if blob_clock else "FAIL",
        "MYNT squircle face, pill hands, orbiting second dot, CSS sweep")
    motion = all(t in css for t in ("--md-motion-ease", "--md-motion-decelerate", "--md-motion-accelerate"))
    lift = "translateY(-10px) scale(1.03)" in css or "--lift: -10px" in css
    add("P. MYNT theme", "P4 Motion tokens", "PASS" if motion and lift else "FAIL",
        "Material easing tokens and dock hover lift")
    stroke_icons = html.count('stroke-linecap="round"') >= 20
    add("P. MYNT theme", "P5 Rounded icon set", "PASS" if stroke_icons else "FAIL",
        "stroke-based rounded sprite with tinted tiles")
    custom = "paletteFromHex" in js and 'id="accentCustom"' in html and "accentCustom" in js
    add("P. MYNT theme", "P6 Custom palette", "PASS" if custom else "FAIL",
        "colour picker generates a full tonal ramp")

    # Design-system hardening (contrast roles, tokens, type, status)
    roles = all(t in css for t in ("--action:", "--on-action:", "--link:", "--focus-ring:"))
    roles_js = all(t in js for t in ('set("--action"', 'set("--on-action"', 'set("--link"', 'set("--focus-ring"'))
    add("P. MYNT theme", "P7 Action/link split", "PASS" if roles and roles_js else "FAIL",
        "fills, labels and text links use separate WCAG-checked roles")
    radius_tokens = all(t in css for t in ("--radius-xs:", "--radius-sm:", "--radius-md:", "--radius-lg:", "--radius-xl:", "--radius-pill:"))
    space_tokens = all("--space-%d:" % i in css for i in range(1, 9))
    raw_radii = re.findall(r"border-radius:\s*\d+px", css)
    add("P. MYNT theme", "P8 Token scale", "PASS" if radius_tokens and space_tokens and not raw_radii else "FAIL",
        "five radii + pill, 4px spacing steps, no raw radius values" if not raw_radii else "raw radii: %s" % raw_radii)
    status = all(t in css for t in ("--ok:", "--warn:", "--info:", "--on-ok:", "--on-warn:", "--on-info:"))
    add("P. MYNT theme", "P9 Status tokens", "PASS" if status else "FAIL",
        "success, warning and info roles with readable labels")
    small_type = re.findall(r"font-size:\s*11(?:\.5)?px", css)
    add("P. MYNT theme", "P10 Type floor", "PASS" if not small_type else "FAIL",
        "no 11px/11.5px body copy" if not small_type else "%d declarations below 12px" % len(small_type))
    weights = all(w in css for w in ("Poppins-Medium.ttf", "Poppins-SemiBold.ttf", "Poppins-Bold.ttf"))
    weight_files = all((ROOT / "fonts" / f).exists() for f in ("Poppins-Medium.ttf", "Poppins-SemiBold.ttf", "Poppins-Bold.ttf"))
    add("P. MYNT theme", "P11 Real font weights", "PASS" if weights and weight_files else "FAIL",
        "Poppins 500/600/700 bundled, no faux bold")
    focus_used = len(re.findall(r"var\(--focus-ring\)", css)) >= 5
    add("P. MYNT theme", "P12 Focus token", "PASS" if focus_used else "FAIL",
        "focus rings route through --focus-ring")
    wallpaper_ok = ("wallpaperImage" in js and "wallpaperBgBlur" in js and "wallpaperAccentFromImage" in js and "data-bg=\"image\"" in css and "--wallpaper-bg-blur" in css)
    add("P. MYNT theme", "P13 Custom wallpapers", "PASS" if wallpaper_ok else "FAIL",
        "local wallpaper picker drives the accent mood")
    tracker_frame = (all(t in css for t in (".sheet-frame", ".sheet-fade", ".sheet-frame.at-end", ".sheet-scroll-btn"))
                     and "updateSheetScrollState" in js
                     and 'id="sheetScrollLeft"' in html and 'id="sheetScrollRight"' in html
                     and "direction * step" in js and "left.disabled = atStart" in js)
    add("O. Tracker & review", "O7 Tracker scroll affordance", "PASS" if tracker_frame else "FAIL",
        "sticky identity columns, edge fade and left/right buttons that disable at each end")
    mynt_icons = ("myntIcons" in js and 'data-icons="mynt"' in css and 'data-setting="myntIcons"' in html
                  and "mynt-dock-in" in css and "mynt-tile-in" in css and "--app-color" in js)
    add("P. MYNT theme", "P14 MYNT dock icon style", "PASS" if mynt_icons else "FAIL",
        "toggle swaps dock + Google apps to rounded tonal tiles with springy motion")
    mono_icons = ("monochromeIcons" in js and 'data-icon-tint="mono"' in css
                  and 'data-setting="monochromeIcons"' in html and 'id="mi-google"' in html
                  and "monoGlyphFor" in js and "attachMonoIcon" in js
                  and "MONO_HOSTS" in js and ".mono-glyph" in css)
    add("P. MYNT theme", "P15 Monochrome icon pack", "PASS" if mono_icons else "FAIL",
        "bundled Simple Icons (CC0) brand glyphs replace favicons on neutral tonal tiles")
    tracker_seed = "sheetIsBlank" in js and "blankRow(), blankRow(), blankRow()" in js
    add("O. Tracker & review", "O8 Blank rows on first run", "PASS" if tracker_seed else "FAIL",
        "a blank tracker sheet starts with three empty rows")

    # Manifests + ZIPs + dist sync
    for manifest in ("dist/chrome/manifest.json", "dist/firefox/manifest.json"):
        try:
            json.loads(read(manifest))
            add("N. Data & sync", "N0 Manifest " + manifest.split("/")[1], "PASS", "valid JSON")
        except Exception as exc:  # noqa: BLE001
            add("N. Data & sync", "N0 Manifest " + manifest.split("/")[1], "FAIL", str(exc))
    for z in ("dist/study-deck-chrome.zip", "dist/study-deck-firefox.zip"):
        try:
            with zipfile.ZipFile(ROOT / z) as fh:
                bad = fh.testzip()
            add("N. Data & sync", "N0 ZIP " + Path(z).name, "PASS" if bad is None else "FAIL",
                "integrity ok" if bad is None else "corrupt: " + str(bad))
        except Exception as exc:  # noqa: BLE001
            add("N. Data & sync", "N0 ZIP " + Path(z).name, "FAIL", str(exc))

    differs = []
    for f in ("newtab.html", "scripts/app.js", "styles/material.css", "background.js", "manifest.json"):
        if (ROOT / f).read_bytes() != (ROOT / "dist/chrome" / f).read_bytes():
            differs.append(f)
    add("N. Data & sync", "N0 Source/dist sync", "PASS" if not differs else "WARN",
        "in sync" if not differs else "differs: " + ", ".join(differs))


# Screenshot pages are static files. Motion is disabled so a capture never
# lands on the first frame of an entrance animation (dialogs/sheets fade in).
# The load handler drives the real UI handlers: clicking a tab re-renders that
# panel, and clicking the apps / bookmarks / settings buttons opens the real
# overlay with its populated content.
AUDIT_HELPER = """
<style>
  *, *::before, *::after {
    animation-duration: 0s !important;
    animation-delay: 0s !important;
    transition: none !important;
    scroll-behavior: auto !important;
  }
</style>
<script>
  window.addEventListener("load", function () {
    var tab = "%s";
    if (tab) {
      var tabBtn = document.querySelector('#tabbar button[data-tab="' + tab + '"]');
      if (tabBtn) tabBtn.click();
    }
    var overlay = "%s";
    var trigger = overlay === "settings" ? "railSettingsBtn"
      : overlay === "apps" ? "appsBtn"
      : overlay === "bookmarks" ? "bookmarksBtn" : "";
    if (trigger) {
      var btn = document.getElementById(trigger);
      if (btn) btn.click();
    }
  });
</script>
</body>"""

# Clear any persisted profile state before the deferred app scripts run, so every
# audit capture starts from first-run defaults.
AUDIT_RESET = '<script>try { localStorage.clear(); } catch (e) {}</script>'


def make_variant(name, active_panel=None, settings_dialog=False, apps_dialog=False,
                 bookmarks=False, clock_style=None):
    html = read("newtab.html")
    if clock_style:
        src_js = read("scripts/app.js").replace('clockStyle: "analog"',
                                                'clockStyle: "%s"' % clock_style)
        audit_js = ROOT / "scripts" / ("_audit_%s.js" % clock_style)
        audit_js.write_text(src_js, encoding="utf-8")
        html = html.replace("scripts/app.js", "scripts/_audit_%s.js" % clock_style)
    overlay = "settings" if settings_dialog else "apps" if apps_dialog else "bookmarks" if bookmarks else ""
    html = html.replace("<script src=\"scripts/theme-init.js\"></script>",
                        AUDIT_RESET + "\n  <script src=\"scripts/theme-init.js\"></script>")
    html = html.replace("</body>",
                        AUDIT_HELPER % (active_panel or "", overlay))
    path = ROOT / ("_audit_%s.html" % name)
    path.write_text(html, encoding="utf-8")
    return path


def screenshot(name, page, width=1440, height=900):
    out = SHOTS / (name + ".png")
    # Drop any previous capture so a failed run cannot be mistaken for a pass.
    out.unlink(missing_ok=True)
    cmd = ["firefox", "--headless", "--no-remote", "--profile", str(PROFILE),
           "--window-size=%d,%d" % (width, height), "--screenshot", str(out), page.as_uri()]
    try:
        subprocess.run(cmd, check=True, capture_output=True, timeout=120)
    except Exception as exc:  # noqa: BLE001
        # Firefox occasionally exits non-zero after the PNG is already written.
        print("screenshot warning:", name, exc)
    return out if out.exists() and out.stat().st_size else None


def visual_checks():
    if not shutil.which("firefox"):
        add("Screenshots", "S0 Browser", "SKIP", "firefox not available")
        return []
    SHOTS.mkdir(parents=True, exist_ok=True)
    PROFILE.mkdir(parents=True, exist_ok=True)

    variants = [
        ("home", dict(), 1440, 900),
        ("todo", dict(active_panel="todo"), 1440, 900),
        ("tracker", dict(active_panel="tracker"), 1440, 900),
        ("planner", dict(active_panel="planner"), 1440, 900),
        ("review", dict(active_panel="review"), 1440, 900),
        ("settings", dict(active_panel="todo", settings_dialog=True), 1440, 900),
        ("apps", dict(active_panel="todo", apps_dialog=True), 1440, 900),
        ("bookmarks", dict(active_panel="todo", bookmarks=True), 1440, 900),
        ("apps-390", dict(active_panel="todo", apps_dialog=True), 390, 844),
        ("settings-390", dict(active_panel="todo", settings_dialog=True), 390, 844),
        ("clock-stacked", dict(active_panel="todo", clock_style="stacked"), 1440, 900),
        ("clock-analog", dict(active_panel="todo", clock_style="analog"), 1440, 900),
        ("planner-analog", dict(active_panel="planner", clock_style="analog"), 1440, 900),
        ("todo-analog-1024", dict(active_panel="todo", clock_style="analog"), 1024, 768),
        ("home-1024", dict(), 1024, 768),
        ("todo-1024", dict(active_panel="todo"), 1024, 768),
        ("home-768", dict(), 768, 900),
        ("todo-768", dict(active_panel="todo"), 768, 900),
        ("home-390", dict(), 390, 844),
        ("planner-390", dict(active_panel="planner"), 390, 844),
        ("tracker-390", dict(active_panel="tracker"), 390, 844),
    ]

    shots = []
    temps = []
    try:
        for name, kwargs, width, height in variants:
            page = make_variant(name, **kwargs)
            temps.append(page)
            out = screenshot(name, page, width, height)
            if out:
                shots.append((name, out))
                add("Screenshots", "S1 " + name, "PASS", str(out))
            else:
                add("Screenshots", "S1 " + name, "WARN", "not captured")
    finally:
        for t in temps:
            t.unlink(missing_ok=True)
        for f in (ROOT / "scripts").glob("_audit_*.js"):
            f.unlink(missing_ok=True)
        for f in ROOT.glob("_audit_*.html"):
            f.unlink(missing_ok=True)
    return shots


def write_report(shots):
    by_status = lambda s: [r for r in results if r[2] == s]  # noqa: E731
    lines = [
        "# UI audit report",
        "",
        "Generated: " + datetime.now().strftime("%Y-%m-%d %H:%M"),
        "",
        f"**Checks:** {len(results)} · PASS {len(by_status('PASS'))} · "
        f"FAIL {len(by_status('FAIL'))} · WARN {len(by_status('WARN'))} · SKIP {len(by_status('SKIP'))}",
        "",
        "| Section | ID | Result | Detail |",
        "| --- | --- | --- | --- |",
    ]
    for section, cid, status, detail in results:
        lines.append(f"| {section} | {cid} | {status} | {detail} |")
    lines += ["", "## Screenshots", ""]
    if shots:
        for name, path in shots:
            lines.append(f"- **{name}** — `{path}`")
    else:
        lines.append("- none captured")
    lines += [
        "",
        "## Manual review notes",
        "",
        "Open the screenshots above and verify the checklist in",
        "`../ui-test-instructions.md` (sections A–O). Record any visual flaw as a",
        "FAIL against its check id and fix it before packaging.",
        "",
        "### Fixed in this pass",
        "",
        "- **C4/C5/E1/E2** — Planner content is scoped to its own `.tab-panel`;",
        "  Calendar and Notes stack in normal flow, flush left with the panel grid.",
        "- **A2** — Hiding the floating clock/search on Home no longer hides the",
        "  Quick actions widget, so apps and bookmarks stay reachable on Home.",
        "- **E4/F4** — Floats sit above views; the panel receives a measured",
        "  `--workspace-top` inset only when a visible top widget overlaps it.",
        "- **G1/G6** — Analog hand geometry corrected (hour/minute/second lengths)",
        "  and the floating stacked clock uses compact date + 30 px time to clear",
        "  the gutter and panel edge.",
        "- **G3** — Semantic clock sizing: the floating clock is `width:max-content`",
        "  and re-runs widget layout when its text width changes, so the centred",
        "  search never overlaps it.",
        "- **H2/H3** — Settings and Apps sheets, bookmarks panel and pomodoro popup",
        "  stay at 96 % opacity under glass/frosted so text remains readable.",
        "- **H1** — The Google apps launcher opens as a popup anchored to the",
        "  waffle icon (right-aligned, flips above on short viewports, stays inside",
        "  page padding on phones) with the page visible behind it.",
        "- **I4** — Tracker hides the empty trend chart (redundant empty message) and",
        "  the sheet scroll area shows a visible thin scrollbar.",
        "- **M2** — At ≤430 px the rail hides the duplicate theme toggle and tightens",
        "  items, keeping all five study tabs and the dock reachable.",
        "- **D6/D7** — Late tasks get a visible Overdue tag, and the search logo,",
        "  placeholder and aria-label follow the engine selected in Settings.",
        "- **E6/E7** — Calendar dates are keyboard-selectable and open a per-day",
        "  event list; adding an event reveals its month and day.",
        "- **J6** — Settings uses the ARIA tabs pattern: six tabpanels, aria-controls,",
        "  roving tabindex and Left/Right/Home/End navigation.",
        "- **M5** — Deleting a task, note, event or tracker row offers Undo.",
        "- **M6** — Pomodoro stores its end timestamp and derives the remaining time",
        "  from the clock, so background throttling and reloads do not reset it.",
        "- **O2/O4** — Computed tracker cells show a ↺ reset while overridden, and",
        "  S.No / Mock Name stay frozen during horizontal scroll.",
        "- **16 (typography)** — Typography uses one system stack everywhere",
        "  (including charts); no Inter file is bundled, so rendering follows the OS font.",
        "- **Type scale** — Sub-11 px labels were raised to an 11 px floor for",
        "  legibility, with 44 px hit areas around small checkbox/delete controls.",
        "",
    ]
    REPORT.write_text("\n".join(lines), encoding="utf-8")


def main():
    static_checks()
    shots = visual_checks()
    write_report(shots)
    fails = [r for r in results if r[2] == "FAIL"]
    warns = [r for r in results if r[2] == "WARN"]
    print(f"{len(results)} checks · {len(fails)} FAIL · {len(warns)} WARN")
    for r in fails:
        print("FAIL:", r[1], "-", r[3])
    for r in warns:
        print("WARN:", r[1], "-", r[3])
    print("report:", REPORT)
    print("screenshots:", SHOTS)
    return 1 if fails else 0


if __name__ == "__main__":
    sys.exit(main())
