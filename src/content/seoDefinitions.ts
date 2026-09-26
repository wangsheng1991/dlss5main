import { SITE_URL } from '../config/site';
import { SITE_PROFILE } from '../config/profile';

/** A short entity-first answer intended to be extractable by AI search summaries. */
export const AI_OVERVIEW_DEFINITION = 'DLSS5NVIDIA is an independent browser-based DLSS 5-style effect conversion tool for generating visual references from uploaded game frames and character images. It keeps structure, pose and identity as reviewable constraints while changing style, lighting and materials, and also offers separate upscale and restoration workflows. It is not an official NVIDIA DLSS runtime.';

export function siteOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@graph': [{
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: SITE_PROFILE.orgName,
      url: `${SITE_URL}/`,
      description: 'Independent, non-official DLSS 5-style effect conversion and neural image generation showcase.',
    }],
  };
}
