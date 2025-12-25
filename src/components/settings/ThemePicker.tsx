import { useThemeStore, ThemeId } from "../../state/theme.store";

type Props = {
  isPro: boolean;
  onBuyPro?: () => void;
};

const THEMES: {
  id: ThemeId;
  label: string;
  emoji: string;
  desc: string;
  proOnly?: boolean;

  // Preview (estático, no depende del CSS)
  previewBg: string;
  previewCard: string;
  previewAccent: string;
}[] = [
  {
    id: "dark",
    label: "Dark",
    emoji: "🌙",
    desc: "Pro / limpio / Twitch",
    previewBg:
      "radial-gradient(circle at 25% 20%, #6d28d9, #0b1220 55%, #0b1220)",
    previewCard: "rgba(255,255,255,0.08)",
    previewAccent: "#a855f7",
  },
  {
    id: "neon",
    label: "Neon",
    emoji: "⚡",
    desc: "Cyan + glow gamer",
    proOnly: true,
    previewBg:
      "radial-gradient(circle at 30% 20%, #22d3ee, #050610 60%, #050610)",
    previewCard: "rgba(255,255,255,0.07)",
    previewAccent: "#22d3ee",
  },
  {
    id: "minimal",
    label: "Minimal",
    emoji: "🧊",
    desc: "Elegante y sobrio",
    previewBg:
      "linear-gradient(180deg, rgba(255,255,255,0.07), rgba(255,255,255,0.02))",
    previewCard: "rgba(255,255,255,0.06)",
    previewAccent: "#ffffff",
  },
];

export default function ThemePicker({ isPro, onBuyPro }: Props) {
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);

  function trySelect(t: (typeof THEMES)[number]) {
    if (t.proOnly && !isPro) {
      onBuyPro?.();
      return;
    }
    setTheme(t.id);
  }

  return (
    <div style={{ display: "grid", gap: 10 }}>
      <div style={{ fontWeight: 950, fontSize: 14 }}>🎨 Themes</div>

      <div className="themeGrid">
        {THEMES.map((t) => {
          const active = theme === t.id;
          const locked = !!t.proOnly && !isPro;

          return (
            <div
              key={t.id}
              className={`themeCard ${active ? "themeCardActive" : ""}`}
              role="button"
              tabIndex={0}
              onClick={() => trySelect(t)}
              onKeyDown={(e) => e.key === "Enter" && trySelect(t)}
              title={locked ? "Disponible en PRO" : "Seleccionar theme"}
            >
              {locked && <div className="themeLock">🔒 PRO</div>}

              <div className="themeHead">
                <span style={{ fontSize: 18 }}>{t.emoji}</span>
                <span>{t.label}</span>
              </div>

              <div className="themeDesc">{t.desc}</div>

              {/* Preview visual */}
              <div
                className="themeMiniPreview"
                style={{
                  background: t.previewBg,
                }}
              >
                <div
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: 10,
                    background: t.previewCard,
                    border: "1px solid rgba(255,255,255,0.12)",
                  }}
                />
                <div
                  className="themeDot"
                  style={{ background: t.previewAccent }}
                />
                <div
                  className="themeBar"
                  style={{ background: t.previewAccent }}
                />
              </div>

              <div className="themeFooter">
                {active
                  ? "✅ Activo"
                  : locked
                  ? "Requiere licencia PRO"
                  : "Click para activar"}
              </div>
            </div>
          );
        })}
      </div>

      {!isPro && (
        <div style={{ fontSize: 12, opacity: 0.75 }}>
          Tip: desbloquea <b>Neon</b> con PRO.
        </div>
      )}
    </div>
  );
}
