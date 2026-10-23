import { CORE_VIDEO, coreVideoCopy } from './coreVideo20261023';
import type { Article } from './types';
export function withArticleEvidence(schema: object, article: Article, chinese: boolean): object {
  const pairs = chinese ? article.faqs_cn : article.faqs_en;
  const video = article.slug === CORE_VIDEO.slug ? {
    '@type': 'VideoObject', name: coreVideoCopy(chinese).title, description: coreVideoCopy(chinese).description,
    contentUrl: new URL(CORE_VIDEO.contentPath, String((schema as {mainEntityOfPage: string}).mainEntityOfPage)).href,
    thumbnailUrl: new URL(CORE_VIDEO.thumbnailPath, String((schema as {mainEntityOfPage: string}).mainEntityOfPage)).href,
    duration: CORE_VIDEO.duration, uploadDate: CORE_VIDEO.uploadDate, width: CORE_VIDEO.width, height: CORE_VIDEO.height,
  } : undefined;
  if (!pairs?.length && !video) return schema;
  return { '@context': 'https://schema.org', '@graph': [schema, ...(video ? [video] : []), ...(pairs?.length ? [{
    '@type': 'FAQPage', mainEntity: pairs.map(pair => ({ '@type': 'Question', name: pair.question,
      acceptedAnswer: { '@type': 'Answer', text: pair.answer } })),
  }] : [])] };
}
