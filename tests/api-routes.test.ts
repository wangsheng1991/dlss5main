/**
 * The `/api` surface carries a budget that a green build does not otherwise notice, and it has
 * already cost one production deploy: a Hobby deployment may hold at most twelve serverless
 * functions, so an area with several routes has to be a single function dispatching on a `[route]`
 * segment (see `api/billing/[route].ts` and `api/me/[route].ts`).
 *
 * Two things are pinned down here: the budget, and the promise that every path the client fetches
 * still resolves to a function — directly, or through one of the rewrites in `vercel.json` that
 * names a bracket file.
 */

import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

import type { VercelRequest, VercelResponse } from '@vercel/node';

import meRoutes from '../api/me/[route]';
import studioRequest from '../api/studio/request';

import { test } from './harness';

const API_DIR = 'api';
const MAX_FUNCTIONS = 12;

/** Every file under `api/`, minus the `_`-prefixed ones, which are helpers rather than functions. */
function functionFiles(dir = API_DIR): string[] {
  const found: string[] = [];
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) {
      if (!entry.startsWith('_')) found.push(...functionFiles(path));
      continue;
    }
    if (/\.(ts|js)$/.test(entry) && !entry.startsWith('_')) found.push(path);
  }
  return found;
}

/** The paths the client actually fetches, with any `${…}` interpolation replaced by a segment. */
function clientPaths(dir = 'src'): string[] {
  const paths = new Set<string>();
  const walk = (folder: string) => {
    for (const entry of readdirSync(folder)) {
      const path = join(folder, entry);
      if (statSync(path).isDirectory()) {
        walk(path);
        continue;
      }
      if (!/\.tsx?$/.test(entry)) continue;
      const source = readFileSync(path, 'utf8');
      for (const match of source.matchAll(/['"`](\/api\/[A-Za-z0-9/_${}().-]+)/g)) {
        paths.add(match[1].replace(/\$\{[^}]*\}/g, 'x'));
      }
    }
  };
  walk(dir);
  return [...paths].sort();
}

const rewrites = (): Array<{ source: string; destination: string }> =>
  JSON.parse(readFileSync('vercel.json', 'utf8')).rewrites as Array<{ source: string; destination: string }>;

/** Turns a rewrite source into the pattern it matches, `:param*` included. */
const pattern = (source: string): RegExp =>
  new RegExp(`^${source.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/:[A-Za-z0-9_]+\*/g, '.+').replace(/:[A-Za-z0-9_]+/g, '[^/]+')}$`);

test(`a deployment holds no more than ${MAX_FUNCTIONS} serverless functions`, () => {
  const files = functionFiles();
  assert.ok(
    files.length <= MAX_FUNCTIONS,
    `${files.length} functions under ${API_DIR}/, the limit is ${MAX_FUNCTIONS}:\n${files.sort().join('\n')}`,
  );
});

test('every api path the client fetches resolves to a function', () => {
  const files = new Set(functionFiles());
  const routes = rewrites();
  for (const path of clientPaths()) {
    if (files.has(path.replace(/^\//, '') + '.ts')) continue;
    const rewrite = routes.find((rule) => pattern(rule.source).test(path));
    assert.ok(rewrite, `nothing serves ${path}`);
    assert.ok(!/^https?:/.test(rewrite.destination), `${path} is proxied elsewhere`);
    assert.ok(
      files.has(rewrite.destination.replace(/^\//, '') + '.ts'),
      `${path} rewrites to ${rewrite.destination}, which is not a function`,
    );
  }
});

/** A handler with no session must refuse before it reads a body or touches a database. */
const call = async (handler: unknown, req: Partial<VercelRequest>): Promise<{ status: number; body: unknown }> => {
  const answer = { status: 0, body: undefined as unknown };
  const res = {
    status(code: number) {
      answer.status = code;
      return this;
    },
    json(value: unknown) {
      answer.body = value;
      return this;
    },
  };
  await (handler as (req: VercelRequest, res: VercelResponse) => Promise<unknown>)(
    req as VercelRequest,
    res as unknown as VercelResponse,
  );
  return answer;
};

test('every account route is reachable through the one function, and refuses a stranger', async () => {
  for (const route of ['bootstrap', 'checkin', 'share']) {
    const answer = await call(meRoutes, { method: 'POST', headers: {}, query: { route }, body: {} });
    assert.equal(answer.status, 401, `${route} answered ${answer.status}`);
  }
  const unknown = await call(meRoutes, { method: 'POST', headers: {}, query: { route: 'reset-password' } });
  assert.equal(unknown.status, 404);
});

test('a download request without a session is refused too', async () => {
  const answer = await call(studioRequest, { method: 'POST', headers: {}, body: { note: 'hello' } });
  assert.equal(answer.status, 401);
  const wrongMethod = await call(studioRequest, { method: 'GET', headers: {}, query: {} });
  assert.equal(wrongMethod.status, 405);
});
