/** Existing page limits and upload behaviour; no retention or speed guarantee. */
export const ENHANCER_SHORT_ANSWERS = {
 en:[
  {question:'What is this DLSS 5 visual enhancer?',answer:'It is an independent image-redraw workflow, not NVIDIA DLSS 5 or a game runtime. It does not install or replace nvngx_dlss* files. Image-quality enhancement is an entry point; game-character style conversion and Studio remain our core.'},
  {question:'What can I try for free?',answer:'The cached browser example is free, with no sign-in or upload required. You can compare and download its image result. Your own image requires sign-in and available credits; target factors 2/4 and the 1536-pixel output-edge cap describe that image workflow, not unlimited free processing.'},
  {question:'Which inputs and output sizes are supported?',answer:'JPEG, PNG and WebP inputs are supported up to 10 MiB; output longest edge is capped at 1536 pixels with target factors 2/4. Three recorded 2026-10-23 tasks took 15.869–16.357 seconds in an isolated test build with simulated authentication and credits but real processing. This small timing sample is not a speed guarantee.'},
  {question:'Are uploaded pictures kept private or deleted immediately?',answer:'Your image is uploaded to the processing provider through a signed upload URL; it is not processed only on your device. Retention and deletion timing have not been verified, so we do not promise immediate deletion or a retention period.'},
  {question:'How is it different from NVIDIA DLSS 5?',answer:'This tool redraws a supplied image; NVIDIA DLSS 5 is a game-rendering technology. A browser image result does not enable a DLSS feature inside a game or establish in-game performance.'},
 ],
 zh:[
  {question:'这个 DLSS 5 视觉增强器是什么？',answer:'它是独立的图片重绘流程，不是 NVIDIA DLSS 5，也不是游戏运行时，不会安装或替换 nvngx_dlss* 文件。图片质量增强只是入口；游戏人物风格转换与 Studio 仍是我们的主线。'},
  {question:'免费能做什么？',answer:'缓存浏览器示例免费，无需登录或上传，可对比并下载图片结果。处理自己的图片需要登录和可用额度；目标因子 2/4、输出最长边 1536 像素是图片流程的限制，不代表免费无限处理。'},
  {question:'支持哪些输入格式和输出尺寸？',answer:'支持 JPEG、PNG、WebP，最大 10 MiB；输出最长边上限 1536 像素，目标因子 2/4。2026-10-23 的三次记录耗时 15.869–16.357 秒：隔离测试构建模拟登录和额度，实际处理为真实任务。小样本不代表速度承诺。'},
  {question:'上传的图片会只留在本机或立即删除吗？',answer:'图片通过签名上传地址发送给处理服务，并非仅在本机处理。留存与删除时间尚未验证，因此不承诺立即删除，也不声明具体留存期限。'},
  {question:'它与 NVIDIA DLSS 5 有什么区别？',answer:'本站工具重绘用户提供的图片；NVIDIA DLSS 5 是游戏渲染技术。浏览器图片结果不会替游戏开启 DLSS 功能，也不能证明游戏内性能。'},
 ],
} as const;
