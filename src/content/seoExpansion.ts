import { LOCAL_SOFTWARE } from './dlssChecker';
import { w2Page } from './w2Expansion';

export type ExpansionKind = 'guides' | 'what-is' | 'vs-dlss-45' | 'vs-fsr-4' | 'system-requirements' | 'status' | 'dlss-5-apk' | 'games' | 'nba-2k27' | 'benchmark';
export type ExpansionLocale = 'en' | 'zh';

type LinkItem = { label: string; href: string };
type FaqItem = { question: string; answer: string };
type GuideSection = { heading: string; body: string };
export type ExpansionPage = {
  kind: ExpansionKind;
  locale: ExpansionLocale;
  path: string;
  title: string;
  description: string;
  heading: string;
  lead: string;
  keywords: readonly string[];
  links: LinkItem[];
  facts: ReadonlyArray<readonly [string, string]>;
  faq: ReadonlyArray<readonly [string, string]>;
  sourceLinks: LinkItem[];
  sections?: ReadonlyArray<GuideSection>;
  table?: { headers: string[]; rows: string[][] };
  itemList?: ReadonlyArray<{ name: string; url: string }>;
};

const OFFICIAL_DLSS5 = 'https://www.nvidia.com/en-us/geforce/news/dlss-5-3d-guided-neural-rendering/';
const OFFICIAL_FAQ = 'https://www.nvidia.com/en-us/geforce/forums/nvidia-app/129/583738/dlss-5-faq-932026/';
const OFFICIAL_MARCH = 'https://www.nvidia.com/en-gb/geforce/news/dlss5-breakthrough-in-visual-fidelity-for-games/';
const OFFICIAL_DLSS45 = 'https://www.nvidia.com/en-us/geforce/news/dlss-4-5-dynamic-multi-frame-gen-6x-2nd-gen-transformer-super-res/';
const OFFICIAL_FSR = 'https://www.amd.com/en/products/graphics/technologies/fidelityfx/super-resolution.html';

