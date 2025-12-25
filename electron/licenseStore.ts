import Store from "electron-store";

export type LicenseData = {
  key?: string;
  expiresAt?: string;
  lastVerifiedAt?: string;
};

const store = new Store<{ license: LicenseData }>({
  name: "twitch-sorteos",
  defaults: {
    license: {}, // ⬅️ SIEMPRE vacío al inicio
  },
});

export const licenseStore = {
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
