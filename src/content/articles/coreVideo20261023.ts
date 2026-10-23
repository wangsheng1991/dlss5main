// Values measured from the recorded MP4; evidence lives beside it in public/videos.
export const CORE_VIDEO = {
  "slug": "core-game-frame-style-reference",
  "contentPath": "/videos/game-character-style-example-31.96s.mp4",
  "thumbnailPath": "/videos/game-character-style-example-31.96s-first-frame.jpg",
  "duration": "PT31.96S",
  "seconds": 31.96,
  "width": 1280,
  "height": 900,
  "bytes": 1073945,
  "uploadDate": "2026-10-23"
};

export function coreVideoCopy(chinese: boolean) {
  return chinese ? {
    title: "免登录缓存示例：角色风格前后对比",
    description: "在 /game-character-style 点击免登录示例，等待缓存结果并拖动前后对比。真实原速录屏，无配音；这是已存储的缓存示例，不是模型实时推理。",
  } : {
    title: "No-login cached example: character style comparison",
    description: "Open the no-login example on /game-character-style, wait for the cached result and drag the before-and-after comparison. Real-time screen recording without narration; this is a stored cached example, not live model inference.",
  };
}
