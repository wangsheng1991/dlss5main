export const GAMES_CHECKED = '2026-10-31';
export const GAME_SOURCES = {
  october: 'https://www.nvidia.com/en-us/geforce/news/dlss-5-faster-ai-model-hogwarts-legacy-rtx-spark-laptops/',
  march: 'https://www.nvidia.com/en-gb/geforce/news/dlss5-breakthrough-in-visual-fidelity-for-games/',
  launch: 'https://www.nvidia.com/en-us/geforce/news/dlss-5-3d-guided-neural-rendering/',
} as const;
type LocalText = { en: string; zh: string };
type EvidenceRow = { game: string; state: 'launched' | 'announced' | 'unconfirmed'; evidenceDate: string; detail: LocalText; sources: (keyof typeof GAME_SOURCES)[]; path?: string };
const announced: LocalText = {
  en: 'Named in the March announcement. The reviewed October article does not confirm a release for this title; title-specific GPU, driver and release conditions remain unconfirmed here.',
  zh: '出现在三月公告名单中。此次十月正文没有确认该游戏上线；本页不确认它的具体显卡、驱动与上线条件。',
};
export const GAME_EVIDENCE: EvidenceRow[] = [
  { game: 'NBA 2K27', state: 'launched', evidenceDate: '2026-10-13', path: '/games/nba-2k27', sources: ['october', 'launch'], detail: {
    en: 'The October article confirms the game feature launched in September. The launch source names RTX 50 Series desktops/laptops, GeForce NOW and driver 616.64 WHQL. October 16 is the announced new-model date, naming RTX 50 Series, RTX Spark laptops and GeForce NOW; this article alone does not confirm that later rollout completed. It specifies no new driver version.',
    zh: '十月正文确认游戏功能已于九月上线。首发来源点名 RTX 50 系列桌面显卡及笔记本、GeForce NOW 和驱动 616.64 WHQL。10 月 16 日是该文宣布的新模型日期，范围点名 RTX 50 系列、RTX Spark 笔记本与 GeForce NOW；仅凭这篇文章不能确认后续更新已完成，文中也未给出新驱动版本。',
  } },
  { game: 'Hogwarts Legacy', state: 'announced', evidenceDate: '2026-10-13', sources: ['october'], detail: {
    en: 'Announced for November 5, not confirmed live. The source names GeForce RTX 50 Series, GeForce NOW and RTX Spark; Spark is not stated as the only route. No driver version or separate laptop requirement is specified. Existing Multi Frame Generation / Ray Reconstruction support is not DLSS 5 launch evidence.',
    zh: '官方宣布于 11 月 5 日加入，未确认已上线。原文点名 GeForce RTX 50 系列、GeForce NOW 与 RTX Spark，并非只能使用 Spark；没有指定驱动版本或单独的笔记本要求。原有多帧生成及光线重建支持不能作为 DLSS 5 上线证据。',
  } },
  { game: 'Where Winds Meet', state: 'announced', evidenceDate: '2026-10-13', sources: ['october'], detail: {
    en: 'The article says the upgrade is coming in late November, not already available. This game section does not name a driver, GPU scope or Spark/laptop requirement; do not borrow the conditions from another game.',
    zh: '原文说升级将在 11 月下旬到来，并非已经可用。该游戏小节没有点名驱动、显卡范围或 Spark／笔记本要求，不能套用其他游戏的条件。',
  } },
  ...['AION 2', 'Assassin’s Creed Shadows', 'Black State', 'CINDER CITY', 'Delta Force', 'Justice', 'NARAKA: BLADEPOINT', 'NTE: Neverness to Everness', 'Phantom Blade Zero', 'Resident Evil Requiem', 'Sea of Remnants', 'Starfield', 'The Elder Scrolls IV: Oblivion Remastered'].map(game => ({game, state: 'announced' as const, evidenceDate: '2026-03-16', detail: announced, sources: ['march', 'october'] as (keyof typeof GAME_SOURCES)[]})),
  ...['Honkai: Star Rail', 'Marvel Rivals'].map(game => ({game, state: 'unconfirmed' as const, evidenceDate: '2026-10-13', sources: ['october'] as (keyof typeof GAME_SOURCES)[], detail: {
    en: 'The reviewed article body contains no DLSS 5 support confirmation for this title. A news-list excerpt is not release evidence; driver and hardware conditions remain unconfirmed.',
    zh: '此次核对的新闻正文没有确认该游戏支持 DLSS 5。新闻列表摘要不构成上线证据，驱动与硬件条件均不确认。',
  }})),
  ...['Fallout 4 RTX', 'Mirror’s Edge RTX'].map(game => ({game, state: 'unconfirmed' as const, evidenceDate: '2026-10-13', sources: ['october'] as (keyof typeof GAME_SOURCES)[], detail: {
    en: 'Shown as an in-development RTX Remix mod project using a preview. Mentioned demonstration, not a confirmed public game release; no title-specific driver or GPU requirement is established.',
    zh: '以使用预览版本、仍在开发的 RTX Remix 模组项目出现。属于演示提及，不是已确认公开发布的游戏支持；没有确立该项目的驱动或显卡要求。',
  }})),
];
export const RELEASE_TIMELINE = [
  { date: '2026-03-16', source: 'march' as const, event: {
    en: 'NVIDIA published the DLSS 5 announcement and its planned game list. This records an announcement, not those games becoming available.',
    zh: 'NVIDIA 发布 DLSS 5 公告与计划游戏名单。这里记录的是公告发布，不是这些游戏已经可用。',
  } },
  { date: '2026-10-13', source: 'october' as const, event: {
    en: 'NVIDIA published an update confirming NBA 2K27 had launched the feature in September and announcing subsequent model, Hogwarts Legacy, Where Winds Meet and RTX Remix updates. Those announcements are recorded here, not their later completion.',
    zh: 'NVIDIA 发布更新文章，确认 NBA 2K27 的功能已在九月上线，并宣布后续模型、Hogwarts Legacy、Where Winds Meet 与 RTX Remix 更新。本行记录文章发布，不把计划中的更新记为已完成。',
  } },
];

