import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(_req: VercelRequest, res: VercelResponse) {
  const checks = {
    alphaNet: Boolean(process.env.ALPHANET_API_KEY && process.env.ALPHANET_BASE_URL),
    firebaseAuth: Boolean(process.env.FIREBASE_WEB_API_KEY),
    quotaBackend: Boolean(process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_DATABASE_ID),
    billing: Boolean(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_WEBHOOK_SECRET),
  };
  const ready = checks.alphaNet && checks.firebaseAuth && checks.quotaBackend && Boolean(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
  return res.status(ready ? 200 : 503).json({
    status: ready ? 'ok' : 'degraded',
    checks,
    // Deliberately omit values, URLs, provider error details and secret names beyond these flags.
    generatedAt: new Date().toISOString(),
  });
}
