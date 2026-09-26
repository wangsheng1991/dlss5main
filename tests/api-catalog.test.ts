/**
 * Assertions for the public API catalog — the page at `/docs`, the JSON files a machine fetches, and
 * the requests a caller is told to send.
 *
 * The catalog is a promise to people who are not in this repository: if it names a field the gateway
 * rejects, or a default the service does not apply, the caller finds out by shipping a broken
 * integration. So these tests pin the catalog to the things that can be checked offline — the
 * studio's own tables (which encode what we send to the provider) and the frozen model ids — and they
 * fail loudly when the two drift apart.
 */

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import {
  API_CATALOG_JSON, API_FLOW, API_MAX_UPLOAD_BYTES, API_MAX_UPLOAD_MIB, API_RESULT_TTL_SECONDS,
  API_BASE_URL, ASPECT_SIZES, ASPECT_VALUES, CATALOG, CATALOG_UPDATED, CATALOG_VERSION,
  apiCatalogDocument, apiModelDocument, apiModelJson, catalogModel,
} from '../src/config/apiCatalog';
import {
  MAX_UPLOAD_BYTES, MAX_UPLOAD_MIB, PROVIDER_MODELS, STEPS_RANGE, TOOL_OPTIONS, TOOL_REFERENCES,
  VECTORIZE_MAX_EDGE, VECTORIZE_PRESETS, modelForTool, type ToolId,
} from '../src/config/tools';
import { SHOWCASE } from '../src/config/showcase';
import { TOOL_LANDINGS } from '../src/content/toolLandings';

import { test } from './harness';

/** The model ids the gateway answers `GET /v1/models` with, in the order it lists them. */
const GATEWAY_MODELS = [
  'cutout-fast', 'erase-quality', 'flux-klein', 'interior-quality', 'makeup-quality',
  'pixrestore-s', 'retouch-quality', 'tryon-quality', 'vectorize-fast',
];

/** The tool the catalog points a reader at, for each of the four productised models. */
const A_LINE: Array<{ tool: ToolId; model: string }> = [
  { tool: 'tryon', model: 'tryon-quality' },
  { tool: 'interior', model: 'interior-quality' },
  { tool: 'retouch', model: 'retouch-quality' },
  { tool: 'makeup', model: 'makeup-quality' },
];

const param = (id: string, name: string) => {
  const model = catalogModel(id);
  assert.ok(model, `${id} is missing from the catalog`);
  const found = model.params.find(candidate => candidate.name === name);
  assert.ok(found, `${id} does not document ${name}`);
  return found;
};

const values = (id: string, name: string) =>
  (param(id, name).values || '').split('|').map(value => value.trim()).filter(Boolean).sort();

test('the catalog names exactly the models the gateway serves, and none besides', () => {
  // Renaming one of these is a breaking change for every caller, so the list is frozen here on
  // purpose: a new id may be added, an existing one may not be quietly renamed.
  assert.deepEqual(CATALOG.map(model => model.id).slice().sort(), GATEWAY_MODELS);
  assert.equal(new Set(CATALOG.map(model => model.id)).size, CATALOG.length, 'an id is listed twice');
  // Eight of the nine are models the studio itself submits; `pixrestore-s` is the one the gateway
  // exposes without the studio calling it, and it must stay the only such case.
  const studioModels = new Set<string>(PROVIDER_MODELS);
  const extra = CATALOG.map(model => model.id).filter(id => !studioModels.has(id));
  assert.deepEqual(extra, ['pixrestore-s'], 'the catalog and the studio disagree about which models exist');
});

test('every model id, label, summary and measurement is present and dated', () => {
  assert.match(CATALOG_VERSION, /^\d{4}-\d{2}-\d{2}\.\d+$/, 'the catalog version is a date plus a revision');
  assert.match(CATALOG_UPDATED, /^\d{4}-\d{2}-\d{2}$/);
  for (const model of CATALOG) {
    for (const field of [model.label, model.summary, model.output, model.latency, model.verified, model.capability]) {
      assert.ok(field.trim().length > 0, `${model.id} leaves a required field empty`);
    }
    // A latency without a date is an estimate, and this page does not publish estimates.
    assert.match(model.latency, /\d{4}-\d{2}-\d{2}/, `${model.id}: the measured time carries no date`);
    assert.ok(model.limits.length > 0, `${model.id} claims no limit at all, which is not believable`);
    assert.ok(model.params.length > 0, `${model.id} documents no parameters`);
  }
});

