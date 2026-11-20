import SEO from '../components/SEO';
import { VideoToolContent } from '../components/VideoToolContent';
import VideoToolWorkspace from '../components/VideoToolWorkspace';
import { videoPreviewLanguage, type VideoPreviewLocale } from '../content/videoStudio';
import { videoToolAlternates, videoToolPath, videoToolSchema, videoToolTitle, type VideoTool as Tool } from '../content/videoTools';
import { HIGHLIGHTS_MEDIA } from '../content/videoHighlights';

export default function VideoTool({ tool, locale }: { tool: Tool; locale: VideoPreviewLocale }) {
  return <>
    <SEO title={videoToolTitle(tool, locale)} description={tool[locale][1]} canonical={videoToolPath(tool, locale)}
      image={HIGHLIGHTS_MEDIA.poster} language={videoPreviewLanguage(locale)}
      alternates={videoToolAlternates(tool)} structuredData={videoToolSchema(tool, locale)} />
    <VideoToolContent tool={tool} locale={locale} workspace={<div key={tool.slug}><VideoToolWorkspace tool={tool} locale={locale} /></div>} />
  </>;
}
