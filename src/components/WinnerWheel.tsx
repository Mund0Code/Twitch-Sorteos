import { useEffect, useMemo, useRef } from "react";

type Props = {
  participants: string[];
  winner: string;
  durationMs?: number;
  onFinish?: () => void;
};

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function easeOutQuint(t: number) {
  return 1 - Math.pow(1 - t, 5);
}

export default function WinnerWheel({
  participants,
  winner,
  durationMs = 2000,
  onFinish,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const names = useMemo(() => {
    const base = participants.slice(0, 30);
    return base.length ? base : ["—"];
  }, [participants]);

  const winnerIndex = useMemo(() => {
    const i = names.findIndex((n) => n === winner);
    return i >= 0 ? i : 0;
  }, [names, winner]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    const size = 260;

    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);

    const cx = size / 2;
    const cy = size / 2;
    const r = size / 2 - 10;

    const seg = (Math.PI * 2) / names.length;

    // ángulo final para que el ganador quede arriba (puntero)
    // puntero está en -90deg, así que queremos centrar el segmento ahí
    const targetAngle = -Math.PI / 2 - (winnerIndex + 0.5) * seg;

    let raf = 0;
    const start = performance.now();
    const spins = 8 * Math.PI; // vueltas extra

    const draw = (angle: number) => {
      ctx.clearRect(0, 0, size, size);

      // fondo
      ctx.beginPath();
      ctx.arc(cx, cy, r + 6, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(0,0,0,0.20)";
      ctx.fill();

      for (let i = 0; i < names.length; i++) {
        const a0 = angle + i * seg;
        const a1 = a0 + seg;

        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, r, a0, a1);
        ctx.closePath();

        ctx.fillStyle =
          i % 2 === 0 ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.03)";
        ctx.fill();

        // texto (simple)
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(a0 + seg / 2);
        ctx.textAlign = "right";
        ctx.fillStyle = "rgba(255,255,255,0.85)";
        ctx.font = "12px system-ui";
        const label =
          names[i].length > 12 ? names[i].slice(0, 12) + "…" : names[i];
        ctx.fillText(label, r - 10, 4);
        ctx.restore();
      }

      // círculo central
      ctx.beginPath();
      ctx.arc(cx, cy, 36, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(0,0,0,0.35)";
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.12)";
      ctx.stroke();

      // puntero
      ctx.beginPath();
      ctx.moveTo(cx, cy - r - 2);
      ctx.lineTo(cx - 10, cy - r + 18);
      ctx.lineTo(cx + 10, cy - r + 18);
      ctx.closePath();
      ctx.fillStyle = "rgba(168,85,247,0.9)";
      ctx.fill();
    };

    const animate = (now: number) => {
      const t = clamp((now - start) / durationMs, 0, 1);
      const eased = easeOutQuint(t);

      const angle = spins * (1 - eased) + targetAngle;
      draw(angle);

      if (t < 1) raf = requestAnimationFrame(animate);
      else onFinish?.();
    };

    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [durationMs, names, onFinish, winnerIndex]);

  return (
    <div className="wheelWrap">
      <canvas ref={canvasRef} />
    </div>
  );
}
