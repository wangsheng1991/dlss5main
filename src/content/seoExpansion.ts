import { LOCAL_SOFTWARE } from './dlssChecker';

export type ExpansionKind = 'guides' | 'what-is' | 'vs-dlss-45' | 'vs-fsr-4' | 'system-requirements' | 'status';
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
      description: 'Compare DLSS 5 3D-guided neural rendering with DLSS 4.5 super resolution and dynamic multi frame generation using dated NVIDIA sources.',
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
      description: 'A source-led comparison of NVIDIA DLSS 5 and AMD FSR 4, separating official in-game features from independent browser image conversion.',
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
      description: 'Separate official DLSS 5 game requirements from DLSS5 Studio local requirements and the free browser converter path.',
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
      description: 'A dated DLSS 5 status tracker that separates confirmed official statements, planned expansion and unknown model-level details.',
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
  },
} as const;

const zhOverrides: Record<ExpansionKind, Record<string, unknown>> = {
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
    description: '区分官方 DLSS 5 游戏要求、本地 DLSS5 Studio 要求和免费浏览器转换路径。',
    heading: 'DLSS 5 系统要求：三条不同路径',
    lead: '“DLSS 5 要求”可能指官方游戏功能、本地 DLSS5 Studio，或浏览器转换器。请阅读与你计划使用的路径相符的部分。',
    keywords: ['dlss 5 系统要求', 'dlss 5 最低要求', 'dlss 5 驱动版本', 'rtx 50 dlss 5 支持'],
    facts: [['官方游戏路径', 'NVIDIA 9 月 FAQ 点名 RTX 50 系列显卡与笔记本，以及从 RTX 5080 云端设备串流的 GeForce NOW Ultimate。'], ['RTX 40 计划（2026-10-11 核对）', 'FAQ 表示 NVIDIA 计划在 RTX 50 性能调校更充分后扩展 RTX 40 系列官方支持；这不是当前兼容性。'], ['本地 Studio 路径', `${LOCAL_SOFTWARE.os}；${LOCAL_SOFTWARE.gpu}；${LOCAL_SOFTWARE.memory}；${LOCAL_SOFTWARE.disk}。`], ['浏览器路径', '本地 RTX 工作流不适合设备时，可使用在线转换器；它不要求本地 NVIDIA 运行时。']],
    table: { headers: ['路径', '最低证据', '可以得出的结论'], rows: [['官方游戏 DLSS 5', 'NVIDIA 的游戏、硬件与驱动资料', '只有来源点名时才发布已确认状态'], ['DLSS5 Studio 本地版', `${LOCAL_SOFTWARE.os}；${LOCAL_SOFTWARE.gpu}；${LOCAL_SOFTWARE.memory}`, '本站发布的软件要求'], ['浏览器转换器', '支持的浏览器和上传图片', '独立的图像转换工作流']] },
    faq: [['NBA 2K27 首发需要哪个驱动？', 'NVIDIA 首发文章点名 GeForce Game Ready Driver 616.64 WHQL，用来显示 DLSS Neural Rendering 选项。'], ['能否说 RTX 40 已支持？', '不能。根据当前 FAQ，官方游戏路径的 RTX 40 扩展仍是计划事项。'], ['不装本地版能试视觉工作流吗？', '可以。浏览器转换器与 Windows Studio 索取流程是两条独立路径。']],
  },
  status: {
    title: 'DLSS 5 支持状态与证据追踪 | DLSS5NVIDIA',
    description: '带日期的 DLSS 5 状态追踪，区分官方已确认、计划扩展和仍未知的型号级信息。',
    heading: 'DLSS 5 支持状态：哪些已经确认？',
    lead: '本页记录官方来源实际说了什么、核对日期，以及仍然暂定的部分。未知也是有效结果。',
    keywords: ['dlss 5 已确认', 'dlss 5 支持状态', 'dlss 5 发布了吗', 'dlss 5 显卡支持追踪'],
    facts: [['已确认首发', '2026 年 9 月 3 日 NBA 2K27 上线 DLSS Neural Rendering，并要求 616.64 WHQL 驱动。'], ['已确认硬件范围', 'NVIDIA FAQ 表示 GeForce RTX 50 系列显卡与笔记本，以及 RTX 5080 云端设备上的 GeForce NOW Ultimate。'], ['计划扩展（2026-10-11 核对）', '同一 FAQ 表示 NVIDIA 计划在 RTX 50 调优后扩展到 RTX 40 系列；时间未定，当前仍未确认。']],
    sections: [{ heading: '如何理解 RTX 40 表述', body: 'FAQ 的措辞是官方未来计划：NVIDIA 表示会在 RTX 50 系列性能调校更充分后，着手扩展 RTX 40 系列的官方支持。它没有给出日期、驱动版本或游戏清单。因此我们展示这条计划作为背景，但保留型号级未确认状态；计划扩展不能当成当前兼容性保证。' }],
    table: { headers: ['结论', '状态', '来源边界'], rows: [['NBA 2K27 首发', '已确认', 'NVIDIA 首发文章与 9 月 FAQ'], ['RTX 50 系列/笔记本', '文档首发范围已确认', 'NVIDIA 9 月 FAQ'], ['RTX 40 系列官方支持', '计划中，当前未确认', 'NVIDIA 9 月 FAQ'], ['RTX 30 及更早型号官方 DLSS 5', '未知 / 本站不写成支持', '已核对来源没有匹配的型号级确认']] },
    faq: [['为什么使用“未知”？', '因为合理推断不是官方来源。未知能防止未经支持的兼容性结论进入搜索摘要。'], ['多久更新一次？', '只有重新核对来源时才更新，复审日期和来源链接会跟随结论。'], ['在哪里查具体显卡？', '打开姊妹 GPU 证据检测器，查看型号级显存、架构和来源链接。']],
  },
};

