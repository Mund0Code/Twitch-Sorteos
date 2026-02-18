import { useEffect, useState } from "react";
import { toast } from "../utils/toast";
import ReleaseNotesModal from "../components/ui/ReleaseNotesModal";

const LS_LAST_NOTES_SIG = "ts_last_release_notes_sig_v1";
const LS_LAST_NOTES_BODY = "ts_last_release_notes_body_v1";
const LS_LAST_NOTES_VER = "ts_last_release_notes_ver_v1";

function normalizeNotes(rn: any): string {
  if (!rn) return "";
  // electron-updater a veces manda string, a veces array/obj
  if (typeof rn === "string") return rn;
  try {
    return JSON.stringify(rn, null, 2);
  } catch {
    return String(rn);
  }
}

export function useUpdateUx() {
  const [appVersion, setAppVersion] = useState<string>("");
  const [notesOpen, setNotesOpen] = useState(false);
  const [notesVersion, setNotesVersion] = useState("");
  const [notesBody, setNotesBody] = useState<string>("");

  // ✅ 1) Cargar notas guardadas (para que "Release notes" funcione siempre)
  useEffect(() => {
    const savedBody = localStorage.getItem(LS_LAST_NOTES_BODY) ?? "";
    const savedVer = localStorage.getItem(LS_LAST_NOTES_VER) ?? "";
    if (savedBody) {
      setNotesBody(savedBody);
      setNotesVersion(savedVer || "Release notes");
    }
  }, []);

  useEffect(() => {
    if (!window.updateApi?.onStatus) return;

    const unsub = window.updateApi.onStatus((s: any) => {
      const state = String(s?.state ?? "");

      if (state === "boot") {
        const v = String(s?.version ?? "");
        setAppVersion(v);

        // Si ya teníamos notas guardadas pero sin versión, úsala
        setNotesVersion((prev) => prev || v || "Release notes");
      }

      if (state === "available") {
        toast.info("🔄 Actualización disponible (descargando…)", 2600);

        // A veces releaseNotes ya vienen aquí
        const v = String(s?.version ?? "");
        const rnStr = normalizeNotes(s?.releaseNotes);

        if (rnStr) {
          const sig = `${v}::${rnStr.slice(0, 160)}`;
          const lastSig = localStorage.getItem(LS_LAST_NOTES_SIG) ?? "";

          if (sig !== lastSig) {
            localStorage.setItem(LS_LAST_NOTES_SIG, sig);
            localStorage.setItem(LS_LAST_NOTES_BODY, rnStr);
            localStorage.setItem(LS_LAST_NOTES_VER, v);

            setNotesVersion(v || "Nueva versión");
            setNotesBody(rnStr);
            // no abrimos modal aún (opcional)
          }
        }
      }

      if (state === "downloaded") {
        toast.success("✅ Actualización lista. Reinicia para aplicar.", 3400);

        const v = String(s?.version ?? "");
        const rnStr = normalizeNotes(s?.releaseNotes);

        // ✅ Guardar siempre que existan notas
        if (rnStr) {
          const sig = `${v}::${rnStr.slice(0, 160)}`;
          const lastSig = localStorage.getItem(LS_LAST_NOTES_SIG) ?? "";

          if (sig !== lastSig) {
            localStorage.setItem(LS_LAST_NOTES_SIG, sig);
            localStorage.setItem(LS_LAST_NOTES_BODY, rnStr);
            localStorage.setItem(LS_LAST_NOTES_VER, v);

            setNotesVersion(v || "Nueva versión");
            setNotesBody(rnStr);

            // ✅ Abrir modal 1 vez por versión/notas
            setNotesOpen(true);
          }
        }
      }

      if (state === "error") {
        toast.error(
          `❌ Update error: ${String(s?.message ?? "desconocido")}`,
          4200,
        );
      }
    });

    return () => unsub?.();
  }, []);

  const notesModal = (
    <ReleaseNotesModal
      open={notesOpen}
      version={notesVersion || appVersion || "Release notes"}
      notes={notesBody}
      onClose={() => setNotesOpen(false)}
    />
  );

  return {
    appVersion,
    notesModal,
    openNotes: async () => {
      // ✅ si ya hay notas guardadas, abre directo
      if (notesBody) {
        setNotesOpen(true);
        return;
      }

      // ✅ si no hay, dispara un check y avisa
      if (!window.updateApi?.check) {
        toast.info("Updates no disponible en DEV.", 2400);
        return;
      }

      toast.info("Buscando notas…", 1800);
      await window.updateApi.check();
      // cuando llegue available/downloaded, se guardan y ya podrás abrir
    },
  };
}
