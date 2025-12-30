import { useEffect, useState } from "react";
import { toast } from "../utils/toast";
import ReleaseNotesModal from "../components/ui/ReleaseNotesModal";

const LS_LAST_NOTES = "ts_last_release_notes_v1";

export function useUpdateUx() {
  const [appVersion, setAppVersion] = useState<string>("");
  const [notesOpen, setNotesOpen] = useState(false);
  const [notesVersion, setNotesVersion] = useState("");
  const [notesBody, setNotesBody] = useState<any>(null);

  useEffect(() => {
    if (!window.updateApi?.onStatus) return;

    const unsub = window.updateApi.onStatus((s: any) => {
      const state = String(s?.state ?? "");

      if (state === "boot") {
        setAppVersion(String(s?.version ?? ""));
      }

      if (state === "checking") {
        // opcional
      }

      if (state === "available") {
        toast.info("🔄 Actualización disponible (descargando…)", 2600);
      }

      if (state === "downloading") {
        // opcional: no spamear toasts por %
      }

      if (state === "downloaded") {
        toast.success("✅ Actualización lista. Reinicia para aplicar.", 3400);

        const v = String(s?.version ?? "");
        const rn = s?.releaseNotes ?? null;

        // mostrar modal 1 vez por versión/notas
        const sig = `${v}::${String(rn).slice(0, 120)}`;
        const last = localStorage.getItem(LS_LAST_NOTES) ?? "";
        if (sig !== last && rn) {
          localStorage.setItem(LS_LAST_NOTES, sig);
          setNotesVersion(v || "Nueva versión");
          setNotesBody(rn);
          setNotesOpen(true);
        }
      }

      if (state === "error") {
        toast.error(
          `❌ Update error: ${String(s?.message ?? "desconocido")}`,
          4200
        );
      }
    });

    return () => unsub?.();
  }, []);

  const notesModal = (
    <ReleaseNotesModal
      open={notesOpen}
      version={notesVersion}
      notes={notesBody}
      onClose={() => setNotesOpen(false)}
    />
  );

  return {
    appVersion,
    notesModal,
    openNotes: () => setNotesOpen(true),
  };
}
