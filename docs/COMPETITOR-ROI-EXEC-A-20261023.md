# 执行工单：方案 A —— 对比文章内的「该看哪个功能」选择器（2026-10-23）

依据：`docs/COMPETITOR-ROI-20261023.md` 第 5 节「方案 A」，王胜已放行「主动推进」，不需要再等点选。
**只做方案 A。方案 B 与其它动作一律不做。**

## 1 做什么

在**现有**文章 `/blog/dlss5-vs-dlss4-vs-fsr4-comparison-2026`（源文件在 `src/content/articles/types.ts`，中文版同一篇的 `content_cn`）正文里，加一个**不需要登录、不需要上传、不调用任何模型**的「该看哪个功能」选择器。

输入（第一版只要这三项）：
1. 你的目标：想提帧 / 想改善重建与抗锯齿 / 想改善光照与材质
2. 你的 GPU 系列：RTX 50 / RTX 40 / RTX 30 / 更早 / 不确定
3. 你要玩的游戏是否在**我们已核对的 DLSS 5 支持名单**里：是 / 否 / 不确定

输出：
- 与选择相关的功能名（DLSS 5 的光照与材质 / DLSS 4 的超分·光线重建·帧生成 / FSR Upscaling 等）
- 每个功能的**支持状态**：支持 / 不支持 / **未知**（GPU 或游戏不在已核对范围时必须落到「未知」，不许猜）
- 去哪里确认这个开关（游戏内设置 / NVIDIA App / 显卡驱动版本）
- 每条结论后面带**来源链接 + 核对日期**（只用文章里已有的来源，不新增未核实的来源）

## 2 硬约束

- **不新建页面、不改 URL、不改 title/H1/canonical/robots/hreflang**（这是保护文章）。
- 不写任何 FPS/倍数/画质赢家；不写「官方效果」「NVIDIA 认证」。
- JS 失效时，页面必须仍能读到一张**静态对照表**（选择器只是增强，不能是唯一载体）。
- 中文版要有一致的中文选择器与静态表（同一篇的 `content_cn`），不能只做英文。
- 组件放正文靠前位置（第一屏到第二屏之间），不要做成弹窗拦截阅读。
- 键盘可操作、移动端可用（320px 宽度不横向溢出）。

## 3 验收（原文照抄到回报里）

1. `npm run lint`
2. `npm test`
3. `npm run build`
4. 本地/线上都能验证：`node <workspace>/tenx-20261011/check-flagship-pages.mjs --base <线上地址>`（文章页那条要 `OK`）
5. `node <workspace>/tenx-20261011/check-unsourced-claims.mjs`（两站 `0 命中`）
6. 保护名单：`node <workspace>/additive-20261012/check-protection-list.mjs`（先 `--capture` 备份旧基线，规则见上一轮的做法），必须 `changed=0 down=0 FROZEN-OK`
7. 在浏览器里实际点三组输入，确认三种「未知」状态都能出现；贴一张截图路径。

## 4 交付

- 单独一个 commit：`feat(seo): add sourced "which feature" picker to DLSS/FSR comparison`；推送 `main`。
- 在 `CHANGE-LOG.md` 追加一行（改了哪个页面、加了什么、commit sha、闸门结果）。
- 回报 ≤10 行：commit sha、闸门原文、三种「未知」状态的实测结论、以及你判断这个组件是否真的改善了「结论先行」（一句话，不要吹）。

如果做到一半发现必须改 title 或新建 URL 才能完成，**停下回报**，不要擅自越界。
