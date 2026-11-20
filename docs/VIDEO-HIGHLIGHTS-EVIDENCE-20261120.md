# AI 视频高光预告 · 2026-11-20

R1 / R4。Studio 视频支线，本地原型结果用于双语预告。访客可以播放原片、检查每个取舍，再进入预选了高光功能的内测申请。

## 输入、输出和复核

- 原片为 [Mixkit #4401](https://mixkit.co/free-stock-video/crowds-of-people-cross-a-street-junction-4401/)，原素材页注明 Mixkit Stock Video Free License。页面采用发布者的 720p 下载版转码，19.8 秒、594 帧。
- Windows 原型输出 `G:\llava-ov25\demo\out\02_bus_highlights_720p.mp4`，SHA256 `a151f28ed62bef1ad6498d5c8a37b3c1e2d5ab4478a3456c525cd22b71321f82`，13.5 秒、405 帧。页面使用缩放、限速转码的副本。
- 对应 `bus_windows.json`，SHA256 `7d140b4cdbb9b0c5db2581384956fc38d3141b0929c7abbe5c705030239bb91f`，有 13 个判断窗口，每个 1.5 秒，保留 9 个。连续保留范围是 0–3、6–9、10.5–18 秒。原片最后 0.3 秒未进入这份判定记录。
- 逐段验证 9 个选中窗口的中间帧。分别按原片时间和累积剪辑时间抽帧，对齐尺寸后核对亮度 SSIM 和时间戳。用接触表人工复核画面，两个版本可逐段切换。这个核验只确认剪辑来自记录中的位置。
- 此批判定的原始提示词和运行时模型版本未随产物保存。当前示例没有人工真值，无法给出准确率或推断产品质量。视频公开体验仍是预告。播放器使用已生成素材，线上不调用分析或生成模型。

## 商业页面参考

[Adobe Premiere Media Intelligence](https://helpx.adobe.com/premiere/desktop/organize-media/file-organization/media-intelligence-and-search-panel.html) 让创作者通过描述找到素材；[Descript Find Good Clips](https://feedback.descript.com/changelog/new-ai-action-find-good-clips) 把候选片段交回编辑流程。Studio 实现相同任务入口中最可验证的部分：把取舍连回真正的原始时间戳，让用户先看结果，再决定是否申请内测。两项是工作流参考，本页没有进行竞品效果对拍。

复验文件保存在 `/Users/wangsheng/code/shou/artifacts/video-highlights-20261120/`，含原始时间窗、Windows 剪辑、逐段复核日志和截图。
