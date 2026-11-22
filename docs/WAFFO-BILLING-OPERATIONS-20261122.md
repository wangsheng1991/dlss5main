# Waffo billing operations — 2026-11-22

Serves R1/R3/R5: reliably deliver paid DLSS 5 style-conversion / Studio access. No change to product positioning, prices, quotas or page copy.

## Scheduled checks and destination

Cloudflare's existing `studio-mailer` Worker calls the secret-protected production `/api/billing/waffo-monitor` endpoint on `*/10 * * * *` (UTC, every ten minutes). It runs externally to Vercel, not on Wangsheng's laptop. The endpoint independently discovers provider orders, then compares actual successful Waffo payments/refunds with our financial receipts and allowance boundaries. A wholly missed webhook cannot hide simply because our own database never saw the order.

Recipient is fixed by the Cloudflare email binding: **wustwangsheng@gmail.com**. Sender is `studio@dlss5nvidia.com`, display name `DLSS5 billing alerts`. The API cannot choose an arbitrary recipient. Subjects begin `[DLSS5 billing]`.

- Paid-but-not-granted, missing receipt/ledger, refund discrepancies and provider/local identity or amount mismatches: issue mail.
- `past_due`: renewal-failure mail. No invented next-period quota or early termination of the already-paid period.
- Verified webhook processing failure: stored outside financial records, checked on each sweep; a later successful retry resolves it.
- Provider/database/pagination failure: `INCOMPLETE` mail, never a false healthy result.
- The same unchanged incident is suppressed after successful mail acceptance, then reminded daily while unresolved; new issue fingerprints notify on the next sweep. A recovery mail follows a previously notified incident.
- If the Vercel endpoint times out/is unavailable/returns a bad response, the scheduled Worker sends `MONITOR UNAVAILABLE` directly, independently of Vercel/Firestore. It repeats every ten minutes during that outage. A total Cloudflare/email-provider outage can still prevent delivery; this is not a guaranteed delivery SLA.

Operational records: `billing_monitor_state/prod` (last completion, coverage, notification state), `billing_monitor_incidents/*` (issue codes/references), `waffo_webhook_failures/*` (verified processing failures). No public client permissions are granted to these collections. No private key, complete webhook body, card details or checkout bearer URL is emailed or stored there.

Current bounded coverage: discovery pages of 25, maximum 20 pages; detailed inspection maximum 50 orders per run and maximum ten pages per financial subcollection. Capacity exhaustion is explicitly incomplete and alerts, rather than silently skipping. Raise/partition capacity before the store exceeds this size. Concurrency uses a six-minute lease (longer than the function's five-minute maximum); failed notification is retried and is never marked delivered. Email API acceptance does not itself prove inbox arrival.

## Manual recovery: never invent credits

1. Open the alert and record its incident ID/order ID and processing time. Confirm **production**, store `STO_3Cs3yPzz5yiIKAnkww4y5f`, actual customer binding and product before doing anything. Do not ask the customer to pay again merely because our entitlement is late.
2. In Waffo's merchant dashboard, verify actual successful charge, currency/amount, period number and canonical order end; check cumulative successful refunds. A checkout return, screenshot, pending/authorized charge or failed payment is not proof of payment.
3. Run the read-only bounded reconciliation CLI below using authorized production credentials. Save its report in restricted operations storage. If it is incomplete, obtain complete provider evidence first; do not adjust balances from a partial report.
4. For a missing/retryable notification: request redelivery of the **original provider-signed event** through Waffo's delivery tooling/support. No specific dashboard button or undocumented replay API is assumed here. If unavailable, contact Waffo support with the order/payment/event ID. Do not fabricate a webhook, disable signature verification or edit a payment receipt to force a retry. The existing store then verifies canonical order/environment/product/customer/period and applies its transaction exactly once. Replayed payments do not reset credits already spent.
5. If the payment is already marked processed but inconsistent (`current_paid_period_ungranted`, duplicate chain, balance drift), stop the replay loop. Archive the reconciliation evidence and escalate to Wangsheng for an explicit, reviewed account-specific correction. There is deliberately no generic “add N credits” endpoint and no automatic rewriting of historical receipts. Any approved correction must have a unique incident/payment reference, immutable before/after ledger evidence, transactional concurrency protection and a duplicate-replay test before execution. Until then the case remains unresolved.
6. Re-run reconciliation after recovery. Require complete coverage and zero relevant errors, inspect the affected account's allowance/end without resetting spending, then record operator, time, original provider transaction, action, before/after report and customer communication in the incident case. The automated next sweep should send RECOVERED; never manually erase unresolved evidence to silence mail.
7. For `past_due`/failed renewal: check Waffo's payment result and ask the customer to use Waffo's offered payment-update flow or contact support. Do not claim a specific automatic retry schedule without provider evidence. Preserve the existing paid endpoint; restore the next allowance only after verified successful payment.

Read-only CLI (credentials supplied by the authorized operator through environment, never committed or copied into a ticket):

```bash
npm run billing:reconcile -- --environment prod \
  --store STO_3Cs3yPzz5yiIKAnkww4y5f --order ORD_REPLACE_WITH_VERIFIED_ORDER \
  --out /restricted/incident/reconciliation.json
```

Exit 0: complete/pass; 1: confirmed issue; 2: incomplete/start failure. This CLI never mutates financial records. Incident checklist: `incident ID / operator / environment / order / payment / customer binding verified / amount+currency / period / refunds / before report / approved action / after report / duplicate check / customer reply / resolved time`.

## Safe acceptance and owner real payment

Offline tests inject missing-payment/renewal/provider/email failures, repeat/concurrent checks, daily reminders and recovery. A production **email-only TEST** drill exercises the real notification path without a card charge, quota grant or subscription change. Its subject explicitly says TEST. Scheduler execution must be observed separately from a manual endpoint invocation; results and delivery evidence are archived in the dated operations artifacts.

Wangsheng performs the real small payment. Afterwards check Waffo **production succeeded payment**, our receipt and allowance, then await actual settlement separately. Waffo production enabled is not proof of revenue; test payments, refunds, fees and bank settlement must not be conflated.

## Acceptance follow-up: Worker runtime compatibility

The first real 10:40 UTC cron invocation on 2026-11-22 correctly emitted an infrastructure-failure email, received in Wangsheng's inbox. The cause was our use of `redirect: "error"`: Cloudflare Workers throws a `TypeError` before sending that request. This was not a payment failure, and the original generic fault message was not enough to diagnose the cause.

The shared cron/probe check now uses `redirect: "manual"` and treats all non-2xx responses, including 3xx, as failure without forwarding the authorization header. A bearer-protected `/billing-monitor-probe` on the existing mail Worker tests the exact same fixed-target code and returns only safe status/error categories, never a raw provider response. Production proof: before = fetch-stage TypeError/category redirect; after = HTTP 200/ok true. Actual next scheduled completion is recorded separately from this manual probe.

Primary source verified: https://developers.cloudflare.com/workers/runtime-apis/request/ (redirect modes section). Offline Node fetch mocks were extended to require Worker-compatible manual redirect mode; an external redirect is tested as failure and never followed.

An email-only production drill was actually received in `wustwangsheng@gmail.com` INBOX, with SPF and DKIM pass. The archived drill and infrastructure-warning mail contain no customer payment data. The production provider read at 2026-11-22T10:33:47Z had no successful or other payment rows; Stripe configuration was Test and PayPal Sandbox. This is a timestamped observation, not a permanent revenue assertion. Later real payments must be checked afresh.
