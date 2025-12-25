export type ChatMsg = {
  username: string;
  text: string;
  isSub: boolean;
  isMod: boolean;
  isVip: boolean;
};

export type Command =
  | { type: "enter" }
  | { type: "leave" }
  | { type: "status" }
  | { type: "ban"; target: string }
  | { type: "unban"; target: string }
  | { type: "unknown" };

export function parseCommand(text: string): Command {
  const t = text.trim();

  if (t === "!sorteo") return { type: "enter" };
  if (t === "!salir") return { type: "leave" };
  if (t === "!estado") return { type: "status" };

  if (t.startsWith("!ban ")) {
    const target = t.slice("!ban ".length).trim().replace(/^@/, "");
    return target ? { type: "ban", target } : { type: "unknown" };
  }

  if (t.startsWith("!unban ")) {
    const target = t.slice("!unban ".length).trim().replace(/^@/, "");
    return target ? { type: "unban", target } : { type: "unknown" };
  }

  return { type: "unknown" };
}
