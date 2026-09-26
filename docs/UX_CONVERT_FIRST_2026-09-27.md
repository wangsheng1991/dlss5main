# 工作室与首页的主次：DLSS 5 convert 必须第一眼看到

本文件是产品负责人的明确要求，2026-09-27 记录。功能可以继续变多，但**主次必须分清**：访客进入首页和工作室，第一眼要看到的是 **DLSS 5 convert（风格转换）**，不是一排并列的工具。

## 现状（改前）

- `src/pages/Dashboard.tsx:60`：`MODES = ['enhance','edit','cutout','vectorize','erase','tryon','interior','retouch','makeup']`，在 `:474` 渲染成一排**完全同权重**的 chip：增强与放大 / 提示词编辑 / 移除背景 / 图片转 SVG / 擦除对象 / 虚拟试衣 / 房间渲染 / 人像修饰 / 虚拟化妆。
- 旗舰工作流（DLSS 5 风格转换）不在这排里：只有从 `/game-character-style`、`&sample=characterStyle` 进来时才换成一个孤立按钮，名字是 `modeCharacterStyle` =「人物风格转换」/「Character style」。
- 首页 `src/pages/Home.tsx` 首屏：12 栏栅格里左边 7 栏是"打开图片工作室"入口卡，右边 5 栏是一张前后对比 slider，两者等重；往下还有三个同为 `mt-32`、`text-4xl` 的大区块（前后案例 / 预期案例展示 20 组 / 游戏人物风格生成），彼此没有主次。
- 结果：`62c3619` 之后，主打工作流的名字里没有 convert，全站只剩积分行 `convertStyle = 开始风格转换 · 1 积分` 还带这个词，与首页 title、"dlss 5 convert"关键词脱节。

## 要求

1. **工作室（`/dashboard`）以 convert 为主路径。** 页面顶部是唯一的 DLSS 5 风格转换主面板：上传 → 选择风格/方向 → 转换 → 前后对比 → 下载，入口和 CTA 只有一个中心。其余 9 个工具保留、功能不删不减，但降为下面一行/一段次级"更多工具"（更小的 chip、同一分组里列出），视觉权重明显低于主面板。
2. **把 convert 关键词加回主路径的命名。** 模式名与主面板标题至少中英双写含 convert：如「DLSS 5 convert · 人物风格转换」/「DLSS 5 convert · Character style」，与首页 `home.title`、"dlss 5 convert" 的 SEO 关键词一致；积分行保持「风格转换 · 1 积分」。其它语言保持同样的结构，缺翻译时回退英文，不要只改 zh/en 导致键结构不一致。
3. **首页的案例与对比降为 convert 的预期产出。** 首屏主位是 convert 入口（上传→转换→对比结果），三块 `text-4xl` 大画廊（前后案例 / 20 组前后对比 / 游戏人物风格生成）收拢成主路径下一节"转换会得到什么"的预期示例：标题层级降到 `text-2xl`/`text-3xl`、区块间距收紧、保留可对比与提示词，但不再与主入口争夺第一眼。案例图继续标注为原创视觉参考、非 NVIDIA 官方截图。

## 边界（不要做）

- 不要删减或合并任何现有工具、落地页、API 契约、sitemap 条目；这次只改**层级与命名**，不改能力范围。
- 不要为了层级而把案例图换成没有对比线的静态图，也不要去掉每页既有 title/description/canonical/JSON-LD。
- 不要提交 `dist/`、`node_modules/` 或任何密钥；未跟踪的素材目录不要带进提交。

## 验收

- `npm run build`、`npm run lint`、`npm run type-check`（按仓库现有脚本名）通过；已有的 72 个测试保持全绿。
- 打开 `/dashboard`（默认进入）第一屏即能看到 DLSS 5 convert 主面板与其上传入口，9 个次级工具在主面板之后；从 `/game-character-style` 进来时，主面板与 `?sample=characterStyle` 示例直接可用。
- 首页首屏第一眼是 convert 入口，三个画廊标题层级低于它。
- 中文与英文界面的模式名/主面板标题都含 convert；`/` 的 title/description/keywords 仍包含 `dlss 5 convert`。
- 在生产部署后，用真实页面 head 与首屏结构复核一次，把结果写进本文件或当日简报。

## 本轮实现（2026-09-27）

- `/dashboard` 无参数时默认进入 `game-character-style`，顶部主面板文案为 `DLSS 5 convert · Character style` / `DLSS 5 convert · 人物风格转换`；主流程保持上传、选择方向、转换、对比和下载。
- 九个原有工具仍由 `MODES` 保留，风格主面板下方以低权重的“More tools / 更多工具”链接呈现，点击进入原有工具模式，未修改 API、积分或路由契约。
- 首页首屏默认展示原创游戏人物转换对比；三个画廊收拢到“转换会得到什么 / What the conversion produces”，标题降为 `text-2xl`/`text-3xl` 并收紧间距。
- 首页补充 NVIDIA 官方 3D-Guided Neural Rendering 文章的事实摘要和外链。本站案例仍是原创参考，并在文案中明确“非官方 DLSS 运行时”。
- 本地证据：`npm run lint`（`tsc --noEmit`）通过；`npm test` 72/72；`npm run build` 通过。生产部署后的真实页面复核待推送后补写。

## 生产复核（2026-09-27）

- Vercel Production：commit `8fb2c95`，deployment `dlss5-main-5xg8obqie`，状态 `READY`。
- `https://www.dlss5nvidia.com/`：页面 title 为 `DLSS 5 Style Converter Online — Free AI Visual Generation`；运行后的 `h1`、`#dlss5-reference-heading` 和 `#conversion-outputs-heading` 分别出现转换生成主定位、官方参考区和“转换会得到什么”；head 中 `dlss 5 convert`、`dlss 5 effect converter`、`3d guided neural rendering` 均已生效，页面存在可拖动对比 slider。
- `https://www.dlss5nvidia.com/dashboard`（英文会话）：运行后的 title/h1 为 `DLSS 5 convert · Character style`；主面板步骤为上传、选择方向、对比下载；下方检测到 9 个原有工具入口（Enhance & upscale、Prompt edit、Remove background、Image to SVG、Erase object、Virtual try-on、Room render、Portrait retouch、Virtual makeup）。
- 中文会话真实复核：title/h1 为 `DLSS 5 convert · 人物风格转换`，九个入口与“更多工具”均显示中文。静态壳仍保留 `AI Image Studio` 的 no-JS 标题，这是 dashboard 的 noindex fallback；客户端水合后已替换为 convert 标题。