const copy = {
  en: {
    guides: {
      title: 'DLSS 5 Guides: Setup, Conversion and Evidence | DLSS5NVIDIA',
      description: 'A source-led guide hub for DLSS 5 setup questions, image conversion, visual enhancement and GPU evidence.',
      heading: 'DLSS 5 guides for a repeatable workflow',
      lead: 'Start with the task you actually need: understand the technology, check the evidence, run a free conversion, or inspect a before-and-after result.',
      keywords: ['dlss 5 setup guide', 'how to enable dlss 5', 'dlss 5 online converter', 'dlss 5 visual enhancer'],
      facts: [
        ['Start with evidence', 'The sister GPU checker keeps model status, VRAM and source links separate from our browser tools.'],
        ['Try before signing in', 'Cached character and enhancer examples let you inspect a result before uploading your own image.'],
        ['Keep the distinction clear', 'Official DLSS 5 is an in-game neural-rendering technology; this site provides independent image workflows and explanations.'],
      ],
      faq: [
        ['Where should I start?', 'Use the technical guide for concepts, the free enhancer for an existing image, or the character workflow for a game-frame style conversion.'],
        ['Does this install an NVIDIA runtime?', 'No. The browser tools are independent workflows and do not replace or modify an official NVIDIA game runtime.'],
        ['Can I check my GPU first?', 'Yes. Open the source-linked GPU evidence checker before deciding whether a game feature or local Studio workflow applies to your card.'],
      ],
      sections: [
        { heading: 'A four-step way to use this hub', body: 'Start with the definition page when the terminology is unclear. Next, use the comparison pages to separate neural rendering, super resolution and frame generation. Then check the dated status page or the sister GPU checker before treating a hardware claim as current. Finally, run the independent browser sample so you can inspect a result instead of inferring quality from a label. Each step has a different job; combining them keeps an official game claim separate from a browser conversion result.' },
        { heading: 'What to record when you test a result', body: 'Keep the source image, output dimensions, browser or local Studio path, model or preset name, and the date you ran it. For a visual review, inspect structure, identity, texture and edge halos at the same zoom. For a game feature, record the game build, driver, GPU and setting. These notes make a later comparison reproducible and prevent a single attractive screenshot from becoming an unsupported performance promise.' },
      ],
    },
    'what-is': {
      title: 'What Is DLSS 5? Neural Rendering Explained | DLSS5NVIDIA',
      description: 'An evidence-first explanation of NVIDIA DLSS 5, 3D-guided neural rendering, supported hardware and the boundary between the official runtime and independent tools.',
      heading: 'What is DLSS 5 neural rendering?',
      lead: 'DLSS 5 is NVIDIA’s 3D-guided neural-rendering stage for games. It works with the rendered frame and developer controls to improve lighting and material response while preserving scene structure.',
      keywords: ['what is dlss 5', 'dlss 5 neural rendering explained', 'how does dlss 5 work', 'dlss 5 3d guided neural rendering'],
      facts: [
        ['Official debut', 'NVIDIA says DLSS 5 debuted in NBA 2K27 on September 3, 2026.'],
        ['Current hardware statement', 'NVIDIA’s September FAQ names GeForce RTX 50 Series GPUs and laptops, plus GeForce NOW Ultimate streaming from RTX 5080 rigs.'],
        ['RTX 40 plan (checked 2026-10-11)', 'NVIDIA says it plans to work on expanding official support to GeForce RTX 40 Series after RTX 50 performance is more fully tuned; no date or current-support promise is given.'],
        ['Independent boundary', 'DLSS5NVIDIA’s browser converter is an independent visual workflow, not the NVIDIA DLSS game runtime.'],
      ],
      faq: [
        ['Is DLSS 5 an image generator?', 'No. Official DLSS 5 is an in-game rendering stage. A browser image converter can create a visual reference from an uploaded image, but it is a separate product path.'],
        ['Does DLSS 5 replace ray tracing?', 'No. NVIDIA describes it as a later neural-rendering stage that complements rasterization, ray tracing and path tracing.'],
        ['Is RTX 40 support confirmed?', 'NVIDIA’s FAQ describes expansion to RTX 40 as planned, so this page does not present it as current confirmed support.'],
      ],
      sections: [
        { heading: 'Where DLSS 5 sits in the pipeline', body: 'NVIDIA describes DLSS 5 as a 3D-guided neural-rendering stage for games. The game still supplies a rendered frame and scene information; the neural stage works with developer controls for lighting, materials and semantic response. That description is different from a prompt-driven image generator, which creates or edits a supplied image from text instructions. It is also different from Super Resolution, whose primary task is reconstructing a higher-resolution image from a lower-resolution input.' },
        { heading: 'How to read the hardware language', body: 'The September 2026 NVIDIA FAQ documents the debut for GeForce RTX 50 Series GPUs and laptops and GeForce NOW. It also says NVIDIA plans to work on expanding official support to GeForce RTX 40 Series after RTX 50 performance is more fully tuned. “Plans to expand” is a future statement, not a current compatibility guarantee, so this site keeps RTX 40 model results unconfirmed until NVIDIA publishes a concrete support update.' },
      ],
    },
    'vs-dlss-45': {
      title: 'DLSS 5 vs DLSS 4.5: What Is Different? | DLSS5NVIDIA',
      description: 'Compare DLSS 5 vs DLSS 4.5: supported GPUs, RTX 50 series feature limits and what remains unverified, with dated NVIDIA sources.',
      heading: 'DLSS 5 vs DLSS 4.5',
      lead: 'These names describe different jobs in the rendering stack. DLSS 4.5 focuses on transformer-based super resolution and frame-generation modes; DLSS 5 adds a 3D-guided neural-rendering stage for lighting and materials.',
      keywords: ['dlss 5 vs dlss 4.5', 'dlss 4.5 vs dlss 5', 'dlss 5 performance comparison', 'dlss neural rendering comparison'],
      facts: [
        ['DLSS 5', 'NVIDIA describes a 3D-guided neural-rendering stage with structure, tone and semantic controls.'],
        ['DLSS 4.5', 'NVIDIA describes a second-generation transformer model for Super Resolution and Dynamic Multi Frame Generation.'],
        ['How to compare', 'Keep the same game, resolution and settings; do not treat a browser conversion result as an official in-game benchmark.'],
      ],
      table: {
        headers: ['Question', 'DLSS 5', 'DLSS 4.5'],
        rows: [
          ['Primary job', 'Neural rendering for lighting and materials', 'Super Resolution and frame-generation improvements'],
          ['Controls', 'Structure, tone and semantic masking for developers', 'Model and frame-generation modes in supported workflows'],
          ['Source', 'NVIDIA September 2026 launch article', 'NVIDIA January 2026 DLSS 4.5 announcement'],
        ],
      },
      faq: [
        ['Can DLSS 5 and DLSS 4.5 be used together?', 'NVIDIA describes DLSS 5 as working with Super Resolution, Frame Generation and Ray Reconstruction, so the technologies serve complementary stages.'],
        ['Is this page a performance benchmark?', 'No. It is a dated feature comparison. Performance depends on the game, driver, GPU and settings.'],
      ],
      sections: [
        { heading: 'Compare roles before comparing numbers', body: 'DLSS 4.5 and DLSS 5 are not two presets that can be swapped in a generic image editor. DLSS 4.5 documentation focuses on transformer-based Super Resolution and Dynamic Multi Frame Generation. DLSS 5 documentation adds a 3D-guided neural-rendering stage for lighting and material response. A fair article therefore compares the documented role, the required game integration and the stated hardware scope before discussing output quality or frame rate.' },
        { heading: 'A reproducible comparison protocol', body: 'Use the same game scene, resolution, graphics preset, driver branch and capture method. Record whether the measurement is an official NVIDIA figure, a local Studio run or an independent browser conversion. Do not combine an in-game frame-rate result with a still-image conversion and call the pair a benchmark. The only measured local video snapshot published here is 36 frames from a 3-second 720p clip in 87.4 seconds on one RTX 4090 reference machine; it is batch context, not a DLSS 5 versus DLSS 4.5 speed claim.' },
      ],
    },
    'vs-fsr-4': {
      title: 'DLSS 5 vs FSR 4: Neural Rendering Compared | DLSS5NVIDIA',
      description: 'Do I use FSR or DLSS? Compare DLSS 5 vs FSR 4 by supported GPUs and game features, with NVIDIA and AMD sources and unverified claims clearly marked.',
      heading: 'DLSS 5 vs FSR 4',
      lead: 'DLSS 5 and FSR 4 are vendor technologies in game-rendering pipelines. Compare the documented role, hardware scope and developer integration instead of promising a universal winner.',
      keywords: ['dlss 5 vs fsr 4', 'dlss 5 fsr 4 comparison', 'nvidia dlss 5 amd fsr 4', 'neural rendering comparison'],
      facts: [
        ['DLSS 5 source', 'NVIDIA documents 3D-guided neural rendering and its developer controls in the September 2026 launch article.'],
        ['FSR 4 source', 'AMD’s FidelityFX Super Resolution page is the source for AMD’s current product description; individual game support still needs its own evidence.'],
        ['Fair scope', 'A browser conversion on this site is independent and must not be labelled as either NVIDIA DLSS or AMD FSR.'],
      ],
      table: {
        headers: ['Dimension', 'DLSS 5', 'FSR 4'],
        rows: [
          ['Vendor', 'NVIDIA', 'AMD'],
          ['What this page compares', 'Official neural-rendering role and controls', 'Official FidelityFX Super Resolution description'],
          ['What it does not prove', 'Universal image quality or FPS ranking', 'Universal image quality or FPS ranking'],
        ],
      },
      faq: [
        ['Is the DLSS5NVIDIA converter DLSS 5?', 'No. It is an independent browser image workflow inspired by the visual goal; it does not install or emulate the NVIDIA runtime.'],
        ['Which technology is better?', 'There is no universal answer without fixing a game, GPU, driver, resolution and image-quality test.'],
      ],
      sections: [
        { heading: 'Keep the vendor claims separate', body: 'NVIDIA and AMD publish different products, integration guidance and supported-game lists. This page links to each vendor’s own description and does not turn a marketing phrase into a cross-vendor score. DLSS 5 refers to NVIDIA’s documented neural-rendering stage; FSR 4 refers to AMD’s FidelityFX Super Resolution family. A browser conversion on this site belongs to neither runtime.' },
        { heading: 'A fair test for a real project', body: 'Choose one source frame, one target size and one review checklist. Inspect silhouettes and repeated geometry first, then faces, text, thin edges and texture. Keep the original beside the output and record any prompt, preset or post-processing step. If the task is a game feature, use a game-specific support source; if it is an image task, run the same upload through the independent browser tool. This produces a useful decision without pretending that one universal winner exists.' },
      ],
    },
    'system-requirements': {
      title: 'DLSS 5 System Requirements and GPU Support | DLSS5NVIDIA',
      description: 'Separate NVIDIA’s official DLSS 5 game requirements from DLSS5 Studio local requirements and the free browser converter path.',
      heading: 'DLSS 5 system requirements: three different paths',
      lead: '“DLSS 5 requirements” can mean an official game feature, the local DLSS5 Studio workflow, or the browser converter. Read the path you actually plan to use.',
      keywords: ['dlss 5 system requirements', 'dlss 5 minimum requirements', 'dlss 5 driver version', 'rtx 50 dlss 5 support'],
      facts: [
        ['Official game path', 'NVIDIA’s September FAQ names RTX 50 Series GPUs and laptops for the current DLSS 5 debut, plus GeForce NOW Ultimate streaming from RTX 5080 rigs.'],
        ['RTX 40 plan (checked 2026-10-11)', 'The FAQ says NVIDIA plans to work on expanding official support to GeForce RTX 40 Series after RTX 50 performance is more fully tuned. This is a future plan, not current compatibility.'],
        ['Local Studio path', `${LOCAL_SOFTWARE.os}; ${LOCAL_SOFTWARE.gpu}; ${LOCAL_SOFTWARE.memory}; ${LOCAL_SOFTWARE.disk}.`],
        ['Browser path', 'The online converter is the fallback when a local RTX workflow does not fit the machine; it does not require a local NVIDIA runtime.'],
      ],
      table: {
        headers: ['Path', 'Minimum evidence', 'What we can conclude'],
        rows: [
          ['Official DLSS 5 in a game', 'NVIDIA’s game, hardware and driver documentation', 'Only publish a confirmed status when the source names it'],
          ['DLSS5 Studio local build', `${LOCAL_SOFTWARE.os}; ${LOCAL_SOFTWARE.gpu}; ${LOCAL_SOFTWARE.memory}`, 'Our own published software requirement'],
          ['Browser converter', 'A supported browser and an uploaded image', 'Independent image conversion workflow'],
        ],
      },
      faq: [
        ['What driver does the NBA 2K27 DLSS 5 debut require?', 'NVIDIA’s launch article names GeForce Game Ready Driver 616.64 WHQL for the DLSS Neural Rendering option.'],
        ['Can RTX 40 users be told they are supported?', 'Not for the official DLSS 5 game path based on the current FAQ; NVIDIA describes RTX 40 expansion as planned.'],
        ['Can I try the visual workflow without the local build?', 'Yes. Use the browser converter; it is a separate independent path from the Windows Studio request flow.'],
      ],
    },
    status: {
      title: 'DLSS 5 Support Status and Evidence Tracker | DLSS5NVIDIA',
      description: 'A dated DLSS 5 status tracker that separates NVIDIA’s confirmed statements, planned expansion and unknown model-level details.',
      heading: 'DLSS 5 support status: what is confirmed?',
      lead: 'This tracker records what an official source actually says, when we checked it and where the wording remains provisional. Unknown is a valid result.',
      keywords: ['dlss 5 confirmed', 'dlss 5 support status', 'is dlss 5 out yet', 'dlss 5 gpu support tracker'],
      facts: [
        ['Confirmed debut', 'NBA 2K27 on September 3, 2026, with DLSS Neural Rendering and driver 616.64 WHQL.'],
        ['Confirmed hardware scope', 'NVIDIA’s FAQ says all GeForce RTX 50 Series GPUs and laptops, plus GeForce NOW Ultimate on RTX 5080 rigs.'],
        ['Planned expansion (checked 2026-10-11)', 'The same FAQ says NVIDIA plans to work on expanding official support to RTX 40 Series after RTX 50 tuning. The timing is unspecified, so this remains a future plan rather than current support.'],
      ],
      sections: [
        { heading: 'How to interpret the RTX 40 statement', body: 'The FAQ wording is an official future plan: NVIDIA says it will work on expanding official support to GeForce RTX 40 Series once RTX 50 Series performance is more fully tuned. It does not give a date, a driver version or a list of games. We therefore show the plan as useful context while keeping the current model-level result unconfirmed. That distinction is deliberate: a planned expansion should not be read as a present-tense compatibility guarantee.' },
      ],
      table: {
        headers: ['Claim', 'Status', 'Source boundary'],
        rows: [
          ['NBA 2K27 launch', 'Confirmed', 'NVIDIA launch article and September FAQ'],
          ['RTX 50 Series / laptops', 'Confirmed for the documented launch scope', 'NVIDIA September FAQ'],
          ['RTX 40 Series official support', 'Planned, not current confirmed', 'NVIDIA September FAQ'],
          ['RTX 30 and older official DLSS 5 support', 'Unknown / not published here as supported', 'No matching official model-level statement in our reviewed sources'],
        ],
      },
      faq: [
        ['Why does the tracker use unknown?', 'Because a plausible inference is not an official source. Unknown prevents an unsupported compatibility claim from becoming a search snippet.'],
        ['How often is this page updated?', 'Only when a source is rechecked. The review date and source link stay with the claim.'],
        ['Where can I inspect a GPU model?', 'Use the sister GPU evidence checker for model-level VRAM, architecture and source links.'],
      ],
    },
    'dlss-5-apk': {
      title: 'DLSS 5 APK and Android Download: What Exists in 2026 | DLSS5NVIDIA',
      description: 'Looking for a DLSS 5 APK or Android download? There is no NVIDIA APK. This evidence-led page explains the supported game path and safer browser alternatives.',
      heading: 'DLSS 5 APK download: the honest Android answer',
      lead: 'There is no NVIDIA DLSS 5 APK or official Android package. DLSS 5 is documented as an in-game rendering feature for GeForce RTX 50 Series hardware and GeForce NOW, so an APK cannot add that game runtime to a phone.',
      keywords: ['dlss 5 apk', 'dlss 5 mobile download', 'dlss 5 android download', 'dlss 5 download android'],
      facts: [
        ['Current answer', 'No NVIDIA APK is listed in the reviewed NVIDIA launch and FAQ sources (checked 2026-10-13). Do not treat an unrelated installer as DLSS 5.'],
        ['Documented game path', 'NVIDIA’s September FAQ describes DLSS 5 debuting in NBA 2K27 for GeForce RTX 50 Series GPUs and GeForce NOW.'],
        ['Phone-friendly path', 'Use a browser-based image conversion workflow for a visual result, or send the game workload to a supported desktop or cloud session.'],
        ['Why APK claims are risky', 'An unknown package cannot provide the NVIDIA game integration, driver stack and GPU path described by the source. Verify the publisher before installing anything.'],
      ],
      sections: [
        { heading: 'What “DLSS 5 mobile download” can mean', body: 'Searches for an APK often mix three different jobs. A person may want the NVIDIA game feature, a way to stream a supported game to a phone, or an image tool that creates a similar visual direction from an uploaded frame. These are not interchangeable. The first requires a game integration and supported NVIDIA path; the second depends on a real remote-play or cloud service; the third is an independent browser workflow. This page keeps the terms separate so a download result does not imply a phone can install a desktop rendering runtime.' },
        { heading: 'Two practical ways to work from a phone', body: 'For a visual experiment, open the browser converter, choose a cached example and inspect the before-and-after result before signing in. It works as an image task and does not install a driver or claim to reproduce an NVIDIA game runtime. For an actual DLSS 5 game, use a supported desktop with the documented GPU path or a legitimate cloud session; the phone acts as the screen and control surface. In both cases, check the service identity, privacy terms and account controls before uploading a personal image.' },
        { heading: 'What this page does not claim', body: 'It does not claim that Android, iOS, an APK, an emulator or an unknown mod can add DLSS 5 to a phone. It also does not call the browser converter NVIDIA software. The reviewed sources establish a game-rendering debut and a GeForce NOW route, not a mobile package. We will update this page if NVIDIA publishes a real mobile product or a documented mobile download.' },
      ],
      table: { headers: ['Need', 'Documented route', 'What to expect'], rows: [
        ['Install DLSS 5 on Android', 'No documented APK', 'Do not install an unverified package'],
        ['See a DLSS-inspired image result', 'Browser converter', 'Independent image conversion; inspect the sample first'],
        ['Play a supported game remotely', 'GeForce NOW or another legitimate service', 'Availability, plan and game support depend on the provider'],
      ] },
      faq: [
        ['Is there a DLSS 5 APK for Android?', 'No NVIDIA APK is identified in the reviewed September 2026 launch and FAQ sources. DLSS 5 is described as an in-game feature for GeForce RTX 50 Series hardware and GeForce NOW.'],
        ['Can an APK add DLSS 5 to a phone?', 'No evidence supports that claim. An APK cannot by itself provide the game integration, driver and GPU path described by NVIDIA.'],
        ['How can I use a phone to see a visual result?', 'Use a browser image converter for an independent visual workflow, or use a legitimate cloud or remote-play service for a supported game.'],
        ['Is the browser converter NVIDIA DLSS 5?', 'No. It is an independent image conversion workflow and does not install or emulate an NVIDIA runtime.'],
        ['Where is the source for the September 3 debut?', 'See NVIDIA’s DLSS 5 FAQ and launch article linked below; both were checked on 2026-10-13.'],
        ['Will this page list an APK later?', 'Only if NVIDIA publishes a verifiable mobile product and download path. Until then the status remains no documented APK.'],
      ],
    },
    games: {
      title: 'DLSS 5 Supported Games: Launched and Announced Titles | DLSS5NVIDIA',
      description: 'Track DLSS 5 game support with separate launched and announced states, dated NVIDIA sources and no unsupported frame-rate claims.',
      heading: 'DLSS 5 games: launched versus announced',
      lead: 'One game is documented as launched, while a March announcement listed a planned group. Keeping those states separate prevents a trailer mention from becoming a current compatibility promise.',
      keywords: ['dlss 5 supported games', 'dlss 5 games list', 'games with dlss 5', 'nba 2k27 dlss 5'],
      facts: [
        ['Launched (checked 2026-10-13)', 'NVIDIA’s September FAQ says DLSS 5 debuted in NBA 2K27 on September 3, 2026 for all GeForce RTX 50 Series GPUs and GeForce NOW.'],
        ['Driver named by NVIDIA', 'The September launch material names GeForce Game Ready Driver 616.64 WHQL for the DLSS Neural Rendering option.'],
        ['Announced, not launch proof', 'NVIDIA’s March 16 announcement listed 15 games in a planned support group and added “and more”; that list is not presented as a current launch checklist.'],
        ['Evidence rule', 'A title stays announced until a dated NVIDIA source documents its release or feature availability. Unknown entries are omitted rather than guessed.'],
      ],
      sections: [
        { heading: 'Launched: NBA 2K27', body: 'The September NVIDIA FAQ is the current launch source reviewed for this tracker. It says that on September 3, 2026, NVIDIA DLSS 5 featuring 3D-Guided Neural Rendering debuted in NBA 2K27 for GeForce RTX 50 Series GPUs and GeForce NOW. That sentence supports a launched state for the title and scope described there. It does not automatically prove support on every GPU family, every edition or every future patch.' },
        { heading: 'Announced group from March 16', body: 'NVIDIA’s March 16 announcement named AION 2, Assassin’s Creed Shadows, Black State, CINDER CITY, Delta Force, Hogwarts Legacy, Justice, NARAKA: BLADEPOINT, NTE, Phantom Blade Zero, Resident Evil Requiem, Sea of Remnants, Starfield, The Elder Scrolls IV: Oblivion Remastered and Where Winds Meet, followed by “and more.” We retain these as announced because the source is a plan announcement, not a dated release confirmation for each title.' },
        { heading: 'How to read the tracker', body: 'Use the launched section when you need a title with a dated source statement. Use the announced section to watch the pipeline, then recheck the source before writing a support claim. This page intentionally contains no frame-rate, multiplier or cross-card performance numbers: those require a published source or a measurement on hardware we actually tested.' },
      ],
      table: { headers: ['State', 'Title', 'Evidence date', 'Meaning'], rows: [
        ['Launched', 'NBA 2K27', '2026-09-03', 'NVIDIA FAQ documents the DLSS 5 debut'],
        ['Announced', 'AION 2; Assassin’s Creed Shadows; Black State; CINDER CITY; Delta Force; Hogwarts Legacy; Justice; NARAKA: BLADEPOINT; NTE; Phantom Blade Zero; Resident Evil Requiem; Sea of Remnants; Starfield; Oblivion Remastered; Where Winds Meet', '2026-03-16', 'NVIDIA announcement list; recheck before treating as launched'],
      ] },
      faq: [
        ['What is the first launched DLSS 5 game listed here?', 'NBA 2K27. NVIDIA’s September FAQ dates the DLSS 5 debut to September 3, 2026.'],
        ['Are all 15 March titles already supported?', 'Not from that announcement alone. They remain in the announced state until a dated source confirms availability.'],
        ['Which driver does the launch material name?', 'GeForce Game Ready Driver 616.64 WHQL is named for the DLSS Neural Rendering option.'],
        ['Does the list include every DLSS 5 game?', 'No. NVIDIA’s March announcement ends with “and more”; this tracker only publishes titles with a source and state.'],
        ['Does this page provide FPS comparisons?', 'No. It tracks support states and sources, not unmeasured frame rates or multipliers.'],
        ['Where can I check hardware evidence?', 'Use the sister GPU evidence checker for model-level status, VRAM and source links.'],
      ],
      itemList: [
        { name: 'NBA 2K27 — launched', url: OFFICIAL_FAQ },
        { name: 'AION 2 — announced', url: OFFICIAL_MARCH },
        { name: 'Assassin’s Creed Shadows — announced', url: OFFICIAL_MARCH },
        { name: 'Black State — announced', url: OFFICIAL_MARCH },
        { name: 'CINDER CITY — announced', url: OFFICIAL_MARCH },
        { name: 'Delta Force — announced', url: OFFICIAL_MARCH },
        { name: 'Hogwarts Legacy — announced', url: OFFICIAL_MARCH },
        { name: 'Justice — announced', url: OFFICIAL_MARCH },
        { name: 'NARAKA: BLADEPOINT — announced', url: OFFICIAL_MARCH },
        { name: 'NTE — announced', url: OFFICIAL_MARCH },
        { name: 'Phantom Blade Zero — announced', url: OFFICIAL_MARCH },
        { name: 'Resident Evil Requiem — announced', url: OFFICIAL_MARCH },
        { name: 'Sea of Remnants — announced', url: OFFICIAL_MARCH },
        { name: 'Starfield — announced', url: OFFICIAL_MARCH },
        { name: 'The Elder Scrolls IV: Oblivion Remastered — announced', url: OFFICIAL_MARCH },
        { name: 'Where Winds Meet — announced', url: OFFICIAL_MARCH },
      ],
    },
  },
} as const;

