# DLSS5NVIDIA Reddit / 飞书宣传包

这份文案按 90/10 比例写：先给出可检查的前后对比和限制，再透明说明项目链接。每次只发一个主题，避免同一天跨多个社区重复投放。

## 可上传的对比图

- [人像对比图](../../public/marketing/reddit/dlss5-portrait-before-after.png)
- [建筑效果图对比](../../public/marketing/reddit/dlss5-architecture-before-after.png)
- [产品图对比](../../public/marketing/reddit/dlss5-product-before-after.png)
- [三组对比图板（HTML）](../../public/marketing/reddit/dlss5-reddit-comparisons.html)

图板地址（上线后）：`https://www.dlss5nvidia.com/marketing/reddit/dlss5-reddit-comparisons.html`

## Reddit 版本 A：AI 图像增强 / Stable Diffusion 社区

**建议社区：** r/StableDiffusion、r/aiArt、r/ArtificialIntelligence（先看版规）

**标题**

I made a small before/after test for AI image enhancement — where does the reconstruction fail?

**正文**

I put together a browser-based comparison using three ordinary inputs: a soft portrait, an architecture render, and a compressed product photo.

The goal was not to claim “more pixels = recovered truth”. I wanted to see where an enhancement model helps and where it starts making plausible details up:

- portrait: check eyes, jawline and skin texture;
- architecture: check repeated windows, perspective and straight edges;
- product: check logos, labels and serial numbers.

The full comparison board is here: https://www.dlss5nvidia.com/marketing/reddit/dlss5-reddit-comparisons.html

It is an independent DLSS-style image enhancement demo, not an NVIDIA product. The example preview is free; processing your own image follows the account/credit workflow. I am sharing the failure modes because they are more useful than a single “looks sharper” screenshot. What artifacts would you add to this test?

**第一条评论（发帖后补充）**

Source images and the three checks are listed in the comparison board. If a detail matters (face identity, text, measurements), I would keep the source next to the enhanced file and inspect at 100%.

**链接（可选 UTM）**

`https://www.dlss5nvidia.com/use-cases/portrait-photo-enhancer?utm_source=reddit&utm_medium=community&utm_campaign=dlss5_comparison`

## Reddit 版本 B：老照片修复

**建议社区：** r/photorestore、r/OldPhotos（先按版规决定是否允许工具链接）

**标题**

A restoration comparison with a simple rule: keep the scan, and do not treat generated detail as historical evidence

**正文**

I tested a free preview workflow on a faded/compressed family-photo scan. The result is easier to view, but the model can still alter faces, handwriting, dates, uniforms and other details that matter in a family archive.

Before/after board: https://www.dlss5nvidia.com/marketing/reddit/dlss5-reddit-comparisons.html?case=portrait

My checklist is simple: compare every face, keep the original scan, and label the enhanced copy. This is a restoration aid for viewing and printing, not forensic recovery. The site is an independent project; I am posting the method and caveat first so people can tell me where it fails.

**第一条评论**

If you try it, please share the difficult cases: handwriting, small faces, uniforms, newspaper text and heavy scratches are more informative than an easy portrait.

## Reddit 版本 C：建筑 / 室内效果图

**建议社区：** r/architecture、r/archviz、r/InteriorDesign（只在允许作品展示的主题帖中使用）

**标题**

Can AI enhancement make an architecture render presentation-ready without bending the geometry?

**正文**

I made a focused before/after test for an architecture render. The useful question is not only whether the image looks sharper; it is whether the model keeps perspective, window repetition, railings and straight edges consistent.

Architecture comparison: https://www.dlss5nvidia.com/marketing/reddit/dlss5-reddit-comparisons.html?case=architecture

The preview is free and the workflow is independent/non-official. I would still use the original render for dimensions and client approvals. What geometric failure should be added to the checklist?

**第一条评论**

I am especially interested in repeated windows, thin railings and text on signage. Those areas expose reconstruction errors faster than a large wall or sky.

## Reddit 版本 D：产品摄影

**建议社区：** r/photography、r/RealEstatePhotography、r/ecommerce（先看自荐比例和外链规则）

**标题**

A product-photo enhancement test: sharper surfaces, but labels still need the original file

**正文**

Here is a small before/after test on a compressed product photo. The enhanced version is useful as a visual preview, but I would never trust reconstructed packaging copy, logos or serial numbers without checking the source.

Product comparison: https://www.dlss5nvidia.com/marketing/reddit/dlss5-reddit-comparisons.html?case=product

I am looking for critique of the failure cases, not claiming an official NVIDIA tool. The example preview is free and runs in the browser. Would you use this for a marketplace draft, a catalog placeholder, or neither?

## 飞书发布卡片（内部运营）

**主题：** DLSS 风格图像增强：三类真实案例对比

**正文：**

我们新增了一组可直接分享的前后对比：人像、建筑效果图、产品摄影。每组都附带检查清单：人像看身份与皮肤纹理，建筑看透视与直线，产品看 Logo、标签和序列号。免费示例用于快速预览；涉及自己的图片时按账号/积分流程处理。请保留原图，不把 AI 重建细节当成事实。

**链接：** https://www.dlss5nvidia.com/marketing/reddit/dlss5-reddit-comparisons.html

**发布节奏：** 每周 2 次，间隔至少 48 小时；每次只选一个社区和一个案例；先回复评论再补链接。记录 `utm_source`、社区、案例类型、点击和注册，连续两周没有有效点击就换标题或案例，不提高投放频率。

## 发布前检查

1. 先确认目标社区允许工具链接和自荐；不允许时只发图片与方法，不放链接。
2. 标题写问题或实验，不写“最佳”“革命性”“官方 DLSS 5”。
3. 图片同时展示 Before / After，并保留免责声明。
4. 90% 内容回答问题、展示限制或分享检查方法，10% 才是项目入口。
5. 不发布用户上传内容，不暗示官方 NVIDIA 关系，不把增强图用于身份证明或法律记录。
