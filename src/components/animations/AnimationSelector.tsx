import { useAnimationStore, AnimationType } from "../../state/animation.store";

const OPTIONS: { id: AnimationType; label: string; emoji: string }[] = [
  { id: "reel", label: "Reel", emoji: "🎞️" },
  { id: "wheel", label: "Ruleta", emoji: "🎡" },
  { id: "flash", label: "Flash", emoji: "⚡" },
];

export default function AnimationSelector() {
  const { animation, setAnimation } = useAnimationStore();

  return (
    <div className="animSelector">
      {OPTIONS.map((o) => (
        <button
          key={o.id}
          className={`animOption ${animation === o.id ? "active" : ""}`}
          onClick={() => setAnimation(o.id)}
        >
          <span>{o.emoji}</span>
          <b>{o.label}</b>
        </button>
      ))}
    </div>
  );
}
