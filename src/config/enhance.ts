/**
 * HD enhance: the vendor's `flux-klein` edit model re-renders the photo at a larger pixel size.
 *
 * Measured against the live endpoint on 2026-09-17: `width`/`height` are honoured (a request for
 * 1536 × 1008 came back 1536 × 1008) and both must be multiples of 16, but anything above 1536 per
 * edge is refused with 422 `Input should be less than or equal to 1536`. So the factor is a target,
 * not a promise: when the source times the factor would exceed the ceiling, the scale is reduced to
 * fit and both edges keep the source aspect ratio.
 *
 * This is model-regenerated detail at a larger size, not a pixel-exact reconstruction — never
 * describe it as true super resolution.
 */
export const ENHANCE_MAX_EDGE = 1536;
export const ENHANCE_FACTORS = [2, 4] as const;
export type EnhanceFactor = (typeof ENHANCE_FACTORS)[number];
export const isEnhanceFactor = (value: unknown): value is EnhanceFactor => ENHANCE_FACTORS.includes(value as EnhanceFactor);

export const roundTo16 = (value: number) => Math.max(16, Math.round(value / 16) * 16);

/** The output size we ask for, and the factor actually achieved after the 1536 px ceiling. */
export function enhanceOutput(sourceWidth: number, sourceHeight: number, factor: EnhanceFactor) {
  const scale = Math.min(factor, ENHANCE_MAX_EDGE / sourceWidth, ENHANCE_MAX_EDGE / sourceHeight);
  return {
    width: roundTo16(sourceWidth * scale),
    height: roundTo16(sourceHeight * scale),
    factor: Math.round(scale * 100) / 100,
    clamped: scale < factor,
  };
}

/** The prompt the model receives — the enhancer sends no prompt of its own. */
export const enhancePrompt = (width: number, height: number) =>
  `Enhance this photo to ${width} × ${height} pixels: restore realistic detail, texture and sharpness while keeping the composition, framing, lighting and colors identical.`;
