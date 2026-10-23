import { readFileSync, readdirSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ARTICLES } from '../src/content/articles/types';

// Read only the prose container, keeping nested table wrappers inside the check.
function articleBody(html: string): string {
  const opening = /<div\b[^>]*class="prose\s[^"]*"[^>]*>/i.exec(html);
  if (!opening) throw new Error('Missing article prose container');
  const start = opening.index + opening[0].length;
  const tags = /<\/?div\b[^>]*>/gi;
  tags.lastIndex = start;
  let depth = 1;
  for (let tag = tags.exec(html); tag; tag = tags.exec(html)) {
    depth += tag[0].startsWith('</') ? -1 : 1;
    if (depth === 0) return html.slice(start, tag.index);
  }
  throw new Error('Unclosed article prose container');
}

export function assertArticleMarkdownRendered(dist = resolve('dist')): void {
  const slugs = new Set(ARTICLES.filter(article => article.assetBase).map(article => article.slug));
  const seen = new Set<string>();
  const failures: string[] = [];
  let checked = 0;
  function visit(directory: string): void {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) { visit(path); continue; }
      const slug = basename(directory);
      if (entry.name !== 'index.html' || basename(dirname(directory)) !== 'blog' || !slugs.has(slug)) continue;
      checked++;
      seen.add(slug);
      try {
        const body = articleBody(readFileSync(path, 'utf8'));
        // Strip markup, so text split by inline tags cannot bypass the assertion.
        const text = body.replace(/<[^>]*>/g, '').replace(/&#(?:0*124|x0*7c);/gi, '|');
        for (const pattern of [/\|\s*:?-{3,}:?\s*\|/g, /!\[/g]) {
          for (const hit of text.matchAll(pattern)) {
            const index = hit.index!;
            failures.push(`${slug} (${path}): ${JSON.stringify(text.slice(Math.max(0, index - 35), index + hit[0].length + 65))}`);
          }
        }
      } catch (error) { failures.push(`${slug} (${path}): ${String(error)}`); }
    }
  }
  visit(dist);
  for (const slug of slugs) if (!seen.has(slug)) failures.push(`${slug}: no prerendered article found`);
  if (failures.length) {
    console.error(`ARTICLE-MARKDOWN: FAIL\n${failures.join('\n')}`);
    throw new Error(`${failures.length} article Markdown rendering failure(s)`);
  }
  console.log(`ARTICLE-MARKDOWN: PASS — ${checked} pages, ${seen.size} assetBase articles, no raw table separators or image Markdown`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) assertArticleMarkdownRendered();
