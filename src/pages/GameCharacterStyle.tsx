import React from 'react';
import { ArrowRight, Loader2, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';
import ImageSlider from '../components/ImageSlider';
import { SAMPLES, type SampleId } from '../config/samples';
import { useSampleRun } from '../features/generation/useSampleRun';
import { GAME_STYLE_LANDING, GAME_STYLE_LONG_FORM, gameStyleLandingSchema } from '../content/gameStyleLanding';

/**
 * The free first click.
 *
 * This page explains the workflow with twenty reference pairs and then used to send every visitor
 * to a studio that requires an account — the one flagship tool with nothing to try. This runs the
 * same cached, account-free example the studio offers, in place: no navigation, no sign-in, and the
 * before/after slider the visitor already knows how to read.
 */
function FreeStyleExample() {
  const { i18n } = useTranslation();
  const isZh = i18n.language.startsWith('zh');
  const sample = useSampleRun();
  const id: SampleId = 'characterStyle';
  const state = sample.state;
  return (
    <section aria-labelledby="free-example-heading" className="mt-10 rounded-xl border border-outline-variant/20 bg-surface-low p-5 sm:p-6">
      <h2 id="free-example-heading" className="text-lg md:text-xl font-headline font-bold text-white">{isZh ? '先免费试一次：赛博朋克方向' : 'Try one conversion first: the cyberpunk direction'}</h2>
      <p className="mt-2 text-sm leading-relaxed text-zinc-400">{isZh ? '不用登录，也不用先上传。这就是工作室里同一个缓存示例，服务器只算一次，所以免费。' : 'No account and no upload. It is the same cached example the studio offers, computed once on the server, so it is free.'}</p>
      {state.status === 'error' && <p role="alert" className="mt-4 text-sm text-red-300">{state.message}</p>}
      {state.status !== 'ready' && <button type="button" disabled={state.status === 'running'} onClick={() => void sample.run(id)} className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-bold text-black hover:bg-white focus-visible:outline-2 focus-visible:outline-primary disabled:opacity-60 disabled:cursor-not-allowed">
        {state.status === 'running' ? <Loader2 aria-hidden="true" className="w-4 h-4 animate-spin"/> : <Play aria-hidden="true" className="w-4 h-4"/>}
        {state.status === 'running' ? (isZh ? '正在准备示例…' : 'Preparing the example…') : (isZh ? '免费试用示例 · 一键运行' : 'Run this example · free')}
      </button>}
      {state.status === 'ready' && <div className="mt-5 flex flex-col gap-5">
        <div className="max-w-3xl">
          <ImageSlider highRes={state.run.result} lowRes={state.run.input} alt={isZh ? '赛博朋克人物风格转换前后对比' : 'Cyberpunk character style conversion, before and after'} inputLabel={isZh ? '原始人物帧' : 'Base frame'} outputLabel={isZh ? '风格转换结果' : 'Converted frame'} compareLabel={isZh ? '风格转换前后对比' : 'Style conversion comparison'} initialAspectRatio={1.5}/>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <p role="status" className="text-xs text-zinc-500">{isZh ? '示例结果' : 'Example result'}{state.run.cached ? (isZh ? ' · 来自缓存' : ' · served from cache') : ''}</p>
          <a href={state.run.result} download={`${SAMPLES[id].fileName.replace(/\.[^.]+$/, '')}-style.${state.run.extension}`} className="inline-flex items-center gap-2 text-sm text-primary">{isZh ? '下载结果' : 'Download the result'}</a>
          <Link to="/dashboard?tool=game-character-style&sample=characterStyle" className="inline-flex items-center gap-2 text-sm text-primary">{isZh ? '换成自己的角色图' : 'Use your own character frame'} <ArrowRight aria-hidden="true" className="w-4 h-4"/></Link>
        </div>
      </div>}
    </section>
  );
}

export default function GameCharacterStyle() {
  const { i18n } = useTranslation();
  const isZh = i18n.language.startsWith('zh');
  const seoTitle = isZh ? '20 组游戏人物风格转换案例：前后对比' : GAME_STYLE_LANDING.title;
  const seoDescription = isZh
    ? '浏览 20 组原创游戏人物前后对比案例：保持姿势、服装和身份，再改变赛博朋克、奇幻、科幻、动漫与写实风格。'
    : GAME_STYLE_LANDING.description;
  return (
    <>
      <SEO
        title={seoTitle}
        description={seoDescription}
        keywords={[...GAME_STYLE_LANDING.keywords]}
        canonical={GAME_STYLE_LANDING.path}
        image="/examples/generated/game-cyber-1-after.jpg"
        language={isZh ? 'zh-CN' : 'en-US'}
        structuredData={gameStyleLandingSchema(undefined, {
          title: seoTitle,
          description: seoDescription,
          heading: isZh ? '20 组游戏人物风格转换案例' : GAME_STYLE_LANDING.heading,
          language: isZh ? 'zh-CN' : 'en-US',
        })}
      />
      <main className="pt-28 sm:pt-32 pb-24 px-5 max-w-[1280px] mx-auto w-full">
        <nav className="mb-8 text-sm text-zinc-500" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-primary">DLSS5NVIDIA</Link><span className="mx-2" aria-hidden="true">/</span><span>{GAME_STYLE_LANDING.heading}</span>
        </nav>
        <header className="max-w-4xl">
          <p className="text-primary font-label text-xs uppercase tracking-[0.2em] mb-4">{isZh ? '游戏人物风格转换案例' : 'Game character style conversion'}</p>
          <h1 className="text-4xl md:text-6xl font-headline font-bold tracking-tight text-white leading-[1.05]">{isZh ? '20 组游戏人物前后对比案例' : GAME_STYLE_LANDING.heading}</h1>
          <p className="mt-6 text-lg leading-relaxed text-zinc-300">{isZh ? '保持人物轮廓、服装、动作和身份，再改变光照、材质、色彩和世界观。拖动每组对比线，直接检查风格转换是否保留了真正重要的细节。' : GAME_STYLE_LANDING.intro}</p>
          <div className="mt-6 rounded-xl border border-primary/25 bg-primary/5 p-5 text-sm leading-relaxed text-zinc-200">
            <strong className="text-primary">{isZh ? '素材说明：' : 'Asset note: '}</strong>
            {isZh ? '下面 20 组是原创视觉参考，用于展示评估方法，不是 NVIDIA 官方 DLSS 5 截图，也不代表已经接入 DLSS 5 运行时。' : 'These 20 pairs are original visual references for evaluating a conversion brief. They are not NVIDIA DLSS 5 captures and do not claim a DLSS 5 runtime integration.'}
          </div>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/dashboard?tool=game-character-style&sample=characterStyle" className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-bold text-black hover:bg-white focus-visible:outline-2 focus-visible:outline-primary">
              {isZh ? '上传自己的角色图' : 'Try your own character frame'} <ArrowRight aria-hidden="true" className="w-4 h-4" />
            </Link>
            <Link to="/video-upscaler" className="inline-flex items-center gap-2 rounded-lg border border-outline-variant/40 px-6 py-3 font-semibold text-zinc-200 hover:border-primary hover:text-primary">
              {isZh ? '查看视频增强工作流' : 'See the video workflow'} <ArrowRight aria-hidden="true" className="w-4 h-4" />
            </Link>
          </div>
        </header>

        <FreeStyleExample />

        <section className="mt-16 max-w-4xl space-y-7" aria-labelledby="definition-heading">
          <div><h2 id="definition-heading" className="text-2xl font-headline font-bold text-white">What game character style conversion means</h2><p className="mt-3 text-sm leading-relaxed text-zinc-300">{isZh ? '游戏人物风格转换是在保持人物可识别部分的前提下改变视觉语言。轮廓、动作、服装结构、镜头和身份保持稳定，再控制光照、材质、色彩、环境与渲染方向。下面的原创参考图用于制定和验收转换需求，不是 NVIDIA 官方截图，也不宣称使用 DLSS 运行时处理。' : GAME_STYLE_LONG_FORM.definition}</p></div>
          <div><h2 className="text-2xl font-headline font-bold text-white">Lock the identity before changing the style</h2><p className="mt-3 text-sm leading-relaxed text-zinc-300">{isZh ? '先写清楚不可改变的轮廓、动作、镜头、脸型、发型和主要装备，再把风格变量单独列出。这样可以避免提示词在改变世界观时意外重做人物。' : GAME_STYLE_LONG_FORM.invariants}</p></div>
          <div><h2 className="text-2xl font-headline font-bold text-white">Change visual variables deliberately</h2><p className="mt-3 text-sm leading-relaxed text-zinc-300">{isZh ? '把电影轮廓光、赛璐璐边缘、旧金属、半透明布料、霓虹反射、绘画质感或写实皮肤作为可控变量。每次只改一两个变量，并和原始构图并排比较。' : GAME_STYLE_LONG_FORM.variables}</p></div>
          <div><h2 className="text-2xl font-headline font-bold text-white">How to review a conversion</h2><p className="mt-3 text-sm leading-relaxed text-zinc-300">{isZh ? '缩略图检查视觉层级，100% 检查眼睛、手指、脸部比例、武器轮廓、盔甲接缝和布料褶皱。如果要用于视频，还要检查多帧之间的闪烁和身份漂移。' : GAME_STYLE_LONG_FORM.review}</p></div>
        </section>

        <section className="mt-16" aria-labelledby="case-gallery-heading">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-7">
            <div><p className="text-xs uppercase tracking-widest text-primary">20 original pairs</p><h2 id="case-gallery-heading" className="mt-2 text-3xl font-headline font-bold text-white">{isZh ? '拖动对比：原始构图 → 风格参考' : 'Drag to compare: base frame → style reference'}</h2></div>
            <p className="text-sm text-zinc-500">{isZh ? '建议重点检查脸部、手部、装备边缘和布料褶皱。' : 'Check faces, hands, gear edges and cloth folds first.'}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {GAME_STYLE_LANDING.cases.map((item, index) => (
              <article key={item.id} className="rounded-xl border border-outline-variant/20 bg-surface-low overflow-hidden">
                <ImageSlider highRes={item.after} lowRes={item.before} alt={item.alt} inputLabel={isZh ? '原始构图' : 'Base frame'} outputLabel={isZh ? '风格参考' : 'Style reference'} compareLabel={isZh ? `${item.titleZh}风格转换对比` : `${item.title} style conversion`} initialAspectRatio={1.5} priority={index < 2} />
                <div className="p-4"><p className="text-[10px] text-primary font-label uppercase tracking-widest mb-2">{isZh ? item.styleZh : item.style}</p><h3 className="text-base font-headline font-bold text-white">{isZh ? item.titleZh : item.title}</h3><p className="mt-2 text-xs leading-relaxed text-zinc-400">{isZh ? item.descriptionZh : item.description}</p><details className="mt-3 text-xs text-zinc-400"><summary className="cursor-pointer text-primary">{isZh ? '查看转换提示词' : 'View conversion prompt'}</summary><p className="mt-2 leading-relaxed">{item.prompt}</p></details></div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6" aria-labelledby="conversion-checks-heading">
          <h2 id="conversion-checks-heading" className="sr-only">Character conversion checks</h2>
          {[
            [isZh ? '01 · 锁定角色' : '01 · Lock the character', isZh ? '先写清楚轮廓、服装、动作、镜头和身份不可改变。' : 'State that silhouette, costume, pose, camera and identity must stay stable.'],
            [isZh ? '02 · 只改风格' : '02 · Change the style', isZh ? '把光照、材质、调色、环境和渲染方向作为可变项。' : 'Use lighting, materials, color grade, environment and render direction as the variables.'],
            [isZh ? '03 · 逐项验收' : '03 · Review the result', isZh ? '在 100% 比较脸部、手部、装备边缘和帧间一致性。' : 'Compare the face, hands, gear edges and temporal consistency at 100%.'],
          ].map(([title, text]) => <article key={title} className="rounded-xl border border-outline-variant/20 bg-surface-low p-6"><h3 className="text-lg font-headline font-bold text-white">{title}</h3><p className="mt-3 text-sm leading-relaxed text-zinc-400">{text}</p></article>)}
        </section>
      </main>
    </>
  );
}
