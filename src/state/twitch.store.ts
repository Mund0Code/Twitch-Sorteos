import { create } from "zustand";

const LS_TWITCH_USER = "ts_twitch_username_v1";

type TwitchState = {
  username: string;
  setUsername: (u: string) => void;
};

function loadUsername() {
  return localStorage.getItem(LS_TWITCH_USER) ?? "";
}

export const useTwitchStore = create<TwitchState>((set) => ({
  username: loadUsername(),
  setUsername: (u) => {
    const clean = u.trim().replace(/^@/, "");
    localStorage.setItem(LS_TWITCH_USER, clean);
    set({ username: clean });
  },
}));
