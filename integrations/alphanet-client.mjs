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

  // model 决定能力线：'flux-klein'（生成式精修，需 prompt）或 'pixrestore-s'（细节增强，只吃 1 张图）。
  // 上传票据接口同样要带上 model（网关按渠道的模型清单校验）。
  createUpload({ fileName, contentType, size, model = 'flux-klein' }) {
    return this.request('/v1/flux/uploads', {
      body: { model, file_name: fileName, content_type: contentType, size },
    });
  }

  submit(input, idempotencyKey) {
    if (!idempotencyKey) throw new Error('Persist an idempotency key before submitting');
    const model = input.model ?? 'flux-klein';
    return this.request('/v1/tasks/alphanet-flux', {
      body: { ...input, model }, idempotencyKey,
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
