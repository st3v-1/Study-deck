# Study Deck — New Tab

A Material You (Material 3) study dashboard that replaces your browser's new-tab
page. It opens on a customisable **Home** dashboard with a clock, Google search,
today's tasks and a focus timer, then keeps the original Study Deck features:
to-do log, mock-test tracker, planner (merged calendar + notes) and weekly review.
It also adds a Google apps launcher, browser bookmarks panel, a macOS-style
favourites dock, placeable widgets and a full customisation panel.

Works as a **Chrome / Edge / Brave** extension and as a **Firefox** extension.

---

## Features

- **To-do log** grouped by date, with optional reminder times and a visible
  overdue tag. Deleting a task, note, event or tracker row offers **Undo**.
- **Home dashboard** with a large clock, Google search, today’s task list, a
  focus-timer card, quick links from your dock, and a dated greeting.
- **Mock test tracker** with per-section marks, totals, accuracy, percentile and
  a marks-trend chart. Computed cells accept manual overrides, and a ↺ button
  restores the calculated value. S.No and Mock Name stay frozen while the sheet
  scrolls sideways.
- **Planner** tab merging the calendar (exam dates and events with countdown
  badges, plus a per-day event drill-down) and quick notes for capture.
- **Weekly review** across tasks, focus time, notes and mock tests.
- **Pomodoro timer** in the navigation rail and on the Home tab. A running timer
  stores its end time, so it survives background-tab throttling and reloads.
- **Google search bar** in the top bar and on Home (Google, Bing, DuckDuckGo,
  Brave, Ecosia or YouTube; URLs open directly) with matching engine branding.
- **Google apps launcher** (18 apps) opens as a popup anchored to its icon.
- **Browser bookmarks panel** with search, powered by the browser's bookmarks.
- **Favourites dock** with macOS-style hover magnification and drag-free
  reordering from Settings.
- **Five Material You clock faces** — Digital, Stacked, Minimal, Analog and Chip
  — with optional seconds and date. The analog face is a MYNT-style blob clock
  with pill hands and a smooth orbiting second dot.
- **Widget placement**: put the clock, search, apps and favourites dock on any
  edge or corner with the arrow pad in **Settings → Layout → Widget positions**.
  **Reset widget positions** restores the defaults.
- **Glassmorphic surfaces**: Solid, Glass and Frosted modes with adjustable
  strength and an optional accent glow.
- **MYNT-style Material You theming**: 11 tonal palettes plus a custom colour
  picker that generates a whole ramp, Poppins typography, tinted glass
  surfaces, rounded icon tiles, system/light/dark mode, three background
  styles, compact density and an animation toggle.
- **Browser sync** for devices signed into the same browser account, plus JSON
  export/import to move data between Chrome and Firefox.

---

## Install in Chrome / Edge / Brave

1. Run the build (or use the source folder directly):

   ```bash
   ./build.sh
   ```

2. Open `chrome://extensions` (or `edge://extensions`, `brave://extensions`).
3. Enable **Developer mode**.
4. Click **Load unpacked** and choose `dist/chrome/` (or this folder if you did
   not build — Chrome reads `manifest.json`).
5. Open a new tab. Study Deck is now the new-tab page.

### Install in Firefox

1. Run `./build.sh`.
2. Open `about:debugging#/runtime/this-firefox`.
3. Click **Load Temporary Add-on…** and choose `dist/firefox/manifest.json`.
4. Open a new tab.

> **Why two manifests?** Chrome MV3 requires `background.service_worker`, while
> Firefox MV3 uses `background.scripts` (an event page) and needs a Gecko add-on
> ID. `build.sh` copies the right manifest into each build folder, so you never
> load the wrong one.

Temporary Firefox add-ons are removed when the browser restarts. For a permanent
install, package `dist/study-deck-firefox.zip` and sign it through
[addons.mozilla.org](https://addons.mozilla.org/developers/) (or use Firefox
Developer Edition / Nightly with `xpinstall.signatures.required` disabled).

---

## Sync and backup

### Browser sync (automatic, same vendor only)

Turn on **Settings → Data & sync → Browser sync**. Study Deck then mirrors each
data key into `browser.storage.sync` in small chunks (both Chrome and Firefox
limit individual sync items to about 8 KB). Browsers signed into the same
account pick the newest record by timestamp.

- Chrome syncs with Chrome (signed into the same Google account).
- Firefox syncs with Firefox (signed into the same Mozilla account).
- **Chrome and Firefox never share a sync account.** There is no cross-browser
  live sync without a shared backend.

### Portable backup (Chrome ↔ Firefox)

Use **Settings → Data & sync → Export backup** to download a single JSON file
containing tasks, notes, mock tests, calendar, Pomodoro history and settings.
Open the other browser's Study Deck, choose **Import backup**, and pick that
file. This is the supported way to move data between Chrome and Firefox or to
keep an offline archive.

Export/import is also useful before clearing browser data.

---

## Local preview (no extension)

The page falls back to `localStorage` when opened as a normal web page, so you
can develop without installing anything:

```bash
python3 -m http.server 8765
# then open http://127.0.0.1:8765/newtab.html
```

