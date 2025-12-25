/// <reference types="vite/client" />

export {};

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
      setState: (state: {
        title?: string;
        prize?: string;
        winner?: string | null;
        picking?: boolean;
      }) => Promise<boolean>;
      onUpdate: (cb: (state: any) => void) => void;
    };
    oauthApi?: {
      onCallback: (cb: (url: string) => void) => void;
    };
    updateApi?: {
      check: () => Promise<boolean>;
      install: () => Promise<boolean>;
      onStatus: (cb: (s: any) => void) => () => void;
    };
  }
}
