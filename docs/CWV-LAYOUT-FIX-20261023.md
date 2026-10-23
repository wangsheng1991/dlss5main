# 2026-10-23：指定内页首次懒加载的 CLS 修复

服务 R1 / R4 / R5：让已有主线/产品信息在加载过程中保持可读，不减少真实内容、不制造效果数据。

## 范围修正与直接证据

上一轮只测了七个内页，不能据此推断全站有问题。首页直接加载，此次独立测得 CLS=0；本轮只处理 /download、/visual-enhancer 与三篇英文 /blog/core-* 文章，首页不改。

初次定位同条件：1440×900、en-US、系统 Chrome/Playwright、独立匿名 context、load 后观察 10 秒、不滚动、不点击。PerformanceObserver 采集 navigation/LCP/layout-shift，MutationObserver 采集新增/删除节点，requestAnimationFrame 记录 getBoundingClientRect，Resource Timing 记录请求到达。时间相对导航起点，并不固定在 4.5 秒，取决于本次 chunk 到达时间。

- /download：2377.1ms 删除 prerender main、添加 React shell；Loading fallback 把 footer 放在 y=280。Download chunk responseEnd=3804.5ms，3825ms 删除 Loading、添加完整 main；3905.3ms 偏移 0.720259（包含导航小偏移），实际 footer y=11262.234375。随后鉴权状态造成约 0.002469 的小偏移，不能解释主要跳变。
- /blog/core-two-reference-room-workflow：2835.4ms main 消失且 footer y=280；Blog chunk responseEnd=3366ms，3403.8ms footer 产生 0.688889 偏移。出现的是整篇文章，不是额外的示例结果。
- /visual-enhancer：2887.4ms main 消失且 footer y=280；完整路由依赖完成后，3503.3ms footer 产生 0.688889 偏移，footer 实际 y=4375.5。没有发起模型任务或样例 API 请求。

以上原始 DOM/rect/chunk 记录在 [diagnosis.json](cwv-layout-20261023/diagnosis.json)。其中初次诊断的通用 footer rect 选择器可能命中文章内 footer，因此文章的关键位置须以 layout-shift sources 内的全局 footer previous/current/observedRect 为准；正式前后测量脚本已明确选择 footer.bg-surface-lowest。

## 排除与回归

- 将旧版三页 Firebase JS 请求阻断，同时把对应路由 chunk 延迟 3 秒：完整正文仍挂载，且三页均出现 0.688889 的大偏移。排除 Firebase 鉴权条件块是主要原因。
- 语言使用 en-US，英文基础包就绪后 Loading fallback 仍持续到路由 chunk 到达；不存在晚到的中文语言包触发本次大块出现。
- 无样例运行 API 请求；新增节点是路由 main，而非运行结果块。示例模块只是路由依赖，不是业务操作后新增内容。
- 修复版保留同一 3 秒路由延迟：断言已有真实正文可见、长度大于 500 字符、全局 footer 在首屏下方、没有 Loading 文本；路由完成后占位释放且 main 恢复唯一。三页总偏移分别约 0.000075、0.000032、0.027352，均无页面 JS 错误。[回归记录](cwv-layout-20261023/regression.json)。

## 最小修改

- src/main.tsx：仅对上述五个内页，在 React 接管前读取该页已有 prerender HTML。首页和其它路由保持原行为。
- src/App.tsx：首次 Suspense fallback 使用该页真实内容，成功挂载后通过边界内的 layout effect 释放。后续站内导航仍用原路由机制。无固定高度、无新骨架、无隐藏/删除内容，不改鉴权模型。
- scripts/prerender-seo.ts：两轮上线 LCP 复核没有全部达到不退步，因此只给同五页添加当前路由 chunk 及其静态 import 依赖的 modulepreload（不遍历动态 import）。chunk 文件名读取本次构建 assets；没有改首页资源提示，没有预加载其它页面模块。
- 没有修改页面组件、文案、图片、冻结 head 字段或首屏布局尺寸。构建前后排除脚本及带构建 hash 的资源标签后，全站 HTML 内容完全相同。

## 验收

- FLAGSHIP-PAGES: fails=0 verdict=PASS
- 判定: PASS — 没有无来源的数字/引语/技术名
- PROTECTION: changed=0 down=0 verdict=FROZEN-OK
- npx tsc --noEmit 与 npm run build：exit 0。
- 已先在外部 additive-20261012/CHANGE-LOG.md 登记，文本无变化后执行 --capture，21 页基线与捕获前逐字节相同，复跑 FROZEN-OK。

## 正式线上前后测量

初次定位与本地候选测试曾同时运行，因此不拿那批数字作为最终前后性能对比。正式 baseline 和 after 独立串行运行同一脚本、相同六页顺序、每页两次、新匿名 context、无人工网络/CPU 节流；每指标取两次较好值并保留全部原始值。LCP/CLS 是桌面实验室值，不是 CrUX 分位数。

脚本：[measure.mjs](cwv-layout-20261023/measure.mjs)，SHA-256 b181a8db1ae9655bf4f4f174de45e897409b8a716182aa2cdac7372b70242c69。运行 `node docs/cwv-layout-20261023/measure.mjs baseline` 或 `after`；当前机器 Playwright/Chrome 路径写在脚本内，输出到 `/tmp/cwv-layout-fix-20261023/`。部署前 baseline.json、部署后 after.json 与对应 .log 保留完整 observer 和网络记录；最终对比随部署后复测生成，不将本地数字冒充线上结果。

## 首次上线的两轮性能复核

51e1d5a 上线后，两轮共 24 次测量的 CLS 均达标；LCP 较好值未全部达到不退步，所以没有宣称整轮验收通过。保留两轮所有指标：[first-deployment.json](cwv-layout-20261023/first-deployment.json)。随后补当前路由 modulepreload，以消除观测到的入口 JS → 懒加载路由串行请求；重新构建、过闸门后再次部署与同脚本测量。

补充定位：仅预加载 Download 入口仍未消除其静态依赖瀑布。480a7a8 的线上第二次 /download 测量中，路由入口 responseEnd=2790.4ms，但 external-link 静态依赖到 2835.8ms 才开始，5002ms 结束，耗时 2166.2ms；LCP=5136ms。因此将预加载补全至构建文件实际静态依赖闭包。不是通过隐藏内容压低指标。
