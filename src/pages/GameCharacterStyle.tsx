import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';
import ImageSlider from '../components/ImageSlider';
import { GAME_STYLE_LANDING, gameStyleLandingSchema } from '../content/gameStyleLanding';

export default function GameCharacterStyle() {
  const { i18n } = useTranslation();
  const isZh = i18n.language.startsWith('zh');
  return (
    <>
      <SEO
        title={GAME_STYLE_LANDING.title}
        description={GAME_STYLE_LANDING.description}
        keywords={[...GAME_STYLE_LANDING.keywords]}
        canonical={GAME_STYLE_LANDING.path}
        image="/examples/generated/game-cyber-1-after.jpg"
        structuredData={gameStyleLandingSchema()}
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
            <Link to="/dashboard?tool=enhance" className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-bold text-black hover:bg-white focus-visible:outline-2 focus-visible:outline-primary">
              {isZh ? '上传自己的角色图' : 'Try your own character frame'} <ArrowRight aria-hidden="true" className="w-4 h-4" />
            </Link>
            <Link to="/video-upscaler" className="inline-flex items-center gap-2 rounded-lg border border-outline-variant/40 px-6 py-3 font-semibold text-zinc-200 hover:border-primary hover:text-primary">
              {isZh ? '查看视频增强工作流' : 'See the video workflow'} <ArrowRight aria-hidden="true" className="w-4 h-4" />
            </Link>
          </div>
        </header>

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
