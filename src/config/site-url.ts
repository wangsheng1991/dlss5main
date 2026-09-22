/**
 * Where this deployment lives on the public internet.
 *
 * The origin has to be baked in rather than read from the request: canonical tags, sitemap entries
 * and JSON-LD must be absolute, and one Vercel build can be served under several domains. Each
 * deployment therefore states its own origin through `VITE_SITE_URL`; the default below is the
 * original storefront, so a project that sets nothing keeps behaving exactly as before.
 *
 * This module stays free of `import.meta` and `process` on purpose — the API routes, the prerender
 * script and the browser bundle all import it, and only the caller knows which environment it is in.
 */
export const DEFAULT_SITE_URL = 'https://www.dlss5nvidia.com';
export const DEFAULT_SUPPORT_EMAIL = 'support@dlss5nvidia.com';

/** Absolute origin without a trailing slash, e.g. `https://www.dlss5nvidia.com`. */
export const resolveSiteUrl = (raw?: string | null): string => {
  const value = (raw || '').trim();
  return (value || DEFAULT_SITE_URL).replace(/\/+$/, '');
};

/** The legal pages print the address, so they want the host without a scheme. */
export const siteHost = (url: string): string => url.replace(/^https?:\/\//, '');

/** Where buyers are told to write; must match the mailbox the billing API advertises. */
export const resolveSupportEmail = (raw?: string | null): string => (raw || '').trim() || DEFAULT_SUPPORT_EMAIL;
