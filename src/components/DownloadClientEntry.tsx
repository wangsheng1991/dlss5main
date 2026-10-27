/**
 * Our own desktop window — the only thing on this page a visitor can download today.
 * Same copy on the client and at build time; the numbers are one recorded run, not a benchmark.
 */
const RELEASE = 'https://github.com/wangsheng1991/dlss5-enhancer-cli/releases/download/v0.1.0/DLSS5.Enhance-0.1.0.dmg';
const REPO = 'https://github.com/wangsheng1991/dlss5-enhancer-cli';

export default function DownloadClientEntry({chinese=false}: {chinese?:boolean}) {
 return <section data-download-client-entry className="mb-16 rounded-xl border border-primary/30 bg-primary/[0.05] p-6 text-zinc-300" aria-labelledby="client-entry-heading">
  <h2 id="client-entry-heading" className="text-2xl font-bold text-white">{chinese?'能下载的东西里，有一个是我们自己做的':'One of the downloads here is ours'}</h2>
  <p className="mt-4">{chinese?'DLSS5 Enhance 是我们的桌面窗口：把一批图片丢进去，用同一个账号、同一个模型跑完，逐行看状态，跑完弹出前后对比。它不是 NVIDIA 的 DLSS 5，不安装也不替换任何 NVIDIA 文件，不是 APK，也不是游戏运行时。':'DLSS5 Enhance is our own desktop window: drop a folder of images on it, run the batch through the same account and the same model, watch each row, and open the before/after compare when it finishes. It is not NVIDIA DLSS 5, installs and replaces no NVIDIA file, and is neither an APK nor a game runtime.'}</p>
  <p className="mt-4">{chinese?'这一版是 macOS Intel（x64）的未签名包，约 120 MB；Windows 版还没有发布，所以别把它当成 Windows 工具下载。首次打开会在「系统设置 → 隐私与安全性」里被拦一次，需要手动允许。':'This build is an unsigned macOS Intel (x64) package of about 120 MB. There is no Windows build yet, so do not download it expecting one. macOS blocks it on first launch until you allow it under System Settings → Privacy & Security.'}</p>
  <ul className="mt-4 space-y-2">
   <li><a className="text-primary underline" href={RELEASE}>{chinese?'下载 DLSS5 Enhance 0.1.0（.dmg，未签名）':'Download DLSS5 Enhance 0.1.0 (.dmg, unsigned)'}</a>{chinese?' —— 文件大小 125,711,820 字节。':' — 125,711,820 bytes.'}</li>
   <li><a className="text-primary underline" href={REPO}>{chinese?'源码与发行说明（MIT）':'Source and release notes (MIT)'}</a></li>
   <li><a className="text-primary underline" href={`${chinese?'/zh':''}/visual-enhancer`}>{chinese?'不想装东西：先用浏览器里的免费示例':'No install needed: try the free browser example first'}</a></li>
  </ul>
  <p className="mt-4">{chinese?'要登录，按任务计额度（一次任务 1 额度），额度显示在窗口里。我们自己在本机记录过一次：输入 1440×778 → 输出 1536×832 WebP，207,666 字节，用时 14 秒，额度 10 → 9。这是一次实测记录，不是性能基准，也不代表你的机器和你手上的图。':'It needs a signed-in account and spends credits per task (one credit per task); the window shows the balance. On one run on our own machine: 1440×778 in → 1536×832 WebP out, 207,666 bytes, 14 seconds, credits 10 → 9. That is a single recorded run, not a benchmark, and not a prediction for your machine or your images.'}</p>
  <p className="mt-4 text-sm">{chinese?'核对日期：2026-10-27。':'Checked 2026-10-27.'}</p>
 </section>;
}
