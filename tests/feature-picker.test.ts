import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { test } from './harness';
import FeaturePicker from '../src/components/FeaturePicker';
import { ARTICLES } from '../src/content/articles/types';
import { FEATURES, SOURCES, FEATURE_PICKER_MARKER, FEATURE_PICKER_SLUG, featureVerdict, type Feature, type Gpu, type Game } from '../src/content/featurePicker';

test('feature picker: every out-of-scope GPU or game remains unknown for every feature', () => {
  for (const feature of Object.keys(FEATURES) as Feature[]) {
    for (const gpu of ['50', '40', '30', 'earlier', 'unknown'] as Gpu[]) {
      for (const game of ['yes', 'no', 'unknown'] as Game[]) {
        const v = featureVerdict(feature, gpu, game);
        if (['earlier', 'unknown'].includes(gpu) || game !== 'yes') assert.equal(v.status, 'unknown');
        assert.ok(SOURCES[v.source].url.startsWith('https://'));
      }
    }
  }
});
test('feature picker: known support is limited to the sourced local game/hardware combinations', () => {
  assert.equal(featureVerdict('nr', '50', 'yes').status, 'supported');
  assert.equal(featureVerdict('nr', '40', 'yes').status, 'unknown');
  assert.equal(featureVerdict('mfg', '40', 'yes').status, 'unsupported');
  assert.equal(featureVerdict('fg', '30', 'yes').status, 'unsupported');
  assert.equal(featureVerdict('fg', '40', 'yes').status, 'unknown');
  assert.equal(featureVerdict('rr', '50', 'yes').status, 'unknown');
  assert.equal(featureVerdict('fsr', '50', 'yes').status, 'unknown');
});
test('feature picker: both editions keep a source-linked static table without interactive controls', () => {
  const article = ARTICLES.find(a => a.slug === FEATURE_PICKER_SLUG)!;
  for (const [locale, text] of [['en', article.content_en], ['zh', article.content_cn]] as const) {
    assert.equal(text.split(FEATURE_PICKER_MARKER).length, 2);
    for (const source of Object.values(SOURCES)) assert.ok(text.includes(source.url), 'must reuse an existing article source');
    const html = renderToStaticMarkup(createElement(FeaturePicker, { locale, interactive: false }));
    assert.ok(html.includes('<table'));
    assert.ok(html.includes('NBA 2K27'));
    assert.ok(html.includes('2026-10-23'));
    assert.ok(!html.includes('<select'));
    for (const source of Object.values(SOURCES)) assert.ok(html.includes(source.url));
    assert.ok(!/\bFPS\b|\d+[×x]|官方效果|NVIDIA 认证/.test(html));
  }
  for (const a of ARTICLES.filter(a => a.slug !== FEATURE_PICKER_SLUG)) assert.ok(!a.content_en.includes(FEATURE_PICKER_MARKER) && !a.content_cn.includes(FEATURE_PICKER_MARKER));
});
