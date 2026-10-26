import { SITE_URL } from '../config/site';
export const GPU_UNLOCK = {
  path: '/guides/gpu-unlock-rtx-30-4090',
  title: 'GPU unlock RTX 30 / 4090：FP/BF16 社区报告与边界',
  description: '它不是 DLSS 5 解锁。整理 RTX 30 与 4090 的 FP/BF16 GEMM 社区报告、平台条件与风险；本站未复现该解锁流程。',
  checked: '2026-10-26',
  sources: {
    linux: 'https://github.com/Zagitta/gpu-unlock',
    fork: 'https://github.com/elias-gaeros/gpu-unlock/tree/rtx4090',
    windows: 'https://github.com/impacifist/Windows-GPU-UNLOCK',
  },
  attribution: '仓库报告的社区实测，不是本站实测',
  risk: '非官方、这几天刚出现、涉及显卡底层操作、需关 Secure Boot 与改启动参数、存在兼容性与稳定性风险、不建议在主力机上直接试、折腾前留好回滚入口。',
} as const;
export const GPU_UNLOCK_REPORTS = [
  {card:'RTX 3090 Ti',chip:'GA102',result:'已解锁',gain:'+68–80%',reports:'#1'},
  {card:'RTX 3090',chip:'GA102',result:'已解锁',gain:'+25–67%',reports:'#5、#9、#10、#17、#25、#27、#33'},
  {card:'RTX 3080 Ti 20 GB（OEM）',chip:'GA102',result:'解锁完成，BF16 仍为半速',gain:'—',reports:'#28'},
  {card:'RTX 3080 10 GB',chip:'GA102',result:'已解锁',gain:'+70–73%',reports:'#14'},
  {card:'RTX 3080 20 GB（改显存）',chip:'GA102',result:'已解锁',gain:'+56–59%',reports:'#10、#15'},
  {card:'RTX 3070',chip:'GA104',result:'已解锁',gain:'+73–81%',reports:'#10、#12'},
  {card:'RTX 3070 Ti',chip:'GA104',result:'该模块未测（同款解锁在 Windows UEFI 方案上成功）',gain:'—',reports:'#32'},
  {card:'RTX 3060 12 GB',chip:'GA106',result:'已解锁',gain:'约 +80%',reports:'#13、#31'},
  {card:'GA103 任意型号',chip:'GA103',result:'尚无报告',gain:'—',reports:'尚无报告'},
];
export const GPU_UNLOCK_4090 = [
  {mode:'FP16 → FP32 累加',before:'165.6 TF/s',after:'331.6 TF/s'},
  {mode:'BF16 → FP32 累加',before:'165.5 TF/s',after:'330.6 TF/s'},
];
export const GPU_UNLOCK_FAQ = [
  {q:'Does this unlock DLSS 5?',a:'No。它不改变 RTX 30 能否在游戏里启用 DLSS 5；报告涉及 FP/BF16 GEMM 计算吞吐，不是游戏帧率结论。'},
  {q:'Will it work on my 3080 Ti?',a:'不能仅凭型号名判断。主仓库报告 #28 的 RTX 3080 Ti 20 GB OEM 解锁完成，但 BF16 仍为半速；不能把这条报告推广到其他配置。'},
  {q:'Does it work on Windows?',a:'有社区 UEFI 方案，但要求精确机器配置匹配，型号名不等于兼容。Windows 仓库 v0.3.1 是源码预发布，不打包固件与私有 EFI。'},
  {q:'Does it survive driver updates?',a:'Linux 模块在 NVIDIA 驱动绑定卡之前执行，不需要每次驱动更新重新打补丁。Windows UEFI 路径应按对应仓库文档判断，不能直接套用 Linux 的结论。'},
  {q:'Is it official?',a:'不是。这是社区方案，本站仅整理资料，不代表 NVIDIA 官方，也不承诺结果。'},
  {q:'Is it reversible?',a:'本站不承诺可回滚。请按对应仓库说明判断，并在尝试之前留好回滚入口；本页不提供固件、payload 或 EFI。'},
];
export function gpuUnlockSchema(locale: 'en' | 'zh' = 'en') {
  const { page: GPU_UNLOCK, faq: GPU_UNLOCK_FAQ } = gpuUnlockCopy(locale);
  return {'@context':'https://schema.org','@graph':[
    {'@type':'WebPage',name:GPU_UNLOCK.title,description:GPU_UNLOCK.description,url:SITE_URL+GPU_UNLOCK.path,inLanguage:locale === 'zh' ? 'zh-CN' : 'en-US',dateModified:GPU_UNLOCK.checked,citation:Object.values(GPU_UNLOCK.sources)},
    {'@type':'FAQPage',mainEntity:GPU_UNLOCK_FAQ.map(f=>({'@type':'Question',name:f.q,acceptedAnswer:{'@type':'Answer',text:f.a}}))},
  ]};
}

