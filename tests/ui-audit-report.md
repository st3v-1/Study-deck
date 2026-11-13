# UI audit report

Generated: 2026-11-13 10:44

**Checks:** 63 · PASS 63 · FAIL 0 · WARN 0 · SKIP 0

| Section | ID | Result | Detail |
| --- | --- | --- | --- |
| A. App shell | A0 HTML structure | PASS | balanced |
| C. Tab isolation | C5 Tab/panel wiring | PASS | tabs=['home', 'todo', 'tracker', 'planner', 'review'] panels=['home', 'todo', 'tracker', 'planner', 'review'] |
| C. Tab isolation | C4 Scoped panel display | PASS | planner display is active-scoped |
| C. Tab isolation | C2 Home has no planner content | PASS | planner panel lives in its own .tab-panel; only .active is displayed |
| E. Planner | E1/E2 Stacked + aligned | PASS | planner panels stack in normal flow |
| L. Accessibility | L0 Unique IDs | PASS | no duplicates |
| L. Accessibility | L1 Control names | PASS | all buttons named |
| L. Accessibility | L3 h1 per panel | PASS | all panels have h1 |
| J. Settings | J3/J4 No dead drag UI | PASS | clean |
| A. App shell | A6 CSS balance | PASS | braces 792 / 792 |
| A. App shell | A7 JS balance | PASS | balanced |
| H. Google apps popup | H1 Anchored popup | PASS | anchored to #appsBtn with a transparent backdrop |
| D. Home dashboard | D6 Overdue tag | PASS | visible Overdue tag next to late tasks |
| D. Home dashboard | D7 Engine branding | PASS | search logo and placeholder follow Settings → Search |
| E. Planner | E6 Day drill-down | PASS | date cells select a day and list its events |
| J. Settings | J6 Tab keyboard model | PASS | six tabs/panels with aria-controls and roving tabindex |
| M. Motion & states | M5 Undo toasts | PASS | delete actions offer an Undo button |
| M. Motion & states | M6 Pomodoro persistence | PASS | running timer restores from an end timestamp |
| O. Tracker & review | O2/O4 Overrides + frozen columns | PASS | computed-cell overrides reset with ↺; identity columns are sticky |
| L. Accessibility | L6 System font stack | PASS | no reference to an unbundled Inter face |
| O. Tracker & review | O6 Bookmark star pin | PASS | star hit area is contained and URLs match through dockMatch() |
| P. MYNT theme | P1 Tonal palettes | PASS | eleven tonal palettes with six roles drive --mynt-* and --md-* tokens |
| P. MYNT theme | P2 Poppins bundle | PASS | bundled Poppins with OFL licence and local @font-face |
| P. MYNT theme | P3 Blob analog clock | PASS | MYNT squircle face, pill hands, orbiting second dot, CSS sweep |
| P. MYNT theme | P4 Motion tokens | PASS | Material easing tokens and dock hover lift |
| P. MYNT theme | P5 Rounded icon set | PASS | stroke-based rounded sprite with tinted tiles |
| P. MYNT theme | P6 Custom palette | PASS | colour picker generates a full tonal ramp |
| P. MYNT theme | P7 Action/link split | PASS | fills, labels and text links use separate WCAG-checked roles |
| P. MYNT theme | P8 Token scale | PASS | five radii + pill, 4px spacing steps, no raw radius values |
| P. MYNT theme | P9 Status tokens | PASS | success, warning and info roles with readable labels |
| P. MYNT theme | P10 Type floor | PASS | no 11px/11.5px body copy |
| P. MYNT theme | P11 Real font weights | PASS | Poppins 500/600/700 bundled, no faux bold |
| P. MYNT theme | P12 Focus token | PASS | focus rings route through --focus-ring |
| P. MYNT theme | P13 Custom wallpapers | PASS | local wallpaper picker drives the accent mood |
| O. Tracker & review | O7 Tracker scroll affordance | PASS | sticky identity columns, edge fade and a working Scroll → button |
| P. MYNT theme | P14 MYNT dock icon style | PASS | toggle swaps dock + Google apps to rounded tonal tiles with springy motion |
| P. MYNT theme | P15 Monochrome icons | PASS | favicons render as single-colour glyphs that follow the theme |
| O. Tracker & review | O8 Blank rows on first run | PASS | a blank tracker sheet starts with three empty rows |
| N. Data & sync | N0 Manifest chrome | PASS | valid JSON |
| N. Data & sync | N0 Manifest firefox | PASS | valid JSON |
| N. Data & sync | N0 ZIP study-deck-chrome.zip | PASS | integrity ok |
| N. Data & sync | N0 ZIP study-deck-firefox.zip | PASS | integrity ok |
| N. Data & sync | N0 Source/dist sync | PASS | in sync |
| Screenshots | S1 home | PASS | /tmp/opencode/ui-audit/home.png |
| Screenshots | S1 todo | PASS | /tmp/opencode/ui-audit/todo.png |
| Screenshots | S1 tracker | PASS | /tmp/opencode/ui-audit/tracker.png |
| Screenshots | S1 planner | PASS | /tmp/opencode/ui-audit/planner.png |
| Screenshots | S1 review | PASS | /tmp/opencode/ui-audit/review.png |
| Screenshots | S1 settings | PASS | /tmp/opencode/ui-audit/settings.png |
| Screenshots | S1 apps | PASS | /tmp/opencode/ui-audit/apps.png |
| Screenshots | S1 bookmarks | PASS | /tmp/opencode/ui-audit/bookmarks.png |
| Screenshots | S1 apps-390 | PASS | /tmp/opencode/ui-audit/apps-390.png |
| Screenshots | S1 settings-390 | PASS | /tmp/opencode/ui-audit/settings-390.png |
| Screenshots | S1 clock-stacked | PASS | /tmp/opencode/ui-audit/clock-stacked.png |
| Screenshots | S1 clock-analog | PASS | /tmp/opencode/ui-audit/clock-analog.png |
| Screenshots | S1 planner-analog | PASS | /tmp/opencode/ui-audit/planner-analog.png |
| Screenshots | S1 todo-analog-1024 | PASS | /tmp/opencode/ui-audit/todo-analog-1024.png |
| Screenshots | S1 home-1024 | PASS | /tmp/opencode/ui-audit/home-1024.png |
| Screenshots | S1 todo-1024 | PASS | /tmp/opencode/ui-audit/todo-1024.png |
| Screenshots | S1 home-768 | PASS | /tmp/opencode/ui-audit/home-768.png |
| Screenshots | S1 todo-768 | PASS | /tmp/opencode/ui-audit/todo-768.png |
| Screenshots | S1 home-390 | PASS | /tmp/opencode/ui-audit/home-390.png |
| Screenshots | S1 planner-390 | PASS | /tmp/opencode/ui-audit/planner-390.png |

