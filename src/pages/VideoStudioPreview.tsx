import SEO from '../components/SEO';
import { VideoPreviewContent } from '../components/VideoPreviewContent';
import {
  VIDEO_PREVIEW_COPY, videoPreviewAlternates, videoPreviewLanguage, videoPreviewPath,
  videoPreviewTitle, type VideoPreviewLocale, type VideoPreviewPath,
} from '../content/videoStudio';

type Props = { page: VideoPreviewPath; locale: VideoPreviewLocale };

export default function VideoStudioPreview({ page, locale }: Props) {
  const copy = VIDEO_PREVIEW_COPY[locale][page];
  return <>
    <SEO title={videoPreviewTitle(page, locale)} description={copy.lead} canonical={videoPreviewPath(page, locale)}
      language={videoPreviewLanguage(locale)} alternates={page === '/video-upscaler' ? undefined : videoPreviewAlternates(page)}
      robots={page === '/video-studio' ? undefined : 'noindex,nofollow'} />
    <VideoPreviewContent page={page} locale={locale} />
  </>;
}
