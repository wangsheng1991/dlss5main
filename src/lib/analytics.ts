/**
 * Privacy-conscious event bridge for the existing Google Analytics loader.
 * Events contain product dimensions only: never prompts, filenames, UIDs or image URLs.
 */
export type AnalyticsValue = string | number | boolean;

declare global {
  interface Window { dataLayer?: unknown[]; }
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
  window.dataLayer ??= [];
  window.dataLayer.push(['event', name, { ...clean, page_path: window.location.pathname }]);
}