const zhOverrides: Partial<Record<ExpansionKind, Record<string, unknown>>> = {
  guides: {
    title: 'DLSS 5 指南：设置、转换与证据 | DLSS5NVIDIA',
    description: '以来源为基础的 DLSS 5 指南中心，覆盖设置问题、图像转换、视觉增强和 GPU 证据。',
    heading: 'DLSS 5 指南：建立可复核的工作流',
    lead: '先选择你真正要完成的任务：理解技术、检查证据、运行免费转换，或查看前后效果。',
    keywords: ['dlss 5 设置指南', '如何开启 dlss 5', 'dlss 5 在线转换', 'dlss 5 视觉增强'],
    facts: [['先看证据', '姊妹 GPU 检测站把型号状态、显存和来源链接与浏览器工具分开。'], ['先试再登录', '缓存的人物与增强示例允许你先查看结果，再上传自己的图片。'], ['分清官方边界', '官方 DLSS 5 是游戏内神经渲染技术；本站提供独立的图像工作流与解释。']],
    sections: [{ heading: '使用本指南中心的四步路径', body: '术语不清时先看解释页；再用对比页区分神经渲染、超分辨率和帧生成；涉及硬件时查看带日期的状态页或姊妹 GPU 检测器；最后运行独立浏览器示例，直接检查结果。每一步用途不同，这样能把官方游戏功能和浏览器转换结果分开。' }, { heading: '测试结果时应记录什么', body: '记录原图、输出尺寸、浏览器或本地 Studio 路径、模型或预设名称及运行日期。视觉复核时固定缩放，检查结构、身份、纹理和边缘光晕；游戏功能则记录游戏版本、驱动、显卡和设置。这样后续比较可以复现，也不会把一张好看的截图写成普遍性能承诺。' }],
    faq: [['从哪里开始？', '技术指南适合了解概念；已有图片用免费增强工具；游戏画面可使用人物风格转换。'], ['这会安装 NVIDIA 运行库吗？', '不会。浏览器工具是独立工作流，不替换或修改 NVIDIA 官方游戏运行库。'], ['可以先检查显卡吗？', '可以。先打开带来源的 GPU 证据检测器，再判断游戏功能或本地 Studio 是否适用于你的显卡。']],
  },
  'what-is': {
    title: 'DLSS 5 是什么？神经渲染解释 | DLSS5NVIDIA',
    description: '以证据为先解释 NVIDIA DLSS 5、3D 引导神经渲染、支持硬件，以及官方运行时与独立工具的边界。',
    heading: 'DLSS 5 神经渲染是什么？',
    lead: 'DLSS 5 是 NVIDIA 面向游戏的 3D 引导神经渲染阶段。它结合渲染帧和开发者控制来改善光照与材质，同时保持场景结构。',
    keywords: ['dlss 5 是什么', 'dlss 5 神经渲染解释', 'dlss 5 如何工作', '3d 引导神经渲染'],
    facts: [['官方首发', 'NVIDIA 表示 DLSS 5 于 2026 年 9 月 3 日在 NBA 2K27 中首发。'], ['当前硬件口径', 'NVIDIA 9 月 FAQ 点名 GeForce RTX 50 系列显卡与笔记本，以及从 RTX 5080 云端设备串流的 GeForce NOW Ultimate。'], ['RTX 40 计划（2026-10-11 核对）', 'NVIDIA 表示会在 RTX 50 性能调校更充分后，着手扩展 RTX 40 系列的官方支持；没有给出时间，也不是当前支持承诺。'], ['独立边界', 'DLSS5NVIDIA 的浏览器转换器是独立视觉工作流，不是 NVIDIA DLSS 游戏运行时。']],
    sections: [{ heading: 'DLSS 5 位于渲染管线的哪里', body: 'NVIDIA 将 DLSS 5 描述为面向游戏的 3D 引导神经渲染阶段。游戏仍提供渲染帧与场景信息，神经阶段结合开发者控制处理光照、材质和语义响应。这不同于根据提示词生成或编辑图像的模型，也不同于把低分辨率输入重建为高分辨率输出的超分辨率。' }, { heading: '如何理解硬件措辞', body: '2026 年 9 月 NVIDIA FAQ 记录了 GeForce RTX 50 系列显卡与笔记本以及 GeForce NOW 的首发范围，同时表示计划扩展到 RTX 40 系列。“计划扩展”是未来表述，不是当前兼容性保证；在 NVIDIA 发布具体支持更新前，本页继续把 RTX 40 型号保持为未确认。' }],
    faq: [['DLSS 5 是图像生成器吗？', '不是。官方 DLSS 5 是游戏内渲染阶段；浏览器转换器可从上传图片生成视觉参考，但属于不同产品路径。'], ['DLSS 5 会替代光线追踪吗？', '不会。NVIDIA 将它描述为后置神经渲染阶段，与光栅化、光线追踪和路径追踪协同。'], ['RTX 40 已确认支持吗？', 'NVIDIA FAQ 把 RTX 40 扩展描述为计划事项，因此本站不把它写成当前已确认支持。']],
  },
  'vs-dlss-45': {
    title: 'DLSS 5 与 DLSS 4.5 有什么区别？| DLSS5NVIDIA',
    description: '使用有日期的 NVIDIA 来源，对比 DLSS 5 的 3D 引导神经渲染与 DLSS 4.5 的超分辨率和动态多帧生成。',
    heading: 'DLSS 5 与 DLSS 4.5 对比',
    lead: '两个名称对应渲染管线中的不同工作。DLSS 4.5 重点是 Transformer 超分辨率和帧生成模式；DLSS 5 增加面向光照与材质的 3D 引导神经渲染阶段。',
    keywords: ['dlss 5 对比 dlss 4.5', 'dlss 4.5 与 dlss 5', 'dlss 5 性能对比', '神经渲染对比'],
    facts: [['DLSS 5', 'NVIDIA 描述了带结构、色调和语义控制的 3D 引导神经渲染阶段。'], ['DLSS 4.5', 'NVIDIA 描述了第二代 Transformer 超分辨率模型与动态多帧生成。'], ['如何比较', '固定相同游戏、分辨率和设置；不要把浏览器转换结果当成官方游戏基准。']],
    sections: [{ heading: '先比较职责，再比较数字', body: 'DLSS 4.5 与 DLSS 5 不是通用图片编辑器里的两个预设。DLSS 4.5 文档重点是 Transformer 超分辨率和动态多帧生成；DLSS 5 增加面向光照和材质响应的 3D 引导神经渲染阶段。因此应先对比职责、游戏集成方式和硬件范围，再讨论画质或帧率。' }, { heading: '可复现的比较协议', body: '固定相同游戏场景、分辨率、图形预设、驱动分支和采集方式，记录数据来自 NVIDIA 官方、本地 Studio，还是独立浏览器转换。不要把游戏帧率和静态图片转换拼成一个基准。本页唯一公开的本地视频测量是 RTX 4090 参考机处理 3 秒 720p、36 帧用时 87.4 秒；它只是批处理背景，不是 DLSS 5 与 DLSS 4.5 的速度结论。' }],
    table: { headers: ['问题', 'DLSS 5', 'DLSS 4.5'], rows: [['主要工作', '改善光照与材质的神经渲染', '超分辨率与帧生成改进'], ['控制方式', '结构、色调与语义遮罩', '支持工作流中的模型与帧生成模式'], ['来源', 'NVIDIA 2026 年 9 月首发文章', 'NVIDIA 2026 年 1 月 DLSS 4.5 公告']] },
    faq: [['DLSS 5 与 DLSS 4.5 能一起使用吗？', 'NVIDIA 表示 DLSS 5 可与超分辨率、帧生成和光线重建协同，因此它们服务于互补阶段。'], ['这是性能基准吗？', '不是。这是一份带日期的功能对比；性能取决于游戏、驱动、显卡与设置。']],
  },
  'vs-fsr-4': {
    title: 'DLSS 5 与 FSR 4 对比：神经渲染差异 | DLSS5NVIDIA',
    description: '以来源为基础对比 NVIDIA DLSS 5 与 AMD FSR 4，区分官方游戏功能与独立浏览器图像转换。',
    heading: 'DLSS 5 与 FSR 4 对比',
    lead: 'DLSS 5 与 FSR 4 都是厂商提供的游戏渲染技术。应比较公开记录的职责、硬件范围和开发者集成，而不是承诺任何场景下的赢家。',
    keywords: ['dlss 5 对比 fsr 4', 'dlss 5 fsr 4 对比', 'nvidia dlss 5 amd fsr 4', '神经渲染对比'],
    facts: [['DLSS 5 来源', 'NVIDIA 首发文章记录了 3D 引导神经渲染及其开发者控制。'], ['FSR 4 来源', 'AMD FidelityFX Super Resolution 页面用于 AMD 当前产品描述；具体游戏支持仍需要单独证据。'], ['公平范围', '本站浏览器转换器是独立工具，不能标记为 NVIDIA DLSS 或 AMD FSR。']],
    sections: [{ heading: '分开记录厂商口径', body: 'NVIDIA 与 AMD 发布的是不同产品、集成说明和支持游戏列表。本页链接各自厂商的描述，不把营销措辞转换成跨厂商评分。DLSS 5 指 NVIDIA 文档中的神经渲染阶段；FSR 4 指 AMD 的 FidelityFX Super Resolution 家族；本站浏览器转换器不属于任何一个运行时。' }, { heading: '适合真实项目的公平测试', body: '选择一张原图、一个目标尺寸和一份检查清单，先看轮廓与重复几何，再看人脸、文字、细边和纹理。保留原图，记录提示词、预设与后处理。游戏功能要用对应游戏来源，图像任务则在本站独立工具中重复上传。这样能形成可用判断，而不是假设存在一个通用赢家。' }],
    table: { headers: ['维度', 'DLSS 5', 'FSR 4'], rows: [['厂商', 'NVIDIA', 'AMD'], ['本页比较', '官方神经渲染职责与控制', '官方 FidelityFX Super Resolution 描述'], ['本页不证明', '普遍画质或 FPS 排名', '普遍画质或 FPS 排名']] },
    faq: [['DLSS5NVIDIA 转换器就是 DLSS 5 吗？', '不是。它是受视觉目标启发的独立浏览器图像工作流，不安装或模拟 NVIDIA 运行时。'], ['哪个更好？', '没有通用答案；必须固定游戏、显卡、驱动、分辨率和画质测试。']],
  },
  'system-requirements': {
    title: 'DLSS 5 系统要求与显卡支持 | DLSS5NVIDIA',
    description: '区分 NVIDIA 官方 DLSS 5 游戏要求、本地 DLSS5 Studio 要求和免费浏览器转换路径。',
    heading: 'DLSS 5 系统要求：三条不同路径',
    lead: '“DLSS 5 要求”可能指官方游戏功能、本地 DLSS5 Studio，或浏览器转换器。请阅读与你计划使用的路径相符的部分。',
    keywords: ['dlss 5 系统要求', 'dlss 5 最低要求', 'dlss 5 驱动版本', 'rtx 50 dlss 5 支持'],
    facts: [['官方游戏路径', 'NVIDIA 9 月 FAQ 点名 RTX 50 系列显卡与笔记本，以及从 RTX 5080 云端设备串流的 GeForce NOW Ultimate。'], ['RTX 40 计划（2026-10-11 核对）', 'FAQ 表示 NVIDIA 计划在 RTX 50 性能调校更充分后扩展 RTX 40 系列官方支持；这不是当前兼容性。'], ['本地 Studio 路径', `${LOCAL_SOFTWARE.os}；${LOCAL_SOFTWARE.gpu}；${LOCAL_SOFTWARE.memory}；${LOCAL_SOFTWARE.disk}。`], ['浏览器路径', '本地 RTX 工作流不适合设备时，可使用在线转换器；它不要求本地 NVIDIA 运行时。']],
    table: { headers: ['路径', '最低证据', '可以得出的结论'], rows: [['官方游戏 DLSS 5', 'NVIDIA 的游戏、硬件与驱动资料', '只有来源点名时才发布已确认状态'], ['DLSS5 Studio 本地版', `${LOCAL_SOFTWARE.os}；${LOCAL_SOFTWARE.gpu}；${LOCAL_SOFTWARE.memory}`, '本站发布的软件要求'], ['浏览器转换器', '支持的浏览器和上传图片', '独立的图像转换工作流']] },
    faq: [['NBA 2K27 首发需要哪个驱动？', 'NVIDIA 首发文章点名 GeForce Game Ready Driver 616.64 WHQL，用来显示 DLSS Neural Rendering 选项。'], ['能否说 RTX 40 已支持？', '不能。根据 NVIDIA 当前 FAQ，官方游戏路径的 RTX 40 扩展仍是计划事项。'], ['不装本地版能试视觉工作流吗？', '可以。浏览器转换器与 Windows Studio 索取流程是两条独立路径。']],
  },
  status: {
    title: 'DLSS 5 支持状态与证据追踪 | DLSS5NVIDIA',
    description: '带日期的 DLSS 5 状态追踪，区分 NVIDIA 官方已确认、计划扩展和仍未知的型号级信息。',
    heading: 'DLSS 5 支持状态：哪些已经确认？',
    lead: '本页记录官方来源实际说了什么、核对日期，以及仍然暂定的部分。未知也是有效结果。',
    keywords: ['dlss 5 已确认', 'dlss 5 支持状态', 'dlss 5 发布了吗', 'dlss 5 显卡支持追踪'],
    facts: [['已确认首发', '2026 年 9 月 3 日 NBA 2K27 上线 DLSS Neural Rendering，并要求 616.64 WHQL 驱动。'], ['已确认硬件范围', 'NVIDIA FAQ 表示 GeForce RTX 50 系列显卡与笔记本，以及 RTX 5080 云端设备上的 GeForce NOW Ultimate。'], ['计划扩展（2026-10-11 核对）', '同一 FAQ 表示 NVIDIA 计划在 RTX 50 调优后扩展到 RTX 40 系列；时间未定，当前仍未确认。']],
    sections: [{ heading: '如何理解 RTX 40 表述', body: 'FAQ 的措辞是官方未来计划：NVIDIA 表示会在 RTX 50 系列性能调校更充分后，着手扩展 RTX 40 系列的官方支持。它没有给出日期、驱动版本或游戏清单。因此我们展示这条计划作为背景，但保留型号级未确认状态；计划扩展不能当成当前兼容性保证。' }],
    table: { headers: ['结论', '状态', '来源边界'], rows: [['NBA 2K27 首发', '已确认', 'NVIDIA 首发文章与 9 月 FAQ'], ['RTX 50 系列/笔记本', '文档首发范围已确认', 'NVIDIA 9 月 FAQ'], ['RTX 40 系列官方支持', '计划中，当前未确认', 'NVIDIA 9 月 FAQ'], ['RTX 30 及更早型号官方 DLSS 5', '未知 / 本站不写成支持', '已核对来源没有匹配的型号级确认']] },
    faq: [['为什么使用“未知”？', '因为合理推断不是官方来源。未知能防止未经支持的兼容性结论进入搜索摘要。'], ['多久更新一次？', '只有重新核对来源时才更新，复审日期和来源链接会跟随结论。'], ['在哪里查具体显卡？', '打开姊妹 GPU 证据检测器，查看型号级显存、架构和来源链接。']],
  },
  'dlss-5-apk': {
    title: 'DLSS 5 APK 与安卓下载：2026 年真实情况 | DLSS5NVIDIA',
    description: '搜索 DLSS 5 APK 或安卓下载？目前没有 NVIDIA APK。本页说明已公布的游戏路径，以及更安全的浏览器替代方案。',
    heading: 'DLSS 5 APK 下载：安卓用户需要知道的事实',
    lead: '目前没有 NVIDIA DLSS 5 APK 或官方安卓包。DLSS 5 被说明为 GeForce RTX 50 系列硬件和 GeForce NOW 上的游戏内渲染功能，APK 不能把该游戏运行时安装到手机。',
    keywords: ['dlss 5 apk', 'dlss 5 安卓下载', 'dlss 5 手机下载', 'dlss 5 download android'],
    facts: [['当前结论', '截至 2026 年 10 月 13 日核对的 NVIDIA 首发文章与 FAQ，没有列出 NVIDIA APK；不要把无关安装包当成 DLSS 5。'], ['已公布的游戏路径', 'NVIDIA 9 月 FAQ 说明 DLSS 5 于 NBA 2K27 首发，范围为 GeForce RTX 50 系列显卡与 GeForce NOW。'], ['手机可用路径', '可以使用浏览器图像转换工作流查看视觉结果，也可以交给具备独显的桌面或云端会话运行游戏。'], ['为什么要谨慎', '不明来源安装包无法提供 NVIDIA 所述的游戏集成、驱动栈和 GPU 路径；安装前先核验发布者。']],
    sections: [{ heading: '“DLSS 5 手机下载”可能指三件不同的事', body: 'APK 搜索通常混合了三种需求：官方游戏功能、把支持的游戏串流到手机，或从上传画面生成相似视觉方向的图像工具。它们不能互换。第一种需要游戏集成与受支持的 NVIDIA 路径；第二种取决于真实的云服务或远程播放；第三种是独立的浏览器工作流。本页把这些词分开，避免下载结果暗示手机可以安装桌面渲染运行时。' }, { heading: '用手机开始的两条实际路径', body: '如果目标是查看视觉效果，可以打开浏览器转换器，先选择缓存示例并查看前后结果，再决定是否登录上传。它是图像任务，不安装驱动，也不声称复现 NVIDIA 游戏运行时。如果目标是实际 DLSS 5 游戏，请使用具备文档所述 GPU 路径的桌面，或合法云端会话；手机只是屏幕和控制端。上传个人图片前，应查看服务身份、隐私条款和账户控制。' }, { heading: '本页没有做出的承诺', body: '本页没有声称 Android、iOS、APK、模拟器或不明插件可以把 DLSS 5 加到手机上，也没有把浏览器转换器称为 NVIDIA 软件。已核对来源说明的是游戏首发与 GeForce NOW 路径，而不是移动安装包。若 NVIDIA 发布可核验的移动产品或下载路径，我们再更新状态。' }],
    table: { headers: ['需求', '已公布路径', '可以期待什么'], rows: [['在安卓安装 DLSS 5', '没有已公布 APK', '不要安装未经核验的包'], ['查看类似 DLSS 的视觉结果', '浏览器转换器', '独立图像转换，先查看示例'], ['远程运行支持的游戏', 'GeForce NOW 或其他合法服务', '可用性、套餐和游戏支持由服务商决定']] },
    faq: [['有 DLSS 5 安卓 APK 吗？', '截至核对日期，NVIDIA 首发文章与 FAQ 没有列出 APK。DLSS 5 被描述为 GeForce RTX 50 系列硬件和 GeForce NOW 上的游戏内功能。'], ['APK 能给手机加上 DLSS 5 吗？', '没有证据支持这种说法。APK 本身不能提供 NVIDIA 所述的游戏集成、驱动和 GPU 路径。'], ['手机怎样查看视觉结果？', '使用浏览器图像转换器查看独立视觉工作流，或使用合法云服务、远程播放服务运行受支持的游戏。'], ['浏览器转换器就是 NVIDIA DLSS 5 吗？', '不是。它是独立图像转换工作流，不安装或模拟 NVIDIA 运行时。'], ['9 月 3 日首发的来源在哪里？', '请查看下方链接的 NVIDIA DLSS 5 FAQ 与首发文章；两者在 2026 年 10 月 13 日复核。'], ['以后会列出 APK 吗？', '只有 NVIDIA 发布可验证的移动产品和下载路径后才会列出；在此之前状态仍是没有已公布 APK。']],
  },
  games: {
    title: 'DLSS 5 支持游戏：已上线与已宣布名单 | DLSS5NVIDIA',
    description: '按已上线与已宣布分开追踪 DLSS 5 游戏，附 NVIDIA 日期来源，不写未经测量的帧率或倍数。',
    heading: 'DLSS 5 游戏：已上线与已宣布分开看',
    lead: '目前有一款游戏被资料明确写为已上线，另有一组游戏出现在 3 月公告的计划名单中。分开状态，避免把预告误读成当前兼容性承诺。',
    keywords: ['dlss 5 支持游戏', 'dlss 5 游戏列表', '哪些游戏有 dlss 5', 'nba 2k27 dlss 5'],
    facts: [['已上线（2026-10-13 核对）', 'NVIDIA 9 月 FAQ 表示 DLSS 5 于 2026 年 9 月 3 日在 NBA 2K27 首发，面向 GeForce RTX 50 系列显卡与 GeForce NOW。'], ['NVIDIA 点名的驱动', '9 月首发资料点名 GeForce Game Ready Driver 616.64 WHQL，用于 DLSS Neural Rendering 选项。'], ['已宣布，不等于上线', 'NVIDIA 3 月 16 日公告列出 15 款计划支持的游戏并写有“以及更多”；这不是当前上线清单。'], ['证据规则', '只有带日期的 NVIDIA 来源明确说明发布或功能可用，才会从“已宣布”移到“已上线”；没有出处的条目直接不写。']],
    sections: [{ heading: '已上线：NBA 2K27', body: '本追踪器目前复核到的 9 月 NVIDIA FAQ 是首发来源。它写明 2026 年 9 月 3 日，带 3D 引导神经渲染的 NVIDIA DLSS 5 在 NBA 2K27 首发，范围为 GeForce RTX 50 系列显卡与 GeForce NOW。这句话支持该标题与该范围的“已上线”状态，但不会自动证明所有显卡家族、所有版本或未来补丁都支持。' }, { heading: '3 月 16 日公告名单', body: 'NVIDIA 3 月 16 日公告列出 AION 2、Assassin’s Creed Shadows、Black State、CINDER CITY、Delta Force、Hogwarts Legacy、Justice、NARAKA: BLADEPOINT、NTE、Phantom Blade Zero、Resident Evil Requiem、Sea of Remnants、Starfield、The Elder Scrolls IV: Oblivion Remastered 与 Where Winds Meet，末尾还有“以及更多”。由于这是计划公告而不是每个标题的带日期发布确认，本页保留“已宣布”状态。' }, { heading: '如何使用追踪器', body: '需要带日期依据时看“已上线”部分；需要关注后续时看“已宣布”部分，并在写成支持前重新核对来源。本页不包含帧率、倍数或跨显卡性能数字：这些必须有公开来源，或来自我们实际测试过的硬件。' }],
    table: { headers: ['状态', '游戏', '证据日期', '含义'], rows: [['已上线', 'NBA 2K27', '2026-09-03', 'NVIDIA FAQ 记录 DLSS 5 首发'], ['已宣布', 'AION 2；Assassin’s Creed Shadows；Black State；CINDER CITY；Delta Force；Hogwarts Legacy；Justice；NARAKA: BLADEPOINT；NTE；Phantom Blade Zero；Resident Evil Requiem；Sea of Remnants；Starfield；Oblivion Remastered；Where Winds Meet', '2026-03-16', 'NVIDIA 公告名单；写成已上线前需重新核对']], },
    faq: [['这里列出的第一款已上线游戏是什么？', 'NBA 2K27。NVIDIA 9 月 FAQ 将 DLSS 5 首发日期写为 2026 年 9 月 3 日。'], ['3 月名单里的 15 款都已经支持了吗？', '仅凭那份公告不能这样说。它们保持“已宣布”状态，直到带日期来源确认可用。'], ['首发资料点名哪个驱动？', 'GeForce Game Ready Driver 616.64 WHQL。'], ['这是不是完整游戏列表？', '不是。NVIDIA 3 月公告末尾写有“以及更多”；本页只发布有来源和状态的标题。'], ['这页提供 FPS 对比吗？', '不提供。本页追踪支持状态和来源，不写未经测量的帧率或倍数。'], ['哪里查看显卡证据？', '前往姊妹 GPU 证据检测器，查看型号状态、显存与来源链接。']],
  },
};

