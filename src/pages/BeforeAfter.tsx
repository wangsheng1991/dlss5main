import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import ImageSlider from '../components/ImageSlider';
import { BEFORE_AFTER_CASES, BEFORE_AFTER_COPY, BEFORE_AFTER_FAQ, beforeAfterSchema } from '../content/beforeAfter';
import { SITE_URL } from '../config/site';

type Locale = 'en' | 'zh';

export default function BeforeAfter({ locale = 'en' }: { locale?: Locale }) {
  const isZh = locale === 'zh';
  const copy = isZh ? BEFORE_AFTER_COPY.zh : BEFORE_AFTER_COPY.en;
  const canonical = isZh ? '/zh/before-after' : '/before-after';
  const schema = beforeAfterSchema();

  return (
    <main className="pt-28 pb-24 px-6 max-w-[1280px] mx-auto">
      <SEO
        title={copy.title}
        description={copy.description}
        canonical={canonical}
        language={isZh ? 'zh-CN' : 'en-US'}
        image="/examples/case-architecture.jpg"
        keywords={isZh ? ['DLSS 5 前后对比', 'DLSS 5 图像转换', 'AI 图片放大前后', '游戏人物风格转换'] : ['dlss 5 before and after', 'dlss 5 image converter examples', 'ai upscaling before and after', 'game character style conversion', 'does upscaling change faces']}
        alternates={[
          { hrefLang: 'en', href: `${SITE_URL}/before-after` },
          { hrefLang: 'zh-CN', href: `${SITE_URL}/zh/before-after` },
          { hrefLang: 'x-default', href: `${SITE_URL}/before-after` },
        ]}
        structuredData={schema}
      />

      <header className="max-w-4xl">
        <nav className="mb-8 text-sm text-zinc-500" aria-label={isZh ? '面包屑' : 'Breadcrumb'}>
          <Link to="/">DLSS5NVIDIA</Link><span className="mx-2" aria-hidden="true">/</span><span>{isZh ? '前后对比' : 'Before and after'}</span>
        </nav>
        <p className="text-primary uppercase tracking-[0.2em] text-xs font-label">{isZh ? '独立视觉参考 · 复审 2026-10-11' : 'Independent visual references · reviewed 2026-10-11'}</p>
        <h1 className="text-4xl md:text-6xl font-headline font-bold text-white mt-4">{copy.heading}</h1>
        <p className="text-lg leading-relaxed text-zinc-300 mt-6">{copy.answer}</p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link to="/image-quality-enhancer" className="inline-flex rounded-lg bg-primary px-6 py-3 font-bold text-black hover:bg-primary-container transition-colors">{isZh ? '免费试用视觉增强器' : 'Try the free visual enhancer'}</Link>
          <Link to="/image-upscaler" className="inline-flex rounded-lg border border-primary/50 px-6 py-3 font-semibold text-primary hover:bg-primary/10 transition-colors">{isZh ? '打开图片放大工具' : 'Open the image upscaler'}</Link>
          <Link to="/download" className="inline-flex rounded-lg border border-outline-variant/40 px-6 py-3 font-semibold text-zinc-200 hover:border-primary hover:text-primary transition-colors">{isZh ? '了解 Studio 下载申请' : 'See Studio download details'}</Link>
        </div>
      </header>

      <section className="mt-16" aria-labelledby="gallery-heading">
        <div className="max-w-3xl">
          <h2 id="gallery-heading" className="text-3xl font-headline font-bold text-white">{isZh ? '先看三组放大与修复结果' : 'Start with three enlargement and restoration references'}</h2>
          <p className="mt-3 text-zinc-400 leading-relaxed">{isZh ? '滑动分界线，核对尺寸、边缘和身份信息。每张图都保留原图，输出不是事实恢复的保证。' : 'Drag the split and check dimensions, edges and identity cues. Every card keeps the source visible; an output is not a guarantee of factual recovery.'}</p>
        </div>
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-5">
          {BEFORE_AFTER_CASES.slice(0, 4).map((item) => <CaseCard key={item.id} item={item} isZh={isZh} />)}
        </div>
      </section>

      <section className="mt-20" aria-labelledby="workflow-heading">
        <div className="max-w-3xl">
          <h2 id="workflow-heading" className="text-3xl font-headline font-bold text-white">{isZh ? '同一套检查也适用于编辑工作流' : 'The same checks apply to editing workflows'}</h2>
          <p className="mt-3 text-zinc-400 leading-relaxed">{isZh ? '抠图、擦除和试穿不是放大；它们改变的是对象或局部区域。页面把输入、控制项和限制写在每张案例下面。' : 'Cutout, erase and try-on are not upscaling; they change an object or a local region. Each card keeps its input, controls and limits beside the image.'}</p>
        </div>
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-5">
          {BEFORE_AFTER_CASES.slice(4).map((item) => <CaseCard key={item.id} item={item} isZh={isZh} />)}
        </div>
      </section>

      <section className="mt-20" aria-labelledby="video-heading">
        <div className="max-w-3xl">
          <h2 id="video-heading" className="text-3xl font-headline font-bold text-white">{isZh ? '六秒视频：看转换过程，再看静帧' : 'Six-second videos: watch the transition, then inspect frames'}</h2>
          <p className="mt-3 text-zinc-400 leading-relaxed">{isZh ? '视频会循环播放、静音并预加载元数据。文字结论与视频同时提供，方便搜索引擎和无法播放视频的读者理解页面。' : 'Both clips loop silently and preload metadata. The text conclusion sits beside each video so a crawler or a reader without playback still gets the claim.'}</p>
        </div>
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <VideoCard
            src="/examples/dlss5-upscale-before-after-demo.mp4"
            poster="/examples/generated/architecture-1-after.jpg"
            title={isZh ? '低分辨率输入到放大参考输出' : 'Low-resolution input to an upscale reference'}
            conclusion={isZh ? '文字结论：这段原创参考展示了输入到输出的过渡；它不是模型速度或质量基准。' : 'Text conclusion: this original reference shows a source-to-output transition; it is not a model speed or quality benchmark.'}
            label={isZh ? '图片放大 · 6 秒' : 'Image enlargement · 6 seconds'}
          />
          <VideoCard
            src="/examples/dlss5-game-style-transition.mp4"
            poster="/examples/generated/game-cyber-1-after.jpg"
            title={isZh ? '游戏人物风格转换参考' : 'Game character style conversion reference'}
            conclusion={isZh ? '文字结论：角色身份、姿态与轮廓是检查锚点；这是独立风格参考，不是 NVIDIA 运行时画面。' : 'Text conclusion: identity, pose and silhouette are the review anchors; this is an independent style reference, not NVIDIA runtime footage.'}
            label={isZh ? '人物风格 · 6 秒' : 'Character style · 6 seconds'}
          />
        </div>
      </section>

      <section className="mt-20 rounded-2xl border border-amber-500/25 bg-amber-500/[0.06] p-6 sm:p-8" aria-labelledby="limits-heading">
        <h2 id="limits-heading" className="text-2xl font-headline font-bold text-white">{isZh ? '哪些输入容易失败' : 'Inputs that commonly fail'}</h2>
        <ul className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm leading-relaxed text-zinc-300">
          <li><strong className="text-white">{isZh ? '极低分辨率：' : 'Very small sources: '}</strong>{isZh ? '没有可恢复的边缘时，放大只会生成看似合理的纹理。' : 'When edges are absent, enlargement can only estimate plausible texture.'}</li>
          <li><strong className="text-white">{isZh ? '小字与标识：' : 'Tiny text and logos: '}</strong>{isZh ? '必须逐字对照，不能把生成结果当作可验证文字。' : 'Compare every character; generated lettering is not verified text.'}</li>
          <li><strong className="text-white">{isZh ? '多人脸与运动模糊：' : 'Multiple faces and motion blur: '}</strong>{isZh ? '身份和手部更容易漂移，先用短样本测试。' : 'Identity and hands can drift more easily; test a short sample first.'}</li>
          <li><strong className="text-white">{isZh ? '放大不是事实恢复：' : 'Enlargement is not factual recovery: '}</strong>{isZh ? '保留原文件，并在交付前按 100% 检查边缘、脸和材质。' : 'Keep the original and inspect edges, faces and materials at 100% before delivery.'}</li>
        </ul>
      </section>

      <section className="mt-20" id="faq" aria-labelledby="faq-heading">
        <h2 id="faq-heading" className="text-3xl font-headline font-bold text-white">{isZh ? '前后对比常见问题' : 'Before-and-after questions'}</h2>
        <div className="mt-6 grid gap-4">{BEFORE_AFTER_FAQ.map((item) => <details key={item.question} className="rounded-xl border border-outline-variant/20 bg-surface-low p-5"><summary className="cursor-pointer text-white font-semibold">{isZh ? translateFaq(item.question) : item.question}</summary><p className="mt-3 text-sm leading-relaxed text-zinc-400">{isZh ? translateFaq(item.answer) : item.answer}</p></details>)}</div>
      </section>

      <section className="mt-20 border-t border-outline-variant/20 pt-8">
        <h2 className="text-xl font-headline font-bold text-white">{isZh ? '继续操作' : 'Continue with a real workflow'}</h2>
        <p className="mt-4 text-zinc-400 leading-relaxed">{isZh ? '想处理自己的图像，可以先试免费示例，再进入对应工具。Windows Studio 仍处于开发与申请阶段。' : 'Use a free cached example first, then open the matching tool for your own image. Windows Studio is still in development and available by request.'}</p>
        <p className="mt-4 flex flex-wrap gap-4 text-primary"><Link to="/image-quality-enhancer">{isZh ? '视觉增强器' : 'Visual enhancer'} →</Link><Link to="/image-upscaler">{isZh ? '图片放大器' : 'Image upscaler'} →</Link><Link to="/game-character-style">{isZh ? '20 组人物风格案例' : '20 game character cases'} →</Link><Link to="/download">{isZh ? 'Studio 下载说明' : 'Studio download details'} →</Link></p>
      </section>
    </main>
  );
}

