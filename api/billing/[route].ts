import type { VercelRequest, VercelResponse } from '@vercel/node';
import planHandler from './_handlers/plans.js';
import usage from './_handlers/usage.js';
import orders from './_handlers/orders.js';
import checkout from './_handlers/checkout.js';
import change from './_handlers/change.js';
import portal from './_handlers/portal.js';
import webhook from './_handlers/webhook.js';
import paypalCheckout from './_handlers/paypal-checkout.js';
import paypalConfirm from './_handlers/paypal-confirm.js';
import paypalWebhook from './_handlers/paypal-webhook.js';
import dodoCheckout from './_handlers/dodo-checkout.js';
import dodoWebhook from './_handlers/dodo-webhook.js';

/**
 * One serverless function serves the whole `/api/billing/*` surface, because a deployment may only
 * add a limited number of functions. URLs are unchanged; each handler lives in `_handlers/`.
 * `plans` is renamed on import because this module already uses `plans` for the route table.
 */
const routes: Record<string, (req: VercelRequest, res: VercelResponse) => unknown> = {
  plans: planHandler,
  usage,
  orders,
  checkout,
  change,
  portal,
  webhook,
  'paypal-checkout': paypalCheckout,
  'paypal-confirm': paypalConfirm,
  'paypal-webhook': paypalWebhook,
  'dodo-checkout': dodoCheckout,
  'dodo-webhook': dodoWebhook,
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const value = req.query.route;
  const route = (Array.isArray(value) ? value[0] : String(value || '')).replace(/\/+$/, '');
  const selected = routes[route];
  if (!selected) return res.status(404).json({ error: 'Unknown billing route' });
  return selected(req, res);
}
