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
/**
 * Rich content blocks. Only pages with material actually worth reading get them; the five baseline
 * sections every game page already has stay untouched. `placement: 'bottom'` renders before the FAQ
 * instead of straight after the header.
 */
export type GameBlock = (
  | { type: 'facts'; heading: string; intro?: string; rows: { label: string; value: string; note?: string }[] }
  | { type: 'timeline'; heading: string; intro?: string; items: { date: string; title: string; detail: string; href?: string; hrefLabel?: string }[] }
  | { type: 'table'; heading: string; intro?: string; columns: string[]; rows: string[][]; note?: string }
  | { type: 'issues'; heading: string; intro?: string; items: { question: string; answer: string }[] }
  | { type: 'voices'; heading: string; intro?: string; items: { who: string; what: string; date?: string; sourceLabel?: string; sourceHref?: string }[] }
  | { type: 'figure'; heading?: string; items: { src: string; alt: string; label?: string; href?: string; hrefLabel?: string; video?: boolean }[]; caption: string }
) & { placement?: 'top' | 'bottom' };
export type GameCoveragePage = {
  slug: string; path: string; keyword: string; title: string;
  official: string; steps?: string[]; outside: string; faq: { question: string; answer: string }[];
  /** Overrides the shared check date when this page was re-checked later than the tracker. */
  checked?: string; intro?: string;
  blocks?: GameBlock[];
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
    title: 'DLSS 5 Phantom Blade Zero: what ships, and what mods claim',
    checked: '2026-11-02',
    intro: 'Phantom Blade Zero launched on 2026-10-28 with DLSS 4.5, ray tracing and path tracing — and without DLSS 5. Within a day, modders were injecting Neural Rendering into it anyway. This page keeps those two sentences apart: the technology NVIDIA ships in the game, the community package that does not come from NVIDIA, and the install questions players are actually hitting. We do not host any mod file and we did not run one.',
    official: 'The launch build ships a documented DLSS 4.5 suite: Super Resolution, Ray Reconstruction and Dynamic Multi Frame Generation, alongside ray tracing and PC-only path tracing on GeForce RTX PCs and laptops and RTX Spark devices. NVIDIA describes the path-traced lighting as replacing Unreal Engine’s hardware ray-traced Lumen global illumination with ReSTIR GI, which adds bounced lighting and colour bleeding. That is the whole official stack. NVIDIA’s launch post never presents the title as a DLSS 5 game, and VideoCardz stated on 2026-10-31 that the game does not include DLSS 5 Neural Rendering. The March 16, 2026 planned list still names the title, so the state recorded here is "announced" for DLSS 5 specifically — not for DLSS 4.5, which is live in the shipped build.',
    outside: 'What circulates for this title is not an official DLSS 5 integration but a community package uploaded to Nexus Mods on 2026-10-29: ReShade 6.8, the RenoDX DLSS addon and NVIDIA’s DLSSNR runtime, redirecting the game’s existing DLSS calls through a DXGI proxy (VideoCardz, 2026-10-31). We have not opened, run or validated it, and the outlet records that it has not been independently benchmarked. Whatever it renders, a redirected or replaced library is not the integration NVIDIA defines, and a mod appearing within days of launch is not vendor confirmation. This page records the official status, the install questions and an independent alternative; it does not vouch for any mod.',
    blocks: [
      {
        type: 'facts', heading: 'The game in eight lines',
        intro: 'Everything here is dated and attributed. Where a number comes from someone else, the note says who measured or reported it; where nothing is known, the line says so instead of guessing.',
        rows: [
          { label: 'Released', value: '2026-10-28 at 7pm PT — 2026-10-29 in UTC — on Steam, the Epic Games Store and PlayStation 5', note: 'NVIDIA dates the launch to the hour in its own launch post; Wikipedia records the release date as 29 October 2026.' },
          { label: 'Studio and engine', value: 'S-GAME, on Unreal Engine 5 — released in Chinese as 影之刃零', note: 'Developed and published by S-GAME, based in Beijing. Recorded by Wikipedia and by PCGamingWiki.' },
          { label: 'What ships on RTX hardware', value: 'DLSS 4.5 with Ray Reconstruction and Dynamic Multi Frame Generation, plus ray tracing and PC-only path tracing', note: 'NVIDIA launch post, 2026-10-28; the driver post from 2026-10-20 announced support for that launch.' },
          { label: 'DLSS 5', value: 'Not included. The shipped build has DLSS 4.5; a community mod attempts the neural-rendering path', note: 'VideoCardz, 2026-10-31: the game "does not include DLSS 5 Neural Rendering".' },
          { label: 'Upscaling you can pick in-game', value: 'DLSS 4.5, FSR 4.1, XeSS 2 and TSR, with frame generation from all three vendors and a frame-rate slider from 30 to 360', note: 'PCGamingWiki graphics table, read 2026-11-02. This is the game menu, not our measurement.' },
          { label: 'DRM', value: 'Denuvo Anti-Piracy on every store version', note: 'PCGamingWiki records that all versions require it. Read the install section before adding any mod.' },
          { label: 'Disk, memory, floor', value: '145 GB and an SSD are required; 16 GB RAM; GTX 1660 or RX 5500 XT minimum, RTX 3060 Ti or RX 6700 XT recommended', note: 'PCGamingWiki system requirements: the minimum row targets 1080p at 30 with upscaling, the recommended row 1440p at 60 with upscaling.' },
          { label: 'How it landed with critics', value: 'Metacritic 88 on PC and 87 on PS5; OpenCritic 97% of critics recommend', note: 'Aggregate figures recorded in Wikipedia, which cites Metacritic and OpenCritic read on 2026-11-01.' },
        ],
      },
      {
        type: 'timeline', heading: 'The first five days, dated',
        intro: 'This game is not a rumour any more, and that changes the question. The searches arriving here are no longer "when does it come out" but "why does my menu not have the option" and "is this mod real".',
        items: [
          { date: '2026-10-20', title: 'NVIDIA ships a Game Ready driver for the launch', detail: 'The driver post names Phantom Blade Zero as launching October 28 "with a full suite of DLSS 4.5 technologies", and points players at the driver before launch.', href: GAME_SOURCES.driver1020, hrefLabel: 'NVIDIA driver post' },
          { date: '2026-10-28', title: 'Launch, with DLSS 4.5 and path tracing', detail: 'NVIDIA’s launch post confirms DLSS 4.5 with Ray Reconstruction and Dynamic Multi Frame Generation, ray tracing, PC path tracing and playability on GeForce RTX and RTX Spark. It says nothing about DLSS 5 for this title.', href: GAME_SOURCES.october28, hrefLabel: 'NVIDIA launch post' },
          { date: '2026-10-29', title: 'A one-click DLSS 5 package appears on Nexus Mods', detail: 'VideoCardz dates the upload to October 29 and describes it as ReShade 6.8 plus the RenoDX DLSS addon plus NVIDIA’s DLSSNR runtime, with a DXGI proxy forwarding the game’s existing DLSS calls.', href: 'https://videocardz.com/newz/phantom-blade-zero-gets-unofficial-nvidia-dlss-5-mod-less-than-24-hours-after-launch', hrefLabel: 'VideoCardz, 2026-10-31' },
          { date: '2026-10-30', title: 'The same week’s non-NVIDIA reports start', detail: 'eTeknix reported Borderless Gaming bringing DLSS 5 and frame generation to non-NVIDIA GPUs, and on 2026-11-01 that modders had made DLSS 5 faster. We recorded those reports, and reproduced none of them.', href: '/blog/dlss-5-on-non-nvidia-cards-mod-boundary-2026', hrefLabel: 'Our dated record of those reports' },
          { date: '2026-10-31', title: 'Two reports, one day: the mod, and a Radeon card', detail: 'VideoCardz published the mod story and noted that some users already report installation problems; GameGPU reported DLSS ray reconstruction and XeMFG x4 running on a Radeon RX 9070 XT through a community mod. Neither outlet’s machine is ours.', href: 'https://videocardz.com/newz/phantom-blade-zero-gets-unofficial-nvidia-dlss-5-mod-less-than-24-hours-after-launch', hrefLabel: 'VideoCardz, 2026-10-31' },
          { date: '2026-11-01', title: 'First-weekend concurrency recorded', detail: 'Reporters put the first-weekend Steam peak at 833,921 players, described as a 2026 single-player record, after more than 720,000 on launch day. Both figures are reported numbers recorded in Wikipedia, not ours.', href: 'https://en.wikipedia.org/wiki/Phantom_Blade_Zero', hrefLabel: 'Wikipedia’s sourced summary' },
          { date: '2026-11-02', title: 'This page’s check', detail: 'We re-read NVIDIA’s launch and driver posts and VideoCardz’s story: the game is out, DLSS 4.5 is in it, DLSS 5 is not, and no vendor document says otherwise today.', href: GAME_SOURCES.october28, hrefLabel: 'NVIDIA launch post' },
        ],
      },
      {
        type: 'table', heading: 'What the game actually has, feature by feature',
        intro: 'A reader who wants to know whether to expect a DLSS 5 switch in the menu can answer it here in one screen.',
        columns: ['Feature', 'In this game', 'Where that comes from'],
        rows: [
          ['DLSS 4.5 Super Resolution', 'Shipped and selectable in the game menu', 'NVIDIA launch post, 2026-10-28; PCGamingWiki graphics table'],
          ['DLSS Ray Reconstruction', 'Shipped with the launch build', 'NVIDIA launch post, 2026-10-28'],
          ['Dynamic Multi Frame Generation', 'Shipped; needs supported RTX hardware', 'NVIDIA launch post, 2026-10-28'],
          ['Path tracing', 'PC-only; ReSTIR GI replaces Lumen global illumination when enabled', 'NVIDIA launch post, 2026-10-28'],
          ['NVIDIA Reflex', 'Shipped. NVIDIA claims up to 49% lower PC latency — their figure, not our measurement', 'NVIDIA launch post, 2026-10-28'],
          ['DLSS 5 neural rendering', 'Not included in the shipped build', 'VideoCardz, 2026-10-31'],
          ['FSR 4.1, XeSS 2, TSR', 'Selectable next to DLSS in the same menu', 'PCGamingWiki graphics table, read 2026-11-02'],
          ['Community DLSS 5 mod', 'Unofficial and not independently benchmarked', 'VideoCardz, 2026-10-31'],
        ],
        note: 'We ran none of these mods and we quote no frame rates. The only numbers here that describe NVIDIA’s own claims are marked as theirs.',
      },
      {
        type: 'figure', heading: 'Our own material, labelled as ours',
        items: [
          { src: '/examples/dlss5-game-style-transition.mp4', alt: 'Six-second capture of our style-conversion workflow on a game-style character frame', video: true, href: '/before-after', hrefLabel: 'Try the same workflow' },
        ],
        caption: 'Our style-conversion workflow on a game-style character frame from our own library — six seconds, 1280×720. It is not a Phantom Blade Zero frame, it is not DLSS 5, and the game’s renderer is untouched. We have no verified material from inside Phantom Blade Zero, so we show none.',
      },
      {
        type: 'figure', heading: 'What a small, soft source image becomes',
        items: [
          { src: '/examples/compare-20261102/input-lowres.jpg', alt: 'The 320 by 213 input image', label: 'Input — 320×213, 12,287 bytes' },
          { src: '/examples/compare-20261102/ours.webp', alt: 'The 1024 by 1024 result from our own pipeline', label: 'Our pipeline — 1024×1024, 309,502 bytes' },
        ],
        caption: 'One input through our own pipeline on 2026-11-02, four steps at seed 42. The book-spine lettering gets rewritten rather than recovered — that is the honest limit of a generative redraw, and the reason this page does not promise detail a source image never had.',
      },
      {
        type: 'issues', placement: 'bottom', heading: 'Install and troubleshooting, question by question',
        intro: 'These are the questions that arrive with this title right now. Each answer says what a dated source documents; where we have no evidence, the answer says that too. We do not distribute mod files or NVIDIA runtimes, and we do not walk anyone through obtaining them.',
        items: [
          { question: 'Why is there no DLSS 5 option in the settings menu?', answer: 'Because the game does not have one. The shipped build carries DLSS 4.5, and VideoCardz states directly that Phantom Blade Zero does not include DLSS 5 Neural Rendering. Anything claiming otherwise for this title is a community package, not a menu entry — so no amount of driver reinstalling will make a DLSS 5 switch appear.' },
          { question: 'What does the “one-click” package actually install?', answer: 'VideoCardz describes the Nexus Mods upload as ReShade 6.8 plus the RenoDX DLSS addon plus NVIDIA’s DLSSNR runtime, with a DXGI proxy redirecting the game’s existing DLSS calls to the neural-rendering runtime. It reportedly leaves the executable alone, which is why it does not need to patch the game binary. We have not opened or run the package, and we host no copy of it.' },
          { question: 'Does the mod have hard requirements?', answer: 'VideoCardz records two from the author: DLSS Quality or Balanced must be the active mode, and it was validated on a GeForce RTX 5090 D, reportedly also working on RTX 40 Series cards. Those are the author’s claims relayed by a news outlet — not a test we or anyone independent ran.' },
          { question: 'People say it does not work. Why?', answer: 'VideoCardz notes the mod "has not been independently benchmarked, and some users have already reported installation problems". We cannot tell you which step fails on your machine. One plausible conflict is another tool holding the same DXGI slot — treat that as a hypothesis, not a diagnosis we verified.' },
          { question: 'Will a game update break it?', answer: 'The package depends on the game’s existing DLSS integration, so anything that changes that integration is a risk. We have not tested an update against it, and we have no report from the mod’s author about update behaviour. Back up before you try, and expect to re-check after every patch.' },
          { question: 'How do I get back to a clean install?', answer: 'Use the store rather than file surgery: Steam’s “Verify integrity of game files” and the Epic Games Store’s verify option restore modified files. PCGamingWiki records where the game keeps its own data — configuration under %LOCALAPPDATA%\\ProjectPBZ\\Saved\\Config\\Windows\\ and saves under <game folder>\\ProjectPBZ\\Saved\\SaveGames\\Steam\\<user-id>\\ — so copy those out first if a run is in progress.' },
          { question: 'Does Denuvo flag a mod like this?', answer: 'PCGamingWiki records Denuvo Anti-Piracy on all store versions. We have found no statement from S-GAME, Denuvo or NVIDIA about how it treats this specific package, so we will neither call it safe nor predict a ban. If that uncertainty is unacceptable to you, that is a good reason to skip it.' },
          { question: 'Do I have the hardware for path tracing at all?', answer: 'NVIDIA describes the ray-traced and path-traced features as running on GeForce RTX PCs and laptops and RTX Spark devices. The game’s minimum row is a GTX 1660 or RX 5500 XT, which is not that class of hardware. Check your exact model in our cards checker before buying anything for this title.' },
          { question: 'Are 145 GB and an SSD really required?', answer: 'That is what PCGamingWiki’s system requirements table records, with 16 GB of RAM on both rows. If you are short on space, that is an install-time problem no mod solves.' },
        ],
      },
      {
        type: 'voices', placement: 'bottom', heading: 'What reviewers and players actually said',
        intro: 'Quotes are reproduced only where a dated source prints them, and the source is named in the line. We did not review the game, and we do not relay performance numbers we did not measure.',
        items: [
          { who: 'Metacritic — PC', what: '88/100 from critics', date: '2026-11-01', sourceLabel: 'Recorded in Wikipedia, citing Metacritic', sourceHref: 'https://en.wikipedia.org/wiki/Phantom_Blade_Zero' },
          { who: 'Metacritic — PS5', what: '87/100 from critics', date: '2026-11-01', sourceLabel: 'Recorded in Wikipedia, citing Metacritic', sourceHref: 'https://en.wikipedia.org/wiki/Phantom_Blade_Zero' },
          { who: 'OpenCritic', what: '97% of critics recommend it', date: '2026-11-01', sourceLabel: 'Recorded in Wikipedia, citing OpenCritic', sourceHref: 'https://en.wikipedia.org/wiki/Phantom_Blade_Zero' },
          { who: 'Steam concurrency', what: 'More than 720,000 players on launch day and 833,921 at the first weekend’s peak, reported as a 2026 single-player record', date: '2026-11-01', sourceLabel: 'Reported by GameSpot and Tech4Gamers, recorded in Wikipedia', sourceHref: 'https://en.wikipedia.org/wiki/Phantom_Blade_Zero' },
          { who: 'The Outer Haven', what: '“On my PC, equipped with an RTX 5090… the game ran like a dream”', sourceLabel: 'Quoted in NVIDIA’s launch post', sourceHref: GAME_SOURCES.october28 },
          { who: 'DSOGaming', what: '“With Path Tracing on, Phantom Blade Zero is one of the best-looking games on PC”', sourceLabel: 'Quoted in NVIDIA’s launch post', sourceHref: GAME_SOURCES.october28 },
          { who: 'GamesRadar', what: '“A GOTY contender with combat that looks as good as it feels”', sourceLabel: 'Quoted in NVIDIA’s launch post', sourceHref: GAME_SOURCES.october28 },
          { who: 'The modding scene', what: 'Within a day the community had an unofficial DLSS 5 path, parry-timing control and a way to unlock the hardest mode immediately — players are asking for more control and more image quality at the same time', sourceLabel: 'VideoCardz, 2026-10-31', sourceHref: 'https://videocardz.com/newz/phantom-blade-zero-gets-unofficial-nvidia-dlss-5-mod-less-than-24-hours-after-launch' },
          { who: 'Our own read', what: 'On RTX hardware the game already ships path tracing, so the mod scene is not filling a missing core feature — it is chasing a version number NVIDIA has not shipped for this title, and that gap is where most of the confusion arrives from search.' },
        ],
      },
    ],
    faq: [
      { question: 'Is DLSS 5 available in Phantom Blade Zero?', answer: 'Not from NVIDIA. The game shipped on 2026-10-28 with DLSS 4.5, ray tracing and path tracing, and VideoCardz reported on 2026-10-31 that it does not include DLSS 5 Neural Rendering. The March 16, 2026 planned list still names the title, so DLSS 5 stays announced and unreleased here.' },
      { question: 'Then where does “DLSS 5 in Phantom Blade Zero” come from?', answer: 'From a community package on Nexus Mods, uploaded 2026-10-29, that combines ReShade, the RenoDX DLSS addon and NVIDIA’s DLSSNR runtime behind a DXGI proxy. VideoCardz describes it; nobody independent has benchmarked it, and some users already report installation problems.' },
      { question: 'Do the community mods prove DLSS 5 works?', answer: 'No. A modified package, a redirected library or a captured frame is not vendor confirmation, and we have not validated any such method for this title. What a mod shows is that someone redirected the calls — not that NVIDIA supports the game.' },
      { question: 'Which upscalers does the game offer instead?', answer: 'PCGamingWiki records DLSS 4.5, FSR 4.1, XeSS 2 and TSR in the same menu, with frame generation from all three vendors and a frame-rate slider from 30 to 360.' },
      { question: 'Does this page install anything?', answer: 'No. It explains the boundary and points at our own independent image workflow, which converts screenshots you are entitled to process. That workflow does not enable NVIDIA DLSS 5 inside any game.' },
    ],

    resourcesHeading: 'Everything we have on Phantom Blade Zero in one list',
    resourcesIntro: 'One list, four registers: what NVIDIA documents for this title, what other outlets reported and we did not reproduce, what we ran ourselves, and the tools you can use right now. Nothing here is a download of NVIDIA files or a copy of anybody’s mod.',
    resources: [
      { kind: 'official', date: '2026-10-28', label: 'NVIDIA launch post: DLSS 4.5, ray tracing and path tracing in Phantom Blade Zero', href: GAME_SOURCES.october28, note: 'The primary document for what this game actually ships: the DLSS 4.5 suite, ReSTIR GI path tracing and the RTX/RTX Spark scope. It never presents the title as a DLSS 5 game.' },
      { kind: 'official', date: '2026-10-20', label: 'NVIDIA Game Ready driver post for this launch', href: GAME_SOURCES.driver1020, note: 'The driver note published eight days before launch, naming Phantom Blade Zero as a DLSS 4.5 title. Useful if you are matching a driver version to the build you are running.' },
      { kind: 'official', date: '2026-03-16', label: 'NVIDIA DLSS 5 announcement and planned-game list', href: GAME_SOURCES.march, note: 'Still the only NVIDIA statement that names the title for DLSS 5: it appears in the planned list. The launch post of 2026-10-28 does not carry it over, which is why the DLSS 5 state stays announced.' },
      { kind: 'press', date: '2026-10-31', label: 'VideoCardz: an unofficial DLSS 5 mod inside the game less than 24 hours after launch', href: 'https://videocardz.com/newz/phantom-blade-zero-gets-unofficial-nvidia-dlss-5-mod-less-than-24-hours-after-launch', note: 'The single most useful third-party record: what the package contains, what it requires, that the game itself has no DLSS 5, and that some users already report installation problems. We reproduced nothing in it.' },
      { kind: 'press', date: '2026-11-02', label: 'What the weekend mod reports claimed — and where the boundary is', href: '/blog/dlss-5-on-non-nvidia-cards-mod-boundary-2026', note: 'Our dated record of the VideoCardz, GameGPU (10-31) and eTeknix (10-30, 11-01) reports, including the Radeon RX 9070 XT claim. No frame rate is quoted, because none of those machines are ours.' },
      { kind: 'press', date: '2026-11-02', label: 'PCGamingWiki: the technical sheet for this title', href: 'https://www.pcgamingwiki.com/wiki/Phantom_Blade_Zero', note: 'Where the upscaler list, the Denuvo note, the 145 GB and SSD requirement and the configuration and save paths on this page come from. A community wiki, not a vendor — read it as a dated snapshot.' },
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
  const checked = page.checked ?? GAMES_CHECKED;
  return [
    {'@context':'https://schema.org','@type':'WebPage',name:page.title,url:`${SITE_URL}${page.path}`,dateModified:checked,description:GAME_DETAIL_EVIDENCE[page.slug].detail.en,citation:GAME_DETAIL_EVIDENCE[page.slug].sources.map(k=>GAME_SOURCES[k])},
    {'@context':'https://schema.org','@type':'FAQPage',mainEntity:page.faq.map(q=>({'@type':'Question',name:q.question,acceptedAnswer:{'@type':'Answer',text:q.answer}}))},
  ];
}
