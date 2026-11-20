import { SITE_URL } from '../config/site';
import { videoPreviewLanguage, videoPreviewPath, type VideoPreviewLocale } from './videoStudio';

type Copy = [heading: string, description: string, review: string, sample: string];
type Tool = { slug: string; group: 'inspect' | 'compare' | 'plan'; related: '/video-understanding' | '/video-highlights' | '/video-upscaler' | '/frame-interpolation'; en: Copy; zh: Copy };

export const VIDEO_TOOLS = [
  { slug: 'frame-extractor', group: 'inspect', related: '/video-upscaler',
    en: ['Video Frame Extractor', 'Pause a video at the moment you need and save the decoded frame as a PNG in your browser.', 'Use a clean frame as a Studio style-conversion reference. Seek through neighboring moments to avoid motion blur or a partially closed eye.', 'Load the street clip, pause on a passing vehicle, and save the chosen still. The PNG keeps the decoded frame dimensions.'],
    zh: ['视频抽帧工具', '把视频停在需要的时间点，在浏览器里把当前画面保存成 PNG。', '挑一帧清晰的画面作为 Studio 风格转换参考。前后多看几个时刻，避开运动拖影或闭眼的瞬间。', '打开路口样片，停在车辆经过的时刻并保存。PNG 使用浏览器解码出的画面尺寸。'] },
  { slug: 'contact-sheet', group: 'inspect', related: '/video-understanding',
    en: ['Video Contact Sheet Maker', 'Sample a video at evenly spaced times and export a labeled grid of stills as a PNG.', 'Use the grid to shortlist frames before you start a Studio redraw. Even sampling can miss brief moments between thumbnails.', 'Build a sheet from the street clip and compare the direction of pedestrian traffic across the grid.'],
    zh: ['视频缩略图总览生成器', '按时间均匀抽取视频画面，生成带时间标记的缩略图网格并导出 PNG。', '先从总览里挑几帧，再送去 Studio 做风格重绘。均匀采样可能漏掉短暂出现的动作。', '用路口样片生成一张总览，对照行人在各格中的移动方向。'] },
  { slug: 'metadata-viewer', group: 'inspect', related: '/video-upscaler',
    en: ['Video Resolution and Duration Checker', 'Check the displayed resolution, aspect ratio and duration of a clip and save the browser-readable metadata as JSON.', 'Use these fields to check that two clips are ready for a fair comparison. Browser metadata does not expose every codec, bitrate or original capture setting.', 'Load the street sample and compare its displayed dimensions with the export specification you need.'],
    zh: ['视频分辨率与时长查看器', '查看视频的显示分辨率、宽高比和时长，把浏览器可读的信息导出为 JSON。', '对比处理前后，先核对规格。浏览器读到的信息有限，不能据此判断所有编码、码率或拍摄设置。', '载入路口样片，把显示尺寸和你需要的交付规格比一比。'] },
  { slug: 'vertical-crop-preview', group: 'compare', related: '/video-upscaler',
    en: ['Vertical Video Crop Preview', 'Preview a 9:16 or square crop, shift the framing horizontally, and save a still as a guide for your editor.', 'Review several timestamps before exporting a vertical version in your editor. A framing that works on the first frame can lose your subject later.', 'On the street sample, drag the horizontal position and watch what falls outside the vertical frame.'],
    zh: ['竖屏视频裁切预览', '预览 9:16 或正方形画幅，左右调整取景，再保存静帧给剪辑时参考。', '在剪辑软件导出竖屏版本前，多看几个时间点。首帧位置合适，后续也可能裁掉移动的主体。', '用路口样片拖动水平取景位置，观察哪些行人出了竖屏画面。'] },
  { slug: 'before-after-comparison', group: 'compare', related: '/video-upscaler',
    en: ['Side-by-Side Video Comparison', 'Load two clips and seek both from one timestamp control to compare the same part of a shot.', 'Start with clips cut from the same source and aligned at the start. Use the shared timestamp to inspect texture, motion trails and lettering without assuming higher resolution means better quality.', 'The demo loads web previews of two same-source street outputs from the Studio lab. Compare baseline resizing and the candidate at matching timestamps.'],
    zh: ['视频前后并排对比', '载入两段视频，用一个时间控件跳到两边的相同时刻，逐段检查处理效果。', '先选起点对齐的同源片段，然后在共同时间点看纹理、运动拖影和文字。输出分辨率只是交付规格之一。', '演示使用 Studio 实验室两条同源路口输出的网页预览版，可在对应时刻比较基础缩放与候选处理。'] },
  { slug: 'event-timeline', group: 'plan', related: '/video-understanding',
    en: ['Video Event Timeline Viewer', 'Seek to a labeled moment and export a timestamped event list. The demo includes saved road-scene model windows.', 'Keep the event list beside your source clip so an editor can verify each label. Entries you add to your own clip are manual annotations.', 'The street example shows original visual predictions about people, cars and bicycles. Select an interval to review the footage and the saved label.'],
    zh: ['视频事件时间轴查看器', '跳到带标签的时间点，并导出带时间戳的事件列表。路口演示附本地模型保存的分段输出。', '把事件表和原片一起交给剪辑人员逐条核对。自己的视频可手动标注，不会触发自动模型分析。', '路口演示保留了人物、汽车、自行车的画面判定。点任意条目即可回看对应画面和标签。'] },
  { slug: 'scene-change-review', group: 'plan', related: '/video-highlights',
    en: ['Video Scene Change Finder', 'Sample nearby pictures and list candidate scene changes based on differences in brightness and color.', 'Treat flashes and fast camera moves as candidates to check. This lightweight scan is handy for finding review points before a longer Studio edit.', 'Import a clip with a hard cut, scan it, and jump to the candidate timestamps. The road sample also lets you see what ordinary motion can trigger.'],
    zh: ['视频切镜候选检测', '对相邻采样画面做亮度和颜色差分，列出可能的切镜时间点。', '灯光闪烁、快速摇镜也会触发候选，需要人工回看。可用它先定位，再到 Studio 工作流检查。', '导入带硬切的短片，扫描后点击候选时间点；路口样片也可以用来观察普通运动会不会触发。'] },
  { slug: 'clip-range-planner', group: 'plan', related: '/video-highlights',
    en: ['Video Clip Range Planner', 'Mark the start and end of a highlight, then save an edit handoff with the source filename and exact selected times.', 'Leave room before and after the action so an editor can adjust the cut. The handoff exports timestamps for the edit, while the original media stays intact.', 'Scrub the street clip to where an action begins and ends. Set both boundaries and export the selected range as JSON.'],
    zh: ['视频精彩片段选段工具', '标记高光片段的起点和终点，导出包含源文件名和时间点的剪辑交接清单。', '在动作前后留一点余量，方便后续调整切点。工具只导出选段时间，原视频文件保持原样。', '拖到路口样片里一个动作的开头和结尾，分别标记，再下载 JSON。'] },
  { slug: 'slow-motion-review', group: 'compare', related: '/frame-interpolation',
    en: ['Slow Motion Video Review', 'Play a clip at a reduced speed or move forward and backward in small time steps to inspect motion.', 'Use slower playback to spot a double contour, missed frame or abrupt cut. Playback speed does not generate frames or change your source file.', 'Watch the street sample at half speed or open the interpolation evidence to compare repeat frames and optical flow.'],
    zh: ['视频慢放逐格检查', '以较低速度回放视频，或按短时间间隔向前向后移动，检查运动细节。', '用慢放找重影、跳动和突变。这里调整播放速度，不生成新帧，也不改源视频。', '把路口样片切到半速，或到插帧证据页查看重复帧和光流的实际对照。'] },
  { slug: 'object-box-annotator', group: 'inspect', related: '/video-understanding',
    en: ['Video Frame Bounding Box Annotator', 'Pause on a frame, drag a box over an object, and export its normalized coordinates and timestamp.', 'Use the exported coordinates to hand off or review a proposed annotation. A box placed on one frame does not track an object in later frames.', 'Mark a car or bicycle on the street clip. For a recorded model-generated localization example, open the basketball hoop demo.'],
    zh: ['视频帧目标框标注工具', '停在一个视频画面上，拖框圈选物体，导出归一化坐标和时间点。', '可把坐标用于标注交接或复核。单帧上的框不会自动跟踪后续画面中的物体。', '在路口样片中框一辆车或自行车。想看模型输出的定位框，可打开篮筐实测。'] },
] as const satisfies readonly Tool[];

