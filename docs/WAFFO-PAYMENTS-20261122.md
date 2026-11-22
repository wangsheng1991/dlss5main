# Waffo production payments — 2026-11-22

Serves R1/R3/R5: billing for the existing style-conversion / Studio product, with unchanged plan prices and no new capability claims.

## Implementation

- Pro: USD 19/month, 500 monthly credits; Team: USD 79/month, 2,000 monthly credits. Existing daily/concurrency limits stay authoritative in `src/config/plans.ts`.
- Authenticated, server-priced checkout binds a durable intent to Firebase UID, product and environment. Double clicks reuse an idempotency key. Outstanding provider orders and other active subscriptions block a second purchase. New legacy-provider checkout routes are blocked while Waffo is enabled; existing subscriptions/webhooks are preserved.
- Never grant from a browser redirect. RSA-verified production webhooks must match this store, canonical provider order, local intent, UID/product, amount/currency and billing period. Only `subscription.payment_succeeded` grants credits. Delivery/payment/period deduplication and ledger/user writes are transactional.
- Monthly credits reset once per verified paid period; Waffo accounts cannot receive an automatic calendar-month refill. Expired paid allowances are unusable; bonus credits remain separate.
- Lifecycle events use canonical provider status, never grant credits, and retain already-paid access until period end. Full/cumulative refunds remove only the remaining relevant monthly allowance; partial refunds are recorded for review. Unknown original payments fail for retry instead of guessing. Chargeback automation is not claimed: the installed SDK exposes no dedicated chargeback event and such cases require merchant reconciliation.
- Portal links use only the authenticated user's UID. Checkout/portal bearer URLs are no-store and are not logged. Successful checkout/token API responses must explicitly report the configured environment (`x-waffo-environment`); a test key cannot silently open a production-labelled checkout.
- Firestore browser writes to user billing/quota/bonus/identity fields are denied; only optional name/image profile edits are allowed. Server account bootstrap remains the creation path.

## Provider configuration

Existing products were published, not recreated. Store: `STO_3Cs3yPzz5yiIKAnkww4y5f`; Pro: `PROD_0b9ac41gWxmiwXE5OsacLz`; Team: `PROD_5RoaPmgH4gXaXO4L0ouO6J`.

Production HTTP webhook: `https://www.dlss5nvidia.com/api/billing/waffo-webhook`, registered for successful payments, subscription lifecycle and settled refunds. Production environment/product/enable flags were configured in Vercel. Existing sensitive merchant/private-key variables were preserved. Local historical credentials are TEST credentials and were not copied into production.

## Validation and remaining acceptance

- `npm run lint`: PASS.
- `npm test`: 163/163 PASS, including RSA tampering/time/store/environment rejection, intent/identity binding, concurrent delivery/period deduplication, refunds, stale lifecycle events, expired entitlement and legacy route isolation.
- `npm run build`: PASS; article Markdown gate PASS.
- Firebase Rules service: 7/7 expected ALLOW/DENY tests PASS; narrowed rules deployed to the named business database. Old release backed up outside the repository.
- Flagship pages gate: `FLAGSHIP-PAGES: fails=0 verdict=PASS`.
- Unsourced claims gate: PASS.
- Protection review before this release found four inherited differences against the 2026-11-20 baseline: homepage retired-tool replacement (`f2b5cc1`), download release facts (`25e46ca`), previously authorized comparison SEO title, and API-docs remediation (`f2b5cc1`). These are pre-existing on origin/main and documented in the dated changelog; this payment change touches none of those protected-page sources. The old baseline is retained, and a separate 2026-11-22 baseline is captured after reviewing those inherited differences, before payment deployment.
- Production browser/checkout acceptance is recorded below after deployment. No real charge has been made as part of implementation. A checkout session or success redirect alone does not prove payment, webhook delivery or entitlement issuance.

## Primary references

