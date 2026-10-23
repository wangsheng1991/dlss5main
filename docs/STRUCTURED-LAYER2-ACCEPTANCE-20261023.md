R1/R2/R3/R5：中文对比按来源作答，工具页明确入口线定位，产品主线仍为风格转换与 Studio。

# 结构化第二层验收 · 2026-10-23

## 范围

A：/zh/vs/dlss-5-vs-dlss-4-5、/zh/vs/dlss-5-vs-fsr-4 各加三条中文 PAA 对应问答，保留英文原问便于核对；中文按功能、游戏、GPU 范围独立成句，不给性能百分比，未核实处明示。/zh/visual-enhancer 增加与英文一一对应的五条边界问答：尺寸与因子、非逐像素超分、同 task id 查询恢复、RTX、安卓缓存示例。均提供 FAQPage/Question/Answer、dateModified 和可见“最后核对：2026-10-23”。保留原可见 FAQ，结构化合并为单一 FAQPage。canonical/hreflang/title/H1/robots 不变。

B：/image-quality-enhancer、/image-upscaler、/unblur-image 首段后仅增加入口定位块、主线链接与 Last checked: 2026-10-23。FAQPage 复用各页原可见问答，追加与新增定位块一致的问题；dateModified 同日。原正文任何段落及 title/H1/canonical/robots/hreflang/description 不变。静态与 React 共用 ToolEvidence。

C：不添加 VideoObject。仓库两段真实视频分别为独立游戏角色风格转换与厨房图片放大参考，并非 DLSS 5 对 DLSS 4.5/FSR 4 的游戏技术对比。已查看视频中间帧，ffprobe 两者均输出 6.000000；beforeAfter.ts 既有记录为 PT6S、2026-10-11。没有把这段独立演示标成厂商技术比较，也没有新增视频日期/时长声称。截图 /tmp/roi-layer2-20261023/game.jpg、upscale.jpg。

D：只改英文两个 /vs 和 /visual-enhancer 的 description，加入 supported GPUs / RTX 50 series / Do I use FSR or DLSS? / longest edge 1536 / target factors 2/4 等真实用词。title/H1 不变。/vs 既有描述段与 meta 共用 description 字段，同步显示；不改其他原段落。

## 验收

- `FLAGSHIP-PAGES: fails=0 verdict=PASS`
- `判定: PASS — 没有无来源的数字/引语/技术名`
- `PROTECTION: changed=0 down=0 verdict=FROZEN-OK`
- `npx tsc --noEmit` exit=0；`npm run build` exit=0。
- 六页静态 HTML 和加载 JS 后 DOM 均有且仅有一个 FAQPage；dateModified 正确，可见日期正确，手机390px无横向溢出。中文对比页选择器链接存在。
- 四条 NVIDIA/AMD 来源本轮 curl 均200；复用原已核实英文口径。sources.json 保存状态。
- 全站 HTML 排除构建资源哈希后，只九条获准路由有变化。三条保护工具页移除声明新增块后，原正文逐字一致；冻结 head 字段与 description 逐项一致。
- 首次范围检查发现共享静态模板给非目标工具多输出空行；已收紧为仅三条目标插入，最终其他 HTML 完全一致。未改任何非目标页面的可见正文或 SEO 字段。
- 旧保护基线对比只有三条获准工具页 words/bodyHash 变化（changed=3 down=0），无额外差异。实施前已写外部 additive-20261012/CHANGE-LOG.md；旧基线备份到 /tmp/roi-layer2-20261023/protection-before.json，确认范围后才 capture，复跑 FROZEN-OK。

原始日志、截图、范围检查脚本：/tmp/roi-layer2-20261023/。部署后 curl 原文在 online/，IndexNow dry-run 与提交结果在 indexnow-*.log。IndexNow 不通知 Google，也不保证收录与排名。
