// R1/R2/R3/R5: source-led game context, an explicitly limited entry point, and Studio handover.
import { ENHANCE_FACTORS, ENHANCE_MAX_EDGE } from '../config/enhance';
export const CHECKED = '2026-10-23';
export const ENHANCER_TIER = 'entry-point';
export const EVIDENCE_SOURCES = {
  dlss4: 'https://www.nvidia.com/en-us/geforce/news/dlss-4-multi-frame-generation-out-now/',
  dlss5: 'https://www.nvidia.com/en-us/geforce/news/dlss-5-3d-guided-neural-rendering/',
  dlss45: 'https://www.nvidia.com/en-us/geforce/news/dlss-4-5-dynamic-multi-frame-gen-6x-2nd-gen-transformer-super-res/',
  amd: 'https://gpuopen.com/amd-fsr-upscaling/',
};
export const COMPARISON_ANSWERS = [
  { question: 'Do I use FSR or DLSS?', answer: 'Choose a feature that your game and GPU actually support. Check the game settings against NVIDIA’s DLSS and AMD’s FSR support information; a suite name alone is not a compatibility check. If both are available, compare the same scene and settings for the outcome you need. We have not verified a universal winner.', sources: ['dlss4', 'amd'] },
  { question: 'How much better is DLSS 4.5 than DLSS 4?', answer: 'NVIDIA describes a second-generation transformer for DLSS 4.5 Super Resolution, available for GeForce RTX GPUs. How much better it is for your game, GPU and settings is unverified (未核实) here: we have not run a matched benchmark and do not give a performance percentage.', sources: ['dlss45'] },
  { question: 'Will AMD have something similar to DLSS 5?', answer: 'Unverified (未核实): the AMD FSR source linked here is not evidence of an equivalent DLSS 5 neural-rendering product or a future release date. Check AMD’s own feature and hardware information. We do not treat upscaling or frame generation as proof of equivalent lighting and material rendering.', sources: ['amd'] },
  { question: 'Is DLSS 4 only for RTX 50 series?', answer: 'No. NVIDIA separates the features: Multi Frame Generation requires RTX 50; Frame Generation supports RTX 40 and RTX 50. The transformer updates for Super Resolution, Ray Reconstruction and DLAA are available across GeForce RTX GPUs, subject to game integration. Check the specific feature, not only the DLSS 4 label.', sources: ['dlss4'] },
  { question: 'How much better will DLSS 5 be?', answer: 'NVIDIA describes DLSS 5 as 3D-guided neural rendering for lighting and materials. That is a different question from how many frames an upscaler produces. A general improvement amount is unverified (未核实) here; we have no matched game benchmark and do not turn NVIDIA’s demonstration into a universal quality or performance claim.', sources: ['dlss5'] },
  { question: 'Which GPUs are supported by DLSS 5?', answer: 'The checked NVIDIA launch source confirms NBA 2K27 on all GeForce RTX 50 Series desktop and laptop GPUs, and separately on GeForce NOW. This answer’s local-PC scope is that named game and hardware family. Other local GPU/game combinations are unverified (未核实) here; a cloud service does not establish support on the client’s GPU.', sources: ['dlss5'] },
] as const;
export const ENHANCER_BOUNDARIES = [
  `The longest output edge is capped at ${ENHANCE_MAX_EDGE} pixels. Target factors are ${ENHANCE_FACTORS.join(' / ')}; the requested scale is reduced when needed to fit that cap. These are target dimensions, not measured speed or quality gains.`,
  'The model redraws detail. It does not promise pixel-exact super-resolution or recovery of information absent from the original. Keep the source and inspect faces, text and edges.',
  'Failures and interrupted status checks remain visible. Resume checking with the same task id; a temporary polling error or timeout does not require another generation. If the provider reports a terminal failure, checking again does not guarantee recovery.',
  'Our signed-in test build recovered after injected HTTP 403 polling errors with the same task id and one submission. A failed download could refresh that task’s result link. This is a recovery-path check, not a timing or success-rate guarantee.',
] as const;
export const DOWNLOAD_ANSWERS = [
  { question: 'Is there a DLSS 5 APK?', answer: 'This site does not provide a DLSS 5 APK. DLSS5 Studio is an independent Windows RTX tool available by request after sign-in, not a public Android installer. Use the browser example instead of looking for an APK here.' },
  { question: 'Does it run on Android?', answer: 'The Studio desktop build does not run on Android. On an Android phone, you can try the browser example without installing Studio or an APK. The browser workflow is separate from the Windows RTX application and from the NVIDIA DLSS game runtime.' },
  { question: 'Do I need an RTX card for the browser demo?', answer: 'No. The cached browser example does not require a local RTX card. The RTX requirement on this page applies to the Windows Studio desktop workflow; it is not a requirement to view the browser example.' },
] as const;
