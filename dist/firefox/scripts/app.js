/* ==================================================================
   Study Deck — application logic
   ================================================================== */
(function () {
  "use strict";

  /* ---------------- constants ---------------- */

  const DEFAULT_SETTINGS = {
    theme: "system",
    accent: "blue",
    customAccent: "",
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
    myntIcons: true,
    clockStyle: "analog",
    clockSeconds: true,
    clockShowDate: true,
    widgetPositions: {
      clock: { ax: "left", ay: "top" },
      search: { ax: "center", ay: "top" },
      actions: { ax: "right", ay: "top" },
      dock: { ax: "center", ay: "bottom" }
    },
    surfaceStyle: "glass",
    glassStrength: 62,
    glassGlow: true,
    wallpaperImage: "",
    wallpaperBgBlur: 0,
    wallpaperPalette: [],
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

  /* MYNT-style tonal palettes: six roles per colour plus derived link/on. */
  const ACCENTS = {
    blue: { name: "Blue", swatch: "#4382EC", bg: "#BBD6FD", tint: "#E2EEFF", dark: "#4382EC", darker: "#3569B2", text: "#1B3041", link: "#294F7F" },
    red: { name: "Red", swatch: "#EC4343", bg: "#FDBDBD", tint: "#FFE7E7", dark: "#EC4343", darker: "#B23535", text: "#411B1B", link: "#7F2929" },
    yellow: { name: "Yellow", swatch: "#D1A93D", bg: "#FFED80", tint: "#FFF6C3", dark: "#D1A93D", darker: "#AE9502", text: "#2F2707", link: "#756404" },
    green: { name: "Green", swatch: "#5CBA5C", bg: "#C7E4C7", tint: "#E1F1E1", dark: "#5CBA5C", darker: "#458245", text: "#1B411B", link: "#326532" },
    cyan: { name: "Cyan", swatch: "#09B2B4", bg: "#9CEFEF", tint: "#D5FFFF", dark: "#09B2B4", darker: "#07787F", text: "#08354B", link: "#075A68" },
    pink: { name: "Pink", swatch: "#EC5E78", bg: "#F9C8D6", tint: "#FFEBF2", dark: "#EC5E78", darker: "#B24B64", text: "#411B28", link: "#7F3549" },
    orange: { name: "Orange", swatch: "#EC844D", bg: "#FFD8B2", tint: "#FFEDD5", dark: "#EC844D", darker: "#A65E2E", text: "#412B1E", link: "#794727" },
    purple: { name: "Purple", swatch: "#9563B5", bg: "#DAC2E8", tint: "#E9E2F3", dark: "#9563B5", darker: "#724B8F", text: "#2D1B3E", link: "#53356B" },
    silver: { name: "Silver", swatch: "#9E9E9E", bg: "#C6C6C6", tint: "#E5E5E5", dark: "#9E9E9E", darker: "#6F6F6F", text: "#333333", link: "#4F4F4F" },
    brown: { name: "Brown", swatch: "#705347", bg: "#DFC28D", tint: "#EAE3C9", dark: "#705347", darker: "#4E3930", text: "#16100D", link: "#352720" },
    peach: { name: "Peach", swatch: "#E8705C", bg: "#FFCCBF", tint: "#FDF1EF", dark: "#E8705C", darker: "#B24E3E", text: "#441730", link: "#803538" }
  };

  const ENGINES = {
    google: { name: "Google", url: "https://www.google.com/search?q=", mark: "G", color: "#4285F4" },
    bing: { name: "Bing", url: "https://www.bing.com/search?q=", mark: "b", color: "#00809D" },
    duckduckgo: { name: "DuckDuckGo", url: "https://duckduckgo.com/?q=", mark: "D", color: "#DE5833" },
    brave: { name: "Brave Search", url: "https://search.brave.com/search?q=", mark: "B", color: "#FB542B" },
    ecosia: { name: "Ecosia", url: "https://www.ecosia.org/search?q=", mark: "E", color: "#1D6B4F" },
    youtube: { name: "YouTube", url: "https://www.youtube.com/results?search_query=", mark: "▶", color: "#FF0000" }
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
  function faviconSources(url, size) {
    const sources = [];
    try {
      const host = new URL(url).hostname;
      const px = Math.max(16, Number(size) || 64);
      try {
        if (typeof chrome !== "undefined" && chrome.runtime && typeof chrome.runtime.getURL === "function") {
          sources.push(chrome.runtime.getURL("/_favicon/?pageUrl=" + encodeURIComponent(url) + "&size=" + px));
        }
      } catch (e) { /* _favicon is Chrome-only */ }
      sources.push("https://www.google.com/s2/favicons?sz=" + px + "&domain=" + encodeURIComponent(host));
      sources.push("https://icons.duckduckgo.com/ip3/" + encodeURIComponent(host) + ".ico");
    } catch (e) { /* ignore malformed URLs */ }
    return sources;
  }

  /* Favicons load eagerly: a hidden/lazy image never starts its request. */
  function attachFavicon(container, url, size, letter) {
    const sources = faviconSources(url, size);
    if (!container || !sources.length) return null;
    const img = document.createElement("img");
    img.alt = "";
    img.className = "favicon-img";
    img.referrerPolicy = "no-referrer";
    img.decoding = "async";
    let next = 0;
    const step = () => {
      if (next >= sources.length) { img.remove(); return; }
      img.src = sources[next++];
    };
    img.addEventListener("load", () => {
      img.classList.add("is-loaded");
      if (letter) letter.style.display = "none";
    });
    img.addEventListener("error", step);
    container.appendChild(img);
    step();
    return img;
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
  let pomo = { mode: "work", remaining: 25 * 60, running: false, endAt: null, sessionsToday: 0, focusMinsToday: 0, date: todayStr() };
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
    if (typeof s.customAccent !== "string" || !/^#[0-9a-f]{6}$/i.test(s.customAccent)) s.customAccent = "";
    if (s.accent === "custom" && !s.customAccent) s.accent = "blue";
    if (s.accent !== "custom" && !ACCENTS[s.accent]) s.accent = "blue";
    if (!["gradient", "soft", "plain", "image"].includes(s.background)) s.background = "gradient";
    if (typeof s.wallpaperImage !== "string") s.wallpaperImage = "";
    s.wallpaperBgBlur = clamp(Number(s.wallpaperBgBlur) || 0, 0, 40);
    s.wallpaperPalette = Array.isArray(s.wallpaperPalette) ? s.wallpaperPalette.filter((c) => typeof c === "string") : [];
    if (!ENGINES[s.engine]) s.engine = "google";
    s.dockSize = clamp(Number(s.dockSize) || 58, 44, 76);
    s.myntIcons = s.myntIcons !== false;
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

  function mixHex(a, b, t) {
    const pa = hexRgb(a);
    const pb = hexRgb(b);
    const k = clamp(t, 0, 1);
    const ch = (i) => Math.round(pa[i] + (pb[i] - pa[i]) * k).toString(16).padStart(2, "0");
    return "#" + ch(0) + ch(1) + ch(2);
  }

  function hexRgb(hex) {
    let h = String(hex || "").replace("#", "").trim();
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    if (!/^[0-9a-f]{6}$/i.test(h)) return [0, 0, 0];
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
  }

  function relLuminance(hex) {
    const c = hexRgb(hex).map((v) => {
      const s = v / 255;
      return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  }

  function contrastRatio(a, b) {
    const l1 = relLuminance(a);
    const l2 = relLuminance(b);
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  }

  /* Pick the label colour that keeps an accent fill at WCAG AA. */
  function onColor(fill, ink) {
    if (contrastRatio(fill, ink) >= 4.5) return ink;
    if (contrastRatio(fill, "#FFFFFF") >= 4.5) return "#FFFFFF";
    return contrastRatio(fill, "#FFFFFF") >= contrastRatio(fill, ink) ? "#FFFFFF" : ink;
  }

  function paletteFromHex(hex) {
    const base = /^#[0-9a-f]{6}$/i.test(hex || "") ? hex : "#696969";
    const fill = mixHex(base, "#000000", 0.30);
    const text = mixHex(base, "#000000", 0.85);
    return {
      name: "Custom",
      swatch: base,
      bg: mixHex(base, "#FFFFFF", 0.70),
      tint: mixHex(base, "#FFFFFF", 0.90),
      dark: base,
      darker: fill,
      text,
      link: mixHex(fill, text, 0.45)
    };
  }

  function activePalette() {
    const p = settings.accent === "custom" && settings.customAccent
      ? paletteFromHex(settings.customAccent)
      : (ACCENTS[settings.accent] || ACCENTS.blue);
    return Object.assign({}, p, {
      link: p.link || mixHex(p.darker, p.text, 0.45),
      on: onColor(p.darker, p.text)
    });
  }

  function applyAccentTokens() {
    const p = activePalette();
    const dark = rootEl.getAttribute("data-theme") === "dark";
    const set = (name, value) => rootEl.style.setProperty(name, value);

    /* Semantic roles: fill + label stay separate from text/link colours so
       every palette can pass WCAG AA in both modes. */
    if (dark) {
      const surface = mixHex("#141312", p.dark, 0.05);
      const lowest = mixHex("#0E0D0C", p.dark, 0.04);
      const tint = mixHex("#2B2724", p.dark, 0.20);
      const link = mixHex(p.dark, "#FFFFFF", 0.55);

      set("--mynt-bg", surface);
      set("--mynt-tint", tint);
      set("--mynt-dark", mixHex(p.dark, "#FFFFFF", 0.30));
      set("--mynt-darker", mixHex(p.dark, "#FFFFFF", 0.45));
      set("--mynt-text", "#ECE5E0");
      set("--mynt-on", "#1B1918");
      set("--action", mixHex(p.dark, "#FFFFFF", 0.45));
      set("--on-action", "#1B1918");
      set("--link", link);
      set("--focus-ring", link);

      set("--md-primary", link);
      set("--md-on-primary", "#1B1918");
      set("--md-primary-container", mixHex(p.dark, "#1B1918", 0.72));
      set("--md-on-primary-container", mixHex(p.dark, "#FFFFFF", 0.84));
      set("--md-secondary", mixHex(p.dark, "#FFFFFF", 0.55));
      set("--md-secondary-container", mixHex(p.dark, "#1B1918", 0.78));
      set("--md-on-secondary-container", mixHex(p.dark, "#FFFFFF", 0.86));
      set("--md-tertiary", mixHex(p.bg, "#FFFFFF", 0.62));
      set("--md-tertiary-container", mixHex(p.bg, "#1B1918", 0.74));
      set("--md-on-tertiary-container", mixHex(p.bg, "#FFFFFF", 0.86));
      set("--md-surface", surface);
      set("--md-surface-dim", lowest);
      set("--md-surface-container-lowest", lowest);
      set("--md-surface-container-low", mixHex("#1B1918", p.dark, 0.06));
      set("--md-surface-container", mixHex("#201D1B", p.dark, 0.07));
      set("--md-surface-container-high", mixHex("#282422", p.dark, 0.08));
      set("--md-surface-container-highest", mixHex("#322D2A", p.dark, 0.09));
      set("--md-on-surface", "#ECE5E0");
      set("--md-on-surface-variant", "#CFC5BE");
      set("--md-outline", "#978E88");
      set("--md-outline-variant", "#4B4642");
      set("--md-inverse-surface", "#ECE5E0");
      set("--md-inverse-on-surface", "#2A2725");
      set("--md-scrim", "rgba(0, 0, 0, 0.55)");
    } else {
      set("--mynt-bg", p.bg);
      set("--mynt-tint", p.tint);
      set("--mynt-dark", p.dark);
      set("--mynt-darker", p.darker);
      set("--mynt-text", p.text);
      set("--mynt-on", p.on);
      set("--action", p.darker);
      set("--on-action", p.on);
      set("--link", p.link);
      set("--focus-ring", p.link);

      set("--md-primary", p.link);
      set("--md-on-primary", "#FFFFFF");
      set("--md-primary-container", p.tint);
      set("--md-on-primary-container", p.text);
      set("--md-secondary", p.link);
      set("--md-secondary-container", p.tint);
      set("--md-on-secondary-container", p.text);
      set("--md-tertiary", mixHex(p.dark, p.text, 0.30));
      set("--md-tertiary-container", mixHex(p.tint, p.bg, 0.45));
      set("--md-on-tertiary-container", p.text);
      set("--md-surface", p.bg);
      set("--md-surface-dim", mixHex(p.bg, p.text, 0.06));
      set("--md-surface-container-lowest", "#FFFFFF");
      set("--md-surface-container-low", mixHex(p.bg, "#FFFFFF", 0.72));
      set("--md-surface-container", mixHex(p.bg, "#FFFFFF", 0.52));
      set("--md-surface-container-high", mixHex(p.bg, "#FFFFFF", 0.32));
      set("--md-surface-container-highest", mixHex(p.tint, p.bg, 0.55));
      set("--md-on-surface", p.text);
      set("--md-on-surface-variant", mixHex(p.text, p.bg, 0.16));
      set("--md-outline", mixHex(p.text, p.bg, 0.42));
      set("--md-outline-variant", mixHex(p.text, p.bg, 0.18));
      set("--md-inverse-surface", p.text);
      set("--md-inverse-on-surface", p.tint);
      set("--md-scrim", "rgba(20, 18, 24, 0.31)");
    }
    rootEl.setAttribute("data-accent", settings.accent);
  }

  /* Derive the deck accent from a wallpaper image (average dominant colour,
     snapped to the nearest tonal accent). */
  function wallpaperAccentFromImage(dataUrl) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        try {
          const c = document.createElement("canvas");
          c.width = 48;
          c.height = 48;
          const ctx = c.getContext("2d");
          ctx.drawImage(img, 0, 0, 48, 48);
          const d = ctx.getImageData(0, 0, 48, 48).data;
          let r = 0;
          let g = 0;
          let b = 0;
          let n = 0;
          for (let i = 0; i < d.length; i += 4) {
            r += d[i];
            g += d[i + 1];
            b += d[i + 2];
            n++;
          }
          r /= n;
          g /= n;
          b /= n;
          const hex = "#" + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("").toUpperCase();
          let bestKey = "blue";
          let bestDist = Infinity;
          Object.keys(ACCENTS).forEach((k) => {
            const p = ACCENTS[k];
            const dr = r - parseInt(p.swatch.slice(1), 16);
            const dg = g - parseInt(p.swatch.slice(3, 5), 16);
            const db = b - parseInt(p.swatch.slice(5, 7), 16);
            const dist = dr * dr + dg * dg + db * db;
            if (dist < bestDist) {
              bestDist = dist;
              bestKey = k;
            }
          });
          resolve(bestKey);
        } catch (e) {
          resolve(null);
        }
      };
      img.onerror = () => resolve(null);
      img.src = dataUrl;
    });
  }

  function applyWallpaperBgBlur() {
    const v = Number.isFinite(Number(settings.wallpaperBgBlur)) ? Number(settings.wallpaperBgBlur) : 0;
    rootEl.style.setProperty("--wallpaper-bg-blur", Math.max(0, Math.min(40, Math.round(v))).toFixed(0) + "px");
  }

  /* Extract up to `count` quantised colours from a wallpaper image. */
  function extractWallpaperPalette(dataUrl, count) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        try {
          const c = document.createElement("canvas");
          c.width = 64;
          c.height = 64;
          const ctx = c.getContext("2d");
          ctx.drawImage(img, 0, 0, 64, 64);
          const d = ctx.getImageData(0, 0, 64, 64).data;
          const buckets = new Map();
          for (let i = 0; i < d.length; i += 4) {
            const r = (d[i] >> 4) * 16;
            const g = (d[i + 1] >> 4) * 16;
            const b = (d[i + 2] >> 4) * 16;
            const key = (r << 16) | (g << 8) | b;
            if (!buckets.has(key)) buckets.set(key, { r, g, b, n: 0 });
            buckets.get(key).n += 1;
          }
          const top = Array.from(buckets.values()).sort((a, b2) => b2.n - a.n).slice(0, count || 4);
          const palette = top.map((b) => "#" + [b.r, b.g, b.b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("").toUpperCase());
          resolve(palette);
        } catch (e) {
          resolve([]);
        }
      };
      img.onerror = () => resolve([]);
      img.src = dataUrl;
    });
  }

  function renderWallpaperPalette() {
    const host = $("#wallpaperPalette");
    if (!host) return;
    host.innerHTML = "";
    const palette = Array.isArray(settings.wallpaperPalette) ? settings.wallpaperPalette : [];
    if (!palette.length) {
      host.hidden = true;
      return;
    }
    host.hidden = false;
    palette.forEach((hex) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "wallpaper-palette-swatch";
      b.style.background = hex;
      b.dataset.paletteHex = hex;
      b.addEventListener("click", () => {
        settings.accent = "custom";
        settings.customAccent = hex;
        applySettings();
        saveSettings();
        persistBootTheme();
      });
      const label = document.createElement("span");
      label.className = "wallpaper-palette-hex";
      label.textContent = hex;
      b.appendChild(label);
      host.appendChild(b);
    });
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
    setWidgetHidden("actions", !(settings.showAppsBtn || settings.showBookmarksBtn));
    setWidgetHidden("dock", !settings.showDock);

    $("#pomoTrigger").hidden = !settings.showPomodoro;
    $("#appsBtn").hidden = !settings.showAppsBtn;
    $("#bookmarksBtn").hidden = !settings.showBookmarksBtn;
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

  const GOOGLE_LOGO_SVG =
    '<svg viewBox="0 0 48 48" aria-hidden="true">' +
      '<path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>' +
      '<path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>' +
      '<path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>' +
      '<path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>' +
    '</svg>';

  function engineLogoMarkup(key) {
    if (key === "google") return GOOGLE_LOGO_SVG;
    const engine = ENGINES[key] || ENGINES.google;
    return '<span class="engine-mark" style="--engine-color:' + engine.color + '">' + engine.mark + "</span>";
  }

  function applySearchEngineBranding() {
    const key = ENGINES[settings.engine] ? settings.engine : "google";
    const engine = ENGINES[key];
    const label = "Search " + engine.name + " or type a URL";
    ["#searchInput", "#homeSearchInput"].forEach((sel) => {
      const input = $(sel);
      if (!input) return;
      input.placeholder = label;
      input.setAttribute("aria-label", label);
    });
    $$(".search-logo").forEach((logo) => {
      logo.innerHTML = engineLogoMarkup(key);
    });
  }

  function applySettings() {
    applyTheme();
    rootEl.setAttribute("data-bg", settings.background);
    rootEl.setAttribute("data-density", settings.compact ? "compact" : "comfortable");
    rootEl.setAttribute("data-motion", settings.animations ? "on" : "off");
    rootEl.setAttribute("data-icons", settings.myntIcons === false ? "classic" : "mynt");
    rootEl.setAttribute("data-home-layout", settings.homeLayout);
    rootEl.style.setProperty("--dock-size", settings.dockSize + "px");

    if (settings.wallpaperImage) {
      rootEl.setAttribute("data-bg", "image");
      rootEl.style.setProperty("--wallpaper-image", "url(" + settings.wallpaperImage + ")");
    }

    applySurfaceStyle();
    applyWallpaperBgBlur();
    applySearchEngineBranding();
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

    const customAccentInput = $("#accentCustom");
    if (customAccentInput && settings.customAccent) customAccentInput.value = settings.customAccent;

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

  function toastIcon(id) {
    return '<svg class="toast-icon" aria-hidden="true"><use href="#' + id + '"></use></svg> ';
  }

  function showToast(msg, action) {
    const host = $("#toastHost");
    if (!host) return;
    const el = document.createElement("div");
    el.className = "toast";
    const copy = document.createElement("div");
    copy.className = "toast-copy";
    copy.innerHTML = msg;
    el.appendChild(copy);

    if (action) {
      const act = document.createElement("button");
      act.type = "button";
      act.className = "toast-action";
      act.textContent = action.label || "Undo";
      act.addEventListener("click", () => {
        el.remove();
        action.onClick();
      });
      el.appendChild(act);
    }

    const close = document.createElement("button");
    close.type = "button";
    close.className = "close";
    close.setAttribute("aria-label", "Dismiss");
    close.innerHTML = '<svg class="icon"><use href="#i-close"></use></svg>';
    close.addEventListener("click", () => el.remove());
    el.appendChild(close);

    host.appendChild(el);
    setTimeout(() => el.remove(), action ? 10000 : 9000);
  }

  function undoToast(message, undo) {
    showToast(message, { label: "Undo", onClick: undo });
  }

  /* ---------------- clock ---------------- */

  function clockDateOptions(compact) {
    if (compact) return { weekday: "short", month: "short", day: "numeric" };
    return ["analog", "minimal", "chip"].includes(settings.clockStyle)
      ? { weekday: "short", month: "short", day: "numeric" }
      : { weekday: "long", year: "numeric", month: "long", day: "numeric" };
  }

  function analogClockMarkup() {
    /* MYNT blob face — no ticks or numerals. */
    const face = "M93.6379 63.9405C89.7543 78.4344 78.4333 89.7554 63.9394 93.639l-7.4405 1.9937c-22.4055 6.0033-35.702 29.0333-29.6984 51.4393l1.9196 7.164c3.8837 14.494-.2601 29.959-10.8704 40.569l-5.5482 5.548c-16.402 16.402-16.402 42.995 0 59.397l5.6221 5.622c10.6102 10.611 14.754 26.075 10.8704 40.569l-1.9936 7.441c-6.0036 22.405 7.2929 45.435 29.6985 51.439l7.4406 1.994c14.4939 3.883 25.8149 15.204 29.6985 29.698l1.9942 7.443c6.0038 22.405 29.0338 35.702 51.4388 29.698l7.442-1.994c14.494-3.883 29.959.26 40.569 10.871l5.271 5.271c16.402 16.402 42.995 16.402 59.397 0l5.347-5.347c10.61-10.61 26.075-14.754 40.569-10.87l7.717 2.068c22.405 6.003 45.435-7.293 51.439-29.699l1.993-7.439c3.884-14.494 15.205-25.815 29.699-29.699l7.441-1.994c22.406-6.003 35.702-29.033 29.699-51.439l-2.068-7.718c-3.884-14.493.26-29.958 10.87-40.569l5.346-5.346c16.402-16.402 16.402-42.995 0-59.397l-5.272-5.272c-10.61-10.61-14.754-26.075-10.87-40.569l1.994-7.441c6.003-22.406-7.293-45.436-29.699-51.4398l-7.441-1.9939c-14.494-3.8836-25.815-15.2046-29.699-29.6984l-1.993-7.4395c-6.004-22.4056-29.034-35.702-51.439-29.6985l-7.441 1.9937c-14.494 3.8836-29.959-.2601-40.569-10.8704l-5.623-5.6227c-16.402-16.402-42.995-16.402-59.397 0l-5.547 5.5476c-10.61 10.6102-26.075 14.754-40.569 10.8704l-7.166-1.92c-22.405-6.0036-45.435 7.2929-51.4388 29.6985l-1.9943 7.4425Z";
    return (
      '<div class="analog-wrap">' +
        '<svg class="analog" viewBox="0 0 461 461" role="img" aria-label="Analog clock">' +
          '<path class="a-face" d="' + face + '"/>' +
          '<g class="a-hand a-hour"><rect x="215.5" y="107.5" width="30" height="138" rx="15"/></g>' +
          '<g class="a-hand a-minute"><rect x="215.5" y="76.5" width="30" height="169" rx="15"/></g>' +
          '<g class="a-hand a-second"><circle cx="230.5" cy="76.5" r="15"/></g>' +
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
    updateClockElement(block, block.id === "clockBlock");
  }

  function renderClocks() {
    renderClockInto($("#clockBlock"));
    renderClockInto($("#homeClock"));
  }

  function updateClockElement(block, compact) {
    if (!block) return;
    const d = new Date();
    const withSeconds = !!settings.clockSeconds;
    const timeText = d.toLocaleTimeString("en-US", withSeconds
      ? { hour: "numeric", minute: "2-digit", second: "2-digit" }
      : { hour: "numeric", minute: "2-digit" });
    const floating = block.id === "clockBlock";
    const widthBefore = floating ? block.offsetWidth : 0;

    const timeEl = block.querySelector(".clock-time");
    if (timeEl) timeEl.textContent = timeText;
    const dateEl = block.querySelector(".clock-date");
    if (dateEl) dateEl.textContent = d.toLocaleDateString("en-US", clockDateOptions(compact));
    const secEl = block.querySelector(".clock-sec");
    if (secEl) secEl.textContent = String(d.getSeconds()).padStart(2, "0");
    /* Hour rollover changes the text width; keep the search clear of it. */
    if (floating && block.offsetWidth !== widthBefore) scheduleWidgetLayout();

    const hourHand = block.querySelector(".a-hour");
    if (hourHand) {
      const hour = (d.getHours() % 12) + d.getMinutes() / 60 + d.getSeconds() / 3600;
      const minute = d.getMinutes() + d.getSeconds() / 60;
      const second = d.getSeconds();
      const firstPass = !block.__hands;
      if (!block.__hands) block.__hands = {};
      const rotateHand = (el, deg, key) => {
        const state = block.__hands;
        let total = deg;
        if (Number.isFinite(state[key])) {
          total += Math.floor(state[key] / 360) * 360;
          if (total < state[key] - 1) total += 360;
        }
        state[key] = total;
        if (firstPass) {
          el.style.transition = "none";
          el.style.transform = "rotate(" + total + "deg)";
          void el.getBoundingClientRect();
          el.style.transition = "";
        } else {
          el.style.transform = "rotate(" + total + "deg)";
        }
      };
      rotateHand(hourHand, hour * 30, "h");
      const minuteHand = block.querySelector(".a-minute");
      if (minuteHand) rotateHand(minuteHand, minute * 6, "m");
      const secondHand = block.querySelector(".a-second");
      if (secondHand) rotateHand(secondHand, second * 6, "s");
    }
  }

  function updateDateTime() {
    /* The floating clock shares its gutter with the content column, so it
       uses a compact date; the roomy Home clock keeps the full date. */
    updateClockElement($("#clockBlock"), true);
    updateClockElement($("#homeClock"), false);
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

  let widgetLayoutFrame = 0;

  function scheduleWidgetLayout() {
    if (widgetLayoutFrame) return;
    widgetLayoutFrame = requestAnimationFrame(() => {
      widgetLayoutFrame = 0;
      applyWidgetLayout();
    });
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
    const gap = 14;
    const placed = [];
    const intersects = (a, b) =>
      a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;

    WIDGETS.forEach(({ key }) => {
      const el = widgetEl(key);
      if (!el || el.hidden) return;
      const p = settings.widgetPositions[key] || {};
      const free = !!(p && p.free);
      const ax = free ? "center" : p.ax || "center";
      const ay = free ? "mid" : p.ay || "mid";
      const searchForm = key === "search" ? el.querySelector(".search") : null;

      /* Keep the centred search clear of the clock by shrinking it to the
         free space. Below 760 px it spans the row and drops underneath. */
      if (searchForm) {
        if (free) {
          el.style.removeProperty("--search-max");
        } else {
          const clockBox = placed.find((b) => b.key === "clock");
          let width = vw > 760 ? Math.min(560, vw - 32) : vw - 32;
          if (vw > 760) {
            const limit = clockBox ? vw - 2 * (clockBox.x + clockBox.w + gap) : 560;
            width = Math.min(width, limit);
          }
          el.style.setProperty("--search-max", Math.max(260, Math.round(width)) + "px");
        }
      }

      const w = el.offsetWidth;
      const h = el.offsetHeight;
      let cx;
      let cy;

      if (free) {
        cx = p.x * vw;
        cy = p.y * vh;
      } else {
        cx = ax === "left" ? leftGap + w / 2 : ax === "right" ? vw - rightGap - w / 2 : vw / 2;
        cy = ay === "top" ? topGap + h / 2 : ay === "bottom" ? vh - bottomGap - h / 2 : vh / 2;
      }

      if (!free) {
        /* Stack anchored widgets whenever they would collide: search moves
           below the clock on narrow screens, the dock nudges upward on short
           viewports. */
        let guard = 0;
        while (guard < 8) {
          const box = { x: cx - w / 2, y: cy - h / 2, w, h };
          const hit = placed.find((b) => intersects(box, b));
          if (!hit) break;
          cy = ay === "bottom" ? hit.y - gap - h / 2 : hit.y + hit.h + gap + h / 2;
          guard += 1;
        }
      }

      cx = clamp(cx, w / 2 + 8, vw - w / 2 - 8);
      cy = clamp(cy, h / 2 + 8, vh - h / 2 - 8);
      el.style.left = cx + "px";
      el.style.top = cy + "px";
      placed.push({ key, x: cx - w / 2, y: cy - h / 2, w, h, anchor: ay });
    });

    /* Push the active panel below any top widget that crosses its top edge.
       `.single` panels sit centred and clear the gutter on wide screens, but
       Planner and narrow layouts run full width, where an analog or stacked
       clock would otherwise sit on the panel corner. Re-measure from the
       stylesheet default each time so the inset never accumulates. */
    const body = $(".workspace-body");
    const panel = $(".tab-panel.active .panel");
    if (body && panel) {
      rootEl.style.removeProperty("--workspace-top");
      const base = parseFloat(getComputedStyle(body).paddingTop) || 64;
      const bodyTop = body.getBoundingClientRect().top;
      const panelBox = panel.getBoundingClientRect();
      const panelTop = bodyTop + base;
      let inset = base;
      placed.forEach((b) => {
        const crossesX = b.x < panelBox.right && b.x + b.w > panelBox.left;
        const crossesTop = b.y < panelTop && b.y + b.h > panelTop;
        if (crossesX && crossesTop) inset = Math.max(inset, b.y + b.h - bodyTop + 16);
      });
      if (inset > base) rootEl.style.setProperty("--workspace-top", Math.round(inset) + "px");
    }

    /* Keep the launcher popup glued to its icon after layout/resize changes. */
    if ($("#appsDialog") && $("#appsDialog").open) positionAppsPopup();
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
    GOOGLE_APPS.forEach((app, idx) => {
      const a = document.createElement("a");
      a.className = "app-tile";
      a.href = app.url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.style.setProperty("--i", String(idx));
      const avatar = document.createElement("span");
      avatar.className = "app-avatar";
      avatar.style.setProperty("--app-color", app.color);
      avatar.style.setProperty("--app-ink", ["#FBBC04", "#F4B400"].includes(app.color) ? "#332A00" : "#fff");
      const letter = document.createElement("span");
      letter.textContent = app.letter;
      avatar.appendChild(letter);
      attachFavicon(avatar, app.url, 64, letter);
      const label = document.createElement("span");
      label.textContent = app.name;
      a.append(avatar, label);
      grid.appendChild(a);
    });
  }

  /* Anchor the launcher popup to the waffle icon: right edges aligned, a small
     gap below, flipping above the icon when the viewport is short, and pinned
     to the page padding on phones. */
  function positionAppsPopup() {
    const dialog = $("#appsDialog");
    const anchor = $("#appsBtn");
    if (!dialog || !dialog.open || !anchor) return;
    const pad = 12;
    const gap = 10;
    const a = anchor.getBoundingClientRect();
    const d = dialog.getBoundingClientRect();
    let left = window.innerWidth <= 620 ? pad : a.right - d.width;
    left = Math.max(pad, Math.min(left, window.innerWidth - d.width - pad));
    let top = a.bottom + gap;
    if (top + d.height > window.innerHeight - pad) {
      top = a.top - d.height - gap;
    }
    top = Math.max(pad, Math.min(top, window.innerHeight - d.height - pad));
    dialog.style.left = Math.round(left) + "px";
    dialog.style.top = Math.round(top) + "px";
  }

  function openApps() {
    const dialog = $("#appsDialog");
    if (!dialog) return;
    if (!dialog.open) {
      /* Measure while hidden so the first frame is already in place. */
      dialog.style.visibility = "hidden";
      dialog.showModal();
      positionAppsPopup();
      dialog.style.visibility = "";
    }
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

    dockItems.forEach((item, idx) => {
      const a = document.createElement("a");
      a.className = "dock-item";
      a.href = item.url;
      a.title = item.title;
      a.target = settings.dockNewTab ? "_blank" : "_self";
      a.rel = "noopener noreferrer";
      a.style.setProperty("--i", String(idx));

      const icon = document.createElement("span");
      icon.className = "dock-icon";
      const letter = document.createElement("span");
      letter.className = "dock-letter";
      letter.textContent = firstLetter(item.title);
      icon.appendChild(letter);
      attachFavicon(icon, item.url, 128, letter);

      const tip = document.createElement("span");
      tip.className = "dock-tooltip";
      tip.textContent = item.title;

      a.append(icon, tip);
      dock.appendChild(a);
    });

    applyWidgetLayout();
  }

  function resetDockMagnification() {
    $$("#dock .dock-item").forEach((el) => {
      el.style.setProperty("--s", "1");
      el.style.setProperty("--lift", "0px");
      el.style.setProperty("--inv", "1");
    });
  }

  /* The floating dock retires while the page scrolls down so it never sits
     on top of a table header or the last row of a card; any upward scroll
     or a hover/tap brings it straight back. */
  function setupDockAutoHide() {
    const wrap = document.querySelector(".dock-wrap");
    if (!wrap) return;
    let lastY = window.scrollY;
    window.addEventListener("scroll", () => {
      const y = window.scrollY;
      const down = y > lastY + 6;
      const nearBottom = window.innerHeight + y >= document.documentElement.scrollHeight - 96;
      if (down && y > 140 && !nearBottom) wrap.classList.add("is-hidden");
      else if (!down || nearBottom) wrap.classList.remove("is-hidden");
      lastY = y;
    }, { passive: true });
    wrap.addEventListener("pointerenter", () => wrap.classList.remove("is-hidden"));
  }

  function setupDockMagnify() {
    const dock = $("#dock");
    dock.addEventListener("mousemove", (e) => {
      if (!settings.dockMagnify || !settings.animations) return;
      const items = $$(".dock-item", dock);
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

  function dockMatch(url) {
    const clean = normalizeUrl(url);
    if (!clean) return null;
    return dockItems.find((d) => normalizeUrl(d.url) === clean) || null;
  }

  function addDockItem(title, url) {
    const clean = normalizeUrl(url);
    if (!clean) {
      showToast(toastIcon("i-alert") + "That doesn’t look like a valid web address.");
      return false;
    }
    if (dockMatch(clean)) {
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
      attachFavicon(icon, item.url, 64, letter);

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
      attachFavicon(fav, bm.url, 64, letter);

      const main = document.createElement("button");
      main.type = "button";
      main.className = "bm-main";
      const title = document.createElement("span");
      title.className = "bm-title";
      title.textContent = bm.title || hostOf(bm.url);
      const url = document.createElement("span");
      url.className = "bm-url";
      let path = "";
      try { path = new URL(bm.url).pathname.replace(/\/$/, ""); } catch (e) { path = ""; }
      url.textContent = hostOf(bm.url) + path;
      main.append(title, url);
      main.addEventListener("click", () => {
        window.open(bm.url, "_blank", "noopener");
      });

      const star = document.createElement("button");
      star.type = "button";
      const inDock = !!dockMatch(bm.url);
      star.className = "icon-btn bm-star" + (inDock ? " active" : "");
      star.title = inDock ? "Remove from dock" : "Add to dock";
      star.setAttribute("aria-label", inDock ? "Remove " + (bm.title || hostOf(bm.url)) + " from dock" : "Pin " + (bm.title || hostOf(bm.url)) + " to dock");
      star.innerHTML = '<svg class="icon"><use href="' + (inDock ? "#i-star" : "#i-star-outline") + '"></use></svg>';
      star.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        const existing = dockMatch(bm.url);
        if (existing) {
          removeDockItem(existing.id);
          showToast("Removed from dock.");
        } else if (addDockItem(bm.title || hostOf(bm.url), bm.url)) {
          showToast(toastIcon("i-star") + "Pinned to your dock.");
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
    panel.removeAttribute("inert");
    document.body.classList.add("locked");
    loadBrowserBookmarks(true);
    setTimeout(() => $("#bookmarksSearch").focus({ preventScroll: true }), 280);
  }

  function closeBookmarks() {
    const panel = $("#bookmarksPanel");
    const scrim = $("#scrim");
    panel.classList.remove("open");
    panel.setAttribute("aria-hidden", "true");
    panel.setAttribute("inert", "");
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
      b.tabIndex = active ? 0 : -1;
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
      b.style.background = a.swatch;
      b.addEventListener("click", () => {
        settings.accent = key;
        applySettings();
        saveSettings();
      });
      host.appendChild(b);
    });
    const customBtn = document.createElement("button");
    customBtn.type = "button";
    customBtn.className = "swatch swatch-custom";
    customBtn.dataset.accent = "custom";
    customBtn.title = "Custom colour";
    customBtn.setAttribute("aria-label", "Custom accent colour");
    customBtn.style.background = settings.customAccent || "conic-gradient(from 210deg, #EC4343, #D1A93D, #5CBA5C, #09B2B4, #4382EC, #9563B5, #EC4343)";
    customBtn.addEventListener("click", () => {
      const picker = $("#accentCustom");
      if (picker) picker.click();
    });
    host.appendChild(customBtn);
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

  function isTaskOverdue(t) {
    if (!t || !t.time || t.done || t.date !== todayStr()) return false;
    const hm = t.time.split(":").map(Number);
    const now = new Date();
    return hm[0] * 60 + hm[1] < now.getHours() * 60 + now.getMinutes();
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
        const overdue = isTaskOverdue(t);
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
        if (overdue) {
          const tag = document.createElement("span");
          tag.className = "overdue-tag";
          tag.textContent = "Overdue";
          li.appendChild(tag);
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
          const index = todos.findIndex((x) => x.id === t.id);
          if (index < 0) return;
          const [removed] = todos.splice(index, 1);
          persist("todos-list", todos);
          renderTodos();
          undoToast("Task deleted.", () => {
            todos.splice(Math.min(index, todos.length), 0, removed);
            persist("todos-list", todos);
            renderTodos();
          });
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
          showToast(toastIcon("i-clock") + "Reminder: <b>" + escapeHtml(t.text) + "</b> (" + t.time + ")");
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
    if (daypartEl) {
      /* The eyebrow carries the date; the heading carries the greeting, so the
         two never repeat "Good afternoon" when no name is configured. */
      daypartEl.textContent = new Date().toLocaleDateString("en-US", {
        weekday: "long", month: "long", day: "numeric"
      });
    }

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
      if (isTaskOverdue(t)) {
        li.classList.add("overdue");
        const tag = document.createElement("span");
        tag.className = "overdue-tag";
        tag.textContent = "Overdue";
        li.appendChild(tag);
      }
      li.appendChild(del);

      check.addEventListener("click", () => {
        t.done = !t.done;
        persist("todos-list", todos);
        renderTodos();
      });
      del.addEventListener("click", () => {
        const index = todos.findIndex((x) => x.id === t.id);
        if (index < 0) return;
        const [removed] = todos.splice(index, 1);
        persist("todos-list", todos);
        renderTodos();
        undoToast("Task deleted.", () => {
          todos.splice(Math.min(index, todos.length), 0, removed);
          persist("todos-list", todos);
          renderTodos();
        });
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
      const letter = document.createElement("span");
      letter.className = "home-link-letter";
      letter.textContent = firstLetter(item.title);
      mark.appendChild(letter);
      attachFavicon(mark, item.url, 64, letter);

      const label = document.createElement("span");
      label.className = "home-link-label";
      label.textContent = item.title;

      a.append(mark, label);
      host.appendChild(a);
    });
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
        const index = notes.findIndex((x) => x.id === n.id);
        if (index < 0) return;
        const [removed] = notes.splice(index, 1);
        persist("notes-list", notes);
        renderNotes();
        undoToast("Note deleted.", () => {
          notes.splice(Math.min(index, notes.length), 0, removed);
          persist("notes-list", notes);
          renderNotes();
        });
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
      if (["work", "short", "long"].includes(saved.mode)) pomo.mode = saved.mode;
      if (typeof saved.remaining === "number" && isFinite(saved.remaining)) {
        pomo.remaining = Math.max(0, saved.remaining);
      }
    }
    pomoLog = await store.load("pomodoro-log", []);
    if (!Array.isArray(pomoLog)) pomoLog = [];

    $("#dialProgress").setAttribute("stroke-dasharray", CIRC.toFixed(1));
    $("#workLen").value = durations.work;
    $("#shortLen").value = durations.short;
    $("#longLen").value = durations.long;

    /* A running timer is stored as an end timestamp, so background tab
       throttling (or closing and reopening the tab) never resets the count. */
    if (saved && saved.running && saved.endAt) {
      pomo.mode = ["work", "short", "long"].includes(saved.mode) ? saved.mode : "work";
      const left = Math.ceil((saved.endAt - Date.now()) / 1000);
      if (left > 0) {
        pomo.running = true;
        pomo.endAt = saved.endAt;
        pomo.remaining = left;
        pomoInterval = setInterval(tick, 1000);
      } else if (saved.lastCompletedEndAt !== saved.endAt) {
        /* The session finished while no tab was open: credit it once, then
           land on the matching break/focus mode without auto-starting. */
        completeSession(true);
        return;
      }
    }

    pomo.remaining = Math.max(0, Math.min(pomo.remaining, modeLen(pomo.mode)));
    updatePomoUI();
    updateStatsUI();
  }

  function savePomoData() {
    store.save("pomodoro-data", {
      date: todayStr(),
      sessionsToday: pomo.sessionsToday,
      focusMinsToday: pomo.focusMinsToday,
      durations: durations,
      mode: pomo.mode,
      remaining: pomo.remaining,
      running: pomo.running,
      endAt: pomo.endAt,
      lastCompletedEndAt: pomo.lastCompletedEndAt || null
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

  function completeSession(restored) {
    const finishedAt = pomo.endAt;
    const finishedMode = pomo.mode;
    pomo.running = false;
    pomo.endAt = null;
    clearInterval(pomoInterval);
    pomoInterval = null;

    if (finishedMode === "work") {
      pomo.sessionsToday++;
      pomo.focusMinsToday += durations.work;
      pomoLog.push({ date: todayStr(), minutes: durations.work });
      if (pomoLog.length > 200) pomoLog = pomoLog.slice(-200);
      store.save("pomodoro-log", pomoLog);
      if (!restored) beep();
      showToast(toastIcon("i-check") + "Focus session complete. Time for a break.");
      pomo.mode = pomo.sessionsToday % 4 === 0 ? "long" : "short";
    } else {
      if (!restored) beep();
      showToast(toastIcon("i-bell") + "Break over — back to focus.");
      pomo.mode = "work";
    }

    pomo.remaining = modeLen(pomo.mode);
    pomo.lastCompletedEndAt = finishedAt || null;
    savePomoData();
    updateStatsUI();
    updatePomoUI();
  }

  function tick() {
    if (!pomo.running || !pomo.endAt) return;
    /* Derive from the clock rather than subtracting one per interval: browsers
       throttle background timers, so a --1 tick would drift or stall. */
    pomo.remaining = Math.max(0, Math.ceil((pomo.endAt - Date.now()) / 1000));
    if (pomo.remaining <= 0) {
      completeSession(false);
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
    pomo.endAt = null;
    updatePomoUI();
    if (autoStart) toggleTimer();
    else savePomoData();
  }

  function toggleTimer() {
    pomo.running = !pomo.running;
    if (pomo.running) {
      pomo.endAt = Date.now() + pomo.remaining * 1000;
      pomoInterval = setInterval(tick, 1000);
    } else {
      clearInterval(pomoInterval);
      pomoInterval = null;
      if (pomo.endAt) {
        pomo.remaining = Math.max(0, Math.ceil((pomo.endAt - Date.now()) / 1000));
        pomo.endAt = null;
      }
    }
    savePomoData();
    updatePomoUI();
  }

  /* ---------------- mock test tracker ---------------- */

  async function initTracker() {
    const stored = await store.load("mocktests-data", null);
    mockData = stored && typeof stored === "object" ? stored : {};
    CATEGORIES.forEach((c) => { if (!Array.isArray(mockData[c])) mockData[c] = []; });

    /* A blank sheet opens with three empty rows so the table is immediately
       ready to type into instead of showing only an empty state. */
    const sheetIsBlank = CATEGORIES.every((c) => mockData[c].length === 0);
    if (sheetIsBlank) {
      CATEGORIES.forEach((c) => {
        mockData[c] = [blankRow(), blankRow(), blankRow()];
      });
      persist("mocktests-data", mockData);
    }

    const scroller = $("#sheetScroll");
    if (scroller && !scroller.dataset.bound) {
      scroller.dataset.bound = "1";
      scroller.addEventListener("scroll", updateSheetScrollState, { passive: true });
      window.addEventListener("resize", updateSheetScrollState);
    }
    const hint = $("#sheetHint");
    if (hint && !hint.dataset.bound) {
      hint.dataset.bound = "1";
      hint.addEventListener("click", () => {
        const box = $("#sheetScroll");
        if (!box) return;
        const max = box.scrollWidth - box.clientWidth;
        const step = Math.max(240, Math.round(box.clientWidth * 0.75));
        box.scrollTo({ left: Math.min(max, box.scrollLeft + step), behavior: "smooth" });
      });
    }
    renderSheetTabs();
    renderSheetHead();
    renderSheet();
  }

  /* The wide sheet shows a fade + "Scroll →" hint until the last column is
     reached, then both retire so they never cover the final inputs. */
  function updateSheetScrollState() {
    requestAnimationFrame(() => {
      const frame = $("#sheetFrame");
      const scroller = $("#sheetScroll");
      if (!frame || !scroller) return;
      const max = scroller.scrollWidth - scroller.clientWidth;
      frame.classList.toggle("at-end", max <= 4 || scroller.scrollLeft >= max - 4);
    });
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
        const scroller = $("#sheetScroll");
        if (scroller) scroller.scrollLeft = 0;
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
      '<th class="col-sno">S.No</th><th>Date</th><th>Exam</th><th class="col-mock">Mock Name</th><th>Rank</th><th>Total Cand.</th>' +
      '<th>Marks</th><th class="hdr-pct">Percentile</th><th class="hdr-pct">Accuracy</th><th>Attempt</th>' +
      '<th class="hdr-right">Right</th><th class="hdr-wrong">Wrong</th>' +
      sectionHeaders + "<th></th></tr>";
  }

  function blankRow() {
    return { id: uid(), date: todayStr(), exam: "", mockName: "", rank: "", totalCandidates: "", percentile: "" };
  }

  function ovrButton(field) {
    return '<button type="button" class="ovr-reset" data-ovr="' + field + '" title="Edited — reset to the calculated value" aria-label="Reset to the calculated value">↺</button>';
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
    const isOverride = (field) => r[field] !== "" && r[field] != null;
    const markOverride = (input, field) => {
      if (!input) return;
      const on = isOverride(field);
      const cell = input.closest(".ovr-cell");
      if (cell) cell.classList.toggle("is-override", on);
      input.title = on ? "Manual override — click ↺ to restore the calculated value" : "";
    };

    const marksBtn = tr.querySelector(".marks-toggle");
    if (marksBtn) {
      marksBtn.textContent = fmt(eff.marks);
      const colour = r.marksColor === "pos" ? "green" : r.marksColor === "neg" ? "red" : "default";
      marksBtn.title = "Marks colour: " + colour + " — click to cycle";
      marksBtn.setAttribute("aria-label", "Marks " + fmt(eff.marks) + ", colour " + colour + ". Click to cycle the colour.");
    }
    const marksTd = tr.querySelector(".total-marks");
    if (marksTd) {
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
    markOverride(pctInput, "percentile");

    const accInput = tr.querySelector('[data-f="accuracyOvr"]');
    if (accInput && accInput !== active) {
      accInput.value = fmt(eff.accuracy);
      const accColor = heatColor(eff.accuracy);
      accInput.style.background = accColor.bg;
      accInput.style.color = accColor.fg;
    }
    markOverride(accInput, "accuracyOvr");

    const attInput = tr.querySelector('[data-f="attemptOvr"]');
    if (attInput && attInput !== active) attInput.value = eff.attempt;
    const rightInput = tr.querySelector('[data-f="rightOvr"]');
    if (rightInput && rightInput !== active) rightInput.value = eff.right;
    const wrongInput = tr.querySelector('[data-f="wrongOvr"]');
    if (wrongInput && wrongInput !== active) wrongInput.value = eff.wrong;
    markOverride(attInput, "attemptOvr");
    markOverride(rightInput, "rightOvr");
    markOverride(wrongInput, "wrongOvr");

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
    const frame = $("#sheetFrame");
    if (frame) frame.classList.toggle("is-empty", rows.length === 0);

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
        '<td class="col-mock"><input type="text" class="wide" data-f="mockName" value="' + escapeAttr(r.mockName) + '" placeholder="Test name"></td>' +
        '<td><input type="number" data-f="rank" value="' + (r.rank || "") + '" placeholder="Rank"></td>' +
        '<td><input type="number" data-f="totalCandidates" value="' + (r.totalCandidates || "") + '" placeholder="Total"></td>' +
        '<td class="computed total-marks" style="font-weight:700;"><button type="button" class="marks-toggle" title="Click to cycle the marks colour">0</button></td>' +
        '<td class="pct-cell ovr-cell"><input type="number" step="0.01" data-f="percentile" value=""><span class="auto-tag" style="display:none;">auto</span>' + ovrButton("percentile") + '</td>' +
        '<td class="ovr-cell"><input type="number" step="0.01" data-f="accuracyOvr" style="font-weight:700;border-radius:6px;">' + ovrButton("accuracyOvr") + '</td>' +
        '<td class="computed ovr-cell"><input type="number" data-f="attemptOvr" style="font-weight:700;">' + ovrButton("attemptOvr") + '</td>' +
        '<td class="computed right-cell ovr-cell"><input type="number" data-f="rightOvr" style="font-weight:700;">' + ovrButton("rightOvr") + '</td>' +
        '<td class="computed wrong-cell ovr-cell"><input type="number" data-f="wrongOvr" style="font-weight:700;">' + ovrButton("wrongOvr") + '</td>' +
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
      tr.querySelector(".marks-toggle").addEventListener("click", () => {
        r.marksColor = r.marksColor === "pos" ? "neg" : (r.marksColor === "neg" ? "" : "pos");
        persistSoon("mocktests-data", mockData);
        updateComputedCells(tr, r, sections);
      });
      tr.querySelectorAll(".ovr-reset").forEach((btn) => {
        btn.addEventListener("click", () => {
          r[btn.dataset.ovr] = "";
          persistSoon("mocktests-data", mockData, 0);
          updateComputedCells(tr, r, sections);
          updateSummaryAndTrend(rows, sections);
        });
      });
      tr.querySelector(".del-btn").addEventListener("click", () => {
        const category = activeCategory;
        const list = mockData[category];
        const index = list.findIndex((x) => x.id === r.id);
        if (index < 0) return;
        const [removed] = list.splice(index, 1);
        persistSoon("mocktests-data", mockData, 0);
        renderSheet();
        undoToast("Test row deleted.", () => {
          mockData[category].splice(Math.min(index, mockData[category].length), 0, removed);
          persistSoon("mocktests-data", mockData, 0);
          if (activeCategory === category) renderSheet();
        });
      });
    });

    updateSummaryAndTrend(rows, sections);
    updateSheetScrollState();
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
    const wrap = svg.closest(".trend-wrap");
    if (wrap) wrap.hidden = rows.length === 0;
    svg.innerHTML = "";
    const sorted = rows.slice().sort((a, b) => a.date < b.date ? -1 : 1).slice(-12);
    if (sorted.length === 0) return;
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
      html += '<text x="' + (padL - 6) + '" y="' + (y + 3) + '" font-size="11" fill="var(--md-on-surface-variant)" text-anchor="end" font-family="system-ui, sans-serif">' + Math.round(maxV * t) + "</text>";
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
  let selectedDay = "";

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
        const index = events.findIndex((x) => x.id === ev.id);
        if (index < 0) return;
        const [removed] = events.splice(index, 1);
        persist("calendar-events", events);
        renderCalendar();
        undoToast("Event deleted.", () => {
          events.splice(Math.min(index, events.length), 0, removed);
          persist("calendar-events", events);
          renderCalendar();
        });
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
    const monthKey = year + "-" + String(month + 1).padStart(2, "0");
    if (!selectedDay || !selectedDay.startsWith(monthKey)) {
      selectedDay = todayIso.startsWith(monthKey) ? todayIso : monthKey + "-01";
    }

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
      html += '<div class="month-cell' + (outside ? " outside" : "") + (isToday ? " today" : "") + (dayEvents.length ? " has-events" : "") + (iso === selectedDay ? " selected" : "") + '" data-date="' + iso + '" role="button" tabindex="' + (iso === selectedDay ? "0" : "-1") + '" aria-pressed="' + (iso === selectedDay ? "true" : "false") + '" aria-label="' + cellDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }) + (dayEvents.length ? ", " + dayEvents.length + " event" + (dayEvents.length === 1 ? "" : "s") : "") + '">' +
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

    const chooseDay = (iso) => {
      selectedDay = iso;
      grid.querySelectorAll(".month-cell").forEach((c) => {
        const on = c.dataset.date === iso;
        c.classList.toggle("selected", on);
        c.tabIndex = on ? 0 : -1;
        c.setAttribute("aria-pressed", on ? "true" : "false");
      });
      renderDayEvents(iso);
    };

    grid.querySelectorAll(".month-cell").forEach((c) => {
      c.addEventListener("click", () => {
        chooseDay(c.dataset.date);
        $("#eventDateInput").value = c.dataset.date;
      });
      c.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          chooseDay(c.dataset.date);
          $("#eventDateInput").value = c.dataset.date;
        }
      });
    });

    renderDayEvents(selectedDay);
  }

  function renderDayEvents(iso) {
    const host = $("#dayEvents");
    if (!host) return;
    host.innerHTML = "";
    const dayList = events
      .filter((ev) => ev.date === iso)
      .sort((a, b) => String(a.title).localeCompare(String(b.title)));
    const label = new Date(iso + "T00:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

    const head = document.createElement("div");
    head.className = "day-events-head";
    head.textContent = label + (iso === todayStr() ? " · Today" : "");
    host.appendChild(head);

    if (!dayList.length) {
      const empty = document.createElement("div");
      empty.className = "day-events-empty";
      empty.textContent = "No events on this day.";
      host.appendChild(empty);
      return;
    }

    dayList.forEach((ev) => {
      const diff = daysDiffFromToday(ev.date);
      let badgeClass, badgeText;
      if (diff > 0) { badgeClass = "upcoming"; badgeText = diff + "d left"; }
      else if (diff === 0) { badgeClass = "today"; badgeText = "Today"; }
      else { badgeClass = "past"; badgeText = Math.abs(diff) + "d past"; }

      const row = document.createElement("button");
      row.type = "button";
      row.className = "day-event";
      row.dataset.id = ev.id;
      const title = document.createElement("span");
      title.className = "day-event-title";
      title.textContent = ev.title;
      const badge = document.createElement("span");
      badge.className = "event-badge " + badgeClass;
      badge.textContent = badgeText;
      row.append(title, badge);
      row.addEventListener("click", () => {
        const target = document.querySelector('.event-item[data-id="' + ev.id + '"]');
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "center" });
          target.style.borderColor = "var(--md-primary)";
          setTimeout(() => { target.style.borderColor = ""; }, 1200);
        }
      });
      host.appendChild(row);
    });
  }

  function addEvent() {
    const titleInp = $("#eventTitleInput");
    const dateInp = $("#eventDateInput");
    const title = titleInp.value.trim();
    const date = dateInp.value;
    if (!title || !date) {
      showToast(toastIcon("i-alert") + "Add both a title and a date.");
      return;
    }
    events.push({ id: uid(), title: title, date: date });
    persist("calendar-events", events);
    titleInp.value = "";
    dateInp.value = "";
    selectedDay = date;
    calMonth = new Date(date + "T00:00:00");
    calMonth.setDate(1);
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
    if (weekMinutes === 0) {
      html += '<text x="' + (padL + plotW / 2) + '" y="' + (padT + plotH / 2) + '" font-size="12" fill="var(--md-on-surface-variant)" text-anchor="middle" font-family="system-ui, sans-serif">No focus sessions this week</text>';
    }
    weekDates.forEach((d, i) => {
      const mins = weekLog.filter((l) => l.date === d).reduce((a, b) => a + b.minutes, 0);
      const x = padL + (i + 0.5) * (plotW / 7) - barW / 2;
      const barH = (mins / maxMin) * plotH;
      const y = padT + plotH - barH;
      html += '<rect x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + barW.toFixed(1) + '" height="' + barH.toFixed(1) + '" rx="4" fill="var(--md-primary)"/>';
      const lbl = new Date(d + "T00:00:00").toLocaleDateString("en-US", { weekday: "short" });
      html += '<text x="' + (x + barW / 2).toFixed(1) + '" y="' + (H - 6) + '" font-size="11" fill="var(--md-on-surface-variant)" text-anchor="middle" font-family="system-ui, sans-serif">' + lbl + "</text>";
      if (mins > 0) html += '<text x="' + (x + barW / 2).toFixed(1) + '" y="' + (y - 4).toFixed(1) + '" font-size="11" fill="var(--md-primary)" text-anchor="middle" font-family="system-ui, sans-serif">' + mins + "</text>";
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
    showToast(toastIcon("i-download") + "Backup downloaded. Import it in Chrome or Firefox to move your data across browsers.");
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
      showToast(toastIcon("i-check") + "Backup imported successfully.");
    } catch (e) {
      showToast(toastIcon("i-alert") + "Could not read that file — make sure it’s a Study Deck backup JSON.");
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

    /* custom accent colour */
    const accentCustom = $("#accentCustom");
    if (accentCustom) {
      accentCustom.addEventListener("input", () => {
        settings.accent = "custom";
        settings.customAccent = accentCustom.value;
        applySettings();
        const chip = $('.swatch[data-accent="custom"]');
        if (chip) chip.style.background = settings.customAccent;
        persistBootTheme();
      });
      accentCustom.addEventListener("change", () => saveSettings());
    }

    /* local wallpaper image */
    const wallpaperFile = $("#wallpaperFile");
    const wallpaperClear = $("#wallpaperClearBtn");
    const wallpaperName = $("#wallpaperFileName");
    if (wallpaperFile) {
      wallpaperFile.addEventListener("change", () => {
        const file = wallpaperFile.files && wallpaperFile.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
          settings.wallpaperImage = String(reader.result || "");
          wallpaperAccentFromImage(settings.wallpaperImage).then(async (accentKey) => {
            if (accentKey && ACCENTS[accentKey]) settings.accent = accentKey;
            settings.wallpaperPalette = await extractWallpaperPalette(settings.wallpaperImage, 4);
            renderWallpaperPalette();
            applySettings();
            saveSettings();
            persistBootTheme();
            if (wallpaperName) wallpaperName.textContent = file.name;
          });
        };
        reader.readAsDataURL(file);
      });
    }
    if (wallpaperClear) {
      wallpaperClear.addEventListener("click", () => {
        settings.wallpaperImage = "";
        applySettings();
        saveSettings();
        persistBootTheme();
        if (wallpaperName) wallpaperName.textContent = "";
        if (wallpaperFile) wallpaperFile.value = "";
      });
    }

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
          } else if (key === "wallpaperBgBlur") {
            applyWallpaperBgBlur();
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
    $("#settingsTabs").addEventListener("keydown", (e) => {
      const keys = ["ArrowLeft", "ArrowRight", "Home", "End"];
      if (!keys.includes(e.key)) return;
      const tabs = $$("#settingsTabs .seg-btn");
      if (!tabs.length) return;
      const current = Math.max(0, tabs.findIndex((b) => b.classList.contains("active")));
      let next = current;
      if (e.key === "ArrowLeft") next = (current - 1 + tabs.length) % tabs.length;
      else if (e.key === "ArrowRight") next = (current + 1) % tabs.length;
      else if (e.key === "Home") next = 0;
      else next = tabs.length - 1;
      e.preventDefault();
      tabs[next].focus();
      selectSettingsTab(tabs[next].dataset.settingsTab);
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
      pomo.endAt = null;
      pomo.remaining = modeLen(pomo.mode);
      savePomoData();
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
      pomo.endAt = null;
      pomo.remaining = modeLen(pomo.mode);
      savePomoData();
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
          pomo.endAt = null;
          updatePomoUI();
        }
        savePomoData();
      });
    });
    (function initPomoTriggerTouch() {
      const trigger = $("#pomoTrigger");
      const setOpen = (open) => {
        trigger.classList.toggle("force-open", open);
        trigger.setAttribute("aria-expanded", open ? "true" : "false");
      };
      trigger.setAttribute("aria-expanded", "false");
      trigger.addEventListener("click", (e) => {
        if (e.target.closest("#pomoPopup")) return;
        setOpen(!trigger.classList.contains("force-open"));
      });
      trigger.addEventListener("keydown", (e) => {
        if (e.target.closest("#pomoPopup")) return;
        if (e.key === "Escape") setOpen(false);
      });
      document.addEventListener("click", (e) => {
        const popup = document.querySelector(".pomo-popup");
        if (!trigger.contains(e.target) && !(popup && popup.contains(e.target))) setOpen(false);
      });
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") setOpen(false);
      });
    })();

    /* tracker */
    $("#addRowBtn").addEventListener("click", () => {
      mockData[activeCategory].push(blankRow());
      persist("mocktests-data", mockData);
      renderSheet();
    });

    /* calendar */
    $("#prevMonthBtn").addEventListener("click", () => { selectedDay = ""; calMonth.setMonth(calMonth.getMonth() - 1); renderMonthGrid(); });
    $("#nextMonthBtn").addEventListener("click", () => { selectedDay = ""; calMonth.setMonth(calMonth.getMonth() + 1); renderMonthGrid(); });
    $("#todayMonthBtn").addEventListener("click", () => {
      selectedDay = todayStr();
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
        showToast(toastIcon("i-cloud") + "Browser sync enabled.");
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
    setupDockAutoHide();

    const dateInput = $("#todoDate");
    if (dateInput) dateInput.value = todayStr();

    await Promise.all([initTodos(), initNotes(), initPomo(), initTracker(), initCalendar()]);

    renderHome();
    updateDateTime();
    applyWidgetLayout();
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
