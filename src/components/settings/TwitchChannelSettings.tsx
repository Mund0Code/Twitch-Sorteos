import { useState } from "react";
import { useTwitchStore } from "../../state/twitch.store";

export default function TwitchChannelSettings() {
  const username = useTwitchStore((s) => s.username);
  const setUsername = useTwitchStore((s) => s.setUsername);

  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(username);

  return (
    <div style={{ display: "grid", gap: 8, marginTop: 10 }}>
      <div style={{ fontWeight: 950, fontSize: 14 }}>📺 Canal de Twitch</div>

      <div style={{ fontSize: 12, opacity: 0.8 }}>
        Actual: <b>{username ? `@${username}` : "No definido"}</b>
      </div>

      {!open ? (
        <button className="btnSecondary" onClick={() => setOpen(true)}>
          ✏️ Cambiar canal
        </button>
      ) : (
        <div style={{ display: "grid", gap: 8 }}>
          <input
            className="input"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Ej: blurzcode"
            autoFocus
          />
          <div style={{ display: "flex", gap: 8 }}>
            <button
              className="btnPrimary"
              onClick={() => {
                setUsername(draft);
                setOpen(false);
              }}
              disabled={!draft.trim()}
            >
              ✅ Guardar
            </button>
            <button
              className="btnSecondary"
              onClick={() => {
                setDraft(username);
                setOpen(false);
              }}
            >
              Cancelar
            </button>
          </div>

          <div style={{ fontSize: 11, opacity: 0.65 }}>
            Tip: puedes escribir con o sin <b>@</b>.
          </div>
        </div>
      )}
    </div>
  );
}
