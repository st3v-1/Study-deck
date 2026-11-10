/* ------------------------------------------------------------------
   Study Deck storage layer
   ------------------------------------------------------------------
   Uses the WebExtension storage APIs when running as an extension:

     browser.storage.local  -> always the source of truth on this device
     browser.storage.sync   -> optional browser-account sync
                               (Chrome <-> Chrome, Firefox <-> Firefox)

   Large values are split into small chunks because both Chrome and
   Firefox limit a single sync item to 8 KB and the whole sync area to
   100 KB.

   When the page is opened directly (file:// preview) it falls back to
   localStorage with the same keys the original dashboard used.
   ------------------------------------------------------------------ */
(function (global) {
  "use strict";

  const PREFIX = "studyDesk:";
  const CHUNK_BYTES = 7000;
  const SYNC_DEBOUNCE = 1200;

  const firefoxApi = typeof browser !== "undefined" && browser.storage ? browser : null;
  const ext = firefoxApi || (typeof chrome !== "undefined" && chrome.storage ? chrome : null);

  const localArea = ext ? ext.storage.local : null;
  const syncArea = ext && ext.storage.sync ? ext.storage.sync : null;

  const KEYS = [
    "ui-settings",
    "dock-items",
    "todos-list",
    "notes-list",
    "pomodoro-data",
    "pomodoro-log",
    "mocktests-data",
    "calendar-events"
  ];

  let syncEnabled = !!syncArea;
  let syncTimer = null;
  const pending = new Map();
  const listeners = new Set();

  const status = {
    usingExtension: !!ext,
    syncAvailable: !!syncArea,
    syncEnabled,
    pending: 0,
    lastSyncAt: null,
    lastError: null
  };

  /* ---------------- low-level helpers ---------------- */

  function areaCall(area, method, arg) {
    return new Promise((resolve, reject) => {
      if (!area || typeof area[method] !== "function") {
        reject(new Error("Storage area unavailable"));
        return;
      }

      /* Firefox's browser.* namespace is promise-first. Passing a callback
         to those methods can be rejected, so only use the callback form with
         Chrome's callback-based API. */
      if (firefoxApi) {
        try {
          Promise.resolve(area[method](arg)).then(resolve, reject);
        } catch (e) {
          reject(e);
        }
        return;
      }

      let settled = false;
      const settle = (fn, value) => {
        if (settled) return;
        settled = true;
        fn(value);
      };
      try {
        const ret = area[method](arg, (result) => {
          let err = null;
          try {
            err = typeof chrome !== "undefined" && chrome.runtime
              ? chrome.runtime.lastError
              : null;
          } catch (e) { err = null; }
          if (err) settle(reject, new Error(err.message || "Storage error"));
          else settle(resolve, result);
        });
        if (ret && typeof ret.then === "function") {
          ret.then(
            (r) => settle(resolve, r),
            (e) => settle(reject, e)
          );
        }
      } catch (e) {
        settle(reject, e);
      }
    });
  }

  function pack(value) {
    return { t: Date.now(), v: value };
  }

  function unpack(record) {
    if (
      record && typeof record === "object" && !Array.isArray(record) &&
      Object.prototype.hasOwnProperty.call(record, "t") &&
      Object.prototype.hasOwnProperty.call(record, "v")
    ) {
      return record;
    }
    /* legacy raw value (the original dashboard stored values directly) */
    return { t: 0, v: record };
  }

  async function readLocal(key) {
    if (localArea) {
      try {
        const result = await areaCall(localArea, "get", key);
        return result ? result[key] : undefined;
      } catch (e) {
        status.lastError = e.message;
      }
    }
    try {
      const raw = localStorage.getItem(PREFIX + key);
      return raw === null ? undefined : JSON.parse(raw);
    } catch (e) {
      return undefined;
    }
  }

  async function writeLocal(key, record) {
    if (localArea) {
      await areaCall(localArea, "set", { [key]: record });
      return;
    }
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(record));
    } catch (e) {
      status.lastError = "Local storage is full";
    }
  }

  async function removeLocal(key) {
    if (localArea) {
      try { await areaCall(localArea, "remove", key); } catch (e) {}
      return;
    }
    try { localStorage.removeItem(PREFIX + key); } catch (e) {}
  }

  /* ---------------- sync helpers ---------------- */

  function chunkString(str, maxBytes) {
    const encoder = new TextEncoder();
    const chunks = [];
    let start = 0;
    while (start < str.length) {
      let end = Math.min(str.length, start + Math.max(1, Math.floor(maxBytes / 3)));
      while (end > start && encoder.encode(str.slice(start, end)).length > maxBytes) {
        end -= Math.max(1, Math.ceil((end - start) / 8));
      }
      if (end <= start) end = Math.min(str.length, start + 1);
      chunks.push(str.slice(start, end));
      start = end;
    }
    return chunks.length ? chunks : [""];
  }

  function chunkKey(key, index) {
    return key + "::c" + index;
  }

  async function readSync(key) {
    if (!syncArea) return undefined;
    const metaResult = await areaCall(syncArea, "get", key);
    const meta = metaResult ? metaResult[key] : undefined;
    if (!meta) return undefined;

    if (typeof meta.n === "number") {
      const keys = [];
      for (let i = 0; i < meta.n; i++) keys.push(chunkKey(key, i));
      const parts = await areaCall(syncArea, "get", keys);
      let json = "";
      for (let i = 0; i < meta.n; i++) {
        const part = parts ? parts[chunkKey(key, i)] : undefined;
        if (typeof part !== "string") return undefined;
        json += part;
      }
      try {
        return { t: meta.t || 0, v: JSON.parse(json) };
      } catch (e) {
        return undefined;
      }
    }

    return { t: meta.t || 0, v: meta.v };
  }

  async function writeSync(key, value) {
    if (!syncArea) throw new Error("Sync storage unavailable");

    const json = JSON.stringify(value);
    const chunks = chunkString(json, CHUNK_BYTES);

    let old = null;
    try {
      const oldResult = await areaCall(syncArea, "get", key);
      old = oldResult ? oldResult[key] : null;
    } catch (e) { old = null; }

    const payload = {};
    payload[key] = { t: Date.now(), n: chunks.length };
    chunks.forEach((chunk, i) => { payload[chunkKey(key, i)] = chunk; });

    await areaCall(syncArea, "set", payload);

    if (old && typeof old.n === "number" && old.n > chunks.length) {
      const stale = [];
      for (let i = chunks.length; i < old.n; i++) stale.push(chunkKey(key, i));
      if (stale.length) {
        try { await areaCall(syncArea, "remove", stale); } catch (e) {}
      }
    }
  }

  async function removeSync(key) {
    if (!syncArea) return;
    try {
      const metaResult = await areaCall(syncArea, "get", key);
      const meta = metaResult ? metaResult[key] : null;
      const keys = [key];
      if (meta && typeof meta.n === "number") {
        for (let i = 0; i < meta.n; i++) keys.push(chunkKey(key, i));
      }
      await areaCall(syncArea, "remove", keys);
    } catch (e) {
      status.lastError = e.message;
    }
  }

  /* ---------------- public API ---------------- */

  async function load(key, fallback) {
    let best = null;

    const localRecord = await readLocal(key);
    if (localRecord !== undefined) best = unpack(localRecord);

    if (syncEnabled && syncArea) {
      try {
        const syncRecord = await readSync(key);
        if (syncRecord && (!best || syncRecord.t > best.t)) {
          best = syncRecord;
          if (!localRecord || syncRecord.t > unpack(localRecord).t) {
            await writeLocal(key, syncRecord);
          }
        }
        status.lastSyncAt = Date.now();
        status.lastError = null;
      } catch (e) {
        status.lastError = e.message;
      }
    }

    notify();
    return best ? best.v : fallback;
  }

  async function save(key, value) {
    const record = pack(value);
    try {
      await writeLocal(key, record);
    } catch (e) {
      status.lastError = e.message;
    }

    if (syncEnabled && syncArea) {
      pending.set(key, value);
      status.pending = pending.size;
      clearTimeout(syncTimer);
      syncTimer = setTimeout(flush, SYNC_DEBOUNCE);
    }
    notify();
  }

  async function flush() {
    clearTimeout(syncTimer);
    syncTimer = null;
    if (!syncEnabled || !syncArea || pending.size === 0) return;

    const entries = Array.from(pending.entries());
    pending.clear();
    status.pending = 0;

    for (const [key, value] of entries) {
      try {
        await writeSync(key, value);
        status.lastSyncAt = Date.now();
        status.lastError = null;
      } catch (e) {
        status.lastError = e.message || "Sync failed";
      }
    }
    notify();
  }

  async function remove(key) {
    await removeLocal(key);
    if (syncArea) await removeSync(key);
    notify();
  }

  function setSyncEnabled(enabled) {
    const next = !!(enabled && syncArea);
    const was = syncEnabled;
    syncEnabled = next;
    status.syncEnabled = next;
    status.pending = pending.size;
    if (!next) {
      clearTimeout(syncTimer);
      pending.clear();
      status.pending = 0;
    }
    notify();
    return was !== next;
  }

  async function pushAll(keys) {
    if (!syncEnabled || !syncArea) return;
    const list = keys || KEYS;
    for (const key of list) {
      const localRecord = await readLocal(key);
      if (localRecord === undefined) continue;
      const value = unpack(localRecord).v;
      try {
        await writeSync(key, value);
        status.lastSyncAt = Date.now();
        status.lastError = null;
      } catch (e) {
        status.lastError = e.message || "Sync failed";
        break;
      }
    }
    notify();
  }

  async function clearAll(keys) {
    const list = keys || KEYS;
    for (const key of list) {
      await removeLocal(key);
      if (syncArea) await removeSync(key);
    }
    pending.clear();
    status.pending = 0;
    notify();
  }

  async function usage(keys) {
    let localBytes = 0;
    let syncBytes = 0;

    try {
      if (localArea) {
        const result = await areaCall(localArea, "get", null);
        localBytes = new Blob([JSON.stringify(result || {})]).size;
      } else {
        (keys || listKeys()).forEach((key) => {
          const raw = localStorage.getItem(PREFIX + key);
          if (raw) localBytes += new Blob([raw]).size;
        });
      }
    } catch (e) {}

    try {
      if (syncArea) {
        const result = await areaCall(syncArea, "get", null);
        syncBytes = new Blob([JSON.stringify(result || {})]).size;
      }
    } catch (e) {}

    return { localBytes, syncBytes };
  }

  function listKeys() { return KEYS; }

  function getStatus() {
    return {
      ...status,
      pending: pending.size,
      syncEnabled
    };
  }

  function onStatus(callback) {
    listeners.add(callback);
    callback(getStatus());
    return () => listeners.delete(callback);
  }

  function notify() {
    const snapshot = getStatus();
    listeners.forEach((callback) => {
      try { callback(snapshot); } catch (e) {}
    });
  }

  global.StudyStore = {
    keys: KEYS.slice(),
    usingExtension: !!ext,
    syncAvailable: !!syncArea,
    load,
    save,
    flush,
    remove,
    removeAll: clearAll,
    clearAll,
    usage,
    setSyncEnabled,
    pushAll,
    getStatus,
    onStatus
  };
})(typeof window !== "undefined" ? window : self);