test('a model never both accepts and refuses the same field', () => {
  for (const model of CATALOG) {
    const names = model.params.map(entry => entry.name);
    assert.equal(new Set(names).size, names.length, `${model.id} documents a parameter twice`);
    for (const refused of model.refuses) {
      assert.ok(!names.includes(refused), `${model.id} both takes and refuses ${refused}`);
      assert.notEqual(refused, 'model', `${model.id} refuses the model field itself`);
      assert.notEqual(refused, 'image_ids', `${model.id} refuses image_ids, which every call needs`);
    }
    // `image_ids` and `model` are not parameters — they are the shape of every submit body.
    assert.ok(!names.includes('model') && !names.includes('image_ids'), `${model.id} lists a submit field as a parameter`);
  }
});

/** A field counts as present when it is set and, for text, not blank. */
const keyIn = (body: Record<string, unknown>, key: string) => {
  const value = body[key];
  return typeof value === 'string' ? value.trim().length > 0 : value !== undefined && value !== null;
};

test('the example body is a request the model actually accepts', () => {
  for (const model of CATALOG) {
    const body = model.body;
    const allowed = new Set(['model', 'image_ids', ...model.params.map(entry => entry.name)]);
    assert.equal(body.model, model.id, `${model.id}: the example submits a different model`);
    for (const key of Object.keys(body)) {
      assert.ok(allowed.has(key), `${model.id}: the example sends ${key}, which it does not document`);
      assert.ok(!model.refuses.includes(key), `${model.id}: the example sends ${key}, which the gateway refuses`);
    }
    const ids = body.image_ids;
    assert.ok(Array.isArray(ids), `${model.id}: the example has no image_ids`);
    assert.ok(ids.length >= model.inputs.min && ids.length <= model.inputs.max,
      `${model.id}: the example sends ${ids.length} references, outside ${model.inputs.min}–${model.inputs.max}`);
    // Required parameters have to appear in the example, or a caller copies a body that fails.
    for (const entry of model.params.filter(candidate => candidate.required)) {
      assert.ok(keyIn(body, entry.name), `${model.id}: the example omits the required ${entry.name}`);
    }
  }
});

test('the studio and the catalog describe the same references', () => {
  for (const { tool, model } of A_LINE) {
    assert.equal(modelForTool(tool), model, `${tool} runs on another model than the catalog says`);
    const expected = TOOL_REFERENCES[tool];
    const documented = catalogModel(model)!.inputs;
    assert.equal(documented.min, expected.min, `${model}: minimum references differ`);
    assert.equal(documented.max, expected.max, `${model}: maximum references differ`);
    assert.deepEqual(documented.slots, expected.slots, `${model}: the slots, and their order, differ`);
  }
});

test('the named options on the four productised models are the studio vocabulary, verbatim', () => {
  for (const { tool, model } of A_LINE) {
    for (const option of TOOL_OPTIONS[tool] || []) {
      const documented = values(model, option.key);
      assert.deepEqual(documented, option.choices.map(choice => choice.value).sort(),
        `${model}.${option.key}: the public values and the studio's choices differ`);
      // The documented default is what the *service* applies when the field is omitted, which is not
      // always what the studio pre-selects — so it must be one of the values, not equal to the
      // studio's default. (They differ once today: the studio offers "outfit" first, the service
      // reads an omitted garment_type as "top".)
      assert.ok(documented.includes(param(model, option.key).default || ''),
        `${model}.${option.key}: the documented default is not one of its values`);
    }
  }
});

test('the vectorizer and eraser ranges match the studio clamps', () => {
  assert.deepEqual(values('vectorize-fast', 'preset'), [...VECTORIZE_PRESETS].sort());
  assert.equal(param('vectorize-fast', 'max_edge').values, `${VECTORIZE_MAX_EDGE.min}–${VECTORIZE_MAX_EDGE.max}`);
  assert.equal(param('vectorize-fast', 'max_edge').default, String(VECTORIZE_MAX_EDGE.default));
  assert.equal(param('erase-quality', 'num_inference_steps').values, `${STEPS_RANGE.min}–${STEPS_RANGE.max}`);
  assert.equal(param('erase-quality', 'num_inference_steps').default, String(STEPS_RANGE.default));
  assert.equal(param('pixrestore-s', 'num_inference_steps').default, '1');
});

