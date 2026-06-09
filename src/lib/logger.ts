const isDev = import.meta.env.DEV;

export const logger = {
  info: (msg: string, ...args: unknown[]) =>
    isDev && console.info(`[INFO] ${msg}`, ...args),
  warn: (msg: string, ...args: unknown[]) =>
    isDev && console.warn(`[WARN] ${msg}`, ...args),
  // errors always log regardless of environment
  error: (msg: string, ...args: unknown[]) =>
    console.error(`[ERROR] ${msg}`, ...args),
  debug: (msg: string, ...args: unknown[]) =>
    isDev && console.debug(`[DEBUG] ${msg}`, ...args),
};