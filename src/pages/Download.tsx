import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Gauge,
  Layers,
  Mail,
  Monitor,
  Package,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import SEO from '../components/SEO';
import StudioRequest from '../components/StudioRequest';
import { STUDIO_COPY } from '../content/studioPage';
import { STUDIO_REQUEST_COPY } from '../content/studioRequest';
import { SITE_URL } from '../config/site';

/**
 * `/download` doubles as the DLSS5 Studio product page.
 *
 * Two jobs, in this order: explain what the tool is (real captures, measured numbers, requirements),
 * and hand the request mailbox to a registered visitor — the build itself is never posted as a file
 * and never mirrored here. Copy comes from `content/studioPage.ts` (extracted from the finished
 * landing page) plus `content/studioRequest.ts` (the request gate and the honesty block).
 */

const STUDIO_SHOTS = {
  hero: { src: '/studio/studio-overview.jpg', width: 1440, height: 794 },
  live: { src: '/studio/live-panel.jpg', width: 1424, height: 789 },
  video: { src: '/studio/studio-video-compare.jpg', width: 1440, height: 772 },
  diff: { src: '/studio/studio-diff.jpg', width: 1440, height: 772 },
  keys: { src: '/studio/studio-shortcuts.jpg', width: 1440, height: 772 },
};

/** The Live table, measured on the test machine — kept in one place so a re-run updates one line. */
const LIVE_ROWS = [
  { cap: '480p', frame: '108 ms', fps: '8.5 fps', ok: true, key: '480p' },
  { cap: '720p', frame: '197 ms', fps: '4.7 fps', ok: true, key: '720p' },
  { cap: '1080p', frame: '391 ms', fps: '2.4 fps', ok: false, key: '1080p' },
  { capKey: 'live.row.scale', frame: '63 ms', fps: '13.3 fps', ok: true, key: 'scale' },
];

const REQUIREMENTS = ['os', 'gpu', 'driver', 'ram', 'disk', 'browser', 'engine'] as const;
const FEATURES = [1, 2, 3, 4, 5, 6, 7, 8] as const;

const stripTags = (value: string) => value.replace(/<[^>]+>/g, '');

