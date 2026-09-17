/**
 * The printable example inputs. Guests may generate these without an account, so both the
 * dashboard and the server read the same catalog: the prompt and the file are fixed here.
 */
export const SAMPLES = {
  sample1: { id: 'sample1', name: 'Kitchen render', src: '/examples/sample1.jpg', fileName: 'sample1.jpg', contentType: 'image/jpeg', prompt: 'Make it look like a real photo of this kitchen, keeping the layout identical.' },
  sample2: { id: 'sample2', name: 'Bedroom render', src: '/examples/sample2.jpg', fileName: 'sample2.jpg', contentType: 'image/jpeg', prompt: 'Turn this render into a photorealistic photo with soft morning light.' },
} as const;

export type SampleId = keyof typeof SAMPLES;
export const SAMPLE_IDS = Object.keys(SAMPLES) as SampleId[];
export const isSampleId = (value: unknown): value is SampleId => typeof value === 'string' && value in SAMPLES;
