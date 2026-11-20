import SEO from '../components/SEO';
import VideoHighlightsBeta from '../components/VideoHighlightsBeta';
import VideoBetaApplication from '../components/VideoBetaApplication';
import { VideoPreviewContent } from '../components/VideoPreviewContent';
import { HIGHLIGHTS_MEDIA } from '../content/videoHighlights';
import { UNDERSTANDING_MEDIA, videoUnderstandingSchema } from '../content/videoUnderstanding';
import {
  VIDEO_PREVIEW_COPY, videoPreviewAlternates, videoPreviewIndexable, videoPreviewLanguage, videoPreviewPath,
  videoPreviewTitle, type VideoPreviewLocale, type VideoPreviewPath,
} from '../content/videoStudio';

type Props = { page: VideoPreviewPath; locale: VideoPreviewLocale };

export default function VideoStudioPreview({ page, locale }: Props) {
  const copy = VIDEO_PREVIEW_COPY[locale][page];
  const title = videoPreviewTitle(page, locale);
  const understanding = page === '/video-understanding';
  return <>
    <SEO title={title} description={copy.lead} canonical={videoPreviewPath(page, locale)}
      language={videoPreviewLanguage(locale)} alternates={page === '/video-upscaler' ? undefined : videoPreviewAlternates(page)}
      robots={videoPreviewIndexable(page) ? undefined : 'noindex,nofollow'}
      image={understanding ? UNDERSTANDING_MEDIA.poster : page === '/video-highlights' ? HIGHLIGHTS_MEDIA.poster : undefined}
      structuredData={understanding ? videoUnderstandingSchema(locale, title, copy.lead) : undefined} />
    <VideoPreviewContent page={page} locale={locale} application={page === '/video-studio' ? <VideoBetaApplication locale={locale} /> : page === '/video-highlights' ? <VideoHighlightsBeta locale={locale} /> : undefined} />
  </>;
}