- https://docs.waffo.ai/integrate/ai-integration.md
- https://docs.waffo.ai/api-reference/webhooks.md
- https://docs.waffo.ai/api-reference/endpoints/orders/create-checkout-session.md
- SDK `@waffo/pancake-ts` 0.28.0, inspected types and request implementation.

Redacted receipts and rule backups: `/Users/wangsheng/code/shou/artifacts/waffo-payments-20261122/`. No credentials or bearer checkout links belong in this document.

## Production acceptance — 2026-11-22

Implementation commit: `73184cf85b0795d02bc43cf1da2d7728b300b859`; Vercel production deployment `dpl_4KRP1gsppgdUS1THn79p9u4qnTLN` reached READY.

- Live catalog: `version:4`, `waffo.enabled:true`, `environment:prod`, USD 19/79 unchanged.
- Dedicated synthetic acceptance user (no owner/browser account reused) passed authenticated bootstrap and checkout. Checkout returned HTTP 200 after the runtime response-header environment guard.
- The actual Waffo production page displayed `DLSS5NVIDIA Pro`, `US$19.00/月`, `今日应付 US$19.00`, the merchant store name and Waffo reseller disclosure. Stopped at buyer information: no email/card entered and no final payment action. Desktop screenshot inspected visually; amount and layout are legible.
- Before and after unpaid checkout: `tier:free`, `credits:10`, no subscription binding. Redirect/session creation never grants paid credits.
- Unauthenticated checkout: 401; unsigned webhook: 401. Authenticated legacy new-purchase endpoints: 409 `use_waffo_checkout`. Own-customer portal: HTTP 200 on the correct Waffo origin.
- Repeating the unpaid session creation reused the same provider session id. Full bearer checkout/portal URLs were not persisted.
- Products currently have no self-service plan-change group. The initial integration supports subscription purchase, renewal, portal management/cancellation and refunds; cross-product plan changes must not be advertised as accepted by this implementation.
- Follow-up UI review covers canceled/expired Waffo accounts re-entering checkout and manually granted paid tiers without a legacy billing subscription. Backend checks remain authoritative.

**Still requires a real buyer payment:** verify actual charged payment → production-signed webhook delivery → one monthly allowance and ledger entry, then a real generation. Neither this document nor automated mocked tests claim that this cash-flow acceptance has occurred.

Redacted receipts: `live-smoke-first.json`, `live-smoke.json`, `ui-checkout.json`; screenshots in the artifact directory named above. Temporary synthetic account records are cleaned up after UI verification.

### Billing-copy correction

Pricing’s old paragraph, “Every plan uses GPT Image 2 with predictable monthly limits.”, promised a model the current tools do not universally use. Replaced only that paragraph with: “Use the site’s style-conversion and image-editing workflows with clear monthly limits.” Plan prices/limits and SEO metadata remain unchanged. Existing screenshots from the first smoke show the previous paragraph and are retained as historical evidence, not the final copy.

### Page-button acceptance

A fresh browser context, authenticated only as the dedicated synthetic acceptance account, displayed `Subscribe to Pro` and `Subscribe to Team`. At 390×844 the pricing page had no horizontal overflow; both buttons/cards were inspected in the screenshot. Clicking the real Pro button issued `/api/billing/waffo-checkout` (HTTP 200), then navigated to Waffo and displayed the USD 19/month buyer-information page. No card or buyer email was entered; no payment was submitted. See `ui-checkout.json` and `production-checkout-from-button.png`.

### Production permission check and cleanup

Using only the dedicated synthetic user's valid Firebase ID token, real Firestore REST writes to `bonusCredits`, `waffoSubscriptionId`, and `currentPeriodEnd` each returned HTTP 403 `PERMISSION_DENIED`. Its balance remained free/10/bonus0 with no subscription. This verifies deployed rules rather than only a local rule mock. `security-smoke.json` also records all three legacy new-checkout routes returning 409.

After verification, removed only this synthetic Auth user, unused profile, unspent synthetic signup grant and one unpaid intent. No real customer or real payment/ledger records were modified. See `cleanup.json`.