const EN_TEXT: Record<string, string> = {
  "它不是 DLSS 5 解锁。": "This does not unlock DLSS 5.",
  "这里讨论的是 FP/BF16 指令发射速率及矩阵运算（GEMM）吞吐，面向本地 AI 推理／训练这类负载；对 RTX 30 能不能在游戏里开 DLSS 5 没有任何改变，不是游戏帧率提升结论。": "This concerns FP/BF16 instruction issue rates and matrix-operation (GEMM) throughput for workloads such as local AI inference/training. It does not change whether RTX 30 can enable DLSS 5 in games and is not a claim of improved game frame rates.",
  "本页未在本站机器上复现该解锁流程。本站的游戏人物风格转换与 Studio 图像管线是另一件事，不能作为这个解锁流程的实测证据。": "We have not reproduced this unlock procedure on our machines. Our game-character style conversion and Studio image pipeline are separate and are not measurement evidence for this unlock procedure.",
  "资料核对：": "Checked: ",
  "。本页是资料整理，不是教程交付。": ". This page collects reference material; it does not deliver an implementation tutorial.",
  "：Linux RTX 30 系内核模块。": ": Linux RTX 30 Series kernel module.",
  "elias-gaeros/gpu-unlock 的 rtx4090 分支": "elias-gaeros/gpu-unlock, rtx4090 branch",
  "：Linux RTX 4090 分支。": ": Linux RTX 4090 branch.",
  "：Windows / UEFI 精确机器配置方案。": ": Windows / UEFI paths for exact machine configurations.",
  "改的是什么": "What changes",
  "按 ": "According to the ",
  "Linux 主仓库 README": "main Linux repository README",
  "，模块在 NVIDIA 驱动绑定卡之前写入速度选择器：SS0 ": ", the module writes speed selectors before the NVIDIA driver binds to the card: SS0 ",
  "、4 位 SS1 ": " and 4-bit SS1 ",
  "，并做 FLR。README 将其描述为 FP/BF16 FMA 发射到 FP32 的速率翻倍；这不是本站测量。模块方式不需要每次驱动更新重新打补丁。": ", then performs FLR. The README describes this as doubling the issue rate of FP/BF16 FMA into FP32; this is not our measurement. The module approach does not require patching again after every driver update.",
  "驱动绑定前写入速度选择器 → FLR → 未修改的 NVIDIA 驱动接管": "Write speed selectors before driver binding → FLR → Unmodified NVIDIA driver takes over",
  "驱动绑定前写入速度选择器": "Write selectors before driver binding",
  "未修改的 NVIDIA 驱动接管": "Unmodified NVIDIA driver takes over",
  "本站绘制的三步时序示意，依据主仓库 README；不是本站执行记录。": "Our three-step diagram follows the main repository README; it is not a record of a procedure we performed.",
  "RTX 30 系：哪些卡有社区报告": "RTX 30 Series: cards with community reports",
  "以下为 ": "The following dense GEMM community table is from ",
  " 的 dense GEMM 社区报告表。": ". ",
  "；未报告的项目不补数字。": "; no numbers are filled in for unreported results.",
  "：Zagitta README 引用报告 #1 的 RTX 3090 Ti 单卡基线，五样本中位数、FP32 累加：FP16 87.46 → 118.39 TFLOPS；BF16 87.50 → 157.41 TFLOPS；TF32 42.58 → 82.61 TFLOPS。": ": the Zagitta README cites report #1 for an RTX 3090 Ti single-card baseline, median of five samples, with FP32 accumulation: FP16 87.46 → 118.39 TFLOPS; BF16 87.50 → 157.41 TFLOPS; TF32 42.58 → 82.61 TFLOPS. ",
  "来源：主仓库 README，报告 #1": "Source: main repository README, report #1",
  "RTX 4090：fork README 对照": "RTX 4090: fork README comparison",
  "。来源为 ": ". Source: ",
  "rtx4090 分支 README": "rtx4090 branch README",
  "；该对照未列 issue 报告编号，不另行编排编号。": "; this comparison lists no issue report number, so none is invented here.",
  "rtx4090 分支 README；未列报告编号": "rtx4090 branch README; no report number listed",
  "该分支报告称 INT8、": "The branch reports that INT8, ",
  "、标量 FP32 基本维持基线。限制是单卡、单次冷启动成功；独立冷启动复现与应用层数值验证仍待完成。以上不是本站实测，也不构成应用负载收益承诺。": " and scalar FP32 remain approximately at baseline. The limitation is one card and one successful cold boot; independent cold-boot reproduction and application-level numerical validation are still pending. These are not our measurements or a promise of application-workload gains.",
  "三条路径与前置条件": "Three paths and prerequisites",
  "仓库路径涉及关闭 Secure Boot 与修改启动参数。这里只记录条件，不提供执行命令；应分别核对相应仓库文档，不能用一条路径的条件替代另一条。": "The repository paths involve disabling Secure Boot and changing boot parameters. This page records conditions, not execution commands. Check each repository's documentation separately; one path's conditions do not replace another's.",
  "Linux 30 系主仓库": "Main Linux 30 Series repository",
  "：只覆盖 GA102/103/104/106；架构被覆盖不等于每个型号都有成功报告，GA103 尚无报告。": ": covers only GA102/103/104/106. Architecture coverage does not mean every model has a successful report; GA103 has no reports yet.",
  "4090 分支": "4090 branch",
  "：集成已发布的 AD102 payload，仅针对 RTX 4090（": ": integrates the published AD102 payload for RTX 4090 only (",
  "，AD102）；不接受其他型号、专业卡或数据中心卡。": ", AD102); other models, professional cards and data-center cards are not accepted.",
  "：仓库列三个精确机器配置，含无头与 USB 路径；型号名不等于兼容。v0.3.1 是源码预发布，不打包固件与私有 EFI。不要把 Linux 报告直接当成 Windows 配置验证。": ": the repository lists three exact machine configurations, including headless and USB paths; a model name does not establish compatibility. v0.3.1 is a source prerelease without packaged firmware or private EFI. Do not treat Linux reports as verification of a Windows configuration.",
  "风险与回滚": "Risks and rollback",
  "我们的立场": "Our position",
  "我们不提供固件、payload 或 EFI，不托管、不镜像、不代打包，也不承诺结果。本页未在本站机器上复现该解锁流程。": "We do not provide, host, mirror or package firmware, payloads or EFI, and we do not promise results. We have not reproduced this unlock procedure on our machines.",
  "核对 DLSS 5 官方硬件范围": "Check the official DLSS 5 hardware scope",
  "查看本站独立图像风格转换的真实示例": "See real examples of our independent image style conversion",
  "。两条路径都不把本页的计算吞吐报告变成 DLSS 5 游戏兼容结论。": ". Neither path turns this page's compute-throughput reports into DLSS 5 game-compatibility conclusions.",
  "卡": "Card",
  "芯片": "Chip",
  "结果": "Result",
  "BF16 GEMM 提升": "BF16 GEMM gain",
  "报告编号与归属": "Report number and attribution",
  "模式": "Mode",
  "之前": "Before",
  "之后": "After",
  "报告来源与归属": "Report source and attribution",
  "GPU unlock RTX 30 / 4090：FP/BF16 社区报告与边界": "GPU unlock RTX 30 / 4090: FP/BF16 community reports and limits",
  "它不是 DLSS 5 解锁。整理 RTX 30 与 4090 的 FP/BF16 GEMM 社区报告、平台条件与风险；本站未复现该解锁流程。": "This does not unlock DLSS 5. A reference on RTX 30 and 4090 FP/BF16 GEMM community reports, platform conditions and risks; we have not reproduced this unlock procedure.",
  "仓库报告的社区实测，不是本站实测": "Community measurements reported by the repository, not measurements by this site",
  "非官方、这几天刚出现、涉及显卡底层操作、需关 Secure Boot 与改启动参数、存在兼容性与稳定性风险、不建议在主力机上直接试、折腾前留好回滚入口。": "Unofficial, newly appeared in the last few days, and involves low-level GPU operations; requires disabling Secure Boot and changing boot parameters; carries compatibility and stability risks. We do not recommend trying it directly on your primary machine. Keep a rollback path available before experimenting.",
  "已解锁": "Unlocked",
  "RTX 3080 Ti 20 GB（OEM）": "RTX 3080 Ti 20 GB (OEM)",
  "解锁完成，BF16 仍为半速": "Unlock completed, but BF16 remains at half speed",
  "RTX 3080 20 GB（改显存）": "RTX 3080 20 GB (modified VRAM)",
  "该模块未测（同款解锁在 Windows UEFI 方案上成功）": "Not tested with this module (the same unlock succeeded with the Windows UEFI path)",
  "约 +80%": "Approximately +80%",
  "GA103 任意型号": "Any GA103 model",
  "尚无报告": "No reports yet",
  "FP16 → FP32 累加": "FP16 → FP32 accumulation",
  "BF16 → FP32 累加": "BF16 → FP32 accumulation",
  "No。它不改变 RTX 30 能否在游戏里启用 DLSS 5；报告涉及 FP/BF16 GEMM 计算吞吐，不是游戏帧率结论。": "No. It does not change whether RTX 30 can enable DLSS 5 in games; the reports concern FP/BF16 GEMM compute throughput, not game frame rates.",
  "不能仅凭型号名判断。主仓库报告 #28 的 RTX 3080 Ti 20 GB OEM 解锁完成，但 BF16 仍为半速；不能把这条报告推广到其他配置。": "A model name alone is not enough. Main repository report #28 says the RTX 3080 Ti 20 GB OEM unlock completed but BF16 remained at half speed; this cannot be generalized to other configurations.",
  "有社区 UEFI 方案，但要求精确机器配置匹配，型号名不等于兼容。Windows 仓库 v0.3.1 是源码预发布，不打包固件与私有 EFI。": "A community UEFI path exists, but it requires an exact machine-configuration match; a model name does not establish compatibility. The Windows repository's v0.3.1 is a source prerelease without packaged firmware or private EFI.",
  "Linux 模块在 NVIDIA 驱动绑定卡之前执行，不需要每次驱动更新重新打补丁。Windows UEFI 路径应按对应仓库文档判断，不能直接套用 Linux 的结论。": "The Linux module executes before the NVIDIA driver binds to the card and does not require patching again after every driver update. Consult the corresponding repository documentation for the Windows UEFI path; the Linux conclusion cannot simply be applied to it.",
  "不是。这是社区方案，本站仅整理资料，不代表 NVIDIA 官方，也不承诺结果。": "No. This is a community approach. This site only collects reference material, does not represent NVIDIA and does not promise results.",
  "本站不承诺可回滚。请按对应仓库说明判断，并在尝试之前留好回滚入口；本页不提供固件、payload 或 EFI。": "We do not promise reversibility. Assess it using the corresponding repository documentation and retain a rollback path before trying it; this page provides no firmware, payload or EFI."
};
export function gpuUnlockText(locale: 'en' | 'zh', text: string): string {
  if (locale === 'zh') return text.replaceAll('&amp;', '&');
  if (EN_TEXT[text] !== undefined) return EN_TEXT[text];
  if (/[\u4e00-\u9fff]/.test(text)) throw new Error('Missing gpuUnlock translation: ' + text);
  return text;
}
function translateValue<T>(value: T, locale: 'en' | 'zh'): T {
  if (typeof value === 'string') return gpuUnlockText(locale, value) as T;
  if (Array.isArray(value)) return value.map(v => translateValue(v, locale)) as T;
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([k,v]) => [k, translateValue(v, locale)])) as T;
  return value;
}
export function gpuUnlockCopy(locale: 'en' | 'zh' = 'en') {
  return { page: {...translateValue(GPU_UNLOCK, locale), path: (locale === 'zh' ? '/zh' : '') + GPU_UNLOCK.path}, rows: translateValue(GPU_UNLOCK_REPORTS, locale), faq: translateValue(GPU_UNLOCK_FAQ, locale), rows4090: translateValue(GPU_UNLOCK_4090, locale) };
}
export const GPU_UNLOCK_ALTERNATES = [{hrefLang:'en',href:SITE_URL+GPU_UNLOCK.path},{hrefLang:'zh-CN',href:SITE_URL+'/zh'+GPU_UNLOCK.path},{hrefLang:'x-default',href:SITE_URL+GPU_UNLOCK.path}];
