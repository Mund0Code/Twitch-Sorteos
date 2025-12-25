const API_BASE = "http://localhost:3001";

const LS_TWITCH_TOKENS = "ts_twitch_tokens_v1";

export type TwitchTokens = {
  access_token: string;
  refresh_token: string;
  expires_at: number; // epoch ms
};

export function loadTokens(): TwitchTokens | null {
  try {
    const raw = localStorage.getItem(LS_TWITCH_TOKENS);
    return raw ? (JSON.parse(raw) as TwitchTokens) : null;
  } catch {
    return null;
  }
}

export function saveTokens(t: TwitchTokens) {
  localStorage.setItem(LS_TWITCH_TOKENS, JSON.stringify(t));
}

export function clearTokens() {
  localStorage.removeItem(LS_TWITCH_TOKENS);
}

/**
 * Devuelve access token válido.
 * - Si falta token => null
 * - Si está por expirar (<60s) => refresca en backend
 */
export async function getValidAccessToken(): Promise<string | null> {
  const t = loadTokens();
  if (!t) return null;

  const now = Date.now();
  const willExpireSoon = t.expires_at - now < 60_000;

  if (!willExpireSoon) return t.access_token;

  // refresh
  const res = await fetch(`${API_BASE}/auth/twitch/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: t.refresh_token }),
  });

  const json = await res.json();
  if (!res.ok || !json.ok) {
    // si refresh falla, invalidamos tokens
    clearTokens();
    return null;
  }

  const expires_at = Date.now() + Number(json.expires_in) * 1000;

  saveTokens({
    access_token: json.access_token,
    refresh_token: json.refresh_token ?? t.refresh_token,
    expires_at,
  });

  return json.access_token;
}
