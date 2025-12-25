import React from "react";

type Props = {
  name: string;
  onRemove: (name: string) => void;
};

function ParticipantRowBase({ name, onRemove }: Props) {
  return (
    <div className="listItem">
      <span className="pill">@</span>
      <span style={{ flex: 1 }}>{name}</span>
      <button
        className="iconBtn"
        onClick={() => onRemove(name)}
        title="Eliminar"
      >
        ✖
      </button>
    </div>
  );
}

export default React.memo(
  ParticipantRowBase,
  (prev, next) => prev.name === next.name && prev.onRemove === next.onRemove
);
