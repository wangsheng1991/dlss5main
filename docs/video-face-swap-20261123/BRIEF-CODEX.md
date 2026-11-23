# 给 Codex 的任务：视频换脸 · 阶段 1 可执行管线

你是这台 Mac 上的 Codex，本会话的委托方是 PenguinHarness 智能体（不是王胜本人，但代表他的意图）。请按下面的边界工作。

## 背景（一句话）

王胜要「把自己换进视频当主角」，用在游戏场景。技术上分三档，我们**只做第一档：离线视频换脸**，5–30 秒、正脸或半侧、镜头相对稳。全身角色替换和实时换脸这一期不做，也不要对外承诺。

已有两份文档，先读完再动手：

- `docs/video-face-swap-20261123/README.md` —— 选型与边界
- `docs/video-face-swap-20261123/RELAY-TO-WIN.md` —— 要问 GPU 机器的问题

**已知硬约束**：这台 Mac 是 Intel + AMD 4GB，跑不了任何换脸模型。所有代码都是**写给 GPU 机器执行的**，你在这里只需要保证脚本正确、可读、能在 Linux+CUDA 上跑，**不要试图在本机执行模型推理**。

## 你要交付什么

在仓库里新增 `scripts/face-swap/` 目录，产出四样东西：

1. **`scripts/face-swap/check-env.py`** —— 环境探测脚本。输出一段 JSON：GPU 型号、显存总量/可用、CUDA 版本、torch 是否可用及其版本、磁盘剩余、CPU 核数。不依赖第三方库（只用 subprocess + 标准库，调 `nvidia-smi`、`torch` 时容错）。拿不到就写 `null` 并给 `error` 字段，不要抛异常退出。

2. **`scripts/face-swap/setup.sh`** —— 安装脚本。装 FaceFusion（用它的官方安装方式，写清楚实际的 git 地址与 install 命令）。要求：
   - 先跑 `check-env.py`，显存低于 4GB 就打印警告并继续（让人自己决定）；
   - 幂等：重复跑不炸；
   - 每一步打印在做什么；
   - 不要 `sudo`，不要改系统 Python。

3. **`scripts/face-swap/run.sh`** —— 跑一次换脸。参数：`--source <人脸图> --target <视频> --output <输出视频>`。内部调 FaceFusion 的 CLI，选 `face_swapper` + `face_enhancer` 两个 processor，输出 mp4/h264。要求：
   - 参数缺失时打印 usage 并退出 2；
   - 输入文件不存在时报错退出；
   - 打印预计耗时与实际耗时；
   - 不要硬编码绝对路径。

4. **`scripts/face-swap/README.md`** —— 一页说明：三步（探环境 → 装 → 跑）、输入规格（正脸、脸≥100px、5–30s、单人或主次分明）、验收标准（每帧是不是同一个人、角度极限、有没有糊）、常见失败（角度大、遮挡、运动模糊、多人同框）以及每个失败怎么判断。

## 硬性禁止

- **不要改** `src/`、`api/`、`server/`、`tests/`、`public/` 下任何文件；不要碰 `package.json` 和任何站点页面。本次只在 `scripts/face-swap/` 和 `docs/video-face-swap-20261123/` 里工作。
- **不要编造数字**：显存需求、耗时、成功率，没实测就写「待实测」，不要给一个看起来精确的假值。
- **不要写**「保持身份」「100% 像」「比 Topaz 好」这类话。换脸是概率的，文档里要如实写。
- 不要提交 git，不要 push。工作树留给我复核。
- 不要装系统级依赖、不要改 shell 配置。

## 你也可以做的一件事（可选）

复核 `docs/video-face-swap-20261123/README.md` 里的事实错误（模型名、许可、能力描述），把发现写进 `docs/video-face-swap-20261123/REVIEW.md`，**不要直接改原文档**。只写你确信的；不确定的标「待核实」。

## 完成后怎么回

用中文，三句话以内说清楚：新增了哪几个文件、有没有发现原文档的事实错误、还有哪一件事必须等 GPU 机器的信息才能做。
