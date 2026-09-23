/** Stable public slugs for the verified passport/document photo specifications. */
export const PASSPORT_PHOTO_SPEC_PATHS: Record<string, string> = {
  '3-na-4': 'ru-doc-3x4',
  '35x45-ru': 'ru-passport-35x45',
};

export const PASSPORT_PHOTO_SPEC_SLUGS: Record<string, string> = {
  'ru-doc-3x4': '3-na-4',
  'ru-passport-35x45': '35x45-ru',
};

export const PASSPORT_PHOTO_PATHS = [
  '/tools/passport-photo',
  ...Object.values(PASSPORT_PHOTO_SPEC_SLUGS).map(slug => `/tools/passport-photo/${slug}`),
] as const;
