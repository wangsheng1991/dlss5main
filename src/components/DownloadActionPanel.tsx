import { Link } from 'react-router-dom';
import { Download, Monitor, Play } from 'lucide-react';
import { STUDIO_COPY } from '../content/studioPage';
import kit from '../content/reviewKit.json';
import { trackEvent } from '../lib/analytics';
import { DESKTOP_RELEASE, WINDOWS_RELEASE } from '../content/desktopRelease';

export default function DownloadActionPanel({ chinese }: { chinese: boolean }) {
  const copy = STUDIO_COPY[chinese ? 'zh-CN' : 'en-US'];
  const t = (key: keyof typeof copy) => copy[key];
  const button = 'flex min-h-[48px] w-full items-center justify-center gap-2 rounded-lg px-3 py-3 text-center text-sm leading-5 focus-visible:outline-2 focus-visible:outline-offset-4';
  return <div data-download-action-panel className="mt-4">
    <p className="mb-2 text-sm font-semibold text-white">{t('hero.action.title')}</p>
    <div className="grid gap-3 sm:grid-cols-3">
      <article className="rounded-xl border border-nvidia-green/40 bg-nvidia-green/5 p-4 flex flex-col">
        <p className="text-xs text-nvidia-green">{t('hero.action.desktop.status')}</p>
        <h2 className="mt-2 font-bold text-white">{DESKTOP_RELEASE.name}</h2>
        <p className="mt-2 mb-4 text-sm leading-relaxed text-zinc-400">{t('hero.action.desktop.note')}</p>
        <a data-action="windows" href={WINDOWS_RELEASE.url} className={`${button} mt-auto bg-nvidia-green text-black font-bold hover:bg-nvidia-green/90`} onClick={() => trackEvent('download_click', { file: WINDOWS_RELEASE.fileName, surface: 'download_hero' })}>
          <Download className="h-4 w-4 shrink-0" aria-hidden="true" /><span>{chinese ? '下载 Windows x64 · v0.1.1' : 'Download Windows x64 · v0.1.1'}</span>
        </a>
        <a data-action="desktop" href={DESKTOP_RELEASE.url} className={`${button} mt-2 border border-nvidia-green/50 text-nvidia-green hover:bg-nvidia-green/10`} onClick={() => trackEvent('download_click', { file: DESKTOP_RELEASE.fileName, surface: 'download_hero' })}>
          <Download className="h-4 w-4 shrink-0" aria-hidden="true" /><span>{t('hero.action.desktop')}</span>
        </a>
      </article>
      <article className="rounded-xl border border-outline-variant/30 bg-surface-low p-4 flex flex-col">
        <p className="text-xs text-zinc-400">{t('hero.action.browser.status')}</p>
        <h2 className="mt-2 font-bold text-white">{t('hero.action.browser.title')}</h2>
        <p className="mt-2 mb-4 text-sm leading-relaxed text-zinc-400">{t('hero.action.browser.note')}</p>
        <Link data-action="browser" to="/dashboard?tool=game-character-style&sample=characterStyle" className={`${button} mt-auto border border-outline-variant/30 text-white hover:bg-surface-high`} onClick={() => trackEvent('tool_cta_click', { tool: 'game-character-style', surface: 'download_hero' })}>
          <Play className="h-4 w-4 shrink-0" aria-hidden="true" /><span>{t('hero.action.browser')}</span>
        </Link>
      </article>
      <article className="rounded-xl border border-outline-variant/30 bg-surface-low p-4 flex flex-col">
        <p className="text-xs text-zinc-400">{t('hero.action.studio.status')}</p>
        <h2 className="mt-2 font-bold text-white">DLSS5 Studio</h2>
        <p className="mt-2 mb-4 text-sm leading-relaxed text-zinc-400">{t('hero.action.studio.note')}</p>
        <Link data-action="studio" to={chinese ? '/zh/studio-beta' : '/studio-beta'} className={`${button} mt-auto border border-outline-variant/30 text-white hover:bg-surface-high`} onClick={() => trackEvent('studio_request_click', { surface: 'download_hero' })}>
          <Monitor className="h-4 w-4 shrink-0" aria-hidden="true" /><span>{t('hero.action.studio')}</span>
        </Link>
      </article>
    </div>
    <p className="mt-3 text-xs leading-relaxed text-zinc-500">{t('hero.action.note')}{' '}<a className="text-primary underline" href={chinese ? '/zh/dlss-5-apk' : '/dlss-5-apk'}>{t('hero.action.apk')}</a></p>
    <a data-action="kit" href={kit.path} download="dlss5-style-recipe-kit-v2.zip" className="mt-3 inline-block text-sm text-zinc-400 underline hover:text-white" onClick={() => trackEvent('download_click', { file: 'recipe-kit-v2', surface: 'download_hero' })}>{t('hero.action.kit')}</a>
  </div>;
}
