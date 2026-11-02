import React, { useEffect, useState } from 'react';
import { GAME_DETAIL_EVIDENCE, GAME_SOURCES, GAMES_CHECKED } from '../content/gamesStatusEvidence';
import { GAME_STATE_LABELS, type GameBlock, type GameCoveragePage, type GameResource } from '../content/gameCoverage';

const RESOURCE_KIND_LABELS: Record<GameResource['kind'], string> = {
  official: 'Official',
  press: 'Press report',
  ours: 'Our own check',
  tool: 'Tool',
};

/** Rich blocks exist only on pages that have the material; each one renders from typed data. */
function GameBlockView({block}: {block: GameBlock}) {
  switch (block.type) {
    case 'facts':
      return <section className="mt-10" data-game-block="facts">
        <h2 className="text-2xl font-bold text-white">{block.heading}</h2>
        {block.intro ? <p className="mt-4">{block.intro}</p> : null}
        <dl className="mt-5 divide-y divide-outline-variant/20 border-y border-outline-variant/20">
          {block.rows.map(row=><div key={row.label} className="py-4 grid gap-1 sm:grid-cols-[minmax(0,210px)_minmax(0,1fr)] sm:gap-6">
            <dt className="text-sm font-semibold uppercase tracking-wide text-primary">{row.label}</dt>
            <dd><p className="text-zinc-200">{row.value}</p>{row.note ? <p className="mt-1 text-sm text-zinc-500">{row.note}</p> : null}</dd>
          </div>)}
        </dl>
      </section>;
    case 'timeline':
      return <section className="mt-10" data-game-block="timeline">
        <h2 className="text-2xl font-bold text-white">{block.heading}</h2>
        {block.intro ? <p className="mt-4">{block.intro}</p> : null}
        <ol className="mt-6 space-y-6 border-l border-outline-variant/30 pl-5">
          {block.items.map(item=><li key={`${item.date}-${item.title}`} className="relative">
            <span aria-hidden="true" className="absolute -left-[26px] top-2 h-2 w-2 rounded-full bg-primary" />
            <p className="text-xs uppercase tracking-widest text-zinc-500"><time dateTime={item.date}>{item.date}</time></p>
            <h3 className="mt-1 text-lg font-bold text-white">{item.title}</h3>
            <p className="mt-1 text-zinc-300">{item.detail}</p>
            {item.href ? <p className="mt-1"><a className="text-sm text-primary underline" href={item.href} {...(item.href.startsWith('http') ? {rel:'noreferrer'} : {})}>{item.hrefLabel ?? 'Source'}</a></p> : null}
          </li>)}
        </ol>
      </section>;
    case 'table':
      return <section className="mt-10" data-game-block="table">
        <h2 className="text-2xl font-bold text-white">{block.heading}</h2>
        {block.intro ? <p className="mt-4">{block.intro}</p> : null}
        <div className="mt-5 overflow-x-auto rounded-xl border border-outline-variant/20">
          <table className="w-full border-collapse text-sm">
            <thead><tr className="bg-surface-high/60 text-left">{block.columns.map(column=><th key={column} scope="col" className="px-4 py-3 font-semibold text-white">{column}</th>)}</tr></thead>
            <tbody>{block.rows.map(row=><tr key={row[0]} className="border-t border-outline-variant/20 align-top">{row.map((cell,index)=><td key={`${row[0]}-${index}`} className={index === 0 ? 'px-4 py-3 font-medium text-zinc-200' : 'px-4 py-3 text-zinc-400'}>{cell}</td>)}</tr>)}</tbody>
          </table>
        </div>
        {block.note ? <p className="mt-3 text-sm text-zinc-500">{block.note}</p> : null}
      </section>;
    case 'issues':
      return <section className="mt-10" data-game-block="issues">
        <h2 className="text-2xl font-bold text-white">{block.heading}</h2>
        {block.intro ? <p className="mt-4">{block.intro}</p> : null}
        <div className="mt-5 space-y-5">
          {block.items.map(item=><article key={item.question} className="rounded-xl border border-outline-variant/20 bg-surface-low p-5">
            <h3 className="text-lg font-bold text-white">{item.question}</h3>
            <p className="mt-2 text-zinc-300">{item.answer}</p>
          </article>)}
        </div>
      </section>;
    case 'voices':
      return <section className="mt-10" data-game-block="voices">
        <h2 className="text-2xl font-bold text-white">{block.heading}</h2>
        {block.intro ? <p className="mt-4">{block.intro}</p> : null}
        <ul className="mt-5 space-y-4">
          {block.items.map(item=><li key={`${item.who}-${item.what.slice(0,24)}`} className="rounded-xl border border-outline-variant/20 bg-surface-low p-5">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">{item.who}{item.date ? <span className="ml-3 font-normal normal-case tracking-normal text-zinc-500"><time dateTime={item.date}>{item.date}</time></span> : null}</p>
            <p className="mt-2 text-zinc-200">{item.what}</p>
            {item.sourceHref ? <p className="mt-1"><a className="text-sm text-zinc-400 underline" href={item.sourceHref} {...(item.sourceHref.startsWith('http') ? {rel:'noreferrer'} : {})}>{item.sourceLabel ?? 'Source'}</a></p> : null}
          </li>)}
        </ul>
      </section>;
    case 'figure':
      return <section className="mt-10" data-game-block="figure">
        {block.heading ? <h2 className="text-2xl font-bold text-white">{block.heading}</h2> : null}
        <figure className="mt-4 rounded-2xl border border-outline-variant/20 bg-surface-low p-4 sm:p-5">
          <div className={block.items.length > 1 ? 'grid grid-cols-1 sm:grid-cols-2 gap-4' : ''}>
            {block.items.map(item=><div key={item.src}>
              {item.video
                ? <video className="w-full h-auto rounded-lg" src={item.src} autoPlay muted loop playsInline preload="metadata" aria-label={item.alt} />
                : <img className="w-full h-auto rounded-lg" src={item.src} alt={item.alt} loading="lazy" decoding="async" />}
              {item.label ? <p className="mt-2 text-xs uppercase tracking-widest text-zinc-500">{item.label}</p> : null}
              {item.href ? <p className="mt-2"><a className="text-sm text-primary underline" href={item.href}>{item.hrefLabel ?? 'Open'} →</a></p> : null}
            </div>)}
          </div>
          <figcaption className="mt-4 text-sm text-zinc-400">{block.caption}</figcaption>
        </figure>
      </section>;
    default:
      return null;
  }
}

