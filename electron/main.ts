import { app, BrowserWindow, ipcMain } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { registerLicenseIpc } from "./licenseIpc";
import { registerOverlayIpc } from "./overlayIpc";
import { registerUpdater } from "./updater";
import os from "node:os";
import fs from "node:fs";

// ---- FIX cache Windows (0x5) ----
const cacheRoot = path.join(os.tmpdir(), "twitch-sorteos-cache");
try {
  fs.mkdirSync(cacheRoot, { recursive: true });
  fs.mkdirSync(path.join(cacheRoot, "gpu"), { recursive: true });
} catch {}

app.commandLine.appendSwitch("disk-cache-dir", cacheRoot);
app.commandLine.appendSwitch("gpu-cache-dir", path.join(cacheRoot, "gpu"));
app.commandLine.appendSwitch("disable-gpu-shader-disk-cache");

// userData una vez
app.setPath("userData", path.join(app.getPath("appData"), "twitch-sorteos"));
app.setPath("cache", path.join(app.getPath("userData"), "Cache"));

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];

function getPaths() {
  // ✅ En PROD: app.getAppPath() = .../resources/app.asar
  // ✅ En DEV: __dirname suele ser .../dist-electron
  const root = app.isPackaged ? app.getAppPath() : path.join(__dirname, "..");

  return {
    ROOT: root,
    RENDERER_DIST: path.join(root, "dist"),
    MAIN_DIST: path.join(root, "dist-electron"),
  };
}

let win: BrowserWindow | null = null;

const DEEP_LINK_SCHEME = "twitch-sorteos";
let lastOAuthUrl: string | null = null;

// ✅ Enviar deep link al renderer
function sendOAuthToRenderer(url: string) {
  lastOAuthUrl = url;

  // ✅ si llegó el callback, cerramos ventana OAuth si está abierta
  if (oauthWin && !oauthWin.isDestroyed()) {
    oauthWin.close();
    oauthWin = null;
  }

  if (win && !win.isDestroyed()) {
    win.webContents.send("oauth:callback", url);
    if (win.isMinimized()) win.restore();
    win.focus();
  }
}

// ✅ Windows/Linux: el deep link llega como argumento del proceso
function handleArgvDeepLink(argv: string[]) {
  const url = argv.find((a) => a.startsWith(`${DEEP_LINK_SCHEME}://`));
  if (url) sendOAuthToRenderer(url);
}

// ✅ SINGLE INSTANCE (CLAVE para Windows)
const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
} else {
  app.on("second-instance", (_event, argv) => {
    if (win) {
      if (win.isMinimized()) win.restore();
      win.focus();
    }
    handleArgvDeepLink(argv);
  });
}

// ✅ macOS: open-url
app.on("open-url", (event, url) => {
  event.preventDefault();
  sendOAuthToRenderer(url);
});

// ✅ Registrar protocolo
function registerProtocol() {
  try {
    if (process.defaultApp) {
      // DEV: electron-vite suele necesitar pasar el entry file
      const entry = process.argv[1];
      if (entry) {
        app.setAsDefaultProtocolClient(DEEP_LINK_SCHEME, process.execPath, [
          entry,
        ]);
      } else {
        app.setAsDefaultProtocolClient(DEEP_LINK_SCHEME);
      }
    } else {
      // PROD
      app.setAsDefaultProtocolClient(DEEP_LINK_SCHEME);
    }
  } catch (e) {
    // no rompe si falla
  }
}

function createWindow() {
  const { RENDERER_DIST, MAIN_DIST } = getPaths();

  win = new BrowserWindow({
    width: 1100,
    height: 720,
    webPreferences: {
      // ⚠️ IMPORTANTE: electron-vite suele generar preload.mjs
      preload: path.join(MAIN_DIST, "preload.mjs"),
      contextIsolation: true,
      nodeIntegration: false,
      partition: "persist:twitch-oauth",
    },
  });

  win.webContents.on("did-fail-load", (_e, code, desc) => {
    console.error("did-fail-load", code, desc);
  });

  win.webContents.on("did-finish-load", () => {
    win?.webContents.openDevTools({ mode: "detach" });
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }

  // ✅ si la app se abrió por deep link en el primer arranque
  handleArgvDeepLink(process.argv);
}

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
  win = null;
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// Mantén una referencia para poder cerrarla luego
let oauthWin: BrowserWindow | null = null;

ipcMain.handle("oauth:twitchStart", async (_evt, url: string) => {
  // Si ya hay una abierta, enfócala
  if (oauthWin && !oauthWin.isDestroyed()) {
    oauthWin.focus();
    return true;
  }

  oauthWin = new BrowserWindow({
    width: 520,
    height: 720,
    resizable: false,
    minimizable: true,
    maximizable: false,
    title: "Conectar Twitch",
    parent: win ?? undefined, // usa tu window principal si existe
    modal: false,
    show: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
      contextIsolation: true,
      nodeIntegration: false,
      partition: "persist:twitch-oauth",
    },
  });

  oauthWin.on("closed", () => {
    oauthWin = null;
  });

  try {
    await oauthWin.loadURL(url);
    return true;
  } catch (e) {
    console.error("oauth:twitchStart loadURL failed:", e);
    // manda algo al renderer para que lo veas como toast si quieres
    win?.webContents.send("oauth:error", {
      message: String((e as any)?.message ?? e),
      url,
    });
    throw e;
  }
});

ipcMain.handle("oauth:getLast", async () => {
  return lastOAuthUrl; // variable que ya tienes en main.ts
});

app.whenReady().then(() => {
  registerProtocol();

  registerLicenseIpc();
  registerOverlayIpc();

  createWindow();
  if (win) registerUpdater(win);
});
