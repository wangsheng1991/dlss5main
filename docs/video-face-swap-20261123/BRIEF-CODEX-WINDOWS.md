# 给 Codex：在那台 Windows GPU 机器上准备换脸环境

你要通过 SSH 在远程 Windows 机器上干活。这台 Mac 没有 GPU，所有实际操作都在远端。

## 连接方式（每次 ssh 都必须带全）

```sh
ssh -i ~/.ssh/id_ed25519_win_gpst_hostname \
  -o IdentitiesOnly=yes -o BatchMode=yes -o PreferredAuthentications=publickey \
  -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null \
  -o ConnectTimeout=60 \
  -o 'ProxyCommand=/Users/wangsheng/.local/bin/cloudflared access ssh --hostname %h' \
  99230@win.gpst-image2.com "<命令>"
```

- 远端默认 shell 是 PowerShell 还是 cmd 不确定，**复杂命令一律用 `powershell.exe -NoLogo -NoProfile -NonInteractive -Command "..."` 包一层**；引号嵌套困难时用 `-EncodedCommand`（UTF-16LE + base64）。
- 中文输出可能乱码，PS 里先设 `[Console]::OutputEncoding=[Text.Encoding]::UTF8`。
- 目标目录：`G:\ai-exchange\face-swap`（`G:\ai-exchange` 已存在，是既有交接目录）。

## 已知事实（不要重复测量，直接用）

- GPU：RTX 4090，24564 MiB，驱动 591.86，CUDA 13.1
- **当前占用 20617 MiB、利用率 37%——有别的任务在用这张卡**
- Python 3.12.8 在 `C:\Users\99230\AppData\Local\Programs\Python\Python312`
- PyTorch 已装但是 `2.8.0+cpu`（CUDA 不可用）
- conda 在 `D:\SOFT\INSTALL\anaconda\condabin\conda.bat`
- git 在 `C:\Program Files\Git\cmd\git.exe`
- 磁盘空闲：C 45.6 / D 22.6 / E 74.7 / G 86.8 GB
- 外网可达 GitHub 与 PyPI
- 没有 ComfyUI，没有 FaceFusion

## 任务，按顺序做，每步都把真实输出摘要记下来

### 第 1 步：查清谁占着 20.6 GB 显存（只读）

用 `nvidia-smi` 和 PowerShell 的进程查询交叉确认：

```powershell
nvidia-smi --query-compute-apps=pid,process_name,used_memory --format=csv
nvidia-smi --query-gpu=memory.used,memory.total,utilization.gpu --format=csv,noheader
Get-Process | Where-Object { $_.WorkingSet64 -gt 2GB } | Sort-Object WorkingSet64 -Descending | Select-Object -First 10 Id,ProcessName,@{n='WS_GB';e={[math]::Round($_.WorkingSet64/1GB,1)}} | Format-Table -AutoSize
```

报告：占显存的到底是谁（PID、进程名、显存）、它是不是常驻服务。**不要 kill 任何进程，不要停任何服务。**

### 第 2 步：建独立环境（不碰系统 Python）

在 `G:\ai-exchange\face-swap` 下：

1. 用 conda 建一个 Python 3.12 环境（名字 `faceswap`），或者用 `python -m venv` —— 二选一，优先 conda（机器上已有）。
2. 装 **CUDA 12.4 版** PyTorch（`pip install torch torchvision --index-url https://download.pytorch.org/whl/cu124`）。CUDA 13.1 的驱动向下兼容 cu12x。
3. 验证：`python -c "import torch;print(torch.__version__, torch.cuda.is_available(), torch.version.cuda)"` —— 必须打印 `True`。**打印 False 就停下来报告，不要继续。**

### 第 3 步：装 FaceFusion

```powershell
cd G:\ai-exchange\face-swap
git clone https://github.com/facefusion/facefusion.git
cd facefusion
python install.py cuda@12 --skip-conda
python facefusion.py --version
```

- `install.py` 的位置参数只接受 `default | cuda@12 | cuda@13`（Windows 上还有 `directml`、`qnn`）。**用 `cuda@12`。**
- 如果 `--skip-conda` 报错，说明该版本 install.py 不接受这个参数，去掉再试，并把实际报错记下来。
- 模型权重会在首次运行时自动下载，不要在安装阶段强行下载。

### 第 4 步：判断能不能跑，并明确报告

- 如果空闲显存 < 8 GB：**不要跑推理**，直接报告「环境已就绪，但卡被占用 X GB，需要等它空出来」。
- 如果空闲显存 ≥ 8 GB：可以做一个 3 秒的冒烟测试（自己生成一段测试视频或用 `--help` 验证 CLI 可用），但**不要**处理任何真实素材。

## 硬性约束

- **不要 kill 进程、不要停服务、不要装显卡驱动、不要改系统环境变量。**
- **不要动系统 Python**，所有安装只在新环境里。
- 所有写入只允许在 `G:\ai-exchange\face-swap` 下面。
- 不要往仓库提交任何东西；本机只允许读。
- 每步失败就停，把真实报错贴出来，不要反复重试同一个失败命令。
- 不要编造耗时和显存数字；没测到就写「未测」。

## 完成后怎么回

中文，六行以内：①谁占着显存 ②环境建好没有 ③torch CUDA 是否 True ④FaceFusion 版本 ⑤现在能不能跑 ⑥卡在哪（如果有）。
