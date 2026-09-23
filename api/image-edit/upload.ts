import type { VercelRequest, VercelResponse } from '@vercel/node';
import { alphaNet } from '../_lib/alphanet.js';
import { fail, requireUser } from '../_lib/auth.js';
import { JobStore } from '../../server/job-store.js';
import { database } from '../../server/admin.js';
import { isProviderModel, MAX_UPLOAD_BYTES, modeForModel, pixelCheckNote } from '../../src/config/tools.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    const { uid } = await requireUser(req);
    const { fileName, contentType, size, width, height, model = 'flux-klein' } = req.body || {};
    if (typeof fileName !== 'string' || !/^[\w .-]{1,180}$/.test(fileName)) return res.status(400).json({ error: 'Invalid file name' });
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(contentType) || !Number.isSafeInteger(size) || size < 1 || size > MAX_UPLOAD_BYTES) return res.status(400).json({ error: 'Unsupported image or size' });
    // The gateway routes on the model, so only the models this studio really submits to are allowed
    // through here; a typo must fail before an upload is ever signed.
    if (!isProviderModel(model)) return res.status(400).json({ error: 'Unknown model' });
    // The bytes go straight from the browser to the provider's upload URL, so this function never
    // sees the picture and cannot measure it: the caller reports the size it measured. A file that
    // is over the mode's pixel ceiling is refused here, with the sentence the studio shows, rather
    // than dispatched to an upstream that answers 413 after a queue wait — a 48 MP phone photo is
    // only ~15 MiB and passes the byte check. Callers that report nothing are not blocked; the
    // browser check and the submit-time check still stand.
    const oversize = pixelCheckNote(width, height, modeForModel(model));
    if (oversize) return res.status(400).json({ error: oversize });
    const ticket = await alphaNet.createUpload({ fileName, contentType, size, model });
    await new JobStore(database()).bindUpload(uid, ticket.file_id, { size, contentType });
    return res.status(200).json(ticket);
  } catch (error) { return fail(res, error); }
}
