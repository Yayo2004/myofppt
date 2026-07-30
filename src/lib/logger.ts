function log(level: string, msg: string, meta?: Record<string, unknown>) {
  process.nextTick(() => {
    const entry = { timestamp: new Date().toISOString(), level, msg, ...meta };
    if (level === "ERROR") console.error(JSON.stringify(entry));
    else console.log(JSON.stringify(entry));
  });
}

export const logger = {
  info: (msg: string, meta?: Record<string, unknown>) => log("INFO", msg, meta),
  warn: (msg: string, meta?: Record<string, unknown>) => log("WARN", msg, meta),
  error: (msg: string, meta?: Record<string, unknown>) => log("ERROR", msg, meta),
  debug: (msg: string, meta?: Record<string, unknown>) => {
    if (process.env.NODE_ENV === "development") log("DEBUG", msg, meta);
  },
};
