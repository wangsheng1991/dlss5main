# GPU 机器实测（2026-11-23，经 SSH 直连）

## 入口

| 项目 | 值 |
| --- | --- |
| 正确入口 | `win.gpst-image2.com`，用户 `99230`，密钥 `~/.ssh/id_ed25519_win_gpst_hostname` |
| 代理 | `~/.local/bin/cloudflared access ssh --hostname %h` |
| 主机名 | `DESKTOP-FG2GM17` |
| 旧入口 `ssh-win.alphanetplus.com` | **通到 WSL（Ubuntu OpenSSH 9.6），不是这台 Windows**，别再用 |

> 依据仓库既有的 `docs/WINDOWS-AI-EXCHANGE-20261120.md`；本次重新验证通过。

## 硬件

| 项目 | 实测值 |
| --- | --- |
| GPU | NVIDIA GeForce RTX 4090 |
| 显存 | 24564 MiB（24 GB） |
| 驱动 | 591.86 |
| CUDA | 13.1 |
| **当前占用** | **20617 / 24564 MiB，利用率 37%**（有别的任务正在用这张卡） |

**这条最关键**：卡不是空闲的。现在只剩约 3.9 GB 可用，跑 inswapper 级别（约 2–4 GB）勉强，跑 Wan-Animate 14B（24GB 级）不可能。要实测必须等它空出来。

## 软件环境

| 项目 | 实测值 |
| --- | --- |
| Python | 3.12.8（`C:\Users\99230\AppData\Local\Programs\Python\Python312`） |
| PyTorch | **2.8.0+cpu** —— CUDA 不可用（`torch.cuda.is_available() == False`） |
| conda | `D:\SOFT\INSTALL\anaconda\condabin\conda.bat` |
| git | `C:\Program Files\Git\cmd\git.exe` |
| bash / WSL | 都在（`C:\WINDOWS\system32\bash.exe`，实际是 WSL） |
| ComfyUI | 无（C/D 盘都没有） |
| FaceFusion | 无 |
| 外网 | 通（github 200、pypi 200） |

## 磁盘

| 盘 | 空闲 | 已用 |
| --- | --- | --- |
| C | 45.6 GB | 418.9 GB |
| D | 22.6 GB | 908.9 GB |
| E | 74.7 GB | 856.8 GB |
| G | 86.8 GB | 1776.2 GB |

`G:\ai-exchange` 已存在（既有交接目录）。

## 250 / 251 井道

- Cloudflare 隧道 `ruiyun-250-ssh`、`ruiyun-251-ssh` 状态均为 **down**。
- `https://img3d.alphanetplus.com/api/health` 返回 **502**。
- 结论：这两条现在不可用，本期只能靠这台 4090。

## 对六问的回答

1. **GPU 型号与显存**：RTX 4090，24 GB。
2. **250/251 的卡**：隧道 down、img3d 502，现在查不到也不可用。
3. **有没有 CUDA + PyTorch**：有 PyTorch 2.8.0，但是 **CPU 版**；CUDA 13.1 的驱动在，需要重装 CUDA 版 torch 才能用 GPU。
4. **能不能跑 24GB 级模型**：硬件够，但现在卡被占 20.6 GB，实际跑不了。
5. **磁盘与带宽**：空闲 45–87 GB；外网可达 GitHub/PyPI，带宽未测。
6. **10 秒 1080p 换脸要多久**：**未实测**，要先装 FaceFusion 并等卡空出来。

## 下一步（按优先级）

1. 等卡空出来（或确认占用它的任务能不能让路）。
2. 在这台上建独立 Python 环境，装 CUDA 版 torch + FaceFusion（`scripts/face-swap/` 的 `setup.sh` 是 Linux 写法，Windows 上 `.venv/bin/python` 要改成 `.venv\Scripts\python.exe`，得先适配）。
3. 拿一段 10 秒 1080p 素材实测耗时，再定报价。
