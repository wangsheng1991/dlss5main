import DodoPayments from 'dodopayments';
import { ApiError } from '../../server/errors.js';
import type { PurchasablePlanId } from '../../src/config/plans.js';

export const dodoEnvironment = (): 'live_mode' | 'test_mode' => process.env.DODO_PAYMENTS_ENVIRONMENT === 'live_mode' ? 'live_mode' : 'test_mode';
export const dodoConfigured = () => Boolean(process.env.DODO_PAYMENTS_API_KEY);
export const dodoProductId = (plan: PurchasablePlanId) => process.env[`DODO_PRODUCT_${plan.toUpperCase()}`] || '';

export function dodo() {
  const key = process.env.DODO_PAYMENTS_API_KEY;
  if (!key) throw new ApiError(503, 'dodo_not_configured', 'Dodo Payments is not configured yet');
  return new DodoPayments({ bearerToken: key, environment: dodoEnvironment(), webhookKey: process.env.DODO_PAYMENTS_WEBHOOK_KEY });
}

export const dodoWebhookKey = () => String(process.env.DODO_PAYMENTS_WEBHOOK_KEY || '').trim();
