// One additive link per approved landing page; no existing copy or headings change.
export const CORE_ARTICLE_LINKS: Record<string, {path: string; label: string}> = {
  '/game-character-style': {path: '/blog/core-game-frame-style-reference', label: 'Review a saved game frame as a style-conversion reference'},
  '/interior-design': {path: '/blog/core-two-reference-room-workflow', label: 'Give a room source and a style reference different roles'},
  '/before-after': {path: '/blog/core-redraw-review-checklist', label: 'Review what changed in a neural redraw before sharing it'},
  '/vs/dlss-5-vs-dlss-4-5': {path: '/blog/core-game-frame-style-reference', label: 'Explore independent static style conversion with a saved frame'},
  '/vs/dlss-5-vs-fsr-4': {path: '/blog/core-redraw-review-checklist', label: 'Check the limits of independent static neural redraws'},
};
