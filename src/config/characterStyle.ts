import { GAME_STYLE_CASES } from '../content/gameStyleCases';
import { ENHANCE_MAX_EDGE } from './enhance';
import { MAX_UPLOAD_BYTES, STUDIO_MAX_PIXELS } from './tools';
import { SAMPLES, sampleResultUrl } from './samples';

/** The web picker and the desktop integration catalog share these published prompts. */
export const CHARACTER_STYLE_PRESETS = [
  { id: 'cyberpunk', label: 'Cyberpunk neon', labelZh: '赛博朋克霓虹', prompt: GAME_STYLE_CASES[0].prompt },
  { id: 'fantasy', label: 'Grounded fantasy', labelZh: '写实奇幻', prompt: GAME_STYLE_CASES[1].prompt },
  { id: 'sci-fi', label: 'Hard-surface sci-fi', labelZh: '硬表面科幻', prompt: GAME_STYLE_CASES[2].prompt },
  { id: 'anime', label: 'Anime cel shading', labelZh: '动漫赛璐璐', prompt: GAME_STYLE_CASES[9].prompt },
  { id: 'realistic', label: 'Realistic cinematic', labelZh: '电影写实', prompt: GAME_STYLE_CASES[14].prompt },
] as const;
export type CharacterStylePreset = (typeof CHARACTER_STYLE_PRESETS)[number]['id'];

export const CHARACTER_STYLE_CATALOG_PATH = '/desktop/character-style-v1.json';
export const CHARACTER_STYLE_SPEC_URL = 'https://github.com/wangsheng1991/dlss5-enhancer-cli/blob/master/docs/WINDOWS-CHARACTER-STYLE-20261102.md';

/** Static integration data, not a new API or a claim that a desktop build has shipped. */
export function characterStyleCatalog() {
  return {
    schemaVersion: 1,
    revision: '2026-11-02',
    workflow: 'game-character-style',
    desktopStatus: 'planned',
    publishedWindowsVersion: '0.1.1',
    publishedWindowsCapability: 'batch-image-enhancement',
    execution: 'cloud',
    requiresLocalRtx: false,
    requiresWsl: false,
    specificationUrl: CHARACTER_STYLE_SPEC_URL,
    presets: CHARACTER_STYLE_PRESETS,
    input: { contentTypes: ['image/jpeg', 'image/png', 'image/webp'], maxBytes: MAX_UPLOAD_BYTES, maxPixels: STUDIO_MAX_PIXELS, minDimension: 16, maxDimension: 8192 },
    output: { maxEdge: ENHANCE_MAX_EDGE, dimensionMultiple: 16, formats: ['webp', 'png', 'jpeg'], defaultFormat: 'webp', geometry: 'preserveOutput' },
    api: {
      baseUrl: 'https://www.dlss5nvidia.com',
      auth: 'Bearer user ID token',
      bootstrap: { method: 'POST', path: '/api/me/bootstrap' },
      upload: { method: 'POST', path: '/api/image-edit/upload', model: 'flux-klein' },
      submit: { method: 'POST', path: '/api/image-edit/jobs', mode: 'edit', idempotencyHeader: 'Idempotency-Key' },
      status: { method: 'GET', pathTemplate: '/api/image-edit/jobs/{jobId}' },
      result: { method: 'GET', pathTemplate: '/api/image-edit/results/{jobId}' },
    },
    guestExample: {
      sample: 'characterStyle', inputPath: SAMPLES.characterStyle.src,
      method: 'POST', path: '/api/image-edit/samples', body: { sample: 'characterStyle' },
      resultPath: sampleResultUrl('characterStyle'),
      fixedExampleOnly: true,
    },
    billing: { ownImagesRequireAccount: true, reservedCreditsPerJob: 1, authority: 'server', refreshAccountAfterSettlement: true },
    limitations: ['Style references, not an in-game DLSS runtime.', 'Identity, costume and pose preservation require visual review; they are not guaranteed.', 'Free examples are fixed cached examples, not new processing of user uploads.'],
  };
}
