import { GAME_STYLE_CASES } from './gameStyleCases';

export const GAME_STYLE_LANDING = {
  path: '/game-character-style',
  title: '20 Game Character Style Conversion Examples — Before and After',
  description: 'Browse 20 original game-character before-and-after style references. Compare the same pose, costume and identity across cyberpunk, fantasy, sci-fi, anime and realistic directions.',
  heading: '20 Game Character Style Conversion Cases',
  intro: 'Use these original before-and-after pairs to evaluate character style conversion: keep the pose, costume and identity anchored while changing lighting, materials, palette and world direction.',
  keywords: [
    'game character style conversion',
    'game character before and after',
    'ai game character style transfer',
    'dlss 5 game visual enhancer',
    'cyberpunk character style reference',
    'fantasy game character transformation',
  ],
  cases: GAME_STYLE_CASES,
} as const;

export function gameStyleLandingSchema(siteUrl = 'https://www.dlss5nvidia.com') {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        name: GAME_STYLE_LANDING.title,
        url: `${siteUrl}${GAME_STYLE_LANDING.path}`,
        description: GAME_STYLE_LANDING.description,
        inLanguage: 'en-US',
        numberOfItems: GAME_STYLE_CASES.length,
        isPartOf: { '@type': 'WebSite', name: 'DLSS5NVIDIA', url: `${siteUrl}/` },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'DLSS5NVIDIA', item: `${siteUrl}/` },
          { '@type': 'ListItem', position: 2, name: GAME_STYLE_LANDING.heading, item: `${siteUrl}${GAME_STYLE_LANDING.path}` },
        ],
      },
    ],
  };
}
