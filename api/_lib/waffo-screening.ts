import { ScanAction, ScanReasonCode, ScanSemanticMode, WaffoPancake, type ScanResult } from '@waffo/pancake-ts';

function unavailable() {
  return Object.assign(new Error('Safety screening is temporarily unavailable. No generation was started or credits charged. Try again shortly.'), { status: 503 });
}

/** Narrow supplement to /terms section 4, not a general image/content-safety classifier. */
export function hasExplicitSexualRequest(value: string) {
  const text = value.normalize('NFKC').replace(/[\u200B-\u200D\uFEFF]/g, '').replace(/\s+/g, ' ');
  return /\b(?:porn(?:ography|ographic)?|nsfw|hentai)\b/i.test(text)
    || /\b(?:sexually\s+explicit|explicit\s+(?:adult\s+)?sexual|sexual\s+(?:imagery|images?|content|acts?))\b/i.test(text)
    || /色情|淫秽|成人视频|成人裸照|裸体(?:图片|照片|视频)|脱衣/.test(text);
}

function notApproved() {
  return Object.assign(new Error('These instructions are not approved under our content policy. No credits were charged. Change your instructions before submitting again.'), { status: 422, code: 'PROMPT_NOT_APPROVED' });
}

/** Screen the text we actually hand to the generation provider. Preset-only tasks have no text. */
export async function screenGenerationText(input: { prompt?: string; extra?: string }) {
  const prompt = [input.prompt, input.extra].filter(Boolean).join('\n').trim();
  if (!prompt) return;

  const merchantId = process.env.WAFFO_MERCHANT_ID?.trim();
  const privateKey = process.env.WAFFO_PRIVATE_KEY?.trim();
  if (!merchantId || !privateKey) throw unavailable();

  let verdict: ScanResult;
  try {
    const client = new WaffoPancake({
      merchantId,
      privateKey,
      fetch: async (url, init) => {
        const response = await fetch(url, { ...init, signal: AbortSignal.timeout(5000), redirect: 'error' });
        if (!response.ok) throw unavailable();
        return response;
      },
    });
    verdict = await client.contentSafety.scanPrompt({ prompt, semantic: ScanSemanticMode.Enforce });
  } catch {
    // Do not return vendor errors, which may include request or credential details.
    throw unavailable();
  }
  if (verdict?.reasonCode === ScanReasonCode.ServiceDegraded) throw unavailable();
  // Prompt Sift can return allow for adult sexual requests; it does not replace our own AUP.
  if (hasExplicitSexualRequest(prompt)) throw notApproved();
  if (verdict?.action === ScanAction.Allow) return;
  if (verdict?.action === ScanAction.Review || verdict?.action === ScanAction.Block) {
    throw Object.assign(new Error('Safety screening did not approve these instructions. No credits were charged. Change your instructions before submitting again.'), { status: 422, code: 'PROMPT_NOT_APPROVED' });
  }
  throw unavailable();
}
