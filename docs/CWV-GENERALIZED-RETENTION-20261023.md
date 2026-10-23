# 2026-10-23：prerender retention 通用化

服务 R1、R5：保留既有主线/产品内容及冻结字段，用真实页面内容解决加载布局偏移，不删内容或增加虚假高度。

## 改动与范围

`scripts/prerender-seo.ts` 的统一产物写出函数为 `#root` 写入 `data-prerendered="实际路径"`；首页静态产物也由同一函数标记。`src/main.tsx` 读取该产物标记并核对当前路径，移除五条 retention 路径白名单。保持原有真实 HTML fallback 和真实路由提交后释放占位的机制；未预渲染的地址不会误用首页标记。现有五页的 modulepreload 配置未变，它不是 retention 启用名单。

本次构建检查：97 份含应用 root 的 HTML 均带有正确路径标记。103 份 HTML 的可见文本（含 title/H1）、canonical、hreflang、robots 与修改前逐项相同。没有改页面文案、布局高度或隐藏内容。

改代码前已在外部工作区 `additive-20261012/CHANGE-LOG.md` 追加“2026-10-23：prerender retention 通用化（用户授权）”。正文比较通过后 `--capture`；重拍基线与旧基线字节相同。

## pricing 原因

线上改前两次 CLS 为 0.2661315201、0.2595402022。两次均观察到 Loading 被 Pricing 主体替换时，footer 从 y=280 移到 y=720，单次偏移 0.2104938272。随后 `/api/billing/plans` 返回，套餐卡片出现，footer 从 y=720 移到 y=794，另有约 0.048–0.055 的偏移。

推断：用户指出的 0.21 与其他路由是同一个 Suspense 短占位问题；套餐 API 是另一个较小来源。通用 retention 后本地最终构建 pricing CLS 为 0.0482925926，达到 0.1 验收线，无需更改套餐区。

[原始布局、偏移与 API 时间证据](cwv-generalized-20261023/pricing-diagnosis.json)。

## 验证方法

[同一测量脚本](cwv-generalized-20261023/measure.mjs)：系统 Chrome，1440×900，en-US，20 页顺序测试，每页新建浏览器上下文，load 后继续观察 10 秒。CLS 使用排除近期输入的最大 session window；MutationObserver 与逐帧采样监测整个加载期间 h1/main 数量以及真实 fallback 是否出现。任何重复正文节点立即判失败并停止后续页面。记录 footer/main 的位置、资源请求时间以及最终 DOM。未人为限速。

本地构建的 billing/plans 请求转发到真实线上只读 API，避免用静态服务器的 404 误判 pricing。线上测试直接读取真实线上 API。10 个指定页加 10 个 sitemap 内额外页面，覆盖中文首页/中文路由、三个工具页、models、about、before-after 和 game-character-style。

最终本地结果见 [20 页 JSON](cwv-generalized-20261023/local-final-summary.json)。提交部署后，同一脚本将输出 `/tmp/cwv-generalized-20261023/online.json`，线上数值以该实测文件为准，不把本地值当线上结果。

## 闸门

```text
FLAGSHIP-PAGES: fails=0 verdict=PASS
判定: PASS — 没有无来源的数字/引语/技术名
PROTECTION: changed=0 down=0 verdict=FROZEN-OK
npx tsc --noEmit && npm run build: exit 0
```

静态检查针对本地最终构建，通过已有 local-fetch 适配器运行保护闸门；捕获基线仍保留线上 canonical，并复现既有 Cloudflare email 替换。没有混入其他未提交任务改动。
