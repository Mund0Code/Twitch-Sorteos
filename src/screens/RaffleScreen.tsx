import { useEffect, useMemo, useRef, useState, useCallback } from "react";

import WinnerReel from "../components/WinnerReel";
import WinnerWheel from "../components/WinnerWheel";
import WinnerFlash from "../components/WinnerFlash";
import {
  exportHistoryToCSV,
  exportHistoryToJSON,
} from "../utils/exportHistory";
import { TwitchChatService } from "../services/twitchChat";
import { useUiStore } from "../state/ui.store";

import { getValidAccessToken } from "../services/twitchAuth";

import { useRaffleRulesStore } from "../state/raffleRules.store";

import { useActivityStore } from "../state/activity.store";

import ParticipantRow from "../components/raffle/ParticipantRow";

import { useAnimationStore } from "../state/animation.store";

import { throttle } from "../utils/throttle";

import { canJoin, resetCooldowns } from "../services/raffleGate"; // ajusta path si hace falta

import {
  recordJoinAttempt,
  isLocked,
  getLockSecondsLeft,
} from "../services/raidLimiter";

import { RaffleHeader } from "../components/raffle/RaffleHeader";

declare global {
  interface Window {
    appApi: {
      version: () => string;
    };
    overlayApi?: any;
    licenseApi?: any;
    oauthApi?: any;
    deviceApi?: any;
  }
}

type Raffle = {
  id: string;
  title: string;
  prize: string;
  createdAt: string; // ISO
  participants: string[];
  winner?: string;
};

type LicenseInfo = {
  valid: boolean;
  expiresAt: string | null;
  daysLeft: number | null;
};

type AnimMode = "reel" | "wheel" | "flash";

const LS_CURRENT = "ts_raffle_current_v1";
const LS_HISTORY = "ts_raffle_history_v1";
const LS_ANIM = "ts_raffle_anim_v1";
const LS_TWITCH_USER = "ts_twitch_username_v1";

// ✅ Tokens guardados (FASE 2)
const LS_TWITCH_TOKENS = "ts_twitch_tokens_v1";
type TwitchTokens = {
  access_token: string;
  refresh_token: string;
  expires_at: number; // epoch ms
};

function saveTokens(t: TwitchTokens) {
  localStorage.setItem(LS_TWITCH_TOKENS, JSON.stringify(t));
}
function loadTokens(): TwitchTokens | null {
  try {
    const raw = localStorage.getItem(LS_TWITCH_TOKENS);
    return raw ? (JSON.parse(raw) as TwitchTokens) : null;
  } catch {
    return null;
  }
}

function uid() {
  return (
    crypto.randomUUID?.() ??
    String(Date.now()) + Math.random().toString(16).slice(2)
  );
}

function normalizeName(s: string) {
  return s.trim().replace(/\s+/g, " ");
}

function cleanChannel(s: string) {
  return s.trim().replace(/^@/, "").toLowerCase();
}

function calcDaysLeft(expiresAt: string | null) {
  if (!expiresAt) return null;
  const ms = new Date(expiresAt).getTime() - Date.now();
  return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}

function loadCurrent(): Raffle | null {
  try {
    const raw = localStorage.getItem(LS_CURRENT);
    return raw ? (JSON.parse(raw) as Raffle) : null;
  } catch {
    return null;
  }
}

function saveCurrent(r: Raffle | null) {
  if (!r) localStorage.removeItem(LS_CURRENT);
  else localStorage.setItem(LS_CURRENT, JSON.stringify(r));
}

function loadHistory(): Raffle[] {
  try {
    const raw = localStorage.getItem(LS_HISTORY);
    return raw ? (JSON.parse(raw) as Raffle[]) : [];
  } catch {
    return [];
  }
}

function saveHistory(items: Raffle[]) {
  localStorage.setItem(LS_HISTORY, JSON.stringify(items));
}

function loadAnim(): AnimMode {
  const raw = localStorage.getItem(LS_ANIM);
  if (raw === "wheel" || raw === "flash" || raw === "reel") return raw;
  return "reel";
}

/** Mini toast sin dependencias */
type ToastKind = "info" | "success" | "error";
function toastColors(kind: ToastKind) {
  if (kind === "success")
    return { border: "rgba(34,197,94,0.45)", bg: "rgba(34,197,94,0.14)" };
  if (kind === "error")
    return { border: "rgba(251,113,133,0.45)", bg: "rgba(251,113,133,0.14)" };
  return { border: "rgba(255,255,255,0.20)", bg: "rgba(0,0,0,0.35)" };
}

type RaffleScreenProps = {
  appVersion?: string;
  openNotes?: () => void;
};

