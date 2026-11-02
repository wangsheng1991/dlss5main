import { GAME_DETAIL_EVIDENCE, GAME_SOURCES, GAMES_CHECKED } from './gamesStatusEvidence';
import { SITE_URL } from '../config/site';

/**
 * One entry in a title's resource list. `kind` keeps the three registers apart on the page:
 * vendor documentation, third-party reporting we did not reproduce, and work we ran ourselves.
 */
export type GameResource = {
  kind: 'official' | 'press' | 'ours' | 'tool';
  label: string; href: string; note: string; date?: string;
};
export type GameCoveragePage = {
  slug: string; path: string; keyword: string; title: string;
  official: string; steps?: string[]; outside: string; faq: { question: string; answer: string }[];
  resourcesHeading?: string; resourcesIntro?: string; resources?: GameResource[];
};
export const GAME_COVERAGE_PAGES: GameCoveragePage[] = [
  {
    slug: 'hogwarts-legacy', path: '/games/hogwarts-legacy', keyword: 'dlss 5 hogwarts legacy',
    title: 'DLSS 5 Hogwarts Legacy: announced date and your options',
    official: 'Wait for the announced game update rather than treating existing DLSS features as this release. NVIDIA names November 5, GeForce RTX 50 Series, GeForce NOW and RTX Spark. The reviewed section provides neither a driver version nor a game-menu enablement procedure; none is supplied here.',
    outside: 'As of the check date, Hogwarts Legacy is announced, not confirmed live. Existing Multi Frame Generation and Ray Reconstruction do not establish DLSS 5 availability. A community replacement method is not evidence that the announced integration has shipped.',
    faq: [
      { question: 'Is DLSS 5 available?', answer: 'Not confirmed live for Hogwarts Legacy in the reviewed evidence. NVIDIA announces November 5; existing DLSS features are separate from this upcoming integration.' },
      { question: 'Can DLSS 5 run on any game?', answer: 'No blanket support is established. For Hogwarts Legacy, the announcement names a specific update and RTX 50 Series, GeForce NOW and RTX Spark; that scope cannot be extended to every game or GPU.' },
    ],
  },
  {
    slug: 'where-winds-meet', path: '/games/where-winds-meet', keyword: 'dlss 5 where winds meet',
    title: 'DLSS 5 Where Winds Meet: late-November announcement',
    official: 'No DLSS 5 installation procedure is published in the reviewed game section. NVIDIA announces late November without naming a driver, GPU range or laptop condition there. Check a title-specific release update; do not copy Hogwarts Legacy or NBA 2K27 requirements onto this game.',
    outside: 'As of the check date, Where Winds Meet remains announced. Its existing Super Resolution and Multi Frame Generation are not proof that the announced DLSS 5 upgrade is available. Neither an exact day in November nor unlisted hardware requirements are confirmed here.',
    faq: [
      { question: 'Is DLSS 5 available?', answer: 'Not confirmed live for Where Winds Meet. The reviewed NVIDIA article announces late November and does not give an exact day.' },
      { question: 'What devices will support DLSS 5?', answer: 'The Where Winds Meet section does not specify its GPU or laptop requirements. Requirements for another game cannot fill that gap; wait for title-specific official conditions.' },
    ],
  },
  {
    slug: 'phantom-blade-zero', path: '/games/phantom-blade-zero', keyword: 'dlss 5 phantom blade zero',
    title: 'DLSS 5 Phantom Blade Zero: announced, not confirmed live',
    official: 'NVIDIA\'s March 16, 2026 announcement lists Phantom Blade Zero among the titles planned to receive DLSS 5. That is an announcement of intent: the reviewed October update does not mention the title, so it gives no release date for this game and no driver version, GPU scope or in-game setting. Nothing on this page is a recipe for enabling DLSS 5 inside Phantom Blade Zero.',
    outside: 'As of the check date, Phantom Blade Zero is announced rather than confirmed live. Mods that appear within days of a release are not vendor confirmation, and swapping a DLSS library is not proof that neural rendering is running. This page records the official status and an independent alternative; it does not vouch for any mod.',
    faq: [
      { question: 'Is DLSS 5 available in Phantom Blade Zero?', answer: 'Not confirmed live in the reviewed evidence. NVIDIA names the game in its March 16, 2026 planned list; the October update does not mention it, so no release date is established here.' },
      { question: 'Do the community mods prove it works?', answer: 'No. A community modification, a replaced library or a captured frame is not vendor confirmation, and we have not validated any such method for this title.' },
    ],
    resourcesHeading: 'Everything we have on Phantom Blade Zero in one list',
    resourcesIntro: 'The game arrived at the end of October 2026, and community mods followed within a day of launch — press-reported, not reproduced by us. Below is the whole record: what NVIDIA actually documents, what the press reported, what we measured ourselves, and the tools you can use today. Nothing here is a download of NVIDIA files or a build of somebody else’s mod.',
    resources: [
      { kind: 'official', date: '2026-03-16', label: 'NVIDIA DLSS 5 announcement and planned-game list', href: GAME_SOURCES.march, note: 'The only official statement naming this title: Phantom Blade Zero is listed as planned. The reviewed October update does not mention it, so no release date, driver version or in-game setting is established.' },
      { kind: 'press', date: '2026-10-31', label: 'What the weekend mod reports claimed — and where the boundary is', href: '/blog/dlss-5-on-non-nvidia-cards-mod-boundary-2026', note: 'Written 2026-11-02 from dated reports by VideoCardz, GameGPU (10-31) and eTeknix (10-30, 11-01): an unofficial DLSS 5 mod inside this title less than 24 hours after launch, and DLSS features on a Radeon card. We reproduced none of them, so the post quotes no frame rate; it separates "it runs" from "it is supported".' },
      { kind: 'ours', date: '2026-11-02', label: '影之刃零 mod 这波的真实边界（中文版）', href: '/zh/blog/dlss-5-on-non-nvidia-cards-mod-boundary-2026', note: 'Same check in Chinese, for readers who searched the game by its Chinese name.' },
      { kind: 'ours', date: '2026-11-02', label: 'One 320×213 image through two pipelines, measured', href: '/blog/one-low-res-image-two-pipelines-ours-vs-flux-klein-2026-11', note: 'Our own run rather than a borrowed number: input 320×213 / 12,287 bytes, our flux-klein path returned 1024×1024 in four steps, and the second pipeline did not follow the input image at all. This is what our route can and cannot do with a game screenshot.' },
      { kind: 'tool', label: 'DLSS 5 supported cards checker', href: '/dlss-checker', note: 'Row-by-row status with the source and check date for each card. It answers what NVIDIA documents for your GPU — not whether some mod build will run on it.' },
      { kind: 'tool', label: 'DLSS 5 game support tracker', href: '/games', note: 'Launched and announced are kept in separate columns, so a planned-list entry never reads as current support.' },
      { kind: 'tool', label: 'Independent style-conversion examples', href: '/before-after', note: 'Real before-and-after pairs from our own image workflow, with the settings used. A visual reference outside the game; it does not change a game renderer.' },
      { kind: 'tool', label: 'Download paths and the local Studio guide', href: '/download', note: 'Where our desktop window comes from and what it does. It is not an NVIDIA runtime and it installs nothing into Phantom Blade Zero.' },
    ],
  },
  {
    slug: 'the-witcher-3', path: '/games/the-witcher-3', keyword: 'dlss 5 the witcher 3',
    title: 'DLSS 5 The Witcher 3: what the vendor announcements actually say',
    official: 'Neither reviewed NVIDIA article names The Witcher 3: it is absent from the March 16, 2026 planned-game list and from the October update. Those sources therefore provide no official enablement path, driver requirement, GPU scope or release date for this title, and none is supplied here.',
    outside: 'As of the check date, DLSS 5 support for The Witcher 3 is unconfirmed in the reviewed sources. Benchmarks and community builds circulating for older titles are not vendor confirmation: a renamed library, an injected mod or an impressive capture does not establish an official integration, and updating the game or driver can overwrite it.',
    faq: [
      { question: 'Does The Witcher 3 support DLSS 5?', answer: 'Unconfirmed in the reviewed NVIDIA sources: the game is named in neither the March 16 list nor the October update. This is a bounded check, not a claim that no future announcement can exist.' },
      { question: 'Can I get a DLSS 5 look on Witcher 3 screenshots?', answer: 'You can run a screenshot you are entitled to process through our independent Studio style-conversion workflow. That produces a visual reference outside the game; it does not enable NVIDIA DLSS 5 inside The Witcher 3.' },
    ],
  },
  {
    slug: 'cyberpunk-2077', path: '/games/cyberpunk-2077', keyword: 'dlss 5 cyberpunk 2077',
    title: 'DLSS 5 Cyberpunk 2077: unconfirmed support and an independent workflow',
    official: 'No official DLSS 5 enablement steps for Cyberpunk 2077 are established by the two reviewed NVIDIA articles. We therefore provide no runtime installation recipe, driver requirement or promised compatibility for this title.',
    outside: 'As of the check date, neither the reviewed March game list nor the October article confirms Cyberpunk 2077 support. A community tutorial or a renamed package does not establish an official integration. This page explains the boundary and an independent screenshot workflow, not a verified game mod.',
    faq: [
      { question: 'Is DLSS 5 available?', answer: 'Official DLSS 5 support for Cyberpunk 2077 is unconfirmed in the reviewed March and October NVIDIA articles. This does not rule out future announcements.' },
      { question: 'Can you apply DLSS 5 to any game?', answer: 'No universal game integration is established by these sources. Our independent Studio workflow can process a screenshot or captured frame for style conversion; it does not enable NVIDIA DLSS 5 inside Cyberpunk 2077.' },
    ],
  },
  {
    slug: 'rtx-remix-dlss-5', path: '/guides/rtx-remix-dlss-5', keyword: 'rtx remix dlss 5',
    title: 'RTX Remix DLSS 5: the official enablement path and its limits',
    official: 'NVIDIA publishes the following path for the announced October 23 RTX Remix update. These are the article’s steps, not a claim that we installed or tested the runtime. Follow the official article for the current distribution; this site hosts no runtime files.',
    steps: [
      'Get the latest NVIDIA RTX Remix from the NVIDIA app Home screen or the official GitHub destination referenced by NVIDIA.',
      'Press Alt + X to open the NVIDIA RTX Remix Runtime User Guide overlay.',
      'Select Developer Settings in that interface.',
      'Enable DLSS 5 in the runtime or toolkit menu.',
    ],
    outside: 'An RTX Remix platform announcement does not make every game or community mod supported. NVIDIA describes Fallout 4 RTX and Mirror’s Edge RTX as in-development projects shown with a preview. Those demonstrations are not public-release confirmation, and their conditions are not assigned to other games here. Check record, 2026-10-27: press reported an RTX Remix 1.6 release carrying DLSS 5 and 6X Multi Frame Generation — Wccftech on 2026-10-23 (https://wccftech.com/nvidia-rtx-remix-1-6-launches-with-dlss-5-6x-multi-frame-generation-minecraft-java-edition-support-and-more/) and TweakTown on 2026-10-25 (https://www.tweaktown.com/news/114270/nvidia-rtx-remix-1-6-brings-dlss-5-6x-multi-frame-generation-and-path-traced-minecraft/index.html). We could not match that to NVIDIA’s own copy on the same date: three candidate news paths returned 404 and the RTX Remix product page states no version in its readable text. The status on this page therefore stays “announced”, and these lines are recorded as press reports, not as vendor confirmation.',
    faq: [
      { question: 'What does the RTX Remix do?', answer: 'RTX Remix is NVIDIA’s modding platform for remastering classic games. Its October announcement adds a DLSS 5 enablement path; it is separate from this site’s Studio screenshot style-conversion workflow.' },
      { question: 'Is DLSS 5 available for all games?', answer: 'No. A platform update and preview demonstrations do not establish universal game support. Check the particular game or mod’s official integration rather than treating the RTX Remix announcement as a compatibility list.' },
    ],
  },
];
export const GAME_STATE_LABELS = { launched: 'Launched', announced: 'Announced; release unconfirmed', unconfirmed: 'Unconfirmed' };
export function gameCoverageSchema(page: GameCoveragePage) {
  return [
    {'@context':'https://schema.org','@type':'WebPage',name:page.title,url:`${SITE_URL}${page.path}`,dateModified:GAMES_CHECKED,description:GAME_DETAIL_EVIDENCE[page.slug].detail.en,citation:GAME_DETAIL_EVIDENCE[page.slug].sources.map(k=>GAME_SOURCES[k])},
    {'@context':'https://schema.org','@type':'FAQPage',mainEntity:page.faq.map(q=>({'@type':'Question',name:q.question,acceptedAnswer:{'@type':'Answer',text:q.answer}}))},
  ];
}
