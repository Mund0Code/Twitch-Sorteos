import { BrowserWindow, ipcMain } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";

type OverlayState = {
  title?: string;
  prize?: string;
  winner?: string | null;
  picking?: boolean;
};

let overlayWin: BrowserWindow | null = null;
let lastState: OverlayState = {};

export function registerOverlayIpc() {
  ipcMain.handle("overlay:open", async () => {
    if (overlayWin && !overlayWin.isDestroyed()) {
      overlayWin.show();
      overlayWin.focus();
      return true;
    }

    const __dirname = path.dirname(fileURLToPath(import.meta.url));

    overlayWin = new BrowserWindow({
      width: 520,
      height: 220,
      transparent: true,
      frame: false,
      alwaysOnTop: true,
      resizable: true,
      hasShadow: false,
      skipTaskbar: true,
      webPreferences: {
        preload: path.join(__dirname, "preload.mjs"),
        contextIsolation: true,
        nodeIntegration: false,
      },
    });

    overlayWin.on("closed", () => (overlayWin = null));

    // Cargar renderer normal, pero en modo overlay (hash route)
    const devUrl = process.env["VITE_DEV_SERVER_URL"];
    if (devUrl) {
      await overlayWin.loadURL(`${devUrl}#/overlay`);
    } else {
      // en build: dist/index.html + hash
      const appRoot = process.env.APP_ROOT!;
      const rendererDist = path.join(appRoot, "dist");
      await overlayWin.loadFile(path.join(rendererDist, "index.html"), {
        hash: "/overlay",
      });
    }

    // Enviamos el último estado (si ya hay)
    overlayWin.webContents.once("did-finish-load", () => {
      overlayWin?.webContents.send("overlay:update", lastState);
    });

    return true;
  });

  ipcMain.handle("overlay:close", () => {
    if (overlayWin && !overlayWin.isDestroyed()) {
      overlayWin.close();
      overlayWin = null;
    }
    return true;
  });

  ipcMain.handle("overlay:setState", (_evt, state: OverlayState) => {
    lastState = { ...lastState, ...state };
    if (overlayWin && !overlayWin.isDestroyed()) {
      overlayWin.webContents.send("overlay:update", lastState);
    }
    return true;
  });

  ipcMain.handle("overlay:isOpen", () => {
    return !!overlayWin && !overlayWin.isDestroyed();
  });

  ipcMain.handle("overlay:clickThrough", (_evt, enabled: boolean) => {
    if (overlayWin && !overlayWin.isDestroyed()) {
      overlayWin.setIgnoreMouseEvents(enabled, { forward: true });
    }
    return true;
  });
}
