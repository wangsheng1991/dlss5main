import { useState } from 'react';
import { SAMPLES, type SampleId } from '../../config/samples';

export interface SampleRunResult { sample: SampleId; prompt: string; input: string; result: string; cached: boolean }
export type SampleRunState = { status: 'idle' } | { status: 'running'; sample: SampleId }
  | { status: 'ready'; run: SampleRunResult } | { status: 'error'; sample?: SampleId; message: string };

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Runs a catalog example without an account. The server computes each example once and caches it,
 * so this normally returns immediately; while the first ever run is warming up the server answers
 * 202 and this keeps asking until the cached copy is ready.
 */
export function useSampleRun() {
  const [state, setState] = useState<SampleRunState>({ status: 'idle' });

  const run = async (sample: SampleId) => {
    setState({ status: 'running', sample });
    const deadline = Date.now() + 90000;
    while (Date.now() < deadline) {
      let response: Response;
      try {
        response = await fetch('/api/image-edit/samples', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sample }) });
      } catch {
        setState({ status: 'error', sample, message: 'The example could not be reached. Check your connection.' });
        return;
      }
      const data = await response.json().catch(() => ({}));
      if (response.ok && data.status === 'SUCCEEDED') {
        setState({ status: 'ready', run: { sample, prompt: data.prompt || SAMPLES[sample].prompt, input: data.input || SAMPLES[sample].src, result: data.result, cached: !!data.cached } });
        return;
      }
      if (response.status === 429) {
        setState({ status: 'error', sample, message: typeof data.error === 'string' ? data.error : 'You have reached today\'s free example limit. Sign in to keep generating.' });
        return;
      }
      if (!response.ok && response.status !== 202) {
        setState({ status: 'error', sample, message: typeof data.error === 'string' ? data.error : 'This example could not be generated right now.' });
        return;
      }
      await sleep(2500);
    }
    setState({ status: 'error', sample, message: 'This example is still being prepared. Try again in a moment.' });
  };

  return { state, run, reset: () => setState({ status: 'idle' }) };
}
