import { Link } from 'react-router-dom';
import { Download, Monitor, Play } from 'lucide-react';
import { STUDIO_COPY } from '../content/studioPage';
import kit from '../content/reviewKit.json';
import { trackEvent } from '../lib/analytics';

export default function DownloadActionPanel({ chinese }: { chinese: boolean }) {
  const copy = STUDIO_COPY[chinese ? 'zh-CN' : 'en-US'];
  const t = (key: keyof typeof copy) => copy[key];
  const button = 'flex min-h-[48px] w-full items-center justify-center gap-2 rounded-lg px-3 py-3 text-center text-sm leading-5 focus-visible:outline-2 focus-visible:outline-offset-4';
  return <div data-download-action-panel className="mt-4">
    <p className="mb-2 text-sm font-semibold text-white">{t('hero.action.title')}</p>
    <div className="grid gap-2 sm:grid-cols-3">
      <Link data-action="browser" to="/dashboard?tool=game-character-style&sample=characterStyle" className={`${button} bg-nvidia-green text-black font-bold`} onClick={() => trackEvent('tool_cta_click', { tool: 'game-character-style', surface: 'download_hero' })}>
        <Play className="h-4 w-4 shrink-0" aria-hidden="true" /><span>{t('hero.action.browser')}</span>
      </Link>
      <a data-action="kit" href={kit.path} download="dlss5-style-recipe-kit-v2.zip" className={`${button} border border-outline-variant/30 text-white`} onClick={() => trackEvent('download_click', { file: 'recipe-kit-v2', surface: 'download_hero' })}>
        <Download className="h-4 w-4 shrink-0" aria-hidden="true" /><span>{t('hero.action.kit')}</span>
      </a>
      <a data-action="studio" href="#request" className={`${button} border border-outline-variant/30 text-white`} onClick={() => trackEvent('studio_request_click', { surface: 'download_hero' })}>
        <Monitor className="h-4 w-4 shrink-0" aria-hidden="true" /><span>{t('hero.action.studio')}</span>
      </a>
    </div>
    <p className="mt-2 text-xs text-zinc-500">{t('hero.action.note')}{' '}<a className="text-primary underline" href={chinese ? '/zh/dlss-5-apk' : '/dlss-5-apk'}>{t('hero.action.apk')}</a></p>
  </div>;
}
