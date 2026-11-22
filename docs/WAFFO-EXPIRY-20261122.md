# Waffo expiry-time investigation — 2026-11-22

Serves R1/R3/R5: preserve accurately paid access to the existing DLSS 5 style-conversion / Studio product. No change to prices, plan quotas, payment promises or protected-page copy.

## Cause: two different business timestamps

The one-hour difference is explicitly documented in Waffo's live GraphQL schema, not caused by JavaScript timezone conversion:

- `currentPeriodEnd`: “End of the current billing period, i.e. the next charge time.”
- `cancelEffectiveAt`: the moment the payment provider is asked to stop the subscription; for a period-end cancellation it is **one hour before currentPeriodEnd**.
- `cancelEffectiveMode`: `period_end` versus `now`. In the final hour both modes can have the same timestamp, so the mode must be read rather than inferred by adding/subtracting an hour.

The read-only query of the actual sandbox order `ORD_1skRAc5BEr0FCNRKEXi8ey` returned:

| Field | Provider value |
| --- | --- |
| testMode | true |
| status | canceling |
| willRenew | false |
| currentPeriodStart | 2026-11-22T04:06:23.000Z |
| currentPeriodEnd | 2026-12-22T04:06:23.000Z |
| cancelEffectiveAt | 2026-12-22T03:06:23.000Z |
| cancelEffectiveMode | period_end |
| canceledAt | 2026-11-22T04:09:15.667Z |

Thus this test subscription is scheduled to stop renewing; its paid period still ends at 04:06:23Z. The previous sandbox report's unexplained one-hour limitation is resolved by the schema definition and matching live fields. No merchant-support answer was invented or email sent.

Evidence: `/Users/wangsheng/code/shou/artifacts/waffo-expiry-20261122/provider-period-evidence.json`. This contains only the selected Test order and public schema descriptions, not credentials.

## Access and renewal fixes

The existing job gate did not use `cancelEffectiveAt`: it compared UTC epoch seconds to `currentPeriodEnd`. Tests already confirmed access inside the final hour and expiry exactly at the paid endpoint. The investigation nevertheless reproduced two real code defects with controlled transaction tests:

1. A period-2 payment arriving while the canonical order still showed the expired period 1 was permanently recorded as stale. Later retries could not grant the paid allowance.
2. A lifecycle handler holding an older canonical cancellation snapshot could run after period-2 payment and roll the account's end date and tier backward when the event omitted its own period number.

The fix preserves these invariants:

- Only a verified successful payment advances monthly quota and the paid-through endpoint. Lifecycle notifications alone cannot silently extend old credits into an unpaid next period.
- A new payment ahead of canonical period numbering is rejected **before any receipt/period/ledger write**, leaving it retryable. After the order catches up, the same event grants once; replay does not reset spent credits.
- A lifecycle snapshot behind the already verified paid period also remains retryable. An event explicitly identified as belonging to an older period is ignored without changing the new allowance.
- Period-end cancellation cannot shorten an already verified paid endpoint, even if an early terminal notification has a shorter or missing canonical end. At 03:06:23Z the paid endpoint stays 04:06:23Z; no blanket “add one hour” adjustment exists.
- Explicit **confirmed** immediate cancellation (`status:canceled`, `cancelEffectiveMode:now`) remains effective at its valid canonical timestamp. A merely pending `canceling + now` notification does not prematurely truncate access. Missing/malformed/no-timezone immediate timestamps are rejected without writes for retry.
- Audit rows retain canonical endpoint, prior paid endpoint, effective access endpoint and cancellation mode/time. The webhook lookup and read-only collector now request the two cancellation fields directly from Waffo.

No previously processed historical payment receipts are automatically rewritten or balances backfilled. The read-only reconciler now flags `current_paid_period_ungranted` when a current, unexpired, not-fully-refunded paid period was stored as ungranted. It excludes historical/retired periods and fully refunded payments; incomplete refund coverage is explicitly incomplete, never silently passed. This is a review alert, not an automatic credit repair.

## Regression evidence and scope

The regression suite covers the actual one-hour pair, the final millisecond/second before expiry, the exact expiry point, UTC `Z` and `+08:00` equivalents, early terminal/missing-date notifications, both renewal delivery orders, stale snapshots after renewal, duplicate delivery, and explicit immediate cancellation.

These are controlled transaction/clock tests using the same store and JobStore; they do not pretend that a real month elapsed or that a new bank payment occurred. The earlier real Waffo sandbox payment/refund acceptance remains documented in `WAFFO-SANDBOX-ACCEPTANCE-20261122.md`. This investigation adds no real charge and changes no customer balances.

Verification: `npm run lint` PASS; `npm test` **210/210 passed**; `npm run build` PASS. Required page gates: `FLAGSHIP-PAGES: fails=0 verdict=PASS`; unsourced claims **0 hits / PASS** across both sites; `PROTECTION: changed=0 down=0 verdict=FROZEN-OK`. Commit and deployment receipt are stored in the artifact acceptance record. Price and page content are unchanged.

## Operational limits

Waffo payment and lifecycle notifications may still arrive asynchronously. A retryable error protects entitlement accounting; it does not guarantee zero provisioning latency during a provider outage. Missing deliveries or historical false-stale receipts require read-only reconciliation and deliberate review, not invented credits.

Normal renewal charging is controlled by Waffo, not by our cancellation timestamp arithmetic. A canceled subscription's `willRenew:false` is expected. Natural monthly charging and bank settlement have not been claimed observed in this clock-based regression.

Primary references checked in this investigation:

- Live Waffo `SubscriptionOrder` GraphQL field descriptions, stored with the actual Test order above.
- https://docs.waffo.ai/api-reference/endpoints/subscriptions/cancel-subscription
- https://docs.waffo.ai/api-reference/webhooks
- https://docs.waffo.ai/features/test-mode.md
