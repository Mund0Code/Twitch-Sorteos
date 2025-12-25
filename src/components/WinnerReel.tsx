import { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  participants: string[];
  winner: string; // el nombre final que debe quedar seleccionado
  durationMs?: number; // total animación
  onFinish?: () => void;
};

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

export default function WinnerReel({
  participants,
  winner,
  durationMs = 1800,
  onFinish,
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [offset, setOffset] = useState(0);

  // Construimos un “loop” largo para que parezca infinito
  const items = useMemo(() => {
    const base = participants.length ? participants : ["—"];
    const loopCount = 40; // suficiente para dar sensación de giro
    const arr: string[] = [];
    for (let i = 0; i < loopCount; i++) arr.push(...base);
    return arr;
  }, [participants]);

  const winnerIndex = useMemo(() => {
    // buscamos una aparición del winner en la parte final del loop para aterrizar ahí
    const base = participants;
    const baseIndex = Math.max(
      0,
      base.findIndex((p) => p === winner)
    );
    // en el loop, elegimos una posición cerca del final
    const loops = Math.floor(items.length / Math.max(1, base.length));
    const targetLoop = clamp(loops - 4, 1, loops); // cerca del final
    return targetLoop * base.length + baseIndex;
  }, [items.length, participants, winner]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Medimos altura de item para calcular offset exacto
    const itemEl = container.querySelector<HTMLDivElement>("[data-reel-item]");
    const itemH = itemEl?.getBoundingClientRect().height ?? 44;

    // Queremos que el winner quede centrado
    const viewportH = container.getBoundingClientRect().height;
    const centerY = viewportH / 2 - itemH / 2;

    const targetOffset = winnerIndex * itemH - centerY;

    let raf = 0;
    const start = performance.now();

    const animate = (now: number) => {
      const t = clamp((now - start) / durationMs, 0, 1);
      const eased = easeOutCubic(t);

      // un pequeño “overshoot” para efecto mecánico
      const overshoot = itemH * 0.35;
      const current =
        t < 0.95
          ? targetOffset * eased
          : targetOffset + overshoot * (1 - (t - 0.95) / 0.05);

      setOffset(current);

      if (t < 1) raf = requestAnimationFrame(animate);
      else onFinish?.();
    };

    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [durationMs, onFinish, winnerIndex]);

  return (
    <div className="reelWrap" ref={containerRef}>
      <div className="reelGlow" />
      <div className="reelWindow">
        <div
          className="reelTrack"
          style={{ transform: `translateY(${-offset}px)` }}
        >
          {items.map((name, i) => (
            <div key={`${name}-${i}`} className="reelItem" data-reel-item>
              <span className="reelAt">@</span>
              <span className="reelName">{name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="reelMarker" />
    </div>
  );
}
