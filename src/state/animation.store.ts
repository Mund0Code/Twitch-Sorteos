import { create } from "zustand";

export type AnimationType = "reel" | "wheel" | "flash";

const LS_ANIM = "ts_anim_v1";

function loadAnim(): AnimationType {
  const v = localStorage.getItem(LS_ANIM);
  if (v === "wheel" || v === "flash") return v;
  return "reel";
}

type AnimState = {
  animation: AnimationType;
  setAnimation: (a: AnimationType) => void;
};

export const useAnimationStore = create<AnimState>((set) => ({
  animation: loadAnim(),
  setAnimation: (a) => {
    localStorage.setItem(LS_ANIM, a);
    set({ animation: a });
  },
}));
