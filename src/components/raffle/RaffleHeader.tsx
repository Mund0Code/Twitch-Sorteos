import { useMemo } from "react";
import ThemePicker from "../settings/ThemePicker";
import TwitchChannelSettings from "../settings/TwitchChannelSettings";
import { useTwitchStore } from "../../state/twitch.store";

type LicenseInfo = {
  valid: boolean;
  expiresAt: string | null;
  daysLeft: number | null;
};

type StatusBadge = { cls: string; txt: string };

export function RaffleHeader(props: {
  // status/licensing
  licenseInfo: LicenseInfo;
  twitchConnected: boolean;
  isStream: boolean;
  overlayOpen: boolean;

  // stats
  statsTotal: number;
  statsUnique: number;
  raffleTitleLabel: string;

  // version / notes
  appVersion?: string;
  openNotes?: () => void;

  // rules UI (lo que antes se duplicaba en RaffleScreen)
  statusLabel: StatusBadge;
  gateLabel: string;
  isOpen: boolean;
  cooldownSec: number;
  uniqueOnly: boolean;
  maxEntries: number;
  slowMode: boolean;
  slowLeft: number;

  // actions
  onToggleStream: () => void;
  onToggleOpen: () => void;

  onNew: () => void;
  onClean: () => void;
  onReset: () => void;

  onOpenOverlay: () => Promise<void>;
  onCloseOverlay: () => void;

  // PRO actions
  onConnectOAuthAndChat: () => Promise<void> | void;
  onDisconnectChat: () => void;
  proButtonDisabled: boolean;
  proButtonLabel: string;

  // optional hint
  showStreamHotkeys?: boolean;

  // pro / upsell
  isPro: boolean;
  onBuyPro: () => void;
}) {
  const proStatus = useMemo(() => {
    if (props.licenseInfo.valid)
      return `PRO · ${props.licenseInfo.daysLeft ?? "—"} días`;
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

        {/* Theme */}
        <div style={{ marginTop: 10 }}>
          <ThemePicker isPro={props.isPro} onBuyPro={props.onBuyPro} />
        </div>

        {/* Status + reglas */}
        <div
          style={{
            marginTop: 10,
            display: "flex",
            gap: 10,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <span className={`statusBadge ${props.statusLabel.cls}`}>
            {props.statusLabel.txt}
          </span>
          {props.slowMode && (
            <span className="badgeWarn">🐢 Slow {props.slowLeft}s</span>
          )}

          <span className="ruleChip">
            🧩 Entradas: <b>{props.gateLabel}</b>
          </span>
          <span className="ruleChip">
            ⏱ Cooldown: <b>{props.cooldownSec}s</b>
          </span>
          <span className="ruleChip">
            ✨ Únicos: <b>{props.uniqueOnly ? "ON" : "OFF"}</b>
          </span>
          <span className="ruleChip">
            🔢 Máx: <b>{props.maxEntries}</b>
          </span>
        </div>

        {/* subline */}
        <div className="subline" style={{ marginTop: 10 }}>
          Participantes: <b>{props.statsTotal}</b> · Únicos:{" "}
          <b>{props.statsUnique}</b>
          <span style={{ marginLeft: 10, opacity: 0.6 }}>
            {props.raffleTitleLabel}
          </span>
          <span style={{ marginLeft: 10, opacity: 0.75 }}>
            Canal: <b>{twitchUser ? `@${twitchUser}` : "—"}</b>
          </span>
          {props.showStreamHotkeys && (
            <span style={{ marginLeft: 10, opacity: 0.6 }}>
              (F11: {props.isStream ? "Admin" : "Stream"})
            </span>
          )}
        </div>

        {/* Version + notes */}
        <div
          style={{
            display: "flex",
            gap: 10,
            alignItems: "center",
            marginTop: 8,
          }}
        >
          <button
            className="btnSecondary"
            onClick={() => props.openNotes?.()}
            disabled={!props.openNotes}
          >
            📝 Release notes
          </button>

          <div style={{ fontSize: 12, opacity: 0.7, marginLeft: 10 }}>
            v{props.appVersion || "—"}
          </div>
        </div>

        {/* Open/Close raffle */}
        <button
          className={props.isOpen ? "btnSecondary" : "btnPrimary"}
          onClick={props.onToggleOpen}
          title="Abrir/Cerrar entradas del sorteo"
          style={{ marginTop: 10 }}
        >
          {props.isOpen ? "🔒 Cerrar entradas" : "🟢 Abrir entradas"}
        </button>

        {/* Twitch channel settings (si lo estás usando) */}
        <div style={{ marginTop: 10 }}>
          <TwitchChannelSettings />
        </div>
      </div>

      {/* Actions right */}
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
            title="Borra todo local"
          >
            🗑️ Reset
          </button>
        </div>

        <div className="btnGroup">
          {props.overlayOpen ? (
            <button className="btnSecondary" onClick={props.onCloseOverlay}>
              ✖ Cerrar
            </button>
          ) : (
            <button className="btnSecondary" onClick={props.onOpenOverlay}>
              🧿 Overlay
            </button>
          )}
        </div>

        <details className="proPanel">
          <summary className="proSummary">
            <span>🟣 PRO</span>
            <span className="proHint">
              {props.twitchConnected
                ? " Conectado"
                : props.proButtonDisabled
                  ? " Conectando…"
                  : " Desconectado"}
            </span>
          </summary>

          <div className="proActions">
            {!props.twitchConnected ? (
              <button
                className="btnPrimary"
                onClick={props.onConnectOAuthAndChat}
                disabled={props.proButtonDisabled}
              >
                {props.proButtonLabel}
              </button>
            ) : (
              <button className="btnSecondary" onClick={props.onDisconnectChat}>
                🔌 Desconectar
              </button>
            )}

            <div className="proNote">
              Tip: en Twitch escribe <b>!sorteo</b> para entrar.
            </div>
          </div>
        </details>
      </div>
    </div>
  );
}
