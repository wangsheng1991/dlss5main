/** Additive related-reading links for the eight protected routes in the October 2026 experiment. */
export const RELATED_ADDITIONS: Record<string, Array<{ path: string; en: string; zh: string }>> = {
  '/zh': [
    { path: '/zh/before-after', en: 'Before-and-after reference cases', zh: '前后对比参考案例' },
    { path: '/zh/benchmark', en: 'Benchmark evidence center', zh: '基准证据中心' },
    { path: '/zh/guides', en: 'DLSS 5 guides', zh: 'DLSS 5 使用指南' },
    { path: '/zh/download', en: 'Download and request access', zh: '下载与内测申请' },
  ],
  '/download': [
    { path: '/visual-enhancer', en: 'Try the free browser visual enhancer example — no login', zh: '免登录试用浏览器视觉增强示例' },
    { path: '/dlss-5-apk', en: 'Android and APK availability', zh: '安卓与 APK 可用情况' },
    { path: '/system-requirements', en: 'System requirements', zh: '系统要求' },
    { path: '/status', en: 'DLSS 5 release status', zh: 'DLSS 5 发布状态' },
    { path: '/studio-beta', en: 'Request the limited Studio beta', zh: '申请 Studio 有限名额内测' },
  ],
  '/zh/download': [
    { path: '/zh/visual-enhancer', en: 'Try the free browser visual enhancer example — no login', zh: '免登录试用浏览器视觉增强示例' },
    { path: '/zh/studio-beta', en: 'Request the limited Studio beta', zh: '申请 Studio 有限名额内测' },
  ],
  '/image-quality-enhancer': [
    { path: '/visual-enhancer', en: 'Run the free visual enhancer example before uploading', zh: '上传前先免费运行视觉增强示例' },
    { path: '/video-upscaler', en: 'Video upscaler workflow', zh: '视频放大工作流' },
    { path: '/before-after', en: 'Before-and-after reference cases', zh: '前后对比参考案例' },
    { path: '/guides', en: 'DLSS 5 guides', zh: 'DLSS 5 使用指南' },
  ],
  '/image-upscaler': [
    { path: '/visual-enhancer', en: 'Run the free visual enhancer example before uploading', zh: '上传前先免费运行视觉增强示例' },
    { path: '/video-upscaler', en: 'Video upscaler workflow', zh: '视频放大工作流' },
    { path: '/before-after', en: 'Before-and-after reference cases', zh: '前后对比参考案例' },
    { path: '/guides', en: 'DLSS 5 guides', zh: 'DLSS 5 使用指南' },
  ],
  '/video-upscaler': [
    { path: '/before-after', en: 'Video and image reference cases', zh: '视频与图片对比案例' },
    { path: '/games', en: 'Launched and announced games', zh: '已上线与已宣布游戏' },
  ],
  '/unblur-image': [
    { path: '/visual-enhancer', en: 'Run the free visual enhancer example before uploading', zh: '上传前先免费运行视觉增强示例' },
    { path: '/video-upscaler', en: 'Video upscaler workflow', zh: '视频放大工作流' },
    { path: '/image-upscaler', en: 'AI Image Upscaler', zh: 'AI 图片放大器' },
  ],
  '/visual-enhancer': [
    { path: '/image-quality-enhancer', en: 'Image quality enhancer', zh: '图像质量增强器' },
    { path: '/image-upscaler', en: 'AI image upscaler', zh: 'AI 图片放大器' },
    { path: '/unblur-image', en: 'Unblur image workflow', zh: '图片去模糊工作流' },
    { path: '/download', en: 'DLSS5 Studio desktop path', zh: 'DLSS5 Studio 桌面版路径' },
  ],
  '/zh/visual-enhancer': [
    { path: '/image-quality-enhancer', en: 'Image quality enhancer', zh: '图像质量增强器' },
    { path: '/image-upscaler', en: 'AI image upscaler', zh: 'AI 图片放大器' },
    { path: '/unblur-image', en: 'Unblur image workflow', zh: '图片去模糊工作流' },
    { path: '/zh/download', en: 'DLSS5 Studio desktop path', zh: 'DLSS5 Studio 桌面版路径' },
  ],
  '/models': [
    { path: '/system-requirements', en: 'Hardware requirements', zh: '硬件要求' },
    { path: '/status', en: 'Current support status', zh: '当前支持状态' },
  ],
  '/about': [
    { path: '/status', en: 'NVIDIA announcement timeline', zh: 'NVIDIA 公告时间线' },
    { path: '/games', en: 'Game support tracker', zh: '游戏支持追踪' },
    { path: '/guides', en: 'Source-led guides', zh: '附来源的指南' },
  ],
  '/blog/dlss-5-online-image-upscaler-guide': [
    { path: '/visual-enhancer', en: 'Run the free visual enhancer example — no login', zh: '免登录运行免费视觉增强示例' },
    { path: '/before-after', en: 'Inspect before-and-after examples', zh: '查看前后对比案例' },
    { path: '/guides', en: 'Read more practical guides', zh: '阅读更多实用指南' },
  ],
  '/zh/blog/dlss-5-online-image-upscaler-guide': [
    { path: '/zh/visual-enhancer', en: 'Run the free visual enhancer example — no login', zh: '免登录运行免费视觉增强示例' },
    { path: '/zh/before-after', en: 'Inspect before-and-after examples', zh: '查看前后对比案例' },
    { path: '/zh/guides', en: 'Read more practical guides', zh: '阅读更多实用指南' },
  ],
  '/guides': [
    { path: '/dlss-5-dll', en: 'DLSS runtime DLL facts and email requests', zh: 'DLSS 运行时 DLL 事实与邮件申请' },
    { path: "/dlss-checker", en: "DLSS GPU compatibility checker", zh: "DLSS 显卡兼容性检测" },
    { path: "/benchmark", en: "DLSS benchmark measurements and limits", zh: "DLSS 基准实测与边界" },
    { path: "/dlss-4-5", en: "DLSS 4.5 parts and release status", zh: "DLSS 4.5 功能组成与发布状态" },
    { path: "/guides/gpu-unlock-rtx-30-4090", en: "RTX 30 and 4090 FP/BF16 unlock reports — not a DLSS 5 unlock", zh: "RTX 30 与 4090 FP/BF16 解锁报告——不是 DLSS 5 解锁" },
  ],
  '/system-requirements': [
    { path: '/dlss-5-dll', en: 'DLSS runtime DLL facts and email requests', zh: 'DLSS 运行时 DLL 事实与邮件申请' },
    { path: "/dlss-checker", en: "DLSS GPU compatibility checker", zh: "DLSS 显卡兼容性检测" },
    { path: "/benchmark", en: "DLSS benchmark measurements and limits", zh: "DLSS 基准实测与边界" },
    { path: "/dlss-4-5", en: "DLSS 4.5 parts and release status", zh: "DLSS 4.5 功能组成与发布状态" },
    { path: "/guides/gpu-unlock-rtx-30-4090", en: "RTX 30 and 4090 FP/BF16 unlock reports — not a DLSS 5 unlock", zh: "RTX 30 与 4090 FP/BF16 解锁报告——不是 DLSS 5 解锁" },
  ],
  '/benchmark': [
    { path: "/dlss-4-5", en: "DLSS 4.5 parts and release status", zh: "DLSS 4.5 功能组成与发布状态" },
    { path: "/guides/gpu-unlock-rtx-30-4090", en: "RTX 30 and 4090 FP/BF16 unlock reports — not a DLSS 5 unlock", zh: "RTX 30 与 4090 FP/BF16 解锁报告——不是 DLSS 5 解锁" },
  ],
  '/status': [
    { path: '/dlss-5-dll', en: 'DLSS runtime DLL facts and email requests', zh: 'DLSS 运行时 DLL 事实与邮件申请' },
    { path: "/dlss-checker", en: "DLSS GPU compatibility checker", zh: "DLSS 显卡兼容性检测" },
    { path: "/benchmark", en: "DLSS benchmark measurements and limits", zh: "DLSS 基准实测与边界" },
  ],
  '/studio-beta': [
    { path: 'https://github.com/wangsheng1991/dlss-5-studio', en: 'Product-documentation and compatibility-record repository', zh: '产品文档与兼容性记录仓库' },
    { path: "/games", en: "DLSS 5 games launch tracker", zh: "DLSS 5 游戏上线追踪" },
  ],
  '/zh/guides': [
    { path: '/zh/dlss-5-dll', en: 'DLSS runtime DLL facts and email requests', zh: 'DLSS 运行时 DLL 事实与邮件申请' },
    { path: "/zh/benchmark", en: "DLSS benchmark measurements and limits", zh: "DLSS 基准实测与边界" },
    { path: "/zh/dlss-4-5", en: "DLSS 4.5 parts and release status", zh: "DLSS 4.5 功能组成与发布状态" },
    { path: "/zh/guides/gpu-unlock-rtx-30-4090", en: "RTX 30 and 4090 FP/BF16 unlock reports — not a DLSS 5 unlock", zh: "RTX 30 与 4090 FP/BF16 解锁报告——不是 DLSS 5 解锁" },
  ],
  '/zh/system-requirements': [
    { path: '/zh/dlss-5-dll', en: 'DLSS runtime DLL facts and email requests', zh: 'DLSS 运行时 DLL 事实与邮件申请' },
    { path: "/zh/benchmark", en: "DLSS benchmark measurements and limits", zh: "DLSS 基准实测与边界" },
    { path: "/zh/dlss-4-5", en: "DLSS 4.5 parts and release status", zh: "DLSS 4.5 功能组成与发布状态" },
    { path: "/zh/guides/gpu-unlock-rtx-30-4090", en: "RTX 30 and 4090 FP/BF16 unlock reports — not a DLSS 5 unlock", zh: "RTX 30 与 4090 FP/BF16 解锁报告——不是 DLSS 5 解锁" },
  ],
  '/zh/benchmark': [
    { path: "/zh/dlss-4-5", en: "DLSS 4.5 parts and release status", zh: "DLSS 4.5 功能组成与发布状态" },
    { path: "/zh/guides/gpu-unlock-rtx-30-4090", en: "RTX 30 and 4090 FP/BF16 unlock reports — not a DLSS 5 unlock", zh: "RTX 30 与 4090 FP/BF16 解锁报告——不是 DLSS 5 解锁" },
  ],
  '/zh/status': [
    { path: '/zh/dlss-5-dll', en: 'DLSS runtime DLL facts and email requests', zh: 'DLSS 运行时 DLL 事实与邮件申请' },
    { path: "/zh/benchmark", en: "DLSS benchmark measurements and limits", zh: "DLSS 基准实测与边界" },
  ],
  '/zh/studio-beta': [
    { path: 'https://github.com/wangsheng1991/dlss-5-studio', en: 'Product-documentation and compatibility-record repository', zh: '产品文档与兼容性记录仓库' },
    { path: "/zh/games", en: "DLSS 5 games launch tracker", zh: "DLSS 5 游戏上线追踪" },
  ],
};
