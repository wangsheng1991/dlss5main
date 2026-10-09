import { useState } from 'react';
import SEO from '../components/SEO';
import { CHECKER_COPY, DELIVERY_LANES, GPU_ENTRIES, LOCAL_SOFTWARE, type GpuEntry } from '../content/dlssChecker';
import { detectLocalGpu, type DetectedGpu } from '../features/dlssChecker/detect';
import { localSoftwareVerdict, matchGpu, verdictFor, type Verdict } from '../features/dlssChecker/verdict';
import { EVIDENCE_TIERS, SUPPORT_RULES } from '../features/dlssChecker/rules';

/**
 * DLSS 5 兼容性检测器的页面骨架 —— 壳子留在这里，业务代码从 TODO(王胜) 处往下长。
 *
 * 页面刻意给**两个答案**：
 *   1. 游戏里的 DLSS 5 支不支持（竞品那根轴，我们照做但更严：没来源不下结论）
 *   2. 我们的本地软件在这台机器上能不能跑（他们没有那根轴）
 * 再加一段「我们怎么定的」，把证据分级和规则推导摊开给用户和 AI 看 —— 这是「数据 + 理论」
 * 比 dlss5.net 强的地方，别把它藏起来。
 *
 * 已接好的线：检测、匹配、两条轴判定、本地软件要求与实测数字、证据分级、SEO。
 * 还没接的：结果页路由 `/dlss-checker/:gpuSlug`（可分享、可索引）、预渲染登记与 sitemap、
 * FAQPage 结构化数据、`/api/*.json`、埋点。
 */

const TONE_CLASS: Record<Verdict['tone'], string> = {
  positive: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
  neutral: 'border-amber-500/40 bg-amber-500/10 text-amber-200',
  negative: 'border-rose-500/40 bg-rose-500/10 text-rose-300',
  muted: 'border-outline-variant/40 bg-surface-low text-zinc-300',
};

function RequirementRow({ term, value }: { term: string; value: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4 py-2 border-b border-outline-variant/20 last:border-0">
      <dt className="text-zinc-400 text-sm sm:w-40 shrink-0">{term}</dt>
      <dd className="text-zinc-200 text-sm">{value}</dd>
    </div>
  );
}

