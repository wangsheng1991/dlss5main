# /download：按真实查询补充使用说明（2026-10-23）

代码提交：`e51931a`。线上路由：`https://www.dlss5nvidia.com/download`、`https://www.dlss5nvidia.com/zh/download`。

## 依据与改动范围

本轮GSC界面：下载页28天900点击/1.11万展示（界面约数），7天543点击/5,982展示。按展示量排序的可见查询包括 `dlss 5 apk`、`dlss 5 download android`、`dlss 5 mobile download`、`dlss 5 android download`、`dlss 5 studio`。这只是查询Top50/30的可见部分，不能当成页面全量来源。

推断：这些查询需要区分“应用安装包”“浏览器操作”“审阅资料ZIP”“Windows工具申请”，因此本轮补清楚使用步骤，不增加同义页或把搜索需求写成下载/支持承诺。

## 改前 → 改后

| 位置 | 改前（保留） | 本次新增 |
|---|---|---|
| 安卓/APK | 已有首屏提示、下载目录、设备表和APK说明 | 四行边界表：本站不提供APK；浏览器示例是独立图像流程；ZIP是配方/清单/命令而非安装器；Windows Studio仍需登录申请。保留ZIP真实入口。 |
| 手机浏览器 | 已有首屏浏览器按钮、示例及工作区 | 四步：打开角色风格或单独增强示例 → 等实际结果/错误提示 → 对比人脸、手部、文字和材质后下载 → 自有图片登录后提交，阅读文件/积分/输出限制。 |
| Windows申请 | 已有账户门槛、申请表与邮件流程 | 三步：注册/登录后返回本页 → 填Windows版本、RTX型号、图片/视频用途 → 提交一次并读真实回执；错误或投递未确认时按原表单提示处理。 |

导航锚点：`#android-apk-boundary`、`#mobile-browser-steps`、`#studio-application-steps`。新增模块位于原有下载目录之后，不改变任何原有模块之间的顺序；原申请区 `#request` 保留。

新增英文边界原句：

> Searching for “DLSS 5 APK”, “DLSS 5 mobile download” or “DLSS 5 download Android” can mean different jobs. Here you can try a browser workflow or download our review materials; neither installs DLSS in a game. DLSS5 Studio has its own Windows request path. This is an independent site, not affiliated with NVIDIA.

对应中文：

> 搜索“DLSS 5 APK”“DLSS 5 mobile download”或“DLSS 5 download Android”可能是在找不同的东西。本站提供浏览器工作流和可下载审阅材料，两者都不会为游戏安装 DLSS；DLSS5 Studio 则走独立的 Windows 申请路径。本站为独立项目，与 NVIDIA 无关联。

申请边界原句：

> A received request is not a public installer or an immediate software download. If the form reports an error or unconfirmed delivery, use the guidance it shows. Follow the email reply for availability and compatibility; this guide adds no delivery date, price or support promise.

> 申请被接收不等于拿到公开安装包，也不等于立即下载软件。表单提示错误或邮件投递未确认时，按它的说明处理。可用性和兼容性以邮件回复为准；本指南不新增交付日期、价格或支持承诺。

## 实际文件

- `src/components/DownloadUsageGuide.tsx`：无状态共享组件，中英三节、边界表与实际入口。
- `src/pages/Download.tsx`：仅增加导入和一处组件，不删除既有内容。
- `scripts/prerender-seo.ts`：同一组件序列化到中英静态HTML，非仅客户端可见。
- 新增本记录；没有改首页、其他文章、sitemap、申请API、鉴权、价格、GPU结论或GA4事件。

## 验收

- 独立工作区基于已提交主线构建；不提交工作区里原有的其它修改。原本未提交的首屏按钮/文案后来由主线程提交，本次rebase在其最新主线上，原样保留。
- `npm run lint`：通过。
- `npm test`：`109/109 passed`。
- `npm run build`：通过；`ARTICLE-MARKDOWN: PASS — 32 pages, 16 assetBase articles, no raw table separators or image Markdown`。
- 两站无来源声明检查：`判定: PASS — 没有无来源的数字/引语/技术名`（本次隔离工作区与dlss5app，各0命中）。
- 本地前后对照：`DOWNLOAD-CONTENT-LOCAL: pages=2 oldText=2/2 head=UNCHANGED guide=2/2 anchors=PASS JSON-LD=PASS verdict=PASS`。移除新增模块后逐字对比原有归一化文本完全一致；SEO metadata（含title/description/canonical/hreflang/robots）不变；构建生成的CSS/JS哈希正常改变，不算SEO文案变更。
- 本地可见文本字符：英文10618→13825，中文4564→5732；该指标只证明加法体量，不作为质量或SEO增长承诺。

线上验收（2026-10-23）：

- Vercel 提交状态 `Deployment has completed`，状态 `success`。
- 两路由匿名抓取与构建产物比对：`DOWNLOAD-CONTENT-ONLINE: pages=2 oldText=2/2 head=UNCHANGED guide=2/2 anchors=PASS JSON-LD=PASS verdict=PASS`。
- 线上旗舰页检查：`FLAGSHIP-PAGES: fails=0 verdict=PASS`。
- 内置浏览器重载英文下载页，确认三节新增内容可见，并点击 `Use a phone browser` 成功定位到四步说明；截图 `download-mobile-guide.png`。这是桌面浏览器验收，不宣称完成手机真机测试；未提交申请、未新注册账户。
- 独立发现：原有 `/visual-enhancer` 缓存示例输入1210×871、输出1024×1024，滑块两图均为 `object-contain`。输出正方形决定容器后，输入上下出现黑边，且两图构图不同，不能直接作为像素对齐擦除案例。本轮未改该页面或示例。

原始证据目录：`/Users/wangsheng/code/shou/artifacts/download-content-20261023/`（改前/改后HTML、验证输出、真实操作记录、截图）。逐页变更记入 `additive-20261012/CHANGE-LOG.md`。Google是否采纳新内容、点击是否增长需后续GSC复读，本次不宣称已增长、不追加索引请求。
