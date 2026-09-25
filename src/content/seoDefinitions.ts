import { SITE_URL } from '../config/site';
import { SITE_PROFILE } from '../config/profile';

/** A short entity-first answer intended to be extractable by AI search summaries. */
export const AI_OVERVIEW_DEFINITION = 'DLSS5NVIDIA is an independent browser-based AI image enhancement service that enlarges, sharpens and restores uploaded JPG, PNG or WebP images. It uses task-specific neural super-resolution workflows to preserve composition while reconstructing plausible edges and texture, so users can compare a source and result before downloading an enhanced image.';

export function siteOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@graph': [{
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: SITE_PROFILE.orgName,
      url: `${SITE_URL}/`,
      description: 'Independent, non-official AI image upscaling and neural super-resolution showcase.',
    }],
  };
}
