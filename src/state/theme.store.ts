import { create } from "zustand";

export type ThemeId = "dark" | "neon" | "minimal";

const LS_THEME = "ts_theme_v1";

type ThemeState = {
  theme: ThemeId;
  setTheme: (t: ThemeId) => void;
};

function loadTheme(): ThemeId {
  const raw = localStorage.getItem(LS_THEME);
  if (raw === "dark" || raw === "neon" || raw === "minimal") return raw;
  return "dark";
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: loadTheme(),
  setTheme: (t) => {
    localStorage.setItem(LS_THEME, t);
    set({ theme: t });
  },
}));
