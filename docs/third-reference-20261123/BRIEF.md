# BRIEF · 合影流程加第三张参考图（场景/构图）+ 机位轴

服务规则：R1（人物风格转换主线）与 R5（未验收不宣传）。

## 为什么做这件事（一句话）

合影工具今天只收两张**人物**图，所以像「同一辆车前把钥匙递给新主角」「在车库修车递扳手」这类创意，**素材再好也做不出来**——创意点落在场景和动作上，流程没有收货口。10 张素材板实测（`docs/material-board-20261123/`）：10 个创意里 6 个的场景格标「缺」且填不进去，2 个因此判死。

## 要交付什么

1. **第三张参考图**：`together` 从 `{min:2, max:2}` 变成 `{min:2, max:3}`，第三槽是**可选**的「场景 / 构图参考」（可以是街景、一辆车、一张摆好动作的普通人照片）。缺席时行为与今天完全一致。
2. **机位轴**：在 `pose` 之外加一个 `camera` 选项（`waist_up` / `full_body` / `wide_two_shot` 之类，命名你定），服务端提示词按两者组合生成。姿势枚举不扩——扩姿势等于写更多固定剧本，机位是把已有姿势放开的第一步。
3. **服务端提示词**：`togetherPrompt` 接受 `(pose, camera, hasSceneRef)`。有第三张时，提示词必须**点名它是场景/构图参考**（"the third reference image is the setting and framing, not a person —— do not put a third face in the picture"）。这是本任务最容易翻车的地方：第三张一旦被当成第三个人，成品就废了。所以这条要有单测断言。
4. **测试**：更新 `tests/tools.test.ts:396` 那条 `deepEqual(TOOL_REFERENCES.together, ...)`；新增断言——2 张时不提第三张、3 张时点名第三张且禁止第三个脸、`camera` 非法值被 `toolOptionError` 拒。
5. **文档**：`docs/third-reference-20261123/README.md` 写清楚改了什么、为什么、以及**未做线上验收**。

## 具体落点（已勘察，别重复找）

- `src/config/tools.ts` —— `TOOL_REFERENCES.together`、`togetherPrompt`、`TOGETHER_POSES` 旁边加 `TOGETHER_CAMERAS`、`TOOL_OPTIONS.together` 加 `camera`。
- `src/pages/Dashboard.tsx` —— 第二张上传槽是硬编码 `slots[1]`（约 650–655 行），第三个槽要按同样模式加；`toolTakesSecondImage` / `toolNeedsSecondImage` 这两个只认「有没有第二张」的 helper 需要泛化成「第 N 槽」。
- `src/features/generation/useGeneration.ts` —— 约 87 行只校验 second、约 109 行只 append 第二张，第三张要一起处理；`operation.ts` 的存档校验也要能读 3 个 id。
- `api/image-edit/jobs.ts` —— 校验已经走 `TOOL_REFERENCES`（通用 min/max，第 84–88 行），大概率不用改；`buildToolTask` 要把 `image_ids.length` 传给提示词构造。
- `src/config/apiCatalog.ts` —— `together` 的 API 示例（约 268 行附近）如果写了「two references」要改；`references_per_call` 已经是 1–4，不用动。

## 红线（不要碰）

- `api/billing/**`、`server/waffo-*`、`server/payment-policy.ts`、`/pricing` 页面——**完全不动**。第三张参考图不改扣费逻辑（仍是 1 额度）；如果上游按图数计费、你觉得成本会变，**在 README 里写一行结论就停**，不要自己改价格。
- 保护名单那 13 个页面（`/`、`/download`、`/blog`、`/about`、`/docs`、`/pricing` 等）不动。
- **营销文案不动**：`src/content/articles/*`、`seoExpansion.ts`、落地页正文里「两张参考图」这类表述先不改——等线上真跑通一张再改，没验收过的能力不宣传。
- 不 push、不部署。只提交到本地分支，提交信息用仓库现有风格（英文、祈使句、说清为什么）。

## 验收（你必须自己跑绿再说完成）

```
npm run lint
npm test          # 现在 262/262，改完必须全绿且新增用例在内
npm run build
```

另外手工确认一遍：不传第三张时，表单和提交体与今天**逐字节等价**（这是回归底线）。

## 明确不做

- 不做第三张的自动裁剪/对齐/透视校正（那是下一件事）。
- 不跑付费生成做效果验收——没有凭证，也还没到那一步。线上效果由人工另跑。

## 读法修正（2026-11-23，用户确认）

逐字节等价仅适用于「两张参考图 + 未选择 camera + 同一 pose」；原有表单值、
上传请求、提交体和提示词须保持原样。新增第三槽和机位控件本身是本次授权的界面增加。
camera 默认空值（UNSET），含义为保留 pose 自带机位，空值不写进提交体。
现有四个 pose 的文本不改，包括 handshake / hug 的 waist-up；明确选择 camera
时，在 pose 句后追加一句机位指令，允许请求与提示词变化。
存在第三张参考图时，无论 camera 是否选择，都必须点名它是场景 / 构图参考、
不是人物，并禁止添加第三张脸；对应断言必须覆盖空机位与明确机位。
其他范围、红线、验收命令及只在全绿后本地提交的要求不变。
