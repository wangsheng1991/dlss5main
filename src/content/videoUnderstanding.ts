import { SITE_URL } from '../config/site';
import { videoPreviewLanguage, videoPreviewPath, type VideoPreviewLocale } from './videoStudio';

const MEDIA = '/examples/video-understanding';
export const UNDERSTANDING_MEDIA = {
  street: MEDIA + '/street-timeline.mp4',
  poster: MEDIA + '/street-poster.jpg',
  hoop: MEDIA + '/hoop.jpg',
} as const;

export const STREET_SOURCE = 'https://mixkit.co/free-stock-video/crowds-of-people-cross-a-street-junction-4401/';
export const HOOP_SOURCE = 'https://mixkit.co/free-stock-video/couple-playing-basketball-2280/';

// The saved inference outputs keep their original Chinese field names and values.
export const STREET_WINDOWS = [
  { start: 0, end: 1.5, raw: "{\"人数\": \"20/20+\", \"有汽车\": true, \"有自行车\": true}" },
  { start: 1.5, end: 3, raw: "{\"人数\": \"20/20+\", \"有汽车\": true, \"有自行车\": false}" },
  { start: 3, end: 4.5, raw: "{\"人数\": \"20/20+\", \"有汽车\": false, \"有自行车\": true}" },
  { start: 4.5, end: 6, raw: "{\"人数\": \"20/20+\", \"有汽车\": true, \"有自行车\": true}" },
  { start: 6, end: 7.5, raw: "{\"人数\": \"20/20+\", \"有汽车\": true, \"有自行车\": false}" },
  { start: 7.5, end: 9, raw: "{\"人数\": \"20/20+\", \"有汽车\": true, \"有自行车\": true}" },
  { start: 9, end: 10.5, raw: "{\"人数\": \"20/20+\", \"有汽车\": true, \"有自行车\": false}" },
  { start: 10.5, end: 12, raw: "{\"人数\": \"20/20+\", \"有汽车\": true, \"有自行车\": false}" },
  { start: 12, end: 13.5, raw: "{\"人数\": \"20/20+\", \"有汽车\": true, \"有自行车\": false}" },
  { start: 13.5, end: 15, raw: "{\"人数\": \"20/20+\", \"有汽车\": true, \"有自行车\": true}" },
  { start: 15, end: 16.5, raw: "{\"人数\": \"20/20+\", \"有汽车\": true, \"有自行车\": false}" },
  { start: 16.5, end: 18, raw: "{\"人数\": \"20/20+\", \"有汽车\": true, \"有自行车\": false}" },
  { start: 18, end: 19.5, raw: "{\"人数\": \"20/20+\", \"有汽车\": true, \"有自行车\": false}" },
] as const;

export function videoUnderstandingSchema(locale: VideoPreviewLocale, title: string, description: string, baseUrl = SITE_URL) {
  const url = baseUrl + videoPreviewPath('/video-understanding', locale);
  const breadcrumbId = url + '#breadcrumb';
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage', '@id': url + '#webpage', url, name: title, description,
        inLanguage: videoPreviewLanguage(locale),
        primaryImageOfPage: { '@type': 'ImageObject', contentUrl: baseUrl + UNDERSTANDING_MEDIA.poster },
        breadcrumb: { '@id': breadcrumbId },
      },
      {
        '@type': 'BreadcrumbList', '@id': breadcrumbId,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'DLSS 5 Studio', item: baseUrl + (locale === 'zh' ? '/zh' : '/') },
          { '@type': 'ListItem', position: 2, name: locale === 'zh' ? '视频工作台' : 'Video Studio', item: baseUrl + videoPreviewPath('/video-studio', locale) },
          { '@type': 'ListItem', position: 3, name: locale === 'zh' ? 'AI 视频理解' : 'AI Video Understanding', item: url },
        ],
      },
    ],
  };
}
