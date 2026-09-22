/**
 * `npm test` — the offline suite. `npm run test:online` adds the pass that re-fetches the pages
 * behind the specification table.
 *
 * Importing `spec.test` registers its cases as a side effect; `runAll` then executes them in the
 * order they were registered and exits non-zero on the first failure the summary counts.
 */

import { runAll } from './harness';
import './spec.test';

process.exitCode = (await runAll()) === 0 ? 0 : 1;
