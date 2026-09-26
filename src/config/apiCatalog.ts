/**
 * The public API catalog: everything an integrator needs, in one place, in one language.
 *
 * This module is the **only** description of what a third party may call. The page at `/docs`, the
 * static HTML the crawler gets, and the machine-readable `/api-catalog.json` (plus one file per
 * model) are all rendered from it, so the three can never disagree — which they did before: the old
 * `/docs` page advertised `api.monolith.ai/v1/upscale` and a model called `ada-5.0`, neither of which
 * has ever existed.
 *
 * The rules that keep it honest:
 *
 * - **Names are frozen.** A model id in `CATALOG` is billing-visible. Renaming one is a breaking
 *   change: add a new id and mark the old one deprecated in the account registry instead.
 * - **A number is a measurement or it is not there.** `latency` quotes a date and says whether it is
 *   the whole request or only the inference inside it. Nothing here is estimated from a sibling
 *   model.
 * - **The submit examples are the requests that were actually sent.** `body` is the exact wire body
 *   of a verified call (`scripts/` and the verification notes in
 *   `docs/alphanet/tool-factory-a-face.md` record the runs); a field that is not in `params` has no
 *   business in an example, and a field in `refuses` must never appear in one.
 * - **`refuses` is not a style note.** The gateway answers 4xx instead of ignoring those fields, and
 *   the reason is on the page: a caller that thinks it asked for 1024 px or for its own prompt would
 *   otherwise ship a silently different result.
 *
 * The account registry in the service repository (`integrations/alphanet/registry.yaml`) stays the
 * operational ledger — which worker serves a model, on which card, seen by whom. This file is the
 * caller-facing view of the same facts; when they disagree, the registry wins and this file is wrong.
 */

export const CATALOG_VERSION = '2026-09-26.1';
export const CATALOG_UPDATED = '2026-09-26';

/** Every call goes through the account gateway; it issues the key, meters the calls and bills. */
export const API_BASE_URL = 'https://dashboard.alphanetplus.com';
/** Where a key comes from. Same host: the key and the calls are one account. */
export const API_KEY_NOTE = 'Sign in to the gateway, open the project, and copy its API key. The same key lists its models at GET /v1/models.';
export const API_PRICE = '$0.01 per call';
export const API_MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
export const API_MAX_UPLOAD_MIB = 10;
/** Signed result URLs expire; re-read the result endpoint to get a fresh one. */
export const API_RESULT_TTL_SECONDS = 900;
/**
 * The output shapes the four productised models accept. Each name is a bucket with one pixel size
 * (the service's own table, 32-px multiples), so `aspect: "3:4"` is 768 × 1024 exactly — a caller
 * never guesses the geometry, and one that omits `aspect` gets the bucket closest to its first
 * reference instead of a square.
 */
export const ASPECT_SIZES: ReadonlyArray<{ value: string; size: string }> = [
  { value: '1:1', size: '1024 × 1024' },
  { value: '3:4', size: '768 × 1024' },
  { value: '4:3', size: '1024 × 768' },
  { value: '2:3', size: '768 × 1152' },
  { value: '3:2', size: '1152 × 768' },
  { value: '16:9', size: '1344 × 768' },
  { value: '9:16', size: '768 × 1344' },
];
/** Those buckets in one string, for the parameter tables. */
export const ASPECT_VALUES = ASPECT_SIZES.map(bucket => bucket.value).join(' | ');
/** Files served for machines, generated from this module by `scripts/export-api-catalog.ts`. */
export const API_CATALOG_JSON = '/api-catalog.json';
export const apiModelJson = (id: string): string => `/api-catalog/${id}.json`;

export type CatalogField = {
  name: string;
  type: 'string' | 'integer' | 'string[]';
  values?: string;
  default?: string;
  required?: boolean;
  note?: string;
};

