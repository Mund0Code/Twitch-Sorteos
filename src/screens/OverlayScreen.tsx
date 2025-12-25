import { useEffect, useMemo, useState } from "react";

type OverlayState = {
  title?: string;
  prize?: string;
  winner?: string | null;
  picking?: boolean;

  // PRO opcional:
  total?: number;
  unique?: number;
  status?: "idle" | "ready" | "picking";
};

function cx(...cls: Array<string | false | undefined>) {
  return cls.filter(Boolean).join(" ");
}

export default function OverlayScreen() {
  const [state, setState] = useState<OverlayState>({});

  useEffect(() => {
    return window.overlayApi.onUpdate((s) => setState(s ?? {}));
  }, []);

  const title = state.title || "Twitch Sorteos";
  const prize = state.prize ? `· ${state.prize}` : "";
  const winner = state.picking ? "🎰 eligiendo..." : state.winner ?? "—";

  // key para animar cuando cambia el texto del winner
  const winnerKey = useMemo(
    () => `${winner}-${state.picking ? 1 : 0}`,
    [winner, state.picking]
  );

  const statusLabel =
    state.status === "picking"
      ? "🎬 Sorteando…"
      : state.status === "ready"
      ? "✅ Listo"
      : "🟦 En espera";

  return (
    <div className="overlayRoot">
      <div className="overlayCard overlayCardPro">
        <div className="overlayTop">
          <div className="overlayTitle">
            <span className="overlayDot" />
            <span className="overlayTitleText">
              {title} <span className="overlayPrize">{prize}</span>
            </span>
          </div>

          <div className="overlayMeta">
            <span
              className={cx("overlayChip", state.picking && "overlayChipLive")}
            >
              {statusLabel}
            </span>

            {typeof state.total === "number" && (
              <span className="overlayChip">👥 {state.total}</span>
            )}
          </div>
        </div>

        <div className="overlayWinnerWrap">
          <div
            key={winnerKey}
            className={cx(
              "overlayWinner",
              state.picking && "overlayWinnerPicking"
            )}
          >
            {winner}
          </div>
        </div>

        <div className="overlayHint overlayHintPro">
          Captura esta ventana en OBS → <b>Window Capture</b>
        </div>
      </div>
    </div>
  );
}
