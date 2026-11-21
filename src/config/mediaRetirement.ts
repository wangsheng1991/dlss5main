/** Retired at both the UI and task boundary; legacy types remain only for reading old history. */
export const RETIRED_MEDIA_MODES = ['fetch', 'media-fetch', 'video-downloader', 'media-downloader'] as const;
export const isRetiredMediaMode = (value: unknown) => typeof value === 'string' && (RETIRED_MEDIA_MODES as readonly string[]).includes(value);
export const RETIRED_MEDIA_MESSAGE = 'Third-party platform video fetching has been retired. No new task was created and no credits were charged. Use the local-file video tools at /video-studio.';
