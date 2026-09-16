# Stripe billing (sandbox first)

Credit subscriptions for `pro` and `team`. Checkout lives in `api/billing/`, enforcement stays in
`server/job-store.ts`, and the plan catalog is `src/config/plans.ts` (credits, daily limits, monthly price).

## Flow

1. `POST /api/billing/checkout` (signed-in, body `{ "plan": "pro" }`) creates a Stripe Checkout
   Session in `subscription` mode and returns its hosted `url`. The frontend redirects there.
2. Stripe returns the buyer to `/dashboard?checkout=success&session_id=cs_...`.
   `GET /api/billing/checkout?session_id=...` verifies the session belongs to that account, then
   grants the plan's monthly credits.
3. `POST /api/billing/webhook` (signature-checked) grants credits for `invoice.paid` and keeps
   `tier`/`subscriptionStatus` in sync for `customer.subscription.updated|deleted`.

Credits are granted once per **subscription period**: the Firestore document key is
`sub:<subscription id>:<period start>` and the ledger write happens in the same transaction. A
retried webhook, a duplicate delivery, or the success redirect can therefore never double-charge or
double-grant. `GET /api/billing/orders` lists the account's own orders.

## Sandbox setup

1. Stripe dashboard → **Developers → API keys** → copy the **test mode** secret key (`sk_test_...`).
2. Put it in `.env.local` (never commit) and in Vercel:
   ```bash
   vercel env add STRIPE_SECRET_KEY production
   ```
3. Register the webhook endpoint (this also prints the signing secret once):
   ```bash
   node scripts/stripe-setup.mjs https://www.dlss5nvidia.com
   vercel env add STRIPE_WEBHOOK_SECRET production
   ```
   Or add it by hand: **Developers → Webhooks → Add endpoint** with URL
   `https://www.dlss5nvidia.com/api/billing/webhook` and events `checkout.session.completed`,
   `invoice.paid`, `customer.subscription.updated`, `customer.subscription.deleted`.
4. Redeploy, then confirm `curl -s https://www.dlss5nvidia.com/api/health` reports `"billing": true`.

Prices come from `src/config/plans.ts` as inline monthly prices, so no product setup is required.
To use dashboard-managed prices instead, set `STRIPE_PRICE_PRO` / `STRIPE_PRICE_TEAM` to recurring
price ids.

## Full sandbox run (card 4242 4242 4242 4242, any future expiry, any CVC)

```bash
# terminal 1 – local API with the project's env files
vercel dev --listen 4310
# terminal 2 – forward Stripe test events to the local webhook (Stripe CLI)
stripe listen --forward-to localhost:4310/api/billing/webhook
```

Then sign in, open `/pricing`, subscribe with the test card, and check:
- `/dashboard` shows `pro · 500 credits` and the confirmation notice;
- Firestore `users/<uid>` has `tier: "pro"`, `credits: 500`, `stripeCustomerId`, `stripeSubscriptionId`;
- Firestore `billing_orders` has one document per paid period;
- Stripe → Developers → Webhooks → your endpoint shows `200` responses for every event.

Test renewals without waiting a month: **Billing → Subscriptions → your subscription → Actions →
Update subscription → Advanced → …**, or `stripe trigger invoice.paid` (the event must carry
`subscription_details.metadata.uid`; Stripe CLI test fixtures have no metadata and are ignored).
Cancel a subscription in the dashboard and confirm the account returns to `tier: "free"`.

## Going live

Replace the test key with the live secret key, create a live webhook endpoint with the same events,
and update both Vercel variables. Live and test mode need separate `whsec_...` values.

## Environment

| Variable | Purpose |
| --- | --- |
| `STRIPE_SECRET_KEY` | Server-only Stripe key; enables checkout |
| `STRIPE_WEBHOOK_SECRET` | Signing secret of the `/api/billing/webhook` endpoint |
| `STRIPE_PRICE_PRO`, `STRIPE_PRICE_TEAM` | Optional pre-created recurring price ids |
| `PUBLIC_SITE_URL` | Optional absolute origin for Stripe redirects (defaults to the request host) |

Never expose these to the browser: no `VITE_` prefix, and `.env*` stays git-ignored.
