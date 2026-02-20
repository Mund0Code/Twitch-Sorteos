import { useEffect, useState } from "react";
import { toast } from "../utils/toast";
import ReleaseNotesModal from "../components/ui/ReleaseNotesModal";

const LS_LAST_NOTES_SIG = "ts_last_release_notes_sig_v1";
const LS_LAST_NOTES_BODY = "ts_last_release_notes_body_v1";
const LS_LAST_NOTES_VER = "ts_last_release_notes_ver_v1";

function normalizeNotes(rn: any): string {
  if (!rn) return "";
  if (typeof rn === "string") return rn;
  // electron-updater a veces manda array (macOS) o objetos
  if (Array.isArray(rn)) return rn.map(String).join("\n\n");
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

  // ✅ cargar cache al iniciar (para que el botón funcione sin “Buscar updates”)
  useEffect(() => {
    const cachedBody = localStorage.getItem(LS_LAST_NOTES_BODY) ?? "";
    const cachedVer = localStorage.getItem(LS_LAST_NOTES_VER) ?? "";
    if (cachedBody) {
      setNotesBody(cachedBody);
      setNotesVersion(cachedVer || "Release notes");
    }
  }, []);

  useEffect(() => {
    if (!window.updateApi?.onStatus) return;

    const unsub = window.updateApi.onStatus((s: any) => {
      const state = String(s?.state ?? "");

      if (state === "boot") {
        setAppVersion(String(s?.version ?? ""));
      }

      // ✅ helper: cachear notes si vienen
      const maybeStoreNotes = (versionRaw: any, rnRaw: any) => {
        const v = String(versionRaw ?? "").trim();
        const rn = normalizeNotes(rnRaw).trim();
        if (!rn) return;

        const sig = `${v}::${rn.slice(0, 140)}`;
        const lastSig = localStorage.getItem(LS_LAST_NOTES_SIG) ?? "";

        // guardamos aunque sea la misma versión si el contenido cambió
        if (sig !== lastSig) {
          localStorage.setItem(LS_LAST_NOTES_SIG, sig);
          localStorage.setItem(LS_LAST_NOTES_BODY, rn);
          localStorage.setItem(LS_LAST_NOTES_VER, v || "Release notes");
        }

        setNotesVersion(v || "Release notes");
        setNotesBody(rn);
      };

      if (state === "available") {
        toast.info("🔄 Actualización disponible (descargando…)", 2600);

        const v = String(s?.version ?? "");
        const rn = s?.releaseNotes ?? null;

        if (rn) {
          setNotesVersion(v || "Nueva versión");
          setNotesBody(rn);
        }
      }

      if (state === "downloading") {
        // no spamear
      }

      if (state === "downloaded") {
        toast.success("✅ Actualización lista. Reinicia para aplicar.", 3400);
        maybeStoreNotes(s?.version, s?.releaseNotes);

        // ✅ abrir modal una vez por versión/notas
        const rn = normalizeNotes(s?.releaseNotes).trim();
        const v = String(s?.version ?? "").trim();
        if (rn) {
          const sig = `${v}::${rn.slice(0, 140)}`;
          const lastSig = localStorage.getItem(LS_LAST_NOTES_SIG) ?? "";
          // si recién cambió, lo abrimos
          if (sig !== lastSig) {
            setNotesVersion(v || "Nueva versión");
            setNotesBody(rn);
            setNotesOpen(true);
          }
        }
      }

      if (state === "none") {
        // ✅ no hay update, pero igual el botón puede mostrar cache anterior
        // (opcional) toast suave:
        // toast.info("✅ Estás en la última versión.", 2000);
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
      version={notesVersion}
      notes={notesBody}
      onClose={() => setNotesOpen(false)}
    />
  );

  return {
    appVersion,
    notesModal,
    openNotes: () => {
      if (!notesBody) {
        setNotesVersion(appVersion || "Notas de versión");
        setNotesBody(
          "Aún no hay notas cargadas. Pulsa “Buscar updates” para consultar GitHub.",
        );
        setNotesOpen(true);
        return;
      }
      setNotesOpen(true);
    },
  };
}
