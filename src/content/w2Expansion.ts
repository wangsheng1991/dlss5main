import type { ExpansionKind, ExpansionLocale, ExpansionPage } from './seoExpansion';

type W2Kind = Extract<ExpansionKind, 'nba-2k27' | 'benchmark'>;
type W2Copy = Omit<ExpansionPage, 'kind'|'locale'|'path'|'links'|'sourceLinks'>;

const FAQ_EN = {
  'nba-2k27': [
    ['Is NBA 2K27 the first DLSS 5 game named by NVIDIA?', 'The September FAQ identifies NBA 2K27 as the debut title for DLSS 5 on September 3, 2026.'],
    ['Which GPUs are named for the debut?', 'The FAQ names GeForce RTX 50 Series GPUs, with GeForce NOW also included in the launch statement.'],
    ['Which driver is mentioned?', 'The launch materials name GeForce Game Ready Driver 616.64 WHQL for the DLSS Neural Rendering option.'],
    ['Does the page guarantee my laptop configuration?', 'No. The source scope is recorded as written; a device-specific conclusion needs a matching source or a local check.'],
    ['Is a browser conversion the same as the game feature?', 'No. The browser workflow is independent and does not install or emulate the NVIDIA game runtime.'],
    ['Where can I see the underlying source?', 'Use the NVIDIA FAQ and launch article linked below, then check the date and wording before relying on a future update.'],
  ],
  benchmark: [
    ['Is this an FPS leaderboard?', 'No. The page does not publish unmeasured game FPS, multipliers or cross-GPU rankings.'],
    ['What local measurement is available?', 'One RTX 4090 reference run processed 36 frames from a 3-second 720p clip in 87.4 seconds; it is batch context.'],
    ['Can I compare a browser image result with DLSS 5 in a game?', 'No. They have different inputs and runtime contracts, so the page keeps them as separate evidence tracks.'],
    ['What should I record for a new run?', 'Record input, output dimensions, model or preset, GPU, driver, software version, queue/retry time and date.'],
    ['Why are some fields blank?', 'A blank or unknown field means no source or run record was available; it is not an invitation to infer a value.'],
    ['Where are the source links?', 'Vendor references and the local workflow boundary are linked below; each future result should add its own evidence record.'],
  ],
} as const;

const FAQ_ZH = {
  'nba-2k27': [
    ['NVIDIA 点名的首款首发游戏是什么？', '9 月 FAQ 将 NBA 2K27 写为 2026 年 9 月 3 日 DLSS 5 首发作品。'],
    ['首发资料点名哪些显卡？', 'FAQ 点名 GeForce RTX 50 系列显卡，同时在首发陈述中包含 GeForce NOW。'],
    ['资料点名哪个驱动？', 'GeForce Game Ready Driver 616.64 WHQL。'],
    ['这能保证我的笔记本配置吗？', '不能。需要匹配来源或本地核验才能下设备级结论。'],
    ['浏览器转换就是游戏功能吗？', '不是。浏览器工作流独立存在，不安装或模拟 NVIDIA 游戏运行时。'],
    ['在哪里查看来源？', '查看下方 NVIDIA FAQ 与首发文章链接，并在后续更新时重新核对日期和原文。'],
  ],
  benchmark: [
    ['这是 FPS 排行榜吗？', '不是。本页不发布未经测量的游戏 FPS、倍数或跨显卡排名。'],
    ['现有本地测量是什么？', '一台 RTX 4090 参考机把 3 秒 720p 视频的 36 帧处理了 87.4 秒；这是批处理背景。'],
    ['能把浏览器图片结果和游戏 DLSS 5 比较吗？', '不能。两者输入和运行契约不同，本页保留两条证据路径。'],
    ['新运行应记录什么？', '记录输入、输出尺寸、模型或预设、显卡、驱动、软件版本、队列/重试时间和日期。'],
    ['为什么有些字段为空？', '表示没有来源或运行记录，不代表可以自行推断。'],
    ['来源链接在哪里？', '下方列出厂商参考和本地工作流边界；未来结果应追加自己的证据记录。'],
  ],
} as const;

