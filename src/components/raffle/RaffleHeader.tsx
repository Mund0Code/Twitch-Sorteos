import { useMemo } from "react";
import ThemePicker from "../settings/ThemePicker";
import { useTwitchStore } from "../../state/twitch.store";
import TwitchChannelSettings from "../settings/TwitchChannelSettings";

type LicenseInfo = {
  valid: boolean;
  expiresAt: string | null;
  daysLeft: number | null;
};

export function RaffleHeader(props: {
  licenseInfo: LicenseInfo;
  twitchConnected: boolean;
  isStream: boolean;

  statsTotal: number;
  statsUnique: number;

  raffleTitleLabel: string; // "Sorteo: X" o "Sin sorteo activo"

  onToggleStream: () => void;

  onNew: () => void;
  onClean: () => void;
  onReset: () => void;

  onOpenOverlay: () => Promise<void>;
  onCloseOverlay: () => void;

  // PRO panel actions
  onConnectOAuthAndChat: () => Promise<void> | void;
  onDisconnectChat: () => void;
  proButtonDisabled: boolean;
  proButtonLabel: string;

  // Stream hotkeys hint (opcional)
  showStreamHotkeys?: boolean;

  isPro: boolean;
  onBuyPro: () => void;
}) {
  const proStatus = useMemo(() => {
    if (props.licenseInfo.valid) {
      return `PRO · ${props.licenseInfo.daysLeft ?? "—"} días`;
    }
    return "FREE";
  }, [props.licenseInfo.daysLeft, props.licenseInfo.valid]);

  const twitchUser = useTwitchStore((s) => s.username);

  return (
    <div className="topbar" style={{ gap: 14 }}>
      <div style={{ minWidth: 320 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          <h1 className="title" style={{ margin: 0 }}>
            Twitch Sorteos
          </h1>

          {props.licenseInfo.valid ? (
            <span className="badgePro">{proStatus}</span>
          ) : (
            <span className="badge">{proStatus}</span>
          )}

          {props.twitchConnected && (
            <span className="badgePro">🟣 Chat conectado</span>
          )}

          <button
            className={props.isStream ? "btnPrimary" : "btnSecondary"}
            onClick={props.onToggleStream}
            title="F11 para alternar"
            style={{ marginLeft: 6 }}
          >
            {props.isStream ? "🛠 Admin" : "🎥 Stream"}
          </button>
        </div>

        <div style={{ marginTop: 10 }}>
          <ThemePicker isPro={props.isPro} onBuyPro={props.onBuyPro} />
        </div>

        <div className="subline">
          Participantes: <b>{props.statsTotal}</b> · Únicos:{" "}
          <b>{props.statsUnique}</b>
          <span style={{ marginLeft: 10, opacity: 0.6 }}>
            {props.raffleTitleLabel}
          </span>
          <span style={{ marginLeft: 10, opacity: 0.75 }}>
            Canal: <b>{twitchUser ? `@${twitchUser}` : "—"}</b>
          </span>
        </div>

        {props.isStream && props.showStreamHotkeys && (
          <div className="streamKbdBar">
            <span className="kbd">F11</span> cambiar modo
            <span className="kbd">ESC</span> salir de Stream
          </div>
        )}
      </div>

      <div className="topbarActions">
        <div className="btnGroup">
          <button className="btnSecondary" onClick={props.onNew}>
            ➕ Nuevo
          </button>

          <button
            className="btnSecondary"
            onClick={props.onClean}
            title="Vacía participantes y ganador"
          >
            🧹 Limpiar
          </button>

          <button
            className="btnDanger"
            onClick={props.onReset}
            title="Borra todo"
          >
            🗑️ Reset
          </button>
        </div>

        <div className="btnGroup">
          <button className="btnSecondary" onClick={props.onOpenOverlay}>
            🧿 Overlay
          </button>

          <button className="btnSecondary" onClick={props.onCloseOverlay}>
            ✖ Cerrar
          </button>

          <details className="proPanel">
            <summary className="proSummary">
              <span>🟣 PRO</span>
              <span className="proHint">
                {props.twitchConnected ? "Conectado" : "Desconectado"}
              </span>
            </summary>

            <div className="proActions">
              <button
                className="btnPrimary"
                disabled={props.proButtonDisabled}
                onClick={props.onConnectOAuthAndChat as any}
              >
                {props.proButtonLabel}
              </button>

              <button
                className="btnSecondary"
                disabled={!props.twitchConnected}
                onClick={props.onDisconnectChat}
              >
                🔌 Desconectar
              </button>

              <div className="proNote">
                Tip: en Twitch escribe <b>!sorteo</b> para entrar.
              </div>
            </div>
            <TwitchChannelSettings />
          </details>
        </div>
      </div>
    </div>
  );
}
