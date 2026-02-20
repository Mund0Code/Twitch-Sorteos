import { BrowserWindow, ipcMain, app } from "electron";
import { autoUpdater } from "electron-updater";

let registered = false;
let currentWin: BrowserWindow | null = null;

export function registerUpdater(win: BrowserWindow) {
  // ✅ En DEV no hay feed real (GitHub releases), evita errores y spam
  if (!app.isPackaged) {
    // aun así manda versión al renderer para que NO salga v—
    safeSend(win, { state: "boot", version: app.getVersion() });
    return;
  }

  // ✅ siempre apunta al win actual
  currentWin = win;

  // ✅ Evita registrar 2 veces listeners/handlers
  if (registered) {
    safeSend(currentWin, { state: "boot", version: app.getVersion() });
    return;
  }
  registered = true;

  autoUpdater.autoDownload = true;
  autoUpdater.autoInstallOnAppQuit = true;

  function send(status: any) {
    safeSend(currentWin, status);
  }

  // ✅ versión actual siempre (para mostrar v1.x.x)
  send({ state: "boot", version: app.getVersion() });

  autoUpdater.on("checking-for-update", () => send({ state: "checking" }));

  autoUpdater.on("update-available", (info) =>
    send({
      state: "available",
      version: info?.version,
      releaseNotes: normalizeReleaseNotes((info as any)?.releaseNotes),
      info,
    }),
  );

  autoUpdater.on("update-not-available", () => send({ state: "none" }));

  autoUpdater.on("download-progress", (p) =>
    send({ state: "downloading", percent: Number(p?.percent ?? 0) }),
  );

  autoUpdater.on("update-downloaded", (info) =>
    send({
      state: "downloaded",
      version: info?.version,
      releaseNotes: normalizeReleaseNotes((info as any)?.releaseNotes),
      info,
    }),
  );

  autoUpdater.on("error", (e: any) =>
    send({ state: "error", message: String(e?.message ?? e) }),
  );

  // ✅ IPC handlers (SOLO una vez)
  ipcMain.handle("update:check", async () => {
    try {
      // await para poder capturar errores reales y reportarlos
      await autoUpdater.checkForUpdates();
      return true;
    } catch (e: any) {
      send({ state: "error", message: String(e?.message ?? e) });
      return false;
    }
  });

  ipcMain.handle("update:install", async () => {
    autoUpdater.quitAndInstall();
    return true;
  });
}

function safeSend(win: BrowserWindow | null, status: any) {
  try {
    if (!win || win.isDestroyed()) return;
    win.webContents.send("update:status", status);
  } catch {
    // noop
  }
}

// GitHub/electron-updater a veces manda releaseNotes como string, array o algo raro
function normalizeReleaseNotes(rn: any) {
  if (!rn) return null;
  if (typeof rn === "string") return rn;

  if (Array.isArray(rn)) {
    return rn
      .map((x) => {
        if (!x) return "";
        if (typeof x === "string") return x;
        const v = x.version ? `v${x.version}\n` : "";
        const n = x.note ?? x.notes ?? "";
        return `${v}${String(n)}`;
      })
      .filter(Boolean)
      .join("\n\n---\n\n");
  }

  try {
    return JSON.stringify(rn, null, 2);
  } catch {
    return String(rn);
  }
}