export type CatalogModel = {
  id: string;
  label: string;
  /** One line: what a caller gets back. */
  summary: string;
  /** The control-plane capability name, so a support question names the same thing we do. */
  capability: string;
  inputs: { min: number; max: number; slots: string[] };
  params: CatalogField[];
  /** Rejected outright — sending one fails the call rather than being ignored. */
  refuses: string[];
  output: string;
  /** A measurement with its date; `~` marks an end-to-end time, otherwise it is inference only. */
  latency: string;
  limits: string[];
  /** The submit body of a verified call, with the file ids your uploads returned. */
  body: Record<string, unknown>;
  /** Where a reader can see the same tool run in the browser, when there is a page for it. */
  tryIt?: { label: string; path: string };
  /** Case ids in `showcase.ts` showing this model's real output. */
  cases?: string[];
  verified: string;
};

/** The four steps every model shares. Only the submit body changes between them. */
export const API_FLOW: Array<{ n: number; title: string; method: string; path: string; detail: string }> = [
  {
    n: 1,
    title: 'Open an upload ticket',
    method: 'POST',
    path: '/v1/flux/uploads',
    detail: 'One ticket per reference image. The response carries the URL to PUT the bytes to, the file id you submit, and the byte ceiling.',
  },
  {
    n: 2,
    title: 'Upload the bytes',
    method: 'PUT',
    path: '{upload_url}',
    detail: 'Send the file itself to the signed URL, with the headers from the ticket. Nothing else goes through our API: the bytes go straight to storage.',
  },
  {
    n: 3,
    title: 'Submit the task',
    method: 'POST',
    path: '/v1/tasks/alphanet-flux',
    detail: 'The model id and the file ids in order. Always send an Idempotency-Key: the same key and body return the same task, a different body under the same key is refused with 409.',
  },
  {
    n: 4,
    title: 'Poll, then fetch the result',
    method: 'GET',
    path: '/v1/tasks/{task_id}',
    detail: 'Poll until the status is terminal, then read /v1/tasks/{task_id}/result for the signed URLs and the sha256 of each artifact.',
  },
];

