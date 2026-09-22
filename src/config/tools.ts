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

/**
 * Input limits, checked in the browser as well as on the server.
 *
 * `MAX_UPLOAD_BYTES` is the file ceiling everywhere (studio picker, `/api/image-edit/upload`, the
 * gateway's upload ticket, every upstream service's own `MAX_BYTES` check).
 *
 * The pixel ceiling is **per mode**, because each upstream enforces its own: the FLUX editor
 * refuses more than 20 MP (`MAX_IMAGE_PIXELS` in the GPU service) and the two CPU tools 40 MP.
 * The numbers below are deliberately **stricter than any upstream**: the editor renders at a
 * 1536 px long edge and the cut keeps the input's size, so 16 MP (4928 × 3264) covers every phone
 * default — a 12 MP phone photo is 4032 × 3024 — plus 4K/5K screenshots, while a 24 MP or 48 MP
 * file is downscaled by the service anyway and only costs upload time and a queued wait. Measured
 * on the CPU services (2026-09-22): 16 MP → 3.1 s cutout, 20 MP → 3.6 s, 32 MP → 5.6 s. The eraser
 * downsizes its reference to a 1024 px long edge before rendering, so it has no pixel ceiling at
 * all. A phone photo is the case that matters: 48 MP is only about 15 MiB, so it passes the file
 * check and dies upstream — measuring the picture when it is picked turns that into an instant,
 * specific message.
 */
export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
/** The same ceiling in whole MiB, for the copy the customer reads. */
export const MAX_UPLOAD_MIB = MAX_UPLOAD_BYTES / (1024 * 1024);
/**
 * One ceiling for the whole studio — 4096 × 4096, which is what a customer would call 16 MP. It is
 * 2^24 rather than 16,000,000 on purpose: a 3:2 camera's 16 MP frame is 4928 × 3264 = 16.08 MP, and
 * a round 16 million would refuse it by half a percent. Only the eraser is exempt.
 */
export const STUDIO_MAX_PIXELS = 16_777_216;
/** What the copy calls that ceiling. Kept beside the number so the two can never drift apart. */
export const STUDIO_MAX_PIXELS_LABEL = '16 MP';
export const MODE_MAX_PIXELS: Record<'edit' | 'enhance' | 'cutout' | 'vectorize' | 'erase', number | null> = {
  edit: STUDIO_MAX_PIXELS,        // flux-klein / editing
  enhance: STUDIO_MAX_PIXELS,     // flux-klein / HD enhance
  cutout: STUDIO_MAX_PIXELS,      // background removal (rembg)
  vectorize: STUDIO_MAX_PIXELS,   // vectorizer (VTracer)
  erase: null,                    // generative erase: the reference is scaled inside the service
};
/** Pixel ceiling for one mode; the strictest applies when the mode is unknown. */
export const maxPixelsForMode = (mode: string): number | null =>
  mode in MODE_MAX_PIXELS ? MODE_MAX_PIXELS[mode as keyof typeof MODE_MAX_PIXELS] : MODE_MAX_PIXELS.edit;

/** That ceiling in the words the pages use: the label when it is the studio's, else the raw number. */
export function pixelLimitLabel(mode = 'edit'): string {
  const limit = maxPixelsForMode(mode);
  if (!limit) return '';
  return limit === STUDIO_MAX_PIXELS ? STUDIO_MAX_PIXELS_LABEL : `${limit / 1_000_000} MP`;
}

/** One short line for the studio panel: what the input may be, in that mode's terms. */
export const inputLimitNote = (mode: string): string => {
  const limit = maxPixelsForMode(mode);
  return limit
    ? `input up to ${pixelLimitLabel(mode)} and ${MAX_UPLOAD_MIB} MiB`
    : `any pixel size, file up to ${MAX_UPLOAD_MIB} MiB`;
};

/** '' when the measured image is within that mode's limits, otherwise the sentence to show. */
export function oversizeNote(width: number, height: number, mode = 'edit'): string {
  if (!width || !height) return '';
  const limit = maxPixelsForMode(mode);
  if (!limit || width * height <= limit) return '';
  const megapixels = Math.round((width * height) / 1_000_000);
  return `That image is ${width} × ${height} (${megapixels} MP). This tool accepts up to ${pixelLimitLabel(mode)} — shrink it and try again.`;
}

/**
 * Turns a provider failure into something a customer can act on. The provider's own words are kept
 * when they are already meaningful; the over-size case is the one worth translating, because the
 * raw text is `backend_413: ... exceeds 20000000 pixels`.
 */
export function failureNote(reason: unknown, mode = 'edit'): string {
  const text = typeof reason === 'string' ? reason.trim() : '';
  if (!text) return '';
  if (/413|exceeds \d+ pixels|larger than \d+ bytes|too large/i.test(text)) {
    const limit = maxPixelsForMode(mode);
    return `The image is too large for this service (up to ${MAX_UPLOAD_MIB} MiB${limit ? ` and ${pixelLimitLabel(mode)}` : ''}). Shrink it and try again.`;
  }
  return text.length > 160 ? `${text.slice(0, 157)}…` : text;
}

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
