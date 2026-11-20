# 2026-11-20 视频插帧复核

R1 / R4. 这是 Studio 视频支线的同源证据，配合中英预告与内测入口使用。

## 素材与方法

[Big Buck Bunny, Sunflower version](https://bbb3d.renderfarming.net/)（Blender Foundation, 2008；Janus B. Kristensen, 2013，[CC BY 3.0](https://creativecommons.org/licenses/by/3.0/)）。[发布者下载页](https://bbb3d.renderfarming.net/download.html)的 1080p 60 fps 普通版。只取 03:39 起的七秒，缩放至 640×360。页面视频和图片均为测试片段的编辑衍生物。

1. 从已解码源片保留偶数帧，给两组相同的 30 fps 输入。FFmpeg 7.1.1，光流设置为 `minterpolate=fps=60:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:scd=fdiff`，重复帧设置为 `fps=60`。
2. 给光流输入用 NUT 容器保存无损图像与精确时间戳（time base 1/60000）。保留输出第 30–389 帧供评分，去掉初始和结尾缓冲。三路的 180 个偶数帧逐个哈希一致，基线的奇数帧逐一重复其前一帧，参照画面内相邻重复帧为 0。
3. 只评估 180 个未交给算法的奇数帧。按亮度结构相似度与源片比对。页面视频为三路同步横排，无音轨，播放器中的压缩渲染版未用于算分。
4. 人工查看相同帧号和裁切坐标。零基帧 39 的光流眼睑位置更接近原片。帧 85 下方高速穿过的角色带半透明拖影，重复帧无这条拖影。

| 方法 | 留出帧平均亮度 SSIM | 留出帧亮度 PSNR |
|---|---:|---:|
| 重复帧 | 0.975745 | 31.885562 |
| FFmpeg 光流 | 0.989755 | 37.869381 |

光流在 166/180 个留出帧上亮度 SSIM 高于重复帧。这是一个动画片段的结果。Windows 交接中的实拍素材使用另外一套重复帧基线，不能与本表混用。暂无可核验的 Studio 或 Topaz 同源产出，当前页面为内测预告。

复验脚本及逐帧日志保存在本机 `/Users/wangsheng/code/shou/artifacts/video-interpolation-20261120/`。查看文件 `measure.sh`、`export.sh`、`measurements.txt`、`*-ssim.txt` 和 `*-psnr.txt`。
