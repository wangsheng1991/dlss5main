import { resolveSiteUrl, resolveSupportEmail, siteHost } from './site-url';

/**
 * The deployment's public origin, as seen by the browser bundle: `VITE_SITE_URL` is inlined by Vite
 * at build time, so every page, canonical tag and JSON-LD block names the domain this build serves.
 *
 * The prerender script imports this module under Node, where `import.meta.env` does not exist, so
 * `process.env` is read as a fallback and the same build-time variable works in both worlds. Unset
 * everywhere means the original storefront — see `site-url.ts`.
 */
const viteEnv = (import.meta as unknown as { env?: Record<string, string | undefined> }).env;
const nodeEnv = typeof process === 'undefined' ? undefined : process.env;

const read = (key: string): string | undefined => viteEnv?.[key] || nodeEnv?.[key];

/** Absolute origin without a trailing slash, e.g. `https://www.dlss5nvidia.com`. */
export const SITE_URL = resolveSiteUrl(read('VITE_SITE_URL'));

/** Host only, for the legal pages that print the website address. */
export const SITE_HOST = siteHost(SITE_URL);

/** Where buyers are told to write. */
export const SUPPORT_EMAIL = resolveSupportEmail(read('VITE_SUPPORT_EMAIL'));
