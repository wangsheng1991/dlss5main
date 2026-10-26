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

## 下一批：低风险、可机械改（未做）

| 项 | 处数 | 怎么改 |
|---|---:|---|
| `transition-all` | 10 | 换成具体属性（`transition-colors` 等），别让浏览器为每个属性建图层 |
| class 里的颜色字面量 | 8 | `bg-[#0e0e0e]/90` → `bg-background/90` 之类的 token |
| emoji 当图标（国旗） | 12 | 语言切换改文字或单色图标 |
| 首屏图片改回 eager | 6 | 首图别 lazy，直接抬 LCP |

## 需要拍板（改动可见，会动保护名单页的版式）

1. **眉标与大写小标签（205 处）**：这是「去模板味」收益最大的一刀，但等于重排每页的标题区。建议先挑
   `/download` + `/visual-enhancer` 两页做试点，看转化与前后的实际观感再决定全站。
2. **正文破折号（16 处）**：规则要求去掉「——」，与我们既有的中文文案节奏冲突。我倾向保留，把它记成豁免。
3. **默认调色板（13 处）**：把 `zinc-*` 换进 `@theme` 的自有 token，属于设计系统级整理。
4. **纯黑/纯白（3 处）**：会改变整站底色观感，不建议为过闸门而动。

## 不适用

- 规则 20（Hallmark 自己的 CSS 戳注释）：只在用 Hallmark 生成页面时才有意义。
- 规则 46a（不得出现未核实的倍数）：我们的内容闸门第 16 条已经在管，且更强。