export const CATALOG: CatalogModel[] = [
  {
    id: 'flux-klein',
    label: 'Generative edit, upscale and restore',
    summary: 'The general-purpose editor: your prompt decides what happens, and the output is the size you ask for.',
    capability: 'generative_repaint',
    inputs: { min: 1, max: 4, slots: ['the image to edit'] },
    params: [
      { name: 'prompt', type: 'string', required: true, note: 'What should change. The only model here that reads your own words.' },
      { name: 'width', type: 'integer', default: '1024', note: 'Output width: a multiple of 16, at most 1536 px.' },
      { name: 'height', type: 'integer', default: '1024', note: 'Output height, under the same rules.' },
      { name: 'num_inference_steps', type: 'integer', default: '4', note: 'Four steps unless you ask for more; more steps refine detail and take longer.' },
      { name: 'seed', type: 'integer', note: 'Same seed and body reproduces the same render.' },
      { name: 'max_sequence_length', type: 'integer' },
      { name: 'output_format', type: 'string', values: 'png | webp' },
      { name: 'output_quality', type: 'integer' },
    ],
    refuses: [],
    output: 'PNG or WebP at the width and height you sent; 1–4 references may be combined.',
    latency: '~16 s end to end for a 1152 × 1536 render, 6.4 s of it inference (measured 2026-09-26); the rest is queueing and the result upload',
    limits: [
      'It is a generative re-render: faces and small text can shift. Review the result at 100% before publishing.',
      'It cannot add detail that was never captured with certainty — an upscale reconstructs plausible texture, not the original pixels.',
    ],
    body: {
      model: 'flux-klein',
      image_ids: ['<file_id>'],
      prompt: 'Restore realistic detail, texture and sharpness at 2x the size while keeping the composition identical. Do not add objects and do not change the framing.',
      width: 1152,
      height: 1536,
      num_inference_steps: 8,
      seed: 42,
      output_format: 'png',
    },
    tryIt: { label: 'Open the enhancer in the studio', path: '/image-upscaler' },
    verified: '2026-09-26 (public gateway)',
  },
  {
    id: 'pixrestore-s',
    label: 'Detail restore',
    summary: 'Renders a sharper, cleaner version of an image at its own size. No prompt, no knobs beyond steps.',
    capability: 'detail_restore',
    inputs: { min: 1, max: 1, slots: ['the image'] },
    params: [
      { name: 'num_inference_steps', type: 'integer', values: '1–4', default: '1', note: 'One pass is the service default, and on this model one pass measured better than four on 2026-09-17 — more steps is not more detail here.' },
      { name: 'seed', type: 'integer' },
    ],
    refuses: ['width', 'height', 'max_sequence_length', 'output_format', 'output_quality'],
    output: 'PNG at the input size.',
    latency: '~3.5 s for a 3131 × 1549 frame (measured 2026-09-17, end to end)',
    limits: [
      'The result is "clearer", not "faithful": detail is generated, so fine text and small patterns can change. It is not a lossless enlarger.',
      'It does not resize: send the size you want to keep, or upscale separately.',
    ],
    body: { model: 'pixrestore-s', image_ids: ['<file_id>'], num_inference_steps: 1, seed: 42 },
    verified: '2026-09-17 (public gateway, 8/8 with the idempotency pair)',
  },
  {
    id: 'cutout-fast',
    label: 'Background removal',
    summary: 'Cuts the subject out and answers a PNG with an alpha channel at the input size.',
    capability: 'tool_cutout',
    inputs: { min: 1, max: 1, slots: ['the photo'] },
    params: [
      { name: 'bg_color', type: 'string', note: 'Fill the removed background with a colour instead of leaving it transparent.' },
      { name: 'bg_model', type: 'string', note: 'Which matting model the service picks (isnet, birefnet or u2net family).' },
      { name: 'alpha_matting', type: 'string', note: 'Softer edges on hair and fur, at a little more time.' },
    ],
    refuses: ['width', 'height', 'max_sequence_length', 'output_format', 'output_quality'],
    output: 'PNG with transparency, at the input size — 768 × 1024 in, 768 × 1024 out.',
    latency: '~5 s end to end, 0.8 s of it inference (measured 2026-09-26)',
    limits: [
      'Fine hair, glass and motion blur keep some background; a see-through subject cannot be cut cleanly.',
      'The cut is the whole frame. There is no per-object selection: one subject per call.',
    ],
    body: { model: 'cutout-fast', image_ids: ['<file_id>'] },
    tryIt: { label: 'Remove a background in the studio', path: '/remove-background' },
    cases: ['cutout-teapot'],
    verified: '2026-09-26 (public gateway)',
  },
  {
    id: 'erase-quality',
    label: 'Generative erase',
    summary: 'Names what should go; the model removes it and rebuilds the surface underneath.',
    capability: 'tool_erase',
    inputs: { min: 1, max: 1, slots: ['the photo'] },
    params: [
      { name: 'prompt', type: 'string', required: true, note: 'The object or mark to remove.' },
      { name: 'num_inference_steps', type: 'integer', values: '4–20', default: '8' },
      { name: 'seed', type: 'integer' },
    ],
    refuses: ['width', 'height', 'max_sequence_length', 'output_format', 'output_quality'],
    output: 'PNG at a fixed 1024 × 1024, whatever the input size was.',
    latency: '~54 s end to end, 50 s of it inference (measured 2026-09-22)',
    limits: [
      'The whole frame is re-rendered at 1024², so a larger original comes back at that size and fine text elsewhere can drift.',
      'It removes what you name; it does not understand "remove the person but keep the shadow".',
    ],
    body: { model: 'erase-quality', image_ids: ['<file_id>'], prompt: 'Remove the spoon from the table and rebuild the wooden surface behind it; keep the mug, the napkin and the lighting exactly as they are.', num_inference_steps: 8, seed: 42 },
    tryIt: { label: 'Erase an object in the studio', path: '/erase-object' },
    cases: ['erase-spoon'],
    verified: '2026-09-22 (public gateway, 8/8)',
  },
  {
    id: 'vectorize-fast',
    label: 'Image to SVG',
    summary: 'Traces a bitmap into real vector paths and answers an SVG — so it scales to any size without blurring.',
    capability: 'tool_vectorize',
    inputs: { min: 1, max: 1, slots: ['the bitmap'] },
    params: [
      { name: 'preset', type: 'string', values: 'logo | illustration | photo', default: 'logo', note: 'A fixed parameter set on the service, not free text.' },
      { name: 'max_edge', type: 'integer', values: '256–2048', default: '1024', note: 'Long edge the trace runs at; larger input is downscaled to it.' },
      { name: 'colors', type: 'integer', values: '2–64' },
      { name: 'filter_speckle', type: 'integer', values: '0–32', note: 'Drops specks smaller than this many pixels.' },
    ],
    refuses: ['width', 'height', 'max_sequence_length', 'output_format', 'output_quality'],
    output: 'image/svg+xml. The SVG declares its own width and height, so the JSON result reports width/height as null.',
    latency: '~7 s end to end, 0.4 s of it tracing (measured 2026-09-22)',
    limits: [
      'A photograph comes back posterised: the photo preset limits the palette to 16 colours before tracing.',
      'The output is paths, not an embedded bitmap — expect a small file for a logo and a large one for a picture.',
    ],
    body: { model: 'vectorize-fast', image_ids: ['<file_id>'], preset: 'logo' },
    tryIt: { label: 'Convert an image in the studio', path: '/image-to-svg' },
    cases: ['vectorize-badge'],
    verified: '2026-09-22 (public gateway, 8/8)',
  },
  {
    id: 'tryon-quality',
    label: 'Virtual try-on',
    summary: 'Puts the garment from one photo onto the person in another. Two references, in order, and no prompt.',
    capability: 'tool_tryon',
    inputs: { min: 2, max: 2, slots: ['person', 'garment'] },
    params: [
      { name: 'garment_type', type: 'string', values: 'top | bottom | dress | outfit', default: 'top', note: 'Which part of the outfit the reference replaces. Omitted, the reference is read as a top.' },
      { name: 'aspect', type: 'string', values: ASPECT_VALUES, note: 'Optional. Omitted, the output follows the person photo’s shape — a 3:4 portrait comes back 768 × 1024.' },
      { name: 'seed', type: 'integer' },
    ],
    refuses: ['prompt', 'width', 'height', 'num_inference_steps', 'max_sequence_length', 'output_format', 'output_quality'],
    output: 'PNG shaped like the person photo (3:4 → 768 × 1024). Face, hair, pose, other clothing and background are asked to stay identical.',
    latency: '~69 s end to end, 59 s of it inference (measured 2026-09-26)',
    limits: [
      'One garment per call: the reference is read as a single piece, so a top and a bottom need two calls.',
      'The order of image_ids is the meaning — person first, garment second. Swapping them changes the result, not the error.',
      'Layered outfits, heavy shadows across the garment and unusual poses are the hard cases.',
    ],
    body: { model: 'tryon-quality', image_ids: ['<person_file_id>', '<garment_file_id>'], garment_type: 'top' },
    tryIt: { label: 'Try it on in the studio', path: '/virtual-try-on' },
    cases: ['tryon-top'],
    verified: '2026-09-26 (public gateway, re-measured); the 10/10 pass including the idempotency pair was 2026-09-25',
  },
  {
    id: 'interior-quality',
    label: 'Interior render',
    summary: 'Turns an empty or unfinished room into a furnished render in a named style, keeping the architecture where it is.',
    capability: 'tool_interior',
    inputs: { min: 1, max: 2, slots: ['room', 'style reference (optional)'] },
    params: [
      { name: 'style', type: 'string', values: 'nordic | cream | japandi | chinese | industrial | french', default: 'nordic', note: 'Each style is a fixed recipe of materials, furniture and lighting.' },
      { name: 'room_type', type: 'string', values: 'living_room | bedroom | dining_room | study | kitchen | bathroom | kids_room | balcony', default: 'living_room' },
      { name: 'extra', type: 'string', note: 'Up to 120 characters of extra brief, folded into the fixed instruction. Longer is refused: it would start to override the parts that hold the room in place.' },
      { name: 'aspect', type: 'string', values: ASPECT_VALUES, note: 'Optional. Omitted, the output follows the room photo’s shape — 3:2 comes back 1152 × 768.' },
      { name: 'seed', type: 'integer' },
    ],
    refuses: ['prompt', 'width', 'height', 'num_inference_steps', 'max_sequence_length', 'output_format', 'output_quality'],
    output: 'PNG shaped like the room photo (3:2 → 1152 × 768), with walls, windows, doors, ceiling line and camera angle held.',
    latency: '~59 s of inference (measured 2026-09-25)',
    limits: [
      'Start from the emptiest frame you have: a room that is already furnished comes back redesigned rather than built on.',
      'The second reference steers palette and materials only — it cannot add a wall or move a window.',
      'It is a visualisation, not a measured plan: sockets, floor coverings and furniture proportions can differ from the building.',
    ],
    body: { model: 'interior-quality', image_ids: ['<room_file_id>'], style: 'nordic', room_type: 'living_room', extra: 'light oak flooring, a linen sofa, a round wooden coffee table, a woven rug, a floor lamp and green plants' },
    tryIt: { label: 'Render a room in the studio', path: '/interior-design' },
    cases: ['interior-nordic', 'interior-japandi-ref'],
    verified: '2026-09-25 (public gateway, 8/8)',
  },
  {
    id: 'retouch-quality',
    label: 'Portrait retouch',
    summary: 'Cleans up a portrait — skin, under-eyes, eyes, stray hairs — without changing the face.',
    capability: 'tool_retouch',
    inputs: { min: 1, max: 1, slots: ['portrait'] },
    params: [
      { name: 'level', type: 'string', values: 'light | natural | strong', default: 'natural' },
      { name: 'aspect', type: 'string', values: ASPECT_VALUES, note: 'Optional. Omitted, the output follows the portrait’s shape (fallback 1:1).' },
      { name: 'seed', type: 'integer' },
    ],
    refuses: ['prompt', 'width', 'height', 'num_inference_steps', 'max_sequence_length', 'output_format', 'output_quality'],
    output: 'PNG shaped like the portrait, with skin grain kept.',
    latency: '~79 s end to end, 61 s of it inference (measured 2026-09-25)',
    limits: [
      'It will not slim a face, widen the eyes or change a hairstyle: that is the instruction, not a setting.',
      'It does not add makeup — that is the separate virtual-makeup model.',
      'A heavy filter look is refused on purpose; the result keeps visible texture.',
    ],
    body: { model: 'retouch-quality', image_ids: ['<portrait_file_id>'], level: 'natural' },
    tryIt: { label: 'Retouch a portrait in the studio', path: '/portrait-retouch' },
    cases: ['retouch-natural'],
    verified: '2026-09-25 (public gateway, 8/8)',
  },
  {
    id: 'makeup-quality',
    label: 'Virtual makeup',
    summary: 'Applies a named makeup look to a face, optionally matched from a reference photo.',
    capability: 'tool_makeup',
    inputs: { min: 1, max: 2, slots: ['portrait', 'makeup reference (optional)'] },
    params: [
      { name: 'look', type: 'string', values: 'daily | korean | glam | bridal | latte | retro', default: 'daily', note: 'A fixed recipe of base, contour, brows, eyeshadow, liner, lashes and lip.' },
      { name: 'intensity', type: 'string', values: 'light | medium | strong', default: 'medium' },
      { name: 'aspect', type: 'string', values: ASPECT_VALUES, note: 'Optional. Omitted, the output follows the portrait’s shape (fallback 1:1).' },
      { name: 'seed', type: 'integer' },
    ],
    refuses: ['prompt', 'width', 'height', 'num_inference_steps', 'max_sequence_length', 'output_format', 'output_quality'],
    output: 'PNG shaped like the portrait. Identity, expression, hair, clothing, framing and lighting are asked to stay as they are.',
    latency: '~62 s of inference (measured 2026-09-25)',
    limits: [
      'A look is a recipe, not a brand shade: use it to compare directions, not to promise an exact product.',
      'The palette is matched to this person’s undertone and the original lighting, so the same reference gives a different result on another photo.',
    ],
    body: { model: 'makeup-quality', image_ids: ['<portrait_file_id>'], look: 'korean', intensity: 'medium' },
    tryIt: { label: 'Try a look in the studio', path: '/virtual-makeup' },
    cases: ['makeup-korean', 'makeup-glam-ref'],
    verified: '2026-09-25 (public gateway, 8/8)',
  },
];

