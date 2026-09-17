/**
 * Tells the welcome-back recipients that their credits are in.
 *
 * No mail provider is configured yet, so this script is a no-op that prints what it would send
 * unless RESEND_API_KEY is present in the environment (per-agent vault secret, never in this file).
 *
 * Usage: node scripts/notify-welcome-back.mjs            # dry run: prints the first messages
 *        node scripts/notify-welcome-back.mjs --apply    # sends through Resend
 */
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';

const REPO = new URL('..', import.meta.url).pathname.replace(/\/$/, '');
const require = createRequire(`${REPO}/package.json`);
const admin = require('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');

// Keep in sync with WELCOME_BACK in src/config/promos.ts.
const PROMO = { id: 'welcome-back-2026-09', credits: 5 };
const SITE = 'https://www.dlss5nvidia.com';
const FROM = 'DLSS 5 Image Studio <hello@dlss5nvidia.com>';
const apply = process.argv.includes('--apply');
const apiKey = process.env.RESEND_API_KEY || '';

const env = readFileSync(`${REPO}/.env.local`, 'utf8');
const value = (key) => { const match = env.match(new RegExp(`^${key}=(?:'([\\s\\S]*)'|([^\\n]*))$`, 'm')); return (match && (match[1] ?? match[2]) || '').trim().replace(/^['"]|['"]$/g, ''); };
const app = admin.initializeApp({ credential: admin.credential.cert(JSON.parse(value('FIREBASE_SERVICE_ACCOUNT_JSON'))) });
const db = getFirestore(app, value('FIREBASE_DATABASE_ID'));

const subject = `${PROMO.credits} free credits added to your account`;
const body = [
  `Hi,`,
  ``,
  `Thanks for trying the AI Image Studio early. We just added ${PROMO.credits} free credits to your account — they are already in your balance:`,
  `${SITE}/dashboard`,
  ``,
  `Use them to edit a photo with a prompt or to enhance one to a larger size. Sharing a post about us on Reddit or social media earns 30 more from inside the app.`,
  ``,
  `You are getting this because you signed up at ${SITE}. Reply "stop" and we will not mail you again.`,
].join('\n');

const snapshot = await db.collection('users').get();
const recipients = [];
for (const doc of snapshot.docs) {
  const data = doc.data();
  const email = String(data.email || '');
  if (!email || email.includes('example.invalid')) continue;
  const granted = await db.doc(`credit_ledger/${createHash('sha256').update(`${doc.id}:${PROMO.id}`).digest('hex')}`).get();
  if (granted.exists) recipients.push({ uid: doc.id, email });
}
console.log(`recipients with the ${PROMO.id} grant: ${recipients.length}`);
console.log(`subject: ${subject}\n---\n${body}\n---`);

if (!apiKey) {
  console.log('RESEND_API_KEY is not set, so nothing was sent. Add a mail provider key to the vault and re-run with --apply.');
  process.exit(0);
}
if (!apply) {
  console.log('dry run: add --apply to send through Resend.');
  process.exit(0);
}

let sent = 0, failed = 0;
for (const recipient of recipients) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: FROM, to: recipient.email, subject, text: body }),
  });
  if (response.ok) { sent += 1; await db.doc(`mail_log/${recipient.uid}_${PROMO.id}`).set({ uid: recipient.uid, promo: PROMO.id, to: recipient.email, sentAt: Date.now() }); }
  else { failed += 1; console.log(`failed for ${recipient.uid.slice(0, 8)}…: ${response.status} ${(await response.text()).slice(0, 120)}`); }
  await new Promise((resolve) => setTimeout(resolve, 250));
}
console.log(`sent: ${sent}, failed: ${failed}`);