## Screenshots

- **home** — `/tmp/opencode/ui-audit/home.png`
- **todo** — `/tmp/opencode/ui-audit/todo.png`
- **tracker** — `/tmp/opencode/ui-audit/tracker.png`
- **planner** — `/tmp/opencode/ui-audit/planner.png`
- **review** — `/tmp/opencode/ui-audit/review.png`
- **settings** — `/tmp/opencode/ui-audit/settings.png`
- **apps** — `/tmp/opencode/ui-audit/apps.png`
- **bookmarks** — `/tmp/opencode/ui-audit/bookmarks.png`
- **apps-390** — `/tmp/opencode/ui-audit/apps-390.png`
- **settings-390** — `/tmp/opencode/ui-audit/settings-390.png`
- **clock-stacked** — `/tmp/opencode/ui-audit/clock-stacked.png`
- **clock-analog** — `/tmp/opencode/ui-audit/clock-analog.png`
- **planner-analog** — `/tmp/opencode/ui-audit/planner-analog.png`
- **todo-analog-1024** — `/tmp/opencode/ui-audit/todo-analog-1024.png`
- **home-1024** — `/tmp/opencode/ui-audit/home-1024.png`
- **todo-1024** — `/tmp/opencode/ui-audit/todo-1024.png`
- **home-768** — `/tmp/opencode/ui-audit/home-768.png`
- **todo-768** — `/tmp/opencode/ui-audit/todo-768.png`
- **home-390** — `/tmp/opencode/ui-audit/home-390.png`
- **planner-390** — `/tmp/opencode/ui-audit/planner-390.png`

## Manual review notes

Open the screenshots above and verify the checklist in
`../ui-test-instructions.md` (sections A–O). Record any visual flaw as a
FAIL against its check id and fix it before packaging.

### Fixed in this pass

- **C4/C5/E1/E2** — Planner content is scoped to its own `.tab-panel`;
  Calendar and Notes stack in normal flow, flush left with the panel grid.
- **A2** — Hiding the floating clock/search on Home no longer hides the
  Quick actions widget, so apps and bookmarks stay reachable on Home.
- **E4/F4** — Floats sit above views; the panel receives a measured
  `--workspace-top` inset only when a visible top widget overlaps it.
- **G1/G6** — Analog hand geometry corrected (hour/minute/second lengths)
  and the floating stacked clock uses compact date + 30 px time to clear
  the gutter and panel edge.
- **G3** — Semantic clock sizing: the floating clock is `width:max-content`
  and re-runs widget layout when its text width changes, so the centred
  search never overlaps it.
- **H2/H3** — Settings and Apps sheets, bookmarks panel and pomodoro popup
  stay at 96 % opacity under glass/frosted so text remains readable.
- **H1** — The Google apps launcher opens as a popup anchored to the
  waffle icon (right-aligned, flips above on short viewports, stays inside
  page padding on phones) with the page visible behind it.
- **I4** — Tracker hides the empty trend chart (redundant empty message) and
  the sheet scroll area shows a visible thin scrollbar.
- **M2** — At ≤430 px the rail hides the duplicate theme toggle and tightens
  items, keeping all five study tabs and the dock reachable.
- **D6/D7** — Late tasks get a visible Overdue tag, and the search logo,
  placeholder and aria-label follow the engine selected in Settings.
- **E6/E7** — Calendar dates are keyboard-selectable and open a per-day
  event list; adding an event reveals its month and day.
- **J6** — Settings uses the ARIA tabs pattern: six tabpanels, aria-controls,
  roving tabindex and Left/Right/Home/End navigation.
- **M5** — Deleting a task, note, event or tracker row offers Undo.
- **M6** — Pomodoro stores its end timestamp and derives the remaining time
  from the clock, so background throttling and reloads do not reset it.
- **O2/O4** — Computed tracker cells show a ↺ reset while overridden, and
  S.No / Mock Name stay frozen during horizontal scroll.
- **16 (typography)** — Typography uses one system stack everywhere
  (including charts); no Inter file is bundled, so rendering follows the OS font.
- **Type scale** — Sub-11 px labels were raised to an 11 px floor for
  legibility, with 44 px hit areas around small checkbox/delete controls.
