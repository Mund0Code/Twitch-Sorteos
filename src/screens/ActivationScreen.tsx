import { useMemo, useState } from "react";

type ActivateResult =
  | { ok: true; expiresAt: string; capabilities: any }
  | { ok: false; error?: string };

function cleanKey(input: string) {
  return input.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
}

// Detecta TS + 8 + PRO  => TSXXXXXXXXPRO (13 chars sin guiones)
function formatKey(input: string) {
  const c = cleanKey(input);

  // Caso TS-XXXX-XXXX-PRO
  if (c.startsWith("TS") && c.endsWith("PRO")) {
    // TS + 8 + PRO = 2 + 8 + 3 = 13
    const body = c.slice(2, -3).slice(0, 8); // 8 chars
    const a = body.slice(0, 4);
    const b = body.slice(4, 8);
    if (a.length === 4 && b.length === 4) return `TS-${a}-${b}-PRO`;
    // si aún no completó, devolvemos formateo parcial
    const parts = [a, b].filter(Boolean);
    return `TS-${parts.join("-")}`;
  }

  // fallback (si quieres soportar también 4-4-4-4)
  const c16 = c.slice(0, 16);
  const parts = c16.match(/.{1,4}/g) ?? [];
  return parts.join("-");
}

// TS-XXXX-XXXX-PRO (X=4 alfanuméricos)
const LICENSE_REGEX = /^TS-[A-Z0-9]{4}-[A-Z0-9]{4}-PRO$/;

export default function ActivationScreen({
  onActivated,
}: {
  onActivated: () => void;
}) {
  const [raw, setRaw] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatted = useMemo(() => formatKey(raw), [raw]);
  const isValidFormat =
    /^TS-[A-Z0-9]{4}-[A-Z0-9]{4}-PRO$/.test(formatted) ||
    /^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(formatted);

  async function activate() {
    setError(null);
    setLoading(true);
    try {
      const res: ActivateResult = await window.licenseApi.activate(formatted);
      if (!res.ok) {
        setError(res.error ?? "Licencia inválida");
        return;
      }
      onActivated();
    } catch {
      setError("No se pudo activar (error de conexión con la app).");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <div className="card">
        <div style={{ textAlign: "center", marginBottom: 14 }}>
          <div style={{ fontSize: 44 }}>🔐</div>
          <h1 className="title" style={{ marginTop: 6 }}>
            Activación Requerida
          </h1>
          <p className="subtitle">
            Ingresa tu clave de licencia para continuar.
          </p>
        </div>

        <label className="label">Clave de Licencia</label>
        <input
          className="input"
          value={formatted}
          onChange={(e) => setRaw(e.target.value)}
          placeholder="TS-XXXX-XXXX-PRO"
          inputMode="text"
          autoFocus
        />

        {error && (
          <div style={{ marginTop: 10, color: "#fb7185", fontSize: 13 }}>
            {error}
          </div>
        )}

        <button
          className="btnPrimary"
          onClick={activate}
          disabled={!isValidFormat || loading}
        >
          {loading ? "Verificando..." : "🔓 Activar Licencia"}
        </button>

        <div className="divider" />

        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 12, opacity: 0.7 }}>
            ¿Necesitas una licencia?
          </div>

          <button
            className="btnSecondary"
            onClick={() =>
              window.open("https://tusorteo.app/licencias", "_blank")
            }
          >
            🛒 Comprar Licencia
          </button>
          <button
            className="btnSecondary"
            onClick={async () => {
              setError(null);
              setLoading(true);
              try {
                const twitchUser =
                  localStorage.getItem("ts_twitch_username_v1") ?? undefined;
                const res = await window.licenseApi.startTrial(twitchUser);
                if (!res.ok) {
                  setError(res.error ?? "No se pudo iniciar el trial");
                  return;
                }
                onActivated();
              } catch {
                setError("No se pudo conectar con el servidor");
              } finally {
                setLoading(false);
              }
            }}
          >
            🎁 Probar 7 días (PRO)
          </button>
        </div>
      </div>
    </div>
  );
}
