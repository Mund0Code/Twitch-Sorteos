import { create } from "zustand";

type ToastKind = "info" | "success" | "error";

type ToastState = {
  open: boolean;
  message: string;
  kind: ToastKind;
  show: (message: string, kind?: ToastKind, ms?: number) => void;
  hide: () => void;
};

let timer: any = null;

export const useToastStore = create<ToastState>((set, get) => ({
  open: false,
  message: "",
  kind: "info",
  show: (message, kind = "info", ms = 2600) => {
    if (timer) clearTimeout(timer);
    set({ open: true, message, kind });
    timer = setTimeout(() => get().hide(), ms);
  },
  hide: () => {
    if (timer) clearTimeout(timer);
    timer = null;
    set({ open: false });
  },
}));
