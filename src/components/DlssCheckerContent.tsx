import React, { useEffect, useState } from 'react';
import { AMD_PATHS, CHECKER_PAGES, GPU_ENTRIES, GPU_FEATURE_LABELS, GPU_SOURCES, GPU_CHECKED, LOCAL_SOFTWARE, type CheckerPage, type FeatureEvidence, type GpuFeature } from '../content/dlssChecker';
import { detectLocalGpu, type DetectedGpu } from '../features/dlssChecker/detect';
import { canConclude, matchGpu } from '../features/dlssChecker/verdict';

const labels = {confirmed: 'Confirmed hardware scope', planned: 'Planned — not currently supported', unsupported: 'Not in current published range', unknown: 'Unknown — not verified'};
const link = 'text-primary underline';
const cell = 'p-4 align-top text-sm';
function FeatureCell({evidence}: {evidence: FeatureEvidence}) {
  const status = canConclude(evidence) ? evidence.status : 'unknown';
  return <td className={cell} data-feature-status={status}><strong>{labels[status]}</strong><p className="mt-2">{evidence.note}</p><ul className="mt-2">{evidence.sources.map(source => <li key={source.url}><a href={source.url} className={link}>{source.label}</a> · checked {source.checkedAt}</li>)}</ul><p className="mt-2">Reviewed: {evidence.lastVerified}</p></td>;
}
export function DlssCheckerContent({page}: {page: CheckerPage}) {
  const [ready,setReady] = useState(false);
  const [selected,setSelected] = useState('');
  const [detected,setDetected] = useState<DetectedGpu|null>(null);
  const [busy,setBusy] = useState(false);
  useEffect(()=>setReady(true),[]);
  const chosen=GPU_ENTRIES.find(card=>card.slug===selected);
  async function detect() {
    setBusy(true);
    try {const result=await detectLocalGpu();setDetected(result);setSelected(matchGpu(result.renderer,GPU_ENTRIES)?.slug??'');}
    catch {setDetected({renderer:'',vendor:null,source:'none',hint:'Detection was unavailable. Choose the exact desktop model manually.'});setSelected('');}
    finally {setBusy(false);}
  }
  return <main className="pt-32 pb-24 px-6 max-w-7xl mx-auto" data-checker-ready={ready}>
    <p className="text-primary text-xs uppercase tracking-widest">Independent evidence checker · Not affiliated with NVIDIA</p>
    <h1 className="mt-4 text-4xl font-bold text-white">{page.heading}</h1>
    <p className="mt-4 text-zinc-300 max-w-3xl">{page.intro}</p>
    <p className="mt-3 text-sm text-zinc-400">Last checked: {GPU_CHECKED}. Desktop model rows; a laptop, Ti, SUPER or other unlisted variant is not silently matched to a base desktop card.</p>
    <nav aria-label="GPU evidence pages" className="mt-5 flex flex-wrap gap-4">{CHECKER_PAGES.filter(p=>p.path!==page.path).map(p=><a key={p.path} className={link} href={p.path}>{p.heading}</a>)}</nav>
    <section className="mt-10" aria-labelledby="gpu-table-heading">
      <h2 id="gpu-table-heading" className="text-2xl font-bold text-white">Model × feature: official game technology</h2>
      <p className="mt-3 text-zinc-400">NVIDIA explicitly lists series-level hardware scope; applying that scope to a named member is not a per-card game test. MFG below follows the official Dynamic Multi Frame Generation row. Unknown is not a negative verdict, and a future plan is not present support.</p>
      <div className="mt-5 overflow-x-auto"><table data-gpu-table className="w-full min-w-[1000px] text-left border border-zinc-700">
        <thead><tr><th className={cell}>Desktop model</th>{Object.entries(GPU_FEATURE_LABELS).map(([key,label])=><th key={key} className={cell}>{label}</th>)}</tr></thead>
        <tbody>{page.cards.map(card=><tr key={card.slug} data-gpu-row={card.slug} className="border-t border-zinc-700"><th scope="row" className={cell}>{CHECKER_PAGES.some(p=>p.slug===card.slug)?<a className={link} href={`/dlss-checker/${card.slug}`}>{card.name}</a>:card.name}</th>{(Object.keys(GPU_FEATURE_LABELS) as GpuFeature[]).map(key=><React.Fragment key={key}><FeatureCell evidence={card.features![key]}/></React.Fragment>)}</tr>)}</tbody>
      </table></div>
    </section>
    <section className="mt-10" aria-labelledby="local-axis-heading">
      <h2 id="local-axis-heading" className="text-2xl font-bold text-white">Separate axis: our DLSS5 Studio style-conversion workflow</h2>
      <p className="mt-3 text-zinc-300">This is our independent image workflow, not NVIDIA’s game runtime. “ok” means an inferred fit to the published GPU minimum, not tested speed; “good” accompanies the single historical measured configuration, not a guarantee. “cloud-only” directs these cards to our browser workflow rather than this NVIDIA RTX local build.</p>
      <div className="mt-5 overflow-x-auto"><table data-local-table className="w-full min-w-[700px] text-left"><thead><tr>{['Model','Workflow tier / evidence','Reason and historical record','Source'].map(h=><th key={h} className={cell}>{h}</th>)}</tr></thead><tbody>{page.cards.map(card=><tr key={card.slug} className="border-t border-zinc-700"><th className={cell} scope="row">{card.name}</th><td className={cell}>{card.workflowTier} · {card.localSoftware?.fit === 'measured' ? 'historical measurement' : 'inference, not measured'}</td><td className={cell}>{card.localSoftware?.reason}{card.localSoftware?.evidence&&<p className="mt-2">Historical record: {card.localSoftware.evidence.machine} — {card.localSoftware.evidence.result}. Not rerun for this page and not a game FPS measurement.</p>}</td><td className={cell}><a className={link} href="/download">Studio requirements and access</a> · reviewed {GPU_CHECKED}</td></tr>)}</tbody></table></div>
      <p className="mt-4 text-sm text-zinc-400">GPU minimum: {LOCAL_SOFTWARE.gpu}. OS: {LOCAL_SOFTWARE.os}. Meeting the GPU minimum alone does not establish that the entire machine meets the published requirements.</p>
    </section>
    {page.slug==='amd'&&<section className="mt-10"><h2 className="text-2xl font-bold text-white">AMD: local support, cloud service and third-party demonstrations</h2><table data-amd-paths className="mt-4 w-full text-left"><tbody>{AMD_PATHS.map(row=><tr key={row.name} className="border-t border-zinc-700"><th className={cell}>{row.name}</th><td className={cell}>{row.detail}</td><td className={cell}><a className={link} href={row.source.url}>{row.source.label}</a> · checked {row.source.checkedAt}</td></tr>)}</tbody></table></section>}
    <section className="mt-10 rounded-xl border border-zinc-700 p-6" aria-labelledby="detect-heading">
      <h2 id="detect-heading" className="text-2xl font-bold text-white">Check a desktop model on this device</h2>
      <p className="mt-3">Detection stays in your browser. It cannot verify a game build, driver, available memory or Studio installation. If the browser gives only a family or hides the GPU, use manual selection; the complete tables above remain readable without JavaScript.</p>
      <button data-detect-gpu type="button" className="mt-4 rounded bg-primary text-black px-5 py-3" disabled={busy} onClick={detect}>{busy?'Reading GPU…':'Detect my GPU'}</button>
      <label className="block mt-4" htmlFor="manual-gpu">Or choose the exact desktop model</label><select id="manual-gpu" className="mt-2 bg-zinc-900 border border-zinc-600 p-3" value={selected} onChange={e=>{setSelected(e.target.value);setDetected(null);}}><option value="">Choose a model</option>{GPU_ENTRIES.map(card=><option key={card.slug} value={card.slug}>{card.name}</option>)}</select>
      <div data-detection-result aria-live="polite" className="mt-4">{detected&&<p>Detected via {detected.source}: {detected.renderer||'unavailable'}. {detected.hint} {!chosen&&'No exact tracked desktop match. Choose manually; do not infer support from a partial name.'}</p>}{chosen&&<><p data-selected-gpu>{chosen.name}</p><p>Official game neural rendering: {labels[canConclude(chosen.features!.neural) ? chosen.features!.neural.status : 'unknown']}. {chosen.features!.neural.note}</p><p>Our independent Studio: {chosen.localSoftware?.fit} · {chosen.localSoftware?.reason}</p></>}</div>
    </section>
    <section className="mt-10" id="checker-faq"><h2 className="text-2xl font-bold text-white">Questions and evidence boundaries</h2>{page.faqs.map(faq=><article key={faq.question} className="mt-5"><h3 className="font-bold">{faq.question}</h3><p className="mt-2">{faq.answer}</p></article>)}<p className="mt-4">{Object.values(GPU_SOURCES).map(source=><a key={source.url} className={`${link} mr-4`} href={source.url}>{source.label} · {source.checkedAt}</a>)}</p></section>
    <nav aria-label="Continue with verified routes" className="mt-10 flex flex-wrap gap-4">{[['/download','DLSS5 Studio download and requirements'],['/games','DLSS 5 supported games'],['/system-requirements','DLSS 5 system requirements'],['/status','DLSS 5 support status'],['/vs/dlss-5-vs-dlss-4-5','DLSS 5 vs DLSS 4.5 by feature'],['/vs/dlss-5-vs-fsr-4','DLSS 5 vs FSR 4']].map(([href,label])=><a key={href} className={link} href={href}>{label}</a>)}</nav>
  </main>;
}
