import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import {
  API_BASE_URL, API_CATALOG_JSON, API_FLOW, API_KEY_NOTE, API_MAX_UPLOAD_MIB, API_PRICE,
  API_RESULT_TTL_SECONDS, ASPECT_SIZES, CATALOG, CATALOG_EXAMPLE, CATALOG_UPDATED, CATALOG_VERSION,
  apiModelJson, type CatalogModel,
} from '../config/apiCatalog';
import { SHOWCASE } from '../config/showcase';

/**
 * The one page an integrator reads.
 *
 * It renders `config/apiCatalog.ts` and nothing else, the same way `scripts/export-api-catalog.ts`
 * and the prerender step do. That is the point: the page, the static HTML a crawler gets and the
 * JSON files machines fetch are three views of one file, so a corrected measurement cannot reach
 * two of them and miss the third. Before this page existed the site's `/docs` advertised
 * `api.monolith.ai/v1/upscale` and a model named `ada-5.0`, neither of which was ever served.
 *
 * The page answers one question per section — where do I read, where do I call, what are the four
 * steps, which model do I want, what does each one take, where does each one stop — and it never
 * repeats a number the catalog does not carry.
 */
export default function Docs() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: 'AlphaNet image API — one integration page',
    description: `Nine image models behind one asynchronous REST API: upload, submit, poll, fetch. Key from ${API_BASE_URL}.`,
    dateModified: CATALOG_UPDATED,
    inLanguage: 'en-US',
    about: { '@type': 'SoftwareApplication', name: 'AlphaNet image API', applicationCategory: 'DeveloperApplication', operatingSystem: 'Web' },
  };

  return (
    <main className="pt-32 pb-24 px-6 max-w-[1100px] mx-auto min-h-[80vh]">
      <SEO
        title="Image API Documentation — One Page, Nine Models | DLSS 5 Studio"
        description={`Call nine image models through one asynchronous API: upload, submit, poll, fetch. Base URL ${API_BASE_URL}, ${API_PRICE}, catalog version ${CATALOG_VERSION}.`}
        keywords={['image api documentation', 'background removal api', 'image upscaling api', 'virtual try-on api', 'image to svg api']}
        canonical="/docs"
        structuredData={structuredData}
      />

      <header className="mb-14">
        <span className="text-primary font-label text-xs uppercase tracking-[0.2em] mb-4 block">Integration</span>
        <h1 className="text-4xl md:text-5xl font-headline font-bold text-white mb-5">The API, on one page</h1>
        <p className="text-zinc-300 max-w-3xl leading-relaxed text-lg">
          Nine image models behind one asynchronous API: background removal, SVG tracing, generative erase,
          detail restore, prompt-driven editing, virtual try-on, interior renders, portrait retouch and virtual
          makeup. This page is where you read the contract; the gateway is where you call it.
        </p>
        <p className="text-zinc-500 max-w-3xl leading-relaxed mt-4 text-sm">
          Both are generated from one file in this repository, so they cannot disagree. Every number below is a
          measurement with its date — where there is no measurement, there is no number.
        </p>
      </header>

      <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
        {[
          { term: 'Calls go to', detail: API_BASE_URL, mono: true },
          { term: 'Authentication', detail: 'Bearer <project API key>' },
          { term: 'Price', detail: API_PRICE },
          { term: 'Upload ceiling', detail: `${API_MAX_UPLOAD_MIB} MiB per reference image` },
          { term: 'Result URLs expire', detail: `${API_RESULT_TTL_SECONDS} s after the task finishes` },
          { term: 'Catalog version', detail: `${CATALOG_VERSION} · updated ${CATALOG_UPDATED}` },
        ].map(item => (
          <div key={item.term} className="bg-surface-low rounded-xl border border-outline-variant/20 p-5">
            <dt className="text-xs uppercase tracking-widest text-primary">{item.term}</dt>
            <dd className={`mt-2 text-zinc-200 break-words ${item.mono ? 'font-mono text-sm' : 'text-sm'}`}>{item.detail}</dd>
          </div>
        ))}
      </dl>

      <section className="mb-16" aria-labelledby="entry-points">
        <h2 id="entry-points" className="text-2xl md:text-3xl font-headline font-bold text-white mb-4">Two entry points</h2>
        <p className="text-zinc-400 max-w-3xl leading-relaxed mb-6">
          Reading and calling are separate addresses on purpose. Reading is open and needs no key, so a
          crawler, a colleague or a code generator can fetch the whole contract without an account.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <article className="bg-surface-low rounded-xl border border-outline-variant/20 p-6">
            <p className="text-xs uppercase tracking-widest text-primary">Read · no key</p>
            <h3 className="text-xl font-headline font-bold text-white mt-2">This page, and its JSON</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><a className="text-primary break-all" href={API_CATALOG_JSON}>{API_CATALOG_JSON}</a> <span className="text-zinc-500">— every model, the flow and the limits</span></li>
              <li><span className="text-zinc-400 font-mono break-all">/api-catalog/&lt;model&gt;.json</span> <span className="text-zinc-500">— one model, same fields</span></li>
              <li><a className="text-primary break-all" href={apiModelJson('flux-klein')}>{apiModelJson('flux-klein')}</a> <span className="text-zinc-500">— example</span></li>
            </ul>
            <p className="mt-4 text-xs text-zinc-500">Same facts as this page, minus the prose.</p>
          </article>
          <article className="bg-surface-low rounded-xl border border-outline-variant/20 p-6">
            <p className="text-xs uppercase tracking-widest text-primary">Call · project key</p>
            <h3 className="text-xl font-headline font-bold text-white mt-2">The gateway</h3>
            <p className="mt-4 text-sm text-zinc-400 leading-relaxed">{API_KEY_NOTE}</p>
            <pre className="mt-4 overflow-x-auto rounded-lg bg-surface-lowest p-4 text-xs font-mono text-zinc-300">
              <code>{`curl -sS ${API_BASE_URL}/v1/models \\
  -H "Authorization: Bearer $ALPHANET_KEY"`}</code>
            </pre>
            <p className="mt-3 text-xs text-zinc-500">That call lists the nine model ids this key may use — the same ids this page documents.</p>
          </article>
        </div>
      </section>

      <section className="mb-16" aria-labelledby="flow">
        <h2 id="flow" className="text-2xl md:text-3xl font-headline font-bold text-white mb-4">The four steps</h2>
        <p className="text-zinc-400 max-w-3xl leading-relaxed mb-7">
          Every model uses the same four steps. Only the submit body changes between them, so you build the
          upload and the polling loop once and pick a model per task.
        </p>
        <ol className="space-y-4 mb-8">
          {API_FLOW.map(step => (
            <li key={step.n} className="bg-surface-low rounded-xl border border-outline-variant/20 p-5 flex gap-4">
              <span className="text-primary font-mono text-sm pt-0.5">{String(step.n).padStart(2, '0')}</span>
              <div>
                <h3 className="text-lg font-bold text-white">{step.title}</h3>
                <p className="mt-1 text-xs font-mono text-zinc-400">{step.method} {step.path}</p>
                <p className="mt-2 text-sm text-zinc-400 leading-relaxed">{step.detail}</p>
              </div>
            </li>
          ))}
        </ol>

        <h3 className="text-xl font-bold text-white mb-3">One verified run, end to end</h3>
        <p className="text-zinc-400 text-sm max-w-3xl leading-relaxed mb-5">
          A real <span className="font-mono">cutout-fast</span> call against {API_BASE_URL}, with the file ids and
          signed URLs shortened. The response fields are exactly the ones the gateway returns.
        </p>
        <div className="space-y-4">
          <Code title="1 · POST /v1/flux/uploads — body, then response" body={`${json(CATALOG_EXAMPLE.ticket.request)}\n\n${json(CATALOG_EXAMPLE.ticket.response)}`} />
          <Code title="2 · PUT {upload_url} — with the ticket's headers, body = the file bytes" body={'# No Authorization here: the signed URL is the credential.\n# The bytes go straight to storage, never through our API.'} />
          <Code title="3 · POST /v1/tasks/alphanet-flux — body, then response" body={`${json(CATALOG_EXAMPLE.submit.request)}\n\n${json(CATALOG_EXAMPLE.submit.response)}`} />
          <Code title="4 · GET /v1/tasks/{task_id} — terminal status" body={json(CATALOG_EXAMPLE.status.response)} />
          <Code title="5 · GET /v1/tasks/{task_id}/result — artifacts" body={json(CATALOG_EXAMPLE.result.response)} />
        </div>
        <p className="mt-4 text-xs text-zinc-500 leading-relaxed">
          Poll the status until it is terminal: <span className="font-mono">SUCCESS</span> /
          <span className="font-mono"> COMPLETED</span> is done; <span className="font-mono">FAILED</span> /
          <span className="font-mono"> FAILURE</span> / <span className="font-mono">CANCELLED</span> is not, and
          <span className="font-mono"> fail_reason</span> carries the sentence to show. A running task reports a
          <span className="font-mono"> progress</span> percentage.
        </p>
      </section>

      <section className="mb-16" aria-labelledby="at-a-glance">
        <h2 id="at-a-glance" className="text-2xl md:text-3xl font-headline font-bold text-white mb-4">The nine models</h2>
        <p className="text-zinc-400 max-w-3xl leading-relaxed mb-6">
          Model ids are frozen: they are billing-visible, so a rename is a breaking change. Two of them take
          your words (<span className="font-mono">prompt</span>); the four productised tools deliberately do not —
          their instruction is a server-side asset and a caller can only pick a named option.
        </p>
        <div className="overflow-x-auto rounded-xl border border-outline-variant/20">
          <table className="w-full text-sm">
            <thead className="bg-surface-low text-left text-xs uppercase tracking-widest text-primary">
              <tr>
                <th className="p-4">Model</th>
                <th className="p-4">What you get</th>
                <th className="p-4">References</th>
                <th className="p-4">Measured</th>
              </tr>
            </thead>
            <tbody>
              {CATALOG.map(model => (
                <tr key={model.id} className="border-t border-outline-variant/20 align-top">
                  <td className="p-4 whitespace-nowrap"><a className="text-primary font-mono" href={`#${model.id}`}>{model.id}</a></td>
                  <td className="p-4 text-zinc-300">{model.label}</td>
                  <td className="p-4 text-zinc-400 whitespace-nowrap">{model.inputs.min === model.inputs.max ? model.inputs.max : `${model.inputs.min}–${model.inputs.max}`}</td>
                  <td className="p-4 text-zinc-400">{model.latency}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-16 space-y-10" aria-labelledby="models">
        <h2 id="models" className="text-2xl md:text-3xl font-headline font-bold text-white">Model by model</h2>
        {/* The key sits on the fragment, not on `ModelSection`: this project's JSX types only
            accept `key` on intrinsic elements (the same reason every list in `src/components` keys
            an `li` rather than the component it holds). */}
        {CATALOG.map(model => <React.Fragment key={model.id}><ModelSection model={model} /></React.Fragment>)}
      </section>

      <section className="mb-16" aria-labelledby="output-shapes">
        <h2 id="output-shapes" className="text-2xl md:text-3xl font-headline font-bold text-white mb-4">Output shapes for the four productised models</h2>
        <p className="text-zinc-400 max-w-3xl leading-relaxed mb-6">
          <span className="font-mono">tryon-quality</span>, <span className="font-mono">interior-quality</span>,
          <span className="font-mono">retouch-quality</span> and <span className="font-mono">makeup-quality</span> take
          an optional <span className="font-mono">aspect</span> from this table instead of a pixel size. Omitted, the
          service picks the bucket closest to your <em>first</em> reference — a 3:2 room photo comes back 1152 × 768,
          not a square — so a caller never has to know these names to keep the original framing.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {ASPECT_SIZES.map(bucket => (
            <div key={bucket.value} className="bg-surface-low rounded-lg border border-outline-variant/20 p-4 text-center">
              <p className="font-mono text-sm text-primary">{bucket.value}</p>
              <p className="mt-1 text-xs text-zinc-400">{bucket.size}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-16" aria-labelledby="errors">
        <h2 id="errors" className="text-2xl md:text-3xl font-headline font-bold text-white mb-4">Errors, limits, and the two habits worth having</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <article className="bg-surface-low rounded-xl border border-outline-variant/20 p-6">
            <h3 className="text-lg font-bold text-white">What a failure looks like</h3>
            <ul className="mt-4 space-y-3 text-sm text-zinc-400 leading-relaxed">
              <li><span className="font-mono text-zinc-200">400 plugin_request_invalid</span> — the body carries a field this model refuses; the message names it (<span className="font-mono">pixrestore-s does not accept width</span>).</li>
              <li><span className="font-mono text-zinc-200">422</span> — a value outside its range, in the service's own words (<span className="font-mono">num_inference_steps 必须是 1–4 的整数</span>).</li>
              <li><span className="font-mono text-zinc-200">409</span> — the same <span className="font-mono">Idempotency-Key</span> with a different body. Same key with the same body returns the original task instead.</li>
              <li><span className="font-mono text-zinc-200">503 model_not_found</span> — the key's channel does not serve that model id.</li>
            </ul>
          </article>
          <article className="bg-surface-low rounded-xl border border-outline-variant/20 p-6">
            <h3 className="text-lg font-bold text-white">The two habits</h3>
            <ul className="mt-4 space-y-3 text-sm text-zinc-400 leading-relaxed">
              <li><strong className="text-zinc-200">Send an Idempotency-Key</strong> — one per logical operation, persisted with it. A network retry must replay the same key <em>and</em> the same bytes; a re-serialised body can trip the 409.</li>
              <li><strong className="text-zinc-200">Download the result, do not bookmark it</strong> — signed URLs expire after {API_RESULT_TTL_SECONDS} s. Each artifact carries its own <span className="font-mono">sha256</span> and <span className="font-mono">file_size</span>, so verify what you stored.</li>
              <li>Uploads are capped at {API_MAX_UPLOAD_MIB} MiB per reference image, and the ticket tells you the ceiling and the exact <span className="font-mono">Content-Type</span> headers to send.</li>
              <li>{API_PRICE}, metered by the gateway on the project key.</li>
            </ul>
          </article>
        </div>
      </section>

      <section className="mb-16" aria-labelledby="machine">
        <h2 id="machine" className="text-2xl md:text-3xl font-headline font-bold text-white mb-4">For a machine</h2>
        <p className="text-zinc-400 max-w-3xl leading-relaxed mb-5">
          Everything on this page also exists as JSON, generated at build time from the same file that renders
          this page. Point a code generator or an agent at it instead of scraping the HTML.
        </p>
        <Code title={API_CATALOG_JSON} body={`{\n  "catalog_version": "${CATALOG_VERSION}",\n  "updated": "${CATALOG_UPDATED}",\n  "base_url": "${API_BASE_URL}",\n  "auth": { ... }, "price": "${API_PRICE}", "limits": { ... }, "aspects": [ ... ],\n  "flow": [ { "step": 1, "method": "POST", "path": "/v1/flux/uploads", ... } ],\n  "models": [ { "id": "flux-klein", "label": "...", "params": [ ... ], "refuses": [ ... ],\n                "submit_body_example": { ... }, "price": "${API_PRICE}", "try_it": "/image-upscaler",\n                "cases": [], "verified": "..." }, ... ]\n}`} />
        <p className="mt-4 text-sm text-zinc-400">
          One model per file: <span className="text-zinc-300 font-mono break-all">/api-catalog/&lt;model&gt;.json</span> — same
          fields plus the flow, without the other eight models.
        </p>
      </section>

      <footer className="border-t border-outline-variant/20 pt-8 text-sm text-zinc-500 leading-relaxed">
        <p>
          The account registry in the service repository stays the operational ledger — which worker serves a model,
          on which card, seen by whom. This page is its caller-facing view: when the two disagree, the registry is
          right and this page is a bug worth reporting.
        </p>
        <p className="mt-3">
          Need a model that is not here, or a volume plan? <Link className="text-primary" to="/enterprise">Enterprise and dedicated capacity</Link>.
        </p>
      </footer>
    </main>
  );
}

/** Pretty JSON, so a copied block is valid input rather than a wall of one line. */
const json = (value: unknown) => JSON.stringify(value, null, 2);

function Code({ title, body }: { title: string; body: string }) {
  return (
    <figure className="rounded-xl border border-outline-variant/20 overflow-hidden bg-surface-lowest">
      <figcaption className="bg-surface-low px-4 py-2 text-xs font-mono text-zinc-400 border-b border-outline-variant/20">{title}</figcaption>
      <pre className="overflow-x-auto p-4 text-xs font-mono text-zinc-300 leading-relaxed"><code>{body}</code></pre>
    </figure>
  );
}

const cell = 'p-3 align-top';
const typeLabel: Record<'string' | 'integer' | 'string[]', string> = { string: 'string', integer: 'integer', 'string[]': 'string[]' };

/** One model: what it is, what it takes, what it refuses, where it stops, and how to call it. */
function ModelSection({ model }: { model: CatalogModel }) {
  const cases = (model.cases || []).map(id => SHOWCASE.find(entry => entry.id === id)).filter(Boolean);
  return (
    <article id={model.id} className="scroll-mt-28 bg-surface-low rounded-xl border border-outline-variant/20 p-6 md:p-8">
      <header className="border-b border-outline-variant/20 pb-5">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h3 className="text-2xl font-headline font-bold text-white font-mono">{model.id}</h3>
          <span className="text-zinc-400 text-sm">{model.label}</span>
        </div>
        <p className="mt-3 text-zinc-300 leading-relaxed max-w-3xl">{model.summary}</p>
        <p className="mt-3 text-xs text-zinc-500">
          Control-plane capability: <span className="font-mono text-zinc-400">{model.capability}</span> · verified {model.verified}
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div>
          <h4 className="text-xs uppercase tracking-widest text-primary mb-3">
            Takes {model.inputs.min === model.inputs.max ? model.inputs.max : `${model.inputs.min}–${model.inputs.max}`} reference{model.inputs.max === 1 ? '' : 's'}
          </h4>
          <ol className="space-y-1 text-sm text-zinc-300">
            {model.inputs.slots.map((slot, index) => (
              <li key={slot}><span className="font-mono text-zinc-500">image_ids[{index}]</span> — {slot}</li>
            ))}
          </ol>
          <p className="mt-4 text-sm text-zinc-400 leading-relaxed"><span className="text-zinc-200">Returns:</span> {model.output}</p>
          <p className="mt-3 text-sm text-zinc-400 leading-relaxed"><span className="text-zinc-200">Measured:</span> {model.latency}</p>
        </div>
        <div>
          <h4 className="text-xs uppercase tracking-widest text-primary mb-3">Where it stops</h4>
          <ul className="space-y-2 text-sm text-zinc-400 leading-relaxed list-disc pl-4">
            {model.limits.map(limit => <li key={limit}>{limit}</li>)}
          </ul>
        </div>
      </div>

      <div className="mt-7 overflow-x-auto rounded-lg border border-outline-variant/20">
        <table className="w-full text-sm">
          <thead className="bg-surface-lowest text-left text-xs uppercase tracking-widest text-primary">
            <tr>
              <th className={cell}>Field</th>
              <th className={cell}>Type</th>
              <th className={cell}>Values</th>
              <th className={cell}>Default</th>
              <th className={cell}>Notes</th>
            </tr>
          </thead>
          <tbody>
            {model.params.map(param => (
              <tr key={param.name} className="border-t border-outline-variant/20">
                <td className={`${cell} font-mono text-zinc-200 whitespace-nowrap`}>
                  {param.name}{param.required ? <span className="text-primary"> *</span> : null}
                </td>
                <td className={`${cell} text-zinc-400`}>{typeLabel[param.type]}</td>
                <td className={`${cell} text-zinc-400 font-mono`}>{param.values || '—'}</td>
                <td className={`${cell} text-zinc-400 font-mono`}>{param.default || '—'}</td>
                <td className={`${cell} text-zinc-400`}>{param.note || ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {model.params.some(param => param.required)
        ? <p className="mt-2 text-xs text-zinc-500"><span className="text-primary">*</span> required — an empty one fails the call.</p>
        : null}

      {model.refuses.length ? (
        <div className="mt-5 rounded-lg border border-primary/25 bg-primary/5 p-4">
          <p className="text-xs uppercase tracking-widest text-primary">Refused, not ignored</p>
          <p className="mt-2 text-sm text-zinc-300 leading-relaxed">
            Sending any of these fails the call with 400 rather than being dropped:
            {' '}<span className="font-mono text-zinc-200">{model.refuses.join(', ')}</span>. This model decides
            that geometry itself, so a caller that thinks it asked for a size or a prompt would otherwise ship a
            silently different image.
          </p>
        </div>
      ) : null}

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Code
          title={`POST /v1/tasks/alphanet-flux — the body for ${model.id}`}
          body={`curl -sS ${API_BASE_URL}/v1/tasks/alphanet-flux \\\n  -H "Authorization: Bearer $ALPHANET_KEY" \\\n  -H "Content-Type: application/json" \\\n  -H "Idempotency-Key: $(uuidgen)" \\\n  -d '${JSON.stringify(model.body)}'`}
        />
        {cases.length ? (
          <div className="space-y-4">
            {cases.map(entry => entry && (
              <figure key={entry.id} className="rounded-xl border border-outline-variant/20 overflow-hidden">
                <img
                  src={entry.output.src}
                  alt={`${entry.title} — real ${model.id} output`}
                  width={entry.output.width}
                  height={entry.output.height}
                  loading="lazy"
                  className="w-full bg-surface-lowest"
                />
                <figcaption className="px-4 py-3 text-xs text-zinc-400 leading-relaxed">
                  {entry.title} · {entry.seconds} ({entry.measured}) · {entry.output.width} × {entry.output.height}
                </figcaption>
              </figure>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-outline-variant/20 bg-surface-lowest p-5 text-sm text-zinc-500 leading-relaxed">
            No public case image is published for this model yet, so none is shown — a rendered placeholder would
            prove nothing about the service.
          </div>
        )}
      </div>

      {model.tryIt ? (
        <p className="mt-5 text-sm">
          <Link className="text-primary" to={model.tryIt.path}>{model.tryIt.label} →</Link>
          <span className="text-zinc-500"> — the same model, in the browser, before you write any code.</span>
        </p>
      ) : null}
    </article>
  );
}
