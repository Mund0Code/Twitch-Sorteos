import { BrowserWindow, ipcMain } from "electron";
import { autoUpdater } from "electron-updater";

export function registerUpdater(win: BrowserWindow) {
  autoUpdater.autoDownload = true;
  autoUpdater.autoInstallOnAppQuit = true;

  function send(status: any) {
    win.webContents.send("update:status", status);
  }

  autoUpdater.on("checking-for-update", () => send({ state: "checking" }));
  autoUpdater.on("update-available", (info) =>
    send({ state: "available", info })
  );
  autoUpdater.on("update-not-available", () => send({ state: "none" }));
  autoUpdater.on("download-progress", (p) =>
    send({ state: "downloading", percent: p.percent })
  );
  autoUpdater.on("update-downloaded", () => send({ state: "downloaded" }));
  autoUpdater.on("error", (e) => send({ state: "error", message: String(e) }));

  ipcMain.handle("update:check", async () => {
    autoUpdater.checkForUpdates();
    return true;
  });

  ipcMain.handle("update:install", async () => {
    autoUpdater.quitAndInstall();
    return true;
  });
}
