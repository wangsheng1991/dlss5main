import type { VercelRequest, VercelResponse } from '@vercel/node';
import { fal } from '@fal-ai/client';

/** Server-side proxy for GPT Image 2. Never expose FAL_KEY to the browser. */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const authHeader = req.headers.authorization || '';
  const idToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
  if (!idToken) return res.status(401).json({ error: 'Authentication required' });
  // Lightweight token validation without shipping a Firebase service-account key.
  const firebaseApiKey = process.env.FIREBASE_WEB_API_KEY;
  if (!firebaseApiKey) return res.status(503).json({ error: 'Authentication is not configured' });
  let tokenResponse: Response;
  try {
    tokenResponse = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${encodeURIComponent(firebaseApiKey)}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ idToken }),
      signal: AbortSignal.timeout(10_000),
    });
  } catch (error) {
    console.error('Firebase token validation unavailable', error);
    return res.status(503).json({ error: 'Authentication service unavailable' });
  }
  if (!tokenResponse.ok) return res.status(401).json({ error: 'Invalid authentication token' });
  const tokenData = await tokenResponse.json() as { users?: Array<{ localId?: string }> };
  const uid = tokenData.users?.[0]?.localId;
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const databaseId = process.env.FIREBASE_DATABASE_ID;
  if (!uid || !projectId || !databaseId) return res.status(503).json({ error: 'Quota service is not configured' });
  const key = process.env.FAL_API_KEY || process.env.FAL_KEY;
  if (!key) return res.status(503).json({ error: 'FAL_API_KEY is not configured' });
  const { prompt, image_urls, image_url, image_size = 'auto' } = req.body || {};
  if (typeof prompt !== 'string' || !prompt.trim()) return res.status(400).json({ error: 'prompt is required' });
  if (prompt.length > 4000) return res.status(413).json({ error: 'prompt is too long' });
  const urls = Array.isArray(image_urls) ? image_urls : image_url ? [image_url] : [];
  if (!urls.length || urls.some((u) => typeof u !== 'string' || !(/^(https?:\/\/|data:image\/)/.test(u)))) {
    return res.status(400).json({ error: 'a public image URL or image data URI is required' });
  }
  if (urls.length > 16) return res.status(413).json({ error: 'too many reference images' });
  const userUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/${databaseId}/documents/users/${uid}`;
  const accountResponse = await fetch(userUrl, { headers: { Authorization: `Bearer ${idToken}` }, signal: AbortSignal.timeout(10_000) });
  if (!accountResponse.ok) return res.status(403).json({ error: 'Unable to read account quota' });
  const account = await accountResponse.json() as { updateTime?: string; fields?: { credits?: { integerValue?: string } } };
  const credits = Number(account.fields?.credits?.integerValue ?? 0);
  if (!Number.isSafeInteger(credits) || credits < 1 || !account.updateTime) return res.status(402).json({ error: 'Insufficient credits' });
  const debitResponse = await fetch(userUrl, { method: 'PATCH', headers: { Authorization: `Bearer ${idToken}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ fields: { credits: { integerValue: String(credits - 1) } }, currentDocument: { updateTime: account.updateTime } }), signal: AbortSignal.timeout(10_000) });
  if (!debitResponse.ok) return res.status(409).json({ error: 'Quota changed; please retry' });
  try {
    fal.config({ credentials: key });
    const result = await Promise.race([
      fal.subscribe('openai/gpt-image-2/edit', {
      input: { prompt: prompt.trim(), image_urls: urls.slice(0, 16), image_size, quality: 'low', num_images: 1, output_format: 'png' },
      }),
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error('FAL request timed out')), 120_000)),
    ]);
    const url = (result.data as { images?: Array<{ url?: string }> })?.images?.[0]?.url;
    if (!url) return res.status(502).json({ error: 'FAL returned no image' });
    return res.status(200).json({ success: true, image_url: url, request_id: result.requestId });
  } catch (error) {
    console.error('FAL GPT Image 2 request failed', error);
    return res.status(502).json({ error: 'Image generation failed' });
  }
}
