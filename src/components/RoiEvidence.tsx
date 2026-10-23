import React from 'react';
import { CHECKED, COMPARISON_ANSWERS, DOWNLOAD_ANSWERS, ENHANCER_BOUNDARIES, ENHANCER_TIER, EVIDENCE_SOURCES } from '../content/roiEvidence';
import { SITE_URL } from '../config/site';
const panel = 'not-prose my-8 rounded-xl border border-zinc-700 bg-surface-low p-5 text-zinc-300 [overflow-wrap:anywhere]';
const link = 'text-primary underline break-all';
function DateLine() { return <p className="text-sm mt-3">Last checked: <time dateTime={CHECKED}>{CHECKED}</time></p>; }
function Schema({ path, answers }: { path: string; answers?: readonly { question: string; answer: string; sources?: readonly string[] }[] }) {
  const url = `${SITE_URL}${path}`;
  const nodes: object[] = [{ '@type': 'WebPage', '@id': `${url}#webpage`, url, dateModified: CHECKED }];
  if (answers) nodes.push({ '@type': 'FAQPage', '@id': `${url}#checked-faq`, dateModified: CHECKED, mainEntity: answers.map(a => ({ '@type': 'Question', name: a.question, acceptedAnswer: { '@type': 'Answer', text: `${a.answer} Last checked: ${CHECKED}. Sources: ${(a.sources || []).map(key => EVIDENCE_SOURCES[key as keyof typeof EVIDENCE_SOURCES]).join(' ') || url}` } })) });
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@graph': nodes }).replace(/</g, '\\u003c') }} />;
}
export function ComparisonIntro() {
  return <section data-roi-block="comparison-intro" className={panel}><p>Our core workflow is <a className={link} href="/game-character-style">DLSS 5-style conversion and neural-render redraw</a>: turn a game frame, character, room or portrait into a visual reference, with <a className={link} href="/download">DLSS5 Studio</a> as the desktop handover. The game technologies below are separate; this comparison does not claim that our image workflow runs NVIDIA’s in-game DLSS.</p><DateLine /></section>;
}
export function ComparisonAnswers() {
  return <section data-roi-block="comparison-answers" className={panel} aria-labelledby="checked-answers-heading">
    <Schema path="/blog/dlss5-vs-dlss4-vs-fsr4-comparison-2026" answers={COMPARISON_ANSWERS} />
    <h2 id="checked-answers-heading" className="text-2xl font-bold text-white">Conditional answers to common DLSS and FSR questions</h2>
    <div className="mt-5 space-y-6">{COMPARISON_ANSWERS.map(a => <article key={a.question}><h3 className="font-bold text-white">{a.question}</h3><p className="mt-2">{a.answer}</p><p className="mt-2 text-sm">Sources: {a.sources.map(key => <a className={`${link} mr-3`} key={key} href={EVIDENCE_SOURCES[key]}>{key === 'amd' ? 'AMD FSR' : key === 'dlss45' ? 'NVIDIA DLSS 4.5' : key === 'dlss4' ? 'NVIDIA DLSS 4' : 'NVIDIA DLSS 5'}</a>)}</p><DateLine /></article>)}</div>
    <h3 className="mt-8 text-xl font-bold text-white">Source list</h3><ul className="mt-3 space-y-3">{Object.values(EVIDENCE_SOURCES).map(url => <li key={url}><a className={link} href={url}>{url}</a> — checked {CHECKED}</li>)}</ul>
  </section>;
}
export function EnhancerEvidence() {
  return <section data-roi-block="enhancer-boundaries" data-content-tier={ENHANCER_TIER} className={panel} aria-labelledby="enhancer-boundaries-heading">
    <Schema path="/visual-enhancer" />
    <h2 id="enhancer-boundaries-heading" className="text-2xl font-bold text-white">A limited image-quality entry point, before style conversion</h2>
    <p className="mt-3">This is an entry point for inspecting an existing image, not the product’s purpose. Our core is <a className={link} href="/game-character-style">DLSS 5-style conversion and neural-render redraw</a> of a game frame, character, room or portrait into a visual reference, delivered through <a className={link} href="/download">DLSS5 Studio</a>. This browser enhancer is independent of NVIDIA’s game runtime.</p>
    <ul className="mt-4 space-y-3 list-disc pl-5">{ENHANCER_BOUNDARIES.map(text => <li key={text}>{text}</li>)}</ul><DateLine />
  </section>;
}
export function DownloadEvidence() {
  const rows = [
    ['Windows + RTX', 'Request the independent Studio build after sign-in for the local image/video workflow. Meeting the hardware requirements is not an automatic invitation.', 'Existing page: Windows RTX tool available by request; signed-in request flow.'],
    ['Android / iOS', 'No Studio APK or native mobile build is provided here. Try the browser example; this does not install the Studio desktop app.', 'Existing page: no Android APK; phone or desktop browser converter; Studio is a separate Windows tool.'],
    ['Other systems / no RTX', 'The Studio desktop workflow is not available for these configurations. Browser examples are a separate path, not a desktop compatibility claim.', 'Existing page: Windows and NVIDIA RTX are desktop requirements.'],
  ];
  return <section data-roi-block="download-devices" className={panel} aria-labelledby="download-devices-heading">
    <Schema path="/download" answers={DOWNLOAD_ANSWERS} />
    <h2 id="download-devices-heading" className="text-2xl font-bold text-white">Which device path is available?</h2>
    <p className="mt-3">DLSS5 Studio is the desktop handover for our style-conversion and neural-render redraw workflow. Choose between requesting the Windows RTX build and trying a <a className={link} href="/dashboard?tool=game-character-style&sample=characterStyle">browser style-conversion example</a>; neither path supplies an APK or a game injector.</p>
    <table className="mt-5 block sm:table w-full sm:table-fixed text-sm text-left"><thead className="hidden sm:table-header-group"><tr><th scope="col" className="p-2 w-1/4">Device</th><th scope="col" className="p-2">Available path</th><th scope="col" className="p-2">Basis on this page</th></tr></thead><tbody className="block sm:table-row-group">{rows.map(row => <tr key={row[0]} className="block sm:table-row border-t border-zinc-700"><th scope="row" className="block sm:table-cell p-2 align-top">{row[0]}</th><td className="block sm:table-cell p-2 align-top">{row[1]}</td><td className="block sm:table-cell p-2 align-top">{row[2]}</td></tr>)}</tbody></table>
    <div className="mt-6 space-y-5">{DOWNLOAD_ANSWERS.map(a => <article key={a.question}><h3 className="font-bold text-white">{a.question}</h3><p className="mt-2">{a.answer}</p></article>)}</div><DateLine />
  </section>;
}
