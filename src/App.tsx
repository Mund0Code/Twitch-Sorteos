import { useEffect, useState } from "react";
import TwitchUserScreen, {
  getSavedTwitchUser,
} from "./screens/TwitchUserScreen";
import ActivationScreen from "./screens/ActivationScreen";
import RaffleScreen from "./screens/RaffleScreen";
import OverlayScreen from "./screens/OverlayScreen";
import { useThemeStore } from "./state/theme.store";
import Toast from "./components/ui/Toast";

type LicenseStatus = {
  valid: boolean;
  expiresAt: string | null;
};

type Step = "TWITCH_USER" | "LICENSE" | "APP";

export default function App() {
  const theme = useThemeStore((s) => s.theme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Si la ventana se abrió como overlay, renderizamos solo el overlay
  if (window.location.hash === "#/overlay") {
    return <OverlayScreen />;
  }

  const [step, setStep] = useState<Step>("TWITCH_USER");
  const [loading, setLoading] = useState(true);
  const [license, setLicense] = useState<LicenseStatus>({
    valid: false,
    expiresAt: null,
  });

  async function checkLicense() {
    const res = await window.licenseApi.status();
    setLicense(res);
    return res.valid;
  }

  useEffect(() => {
    (async () => {
      const hasUser = !!getSavedTwitchUser();

      if (!hasUser) {
        setStep("TWITCH_USER");
        setLoading(false);
        return;
      }

      const valid = await checkLicense();
      setStep(valid ? "APP" : "LICENSE");
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <div className="page">
        <div className="card">Cargando…</div>
      </div>
    );
  }

  // 1️⃣ Usuario Twitch
  if (step === "TWITCH_USER") {
    return (
      <TwitchUserScreen
        onDone={async () => {
          setLoading(true);
          const valid = await checkLicense();
          setStep(valid ? "APP" : "LICENSE");
          setLoading(false);
        }}
      />
    );
  }

  // 2️⃣ Licencia
  if (step === "LICENSE") {
    return (
      <ActivationScreen
        onActivated={async () => {
          setLoading(true);
          const valid = await checkLicense();
          setStep(valid ? "APP" : "LICENSE");
          setLoading(false);
        }}
      />
    );
  }

  // 3️⃣ App principal
  return (
    <>
      <RaffleScreen />;
      <Toast />
    </>
  );
}
