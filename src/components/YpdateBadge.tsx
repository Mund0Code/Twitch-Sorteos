import { useEffect, useMemo, useState } from "react";
import { useUpdater } from "../hooks/useUpdater";
import { useToastStore } from "../state/toast.store";

function pct(n?: number) {
  if (typeof n !== "number") return "";
  return `${Math.max(0, Math.min(100, Math.round(n)))}%`;
}

function notesToText(notes: any): string | null {
  if (!notes) return null;
  if (typeof notes === "string") return notes.trim().slice(0, 600);

  try {
    return JSON.stringify(notes, null, 2).slice(0, 600);
  } catch {
    return null;
  }
}

export default function UpdateBadge() {
  const { u, check, install, supported } = useUpdater();
  const showToast = useToastStore((s) => s.show);

  const [open, setOpen] = useState(false);

  const appVersion = (u as any).appVersion as string | undefined;
  const newVersion = (u as any).version as string | undefined;
  const releaseNotes = (u as any).releaseNotes;

  const noteText = useMemo(() => notesToText(releaseNotes), [releaseNotes]);

  // ✅ Toasts automáticos
  useEffect(() => {
    if (!supported) return;

    if (u.state === "available") {
      showToast(
        `🆕 Actualización disponible${newVersion ? ` (v${newVersion})` : ""}`,
        "info",
        3000
      );
    }

    if (u.state === "downloaded") {
      showToast(
        "✅ Update descargada. Pulsa “Instalar update”.",
        "success",
        3600
      );
    }

    if (u.state === "error") {
      showToast("⚠️ Error de actualización. Reintenta.", "error", 3800);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [u.state]);

  if (!supported) return null;

  const tiny = appVersion ? `v${appVersion}` : "v—";

  let label = `⟳ Updates · ${tiny}`;
  if (u.state === "checking") label = `🔎 Buscando… · ${tiny}`;
  if (u.state === "downloading")
    label = `⬇️ ${pct((u as any).percent) || "Descargando"} · ${tiny}`;
  if (u.state === "downloaded") label = `✅ Instalar update · ${tiny}`;
  if (u.state === "available") label = `🆕 Ver update · ${tiny}`;

  const onClick = async () => {
    if (u.state === "downloaded") return install();
    if (u.state === "available") return setOpen(true);
    return check();
  };

  return (
    <div style={{ position: "relative" }}>
      <button className="btnSecondary" onClick={onClick}>
        {label}
      </button>

      {open && (
        <div className="updatePopover">
          <div className="updateTitle">
            🆕 Nueva versión {newVersion ? `v${newVersion}` : ""}
          </div>

          {noteText ? (
            <div className="updateNotes">{noteText}</div>
          ) : (
            <div className="updateNotes" style={{ opacity: 0.7 }}>
              No hay release notes disponibles.
            </div>
          )}

          <div className="updateActions">
            <button className="btnSecondary" onClick={() => setOpen(false)}>
              Cerrar
            </button>

            <button
              className="btnPrimary"
              onClick={async () => {
                setOpen(false);
                await check();
              }}
            >
              Descargar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
