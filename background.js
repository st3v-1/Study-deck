/* Opens the Study Deck dashboard when the toolbar icon is clicked. */
const api = typeof browser !== "undefined" ? browser : chrome;

if (api && api.action && api.action.onClicked) {
  api.action.onClicked.addListener(() => {
    api.tabs.create({ url: api.runtime.getURL("newtab.html") });
  });
}
