// src/services/twitchChat.ts
import tmi from "tmi.js";

export type TwitchRole = "broadcaster" | "mod" | "vip" | "sub" | "viewer";

export type JoinPayload = {
  username: string;
  isSub: boolean;
  isMod: boolean;
  isVip: boolean;
  role: TwitchRole;
  tags: any;
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
  // el join completo (cuando llega !sorteo)
  onJoin?: (payload: JoinPayload) => void;

  // ✅ compat con tu RaffleScreen: te avisa antes/además con {user, role}
  onJoinAttempt?: (payload: { user: string; role: TwitchRole }) => void;

  onControl?: (evt: ControlEvent) => void;
  onStatus?: (msg: string) => void;
  onError?: (msg: string) => void;
};

function getUser(tags: any) {
  return String(tags?.["display-name"] || tags?.username || "").trim();
}

function detectRole(tags: any): TwitchRole {
  const badges = (tags?.badges ?? {}) as Record<string, string>;

  if (badges.broadcaster) return "broadcaster";
  if (tags?.mod || badges.moderator) return "mod";
  if (badges.vip) return "vip";
  if (tags?.subscriber || badges.subscriber) return "sub";
  return "viewer";
}

function isModOrBroadcaster(role: TwitchRole) {
  return role === "mod" || role === "broadcaster";
}

export class TwitchChatService {
  private client: any = null;

  async disconnect() {
    try {
      if (this.client) await this.client.disconnect();
    } catch {
      // ignore
    } finally {
      this.client = null;
    }
  }

  async connectPro(channel: string, accessToken: string, cb?: ChatCallbacks) {
    await this.disconnect();

    const cleanChannel = channel.replace(/^#/, "").toLowerCase();
    cb?.onStatus?.("Conectando a Twitch…");

    const identityUsername = cleanChannel;

    this.client = new (tmi as any).Client({
      options: { debug: false, messagesLogLevel: "info" },
      connection: { secure: true, reconnect: true },
      identity: {
        username: identityUsername,
        password: `oauth:${accessToken}`,
      },
      channels: [cleanChannel],
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
      (_channel: any, tags: any, message: any, self: any) => {
        if (self) return;

        const msgRaw = String(message ?? "").trim();
        const msg = msgRaw.toLowerCase();
        const username = getUser(tags);
        if (!username) return;

        const role = detectRole(tags);
        const isStaff = isModOrBroadcaster(role);

        // --- MOD COMMANDS ---
        if (msg === "!abrir" && isStaff)
          return cb?.onControl?.({ type: "open", by: username, role });
        if (msg === "!cerrar" && isStaff)
          return cb?.onControl?.({ type: "close", by: username, role });
        if (msg === "!reset" && isStaff)
          return cb?.onControl?.({ type: "reset", by: username, role });
        if (msg === "!reroll" && isStaff)
          return cb?.onControl?.({ type: "reroll", by: username, role });

        if (msg.startsWith("!ban ") && isStaff) {
          const target = msgRaw
            .split(" ")
            .slice(1)
            .join(" ")
            .trim()
            .replace(/^@/, "");
          if (target)
            cb?.onControl?.({ type: "ban", by: username, role, target });
          return;
        }

        if (msg.startsWith("!unban ") && isStaff) {
          const target = msgRaw
            .split(" ")
            .slice(1)
            .join(" ")
            .trim()
            .replace(/^@/, "");
          if (target)
            cb?.onControl?.({ type: "unban", by: username, role, target });
          return;
        }

        if (msg === "!salir")
          return cb?.onControl?.({ type: "leave", by: username, role });
        if (msg === "!estado")
          return cb?.onControl?.({ type: "status", by: username, role });

        // --- ENTRY ---
        if (msg === "!sorteo") {
          cb?.onJoinAttempt?.({ user: username, role });

          cb?.onJoin?.({
            username,
            isSub: !!tags?.subscriber,
            isMod: !!tags?.mod,
            isVip: !!tags?.badges?.vip,
            role,
            tags,
          });
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
