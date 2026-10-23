interface RecordedVideo { slug: string; contentPath: string; thumbnailPath: string; duration: string; seconds: number; width: number; height: number; frames: number; bytes: number; uploadDate: string }
// Measured final files; evidence lives in public/videos.
export const CORE_VIDEOS: Record<string, RecordedVideo> = {
  "adobe-topaz-acquisition-image-upscaling": {
    slug: "adobe-topaz-acquisition-image-upscaling",
    contentPath: "/adobe-topaz-acquisition-image-upscaling/video/landscape-11s.mp4",
    thumbnailPath: "/adobe-topaz-acquisition-image-upscaling/video/first-frame.jpg",
    duration: "PT11S", seconds: 11, width: 1440, height: 810, frames: 275, bytes: 365296, uploadDate: "2026-10-23"
  },
  "core-game-frame-style-reference": {
    "slug": "core-game-frame-style-reference",
    "contentPath": "/videos/game-character-style-example-19s-1280x900-475f.mp4",
    "thumbnailPath": "/videos/game-character-style-example-19s-1280x900-475f-first-frame.jpg",
    "duration": "PT19S",
    "seconds": 19.0,
    "width": 1280,
    "height": 900,
    "frames": 475,
    "bytes": 862180,
    "uploadDate": "2026-10-23"
  },
  "core-two-reference-room-workflow": {
    "slug": "core-two-reference-room-workflow",
    "contentPath": "/videos/interior-reference-example-18.32s-1440x1000-458f.mp4",
    "thumbnailPath": "/videos/interior-reference-example-18.32s-1440x1000-458f-first-frame.jpg",
    "duration": "PT18.32S",
    "seconds": 18.32,
    "width": 1440,
    "height": 1000,
    "frames": 458,
    "bytes": 1868598,
    "uploadDate": "2026-10-23"
  },
  "core-redraw-review-checklist": {
    "slug": "core-redraw-review-checklist",
    "contentPath": "/videos/redraw-review-example-20.12s-1440x1000-503f.mp4",
    "thumbnailPath": "/videos/redraw-review-example-20.12s-1440x1000-503f-first-frame.jpg",
    "duration": "PT20.12S",
    "seconds": 20.12,
    "width": 1440,
    "height": 1000,
    "frames": 503,
    "bytes": 1189784,
    "uploadDate": "2026-10-23"
  }
};
export function coreVideoCopy(slug: string, chinese: boolean) {
  const video = CORE_VIDEOS[slug];
  const copies: Record<string, {title: string; description: string}[]> = {
    'adobe-topaz-acquisition-image-upscaling': [
      {title: 'Site-owned browser workflow recording', description: 'Recorded on 2026-10-17 at /visual-enhancer: the existing guest example and comparison. This is a cached site-owned sample, not an Adobe or NVIDIA product capture or a performance benchmark.'},
      {title: '本站浏览器流程录屏', description: '2026-10-17 录制于 /visual-enhancer，展示已有的免登录示例与对比。这是本站自有缓存样张，不是 Adobe 或 NVIDIA 产品演示，也不是性能测试。'}],
    'core-game-frame-style-reference': [
      {title: 'No-login cached example: character style comparison', description: 'Open the no-login example, wait for the cached result and drag the comparison. Original-speed screen recording; this is a stored example, not live model inference. The frozen tail has been removed.'},
      {title: '免登录缓存示例：角色风格前后对比', description: '打开免登录示例，等待缓存结果并拖动对比。真实原速录屏，已裁去冻结尾段；这是已存储的示例，不是模型实时推理。'}],
    'core-two-reference-room-workflow': [
      {title: 'Historical room example: source, style reference and result', description: 'View the existing source, style reference and historical result, then drag the reference/result comparison without logging in. Original-speed recording of a historical sample, not output from a new task. Room geometry may change.'},
      {title: '室内历史样张：源图、风格参考与结果', description: '免登录查看已有源图、风格参考与历史结果，再拖动参考图与结果的对比。真实原速录屏；这是历史样张，不是本次新任务输出，房间几何可能改变。'}],
    'core-redraw-review-checklist': [
      {title: 'Review a redraw: zoom into lettering and edges', description: 'Drag the historical game-frame comparison and use browser zoom to inspect signs and character edges. Original-speed screen recording, not new inference or evidence of faithful text preservation.'},
      {title: '重绘检查：放大查看小字与边缘', description: '拖动历史游戏画面对比，通过浏览器缩放查看招牌文字和角色边缘。真实原速录屏，不是新推理，也不代表文字得到忠实保留。'}],
  };
  const copy = copies[slug][chinese ? 1 : 0];
  return {...copy, description: copy.description + (chinese
    ? ` 文件实测：${video.seconds} 秒，${video.width}×${video.height}，${video.frames} 帧。`
    : ` Measured file: ${video.seconds} seconds, ${video.width}×${video.height}, ${video.frames} frames.`)};
}
