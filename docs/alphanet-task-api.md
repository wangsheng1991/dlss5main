# AlphaNet task API changes

Base: New API v1.0.0-rc.37, commit 385d2dfd10d821b25c8a6766bd16eea248cb1652.
Branch: alphanet/task-idempotency. This is an isolated backend validation build, not a production rollout or a finished dashboard.

## Request contract

The generic `POST /v1/tasks/:plugin` route supports `Idempotency-Key` (1–128 bytes). Authentication and channel/model authorization run on every request, including replays. The claim is persisted before relay billing or upstream submission. Its scope is the authenticated user ID, token ID and request key; rotating a token changes the scope. Use separate New API accounts for separate SaaS projects; this patch does not change task read permissions between keys on the same account.

- Reuse the SAME key and identical request bytes for retries of one intended operation. The fingerprint also includes method, request URI and content type. Formatting-only body changes also conflict.
- A completed submission returns its original HTTP status and JSON body, with `Idempotency-Replayed: true`. It replays the submission acknowledgement, not a fresh task status; query the returned task ID for status.
- Different content with the same key returns 409 `idempotency_key_conflict`.
- Concurrent or interrupted pending submissions return 409 `submission_pending_or_uncertain`, with Retry-After: 2. Retry using the same key. Persistent uncertainty requires operator reconciliation, not a fresh key or deleting the journal row.
- A revoked/unauthorized token cannot bypass authorization via the replay journal.
- Gateway-internal channel retries are suppressed for claimed requests: an upstream timeout may mean accepted work.
- Requests without the header preserve upstream behavior. Native provider routes, streaming, multipart and other APIs are not covered by this patch. Callers must set the header to obtain the guarantee.

The journal persists across restarts and does not automatically expire rows. It stores hashes and a bounded response, not API credentials or request bodies. Responses over 32 KiB fail closed so storage fits MySQL TEXT and memory use is bounded. No response headers containing credentials/cookies are persisted.

This is at-most-one gateway submission for each claim, not exactly-once billing across arbitrary crashes. If a process dies between upstream acceptance, task persistence and billing completion, the claim blocks replay but may need manual task/balance reconciliation. That recovery workflow is not implemented. New API's existing multi-step refund code has not been made atomic by this change. Do not mark the whole platform production-ready on the strength of normal-path refund tests.

## Short image task polling

Set `ASYNC_TASK_POLL_INTERVAL_SECONDS=1` or `2` on the isolated instance. Accepted range is 1–15; missing, malformed and out-of-range values fall back to upstream's 15 seconds. Restart to apply. The task runner idle/scheduler interval follows this lower bound while other scheduled handlers keep their own intervals and existing per-type locks. Faster polling increases scheduler database traffic; use a dedicated image-task instance initially.

For the dedicated local image channel, set `settings.disable_task_polling_sleep=true` using the existing channel settings API. This removes the existing one-second spacing between task queries. Other channels retain their settings. The new interval is a cadence, not a maximum latency promise: slow upstream queries or a backlog can take longer.

## Verification on 2026-09-15

Build toolchain: Go 1.27.1 on macOS arm64; Linux amd64 binary built with CGO_ENABLED=0. SQLite implementation: modernc.org/sqlite v1.40.1, bundled SQLite 3.50.4 (lib/sqlite_linux_amd64.go SQLITE_VERSION). Database containers: MySQL 8.0.46, PostgreSQL 16.15. Both were on a Docker internal network with no published ports.

Commands:

```sh
go test ./common ./model ./middleware ./controller -run 'TestAsyncTaskPollInterval|TestTaskIdempotency' -count=1
go test ./controller ./service ./router -run 'Test.*(SystemTask|TaskSubmission|TaskRelay|TaskRouter|TaskIdempotency)' -count=1
CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go test -c ./model -o model-tests-linux
# Set IDEMPOTENCY_MYSQL_DSN and IDEMPOTENCY_POSTGRES_DSN to disposable test databases.
./model-tests-linux -test.run TestTaskIdempotencyDatabase -test.v
```

All passed. Database tests exercised real SQLite, MySQL and PostgreSQL: a fresh journal, repeated migration, preservation of representative pre-existing task data, 20 competing claims yielding one owner, prevention of completing a record twice, and replay/pending preservation after opening a new connection. The live SQLite app also started twice against a copy of the previous release's lab database. No primary/log database driver dependencies were changed; the new table is migrated only in the primary database.

Live HTTP tests used the rebuilt New API with real admin/token/channel APIs and a mock upstream inside an isolated container:

- Same-key sequential retry returned the identical task ID, without additional upstream submission or charge.
- 12 simultaneous same-key requests: one accepted submission, 11 pending 409s; subsequent retry returned the accepted task ID.
- Changed prompt with the same key: 409.
- Three distinct operations (success, concurrent success, failure) produced exactly three upstream submissions. Two successes cost 10000 test quota units total; the failed operation refunded its 5000-unit reservation.
- Ten task reads did not change balance.
- Immediate-upstream terminal states became visible 1.543–1.551 seconds after the first submission in this run. Baseline was about 21–23 seconds. These numbers measure mock-upstream gateway behavior, not real GPU/R2 end-to-end performance.
- Restarting the actual container with the mock upstream absent still replayed the same task ID and preserved balance (99980000 before/after).
- Middleware panic simulation preserved a pending claim and blocked a second upstream call. This is not a complete process-kill/billing-recovery test.

The test Linux executable embeds a minimal placeholder instead of the production web bundle. Build and verify the upstream web assets before deploying an actual administrator UI. Upstream branding and license files remain unchanged.

Security references reviewed: [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html), [Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html), [ASVS project](https://owasp.org/www-project-application-security-verification-standard/). Applicable controls here: authorization on every replay, binding claims to server-derived identity, no credential logging, fail-closed persistence and bounded inputs. Existing login/session mechanisms are unchanged; no claim of full ASVS compliance is made.

## Remaining integration

Update: the real GPU/R2 normal-path integration and actual dashboard build have now passed; see [real-flow.md](real-flow.md) and its rollout boundaries. The following was the remaining-work list after the first patch.

Connect the real GPU service and R2 upload/result ownership checks; add friendly SDK handling of pending 409s; implement uncertain-task reconciliation; test real images, quota exhaustion/concurrency and forced process interruption; build and review the actual dashboard. Production `api.alphanetplus.com` remains on the existing service until these checks pass.