function CaseCard({ item, isZh }: { item: typeof BEFORE_AFTER_CASES[number]; isZh: boolean; key?: React.Key }) {
  return <article className="rounded-2xl border border-outline-variant/20 bg-surface-low overflow-hidden">
    <ImageSlider highRes={item.after} lowRes={item.before} alt={isZh ? `${item.titleZh}前后对比` : `${item.title} before and after`} inputLabel={isZh ? '输入' : 'Input'} outputLabel={isZh ? '输出参考' : 'Output reference'} compareLabel={isZh ? `拖动查看${item.titleZh}前后对比` : `Drag to compare ${item.title}`} initialAspectRatio={item.aspectRatio} />
    <div className="p-5"><p className="text-[10px] text-primary uppercase tracking-widest font-label">{isZh ? item.categoryZh : item.category}</p><h3 className="mt-2 text-xl font-headline font-bold text-white">{isZh ? item.titleZh : item.title}</h3><p className="mt-3 text-sm leading-relaxed text-zinc-300">{isZh ? item.descriptionZh : item.description}</p><dl className="mt-4 grid grid-cols-2 gap-3 text-xs"><div><dt className="text-zinc-500">{isZh ? '输入' : 'Input'}</dt><dd className="mt-1 text-zinc-200">{item.beforeSize}</dd></div><div><dt className="text-zinc-500">{isZh ? '输出' : 'Output'}</dt><dd className="mt-1 text-zinc-200">{item.afterSize}</dd></div></dl>{item.extraInput && <p className="mt-3 text-xs text-zinc-400">{isZh ? '第二张参考：' : 'Second reference: '}<code>{item.extraInput}</code></p>}<details className="mt-4 text-xs text-zinc-400"><summary className="cursor-pointer text-primary">{isZh ? '查看提示词与记录' : 'View prompt and run record'}</summary><p className="mt-2 leading-relaxed"><strong className="text-zinc-200">{isZh ? '提示词：' : 'Prompt: '}</strong>{item.prompt}</p><p className="mt-2 leading-relaxed"><strong className="text-zinc-200">{isZh ? '记录：' : 'Record: '}</strong>{isZh ? item.recordZh : item.record}</p></details><p className="mt-4 text-xs leading-relaxed text-zinc-500"><strong className="text-zinc-300">{isZh ? '边界：' : 'Limit: '}</strong>{isZh ? item.limitZh : item.limit}</p></div>
  </article>;
}

