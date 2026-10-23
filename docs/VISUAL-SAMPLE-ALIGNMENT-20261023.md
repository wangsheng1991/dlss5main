# 厨房示例输入/输出对齐修复（2026-10-23）

服务规则：R4，真实呈现风格重绘的材质与光照变化；不把生成图冒充 NVIDIA 输出或逐像素恢复。

## 根因与范围

旧输入 `/examples/sample1.jpg` 为1210×871，包含软件工具栏。生成接口固定1024×1024；`object-contain` 在输出决定的正方形容器中产生输入上下黑边。旧输出还改变构图。未用CSS裁切或拉伸输出掩盖问题。

新输入从原图左5、上103处取1200×768矩形，去掉顶部工具栏，不做非等比缩放；新文件 `/examples/sample1-kitchen-aligned-v3.jpg`。保留原图供其他既有用途使用。

## 真实运行与人工复核

- 模型：站点实际 AlphaNet `flux-klein`，不是另一个绘图模型制作的占位图。
- Task：`task_86kwPfcXd3rZisFSCSxJWxVv1WR4VqAr`。
- 请求与结果尺寸：1200×768；实际一次运行12.626秒，无重试。这是本次记录，不是性能承诺。
- 实际prompt见 `src/config/samples.ts`，限制相机、构图、窗框、柜体、台面边缘位置，允许真实光照与材质重绘。
- 已分别查看输入输出：窗框、台面转角、吊柜与烤箱大体对应，明显改善旧配对；门缝、把手、反射等仍有模型重绘差异，不宣称逐像素对齐。
- 结果缓存写入新key `sample1-kitchen-aligned-v3`，回读字节一致；旧 `sample1` 缓存保留。结果URL带版本参数，避免浏览器/CDN复用旧方图。其他示例缓存key与URL不变。
- 缓存重新生成时也使用1200×768，避免旧硬编码方图再次出现。

## 验收

- lint / build通过，测试110/110。
- 旗舰页 `fails=0 verdict=PASS`；两站无来源声明检查PASS。
- 保护页检查首先仅发现上一项已获授权且已记日志的 `/download` 加法正文变化；其旧基线已归档至下载页证据目录，补拍后复跑 `PROTECTION: changed=0 down=0 verdict=FROZEN-OK`。
- 提交 `54592da` 已部署成功。内置浏览器在 `/visual-enhancer` 点击 `Run this example · free`，实际出现 `served from cache` 和对比滑块。
- DOM实测两张原图均1200×768、两个显示盒均573×366.71875，比例一致，无上下黑边。浏览器画面中原工具栏已消失，台面和柜体不再发生旧版的大幅错位；截图 `online-slider.png`。
- 键盘操作滑块50→52→50成功。线上结果下载字节SHA-256与人工审阅结果相同：`229b802a24474dd6c8df6ddac02afb454b7563fe3dfcada76c25dfceac89e708`。
- 中英文页面共用同一示例catalog/API；本次真实按钮操作与截图在英文页面完成。

证据：`/Users/wangsheng/code/shou/artifacts/sample-alignment-20261023/`，含原始生成记录、输出文件与验收日志。未改首页、下载页、SEO head、申请流程、价格或支持范围。
