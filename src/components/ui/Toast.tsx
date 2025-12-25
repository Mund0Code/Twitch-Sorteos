import { useToastStore } from "../../state/toast.store";

export default function Toast() {
  const open = useToastStore((s) => s.open);
  const message = useToastStore((s) => s.message);
  const kind = useToastStore((s) => s.kind);
  const hide = useToastStore((s) => s.hide);

  if (!open) return null;

  const border =
    kind === "success"
      ? "rgba(34,197,94,0.45)"
      : kind === "error"
      ? "rgba(251,113,133,0.45)"
      : "rgba(255,255,255,0.20)";

  const bg =
    kind === "success"
      ? "rgba(34,197,94,0.14)"
      : kind === "error"
      ? "rgba(251,113,133,0.14)"
      : "rgba(0,0,0,0.35)";

  return (
    <div
      style={{
        position: "fixed",
        left: "50%",
        bottom: 18,
        transform: "translateX(-50%)",
        zIndex: 9999,
        padding: "10px 12px",
        borderRadius: 14,
        border: `1px solid ${border}`,
        background: bg,
        color: "rgba(255,255,255,0.92)",
        boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
        minWidth: 260,
        maxWidth: "90vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 10,
      }}
      role="status"
      aria-live="polite"
    >
      <div style={{ fontSize: 13, fontWeight: 900 }}>{message}</div>
      <button
        onClick={hide}
        style={{
          border: "none",
          background: "transparent",
          color: "rgba(255,255,255,0.75)",
          cursor: "pointer",
          fontWeight: 900,
        }}
        title="Cerrar"
      >
        ✖
      </button>
    </div>
  );
}
