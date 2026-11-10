/* Applies the saved theme before first paint to avoid a flash of the wrong
   colours. Only reads a tiny bootstrap record; the real settings live in the
   extension storage area. Safe to run outside an extension too. */
(function () {
  "use strict";
  var root = document.documentElement;
  try {
    var raw = localStorage.getItem("studyDesk:boot-theme");
    if (!raw) return;
    var boot = JSON.parse(raw);
    if (boot.theme === "dark" || boot.theme === "light") {
      root.setAttribute("data-theme", boot.theme);
    }
    if (boot.accent) root.setAttribute("data-accent", boot.accent);
    if (boot.bg) root.setAttribute("data-bg", boot.bg);
    if (boot.density) root.setAttribute("data-density", boot.density);
    if (boot.motion === false) root.setAttribute("data-motion", "off");
  } catch (e) {
    /* first run — ignore */
  }
})();
