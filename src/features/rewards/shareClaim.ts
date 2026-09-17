import type { User } from 'firebase/auth';
import { request } from '../generation/client';
import { SHARE_REWARD } from '../../config/promos';

export interface ShareClaimResult { granted: boolean; awarded: number; credits: number; bonusCredits: number }

/**
 * Sends the screenshot of a post and collects the share reward. The screenshot travels through the
 * same upload ticket the generator uses, so the server can prove it came from this account.
 * There is no review step: the credits are granted by the server as soon as the upload is bound.
 */
export async function claimShareReward(user: User, screenshot: File): Promise<ShareClaimResult> {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(screenshot.type) || !screenshot.size || screenshot.size > 20 * 1024 * 1024) {
    throw new Error('Send a JPEG, PNG or WebP screenshot up to 20 MiB.');
  }
  const token = await user.getIdToken();
  // The upload API only accepts plain file names, and a phone screenshot name is rarely plain.
  const extension = screenshot.type === 'image/png' ? 'png' : screenshot.type === 'image/webp' ? 'webp' : 'jpg';
  const ticket = await request('/api/image-edit/upload', token, {
    method: 'POST',
    body: JSON.stringify({ fileName: `share-${SHARE_REWARD.id}-${Date.now()}.${extension}`, contentType: screenshot.type, size: screenshot.size }),
  });
  const upload = await fetch(ticket.upload_url, { method: 'PUT', headers: ticket.headers, body: screenshot, signal: AbortSignal.timeout(120000) });
  if (!upload.ok) throw new Error('The screenshot could not be uploaded. Try again.');
  return await request('/api/me/share', token, { method: 'POST', body: JSON.stringify({ image_id: ticket.file_id }) }) as ShareClaimResult;
}
