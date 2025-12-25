const LS_TWITCH_TOKENS = "ts_twitch_tokens_v1";

export type TwitchTokens = {
  access_token: string;
  refresh_token: string;
  expires_at: number; // epoch ms
};

export function saveTokens(t: TwitchTokens) {
  localStorage.setItem(LS_TWITCH_TOKENS, JSON.stringify(t));
}

export function loadTokens(): TwitchTokens | null {
  try {
    const raw = localStorage.getItem(LS_TWITCH_TOKENS);
    return raw ? (JSON.parse(raw) as TwitchTokens) : null;
  } catch {
    return null;
  }
}

export function clearTokens() {
  localStorage.removeItem(LS_TWITCH_TOKENS);
}
