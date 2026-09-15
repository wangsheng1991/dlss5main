import type { VercelRequest } from '@vercel/node';

export async function requireUser(req: VercelRequest) {
  const value = req.headers.authorization || '';
  const idToken = value.startsWith('Bearer ') ? value.slice(7) : '';
  if (!idToken) throw Object.assign(new Error('Authentication required'), { status: 401 });
  const key = process.env.FIREBASE_WEB_API_KEY;
  if (!key) throw Object.assign(new Error('Authentication is not configured'), { status: 503 });
  const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${encodeURIComponent(key)}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ idToken }), signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) throw Object.assign(new Error('Invalid authentication token'), { status: 401 });
  const data = await response.json() as { users?: Array<{ localId?: string; email?: string; displayName?: string }> };
  const account = data.users?.[0];
  const uid = account?.localId;
  if (!uid) throw Object.assign(new Error('Invalid authentication token'), { status: 401 });
  return { uid, idToken, email: account?.email || '', displayName: account?.displayName || '' };
}

export function fail(res: { status: (n: number) => { json: (v: unknown) => unknown } }, error: unknown) {
  const e = error as { status?: number; message?: string };
  return res.status(e.status || 500).json({ error: e.message || 'Request failed' });
}
