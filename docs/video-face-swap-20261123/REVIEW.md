# 复核记录（2026-11-23）

本记录只核对阶段 1 技术说明里的可验证事实；视频换脸仍是围绕游戏人物素材的支线验证，不改变项目主线（见 `docs/CORE-POSITIONING.md`）。

## 结论

未发现可确信、需要直接更正的事实错误。以下项目因模型权重、版本和硬件强相关，维持“待核实”，不应升级为对外结论。

## 已核对

- FaceFusion 官方仓库目前为 `https://github.com/facefusion/facefusion`，项目提供 `headless-run` 命令；当前 CLI 支持 `--processors face_swapper face_enhancer` 和 `--output-video-encoder libx264`。这与原文将其列为阶段 1 候选方案的能力描述一致。
- 官方源码当前许可证文件为 MIT；原文将“代码 MIT”与“内置模型许可各异”分开表述，未把模型权利误写成代码许可证。

## 待核实（不作为错误断言）

- 各换脸模型权重（包括 `inswapper` 系）的具体许可、可商用范围和随 FaceFusion 版本变化的默认模型，须在目标版本下载前逐一核对权重随附许可证，不能仅凭模型名称决定产品化合规性。
- FaceFusion、LivePortrait、Wan-Animate、VACE 与姿态驱动项目的显存范围、速度和特定游戏镜头表现均依赖版本、分辨率、处理器与显卡，原文已标有“估计/未核实”或待实测，保持该状态是合适的。
- LivePortrait、Wan-Animate 与 VACE 的“可商用”或“开源”表述必须分别核对代码许可证、权重许可证和第三方依赖许可证；本次没有对特定版本完成该三层核验。
