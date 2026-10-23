# ROI 做强与补短板验收 — 2026-10-23

服务规则：**R1（风格转换/Studio 主线）、R2（附带入口边界）、R3（落点分层）、R5（无依据不发布）**。

## 范围与定位

仅三条英文正本加块，不改中文页、首页、原正文或 URL/title/H1/canonical/robots/hreflang/description。

| 落点 | tier | 加块位置与内容 |
| --- | --- | --- |
| `/blog/dlss5-vs-dlss4-vs-fsr4-comparison-2026` | core-context | 正文开头补风格转换与 Studio 主线说明、Last checked；正文末补六条 SERP PAA 原问、条件化答案、官方来源/核对日、来源清单及 FAQPage/WebPage dateModified |
| `/visual-enhancer` | entry-point | 开篇明确“有限的图片质量入口”，指向风格转换与 Studio；静态边界块含 1536、目标因子 2/4、非逐像素超分、失败可见与同 task id 恢复、dateModified |
| `/download` | product | 首屏之后新增设备/系统判定表、三条 APK/浏览器 FAQ、FAQPage/WebPage dateModified；只整理本页已有能力与申请制 |

`src/components/RoiEvidence.tsx` 同时用于 React 页面与静态预渲染，避免只在 JS 加载后才有答案。新增内容数据见 `src/content/roiEvidence.ts`；增强器数值直接读取 `src/config/enhance.ts`。原有任务、登录、额度、缓存 sample1 均未改。

## 来源核对

四个新增引用已读取正文且实际 curl 返回 HTTP 200（2026-10-23）：

- https://www.nvidia.com/en-us/geforce/news/dlss-4-multi-frame-generation-out-now/
- https://www.nvidia.com/en-us/geforce/news/dlss-5-3d-guided-neural-rendering/
- https://www.nvidia.com/en-us/geforce/news/dlss-4-5-dynamic-multi-frame-gen-6x-2nd-gen-transformer-super-res/
- https://gpuopen.com/amd-fsr-upscaling/

AMD 消费者页与 NVIDIA Blog 的本机读取失败，新增引用改用返回 200 的 AMD GPUOpen 和 NVIDIA GeForce 官方页；没有把抓取失败冒充内容不存在。未重新调查竞品，也未评价被 403 阻断站点的内容质量。

六问保留 PAA 原问；没有同条件实测的性能提升、画质通用赢家、AMD 对等产品/未来发布日期、超出已核对范围的 GPU/游戏支持，写 `Unverified (未核实)` 或明确未验证。官方演示不冒充本站测量。

## 增强器行为与计时口径

本轮**不发布耗时数字、不跑三次推理**。页面仅展示既有流程和恢复路径：上一轮隔离的 signed-in 测试构建注入轮询 HTTP 403 后，用同一 task id 恢复，全程一次提交；下载失败可以刷新同一任务结果链接。记录 `/tmp/competitor-roi-b-20261023/stub-results.json` 与 `ACCEPTANCE.md`。页面明确这是测试构建的恢复检查，不是成功率保证；终态失败不承诺能靠再次查询恢复。

## 加法验收与闸门

实施前已写外部 `additive-20261012/CHANGE-LOG.md`，声明三页、位置、原因及禁止改动字段；旧保护基线保存在 `/tmp/competitor-roi-strength-20261023/protection-before.json`。

- 与实施前 HEAD 的独立构建逐页比较：只有三条声明页面有新增块；删除 `data-roi-block` 块后，原 HTML 正文与所有保护字段一致（构建资源哈希归一化）。
- 静态 FAQ 条数：对比 6、下载新增 3；每条 Question/Answer 与可见文字匹配，来源/核对日可见；三页新增 WebPage dateModified 均为 2026-10-23。
- 新增块 320px 无横向溢出；英文浏览器加载后加块、日期与 schema 仍存在。
- `npm run lint`：`tsc --noEmit`，exit=0；`npm test`：`109/109 passed`；`npm run build`：`✓ built in 4.21s`。
- 默认 flagship 清单及对比/增强器定向检查：`FLAGSHIP-PAGES: fails=0 verdict=PASS`。
- 两站无来源扫描：`0 个文件命中`；`判定: PASS — 没有无来源的数字/引语/技术名`。

推送前保护检查以 fetch adapter 指向本地待发布构建，保留生产 canonical 与 /en/blog 301。首页未改，但 Cloudflare 会把邮箱文本变成 `[email&#160;protected]`；adapter 仅复现已观察到的这项边缘转换，以免将它误报为首页改动。处理后旧基线仅下载页/对比页 words/bodyHash 变化；增强器不在既有 21 页名单中，另以三页全字段与原正文比较覆盖。不会把当前旧版线上 PASS 冒充新构建 PASS。

完整日志、来源 HTTP 记录、截图、加块差异报告：`/tmp/competitor-roi-strength-20261023/`。推送前已 --capture 更新待发布基线并复跑：`PROTECTION: changed=0 down=0 verdict=FROZEN-OK`。部署后 curl 原文与再次保护复核由同目录日志与外部 CHANGE-LOG 记录。

## 仍缺

未进行三个自有素材真实任务，因此不发布秒数范围。游戏同条件基准、AMD 与 DLSS 5 的对等性及未来路线图仍未核实；结构化答案不等于搜索排名收益，后续仍需观察实际搜索数据。