export type VideoTool = typeof VIDEO_TOOLS[number];
export const videoToolPath = (tool: VideoTool, locale: VideoPreviewLocale) => `${locale === 'zh' ? '/zh' : ''}/video-studio/${tool.slug}`;
export const videoToolTitle = (tool: VideoTool, locale: VideoPreviewLocale) => `${tool[locale][0]} | DLSS 5 Studio`;
export const videoToolAlternates = (tool: VideoTool, base = SITE_URL) => [
  { hrefLang: 'en', href: base + videoToolPath(tool, 'en') },
  { hrefLang: 'zh-CN', href: base + videoToolPath(tool, 'zh') },
  { hrefLang: 'x-default', href: base + videoToolPath(tool, 'en') },
];
export function videoToolSchema(tool: VideoTool, locale: VideoPreviewLocale, base = SITE_URL) {
  const url = base + videoToolPath(tool, locale);
  const id = url + '#breadcrumb';
  return { '@context': 'https://schema.org', '@graph': [
    { '@type': 'WebPage', '@id': url + '#webpage', url, name: tool[locale][0], description: tool[locale][1], inLanguage: videoPreviewLanguage(locale), breadcrumb: { '@id': id } },
    { '@type': 'BreadcrumbList', '@id': id, itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'DLSS 5 Studio', item: base + (locale === 'zh' ? '/zh' : '/') },
      { '@type': 'ListItem', position: 2, name: locale === 'zh' ? '视频工作台' : 'Video Studio', item: base + videoPreviewPath('/video-studio', locale) },
      { '@type': 'ListItem', position: 3, name: tool[locale][0], item: url },
    ] },
  ] };
}
