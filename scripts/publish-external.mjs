#!/usr/bin/env node
/**
 * Preview or publish one Bluesky post or one DEV/Forem article.
 *
 * Preview is the default. External writes require both --publish and
 * ALLOW_EXTERNAL_PUBLISH=1. Keep identifiers and app passwords in the shell
 * environment; never commit them to the repository.
 */
import { appendFile, mkdir, readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const argv = process.argv.slice(2);
const valueFor = (name) => {
  const index = argv.indexOf(name);
  return index >= 0 ? argv[index + 1] : undefined;
};
const has = (name) => argv.includes(name);
const platform = valueFor('--platform');
const contentPath = valueFor('--content');
const publish = has('--publish');
const campaign = valueFor('--campaign') || 'external_links_20261008';

const usage = () => {
  console.log(`Usage:\n  node scripts/publish-external.mjs --platform bluesky --content docs/marketing/external-posts/bluesky-comparisons-en.txt\n  node scripts/publish-external.mjs --platform devto --content docs/marketing/external-posts/devto-ai-image-tools-comparison.md\n\nAdd --publish only after reviewing the preview. Real writes also require ALLOW_EXTERNAL_PUBLISH=1.`);
};

if (!platform || !contentPath || !['bluesky', 'devto'].includes(platform)) {
  usage();
  process.exit(2);
}

const absoluteContentPath = resolve(process.cwd(), contentPath);
const content = await readFile(absoluteContentPath, 'utf8');
const fail = (message) => { console.error(`Error: ${message}`); process.exit(1); };
const json = async (url, options = {}) => {
  const response = await fetch(url, { ...options, headers: { 'content-type': 'application/json', ...(options.headers || {}) } });
  const text = await response.text();
  let body;
  try { body = JSON.parse(text); } catch { body = text; }
  if (!response.ok) fail(`${response.status} ${response.statusText}: ${typeof body === 'string' ? body : JSON.stringify(body)}`);
  return body;
};
const requirePublish = () => {
  if (!publish) return false;
  if (process.env.ALLOW_EXTERNAL_PUBLISH !== '1') fail('publishing is locked; set ALLOW_EXTERNAL_PUBLISH=1 together with --publish');
  return true;
};
const preview = (payload) => {
  console.log(JSON.stringify({ mode: publish ? 'publish-requested' : 'dry-run', platform, campaign, payload }, null, 2));
};
const logPublish = async (entry) => {
  const logPath = resolve(process.cwd(), 'docs/marketing/external-posts/publish-log.jsonl');
  await mkdir(dirname(logPath), { recursive: true });
  await appendFile(logPath, `${JSON.stringify({ at: new Date().toISOString(), campaign, ...entry })}\n`, 'utf8');
};

if (platform === 'bluesky') {
  const text = content.trim();
  const length = [...text].length;
  if (!text) fail('Bluesky content is empty');
  if (length > 300) fail(`Bluesky content is ${length} Unicode code points; keep it at or below 300`);
  const payload = { text, length };
  preview(payload);
  if (!requirePublish()) process.exit(0);
  const identifier = process.env.BLUESKY_IDENTIFIER;
  const password = process.env.BLUESKY_APP_PASSWORD;
  if (!identifier || !password) fail('set BLUESKY_IDENTIFIER and BLUESKY_APP_PASSWORD');
  const service = process.env.BLUESKY_SERVICE || 'https://bsky.social';
  const session = await json(`${service}/xrpc/com.atproto.server.createSession`, { method: 'POST', body: JSON.stringify({ identifier, password }) });
  const record = { $type: 'app.bsky.feed.post', text, createdAt: new Date().toISOString() };
  const pds = session.didDoc?.service?.find((item) => item.id === '#atproto_pds')?.serviceEndpoint || service;
  const result = await json(`${pds}/xrpc/com.atproto.repo.createRecord`, {
    method: 'POST',
    headers: { authorization: `Bearer ${session.accessJwt}` },
    body: JSON.stringify({ repo: session.did, collection: 'app.bsky.feed.post', record }),
  });
  await logPublish({ platform, uri: result.uri, cid: result.cid, content: text });
  console.log(JSON.stringify({ published: true, uri: result.uri, cid: result.cid }, null, 2));
}

if (platform === 'devto') {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) fail('DEV article needs YAML-like front matter between --- markers');
  const front = Object.fromEntries(match[1].split('\n').map((line) => {
    const separator = line.indexOf(':');
    return separator < 0 ? [line.trim(), ''] : [line.slice(0, separator).trim(), line.slice(separator + 1).trim()];
  }));
  const bodyMarkdown = match[2].trim();
  const tags = (front.tags || '').split(',').map((tag) => tag.trim()).filter(Boolean).slice(0, 4);
  if (!front.title || !bodyMarkdown) fail('DEV article needs title and body');
  const article = { title: front.title, body_markdown: bodyMarkdown, published: publish, description: front.description || undefined, tags, main_image: front.main_image || undefined };
  preview({ article });
  if (!requirePublish()) process.exit(0);
  const apiKey = process.env.DEVTO_API_KEY;
  if (!apiKey) fail('set DEVTO_API_KEY');
  const result = await json('https://dev.to/api/articles', { method: 'POST', headers: { 'api-key': apiKey }, body: JSON.stringify({ article }) });
  await logPublish({ platform, id: result.id, url: result.url, title: result.title });
  console.log(JSON.stringify({ published: true, id: result.id, url: result.url }, null, 2));
}
