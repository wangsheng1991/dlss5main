import { Link } from 'react-router-dom';
export default function LocalVideoEntry({ chinese = false }: { chinese?: boolean }) {
  const p = chinese ? '/zh' : '';
  const items = [
    ['frame-extractor', 'Extract a frame as PNG', '抽取画面并保存 PNG'],
    ['contact-sheet', 'Export a contact sheet', '生成缩略图总览'],
    ['metadata-viewer', 'Check dimensions and duration', '检查分辨率与时长'],
  ];
  return <section data-local-video-entry className="mt-8 rounded-xl border border-lime-300/30 bg-lime-300/5 p-5 sm:p-7" aria-labelledby="local-video-heading">
    <h2 id="local-video-heading" className="text-2xl font-bold text-white">{chinese ? '现在可用：处理你自己的视频文件' : 'Available now: work with your own video file'}</h2>
    <p className="mt-3 leading-relaxed text-zinc-300">{chinese ? '打开你拥有或获准使用的本地视频，在浏览器内抽帧、制作总览或检查规格，无需登录或积分。选出的画面可继续用于角色光照与材质风格参考。' : 'Open a local video you own or have permission to use. Extract a still, make a contact sheet or inspect its dimensions in your browser, without signing in or spending credits. Take selected frames into the character lighting and material-reference workflow.'}</p>
    <ul className="mt-4 grid gap-3 sm:grid-cols-3">{items.map(([slug, en, zh]) => <li key={slug}><Link className="inline-block rounded-lg border border-white/20 px-4 py-3 text-lime-300 underline" to={`${p}/video-studio/${slug}`}>{chinese ? zh : en}</Link></li>)}</ul>
    <p className="mt-4 text-sm leading-relaxed text-zinc-400">{chinese ? '这些工具不抓取第三方平台链接，不生成新视频，也不把整段视频转码或做 AI 增强。可读取的格式取决于浏览器解码支持；模型驱动的视频能力仍以各页面的实际内测范围为准。' : 'These tools do not fetch third-party platform links, generate a new video, transcode a whole clip or perform AI video enhancement. Readable formats depend on browser decoding support. Model-powered video features remain subject to their stated beta scope.'}</p>
  </section>;
}
