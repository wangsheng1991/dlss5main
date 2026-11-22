import { timingSafeEqual, randomUUID } from 'node:crypto';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { database } from '../../../server/admin.js';
import { runBillingMonitor, type BillingMail } from '../../../server/waffo-monitor.js';
import { waffo, waffoEnvironment, waffoStoreId } from '../../_lib/waffo.js';

export function monitorAuthorized(value: string, expected = process.env.BILLING_MONITOR_SECRET || '') {
  const a = Buffer.from(value), b = Buffer.from(`Bearer ${expected}`);
  return expected.length >= 32 && a.length === b.length && timingSafeEqual(a, b);
}
async function sendMail(mail: BillingMail) {
  const url = process.env.STUDIO_NOTIFY_WEBHOOK, secret = process.env.STUDIO_NOTIFY_SECRET;
  if (!url || !secret) throw new Error('Billing email is not configured');
  const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-studio-secret': secret }, body: JSON.stringify({ kind: 'billing-alert', ...mail }), signal: AbortSignal.timeout(15_000), redirect: 'error' });
  if (!response.ok || (await response.json() as { ok?: boolean }).ok !== true) throw new Error('Billing email was not accepted');
}
export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 'no-store');
  if (!monitorAuthorized(String(req.headers.authorization || ''))) return res.status(401).json({ error: 'Unauthorized' });
  if (req.method !== 'GET' && req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    if (req.method === 'POST' && req.body?.action === 'notification-test') {
      const id = `drill-${randomUUID()}`;
      await sendMail({ incidentId: id, subject: '[DLSS5 billing] TEST — alert delivery verification', text: `This is a synthetic alert-delivery test, NOT a customer payment failure.\nIncident: ${id}\nTime: ${new Date().toISOString()}\nNo payment, credit or subscription was modified.` });
      await database().doc(`billing_monitor_drills/${id}`).create({ at: Date.now(), kind: 'email-only', accepted: true });
      return res.status(200).json({ ok: true, id, accepted: true, note: 'Email service acceptance, not inbox delivery confirmation' });
    }
    if (req.method === 'POST' && req.body?.action === 'revenue-readonly') {
      // No card calls or mutations. Exhaust pagination before claiming a complete total.
      let complete = false; const counts: Record<string, number> = {}, byCurrency: Record<string, { succeededCount: number; chargedCents: number }> = {};
      const cents = (value: unknown) => {
        if (typeof value !== 'string' || !/^(0|[1-9]\d*)(?:\.\d{1,2})?$/.test(value)) return null;
        const [whole, fraction = ''] = value.split('.'); const n = BigInt(whole) * 100n + BigInt(fraction.padEnd(2, '0'));
        return n <= BigInt(Number.MAX_SAFE_INTEGER) ? Number(n) : null;
      };
      const client = waffo(); const seen = new Set<string>(); let unknownAmounts = 0;
      for (let page = 0; page < 20; page++) {
        const result = await client.graphql.query<{ payments: Array<{ id: string; status: string; testMode: boolean; pspAmountDetails: { amount: string; currency: string } | null }> }>({ query: 'query($storeId:String!,$offset:Int){ payments(storeId:$storeId,limit:100,offset:$offset) { id status testMode pspAmountDetails { amount currency } } }', variables: { storeId: waffoStoreId(), offset: page * 100 } });
        if (result.errors?.length || !Array.isArray(result.data?.payments)) throw new Error('Revenue query incomplete');
        for (const payment of result.data.payments) {
          if (payment.testMode !== (waffoEnvironment() === 'test') || seen.has(payment.id)) throw new Error('Revenue scope/coverage mismatch');
          seen.add(payment.id); counts[payment.status] = (counts[payment.status] || 0) + 1;
          if (payment.status !== 'succeeded') continue;
          const n = cents(payment.pspAmountDetails?.amount), currency = payment.pspAmountDetails?.currency;
          if (n === null || !currency) { unknownAmounts++; continue; }
          const row = byCurrency[currency] ??= { succeededCount: 0, chargedCents: 0 }; row.succeededCount++; row.chargedCents += n;
        }
        if (result.data.payments.length < 100) { complete = true; break; }
      }
      const stripeKey = process.env.STRIPE_SECRET_KEY || '';
      return res.status(200).json({ capturedAt: new Date().toISOString(), environment: waffoEnvironment(), storeId: waffoStoreId(), complete, paymentStatuses: counts, byCurrency, unknownAmounts, stripeEnvironment: stripeKey.startsWith('sk_test_') || stripeKey.startsWith('rk_test_') ? 'test' : stripeKey.startsWith('sk_live_') || stripeKey.startsWith('rk_live_') ? 'live' : 'unknown', paypalEnvironment: process.env.PAYPAL_ENV === 'live' ? 'live' : 'sandbox', note: 'Gross successful charges only; refunds, fees and bank settlement are not deducted or verified here.' });
    }
    if (req.method !== 'GET') return res.status(400).json({ error: 'Unknown monitor operation' });
    const result = await runBillingMonitor({ db: database(), graphql: waffo().graphql, sendMail }, { storeId: waffoStoreId(), environment: waffoEnvironment() });
    return res.status(200).json({ ok: true, ...result });
  } catch {
    console.error('Billing monitor failed; external scheduler must alert');
    return res.status(503).json({ error: 'Billing monitor failed; notification or reconciliation requires attention' });
  }
}
