# Studio 高光邀请内测运行手册 · 2026-11-20

R1 / R4。将原片、候选片段、回看和导出接入 Studio。公开视频页面仍以保存的示例和邀请申请为主，试用区只对已验证的邀请账号开放。

## 架构与操作

1. Vercel 复用 Studio 入口和 Firebase 登录，视频直传 Google Cloud Storage 私有桶。桶禁止公开、约一天自动清理；短期签名 URL 提供上传和领取。视频最大 32 MiB，H.264/HEVC MP4，最长 30 秒，最长边 1280、短边 720。
2. Firestore 保存任务和一个 worker 租约。worker 用出站 HTTPS 与服务端通信，轮询、领取任务、下载输入、分段给现有 Windows 回环模型。当前只接受三类预设目标，结果是候选，用户手动选择后会由 FFmpeg 导出。没有扣费动作。
3. 处理节点脚本在 `workers/video-highlights/worker.py`，依赖 Python 3、FFmpeg/ffprobe、能从该节点访问的兼容本机分析服务。Windows 部署目录 `G:\studio-highlights-beta`，计划任务名 `StudioVideoHighlightsBeta`，登录该 Windows 账号时会启动。若系统换机，先部署分析服务并验证回环健康，再安装 worker。运行日志 `worker.log`，切勿把配置文件写进备份。
4. 生产变量名为 `VIDEO_HIGHLIGHTS_BUCKET`、`VIDEO_HIGHLIGHTS_WORKER_KEY`、`VIDEO_HIGHLIGHTS_INVITE_UIDS`。Vercel 现有 Firebase 服务账号负责仅服务端签名。worker 密钥保存在现有凭据目录下的私有 `video-highlights-worker.json` 与 Windows 受限配置。移机时从凭据库重新注入，账号邀请使用已验证的 Firebase UID。

## 切换与恢复

- 不允许公网直连推理。home-linux 接续时部署同等的回环分析 API、权重与预处理环境。拿到明确 GPU 时段后用同一份测试视频验证，之后停 Windows 调度再启 Linux 调度。不要把同一账号的 Windows worker 和 Linux 当成无条件并发。
- 停止 Windows 计划任务联网领单可以排空；用户继续取已完成任务。需要紧急封闭入口时下掉邀请变量并重新部署，主站预告页仍可访问。
- 备份发布 commit、源码补丁、worker 部署说明、固定权重版本及哈希和授权样片。谷歌云客户文件、签名 URL、凭据和用户标识都不放进协作备份。
- Windows 重启后需要检查模型与 worker 两者均在线。home-linux 尚未启用。运营容量、精度与端到端恢复单独验收，不能从一次演示推断。

## 实机验收记录

生产部署中的既有端点接受邀请账号任务，并拒绝未登录请求。使用站内授权路口视频实测：19.8 秒源片，车辆候选为 0–3 秒、4.5–19.8 秒。选择首段，得到 960×540 H.264、3.000 秒的 MP4。重复提交与重复导出请求收敛到同一任务。Windows worker 实际完成了分析和导出两阶段。

Cloudflare 对 urllib 的默认客户端标识返回 403。Worker 现在带明确的 `StudioVideoBeta/1.0` 标识，不依赖调整防火墙。若遇到连接问题，分别检查回环模型健康、任务 API 鉴权、桶的签名 PUT/GET，再看调度日志。

390 px Chrome 的生产验收也跑通。已验证邀请账号登录状态、上传、回看候选、导出和浏览器下载。公交车预设在这段样片返回 0–1.5、6–9、10.5–18 秒，合计 12 秒。下载结果经 ffprobe 核对为 960×540 H.264、12.000 秒。这组候选是实际模型输出，未经过准确率评测。
