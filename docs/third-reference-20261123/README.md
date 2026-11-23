# 第三张场景参考与机位轴 · 2026-11-23

服务规则：R1（人物风格转换主线）与 R5（未验收不宣传）。

合影的前两张图只提供人物身份，无法单独表达车辆、车库等环境和构图需求。
本次为人物风格转换流程增加可选场景输入，不扩展姿势枚举。

## 改动

- `src/config/tools.ts`：together 接受 2–3 张参考图，第三张为可选场景 / 构图参考；
  增加按第 N 槽判断接受 / 必需的 helper，保留原第二槽 helper 供已有调用方使用。
- 增加 `camera`：空值默认，明确值为 `waist_up`、`full_body`、`wide_two_shot`。
  空值不改变旧 pose 文本；明确值只在 pose 句后追加一句机位指令。
- `togetherPrompt(pose, camera, hasSceneRef)`：第三图只提供环境、物件、构图，
  不提供身份，明确禁止第三张脸。明确 camera 优先于参考图的构图。
  `buildToolTask` 从有序 imageIds 的长度判断是否有场景图。
- `src/pages/Dashboard.tsx`：增加第三槽的选择、替换、移除、预览和错误提示；
  检查文件格式、大小和像素限制。切换账户、模式或加载样例 / 案例时清空场景图。
- `src/features/generation/useGeneration.ts`：校验第三图并按人物、角色、场景顺序上传，
  在保存任务前追加第三个 ID；未选择机位时不序列化 camera 字段。
- `src/features/generation/operation.ts`：补全类型与注释。原存档读取器只要求 image_ids
  是数组，本来即可读取三个 ID，无需改变恢复逻辑；新增测试验证保存 / 恢复完整。
- `tests/tools.test.ts`：新增五个测试，覆盖旧请求和提示词的字节兼容、全部姿势与机位
  下的第三图身份限制、非法 camera、第三图上传顺序和存档恢复、非法文件拒绝。

`api/image-edit/jobs.ts` 已使用通用 min/max 校验并从 TOOL_OPTIONS 读取选项，无需修改。
`src/config/apiCatalog.ts` 没有 together 示例，无需修改。
扣费逻辑、价格、保护页面、营销正文均未修改。没有验证上游按图数的实际成本。

## 兼容性验证

以修改前的 `99130b9` 为基线，直接执行旧版和新版上传 / 提交 hook（使用本地
网络、存储和 React hooks 替身），对全部 4 个 pose × 3 个 frame 比较：
上传请求列表、生成请求 JSON 和服务端 provider JSON 均逐字节相同。
同时将原四条提示词逐字保存为回归断言；无 camera 与空 camera 都覆盖。

手工检查原第一、第二槽及 pose / frame 的默认值和取值未改；
新增 camera 默认空、无第三图不产生第三次上传。新控件为界面增加，
兼容的是原表单值与序列化结果，不声称新增控件后的页面 HTML 与旧页面相同。

## 本地验收与环境阻碍

- `npm run lint`：通过。
- `npm test`：运行器在启动时因沙箱禁止本地 IPC socket 而报 `listen EPERM`。
- `node --import tsx tests/run.ts`：266/267 通过，含全部五个新增测试。
  唯一失败为既有的 Waffo reconciliation CLI 测试；该测试子进程显式启动
  `node_modules/tsx/dist/cli.mjs`，同样被 IPC 限制阻断，未进入被测 CLI。
  未修改该测试、计费代码或依赖来绕过验收。
- `npm run build`：Vite 构建成功；后续 tsx 启动 API catalog 导出时遭遇同一 IPC 限制。
  使用 `node --import tsx scripts/export-api-catalog.ts` 与
  `node --import tsx scripts/prerender-seo.ts` 作补充验证，两者均成功（退出码 0）。

必须在允许 tsx 本地 IPC 的环境重新执行原三条验收命令，全绿后才允许本地提交。
当前没有提交、push 或部署。

## 线上边界

**站点 UI 未做线上验收**（登录态第三槽只有单测覆盖），但**模型层已跑过三组真实生成**，见 `RESULT.md`：上游接受三张图，第三张确实把场景和机位带了过去；代价是角色身份更容易漂（衣甲→皮衣、女→男），因为库里那张角色参考没有正脸。
未做自动裁剪、对齐、透视校正；线上效果由人工另跑，营销文案等验收后再处理。
