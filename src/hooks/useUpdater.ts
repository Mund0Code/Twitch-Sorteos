import { useEffect, useState } from "react";

type UpdateState =
  | { state: "idle"; appVersion?: string }
  | { state: "checking"; appVersion?: string }
  | { state: "none"; appVersion?: string }
  | {
      state: "available";
      appVersion?: string;
      version?: string;
      releaseNotes?: any;
      info?: any;
    }
  | { state: "downloading"; appVersion?: string; percent?: number }
  | {
      state: "downloaded";
      appVersion?: string;
      version?: string;
      releaseNotes?: any;
      info?: any;
    }
  | { state: "error"; appVersion?: string; message?: string }
  | { state: "boot"; version: string };

export function useUpdater() {
  const [u, setU] = useState<UpdateState>({ state: "idle" });

  useEffect(() => {
    if (!window.updateApi?.onStatus) return;

    const unsub = window.updateApi.onStatus((s: any) => {
      if (!s?.state) return;

      setU((prev) => {
        const appVersion = (prev as any).appVersion;

        if (s.state === "boot") {
          return { state: "idle", appVersion: String(s.version ?? "") };
        }

        return { ...s, appVersion };
      });
    });

    return () => unsub?.();
  }, []);

  const check = async () => {
    if (!window.updateApi?.check) return;
    setU((prev) => ({
      state: "checking",
      appVersion: (prev as any).appVersion,
    }));
    await window.updateApi.check();
  };

  const install = async () => {
    if (!window.updateApi?.install) return;
    await window.updateApi.install();
  };

  return { u, check, install, supported: !!window.updateApi };
}
