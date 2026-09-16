# Stripe billing (sandbox first)

Credit subscriptions for `pro` and `team`. Checkout lives in `api/billing/`, enforcement stays in
`server/job-store.ts`, and the plan catalog is `src/config/plans.ts` (credits, daily limits, fallback price).

`/api/billing/*` is served by one serverless function, `api/billing/[route].ts`, which dispatches to
the handlers in `api/billing/_handlers/` — a deployment may only add a limited number of functions,
and the URL surface stays exactly the same. A new billing route needs an entry in the router only.

## Flow

1. `POST /api/billing/checkout` (signed-in, body `{ "plan": "pro" }`) creates a Stripe Checkout
   Session in `subscription` mode and returns its hosted `url`. The frontend redirects there. An
   account that already has an active subscription gets `409 subscription_exists` instead of a
   second subscription.
2. Stripe returns the buyer to `/dashboard?checkout=success&session_id=cs_...`.
   `GET /api/billing/checkout?session_id=...` verifies the session belongs to that account, then
   grants the plan's monthly credits.
3. `POST /api/billing/change` (body `{ "plan": "team" }`) switches an existing subscription with
   Stripe proration and grants the new plan's allowance for the period that just started.
4. `POST /api/billing/portal` returns a Stripe customer portal session, where the buyer cancels,
   switches plan or updates the card.
5. `POST /api/billing/webhook` (signature-checked) is the source of truth for everything Stripe
   does on its own: `invoice.paid`, `invoice.payment_failed`, `charge.refunded`,
   `charge.dispute.created`, `customer.subscription.updated|deleted`.

Credits are granted once per **period** — except plan changes, which are granted once per
**proration invoice**, because several switches can happen inside one period. The Firestore document
key is `sub:<subscription id>:<period start>` or `invoice:<invoice id>`, and the ledger write happens
in the same transaction. A retried webhook, a duplicate delivery, or the success redirect can
therefore never double-charge or double-grant: whichever path arrives first wins the key.
`GET /api/billing/orders` lists the account's own orders, including refunds and disputes.

## Adjustments without a customer action

| Stripe event | Effect on the account |
| --- | --- |
| `invoice.paid` | Grants that period (or that proration invoice) once |
| `invoice.payment_failed` | Nothing is revoked; the account is flagged `past_due` and Stripe retries |
| `charge.refunded` | Recorded; a **full** refund claws back the most recent grant's credits (never below zero) |
| `charge.dispute.created` | Recorded and the account is flagged `disputed`; credits stay until an operator decides |
| `customer.subscription.deleted` | Back to `free` (a new checkout is then allowed) |

Partial refunds are recorded but never touch credits. Every adjustment maps to the account through
its stored `stripeCustomerId`.

## Sandbox setup

1. Stripe dashboard → **Developers → API keys** → copy the **test mode** secret key (`sk_test_...`).
2. Put it in `.env.local` (never commit) and in Vercel:
   ```bash
   vercel env add STRIPE_SECRET_KEY production
   ```
3. Register the webhook endpoint, subscribe it to the billing events and create the two recurring
   prices (idempotent — re-running reuses what exists):
   ```bash
   node scripts/stripe-setup.mjs https://www.dlss5nvidia.com
   vercel env add STRIPE_WEBHOOK_SECRET production
   vercel env add STRIPE_PRICE_PRO production
   vercel env add STRIPE_PRICE_TEAM production
   ```
   Or do it by hand: **Developers → Webhooks → Add endpoint** with URL
   `https://www.dlss5nvidia.com/api/billing/webhook` and the events
   `checkout.session.completed`, `invoice.paid`, `invoice.payment_failed`, `charge.refunded`,
   `charge.dispute.created`, `customer.subscription.updated`, `customer.subscription.deleted`.
4. Redeploy, then confirm `curl -s https://www.dlss5nvidia.com/api/health` reports `"billing": true`.

Prices live in the Stripe dashboard: one recurring monthly price per plan, referenced by
`STRIPE_PRICE_PRO` / `STRIPE_PRICE_TEAM`. `/api/billing/plans` reports what those prices charge, so
the pricing page can never advertise an amount checkout does not use. Without the price ids checkout
still works with an inline price, but plan switching is unavailable (Stripe cannot swap to an ad-hoc
price) and every checkout would create a throwaway product.

## Verified in sandbox (2026-09-16)

Real test-mode payments were completed through the hosted checkout on `http://localhost` and on
`https://www.dlss5nvidia.com` with card `4242 4242 4242 4242`, and credits arrived once per period:
locally through the success redirect, in production through the delivered `invoice.paid` webhook.
Also verified against the live site: checkout charges the dashboard price, a second subscription is
refused, `pro → team` and `team → pro` switch with proration and grant the new allowance, the
customer portal opens, a full refund claws the period's credits back, and a disputed payment (test
card `4000 0000 0000 0259`) flags the account. Failed renewals, forged signatures, malformed session
ids, unauthenticated calls, duplicate deliveries and events for deleted accounts were checked with
signed events and all behaved as designed. Every throwaway account, subscription and customer was
deleted afterwards.

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
