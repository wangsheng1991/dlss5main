# `studio-mailer` — the Worker that delivers a download request

Cloudflare Email Routing can only send mail from a Worker binding, so this one route lives outside
the Vercel app. `/api/studio/request` records the request in Firestore and then POSTs here.

## Why the recipient is fixed in the binding

`[[send_email]]` carries a `destination_address`, and Cloudflare only delivers to an address that is
verified on the account. That is the whole point: the Worker cannot be turned into a relay that
mails anyone else, no matter what a caller sends. The visitor's own address is passed as `replyTo`,
so answering the notification answers them.

## Deploy

Both `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` are already in the vault; wrangler reads them
from the environment. The secret must be the same value the Vercel project holds as
`STUDIO_NOTIFY_SECRET`:

```bash
cd workers/studio-mailer
printf '%s' "$STUDIO_NOTIFY_SECRET" | npx --yes wrangler secret put STUDIO_SHARED_SECRET
npx --yes wrangler deploy
```

`wrangler.toml` names the Worker, its `workers.dev` host and the binding. Changing
`destination_address` requires that address to be verified under Cloudflare → Email → Email Routing
first; the account currently has one verified destination, the inbox that answers these requests.

## Contract

`POST` with `x-studio-secret: <STUDIO_SHARED_SECRET>` and a JSON body of
`{ email, uid, note, machine, kind? }`. `200 {"ok":true}` means Cloudflare accepted the mail for delivery;
`403` means the secret is wrong, `400` a malformed body, `502` that Email Routing refused it — the
caller stores the failure alongside the request so nothing is lost while mail is down.


`kind: "runtime"` selects a DLSS runtime-files subject and body. `note` carries the
purpose and target game/development scenario; the runtime route prefixes these as
`Purpose:` and `Scenario:`. Runtime notes allow 4030 characters to preserve both
2000-character fields and their labels. Missing or other `kind` values retain the
existing Studio subject, body and limits unchanged. Account, uid, machine, fixed
destination, shared-secret validation and reply-to behaviour are unchanged.

`/api/dlss-runtime/request` commits to `dlssRuntimeRequests` before notification.
It records `notified: true` only after a successful Worker response with `ok: true`;
configuration, timeout or send failures leave `notified: false` with `notifyError`.
HTTP acceptance is not proof of inbox arrival or delivery of any runtime files.
No binaries are accepted or sent by this Worker.
