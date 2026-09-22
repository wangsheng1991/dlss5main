/**
 * The studio's C-line tools and the exact provider contract each one accepts.
 *
 * The two tools own their output geometry, so a size or format field must never be sent:
 * `cutout-fast` keeps the input resolution and always answers PNG, `erase-quality` answers a fixed
 * 1024 px square. The gateway refuses those fields with 422 rather than ignoring them, so a mistake
 * here surfaces as a failed task instead of a silently different image.
 */
export const CUTOUT_MODEL = 'cutout-fast';
export const ERASE_MODEL = 'erase-quality';

export const ERASE_OUTPUT_EDGE = 1024;
/** The erase model re-renders the whole frame, which takes about a minute on the shared GPU. */
export const ERASE_SECONDS_NOTE = 'about a minute';

export const STEPS_RANGE = { min: 4, max: 20, default: 8 } as const;

export type ToolId = 'cutout' | 'erase';
export const TOOL_IDS: readonly ToolId[] = ['cutout', 'erase'];
export const isToolId = (value: unknown): value is ToolId => value === 'cutout' || value === 'erase';

/** Named once so the server can reject anything else coming from a browser. */
export const PROVIDER_MODELS = ['flux-klein', CUTOUT_MODEL, ERASE_MODEL] as const;
export type ProviderModel = (typeof PROVIDER_MODELS)[number];
export const isProviderModel = (value: unknown): value is ProviderModel =>
  typeof value === 'string' && (PROVIDER_MODELS as readonly string[]).includes(value);

/** Which provider model a tool runs on. */
export const modelForTool = (tool: ToolId): ProviderModel => (tool === 'cutout' ? CUTOUT_MODEL : ERASE_MODEL);

/** Whether the caller has to describe what should go. */
export const toolNeedsPrompt = (tool: ToolId) => tool === 'erase';

export const clampSteps = (value: unknown): number => {
  const steps = Number(value);
  if (!Number.isSafeInteger(steps)) return STEPS_RANGE.default;
  return Math.min(STEPS_RANGE.max, Math.max(STEPS_RANGE.min, steps));
};

export type ToolTaskInput = { imageIds: string[]; prompt?: string; steps?: number; seed?: number };

/**
 * The provider body for one tool task. Built on the server only — the browser never talks to the
 * provider, so a client cannot invent fields the model would reject.
 */
export function buildToolTask(tool: ToolId, input: ToolTaskInput) {
  const task: { model: ProviderModel; image_ids: string[]; prompt?: string; num_inference_steps?: number; seed?: number } = {
    model: modelForTool(tool),
    image_ids: input.imageIds,
  };
  if (tool === 'erase') {
    task.prompt = (input.prompt || '').trim();
    task.num_inference_steps = clampSteps(input.steps);
    if (Number.isSafeInteger(input.seed)) task.seed = input.seed;
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
  erase: {
    label: 'Erase object',
    short: 'Erase',
    output: `Output: ${ERASE_OUTPUT_EDGE} × ${ERASE_OUTPUT_EDGE} · PNG`,
    seconds: ERASE_SECONDS_NOTE,
  },
};
