import type { VercelRequest, VercelResponse } from '@vercel/node';
import { PLANS } from '../../src/config/plans.js';

export default function handler(_req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=600');
  return res.status(200).json({
    version: 2,
    currency: 'USD',
    membershipContact: process.env.MEMBERSHIP_CONTACT_EMAIL || 'support@dlss5nvidia.com',
    // Sandbox and production both report whether checkout is live, so the UI never offers a dead button.
    billingEnabled: Boolean(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_WEBHOOK_SECRET),
    plans: PLANS,
  });
}