function VideoCard({ src, poster, title, conclusion, label }: { src: string; poster: string; title: string; conclusion: string; label: string }) {
  return <figure className="rounded-2xl border border-primary/25 bg-surface-low overflow-hidden"><video className="w-full aspect-video object-cover bg-black" controls muted loop playsInline preload="metadata" poster={poster} aria-label={title}><source src={src} type="video/mp4" />{title}</video><figcaption className="p-5"><p className="text-[10px] text-primary uppercase tracking-widest font-label">{label}</p><h3 className="mt-2 text-lg font-headline font-bold text-white">{title}</h3><p className="mt-2 text-sm leading-relaxed text-zinc-400">{conclusion}</p></figcaption></figure>;
}

function translateFaq(value: string) {
  const map: Record<string, string> = {
    'Are these NVIDIA DLSS 5 runtime screenshots?': '这些是 NVIDIA DLSS 5 运行时截图吗？',
    'No. These are independent before-and-after references from the DLSS5NVIDIA image pipeline. They are not NVIDIA captures and do not prove an in-game DLSS runtime result.': '不是。这些是 DLSS5NVIDIA 自有图像管线的独立前后对比参考，不是 NVIDIA 截图，也不能证明游戏内 DLSS 运行时结果。',
    'What does “before and after” mean here?': '这里的“前后对比”是什么意思？',
    'Each card keeps the input beside one output from the named workflow. The three low/high pairs show verified file dimensions; the retouch, cutout, erase and try-on cards show measured workflow runs with their controls and date.': '每张卡都把输入和指定工作流的一次输出放在一起。前三组低清/高清图片标注了已复核的文件尺寸；修复、抠图、擦除和试穿案例则写明控制项与记录日期。',
    'Does upscaling recover factual detail?': '放大能恢复事实细节吗？',
    'No. It estimates a more usable visual result from the input. Faces, labels, numbers, thin geometry and repeated patterns can change, so compare them at 100% and keep the original.': '不能。它是基于输入估计更可用的视觉结果。脸部、标签、数字、细线几何和重复纹理都可能改变，请按 100% 对比并保留原图。',
    'Can I try the converter without an RTX GPU?': '没有 RTX 显卡也能试用转换器吗？',
    'Yes. The browser workflow runs on the site service, so a modern browser is enough for a cached example or an account workflow. The separate DLSS5 Studio request page is a Windows RTX product and is still being developed.': '可以。浏览器工作流由网站服务处理，现代浏览器即可运行缓存示例或账号工作流。独立的 DLSS5 Studio 申请页对应 Windows RTX 产品，目前仍在开发中。',
    'Why is the retouch card not labelled as an upscale?': '为什么人像修复卡没有标成放大？',
    'Its input and output are both 600 × 900. It is a same-size portrait retouch case, included to show the difference between restoring an existing image and enlarging it.': '它的输入和输出都是 600 × 900。这是同尺寸人像修复，用来说明修复已有图像与放大图像的区别。',
    'What inputs usually fail?': '哪些输入通常容易失败？',
    'Extremely small or heavily compressed images, tiny text, multiple faces and scenes with motion blur are hard cases. Start with the largest original file, then inspect the result before sharing or publishing it.': '极小或重度压缩图片、小字、多人脸和运动模糊都是难例。请从最大尺寸的原始文件开始，检查结果后再分享或发布。',
  };
  return map[value] || value;
}
