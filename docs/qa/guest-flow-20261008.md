# 游客首次体验 QA（2026-10-08）

## 范围

正式站 `https://www.dlss5nvidia.com`，全新未登录浏览器上下文；覆盖最高频入口的首页 → `dashboard?tool=game-character-style&sample=characterStyle` → 免费缓存示例 → 前后对比 → 下载。桌面与窄屏分别跑英文、中文；未改登录、付费或隐私规则，也未部署。

## 改动清单

本轮没有修改产品代码。线上现有承诺已经满足游客的免费首个动作，因此保留现状：

- 首页主按钮进入真实转换工作流；工作室页面把 `DLSS 5 convert · Character style` 作为唯一主面板。
- 示例请求不需要账号，等待期间有可读的 `Preparing…` 状态，完成后有前后对比、完成状态和下载链接。
- 游客自己的图片上传控件保持禁用，明确提示登录后上传；没有擅自放开付费/登录能力。
- 失败时显示服务返回的错误文案，原示例按钮留在原位，可直接再次运行。

## 验证证据

自动化浏览器使用系统 Chrome（Playwright，正式域名，独立 context），生成的逐步截图和 JSON：

- [完整摘要 JSON](./guest-flow-20261008/summary.json)
- [入口与登录边界 JSON](./guest-flow-20261008/entry-details.json)
- [英文桌面首页](./guest-flow-20261008/en-desktop-01-home.png)、[工作室](./guest-flow-20261008/en-desktop-02-studio-idle.png)、[处理中](./guest-flow-20261008/en-desktop-03-running.png)、[结果](./guest-flow-20261008/en-desktop-04-result.png)
- [中文桌面结果](./guest-flow-20261008/zh-desktop-04-result.png)
- [英文窄屏工作室](./guest-flow-20261008/en-mobile-02-studio-idle.png)、[结果](./guest-flow-20261008/en-mobile-04-result.png)
- [中文窄屏结果](./guest-flow-20261008/zh-mobile-04-result.png)
- [失败提示](./guest-flow-20261008/en-mobile-06-error.png)、[重试结果](./guest-flow-20261008/en-mobile-07-retry-result.png)
- [失败/下载 JSON](./guest-flow-20261008/failure-download.json)

| 场景 | 结果 | 读数 |
| --- | --- | --- |
| 英文桌面 1440×900 | 通过 | 首页 → 工作室 → 结果；进入 1.83s，运行到结果 0.99s，错误 0；前后对比 1 个 slider；下载链接存在 |
| 中文桌面 1440×900 | 通过 | 中文标题/主按钮/运行状态/结果均出现；进入 1.76s，运行到结果 1.06s，错误 0 |
| 英文窄屏 375×812 | 通过 | 无横向溢出；首屏可见 `Run this example · free`；进入 1.63s，运行到结果 1.39s，错误 0 |
| 中文窄屏 375×812 | 通过 | 无横向溢出；首屏可见 `运行示例 · 免费`；入口、处理中、结果均无黑屏/卡住 |
| 游客上传边界 | 符合承诺 | 四个尺寸均检测到 1 个 `input[type=file]` 且 `disabled=true`，同时显示登录后上传链接 |
| 失败与重试 | 通过 | 浏览器仅对首个示例请求注入一次 500；页面显示错误文案，原按钮仍可见；恢复请求后再次点击得到结果 |
| 下载 | 通过 | 点击带 `download` 的结果链接触发浏览器下载；正式 GET 返回 `200 image/webp`，约 306 KB，`1024×1024`，可由 `file` 识别为 WebP |
| API 输入校验 | 通过 | `POST /api/image-edit/samples` 发送未知 sample 返回 HTTP 400 `{"error":"Unknown example."}` |

## 逐步路径

1. 首页首屏点击一次唯一绿色游客入口；没有要求登录或付款。
2. 工作室自动回到顶部，标题明确为 convert 人物风格；默认示例预览与 `Run this example · free` 同屏。
3. 点击运行后立即出现 `Preparing Cyberpunk character style…`（中文对应“正在准备…”），无空白区域或无限 spinner。
4. 缓存返回后出现前后对比 slider、`Example ready · served from cache`、下载和“再试一个示例”。
5. 下载触发浏览器文件下载；游客自己的图片入口仍明确要求登录。

## 未完成项 / 边界

- 本轮没有真实登录账号，因此未执行“上传自己的图片 → 付费/积分生成”链路；页面已按规则把该能力锁在登录后，不能把游客 QA 结果外推到该链路。
- 失败场景使用一次性浏览器 500 注入验证 UI 恢复；未主动让生产 Alphanet 任务失败，以免消耗额度或改变用户数据。生产缓存示例本次返回成功。
- 结果刷新后会回到示例初始状态，需要再次点运行；这是当前无账号示例的状态生命周期，没有发现黑屏或错误，但如产品要求刷新后继续展示结果，应另立小改动（本轮未改）。
