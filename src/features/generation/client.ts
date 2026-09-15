import { apiUrl } from '../../lib/api';
export class ApiError extends Error { constructor(message: string, public status: number) { super(message); } }
export async function request(path: string, token: string, options: RequestInit = {}) {
  const response = await fetch(apiUrl(path), { ...options, signal: AbortSignal.timeout(30000), headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, ...options.headers } });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new ApiError(response.status === 402 ? 'Not enough credits. Check your balance or plan.' : response.status === 401 ? 'Your session expired. Sign in again to resume this operation.' : typeof data.error === 'string' ? data.error : data.error?.message || `Request failed (${response.status}). Please try resuming.`, response.status);
  return data;
}
