import { create } from "zustand";

export type ActivityKind = "info" | "success" | "warn" | "error";

export type ActivityItem = {
  id: string;
  ts: number; // epoch ms
  kind: ActivityKind;
  title: string;
  meta?: string;
};

const LS_FEED = "ts_activity_feed_v1";
const MAX_ITEMS = 120;

function uid() {
  return (
    crypto.randomUUID?.() ??
    String(Date.now()) + Math.random().toString(16).slice(2)
  );
}

function loadFeed(): ActivityItem[] {
  try {
    const raw = localStorage.getItem(LS_FEED);
    return raw ? (JSON.parse(raw) as ActivityItem[]) : [];
  } catch {
    return [];
  }
}

function persist(items: ActivityItem[]) {
  localStorage.setItem(LS_FEED, JSON.stringify(items));
}

type ActivityState = {
  items: ActivityItem[];
  push: (item: Omit<ActivityItem, "id" | "ts">) => void;
  clear: () => void;
};

export const useActivityStore = create<ActivityState>((set, get) => ({
  items: loadFeed(),
  push: (item) => {
    const next: ActivityItem = {
      id: uid(),
      ts: Date.now(),
      ...item,
    };
    const items = [next, ...get().items].slice(0, MAX_ITEMS);
    persist(items);
    set({ items });
  },
  clear: () => {
    persist([]);
    set({ items: [] });
  },
}));