The bookmarks panel and browser sync show a "preview mode" message in this
environment, because the browser extension APIs are not available.

---

## Customisation

Click the **Settings** icon in the navigation rail to open **Customize Study
Deck**. The deck opens on **Home**; use the left rail (or top rail on narrow
windows) to switch between Home and the study sections.

| Tab | What you can change |
| --- | --- |
| **Appearance** | Theme mode, clock face, seconds/date, tonal palette or custom accent colour, background, surface style (solid/glass/frosted), glass strength and glow, animations, compact density |
| **Home** | Greeting name, home layout, show/hide greeting, clock, search, quick links, tasks and focus card; hide floating widgets while Home is open |
| **Layout** | Show/hide clock, search bar, Pomodoro, bookmarks button, apps button and dock; place each widget with the 3×3 arrow pad or reset positions |
| **Search** | Search engine and whether results open in a new tab |
| **Dock** | Add, rename, reorder and remove favourites; reset to defaults; magnification, new-tab behaviour and icon size |
| **Data & sync** | Browser sync toggle, storage usage, export/import, clear all data |

### Widget placement

Open **Settings → Layout → Widget positions**. Every widget (clock, search, apps
and favourites dock) can be snapped to the left, centre or right of the top, middle
or bottom of the page. **Reset widget positions** restores the defaults. Widget
placement is set with the arrow pad; drag handles and free-form dragging were
removed so widgets can no longer overlap.

Keyboard shortcuts: `/` or `Ctrl`/`Cmd` + `K` focuses search; `Esc` closes
open panels and dialogs.

---

## Testing

Two self-contained harnesses live in `tests/`. Each one loads the real
dashboard in an isolated iframe, snapshots your saved settings first and
restores them when the run ends.

| File | What it checks |
| --- | --- |
| `tests/ui-test.html` | 20 design and behaviour checks: Home boot, greeting/search, task sync, every clock face, glass/frosted/solid surfaces, layout modes, widget anchors, responsive overflow, unique IDs, accessible names and runtime errors |
| `tests/performance-test.html` | 15 budgets: cold boot, DOM/CSS/payload weight, storage and heap size, idle frame rate, tab-switch latency, panel/clock/surface/widget transition smoothness, reduced-motion handling, DOM leaks and long tasks |

Serve the folder and open either file over HTTP:

```bash
python3 -m http.server 8765 --bind 127.0.0.1
# then open:
# http://127.0.0.1:8765/tests/ui-test.html
# http://127.0.0.1:8765/tests/performance-test.html
```

Both pages run on load, print results in the page and expose
`window.__RESULTS__` for automation. The performance page ignores renderer
suspension gaps (background or fully occluded tabs) and skips frame-rate checks
when no frames can be sampled, so it never reports false jank.

---

## Project structure

```
study-deck-extension/
├── manifest.json            # Chrome / Chromium MV3 manifest
├── manifest.firefox.json    # Firefox MV3 manifest (background scripts + Gecko ID)
├── background.js            # Opens the dashboard from the toolbar icon
├── newtab.html              # New-tab UI
├── styles/material.css      # Material 3 design tokens and layout
├── scripts/
│   ├── theme-init.js        # Applies theme before first paint
│   ├── storage.js           # Extension storage + chunked sync + localStorage fallback
│   └── app.js               # All dashboard logic
├── fonts/                   # Bundled Poppins Regular + OFL licence
├── icons/                   # Extension icons
├── tests/
│   ├── ui-test.html         # UI / design test harness
│   └── performance-test.html # Resource usage + transition harness
├── build.sh                 # Builds dist/chrome, dist/firefox and ZIPs
└── README.md
```

---

## Permissions

| Permission | Why |
| --- | --- |
| `storage` | Save tasks, notes, tracker data and settings; optional `storage.sync` |
| `bookmarks` | Show and search the browser's bookmarks in the Bookmarks panel |
| `favicon` | Load site favicons through the browser's local `_favicon` service |

Study Deck does not read page history, inject scripts into websites, or send
your study data anywhere. Dock and bookmark favicons use the browser's local
`_favicon` service first, then fall back to Google's public favicon service and
DuckDuckGo's icon service; if all are unreachable, the dock shows a coloured
letter tile.

The extension pages also set a content security policy of
`script-src 'self'; object-src 'self'; img-src 'self' data: https:`, so remote
favicons are the only remote subresources loaded.

---

## Troubleshooting

- **New tab still shows the browser default.** Disable any other new-tab
  extension and make sure Study Deck is enabled. In Chrome, conflicting
  new-tab extensions are resolved by the most recently installed enabled one.
- **Firefox says the extension is corrupt.** You probably loaded the Chrome
  manifest. Use `dist/firefox/manifest.json`.
- **Changes to JS/CSS do not appear.** Click the reload button for the extension
  on `chrome://extensions` (or `about:debugging`) and refresh the tab.
- **Sync is greyed out.** It is unavailable when the page is opened as a plain
  web page, or when the browser does not expose `storage.sync`. Data still
  saves locally.
- **Bookmarks panel is empty.** Grant the bookmarks permission and make sure the
  bookmarks bar/folders actually contain bookmarks; the panel shows a fallback
  message in preview mode.
