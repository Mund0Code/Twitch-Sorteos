import type { RaffleRules } from "../state/raffleRules.store";

export type JoinContext = {
  username: string;
  isSub: boolean;
  isMod: boolean;
  isVip: boolean;
};

export type JoinResult = { ok: true } | { ok: false; reason: string };

const cooldownMap = new Map<string, number>(); // user -> lastJoinEpochMs

export function resetCooldowns() {
  cooldownMap.clear();
}

export function canJoin(
  rules: RaffleRules,
  ctx: JoinContext,
  currentCount: number,
  alreadyInList: boolean
): JoinResult {
  const user = ctx.username.toLowerCase();

  if (!rules.isOpen) return { ok: false, reason: "Sorteo cerrado" };

  if (rules.banned?.includes(user))
    return { ok: false, reason: "Usuario baneado" };

  if (currentCount >= (rules.maxEntries ?? 5000))
    return { ok: false, reason: "Máximo alcanzado" };

  if (rules.uniqueOnly && alreadyInList)
    return { ok: false, reason: "Ya estabas dentro" };

  if (rules.gate === "subs" && !ctx.isSub)
    return { ok: false, reason: "Solo subs" };

  if (rules.gate === "mods_vips" && !ctx.isMod && !ctx.isVip)
    return { ok: false, reason: "Solo mods/VIPs" };

  const cd = Math.max(0, rules.cooldownSec ?? 0);
  if (cd > 0) {
    const now = Date.now();
    const last = cooldownMap.get(user) ?? 0;

    if (now - last < cd * 1000) {
      const left = Math.ceil((cd * 1000 - (now - last)) / 1000);
      return { ok: false, reason: `Cooldown (${left}s)` };
    }
    cooldownMap.set(user, now);
  }

  return { ok: true };
}
