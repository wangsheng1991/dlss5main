# Production checkout: Waffo only — 2026-11-22

Serves R1/R3/R5: sell and reliably deliver the existing DLSS 5 style-conversion / Studio product through the verified production payment provider. No changes to price, quotas, positioning, SEO head tags or support promises.

## Authorized change

Wangsheng explicitly requested closure of the Stripe and PayPal test purchase entry points, production Waffo only, with history retained. This changes availability, not the historical meaning of a test payment.

| Surface | Before | After |
| --- | --- | --- |
| Production catalog | v4: Stripe `billingEnabled:true`, PayPal enabled/Sandbox, Waffo enabled/prod | v5: `legacyPaymentsEnabled:false`, Stripe billing disabled, PayPal and Dodo disabled; Waffo enabled only with prod configuration |
| Pricing UI | A legacy account or an unavailable Waffo lane could fall back to older payment choices | Legacy controls require explicit legacy-enabled catalog flag; production offers Waffo or contact/support, never a legacy checkout fallback |
| Direct old checkout/change/confirmation calls | Route could authenticate and invoke a legacy provider (new-purchase handlers already rejected while Waffo enabled) | Production router returns 410 before auth, body reading, database writes or provider calls, including GET confirmation URLs |
| Old Stripe/PayPal/Dodo webhook | Could process a signed test event | Production returns 200 `handled:false`, `provider_disabled_in_production`; no entitlement changes or retry storm |
| Shared billing portal | Could create a Stripe portal for a historical binding | Waffo portal remains; legacy branch returns 410 before creating an external portal |
| Waffo configuration | Enabling Test credentials could expose a test checkout if misconfigured | Production additionally requires Waffo environment `prod`; otherwise checkout is unavailable, with no fallback to test |
| History | Existing users, provider bindings and billing records | Preserved; no deletes, provider cancellations, balance rewrites or key removals |

`server/payment-policy.ts` is the common production rule. `VERCEL_ENV=production` cannot be overridden by a request or a legacy-enabled flag. Local/preview testing keeps its existing isolated behavior. The plans response is `no-store`; the revised frontend requests a versioned catalog URL and defaults legacy availability to false, avoiding an old cached v4 response enabling a fallback.

A known PayPal **Sandbox + own status APPROVAL_PENDING** binding may stop blocking a new real Waffo purchase only in production, with `PAYPAL_ENV=sandbox` explicit and a prod Waffo intent. The old binding is preserved. The same classifier is used both before creating an intent and when applying a verified payment, avoiding collecting money then rejecting its entitlement. Active/approved/unknown legacy bindings and absent environment evidence still require manual resolution. No generic subscription status alone is treated as proof of a harmless pending PayPal record.

## Validation and limits

Offline tests cover production route guards with request-body/auth/provider access traps, catalog flags despite configured test keys, GET confirmation, disabled callbacks, Waffo/shared history routes, preview behavior, and strict migration boundaries. Transaction tests preserve the pending PayPal fields, grant the Waffo period once, and preserve spending on duplicate replay; active/unknown legacy bindings reject with zero writes. Existing concurrency, webhook replay and authorization regressions remain in the full suite.

No real card payment is performed. Waffo's real small payment remains Wangsheng's action. A normal authenticated customer can proceed through Waffo; an old active/unknown provider binding may still require support rather than silently canceling anything.

Production acceptance artifacts live at `/Users/wangsheng/code/shou/artifacts/waffo-only-20261122/`: before/after catalog, direct route results (including no checkout URL/redirect), history binding/financial-record digests and final test/build/gate/deployment receipts. API 410 is not a deletion of historical orders. This closes the site's own entry points; it does not delete third-party records or rewrite a previously issued external URL.
