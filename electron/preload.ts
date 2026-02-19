import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("appApi", {
  version: () => ipcRenderer.invoke("app:getVersion"),
});

contextBridge.exposeInMainWorld("licenseApi", {
  status: () => ipcRenderer.invoke("license:status"),
  activate: (key: string) => ipcRenderer.invoke("license:activate", key),
  clear: () => ipcRenderer.invoke("license:clear"),
  startTrial: (twitchUser?: string) =>
    ipcRenderer.invoke("license:trialStart", twitchUser),
  deviceId: () => ipcRenderer.invoke("license:deviceId"),
});

contextBridge.exposeInMainWorld("overlayApi", {
  open: () => ipcRenderer.invoke("overlay:open"),
  close: () => ipcRenderer.invoke("overlay:close"),
  isOpen: () => ipcRenderer.invoke("overlay:isOpen"),
  setState: (state: any) => ipcRenderer.invoke("overlay:setState", state),
  clickThrough: (enabled: boolean) =>
    ipcRenderer.invoke("overlay:clickThrough", enabled),

  onUpdate: (cb: (state: any) => void) => {
    const handler = (_e: any, state: any) => cb(state);
    ipcRenderer.on("overlay:update", handler);
    return () => ipcRenderer.removeListener("overlay:update", handler);
  },
});

contextBridge.exposeInMainWorld("oauthApi", {
  twitchStart: (url: string) => ipcRenderer.invoke("oauth:twitchStart", url),
  getLast: () => ipcRenderer.invoke("oauth:getLast"),
  onCallback: (cb: (url: string) => void) => {
    const handler = (_e: any, url: string) => cb(url);
    ipcRenderer.on("oauth:callback", handler);
    return () => ipcRenderer.removeListener("oauth:callback", handler);
  },
});

contextBridge.exposeInMainWorld("updateApi", {
  check: () => ipcRenderer.invoke("update:check"),
  install: () => ipcRenderer.invoke("update:install"),
  onStatus: (cb: (s: any) => void) => {
    const handler = (_e: any, s: any) => cb(s);
    ipcRenderer.on("update:status", handler);
    return () => ipcRenderer.removeListener("update:status", handler);
  },
});

contextBridge.exposeInMainWorld("deviceApi", {
  getId: () => ipcRenderer.invoke("device:getId"),
});
