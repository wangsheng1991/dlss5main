/**
 * Publishes the machine-readable catalog next to the built site.
 *
 * `src/config/apiCatalog.ts` is the only description of what a third party may call, and three things
 * are rendered from it: the React page at `/docs`, the static HTML the prerender step writes for that
 * route, and these JSON files. A generated file cannot be out of date with the page it mirrors, which
 * is the whole reason the catalog lives in one module — the page it replaced advertised a host and a
 * model that were never served.
 *
 * Runs after `vite build` (which empties `dist/`) and before the prerender step, so the files sit in
 * `dist/` exactly as Vercel serves them: static files win over the `/(.*)` rewrite, so
 * `/api-catalog.json` and `/api-catalog/<id>.json` are fetched as files, not as the SPA shell.
 */

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import {
  API_CATALOG_JSON, CATALOG, apiCatalogDocument, apiModelDocument, apiModelJson,
} from '../src/config/apiCatalog';

const DIST = resolve(process.cwd(), 'dist');

function writeJson(route: string, value: unknown): void {
  const target = resolve(DIST, route.replace(/^\//, ''));
  mkdirSync(dirname(target), { recursive: true });
  // A trailing newline, so `curl` output and a plain `cat` both end cleanly.
  writeFileSync(target, `${JSON.stringify(value, null, 2)}\n`);
}

writeJson(API_CATALOG_JSON, apiCatalogDocument());
for (const model of CATALOG) writeJson(apiModelJson(model.id), apiModelDocument(model));

console.log(`Exported ${API_CATALOG_JSON} and ${CATALOG.length} per-model files (${CATALOG.map(model => model.id).join(', ')}).`);
