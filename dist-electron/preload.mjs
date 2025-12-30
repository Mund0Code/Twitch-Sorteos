"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("appApi", {
  version: () => process.env.npm_package_version
});
electron.contextBridge.exposeInMainWorld("licenseApi", {
  status: () => electron.ipcRenderer.invoke("license:status"),
  activate: (key) => electron.ipcRenderer.invoke("license:activate", key),
  clear: () => electron.ipcRenderer.invoke("license:clear"),
  startTrial: (twitchUser) => electron.ipcRenderer.invoke("license:trialStart", twitchUser)
});
electron.contextBridge.exposeInMainWorld("overlayApi", {
  open: () => electron.ipcRenderer.invoke("overlay:open"),
  close: () => electron.ipcRenderer.invoke("overlay:close"),
  isOpen: () => electron.ipcRenderer.invoke("overlay:isOpen"),
  setState: (state) => electron.ipcRenderer.invoke("overlay:setState", state),
  clickThrough: (enabled) => electron.ipcRenderer.invoke("overlay:clickThrough", enabled),
  onUpdate: (cb) => {
    const handler = (_e, state) => cb(state);
    electron.ipcRenderer.on("overlay:update", handler);
    return () => electron.ipcRenderer.removeListener("overlay:update", handler);
  }
});
electron.contextBridge.exposeInMainWorld("oauthApi", {
  twitchStart: (url) => electron.ipcRenderer.invoke("oauth:twitchStart", url),
  getLast: () => electron.ipcRenderer.invoke("oauth:getLast"),
  onCallback: (cb) => {
    const handler = (_e, url) => cb(url);
    electron.ipcRenderer.on("oauth:callback", handler);
    return () => electron.ipcRenderer.removeListener("oauth:callback", handler);
  }
});
electron.contextBridge.exposeInMainWorld("updateApi", {
  check: () => electron.ipcRenderer.invoke("update:check"),
  install: () => electron.ipcRenderer.invoke("update:install"),
  onStatus: (cb) => {
    const h = (_e, s) => cb(s);
    electron.ipcRenderer.on("update:status", h);
    return () => electron.ipcRenderer.removeListener("update:status", h);
  }
});
electron.contextBridge.exposeInMainWorld("deviceApi", {
  getId: () => electron.ipcRenderer.invoke("device:getId")
});
