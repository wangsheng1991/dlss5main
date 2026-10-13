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

/**
 * Send one command to the GA dataLayer in the shape gtag.js actually consumes.
 *
 * gtag.js only reads `arguments` objects — that is what `index.html`'s own `gtag()` pushes. A plain
 * Array looks identical to us (same 0/1/2 slots, same length) and is silently dropped, which is why
 * every custom event on this site was missing from GA4 while `page_view` still appeared: GA4's own
 * automatic hit was the only thing arriving. Verified from the outside on 2026-10-13 by pushing both
 * shapes into the live dataLayer and watching google-analytics.com/g/collect.
 */
function gtag(...args: unknown[]) {
  const dataLayer = (window.dataLayer ??= []);
  const push = function () { dataLayer.push(arguments); };
  push.apply(null, args);
}

/**
 * gtag.js only forwards `event` commands that arrive after the loader has initialised; commands
 * queued before it loads are processed for `js`/`config` only, so an event pushed during hydration
 * is silently dropped. Measured on the live page on 2026-10-13: an `arguments`-shaped event pushed
 * after load produced a google-analytics.com/g/collect hit, the same push queued before the loader
 * did not. `index.html` deliberately loads the loader on `window.load` (googletagmanager.com is
 * unreachable from mainland China), so events are held here and flushed once it appears.
 */
const pendingEvents: unknown[][] = [];
let flushTimer: number | undefined;
let pendingSince = 0;
const MAX_PENDING_MS = 60_000;
const MAX_PENDING_EVENTS = 50;

const isGtagReady = () => typeof (window as { google_tag_manager?: unknown }).google_tag_manager !== 'undefined';

function flushPending() {
  if (pendingEvents.length && !isGtagReady() && Date.now() - pendingSince > MAX_PENDING_MS) {
    // The loader never arrived (blocked network, extension): drop rather than hold memory forever.
    pendingEvents.length = 0;
  }
  while (pendingEvents.length && isGtagReady()) {
    const args = pendingEvents.shift()!;
    gtag(...args);
  }
  if (!pendingEvents.length && flushTimer !== undefined) {
    window.clearInterval(flushTimer);
    flushTimer = undefined;
  }
}

function sendEvent(name: string, params: Record<string, AnalyticsValue>) {
  if (isGtagReady()) {
    gtag('event', name, params);
    return;
  }
  if (!pendingEvents.length) pendingSince = Date.now();
  if (pendingEvents.length >= MAX_PENDING_EVENTS) pendingEvents.shift();
  pendingEvents.push(['event', name, params]);
  flushTimer ??= window.setInterval(flushPending, 500);
}

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
  sendEvent(name, { ...context, ...clean });
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
