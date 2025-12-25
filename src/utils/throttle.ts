export function throttle<T extends (...args: any[]) => void>(
  fn: T,
  waitMs: number
) {
  let last = 0;
  let timer: any = null;
  let lastArgs: any[] | null = null;

  return (...args: any[]) => {
    const now = Date.now();
    lastArgs = args;

    const run = () => {
      last = now;
      timer = null;
      fn(...(lastArgs ?? []));
      lastArgs = null;
    };

    if (now - last >= waitMs) run();
    else if (!timer) timer = setTimeout(run, waitMs - (now - last));
  };
}
