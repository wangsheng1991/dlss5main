/**
 * Privacy-conscious event bridge for the existing Google Analytics loader.
 * Events contain product dimensions only: never prompts, filenames, UIDs or image URLs.
 */
export type AnalyticsValue = string | number | boolean;

declare global {
  interface Window { dataLayer?: unknown[]; }
}

type VisitorState = 'anonymous' | 'authenticated';
type Attribution = Record<string, string>;

const ATTRIBUTION_KEY = 'dlss:analytics:attribution:v1';
const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const;
const recentOnce = new Map<string, number>();
const ROUTE_EVENT_NAMES = new Set(['page_view', 'studio_open', 'use_case_view', 'micro_tool_view']);
let visitorState: VisitorState = 'anonymous';

/**
 * Keep the account state as a coarse dimension only.  No uid, email or Firebase token is ever
 * sent to analytics; AuthContext calls this when Firebase settles.
 */
export function setAnalyticsAuthState(state: VisitorState) {
  visitorState = state;
}

const safeAttribution = (value: string) => value.trim().replace(/[^a-zA-Z0-9._~-]/g, '_').slice(0, 80);

function attribution(): Attribution {
  if (typeof window === 'undefined') return {};
  const current = new URL(window.location.href);
  const fromUrl: Attribution = {};
  for (const key of UTM_KEYS) {
    const value = current.searchParams.get(key);
    if (value) fromUrl[key] = safeAttribution(value);
  }
  // Persist only campaign labels, never the full URL. This lets a CTA on a later route retain the
  // original external source while avoiding any query value that could contain user content.
  if (Object.keys(fromUrl).length) {
    try { window.sessionStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(fromUrl)); } catch { /* private mode */ }
  }
  let stored: Attribution = {};
  try {
    const raw = window.sessionStorage.getItem(ATTRIBUTION_KEY);
    if (raw) stored = JSON.parse(raw) as Attribution;
  } catch { /* private mode or malformed old value */ }
  const referrer = document.referrer;
  let referrerDomain = 'direct';
  try {
    if (referrer) {
      const host = new URL(referrer).hostname;
      if (host && host !== current.hostname) referrerDomain = safeAttribution(host);
    }
  } catch { /* ignore malformed referrers */ }
  return { ...stored, ...fromUrl, referrer_domain: referrerDomain };
}

export const fileSizeBucket = (bytes: number) => {
  if (!Number.isFinite(bytes) || bytes < 0) return 'unknown';
  if (bytes < 1024 * 1024) return '<1MB';
  if (bytes < 5 * 1024 * 1024) return '1-5MB';
  if (bytes < 10 * 1024 * 1024) return '5-10MB';
  return '>10MB';
};

export const pixelBucket = (width: number, height: number) => {
  const pixels = width * height;
  if (!Number.isFinite(pixels) || pixels <= 0) return 'unknown';
  if (pixels <= 1024 * 1024) return '<=1MP';
  if (pixels <= 4 * 1024 * 1024) return '1-4MP';
  if (pixels <= 16 * 1024 * 1024) return '4-16MP';
  return '>16MP';
};

/** Push a gtag-compatible event without a hard dependency on the GA script. */
export function trackEvent(name: string, params: Record<string, AnalyticsValue | undefined> = {}) {
  if (typeof window === 'undefined') return;
  const clean = Object.fromEntries(Object.entries(params).filter(([, value]) => value !== undefined));
  const context: Record<string, AnalyticsValue> = {
    ...attribution(),
    visitor_state: visitorState,
    locale: document.documentElement.lang || navigator.language.split('-')[0] || 'en',
    page_path: window.location.pathname,
  };
  // React StrictMode intentionally mounts effects twice in development. Route/open events are
  // visits, not button actions, so suppress the duplicate while preserving a later revisit.
  if (ROUTE_EVENT_NAMES.has(name)) {
    const key = `${name}:${window.location.pathname}:${String(clean.tool || clean.use_case || '')}`;
    const now = Date.now();
    const previous = recentOnce.get(key);
    if (previous && now - previous < 1500) return;
    recentOnce.set(key, now);
  }
  window.dataLayer ??= [];
  window.dataLayer.push(['event', name, { ...context, ...clean }]);
}

/** StrictMode can mount a route effect twice; suppress only same-tick duplicates. */
export function trackEventOnce(key: string, name: string, params: Record<string, AnalyticsValue | undefined> = {}) {
  const now = Date.now();
  const previous = recentOnce.get(key);
  if (previous && now - previous < 1500) return;
  recentOnce.set(key, now);
  trackEvent(name, params);
}

export function trackRouteView(path: string) {
  trackEventOnce(`route:${path}`, 'page_view', { page_path: path });
}

/** Public share links can be added without changing this tracker. A share token is never emitted. */
export function trackShareLinkAccess(path = window.location.pathname) {
  trackEventOnce(`share-link:${path}`, 'share_link_access', { share_surface: 'public_preview' });
}
