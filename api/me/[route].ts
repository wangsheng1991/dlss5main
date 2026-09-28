import type { VercelRequest, VercelResponse } from '@vercel/node';
import bootstrap from './_handlers/bootstrap.js';
import checkin from './_handlers/checkin.js';
import share from './_handlers/share.js';

/**
 * One serverless function serves the whole `/api/me/*` surface, for the same reason `/api/billing/*`
 * is one function: a deployment may only add a limited number of functions, and the routes below are
 * three of the small ones. The client URLs do not change — `/api/me/bootstrap` still resolves here —
 * and each handler keeps living in `_handlers/`, so nothing about an individual route moved but its
 * file's depth.
 */
const routes: Record<string, (req: VercelRequest, res: VercelResponse) => unknown> = {
  bootstrap,
  checkin,
  share,
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const value = req.query.route;
  const route = (Array.isArray(value) ? value[0] : String(value || '')).replace(/\/+$/, '');
  const selected = routes[route];
  if (!selected) return res.status(404).json({ error: 'Unknown account route' });
  return selected(req, res);
}