const pages: Record<W2Kind, W2Copy> = {
  'nba-2k27': {
    title: 'NBA 2K27 DLSS 5 Support: Launch Facts and Setup | DLSS5NVIDIA',
    description: 'A source-linked NBA 2K27 DLSS 5 page: launch date, RTX 50 and GeForce NOW scope, driver reference, and what this site does not measure.',
    heading: 'NBA 2K27 and DLSS 5: the launch facts',
    lead: 'NBA 2K27 is the first title named in NVIDIA’s September FAQ for the DLSS 5 debut. This page records that statement, separates announced plans from the released path, and avoids inventing frame-rate results.',
    keywords: ['nba 2k27 dlss 5', 'nba 2k27 neural rendering', 'dlss 5 nba 2k27 support', 'nba 2k27 616.64'],
    facts: [['Launch date in source', 'NVIDIA’s FAQ states September 3, 2026 for the DLSS 5 debut in NBA 2K27; checked 2026-10-13.'], ['Published hardware scope', 'The FAQ names GeForce RTX 50 Series GPUs and GeForce NOW for this debut statement.'], ['Driver reference', 'The launch materials name GeForce Game Ready Driver 616.64 WHQL for the DLSS Neural Rendering option.'], ['What we do not claim', 'This page contains no unmeasured FPS, multiplier, or cross-GPU result.']],
    sections: [
      { heading: 'What the September FAQ actually establishes', body: 'The NVIDIA FAQ gives this page one narrow, useful conclusion: DLSS 5 featuring 3D-Guided Neural Rendering debuted in NBA 2K27 on September 3, 2026 for the GeForce RTX 50 Series and GeForce NOW. That is a dated launch statement, not a promise that every game mode, patch, display or laptop configuration behaves identically. It also does not turn a search snippet or a community screenshot into a compatibility record. We keep the source sentence beside the date so a reader can recheck it when the vendor updates the page.' },
      { heading: 'How to read the driver note', body: 'The launch material names GeForce Game Ready Driver 616.64 WHQL in connection with the DLSS Neural Rendering option. Treat this as the driver reference in the launch documentation, not as a universal guarantee for every future build. A reproducible check should record the game version, GPU model, driver version, display resolution and graphics settings. If a later NVIDIA release changes the requirement, the dated source should win over an older page copy.' },
      { heading: 'Where our independent tools fit', body: 'DLSS5NVIDIA also provides browser image workflows and a separate local Studio request path. Those tools can help a reader inspect a visual conversion or process an image, but they do not install, emulate or replace the NBA 2K27 game integration described by NVIDIA. A browser before-and-after is therefore an independent visual reference. It is not evidence that a particular game option is enabled, and it is not a performance test for NBA 2K27.' },
    ],
    table: { headers: ['Question', 'Recorded answer', 'Evidence boundary'], rows: [['What launched?', 'DLSS 5 in NBA 2K27', 'NVIDIA September FAQ'], ['When?', 'September 3, 2026', 'Dated source statement'], ['Which path is named?', 'RTX 50 Series and GeForce NOW', 'Launch scope, not every future configuration'], ['Does this page publish FPS?', 'No', 'No NVIDIA or local measurement supplied here']] },
    faq: FAQ_EN['nba-2k27'],
    itemList: [{ name: 'NBA 2K27 — launched statement', url: 'https://www.nvidia.com/en-us/geforce/forums/nvidia-app/129/583738/dlss-5-faq-932026/' }, { name: 'DLSS 5 launch context', url: 'https://www.nvidia.com/en-us/geforce/news/dlss-5-3d-guided-neural-rendering/' }],
  },
  benchmark: {
    title: 'DLSS 5 Benchmark Evidence Center: Measurements and Limits | DLSS5NVIDIA',
    description: 'An evidence center for DLSS 5 claims: NVIDIA-published facts, our measured image pipeline snapshot, reproducible fields, and limits on what we can conclude.',
    heading: 'DLSS 5 benchmark evidence center',
    lead: "A useful benchmark page starts by naming the measurement. This page has not run a frame-rate test in any game; this site has no DLSS 5 game runtime. This center separates vendor-published specifications from our own image-pipeline timing and leaves unsupported frame-rate claims blank.",
    keywords: ['dlss 5 benchmark', 'dlss 5 performance evidence', 'dlss 5 test results', 'dlss 5 measured comparison'],
    facts: [["What we have measured", "One Studio batch snapshot: a 3-second 720p public-domain clip, 36 frames, an RTX 4090 reference machine, 87.4 seconds (2.43 seconds per frame), recorded on 2026-09-25; batch processing time, not real-time performance."], ["What we have not measured", "Frame rates in any game; in-game DLSS 5 versus DLSS 4.5 comparisons; DLSS 5 performance on RTX 40 / 30 / 20 Series; any multiplier conclusions."], ["What cannot be inferred", "NVIDIA’s up to 1.4X statement is scoped to NBA 2K27 + RTX 50 Series + RTX Spark laptops + GeForce NOW; its 10X, −24% and −20% statements also have specific scopes, are not our observations, and cannot predict other games or GPUs."]],
    sections: [
      { heading: 'Why a single number is not a universal benchmark', body: 'DLSS 5 is a game-rendering technology with engine, driver, GPU and game-build dependencies. An image conversion pipeline has a different input, model path and output contract. Putting those numbers in one leaderboard would make the result look more precise than the evidence allows. This page therefore uses an evidence ledger: the source URL and date for a vendor statement, or the complete run fields for a local measurement. A missing field stays unknown rather than being filled from a review, a screenshot or a guessed conversion.' },
      { heading: 'The measured local snapshot', body: 'Our published local observation is deliberately narrow: a three-second, 720p public-domain clip was processed as 36 frames in 87.4 seconds on an RTX 4090 reference machine, or 2.43 seconds per frame. It describes one batch run through the local Studio workflow at the recorded time. It does not say the pipeline is real-time, does not compare another GPU, and does not establish an in-game DLSS 5 frame rate. Repeating it requires the same source clip, output target, software version and hardware record.' },
      { heading: 'What a future comparison must include', body: 'A credible run should preserve the original input and output, state the requested dimensions, name the model or preset, record the GPU and driver, include queue and retry time, and identify whether the result came from a game frame, a browser image workflow or local Studio. Review quality and speed separately. If there is no direct measurement, link the published source and mark the field unavailable. This keeps the center useful for AI readers without pretending that an illustrative image proves a performance claim.' },
      {"heading": "Why there are no in-game frame rates here", "body": "We do not have the game runtime and controlled comparison scenes, so we do not publish unmeasured frame rates. Browser image results, the local Studio batch snapshot and in-game DLSS 5 are separate evidence tracks; none validates the others. Every number must be labelled as NVIDIA-published or measured by our own pipeline. For comparison, preserve source media, dimensions, model/preset, hardware, driver, software version, date, queue/retry time and output; keep unmeasured FPS and multipliers blank. The four quotations in the following table come from NVIDIA’s October update article: https://www.nvidia.com/en-us/geforce/news/dlss-5-faster-ai-model-hogwarts-legacy-rtx-spark-laptops/ Checked 2026-10-26. These are NVIDIA’s statements, not observations made by this site."},
    ],
    table: {"headers": ["Official wording (verbatim)", "What it says", "Source and check date"], "rows": [["DLSS 5’s 3D-Guided Neural Rendering model is now 10X faster overall compared to when it was announced in March", "NVIDIA says the model overall is faster than its March version; this does not mean games run ten times faster.", "NVIDIA · 2026-10-13 · checked 2026-10-26"], ["The DLSS 5 October update shrinks the footprint by 24% to roughly 118 million parameters while reducing 4K VRAM usage by 20%", "NVIDIA reports a 24% smaller footprint, roughly 118 million parameters and 20% lower 4K VRAM usage.", "NVIDIA · 2026-10-13 · checked 2026-10-26"], ["The result is half the GPU overhead of the September version while maintaining comparable visual fidelity", "NVIDIA reports half the GPU overhead relative to September, with comparable visual fidelity.", "NVIDIA · 2026-10-13 · checked 2026-10-26"], ["boosting frame rates by up to 1.4X", "NVIDIA’s up to 1.4X frame-rate statement applies to NBA 2K27 + RTX 50 Series + RTX Spark laptops + GeForce NOW, not other games or GPUs.", "NVIDIA · 2026-10-13 · checked 2026-10-26"]]}, faq: FAQ_EN.benchmark,
  },
};

