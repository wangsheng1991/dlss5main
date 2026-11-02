import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { test } from './harness';
import { CHARACTER_STYLE_PRESETS, characterStyleCatalog } from '../src/config/characterStyle';
import { preserveOutput } from '../src/config/enhance';

test('desktop style catalog distinguishes the shipped enhancement client from planned style conversion', () => {
  const catalog = characterStyleCatalog();
  assert.equal(catalog.desktopStatus, 'planned');
  assert.equal(catalog.publishedWindowsCapability, 'batch-image-enhancement');
  assert.equal(catalog.requiresLocalRtx, false);
  assert.equal(catalog.requiresWsl, false);
  // A UI workflow name is not an accepted jobs mode.
  assert.equal(catalog.workflow, 'game-character-style');
  assert.equal(catalog.api.submit.mode, 'edit');
});

test('desktop style catalog supplies usable web prompts and a real fixed guest source', () => {
  const catalog = characterStyleCatalog();
  assert.deepEqual(CHARACTER_STYLE_PRESETS.map(item => item.id), ['cyberpunk', 'fantasy', 'sci-fi', 'anime', 'realistic']);
  for (const preset of catalog.presets) {
    assert.ok(preset.prompt.length > 20 && preset.prompt.length < 4000);
    assert.ok(preset.label && preset.labelZh);
  }
  assert.ok(existsSync(`public${catalog.guestExample.inputPath}`));
  assert.deepEqual(catalog.guestExample.body, { sample: 'characterStyle' });
  assert.equal(catalog.guestExample.fixedExampleOnly, true);
});

test('desktop style output contract describes the actual editor rather than enhancement scaling', () => {
  const catalog = characterStyleCatalog();
  for (const [width, height] of [[1440, 778], [4096, 2160], [640, 960]]) {
    const output = preserveOutput(width, height);
    assert.ok(Math.max(output.width, output.height) <= catalog.output.maxEdge);
    assert.equal(output.width % catalog.output.dimensionMultiple, 0);
    assert.equal(output.height % catalog.output.dimensionMultiple, 0);
  }
  assert.deepEqual(preserveOutput(640, 960), { width: 640, height: 960 });
});
