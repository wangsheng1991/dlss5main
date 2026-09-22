/**
 * A test runner in thirty lines, because this project has no test framework and cannot install one
 * (the npm registry is unreachable from this machine). It asserts through `node:assert`, which is
 * already there, and it is registered by `tests/run.ts`.
 */

export type Case = { name: string; fn: () => void | Promise<void> };

const cases: Case[] = [];

export function test(name: string, fn: () => void | Promise<void>): void {
  cases.push({ name, fn });
}

/** Runs everything that was registered, in order, and returns the number of failures. */
export async function runAll(): Promise<number> {
  let failures = 0;
  for (const testCase of cases) {
    try {
      await testCase.fn();
      console.log(`✓ ${testCase.name}`);
    } catch (error) {
      failures += 1;
      const message = error instanceof Error ? error.message.split('\n').join('\n    ') : String(error);
      const where = error instanceof Error
        ? (error.stack ?? '').split('\n').find((line) => line.includes('/tests/') && !line.includes('harness'))
        : undefined;
      console.error(`✗ ${testCase.name}\n    ${message}${where ? `\n    ${where.trim()}` : ''}`);
    }
  }
  console.log(`\n${cases.length - failures}/${cases.length} passed`);
  return failures;
}
