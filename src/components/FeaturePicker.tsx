import { SITE_URL } from '../config/site';
import { FEATURE_PICKER_SLUG } from '../content/featurePicker';
import React, { useEffect, useRef, useState } from 'react';
import { trackEvent } from '../lib/analytics';
import { FEATURES, GOALS, PICKER_COPY, REVIEWED, SOURCES, featureVerdict, type Goal, type Gpu, type Game, type PickerLocale } from '../content/featurePicker';

export default function FeaturePicker({ locale, interactive = true, canonicalPath = `${locale === 'zh' ? '/zh' : ''}/blog/${FEATURE_PICKER_SLUG}` }: { locale: PickerLocale; interactive?: boolean; canonicalPath?: string }) {
  const c = PICKER_COPY[locale];
  const [goal, setGoal] = useState<Goal>('lighting');
  const [gpu, setGpu] = useState<Gpu>('unknown');
  const [game, setGame] = useState<Game>('unknown');
  const [selected, setSelected] = useState({ goal: false, gpu: false, game: false });
  const lastReported = useRef<string | null>(null);
  useEffect(() => {
    if (!interactive || !selected.goal || !selected.gpu || !selected.game) return;
    const combination = `${goal}:${gpu}:${game}`;
    if (lastReported.current === combination) return;
    // Effects run after the result DOM commits; unknown is a valid explicit answer.
    const verdict = [...new Set(GOALS[goal].map(feature => featureVerdict(feature, gpu, game).status))].join('|');
    lastReported.current = combination;
    trackEvent('feature_picker_complete', { goal, gpu, game_in_list: game === 'unknown' ? 'unsure' : game, verdict });
  }, [goal, gpu, game, selected, interactive]);
  const source = (key: keyof typeof SOURCES) => <span className="block mt-2 text-sm">{c.source}: <a className="text-primary underline" href={SOURCES[key].url} rel="noreferrer" onClick={key === 'launch' ? () => trackEvent('feature_picker_source_click', { target: 'nvidia-dlss5' }) : undefined}>{SOURCES[key].label}</a> · {c.reviewed}: <time dateTime={REVIEWED}>{REVIEWED}</time></span>;
  const selectClass = 'block w-full min-w-0 mt-2 rounded border border-zinc-600 bg-zinc-950 p-2 text-white focus-visible:outline-2 focus-visible:outline-primary';
  return <section data-feature-picker lang={locale === 'zh' ? 'zh-CN' : 'en'} aria-labelledby="feature-picker-heading" className="not-prose min-w-0 my-6 rounded-xl border border-zinc-600 bg-surface-low p-4 text-zinc-200" style={{ overflowWrap: 'anywhere' }}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
      '@context': 'https://schema.org', '@graph': [
        { '@type': 'WebPage', '@id': `${SITE_URL}${canonicalPath}#webpage`, url: `${SITE_URL}${canonicalPath}`, breadcrumb: { '@id': `${SITE_URL}${canonicalPath}#breadcrumb` } },
        { '@type': 'BreadcrumbList', '@id': `${SITE_URL}${canonicalPath}#breadcrumb`, itemListElement: [
          { '@type': 'ListItem', position: 1, name: locale === 'zh' ? '博客' : 'Blog', item: `${SITE_URL}${canonicalPath.startsWith('/zh/') ? '/zh' : ''}/blog` },
          { '@type': 'ListItem', position: 2, name: locale === 'zh' ? 'DLSS / FSR 对比' : 'DLSS / FSR comparison', item: `${SITE_URL}${canonicalPath}` },
        ] },
      ],
    }).replace(/</g, '\\u003c') }} />
    <h2 id="feature-picker-heading" className="text-xl font-bold text-white">{c.heading}</h2>
    <p className="mt-2 text-sm">{c.intro}</p>
    <p id="feature-picker-scope" className="mt-2 text-sm">{c.scope} {source('launch')}</p>
    {interactive && <>
      <div className="grid min-w-0 gap-4 my-4" aria-describedby="feature-picker-scope">
        <label>{c.goal}<select className={selectClass} value={goal} onChange={e => { setGoal(e.target.value as Goal); setSelected(previous => ({ ...previous, goal: true })); }}>{Object.entries(c.goals).map(([v, label]) => <option key={v} value={v}>{label}</option>)}</select></label>
        <label>{c.gpu}<select className={selectClass} value={gpu} onChange={e => { setGpu(e.target.value as Gpu); setSelected(previous => ({ ...previous, gpu: true })); }}>{(['50', '40', '30', 'earlier', 'unknown'] as const).map(v => <option key={v} value={v}>{c.gpus[v]}</option>)}</select></label>
        <label>{c.game}<select className={selectClass} value={game} onChange={e => { setGame(e.target.value as Game); setSelected(previous => ({ ...previous, game: true })); }}>{Object.entries(c.games).map(([v, label]) => <option key={v} value={v}>{label}</option>)}</select></label>
      </div>
      <div aria-live="polite" aria-atomic="true" data-feature-results>
        <h3 className="font-bold">{c.result}</h3>
        <ul className="space-y-3 mt-3">{GOALS[goal].map(feature => {
          const verdict = featureVerdict(feature, gpu, game);
          return <li key={feature} data-support={verdict.status} className="rounded border border-zinc-700 p-3">
            <strong>{FEATURES[feature][locale]} — {c.status[verdict.status]}</strong>
            <p className="mt-2 text-sm">{c[verdict.reason]}</p>
            <p className="mt-2 text-sm">{feature === 'fsr' ? c.whereFsr : c.where}</p>{source(verdict.source)}
          </li>;
        })}</ul>
      </div>
    </>}
    <table className="w-full table-fixed mt-5 text-left text-sm border-collapse">
      <caption className="text-left font-bold mb-2">{c.table}</caption>
      <thead><tr><th scope="col" className="w-1/3 p-2 align-top">{c.feature}</th><th scope="col" className="p-2 align-top">{c.evidence}</th></tr></thead>
      <tbody>
        <tr className="border-t border-zinc-600"><th scope="row" className="p-2 align-top">{locale === 'zh' ? 'DLSS 5 / 超分 / 帧生成' : 'DLSS 5 / Super Resolution / Frame Generation'}</th><td className="p-2">{c.staticConfirmed}<p className="mt-2">{c.where}</p>{source('launch')}</td></tr>
        <tr className="border-t border-zinc-600"><th scope="row" className="p-2 align-top">{FEATURES.fg[locale]} / {FEATURES.mfg[locale]}</th><td className="p-2">{c.staticHardware}{source('dlss4')}</td></tr>
        <tr className="border-t border-zinc-600"><th scope="row" className="p-2 align-top">{FEATURES.rr[locale]}</th><td className="p-2">{c.staticUnknown}{source('dlss4')}</td></tr>
        <tr className="border-t border-zinc-600"><th scope="row" className="p-2 align-top">{FEATURES.fsr[locale]}</th><td className="p-2">{c.staticUnknown}<p className="mt-2">{c.whereFsr}</p>{source('fsr')}</td></tr>
      </tbody>
    </table>
  </section>;
}
