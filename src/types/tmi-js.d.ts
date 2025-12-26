declare module "tmi.js" {
  export type ChatUserstate = {
    username?: string;
    "display-name"?: string;
    badges?: Record<string, string>;
    mod?: boolean;
    subscriber?: boolean;
    [key: string]: any;
  };

  export type Options = any;

  export class Client {
    constructor(opts: Options);
    connect(): Promise<any>;
    disconnect(): Promise<any>;

    on(event: string, cb: (...args: any[]) => void): this;
    say(channel: string, message: string): Promise<any>;
  }

  const tmi: {
    Client: typeof Client;
  };

  export default tmi;
}
