/**
 * One-off backfill: tops up every account registered inside the welcome-back window.
 *
 * The write mirrors `JobStore.grantBonus` in server/job-store.ts — the credits go into the
 * `bonusCredits` bucket (which the monthly rollover never clears) and a ledger document keyed by
 * `sha256(uid:promoId)` makes a re-run a no-op instead of a second payout.
 *
 * Usage: node scripts/grant-welcome-back.mjs            # dry run, writes nothing
 *        node scripts/grant-welcome-back.mjs --apply    # grants
 */
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';

const REPO = new URL('..', import.meta.url).pathname.replace(/\/$/, '');
const require = createRequire(`${REPO}/package.json`);
const admin = require('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');

// Keep in sync with WELCOME_BACK in src/config/promos.ts.
const PROMO = { id: 'welcome-back-2026-09', credits: 5, registeredFrom: '2026-07-18T00:00:00.000Z', registeredTo: '2026-09-17T23:59:59.999Z' };
const apply = process.argv.includes('--apply');

const env = readFileSync(`${REPO}/.env.local`, 'utf8');
const value = (key) => { const match = env.match(new RegExp(`^${key}=(?:'([\\s\\S]*)'|([^\\n]*))$`, 'm')); return (match && (match[1] ?? match[2]) || '').trim().replace(/^['"]|['"]$/g, ''); };
const app = admin.initializeApp({ credential: admin.credential.cert(JSON.parse(value('FIREBASE_SERVICE_ACCOUNT_JSON'))) });
const db = getFirestore(app, value('FIREBASE_DATABASE_ID'));
const hash = (input) => createHash('sha256').update(input).digest('hex');

const snapshot = await db.collection('users').get();
const eligible = snapshot.docs.filter((doc) => {
  const data = doc.data();
  if (String(data.email || '').includes('example.invalid')) return false;
  const createdAt = data.createdAt || '';
  return createdAt >= PROMO.registeredFrom && createdAt <= PROMO.registeredTo;
});
console.log(`promo ${PROMO.id}: ${PROMO.credits} credits, window ${PROMO.registeredFrom} → ${PROMO.registeredTo}`);
console.log(`profiles: ${snapshot.size} total, ${eligible.length} inside the window ${apply ? '(applying)' : '(dry run)'}`);

let granted = 0, skipped = 0;
for (const doc of eligible) {
  const uid = doc.id;
  const ledger = db.doc(`credit_ledger/${hash(`${uid}:${PROMO.id}`)}`);
  const outcome = await db.runTransaction(async (tx) => {
    const [user, entry] = await Promise.all([tx.get(doc.ref), tx.get(ledger)]);
    if (entry.exists) return 'already';
    const account = user.data() || {};
    tx.update(doc.ref, { bonusCredits: (Number(account.bonusCredits) || 0) + PROMO.credits });
    tx.create(ledger, { uid, kind: 'promo', promo: PROMO.id, units: PROMO.credits, backfill: true, createdAt: Date.now() });
    return 'granted';
  }).catch((error) => `error: ${String(error).slice(0, 80)}`);
  if (outcome === 'granted') granted += 1; else skipped += 1;
  if (outcome !== 'granted') console.log(`  skipped ${uid.slice(0, 10)}… (${outcome})`);
}
console.log(`${apply ? 'granted' : 'would grant'}: ${granted}, skipped: ${skipped}`);
