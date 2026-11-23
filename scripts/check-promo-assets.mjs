/**
 * `npm run assets:check` — the promo-asset gate.
 *
 * Every picture in a marketing folder is a claim. This gate only enforces the mechanical part of it:
 * the file exists, its real pixel size matches what the manifest says, every source it names exists
 * under `public/`, and the licence is one we are allowed to publish. It cannot tell whether a caption
 * describes the picture — that stays a human check, which is why the manifest carries a `text` field
 * and the renderer never touches pixels.
 */
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const folder = process.argv[2] ?? 'public/marketing/gta6-20261123';
const allowed = new Set(['own', 'CC0', 'PD', 'CC-BY']);
const manifestPath = resolve(folder, 'manifest.json');

if (!existsSync(manifestPath)) {
  console.error(`ASSETS: FAIL — no manifest at ${manifestPath}`);
  process.exit(1);
}

const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));

/** Reads the IHDR chunk rather than trusting a header the manifest wrote. */
/** @param {string} path */
function pngSize(path) {
  const bytes = readFileSync(path);
  if (bytes.readUInt32BE(0) !== 0x89504e47) throw new Error('not a PNG');
  return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
}

/** @type {string[]} */
const failures = [];
/** @type {Map<string, number>} */
const kinds = new Map();
for (const asset of manifest.assets) {
  const path = resolve(folder, asset.file);
  if (!existsSync(path)) { failures.push(`${asset.file}: missing`); continue; }
  let size;
  try { size = pngSize(path); } catch (error) { failures.push(`${asset.file}: ${String(error)}`); continue; }
  if (size.width !== asset.width || size.height !== asset.height) {
    failures.push(`${asset.file}: manifest says ${asset.width}×${asset.height}, file is ${size.width}×${size.height}`);
  }
  if (!asset.sources?.length) failures.push(`${asset.file}: no source recorded`);
  for (const source of asset.sources ?? []) {
    if (!existsSync(resolve('public', source))) failures.push(`${asset.file}: source public/${source} does not exist`);
  }
  if (!allowed.has(asset.license)) failures.push(`${asset.file}: licence "${asset.license}" is not publishable`);
  if (!asset.text?.trim()) failures.push(`${asset.file}: no text recorded`);
  kinds.set(asset.kind, (kinds.get(asset.kind) ?? 0) + 1);
}

if (failures.length) {
  console.error(`ASSETS: FAIL — ${failures.length} problem(s)\n${failures.join('\n')}`);
  process.exit(1);
}

const summary = [...kinds].map(([kind, count]) => `${kind} ${count}`).join(' · ');
console.log(`ASSETS: PASS — ${manifest.assets.length} files, ${summary}`);
