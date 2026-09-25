/**
 * The studio's tools and the exact provider contract each one accepts.
 *
 * The tools own their output geometry, so a size or format field must never be sent: `cutout-fast`
 * keeps the input resolution and always answers PNG, `vectorize-fast` traces the input at its own
 * size and answers SVG, `erase-quality` answers a fixed 1024 px square. The gateway refuses those
 * fields with 422 rather than ignoring them, so a mistake here surfaces as a failed task instead of
 * a silently different image.
 *
 * The A-line tools (`tryon-quality`, `interior-quality`, `retouch-quality`, `makeup-quality`) are the
 * same rule taken one step further: they run the same generative editor as `erase-quality`, but their
 * **prompt is a server-side asset** built from a versioned template library, so the browser may only
 * pick named options (`style=nordic`, `look=korean`) — a `prompt` field is refused upstream as well.
 */
export const CUTOUT_MODEL = 'cutout-fast';
export const VECTORIZE_MODEL = 'vectorize-fast';
export const ERASE_MODEL = 'erase-quality';
export const TRYON_MODEL = 'tryon-quality';
export const INTERIOR_MODEL = 'interior-quality';
export const RETOUCH_MODEL = 'retouch-quality';
export const MAKEUP_MODEL = 'makeup-quality';

export const ERASE_OUTPUT_EDGE = 1024;
/** The erase model re-renders the whole frame, which takes about a minute on the shared GPU. */
export const ERASE_SECONDS_NOTE = 'about a minute';
/** Every A-line tool re-renders the frame on the same GPU, so they share the enhancer's wall clock. */
export const GENERATIVE_SECONDS_NOTE = 'about a minute';

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
export const MODE_MAX_PIXELS: Record<'edit' | 'enhance' | 'cutout' | 'vectorize' | 'erase' | 'tryon' | 'interior' | 'retouch' | 'makeup', number | null> = {
  edit: STUDIO_MAX_PIXELS,        // flux-klein / editing
  enhance: STUDIO_MAX_PIXELS,     // flux-klein / HD enhance
  cutout: STUDIO_MAX_PIXELS,      // background removal (rembg)
  vectorize: STUDIO_MAX_PIXELS,   // vectorizer (VTracer)
  erase: null,                    // generative erase: the reference is scaled inside the service
  // The four A-line tools run the same generative editor as the eraser, so every reference frame is
  // scaled down inside the service before the render: a pixel ceiling here would only refuse an
  // upload the service would have handled.
  tryon: null,
  interior: null,
  retouch: null,
  makeup: null,
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

export type ToolId = 'cutout' | 'vectorize' | 'erase' | 'tryon' | 'interior' | 'retouch' | 'makeup';
export const TOOL_IDS: readonly ToolId[] = ['cutout', 'vectorize', 'erase', 'tryon', 'interior', 'retouch', 'makeup'];
export const isToolId = (value: unknown): value is ToolId =>
  typeof value === 'string' && (TOOL_IDS as readonly string[]).includes(value);

/** Named once so the server can reject anything else coming from a browser. */
export const PROVIDER_MODELS = ['flux-klein', CUTOUT_MODEL, VECTORIZE_MODEL, ERASE_MODEL, TRYON_MODEL, INTERIOR_MODEL, RETOUCH_MODEL, MAKEUP_MODEL] as const;
export type ProviderModel = (typeof PROVIDER_MODELS)[number];
export const isProviderModel = (value: unknown): value is ProviderModel =>
  typeof value === 'string' && (PROVIDER_MODELS as readonly string[]).includes(value);

/**
 * How many references each tool takes, and which one they are — the order is the meaning, since the
 * provider sees an ordered list (`image_ids`) and the server-side prompt names the slots.
 */
export const TOOL_REFERENCES: Record<ToolId, { min: number; max: number; slots: string[] }> = {
  cutout: { min: 1, max: 1, slots: ['image'] },
  vectorize: { min: 1, max: 1, slots: ['image'] },
  erase: { min: 1, max: 1, slots: ['image'] },
  tryon: { min: 2, max: 2, slots: ['person', 'garment'] },
  interior: { min: 1, max: 2, slots: ['room', 'style reference (optional)'] },
  retouch: { min: 1, max: 1, slots: ['portrait'] },
  makeup: { min: 1, max: 2, slots: ['portrait', 'makeup reference (optional)'] },
};
/** The first reference is the subject; a tool whose maximum is 2 accepts a second, optional one. */
export const toolTakesSecondImage = (tool: ToolId): boolean => TOOL_REFERENCES[tool].max > 1;
/** Required second reference: the garment shot a virtual try-on cannot work without. */
export const toolNeedsSecondImage = (tool: ToolId): boolean => TOOL_REFERENCES[tool].min > 1;

/** Which provider model a tool runs on. */
export const modelForTool = (tool: ToolId): ProviderModel => {
  if (tool === 'cutout') return CUTOUT_MODEL;
  if (tool === 'vectorize') return VECTORIZE_MODEL;
  if (tool === 'erase') return ERASE_MODEL;
  if (tool === 'tryon') return TRYON_MODEL;
  if (tool === 'interior') return INTERIOR_MODEL;
  if (tool === 'retouch') return RETOUCH_MODEL;
  return MAKEUP_MODEL;
};

/**
 * The mode a provider model belongs to — the inverse of `modelForTool`, plus the editor both edit
 * and enhance upload under. The server takes the model from an upload request and needs the same
 * per-mode ceiling the browser applies, so the mapping lives beside the numbers it feeds.
 */
export const modeForModel = (model: string): string =>
  model === CUTOUT_MODEL ? 'cutout'
    : model === VECTORIZE_MODEL ? 'vectorize'
      : model === ERASE_MODEL ? 'erase'
        : model === TRYON_MODEL ? 'tryon'
          : model === INTERIOR_MODEL ? 'interior'
            : model === RETOUCH_MODEL ? 'retouch'
              : model === MAKEUP_MODEL ? 'makeup'
                : 'edit';

/**
 * The one sentence a caller gets when its image is over a mode's ceiling, checked at upload as well
 * as in the browser. `width`/`height` arrive as unknown because they come off a request body: an
 * absent or unreadable pair leaves the pixel check to whoever can measure the file (the browser),
 * which is why `oversizeNote` answers '' for a zero.
 */
export function pixelCheckNote(width: unknown, height: unknown, mode: string): string {
  const w = Number(width), h = Number(height);
  if (!Number.isSafeInteger(w) || !Number.isSafeInteger(h) || w < 1 || h < 1) return '';
  return oversizeNote(w, h, mode);
}

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

/**
 * The A-line options, in the words the pages use.
 *
 * These names are the **whole** public contract of those tools: the prompt that turns `nordic` into a
 * materials recipe lives on the server, in a versioned library, and the provider refuses a `prompt`
 * field outright. Adding a value is an additive change; renaming one or changing what it means is a
 * breaking change for every caller, so the list is frozen with the model names.
 */
export type ToolOptionChoice = { value: string; label: string; note?: string };
export type ToolOption = { key: 'garment_type' | 'style' | 'room_type' | 'level' | 'look' | 'intensity'; label: string; help: string; default: string; choices: ToolOptionChoice[] };

export const GARMENT_TYPE_OPTION: ToolOption = {
  key: 'garment_type', label: 'What the garment covers', default: 'outfit',
  help: 'The reference photo is read as one garment, so say which part of the outfit it replaces.',
  choices: [
    { value: 'outfit', label: 'A whole outfit (top and bottom)' },
    { value: 'top', label: 'A top only', note: 'The trousers or skirt the person wears stay as they are.' },
    { value: 'bottom', label: 'Trousers or a skirt only', note: 'The top stays as it is.' },
    { value: 'dress', label: 'A dress or one-piece' },
  ],
};

export const INTERIOR_STYLE_OPTION: ToolOption = {
  key: 'style', label: 'Style', default: 'nordic',
  help: 'Each style is a fixed recipe of materials, furniture and lighting — not a free-text thought.',
  choices: [
    { value: 'nordic', label: 'Nordic / Scandinavian', note: 'Light oak, warm white walls, linen and bouclé, woven rug, black metal lamps, plants.' },
    { value: 'cream', label: 'Cream / warm minimal', note: 'Off-white walls, beige stone floor, curved cream furniture, travertine, sheer curtains.' },
    { value: 'japandi', label: 'Japandi (Japanese-Nordic)' },
    { value: 'chinese', label: 'Modern Chinese' },
    { value: 'industrial', label: 'Industrial loft' },
    { value: 'french', label: 'French / classic' },
  ],
};

export const ROOM_TYPE_OPTION: ToolOption = {
  key: 'room_type', label: 'Room', default: 'living_room',
  help: 'Furniture is chosen for this room, so a bedroom never comes back as a living room.',
  choices: [
    { value: 'living_room', label: 'Living room' },
    { value: 'bedroom', label: 'Bedroom' },
    { value: 'dining_room', label: 'Dining room' },
    { value: 'study', label: 'Study / home office' },
    { value: 'kitchen', label: 'Kitchen' },
    { value: 'bathroom', label: 'Bathroom' },
    { value: 'kids_room', label: "Children's room" },
    { value: 'balcony', label: 'Balcony / sunroom' },
  ],
};

export const RETOUCH_LEVEL_OPTION: ToolOption = {
  key: 'level', label: 'Level of retouching', default: 'natural',
  help: 'Every level keeps the person’s identity, face shape, expression and clothing untouched.',
  choices: [
    { value: 'light', label: 'Light', note: 'Only obvious temporary blemishes and slight unevenness.' },
    { value: 'natural', label: 'Natural (recommended)', note: 'Even skin tone and texture, brighter eyes, tidier stray hairs — skin grain kept.' },
    { value: 'strong', label: 'Magazine', note: 'Thorough skin refinement, stronger eyes and clarity; natural skin grain is still kept.' },
  ],
};

export const MAKEUP_LOOK_OPTION: ToolOption = {
  key: 'look', label: 'Makeup look', default: 'daily',
  help: 'Each look is a fixed recipe: base, contour, brows, eyeshadow, liner, lashes and lip.',
  choices: [
    { value: 'daily', label: 'Soft everyday', note: 'Matched foundation, light contour, neutral brown eyeshadow, rose-nude lip.' },
    { value: 'korean', label: 'Korean dewy', note: 'Luminous glow base, peach blush, fine brown wing, gradient coral lip.' },
    { value: 'glam', label: 'Full glam evening', note: 'Matte base, strong contour, smoky brown eye, winged liner, matte red lip.' },
    { value: 'bridal', label: 'Bridal', note: 'Luminous long-wear base, champagne and rose-gold shimmer, soft rose lip.' },
    { value: 'latte', label: 'Warm latte', note: 'Semi-matte base, terracotta blush, espresso-brown eye, brick or mocha lip.' },
    { value: 'retro', label: 'Retro', note: 'Matte base, arched brows, black wing, bold vintage red lip.' },
  ],
};

export const MAKEUP_INTENSITY_OPTION: ToolOption = {
  key: 'intensity', label: 'Intensity', default: 'medium',
  help: 'How much makeup is visibly applied — the face, expression and lighting stay the same.',
  choices: [
    { value: 'light', label: 'Subtle' },
    { value: 'medium', label: 'Clearly visible (recommended)' },
    { value: 'strong', label: 'Editorial' },
  ],
};

/** The options a tool offers, in the order the panel shows them. Tools without options get none. */
export const TOOL_OPTIONS: Partial<Record<ToolId, ToolOption[]>> = {
  tryon: [GARMENT_TYPE_OPTION],
  interior: [INTERIOR_STYLE_OPTION, ROOM_TYPE_OPTION],
  retouch: [RETOUCH_LEVEL_OPTION],
  makeup: [MAKEUP_LOOK_OPTION, MAKEUP_INTENSITY_OPTION],
};

/** The first option value a caller got wrong, as a sentence; '' when the body is acceptable. */
export function toolOptionError(tool: ToolId, options: Record<string, unknown> | undefined): string {
  const specs = TOOL_OPTIONS[tool] || [];
  if (!specs.length) return '';
  for (const spec of specs) {
    const value = options?.[spec.key];
    if (value === undefined || value === '') continue;
    if (typeof value !== 'string' || !spec.choices.some(choice => choice.value === value)) {
      return `${spec.key} must be ${spec.choices.map(choice => choice.value).join(', ')}`;
    }
  }
  const unknown = Object.keys(options || {}).filter(key => !specs.some(spec => spec.key === key));
  return unknown.length ? `unknown option: ${unknown[0]}` : '';
}

/**
 * Interior only: a free-text brief that is pasted into the server-side prompt, which is why it is
 * capped — a long paragraph would start to override the parts of the prompt that hold the room's
 * walls, windows and camera in place. The provider caps it again on its side.
 */
export const TOOL_EXTRA_MAX = 120;
export const TOOL_EXTRA_FIELD: Partial<Record<ToolId, { label: string; help: string; placeholder: string }>> = {
  interior: {
    label: 'Anything else you want in the room (optional)',
    help: `Up to ${TOOL_EXTRA_MAX} characters. It is added to the fixed brief, which keeps the walls, windows and camera angle identical.`,
    placeholder: 'light oak flooring, a linen sofa, a floor lamp and green plants',
  },
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
  /** A-line tools only: the chosen value for each of that tool's named options. */
  options?: Record<string, string>;
  /** Interior only: the short free-text brief folded into the server-side prompt. */
  extra?: string;
};

/** Kept inside the range the service accepts (256–2048) so a bad value never reaches the provider. */
export const clampVectorizeEdge = (value: unknown): number => {
  const edge = Number(value);
  if (!Number.isSafeInteger(edge)) return VECTORIZE_MAX_EDGE.default;
  return Math.min(VECTORIZE_MAX_EDGE.max, Math.max(VECTORIZE_MAX_EDGE.min, edge));
};

/** A tool's chosen option, falling back to the documented default when the caller sent nothing. */
const optionValue = (tool: ToolId, key: ToolOption['key'], input: ToolTaskInput): string => {
  const spec = (TOOL_OPTIONS[tool] || []).find(candidate => candidate.key === key);
  if (!spec) throw new Error(`unknown option ${key} for ${tool}`);
  const value = input.options?.[key];
  return typeof value === 'string' && spec.choices.some(choice => choice.value === value) ? value : spec.default;
};

/**
 * The provider body for one tool task. Built on the server only — the browser never talks to the
 * provider, so a client cannot invent fields the model would reject, and the A-line tools cannot
 * replace the prompt the way an editor could.
 */
export function buildToolTask(tool: ToolId, input: ToolTaskInput) {
  const task: {
    model: ProviderModel; image_ids: string[]; prompt?: string; num_inference_steps?: number; seed?: number;
    preset?: VectorizePreset; max_edge?: number;
    garment_type?: string; style?: string; room_type?: string; level?: string; look?: string; intensity?: string;
    extra?: string;
  } = {
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
  if (tool === 'tryon') task.garment_type = optionValue(tool, 'garment_type', input);
  if (tool === 'interior') {
    task.style = optionValue(tool, 'style', input);
    task.room_type = optionValue(tool, 'room_type', input);
    const extra = (input.extra || '').trim();
    if (extra) task.extra = extra.slice(0, TOOL_EXTRA_MAX);
  }
  if (tool === 'retouch') task.level = optionValue(tool, 'level', input);
  if (tool === 'makeup') {
    task.look = optionValue(tool, 'look', input);
    task.intensity = optionValue(tool, 'intensity', input);
  }
  return task;
}

/** What the studio shows before submitting, per tool. */
export const TOOL_SUMMARY: Record<ToolId, { label: string; short: string; output: string; seconds: string; audience?: string }> = {
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
  tryon: {
    label: 'Virtual try-on',
    short: 'Try on',
    output: 'Output: shaped like your person photo (about 768 × 1024) · PNG',
    seconds: GENERATIVE_SECONDS_NOTE,
    audience: '2 images — the person, then the garment',
  },
  interior: {
    label: 'Room render',
    short: 'Render room',
    output: 'Output: shaped like your room photo (about 1152 × 768) · PNG',
    seconds: GENERATIVE_SECONDS_NOTE,
    audience: '1–2 images — the room, then an optional style reference',
  },
  retouch: {
    label: 'Portrait retouch',
    short: 'Retouch',
    output: 'Output: shaped like your portrait · PNG',
    seconds: GENERATIVE_SECONDS_NOTE,
    audience: '1 portrait',
  },
  makeup: {
    label: 'Virtual makeup',
    short: 'Apply makeup',
    output: 'Output: shaped like your portrait · PNG',
    seconds: GENERATIVE_SECONDS_NOTE,
    audience: '1–2 images — the portrait, then an optional makeup reference',
  },
};
