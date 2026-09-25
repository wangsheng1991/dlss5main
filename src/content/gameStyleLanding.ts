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

/** Shared long-form copy keeps the hydrated page as useful to readers as its prerendered shell. */
export const GAME_STYLE_LONG_FORM = {
  definition: 'Game character style conversion changes the visual language of an existing character while preserving the parts that make the character recognisable. A useful conversion keeps the silhouette, pose, costume construction, camera and identity stable, then changes lighting, materials, palette, environment and rendering direction. These examples are original visual references for planning and review; they are not official NVIDIA captures or a claim of DLSS runtime processing.',
  invariants: 'Start by writing an invariant brief. Name the character, camera angle, pose, major costume pieces, face shape, hair outline and equipment that must survive the conversion. Separating these constraints from style variables prevents a prompt from accidentally redesigning the character while it is trying to change the world around them.',
  variables: 'Treat style as a controlled set of variables: cinematic rim light, cel-shaded edges, worn metal, translucent fabric, neon bounce, painterly texture or realistic skin response. Change one or two variables at a time, compare against the base frame, and keep a version that proves the prompt still respects the original composition.',
  review: 'Review a result at thumbnail size and at 100 percent. At a glance, the pose and visual hierarchy should read immediately. At full size, inspect eyes, fingers, facial proportions, weapon silhouettes, armour seams and cloth folds. If the image will become a video, review several frames for flicker and identity drift before calling the conversion usable.',
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
