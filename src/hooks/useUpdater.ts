import { useEffect, useState } from "react";

type UpdateState =
  | { state: "idle" }
  | { state: "checking" }
  | { state: "none" }
  | { state: "available"; info?: any }
  | { state: "downloading"; percent?: number }
  | { state: "downloaded" }
  | { state: "error"; message?: string };

export function useUpdater() {
  const [u, setU] = useState<UpdateState>({ state: "idle" });

  useEffect(() => {
    if (!window.updateApi?.onStatus) return;
    const unsub = window.updateApi.onStatus((s: any) => {
      // normalizamos payload
      if (!s?.state) return;
      setU(s);
    });
    return () => unsub?.();
  }, []);

  const check = async () => {
    if (!window.updateApi?.check) return;
    setU({ state: "checking" });
    await window.updateApi.check();
  };

  const install = async () => {
    if (!window.updateApi?.install) return;
    await window.updateApi.install();
  };

  return { u, check, install, supported: !!window.updateApi };
}
