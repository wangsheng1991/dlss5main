# PayPal billing (sandbox first)

A second checkout lane next to Stripe for the same `pro` and `team` plans. It shares the plan catalog
(`src/config/plans.ts`), the credit grant transaction (`server/billing-store.ts`) and the router
(`api/billing/[route].ts`) with card payments, so an account ends up with one subscription no matter
which provider charged it.

## Configuration

| Variable | Purpose |
| --- | --- |
| `PAYPAL_CLIENT_ID` / `PAYPAL_CLIENT_SECRET` | App credentials from https://developer.paypal.com |
| `PAYPAL_ENV` | `sandbox` (default) or `live`. Only `live` reaches the real money base URL |
| `PAYPAL_WEBHOOK_ID` | Id of the `/api/billing/paypal-webhook` endpoint, printed by `scripts/paypal-setup.mjs` |
| `PUBLIC_SITE_URL` | Optional absolute origin used in the PayPal return/cancel URLs |

`scripts/paypal-setup.mjs` registers the webhook (idempotently, keyed by URL) and prints the id to
store. It subscribes to `BILLING.SUBSCRIPTION.ACTIVATED|CANCELLED|EXPIRED|SUSPENDED`,
`PAYMENT.SALE.COMPLETED|REFUNDED|REVERSED`.

## Flow

1. `POST /api/billing/paypal-checkout` (signed-in, body `{ "plan": "pro" }`) makes sure a PayPal
   product and billing plan exist for the current environment (created once, cached in
   `billing_config/paypal`), creates a subscription with `custom_id = <uid>` and returns the
   `approve` link. The account is bound to the subscription id **before** approval, because the
   webhook that follows carries nothing but that id.
2. The buyer approves on PayPal and returns to `/dashboard?paypal=success`.
   `GET /api/billing/paypal-confirm` reads the bound subscription, checks `custom_id` against the
   caller and, when PayPal reports it `ACTIVE`, grants the plan's credits.
3. `POST /api/billing/paypal-webhook` verifies the delivery through PayPal's
   `/v1/notifications/verify-webhook-signature` service, then applies:
   `BILLING.SUBSCRIPTION.ACTIVATED` grants the first period, `PAYMENT.SALE.COMPLETED` grants a
   renewal, `PAYMENT.SALE.REFUNDED|REVERSED` claws the most recent grant back, and
   `BILLING.SUBSCRIPTION.CANCELLED|EXPIRED` downgrades the account to `free` while `SUSPENDED`
   flags it `past_due`.

Credits are granted once per **paid period**. The key is `paypal:<subscription id>:<UTC day of the
payment>`, derived from the subscription's own `billing_info.last_payment.time` on every path, so
the two events PayPal sends for one payment (activation plus sale) cannot grant twice, while a
renewal a month later always can.

## Differences from Stripe

- Plan changes are not prorated here. `POST /api/billing/change` answers `409 paypal_subscription`
  for a PayPal buyer; switching plans means cancelling on PayPal and subscribing again. A PayPal
  subscription would be revised through `/v1/billing/subscriptions/{id}/revise` instead.
- `POST /api/billing/portal` has no PayPal equivalent: PayPal buyers cancel in their PayPal account,
  and the endpoint answers `409 paypal_subscription` rather than a dead Stripe portal link.
- PayPal has no sandbox "test clock": a sandbox subscription renews on its own schedule, so renewal
  behaviour is verified from its webhook payloads rather than by advancing time.