const sharedLinks = (locale: ExpansionLocale): LinkItem[] => locale === 'zh'
  ? [
      { label: '免费图像增强工具', href: '/image-quality-enhancer' },
      { label: '游戏人物风格转换', href: '/game-character-style' },
      { label: 'GPU 来源证据检测器', href: 'https://www.dlss5.app/en/supported-cards' },
      { label: '下载与本地 Studio 说明', href: '/download' },
      { label: 'DLSS 5 安卓下载事实', href: '/zh/dlss-5-apk' },
      { label: 'DLSS 5 游戏支持追踪', href: '/zh/games' },
    ]
  : [
      { label: 'Free visual enhancer', href: '/image-quality-enhancer' },
      { label: 'Game character style conversion', href: '/game-character-style' },
      { label: 'Source-linked GPU evidence checker', href: 'https://www.dlss5.app/en/supported-cards' },
      { label: 'Download and local Studio guide', href: '/download' },
      { label: 'DLSS 5 APK and Android facts', href: '/dlss-5-apk' },
      { label: 'DLSS 5 game support tracker', href: '/games' },
    ];

const expansionLinks = (kind: ExpansionKind, locale: ExpansionLocale): LinkItem[] => {
  const links = [...sharedLinks(locale)];
  if (kind === 'games') links.push({ label: locale === 'zh' ? 'NBA 2K27 首发证据页' : 'NBA 2K27 launch evidence', href: locale === 'zh' ? '/zh/games/nba-2k27' : '/games/nba-2k27' });
  if (kind === 'benchmark') links.push({ label: locale === 'zh' ? '游戏支持追踪' : 'Game support tracker', href: locale === 'zh' ? '/zh/games' : '/games' });
  if (kind === 'nba-2k27') {
    links.push({ label: locale === 'zh' ? '返回游戏支持追踪' : 'Back to the game tracker', href: locale === 'zh' ? '/zh/games' : '/games' });
    links.push({ label: locale === 'zh' ? '查看证据中心' : 'Open the evidence center', href: locale === 'zh' ? '/zh/benchmark' : '/benchmark' });
  }
  return links;
};