export const catalogModel = (id: string): CatalogModel | undefined => CATALOG.find(model => model.id === id);

/** The exact bodies a caller sends, with the placeholders of `body` spelled out for the page. */
const SUBMIT_EXAMPLE_RESPONSE = {
  created_at: 1790383942,
  id: 'task_pNrS6dLc9QsSF0JFrkK9zYGRE0WsUmJu',
  model: 'cutout-fast',
  status: 'queued',
  task_id: 'task_pNrS6dLc9QsSF0JFrkK9zYGRE0WsUmJu',
};

/** The result of the verified cutout call above, with the signed URL shortened. */
export const CATALOG_EXAMPLE = {
  ticket: {
    request: { model: 'cutout-fast', file_name: 'photo.png', content_type: 'image/png', size: 678166 },
    response: {
      expires_in: 900,
      file_id: '19802e22529248cfb7fa346f911a5108',
      headers: { 'Content-Type': 'image/png' },
      max_size_bytes: 10485760,
      method: 'PUT',
      upload_url: 'https://…r2…/sr-hub/uploads/19802e…',
    },
  },
  submit: { request: { model: 'cutout-fast', image_ids: ['19802e22529248cfb7fa346f911a5108'] }, response: SUBMIT_EXAMPLE_RESPONSE },
  status: { response: { created_at: 1790383942, fail_reason: '', finished_at: 1790383947, platform: 'alphanet-flux', progress: '100%', status: 'SUCCESS', task_id: 'task_pNrS6dLc9QsSF0JFrkK9zYGRE0WsUmJu' } },
  result: {
    response: {
      images: [{ content_type: 'image/png', file_size: 213812, height: 1024, sha256: 'b38e50f365430a4706c7c84547b938a95bae9d40bc123ccf9b08923f75781d78', url: 'https://…r2…/sr-hub/…png', width: 768 }],
      request_id: 'a4af25a616fa45ff95327e7787c64317',
      timings: { inference: 0.815, result_upload: 1.744, total: 1.811 },
      url_expires_in: 900,
      worker: 'toolfactory-orchestrator',
    },
  },
};

