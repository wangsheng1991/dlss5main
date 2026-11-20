import { SITE_URL } from '../config/site';
import type { VideoBetaFeature } from '../../lib/video-beta-features';
export type { VideoBetaFeature } from '../../lib/video-beta-features';

export const VIDEO_PREVIEW_PATHS = ['/video-studio', '/video-understanding', '/image-to-video', '/video-upscaler', '/frame-interpolation', '/video-highlights'] as const;
export type VideoPreviewPath = typeof VIDEO_PREVIEW_PATHS[number];
export type VideoPreviewLocale = 'en' | 'zh';

type PreviewCopy = { heading: string; lead: string; details: string };
export const VIDEO_PREVIEW_COPY: Record<VideoPreviewLocale, Record<VideoPreviewPath, PreviewCopy>> = {
  en: {
    '/video-studio': {
      heading: 'DLSS 5 Video Studio',
      lead: 'A video workspace is coming to DLSS 5 Studio. Start with a reference image or an existing clip, review the shot, then prepare it for delivery.',
      details: 'The planned workflow keeps your original and processed clip together so you can review changes before exporting.',
    },
    '/video-understanding': {
      heading: 'AI Video Understanding',
      lead: 'Turn a short clip into an event timeline you can review. Explore a real street-scene demo, inspect the original JSON, and see how a model locates a basketball hoop.',
      details: 'This preview uses saved outputs from a local LLaVA-OneVision-2.5-4B prototype. Apply for the Studio beta to tell us what you want to analyze.',
    },
    '/image-to-video': {
      heading: 'Image to Video',
      lead: 'Turn a reference image into a short video using a description of the scene and camera movement. This tool is coming soon.',
      details: 'The planned preview lets you check whether the motion, framing and subject still match your brief before moving to finishing.',
    },
    '/video-upscaler': {
      heading: 'AI Video Upscaler',
      lead: 'Video super-resolution is coming soon. The planned tool will take an existing clip or an approved Studio preview and prepare it at a higher output resolution.',
      details: 'Compare the original and the enhanced clip at the same point in time. Check faces, lettering and fine edges across several frames before exporting.',
    },
    '/video-highlights': {
      heading: 'AI Video Highlights',
      lead: 'Find candidate moments in a longer clip, then return to the source to review the cuts. See how that workflow looks in a street-scene demo.',
      details: 'Video highlights are coming to DLSS 5 Studio. The example below plays a saved edit from our local prototype.',
    },
    '/frame-interpolation': {
      heading: 'Video Frame Interpolation',
      lead: 'Frame interpolation is coming soon. It will generate intermediate frames to increase the output frame rate of an existing clip.',
      details: 'The proposed review step focuses on motion and cuts. Check fast movement and scene changes for halos, warping or unwanted blending before exporting.',
    },
  },
  zh: {
    '/video-studio': {
      heading: 'DLSS 5 视频工作台',
      lead: 'DLSS 5 Studio 即将扩展视频工具。从参考图或已有视频出发，先预览镜头，再处理和导出成片。',
      details: '计划在同一个工作台保留原片和处理结果，方便在导出前逐段核对变化。',
    },
    '/video-understanding': {
      heading: 'AI 视频理解',
      lead: '把一段短片读成可回看的事件时间轴。看路口实测、核对模型输出的原始 JSON，再看模型如何在球场画面中框出篮筐。',
      details: '这里展示 LLaVA-OneVision-2.5-4B 在本地原型中保存的结果。你可以申请 Studio 内测，告诉我们你想分析什么素材。',
    },
    '/image-to-video': {
      heading: 'AI 图生视频',
      lead: '图生视频即将上线。计划用一张参考图配合场景描述和镜头运动指令，生成可预览的短片。',
      details: '预览阶段先检查运动、构图和主体有没有偏离原来的设想，确认镜头后再做后续处理。',
    },
    '/video-upscaler': {
      heading: 'AI 视频超分',
      lead: '视频超分即将上线。计划支持上传已有视频，或把 Studio 里确认过的预览送去处理，提高成片的输出分辨率。',
      details: '对比时看原片和处理结果的同一时间点，并逐帧检查人物、文字和细边缘，再决定是否导出。',
    },
    '/video-highlights': {
      heading: 'AI 视频高光剪辑',
      lead: '从一段视频里找出候选片段，再回到原片核对起止点。先用这段路口实测看工作流。',
      details: '精彩片段提取即将加入 DLSS 5 Studio。这里可以播放本地原型保存的剪辑结果。',
    },
    '/frame-interpolation': {
      heading: 'AI 视频插帧',
      lead: '视频插帧即将上线。计划在源视频的帧之间生成中间帧，提高输出帧率。',
      details: '预览时重点检查快速运动和切镜，观察是否出现重影、形变或跨镜头混合，再决定是否导出。',
    },
  },
};

export const videoPreviewPath = (path: VideoPreviewPath, locale: VideoPreviewLocale) => locale === 'zh' ? `/zh${path}` : path;
export const videoPreviewLanguage = (locale: VideoPreviewLocale) => locale === 'zh' ? 'zh-CN' : 'en-US';
export const videoPreviewIndexable = (page: VideoPreviewPath) =>
  page === '/video-studio' || page === '/video-understanding' || page === '/video-highlights';
export const videoBetaHref = (locale: VideoPreviewLocale, feature?: VideoBetaFeature) =>
  videoPreviewPath('/video-studio', locale) + (feature ? '?feature=' + feature : '') + '#video-beta';
export const videoPreviewAlternates = (path: VideoPreviewPath, baseUrl = SITE_URL) => [
  { hrefLang: 'en', href: `${baseUrl}${path}` },
  { hrefLang: 'zh-CN', href: `${baseUrl}/zh${path}` },
  { hrefLang: 'x-default', href: `${baseUrl}${path}` },
];

export const videoPreviewTitle = (path: VideoPreviewPath, locale: VideoPreviewLocale) => {
  const heading = VIDEO_PREVIEW_COPY[locale][path].heading;
  if (path === '/video-studio') return locale === 'zh' ? `${heading}｜即将上线` : `${heading} — Coming Soon`;
  return locale === 'zh' ? `${heading}即将上线｜DLSS 5 Studio` : `${heading} Coming Soon | DLSS 5 Studio`;
};
