/**
 * Reads a required server-side environment variable.
 * Throws a descriptive error when missing.
 */
export const requireServerEnv = (name: string): string => {
  const value = process.env[name];
  if (!value || value.trim().length === 0) {
    throw new Error(
      `${name} is missing. Add it to .env.local for local development or your deployment environment settings.`,
    );
  }
  return value;
};
