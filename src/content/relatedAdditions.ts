/** Additive related-reading links for the eight protected routes in the October 2026 experiment. */
export const RELATED_ADDITIONS: Record<string, Array<{ path: string; en: string; zh: string }>> = {
  '/download': [
    { path: '/dlss-5-apk', en: 'Android and APK availability', zh: '安卓与 APK 可用情况' },
    { path: '/system-requirements', en: 'System requirements', zh: '系统要求' },
    { path: '/status', en: 'DLSS 5 release status', zh: 'DLSS 5 发布状态' },
  ],
  '/image-quality-enhancer': [
    { path: '/before-after', en: 'Before-and-after reference cases', zh: '前后对比参考案例' },
    { path: '/guides', en: 'DLSS 5 guides', zh: 'DLSS 5 使用指南' },
  ],
  '/image-upscaler': [
    { path: '/before-after', en: 'Before-and-after reference cases', zh: '前后对比参考案例' },
    { path: '/guides', en: 'DLSS 5 guides', zh: 'DLSS 5 使用指南' },
  ],
  '/video-upscaler': [
    { path: '/before-after', en: 'Video and image reference cases', zh: '视频与图片对比案例' },
    { path: '/games', en: 'Launched and announced games', zh: '已上线与已宣布游戏' },
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
    { path: '/before-after', en: 'Inspect before-and-after examples', zh: '查看前后对比案例' },
    { path: '/guides', en: 'Read more practical guides', zh: '阅读更多实用指南' },
  ],
  '/zh/blog/dlss-5-online-image-upscaler-guide': [
    { path: '/zh/before-after', en: 'Inspect before-and-after examples', zh: '查看前后对比案例' },
    { path: '/zh/guides', en: 'Read more practical guides', zh: '阅读更多实用指南' },
  ],
};
