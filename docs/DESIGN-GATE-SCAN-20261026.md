# 去模板味扫描（Hallmark / sloplint，2026-10-26）

工具：[`Nutlope/hallmark`](https://github.com/Nutlope/hallmark)（MIT）里的 `sloplint`。跑的是**源码静态模式**
（`node sloplint.mjs src --json`，render=off），目标是我们自己的页面源码，不是线上 HTML——线上是编译后的
Tailwind 产物，规则会在生成代码上全线误报。

## 全站读数

63 个文件，**276 FAIL / 34 WARN / 17 REFLEX**（REFLEX 是可豁免的「模型默认习惯」，WARN 是工艺提醒）。

| 次数 | 级别 | 规则 | 是什么 | 例子 |
|---:|---|---|---|---|
| 138 | FAIL | 67 | 大写 + 字距的小标签 | `.text-xs.uppercase.tracking-[0.1em]`（几乎每页都有） |
| 67 | FAIL | 54 | 标题前的小字眉标（eyebrow） | `<p>FAQ</p>` 在 `<h2>` 之前 |
| 21 | FAIL | 63 | 中点拼接的元信息串 | `NVIDIA — NBA 2K27 / DLSS 5 (2026-09-03) · …` |
| 16 | FAIL | 19 | 正文里的破折号 | 「—」（我们的既有文案风格） |
| 13 | REFLEX | 64 | 小字号上用等宽字体 | `font-mono` on `SUCCESS` @12px |
| 13 | WARN | 74 | Tailwind 默认调色板 | `text-zinc-300` 等 5 个以上默认色 |
| 12 | FAIL | 30a | emoji 当图标 | 语言切换里的 🇺🇸 |
| 10 | FAIL | 10a | `transition-all` | 导航链接的 hover |
| 8 | FAIL | 48 | class 里的颜色字面量 | `bg-[#0e0e0e]/90` |
| 6 | WARN | 28a | 首屏图片懒加载（大概率 LCP） | 文章首图 |
| 6 | WARN | 58 | hero 段落过长 | 26 词 |
| 3 | REFLEX | 7b | 纯黑/纯白 | `--color-surface-lowest: #000` |
| 其余 | — | 29/42/46a/49/F24/7a/11/20/27/34 | 玻璃拟态、默认页脚结构、待核实的倍数、长按钮不换行、边框+阴影并用、纯黑 `::selection`、`motion-reduce`、`overflow-x` | 各 1–3 处 |

命中最多的是同一件事：**大写小字标签 + 眉标**，占全部 FAIL 的 74%（205/276）。它就是「AI 模板感」最明显的指纹。

## 已修（本次，`src/index.css`）

只改全局样式表，不动任何文案与结构，所以保护名单页的文字指纹不受影响：

- `:focus-visible` 全局 2px 主色描边、无过渡（规则的 26a：此前全站没有键盘焦点样式）。
- `prefers-reduced-motion: reduce` 全局兜底（27）。
- `html, body { overflow-x: clip }`（34；不用 `hidden`，避免把文档变成滚动容器）。
- `::selection` 的纯 `#000` 换成 `--color-background`（7a）。
- `.glow-border` 的两个颜色字面量（`#131313`、`#76B900`）改用 `--color-surface-low` / `--color-nvidia-green`（48）。

复扫同一文件：**6 FAIL → 1 FAIL**（剩下那条是 Hallmark 自己的 CSS 戳，不适用），REFLEX 4 条均为调色板取舍。
本地构建后：`/` 与 `/download` 在 1280×800 下 `scrollWidth == clientWidth`（无横向溢出）、首屏 H1 在视口内、
旗舰页闸门除 canonical/sitemap（本地跑必失败）外全绿。

## 第二批：低风险、可机械改（2026-10-27 已实施）

| 项 | 处数 | 怎么改 | 状态 |
|---|---:|---|---|
| `transition-all` | 10 | 换成具体属性（`transition-colors` 等），别让浏览器为每个属性建图层 | ✅ 10/10 已换，复扫 0 命中 |
| class 里的颜色字面量 | 8 | `bg-[#0e0e0e]/90` → `bg-background/90` 之类的 token | ⏸ 只做 `.glow-border` 两处，`Navbar` 的 `bg-[#0e0e0e]/90` 留待设计系统整理 |
| emoji 当图标（国旗） | 12 | 语言切换改文字或单色图标 | ✅ 9 个国旗已删（`LANGUAGES` 项里不再有 `flag`），剩 4 处不在语言切换里 |
| 首屏图片改回 eager | 6 | 首图别 lazy，直接抬 LCP | ⚠️ 只改 `/download` 首屏展示图；另 6 处按实测仍要留 lazy（见下） |

### 取舍：LCP 实测否决了 28a

规则 28a 假设「首屏图片 lazy 会拖 LCP」。实测四个页面的 LCP 元素：

| 路由 | LCP 元素 | 时间 |
|---|---|---:|
| `/` | H1 | — |
| `/download` | H1 | — |
| `/visual-enhancer` | H1 | — |
| `/zh/download` | `/studio/studio-overview.jpg` | 2464ms |

只有 `/zh/download` 的 LCP 真是图片，而且起因是 `loading="lazy"`。改 eager 后同一台机器复测 **692ms**。其余页面的 LCP 是文字，把文章首图改 eager 只会抢带宽、拖慢 H1 的字体，所以不动。

### 取舍：眉标与大写小标签只做一页，不铺全站

眉标判读要逐条看：`/download` 的 8 条里 7 条只是把标题再说一遍（「先说说」「功能」「界面截图」「系统要求」「FAQ」），1 条是真正的免责声明（「独立第三方项目 — 与 NVIDIA 无隶属关系」）。删掉前 7 条、留下那 1 条。它们是纯视觉噪音，占版式空间却零信息，删完各节间距统一为 64px、标题直贴节顶。

全站另外 100 多处同样的标签先不动：`/download` 是 GSC 第 2（310 点击）的页，值得一页一页试；其余页面的样板标签属于版式取舍，等这一页观察 14 天再决定。

### 复扫同一棵 `src`（63 文件）

| | 改前 | 改后 |
|---|---:|---:|
| FAIL | 276 | **225** |
| WARN | 34 | 34 |
| REFLEX | 17 | 17 |

按规则看少了什么：大写小标签 138 → 119、眉标 67 → 58、`transition-all` 10 → 0、国旗 emoji 12 → 4、颜色字面量 8 → 5。合计 −51（可点名的 49 条，另 2 条散在只命中 1–3 次的边角规则里）。

剩下的 225 条 FAIL 不是「还有 225 个 bug」，而是分三类：

| 类别 | 条数 | 处置 |
|---|---:|---|
| 破折号（19） | 16 | **豁免**：中文文案的既有节奏，规则默认英文标点 |
| 中点拼接的元信息串（63） | 21 | **豁免**：`NVIDIA — NBA 2K27 / DLSS 5（2026-09-03）· 核对日期` 是我们的引用格式，改了就丢可追溯性 |
| 大写标签与眉标（67 / 54） | 177 | **暂缓**：版式取舍，`/download` 先观察 14 天 |
| 颜色字面量 / 国旗 emoji 残部 / 其他边角（48 / 30a / 20 / 34） | 11 | 留到设计系统整理那一批（`About.tsx` 剩 4 处是表格里的 ✅，带语义，本次没动） |

## 需要拍板（改动可见，会动保护名单页的版式）

1. **眉标与大写小标签（205 处）**：这是「去模板味」收益最大的一刀，但等于重排每页的标题区。已按此建议
   把 `/download`（含 `/zh/download`）做成第一份试点并上线，`/visual-enhancer` 与其余页面等这页观察 14 天。
2. **正文破折号（16 处）**：规则要求去掉「——」，与我们既有的中文文案节奏冲突。我倾向保留，把它记成豁免。
3. **默认调色板（13 处）**：把 `zinc-*` 换进 `@theme` 的自有 token，属于设计系统级整理。
4. **纯黑/纯白（3 处）**：会改变整站底色观感，不建议为过闸门而动。

## 没扫到的角落：`scripts/prerender-seo.ts`

sloplint 跑的是 `src`，但爬虫真正拿到的那份 HTML 由 `scripts/prerender-seo.ts` 生成，它自己写了一套版式，也有一个眉标：

```
<p class="text-primary uppercase tracking-widest text-xs">{eyebrow}</p>
```

`/download`、`/models`、`/about`、`/pricing`、`/enterprise`、`/login`、`/register` 等公开指南页都是这个模板。中文在这个 `tracking-widest` 下一样会被撑开，只是它出现在首屏渲染到 React 接管之间那几百毫秒，以及爬虫读到的那份文本里。改它等于同时改 8 个保护名单页的首屏版式，所以本轮不动，记在这里等下一批。

## 不适用

- 规则 20（Hallmark 自己的 CSS 戳注释）：只在用 Hallmark 生成页面时才有意义。
- 规则 46a（不得出现未核实的倍数）：我们的内容闸门第 16 条已经在管，且更强。
