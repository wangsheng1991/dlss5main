import { SITE_URL } from '../config/site';
import { videoPreviewLanguage, type VideoPreviewLocale } from './videoStudio';

export const VIDEO_UPSCALE_LAB = '/vs/topaz-video-upscaling';
export const VIDEO_UPSCALE_MEDIA = '/examples/video-upscale-lab';
export const VIDEO_UPSCALE_SOURCE = 'https://mixkit.co/free-stock-video/couple-playing-basketball-2280/';
export const VIDEO_UPSCALE_TOPAZ = 'https://www.topazlabs.com/topaz-video';
export const VIDEO_UPSCALE_WINDOWS = ['1.5', '4.0', '6.5'] as const;
export const videoUpscaleLabPath = (locale: VideoPreviewLocale) => (locale === 'zh' ? '/zh' : '') + VIDEO_UPSCALE_LAB;

export const videoUpscaleLabCopy = (locale: VideoPreviewLocale) => locale === 'zh' ? {
  title: '视频超分对比预览：Topaz 与 Studio 测试方法',
  heading: '同一段视频，放大后还能留住多少细节？',
  lead: 'Studio 的视频工作流从现有镜头出发，先检查运动细节，再决定如何交付。先切换霓虹文字和街景的同源结果，再用球场样例检查同帧细节。分辨率提高后，看线条是否更易辨认、纹理有没有被抹平。',
  label: 'Studio 视频超分 · 实测方法预览',
  table: '如何比较清晰度、速度和费用',
} : {
  title: 'Topaz vs Studio Video Upscaling — Comparison Preview',
  heading: 'Same clip. How much detail survives?',
  lead: 'Studio’s video workflow starts with an existing shot and a review of the details that matter before export. Switch between same-source outputs for neon lettering and a street scene, then inspect matched frames from a court sample. Look for clearer outlines, texture loss, and changes during motion.',
  label: 'Studio video upscaling · Test preview',
  table: 'How we compare quality, speed, and cost',
};

export function videoUpscaleLabAlternates(baseUrl = SITE_URL) {
  return [
    { hrefLang: 'en', href: baseUrl + videoUpscaleLabPath('en') },
    { hrefLang: 'zh-CN', href: baseUrl + videoUpscaleLabPath('zh') },
    { hrefLang: 'x-default', href: baseUrl + videoUpscaleLabPath('en') },
  ];
}

export function videoUpscaleLabSchema(locale: VideoPreviewLocale, baseUrl = SITE_URL) {
  const { title, lead } = videoUpscaleLabCopy(locale);
  const url = baseUrl + videoUpscaleLabPath(locale);
  return {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebPage', name: title, description: lead, url, inLanguage: videoPreviewLanguage(locale) },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'DLSS 5 Studio', item: baseUrl + (locale === 'zh' ? '/zh' : '/') },
          { '@type': 'ListItem', position: 2, name: locale === 'zh' ? '视频工作台' : 'Video Studio', item: baseUrl + (locale === 'zh' ? '/zh' : '') + '/video-studio' },
          { '@type': 'ListItem', position: 3, name: locale === 'zh' ? '超分对比预览' : 'Upscaling comparison preview', item: url },
        ],
      },
    ],
  };
}
