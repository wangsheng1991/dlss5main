/**
 * Delivers a DLSS5 Studio download request to the one inbox that answers them.
 *
 * This is a separate Worker rather than more code in the Vercel function because sending mail
 * through Cloudflare Email Routing is only available as a Worker binding — there is no HTTP API for
 * it. The Vercel route records the request and calls this with the shared secret in a header.
 *
 * Registering the binding also fixes the recipient: Cloudflare only lets `send_email` deliver to a
 * verified destination address on the account, which is exactly the one person who replies to these
 * requests. The visitor's own address goes in `replyTo`, so answering the mail answers them.
 *
 * Deploy: see README.md. The secret is `STUDIO_SHARED_SECRET` and must match the Vercel variable.
 */

const MAX = { email: 200, uid: 64, note: 2000, machine: 200 };

/** Throws a short, quotable reason instead of forwarding whatever arrived. */
function clean(value, limit) {
  if (typeof value !== 'string') return '';
  // Control characters would let a caller forge extra headers or fake lines in the body.
  return value.replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, limit);
}

function buildBody(fields, receivedAt) {
  return [
    'A DLSS5 Studio download request arrived through the site.',
    '',
    `Account: ${fields.email || '(no address on the account)'}`,
    `User ID: ${fields.uid}`,
    `Machine: ${fields.machine || '(not stated)'}`,
    '',
    'What they want to process:',
    fields.note || '(left blank)',
    '',
    `Received: ${receivedAt}`,
    'Reply to this mail and it goes straight back to the account above.',
  ].join('\n');
}

export default {
  async fetch(request, env) {
    if (request.method !== 'POST') {
      return new Response('method not allowed', { status: 405 });
    }
    // Constant-ish comparison is not the point here: this endpoint only ever sends to one fixed
    // address, so a wrong secret costs an attacker nothing more than a failed request. The trim is
    // for the pipe that sets the variable — a trailing newline from `env add` must not break it.
    const presented = (request.headers.get('x-studio-secret') || '').trim();
    const expected = (env.STUDIO_SHARED_SECRET || '').trim();
    if (!expected || presented !== expected) {
      return new Response('forbidden', { status: 403 });
    }

    let payload;
    try {
      payload = await request.json();
    } catch {
      return new Response('bad json', { status: 400 });
    }

    const fields = {
      email: clean(payload?.email, MAX.email),
      uid: clean(payload?.uid, MAX.uid),
      note: clean(payload?.note, MAX.note),
      machine: clean(payload?.machine, MAX.machine),
    };
    if (!fields.uid) {
      return new Response('missing account', { status: 400 });
    }

    const receivedAt = new Date().toISOString();
    try {
      await env.STUDIO_EMAIL.send({
        to: env.STUDIO_NOTIFY_TO,
        from: { email: env.STUDIO_FROM, name: 'DLSS5 Studio requests' },
        // Cloudflare Email Service uses camelCase for the structured Reply-To field.
        // Using reply_to silently omits the header, so Gmail replies to STUDIO_FROM instead.
        replyTo: fields.email || env.STUDIO_NOTIFY_TO,
        subject: `Studio request · ${fields.email || fields.uid}`,
        text: buildBody(fields, receivedAt),
      });
    } catch (error) {
      // The caller records the failure and keeps the request, so a mail outage never loses one.
      return Response.json({ ok: false, error: String(error?.message || error) }, { status: 502 });
    }

    return Response.json({ ok: true, at: receivedAt });
  },
};
