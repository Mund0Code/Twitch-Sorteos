import React, { useEffect, useRef, useState } from "react";

function useCountUp(target: number, durationMs = 450) {
  const [value, setValue] = useState(target);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number>(0);
  const fromRef = useRef<number>(target);
  const toRef = useRef<number>(target);

  useEffect(() => {
    // si no cambió, no animamos
    if (target === toRef.current && value === target) return;

    // cancelar animación previa
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    fromRef.current = value;
    toRef.current = target;
    startRef.current = performance.now();

    const tick = (now: number) => {
      const t = Math.min(1, (now - startRef.current) / durationMs);

      // easeOutCubic suave
      const eased = 1 - Math.pow(1 - t, 3);

      const next = Math.round(
        fromRef.current + (toRef.current - fromRef.current) * eased
      );
      setValue(next);

      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        rafRef.current = null;
      }
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  return value;
}

export function StreamPanel(props: {
  winnerBox: React.ReactNode;

  onNew: () => void;
  onPickWinner: () => void;
  onOpenOverlay: () => Promise<void>;

  canPick: boolean;
  raffleExists: boolean;

  onBackToAdmin: () => void;

  // stats + estados
  statsTotal: number;
  statsUnique: number;
  participantsCount: number;
  picking: boolean;
}) {
  const noRaffleOrEmpty = !props.raffleExists || props.participantsCount === 0;
  const onlyOne =
    props.raffleExists &&
    props.participantsCount > 0 &&
    props.participantsCount < 2;
  const ready =
    props.raffleExists && props.participantsCount >= 2 && !props.picking;

  // ✅ count-up animado
  const totalAnimated = useCountUp(props.statsTotal, 450);
  const uniqueAnimated = useCountUp(props.statsUnique, 450);

  return (
    <div className="panel">
      <div className="streamHero">
        {/* Winner siempre arriba */}
        {props.winnerBox}

        {/* Contadores */}
        <div className="bigStats">
          <div className="statCard">
            <div className="statLabel">👥 PARTICIPANTES</div>
            <div className="statValue">{totalAnimated}</div>
          </div>

          <div className="statCard">
            <div className="statLabel">✨ ÚNICOS</div>
            <div className="statValue">{uniqueAnimated}</div>
          </div>
        </div>

        {/* Estados */}
        {noRaffleOrEmpty && (
          <div className="statusChip statusBad">
            ❗ Sin participantes — añade gente o conecta el chat
          </div>
        )}

        {onlyOne && (
          <div className="statusChip statusWarn">
            ⚠️ Falta 1 participante para sortear
          </div>
        )}

        {ready && (
          <div className="statusChip statusOk pulseReady">
            ✅ Listo para sortear
          </div>
        )}

        {props.picking && (
          <div className="statusChip statusOk">🎬 Sorteando...</div>
        )}

        {/* Botones esenciales */}
        <div className="rowActions">
          <button className="btnSecondary" onClick={props.onNew}>
            ➕ Nuevo
          </button>

          <button
            className="btnPrimary"
            onClick={props.onPickWinner}
            disabled={!props.raffleExists || !props.canPick}
          >
            🎲 Elegir ganador
          </button>

          <button className="btnSecondary" onClick={props.onOpenOverlay}>
            🧿 Overlay
          </button>

          <button className="btnSecondary" onClick={props.onBackToAdmin}>
            🛠 Admin
          </button>
        </div>
      </div>
    </div>
  );
}
