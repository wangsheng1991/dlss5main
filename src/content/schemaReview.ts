// R1/R2/R5: expose existing page facts; never synthesize questions or product claims.
export const SCHEMA_REVIEW_DATE = '2026-10-23';
export const ARTICLE_CHECK_PATHS = [
  '/blog/what-is-dlss-5-neural-rendering-guide',
  '/blog/dlss-5-online-image-upscaler-guide',
];
const REVIEW_PATHS = new Set([
  '/game-character-style', '/interior-design', '/portrait-retouch', '/virtual-try-on',
  '/virtual-makeup', '/ai-headshot', '/image-to-svg', '/remove-background', '/erase-object',
  '/old-photo-restoration', '/video-upscaler', '/video-downloader', '/before-after',
  '/comparisons', '/pricing', '/models', '/zh', '/blog', '/about', '/docs', '/enterprise', '/zh/download',
]);
type Node = Record<string, unknown>;
/** Preserve every existing FAQ answer. Only supply the page node and review date. */
export function reviewedPageSchema(data: object | undefined, url: string, name: string, description: string): object | undefined {
  const path = new URL(url).pathname;
  if (!REVIEW_PATHS.has(path) && !path.startsWith('/blog/')) return data;
  const source = data as Node | undefined;
  const nodes: Node[] = source ? (Array.isArray(source['@graph']) ? source['@graph'] as Node[] : [source]) : [];
  // /zh's old head FAQ was not present in its static visible page; keep only the supported page graph.
  const visibleNodes = path === '/zh' ? nodes.filter(node => node['@type'] !== 'FAQPage') : nodes;
  const hasPage = visibleNodes.some(node => node['@type'] === 'WebPage');
  const updated = visibleNodes.map(node => node['@type'] === 'WebPage' ? {...node, dateModified:SCHEMA_REVIEW_DATE} : node);
  if (!hasPage) updated.push({'@type':'WebPage','@id':`${url}#webpage`,url,name,description,dateModified:SCHEMA_REVIEW_DATE});
  return {'@context':'https://schema.org','@graph':updated};
}
