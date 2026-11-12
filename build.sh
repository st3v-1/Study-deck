#!/usr/bin/env bash
#
# Build ready-to-load extension folders for Chrome and Firefox.
#
#   ./build.sh
#
# Output:
#   dist/chrome/                  -> load unpacked in Chrome / Edge / Brave
#   dist/firefox/                 -> load temporary add-on in Firefox
#   dist/study-deck-chrome.zip    -> store / distribution package
#   dist/study-deck-firefox.zip   -> store / distribution package
#
set -euo pipefail
cd "$(dirname "$0")"

ROOT="$(pwd)"
DIST="$ROOT/dist"
COMMON=(newtab.html background.js icons scripts styles fonts)

rm -rf "$DIST"
mkdir -p "$DIST/chrome" "$DIST/firefox"

copy_common() {
  local dest="$1"
  local item
  for item in "${COMMON[@]}"; do
    cp -R "$ROOT/$item" "$dest/"
  done
}

# Chrome / Chromium (MV3, service worker background)
copy_common "$DIST/chrome"
cp "$ROOT/manifest.json" "$DIST/chrome/manifest.json"

# Firefox (MV3, background scripts + gecko id)
copy_common "$DIST/firefox"
cp "$ROOT/manifest.firefox.json" "$DIST/firefox/manifest.json"

# Optional ZIP archives
if command -v zip >/dev/null 2>&1; then
  (cd "$DIST/chrome" && zip -qr ../study-deck-chrome.zip .)
  (cd "$DIST/firefox" && zip -qr ../study-deck-firefox.zip .)
  echo "ZIP archives created."
else
  echo "zip not found; skipped ZIP archives (folders are still ready)."
fi

echo ""
echo "Build complete:"
echo "  $DIST/chrome"
echo "  $DIST/firefox"
