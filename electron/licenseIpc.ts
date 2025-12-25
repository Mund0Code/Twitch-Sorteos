import { ipcMain } from "electron";
import { licenseStore } from "./licenseStore";
import { machineId } from "node-machine-id";

const API_URL = "http://127.0.0.1:3001";

const getDeviceId = async () => {
  const id = await machineId(true);
  return String(id);
};

export function registerLicenseIpc() {
  // 🔍 Verificar licencia (al arrancar)
  ipcMain.handle("license:status", async () => {
    const data = licenseStore.get();
    if (!data.key) return { valid: false, expiresAt: null };

    try {
      const deviceId = await getDeviceId();

      const res = await fetch(`${API_URL}/license/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: data.key,
          deviceId,
        }),
      });

      if (!res.ok) throw new Error("verify failed");

      const json = await res.json();

      if (!json.valid) {
        licenseStore.clear();
        return { valid: false, expiresAt: null };
      }

      return {
        valid: true,
        expiresAt: json.expiresAt ?? null,
        capabilities: json.capabilities ?? {},
      };
    } catch (err) {
      // fallback offline corto (opcional)
      return { valid: false, expiresAt: null };
    }
  });

  // 🔑 Activar licencia (cuando el usuario la introduce)
  ipcMain.handle("license:activate", async (_evt, key: string) => {
    try {
      const deviceId = await getDeviceId();

      const res = await fetch(`${API_URL}/license/activate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key,
          deviceId,
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.ok) {
        return { ok: false, error: json.error ?? "Activation failed" };
      }

      // Guardamos SOLO datos locales mínimos
      licenseStore.set({
        key,
        expiresAt: json.expiresAt,
        lastVerifiedAt: new Date().toISOString(),
      });

      return {
        ok: true,
        expiresAt: json.expiresAt,
        capabilities: json.capabilities,
      };
    } catch (err) {
      return { ok: false, error: "No se pudo conectar con el servidor" };
    }
  });

  ipcMain.handle("license:trialStart", async (_evt, twitchUser?: string) => {
    try {
      const deviceId = await getDeviceId();

      const res = await fetch(`${API_URL}/trial/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deviceId, twitchUser }),
      });

      const json = await res.json().catch(() => null);

      if (!res.ok || !json?.ok) {
        return { ok: false, error: json?.error ?? "Trial failed" };
      }

      licenseStore.set({
        key: json.key,
        expiresAt: json.expiresAt,
        lastVerifiedAt: new Date().toISOString(),
      });

      return {
        ok: true,
        key: json.key,
        expiresAt: json.expiresAt,
        capabilities: json.capabilities,
      };
    } catch (err) {
      return { ok: false, error: "No se pudo conectar con el servidor" };
    }
  });

  // 🧹 Cerrar sesión licencia
  ipcMain.handle("license:clear", () => {
    licenseStore.clear();
    return true;
  });
}
