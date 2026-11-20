import SEO from '../components/SEO';
import { VideoUpscaleLabContent } from '../components/VideoUpscaleLab';
import { videoPreviewLanguage, type VideoPreviewLocale } from '../content/videoStudio';
import { VIDEO_UPSCALE_MEDIA, videoUpscaleLabAlternates, videoUpscaleLabCopy, videoUpscaleLabPath, videoUpscaleLabSchema } from '../content/videoUpscaleLab';

export default function VideoUpscaleLab({ locale }: { locale: VideoPreviewLocale }) {
  const { title, lead } = videoUpscaleLabCopy(locale);
  return <>
    <SEO title={title} description={lead} canonical={videoUpscaleLabPath(locale)} language={videoPreviewLanguage(locale)}
      image={VIDEO_UPSCALE_MEDIA + '/hero.jpg'} robots="noindex,nofollow" alternates={videoUpscaleLabAlternates()} structuredData={videoUpscaleLabSchema(locale)} />
    <VideoUpscaleLabContent locale={locale} />
  </>;
}
