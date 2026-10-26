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
export function gpuUnlockSchema() {
  return {'@context':'https://schema.org','@graph':[
    {'@type':'WebPage',name:GPU_UNLOCK.title,description:GPU_UNLOCK.description,url:SITE_URL+GPU_UNLOCK.path,inLanguage:'zh-CN',dateModified:GPU_UNLOCK.checked,citation:Object.values(GPU_UNLOCK.sources)},
    {'@type':'FAQPage',mainEntity:GPU_UNLOCK_FAQ.map(f=>({'@type':'Question',name:f.q,acceptedAnswer:{'@type':'Answer',text:f.a}}))},
  ]};
}
