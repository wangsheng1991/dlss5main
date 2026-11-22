import type { Article } from './types';

export const VIDEO_FRAME_PNG_SLUG = 'how-to-save-video-frame-as-png';
export const videoFramePngGuidePath = (locale: 'en' | 'zh') =>
  `${locale === 'zh' ? '/zh' : ''}/blog/${VIDEO_FRAME_PNG_SLUG}`;

export const VIDEO_FRAME_PNG_ARTICLE: Article = {
  slug: VIDEO_FRAME_PNG_SLUG,
  tier: 'entry-point',
  assetBase: `/blog/${VIDEO_FRAME_PNG_SLUG}/`,
  title_en: 'How to save a frame from a video as a PNG',
  title_cn: '怎么从视频里选一帧，保存成 PNG？',
  description_en: 'Open a clip, select a frame by time and save it as a PNG. Follow real screenshots from the browser-based Video Frame Extractor.',
  description_cn: '打开视频、拖动时间滑杆、保存 PNG。跟着真实操作截图，从视频里选出一帧当封面或参考图。',
  tags: ['Video Studio', 'Video frame extraction'],
  target_keywords_en: ['save video frame as PNG', 'video frame extractor'],
  target_keywords_cn: ['视频抽帧', '从视频提取一帧', '保存 PNG'],
  priority: 'P1',
  type: 'Feature tutorial',
  datePublished: '2026-11-22',
  checkedDate: '2026-11-22',
  lastUpdated: 'November 2026',
  readTime: '2 min read',
  coverCaption_en: 'The still exported from our own clip in the walkthrough.',
  coverCaption_cn: '教程中从站点自制短片实际导出的静帧。',
  content_en: "Need a thumbnail, a reference image, or a still for review? Open the video in the frame extractor, move to the moment you want, and click **Save PNG**. The file contains the video frame without the player buttons or timeline.\n\nYou can also save a game frame as a reference for [Studio’s style converter](https://www.dlss5nvidia.com/game-character-style). The extractor only captures the still; the style conversion is a separate step.\n\n## 1. Open a clip\n\nClick **Open video file** to select a clip from your device. If you just want to see how it works, click **Open sample**. The screenshots use a short clip we made. You can follow the same steps with the built-in street clip.\n\n## 2. Pick the frame you want\n\nUse the player to get close to the moment you want, then pause. Drag the **Review time** slider beneath the player and wait for the preview to catch up. If you're picking a thumbnail, check a nearby moment on either side. Look for a moment when the subject is easy to see and any text you want to keep is readable.\n\n![Live English frame extractor with a short clip loaded, Review time slider, and Save PNG button](assets/select-frame-en.png)\n\n*Figure 1. A screenshot from the live tool after selecting the frame at 4.200 seconds in our own clip.*\n\n## 3. Click Save PNG\n\nOnce the preview shows the frame you want, click **Save PNG**. In this walkthrough, the downloaded file was a 1280 × 720 PNG, matching the source clip’s dimensions. The dimensions of your own export depend on the source video.\n\n![PNG actually exported from the selected clip, without any player controls](assets/exported-frame-en.png)\n\n*Figure 2. The PNG downloaded from the moment shown above.*\n\n**If the still looks blurry:** Try a nearby frame. Saving a frame as a PNG preserves the picture already in the video; it cannot remove motion blur or recover detail lost to compression. If the file won't play, try a browser-compatible copy such as an H.264 MP4.\n\n[Open the video frame extractor and try the sample](https://www.dlss5nvidia.com/video-studio/frame-extractor)",
  content_cn: "想把视频里某个瞬间做成封面、参考图或截图证据？打开视频抽帧工具，拖到想要的位置，再点「保存 PNG」。下载的是视频画面本身，不会把播放器按钮或进度条截进去。\n\n如果你想拿游戏帧做光照、材质或角色风格参考，可以把保存的静帧带进 [Studio 风格转换器](https://www.dlss5nvidia.com/game-character-style)。抽帧这一步只取出原画面。\n\n## 1. 打开视频\n\n点「打开视频文件」，从设备里选一段视频。想先试一下，点「打开样片」即可。下面的截图用的是我们自己制作的短片，你也可以用页面里的路口样片跟着做。\n\n## 2. 拖到想要的那一帧\n\n用播放器大致找到目标画面，暂停后，在播放器下方拖动「查看时间」滑杆。等预览更新，再看主体的位置、边缘有没有拖影、文字能不能读清。做封面时，可以前后各看一点：同一段素材里，有时稍早或稍晚的画面更好用。\n\n![线上中文抽帧工具：短片预览下方的「查看时间」滑杆和「保存 PNG」按钮](assets/select-frame-zh.png)\n\n*图 1：线上工具的真实操作截图。在自有短片的 4.200 秒处选好画面后，就可以保存当前帧。*\n\n## 3. 点「保存 PNG」\n\n确认预览正是你要的那张，再点「保存 PNG」。这次从自有短片导出的是一张可打开的 1280 × 720 PNG，尺寸和源片画面一致。用自己的视频时，导出尺寸随源视频而变。\n\n![本次操作实际导出的视频帧，没有播放器按钮和进度条](assets/exported-frame-en.png)\n\n*图 2：从图 1 所选位置实际下载的 PNG。*\n\n**如果画面还是糊的：**抽帧只保存视频里已经有的画面；PNG 保存不会消除原片的运动模糊或压缩痕迹。可以试着选相邻的一帧。视频打不开时，也可以换一个浏览器能播放的版本，比如 H.264 编码的 MP4。\n\n[打开视频抽帧工具，先用样片选一帧](https://www.dlss5nvidia.com/zh/video-studio/frame-extractor)",
};
