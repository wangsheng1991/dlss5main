import { ENHANCER_SHORT_ANSWERS } from '../content/enhancerShortAnswers';
export default function EnhancerShortAnswers({locale='en'}:{locale?:'en'|'zh'}) {
 return <section data-enhancer-short-answers className="mt-10 rounded-xl border border-outline-variant/30 p-6 text-zinc-300" aria-labelledby="enhancer-short-heading"><h2 id="enhancer-short-heading" className="text-2xl font-bold text-white">{locale==='zh'?'视觉增强器：直接回答':'Visual enhancer: direct answers'}</h2>{ENHANCER_SHORT_ANSWERS[locale].map(a=><article key={a.question} className="mt-5"><h3 className="font-semibold text-white">{a.question}</h3><p className="mt-2">{a.answer}</p></article>)}</section>;
}
