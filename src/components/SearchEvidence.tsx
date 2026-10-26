import { ENHANCER_SHORT_ANSWERS } from '../content/enhancerShortAnswers';
import { ChineseComparison } from './LocalizedEvidence';
import React from 'react';
import { CHECKED, COMPARISON_ANSWERS, EVIDENCE_SOURCES, ENHANCER_BOUNDARIES } from '../content/roiEvidence';
import { VISUAL_ENHANCER_COPY } from '../content/visualEnhancer';
import { SITE_URL } from '../config/site';
const panel = 'my-8 rounded-xl border border-zinc-700 bg-surface-low p-5 text-zinc-300 [overflow-wrap:anywhere]';
const link = 'text-primary underline';
const article = '/blog/dlss5-vs-dlss4-vs-fsr4-comparison-2026';
export const isCheckedComparison = (path: string) => ['/vs/dlss-5-vs-dlss-4-5', '/vs/dlss-5-vs-fsr-4', '/zh/vs/dlss-5-vs-dlss-4-5', '/zh/vs/dlss-5-vs-fsr-4'].includes(path);
type Answer = { question: string; answer: string };
function FaqSchema({path, answers}: {path: string; answers: readonly Answer[]}) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({'@context':'https://schema.org','@type':'FAQPage','@id':`${SITE_URL}${path}#faq`, dateModified:CHECKED, mainEntity:answers.map(a=>({'@type':'Question', name:a.question, acceptedAnswer:{'@type':'Answer',text:a.answer}}))}).replace(/</g,'\\u003c')}} />;
}
export function CheckedComparison({path, existingFaq}: {path: string; existingFaq: readonly (readonly [string, string])[]}) {
  if (!isCheckedComparison(path)) return null;
  if (path.startsWith('/zh/')) return <ChineseComparison path={path} existingFaq={existingFaq} />;
  const answers = path.endsWith('dlss-4-5') ? COMPARISON_ANSWERS.slice(3) : COMPARISON_ANSWERS.slice(0,3);
  return <section data-search-evidence="comparison" className={panel} aria-labelledby="checked-comparison-heading">
    <FaqSchema path={path} answers={[...existingFaq.map(([question,answer])=>({question,answer})),...answers.map(a=>({question:a.question,answer:`${a.answer} Last checked: ${CHECKED}. Sources: ${a.sources.map(key=>EVIDENCE_SOURCES[key]).join(' ')}`}))]} />
    <h2 id="checked-comparison-heading" className="text-2xl font-bold text-white">Source-checked answers</h2>
    <p className="mt-3">Last checked: <time dateTime={CHECKED}>{CHECKED}</time></p>
    <p className="mt-3">These game features are separate from our independent <a className={link} href="/game-character-style">DLSS 5-style conversion and neural-render redraw</a> workflow and its <a className={link} href="/download">DLSS5 Studio desktop handover</a>.</p>
    {answers.map(a=><article key={a.question} className="mt-6"><h3 className="font-bold text-white">{a.question}</h3><p className="mt-2">{a.answer}</p><p className="mt-2 text-sm">Sources: {a.sources.map(key=><a key={key} className={`${link} mr-3 break-all`} href={EVIDENCE_SOURCES[key]}>{EVIDENCE_SOURCES[key]}</a>)} — checked {CHECKED}</p></article>)}
    <p className="mt-6"><a className={link} href={article}>Read the DLSS 5, DLSS 4 and FSR 4 feature comparison</a> · <a className={link} href={`${article}#feature-picker-heading`}>Choose a feature by goal, GPU series and checked game support</a></p>
  </section>;
}
const enhancerAnswers = [
  {question:'What are the output size and scale limits?',answer:ENHANCER_BOUNDARIES[0]},
  {question:'Is this pixel-exact super-resolution?',answer:ENHANCER_BOUNDARIES[1]},
  {question:'Can I recover after a timeout with the same task id?',answer:ENHANCER_BOUNDARIES[2]},
  {question:'Do I need an RTX card to view the browser example?',answer:'No local RTX card is required to view the cached browser example. This is a separate browser image workflow, not the NVIDIA DLSS game runtime or the Studio desktop build.'},
  {question:'Can I try the example on Android?',answer:'Use the cached example in your phone browser. This page does not install NVIDIA binaries or provide an Android APK. Your own upload requires sign-in and available credits.'},
];
export function EnhancerChecks() {
  return <section data-search-evidence="enhancer" className={panel} aria-labelledby="enhancer-checks-heading">
    <FaqSchema path="/visual-enhancer" answers={[...VISUAL_ENHANCER_COPY.en.faq.map(([question,answer])=>({question,answer})),...enhancerAnswers,...ENHANCER_SHORT_ANSWERS.en]} />
    <h2 id="enhancer-checks-heading" className="text-2xl font-bold text-white">Measured workflow and practical questions</h2>
    <p className="mt-3">2026-10-23: three real tasks completed end to end in 15.869–16.357 seconds (owned images; longest output edge 1536 pixels).</p>
    <p className="mt-3">Sample size: 3 runs using sample1.jpg, sample2.jpg and sample1.jpg. Timing runs from clicking submit through signed upload, model processing, polling and saving the downloaded result. We used an isolated signed-in test build with simulated authentication and credits; the upload, model tasks and downloads were real. This is a small test sample, not a speed guarantee or a production billing test.</p>
    <p className="mt-3"><a className={link} href="/evidence/enhancer-runs-20261023.json">Read each task’s timestamps, measured dimensions and download log</a></p>
    {enhancerAnswers.map(a=><article key={a.question} className="mt-6"><h3 className="font-bold text-white">{a.question}</h3><p className="mt-2">{a.answer}</p></article>)}
  </section>;
}
export function DashboardEvidenceLinks() {
  return <p data-search-evidence="dashboard-links" className="mt-6 text-sm"><a className={link} href="/visual-enhancer">Make an existing image clearer with the browser visual enhancer</a> · <a className={link} href="/vs/dlss-5-vs-dlss-4-5">Compare DLSS 5 with DLSS 4.5 by supported feature</a></p>;
}
