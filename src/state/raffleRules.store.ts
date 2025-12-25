// src/state/raffleRules.store.ts
import { create } from "zustand";

export type EntryGate = "everyone" | "subs" | "mods_vips";

export type RaffleRules = {
  isOpen: boolean; // ✅ sorteo abierto/cerrado
  gate: EntryGate; // ✅ quien puede entrar
  cooldownSec: number; // ✅ cooldown por usuario
  uniqueOnly: boolean; // ✅ 1 entrada por usuario (recomendado)

  // ✅ Paso 4
  maxEntries: number; // máximo de participantes
  lockOnPick: boolean; // al sortear -> cerrar automáticamente
  banned: string[]; // lista de usuarios baneados (lowercase)
};

const LS_RULES = "ts_raffle_rules_v1";
const RULES_VERSION = 1;

function loadRules(): RaffleRules {
  const defaults: RaffleRules = {
    isOpen: true,
    gate: "everyone",
    cooldownSec: 5,
    uniqueOnly: true,
    maxEntries: 5000,
    lockOnPick: true,
    banned: [],
  };

  try {
    const raw = localStorage.getItem(LS_RULES);
    if (!raw) return defaults;

    const parsed = JSON.parse(raw);
    const r = parsed?.rules ?? parsed; // soporta tu formato viejo y el nuevo

    return {
      isOpen: typeof r.isOpen === "boolean" ? r.isOpen : defaults.isOpen,
      gate:
        r.gate === "subs" || r.gate === "mods_vips" ? r.gate : defaults.gate,
      cooldownSec:
        typeof r.cooldownSec === "number"
          ? Math.max(0, r.cooldownSec)
          : defaults.cooldownSec,
      uniqueOnly:
        typeof r.uniqueOnly === "boolean" ? r.uniqueOnly : defaults.uniqueOnly,

      maxEntries:
        typeof r.maxEntries === "number"
          ? Math.max(2, r.maxEntries)
          : defaults.maxEntries,
      lockOnPick:
        typeof r.lockOnPick === "boolean" ? r.lockOnPick : defaults.lockOnPick,
      banned: Array.isArray(r.banned)
        ? r.banned.map((x: any) => String(x).toLowerCase())
        : defaults.banned,
    };
  } catch {
    return defaults;
  }
}

function persist(rules: RaffleRules) {
  localStorage.setItem(LS_RULES, JSON.stringify({ v: RULES_VERSION, rules }));
}

type RulesState = {
  rules: RaffleRules;
  setRules: (next: Partial<RaffleRules>) => void;
  toggleOpen: () => void;
  resetRules: () => void;
};

export const useRaffleRulesStore = create<RulesState>((set, get) => ({
  rules: loadRules(),
  setRules: (next) => {
    const prev = get().rules;
    const merged: RaffleRules = {
      ...prev,
      ...next,
      cooldownSec:
        typeof next.cooldownSec === "number"
          ? Math.max(0, next.cooldownSec)
          : prev.cooldownSec,
      maxEntries:
        typeof next.maxEntries === "number"
          ? Math.max(2, next.maxEntries)
          : prev.maxEntries,
      banned: Array.isArray(next.banned)
        ? next.banned.map((x: any) => String(x).toLowerCase())
        : prev.banned,
      lockOnPick:
        typeof next.lockOnPick === "boolean"
          ? next.lockOnPick
          : prev.lockOnPick,
    };

    persist(merged);
    set({ rules: merged });
  },

  toggleOpen: () => {
    const merged = { ...get().rules, isOpen: !get().rules.isOpen };
    persist(merged);
    set({ rules: merged });
  },
  resetRules: () => {
    const fresh: RaffleRules = {
      isOpen: true,
      gate: "everyone",
      cooldownSec: 5,
      uniqueOnly: true,
      maxEntries: 5000,
      lockOnPick: true,
      banned: [],
    };
    persist(fresh);
    set({ rules: fresh });
  },
}));