export default function Download() {
  const { i18n } = useTranslation();
  const locale: 'en-US' | 'zh-CN' = i18n.language?.startsWith('zh') ? 'zh-CN' : 'en-US';
  const isZh = locale === 'zh-CN';

  // English first, the reader's language on top of it: a key that only exists in one of the two
  // request tables still resolves instead of rendering as a raw key name.
  const copy: Record<string, string> = {
    ...(STUDIO_COPY['en-US'] as unknown as Record<string, string>),
    ...(STUDIO_COPY[locale] as unknown as Record<string, string>),
    ...(STUDIO_REQUEST_COPY['en-US'] as unknown as Record<string, string>),
    ...(STUDIO_REQUEST_COPY[locale] as unknown as Record<string, string>),
  };
  const t = (key: string) => copy[key] ?? key;
  const rich = (key: string) => ({ dangerouslySetInnerHTML: { __html: t(key) } });

  const faqIndexes = [1, 2, 3, 4, 5, 6, 7, 8];

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        name: 'DLSS5 Studio',
        applicationCategory: 'MultimediaApplication',
        operatingSystem: 'Windows 10, Windows 11',
        softwareVersion: '12.0',
        description: t('meta.desc'),
        url: `${SITE_URL}/download`,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      },
      {
        '@type': 'FAQPage',
        mainEntity: faqIndexes.map((n) => ({
          '@type': 'Question',
          name: stripTags(t(`faq.q${n}`)),
          acceptedAnswer: { '@type': 'Answer', text: stripTags(t(`faq.a${n}`)) },
        })),
      },
    ],
  };

  return (
    <main className="pt-32 pb-24 px-6 max-w-[1100px] mx-auto">
      <SEO
        title={t('meta.title')}
        description={t('meta.desc')}
        canonical="/download"
        language={locale}
        keywords={['dlss 5 studio', 'dlss 5 download', 'dlss 5 neural rendering tool', 'local dlss pipeline']}
        structuredData={structuredData}
      />

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="mb-14">
        <p className="text-nvidia-green text-xs font-label uppercase tracking-widest mb-4">{t('hero.eyebrow')}</p>
        <h1
          className="text-3xl md:text-5xl font-headline font-bold text-white leading-tight mb-5 [&_em]:not-italic [&_em]:text-nvidia-green"
          {...rich('hero.h1')}
        />
        <p className="text-zinc-400 text-lg leading-relaxed max-w-3xl">{t('hero.sub')}</p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a
            href="#request"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-nvidia-green text-black font-bold rounded-xl hover:bg-nvidia-green/90 transition-colors"
          >
            <Mail className="w-5 h-5" aria-hidden="true" />
            {t('request.ctaHero')}
          </a>
          <a
            href="#features"
            className="inline-flex items-center gap-2 px-6 py-3.5 border border-outline-variant/30 text-white font-semibold rounded-xl hover:bg-surface-high transition-colors"
          >
            {t('hero.ctaSecondary')}
          </a>
        </div>

        <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-zinc-500">
          <li>{t('hero.meta.os')}</li>
          <li>{t('hero.meta.gpu')}</li>
          <li className="text-zinc-400">{t('request.meta')}</li>
        </ul>

        <figure className="mt-10">
          <img
            src={STUDIO_SHOTS.hero.src}
            width={STUDIO_SHOTS.hero.width}
            height={STUDIO_SHOTS.hero.height}
            alt={t('hero.shot.alt')}
            className="w-full rounded-2xl border border-outline-variant/20"
          />
          <figcaption className="mt-3 text-sm text-zinc-500">{t('hero.shot.cap')}</figcaption>
        </figure>
      </section>

      {/* ── 索取下载（注册后可见邮箱 + 一键发信） ─────────────────────── */}
      <section id="request" className="mb-16 scroll-mt-28">
        <h2 className="sr-only">{t('request.anchor')}</h2>
        <StudioRequest t={t} />
      </section>

      {/* ── 你要找的是哪个 DLSS ──────────────────────────────────────── */}
      <section id="which" className="mb-16 scroll-mt-28">
        <p className="text-nvidia-green text-xs font-label uppercase tracking-widest mb-3">{t('which.eyebrow')}</p>
        <h2 className="text-2xl md:text-3xl font-headline font-bold text-white mb-3">{t('which.title')}</h2>
        <p className="text-zinc-400 leading-relaxed max-w-3xl">{t('which.sub')}</p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-6 bg-surface-low rounded-2xl border border-outline-variant/20">
            <span className="inline-block text-[11px] font-label uppercase tracking-widest text-zinc-500 mb-3">
              {t('which.official.tag')}
            </span>
            <h3 className="text-white font-bold text-lg mb-3">{t('which.official.title')}</h3>
            <p className="text-sm text-zinc-400 leading-relaxed [&_code]:font-mono [&_code]:text-zinc-300" {...rich('which.official.body')} />
            <a
              href="https://www.nvidia.com/en-us/geforce/news/dlss-5-3d-guided-neural-rendering/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-5 text-sm text-primary hover:underline"
            >
              {t('which.official.cta')}
              <ExternalLink className="w-4 h-4" aria-hidden="true" />
            </a>
          </div>

          <div className="p-6 rounded-2xl border border-nvidia-green/25 bg-nvidia-green/[0.06]">
            <span className="inline-block text-[11px] font-label uppercase tracking-widest text-nvidia-green mb-3">
              {t('which.mine.tag')}
            </span>
            <h3 className="text-white font-bold text-lg mb-3">{t('which.mine.title')}</h3>
            <p className="text-sm text-zinc-300 leading-relaxed">{t('which.mine.body')}</p>
            <a href="#request" className="inline-flex items-center gap-2 mt-5 text-sm text-nvidia-green hover:underline">
              {t('which.mine.cta')}
            </a>
          </div>
        </div>
      </section>

      {/* ── 功能 ─────────────────────────────────────────────────────── */}
      <section id="features" className="mb-16 scroll-mt-28">
        <p className="text-nvidia-green text-xs font-label uppercase tracking-widest mb-3">{t('feat.eyebrow')}</p>
        <h2 className="text-2xl md:text-3xl font-headline font-bold text-white mb-3">{t('feat.title')}</h2>
        <p className="text-zinc-400 leading-relaxed max-w-3xl">{t('feat.sub')}</p>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map((n) => (
            <article key={n} className="p-5 bg-surface-low rounded-xl border border-outline-variant/20">
              <h3 className="text-white font-bold mb-2">{t(`feat.${n}.t`)}</h3>
              <p
                className="text-sm text-zinc-400 leading-relaxed [&_code]:font-mono [&_code]:text-zinc-300 [&_strong]:text-zinc-200"
                {...rich(`feat.${n}.d`)}
              />
            </article>
          ))}
        </div>
      </section>

      {/* ── Live 实测 ────────────────────────────────────────────────── */}
      <section id="live" className="mb-16 scroll-mt-28">
        <p className="text-nvidia-green text-xs font-label uppercase tracking-widest mb-3">{t('live.eyebrow')}</p>
        <h2 className="text-2xl md:text-3xl font-headline font-bold text-white mb-3">{t('live.title')}</h2>
        <p className="text-zinc-400 leading-relaxed max-w-3xl [&_strong]:text-zinc-200" {...rich('live.sub')} />

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <div>
            <div className="overflow-x-auto rounded-xl border border-outline-variant/20">
              <table className="w-full text-left">
                <caption className="px-5 py-3 text-xs text-zinc-500 text-left border-b border-outline-variant/20">
                  {t('live.table.cap')}
                </caption>
                <thead>
                  <tr className="bg-surface-high border-b border-outline-variant/20">
                    {['live.th.cap', 'live.th.frame', 'live.th.fps', 'live.th.buffer'].map((key) => (
                      <th key={key} scope="col" className="px-4 py-3 text-xs font-label uppercase tracking-widest text-primary">
                        {t(key)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {LIVE_ROWS.map((row) => (
                    <tr key={row.key} className="hover:bg-surface-low transition-colors">
                      <th scope="row" className="px-4 py-3 text-sm text-white font-medium">
                        {row.capKey ? t(row.capKey) : row.cap}
                      </th>
                      <td className="px-4 py-3 text-sm text-zinc-300 font-mono">{row.frame}</td>
                      <td className="px-4 py-3 text-sm text-zinc-300 font-mono">{row.fps}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={row.ok ? 'text-nvidia-green' : 'text-amber-400'}>
                          {row.ok ? t('live.ok') : t('live.bad')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-5 p-5 rounded-xl border border-amber-500/25 bg-amber-500/[0.07]">
              <p className="text-sm text-zinc-300 leading-relaxed">
                <strong className="text-white">{t('live.note.lead')}</strong> {t('live.note.body')}
              </p>
              <p className="mt-3 text-sm text-zinc-400 leading-relaxed">{t('live.note.badge')}</p>
            </div>

            <ul className="mt-5 space-y-2 text-sm text-zinc-400 [&_strong]:text-zinc-200">
              <li {...rich('live.fact.input')} />
              <li {...rich('live.fact.screen')} />
              <li>{t('live.fact.hls')}</li>
            </ul>
          </div>

          <figure>
            <img
              src={STUDIO_SHOTS.live.src}
              width={STUDIO_SHOTS.live.width}
              height={STUDIO_SHOTS.live.height}
              loading="lazy"
              decoding="async"
              alt={t('live.shot.alt')}
              className="w-full rounded-2xl border border-outline-variant/20"
            />
            <figcaption className="mt-3 text-sm text-zinc-500">{t('live.shot.cap')}</figcaption>
          </figure>
        </div>
      </section>

      {/* ── 界面截图 ─────────────────────────────────────────────────── */}
      <section id="shots" className="mb-16 scroll-mt-28">
        <p className="text-nvidia-green text-xs font-label uppercase tracking-widest mb-3">{t('shots.eyebrow')}</p>
        <h2 className="text-2xl md:text-3xl font-headline font-bold text-white mb-3">{t('shots.title')}</h2>
        <p className="text-zinc-400 leading-relaxed max-w-3xl">{t('shots.sub')}</p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-5">
          {([
            ['video', STUDIO_SHOTS.video],
            ['diff', STUDIO_SHOTS.diff],
            ['keys', STUDIO_SHOTS.keys],
          ] as const).map(([id, shot]) => (
            <figure key={id}>
              <img
                src={shot.src}
                width={shot.width}
                height={shot.height}
                loading="lazy"
                decoding="async"
                alt={t(`shots.${id}.alt`)}
                className="w-full rounded-xl border border-outline-variant/20"
              />
              <figcaption className="mt-2.5 text-sm text-zinc-500">{t(`shots.${id}.cap`)}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ── 效果对比（等真实素材） ───────────────────────────────────── */}
      <section id="showcase" className="mb-16 scroll-mt-28">
        <h2 className="text-2xl md:text-3xl font-headline font-bold text-white mb-4">{t('showcase.title')}</h2>
        <div className="rounded-2xl border border-dashed border-outline-variant/40 bg-surface-low p-8 text-center">
          <Sparkles className="w-6 h-6 text-zinc-500 mx-auto mb-3" aria-hidden="true" />
          <p className="text-sm text-zinc-400 leading-relaxed max-w-2xl mx-auto">{t('showcase.pending')}</p>
        </div>
      </section>

      {/* ── 系统要求 ─────────────────────────────────────────────────── */}
      <section id="requirements" className="mb-16 scroll-mt-28">
        <p className="text-nvidia-green text-xs font-label uppercase tracking-widest mb-3">{t('req.eyebrow')}</p>
        <h2 className="text-2xl md:text-3xl font-headline font-bold text-white mb-3">{t('req.title')}</h2>
        <p className="text-zinc-400 leading-relaxed max-w-3xl">{t('req.sub')}</p>

        <dl className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          {REQUIREMENTS.map((key) => (
            <div key={key} className="p-5 bg-surface-low rounded-xl border border-outline-variant/20">
              <dt className="flex items-center gap-2 text-white font-bold mb-1.5">
                {key === 'os' && <Monitor className="w-4 h-4 text-zinc-400" aria-hidden="true" />}
                {key === 'gpu' && <Layers className="w-4 h-4 text-zinc-400" aria-hidden="true" />}
                {key === 'driver' && <Gauge className="w-4 h-4 text-zinc-400" aria-hidden="true" />}
                {key === 'disk' && <Package className="w-4 h-4 text-zinc-400" aria-hidden="true" />}
                {key === 'engine' && <ShieldCheck className="w-4 h-4 text-zinc-400" aria-hidden="true" />}
                {t(`req.${key}.t`)}
              </dt>
              <dd className="text-sm text-zinc-400 leading-relaxed">{t(`req.${key}.d`)}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ── 它不做什么 ───────────────────────────────────────────────── */}
      <section id="honest" className="mb-16 scroll-mt-28">
        <h2 className="text-2xl md:text-3xl font-headline font-bold text-white mb-4 flex items-center gap-2.5">
          <AlertTriangle className="w-6 h-6 text-amber-400" aria-hidden="true" />
          {t('honest.title')}
        </h2>
        <ul className="space-y-3">
          {[1, 2, 3, 4].map((n) => (
            <li key={n} className="flex items-start gap-3 p-4 bg-surface-low rounded-xl border border-outline-variant/20">
              <CheckCircle2 className="w-5 h-5 text-zinc-500 shrink-0 mt-0.5" aria-hidden="true" />
              <span className="text-sm text-zinc-300 leading-relaxed">{t(`honest.${n}`)}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────── */}
      <section id="faq" className="mb-16 scroll-mt-28">
        <p className="text-nvidia-green text-xs font-label uppercase tracking-widest mb-3">{t('faq.eyebrow')}</p>
        <h2 className="text-2xl md:text-3xl font-headline font-bold text-white mb-6">{t('faq.title')}</h2>
        <div className="space-y-4">
          {faqIndexes.map((n) => (
            <details key={n} className="group bg-surface-low rounded-xl border border-outline-variant/20 overflow-hidden">
              <summary className="flex items-center justify-between cursor-pointer p-5 text-white font-medium hover:bg-surface-highest transition-colors list-none">
                <span>{t(`faq.q${n}`)}</span>
                <span className="text-zinc-500 group-open:rotate-180 transition-transform shrink-0" aria-hidden="true">
                  ⌄
                </span>
              </summary>
              <div
                className="px-5 pb-5 text-zinc-300 text-sm leading-relaxed border-t border-outline-variant/10 pt-4 [&_code]:font-mono [&_code]:text-zinc-200 [&_strong]:text-white"
                {...rich(`faq.a${n}`)}
              />
            </details>
          ))}
        </div>
      </section>

      {/* ── 底部 CTA + 免责 ─────────────────────────────────────────── */}
      <section className="text-center p-8 bg-gradient-to-br from-nvidia-green/10 to-primary/5 rounded-2xl border border-nvidia-green/20">
        <h2 className="text-2xl font-headline font-bold text-white mb-3">{t('dl.title')}</h2>
        <p className="text-zinc-400 mb-6 max-w-2xl mx-auto">{t('request.meta')}</p>
        <a
          href="#request"
          className="inline-flex items-center gap-2 px-8 py-4 bg-nvidia-green text-black text-lg font-bold rounded-xl hover:bg-nvidia-green/90 transition-colors"
        >
          <Mail className="w-5 h-5" aria-hidden="true" />
          {t('request.ctaHero')}
        </a>
        <p className="mt-6 text-xs text-zinc-500 leading-relaxed max-w-2xl mx-auto">
          {t('foot.legal')} {t('foot.engine')} {t('foot.year')}
        </p>
        <p className="mt-3 text-xs text-zinc-600">
          {isZh
            ? '第三方组件（含 GPL 组件 ffmpeg / mpv）的许可与源码获取途径随包提供，细节可在索取邮件里询问。'
            : 'Third-party components, including the GPL build of ffmpeg and mpv, ship with their licence and source-access information; ask in the request email for the details.'}
        </p>
        <Link to="/dashboard" className="inline-block mt-5 text-sm text-primary hover:underline">
          {isZh ? '不想等邮件？先在浏览器里试用在线工具' : 'Do not want to wait for an email? Try the browser tools instead'}
        </Link>
      </section>
    </main>
  );
}
