import type { Article } from './types';
export function withManuscriptFaq(schema: object, article: Article, chinese: boolean): object {
  const pairs = chinese ? article.faqs_cn : article.faqs_en;
  if (!pairs?.length) return schema;
  return { '@context': 'https://schema.org', '@graph': [schema, {
    '@type': 'FAQPage', mainEntity: pairs.map(pair => ({ '@type': 'Question', name: pair.question,
      acceptedAnswer: { '@type': 'Answer', text: pair.answer } })),
  }] };
}
