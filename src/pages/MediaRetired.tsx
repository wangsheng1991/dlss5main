import SEO from '../components/SEO';
import LocalVideoEntry from '../components/LocalVideoEntry';
export default function MediaRetired() {
  return <><SEO title="Video fetching retired | DLSS 5 Studio" description="Third-party platform video fetching is no longer available. Open your own local video in the browser tools." canonical="/video-downloader" robots="noindex,nofollow" /><main className="mx-auto max-w-5xl px-5 pb-24 pt-32"><h1 className="text-3xl font-bold text-white">Third-party video fetching has been retired / 第三方视频抓取已下线</h1><p className="mt-4 text-zinc-300">No new fetching task can be submitted. / 不再创建平台视频抓取任务。</p><LocalVideoEntry /></main></>;
}
