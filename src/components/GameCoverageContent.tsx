import React, { useEffect, useState } from 'react';
import { GAME_DETAIL_EVIDENCE, GAME_SOURCES, GAMES_CHECKED } from '../content/gamesStatusEvidence';
import { GAME_STATE_LABELS, type GameCoveragePage } from '../content/gameCoverage';

export default function GameCoverageContent({page}: {page:GameCoveragePage}) {
  const evidence=GAME_DETAIL_EVIDENCE[page.slug];
  const [ready,setReady]=useState(false);
  useEffect(()=>setReady(true),[]);
  return <main data-game-coverage={page.slug} data-game-ready={ready} className="pt-32 pb-24 px-6 max-w-5xl mx-auto text-zinc-300">
    <header><h1 className="text-4xl font-bold text-white">{page.title}</h1><p className="mt-5">Official game support and our independent game-character style conversion are different paths. DLSS5 Studio processes your images; it does not install or emulate NVIDIA’s in-game runtime.</p></header>
    <section className="mt-10" data-game-section="status"><h2 className="text-2xl font-bold text-white">Official status</h2>
      <dl className="mt-4 space-y-2"><dt>State</dt><dd data-official-state={evidence.state}>{GAME_STATE_LABELS[evidence.state]}</dd><dt>Source/check record date</dt><dd>{evidence.evidenceDate}</dd><dt>Last checked</dt><dd><time dateTime={GAMES_CHECKED}>{GAMES_CHECKED}</time></dd></dl>
      <p className="mt-4">{evidence.detail.en}</p><ul className="mt-4">{evidence.sources.map(key=><li key={key}><a className="text-primary underline" href={GAME_SOURCES[key]}>NVIDIA official source — {key}</a> · Checked {GAMES_CHECKED}</li>)}</ul>
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
    <section className="mt-10" data-game-section="faq"><h2 className="text-2xl font-bold text-white">Frequently asked questions</h2>{page.faq.map(q=><article key={q.question} className="mt-5"><h3 className="text-lg font-bold text-white">{q.question}</h3><p className="mt-2">{q.answer}</p></article>)}</section>
  </main>;
}
