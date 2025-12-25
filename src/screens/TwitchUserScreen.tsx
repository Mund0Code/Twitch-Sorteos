import { useMemo, useState } from "react";

const LS_TWITCH_USER = "ts_twitch_username_v1";

function normalizeUser(s: string) {
  return s.trim().replace(/^@/, "").toLowerCase();
}

export function getSavedTwitchUser(): string | null {
  const v = localStorage.getItem(LS_TWITCH_USER);
  return v ? v : null;
}

export function saveTwitchUser(username: string) {
  localStorage.setItem(LS_TWITCH_USER, username);
}

export default function TwitchUserScreen({ onDone }: { onDone: () => void }) {
  const [raw, setRaw] = useState("");
  const username = useMemo(() => normalizeUser(raw), [raw]);
  const ok = username.length >= 3;

  function submit() {
    if (!ok) return;
    saveTwitchUser(username);
    onDone();
  }

  return (
    <div className="page">
      <div className="card">
        <div style={{ textAlign: "center", marginBottom: 14 }}>
          <div style={{ fontSize: 44 }}>🎮</div>
          <h1 className="title" style={{ marginTop: 6 }}>
            Tu usuario de Twitch
          </h1>
          <p className="subtitle">
            Lo usaremos para personalizar la app y (más adelante) conectarnos al
            chat.
          </p>
        </div>

        <label className="label">Usuario</label>
        <input
          className="input"
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          placeholder="@blurzcode"
          autoFocus
        />

        <button className="btnPrimary" onClick={submit} disabled={!ok}>
          Continuar
        </button>

        <div
          style={{
            marginTop: 12,
            fontSize: 12,
            opacity: 0.6,
            textAlign: "center",
          }}
        >
          Ejemplo: <b>blurzcode</b> (sin espacios)
        </div>
      </div>
    </div>
  );
}
