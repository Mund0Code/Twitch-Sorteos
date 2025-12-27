/// <reference types="vite/client" />

export {};

type OverlayState = {
  title?: string;
  prize?: string;
  winner?: string | null;
  picking?: boolean;
  animation?: string; // ✅ para overlay pro
};

declare global {
  interface Window {
    licenseApi: {
      status: () => Promise<{
        valid: boolean;
        expiresAt: string | null;
        capabilities?: any;
      }>;
      activate: (key: string) => Promise<any>;
      clear: () => Promise<boolean>;
      startTrial: (twitchUser?: string) => Promise<any>;
    };

    overlayApi: {
      open: () => Promise<boolean>;
      close: () => Promise<boolean>;
      isOpen: () => Promise<boolean>;
      setState: (state: OverlayState) => Promise<any>;
      onUpdate: (cb: (state: OverlayState) => void) => () => void; // ✅ devuelve unsubscribe
    };

    oauthApi?: {
      twitchStart: (url: string) => Promise<boolean>;
      getLast: () => Promise<string | null>;
      onCallback: (cb: (url: string) => void) => () => void;
    };

    updateApi?: {
      check: () => Promise<boolean>;
      install: () => Promise<boolean>;
      onStatus: (cb: (s: any) => void) => () => void;
    };
  }
}