export default function GameCoverageContent({page}: {page:GameCoveragePage}) {
  const evidence=GAME_DETAIL_EVIDENCE[page.slug];
  const checked=page.checked ?? GAMES_CHECKED;
  const [ready,setReady]=useState(false);
  useEffect(()=>setReady(true),[]);
  const topBlocks=(page.blocks ?? []).filter(block=>block.placement !== 'bottom');
  const bottomBlocks=(page.blocks ?? []).filter(block=>block.placement === 'bottom');
  return <main data-game-coverage={page.slug} data-game-ready={ready} className="pt-32 pb-24 px-6 max-w-5xl mx-auto text-zinc-300">
    <header><h1 className="text-4xl font-bold text-white">{page.title}</h1><p className="mt-5">{page.intro ?? 'Official game support and our independent game-character style conversion are different paths. DLSS5 Studio processes your images; it does not install or emulate NVIDIA’s in-game runtime.'}</p>{page.checked ? <p className="mt-3 text-sm text-zinc-500">Re-checked <time dateTime={page.checked}>{page.checked}</time> against the sources linked below.</p> : null}</header>
    {topBlocks.map((block,index)=><React.Fragment key={`top-${block.type}-${index}`}><GameBlockView block={block} /></React.Fragment>)}
    <section className="mt-10" data-game-section="status"><h2 className="text-2xl font-bold text-white">Official status</h2>
      <dl className="mt-4 space-y-2"><dt>State</dt><dd data-official-state={evidence.state}>{GAME_STATE_LABELS[evidence.state]}</dd><dt>Source/check record date</dt><dd>{evidence.evidenceDate}</dd><dt>Last checked</dt><dd><time dateTime={checked}>{checked}</time></dd></dl>
      <p className="mt-4">{evidence.detail.en}</p><ul className="mt-4">{evidence.sources.map(key=><li key={key}><a className="text-primary underline" href={GAME_SOURCES[key]}>NVIDIA official source — {key}</a> · Checked {checked}</li>)}</ul>
    </section>
    <section className="mt-10" data-game-section="official"><h2 className="text-2xl font-bold text-white">Within the official scope</h2><p className="mt-4">{page.official}</p>{page.steps ? <ol className="mt-4 list-decimal pl-6 space-y-3">{page.steps.map(step=><li key={step}>{step}</li>)}</ol> : null}</section>
    <section className="mt-10" data-game-section="outside"><h2 className="text-2xl font-bold text-white">Outside the confirmed official scope</h2><p className="mt-4">{page.outside}</p>
      <p className="mt-4">Community methods include tools that replace DLSS library versions. Replacing a library does not itself prove DLSS 5 neural-rendering compatibility. We have not validated such a method for this page’s title or project.</p>
      <p className="mt-4">Treat these as unsupported modifications: game or driver updates may overwrite changes or invalidate an override, anti-cheat may reject a modification, and a failed modification can crash a game. These are risks, not measured outcomes for this title. We provide no third-party binary download links, installation bundle or NVIDIA files.</p>
    </section>
    <section className="mt-10" data-game-section="ours"><h2 className="text-2xl font-bold text-white">Our own route: a game-frame style reference</h2>
      <p className="mt-4">Use a screenshot you are entitled to process, or a frame captured from your own recording, as input to our independent Studio style-conversion workflow. Choose a visual direction, then review character identity, silhouettes, materials, lighting, HUD and text before accepting the image. The result is a visual reference outside the game; it does not change the game’s renderer.</p>
      <p className="mt-4">We have no verified, title-specific before-and-after material for this page. No image here is presented as a result from this game or RTX Remix project. <a className="text-primary underline" href="/before-after">Inspect real independent style-conversion examples</a> to understand the workflow and its limits.</p>
      <nav className="mt-5 flex flex-wrap gap-4" aria-label="Game support and independent workflow"><a className="text-primary underline" href="/games">DLSS 5 supported games tracker</a><a className="text-primary underline" href="/dlss-checker">DLSS 5 supported cards checker</a><a className="text-primary underline" href="/download">DLSS 5 download paths and our recipe kit</a><a className="text-primary underline" href="/studio-beta">Request the independent DLSS5 Studio workflow</a><a className="text-primary underline" href="/vs/dlss-5-vs-dlss-4-5">Compare DLSS 5 and DLSS 4.5 features</a></nav>
    </section>
    {page.resources?.length ? <section className="mt-10" data-game-section="resources" aria-labelledby="game-resources-heading">
      <h2 id="game-resources-heading" className="text-2xl font-bold text-white">{page.resourcesHeading ?? 'Everything we have on this title'}</h2>
      {page.resourcesIntro ? <p className="mt-4">{page.resourcesIntro}</p> : null}
      <ul className="mt-5 space-y-5">{page.resources.map(resource=>{
        const external=resource.href.startsWith('http');
        return <li key={resource.href} data-resource-kind={resource.kind}>
          <p className="text-xs uppercase tracking-widest text-primary">{RESOURCE_KIND_LABELS[resource.kind]}{resource.date ? <span className="ml-3 normal-case tracking-normal text-zinc-500"><time dateTime={resource.date}>{resource.date}</time></span> : null}</p>
          <p className="mt-1"><a className="text-primary underline" href={resource.href} {...(external ? {rel:'noreferrer'} : {})}>{resource.label}</a></p>
          <p className="mt-1 text-sm text-zinc-400">{resource.note}</p>
        </li>;
      })}</ul>
    </section> : null}
    {bottomBlocks.map((block,index)=><React.Fragment key={`bottom-${block.type}-${index}`}><GameBlockView block={block} /></React.Fragment>)}
    <section className="mt-10" data-game-section="faq"><h2 className="text-2xl font-bold text-white">Frequently asked questions</h2>{page.faq.map(q=><article key={q.question} className="mt-5"><h3 className="text-lg font-bold text-white">{q.question}</h3><p className="mt-2">{q.answer}</p></article>)}</section>
  </main>;
}
