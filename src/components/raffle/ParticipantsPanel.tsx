import React, { memo } from "react";

const ParticipantRow = memo(function ParticipantRow(props: {
  name: string;
  onRemove: (name: string) => void;
}) {
  return (
    <div className="listItem">
      <span className="pill">@</span>
      <span style={{ flex: 1 }}>{props.name}</span>
      <button
        className="iconBtn"
        onClick={() => props.onRemove(props.name)}
        title="Eliminar"
      >
        ✖
      </button>
    </div>
  );
});

export function ParticipantsPanel(props: {
  raffleTitle: string;
  raffleExists: boolean;
  participants: string[];
  onRemove: (name: string) => void;
}) {
  return (
    <div className="panel">
      <div className="panelHeader">
        <div style={{ fontWeight: 900 }}>Participantes</div>
        <div style={{ fontSize: 12, opacity: 0.6 }}>
          {props.raffleExists
            ? props.raffleTitle
            : "Crea un sorteo para empezar"}
        </div>
      </div>

      {!props.raffleExists ? (
        <div style={{ opacity: 0.7, padding: 14 }}>
          Pulsa <b>Nuevo sorteo</b> para empezar.
        </div>
      ) : props.participants.length === 0 ? (
        <div style={{ opacity: 0.7, padding: 14 }}>
          Aún no hay participantes. Pega nombres a la izquierda o usa el chat.
        </div>
      ) : (
        <div className="list">
          {props.participants.map((p) => (
            <ParticipantRow key={p} name={p} onRemove={props.onRemove} />
          ))}
        </div>
      )}
    </div>
  );
}
