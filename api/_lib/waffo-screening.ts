import { ScanAction, ScanReasonCode, WaffoPancake, type ScanResult } from '@waffo/pancake-ts';

function unavailable() {
  return Object.assign(new Error('Safety screening is temporarily unavailable. No generation was started or credits charged. Try again shortly.'), { status: 503 });
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
    verdict = await client.contentSafety.scanPrompt({ prompt });
  } catch {
    // Do not return vendor errors, which may include request or credential details.
    throw unavailable();
  }
  if (verdict?.reasonCode === ScanReasonCode.ServiceDegraded) throw unavailable();
  if (verdict?.action === ScanAction.Allow) return;
  if (verdict?.action === ScanAction.Review || verdict?.action === ScanAction.Block) {
    throw Object.assign(new Error('Safety screening did not approve these instructions. No credits were charged. Change your instructions before submitting again.'), { status: 422, code: 'PROMPT_NOT_APPROVED' });
  }
  throw unavailable();
}
