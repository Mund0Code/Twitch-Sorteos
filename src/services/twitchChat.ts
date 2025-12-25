// src/services/twitchChat.ts
import tmi from "tmi.js";

export type TwitchRole = "broadcaster" | "mod" | "vip" | "sub" | "viewer";

export type JoinAttempt = {
  user: string; // display-name o username
  role: TwitchRole;
  rawTags: tmi.ChatUserstate;
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

type ChatCallbacks = {
  onJoinAttempt?: (evt: JoinAttempt) => void;
  onControl?: (evt: ControlEvent) => void;
  onStatus?: (msg: string) => void;
  onError?: (msg: string) => void;
};

function getUser(tags: tmi.ChatUserstate) {
  return String(tags["display-name"] || tags.username || "").trim();
}

function detectRole(tags: tmi.ChatUserstate): TwitchRole {
  const badges = tags.badges ?? {};

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
  private client: tmi.Client | null = null;

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

    // MVP: username = canal (si el token pertenece a esa cuenta)
    const identityUsername = cleanChannel;

    this.client = new tmi.Client({
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

    this.client.on("notice", (_channel, msgid, message) => {
      cb?.onError?.(`NOTICE(${msgid}): ${message}`);
    });

    this.client.on("message", (_channel, tags, message, self) => {
      if (self) return;

      const msgRaw = message.trim();
      const msg = msgRaw.toLowerCase();
      const user = getUser(tags);
      if (!user) return;

      const role = detectRole(tags);

      // helpers
      const isStaff = isModOrBroadcaster(role);

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
        cb?.onControl?.({ type: "reset", by: user, role } as any);
        return;
      }

      if (msg === "!reroll" && isStaff) {
        cb?.onControl?.({ type: "reroll", by: user, role } as any);
        return;
      }

      //!ban @user  / !unban @user
      if (msg.startsWith("!ban ") && isStaff) {
        const target = msgRaw
          .split(" ")
          .slice(1)
          .join(" ")
          .trim()
          .replace(/^@/, "");
        if (target)
          cb?.onControl?.({ type: "ban", by: user, role, target } as any);
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
          cb?.onControl?.({ type: "unban", by: user, role, target } as any);
        return;
      }

      // --- ENTRY ---
      if (msg === "!sorteo") {
        cb?.onJoinAttempt?.({ user, role, rawTags: tags });
        return;
      }

      if (msg === "!salir") {
        cb?.onControl?.({ type: "leave", by: user, role } as any);
        return;
      }

      if (msg === "!estado") {
        cb?.onControl?.({ type: "status", by: user, role } as any);
        return;
      }
    });

    try {
      await this.client.connect();
    } catch (e: any) {
      cb?.onError?.(e?.message ?? "Error conectando a Twitch");
      await this.disconnect();
      throw e;
    }
  }
}
