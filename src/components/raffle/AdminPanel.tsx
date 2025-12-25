import React from "react";

export type AnimMode = "reel" | "wheel" | "flash";

export function AdminPanel(props: {
  title: string;
  setTitle: (v: string) => void;

  prize: string;
  setPrize: (v: string) => void;

  input: string;
  setInput: (v: string) => void;

  anim: AnimMode;
  setAnim: (v: AnimMode) => void;

  raffleExists: boolean;
  canPick: boolean;

  onAddParticipants: () => void;
  onPickWinner: () => void;

  winnerBox: React.ReactNode;
}) {
  return (
    <div className="panel">
      <div className="row2">
        <div>
          <label className="label">Título</label>
          <input
            className="input"
            value={props.title}
            onChange={(e) => props.setTitle(e.target.value)}
            placeholder="Sorteo navideño"
          />
        </div>

        <div>
          <label className="label">Premio (opcional)</label>
          <input
            className="input"
            value={props.prize}
            onChange={(e) => props.setPrize(e.target.value)}
            placeholder="Ej: 10€ PayPal / skin / etc."
          />
        </div>
      </div>

      <div style={{ marginTop: 14 }}>
        <div
          style={{ display: "flex", justifyContent: "space-between", gap: 12 }}
        >
          <label className="label">Añadir participantes (1 por línea)</label>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 12, opacity: 0.75 }}>Animación</span>
            <select
              value={props.anim}
              onChange={(e) => props.setAnim(e.target.value as AnimMode)}
              style={{
                height: 34,
                borderRadius: 10,
                padding: "0 10px",
                border: "1px solid rgba(255,255,255,0.14)",
                background: "rgba(0,0,0,0.25)",
                color: "rgba(255,255,255,0.92)",
                outline: "none",
              }}
            >
              <option value="reel">Reel</option>
              <option value="wheel">Ruleta</option>
              <option value="flash">Flash</option>
            </select>
          </div>
        </div>

        <textarea
          className="textarea"
          value={props.input}
          onChange={(e) => props.setInput(e.target.value)}
          placeholder={`juan\nmaria\npepe\n...`}
        />

        <div className="rowActions">
          <button
            className="btnPrimary"
            onClick={props.onAddParticipants}
            disabled={!props.raffleExists}
          >
            ➕ Añadir
          </button>

          <button
            className="btnPrimary"
            onClick={props.onPickWinner}
            disabled={!props.raffleExists || !props.canPick}
          >
            🎲 Elegir ganador
          </button>
        </div>

        {props.winnerBox}
      </div>
    </div>
  );
}
