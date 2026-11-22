import type { VercelRequest, VercelResponse } from '@vercel/node';
import { rawBody } from '../../_lib/stripe.js';
import { verifyWaffoEvent, readWaffoOrder } from '../../_lib/waffo.js';
import { WaffoBillingStore } from '../../../server/waffo-billing-store.js';
import { database } from '../../../server/admin.js';
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  let event;
  try { event = verifyWaffoEvent((await rawBody(req)).toString('utf8'), String(req.headers['x-waffo-signature'] || '')); }
  catch { return res.status(401).json({ error: 'Invalid Waffo webhook signature or scope' }); }
  if (!event.eventType.startsWith('subscription.') && event.eventType !== 'refund.succeeded') return res.status(200).json({ received: true, handled: false });
  try {
    const order = await readWaffoOrder(event);
    const result = await new WaffoBillingStore(database()).apply(event, order);
    return res.status(200).json({ received: true, ...result });
  } catch (e) {
    console.error('Waffo webhook processing failed', { eventId: event.id, type: (e as Error).name });
    return res.status(500).json({ error: 'Webhook processing failed; delivery must be retried' });
  }
}
