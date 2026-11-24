/** Only bounded product dimensions; never file names, prompts, URLs or customer identifiers. */
export const FUNNEL_EVENTS = ['quota_notice_view', 'quota_plan_click', 'pricing_view', 'plan_select', 'checkout_login_required', 'checkout_return',
  'checkout_cancel', 'checkout_redirect', 'checkout_failure', 'image_selected', 'upload_start', 'upload_success', 'upload_failure',
  'generation_request_error', 'generation_start', 'generation_success', 'generation_failure', 'download_click'] as const;
export type FunnelEvent = typeof FUNNEL_EVENTS[number];
const choices: Record<string, readonly string[]> = {
  error_reason: ['insufficient_credits', 'daily_limit', 'upload_limit', 'concurrency_limit', 'PROMPT_NOT_APPROVED', 'account_missing', 'unknown'],
  plan: ['free', 'pro', 'team'], provider: ['waffo'],
  intent: ['upload', 'sample', 'download'], result: ['generation', 'sample'],
  source: ['free_sample', 'uploaded_image'],
  tool: ['edit', 'enhance', 'together', 'interior', 'retouch', 'makeup', 'tryon', 'cutout', 'erase', 'vectorize', 'game-character-style', 'headshot', 'fetch'],
  error_category: ['network', 'credits', 'rate_limit', 'validation', 'authentication', 'provider', 'unknown'],
};
export function funnelFields(value: unknown): Record<string, string> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  return Object.fromEntries(Object.entries(value).filter(([k,v]) => typeof v === 'string' && choices[k]?.includes(v)));
}
export function parseFunnelEvent(body: unknown) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return null;
  const b = body as Record<string, unknown>;
  if (!FUNNEL_EVENTS.includes(b.event as FunnelEvent) || typeof b.id !== 'string' ||
    !/^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/.test(b.id)) return null;
  return { event: b.event as FunnelEvent, id: b.id, dimensions: funnelFields(b.dimensions) };
}

/** Classify only the transport status, never the provider message or prompt. */
export function funnelErrorCategory(status?: number) {
  return status === 402 ? 'credits' : status === 429 ? 'rate_limit' : status === 401 ? 'authentication'
    : status === 400 || status === 413 || status === 422 ? 'validation' : status && status >= 500 ? 'provider' : 'network';
}

/** Only explicit application quota codes justify a plans link. Never infer it from HTTP429 alone. */
export function quotaPlanReason(error: unknown): 'insufficient_credits' | 'daily_limit' | null {
  if (!error || typeof error !== 'object') return null;
  const e = error as {status?: unknown; code?: unknown};
  return e.status === 402 && e.code === 'insufficient_credits' ? 'insufficient_credits'
    : e.status === 429 && e.code === 'daily_limit' ? 'daily_limit' : null;
}
