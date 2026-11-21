import SEO from '../components/SEO';
import { DocsContent, DOCS_TITLE, DOCS_DESCRIPTION } from '../components/DocsContent';
export default function Docs() {
  return <><SEO title={DOCS_TITLE} description={DOCS_DESCRIPTION} canonical="/docs" structuredData={{ '@context': 'https://schema.org', '@type': 'TechArticle', headline: 'Website model and workflow reference', description: DOCS_DESCRIPTION, dateModified: '2026-11-21' }} /><DocsContent /></>;
}
