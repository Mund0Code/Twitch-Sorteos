// src/services/twitchChat.ts
import tmi, { type ChatUserstate, type Client } from "tmi.js";

export type TwitchRole = "broadcaster" | "mod" | "vip" | "sub" | "viewer";

export type JoinAttempt = {
  user: string; // display-name o username
  role: TwitchRole;
  rawTags: ChatUserstate;
};

export type ControlEvent =
  | { type: "open"; by: string; role: TwitchRole }
  | { type: "close"; by: string; role: TwitchRole }
  | { type: "reset"; by: string; role: TwitchRole }
  | { type: "reroll"; by: string; role: TwitchRole }
  | { type: "ban"; by: string; role: TwitchRole; target: string }
  | { type: "unban"; by: string; role: TwitchRole; target: string }
  | { type: "leave"; by: string; role: TwitchRole }
  | { type: "status"; by: string; role: TwitchRole };

export type ChatCallbacks = {
  /** ✅ compat con tu RaffleScreen actual */
  onJoin?: (user: string) => void;

  /** ✅ info completa (rol/badges) por si luego filtras subs/mods */
  onJoinAttempt?: (evt: JoinAttempt) => void;

  onControl?: (evt: ControlEvent) => void;
  onStatus?: (msg: string) => void;
  onError?: (msg: string) => void;
};

function getUser(tags: ChatUserstate) {
  return String(tags["display-name"] || tags.username || "").trim();
}

function detectRole(tags: ChatUserstate): TwitchRole {
  const badges = (tags.badges || {}) as Record<string, string>;

  if (badges.broadcaster) return "broadcaster";
  if (tags.mod || badges.moderator) return "mod";
  if (badges.vip) return "vip";
  if (tags.subscriber || badges.subscriber) return "sub";
  return "viewer";
}

function isModOrBroadcaster(role: TwitchRole) {
  return role === "mod" || role === "broadcaster";
}

export class TwitchChatService {
  private client: Client | null = null;

  async disconnect() {
    try {
      await this.client?.disconnect();
    } catch {
      // ignore
    } finally {
      this.client = null;
    }
  }

  async connectPro(channel: string, accessToken: string, cb?: ChatCallbacks) {
    // Si ya hay cliente, lo reiniciamos limpio
    await this.disconnect();

    // Nota: tmi.js usa oauth:xxxxx
    const identity = {
      username: channel, // puede ser el login del broadcaster, sirve para conectar
      password: `oauth:${accessToken}`,
    };

    this.client = new tmi.Client({
      options: { debug: false },
      identity,
      channels: [channel],
    });

    this.client.on("connected", () => cb?.onStatus?.("✅ Chat conectado"));
    this.client.on("reconnect", () =>
      cb?.onStatus?.("🔄 Reintentando conexión…")
    );
    this.client.on("disconnected", () =>
      cb?.onStatus?.("⚠️ Chat desconectado")
    );

    this.client.on("notice", (_channel: any, msgid: any, message: any) => {
      cb?.onError?.(`NOTICE(${String(msgid)}): ${String(message)}`);
    });

    this.client.on(
      "message",
      (_channel: any, tags: ChatUserstate, message: string, self: boolean) => {
        if (self) return;

        const msg = String(message || "")
          .trim()
          .toLowerCase();
        const user = getUser(tags);
        if (!user) return;

        const role = detectRole(tags);
        const isStaff = isModOrBroadcaster(role);

        // --- ENTRY ---
        if (msg === "!sorteo") {
          cb?.onJoinAttempt?.({ user, role, rawTags: tags });

          // ✅ compat con tu UI actual
          cb?.onJoin?.(user);
          return;
        }

        // --- MOD COMMANDS ---
        if (msg === "!abrir" && isStaff) {
          cb?.onControl?.({ type: "open", by: user, role });
          return;
        }
        if (msg === "!cerrar" && isStaff) {
          cb?.onControl?.({ type: "close", by: user, role });
          return;
        }
        if (msg === "!reset" && isStaff) {
          cb?.onControl?.({ type: "reset", by: user, role });
          return;
        }
        if (msg === "!reroll" && isStaff) {
          cb?.onControl?.({ type: "reroll", by: user, role });
          return;
        }

        // ban/unban simple: "!ban username"
        if (msg.startsWith("!ban ") && isStaff) {
          const target = msg.replace("!ban", "").trim();
          if (target) cb?.onControl?.({ type: "ban", by: user, role, target });
          return;
        }

        if (msg.startsWith("!unban ") && isStaff) {
          const target = msg.replace("!unban", "").trim();
          if (target)
            cb?.onControl?.({ type: "unban", by: user, role, target });
          return;
        }

        // extras
        if (msg === "!salir") {
          cb?.onControl?.({ type: "leave", by: user, role });
          return;
        }
        if (msg === "!estado") {
          cb?.onControl?.({ type: "status", by: user, role });
          return;
        }
      }
    );

    try {
      await this.client.connect();
    } catch (e: any) {
      cb?.onError?.(e?.message ?? "Error conectando a Twitch");
      await this.disconnect();
      throw e;
    }
  }
}
