import { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  participants: string[];
  winner: string;
  durationMs?: number;
  onFinish?: () => void;
};

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

export default function WinnerFlash({
  participants,
  winner,
  durationMs = 1400,
  onFinish,
}: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const rafRef = useRef<number | null>(null);

  const list = useMemo(() => {
    const base = participants.length ? participants : ["—"];
    const arr: string[] = [];
    for (let i = 0; i < 30; i++) arr.push(...base);
    return arr;
  }, [participants]);

  const winnerIndex = useMemo(() => {
    const baseIdx = Math.max(
      0,
      participants.findIndex((p) => p === winner)
    );
    const baseLen = Math.max(1, participants.length);
    const loops = Math.floor(list.length / baseLen);
    const targetLoop = Math.max(1, loops - 2);
    return targetLoop * baseLen + baseIdx;
  }, [list.length, participants, winner]);

  useEffect(() => {
    const start = performance.now();

    const tick = (now: number) => {
      const t = clamp((now - start) / durationMs, 0, 1);
      const eased = easeOutCubic(t);

      const idx = Math.floor(winnerIndex * eased);
      setActiveIndex(idx);

      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        onFinish?.();
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [durationMs, onFinish, winnerIndex]);

  const shown = list.slice(Math.max(0, activeIndex - 2), activeIndex + 3);

  return (
    <div className="flashWrap">
      {shown.map((n, i) => {
        const isActive = i === 2;
        return (
          <div
            key={`${n}-${activeIndex}-${i}`}
            className={`flashRow ${isActive ? "isActive" : ""}`}
          >
            <span className="pill">@</span>
            <span style={{ flex: 1 }}>{n}</span>
          </div>
        );
      })}
    </div>
  );
}
