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

function buildRuntimeBody(fields, receivedAt) {
  return [
    'A request for the DLSS runtime files arrived through the site.',
    '',
    `Account: ${fields.email || '(no address on the account)'}`,
    `User ID: ${fields.uid}`,
    `Machine: ${fields.machine || '(not stated)'}`,
    '',
    'Purpose / target game or development scenario:',
    fields.note || '(left blank)',
    '',
    `Received: ${receivedAt}`,
    'Reply to this mail and it goes straight back to the account above.',
  ].join('\n');
}

async function sendBilling(env, subject, text) {
  await env.STUDIO_EMAIL.send({
    to: env.STUDIO_NOTIFY_TO,
    from: { email: env.STUDIO_FROM, name: 'DLSS5 billing alerts' },
    replyTo: env.STUDIO_NOTIFY_TO,
    subject: clean(subject, 180), text: text.slice(0, 16000),
  });
}

async function checkBilling(env) {
  if (!env.BILLING_MONITOR_SECRET || !env.BILLING_MONITOR_URL) return { ok: false, reason: 'missing_monitor_configuration' };
  let stage = 'fetch';
  try {
    const response = await fetch(env.BILLING_MONITOR_URL, {
      headers: { authorization: `Bearer ${env.BILLING_MONITOR_SECRET}`, 'user-agent': 'Mozilla/5.0 (compatible; DLSS5BillingMonitor/1.0; +https://www.dlss5nvidia.com)' },
      // Workers does not implement redirect:error; manual also prevents credential forwarding.
      signal: AbortSignal.timeout(210000), redirect: 'manual',
    });
    if (!response.ok) {
      const body = await response.text();
      const edgeCode = /error code:\s*(\d{3,5})/i.exec(body)?.[1];
      return { ok: false, reason: 'endpoint_http_error', status: response.status, ...(edgeCode ? { edgeCode } : {}) };
    }
    stage = 'parse';
    return (await response.json()).ok === true ? { ok: true, status: response.status } : { ok: false, reason: 'invalid_monitor_response' };
  } catch (error) {
    const message = String(error?.message || '');
    const category = /redirect/i.test(message) ? 'redirect' : /AbortSignal|signal/i.test(message) ? 'signal' : /timeout|timed out/i.test(message) ? 'timeout' : 'other';
    return { ok: false, reason: 'endpoint_network_or_response_error', stage, category, errorType: ['TypeError', 'SyntaxError', 'TimeoutError', 'AbortError'].includes(error?.name) ? error.name : 'Error' };
  }
}

export default {
  async scheduled(controller, env, ctx) {
    ctx.waitUntil((async () => {
      const result = await checkBilling(env);
      if (!result.ok) {
        await sendBilling(env, '[DLSS5 billing] MONITOR UNAVAILABLE',
          `The scheduled billing check could not complete.\nTime: ${new Date().toISOString()}\nDiagnostic: ${JSON.stringify(result)}\nCheck Vercel /api/billing/waffo-monitor and billing_monitor_state/prod.\nNo automatic balance changes were made. This warning repeats every 10 minutes while the outage persists.`);
      }
    })());
  },
  async fetch(request, env) {
    // Same check as cron, safely observable without exposing any credential or
    // allowing the caller to select a target URL. Does not send a test email.
    if (new URL(request.url).pathname === '/billing-monitor-probe') {
      if (request.method !== 'GET' || !env.BILLING_MONITOR_SECRET || request.headers.get('authorization') !== `Bearer ${env.BILLING_MONITOR_SECRET}`) return new Response('forbidden', { status: 403 });
      const result = await checkBilling(env);
      return Response.json(result, { status: result.ok ? 200 : 502 });
    }
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

    if (payload?.kind === 'billing-alert') {
      const subject = clean(payload.subject, 180);
      const text = typeof payload.text === 'string' ? payload.text : '';
      if (!subject.startsWith('[DLSS5 billing]') || !text || !clean(payload.incidentId, 200)) return Response.json({ ok: false }, { status: 400 });
      try { await sendBilling(env, subject, text); }
      catch { return Response.json({ ok: false, error: 'Billing email not accepted' }, { status: 502 }); }
      return Response.json({ ok: true, at: new Date().toISOString() });
    }
    const runtime = payload?.kind === 'runtime';
    const fields = {
      email: clean(payload?.email, MAX.email),
      uid: clean(payload?.uid, MAX.uid),
      note: clean(payload?.note, runtime ? 4030 : MAX.note),
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
        subject: runtime ? `DLSS runtime files request · ${fields.email || fields.uid}` : `Studio request · ${fields.email || fields.uid}`,
        text: runtime ? buildRuntimeBody(fields, receivedAt) : buildBody(fields, receivedAt),
      });
    } catch (error) {
      // The caller records the failure and keeps the request, so a mail outage never loses one.
      return Response.json({ ok: false, error: String(error?.message || error) }, { status: 502 });
    }

    return Response.json({ ok: true, at: receivedAt });
  },
};
