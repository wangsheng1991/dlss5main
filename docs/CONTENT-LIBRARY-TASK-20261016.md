# 内容库生产线（热点驱动）— 2026-10-16

王胜定调：**发布暂停不影响积累**——先给我把高质量内容攒出来（图文、排版、视频），发布按节奏另行安排。

## 1. 用既有工具，不要另起炉灶

| 环节 | 用什么 |
|---|---|
| 选题打分 | skill `promo-topic-score`（七维打分，<70 分不做） |
| 写稿 | skill `promo-copy`（框架选择 + 七道扫 + 两道评分闸） |
| 发布前合规/质量 | skill `promo-quality-gate`（必须 ✅，⚠️ 要改到达标） |
| 入口/路由 | skill `promo-ops` |
| 卡片图/图文排版图 | `node shared_env/promo-kit/bin/promo.mjs cards <spec.json> --out <dir> --strict`（已 `doctor` 通过：node 24 / Chrome / 中文 / ffmpeg 都在） |
| 短视频 | skill `hyperframes`（HTML→MP4 工具链在本机可用），或 `ruic-motion-reel` |
| 图与视频的真实素材 | 站点自有样例、王胜本人照片、Wikimedia CC 带署名；**媒体官图/新闻社照片一律不用** |

## 2. 每篇成品的目录与文件

```
~/code/shou/artifacts/content-library/2026-10-XX-<slug>/
  article.en.md     英文主稿
  article.zh.md     中文稿
  assets/           图（含 caption 与许可说明）、卡片图、录屏
  social.md         一渠道一版的短文案（见第 4 条）
  video/            15–30 秒竖版 + 16:9 版
  gate.md           选题分、七道扫结果、promo-quality-gate 判定
```

## 3. 内容质量标准（王胜侧验收，按这个判）

1. 英文 ≥ **1200 词**，中文 ≥ **1500 字**；H2/H3 分层，**段落 ≤4 行**。
2. 开头 40 词内给结论（answer-first），加一个 **TL;DR 框**（3–5 条要点）。
3. **至少 2 张真实图**（我们真跑的前后对比 + 可选的排版卡片图），每张带 caption、来源与许可。
4. **至少 1 段可复现**（命令或分步操作），别人能照着做。
5. 结尾写**边界**（做不到什么）+ **独立性声明**（independent, not affiliated with NVIDIA）。
6. 不编数字、不宣称性能、不称 NVIDIA 官方；口径不越 `src/config/enhance.ts`（flux-klein 重绘、上限 1536 px、2×/4×、不是逐像素超分）。
7. 每篇头部写明：**目标关键词 / 落点页面 / 一句「为什么这篇能带来人」**。
8. `gate.md` 里 `promo-quality-gate` 必须是 **✅**；⚠️ 要写清理由并改到达标；❌ 直接重写。

## 4. social.md 的格式（一渠道一版，不许复用同一段）

- **Bluesky**：≤300 字符，含 1 张图，链接一条。
- **DEV.to**：摘要 2–3 句 + 5 个标签 + 封面图路径（封面用公开可访问的图 URL）。
- **Reddit**（若日后解冻）：标题按子版规定格式 + 正文首段（事实陈述，不做广告语气）。
- **HN**：标题 ≤80 字符，必须是技术事实描述，不写营销词。
- **知乎/公众号**（中文）：标题 + 100 字导语。

## 5. 排期

- 第一批（今天/明天先攒素材）：① NVIDIA Broadcast 2.3 4K 放大/帧生成（已有底稿，按新标准重写扩写）② Tesla 新车新闻图被压糊（只用合规图）③ Adobe 收购 Topaz：「不订阅也能做这件事」（只陈述事实，不贬损、不编价格）④ RTX Video upscaling 进 ComfyUI 开源管线。
- 之后每天 **2–3 篇**；素材先攒着，发布按 ≤5 条/天、同渠道 ≤1 条执行。
- 每篇完成即回一句：目录路径 + 字数 + 图数 + gate 判定；不要贴长文。

## 6. 不要做

- 不要发布（今天配额已满，明天起按节奏）；不要动站点代码。
- 不要用媒体官图、不要编数字、不要假称官方。
- 账号只用王胜本人的（API key 或确认过的登录）。

---

## 7. 视频规则（2026-10-16 深夜追加，与第 6 节同等效力）

第 6 节「不要编数字、不要假称官方」同样管素材出处。上一批视频有三处是编的，已被王胜侧闸门抓出（`check-articles.mjs` 新增第 14、15 条）：

| 篇 | 视频实际是什么 | 证据 |
| --- | --- | --- |
| tesla-roadster | `promo-20260930/reddit/reddit/01-night.mp4`（香港夜景，Commons CC0 样例图跑出来的对比片段） | dHash 距离 **0/64** |
| broadcast-2-3 | `.../06-video.mp4`（NASA 火箭试车 PD 视频） | dHash 距离 **0/64** |
| adobe-topaz | `.../08-portrait.mp4`（Champéry 彩色人像 PD 照片） | dHash 距离 **0/64** |
| rtx-video | 无视频 | 对的做法 |

但三篇的 `video/README.md` 都写着 “This is a real site workflow recording”，`assets/README.md` 还写了一个**不存在**的文件名 `visual-enhancer-before-after-30s.mp4`，`gate.md` 写 “video is a real screen recording”。**这三处都是编的，必须改掉。**

### 7.1 录真流程是可行的（已实测）

`/visual-enhancer` 上有访客真能点的按钮，2026-10-16 实测：

```
node ~/.penguin/data/default_project/agents/default_agent/shared_env/playwright/record-enhancer-flow.mjs \
     /visual-enhancer /tmp/record-enhancer
→ runButtonLabel "Run this example · free" / runSeconds 5 / sliderPresent true
  status "served from cache" / downloadHref "/api/image-edit/samples?sample=sample1"
  WebM 16.8 s，界面截图正常
```

所以视频就**录这些落点页上的真实操作**：进页面 → 点 Run（或该主题对应的真实操作）→ 等真结果出来 → 拖对比滑块 → 滚过一两段关键内容。**不要再用任何旧素材包片段。**

### 7.2 每个 `video/` 必须带（闸门逐条查）

```
video/README.md
  Origin: site-recording          # 三选一：site-recording | own-sample | third-party
  Page: https://www.dlss5nvidia.com/visual-enhancer
  Source: record-enhancer-flow.mjs （2026-10-17 那一跑）
  Recorded: 2026-10-17            # YYYY-MM-DD，必填
  Topic link: <一句话：画面里演示的是本篇的哪件事，≤200 字，必填>
  License: …                      # 仅 Origin: third-party 时必填
video/contact-sheet.jpg           # 4 帧拼图，让人不播视频也能核内容
video/landscape-24s.mp4 video/vertical-24s.mp4
```

不许：`Origin` 写 `site-recording` 而画面来自别处；任何 md 把外部素材叫 “site recording / screen recording”；md 里提到本文件夹里没有的媒体文件名。

### 7.3 录不出来就删

某主题的落点页没有可点的真实操作 → **删掉 `video/`**，在 `gate.md` 写一句「本主题无可录制的真实画面，故不配视频」（RTX 那篇已经这么做对了，保持）。宁缺勿假。

### 7.4 验收

王胜侧跑 `node ~/code/shou/artifacts/content-library/check-articles.mjs`（必须 **4 articles, 0 failing**），并人工看每张 contact sheet 判「视频与主题相关」。**当前 4 篇全 FAIL，其中 3 篇是视频问题。**