const sourceLinks = (kind: ExpansionKind): LinkItem[] => {
  const common = [
    { label: 'NVIDIA DLSS 5 launch article', href: OFFICIAL_DLSS5 },
    { label: 'NVIDIA DLSS 5 FAQ (September 2026; checked 2026-10-11)', href: OFFICIAL_FAQ },
  ];
  if (kind === 'vs-dlss-45') return [...common, { label: 'NVIDIA DLSS 4.5 announcement', href: OFFICIAL_DLSS45 }];
  if (kind === 'vs-fsr-4') return [...common, { label: 'AMD FidelityFX Super Resolution', href: OFFICIAL_FSR }];
  if (kind === 'what-is') return [...common, { label: 'NVIDIA March 2026 announcement', href: OFFICIAL_MARCH }];
  if (kind === 'games') return [...common, { label: 'NVIDIA March 16, 2026 announcement list', href: OFFICIAL_MARCH }];
  return common;
};

export function expansionPage(kind: ExpansionKind, locale: ExpansionLocale): ExpansionPage {
  const c = (kind === 'nba-2k27' || kind === 'benchmark')
    ? w2Page(kind, locale)
    : locale === 'zh' ? { ...copy.en[kind], ...zhOverrides[kind] } : copy.en[kind];
  const slug = kind === 'what-is' ? 'what-is-dlss-5'
    : kind === 'vs-dlss-45' ? 'vs/dlss-5-vs-dlss-4-5'
      : kind === 'vs-fsr-4' ? 'vs/dlss-5-vs-fsr-4'
        : kind === 'nba-2k27' ? 'games/nba-2k27'
        : kind;
  const path = `${locale === 'zh' ? '/zh' : ''}/${slug}`;
  return {
    kind,
    locale,
    path,
    ...c,
    links: expansionLinks(kind, locale),
    sourceLinks: sourceLinks(kind),
  } as ExpansionPage;
}

export const EXPANSION_KINDS: ExpansionKind[] = ['guides', 'what-is', 'vs-dlss-45', 'vs-fsr-4', 'system-requirements', 'status', 'dlss-5-apk', 'games', 'nba-2k27', 'benchmark'];
export const EXPANSION_PAGES = EXPANSION_KINDS.flatMap(kind => (['en', 'zh'] as ExpansionLocale[]).map(locale => expansionPage(kind, locale)));
