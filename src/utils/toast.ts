import { useToastStore } from "../state/toast.store";

export type ToastKind = "info" | "success" | "error";

export const toast = {
  info: (message: string, ms = 2600) =>
    useToastStore.getState().show(message, "info", ms),

  success: (message: string, ms = 2600) =>
    useToastStore.getState().show(message, "success", ms),

  error: (message: string, ms = 3200) =>
    useToastStore.getState().show(message, "error", ms),
};
