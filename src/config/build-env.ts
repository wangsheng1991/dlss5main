/**
 * One reader for the variables that decide what a build *is*.
 *
 * Vite inlines `VITE_*` into the browser bundle at build time, while the API routes and the
 * prerender script run under Node and read `process.env`. Both worlds want the same answer, so the
 * lookup lives here instead of being repeated in every config module.
 */
const viteEnv = (import.meta as unknown as { env?: Record<string, string | undefined> }).env;
const nodeEnv = typeof process === 'undefined' ? undefined : process.env;

export const readBuildEnv = (key: string): string | undefined => viteEnv?.[key] || nodeEnv?.[key];
