/**
 * The case book beside the studio: real input → output pairs for the tool the reader is on.
 *
 * It has one job — let somebody see what a tool does at which settings, and where it stops, without
 * spending a credit first. So it never summarises: it shows the run, names its controls, prints the
 * geometry the service really returned and the time it really took, and keeps the honest limit of
 * each case beside it.
 *
 * Browsing the panel never touches the studio. Loading a case does, which is why the button is
 * disabled while a generation is running: the images and controls underneath must not change
 * mid-task.
 */

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, ExternalLink, Loader2, MousePointerClick } from 'lucide-react';
import { SHOWCASE_NOTE, casesForTool, showcaseTools, type ShowcaseCase } from '../config/showcase';
import { TOOL_SUMMARY, isToolId, type ToolId } from '../config/tools';
import type { GenerationMode } from '../features/generation/operation';

type Props = {
  /** The tool the studio is on. The panel follows it until the reader browses another one. */
  mode: GenerationMode;
  signedIn: boolean;
  /** A generation is running, so the studio must not be rewritten underneath it. */
  locked: boolean;
  onUse: (entry: ShowcaseCase) => Promise<void>;
};

const THUMB = 'w-full h-20 xl:h-16 object-contain rounded bg-black/30 border border-outline-variant/20';
const CAPTION = 'text-[10px] leading-tight text-zinc-500 break-words';

function CaseCard({ entry, signedIn, locked, onUse }: { entry: ShowcaseCase; signedIn: boolean; locked: boolean; onUse: (entry: ShowcaseCase) => Promise<void> }) {
  const { t } = useTranslation();
  const [pending, setPending] = useState(false);
  const load = async () => {
    setPending(true);
    try { await onUse(entry); } finally { setPending(false); }
  };
  return (
    <article className="rounded-lg border border-outline-variant/20 bg-surface-lowest/60 p-3 flex flex-col gap-3">
      <header>
        <h4 className="text-sm text-white">{entry.title}</h4>
        <ul className="mt-2 flex flex-wrap gap-1">
          {entry.choices.map(choice => <li key={choice} className="text-[10px] leading-tight px-2 py-1 rounded bg-surface-highest text-zinc-300 border border-outline-variant/20">{choice}</li>)}
        </ul>
      </header>
      {/* `contain` rather than `cover`: a cropped before/after would misstate what changed. */}
      <div className="flex items-center gap-2">
        <div className="flex gap-2 flex-1 min-w-0">
          {entry.inputs.map(input => <figure key={input.src + input.label} className="flex flex-col gap-1 flex-1 min-w-0">
            <img src={input.src} alt={`${input.label} — an input of this case`} loading="lazy" className={THUMB}/>
            <figcaption className={CAPTION}>{input.label}</figcaption>
          </figure>)}
        </div>
        <ArrowRight className="w-4 h-4 text-zinc-500 shrink-0" aria-hidden="true"/>
        <figure className="flex flex-col gap-1 flex-1 min-w-0">
          <img src={entry.output.src} alt={`${entry.output.label} — the output of this case`} loading="lazy" className={THUMB}/>
          <figcaption className={CAPTION}>{entry.output.label}</figcaption>
        </figure>
      </div>
      <p className="text-[11px] text-zinc-400">{t('dashboard.showcaseMeasured', { seconds: entry.seconds, width: entry.output.width, height: entry.output.height })}</p>
      <div>
        <p className="text-[10px] font-label uppercase tracking-widest text-zinc-500 mb-1">{t('dashboard.showcaseLook')}</p>
        <ul className="text-xs text-zinc-300 space-y-1 list-disc pl-4">{entry.look.map(point => <li key={point}>{point}</li>)}</ul>
      </div>
      {entry.limit && <p className="text-xs text-zinc-500">{t('dashboard.showcaseLimit', { limit: entry.limit })}</p>}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        {entry.output.file && <a href={entry.output.file} target="_blank" rel="noreferrer" className="text-xs text-primary inline-flex items-center gap-1">{entry.output.fileLabel || t('dashboard.showcaseOpenFile')}<ExternalLink className="w-3 h-3"/></a>}
        {signedIn
          ? <button type="button" disabled={locked || pending} onClick={() => void load()} className="text-xs px-3 py-2 rounded-lg border border-primary/40 text-primary hover:bg-primary/10 disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center gap-1">{pending ? <Loader2 className="w-3 h-3 animate-spin"/> : <MousePointerClick className="w-3 h-3"/>}{pending ? t('dashboard.showcaseLoading') : t('dashboard.showcaseLoad')}</button>
          : <Link to="/login" className="text-xs px-3 py-2 rounded-lg border border-outline-variant/30 text-zinc-300 hover:border-primary/40">{t('dashboard.showcaseSignIn')}</Link>}
      </div>
    </article>
  );
}

export default function ShowcasePanel({ mode, signedIn, locked, onUse }: Props) {
  const { t } = useTranslation();
  // Follow the studio until the reader browses another tool here; switching the studio resets that.
  const [browsing, setBrowsing] = useState<ToolId | null>(null);
  useEffect(() => { setBrowsing(null); }, [mode]);
  const tools = showcaseTools();
  const active = browsing ?? (isToolId(mode) && casesForTool(mode).length ? mode : tools[0].id);
  const entries = casesForTool(active);
  return (
    <section aria-labelledby="showcase-heading" className="bg-surface-low rounded-xl border border-outline-variant/20 p-4 sm:p-6 h-fit">
      <h2 id="showcase-heading" className="text-xs font-label uppercase tracking-widest text-zinc-400">{t('dashboard.showcaseHeading')}</h2>
      <p className="text-xs text-zinc-400 mt-2">{SHOWCASE_NOTE}</p>
      <div className="mt-4 flex flex-wrap gap-2" role="tablist" aria-label={t('dashboard.showcaseTabs')}>
        {tools.map(tool => <button key={tool.id} type="button" role="tab" aria-selected={active === tool.id} onClick={() => setBrowsing(tool.id)} className={active === tool.id ? 'px-3 py-2 rounded-lg text-xs bg-primary/15 border border-primary/40 text-primary font-semibold' : 'px-3 py-2 rounded-lg text-xs bg-surface-highest border border-outline-variant/20 text-zinc-300'}>{tool.label} · {tool.count}</button>)}
      </div>
      <p className="mt-3 text-xs text-zinc-500">{TOOL_SUMMARY[active].label} — {TOOL_SUMMARY[active].output} · {TOOL_SUMMARY[active].seconds}</p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
        {entries.map(entry => <div key={entry.id} className="min-w-0"><CaseCard entry={entry} signedIn={signedIn} locked={locked} onUse={onUse}/></div>)}
      </div>
    </section>
  );
}
