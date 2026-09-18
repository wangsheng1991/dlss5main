import type { VercelRequest, VercelResponse } from '@vercel/node';
import { dodoConfigured } from './_lib/dodo.js';
import { paypalConfigured, paypalEnvironment } from './_lib/paypal.js';

export default function handler(_req: VercelRequest, res: VercelResponse) {
  const checks = {
    alphaNet: Boolean(process.env.ALPHANET_API_KEY && process.env.ALPHANET_BASE_URL),
    firebaseAuth: Boolean(process.env.FIREBASE_WEB_API_KEY),
    quotaBackend: Boolean(process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_DATABASE_ID),
    billing: Boolean((process.env.STRIPE_SECRET_KEY && process.env.STRIPE_WEBHOOK_SECRET) || (dodoConfigured() && process.env.DODO_PAYMENTS_WEBHOOK_KEY)),
    // A second checkout lane; both must be present for the PayPal button to appear.
    paypal: paypalConfigured() && Boolean(process.env.PAYPAL_WEBHOOK_ID),
    // Reported for deployment checks only: super resolution is a separate capability, so a missing
    // key must not make the site look degraded.
    superResKey: Boolean(process.env.ALPHANET_SUPERRES_API_KEY),
  };
  const ready = checks.alphaNet && checks.firebaseAuth && checks.quotaBackend && Boolean(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
  return res.status(ready ? 200 : 503).json({
    status: ready ? 'ok' : 'degraded',
    checks,
    // PayPal sandbox and live differ only by base URL, so which one is wired up is part of the check.
    paypalEnvironment: paypalEnvironment(),
    // Deliberately omit values, URLs, provider error details and secret names beyond these flags.
    generatedAt: new Date().toISOString(),
  });
}
