#!/usr/bin/env node
/**
 * Submit the URLs in the built sitemap to IndexNow-compatible engines.
 *
 * This is deliberately an explicit post-build command. A local build must not notify search
 * engines, and IndexNow does not submit to Google (Google remains on the Search Console sitemap
 * path). The public key file is not a secret; it proves that this host authorized the submission.
 */
import { readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const args = new Set(process.argv.slice(2));
const valueFor = (name, fallback) => {
  const prefix = `${name}=`;
  const item = process.argv.slice(2).find(value => value.startsWith(prefix));
  return item ? item.slice(prefix.length) : fallback;
};

const sitemapPath = resolve(root, valueFor('--sitemap', 'dist/sitemap.xml'));
const sitemapUrl = valueFor('--sitemap-url', process.env.INDEXNOW_SITEMAP_URL || 'https://www.dlss5nvidia.com/sitemap.xml');
const host = valueFor('--host', process.env.INDEXNOW_HOST || new URL(sitemapUrl).host);
const dryRun = args.has('--dry-run');
const keyFromEnv = process.env.INDEXNOW_KEY?.trim();
const keyFile = readdirSync(resolve(root, 'public'))
  .filter(file => /^[A-Za-z0-9-]{8,128}\.txt$/.test(file))
  .map(file => resolve(root, 'public', file))
  .find(file => {
    const name = file.split('/').pop().replace(/\.txt$/, '');
    try { return readFileSync(file, 'utf8').trim() === name; } catch { return false; }
  });
const key = keyFromEnv || (keyFile ? readFileSync(keyFile, 'utf8').trim() : '');

if (!key) throw new Error('No IndexNow key found. Set INDEXNOW_KEY or add public/<key>.txt.');
const xml = readFileSync(sitemapPath, 'utf8');
const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1].trim()).filter(Boolean);
const uniqueUrls = [...new Set(urls)];
if (uniqueUrls.length === 0) throw new Error(`No URLs found in ${sitemapPath}`);
if (uniqueUrls.length > 10_000) throw new Error(`IndexNow accepts at most 10,000 URLs per request; found ${uniqueUrls.length}`);

const payload = {
  host,
  key,
  keyLocation: `https://${host}/${key}.txt`,
  urlList: uniqueUrls,
};
if (dryRun) {
  console.log(JSON.stringify({ endpoint: 'https://api.indexnow.org/indexnow', host, urls: uniqueUrls.length, keyLocation: payload.keyLocation }, null, 2));
  process.exit(0);
}

let lastError;
for (let attempt = 1; attempt <= 3; attempt += 1) {
  try {
    const response = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'content-type': 'application/json; charset=utf-8' },
      body: JSON.stringify(payload),
    });
    const body = await response.text();
    if (!response.ok) throw new Error(`HTTP ${response.status}: ${body.slice(0, 400)}`);
    console.log(`IndexNow accepted ${uniqueUrls.length} URLs for ${host} (HTTP ${response.status}).`);
    process.exit(0);
  } catch (error) {
    lastError = error;
    if (attempt < 3) await new Promise(resolveDelay => setTimeout(resolveDelay, attempt * 1000));
  }
}
throw lastError;
