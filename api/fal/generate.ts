import type { VercelRequest, VercelResponse } from '@vercel/node';
import { fal } from '@fal-ai/client';

/** Server-side proxy for GPT Image 2. Never expose FAL_KEY to the browser. */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const key = process.env.FAL_API_KEY || process.env.FAL_KEY;
  if (!key) return res.status(503).json({ error: 'FAL_API_KEY is not configured' });
  const { prompt, image_urls, image_url, image_size = 'auto' } = req.body || {};
  if (typeof prompt !== 'string' || !prompt.trim()) return res.status(400).json({ error: 'prompt is required' });
  const urls = Array.isArray(image_urls) ? image_urls : image_url ? [image_url] : [];
  if (!urls.length || urls.some((u) => typeof u !== 'string' || !(/^(https?:\/\/|data:image\/)/.test(u)))) {
    return res.status(400).json({ error: 'a public image URL or image data URI is required' });
  }
  try {
    fal.config({ credentials: key });
    const result = await fal.subscribe('openai/gpt-image-2/edit', {
      input: { prompt: prompt.trim(), image_urls: urls.slice(0, 16), image_size, quality: 'low', num_images: 1, output_format: 'png' },
    });
    const url = (result.data as { images?: Array<{ url?: string }> })?.images?.[0]?.url;
    if (!url) return res.status(502).json({ error: 'FAL returned no image' });
    return res.status(200).json({ success: true, image_url: url, request_id: result.requestId });
  } catch (error) {
    console.error('FAL GPT Image 2 request failed', error);
    return res.status(502).json({ error: 'Image generation failed' });
  }
}
