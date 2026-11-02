/**
 * Our own desktop window — the only thing on this page a visitor can download today.
 * Same copy on the client and at build time; the numbers are one recorded run, not a benchmark.
 */
import { DESKTOP_RELEASE, WINDOWS_RELEASE } from '../content/desktopRelease';
import { CHARACTER_STYLE_CATALOG_PATH, CHARACTER_STYLE_SPEC_URL } from '../config/characterStyle';
const RELEASE = DESKTOP_RELEASE.url;
const REPO = DESKTOP_RELEASE.repository;

export default function DownloadClientEntry({chinese=false}: {chinese?:boolean}) {
 return <section data-download-client-entry className="mb-16 rounded-xl border border-primary/30 bg-primary/[0.05] p-6 text-zinc-300" aria-labelledby="client-entry-heading">
  <h2 id="client-entry-heading" className="text-2xl font-bold text-white">{chinese?'能下载的东西里，有一个是我们自己做的':'One of the downloads here is ours'}</h2>
  <p className="mt-4">{chinese?'DLSS5 Enhance 是我们的桌面窗口：把一批图片丢进去，用同一个账号、同一个模型跑完，逐行看状态，跑完弹出前后对比。它不是 NVIDIA 的 DLSS 5，不安装也不替换任何 NVIDIA 文件，不是 APK，也不是游戏运行时。':'DLSS5 Enhance is our own desktop window: drop a folder of images on it, run the batch through the same account and the same model, watch each row, and open the before/after compare when it finishes. It is not NVIDIA DLSS 5, installs and replaces no NVIDIA file, and is neither an APK nor a game runtime.'}</p>
  <p data-character-style-status className="mt-4">{chinese?'当前 Windows v0.1.1 提供批量云端图片增强。Windows 游戏人物风格转换正在规划，尚未发布；现在可以在线体验。计划流程是选人物图、选五种风格之一、确认额度、生成、对比并保存。':'Windows v0.1.1 currently provides batch cloud image enhancement. Game-character style conversion for Windows is planned and has not shipped; try it online today. The planned flow is to choose a character image and one of five styles, confirm the credit cost, generate, compare and save.'}{' '}<a className="text-primary underline" href="/dashboard?tool=game-character-style&sample=characterStyle">{chinese?'在线试用人物风格转换':'Try character styling online'}</a>{' · '}<a className="text-primary underline" href={CHARACTER_STYLE_SPEC_URL}>{chinese?'Windows 开发需求':'Windows development specification'}</a>{' · '}<a className="text-primary underline" href={CHARACTER_STYLE_CATALOG_PATH}>{chinese?'风格与接口清单（JSON）':'Style and API catalog (JSON)'}</a></p>
  <p className="mt-4">{chinese?'提供 Windows x64 v0.1.1 和 macOS Intel v0.1.0 未签名预览版。客户端不要求本地 RTX 或 WSL，与下方的本地 RTX Studio 内测分开。macOS 首次打开可能需要在「系统设置 → 隐私与安全性」中允许。':'Unsigned previews are available for Windows x64 (v0.1.1) and macOS Intel (v0.1.0). This cloud client needs no local RTX or WSL and is separate from the local RTX Studio beta below. macOS may require approval under System Settings → Privacy & Security on first launch.'}</p>
  <ul className="mt-4 space-y-2">
   <li><a className="text-primary underline" href={WINDOWS_RELEASE.url}>{chinese ? '下载 Windows x64 v0.1.1（.exe，未签名）' : 'Download Windows x64 v0.1.1 (.exe, unsigned)'}</a></li>
   <li><a className="text-primary underline" href={RELEASE}>{chinese?'下载 DLSS5 Enhance 0.1.0（.dmg，未签名）':'Download DLSS5 Enhance 0.1.0 (.dmg, unsigned)'}</a>{chinese?' —— 文件大小 125,711,820 字节。':' — 125,711,820 bytes.'}</li>
   <li><a className="text-primary underline" href={REPO}>{chinese?'源码与发行说明（MIT）':'Source and release notes (MIT)'}</a></li>
   <li><a className="text-primary underline" href={`${chinese?'/zh':''}/visual-enhancer`}>{chinese?'不想装东西：先用浏览器里的免费示例':'No install needed: try the free browser example first'}</a></li>
   <li><a className="text-primary underline" href="https://github.com/wangsheng1991/dlss5-visual-enhancer">{chinese?'先看一组真产物：在本地跑一遍公开示例':'See a real pair first: run the documented example locally'}</a>{chinese?' —— 不登录、不花额度，附两个 SHA-256 和一个对比页。':' — no sign-in, no credits, with both SHA-256 hashes and a compare page.'}</li>
  </ul>
  <p className="mt-4">{chinese?'要登录，按任务计额度（一次任务 1 额度），额度显示在窗口里。我们自己在本机记录过一次：输入 1440×778 → 输出 1536×832 WebP，207,666 字节，用时 14 秒，额度 10 → 9。这是一次实测记录，不是性能基准，也不代表你的机器和你手上的图。':'It needs a signed-in account and spends credits per task (one credit per task); the window shows the balance. On one run on our own machine: 1440×778 in → 1536×832 WebP out, 207,666 bytes, 14 seconds, credits 10 → 9. That is a single recorded run, not a benchmark, and not a prediction for your machine or your images.'}</p>
  <p className="mt-4 text-sm">{chinese?'核对日期：2026-11-02。':'Checked 2026-11-02.'}</p>
 </section>;
}