test('a prompt is required exactly where the model reads one', () => {
  const readsAPrompt = new Set(['flux-klein', 'erase-quality']);
  for (const model of CATALOG) {
    const prompt = model.params.find(entry => entry.name === 'prompt');
    if (readsAPrompt.has(model.id)) {
      assert.ok(prompt?.required, `${model.id} reads a prompt but does not require one`);
      assert.ok(!model.refuses.includes('prompt'), `${model.id} requires a prompt and refuses it`);
    } else {
      assert.ok(model.refuses.includes('prompt') || prompt === undefined,
        `${model.id} does not read a prompt, so it must refuse one rather than accept it`);
    }
  }
});

test('the four productised models take the same aspect buckets', () => {
  const expected = ASPECT_SIZES.map(bucket => bucket.value).sort();
  assert.deepEqual(ASPECT_VALUES.split(' | ').sort(), expected);
  for (const { model } of A_LINE) {
    assert.deepEqual(values(model, 'aspect'), expected, `${model}: the aspect buckets differ from the published table`);
  }
  // Every bucket is a real pixel size, so a caller can predict the geometry rather than guess it.
  for (const bucket of ASPECT_SIZES) assert.match(bucket.size, /^\d+ × \d+$/);
});

test('the published limits and endpoints are the ones every client shares', () => {
  assert.equal(API_MAX_UPLOAD_BYTES, MAX_UPLOAD_BYTES, 'the catalog and the studio use different upload ceilings');
  assert.equal(API_MAX_UPLOAD_MIB, MAX_UPLOAD_MIB);
  assert.equal(API_RESULT_TTL_SECONDS, 900);
  assert.match(API_BASE_URL, /^https:\/\//, 'calls have to go to the gateway over TLS');
  assert.equal(API_CATALOG_JSON, '/api-catalog.json');
  assert.equal(apiModelJson('flux-klein'), '/api-catalog/flux-klein.json');
  const document = apiCatalogDocument();
  assert.equal(document.limits.max_upload_bytes, MAX_UPLOAD_BYTES);
  assert.equal(document.limits.result_url_ttl_seconds, API_RESULT_TTL_SECONDS);
  assert.equal(document.models.length, CATALOG.length);
  assert.equal(document.aspects.length, ASPECT_SIZES.length);
  // The four steps are the whole integration surface; dropping or reusing one breaks every client.
  assert.deepEqual(API_FLOW.map(step => step.n), [1, 2, 3, 4]);
  assert.deepEqual(API_FLOW.map(step => step.method), ['POST', 'PUT', 'POST', 'GET']);
  assert.equal(new Set(API_FLOW.map(step => step.path)).size, API_FLOW.length);
});

test('the JSON documents survive serialization with nothing lost', () => {
  // `undefined` disappears in JSON: a field that is present in the object but absent from the file
  // would make the page and the machine copy differ, which is the failure this catalog exists to stop.
  for (const model of CATALOG) {
    const document = apiModelDocument(model);
    assert.deepEqual(JSON.parse(JSON.stringify(document)), document, `${model.id}: the model file loses a field`);
    assert.equal(document.model?.id, model.id);
    assert.equal(document.flow.length, API_FLOW.length, `${model.id}: the per-model file omits the flow`);
    assert.ok(document.model?.submit_body_example, `${model.id}: the model file carries no example body`);
    // A key that is documented but `null` in the file is a lie of omission; be explicit instead.
    for (const [key, value] of Object.entries(document.model || {})) {
      assert.notEqual(value, undefined, `${model.id}.${key} is undefined`);
    }
  }
  assert.deepEqual(JSON.parse(JSON.stringify(apiCatalogDocument())), apiCatalogDocument());
});

test('every page the catalog links to exists, and every case it cites is published', () => {
  const toolPaths = new Set(TOOL_LANDINGS.map(landing => landing.path));
  const caseIds = new Set(SHOWCASE.map(entry => entry.id));
  for (const model of CATALOG) {
    if (model.tryIt) {
      assert.ok(toolPaths.has(model.tryIt.path), `${model.id} points at ${model.tryIt.path}, which is not a tool page`);
      assert.ok(model.tryIt.label.trim().length > 0);
    }
    for (const id of model.cases || []) {
      const entry = SHOWCASE.find(candidate => candidate.id === id);
      assert.ok(entry, `${model.id} cites the case ${id}, which is not in the case book`);
      // The page shows the case's picture, so the file it names has to be in `public/`.
      assert.ok(readFileSync(new URL(`../public${entry!.output.src}`, import.meta.url)).byteLength > 0,
        `${model.id}: the case ${id} points at a missing file`);
    }
  }
});
