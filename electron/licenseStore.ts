import Store from "electron-store";
import crypto from "node:crypto";

export type LicenseData = {
  key?: string;
  expiresAt?: string;
  lastVerifiedAt?: string;
};

type AppStore = {
  license: LicenseData;
  deviceId: string;
};

function ensureDeviceId(existing?: string) {
  if (existing && typeof existing === "string" && existing.length >= 8)
    return existing;
  // id estable por instalación
  return crypto.randomUUID?.() ?? crypto.randomBytes(16).toString("hex");
}

const store = new Store<AppStore>({
  name: "twitch-sorteos",
  defaults: {
    license: {}, // ⬅️ SIEMPRE vacío al inicio
    deviceId: "pending",
  },
});

export const licenseStore = {
  // ✅ DEVICE ID
  getDeviceId(): string {
    const current = store.get("deviceId");
    const fixed = ensureDeviceId(current);
    if (fixed !== current) store.set("deviceId", fixed);
    return fixed;
  },

  // ✅ LICENSE
  get(): LicenseData {
    return store.get("license");
  },
  set(data: LicenseData) {
    store.set("license", data);
  },
  clear() {
    store.set("license", {}); // ⬅️ limpiar explícitamente
  },
};
