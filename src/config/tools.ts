/**
 * The studio's C-line tools and the exact provider contract each one accepts.
 *
 * The tools own their output geometry, so a size or format field must never be sent: `cutout-fast`
 * keeps the input resolution and always answers PNG, `vectorize-fast` traces the input at its own
 * size and answers SVG, `erase-quality` answers a fixed 1024 px square. The gateway refuses those
 * fields with 422 rather than ignoring them, so a mistake here surfaces as a failed task instead of
 * a silently different image.
 */
export const CUTOUT_MODEL = 'cutout-fast';
export const VECTORIZE_MODEL = 'vectorize-fast';
export const ERASE_MODEL = 'erase-quality';

export const ERASE_OUTPUT_EDGE = 1024;
/** The erase model re-renders the whole frame, which takes about a minute on the shared GPU. */
export const ERASE_SECONDS_NOTE = 'about a minute';

export const STEPS_RANGE = { min: 4, max: 20, default: 8 } as const;

export type ToolId = 'cutout' | 'vectorize' | 'erase';
export const TOOL_IDS: readonly ToolId[] = ['cutout', 'vectorize', 'erase'];
export const isToolId = (value: unknown): value is ToolId =>
  typeof value === 'string' && (TOOL_IDS as readonly string[]).includes(value);

/** Named once so the server can reject anything else coming from a browser. */
export const PROVIDER_MODELS = ['flux-klein', CUTOUT_MODEL, VECTORIZE_MODEL, ERASE_MODEL] as const;
export type ProviderModel = (typeof PROVIDER_MODELS)[number];
export const isProviderModel = (value: unknown): value is ProviderModel =>
  typeof value === 'string' && (PROVIDER_MODELS as readonly string[]).includes(value);

/** Which provider model a tool runs on. */
export const modelForTool = (tool: ToolId): ProviderModel =>
  tool === 'cutout' ? CUTOUT_MODEL : tool === 'vectorize' ? VECTORIZE_MODEL : ERASE_MODEL;

/** Whether the caller has to describe what should go. */
export const toolNeedsPrompt = (tool: ToolId) => tool === 'erase';

/**
 * The vectorizer's three presets, in the words the page uses. They are fixed parameter sets on the
 * service (`logo/illustration/photo`), so the browser only ever picks a name — the numbers, the
 * downscaling and the colour limit stay on the server and are reported back in the result meta.
 */
export const VECTORIZE_PRESETS = ['logo', 'illustration', 'photo'] as const;
export type VectorizePreset = (typeof VECTORIZE_PRESETS)[number];
export const isVectorizePreset = (value: unknown): value is VectorizePreset =>
  typeof value === 'string' && (VECTORIZE_PRESETS as readonly string[]).includes(value);
/** Long edge of the traced image. Larger input is downscaled to it; the service caps it at 2048. */
export const VECTORIZE_MAX_EDGE = { min: 256, max: 2048, default: 1024 } as const;
export const VECTORIZE_PRESET_LABEL: Record<VectorizePreset, string> = {
  logo: 'Logo / icon',
  illustration: 'Flat illustration',
  photo: 'Photo (posterized)',
};
export const VECTORIZE_PRESET_NOTE: Record<VectorizePreset, string> = {
  logo: 'Exact colours and crisp straight edges. Best for logos, icons, badges and UI graphics.',
  illustration: 'A limited palette with smooth curves. Best for flat art with gradients or soft shapes.',
  photo: 'Quantised to 16 colours before tracing, so a photograph comes back as a stylised poster rather than a faithful copy.',
};

export const clampSteps = (value: unknown): number => {
  const steps = Number(value);
  if (!Number.isSafeInteger(steps)) return STEPS_RANGE.default;
  return Math.min(STEPS_RANGE.max, Math.max(STEPS_RANGE.min, steps));
};

export type ToolTaskInput = {
  imageIds: string[];
  prompt?: string;
  steps?: number;
  seed?: number;
  /** Vectorizer only: which fixed parameter set to trace with. */
  preset?: VectorizePreset;
  /** Vectorizer only: long edge of the traced image; a larger input is downscaled to it. */
  maxEdge?: number;
};

/** Kept inside the range the service accepts (256–2048) so a bad value never reaches the provider. */
export const clampVectorizeEdge = (value: unknown): number => {
  const edge = Number(value);
  if (!Number.isSafeInteger(edge)) return VECTORIZE_MAX_EDGE.default;
  return Math.min(VECTORIZE_MAX_EDGE.max, Math.max(VECTORIZE_MAX_EDGE.min, edge));
};

/**
 * The provider body for one tool task. Built on the server only — the browser never talks to the
 * provider, so a client cannot invent fields the model would reject.
 */
export function buildToolTask(tool: ToolId, input: ToolTaskInput) {
  const task: { model: ProviderModel; image_ids: string[]; prompt?: string; num_inference_steps?: number; seed?: number; preset?: VectorizePreset; max_edge?: number } = {
    model: modelForTool(tool),
    image_ids: input.imageIds,
  };
  if (tool === 'erase') {
    task.prompt = (input.prompt || '').trim();
    task.num_inference_steps = clampSteps(input.steps);
    if (Number.isSafeInteger(input.seed)) task.seed = input.seed;
  }
  if (tool === 'vectorize') {
    if (input.preset) task.preset = input.preset;
    if (input.maxEdge !== undefined) task.max_edge = clampVectorizeEdge(input.maxEdge);
  }
  return task;
}

/** What the studio shows before submitting, per tool. */
export const TOOL_SUMMARY: Record<ToolId, { label: string; short: string; output: string; seconds: string }> = {
  cutout: {
    label: 'Remove background',
    short: 'Cutout',
    output: 'Output: same size as your input · PNG with transparency',
    seconds: 'about 2 seconds',
  },
  vectorize: {
    label: 'Image to SVG',
    short: 'Vectorize',
    output: `Output: SVG at your input's size · long edge up to ${VECTORIZE_MAX_EDGE.max} px`,
    seconds: 'about a second',
  },
  erase: {
    label: 'Erase object',
    short: 'Erase',
    output: `Output: ${ERASE_OUTPUT_EDGE} × ${ERASE_OUTPUT_EDGE} · PNG`,
    seconds: ERASE_SECONDS_NOTE,
  },
};
