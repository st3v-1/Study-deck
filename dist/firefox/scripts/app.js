/* ==================================================================
   Study Deck — application logic
   ================================================================== */
(function () {
  "use strict";

  /* ---------------- constants ---------------- */

  const DEFAULT_SETTINGS = {
    theme: "system",
    accent: "purple",
    background: "gradient",
    animations: true,
    compact: false,
    showClock: true,
    showSearch: true,
    showPomodoro: true,
    showBookmarksBtn: true,
    showAppsBtn: true,
    showDock: true,
    engine: "google",
    searchNewTab: true,
    dockMagnify: true,
    dockNewTab: true,
    dockSize: 58,
    clockStyle: "digital",
    clockSeconds: true,
    clockShowDate: true,
    widgetDrag: true,
    widgetSnap: true,
    widgetPositions: {
      clock: { ax: "left", ay: "top" },
      search: { ax: "center", ay: "top" },
      actions: { ax: "right", ay: "top" },
      dock: { ax: "center", ay: "bottom" }
    },
    surfaceStyle: "glass",
    glassStrength: 62,
    glassGlow: true,
    homeName: "",
    homeLayout: "split",
    hideWidgetsOnHome: true,
    showHomeGreeting: true,
    showHomeClock: true,
    showHomeSearch: true,
    showHomeQuick: true,
    showHomeTasks: true,
    showHomeFocus: true,
    syncEnabled: true
  };

  const CLOCK_STYLES = {
    digital: { name: "Digital" },
    stacked: { name: "Stacked" },
    minimal: { name: "Minimal" },
    analog: { name: "Analog" },
    chip: { name: "Chip" }
  };

  const WIDGETS = [
    { key: "clock", name: "Clock" },
    { key: "search", name: "Search" },
    { key: "actions", name: "Quick actions" },
    { key: "dock", name: "Favourites" }
  ];

  function defaultWidgetPositions() {
    return {
      clock: { ax: "left", ay: "top" },
      search: { ax: "center", ay: "top" },
      actions: { ax: "right", ay: "top" },
      dock: { ax: "center", ay: "bottom" }
    };
  }

  const ACCENTS = {
    purple: { name: "Purple", h: 259, s: 55, swatch: "#6750A4" },
    blue: { name: "Blue", h: 215, s: 68, swatch: "#1A73E8" },
    teal: { name: "Teal", h: 174, s: 48, swatch: "#00897B" },
    green: { name: "Green", h: 145, s: 42, swatch: "#2E7D32" },
    orange: { name: "Orange", h: 26, s: 82, swatch: "#E8710A" },
    pink: { name: "Pink", h: 333, s: 58, swatch: "#C2185B" },
    red: { name: "Red", h: 356, s: 62, swatch: "#C5221F" },
    yellow: { name: "Yellow", h: 44, s: 85, swatch: "#F9AB00" }
  };

  const ENGINES = {
    google: { name: "Google", url: "https://www.google.com/search?q=" },
    bing: { name: "Bing", url: "https://www.bing.com/search?q=" },
    duckduckgo: { name: "DuckDuckGo", url: "https://duckduckgo.com/?q=" },
    brave: { name: "Brave Search", url: "https://search.brave.com/search?q=" },
    ecosia: { name: "Ecosia", url: "https://www.ecosia.org/search?q=" },
    youtube: { name: "YouTube", url: "https://www.youtube.com/results?search_query=" }
  };

  const GOOGLE_APPS = [
    { name: "Search", url: "https://www.google.com", color: "#4285F4", letter: "G" },
    { name: "Gmail", url: "https://mail.google.com", color: "#EA4335", letter: "M" },
    { name: "Images", url: "https://images.google.com", color: "#34A853", letter: "I" },
    { name: "Drive", url: "https://drive.google.com", color: "#0F9D58", letter: "D" },
    { name: "Docs", url: "https://docs.google.com", color: "#4285F4", letter: "D" },
    { name: "Sheets", url: "https://sheets.google.com", color: "#0F9D58", letter: "S" },
    { name: "Slides", url: "https://slides.google.com", color: "#F4B400", letter: "S" },
    { name: "Calendar", url: "https://calendar.google.com", color: "#4285F4", letter: "31" },
    { name: "Keep", url: "https://keep.google.com", color: "#FBBC04", letter: "K" },
    { name: "Maps", url: "https://maps.google.com", color: "#34A853", letter: "M" },
    { name: "YouTube", url: "https://www.youtube.com", color: "#FF0000", letter: "▶" },
    { name: "Photos", url: "https://photos.google.com", color: "#4285F4", letter: "P" },
    { name: "Meet", url: "https://meet.google.com", color: "#00897B", letter: "M" },
    { name: "Classroom", url: "https://classroom.google.com", color: "#0F9D58", letter: "C" },
    { name: "Tasks", url: "https://tasks.google.com", color: "#4285F4", letter: "✓" },
    { name: "Translate", url: "https://translate.google.com", color: "#4285F4", letter: "T" },
    { name: "Play", url: "https://play.google.com", color: "#01875F", letter: "▶" },
    { name: "Contacts", url: "https://contacts.google.com", color: "#4285F4", letter: "C" }
  ];

  const DEFAULT_DOCK = [
    { title: "Google", url: "https://www.google.com" },
    { title: "Gmail", url: "https://mail.google.com" },
    { title: "Drive", url: "https://drive.google.com" },
    { title: "Docs", url: "https://docs.google.com" },
    { title: "YouTube", url: "https://www.youtube.com" },
    { title: "Calendar", url: "https://calendar.google.com" },
    { title: "Keep", url: "https://keep.google.com" },
    { title: "Maps", url: "https://maps.google.com" }
  ];

  const CATEGORIES = ["PRE", "MAINS", "RRB PRE", "RRB MAINS", "Quiz"];
  const SECTION_DEFS = {
    eng: { plus: "Eng(+)", minus: "Eng(-)", net: "Eng" },
    qnt: { plus: "Qnt(+)", minus: "Qnt(-)", net: "Quant" },
    res: { plus: "Res(+)", minus: "Res(-)", net: "Res" },
    ga: { plus: "GA(+)", minus: "GA(-)", net: "GA" },
    comp: { plus: "Comp(+)", minus: "Comp(-)", net: "Computer" }
  };
  const CATEGORY_SECTIONS = {
    PRE: ["eng", "qnt", "res"],
    MAINS: ["eng", "qnt", "res", "ga", "comp"],
    "RRB PRE": ["qnt", "res"],
    "RRB MAINS": ["eng", "qnt", "res", "ga", "comp"],
    Quiz: ["eng", "qnt", "res"]
  };

  /* ---------------- helpers ---------------- */

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const rootEl = document.documentElement;
  const store = window.StudyStore;

  function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }
  function todayStr() {
    const d = new Date();
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }
  function daysAgoStr(n) {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }
  function escapeHtml(s) {
    return (s || "").replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
  }
  function escapeAttr(s) {
    return (s || "").toString().replace(/"/g, "&quot;");
  }
  function clamp(n, min, max) {
    return Math.min(max, Math.max(min, n));
  }
  function firstLetter(name) {
    const m = (name || "").match(/[a-z0-9]/i);
    return m ? m[0].toUpperCase() : "★";
  }
  function faviconFor(url, size) {
    try {
      const host = new URL(url).hostname;
      return "https://www.google.com/s2/favicons?sz=" + (size || 64) + "&domain=" + encodeURIComponent(host);
    } catch (e) {
      return "";
    }
  }
  function hostOf(url) {
    try { return new URL(url).hostname.replace(/^www\./, ""); } catch (e) { return url; }
  }
  function fmt(n) {
    const v = Math.round(n * 100) / 100;
    return v.toString();
  }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function heatColor(pct) {
    pct = clamp(pct, 0, 100);
    const c1 = [179, 38, 30];
    const c2 = [249, 171, 0];
    const c3 = [46, 125, 50];
    let r, g, b;
    if (pct < 50) {
      const t = pct / 50;
      r = lerp(c1[0], c2[0], t); g = lerp(c1[1], c2[1], t); b = lerp(c1[2], c2[2], t);
    } else {
      const t = (pct - 50) / 50;
      r = lerp(c2[0], c3[0], t); g = lerp(c2[1], c3[1], t); b = lerp(c2[2], c3[2], t);
    }
    return { bg: "rgba(" + (r | 0) + "," + (g | 0) + "," + (b | 0) + ",0.18)", fg: "rgb(" + (r | 0) + "," + (g | 0) + "," + (b | 0) + ")" };
  }

  /* ---------------- state ---------------- */

  let settings = { ...DEFAULT_SETTINGS };
  let dockItems = [];
  let todos = [];
  let notes = [];
  let mockData = {};
  let events = [];
  let pomoLog = [];
  let pomo = { mode: "work", remaining: 25 * 60, running: false, sessionsToday: 0, focusMinsToday: 0, date: todayStr() };
  let durations = { work: 25, short: 5, long: 15 };
  let pomoInterval = null;
  let activeCategory = "PRE";
  let allBookmarks = [];
  let bookmarksLoaded = false;
  let bookmarksError = "";
  let scrimTimer = null;

  const saveTimers = new Map();
  function persist(key, value) {
    store.save(key, value);
  }
  function persistSoon(key, value, delay) {
    clearTimeout(saveTimers.get(key));
    saveTimers.set(key, setTimeout(() => store.save(key, value), delay || 350));
  }

  /* ---------------- settings / theme ---------------- */

  const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");

  function normalizeSettings(saved) {
    const s = Object.assign({}, DEFAULT_SETTINGS, saved && typeof saved === "object" ? saved : {});
    if (!["system", "light", "dark"].includes(s.theme)) s.theme = "system";
    if (!ACCENTS[s.accent]) s.accent = "purple";
    if (!["gradient", "soft", "plain"].includes(s.background)) s.background = "gradient";
    if (!ENGINES[s.engine]) s.engine = "google";
    s.dockSize = clamp(Number(s.dockSize) || 58, 44, 76);
    if (!CLOCK_STYLES[s.clockStyle]) s.clockStyle = "digital";
    if (!["solid", "glass", "frosted"].includes(s.surfaceStyle)) s.surfaceStyle = "glass";
    s.glassStrength = clamp(Number(s.glassStrength) || 62, 20, 100);
    if (!["split", "stack", "compact"].includes(s.homeLayout)) s.homeLayout = "split";
    if (typeof s.homeName !== "string") s.homeName = "";

    const basePositions = defaultWidgetPositions();
    const storedPositions = s.widgetPositions && typeof s.widgetPositions === "object" ? s.widgetPositions : {};
    const positions = {};
    Object.keys(basePositions).forEach((key) => {
      const p = storedPositions[key];
      const base = basePositions[key];
      if (p && p.free && Number.isFinite(p.x) && Number.isFinite(p.y)) {
        positions[key] = { free: true, x: clamp(p.x, 0, 1), y: clamp(p.y, 0, 1) };
      } else {
        positions[key] = {
          ax: p && ["left", "center", "right"].includes(p.ax) ? p.ax : base.ax,
          ay: p && ["top", "mid", "bottom"].includes(p.ay) ? p.ay : base.ay
        };
      }
    });
    s.widgetPositions = positions;
    return s;
  }

  function resolvedTheme() {
    if (settings.theme === "system") return systemTheme.matches ? "dark" : "light";
    return settings.theme;
  }

  function applyAccentTokens() {
    const a = ACCENTS[settings.accent] || ACCENTS.purple;
    const dark = rootEl.getAttribute("data-theme") === "dark";
    const h = a.h;
    const s = a.s;
    const set = (name, value) => rootEl.style.setProperty(name, value);

    if (dark) {
      set("--md-primary", "hsl(" + h + " " + clamp(s + 10, 20, 85) + "% 78%)");
      set("--md-on-primary", "hsl(" + h + " " + clamp(s, 20, 80) + "% 16%)");
      set("--md-primary-container", "hsl(" + h + " " + clamp(s - 12, 12, 70) + "% 32%)");
      set("--md-on-primary-container", "hsl(" + h + " " + clamp(s, 12, 80) + "% 92%)");
      set("--md-secondary", "hsl(" + h + " " + clamp(s - 15, 10, 50) + "% 78%)");
      set("--md-secondary-container", "hsl(" + h + " " + clamp(s - 10, 10, 45) + "% 30%)");
      set("--md-on-secondary-container", "hsl(" + h + " " + clamp(s, 10, 70) + "% 92%)");
      set("--md-tertiary", "hsl(" + ((h + 58) % 360) + " " + clamp(s - 10, 20, 60) + "% 72%)");
      set("--md-tertiary-container", "hsl(" + ((h + 58) % 360) + " " + clamp(s - 18, 15, 50) + "% 30%)");
      set("--md-on-tertiary-container", "hsl(" + ((h + 58) % 360) + " " + clamp(s, 15, 60) + "% 92%)");
    } else {
      set("--md-primary", "hsl(" + h + " " + clamp(s + 5, 20, 85) + "% 40%)");
      set("--md-on-primary", "#ffffff");
      set("--md-primary-container", "hsl(" + h + " " + clamp(s + 15, 25, 90) + "% 90%)");
      set("--md-on-primary-container", "hsl(" + h + " " + clamp(s + 10, 25, 85) + "% 18%)");
      set("--md-secondary", "hsl(" + h + " " + clamp(s - 15, 10, 45) + "% 40%)");
      set("--md-secondary-container", "hsl(" + h + " " + clamp(s, 10, 60) + "% 92%)");
      set("--md-on-secondary-container", "hsl(" + h + " " + clamp(s, 10, 60) + "% 20%)");
      set("--md-tertiary", "hsl(" + ((h + 58) % 360) + " " + clamp(s - 8, 20, 55) + "% 38%)");
      set("--md-tertiary-container", "hsl(" + ((h + 58) % 360) + " " + clamp(s, 20, 60) + "% 92%)");
      set("--md-on-tertiary-container", "hsl(" + ((h + 58) % 360) + " " + clamp(s, 20, 60) + "% 18%)");
    }
    rootEl.setAttribute("data-accent", settings.accent);
  }

  function applyTheme() {
    rootEl.setAttribute("data-theme", resolvedTheme());
    applyAccentTokens();
    const use = $("#themeToggle use");
    if (use) use.setAttribute("href", resolvedTheme() === "dark" ? "#i-moon" : "#i-sun");
  }

  function persistBootTheme() {
    try {
      localStorage.setItem("studyDesk:boot-theme", JSON.stringify({
        theme: resolvedTheme(),
        accent: settings.accent,
        bg: settings.background,
        density: settings.compact ? "compact" : "comfortable",
        motion: settings.animations
      }));
    } catch (e) { /* ignore */ }
  }

  let settingsSaveTimer = null;
  function saveSettings() {
    clearTimeout(settingsSaveTimer);
    settingsSaveTimer = setTimeout(() => {
      store.save("ui-settings", settings);
    }, 300);
  }

  function setWidgetHidden(key, hidden) {
    const widget = $('.widget[data-widget="' + key + '"]');
    if (widget) widget.hidden = hidden;
  }

  function activePanelName() {
    const active = $(".tab-panel.active");
    return active ? active.dataset.panel : "home";
  }

  function applyWidgetVisibility() {
    const hideOnHome = activePanelName() === "home" && settings.hideWidgetsOnHome;
    setWidgetHidden("clock", !settings.showClock || hideOnHome);
    setWidgetHidden("search", !settings.showSearch || hideOnHome);
    setWidgetHidden("dock", !settings.showDock);

    $("#pomoTrigger").hidden = !settings.showPomodoro;
    $("#bookmarksBtn").hidden = !settings.showBookmarksBtn;
    $("#appsBtn").hidden = !settings.showAppsBtn;
    $("#dockWrap").hidden = !settings.showDock;
  }

  function applySurfaceStyle() {
    const style = settings.surfaceStyle || "glass";
    rootEl.setAttribute("data-surface", style);
    rootEl.classList.toggle("no-glass-glow", !settings.glassGlow);

    const t = clamp(settings.glassStrength, 20, 100) / 100;
    const frosted = style === "frosted";
    const alpha = frosted ? 0.55 + (1 - t) * 0.30 : 0.12 + (1 - t) * 0.42;
    const blur = frosted ? 26 + t * 34 : 8 + t * 26;
    const sat = frosted ? 140 + t * 60 : 120 + t * 70;
    rootEl.style.setProperty("--glass-pct", (alpha * 100).toFixed(1) + "%");
    rootEl.style.setProperty("--glass-soft-pct", (Math.min(alpha + 0.16, 0.94) * 100).toFixed(1) + "%");
    rootEl.style.setProperty("--glass-blur", blur.toFixed(1) + "px");
    rootEl.style.setProperty("--glass-sat", sat.toFixed(0) + "%");
  }

  function applySettings() {
    applyTheme();
    rootEl.setAttribute("data-bg", settings.background);
    rootEl.setAttribute("data-density", settings.compact ? "compact" : "comfortable");
    rootEl.setAttribute("data-motion", settings.animations ? "on" : "off");
    rootEl.setAttribute("data-home-layout", settings.homeLayout);
    rootEl.style.setProperty("--dock-size", settings.dockSize + "px");

    applySurfaceStyle();
    applyWidgetVisibility();
    if ($("#dock")) $("#dock").classList.toggle("no-magnify", !settings.dockMagnify);

    syncSettingControls();
    renderClocks();
    renderDock();
    renderHome();
    renderWidgetPositions();
    applyWidgetLayout();
    persistBootTheme();
  }

  function syncSettingControls() {
    $$("[data-setting]").forEach((el) => {
      const key = el.dataset.setting;
      if (!(key in settings)) return;
      if (el.type === "checkbox") el.checked = !!settings[key];
      else el.value = settings[key];
    });

    $$("#themeSeg [data-theme-choice]").forEach((b) => b.classList.toggle("active", b.dataset.themeChoice === settings.theme));
    $$("#bgSeg [data-bg-choice]").forEach((b) => b.classList.toggle("active", b.dataset.bgChoice === settings.background));
    $$("#surfaceSeg [data-surface-choice]").forEach((b) => b.classList.toggle("active", b.dataset.surfaceChoice === settings.surfaceStyle));
    $$("#homeLayoutSeg [data-home-layout]").forEach((b) => b.classList.toggle("active", b.dataset.homeLayout === settings.homeLayout));
    $$(".swatch").forEach((b) => b.classList.toggle("active", b.dataset.accent === settings.accent));
    $$("#clockChoices [data-clock-style]").forEach((b) => b.classList.toggle("active", b.dataset.clockStyle === settings.clockStyle));

    const syncToggle = $("#syncToggle");
    if (syncToggle) {
      syncToggle.checked = !!settings.syncEnabled && store.syncAvailable;
      syncToggle.disabled = !store.syncAvailable;
    }
  }

  function updateSetting(key, value) {
    settings[key] = value;
    applySettings();
    saveSettings();
  }

  /* ---------------- toast ---------------- */

  function showToast(msg) {
    const host = $("#toastHost");
    if (!host) return;
    const el = document.createElement("div");
    el.className = "toast";
    el.innerHTML = "<div>" + msg + "</div><button type=\"button\" class=\"close\" aria-label=\"Dismiss\">&times;</button>";
    el.querySelector(".close").addEventListener("click", () => el.remove());
    host.appendChild(el);
    setTimeout(() => el.remove(), 9000);
  }

  /* ---------------- clock ---------------- */

  function clockDateOptions() {
    return ["analog", "minimal", "chip"].includes(settings.clockStyle)
      ? { weekday: "short", month: "short", day: "numeric" }
      : { weekday: "long", year: "numeric", month: "long", day: "numeric" };
  }

  function analogClockMarkup() {
    let ticks = "";
    for (let i = 0; i < 12; i++) {
      const angle = i * Math.PI / 6;
      const major = i % 3 === 0;
      const r1 = major ? 41 : 45;
      const x1 = 60 + Math.sin(angle) * r1;
      const y1 = 60 - Math.cos(angle) * r1;
      const x2 = 60 + Math.sin(angle) * 50;
      const y2 = 60 - Math.cos(angle) * 50;
      ticks += '<line class="a-tick' + (major ? " major" : "") + '" x1="' + x1.toFixed(1) + '" y1="' + y1.toFixed(1) + '" x2="' + x2.toFixed(1) + '" y2="' + y2.toFixed(1) + '"/>';
    }
    return (
      '<div class="analog-wrap">' +
        '<svg class="analog" viewBox="0 0 120 120" role="img" aria-label="Analog clock">' +
          '<circle class="a-face" cx="60" cy="60" r="56"/>' +
          ticks +
          '<line class="a-hand a-hour" x1="60" y1="60" x2="60" y2="36"/>' +
          '<line class="a-hand a-minute" x1="60" y1="60" x2="60" y2="24"/>' +
          '<line class="a-hand a-second" x1="60" y1="60" x2="60" y2="20"/>' +
          '<circle class="a-pin" cx="60" cy="60" r="3.6"/>' +
        '</svg>' +
      '</div>' +
      (settings.clockShowDate ? '<div class="clock-date">—</div>' : "") +
      '<span class="clock-sr clock-time">—</span>'
    );
  }

  function clockMarkup() {
    if (settings.clockStyle === "analog") return analogClockMarkup();
    if (settings.clockStyle === "stacked") {
      return (
        '<div class="clock-stack">' +
          '<div class="clock-time">—</div>' +
          (settings.clockShowDate ? '<div class="clock-date">—</div>' : "") +
        '</div>'
      );
    }
    if (settings.clockStyle === "minimal") {
      return (
        '<div class="clock-minimal-row">' +
          '<span class="clock-time">—</span>' +
          (settings.clockSeconds ? '<span class="clock-sec">00</span>' : "") +
        '</div>' +
        (settings.clockShowDate ? '<div class="clock-date">—</div>' : "")
      );
    }
    if (settings.clockStyle === "chip") {
      return (
        '<div class="clock-chip">' +
          '<span class="clock-time">—</span>' +
          (settings.clockShowDate ? '<span class="clock-date">—</span>' : "") +
        '</div>'
      );
    }
    return (
      '<div class="clock-time">—</div>' +
      (settings.clockShowDate ? '<div class="clock-date">—</div>' : "")
    );
  }

  function renderClockInto(block) {
    if (!block) return;
    block.dataset.style = settings.clockStyle;
    block.classList.toggle("no-seconds", !settings.clockSeconds);
    block.innerHTML = clockMarkup();
    updateClockElement(block);
  }

  function renderClocks() {
    renderClockInto($("#clockBlock"));
    renderClockInto($("#homeClock"));
  }

  function updateClockElement(block) {
    if (!block) return;
    const d = new Date();
    const withSeconds = !!settings.clockSeconds;
    const timeText = d.toLocaleTimeString("en-US", withSeconds
      ? { hour: "2-digit", minute: "2-digit", second: "2-digit" }
      : { hour: "2-digit", minute: "2-digit" });

    const timeEl = block.querySelector(".clock-time");
    if (timeEl) timeEl.textContent = timeText;
    const dateEl = block.querySelector(".clock-date");
    if (dateEl) dateEl.textContent = d.toLocaleDateString("en-US", clockDateOptions());
    const secEl = block.querySelector(".clock-sec");
    if (secEl) secEl.textContent = String(d.getSeconds()).padStart(2, "0");

    const hourHand = block.querySelector(".a-hour");
    if (hourHand) {
      const hour = (d.getHours() % 12) + d.getMinutes() / 60 + d.getSeconds() / 3600;
      const minute = d.getMinutes() + d.getSeconds() / 60;
      const second = d.getSeconds();
      hourHand.setAttribute("transform", "rotate(" + (hour * 30).toFixed(2) + " 60 60)");
      const minuteHand = block.querySelector(".a-minute");
      if (minuteHand) minuteHand.setAttribute("transform", "rotate(" + (minute * 6).toFixed(2) + " 60 60)");
      const secondHand = block.querySelector(".a-second");
      if (secondHand) secondHand.setAttribute("transform", "rotate(" + (second * 6).toFixed(2) + " 60 60)");
    }
  }

  function updateDateTime() {
    updateClockElement($("#clockBlock"));
    updateClockElement($("#homeClock"));
  }

  function buildClockChoices() {
    const host = $("#clockChoices");
    if (!host) return;
    const previews = {
      digital: '<span class="cp-big">10:24</span><span class="cp-small">MON 9</span>',
      stacked: '<span class="cp-big">10:24</span><span class="cp-small">MONDAY</span>',
      minimal: '<span class="cp-big">10:24</span><span class="cp-sec">07</span>',
      analog: '<svg class="icon cp-clock" aria-hidden="true"><use href="#i-clock"></use></svg>',
      chip: '<span class="cp-chip">10:24 · Mon</span>'
    };
    host.innerHTML = Object.keys(CLOCK_STYLES).map((key) =>
      '<button type="button" class="clock-choice" data-clock-style="' + key + '" title="' + CLOCK_STYLES[key].name + ' clock">' +
        '<span class="clock-preview cp-' + key + '">' + previews[key] + '</span>' +
        '<span class="cp-name">' + CLOCK_STYLES[key].name + '</span>' +
      '</button>'
    ).join("");
  }

  /* ---------------- desktop widget layout ---------------- */

  function widgetEl(key) {
    return $('.widget[data-widget="' + key + '"]');
  }

  function applyWidgetLayout() {
    const layer = $("#widgetLayer");
    if (!layer) return;

    const layerStyle = getComputedStyle(layer);
    const leftGap = parseFloat(layerStyle.getPropertyValue("--widget-left")) || 24;
    const rightGap = parseFloat(layerStyle.getPropertyValue("--widget-right")) || 24;
    const topGap = parseFloat(layerStyle.getPropertyValue("--widget-top")) || 18;
    const bottomGap = parseFloat(layerStyle.getPropertyValue("--widget-bottom")) || 24;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    WIDGETS.forEach(({ key }) => {
      const el = widgetEl(key);
      if (!el || el.hidden) return;
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      const p = settings.widgetPositions[key];
      let cx;
      let cy;

      if (p && p.free) {
        cx = p.x * vw;
        cy = p.y * vh;
      } else {
        const ax = p ? p.ax : "center";
        const ay = p ? p.ay : "mid";
        cx = ax === "left" ? leftGap + w / 2 : ax === "right" ? vw - rightGap - w / 2 : vw / 2;
        cy = ay === "top" ? topGap + h / 2 : ay === "bottom" ? vh - bottomGap - h / 2 : vh / 2;
      }

      /* On narrow screens keep the search on its own row, below the
         clock/actions, instead of letting the three overlap. */
      if (key === "search" && p && !p.free && p.ay === "top" && vw < 760) {
        const clock = widgetEl("clock");
        const clockH = clock && !clock.hidden ? clock.offsetHeight : 0;
        cy = Math.max(cy, topGap + clockH + 12 + h / 2);
      }

      cx = clamp(cx, w / 2 + 8, vw - w / 2 - 8);
      cy = clamp(cy, h / 2 + 8, vh - h / 2 - 8);
      el.style.left = cx + "px";
      el.style.top = cy + "px";
    });
  }

  function renderWidgetPositions() {
    const host = $("#widgetPosList");
    if (!host) return;

    const anchors = [];
    ["top", "mid", "bottom"].forEach((ay) => {
      ["left", "center", "right"].forEach((ax) => anchors.push({ ax, ay }));
    });
    const placeNames = { left: "left", center: "centre", right: "right", top: "top", mid: "middle", bottom: "bottom" };

    host.innerHTML = "";
    WIDGETS.forEach(({ key, name }) => {
      const p = settings.widgetPositions[key] || {};
      const row = document.createElement("div");
      row.className = "widget-pos-row";

      const label = document.createElement("span");
      label.className = "widget-pos-name";
      label.textContent = name;

      const grid = document.createElement("div");
      grid.className = "anchor-grid";
      grid.setAttribute("role", "group");
      grid.setAttribute("aria-label", name + " widget position");

      anchors.forEach(({ ax, ay }) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "anchor-cell";
        button.dataset.ax = ax;
        button.dataset.ay = ay;
        button.title = "Move " + name + " to " + placeNames[ay] + " " + placeNames[ax];
        button.setAttribute("aria-label", button.title);
        if (!p.free && p.ax === ax && p.ay === ay) button.classList.add("active");
        button.addEventListener("click", () => {
          settings.widgetPositions[key] = { ax, ay };
          applyWidgetLayout();
          renderWidgetPositions();
          saveSettings();
        });
        grid.appendChild(button);
      });

      const state = document.createElement("span");
      state.className = "widget-pos-state";
      state.textContent = p.free ? "Free" : "Slot";

      row.append(label, grid, state);
      host.appendChild(row);
    });
  }

  let widgetDragState = null;

  function setupWidgetDragging() {
    const layer = $("#widgetLayer");
    if (!layer) return;

    layer.addEventListener("pointerdown", (e) => {
      const grip = e.target.closest(".widget-grip");
      if (!grip || !settings.widgetDrag) return;
      const widget = grip.closest(".widget");
      if (!widget) return;
      const rect = widget.getBoundingClientRect();
      widgetDragState = {
        widget,
        key: widget.dataset.widget,
        pointerId: e.pointerId,
        startX: e.clientX,
        startY: e.clientY,
        centerX: rect.left + rect.width / 2,
        centerY: rect.top + rect.height / 2
      };
      widget.classList.add("dragging");
      try { grip.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
      e.preventDefault();
    });

    layer.addEventListener("pointermove", (e) => {
      if (!widgetDragState || e.pointerId !== widgetDragState.pointerId) return;
      const el = widgetDragState.widget;
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      const dx = e.clientX - widgetDragState.startX;
      const dy = e.clientY - widgetDragState.startY;
      const cx = clamp(widgetDragState.centerX + dx, w / 2 + 8, window.innerWidth - w / 2 - 8);
      const cy = clamp(widgetDragState.centerY + dy, h / 2 + 8, window.innerHeight - h / 2 - 8);
      el.style.left = cx + "px";
      el.style.top = cy + "px";
      e.preventDefault();
    });

    const endDrag = (e) => {
      if (!widgetDragState) return;
      if (e && e.pointerId !== undefined && e.pointerId !== widgetDragState.pointerId) return;
      const state = widgetDragState;
      widgetDragState = null;
      state.widget.classList.remove("dragging");
      const rect = state.widget.getBoundingClientRect();
      let x = (rect.left + rect.width / 2) / window.innerWidth;
      let y = (rect.top + rect.height / 2) / window.innerHeight;
      if (settings.widgetSnap) {
        x = Math.round(x * 12) / 12;
        y = Math.round(y * 12) / 12;
      }
      settings.widgetPositions[state.key] = { free: true, x: clamp(x, 0, 1), y: clamp(y, 0, 1) };
      applyWidgetLayout();
      renderWidgetPositions();
      saveSettings();
    };

    layer.addEventListener("pointerup", endDrag);
    layer.addEventListener("pointercancel", endDrag);

    /* Arrow keys nudge a focused grip for keyboard-only placement. */
    layer.addEventListener("keydown", (e) => {
      if (!settings.widgetDrag) return;
      const grip = e.target.closest(".widget-grip");
      if (!grip) return;
      const step = e.shiftKey ? 0.05 : 0.01;
      let dx = 0;
      let dy = 0;
      if (e.key === "ArrowLeft") dx = -step;
      else if (e.key === "ArrowRight") dx = step;
      else if (e.key === "ArrowUp") dy = -step;
      else if (e.key === "ArrowDown") dy = step;
      if (!dx && !dy) return;
      e.preventDefault();
      const key = grip.dataset.widgetGrip;
      const el = widgetEl(key);
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth + dx;
      const y = (rect.top + rect.height / 2) / window.innerHeight + dy;
      settings.widgetPositions[key] = { free: true, x: clamp(x, 0, 1), y: clamp(y, 0, 1) };
      applyWidgetLayout();
      renderWidgetPositions();
      saveSettings();
    });
  }

  function resetWidgetPositions() {
    settings.widgetPositions = defaultWidgetPositions();
    applyWidgetLayout();
    renderWidgetPositions();
    saveSettings();
  }

  /* ---------------- tabs ---------------- */

  function selectTab(name) {
    $$("#tabbar button[data-tab]").forEach((b) => b.classList.toggle("active", b.dataset.tab === name));
    $$(".tab-panel").forEach((p) => p.classList.toggle("active", p.dataset.panel === name));
    if (name === "review") renderReview();
    if (name === "home") renderHome();
    applyWidgetVisibility();
    applyWidgetLayout();
  }

  /* ---------------- search ---------------- */

  function looksLikeUrl(value) {
    if (/^[a-z][a-z0-9+.-]*:\/\//i.test(value)) return true;
    if (/^localhost(:\d+)?(\/|$)/i.test(value)) return true;
    return /^[^\s]+\.[^\s]{2,}/.test(value) && !/\s/.test(value);
  }

  function urlForSearch(value) {
    let url;
    if (looksLikeUrl(value)) {
      url = /^[a-z][a-z0-9+.-]*:/i.test(value) ? value : "https://" + value;
      if (!/^(https?|file|ftp):/i.test(url)) url = "https://www.google.com/search?q=" + encodeURIComponent(value);
    } else {
      const engine = ENGINES[settings.engine] || ENGINES.google;
      url = engine.url + encodeURIComponent(value);
    }
    return url;
  }

  function runSearch() {
    const input = $("#searchInput");
    const value = input.value.trim();
    if (!value) return;
    const url = urlForSearch(value);
    if (settings.searchNewTab) window.open(url, "_blank", "noopener");
    else window.location.href = url;
  }

  function runHomeSearch() {
    const input = $("#homeSearchInput");
    if (!input) return;
    const value = input.value.trim();
    if (!value) return;
    const url = urlForSearch(value);
    if (settings.searchNewTab) window.open(url, "_blank", "noopener");
    else window.location.href = url;
  }

  /* ---------------- apps launcher ---------------- */

  function renderApps() {
    const grid = $("#appsGrid");
    if (!grid) return;
    grid.innerHTML = "";
    GOOGLE_APPS.forEach((app) => {
      const a = document.createElement("a");
      a.className = "app-tile";
      a.href = app.url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      const avatar = document.createElement("span");
      avatar.className = "app-avatar";
      avatar.style.background = app.color;
      avatar.textContent = app.letter;
      const label = document.createElement("span");
      label.textContent = app.name;
      a.append(avatar, label);
      grid.appendChild(a);
    });
  }

  function openApps() {
    const dialog = $("#appsDialog");
    if (!dialog) return;
    if (!dialog.open) dialog.showModal();
    document.body.classList.add("locked");
  }
  function closeApps() {
    const dialog = $("#appsDialog");
    if (dialog && dialog.open) dialog.close();
    document.body.classList.remove("locked");
  }

  /* ---------------- dock ---------------- */

  function renderDock() {
    const dock = $("#dock");
    if (!dock) return;
    dock.innerHTML = "";
    if (!settings.showDock) { applyWidgetLayout(); return; }

    dockItems.forEach((item) => {
      const a = document.createElement("a");
      a.className = "dock-item";
      a.href = item.url;
      a.title = item.title;
      a.target = settings.dockNewTab ? "_blank" : "_self";
      a.rel = "noopener noreferrer";

      const icon = document.createElement("span");
      icon.className = "dock-icon";
      const letter = document.createElement("span");
      letter.className = "dock-letter";
      letter.textContent = firstLetter(item.title);
      icon.appendChild(letter);

      const img = document.createElement("img");
      img.alt = "";
      img.loading = "lazy";
      img.referrerPolicy = "no-referrer";
      img.src = faviconFor(item.url, 128);
      img.style.display = "none";
      img.addEventListener("load", () => {
        letter.style.display = "none";
        img.style.display = "";
      });
      img.addEventListener("error", () => { img.remove(); });
      icon.appendChild(img);

      const tip = document.createElement("span");
      tip.className = "dock-tooltip";
      tip.textContent = item.title;

      a.append(icon, tip);
      dock.appendChild(a);
    });

    if (dockItems.length) {
      const sep = document.createElement("span");
      sep.className = "dock-sep";
      dock.appendChild(sep);
    }

    const edit = document.createElement("button");
    edit.type = "button";
    edit.className = "dock-edit";
    edit.title = "Edit favourites";
    edit.innerHTML =
      '<span class="dock-icon"><svg class="icon" style="width:24px;height:24px"><use href="#i-settings"></use></svg></span>' +
      '<span class="dock-tooltip">Edit dock</span>';
    edit.addEventListener("click", () => openSettings("dock"));
    dock.appendChild(edit);
    applyWidgetLayout();
  }

  function resetDockMagnification() {
    $$("#dock .dock-item, #dock .dock-edit").forEach((el) => {
      el.style.setProperty("--s", "1");
      el.style.setProperty("--lift", "0px");
      el.style.setProperty("--inv", "1");
    });
  }

  function setupDockMagnify() {
    const dock = $("#dock");
    dock.addEventListener("mousemove", (e) => {
      if (!settings.dockMagnify || !settings.animations) return;
      const items = $$(".dock-item, .dock-edit", dock);
      const base = settings.dockSize;
      const range = base * 2.6;
      items.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const center = rect.left + rect.width / 2;
        const dist = Math.abs(e.clientX - center);
        if (dist >= range) {
          el.style.setProperty("--s", "1");
          el.style.setProperty("--lift", "0px");
          el.style.setProperty("--inv", "1");
          return;
        }
        const t = 1 - dist / range;
        const scale = 1 + 0.55 * t * t;
        el.style.setProperty("--s", scale.toFixed(3));
        el.style.setProperty("--lift", (-(scale - 1) * base * 0.6).toFixed(1) + "px");
        el.style.setProperty("--inv", (1 / scale).toFixed(3));
      });
    });
    dock.addEventListener("mouseleave", resetDockMagnification);
    window.addEventListener("blur", resetDockMagnification);
    window.addEventListener("resize", resetDockMagnification);
  }

  function normalizeUrl(value) {
    let v = (value || "").trim();
    if (!v) return "";
    if (!/^[a-z][a-z0-9+.-]*:\/\//i.test(v)) v = "https://" + v;
    try {
      const u = new URL(v);
      if (!/^https?:$/.test(u.protocol)) return "";
      return u.href;
    } catch (e) {
      return "";
    }
  }

  function addDockItem(title, url) {
    const clean = normalizeUrl(url);
    if (!clean) {
      showToast("⚠️ That doesn’t look like a valid web address.");
      return false;
    }
    if (dockItems.some((d) => d.url === clean)) {
      showToast("That bookmark is already in your dock.");
      return false;
    }
    dockItems.push({ id: uid(), title: (title || hostOf(clean)).trim() || hostOf(clean), url: clean });
    persist("dock-items", dockItems);
    applySettings();
    renderDockSettings();
    return true;
  }

  function removeDockItem(id) {
    dockItems = dockItems.filter((d) => d.id !== id);
    persist("dock-items", dockItems);
    applySettings();
    renderDockSettings();
  }

  function moveDockItem(id, delta) {
    const index = dockItems.findIndex((d) => d.id === id);
    const next = index + delta;
    if (index < 0 || next < 0 || next >= dockItems.length) return;
    const copy = dockItems.slice();
    const [item] = copy.splice(index, 1);
    copy.splice(next, 0, item);
    dockItems = copy;
    persist("dock-items", dockItems);
    applySettings();
    renderDockSettings();
  }

  function renderDockSettings() {
    const host = $("#dockList");
    if (!host) return;
    host.innerHTML = "";
    if (!dockItems.length) {
      host.innerHTML = '<div class="empty-state">Your dock is empty. Add a favourite below.</div>';
      return;
    }
    dockItems.forEach((item, index) => {
      const row = document.createElement("div");
      row.className = "dock-setting-row";

      const icon = document.createElement("span");
      icon.className = "dock-setting-icon";
      const letter = document.createElement("span");
      letter.textContent = firstLetter(item.title);
      icon.appendChild(letter);
      const img = document.createElement("img");
      img.alt = "";
      img.referrerPolicy = "no-referrer";
      img.src = faviconFor(item.url, 64);
      img.style.display = "none";
      img.addEventListener("load", () => { letter.style.display = "none"; img.style.display = ""; });
      img.addEventListener("error", () => img.remove());
      icon.appendChild(img);

      const copy = document.createElement("span");
      copy.className = "dock-setting-copy";
      const title = document.createElement("span");
      title.className = "dock-setting-title";
      title.textContent = item.title;
      const url = document.createElement("span");
      url.className = "dock-setting-url";
      url.textContent = hostOf(item.url);
      copy.append(title, url);

      const up = document.createElement("button");
      up.type = "button";
      up.className = "icon-btn";
      up.title = "Move up";
      up.innerHTML = '<svg class="icon"><use href="#i-arrow-up"></use></svg>';
      up.disabled = index === 0;
      up.addEventListener("click", () => moveDockItem(item.id, -1));

      const down = document.createElement("button");
      down.type = "button";
      down.className = "icon-btn";
      down.title = "Move down";
      down.innerHTML = '<svg class="icon"><use href="#i-arrow-down"></use></svg>';
      down.disabled = index === dockItems.length - 1;
      down.addEventListener("click", () => moveDockItem(item.id, 1));

      const del = document.createElement("button");
      del.type = "button";
      del.className = "icon-btn";
      del.title = "Remove from dock";
      del.innerHTML = '<svg class="icon"><use href="#i-trash"></use></svg>';
      del.addEventListener("click", () => removeDockItem(item.id));

      row.append(icon, copy, up, down, del);
      host.appendChild(row);
    });
  }

  function resetDockDefaults() {
    if (!confirm("Restore the default dock favourites? Your current dock list will be replaced.")) return;
    dockItems = DEFAULT_DOCK.map((d) => ({ id: uid(), title: d.title, url: d.url }));
    persist("dock-items", dockItems);
    applySettings();
    renderDockSettings();
    showToast("Dock restored to defaults.");
  }

  /* ---------------- bookmarks ---------------- */

  function bookmarksApi() {
    if (typeof browser !== "undefined" && browser.bookmarks) return browser.bookmarks;
    if (typeof chrome !== "undefined" && chrome.bookmarks) return chrome.bookmarks;
    return null;
  }

  function bookmarksCall(method, args) {
    const api = bookmarksApi();
    if (!api || typeof api[method] !== "function") {
      return Promise.reject(new Error("Bookmarks are not available in this context."));
    }

    if (typeof browser !== "undefined" && browser.bookmarks) {
      try {
        return Promise.resolve(api[method].apply(api, args || []));
      } catch (e) {
        return Promise.reject(e);
      }
    }

    return new Promise((resolve, reject) => {
      let settled = false;
      const done = (fn, value) => {
        if (settled) return;
        settled = true;
        fn(value);
      };
      try {
        const ret = api[method].apply(api, (args || []).concat([(result) => {
          let err = null;
          try { err = typeof chrome !== "undefined" && chrome.runtime ? chrome.runtime.lastError : null; } catch (e) { err = null; }
          if (err) done(reject, new Error(err.message || "Bookmarks error"));
          else done(resolve, result);
        }]));
        if (ret && typeof ret.then === "function") {
          ret.then((r) => done(resolve, r), (e) => done(reject, e));
        }
      } catch (e) {
        done(reject, e);
      }
    });
  }

  function flattenBookmarks(nodes, out) {
    const result = out || [];
    (nodes || []).forEach((node) => {
      if (node.url && /^(https?|file|ftp):/i.test(node.url)) result.push(node);
      if (node.children && node.children.length) flattenBookmarks(node.children, result);
    });
    return result;
  }

  async function loadBrowserBookmarks(force) {
    if (!bookmarksApi()) {
      bookmarksError = "Bookmarks can only be read from the installed extension. Open the new-tab extension build to use this panel.";
      allBookmarks = [];
      bookmarksLoaded = true;
      renderBookmarks();
      return;
    }
    if (bookmarksLoaded && !force) {
      renderBookmarks();
      return;
    }
    const list = $("#bookmarksList");
    if (list) list.innerHTML = '<div class="bm-empty">Loading bookmarks…</div>';
    try {
      const tree = await bookmarksCall("getTree", []);
      allBookmarks = flattenBookmarks(tree);
      bookmarksError = "";
      bookmarksLoaded = true;
    } catch (e) {
      bookmarksError = e.message || "Could not read bookmarks.";
      allBookmarks = [];
      bookmarksLoaded = true;
    }
    renderBookmarks();
  }

  function renderBookmarks() {
    const host = $("#bookmarksList");
    if (!host) return;
    host.innerHTML = "";

    if (bookmarksError) {
      const note = document.createElement("div");
      note.className = "bm-empty";
      note.textContent = bookmarksError;
      host.appendChild(note);
      return;
    }

    const q = ($("#bookmarksSearch").value || "").trim().toLowerCase();
    const filtered = q
      ? allBookmarks.filter((b) => (b.title || "").toLowerCase().includes(q) || (b.url || "").toLowerCase().includes(q))
      : allBookmarks;

    const label = document.createElement("div");
    label.className = "bm-group-label";
    label.textContent = q ? filtered.length + " match" + (filtered.length === 1 ? "" : "es") : allBookmarks.length + " bookmarks";
    host.appendChild(label);

    if (!filtered.length) {
      const note = document.createElement("div");
      note.className = "bm-empty";
      note.textContent = q ? "No bookmarks match that search." : "Your browser has no bookmarks yet. Save a page and it will appear here.";
      host.appendChild(note);
      return;
    }

    filtered.slice(0, 500).forEach((bm) => {
      const row = document.createElement("div");
      row.className = "bm-row";

      const fav = document.createElement("span");
      fav.className = "bm-fav";
      const letter = document.createElement("span");
      letter.textContent = firstLetter(bm.title || hostOf(bm.url));
      fav.appendChild(letter);
      const img = document.createElement("img");
      img.alt = "";
      img.referrerPolicy = "no-referrer";
      img.src = faviconFor(bm.url, 64);
      img.style.display = "none";
      img.addEventListener("load", () => { letter.style.display = "none"; img.style.display = ""; });
      img.addEventListener("error", () => img.remove());
      fav.appendChild(img);

      const main = document.createElement("button");
      main.type = "button";
      main.className = "bm-main";
      const title = document.createElement("span");
      title.className = "bm-title";
      title.textContent = bm.title || hostOf(bm.url);
      const url = document.createElement("span");
      url.className = "bm-url";
      url.textContent = hostOf(bm.url) + new URL(bm.url).pathname.replace(/\/$/, "");
      main.append(title, url);
      main.addEventListener("click", () => {
        window.open(bm.url, "_blank", "noopener");
      });

      const star = document.createElement("button");
      star.type = "button";
      star.className = "icon-btn bm-star" + (dockItems.some((d) => d.url === bm.url) ? " active" : "");
      star.title = star.classList.contains("active") ? "Remove from dock" : "Add to dock";
      star.innerHTML = '<svg class="icon"><use href="' + (star.classList.contains("active") ? "#i-star" : "#i-star-outline") + '"></use></svg>';
      star.addEventListener("click", () => {
        const existing = dockItems.find((d) => d.url === bm.url);
        if (existing) {
          removeDockItem(existing.id);
          showToast("Removed from dock.");
        } else if (addDockItem(bm.title || hostOf(bm.url), bm.url)) {
          showToast("⭐ Pinned to your dock.");
        }
        renderBookmarks();
      });

      row.append(fav, main, star);
      host.appendChild(row);
    });
  }

  function openBookmarks() {
    const panel = $("#bookmarksPanel");
    const scrim = $("#scrim");
    clearTimeout(scrimTimer);
    scrim.hidden = false;
    requestAnimationFrame(() => scrim.classList.add("show"));
    panel.classList.add("open");
    panel.setAttribute("aria-hidden", "false");
    document.body.classList.add("locked");
    loadBrowserBookmarks(true);
    setTimeout(() => $("#bookmarksSearch").focus({ preventScroll: true }), 280);
  }

  function closeBookmarks() {
    const panel = $("#bookmarksPanel");
    const scrim = $("#scrim");
    panel.classList.remove("open");
    panel.setAttribute("aria-hidden", "true");
    scrim.classList.remove("show");
    document.body.classList.remove("locked");
    clearTimeout(scrimTimer);
    scrimTimer = setTimeout(() => { scrim.hidden = true; }, 280);
  }

  /* ---------------- settings dialog ---------------- */

  function selectSettingsTab(name) {
    $$("#settingsTabs .seg-btn").forEach((b) => {
      const active = b.dataset.settingsTab === name;
      b.classList.toggle("active", active);
      b.setAttribute("aria-selected", active ? "true" : "false");
    });
    $$(".settings-section").forEach((s) => {
      s.hidden = s.dataset.settingsPanel !== name;
    });
    if (name === "data") renderStorageUi();
    if (name === "layout") renderWidgetPositions();
  }

  function openSettings(tab) {
    const dialog = $("#settingsDialog");
    selectSettingsTab(tab || "appearance");
    renderDockSettings();
    renderStorageUi();
    if (!dialog.open) dialog.showModal();
    document.body.classList.add("locked");
  }

  function closeSettings() {
    const dialog = $("#settingsDialog");
    if (dialog.open) dialog.close();
    document.body.classList.remove("locked");
  }

  function buildAccentSwatches() {
    const host = $("#accentSwatches");
    host.innerHTML = "";
    Object.keys(ACCENTS).forEach((key) => {
      const a = ACCENTS[key];
      const b = document.createElement("button");
      b.type = "button";
      b.className = "swatch";
      b.dataset.accent = key;
      b.title = a.name;
      b.setAttribute("aria-label", a.name + " accent");
      b.style.background = "hsl(" + a.h + " " + a.s + "% 45%)";
      b.addEventListener("click", () => {
        settings.accent = key;
        applySettings();
        saveSettings();
      });
      host.appendChild(b);
    });
  }

  /* ---------------- storage / sync UI ---------------- */

  function renderSyncStatus(status) {
    const current = status || store.getStatus();
    const card = $("#syncStatus");
    const hint = $("#syncHint");
    const toggle = $("#syncToggle");
    if (!card) return;

    if (toggle) {
      toggle.checked = !!settings.syncEnabled && store.syncAvailable;
      toggle.disabled = !store.syncAvailable;
    }

    let text;
    if (!store.usingExtension) {
      text = "Preview mode — this page is not running as an extension, so data is saved in this browser profile's localStorage only.";
      if (hint) hint.textContent = "Install the extension to enable browser sync.";
    } else if (!store.syncAvailable) {
      text = "Browser sync is not available in this browser. Data is saved locally in the extension.";
      if (hint) hint.textContent = "This browser does not expose a sync storage area.";
    } else if (!settings.syncEnabled) {
      text = "Browser sync is off. Data is stored on this device only.";
      if (hint) hint.textContent = "Turn on to sync between devices signed into this browser.";
    } else {
      const last = current.lastSyncAt
        ? new Date(current.lastSyncAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
        : "not yet";
      text = "Browser sync on · last write " + last + (current.pending ? " · " + current.pending + " pending" : "");
      if (hint) hint.textContent = "Synced through your Chrome or Firefox account.";
    }
    if (current.lastError) text += " · ⚠ " + current.lastError;
    card.textContent = text;
  }

  function renderUsage() {
    const usage = $("#storageUsage");
    if (!usage) return;
    store.usage().then((u) => {
      const kb = (bytes) => (bytes / 1024).toFixed(1) + " KB";
      usage.textContent = "Local: " + kb(u.localBytes) + " · Browser sync: " + (store.syncAvailable ? kb(u.syncBytes) + " / 100 KB" : "not available");
    }).catch(() => {
      usage.textContent = "Storage usage unavailable.";
    });
  }

  function renderStorageUi() {
    renderSyncStatus();
    renderUsage();
  }

  /* ---------------- todos ---------------- */

  const todoListEl = () => $("#todoList");

  async function initTodos() {
    todos = await store.load("todos-list", []);
    if (!Array.isArray(todos)) todos = [];
    $("#todoDate").value = todayStr();
    renderTodos();
    setInterval(checkReminders, 20000);
    checkReminders();
  }

  function renderTodos() {
    renderHomeTasks();
    updateHomeGreeting();
    const host = todoListEl();
    host.innerHTML = "";
    if (todos.length === 0) {
      host.innerHTML = '<div class="empty-state">Nothing logged yet. Add your first task above.</div>';
      return;
    }
    const groups = {};
    todos.forEach((t) => {
      const d = t.date || todayStr();
      (groups[d] = groups[d] || []).push(t);
    });
    const dates = Object.keys(groups).sort((a, b) => b.localeCompare(a));
    const now = new Date();
    const nowMins = now.getHours() * 60 + now.getMinutes();

    dates.forEach((date) => {
      const items = groups[date].sort((a, b) => {
        if (a.done !== b.done) return a.done ? 1 : -1;
        if (a.time && b.time) return a.time.localeCompare(b.time);
        if (a.time) return -1;
        if (b.time) return 1;
        return 0;
      });
      const doneCount = items.filter((t) => t.done).length;
      const label = new Date(date + "T00:00:00").toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" }) + (date === todayStr() ? " · Today" : "");

      const groupEl = document.createElement("div");
      groupEl.className = "date-group";
      const header = document.createElement("div");
      header.className = "date-group-header";
      const labelEl = document.createElement("span");
      labelEl.textContent = label;
      const countEl = document.createElement("span");
      countEl.className = "count";
      countEl.textContent = doneCount + "/" + items.length + " done";
      header.append(labelEl, countEl);
      groupEl.appendChild(header);

      const ul = document.createElement("ul");
      ul.className = "todo-list";

      items.forEach((t) => {
        const li = document.createElement("li");
        li.className = "todo-item" + (t.done ? " done" : "");
        let overdue = false;
        if (t.time && !t.done && date === todayStr()) {
          const hm = t.time.split(":").map(Number);
          if (hm[0] * 60 + hm[1] < nowMins) overdue = true;
        }
        if (overdue) li.classList.add("overdue");

        const check = document.createElement("button");
        check.type = "button";
        check.className = "check";
        check.setAttribute("aria-label", t.done ? "Mark as not done" : "Mark as done");
        check.textContent = t.done ? "✓" : "";

        const text = document.createElement("span");
        text.className = "todo-text";
        text.textContent = t.text;

        li.append(check, text);
        if (t.time) {
          const time = document.createElement("span");
          time.className = "todo-time";
          time.textContent = t.time;
          li.appendChild(time);
        }
        const del = document.createElement("button");
        del.type = "button";
        del.className = "del-btn";
        del.title = "Delete task";
        del.innerHTML = "&times;";
        li.appendChild(del);

        check.addEventListener("click", () => {
          t.done = !t.done;
          persist("todos-list", todos);
          renderTodos();
        });
        del.addEventListener("click", () => {
          todos = todos.filter((x) => x.id !== t.id);
          persist("todos-list", todos);
          renderTodos();
        });
        ul.appendChild(li);
      });

      groupEl.appendChild(ul);
      host.appendChild(groupEl);
    });
  }

  function addTodo() {
    const input = $("#todoInput");
    const timeInput = $("#todoTime");
    const dateInput = $("#todoDate");
    const text = input.value.trim();
    if (!text) {
      input.focus();
      return;
    }
    todos.push({ id: uid(), text: text, time: timeInput.value || null, done: false, notified: false, date: dateInput.value || todayStr() });
    persist("todos-list", todos);
    input.value = "";
    timeInput.value = "";
    renderTodos();
  }

  function checkReminders() {
    const now = new Date();
    const nowMins = now.getHours() * 60 + now.getMinutes();
    let changed = false;
    todos.forEach((t) => {
      if (t.time && !t.done && !t.notified && t.date === todayStr()) {
        const hm = t.time.split(":").map(Number);
        if (hm[0] * 60 + hm[1] <= nowMins) {
          t.notified = true;
          changed = true;
          showToast("⏰ Reminder: <b>" + escapeHtml(t.text) + "</b> (" + t.time + ")");
        }
      }
    });
    if (changed) {
      persist("todos-list", todos);
      renderTodos();
    }
  }

  /* ---------------- home dashboard ---------------- */

  function homeTodayTodos() {
    const today = todayStr();
    return todos.filter((t) => (t.date || today) === today);
  }

  function homeDaypartLabel() {
    const h = new Date().getHours();
    if (h < 5) return "Good night";
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    if (h < 21) return "Good evening";
    return "Good night";
  }

  function updateHomeGreeting() {
    const daypart = homeDaypartLabel();
    const daypartEl = $("#homeDaypart");
    if (daypartEl) daypartEl.textContent = daypart;

    const name = (settings.homeName || "").trim();
    const greetingEl = $("#homeGreeting");
    if (greetingEl) greetingEl.textContent = name ? daypart + ", " + name : daypart;

    const list = homeTodayTodos();
    const left = list.filter((t) => !t.done).length;
    const summaryEl = $("#homeSummary");
    if (!summaryEl) return;
    const parts = [];
    if (!list.length) parts.push("No tasks planned yet");
    else if (left === 0) parts.push("All " + list.length + " tasks done");
    else parts.push(left + " task" + (left === 1 ? "" : "s") + " left");
    if (pomo.sessionsToday) parts.push(pomo.sessionsToday + " focus session" + (pomo.sessionsToday === 1 ? "" : "s") + " today");
    summaryEl.textContent = parts.join(" · ");
  }

  function renderHomeTasks() {
    const host = $("#homeTaskList");
    if (!host) return;

    const items = homeTodayTodos().slice().sort((a, b) => {
      if (a.done !== b.done) return a.done ? 1 : -1;
      if (a.time && b.time) return a.time.localeCompare(b.time);
      if (a.time) return -1;
      if (b.time) return 1;
      return 0;
    });

    const left = items.filter((t) => !t.done).length;
    const countEl = $("#homeTaskCount");
    if (countEl) countEl.textContent = items.length ? left + " left · " + items.length + " total" : "Nothing planned";

    host.innerHTML = "";
    const emptyEl = $("#homeTaskEmpty");
    if (emptyEl) emptyEl.hidden = items.length > 0;

    items.forEach((t) => {
      const li = document.createElement("li");
      li.className = "home-task-item" + (t.done ? " done" : "");

      const check = document.createElement("button");
      check.type = "button";
      check.className = "check";
      check.setAttribute("aria-label", t.done ? "Mark as not done" : "Mark as done");
      check.textContent = t.done ? "✓" : "";

      const text = document.createElement("span");
      text.className = "home-task-text";
      text.textContent = t.text;

      const del = document.createElement("button");
      del.type = "button";
      del.className = "del-btn";
      del.title = "Delete task";
      del.setAttribute("aria-label", "Delete task");
      del.innerHTML = "&times;";

      li.append(check, text);
      if (t.time) {
        const time = document.createElement("span");
        time.className = "home-task-time";
        time.textContent = t.time;
        li.appendChild(time);
      }
      li.appendChild(del);

      check.addEventListener("click", () => {
        t.done = !t.done;
        persist("todos-list", todos);
        renderTodos();
      });
      del.addEventListener("click", () => {
        todos = todos.filter((x) => x.id !== t.id);
        persist("todos-list", todos);
        renderTodos();
      });

      host.appendChild(li);
    });
  }

  function renderHomeQuickLinks() {
    const host = $("#homeQuickLinks");
    if (!host) return;
    host.innerHTML = "";

    dockItems.slice(0, 7).forEach((item) => {
      const a = document.createElement("a");
      a.className = "home-link";
      a.href = item.url;
      a.title = item.title;
      a.target = settings.dockNewTab ? "_blank" : "_self";
      a.rel = "noopener noreferrer";

      const mark = document.createElement("span");
      mark.className = "home-link-mark";
      mark.textContent = firstLetter(item.title);

      const img = document.createElement("img");
      img.alt = "";
      img.loading = "lazy";
      img.referrerPolicy = "no-referrer";
      img.src = faviconFor(item.url, 64);
      img.addEventListener("load", () => { mark.textContent = ""; mark.appendChild(img); });
      img.addEventListener("error", () => img.remove());

      const label = document.createElement("span");
      label.className = "home-link-label";
      label.textContent = item.title;

      a.append(mark, label);
      host.appendChild(a);
    });

    const edit = document.createElement("button");
    edit.type = "button";
    edit.className = "home-link home-link-edit";
    edit.innerHTML = '<span class="home-link-mark"><svg class="icon"><use href="#i-settings"></use></svg></span><span class="home-link-label">Customize</span>';
    edit.addEventListener("click", () => openSettings("home"));
    host.appendChild(edit);
  }

  function updateHomePomo() {
    const timeEl = $("#homePomoTime");
    if (!timeEl) return;
    const mins = Math.floor(pomo.remaining / 60);
    const secs = pomo.remaining % 60;
    timeEl.textContent = String(mins).padStart(2, "0") + ":" + String(secs).padStart(2, "0");
    const shortLabelMap = { work: "Focus", short: "Short break", long: "Long break" };
    const modeEl = $("#homePomoMode");
    if (modeEl) modeEl.textContent = shortLabelMap[pomo.mode];
    const startEl = $("#homePomoStart");
    if (startEl) startEl.textContent = pomo.running ? "Pause" : "Start";
    const sessEl = $("#homeSessCount");
    if (sessEl) sessEl.textContent = pomo.sessionsToday;
    const minsEl = $("#homeFocusMins");
    if (minsEl) minsEl.textContent = pomo.focusMinsToday;
    const ring = $("#homePomoRing");
    if (ring) {
      const total = modeLen(pomo.mode);
      const frac = total > 0 ? pomo.remaining / total : 0;
      ring.setAttribute("stroke-dashoffset", (326.73 * frac).toFixed(1));
    }
  }

  function renderHome() {
    const grid = $("#homeGrid");
    if (!grid) return;
    grid.dataset.layout = settings.homeLayout;
    rootEl.setAttribute("data-home-layout", settings.homeLayout);

    const greeting = $("#homeGreetingBlock");
    if (greeting) greeting.hidden = !settings.showHomeGreeting;
    const clock = $("#homeClock");
    if (clock) clock.hidden = !settings.showHomeClock;
    const search = $("#homeSearchForm");
    if (search) search.hidden = !settings.showHomeSearch;
    const quick = $("#homeQuickLinks");
    if (quick) quick.hidden = !settings.showHomeQuick;
    const tasks = $("#homeTasksCard");
    if (tasks) tasks.hidden = !settings.showHomeTasks;
    const focus = $("#homeFocusCard");
    if (focus) focus.hidden = !settings.showHomeFocus;

    updateHomeGreeting();
    renderHomeTasks();
    renderHomeQuickLinks();
    updateHomePomo();
  }

  /* ---------------- notes ---------------- */

  async function initNotes() {
    notes = await store.load("notes-list", []);
    if (!Array.isArray(notes)) notes = [];
    renderNotes();
  }

  function renderNotes() {
    const el = $("#notesList");
    el.innerHTML = "";
    if (notes.length === 0) {
      el.innerHTML = '<div class="empty-state">No notes saved yet.</div>';
      return;
    }
    notes.slice().reverse().forEach((n) => {
      const card = document.createElement("div");
      card.className = "note-card";
      if (n.title) {
        const title = document.createElement("div");
        title.className = "n-title";
        title.textContent = n.title;
        card.appendChild(title);
      }
      const body = document.createElement("div");
      body.className = "n-body";
      body.textContent = n.body;
      const time = document.createElement("div");
      time.className = "n-time";
      time.textContent = new Date(n.createdAt).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
      const del = document.createElement("button");
      del.type = "button";
      del.className = "del-btn";
      del.title = "Delete note";
      del.innerHTML = "&times;";
      del.addEventListener("click", () => {
        notes = notes.filter((x) => x.id !== n.id);
        persist("notes-list", notes);
        renderNotes();
      });
      card.append(body, time, del);
      el.appendChild(card);
    });
  }

  function addNote() {
    const titleEl = $("#noteTitle");
    const bodyEl = $("#noteBody");
    const body = bodyEl.value.trim();
    if (!body) {
      bodyEl.focus();
      return;
    }
    notes.push({ id: uid(), title: titleEl.value.trim(), body: body, createdAt: Date.now() });
    persist("notes-list", notes);
    titleEl.value = "";
    bodyEl.value = "";
    renderNotes();
  }

  /* ---------------- pomodoro ---------------- */

  const RADIUS = 54;
  const CIRC = 2 * Math.PI * RADIUS;

  async function initPomo() {
    const saved = await store.load("pomodoro-data", null);
    if (saved) {
      if (saved.date === todayStr()) {
        pomo.sessionsToday = saved.sessionsToday || 0;
        pomo.focusMinsToday = saved.focusMinsToday || 0;
      }
      if (saved.durations) durations = Object.assign({ work: 25, short: 5, long: 15 }, saved.durations);
    }
    pomoLog = await store.load("pomodoro-log", []);
    if (!Array.isArray(pomoLog)) pomoLog = [];

    $("#dialProgress").setAttribute("stroke-dasharray", CIRC.toFixed(1));
    $("#workLen").value = durations.work;
    $("#shortLen").value = durations.short;
    $("#longLen").value = durations.long;
    pomo.remaining = durations.work * 60;
    updatePomoUI();
    updateStatsUI();
  }

  function savePomoData() {
    store.save("pomodoro-data", {
      date: todayStr(),
      sessionsToday: pomo.sessionsToday,
      focusMinsToday: pomo.focusMinsToday,
      durations: durations
    });
  }
  function modeLen(mode) { return durations[mode] * 60; }

  function updatePomoUI() {
    const mins = Math.floor(pomo.remaining / 60);
    const secs = pomo.remaining % 60;
    const timeStr = String(mins).padStart(2, "0") + ":" + String(secs).padStart(2, "0");
    $("#timerDisplay").textContent = timeStr;
    $("#triggerTime").textContent = timeStr;
    const labelMap = { work: "focus", short: "short break", long: "long break" };
    const shortLabelMap = { work: "Focus", short: "Short break", long: "Long break" };
    $("#timerLabel").textContent = labelMap[pomo.mode];
    $("#triggerMode").textContent = shortLabelMap[pomo.mode];
    const total = modeLen(pomo.mode);
    const frac = total > 0 ? pomo.remaining / total : 0;
    $("#dialProgress").setAttribute("stroke-dashoffset", (CIRC * frac).toFixed(1));
    $("#pomoStart").textContent = pomo.running ? "Pause" : "Start";
    $$(".mode-btn").forEach((b) => b.classList.toggle("active", b.dataset.mode === pomo.mode));
    $("#pomoTrigger").classList.toggle("running", pomo.running);
    updateHomePomo();
  }

  function updateStatsUI() {
    $("#sessCount").textContent = pomo.sessionsToday;
    $("#focusMins").textContent = pomo.focusMinsToday;
    const homeSess = $("#homeSessCount");
    if (homeSess) homeSess.textContent = pomo.sessionsToday;
    const homeMins = $("#homeFocusMins");
    if (homeMins) homeMins.textContent = pomo.focusMinsToday;
  }

  function beep() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.connect(g);
      g.connect(ctx.destination);
      o.frequency.value = 660;
      g.gain.setValueAtTime(0.001, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.15, ctx.currentTime + 0.02);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      o.start();
      o.stop(ctx.currentTime + 0.55);
    } catch (e) { /* audio may be blocked */ }
  }

  function tick() {
    pomo.remaining--;
    if (pomo.remaining < 0) {
      beep();
      if (pomo.mode === "work") {
        pomo.sessionsToday++;
        pomo.focusMinsToday += durations.work;
        pomoLog.push({ date: todayStr(), minutes: durations.work });
        if (pomoLog.length > 200) pomoLog = pomoLog.slice(-200);
        store.save("pomodoro-log", pomoLog);
        showToast("✅ Focus session complete. Time for a break.");
        switchMode(pomo.sessionsToday % 4 === 0 ? "long" : "short", true);
      } else {
        showToast("🔔 Break over — back to focus.");
        switchMode("work", true);
      }
      savePomoData();
      updateStatsUI();
      return;
    }
    updatePomoUI();
  }

  function switchMode(mode, autoStart) {
    clearInterval(pomoInterval);
    pomoInterval = null;
    pomo.mode = mode;
    pomo.remaining = modeLen(mode);
    pomo.running = false;
    updatePomoUI();
    if (autoStart) toggleTimer();
  }

  function toggleTimer() {
    pomo.running = !pomo.running;
    if (pomo.running) pomoInterval = setInterval(tick, 1000);
    else {
      clearInterval(pomoInterval);
      pomoInterval = null;
    }
    updatePomoUI();
  }

  /* ---------------- mock test tracker ---------------- */

  async function initTracker() {
    mockData = await store.load("mocktests-data", {});
    if (!mockData || typeof mockData !== "object") mockData = {};
    CATEGORIES.forEach((c) => { if (!Array.isArray(mockData[c])) mockData[c] = []; });
    renderSheetTabs();
    renderSheetHead();
    renderSheet();
  }

  function renderSheetTabs() {
    const host = $("#sheetTabs");
    host.innerHTML = "";
    CATEGORIES.forEach((cat) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "sheet-tab" + (cat === activeCategory ? " active" : "");
      b.textContent = cat;
      b.addEventListener("click", () => {
        activeCategory = cat;
        renderSheetTabs();
        renderSheetHead();
        renderSheet();
      });
      host.appendChild(b);
    });
  }

  function renderSheetHead() {
    const sections = CATEGORY_SECTIONS[activeCategory];
    let sectionHeaders = "";
    sections.forEach((key) => {
      const d = SECTION_DEFS[key];
      sectionHeaders += "<th>" + d.plus + "</th><th>" + d.minus + "</th><th>" + d.net + " Marks</th>";
    });
    $("#sheetHead").innerHTML =
      "<tr>" +
      "<th>S.No</th><th>Date</th><th>Exam</th><th>Mock Name</th><th>Rank</th><th>Total Cand.</th>" +
      '<th>Marks</th><th class="hdr-pct">Percentile</th><th class="hdr-pct">Accuracy</th><th>Attempt</th>' +
      '<th class="hdr-right">Right</th><th class="hdr-wrong">Wrong</th>' +
      sectionHeaders + "<th></th></tr>";
  }

  function blankRow() {
    return { id: uid(), date: todayStr(), exam: "", mockName: "", rank: "", totalCandidates: "", percentile: "" };
  }

  function computeRow(r, sections) {
    let right = 0, wrong = 0, marks = 0;
    const nets = {};
    sections.forEach((key) => {
      const plus = Number(r[key + "Plus"]) || 0;
      const minus = Number(r[key + "Minus"]) || 0;
      right += plus;
      wrong += minus;
      const netVal = r[key + "Net"];
      const net = (netVal !== "" && netVal != null && !isNaN(Number(netVal))) ? Number(netVal) : 0;
      nets[key] = net;
      marks += net;
    });
    const attempt = right + wrong;
    const accuracy = attempt > 0 ? (right / attempt * 100) : 0;
    let percentile = null;
    const rank = Number(r.rank);
    const total = Number(r.totalCandidates);
    if (r.rank !== "" && r.rank != null && r.totalCandidates !== "" && r.totalCandidates != null && total > 0 && rank > 0) {
      percentile = ((total - rank) / total) * 100;
      percentile = clamp(percentile, 0, 100);
    }
    return { right: right, wrong: wrong, attempt: attempt, accuracy: accuracy, marks: marks, nets: nets, percentile: percentile };
  }

  function effectiveRow(r, sections) {
    const c = computeRow(r, sections);
    const eff = {
      right: c.right, wrong: c.wrong, attempt: c.attempt, accuracy: c.accuracy,
      marks: c.marks, nets: { ...c.nets }, percentile: c.percentile, autoPercentile: c.percentile
    };
    if (r.rightOvr !== "" && r.rightOvr != null) eff.right = Number(r.rightOvr);
    if (r.wrongOvr !== "" && r.wrongOvr != null) eff.wrong = Number(r.wrongOvr);
    if (r.attemptOvr !== "" && r.attemptOvr != null) eff.attempt = Number(r.attemptOvr);
    if (r.accuracyOvr !== "" && r.accuracyOvr != null) eff.accuracy = Number(r.accuracyOvr);
    if (r.percentile !== "" && r.percentile != null) eff.percentile = Number(r.percentile);
    return eff;
  }

  function updateComputedCells(tr, r, sections) {
    const eff = effectiveRow(r, sections);
    const active = document.activeElement;

    const marksTd = tr.querySelector(".total-marks");
    if (marksTd) {
      marksTd.textContent = fmt(eff.marks);
      marksTd.classList.toggle("pos", r.marksColor === "pos");
      marksTd.classList.toggle("neg", r.marksColor === "neg");
    }

    const pctInput = tr.querySelector('[data-f="percentile"]');
    const autoTag = tr.querySelector(".auto-tag");
    if (pctInput && pctInput !== active) {
      if (eff.percentile !== null) {
        pctInput.value = fmt(eff.percentile);
        pctInput.placeholder = "";
        const pctColor = heatColor(eff.percentile);
        pctInput.style.background = pctColor.bg;
        pctInput.style.color = pctColor.fg;
        const isAuto = (r.percentile === "" || r.percentile == null) && eff.autoPercentile !== null;
        if (autoTag) autoTag.style.display = isAuto ? "block" : "none";
      } else {
        pctInput.value = (r.percentile === undefined || r.percentile === null) ? "" : r.percentile;
        pctInput.placeholder = "add rank + total";
        pctInput.style.background = "";
        pctInput.style.color = "";
        if (autoTag) autoTag.style.display = "none";
      }
    }

    const accInput = tr.querySelector('[data-f="accuracyOvr"]');
    if (accInput && accInput !== active) {
      accInput.value = fmt(eff.accuracy);
      const accColor = heatColor(eff.accuracy);
      accInput.style.background = accColor.bg;
      accInput.style.color = accColor.fg;
    }

    const attInput = tr.querySelector('[data-f="attemptOvr"]');
    if (attInput && attInput !== active) attInput.value = eff.attempt;
    const rightInput = tr.querySelector('[data-f="rightOvr"]');
    if (rightInput && rightInput !== active) rightInput.value = eff.right;
    const wrongInput = tr.querySelector('[data-f="wrongOvr"]');
    if (wrongInput && wrongInput !== active) wrongInput.value = eff.wrong;

    sections.forEach((key) => {
      const netInput = tr.querySelector('[data-f="' + key + 'Net"]');
      if (netInput) netInput.style.color = eff.nets[key] >= 0 ? "var(--md-primary)" : "var(--md-error)";
    });
  }

  function renderSheet() {
    const sections = CATEGORY_SECTIONS[activeCategory];
    const rows = mockData[activeCategory] || [];
    const tbody = $("#sheetBody");
    tbody.innerHTML = "";
    $("#sheetEmpty").hidden = rows.length > 0;

    rows.forEach((r, idx) => {
      let sectionCells = "";
      sections.forEach((key) => {
        const rawNet = r[key + "Net"];
        sectionCells += '<td><input type="number" data-f="' + key + 'Plus" value="' + (r[key + "Plus"] || 0) + '"></td>';
        sectionCells += '<td><input type="number" data-f="' + key + 'Minus" value="' + (r[key + "Minus"] || 0) + '"></td>';
        sectionCells += '<td><input type="number" step="0.01" data-f="' + key + 'Net" value="' + (rawNet === undefined || rawNet === null ? "" : rawNet) + '" placeholder="0" style="font-weight:700;"></td>';
      });
      const tr = document.createElement("tr");
      tr.innerHTML =
        '<td class="sno">' + (idx + 1) + "</td>" +
        '<td><input type="date" data-f="date" value="' + (r.date || "") + '"></td>' +
        '<td><input type="text" class="wide" list="examOptions" data-f="exam" value="' + escapeAttr(r.exam) + '" placeholder="Exam"></td>' +
        '<td><input type="text" class="wide" data-f="mockName" value="' + escapeAttr(r.mockName) + '" placeholder="Test name"></td>' +
        '<td><input type="number" data-f="rank" value="' + (r.rank || "") + '" placeholder="Rank"></td>' +
        '<td><input type="number" data-f="totalCandidates" value="' + (r.totalCandidates || "") + '" placeholder="Total"></td>' +
        '<td class="computed total-marks" style="font-weight:700;" title="Click to mark green / red">0</td>' +
        '<td class="pct-cell"><input type="number" step="0.01" data-f="percentile" value=""><span class="auto-tag" style="display:none;">auto</span></td>' +
        '<td><input type="number" step="0.01" data-f="accuracyOvr" style="font-weight:700;border-radius:6px;"></td>' +
        '<td class="computed"><input type="number" data-f="attemptOvr" style="font-weight:700;"></td>' +
        '<td class="computed right-cell"><input type="number" data-f="rightOvr" style="font-weight:700;"></td>' +
        '<td class="computed wrong-cell"><input type="number" data-f="wrongOvr" style="font-weight:700;"></td>' +
        sectionCells +
        '<td><button class="del-btn" type="button" title="Delete row">&times;</button></td>';
      tbody.appendChild(tr);
      updateComputedCells(tr, r, sections);

      tr.querySelectorAll("input").forEach((inp) => {
        inp.addEventListener("input", (e) => {
          const field = e.target.dataset.f;
          r[field] = e.target.type === "number" ? (e.target.value === "" ? "" : Number(e.target.value)) : e.target.value;
          persistSoon("mocktests-data", mockData);
          updateComputedCells(tr, r, sections);
          updateSummaryAndTrend(rows, sections);
        });
      });
      tr.querySelector(".total-marks").addEventListener("click", () => {
        r.marksColor = r.marksColor === "pos" ? "neg" : (r.marksColor === "neg" ? "" : "pos");
        persistSoon("mocktests-data", mockData);
        updateComputedCells(tr, r, sections);
      });
      tr.querySelector(".del-btn").addEventListener("click", () => {
        mockData[activeCategory] = mockData[activeCategory].filter((x) => x.id !== r.id);
        persistSoon("mocktests-data", mockData, 0);
        renderSheet();
      });
    });

    updateSummaryAndTrend(rows, sections);
  }

  function updateSummaryAndTrend(rows, sections) {
    const summaryEl = $("#trackerSummary");
    if (rows.length) {
      const marksArr = rows.map((r) => effectiveRow(r, sections).marks);
      const avgMarks = marksArr.reduce((a, b) => a + b, 0) / marksArr.length;
      const accArr = rows.map((r) => effectiveRow(r, sections).accuracy);
      const avgAcc = accArr.reduce((a, b) => a + b, 0) / accArr.length;
      summaryEl.innerHTML = "<div>Tests: <b>" + rows.length + "</b></div><div>Avg marks: <b>" + fmt(avgMarks) + "</b></div><div>Avg accuracy: <b>" + fmt(avgAcc) + "%</b></div>";
    } else {
      summaryEl.innerHTML = "";
    }
    drawTrend(rows);
  }

  function drawTrend(rows) {
    const svg = $("#trendSvg");
    svg.innerHTML = "";
    const sorted = rows.slice().sort((a, b) => a.date < b.date ? -1 : 1).slice(-12);
    if (sorted.length === 0) {
      svg.innerHTML = '<text x="300" y="60" fill="var(--md-on-surface-variant)" font-size="12" text-anchor="middle" font-family="Inter">Log tests in this sheet to see your marks trend</text>';
      return;
    }
    const W = 600, H = 120, padL = 36, padR = 16, padT = 14, padB = 22;
    const plotW = W - padL - padR;
    const plotH = H - padT - padB;
    const sections = CATEGORY_SECTIONS[activeCategory];
    const marksVals = sorted.map((r) => computeRow(r, sections).marks);
    const maxV = Math.max(10, ...marksVals);
    const pts = sorted.map((r, i) => {
      const x = padL + (sorted.length === 1 ? plotW / 2 : (i / (sorted.length - 1)) * plotW);
      const m = computeRow(r, sections).marks;
      const y = padT + plotH - (m / maxV) * plotH;
      return { x: x, y: y };
    });
    let html = "";
    [0, 0.5, 1].forEach((t) => {
      const y = padT + plotH - t * plotH;
      html += '<line x1="' + padL + '" y1="' + y + '" x2="' + (W - padR) + '" y2="' + y + '" stroke="var(--md-outline-variant)" stroke-width="1"/>';
      html += '<text x="' + (padL - 6) + '" y="' + (y + 3) + '" font-size="9" fill="var(--md-on-surface-variant)" text-anchor="end" font-family="monospace">' + Math.round(maxV * t) + "</text>";
    });
    const linePath = pts.map((p, i) => (i === 0 ? "M" : "L") + p.x.toFixed(1) + "," + p.y.toFixed(1)).join(" ");
    const areaPath = linePath + " L" + pts[pts.length - 1].x.toFixed(1) + "," + (padT + plotH) + " L" + pts[0].x.toFixed(1) + "," + (padT + plotH) + " Z";
    html += '<path d="' + areaPath + '" fill="var(--md-primary-container)" opacity="0.55" stroke="none"/>';
    html += '<path d="' + linePath + '" fill="none" stroke="var(--md-primary)" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"/>';
    pts.forEach((p) => {
      html += '<circle cx="' + p.x.toFixed(1) + '" cy="' + p.y.toFixed(1) + '" r="3.4" fill="var(--md-surface-container-lowest)" stroke="var(--md-primary)" stroke-width="2"/>';
    });
    svg.innerHTML = html;
  }

  /* ---------------- calendar ---------------- */

  let calMonth = new Date(todayStr() + "T00:00:00");
  calMonth.setDate(1);

  async function initCalendar() {
    events = await store.load("calendar-events", []);
    if (!Array.isArray(events)) events = [];
    renderCalendar();
  }

  function daysDiffFromToday(dateStr) {
    const d = new Date(dateStr + "T00:00:00");
    const today = new Date(todayStr() + "T00:00:00");
    return Math.round((d - today) / 86400000);
  }

  function renderCalendar() {
    const host = $("#calendarList");
    $("#calendarEmpty").hidden = events.length > 0;
    const sorted = events.slice().sort((a, b) => a.date < b.date ? -1 : 1);
    host.innerHTML = "";
    sorted.forEach((ev) => {
      const diff = daysDiffFromToday(ev.date);
      let badgeClass, badgeText;
      if (diff > 0) { badgeClass = "upcoming"; badgeText = diff + " day" + (diff === 1 ? "" : "s") + " left"; }
      else if (diff === 0) { badgeClass = "today"; badgeText = "Today"; }
      else { const past = Math.abs(diff); badgeClass = "past"; badgeText = past + " day" + (past === 1 ? "" : "s") + " past"; }

      const row = document.createElement("div");
      row.className = "event-item";
      row.dataset.id = ev.id;

      const title = document.createElement("input");
      title.type = "text";
      title.className = "wide";
      title.value = ev.title;
      title.placeholder = "Event title";
      title.dataset.f = "title";
      const date = document.createElement("input");
      date.type = "date";
      date.value = ev.date || "";
      date.dataset.f = "date";
      const badge = document.createElement("span");
      badge.className = "event-badge " + badgeClass;
      badge.textContent = badgeText;
      const del = document.createElement("button");
      del.type = "button";
      del.className = "del-btn";
      del.title = "Delete event";
      del.innerHTML = "&times;";

      [title, date].forEach((inp) => {
        inp.addEventListener("change", (e) => {
          ev[e.target.dataset.f] = e.target.value;
          persist("calendar-events", events);
          renderCalendar();
        });
      });
      del.addEventListener("click", () => {
        events = events.filter((x) => x.id !== ev.id);
        persist("calendar-events", events);
        renderCalendar();
      });

      row.append(title, date, badge, del);
      host.appendChild(row);
    });
    renderMonthGrid();
  }

  function renderMonthGrid() {
    const grid = $("#monthGrid");
    const label = $("#monthLabel");
    if (!grid || !label) return;
    label.textContent = calMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" });

    const year = calMonth.getFullYear();
    const month = calMonth.getMonth();
    const firstDow = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    const todayIso = todayStr();

    const byDate = {};
    events.forEach((ev) => {
      if (!ev.date) return;
      (byDate[ev.date] = byDate[ev.date] || []).push(ev);
    });

    let html = "";
    ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].forEach((d) => { html += '<div class="wd">' + d + "</div>"; });

    const totalCells = Math.ceil((firstDow + daysInMonth) / 7) * 7;
    for (let i = 0; i < totalCells; i++) {
      const dayNum = i - firstDow + 1;
      let cellDate, outside = false;
      if (dayNum < 1) { cellDate = new Date(year, month - 1, daysInPrevMonth + dayNum); outside = true; }
      else if (dayNum > daysInMonth) { cellDate = new Date(year, month + 1, dayNum - daysInMonth); outside = true; }
      else { cellDate = new Date(year, month, dayNum); }

      const iso = cellDate.getFullYear() + "-" + String(cellDate.getMonth() + 1).padStart(2, "0") + "-" + String(cellDate.getDate()).padStart(2, "0");
      const isToday = iso === todayIso;
      const dayEvents = byDate[iso] || [];
      const pillsHtml = dayEvents.map((ev) => {
        const diff = daysDiffFromToday(ev.date);
        const cls = diff > 0 ? "upcoming" : (diff === 0 ? "today-pill" : "past");
        return '<div class="month-pill ' + cls + '" data-id="' + ev.id + '" title="' + escapeAttr(ev.title) + '">' + escapeHtml(ev.title) + "</div>";
      }).join("");
      html += '<div class="month-cell' + (outside ? " outside" : "") + (isToday ? " today" : "") + (dayEvents.length ? " has-events" : "") + '" data-date="' + iso + '">' +
        '<div class="cell-date">' + cellDate.getDate() + "</div>" + pillsHtml + "</div>";
    }
    grid.innerHTML = html;

    grid.querySelectorAll(".month-pill").forEach((p) => {
      p.addEventListener("click", (e) => {
        e.stopPropagation();
        const row = document.querySelector('.event-item[data-id="' + p.dataset.id + '"]');
        if (row) {
          row.scrollIntoView({ behavior: "smooth", block: "center" });
          row.style.borderColor = "var(--md-primary)";
          setTimeout(() => { row.style.borderColor = ""; }, 1200);
        }
      });
    });
    grid.querySelectorAll(".month-cell").forEach((c) => {
      c.addEventListener("click", () => {
        $("#eventDateInput").value = c.dataset.date;
        $("#eventTitleInput").focus();
      });
    });
  }

  function addEvent() {
    const titleInp = $("#eventTitleInput");
    const dateInp = $("#eventDateInput");
    const title = titleInp.value.trim();
    const date = dateInp.value;
    if (!title || !date) {
      showToast("⚠️ Add both a title and a date.");
      return;
    }
    events.push({ id: uid(), title: title, date: date });
    persist("calendar-events", events);
    titleInp.value = "";
    dateInp.value = "";
    renderCalendar();
  }

  /* ---------------- review ---------------- */

  function renderReview() {
    const cardsHost = $("#reviewCards");
    const weekDates = [];
    for (let i = 6; i >= 0; i--) weekDates.push(daysAgoStr(i));

    const weekTodos = todos.filter((t) => weekDates.includes(t.date));
    const doneCount = weekTodos.filter((t) => t.done).length;
    const weekLog = pomoLog.filter((l) => weekDates.includes(l.date));
    const weekMinutes = weekLog.reduce((a, b) => a + b.minutes, 0);
    const weekNotes = notes.filter((n) => weekDates.includes(new Date(n.createdAt).toISOString().slice(0, 10)));
    let weekTests = 0;
    CATEGORIES.forEach((c) => {
      weekTests += (mockData[c] || []).filter((r) => weekDates.includes(r.date)).length;
    });

    cardsHost.innerHTML =
      '<div class="review-card"><div class="rv-label">Tasks completed</div><div class="rv-value">' + doneCount + "/" + weekTodos.length + '</div><div class="rv-sub">last 7 days</div></div>' +
      '<div class="review-card"><div class="rv-label">Focus time</div><div class="rv-value">' + weekMinutes + 'm</div><div class="rv-sub">' + weekLog.length + ' sessions this week</div></div>' +
      '<div class="review-card"><div class="rv-label">Notes written</div><div class="rv-value">' + weekNotes.length + '</div><div class="rv-sub">last 7 days</div></div>' +
      '<div class="review-card"><div class="rv-label">Mock tests logged</div><div class="rv-value">' + weekTests + '</div><div class="rv-sub">last 7 days</div></div>';

    const svg = $("#weekBarSvg");
    const W = 460, H = 160, padL = 30, padR = 10, padT = 10, padB = 24;
    const plotW = W - padL - padR;
    const plotH = H - padT - padB;
    const maxMin = Math.max(25, ...weekDates.map((d) => weekLog.filter((l) => l.date === d).reduce((a, b) => a + b.minutes, 0)));
    const barW = plotW / 7 * 0.6;
    let html = "";
    weekDates.forEach((d, i) => {
      const mins = weekLog.filter((l) => l.date === d).reduce((a, b) => a + b.minutes, 0);
      const x = padL + (i + 0.5) * (plotW / 7) - barW / 2;
      const barH = (mins / maxMin) * plotH;
      const y = padT + plotH - barH;
      html += '<rect x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + barW.toFixed(1) + '" height="' + barH.toFixed(1) + '" rx="4" fill="var(--md-primary)"/>';
      const lbl = new Date(d + "T00:00:00").toLocaleDateString("en-US", { weekday: "short" });
      html += '<text x="' + (x + barW / 2).toFixed(1) + '" y="' + (H - 6) + '" font-size="9" fill="var(--md-on-surface-variant)" text-anchor="middle" font-family="monospace">' + lbl + "</text>";
      if (mins > 0) html += '<text x="' + (x + barW / 2).toFixed(1) + '" y="' + (y - 4).toFixed(1) + '" font-size="9" fill="var(--md-primary)" text-anchor="middle" font-family="monospace">' + mins + "</text>";
    });
    svg.innerHTML = html;

    const notesHost = $("#reviewNotes");
    if (notes.length === 0) {
      notesHost.innerHTML = '<div class="empty-state">No notes yet.</div>';
    } else {
      notesHost.innerHTML = notes.slice().reverse().slice(0, 4).map((n) =>
        '<div class="note-card" style="position:static;">' +
        (n.title ? '<div class="n-title">' + escapeHtml(n.title) + "</div>" : "") +
        '<div class="n-body">' + escapeHtml(n.body.slice(0, 140)) + (n.body.length > 140 ? "…" : "") + "</div></div>"
      ).join("");
    }

    const trackerBody = $("#reviewTrackerBody");
    trackerBody.innerHTML = CATEGORIES.map((cat) => {
      const rows = mockData[cat] || [];
      if (rows.length === 0) return "<tr><td>" + cat + "</td><td>0</td><td>—</td><td>—</td><td>—</td></tr>";
      const sections = CATEGORY_SECTIONS[cat];
      const marksArr = rows.map((r) => computeRow(r, sections).marks);
      const accArr = rows.map((r) => computeRow(r, sections).accuracy);
      const avgMarks = marksArr.reduce((a, b) => a + b, 0) / marksArr.length;
      const avgAcc = accArr.reduce((a, b) => a + b, 0) / accArr.length;
      const sorted = rows.slice().sort((a, b) => a.date < b.date ? 1 : -1);
      const latestComputed = computeRow(sorted[0], sections);
      let latestPct = "—";
      if (latestComputed.percentile !== null) latestPct = fmt(latestComputed.percentile) + "%";
      else if (sorted[0].percentile !== "") latestPct = sorted[0].percentile + "%";
      return "<tr><td>" + cat + "</td><td>" + rows.length + "</td><td>" + fmt(avgMarks) + "</td><td>" + fmt(avgAcc) + "%</td><td>" + latestPct + "</td></tr>";
    }).join("");
  }

  /* ---------------- backup ---------------- */

  function gatherBackup() {
    return {
      app: "Study Deck",
      version: 2,
      exportedAt: new Date().toISOString(),
      theme: resolvedTheme(),
      settings: settings,
      dock: dockItems,
      todos: todos,
      notes: notes,
      pomodoro: { date: pomo.date, sessionsToday: pomo.sessionsToday, focusMinsToday: pomo.focusMinsToday, durations: durations },
      pomodoroLog: pomoLog,
      mocktests: mockData,
      calendarEvents: events
    };
  }

  function exportBackup() {
    const data = gatherBackup();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "study-deck-backup-" + todayStr() + ".json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    showToast("📁 Backup downloaded. Import it in Chrome or Firefox to move your data across browsers.");
  }

  async function importBackupFile(file) {
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      if (!data || typeof data !== "object") throw new Error("Invalid backup");

      if (Array.isArray(data.todos)) todos = data.todos;
      if (Array.isArray(data.notes)) notes = data.notes;
      if (data.pomodoro) {
        pomo.sessionsToday = data.pomodoro.date === todayStr() ? (data.pomodoro.sessionsToday || 0) : 0;
        pomo.focusMinsToday = data.pomodoro.date === todayStr() ? (data.pomodoro.focusMinsToday || 0) : 0;
        if (data.pomodoro.durations) durations = Object.assign({ work: 25, short: 5, long: 15 }, data.pomodoro.durations);
        pomo.date = todayStr();
      }
      if (Array.isArray(data.pomodoroLog)) pomoLog = data.pomodoroLog;
      if (data.mocktests && typeof data.mocktests === "object") {
        mockData = data.mocktests;
        CATEGORIES.forEach((c) => { if (!Array.isArray(mockData[c])) mockData[c] = []; });
      }
      if (Array.isArray(data.calendarEvents)) events = data.calendarEvents;

      if (data.settings && typeof data.settings === "object") {
        settings = normalizeSettings(data.settings);
      } else if (data.theme === "light" || data.theme === "dark") {
        settings.theme = data.theme;
      }
      if (Array.isArray(data.dock)) {
        dockItems = data.dock
          .filter((d) => d && d.url && normalizeUrl(d.url))
          .map((d) => ({ id: d.id || uid(), title: d.title || hostOf(d.url), url: normalizeUrl(d.url) }));
      }
      if (!store.syncAvailable) settings.syncEnabled = false;
      store.setSyncEnabled(settings.syncEnabled);

      await Promise.all([
        store.save("todos-list", todos),
        store.save("notes-list", notes),
        store.save("pomodoro-data", { date: todayStr(), sessionsToday: pomo.sessionsToday, focusMinsToday: pomo.focusMinsToday, durations: durations }),
        store.save("pomodoro-log", pomoLog),
        store.save("mocktests-data", mockData),
        store.save("calendar-events", events),
        store.save("dock-items", dockItems),
        store.save("ui-settings", settings)
      ]);

      if (settings.syncEnabled) await store.pushAll();

      applySettings();
      renderTodos();
      renderNotes();
      renderSheetTabs();
      renderSheet();
      renderCalendar();
      renderPomodoroInputs();
      updateStatsUI();
      renderDockSettings();
      renderStorageUi();
      showToast("✅ Backup imported successfully.");
    } catch (e) {
      showToast("⚠️ Could not read that file — make sure it’s a Study Deck backup JSON.");
    }
  }

  function renderPomodoroInputs() {
    $("#workLen").value = durations.work;
    $("#shortLen").value = durations.short;
    $("#longLen").value = durations.long;
    pomo.remaining = modeLen(pomo.mode);
    updatePomoUI();
  }

  /* ---------------- static UI bindings ---------------- */

  let bound = false;
  function bindUI() {
    if (bound) return;
    bound = true;

    /* tabs */
    $("#tabbar").addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-tab]");
      if (btn) selectTab(btn.dataset.tab);
    });

    /* theme quick toggle */
    $("#themeToggle").addEventListener("click", () => {
      settings.theme = resolvedTheme() === "dark" ? "light" : "dark";
      applySettings();
      saveSettings();
    });

    /* settings switches and selects */
    $$("[data-setting]").forEach((el) => {
      const key = el.dataset.setting;
      if (el.type === "range") {
        el.addEventListener("input", () => {
          settings[key] = Number(el.value);
          if (key === "dockSize") {
            rootEl.style.setProperty("--dock-size", settings.dockSize + "px");
            renderDock();
          } else if (key === "glassStrength") {
            applySurfaceStyle();
          }
          persistBootTheme();
        });
        el.addEventListener("change", () => saveSettings());
      } else {
        el.addEventListener("change", () => {
          let value = el.type === "checkbox" ? el.checked : el.value;
          updateSetting(key, value);
        });
      }
    });

    /* settings tabs */
    $("#settingsTabs").addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-settings-tab]");
      if (btn) selectSettingsTab(btn.dataset.settingsTab);
    });

    /* theme / background segmented controls */
    $$("#themeSeg [data-theme-choice]").forEach((b) => {
      b.addEventListener("click", () => {
        settings.theme = b.dataset.themeChoice;
        applySettings();
        saveSettings();
      });
    });
    $$("#bgSeg [data-bg-choice]").forEach((b) => {
      b.addEventListener("click", () => {
        settings.background = b.dataset.bgChoice;
        applySettings();
        saveSettings();
      });
    });
    $$("#surfaceSeg [data-surface-choice]").forEach((b) => {
      b.addEventListener("click", () => {
        settings.surfaceStyle = b.dataset.surfaceChoice;
        applySettings();
        saveSettings();
      });
    });
    $$("#homeLayoutSeg [data-home-layout]").forEach((b) => {
      b.addEventListener("click", () => {
        settings.homeLayout = b.dataset.homeLayout;
        applySettings();
        saveSettings();
      });
    });

    /* clock faces */
    $("#clockChoices").addEventListener("click", (e) => {
      const btn = e.target.closest("[data-clock-style]");
      if (!btn) return;
      settings.clockStyle = btn.dataset.clockStyle;
      applySettings();
      saveSettings();
    });

    /* widget positions */
    $("#widgetReset").addEventListener("click", () => {
      resetWidgetPositions();
      showToast("Widget positions reset.");
    });

    let widgetResizeFrame = null;
    window.addEventListener("resize", () => {
      if (widgetResizeFrame) return;
      widgetResizeFrame = requestAnimationFrame(() => {
        widgetResizeFrame = null;
        applyWidgetLayout();
      });
    });

    /* dialogs */
    $("#settingsBtn").addEventListener("click", () => openSettings("appearance"));
    $("#railSettingsBtn").addEventListener("click", () => openSettings("appearance"));
    $("#settingsClose").addEventListener("click", closeSettings);
    $("#settingsDone").addEventListener("click", closeSettings);
    $("#settingsReset").addEventListener("click", () => {
      if (!confirm("Reset all appearance, layout, search and dock-behaviour settings to defaults? Your study data is kept.")) return;
      settings = normalizeSettings({});
      if (!store.syncAvailable) settings.syncEnabled = false;
      applySettings();
      store.save("ui-settings", settings);
      renderStorageUi();
      showToast("Settings reset to defaults.");
    });

    $("#appsBtn").addEventListener("click", openApps);
    $("#appsClose").addEventListener("click", closeApps);
    $("#appsSettings").addEventListener("click", () => {
      closeApps();
      openSettings("layout");
    });
    $("#appsDialog").addEventListener("click", (e) => {
      if (e.target === $("#appsDialog")) closeApps();
    });
    $("#settingsDialog").addEventListener("click", (e) => {
      if (e.target === $("#settingsDialog")) closeSettings();
    });
    ["#appsDialog", "#settingsDialog"].forEach((sel) => {
      $(sel).addEventListener("close", () => document.body.classList.remove("locked"));
    });

    /* bookmarks */
    $("#bookmarksBtn").addEventListener("click", openBookmarks);
    $("#bookmarksClose").addEventListener("click", closeBookmarks);
    $("#scrim").addEventListener("click", closeBookmarks);
    $("#bookmarksSearch").addEventListener("input", renderBookmarks);

    /* search */
    $("#searchForm").addEventListener("submit", (e) => {
      e.preventDefault();
      runSearch();
    });
    $("#searchInput").addEventListener("input", () => {
      $("#searchClear").hidden = !$("#searchInput").value;
    });
    $("#searchClear").addEventListener("click", () => {
      $("#searchInput").value = "";
      $("#searchClear").hidden = true;
      $("#searchInput").focus();
    });

    /* home dashboard */
    $("#homeSearchForm").addEventListener("submit", (e) => {
      e.preventDefault();
      runHomeSearch();
    });
    $("#homeSearchInput").addEventListener("input", () => {
      $("#homeSearchClear").hidden = !$("#homeSearchInput").value;
    });
    $("#homeSearchClear").addEventListener("click", () => {
      $("#homeSearchInput").value = "";
      $("#homeSearchClear").hidden = true;
      $("#homeSearchInput").focus();
    });
    $("#homeTaskForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const input = $("#homeTaskInput");
      const text = input.value.trim();
      if (!text) { input.focus(); return; }
      todos.push({ id: uid(), text: text, time: null, done: false, notified: false, date: todayStr() });
      persist("todos-list", todos);
      input.value = "";
      renderTodos();
      input.focus();
    });
    $("#homeOpenTodo").addEventListener("click", () => {
      selectTab("todo");
      const input = $("#todoInput");
      if (input) input.focus();
    });
    $("#homePomoStart").addEventListener("click", toggleTimer);
    $("#homePomoReset").addEventListener("click", () => {
      clearInterval(pomoInterval);
      pomoInterval = null;
      pomo.running = false;
      pomo.remaining = modeLen(pomo.mode);
      updatePomoUI();
    });

    /* todos */
    $("#addTodoBtn").addEventListener("click", addTodo);
    $("#todoInput").addEventListener("keydown", (e) => { if (e.key === "Enter") addTodo(); });

    /* notes */
    $("#addNoteBtn").addEventListener("click", addNote);

    /* pomodoro */
    $("#pomoStart").addEventListener("click", toggleTimer);
    $("#pomoReset").addEventListener("click", () => {
      clearInterval(pomoInterval);
      pomoInterval = null;
      pomo.running = false;
      pomo.remaining = modeLen(pomo.mode);
      updatePomoUI();
    });
    $$(".mode-btn").forEach((b) => b.addEventListener("click", () => switchMode(b.dataset.mode, false)));
    ["workLen", "shortLen", "longLen"].forEach((id, i) => {
      const keys = ["work", "short", "long"];
      $("#" + id).addEventListener("change", (e) => {
        let v = parseInt(e.target.value, 10) || 1;
        v = Math.max(1, v);
        e.target.value = v;
        durations[keys[i]] = v;
        if (pomo.mode === keys[i] && !pomo.running) {
          pomo.remaining = v * 60;
          updatePomoUI();
        }
        savePomoData();
      });
    });
    (function initPomoTriggerTouch() {
      const trigger = $("#pomoTrigger");
      trigger.addEventListener("click", (e) => {
        if (e.target.closest(".pomo-popup")) return;
        trigger.classList.toggle("force-open");
      });
      document.addEventListener("click", (e) => {
        if (!trigger.contains(e.target)) trigger.classList.remove("force-open");
      });
    })();

    /* tracker */
    $("#addRowBtn").addEventListener("click", () => {
      mockData[activeCategory].push(blankRow());
      persist("mocktests-data", mockData);
      renderSheet();
    });

    /* calendar */
    $("#prevMonthBtn").addEventListener("click", () => { calMonth.setMonth(calMonth.getMonth() - 1); renderMonthGrid(); });
    $("#nextMonthBtn").addEventListener("click", () => { calMonth.setMonth(calMonth.getMonth() + 1); renderMonthGrid(); });
    $("#todayMonthBtn").addEventListener("click", () => {
      calMonth = new Date(todayStr() + "T00:00:00");
      calMonth.setDate(1);
      renderMonthGrid();
    });
    $("#addEventBtn").addEventListener("click", addEvent);
    $("#eventTitleInput").addEventListener("keydown", (e) => { if (e.key === "Enter") addEvent(); });

    /* dock settings */
    $("#dockAddForm").addEventListener("submit", (e) => {
      e.preventDefault();
      if (addDockItem($("#dockTitle").value, $("#dockUrl").value)) {
        $("#dockTitle").value = "";
        $("#dockUrl").value = "";
        showToast("Favourite added to the dock.");
      }
    });
    $("#dockReset").addEventListener("click", resetDockDefaults);

    /* data & sync */
    $("#syncToggle").addEventListener("change", async () => {
      settings.syncEnabled = $("#syncToggle").checked && store.syncAvailable;
      store.setSyncEnabled(settings.syncEnabled);
      await store.save("ui-settings", settings);
      if (settings.syncEnabled) {
        showToast("☁️ Browser sync enabled.");
        await store.pushAll();
      } else {
        showToast("Sync paused — data stays on this device.");
      }
      renderStorageUi();
    });
    $("#exportBtn").addEventListener("click", exportBackup);
    $("#importBtn").addEventListener("click", () => $("#importFile").click());
    $("#importFile").addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) importBackupFile(file);
      e.target.value = "";
    });
    $("#clearDataBtn").addEventListener("click", async () => {
      if (!confirm("Delete all Study Deck data from this browser and from browser sync? This cannot be undone.")) return;
      await store.clearAll();
      location.reload();
    });

    /* keyboard shortcuts */
    document.addEventListener("keydown", (e) => {
      const tag = document.activeElement ? document.activeElement.tagName : "";
      const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(tag);
      if ((e.key === "/" && !typing) || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k")) {
        const onHome = activePanelName() === "home";
        const field = onHome && settings.showHomeSearch ? $("#homeSearchInput") : settings.showSearch ? $("#searchInput") : null;
        if (field) {
          e.preventDefault();
          field.focus();
          field.select();
        }
      }
      if (e.key === "Escape") {
        if ($("#bookmarksPanel").classList.contains("open")) closeBookmarks();
      }
    });

    /* flush pending sync writes when the page is hidden */
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) store.flush();
    });

    /* system theme changes */
    if (systemTheme.addEventListener) {
      systemTheme.addEventListener("change", () => {
        if (settings.theme === "system") applySettings();
      });
    }
  }

  /* ---------------- boot ---------------- */

  async function boot() {
    const savedSettings = await store.load("ui-settings", null);
    settings = normalizeSettings(savedSettings);

    if (!savedSettings) {
      const legacyTheme = await store.load("ui-theme", null);
      if (legacyTheme === "light" || legacyTheme === "dark") settings.theme = legacyTheme;
    }
    if (!store.syncAvailable) settings.syncEnabled = false;
    store.setSyncEnabled(settings.syncEnabled);

    const storedDock = await store.load("dock-items", null);
    if (Array.isArray(storedDock) && storedDock.length) {
      dockItems = storedDock
        .filter((d) => d && d.url)
        .map((d) => ({ id: d.id || uid(), title: d.title || hostOf(d.url), url: d.url }));
    } else {
      dockItems = DEFAULT_DOCK.map((d) => ({ id: uid(), title: d.title, url: d.url }));
      await store.save("dock-items", dockItems);
    }

    buildAccentSwatches();
    buildClockChoices();
    renderApps();
    bindUI();
    const widgetLayer = $("#widgetLayer");
    if (widgetLayer) widgetLayer.classList.add("no-anim");
    applySettings();
    requestAnimationFrame(() => {
      if (widgetLayer) widgetLayer.classList.remove("no-anim");
    });
    setupDockMagnify();
    setupWidgetDragging();

    const dateInput = $("#todoDate");
    if (dateInput) dateInput.value = todayStr();

    await Promise.all([initTodos(), initNotes(), initPomo(), initTracker(), initCalendar()]);

    renderHome();
    updateDateTime();
    setInterval(updateDateTime, 1000);
    setInterval(updateHomeGreeting, 60000);
    store.onStatus(renderSyncStatus);

    if (window.matchMedia("(pointer: fine)").matches) {
      const onHome = activePanelName() === "home";
      const field = onHome && settings.showHomeSearch ? $("#homeSearchInput") : settings.showSearch ? $("#searchInput") : null;
      if (field) setTimeout(() => field.focus({ preventScroll: true }), 250);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
