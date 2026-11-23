# home-linux 的 SSH 入口（2026-11-23 新建）

## 为什么新建

`home-linux-deepseek` 这条隧道原本只暴露三个 HTTP 服务（`dev` 3081、`mediadl-gw` 8779、`api` 8191），没有 SSH，从 Mac 既进不去也查不了它的 GPU。它的隧道是 **remote-managed（`source: cloudflare`）**，所以可以直接用 API 加 ingress，不必上机器改 `config.yml`。

## 做了什么

| 项 | 值 |
| --- | --- |
| 隧道 | `home-linux-deepseek`（`23bf65fa-b090-44a0-91d2-460059250d6f`），出口 `120.232.254.221` |
| 新增 ingress | `ssh-home.alphanetplus.com` → `ssh://localhost:22`（追加在 404 之前，原三条不动） |
| DNS | `ssh-home.alphanetplus.com` CNAME → `23bf65fa….cfargotunnel.com`，proxied |
| Access 应用 | `ssh-home`（`98435bf5-68ba-4111-813c-bed31548c016`），self_hosted，24h |
| Access 策略 | allow：`wustwangsheng@gmail.com` + service token `img3d-machine`（`0651d47d-…`） |

**回归检查**：改完后 `dev` 仍 401、`api` 仍 200、`mediadl-gw` 仍 401，原服务未受影响。

**原配置备份**：`/tmp/tunnel-before.json`（version 5）。回滚 = 把这份 `config` PUT 回去，再删 DNS 记录与 Access 应用。

## 现在通到哪一步

- 带 service token 走 `cloudflared access ssh` 能穿过 Access、打到 sshd（`Permission denied (publickey,gssapi-keyex,gssapi-with-mic,password)` 是 sshd 的回复，不是 Cloudflare 的）。
- **卡在 SSH 认证**：`root`、`wangsheng`、`deepseek`、`ubuntu`、`ai` 五个用户名全部被拒，`~/.ssh` 里的四把钥匙都不在它的 `authorized_keys` 里。
- 需要：正确的用户名 + 密码，或把我们的公钥写进它的 `authorized_keys`。

## 连法（凭据就绪后）

```sh
export TUNNEL_SERVICE_TOKEN_ID="$IMG3D_ACCESS_CLIENT_ID"
export TUNNEL_SERVICE_TOKEN_SECRET="$IMG3D_ACCESS_CLIENT_SECRET"
ssh -i ~/.ssh/id_rsa \
  -o "ProxyCommand=/Users/wangsheng/.local/bin/cloudflared access ssh --hostname %h" \
  <user>@ssh-home.alphanetplus.com 'hostname; nvidia-smi -L'
```
