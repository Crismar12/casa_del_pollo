const SENSITIVE_FIELDS = ['contrasena', 'password', 'token', 'accessToken', 'refreshToken'];

function mask(obj: Record<string, unknown>): Record<string, unknown> {
  const masked = { ...obj };
  for (const key of SENSITIVE_FIELDS) {
    if (key in masked) {
      masked[key] = '***MASKED***';
    }
  }
  return masked;
}

export const logger = {
  info: (...args: unknown[]) => console.log(...args),
  warn: (...args: unknown[]) => console.warn(...args),
  error: (...args: unknown[]) => console.error(...args),
  mask: (obj: Record<string, unknown>) => mask(obj),
};
