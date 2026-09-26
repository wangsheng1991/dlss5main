import type { ToolId, VectorizePreset } from './tools';

/**
 * The printable example inputs. Guests may generate these without an account, so both the
 * dashboard and the server read the same catalog: the prompt and the file are fixed here.
 *
 * `tool` selects a C-line capability (background removal, object erasing) instead of the editing
 * model: the provider body then follows that tool's contract rather than the editing one.
 *
 * The character-style example is deliberately in this catalog as well: it uses the same cached,
 * account-free run as the simpler examples, so the flagship workflow has a usable first click.
 * The eraser re-renders the whole frame and needs about a minute, which is longer than a serverless
 * request may run, so its page shows a finished pair and the live run stays behind sign-in.
 */
export const SAMPLES = {
  sample1: { id: 'sample1', name: 'Kitchen render', nameZh: '厨房效果图', src: '/examples/sample1.jpg', fileName: 'sample1.jpg', contentType: 'image/jpeg', tool: null, prompt: 'Make it look like a real photo of this kitchen, keeping the layout identical.' },
  sample2: { id: 'sample2', name: 'Bedroom render', nameZh: '卧室效果图', src: '/examples/sample2.jpg', fileName: 'sample2.jpg', contentType: 'image/jpeg', tool: null, prompt: 'Turn this render into a photorealistic photo with soft morning light.' },
  characterStyle: { id: 'characterStyle', name: 'Cyberpunk character style', nameZh: '赛博朋克人物风格', src: '/examples/generated/game-cyber-1-before.jpg', fileName: 'game-cyber-1-before.jpg', contentType: 'image/jpeg', tool: null, prompt: 'Original game character, preserve silhouette and costume; cyberpunk cinematic lighting, wet pavement, neon reflections, no text.' },
  teapot: {
    id: 'teapot', name: 'Red teapot', nameZh: '红色茶壶', src: '/examples/cutout-teapot.jpg', fileName: 'cutout-teapot.jpg', contentType: 'image/jpeg',
    tool: 'cutout' as ToolId,
    prompt: 'Remove the background and keep the teapot on transparency.',
  },
  spoon: {
    id: 'spoon', name: 'Cup and spoon', nameZh: '杯子和勺子', src: '/examples/erase-spoon.jpg', fileName: 'erase-spoon.jpg', contentType: 'image/jpeg',
    tool: 'erase' as ToolId,
    prompt: 'Remove the spoon from the table and rebuild the wooden surface behind it; keep the mug, the napkin and the lighting exactly as they are.',
  },
  badge: {
    id: 'badge', name: 'Coffee badge', nameZh: '咖啡徽章', src: '/examples/vectorize-badge.png', fileName: 'vectorize-badge.png', contentType: 'image/png',
    tool: 'vectorize' as ToolId,
    preset: 'logo' as VectorizePreset,
    prompt: 'Trace the badge into a clean vector SVG.',
  },
} as const;

export type SampleId = keyof typeof SAMPLES;
export const SAMPLE_IDS = Object.keys(SAMPLES) as SampleId[];
export const isSampleId = (value: unknown): value is SampleId => typeof value === 'string' && value in SAMPLES;
/** The examples a visitor may run without an account. */
export const GUEST_SAMPLE_IDS = SAMPLE_IDS.filter(id => SAMPLES[id].tool !== 'erase');
/** Bump when example output geometry or prompts change so Firestore does not serve stale comparisons. */
export const SAMPLE_CACHE_VERSION = 'geometry-v2';
