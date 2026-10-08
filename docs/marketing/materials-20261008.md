# 实测案例与分发素材清单（2026-10-08）

这批素材只把已经记录在 `docs/marketing/dlss5-studio-brief.md` 的 Studio 运行结果做成可分发文件。图片来自真实引擎输出的对比截图；视频是由对应的真实对比截图生成的 15 秒展示片，只加入了缓慢推近镜头，没有重新绘图、磨皮、锐化或替换结果。页面上的独立项目、非 NVIDIA 官方说明必须保留。

## 5 个可核验案例

| 案例 | 输入与参数 | 实际输出与耗时 | 局限 | 试同款入口 | 素材 |
| --- | --- | --- | --- | --- | --- |
| Hong Kong night | CC0 夜景，3538×2318；`Low-light denoise`；Windows 11 Pro 26200，RTX 4090 24 GB，driver 591.86，Studio 0.1.0 | 7076×4636 PNG，26.6 s（第二次 28.9 s） | 只有一组夜景重复运行；同尺寸对比图看不到 2× 像素增益 | [查看 Studio 案例](/download#showcase) | [对比图](/marketing/reddit/dlss5-studio-kit/03-night-compare.jpg) · [15 秒视频](/marketing/cases/20261008/night-studio-case-15s.mp4) |
| Red wool macro | Rosmarie Voegtli，CC BY 2.0；1280×1707；`Detail keeping 2×`；同一测试机 | 2560×3416 PNG，8.8 s | 必须保留署名；细纤维增强后仍需按 100% 检查 | [查看 Studio 案例](/download#showcase) | [对比图](/marketing/reddit/dlss5-studio-kit/01-wool-macro-compare.jpg) · [15 秒视频](/marketing/cases/20261008/wool-studio-case-15s.mp4) |
| Ukiyo-e print | 公有领域木版画，1920×2799；`Anime / illustration 2×`；同一测试机 | 3840×5600 PNG，16.5 s（第二次 13.4 s） | 平面线条和纸张纹理不是现代游戏材质；不要把它写成通用质量保证 | [查看 Studio 案例](/download#showcase) | [对比图](/marketing/reddit/dlss5-studio-kit/05-ukiyoe-compare.jpg) · [15 秒视频](/marketing/cases/20261008/ukiyoe-studio-case-15s.mp4) |
| 1880 newspaper scan | 公有领域扫描件，1280×1803；`Photo restore 4×`；同一测试机 | 5120×7216 PNG，32.4 s（第二次 31.6 s） | 小字是否真实可读必须回看原始扫描；不能承诺恢复缺失文字 | [查看 Studio 案例](/download#showcase) | [对比图](/marketing/reddit/dlss5-studio-kit/06-newspaper-1880-compare.jpg) · [15 秒视频](/marketing/cases/20261008/newspaper-studio-case-15s.mp4) |
| Lavender field | CC0 薰衣草田，1920×1280；`Detail keeping 2×`；同一测试机 | 3840×2560 PNG，9.0 s | 只有单次记录；花朵和叶片可能出现重建细节，发布前要和原图并排检查 | [查看 Studio 案例](/download#showcase) | [对比图](/marketing/reddit/dlss5-studio-kit/07-lavender-compare.jpg) · [15 秒视频](/marketing/cases/20261008/lavender-studio-case-15s.mp4) |

## 10 份可直接复核的分发素材

这 10 份是一张真实对比图 + 一条由同一张图生成的 15 秒展示片，共 5 组。短片是展示素材，不是第二次 GPU 测量；文案应引用上表的实际引擎耗时，不能把视频时长当成处理速度。

| 文件 | 类型 | 对应案例 | 用途 |
| --- | --- | --- | --- |
| `public/marketing/reddit/dlss5-studio-kit/03-night-compare.jpg` | 2560×1450 JPG | Hong Kong night | Reddit / dev.to 首图 |
| `public/marketing/cases/20261008/night-studio-case-15s.mp4` | 1280×720，15 s，H.264 | Hong Kong night | 视频帖或播客视觉 |
| `public/marketing/reddit/dlss5-studio-kit/01-wool-macro-compare.jpg` | 2560×1450 JPG | Red wool macro | 纹理细节讨论；必须附 CC BY 署名 |
| `public/marketing/cases/20261008/wool-studio-case-15s.mp4` | 1280×720，15 s，H.264 | Red wool macro | 竖屏裁切前的横版母片 |
| `public/marketing/reddit/dlss5-studio-kit/05-ukiyoe-compare.jpg` | 2560×1450 JPG | Ukiyo-e print | 插画/旧图修复主题 |
| `public/marketing/cases/20261008/ukiyoe-studio-case-15s.mp4` | 1280×720，15 s，H.264 | Ukiyo-e print | 短视频预览 |
| `public/marketing/reddit/dlss5-studio-kit/06-newspaper-1880-compare.jpg` | 2560×1450 JPG | Newspaper scan | 扫描修复主题 |
| `public/marketing/cases/20261008/newspaper-studio-case-15s.mp4` | 1280×720，15 s，H.264 | Newspaper scan | 文档/档案场景 |
| `public/marketing/reddit/dlss5-studio-kit/07-lavender-compare.jpg` | 2560×1450 JPG | Lavender field | 自然纹理主题 |
| `public/marketing/cases/20261008/lavender-studio-case-15s.mp4` | 1280×720，15 s，H.264 | Lavender field | 视觉素材补充 |

## 未完成项与边界

- **Image2LEGO 案例暂不计入真实案例。** 当前仓库没有实际积木转换的输入、输出、参数和授权记录。不能从 `public/examples/generated/` 的说明性插画中挑一张冒充真实运行。待有一次真实运行及原图使用许可后，再补一张前后图、一条短片和可复现参数。
- 这批素材没有自动发到 Reddit、Bluesky、dev.to 或其他平台；发布前仍需人工检查各平台版规并得到产品负责人确认。
- 试同款入口落到 Studio 案例区，不承诺云端上传或免费生成；正式下载仍走 [请求页面](/download)。
- 所有对外文案应写“independent third-party project / 独立第三方项目”，不能写 NVIDIA 官方、合作或授权。
