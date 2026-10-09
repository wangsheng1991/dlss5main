import { useState } from 'react';
import SEO from '../components/SEO';
import { CHECKER_COPY, GPU_ENTRIES, type GpuEntry } from '../content/dlssChecker';
import { detectLocalGpu, type DetectedGpu } from '../features/dlssChecker/detect';
import { matchGpu, verdictFor, type Verdict } from '../features/dlssChecker/verdict';

/**
 * DLSS 5 兼容性检测器的页面骨架 —— 壳子留在这里，业务代码从 TODO(王胜) 处往下长。
 *
 * 已接好的线：
 *   - 检测（点击时在浏览器读真卡）、匹配、判定、来源与核对日期展示
 *   - SEO（独立 title/description/canonical）
 * 还没接的：
 *   - 结果页路由 `/dlss-checker/:gpuSlug`（可分享、可索引）
 *   - 预渲染登记（`scripts/prerender-seo.ts`）、sitemap 生成、FAQPage 结构化数据
 *   - 「你能跑什么」区块的真实文案与 CTA 指向
 */

const TONE_CLASS: Record<Verdict['tone'], string> = {
  positive: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
  neutral: 'border-amber-500/40 bg-amber-500/10 text-amber-200',
  negative: 'border-rose-500/40 bg-rose-500/10 text-rose-300',
  muted: 'border-outline-variant/40 bg-surface-low text-zinc-300',
};

export default function DlssChecker() {
  const [detected, setDetected] = useState<DetectedGpu | null>(null);
  const [busy, setBusy] = useState(false);

  const matched: GpuEntry | undefined = detected ? matchGpu(detected.renderer, GPU_ENTRIES) : undefined;
  const verdict: Verdict | null = detected ? verdictFor(matched) : null;

  const runDetection = async () => {
    setBusy(true);
    try {
      setDetected(await detectLocalGpu());
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <SEO
        title={CHECKER_COPY.title}
        description={CHECKER_COPY.description}
        canonical={CHECKER_COPY.path}
        keywords={['dlss 5 supported cards', 'dlss 5 gpu compatibility', 'dlss checker', 'dlss 5 gpu']}
        language="en-US"
      />

      <main className="pt-32 pb-24 px-6 max-w-5xl mx-auto">
        <p className="text-xs uppercase tracking-widest text-primary">Independent checker · Not affiliated with NVIDIA</p>
        <h1 className="font-headline text-4xl sm:text-5xl font-bold text-white mt-4">{CHECKER_COPY.heading}</h1>
        <p className="text-zinc-400 mt-4 max-w-3xl leading-relaxed">{CHECKER_COPY.intro}</p>

        {/* 检测区 */}
        <section className="mt-10 rounded-xl border border-outline-variant/30 bg-surface-low p-6">
          <button
            type="button"
            onClick={runDetection}
            disabled={busy}
            className="rounded-lg bg-primary text-black font-semibold px-5 py-3 disabled:opacity-60"
          >
            {busy ? 'Reading your GPU…' : CHECKER_COPY.detectCta}
          </button>
          <p className="text-xs text-zinc-500 mt-3">{CHECKER_COPY.detectHint}</p>

          {detected && (
            <div className="mt-6 space-y-3">
              <p className="text-sm text-zinc-400">
                Detected via <span className="text-zinc-200">{detected.source}</span>:{' '}
                <span className="text-zinc-100">{detected.renderer || '—'}</span>
              </p>
              {detected.hint && <p className="text-sm text-amber-200">{detected.hint}</p>}

              {verdict && (
                <div className={`rounded-lg border px-4 py-3 ${TONE_CLASS[verdict.tone]}`}>
                  <p className="font-semibold">{verdict.label}</p>
                  {matched && <p className="text-sm mt-1 opacity-90">{matched.name}{matched.note ? ` — ${matched.note}` : ''}</p>}
                  <ul className="text-xs mt-2 space-y-1 opacity-90">
                    {verdict.reasons.map((reason) => (
                      <li key={reason}>· {reason}</li>
                    ))}
                  </ul>
                  {verdict.status === 'unknown' && <p className="text-xs mt-2">{CHECKER_COPY.unknownNotice}</p>}
                </div>
              )}
            </div>
          )}
        </section>

        {/* TODO(王胜)：「你能跑什么」区块 —— 我们独有的那一段，竞品只有兼容表，没有下一步。
            这块卡的 ourWorkflows 决定推荐哪个工具；不许无脑引导到同一个 CTA。 */}

        {/* 卡表 */}
        <section className="mt-12">
          <h2 className="font-headline text-2xl font-bold text-white">Cards we track</h2>
          {/* TODO(王胜)：每一行都链到 `/dlss-checker/<slug>` 的结果页；没有结论的条目显示 "No verified conclusion yet"，
              并考虑给这些页面 noindex，避免产生薄页。 */}
          <ul className="mt-4 divide-y divide-outline-variant/20 rounded-xl border border-outline-variant/30 overflow-hidden">
            {GPU_ENTRIES.map((entry) => (
              <li key={entry.slug} className="flex items-center justify-between gap-4 px-5 py-3 bg-surface-low">
                <span className="text-zinc-100">{entry.name}</span>
                <span className="text-xs text-zinc-400">{entry.generation}{entry.vramGb ? ` · ${entry.vramGb} GB` : ''}</span>
                <span className="text-xs text-zinc-400">{verdictFor(entry).label}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* FAQ */}
        <section className="mt-12">
          <h2 className="font-headline text-2xl font-bold text-white">Frequently asked questions</h2>
          {/* TODO(王胜)：问答写实，并生成 FAQPage JSON-LD（structuredData 传给 SEO 组件）。 */}
          <dl className="mt-4 space-y-4">
            {CHECKER_COPY.faqs.map((faq) => (
              <div key={faq.question}>
                <dt className="text-zinc-100 font-semibold">{faq.question}</dt>
                <dd className="text-zinc-400 mt-1">{faq.answer}</dd>
              </div>
            ))}
          </dl>
        </section>
      </main>
    </>
  );
}
