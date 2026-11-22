import { waffoCheckoutEnabled, waffoEnvironment } from './_lib/waffo.js';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { dodoConfigured } from './_lib/dodo.js';
import { paypalConfigured, paypalEnvironment } from './_lib/paypal.js';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.query?.retired_provider_proxy === '1') return res.status(410).json({ code: 'PUBLIC_PROVIDER_PROXY_RETIRED', error: 'This public provider passthrough is no longer available. Use the website tools with your website account.' });
  if (req.query?.retired_media === '1') {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('X-Robots-Tag', 'noindex, nofollow');
    return res.status(410).send('<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex,nofollow"><title>Video fetching retired</title></head><body><h1>Third-party platform video fetching has been retired / 第三方平台视频抓取已下线</h1><p>No new fetching task is available.</p><p><a href="/video-studio">Local-file video tools</a> · <a href="/zh/video-studio">本地视频文件工具</a></p></body></html>');
  }
  const checks = {
    waffo: waffoCheckoutEnabled(),
    alphaNet: Boolean(process.env.ALPHANET_API_KEY && process.env.ALPHANET_BASE_URL),
    firebaseAuth: Boolean(process.env.FIREBASE_WEB_API_KEY),
    quotaBackend: Boolean(process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_DATABASE_ID),
    billing: Boolean((process.env.STRIPE_SECRET_KEY && process.env.STRIPE_WEBHOOK_SECRET) || (dodoConfigured() && process.env.DODO_PAYMENTS_WEBHOOK_KEY)),
    // A second checkout lane; both must be present for the PayPal button to appear.
    paypal: paypalConfigured() && Boolean(process.env.PAYPAL_WEBHOOK_ID),
    // Reported for deployment checks only: super resolution is a separate capability, so a missing
    // key must not make the site look degraded.
    superResKey: Boolean(process.env.ALPHANET_SUPERRES_API_KEY),
    // The C-line tools fall back to ALPHANET_API_KEY, so a false here means "same project", not broken.
    toolsKey: Boolean(process.env.ALPHANET_TOOLS_API_KEY),
  };
  const ready = checks.alphaNet && checks.firebaseAuth && checks.quotaBackend && Boolean(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
  return res.status(ready ? 200 : 503).json({
    status: ready ? 'ok' : 'degraded',
    checks,
    // PayPal sandbox and live differ only by base URL, so which one is wired up is part of the check.
    waffoEnvironment: waffoEnvironment(),
    paypalEnvironment: paypalEnvironment(),
    // Deliberately omit values, URLs, provider error details and secret names beyond these flags.
    generatedAt: new Date().toISOString(),
  });
}
