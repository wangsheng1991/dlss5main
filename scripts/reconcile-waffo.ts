/** Read-only provider/Firestore reconciliation; never calls billing apply or mutation APIs. */
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { pathToFileURL } from 'node:url';
import dotenv from 'dotenv';
import { WaffoPancake } from '@waffo/pancake-ts';
import { database } from '../server/admin.js';
import { collectWaffoReconciliation } from '../server/waffo-reconciliation-collector.js';

type CliOptions = { environment: 'test' | 'prod'; storeId: string; orderIds: string[]; out: string; snapshotOut?: string; envFile?: string };
export function parseWaffoReconciliationArgs(args: string[]): CliOptions {
  const values: Record<string, string[]> = {};
  for (let index = 0; index < args.length; index++) {
    const option = args[index];
    if (!['--environment', '--store', '--order', '--out', '--snapshot-out', '--env-file'].includes(option) || !args[index + 1] || args[index + 1].startsWith('--')) throw new Error('Invalid or missing CLI option');
    (values[option] ??= []).push(args[++index]);
  }
  for (const [key, value] of Object.entries(values)) if (key !== '--order' && value.length !== 1) throw new Error('Duplicate CLI option');
  const environment = values['--environment']?.[0];
  const storeId = values['--store']?.[0]; const orderIds = values['--order']; const out = values['--out']?.[0];
  if ((environment !== 'test' && environment !== 'prod') || !storeId || !orderIds?.length || !out) throw new Error('Required options: --environment test|prod --store STO --order ORD [--order ORD] --out FILE');
  if (orderIds.some(id => id.includes('/'))) throw new Error('Invalid order id');
  const snapshotOut = values['--snapshot-out']?.[0];
  if (snapshotOut && resolve(snapshotOut) === resolve(out)) throw new Error('Report and snapshot output paths must differ');
  return { environment, storeId, orderIds: [...new Set(orderIds)], out, snapshotOut, envFile: values['--env-file']?.[0] };
}
export async function runWaffoReconciliationCli(args = process.argv.slice(2)): Promise<number> {
  const options = parseWaffoReconciliationArgs(args);
  // Existing process credentials always win. An explicit env file failure is fatal.
  const loaded = dotenv.config({ path: resolve(options.envFile ?? '.env.local'), override: false, quiet: true });
  if (options.envFile && loaded.error) throw new Error('Explicit environment file could not be read');
  const merchantId = process.env.WAFFO_MERCHANT_ID?.trim(); const privateKey = process.env.WAFFO_PRIVATE_KEY?.trim();
  if (!merchantId || !privateKey) throw new Error('WAFFO_MERCHANT_ID and WAFFO_PRIVATE_KEY are required');
  const client = new WaffoPancake({ merchantId, privateKey, fetch: (url, init) => fetch(url, { ...init, signal: AbortSignal.timeout(15000), redirect: 'error' }) });
  const result = await collectWaffoReconciliation({ graphql: client.graphql, db: database() }, { environment: options.environment, storeId: options.storeId, orderIds: options.orderIds });
  await mkdir(dirname(resolve(options.out)), { recursive: true });
  await writeFile(resolve(options.out), `${JSON.stringify(result.report, null, 2)}\n`, { mode: 0o600 });
  if (options.snapshotOut) {
    await mkdir(dirname(resolve(options.snapshotOut)), { recursive: true });
    await writeFile(resolve(options.snapshotOut), `${JSON.stringify(result.snapshot, null, 2)}\n`, { mode: 0o600 });
  }
  console.log(JSON.stringify({ status: result.report.status, complete: result.report.complete, counts: result.report.counts, issueCount: result.report.issues.length, out: resolve(options.out) }));
  return result.report.status === 'pass' ? 0 : result.report.status === 'issues' ? 1 : 2;
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  runWaffoReconciliationCli().then(code => { process.exitCode = code; }).catch(() => {
    // Provider errors may contain request/credential material: never print raw errors.
    console.error('Reconciliation could not start or write its report. Check required arguments, credential environment, database configuration and output paths.');
    process.exitCode = 2;
  });
}
