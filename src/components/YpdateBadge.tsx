import { useUpdater } from "../hooks/useUpdater";

function pct(n?: number) {
  if (typeof n !== "number") return "";
  return `${Math.max(0, Math.min(100, Math.round(n)))}%`;
}

export default function UpdateBadge() {
  const { u, check, install, supported } = useUpdater();

  if (!supported) return null;

  // UI compacta
  if (u.state === "downloading") {
    return (
      <button className="btnSecondary" onClick={check} title="Actualizando...">
        ⬇️ {pct((u as any).percent) || "Descargando"}
      </button>
    );
  }

  if (u.state === "downloaded") {
    return (
      <button className="btnPrimary" onClick={install} title="Instalar update">
        ✅ Instalar update
      </button>
    );
  }

  if (u.state === "available") {
    return (
      <button
        className="btnSecondary"
        onClick={check}
        title="Update disponible"
      >
        🆕 Update disponible
      </button>
    );
  }

  if (u.state === "checking") {
    return (
      <button className="btnSecondary" disabled title="Buscando updates...">
        🔎 Buscando...
      </button>
    );
  }

  if (u.state === "error") {
    return (
      <button className="btnDanger" onClick={check} title={(u as any).message}>
        ⚠️ Update error
      </button>
    );
  }

  // idle/none
  return (
    <button className="btnSecondary" onClick={check} title="Buscar updates">
      ⟳ Updates
    </button>
  );
}
