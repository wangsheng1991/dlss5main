import { CORE_VIDEOS, coreVideoCopy } from './coreVideo20261023';
import type { Article } from './types';
export function withArticleEvidence(schema: object, article: Article, chinese: boolean): object {
  const pairs = chinese ? article.faqs_cn : article.faqs_en;
  const media = CORE_VIDEOS[article.slug];
  const video = media ? {
    '@type': 'VideoObject', name: coreVideoCopy(article.slug, chinese).title, description: coreVideoCopy(article.slug, chinese).description,
    contentUrl: new URL(media.contentPath, String((schema as {mainEntityOfPage: string}).mainEntityOfPage)).href,
    thumbnailUrl: new URL(media.thumbnailPath, String((schema as {mainEntityOfPage: string}).mainEntityOfPage)).href,
    duration: media.duration, uploadDate: media.uploadDate, width: media.width, height: media.height,
  } : undefined;
  if (!pairs?.length && !video) return schema;
  return { '@context': 'https://schema.org', '@graph': [schema, ...(video ? [video] : []), ...(pairs?.length ? [{
    '@type': 'FAQPage', mainEntity: pairs.map(pair => ({ '@type': 'Question', name: pair.question,
      acceptedAnswer: { '@type': 'Answer', text: pair.answer } })),
  }] : [])] };
}
