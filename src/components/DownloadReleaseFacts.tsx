import { DESKTOP_RELEASE, WINDOWS_RELEASE } from '../content/desktopRelease';

/** One additive, source-linked release record, shared by React and prerendered download pages. */
export default function DownloadReleaseFacts({ chinese = false }: { chinese?: boolean }) {
  const t = (en: string, zh: string) => chinese ? zh : en;
  const releases = [
    {
      ...WINDOWS_RELEASE,
      system: t('Windows x64. ARM and Windows 7/8 are not supported. The release notes do not specify a complete minimum OS version; check them before installing.', 'Windows x64；不支持 ARM 和 Windows 7/8。发行说明没有完整注明最低系统版本，安装前请核对原始说明。'),
      command: `Get-FileHash -Algorithm SHA256 -LiteralPath '.\\${WINDOWS_RELEASE.fileName}'`,
    },
    {
      ...DESKTOP_RELEASE,
      system: t('macOS Intel (x64). This release contains no native Apple Silicon build. The published notes do not state a minimum macOS version.', 'macOS Intel（x64）；该发布不含原生 Apple Silicon 构建。已发布说明未注明最低 macOS 版本。'),
      command: `shasum -a 256 '${DESKTOP_RELEASE.fileName}'`,
    },
  ];
  return <section data-download-release-facts className="mt-8 min-w-0 rounded-xl border border-primary/25 bg-black/20 p-4 sm:p-6" aria-labelledby="release-facts-heading">
    <h3 id="release-facts-heading" className="text-xl font-bold text-white">{t('Published downloads: versions, requirements and checksums', '已发布下载：版本、系统要求与校验')}</h3>
    <p className="mt-3 text-sm leading-relaxed">{t('These are the published DLSS5 Enhance cloud-client previews, not the local RTX Studio beta. Release metadata and the downloaded files were checked on 2026-11-21. Each card links to its own dated release.', '以下是已发布的 DLSS5 Enhance 云端客户端预览版，不是本地 RTX Studio 内测安装包。发布信息与实际下载文件于 2026-11-21 核对；每张卡片均链接到对应的发行记录。')}</p>
    <div className="mt-5 grid gap-5 lg:grid-cols-2">
      {releases.map(release => <article key={release.fileName} className="min-w-0 rounded-lg border border-outline-variant/30 p-4" data-release-file={release.fileName}>
        <h4 className="text-lg font-semibold text-white">{release.platform} · v{release.version}</h4>
        <dl className="mt-4 space-y-3 text-sm leading-relaxed">
          <div><dt className="font-semibold text-white">{t('Release date / status', '发布日期 / 状态')}</dt><dd>{release.publishedAt} · {t('Pre-release · unsigned', '预发布 · 未签名')}</dd></div>
          <div><dt className="font-semibold text-white">{t('File', '文件名')}</dt><dd className="break-all">{release.fileName}</dd></div>
          <div><dt className="font-semibold text-white">{t('Exact download size', '准确下载大小')}</dt><dd>{release.bytes.toLocaleString('en-US')} {t('bytes', '字节')}</dd></div>
          <div><dt className="font-semibold text-white">{t('System / architecture', '系统 / 架构')}</dt><dd>{release.system}</dd></div>
          <div><dt className="font-semibold text-white">SHA-256</dt><dd className="mt-1 break-all font-mono text-xs text-zinc-200">{release.sha256}</dd></div>
        </dl>
        <p className="mt-4 text-sm"><a className="text-primary underline underline-offset-4" href={release.url}>{t('Download this exact file', '下载这个文件')}</a>{' · '}<a className="text-primary underline underline-offset-4" href={release.releaseNotes}>{t('Release notes and assets', '发行说明与附件')}</a></p>
        <p className="mt-4 text-xs text-zinc-400">{t('Check your downloaded file in PowerShell (Windows) or Terminal (macOS):', '下载后用 PowerShell（Windows）或终端（macOS）核对：')}</p>
        <pre className="mt-2 whitespace-pre-wrap break-all rounded bg-black/30 p-3 text-xs"><code>{release.command}</code></pre>
      </article>)}
    </div>
    <p className="mt-5 text-sm leading-relaxed">{t('Downloading these files needs no account. Processing images requires internet access, a website account and available credits; it is not offline inference and needs no local RTX. The RTX, driver, RAM and disk requirements elsewhere on this page describe the separate local Studio workflow, not these cloud clients.', '下载这两个文件不需要账号；处理图片需要联网、本站账号和可用积分，不是离线推理，也不要求本地 RTX。本页其他位置的 RTX、驱动、内存与磁盘要求针对另一个本地 Studio 工作流，不是这两个云端客户端的要求。')}</p>
    <p className="mt-3 text-xs leading-relaxed text-zinc-400">{t('Compare the complete SHA-256 value, not just its beginning. A matching checksum establishes that the file matches this recorded release; it is not a code signature or a security audit. Both are unsigned previews. If your system blocks a file or the hash differs, stop and check the publisher and release record. No Android APK or NVIDIA game runtime is supplied.', '请比对完整 SHA-256，而不是只看开头。哈希一致只说明文件与这份发行记录匹配，不代表代码签名或安全审计。这两个文件均为未签名预览版；如系统阻止文件或哈希不符，请停止并核对发布者与发行记录。这里不提供安卓 APK 或 NVIDIA 游戏运行时。')}</p>
  </section>;
}
