import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { PODCAST_EPISODES } from '../src/content/podcast';
import { test } from './harness';

const publicFile = (name: string) => readFileSync(new URL(`../public/${name}`, import.meta.url), 'utf8');
const homepage = () => readFileSync(new URL('../index.html', import.meta.url), 'utf8');

test('the transcript-first podcast has stable episodes with crawlable evidence', () => {
  assert.equal(PODCAST_EPISODES.length, 5);
  assert.equal(new Set(PODCAST_EPISODES.map((episode) => episode.slug)).size, PODCAST_EPISODES.length);
  for (const episode of PODCAST_EPISODES) {
    assert.match(episode.slug, /^[a-z0-9-]+$/);
    assert.ok(episode.description.length > 80, `${episode.slug} needs a substantive description`);
    assert.ok(episode.transcript.length >= 5, `${episode.slug} needs a complete transcript`);
    assert.ok(episode.chapters.length >= 4, `${episode.slug} needs chapters`);
    assert.ok(episode.sources.length >= 2, `${episode.slug} needs source links`);
  }
});

test('podcast index and every episode are linked from the crawler files', () => {
  const sitemap = publicFile('sitemap.xml');
  const llms = publicFile('llms.txt');
  const html = homepage();
  assert.ok(sitemap.includes('<loc>https://www.dlss5nvidia.com/podcast</loc>'));
  assert.ok(llms.includes('https://www.dlss5nvidia.com/podcast'));
  assert.ok(html.includes('href="/podcast"'));
  for (const episode of PODCAST_EPISODES) {
    const url = `https://www.dlss5nvidia.com/podcast/${episode.slug}`;
    assert.ok(sitemap.includes(`<loc>${url}</loc>`), `${episode.slug} is missing from the sitemap`);
    assert.ok(llms.includes(url), `${episode.slug} is missing from llms.txt`);
  }
});
