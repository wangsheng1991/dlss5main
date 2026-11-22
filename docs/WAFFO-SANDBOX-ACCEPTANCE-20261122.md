# Waffo sandbox acceptance and read-only reconciliation — 2026-11-22

Serves R1/R3/R5: verify billing for the existing DLSS 5 style-conversion / Studio product. No changes to advertised plan price, capability claims, or protected-page copy.

## Scope and isolation

Real Waffo TEST orders and the official sandbox cards were used. Both checkout and gateway explicitly displayed “Test Mode — No real payment will be processed”. Merchant API checkout responses were required to identify `test`; no production key was substituted and no real money was charged/refunded.

An isolated temporary API deployment ran the same webhook handler and billing store as the site, pinned to the Test signing key, this store, and the `waffo_sandbox_20261122_` UID prefix. A production webhook was not opened to Test signatures. Temporary capture data was encrypted; checkout/portal bearer links and merchant keys were kept out of artifacts and source. The test service exposes no site pages and returns noindex headers.

## Actual results

| Case | Provider evidence | Local result |
| --- | --- | --- |
| Declined Visa sandbox fixture, last four 0220 | `Payment Failed`; payment `PAY_1bSpkboL0PCrKVLmDCco1q`, status `failed`, reason `Card Authentication Failed` | free / 10 credits / no subscription binding |
| Successful Visa sandbox fixture, last four 0110 | `Subscription successful`; payment `PAY_4gTgaLPdguvwCPhrVkekoT`, `testMode:true`, `succeeded`, USD 19.00 | Pro / 500 monthly credits; activation alone granted nothing |
| Credit reservation | Actual JobStore transaction; no model called | 500 → 499; one reservation |
| Replay actual signed successful-payment event | HTTP 200, `processed:false`, `status:duplicate` | 499 → 499, no monthly reset or second grant |
| Controlled failed reservation | Actual JobStore failure/refund transaction; not represented as a generated image | 499 → 500, no active job left |
| Cancel renewal | Waffo canonical order `canceling`; current paid period remains in the future | After the event-identity fix, local status is `canceling`; no extra credits granted |
| Full test refund | ticket `TKT_2Qmv5Dh06mBk16G1nJfT56`; refund `REF_5x5QPR0gV29yPsHkenvYGt`, `succeeded`, USD 19.00; actual refund webhook HTTP 200 | 500 → 0; bonus credits remain 0 |
| Replay cancellation, payment and refund after fix | First missed cancellation processed; subsequent cancellation/payment/refund are duplicate | status stays canceling, credits stay 0 |

Test orders: successful `ORD_1skRAc5BEr0FCNRKEXi8ey`; declined `ORD_1OOjZRpDHVrnJ0b4JwvZQ5`.

## Bug found and fixed by the real test

The original event receipt and lifecycle ledger keys used only payload `id`. Waffo actually reused an order entity ID across activation and cancellation while changing the business `eventId`; the cancellation was therefore incorrectly returned as a duplicate. Changing only the event receipt would still collide with the lifecycle billing document.

Both keys now include **eventType + eventId**. Legacy receipts are recognized only when stored type and business ID both match. Payment/period and refund business-key deduplication remain in place. Real cancellation bytes signed by Waffo were replayed against the corrected handler: processed once, duplicate thereafter. The local status now matches the canonical order.

## Read-only reconciliation

`server/waffo-reconciliation.ts` validates a bounded snapshot. `server/waffo-reconciliation-collector.ts` reads canonical Waffo orders, fully paginated payments/refunds, and the exact related Firestore documents. It never writes or repairs balances.

It checks payment/period/ledger linkage, UID/product/environment, actual PSP amounts, duplicate grants, settled refund sums and subscription status. Missing data, missing period identifiers, API failures and pagination caps produce `incomplete`, not a successful result. Expected list prices are never substituted for missing actual PSP amounts. Customer name/email are omitted from user snapshots.

The checker deliberately reports `balanceCheck: structure-and-allowance-boundaries-only`: this bounded payment snapshot does not include every lifetime generation/promotion entry and cannot prove a full balance-sum reconciliation.

- Before repair: `status:issues`, `complete:true`, 2 orders / 1 successful payment / 1 successful refund / 2 users; exactly 1 `status_mismatch`.
- After repair and replay: `status:pass`, `complete:true`, the same scope, **0 issues**, CLI exit 0.

Usage (credentials must already be in the process environment or a private env file; never put values in command arguments):

```sh
npm run billing:reconcile -- \
  --environment prod --store STO_3Cs3yPzz5yiIKAnkww4y5f \
  --order ORD_REPLACE_WITH_A_REAL_ORDER \
  --out /private/path/waffo-report.json
```

Optional `--snapshot-out` stores a restricted snapshot for audit. Exit codes: 0 pass, 1 confirmed issues, 2 incomplete/start failure. This task supplies and runs the checker; no recurring schedule or automated balance correction is claimed.

## Evidence and practical limits

Artifacts: `/Users/wangsheng/code/shou/artifacts/waffo-sandbox-20261122/`, including UI screenshots, provider delivery responses, reservation/replay/refund receipts, before/after reconciliation reports and restricted snapshots. No merchant key or full bearer checkout link is included.

- Tests use Waffo's sandbox processor, not a real bank/card-network settlement. No production cash payment is claimed verified.
- Natural monthly renewal/expiry was not accelerated or fabricated. Existing automated tests cover period bounds and renewal replay; the real test covers immediate cancellation and refund.
- The cancel API's `cancelEffectiveAt` response was `2026-12-22T03:06:23.000Z`, while the canonical order's `currentPeriodEnd` was `2026-12-22T04:06:23.000Z`. The app uses the canonical order field; the provider's one-hour discrepancy is retained as evidence and is not explained by an invented timezone assumption. Exact natural-expiry timing remains unverified.
- Final code validation and cleanup status are recorded in the artifact acceptance receipt. Only the temporary Test webhook/service and synthetic records are eligible for cleanup; production customer/payment records and the production webhook remain intact.

Primary sources verified during the task:

- https://docs.waffo.ai/features/test-mode.md
- https://docs.waffo.ai/api-reference/webhooks
- https://docs.waffo.ai/api-reference/endpoints/refunds/create-refund-ticket.md
- https://docs.waffo.ai/api-reference/endpoints/graphql/orders-and-payments
