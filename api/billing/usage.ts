import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  const token = (req.headers.authorization || '').startsWith('Bearer ') ? req.headers.authorization!.slice(7) : '';
  const apiKey = process.env.FIREBASE_WEB_API_KEY;
  const project = process.env.FIREBASE_PROJECT_ID;
  const database = process.env.FIREBASE_DATABASE_ID;
  if (!token || !apiKey || !project || !database) return res.status(401).json({ error: 'Authentication required' });
  try {
    const auth = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${encodeURIComponent(apiKey)}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ idToken: token }), signal: AbortSignal.timeout(10_000),
    });
    if (!auth.ok) return res.status(401).json({ error: 'Invalid authentication token' });
    const uid = (await auth.json() as { users?: Array<{ localId?: string }> }).users?.[0]?.localId;
    if (!uid) return res.status(401).json({ error: 'Invalid authentication token' });
    const account = await fetch(`https://firestore.googleapis.com/v1/projects/${project}/databases/${database}/documents/users/${uid}`, { headers: { Authorization: `Bearer ${token}` }, signal: AbortSignal.timeout(10_000) });
    if (!account.ok) return res.status(404).json({ error: 'Account not found' });
    const fields = (await account.json() as { fields?: Record<string, { stringValue?: string; integerValue?: string }> }).fields || {};
    return res.status(200).json({ tier: fields.tier?.stringValue || 'free', credits: Number(fields.credits?.integerValue || 0) });
  } catch (error) {
    console.error('Billing usage lookup failed', error);
    return res.status(503).json({ error: 'Billing service unavailable' });
  }
}
