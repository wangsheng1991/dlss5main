/**
 * Re-reading the pages the specification table was built from.
 *
 * The table claims that a certain Russian page says a 3 × 4 photo has a 26 mm head. That claim is
 * worth exactly as much as the last time somebody checked it, so it is checked the same way the
 * rest of the pipeline is: by machine, on demand, against the page itself rather than against a
 * copy made at the time.
 *
 * `npm test` runs the structure half of this (quotes exist, sources are distinct) with no network,
 * so a flaky page can never block a deploy. `npm run test:online` runs the half that fetches, and
 * is the one to run after touching `specs.ts`.
 *
 * Routing note: `fetch` here does not honour the ambient proxy that this network needs, and the
 * package that would fix that cannot be installed, so the transport is curl — same reason and same
 * code shape as the content-engine verifier.
 */

import { execFileSync } from 'node:child_process';
import type { PhotoSpec } from './types';

/** Order-insensitive by design: a spec's quote may span several elements of the page. */
export function htmlToText(html: string): string {
  return html
    .replace(/<(script|style|noscript)\b[^>]*>[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&laquo;|&raquo;/gi, '"')
    .replace(/&#x([0-9a-f]+);/gi, (_, hex: string) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec: string) => String.fromCharCode(Number(dec)));
}

/**
 * Quotes are compared with all whitespace removed and case folded. A page that renders the same
 * sentence across four elements puts spaces where the sentence has none, and a quotation that
 * survives re-typesetting but not re-markup would still be the same sentence.
 */
export function normalizeQuote(text: string): string {
  return text.replace(/\s+/gu, '').toLowerCase();
}

export function quoteFoundIn(pageHtml: string, quote: string): boolean {
  const needle = normalizeQuote(quote);
  if (!needle) return false;
  return normalizeQuote(htmlToText(pageHtml)).includes(needle);
}

export type QuoteCheck = {
  specId: string;
  url: string;
  quote: string;
  found: boolean;
  note?: string;
};

/** Reads one page. Throws with a reason when it cannot, so the caller can report per-source. */
export type PageReader = (url: string) => string;

/** curl, because it is the only client on this machine that already uses the ambient proxy. */
export function curlReader(attempts = 3): PageReader {
  return (url: string) => {
    let last = 'no attempt made';
    for (let attempt = 1; attempt <= attempts; attempt += 1) {
      try {
        return execFileSync('curl', ['-sS', '-L', '--max-time', '30', '-A', 'Mozilla/5.0 (spec-source-check)', url], {
          encoding: 'utf8',
          maxBuffer: 32 * 1024 * 1024,
          stdio: ['ignore', 'pipe', 'pipe'],
        });
      } catch (error) {
        last = error instanceof Error ? error.message.split('\n')[0] : String(error);
      }
    }
    throw new Error(`could not read ${url}: ${last}`);
  };
}

/**
 * Check every quote in the table against its own page. One page is fetched once, however many
 * numbers were read from it.
 */
export function checkSpecSources(specs: PhotoSpec[], read: PageReader): QuoteCheck[] {
  const pages = new Map<string, { html?: string; error?: string }>();
  const checks: QuoteCheck[] = [];

  for (const spec of specs) {
    for (const source of spec.sources) {
      if (!pages.has(source.url)) {
        try {
          pages.set(source.url, { html: read(source.url) });
        } catch (error) {
          pages.set(source.url, { error: error instanceof Error ? error.message : String(error) });
        }
      }
      const page = pages.get(source.url)!;
      checks.push(
        page.error
          ? { specId: spec.id, url: source.url, quote: source.quote, found: false, note: page.error }
          : { specId: spec.id, url: source.url, quote: source.quote, found: quoteFoundIn(page.html!, source.quote) },
      );
    }
  }

  return checks;
}
