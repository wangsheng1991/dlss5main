// Server-side client for Vercel/Node. Never expose apiKey in a browser bundle.
export class AlphaNetClient {
  constructor({ baseUrl, apiKey }) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.apiKey = apiKey;
  }

  async request(path, { body, idempotencyKey } = {}) {
    const response = await fetch(this.baseUrl + path, {
      method: body === undefined ? 'GET' : 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        ...(idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {}),
      },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
      signal: AbortSignal.timeout(35_000),
      cache: 'no-store',
    });
    const result = await response.json();
    if (!response.ok) {
      // An uncertain submission must retain its original key. Never auto-create
      // a replacement task after a timeout or a pending 409.
      const error = new Error(`AlphaNet request failed (${response.status})`);
      error.status = response.status;
      error.code = typeof result.error === 'string' ? result.error : result.error?.code;
      throw error;
    }
    return result;
  }

  createUpload({ fileName, contentType, size }) {
    return this.request('/v1/flux/uploads', {
      body: { model: 'flux-klein', file_name: fileName, content_type: contentType, size },
    });
  }

  submit(input, idempotencyKey) {
    if (!idempotencyKey) throw new Error('Persist an idempotency key before submitting');
    return this.request('/v1/tasks/alphanet-flux', {
      body: { ...input, model: 'flux-klein' }, idempotencyKey,
    });
  }

  // Durations in milliseconds; report the first observation only. Call from
  // your SaaS backend after checking the end user's ownership of this task.
  reportTimings(taskId, durations) {
    return this.request(`/v1/tasks/${encodeURIComponent(taskId)}/telemetry`, { body: durations });
  }

  timings(taskId) {
    return this.request(`/v1/tasks/${encodeURIComponent(taskId)}/timings`);
  }

  status(taskId) {
    return this.request(`/v1/tasks/${encodeURIComponent(taskId)}`);
  }

  // A completed response contains result.images; no separate result() call needed.
  // Use one long-lived Node runtime; built-in fetch pools connections automatically.
  poll(taskId) {
    return this.request(`/v1/tasks/${encodeURIComponent(taskId)}?include_result=true`);
  }

  result(taskId) {
    return this.request(`/v1/tasks/${encodeURIComponent(taskId)}/result`);
  }
}