const sharedLinks = (locale: ExpansionLocale): LinkItem[] => locale === 'zh'
  ? [
      { label: '免费图像增强工具', href: '/image-quality-enhancer' },
      { label: '游戏人物风格转换', href: '/game-character-style' },
      { label: 'GPU 来源证据检测器', href: 'https://www.dlss5.app/en/supported-cards' },
      { label: '下载与本地 Studio 说明', href: '/download' },
    ]
  : [
      { label: 'Free visual enhancer', href: '/image-quality-enhancer' },
      { label: 'Game character style conversion', href: '/game-character-style' },
      { label: 'Source-linked GPU evidence checker', href: 'https://www.dlss5.app/en/supported-cards' },
      { label: 'Download and local Studio guide', href: '/download' },
    ];

const sourceLinks = (kind: ExpansionKind): LinkItem[] => {
  const common = [
    { label: 'NVIDIA DLSS 5 launch article', href: OFFICIAL_DLSS5 },
    { label: 'NVIDIA DLSS 5 FAQ (September 2026; checked 2026-10-11)', href: OFFICIAL_FAQ },
  ];
  if (kind === 'vs-dlss-45') return [...common, { label: 'NVIDIA DLSS 4.5 announcement', href: OFFICIAL_DLSS45 }];
  if (kind === 'vs-fsr-4') return [...common, { label: 'AMD FidelityFX Super Resolution', href: OFFICIAL_FSR }];
  if (kind === 'what-is') return [...common, { label: 'NVIDIA March 2026 announcement', href: OFFICIAL_MARCH }];
  return common;
};

export function expansionPage(kind: ExpansionKind, locale: ExpansionLocale): ExpansionPage {
  const c = locale === 'zh' ? { ...copy.en[kind], ...zhOverrides[kind] } : copy.en[kind];
  const path = `${locale === 'zh' ? '/zh' : ''}/${kind === 'what-is' ? 'what-is-dlss-5' : kind === 'vs-dlss-45' ? 'vs/dlss-5-vs-dlss-4-5' : kind === 'vs-fsr-4' ? 'vs/dlss-5-vs-fsr-4' : kind}`;
  return {
    kind,
    locale,
    path,
    ...c,
    links: sharedLinks(locale),
    sourceLinks: sourceLinks(kind),
  } as ExpansionPage;
}

export const EXPANSION_KINDS: ExpansionKind[] = ['guides', 'what-is', 'vs-dlss-45', 'vs-fsr-4', 'system-requirements', 'status'];
export const EXPANSION_PAGES = EXPANSION_KINDS.flatMap(kind => (['en', 'zh'] as ExpansionLocale[]).map(locale => expansionPage(kind, locale)));