/** Detail-only evidence: keep the existing tracker and timeline unchanged. */
export const GAME_DETAIL_EVIDENCE: Record<string, EvidenceRow> = {
  'hogwarts-legacy': GAME_EVIDENCE.find(row => row.game === 'Hogwarts Legacy')!,
  'where-winds-meet': GAME_EVIDENCE.find(row => row.game === 'Where Winds Meet')!,
  'phantom-blade-zero': GAME_EVIDENCE.find(row => row.game === 'Phantom Blade Zero')!,
  'the-witcher-3': {
    game: 'The Witcher 3', state: 'unconfirmed', evidenceDate: GAMES_CHECKED, sources: ['march', 'october'],
    detail: {
      en: 'Neither reviewed NVIDIA article names The Witcher 3 for DLSS 5: the game is absent from the March 16 game list and from the October update. This is a bounded check of those two sources on the date shown, not a claim that no future announcement can exist. No release date, driver version, GPU scope or in-game setting is established for this title here.',
      zh: '本次核对的两篇 NVIDIA 文章都没有点名 The Witcher 3：既不在 3 月 16 日的游戏名单里，也不在 10 月更新中出现。这是对这两份来源的限定核对，不代表未来不会有公告；此处不确认该游戏的发布时间、驱动版本、显卡范围或游戏内设置。',
    },
  },
  'cyberpunk-2077': {
    game: 'Cyberpunk 2077', state: 'unconfirmed', evidenceDate: GAMES_CHECKED, sources: ['march', 'october'],
    detail: {
      en: 'No DLSS 5 support confirmation for Cyberpunk 2077 was found in the reviewed March announcement or October article. This is a bounded source check, not a claim that no future announcement can exist. No DLSS 5 release date, driver or GPU scope is established for this game here.',
      zh: '核对的三月公告与十月正文均未确认 Cyberpunk 2077 支持 DLSS 5。这是限定来源范围的核对结果，不代表未来不会公告；此处不确认该游戏的 DLSS 5 上线日期、驱动或显卡范围。',
    },
  },
  'rtx-remix-dlss-5': {
    game: 'RTX Remix', state: 'announced', evidenceDate: '2026-10-13', sources: ['october'],
    detail: {
      en: 'NVIDIA announced an October 23 update adding DLSS 5 with the new 3D-Guided Neural Rendering model and Frame Generation Performance Mode to RTX Remix. The article publishes an enablement path. It is an announcement dated October 13; an elapsed date alone does not independently confirm rollout completion or support for every mod.',
      zh: 'NVIDIA 于 10 月 13 日宣布 RTX Remix 将在 10 月 23 日加入带新版 3D-Guided Neural Rendering 模型的 DLSS 5，以及帧生成 Performance Mode，并公布启用路径。计划日期已过不能单独证明更新交付完成，更不代表所有模组都已支持。',
    },
  },
};
