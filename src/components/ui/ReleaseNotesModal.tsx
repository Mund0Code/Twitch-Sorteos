import { useEffect, useMemo, useState } from "react";
import { toast } from "../../utils/toast";

function normalizeNotes(input: any): string {
  if (!input) return "";
  if (typeof input === "string") return input;

  // electron-updater a veces manda array [{ version, note, title }]
  if (Array.isArray(input)) {
    return input
      .map((x) => {
        const title = x?.title ? String(x.title) : "";
        const note = x?.note ? String(x.note) : "";
        return [title, note].filter(Boolean).join("\n");
      })
      .filter(Boolean)
      .join("\n\n");
  }

  return String(input);
}

export default function ReleaseNotesModal({
  open,
  version,
  notes,
  onClose,
}: {
  open: boolean;
  version: string;
  notes: any;
  onClose: () => void;
}) {
  const [installing, setInstalling] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) setInstalling(false);
  }, [open]);

  const text = useMemo(() => normalizeNotes(notes).trim(), [notes]);

  async function installNow() {
    if (!window.updateApi?.install) {
      toast.error("Auto-update no disponible en esta versión.", 3200);
      return;
    }

    setInstalling(true);
    try {
      toast.info("⏳ Instalando actualización…", 2200);
      await window.updateApi.install();
      // Normalmente la app se cierra/reinicia aquí.
    } catch (e: any) {
      toast.error(`❌ No se pudo instalar: ${String(e?.message ?? e)}`, 4200);
      setInstalling(false);
    }
  }

  if (!open) return null;

  return (
    <div className="modalBackdrop" onMouseDown={onClose}>
      <div className="modalCard" onMouseDown={(e) => e.stopPropagation()}>
        <div className="modalHeader">
          <div>
            <div className="modalTitle">📝 Release notes</div>
            <div className="modalSub">Versión {version || "—"}</div>
          </div>
          <button className="iconBtn" onClick={onClose} title="Cerrar">
            ✖
          </button>
        </div>

        <div className="modalBody">
          <pre className="notesPre">{text || "No hay notas disponibles."}</pre>
        </div>

        <div className="modalFooter">
          <button
            className="btnSecondary"
            onClick={onClose}
            disabled={installing}
          >
            Luego
          </button>

          <button
            className="btnPrimary"
            onClick={installNow}
            disabled={installing}
          >
            {installing ? "Instalando…" : "⚡ Instalar ahora"}
          </button>
        </div>
      </div>
    </div>
  );
}