/** The document machines read — the same facts as the page, without the prose. */
export function apiCatalogDocument() {
  return {
    catalog_version: CATALOG_VERSION,
    updated: CATALOG_UPDATED,
    base_url: API_BASE_URL,
    auth: { header: 'Authorization: Bearer <project API key>', key_note: API_KEY_NOTE },
    price: API_PRICE,
    limits: {
      max_upload_bytes: API_MAX_UPLOAD_BYTES,
      references_per_call: { min: 1, max: 4 },
      result_url_ttl_seconds: API_RESULT_TTL_SECONDS,
    },
    /** The output buckets the four productised models accept, so a caller can pick one without the page. */
    aspects: ASPECT_SIZES.map(bucket => ({ value: bucket.value, size: bucket.size })),
    flow: API_FLOW.map(step => ({ step: step.n, method: step.method, path: step.path, title: step.title, detail: step.detail })),
    models: CATALOG.map(model => ({
      id: model.id,
      label: model.label,
      summary: model.summary,
      capability: model.capability,
      inputs: model.inputs,
      params: model.params,
      refuses: model.refuses,
      output: model.output,
      latency: model.latency,
      limits: model.limits,
      submit_body_example: model.body,
      price: API_PRICE,
      try_it: model.tryIt?.path ?? null,
      cases: model.cases ?? [],
      verified: model.verified,
    })),
  };
}

/** One model, in the same shape the catalog uses for all of them. */
export function apiModelDocument(model: CatalogModel) {
  const document = apiCatalogDocument();
  return {
    catalog_version: document.catalog_version,
    updated: document.updated,
    base_url: document.base_url,
    aspects: document.aspects,
    flow: document.flow,
    model: document.models.find(entry => entry.id === model.id),
  };
}
