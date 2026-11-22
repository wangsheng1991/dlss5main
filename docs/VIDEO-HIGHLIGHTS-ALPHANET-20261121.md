# Studio 高光内测接入 AlphaNet · 2026-11-21

对应 CORE-POSITIONING 的 R1 和 R4，遵循 SHOU-POSITIONING-1。视频工具服务于 Studio 的镜头复核与成片交付。

## 接入范围

浏览器继续使用 Studio 的登录、邀请、签名直传和选段界面。新建的 AlphaNet 模式任务由 Studio 服务端调用 `POST /v1/tasks/studio-video-highlights`。AlphaNet 的独立插件使用渠道专用密钥向 Studio 交接已授权的工作，原 Windows worker 负责推理与 FFmpeg 导出。Studio 按 AlphaNet 任务号查询状态并读取私有 JSON 产物；原视频和 MP4 仍走 GCS 签名地址。分析、导出各有独立任务号及幂等键。

每次用户操作重新核查登录、已验证邮箱、邀请和任务归属。网关回调检查独立渠道密钥、任务有效期、邀请 UID 以及服务端预授权的处理阶段。网关任务记录只需操作标识和状态，结果经受控读取即时签名。参考 [OWASP Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)。

## 发布顺序

1. 使用 AlphaNet root 管理入口检查网关备份健康、任务插件运行时和图片项目已有模型。部署插件 `integrations/alphanet/studio-video-highlights/plugin.js`，位于 AlphaNet 私有源码仓库。插件版本 `0.1.0`。保留现有插件、模型配置与项目凭证。
2. 新建独立的 AlphaNet 项目账号、分组、Task Plugin 渠道及仅允许 `studio-video-highlights` 的项目 Key。渠道上游 HTTPS 为 Studio 网站，凭证独立生成。仅给该项目绑定渠道，价格配置仅追加高光独立项并保持免费内测。在公开模型广场、默认组和现有图片项目核查访问边界。保留操作前配置备份。
3. 在 Vercel 服务端设置 `VIDEO_HIGHLIGHTS_ALPHANET_API_KEY` 和 `VIDEO_HIGHLIGHTS_ALPHANET_CHANNEL_KEY`。用 `VIDEO_HIGHLIGHTS_ALPHANET_ENABLED` 的值 `1` 为新任务选择网关。首轮可同时设 `VIDEO_HIGHLIGHTS_ALPHANET_CANARY_UID`，只让已受邀且匹配此 UID 的账号的新任务走网关。既有任务按创建时的路径继续。服务端密钥使用已有私有凭据库，备份包只含变量名、可复跑证据和源码。
4. 用受邀账号及授权路口 MP4 验收上传、提交、轮询、候选段、选择和导出。核对两个操作都在 AlphaNet 任务日志里有独立并成功的记录，下载后用 ffprobe 验证。重复提交、不同选段并发、未受邀和跨账号读取须单列。测试后确认图像项目仍可列出 `flux-klein`，抽检现有图像链。
5. 高光过生产验收后才进入图生视频、超分和插帧。下一批另建私有渠道与模型名，分别确认运行环境、模型许可和真实同源输出。Windows 继续处理高光；home-linux 暂不切换。

## 2026-11-22：向已验证邮箱的登录账号开放

仍通过独立 AlphaNet 渠道，访客、未验证邮箱及非任务所有者无权读取结果。试用每个账号每天最多预留五个上传任务（UTC 日期），同时保留单个在途任务、上传限制和原有签名下载。若需收回公开试用，设置生产变量 `VIDEO_HIGHLIGHTS_ACCESS_MODE=invite` 后重新部署，既有私有渠道和回调仍处理已授权的阶段。公开模式下若网关未启用，拒绝新任务而不改走直连。

## 回滚

先取消新任务的 AlphaNet 开关并部署。已通过 AlphaNet 提交的任务仍绑定原渠道，保留插件和两把服务端密钥直至任务清空，再关闭这条私有渠道。遇到网关返回不明确时以原幂等键重查，避免生成第二个操作。恢复包包含可重建的两仓提交补丁、签名校验清单以及运行手册。
