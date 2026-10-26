/** Additive answer; identical copy is rendered on the client and at build time. */
export default function DownloadApkAnswer({chinese=false}: {chinese?:boolean}) {
 const prefix=chinese?'/zh':'';
 return <section data-download-apk-answer className="mb-16 rounded-xl border border-outline-variant/30 p-6 text-zinc-300" aria-labelledby="apk-answer-heading">
  <h2 id="apk-answer-heading" className="text-2xl font-bold text-white">{chinese?'DLSS 5 APK 到底有没有？':'Is there a DLSS 5 APK to download?'}</h2>
  <p className="mt-4">{chinese?'NVIDIA 不以 Android APK 形式发行 DLSS 5，本站也不提供任何 DLSS 5 APK 或独立运行时安装包；网上流传的“DLSS 5 APK”不是 NVIDIA 发布的文件。':'NVIDIA does not distribute DLSS 5 as an Android APK. This site provides no DLSS 5 APK or standalone runtime installer; files circulating as “DLSS 5 APK” are not NVIDIA releases.'}</p>
  <p className="mt-4">{chinese?'安卓和其他手机用户可以免登录运行':'Android and other phone users can run the '}<a className="text-primary underline" href={`${prefix}/visual-enhancer`}>{chinese?'浏览器里的免费图片示例':'free browser image example without signing in'}</a>{chinese?'，无需安装 APK。Windows 用户请在本页提交 Studio 申请，由人工核对后回信；这是本站独立软件的申请流程，不是 NVIDIA 游戏运行时下载。':', with no APK installation. Windows users can submit a Studio request on this page for manual review and an email reply. This is a request for our independent software, not a download of NVIDIA’s game runtime.'}</p>
  <p className="mt-4">{chinese?'通用风险提示：第三方下载可能含捆绑内容或触发游戏反作弊，请自行判断。':'General risk notice: third-party downloads may include bundled content or trigger game anti-cheat systems; use your own judgment.'}</p>
  <ul className="mt-4 space-y-2">
   <li><a className="text-primary underline" href={`${prefix}/dlss-5-apk`}>{chinese?'查看 DLSS 5 APK 与安卓可用性事实。':'Read the DLSS 5 APK and Android availability facts.'}</a></li>
   <li><a className="text-primary underline" href="/dlss-checker">{chinese?'核对 DLSS 显卡兼容性（英文检测器）。':'Check DLSS GPU compatibility before choosing a workflow.'}</a></li>
   <li><a className="text-primary underline" href={`${prefix}/studio-beta`}>{chinese?'了解 Windows Studio 的申请与人工回信流程。':'See the Windows Studio request and email-reply path.'}</a></li>
  </ul>
  <p className="mt-4 text-sm">{chinese?'技术范围来源：':'Technology scope: '}<a className="text-primary underline" href="https://developer.nvidia.com/rtx/dlss">NVIDIA DLSS</a>{chinese?'；核对日期：2026-10-26。':' · Checked 2026-10-26.'}</p>
 </section>;
}