export default function RaffleScreen({
  appVersion,
  openNotes,
}: RaffleScreenProps) {
  // ✅ UI Mode (Admin / Stream)
  const { mode, toggleMode, setMode } = useUiStore();
  const isStream = mode === "stream";

  const [raffle, setRaffle] = useState<Raffle | null>(() => loadCurrent());
  const [history, setHistory] = useState<Raffle[]>(() => loadHistory());

  const [title, setTitle] = useState(raffle?.title ?? "Sorteo");
  const [prize, setPrize] = useState(raffle?.prize ?? "");
  const [input, setInput] = useState("");

  const [picking, setPicking] = useState(false);
  const [finalWinner, setFinalWinner] = useState<string | null>(null);

  const [showAnim, setShowAnim] = useState(false);
  const [anim, setAnim] = useState<AnimMode>(() => loadAnim());

  const [licenseInfo, setLicenseInfo] = useState<LicenseInfo>({
    valid: false,
    expiresAt: null,
    daysLeft: null,
  });

  const [twitchConnected, setTwitchConnected] = useState(false);
  const [twitchConnecting, setTwitchConnecting] = useState(false);

  const [slowMode, setSlowMode] = useState(false);
  const [slowLeft, setSlowLeft] = useState(0);

  const chatRef = useRef<TwitchChatService | null>(null);

  // ✅ canal “pendiente” para conectar cuando llegue OAuth callback
  const pendingChannelRef = useRef<string | null>(null);

  const { rules, setRules, toggleOpen } = useRaffleRulesStore();

  const proButtonLabel = twitchConnecting
    ? "Conectando..."
    : "OAuth + Conectar Chat (!sorteo)";

  const status = useMemo(() => {
    if (picking) return "picking" as const;
    if (!rules.isOpen) return "closed" as const;
    return "open" as const;
  }, [picking, rules.isOpen]);

  const statusLabel = useMemo(() => {
    if (status === "picking")
      return { cls: "statusPicking", txt: "🎬 SORTEANDO" };
    if (status === "closed") return { cls: "statusClosed", txt: "🔒 CERRADO" };
    return { cls: "statusOpen", txt: "🟢 ABIERTO" };
  }, [status]);

  const gateLabel =
    rules.gate === "everyone"
      ? "Everyone"
      : rules.gate === "subs"
        ? "Subs"
        : "Mods/VIPs";

  // cooldown por usuario (no persistente; se reinicia al cerrar app)
  const lastJoinRef = useRef<Map<string, number>>(new Map());

  // ✅ Toast state
  const [toast, setToast] = useState<{
    open: boolean;
    msg: string;
    kind: ToastKind;
  }>({ open: false, msg: "", kind: "info" });

  const [overlayOpen, setOverlayOpen] = useState(false);

  const feed = useActivityStore((s) => s.items);
  const pushFeed = useActivityStore((s) => s.push);
  const clearFeed = useActivityStore((s) => s.clear);

  const { animation } = useAnimationStore();

  const [version, setVersion] = useState("");

  useEffect(() => {
    setVersion(window.appApi?.version?.() ?? "");
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      const locked = isLocked();
      setSlowMode(locked);
      setSlowLeft(locked ? getLockSecondsLeft() : 0);
    }, 400);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const open = await window.overlayApi?.isOpen?.();
        setOverlayOpen(!!open);
      } catch {
        setOverlayOpen(false);
      }
    })();
  }, []);

  function showToast(msg: string, kind: ToastKind = "info", ms = 2600) {
    setToast({ open: true, msg, kind });
    window.setTimeout(() => {
      setToast((t) => (t.open && t.msg === msg ? { ...t, open: false } : t));
    }, ms);
  }

  // ✅ F11 => toggle Stream/Admin
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "F11") {
        e.preventDefault();
        toggleMode();
      }
      // Escape: salir de stream
      if (e.key === "Escape" && isStream) {
        setMode("admin");
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [toggleMode, isStream, setMode]);

  // ---- License status ----
  useEffect(() => {
    (async () => {
      try {
        const s = await window.licenseApi.status();
        const expiresAt = s.expiresAt ?? null;
        setLicenseInfo({
          valid: !!s.valid,
          expiresAt,
          daysLeft: calcDaysLeft(expiresAt),
        });
      } catch {
        // keep FREE
      }
    })();
  }, []);

  // ---- Persistencia ----
  useEffect(() => saveCurrent(raffle), [raffle]);
  useEffect(() => saveHistory(history), [history]);
  useEffect(() => localStorage.setItem(LS_ANIM, anim), [anim]);

  const participants = raffle?.participants ?? [];
  const canPick = participants.length >= 2 && !picking;

  const stats = useMemo(() => {
    const unique = new Set(participants.map((p) => p.toLowerCase()));
    return { total: participants.length, unique: unique.size };
  }, [participants]);

  // ✅ Throttle para overlay (evita spam IPC + evita crash por TDZ)
  const sendOverlay = useMemo(() => {
    return throttle((state: any) => {
      window.overlayApi?.setState?.(state);
    }, 150);
  }, []);

  // ---- Overlay sync (THROTTLED) ----
  useEffect(() => {
    if (!window.overlayApi?.setState) return;

    sendOverlay({
      title: raffle?.title ?? title,
      prize: raffle?.prize ?? prize,
      winner: raffle?.winner ?? null,
      picking,

      animation,

      total: stats.total,
      unique: stats.unique,

      status: picking
        ? "picking"
        : raffle && participants.length >= 2
          ? "ready"
          : "idle",

      // FASE 3 (rules)
      statusMode: picking ? "picking" : rules.isOpen ? "open" : "closed",
      gate: rules.gate,
      isOpen: rules.isOpen,
      cooldownSec: rules.cooldownSec,
      uniqueOnly: rules.uniqueOnly,
      maxEntries: rules.maxEntries,
    });
  }, [
    sendOverlay,
    raffle?.title,
    raffle?.prize,
    raffle?.winner,
    title,
    prize,
    picking,
    animation,
    stats.total,
    stats.unique,
    participants.length,
    rules.isOpen,
    rules.gate,
    rules.cooldownSec,
    rules.uniqueOnly,
    rules.maxEntries,
  ]);

  useEffect(() => {
    if (!overlayOpen) return;
    if (!window.overlayApi?.setState) return;

    sendOverlay({
      title: raffle?.title ?? title,
      prize: raffle?.prize ?? prize,
      winner: raffle?.winner ?? null,
      picking,

      total: stats.total,
      unique: stats.unique,

      // estado pro
      statusMode: picking ? "picking" : rules.isOpen ? "open" : "closed",
      isOpen: rules.isOpen,
      gate: rules.gate,
      cooldownSec: rules.cooldownSec,
      uniqueOnly: rules.uniqueOnly,
      maxEntries: rules.maxEntries,
    });
  }, [
    overlayOpen,
    sendOverlay,
    raffle?.title,
    raffle?.prize,
    raffle?.winner,
    title,
    prize,
    picking,
    stats.total,
    stats.unique,
    rules.isOpen,
    rules.gate,
    rules.cooldownSec,
    rules.uniqueOnly,
    rules.maxEntries,
  ]);

  // ✅ OAuth callback GLOBAL: solo 1 listener (session-based)
  useEffect(() => {
    const unsub = window.oauthApi?.onCallback?.(async (url: string) => {
      try {
        if (!String(url).startsWith("twitch-sorteos://oauth")) return;

        const channel = pendingChannelRef.current;
        pendingChannelRef.current = null;

        // si no estábamos esperando OAuth, ignoramos
        if (!channel) return;

        const u = new URL(url);
        const session = u.searchParams.get("session");
        if (!session) {
          showToast("OAuth recibido, pero falta session.", "error");
          return;
        }

        const res = await fetch(
          `http://localhost:3001/oauth/session/${session}`,
        );
        const json = await res.json();

        if (!res.ok || !json.ok) {
          showToast("OAuth falló al recuperar tokens.", "error");
          return;
        }

        const expires_at = Date.now() + Number(json.expires_in) * 1000;

        saveTokens({
          access_token: json.access_token,
          refresh_token: json.refresh_token,
          expires_at,
        });

        showToast("✅ Twitch OAuth OK. Conectando chat…", "success", 1800);

        // (Paso 2 lo haremos con token real, por ahora reusa tu servicio)
        await startChatPro(channel);
      } catch (e) {
        console.error(e);
        showToast("Error procesando OAuth callback.", "error");
      } finally {
        setTwitchConnecting(false);
      }
    });

    return () => {
      if (typeof unsub === "function") unsub();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [picking]);

  function createNewRaffle() {
    const r: Raffle = {
      id: uid(),
      title: title.trim() || "Sorteo",
      prize: prize.trim(),
      createdAt: new Date().toISOString(),
      participants: [],
    };
    setRaffle(r);
    setFinalWinner(null);
    setShowAnim(false);

    // si cambia titulo, mantenlo coherente en inputs
    setTitle(r.title);
    setPrize(r.prize);
    resetCooldowns();
  }

  function addParticipantsFromText() {
    if (!raffle) return;
    const lines = input.split("\n").map(normalizeName).filter(Boolean);
    if (lines.length === 0) return;

    const existing = new Set(raffle.participants.map((p) => p.toLowerCase()));
    const toAdd: string[] = [];
    for (const n of lines) {
      const key = n.toLowerCase();
      if (!existing.has(key)) {
        existing.add(key);
        toAdd.push(n);
      }
    }

    if (toAdd.length === 0) {
      setInput("");
      return;
    }

    setRaffle({
      ...raffle,
      participants: [...raffle.participants, ...toAdd],
    });
    setInput("");
  }

  const removeParticipant = useCallback((name: string) => {
    setRaffle((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        participants: prev.participants.filter((p) => p !== name),
      };
    });
  }, []);

  async function pickWinner() {
    if (!raffle) return;
    if (participants.length < 2) return;

    if (rules.lockOnPick) setRules({ isOpen: false });
    pushFeed({ kind: "info", title: "Sorteando…", meta: `anim: ${anim}` });

    setPicking(true);
    setShowAnim(true);
    setFinalWinner(null);

    const winner =
      participants[Math.floor(Math.random() * participants.length)];
    setFinalWinner(winner);
  }

  function resetParticipants() {
    if (!raffle) return;
    setRaffle({ ...raffle, participants: [], winner: undefined });
    setFinalWinner(null);
    setShowAnim(false);
    setPicking(false);
  }

  function clearAll() {
    setRaffle(null);
    setHistory([]);
    setTitle("Sorteo");
    setPrize("");
    setInput("");
    setFinalWinner(null);
    setShowAnim(false);
    setPicking(false);
    localStorage.removeItem(LS_CURRENT);
    localStorage.removeItem(LS_HISTORY);
  }

  async function openOverlay() {
    if (!window.overlayApi?.open) return;
    await window.overlayApi.open();
    setOverlayOpen(true);

    await window.overlayApi.setState({
      title: raffle?.title ?? title,
      prize: raffle?.prize ?? prize,
      winner: raffle?.winner ?? null,
      picking,
      animation,
    });
  }

  async function closeOverlay() {
    await window.overlayApi?.close?.();
    setOverlayOpen(false);
  }

  async function startChatPro(channel: string) {
    if (!raffle) {
      showToast("Crea un sorteo antes de conectar el chat.", "error");
      return;
    }

    const access = await getValidAccessToken();
    if (!access) {
      showToast("Token inválido/expirado. Haz OAuth de nuevo.", "error");
      setTwitchConnected(false);
      return;
    }

    if (!chatRef.current) chatRef.current = new TwitchChatService();

    try {
      await chatRef.current.connectPro(channel, access, {
        onJoin: (payload: any) => {
          // payload viene con roles ✅ (según me dijiste)
          const username = String(
            payload?.username ?? payload?.user ?? payload ?? "",
          ).trim();
          if (!username) return;
          if (picking) return;

          const uname = username.toLowerCase();

          // estado actual (rápido)
          const currentCount = raffle?.participants?.length ?? 0;
          const alreadyIn =
            raffle?.participants?.some((p) => p.toLowerCase() === uname) ??
            false;

          const result = canJoin(
            rules,
            {
              username,
              isSub: !!payload?.isSub,
              isMod: !!payload?.isMod,
              isVip: !!payload?.isVip,
            },
            currentCount,
            alreadyIn,
          );

          if (!result.ok) {
            // no spamear cooldown
            if (!result.reason.startsWith("Cooldown")) {
              pushFeed({
                kind: "warn",
                title: `@${username} rechazado`,
                meta: result.reason,
              });
            }
            return;
          }

          setRaffle((prev) => {
            if (!prev) return prev;

            // re-check (anti race)
            const exists = prev.participants.some(
              (p) => p.toLowerCase() === uname,
            );
            if (rules.uniqueOnly && exists) return prev;

            // maxEntries hard cap
            if (prev.participants.length >= (rules.maxEntries ?? 5000))
              return prev;

            return { ...prev, participants: [...prev.participants, username] };
          });

          const gateMeta =
            rules.gate === "everyone"
              ? "everyone"
              : rules.gate === "subs"
                ? "subs"
                : "mods/vips";

          pushFeed({
            kind: "success",
            title: `@${username} entró ✅`,
            meta: gateMeta,
          });
        },
        onStatus: (msg) => showToast(msg, "info", 1200),
        onError: (msg) => {
          console.error(msg);
          showToast(msg, "error");
        },
        onControl: (evt) => {
          if (evt.type === "open") {
            setRules({ isOpen: true });
            pushFeed({
              kind: "success",
              title: "Sorteo abierto",
              meta: `por ${evt.by} (${evt.role})`,
            });
            showToast(`🟢 Sorteo abierto por ${evt.by}`, "success", 1400);
            return;
          }

          if (evt.type === "close") {
            setRules({ isOpen: false });
            pushFeed({
              kind: "warn",
              title: "Sorteo cerrado",
              meta: `por ${evt.by} (${evt.role})`,
            });
            showToast(`🔴 Sorteo cerrado por ${evt.by}`, "info", 1400);
            return;
          }

          if (evt.type === "reset") {
            // vacía participantes
            setRaffle((prev) =>
              prev ? { ...prev, participants: [], winner: undefined } : prev,
            );
            pushFeed({
              kind: "info",
              title: "Reset de participantes",
              meta: `por ${evt.by} (${evt.role})`,
            });
            showToast("🧹 Reset realizado", "info", 1200);
            return;
          }

          if (evt.type === "reroll") {
            // sólo si hay participantes
            if (!raffle || raffle.participants.length < 2) return;
            const winner =
              raffle.participants[
                Math.floor(Math.random() * raffle.participants.length)
              ];
            setFinalWinner(winner);
            setShowAnim(true);
            setPicking(true);
            pushFeed({
              kind: "success",
              title: "Reroll",
              meta: `nuevo ganador: ${winner}`,
            });
            showToast("🎲 Reroll…", "info", 1200);
            return;
          }

          if (evt.type === "ban") {
            const t = evt.target.toLowerCase();
            setRules({
              banned: Array.from(new Set([...(rules.banned ?? []), t])),
            });
            pushFeed({
              kind: "warn",
              title: "Usuario baneado",
              meta: `@${evt.target} por ${evt.by}`,
            });
            showToast(`⛔ Baneado @${evt.target}`, "info", 1200);
            return;
          }

          if (evt.type === "unban") {
            const t = evt.target.toLowerCase();
            setRules({ banned: (rules.banned ?? []).filter((x) => x !== t) });
            pushFeed({
              kind: "info",
              title: "Usuario desbaneado",
              meta: `@${evt.target} por ${evt.by}`,
            });
            showToast(`✅ Unban @${evt.target}`, "success", 1200);
            return;
          }

          if (evt.type === "leave") {
            const uname = evt.by.toLowerCase();
            setRaffle((prev) => {
              if (!prev) return prev;
              return {
                ...prev,
                participants: prev.participants.filter(
                  (p) => p.toLowerCase() !== uname,
                ),
              };
            });
            pushFeed({ kind: "info", title: `@${evt.by} salió del sorteo` });
            return;
          }

          if (evt.type === "status") {
            const open = rules.isOpen ? "ABIERTO" : "CERRADO";
            pushFeed({
              kind: "info",
              title: `Estado: ${open}`,
              meta: `👥 ${participants.length} participantes`,
            });
            return;
          }
        },

        onJoinAttempt: ({ user, role }: { user: string; role: string }) => {
          if (!raffle) return;

          const key = user.toLowerCase();

          const rl = recordJoinAttempt();
          if (!rl.ok) {
            if (rl.reason) {
              pushFeed({
                kind: "warn",
                title: rl.reason,
                meta: rl.lockSeconds ? `⏳ ${rl.lockSeconds}s` : undefined,
              });
            }
            return; // 🚫 bloquea entrada
          }

          // cerrado
          if (!rules.isOpen) {
            showToast("El sorteo está cerrado. Ábrelo para sortear.", "error");
            return;
          }

          // baneado
          if ((rules.banned ?? []).includes(key)) {
            pushFeed({
              kind: "error",
              title: "Baneado",
              meta: `@${user} intentó entrar`,
            });
            return;
          }

          // gate
          if (rules.gate === "subs") {
            const ok =
              role === "sub" || role === "mod" || role === "broadcaster";
            if (!ok) {
              pushFeed({
                kind: "warn",
                title: "No es sub",
                meta: `@${user} (${role})`,
              });
              return;
            }
          }

          if (rules.gate === "mods_vips") {
            const ok =
              role === "mod" || role === "vip" || role === "broadcaster";
            if (!ok) {
              pushFeed({
                kind: "warn",
                title: "No permitido",
                meta: `@${user} (${role})`,
              });
              return;
            }
          }

          // max entries
          if (raffle.participants.length >= rules.maxEntries) {
            pushFeed({
              kind: "error",
              title: "Límite alcanzado",
              meta: `max ${rules.maxEntries}`,
            });
            return;
          }

          // cooldown
          const now = Date.now();
          const last = lastJoinRef.current.get(key) ?? 0;
          const cdMs = Math.max(0, rules.cooldownSec) * 1000;
          if (cdMs > 0 && now - last < cdMs) {
            return;
          }
          lastJoinRef.current.set(key, now);

          setRaffle((prev) => {
            if (!prev) return prev;
            if (picking) return prev;

            const exists = prev.participants.some(
              (p) => p.toLowerCase() === key,
            );
            if (exists && rules.uniqueOnly) return prev;

            pushFeed({
              kind: "success",
              title: "Entró al sorteo",
              meta: `@${user} (${role})`,
            });
            return { ...prev, participants: [...prev.participants, user] };
          });
        },
      });

      setTwitchConnected(true);
    } catch {
      setTwitchConnected(false);
    } finally {
      setTwitchConnecting(false);
    }
  }

  async function connectTwitchOAuthAndChat() {
    if (!licenseInfo.valid) {
      showToast("Necesitas PRO para conectar Twitch Chat.", "error");
      return;
    }

    const channelRaw = localStorage.getItem(LS_TWITCH_USER) ?? "";
    const channel = cleanChannel(channelRaw);

    if (!channel) {
      showToast("Primero define tu canal de Twitch (usuario).", "error");
      return;
    }

    if (!raffle) {
      showToast("Crea un sorteo primero (➕ Nuevo).", "info");
      return;
    }

    // Si ya hay tokens válidos guardados, conecta directo
    const tokens = loadTokens();
    if (tokens && tokens.expires_at > Date.now()) {
      showToast("Tokens OK. Conectando chat…", "info", 1200);
      await startChatPro(channel);
      return;
    }

    setTwitchConnecting(true);
    pendingChannelRef.current = channel;

    try {
      showToast("Abriendo Twitch OAuth…", "info", 1600);

      const { deviceId } = await window.deviceApi!.getId();
      if (!deviceId) throw new Error("Missing deviceId");

      const st = await window.licenseApi.status();
      const key = st.key; // ✅ necesita existir en tu status()

      if (!key) {
        showToast(
          "No se encontró la licencia activa. Activa PRO primero.",
          "error",
        );
        pendingChannelRef.current = null;
        setTwitchConnecting(false);
        return;
      }

      const startUrl = `http://127.0.0.1:3001/auth/twitch/start?deviceId=${encodeURIComponent(
        deviceId,
      )}&key=${encodeURIComponent(key ?? "")}`;

      await window.oauthApi?.twitchStart?.(startUrl);
    } catch (e) {
      console.error(e);
      pendingChannelRef.current = null;
      setTwitchConnecting(false);
      showToast("No se pudo abrir la ventana OAuth.", "error");
    }
  }

  function disconnectTwitch() {
    chatRef.current?.disconnect();
    setTwitchConnected(false);
    setTwitchConnecting(false);
    pendingChannelRef.current = null;
    showToast("Chat desconectado.", "info", 1200);
  }

  // ---- Winner renderer según anim ----
  const winnerNode = useMemo(() => {
    if (!showAnim || !finalWinner) return null;

    const onFinish = () => {
      if (!raffle) return;

      const finished = { ...raffle, winner: finalWinner };
      setRaffle(finished);
      setHistory((prev) => [finished, ...prev].slice(0, 30));

      setPicking(false);
      setShowAnim(false);

      pushFeed({
        kind: "success",
        title: "Ganador",
        meta: `🎉 ${finalWinner}`,
      });
    };

    if (anim === "wheel") {
      return (
        <WinnerWheel
          participants={participants}
          winner={finalWinner}
          durationMs={2400}
          onFinish={onFinish}
        />
      );
    }

    if (anim === "flash") {
      return (
        <WinnerFlash
          participants={participants}
          winner={finalWinner}
          durationMs={1600}
          onFinish={onFinish}
        />
      );
    }

    return (
      <WinnerReel
        participants={participants}
        winner={finalWinner}
        durationMs={1900}
        onFinish={onFinish}
      />
    );
  }, [anim, finalWinner, participants, raffle, showAnim, pushFeed]);

  const toastStyle = toastColors(toast.kind);

  return (
    <div className={`page ${isStream ? "streamRoot" : ""}`}>
      {/* Toast */}
      {toast.open && (
        <div
          style={{
            position: "fixed",
            left: "50%",
            bottom: 18,
            transform: "translateX(-50%)",
            zIndex: 9999,
            padding: "10px 12px",
            borderRadius: 14,
            border: `1px solid ${toastStyle.border}`,
            background: toastStyle.bg,
            color: "rgba(255,255,255,0.92)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
            minWidth: 260,
            maxWidth: "90vw",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 10,
          }}
          role="status"
          aria-live="polite"
        >
          <div style={{ fontSize: 13, fontWeight: 900 }}>{toast.msg}</div>
          <button
            onClick={() => setToast((t) => ({ ...t, open: false }))}
            style={{
              border: "none",
              background: "transparent",
              color: "rgba(255,255,255,0.75)",
              cursor: "pointer",
              fontWeight: 900,
            }}
            title="Cerrar"
          >
            ✖
          </button>
        </div>
      )}

      <div className="card" style={{ width: 1050, maxWidth: "95vw" }}>
        <RaffleHeader
          licenseInfo={licenseInfo}
          twitchConnected={twitchConnected}
          isStream={isStream}
          overlayOpen={overlayOpen}
          statsTotal={stats.total}
          statsUnique={stats.unique}
          raffleTitleLabel={
            raffle ? `Sorteo: ${raffle.title}` : "Sin sorteo activo"
          }
          appVersion={appVersion}
          openNotes={openNotes}
          statusLabel={statusLabel}
          gateLabel={gateLabel}
          isOpen={rules.isOpen}
          cooldownSec={rules.cooldownSec}
          uniqueOnly={rules.uniqueOnly}
          maxEntries={rules.maxEntries}
          slowMode={slowMode}
          slowLeft={slowLeft}
          onToggleStream={() =>
            isStream ? setMode("admin") : setMode("stream")
          }
          onToggleOpen={toggleOpen}
          onNew={createNewRaffle}
          onClean={resetParticipants}
          onReset={clearAll}
          onOpenOverlay={openOverlay}
          onCloseOverlay={closeOverlay}
          onConnectOAuthAndChat={connectTwitchOAuthAndChat}
          onDisconnectChat={disconnectTwitch}
          proButtonDisabled={twitchConnecting}
          proButtonLabel={proButtonLabel /* o tu ternario actual */}
          showStreamHotkeys
          isPro={licenseInfo.valid}
          onBuyPro={() => showToast("Compra PRO desde la web.", "info")}
        />

        {/* ✅ Si estás en Stream, puedes ocultar el panel admin si quieres */}
        <div className="grid2">
          {/* Panel izquierda */}
          <div className="panel">
            {!isStream && (
              <>
                <div className="row2">
                  <div>
                    <label className="label">Título</label>
                    <input
                      className="input"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Sorteo navideño"
                    />
                  </div>
                  <div>
                    <label className="label">Premio (opcional)</label>
                    <input
                      className="input"
                      value={prize}
                      onChange={(e) => setPrize(e.target.value)}
                      placeholder="Ej: 10€ PayPal / skin / etc."
                    />
                  </div>
                </div>

                <div style={{ marginTop: 14 }}>
                  <label className="label">Animación del ganador</label>
                  <select
                    className="input"
                    value={anim}
                    onChange={(e) => setAnim(e.target.value as AnimMode)}
                  >
                    <option value="reel">🎞️ Reel (actual)</option>
                    <option value="wheel">🎡 Ruleta</option>
                    <option value="flash">⚡ Flash</option>
                  </select>
                </div>

                <div style={{ marginTop: 14 }}>
                  <label className="label">
                    Añadir participantes (1 por línea)
                  </label>
                  <textarea
                    className="textarea"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={`juan\nmaria\npepe\n...`}
                  />
                  <div className="rowActions">
                    <button
                      className="btnPrimary"
                      onClick={addParticipantsFromText}
                      disabled={!raffle}
                    >
                      ➕ Añadir
                    </button>
                    <button
                      className="btnPrimary"
                      onClick={pickWinner}
                      disabled={!raffle || !canPick}
                    >
                      🎲 Elegir ganador
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Winner siempre visible (admin y stream) */}
            <div className="winnerBox" style={{ marginTop: isStream ? 0 : 14 }}>
              <div style={{ fontSize: 12, opacity: 0.65 }}>Ganador</div>

              {winnerNode ? (
                winnerNode
              ) : (
                <div className="winnerName">{raffle?.winner ?? "—"}</div>
              )}

              {raffle?.winner && !showAnim && (
                <div style={{ fontSize: 12, opacity: 0.7 }}>
                  Sorteo guardado en historial ✅
                </div>
              )}
            </div>

            {/* En Stream: botones mínimos */}
            {isStream && (
              <div className="rowActions" style={{ marginTop: 14 }}>
                <button className="btnSecondary" onClick={createNewRaffle}>
                  ➕ Nuevo
                </button>
                <button
                  className="btnPrimary"
                  onClick={pickWinner}
                  disabled={!raffle || !canPick}
                >
                  🎲 Elegir ganador
                </button>
                <button className="btnSecondary" onClick={openOverlay}>
                  🧿 Overlay
                </button>
              </div>
            )}
          </div>

          {/* --- STREAM HUD (PRO) --- */}
          <div className="streamHud">
            <div className="hudRow">
              <div className="hudStat">
                <div className="hudLabel">👥 PARTICIPANTES</div>
                <div className="hudValue">{stats.total}</div>
              </div>

              <div className="hudStat">
                <div className="hudLabel">✨ ÚNICOS</div>
                <div className="hudValue">{stats.unique}</div>
              </div>
            </div>

            <div className="hudChips">
              {/* Open / Closed */}
              {rules.isOpen ? (
                <span className="hudChip chipOk">🟢 ABIERTO</span>
              ) : (
                <span className="hudChip chipBad">🔴 CERRADO</span>
              )}

              {/* Gate */}
              {rules.gate === "everyone" && (
                <span className="hudChip chipNeutral">👥 TODOS</span>
              )}
              {rules.gate === "subs" && (
                <span className="hudChip chipWarn">⭐ SOLO SUBS</span>
              )}
              {rules.gate === "mods_vips" && (
                <span className="hudChip chipWarn">🛡 MODS/VIPS</span>
              )}

              {/* Unique */}
              {rules.uniqueOnly ? (
                <span className="hudChip chipNeutral">✅ 1 POR USUARIO</span>
              ) : (
                <span className="hudChip chipNeutral">♻️ REPETIDAS</span>
              )}

              {/* Cooldown */}
              {rules.cooldownSec > 0 && (
                <span className="hudChip chipNeutral">
                  ⏱ {rules.cooldownSec}s CD
                </span>
              )}
            </div>

            {/* Ready state */}
            {!raffle && (
              <div className="hudBanner chipBad">
                ❗ Crea un sorteo para empezar
              </div>
            )}

            {raffle && !rules.isOpen && (
              <div className="hudBanner chipBad">
                🔴 Sorteo cerrado — usa <b>!abrir</b> (mods) para abrir
              </div>
            )}

            {raffle && rules.isOpen && participants.length < 2 && (
              <div className="hudBanner chipWarn">
                ⚠️ Faltan participantes para sortear
              </div>
            )}

            {raffle && rules.isOpen && participants.length >= 2 && !picking && (
              <div className="hudBanner chipOk">✅ Listo para sortear</div>
            )}

            {picking && <div className="hudBanner chipOk">🎬 Sorteando...</div>}
          </div>

          {/* Panel derecha */}
          {!isStream && (
            <div className="panel">
              <div className="panelHeader">
                <div style={{ fontWeight: 900 }}>Participantes</div>
                <div style={{ fontSize: 12, opacity: 0.6 }}>
                  {raffle ? raffle.title : "Crea un sorteo para empezar"}
                </div>
              </div>

              {!raffle ? (
                <div style={{ opacity: 0.7, padding: 14 }}>
                  Pulsa <b>Nuevo sorteo</b> para empezar.
                </div>
              ) : participants.length === 0 ? (
                <div style={{ opacity: 0.7, padding: 14 }}>
                  Aún no hay participantes. Pega nombres a la izquierda.
                </div>
              ) : (
                <div className="list">
                  {participants.map((p) => (
                    <ParticipantRow
                      key={p}
                      name={p}
                      onRemove={removeParticipant}
                    />
                  ))}
                </div>
              )}

              <div className="history">
                <div className="historyHeader">
                  <div style={{ fontWeight: 900 }}>Historial</div>

                  <div className="historyActions">
                    <button
                      className="btnSecondary"
                      disabled={history.length === 0}
                      onClick={() => exportHistoryToCSV(history)}
                    >
                      📄 CSV
                    </button>

                    <button
                      className="btnSecondary"
                      disabled={history.length === 0}
                      onClick={() => exportHistoryToJSON(history)}
                    >
                      📦 JSON
                    </button>
                  </div>
                </div>

                {history.length === 0 ? (
                  <div style={{ opacity: 0.65, fontSize: 13 }}>
                    Todavía no hay sorteos guardados.
                  </div>
                ) : (
                  <div className="historyList">
                    {history.map((h) => (
                      <div key={h.id} className="historyItem">
                        <div style={{ fontWeight: 800 }}>
                          {h.title} {h.prize ? `· ${h.prize}` : ""}
                        </div>
                        <div style={{ fontSize: 12, opacity: 0.7 }}>
                          Ganador: <b>{h.winner ?? "—"}</b> ·{" "}
                          {new Date(h.createdAt).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="feedBox">
                <div className="feedHeader">
                  <div style={{ fontWeight: 900 }}>Activity</div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      className="btnSecondary"
                      onClick={clearFeed}
                      disabled={feed.length === 0}
                    >
                      🧽 Limpiar
                    </button>
                  </div>
                </div>

                {feed.length === 0 ? (
                  <div style={{ opacity: 0.65, fontSize: 13 }}>
                    Sin actividad todavía.
                  </div>
                ) : (
                  <div className="feedList">
                    {feed.slice(0, 20).map((it) => (
                      <div key={it.id} className={`feedItem feed-${it.kind}`}>
                        <div className="feedTitle">{it.title}</div>
                        {it.meta && <div className="feedMeta">{it.meta}</div>}
                        <div className="feedTime">
                          {new Date(it.ts).toLocaleTimeString()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
