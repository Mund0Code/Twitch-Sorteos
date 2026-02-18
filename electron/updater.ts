import { BrowserWindow, ipcMain, app } from "electron";
import { autoUpdater } from "electron-updater";

let registered = false;

export function registerUpdater(win: BrowserWindow) {
  // ✅ Evita registrar 2 veces (si recreas ventana, hot reload, etc.)
  if (registered) {
    // Re-engancha el "send" a la nueva window (por si cambió win)
    sendTo(win, { state: "boot", version: app.getVersion() });
    return;
  }
  registered = true;

  // ✅ En DEV no intentes hacer check real (no hay feed)
  const canUpdate = app.isPackaged;

  autoUpdater.autoDownload = true;
  autoUpdater.autoInstallOnAppQuit = true;

  function send(status: any) {
    sendTo(win, status);
  }

  // ✅ versión actual siempre
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

  autoUpdater.on("error", (e) =>
    send({ state: "error", message: String(e?.message ?? e) }),
  );

  // ✅ Handlers IPC SOLO una vez
  ipcMain.handle("update:check", async () => {
    await autoUpdater.checkForUpdates();
    return true;
  });

  ipcMain.handle("update:install", async () => {
    if (!canUpdate) return true;
    autoUpdater.quitAndInstall();
    return true;
  });
}

function sendTo(win: BrowserWindow, status: any) {
  try {
    if (!win || win.isDestroyed()) return;
    win.webContents.send("update:status", status);
  } catch {
    // noop
  }
}

// Stripe/GitHub a veces manda releaseNotes como string, array, o objeto
function normalizeReleaseNotes(rn: any) {
  if (!rn) return null;
  if (typeof rn === "string") return rn;

  // electron-updater puede mandar array: [{ version, note }, ...]
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

  // objeto
  try {
    return JSON.stringify(rn, null, 2);
  } catch {
    return String(rn);
  }
}