const zhPages: Record<W2Kind, W2Copy> = {
  'nba-2k27': { title: 'NBA 2K27 DLSS 5 支持：首发事实与设置 | DLSS5NVIDIA', description: '以来源为基础记录 NBA 2K27 的 DLSS 5 首发日期、RTX 50 与 GeForce NOW 范围、驱动资料和本站不测量的内容。', heading: 'NBA 2K27 与 DLSS 5：首发事实', lead: 'NVIDIA 9 月 FAQ 把 NBA 2K27 写为 DLSS 5 首发作品。本页记录这条事实，区分已宣布与已发布，并且不编写帧率结果。', keywords: ['nba 2k27 dlss 5', 'nba 2k27 神经渲染', 'dlss 5 nba 2k27 支持', 'nba 2k27 616.64'], facts: [['来源中的首发日期', 'NVIDIA FAQ 写明 DLSS 5 于 2026 年 9 月 3 日首发；2026-10-13 复核。'], ['资料中的硬件范围', 'FAQ 点名 GeForce RTX 50 系列显卡与 GeForce NOW。'], ['驱动资料', '首发材料点名 GeForce Game Ready Driver 616.64 WHQL。'], ['本站不做的结论', '本页不写未经测量的 FPS、倍数或跨显卡结果。']], sections: [{ heading: '9 月 FAQ 实际确认了什么', body: 'NVIDIA FAQ 给出的结论范围很窄但很有用：带 3D 引导神经渲染的 DLSS 5 于 2026 年 9 月 3 日在 NBA 2K27 首发，资料范围包含 GeForce RTX 50 系列和 GeForce NOW。这是带日期的首发陈述，并不保证所有模式、补丁、显示器或笔记本配置完全相同，也不会把社区截图自动变成兼容性记录。我们把来源和日期放在一起，方便未来重新核对。' }, { heading: '如何理解驱动资料', body: '首发材料在 DLSS Neural Rendering 选项旁点名 GeForce Game Ready Driver 616.64 WHQL。应把它作为首发文档中的驱动参考，而不是所有未来版本的永久保证。可复核测试应记录游戏版本、显卡型号、驱动版本、分辨率和图形设置；如果 NVIDIA 后续更新要求，应以带日期的新来源为准。' }, { heading: '本站独立工具的边界', body: '本站还有浏览器图像工作流和单独的本地 Studio 索取路径，可帮助用户查看视觉转换或处理图片，但它们不会安装、模拟或替代 NVIDIA 所述的 NBA 2K27 游戏集成。浏览器前后对比是独立视觉参考，不是游戏选项已开启的证据，也不是 NBA 2K27 的性能测试。' }], table: { headers: ['问题', '记录结论', '证据边界'], rows: [['什么首发？', 'NBA 2K27 中的 DLSS 5', 'NVIDIA 9 月 FAQ'], ['什么时候？', '2026 年 9 月 3 日', '带日期的来源陈述'], ['资料点名哪条路径？', 'RTX 50 系列与 GeForce NOW', '首发范围，不代表未来全部配置'], ['本页发布 FPS 吗？', '不发布', '没有 NVIDIA 或本地测量支持']] }, faq: FAQ_ZH['nba-2k27'], itemList: [{ name: 'NBA 2K27 — 已上线资料', url: 'https://www.nvidia.com/en-us/geforce/forums/nvidia-app/129/583738/dlss-5-faq-932026/' }, { name: 'DLSS 5 首发背景', url: 'https://www.nvidia.com/en-us/geforce/news/dlss-5-3d-guided-neural-rendering/' }] },
  benchmark: { title: 'DLSS 5 基准证据中心：测量与边界 | DLSS5NVIDIA', description: '集中记录 DLSS 5 相关证据：NVIDIA 发布的事实、本站图像管线实测快照、可复现字段，以及不能下结论的范围。', heading: 'DLSS 5 基准证据中心', lead: "可靠的基准页先说明测了什么。本页没有在任何游戏里跑过帧率测试；本站没有 DLSS 5 游戏运行时环境。", keywords: ['dlss 5 基准', 'dlss 5 性能证据', 'dlss 5 测试结果', 'dlss 5 测量对比'], facts: [["我们测过", "本站 Studio 管线的一次批处理快照：3 秒 720p 公共领域视频、36 帧、RTX 4090 参考机、87.4 秒（2.43 秒/帧），记录于 2026-09-25；这是批处理耗时，不是实时性能。"], ["我们没测", "任何游戏的帧率；DLSS 5 与 DLSS 4.5 的游戏内对比；RTX 40 / 30 / 20 系上的 DLSS 5 表现；任何倍数类结论。"], ["我们不能推断", "NVIDIA 的最高 1.4X 说法限定于 NBA 2K27 + RTX 50 系 + RTX Spark 笔记本 + GeForce NOW；10X、−24%、−20% 也有各自范围，均不是本站观测，不能用来预测别的游戏或显卡。"]], sections: [{ heading: '为什么一个数字不是通用基准', body: 'DLSS 5 是受游戏、引擎、驱动和显卡影响的游戏渲染技术；图像转换管线的输入、模型路径和输出契约不同。把两类数字放进一个排行榜会让证据显得过度精确。因此本页使用证据台账：厂商陈述记录来源链接和日期，本地测量记录完整运行字段。缺字段就写未知，不从评测、截图或猜测中补值。' }, { heading: '已记录的本地测量快照', body: '本站公开的本地观察范围很窄：一段 3 秒 720p 公共领域视频，在 RTX 4090 参考机上处理 36 帧，用时 87.4 秒，即每帧 2.43 秒。这是记录时刻的一次本地 Studio 批处理结果，不表示实时运行，不比较其他显卡，也不建立游戏内 DLSS 5 帧率。要复现，应使用相同输入、输出目标、软件版本和硬件记录。' }, { heading: '以后比较必须记录什么', body: '可靠运行应保存原始输入和输出，写明目标尺寸、模型或预设、显卡和驱动，记录队列与重试时间，并说明结果来自游戏画面、浏览器图像工作流还是本地 Studio。画质与速度分开评估；没有直接测量就链接来源并标记不可用。这样 AI 读者可以引用页面，但不会把示意图误读成性能结论。' }, {"heading": "为什么这页没有游戏帧率", "body": "我们没有那套游戏运行时与对照场景，所以不发布未测帧率。浏览器图像结果、本地 Studio 批处理快照、游戏内 DLSS 5 是三条独立证据路径，谁也不能替谁背书。每个数字都应标注为 NVIDIA 发布或本站管线测量；比较时保留输入素材、尺寸、模型/预设、硬件、驱动、软件版本、日期、队列与重试时间及输出，未测 FPS 和倍数留空。下表四句来自 NVIDIA 十月更新文章：https://www.nvidia.com/en-us/geforce/news/dlss-5-faster-ai-model-hogwarts-legacy-rtx-spark-laptops/ 核对日 2026-10-26。以下为 NVIDIA 的说法，不是本站观测。"}], table: {"headers": ["官方原句（英文原文）", "它说的是什么", "来源与核对日"], "rows": [["DLSS 5’s 3D-Guided Neural Rendering model is now 10X faster overall compared to when it was announced in March", "NVIDIA 称该模型整体比三月版本快 10 倍，不是游戏快 10 倍。", "NVIDIA · 2026-10-13 · 核对 2026-10-26"], ["The DLSS 5 October update shrinks the footprint by 24% to roughly 118 million parameters while reducing 4K VRAM usage by 20%", "NVIDIA 称体积减 24% 至约 1.18 亿参数，4K 显存占用减 20%。", "NVIDIA · 2026-10-13 · 核对 2026-10-26"], ["The result is half the GPU overhead of the September version while maintaining comparable visual fidelity", "NVIDIA 称相对九月版 GPU 开销减半，画质相当。", "NVIDIA · 2026-10-13 · 核对 2026-10-26"], ["boosting frame rates by up to 1.4X", "NVIDIA 所称帧率最高 1.4 倍，范围是 NBA 2K27 + RTX 50 系 + RTX Spark 笔记本 + GeForce NOW，不能推及其他游戏或显卡。", "NVIDIA · 2026-10-13 · 核对 2026-10-26"]]}, faq: FAQ_ZH.benchmark },
};

export function w2Page(kind: W2Kind, locale: ExpansionLocale): Omit<ExpansionPage, 'kind'|'locale'|'path'|'links'|'sourceLinks'> {
  return (locale === 'zh' ? zhPages : pages)[kind];
}
