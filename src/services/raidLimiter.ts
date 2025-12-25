type LimiterState = {
  windowMs: number; // ventana de tiempo
  maxEvents: number; // eventos en ventana
  lockMs: number; // cuánto dura el lock (slow/panic)
};

const defaultCfg: LimiterState = {
  windowMs: 3000, // 3s
  maxEvents: 25, // 25 joins en 3s => sospechoso
  lockMs: 15000, // 15s de lock
};

let cfg = { ...defaultCfg };
let events: number[] = []; // timestamps
let lockedUntil = 0;

export function setLimiterConfig(next: Partial<LimiterState>) {
  cfg = { ...cfg, ...next };
}

export function isLocked() {
  return Date.now() < lockedUntil;
}

export function lockNow(ms?: number) {
  lockedUntil = Date.now() + (ms ?? cfg.lockMs);
}

export function getLockSecondsLeft() {
  if (!isLocked()) return 0;
  return Math.ceil((lockedUntil - Date.now()) / 1000);
}

// Llamar en cada intento de join (cuando alguien escribe !sorteo)
export function recordJoinAttempt(): {
  ok: boolean;
  locked: boolean;
  reason?: string;
  lockSeconds?: number;
} {
  const now = Date.now();
  // limpia ventana
  events = events.filter((t) => now - t <= cfg.windowMs);
  events.push(now);

  if (isLocked()) {
    return {
      ok: false,
      locked: true,
      reason: "Slow mode activo",
      lockSeconds: getLockSecondsLeft(),
    };
  }

  if (events.length >= cfg.maxEvents) {
    lockNow();
    return {
      ok: false,
      locked: true,
      reason: "Raid detectado → slow mode",
      lockSeconds: getLockSecondsLeft(),
    };
  }

  return { ok: true, locked: false };
}

export function resetLimiter() {
  events = [];
  lockedUntil = 0;
}
