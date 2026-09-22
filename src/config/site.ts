import { readBuildEnv } from './build-env';
import { resolveSiteUrl, resolveSupportEmail, siteHost } from './site-url';

/**
 * The deployment's public origin.
 *
 * The origin has to be baked into the build rather than read from the request: canonical tags,
 * sitemap entries and JSON-LD must be absolute, and one Vercel build can be served under several
 * domains. Each deployment states its own through `VITE_SITE_URL`; unset means the original
 * storefront, so a project that sets nothing keeps behaving exactly as before.
 */

/** Absolute origin without a trailing slash, e.g. `https://www.dlss5nvidia.com`. */
export const SITE_URL = resolveSiteUrl(readBuildEnv('VITE_SITE_URL'));

/** Host only, for the legal pages that print the website address. */
export const SITE_HOST = siteHost(SITE_URL);

/** Where buyers are told to write. */
export const SUPPORT_EMAIL = resolveSupportEmail(readBuildEnv('VITE_SUPPORT_EMAIL'));
