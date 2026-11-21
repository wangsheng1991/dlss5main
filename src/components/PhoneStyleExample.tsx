import { useSampleRun } from '../features/generation/useSampleRun';
import { SAMPLES } from '../config/samples';
import { trackEvent } from '../lib/analytics';
import ImageSlider from './ImageSlider';

/** Shared by the phone availability guide and download page, including prerendered HTML. */
export default function PhoneStyleExample({ chinese = false, surface }: { chinese?: boolean; surface: 'apk_phone_example' | 'download_phone_example' }) {
  const { state, run } = useSampleRun();
  const t = (en: string, zh: string) => chinese ? zh : en;
  return <section data-phone-style-example={surface} className="mt-8 mb-10 rounded-2xl border border-primary/25 bg-primary/5 p-5 sm:p-7" aria-labelledby="phone-style-example-heading">
    <h2 id="phone-style-example-heading" className="text-2xl font-bold text-white">{t('Try a character-style result on your phone', '在手机上直接试一次角色风格转换')}</h2>
    <p className="mt-3 text-sm leading-relaxed text-zinc-300">{t('No APK, account or personal upload is needed for this supplied example. Inspect how a character frame changes in lighting and material appearance, then save its image result. This is our independent style-redraw workflow, not NVIDIA DLSS running in a phone game.', '这个内置示例不需要 APK、账号或上传个人图片。检查角色画面的光照与材质观感变化，再保存图片结果。这是本站独立的风格重绘流程，不是在手机游戏里运行 NVIDIA DLSS。')}</p>
    {state.status !== 'ready' && <figure className="mt-5 max-w-2xl"><img src={SAMPLES.characterStyle.src} alt={t('Supplied character frame before the style redraw', '风格重绘前的内置角色画面')} width="768" height="512" className="w-full h-auto rounded-xl" loading="lazy" /><figcaption className="mt-2 text-xs text-zinc-400">{t('Input: our original character reference. The result appears after you run the example.', '输入：本站原创角色参考图。运行示例后显示返回的结果。')}</figcaption></figure>}
    {state.status !== 'ready' && <button type="button" disabled={state.status === 'running'} className="mt-5 min-h-12 rounded-lg bg-primary px-5 py-3 font-bold text-black disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary" onClick={() => {
      trackEvent('tool_cta_click', { surface, tool: 'game-character-style', target: 'free_sample' });
      void run('characterStyle');
    }}>{state.status === 'running' ? t('Preparing the example…', '正在准备示例…') : t('Run the character example · free', '免费运行角色示例')}</button>}
    {state.status === 'error' && <p role="alert" className="mt-4 text-sm text-red-300">{state.message}</p>}
    {state.status === 'ready' && <div className="mt-5 max-w-3xl">
      <ImageSlider lowRes={state.run.input} highRes={state.run.result} alt={t('Character lighting and materials before and after our style redraw', '本站角色风格重绘前后的光照与材质对比')} inputLabel={t('Input frame', '输入画面')} outputLabel={t('Style result', '风格结果')} compareLabel={t('Character style comparison', '角色风格对比')} initialAspectRatio={1.5} />
      <p role="status" className="mt-3 text-sm text-zinc-300">{state.run.cached ? t('Example ready · served from cache', '示例已就绪 · 来自缓存') : t('Example ready', '示例已就绪')}</p>
      <a href={state.run.result} download={`character-style.${state.run.extension}`} className="mt-4 inline-flex min-h-12 items-center text-primary underline underline-offset-4">{t('Download the result image', '下载结果图片')}</a>
    </div>}
    <ol className="mt-5 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-zinc-300">
      <li>{t('Run the supplied example and wait for a result or an error message.', '运行内置示例，等待结果或错误提示。')}</li>
      <li>{t('Check face, pose, clothing and scene layout while comparing the lighting and surfaces. Redrawing can change details; the output is a visual reference.', '对比光照与表面的同时，检查脸部、动作、服装和场景布局。重绘可能改变细节，输出属于视觉参考。')}</li>
      <li>{t('Save the result with its download link. If your phone opens an image preview, use the browser’s image-saving action; a saved picture is not an app installer.', '通过结果链接保存图片。若手机先打开图片预览，请使用浏览器的图片保存功能；保存图片不是安装应用。')}</li>
    </ol>
    <p className="mt-4 text-xs leading-relaxed text-zinc-400">{t('The supplied result may be cached, not a fresh generation. Your own files require sign-in and available credits. Any rate limit or error stays visible; no completion time is promised.', '内置结果可能来自缓存，不代表重新生成。处理自己的文件需要登录和可用积分。限额与错误会如实显示，不承诺完成时间。')}</p>
    <nav aria-label={t('Continue from the phone example', '手机示例的后续操作')} className="mt-5 flex flex-wrap gap-4 text-sm">
      <a className="text-primary underline" href="/dashboard?tool=game-character-style">{t('Sign in to use your own character image', '登录后使用自己的角色图')}</a>
      <a className="text-primary underline" href="/game-character-style">{t('Review more character-style examples', '查看其他角色风格案例')}</a>
      <a className="text-primary underline" href={chinese ? '/zh/download#request' : '/download#request'}>{t('Windows Studio request and requirements', 'Windows Studio 申请与要求')}</a>
    </nav>
  </section>;
}