export default function DlssChecker() {
  const [detected, setDetected] = useState<DetectedGpu | null>(null);
  const [busy, setBusy] = useState(false);

  const matched: GpuEntry | undefined = detected ? matchGpu(detected.renderer, GPU_ENTRIES) : undefined;
  const gameSide: Verdict | null = detected ? verdictFor(matched) : null;
  const localSide = localSoftwareVerdict(matched);

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
            <div className="mt-6 space-y-4">
              <p className="text-sm text-zinc-400">
                Detected via <span className="text-zinc-200">{detected.source}</span>:{' '}
                <span className="text-zinc-100">{detected.renderer || '—'}</span>
              </p>
              {detected.hint && <p className="text-sm text-amber-200">{detected.hint}</p>}

              {/* 轴一：游戏里的 DLSS 5 */}
              {gameSide && (
                <div className={`rounded-lg border px-4 py-3 ${TONE_CLASS[gameSide.tone]}`}>
                  <p className="text-xs uppercase tracking-widest opacity-70">In games</p>
                  <p className="font-semibold mt-1">{gameSide.label}</p>
                  {matched && <p className="text-sm mt-1 opacity-90">{matched.name}{matched.note ? ` — ${matched.note}` : ''}</p>}
                  <ul className="text-xs mt-2 space-y-1 opacity-90">
                    {gameSide.reasons.map((reason) => (
                      <li key={reason}>· {reason}</li>
                    ))}
                  </ul>
                  {gameSide.status === 'unknown' && <p className="text-xs mt-2">{CHECKER_COPY.unknownNotice}</p>}
                </div>
              )}

              {/* 轴二：我们的本地软件 —— 竞品没有的答案 */}
              <div className={`rounded-lg border px-4 py-3 ${TONE_CLASS[localSide.tone]}`}>
                <p className="text-xs uppercase tracking-widest opacity-70">{LOCAL_SOFTWARE.name} · on your machine</p>
                <p className="font-semibold mt-1">{localSide.label}</p>
                <p className="text-sm mt-1 opacity-90">{localSide.state.reason}</p>
                {localSide.state.evidence && (
                  <p className="text-xs mt-2 opacity-90">
                    Measured: {localSide.state.evidence.machine} — {localSide.state.evidence.result}
                  </p>
                )}
                {/* TODO(王胜)：按 ourWorkflows 给出具体的下一步（本地跑 / 走在线转换器），并接埋点。 */}
                <p className="text-xs mt-2 opacity-80">Two ways to run it: {DELIVERY_LANES.join(' · ')}</p>
              </div>
            </div>
          )}
        </section>

        {/* 本地软件：要求与实测（我们自己的东西，要在页面上有位置） */}
        <section className="mt-12 rounded-xl border border-outline-variant/30 bg-surface-low p-6">
          <h2 className="font-headline text-2xl font-bold text-white">{CHECKER_COPY.localHeading}</h2>
          <p className="text-zinc-400 mt-2 text-sm max-w-3xl">{LOCAL_SOFTWARE.summary}</p>
          <dl className="mt-4">
            <RequirementRow term="Operating system" value={LOCAL_SOFTWARE.os} />
            <RequirementRow term="GPU" value={LOCAL_SOFTWARE.gpu} />
            <RequirementRow term="Driver" value={LOCAL_SOFTWARE.driver} />
            <RequirementRow term="Memory" value={LOCAL_SOFTWARE.memory} />
            <RequirementRow term="Disk" value={LOCAL_SOFTWARE.disk} />
            <RequirementRow term="Engine" value={LOCAL_SOFTWARE.engine} />
          </dl>
          <p className="text-sm text-zinc-300 mt-4">
            Measured on {LOCAL_SOFTWARE.measured.machine}: {LOCAL_SOFTWARE.measured.result}
          </p>
          <p className="text-sm text-zinc-400 mt-2">{LOCAL_SOFTWARE.onlineLane}</p>
          {/* TODO(王胜)：把这段要求与 src/content/studioPage.ts 的 req.* 做成同一来源，
              并加一条测试防漂移（现在靠人工同步）。 */}
        </section>

        {/* 我们怎么定的：证据分级 + 规则推导 */}
        <section className="mt-12">
          <h2 className="font-headline text-2xl font-bold text-white">{CHECKER_COPY.methodHeading}</h2>
          <p className="text-zinc-400 mt-2 max-w-3xl text-sm leading-relaxed">{CHECKER_COPY.methodBody}</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {EVIDENCE_TIERS.map((tier) => (
              <div key={tier.id} className="rounded-lg border border-outline-variant/30 bg-surface-low p-4">
                <p className="text-zinc-100 font-semibold text-sm">{tier.label}</p>
                <p className="text-zinc-400 text-xs mt-1 leading-relaxed">{tier.note}</p>
              </div>
            ))}
          </div>
          {/* TODO(王胜)：规则表填了之后，把 SUPPORT_RULES 连同来源一起列在这里，
              让用户和 AI 都能核对「这条结论是推出来的、依据是哪条规则」。 */}
          <p className="text-xs text-zinc-500 mt-3">
            {SUPPORT_RULES.length
              ? `${SUPPORT_RULES.length} published rule(s) currently derive card verdicts.`
              : 'No rules published yet — every card verdict currently needs an official source of its own.'}
          </p>
        </section>

        {/* 卡表：两根轴都列出来，并且链到结果页 */}
        <section className="mt-12">
          <h2 className="font-headline text-2xl font-bold text-white">Cards we track</h2>
          {/* TODO(王胜)：每一行都链到 `/dlss-checker/<slug>` 的结果页；没有结论的条目显示 "No verified conclusion yet"，
              并考虑给这些页面 noindex，避免产生薄页。 */}
          <ul className="mt-4 divide-y divide-outline-variant/20 rounded-xl border border-outline-variant/30 overflow-hidden">
            {GPU_ENTRIES.map((entry) => (
              <li key={entry.slug} className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 px-5 py-3 bg-surface-low">
                <span className="text-zinc-100">{entry.name}</span>
                <span className="text-xs text-zinc-400">{entry.generation}{entry.vramGb ? ` · ${entry.vramGb} GB` : ''}</span>
                <span className="text-xs text-zinc-400">In games: {verdictFor(entry).label}</span>
                <span className="text-xs text-emerald-300/80">{localSoftwareVerdict(entry).label}</span>
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
