// Additive links per approved route; preserve every existing link.
export const CORE_ARTICLE_LINKS: Record<string, {path: string; label: string}[]> = {
  '/game-character-style': [{path: '/blog/core-game-frame-style-reference', label: 'Review a saved game frame as a style-conversion reference'}],
  '/interior-design': [{path: '/blog/core-two-reference-room-workflow', label: 'Give a room source and a style reference different roles'}],
  '/before-after': [{path: '/blog/core-redraw-review-checklist', label: 'Review what changed in a neural redraw before sharing it'}],
  '/vs/dlss-5-vs-dlss-4-5': [{path: '/blog/core-game-frame-style-reference', label: 'Explore independent static style conversion with a saved frame'}],
  '/vs/dlss-5-vs-fsr-4': [{path: '/blog/core-redraw-review-checklist', label: 'Check the limits of independent static neural redraws'}],
};

const NEXT_CORE_ARTICLE_LINKS: typeof CORE_ARTICLE_LINKS = {
  '/game-character-style': [{path: '/blog/core-character-consistency-style-conversion', label: 'Check character identity before accepting a style conversion'}],
  '/interior-design': [{path: '/blog/core-named-interior-style-room-restyle', label: 'Choose Japandi, Nordic or industrial styling and check the room structure'}],
};
const GAME_ANCHOR_LINKS: typeof CORE_ARTICLE_LINKS = {
  "/game-character-style": [
    {
      "path": "/blog/core-game-character-style-matrix",
      "label": "Plan a same-character style direction matrix"
    },
    {
      "path": "/blog/core-game-character-reference-board",
      "label": "Choose a style reference board for a game character"
    }
  ],
  "/before-after": [
    {
      "path": "/blog/core-game-hud-text-redraw-review",
      "label": "Inspect game HUD and text before sharing a redraw"
    }
  ],
  "/blog/core-game-character-style-matrix": [
    {
      "path": "/blog/core-game-frame-style-reference",
      "label": "Review the saved game-character style example"
    },
    {
      "path": "/game-character-style",
      "label": "Explore game-character style conversion"
    }
  ],
  "/zh/blog/core-game-character-style-matrix": [
    {
      "path": "/zh/blog/core-game-frame-style-reference",
      "label": "核对游戏角色风格转换的既有样例"
    },
    {
      "path": "/game-character-style",
      "label": "尝试游戏角色风格转换"
    }
  ],
  "/blog/core-game-hud-text-redraw-review": [
    {
      "path": "/blog/core-game-frame-style-reference",
      "label": "Review the saved game-character style example"
    },
    {
      "path": "/game-character-style",
      "label": "Explore game-character style conversion"
    }
  ],
  "/zh/blog/core-game-hud-text-redraw-review": [
    {
      "path": "/zh/blog/core-game-frame-style-reference",
      "label": "核对游戏角色风格转换的既有样例"
    },
    {
      "path": "/game-character-style",
      "label": "尝试游戏角色风格转换"
    }
  ],
  "/blog/core-game-character-reference-board": [
    {
      "path": "/blog/core-game-frame-style-reference",
      "label": "Review the saved game-character style example"
    },
    {
      "path": "/game-character-style",
      "label": "Explore game-character style conversion"
    }
  ],
  "/zh/blog/core-game-character-reference-board": [
    {
      "path": "/zh/blog/core-game-frame-style-reference",
      "label": "核对游戏角色风格转换的既有样例"
    },
    {
      "path": "/game-character-style",
      "label": "尝试游戏角色风格转换"
    }
  ]
};

export function coreArticleLinksFor(route: string) {
  return [...(CORE_ARTICLE_LINKS[route] || []), ...(NEXT_CORE_ARTICLE_LINKS[route] || []), ...(GAME_ANCHOR_LINKS[route] || [])];
}
