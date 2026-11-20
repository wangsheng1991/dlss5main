export const VIDEO_BETA_FEATURES = [
  'image-to-video',
  'video-upscaler',
  'frame-interpolation',
  'video-understanding',
  'video-highlights',
] as const;

export type VideoBetaFeature = typeof VIDEO_BETA_FEATURES[number];
