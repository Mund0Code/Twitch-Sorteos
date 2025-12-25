// src/state/ui.store.ts
import { useSyncExternalStore } from "react";

export type UiMode = "admin" | "stream";

const LS_UI_MODE = "ts_ui_mode_v1";

type UiState = { mode: UiMode };
type Listener = () => void;

const listeners = new Set<Listener>();

function safeLoadMode(): UiMode {
  try {
    const raw = localStorage.getItem(LS_UI_MODE);
    return raw === "stream" ? "stream" : "admin";
  } catch {
    return "admin";
  }
}

let state: UiState = {
  // ✅ NO lee localStorage de forma peligrosa
  mode: "admin",
};

// ✅ inicializa cuando ya estamos en runtime (siempre seguro)
try {
  state.mode = safeLoadMode();
} catch {
  // ignore
}

function emit() {
  for (const l of listeners) l();
}

export function setMode(mode: UiMode) {
  state = { ...state, mode };
  try {
    localStorage.setItem(LS_UI_MODE, mode);
  } catch {
    // ignore
  }
  emit();
}

export function toggleMode() {
  setMode(state.mode === "admin" ? "stream" : "admin");
}

function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return state;
}

function getServerSnapshot() {
  // ✅ para SSR / pre-render o entornos sin window
  return { mode: "admin" as UiMode };
}

export function useUiStore() {
  const snap = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return {
    mode: snap.mode,
    setMode,
    toggleMode,
  };
}
