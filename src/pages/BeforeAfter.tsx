import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import ImageSlider from '../components/ImageSlider';
import { BEFORE_AFTER_CASES, BEFORE_AFTER_COPY, BEFORE_AFTER_FAQ, beforeAfterSchema } from '../content/beforeAfter';
import type { BeforeAfterCase } from '../content/beforeAfter';
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

      <section className="mt-20" aria-labelledby="case-table-heading">
        <h2 id="case-table-heading" className="text-3xl font-headline font-bold text-white">{isZh ? '案例总表' : 'Case index'}</h2>
        <p className="mt-3 text-zinc-400 leading-relaxed">{isZh ? '先按类别、尺寸和记录状态筛选，再打开上面的滑块查看细节。' : 'Scan the category, dimensions and record status before opening a card for the visual detail.'}</p>
        <div className="mt-6 overflow-x-auto rounded-2xl border border-outline-variant/20">
          <table data-case-table className="w-full min-w-[860px] text-left text-sm">
            <thead className="bg-surface-low text-zinc-300"><tr><th className="p-3">{isZh ? '类别' : 'Category'}</th><th className="p-3">{isZh ? '案例' : 'Case'}</th><th className="p-3">{isZh ? '输入' : 'Input'}</th><th className="p-3">{isZh ? '输出' : 'Output'}</th><th className="p-3">{isZh ? '工作类型' : 'Workflow'}</th><th className="p-3">{isZh ? '记录' : 'Record'}</th></tr></thead>
            <tbody>{BEFORE_AFTER_CASES.map((item) => <tr key={item.id} className="border-t border-outline-variant/15"><td className="p-3 text-primary">{isZh ? item.categoryZh : item.category}</td><td className="p-3 text-white"><a href={`#${item.id}`} className="hover:text-primary">{isZh ? item.titleZh : item.title}</a></td><td className="p-3 text-zinc-300">{item.beforeSize}</td><td className="p-3 text-zinc-300">{item.afterSize}</td><td className="p-3 text-zinc-300">{workflowLabel(item.outputType, isZh)}</td><td className="p-3 text-zinc-400">{isZh ? item.recordZh : item.record}</td></tr>)}</tbody>
          </table>
        </div>
      </section>

      <section className="mt-20 grid gap-6 lg:grid-cols-2" aria-labelledby="method-heading">
        <div className="rounded-2xl border border-outline-variant/20 bg-surface-low p-6">
          <h2 id="method-heading" className="text-2xl font-headline font-bold text-white">{isZh ? '方法与复现' : 'Method and reproduction'}</h2>
          <p className="mt-4 text-sm leading-relaxed text-zinc-300">{isZh ? '输入来自我们自己的图像管线上传；每张卡写明控制项。复现时记录原始输入、输出尺寸、模型或预设、硬件、驱动、日期和耗时。' : 'Inputs come from uploads to our own image pipeline; each card names the control used. For a reproduction, record the original input, output size, model or preset, hardware, driver, date and elapsed time.'}</p>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400">{isZh ? '这些案例不是 NVIDIA 运行时截图，不是游戏帧，也不是跨卡对比。只有带逐次台账的案例才可用于耗时复核。' : 'These cases are not NVIDIA runtime screenshots, game frames or cross-GPU comparisons. Only cases with a run ledger can be used for elapsed-time review.'}</p>
          <p className="mt-4 text-sm"><Link className="text-primary hover:text-white" to={isZh ? '/zh/benchmark' : '/benchmark'}>{isZh ? '查看基准证据中心 →' : 'Open the benchmark evidence center →'}</Link></p>
        </div>
        <div className="rounded-2xl border border-outline-variant/20 bg-surface-low p-6">
          <h2 className="text-2xl font-headline font-bold text-white">{isZh ? '继续探索' : 'Continue exploring'}</h2>
          <p className="mt-4 text-sm leading-relaxed text-zinc-300">{isZh ? '想看更深的人物风格案例，可进入 20 组专页；想自己处理图片，可从对应工具或 Studio 说明开始。' : 'For deeper character-style cases, open the 20-case page; for your own image, start with the matching tool or Studio details.'}</p>
          <p className="mt-4 flex flex-wrap gap-4 text-sm"><Link className="text-primary hover:text-white" to="/game-character-style">{isZh ? '20 组人物风格案例 →' : '20 character-style cases →'}</Link><Link className="text-primary hover:text-white" to={isZh ? '/zh/download' : '/download'}>{isZh ? 'Studio 说明 →' : 'Studio details →'}</Link></p>
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
        <div className="mt-6 max-w-3xl rounded-xl border border-outline-variant/20 bg-surface-low p-5">
          <p className="text-sm leading-relaxed text-zinc-300">
            {isZh
              ? '我们公开的唯一视频类实测记录：3 秒 720p 片段（36 帧）在 RTX 4090 参考机、驱动 591.86 上批处理用时 87.4 秒（2.43 秒/帧）。这是本机批处理耗时，不是实时性能，也不是上面两段演示视频的渲染耗时——它们只是过渡参考。'
              : 'Our only published video-pipeline measurement: a three-second 720p clip (36 frames) took 87.4 seconds of batch time on an RTX 4090 reference machine with driver 591.86 — 2.43 seconds per frame. That is local batch time, not real-time performance, and not the render time of the two clips above, which are transition references only.'}
          </p>
          <p className="mt-3 text-xs"><Link className="text-primary hover:text-white" to={isZh ? '/zh/benchmark' : '/benchmark'}>{isZh ? '实测方法与边界见基准证据中心 →' : 'Measurement method and limits: open the benchmark evidence center →'}</Link></p>
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
  return <article id={item.id} data-case={item.id} data-category={item.category} className="rounded-2xl border border-outline-variant/20 bg-surface-low overflow-hidden">
    <ImageSlider highRes={item.after} lowRes={item.before} alt={isZh ? `${item.titleZh}前后对比` : `${item.title} before and after`} inputLabel={isZh ? '输入' : 'Input'} outputLabel={isZh ? '输出参考' : 'Output reference'} compareLabel={isZh ? `拖动查看${item.titleZh}前后对比` : `Drag to compare ${item.title}`} initialAspectRatio={item.aspectRatio} />
    <div className="p-5"><p className="text-[10px] text-primary uppercase tracking-widest font-label">{isZh ? item.categoryZh : item.category}</p><h3 className="mt-2 text-xl font-headline font-bold text-white">{isZh ? item.titleZh : item.title}</h3><p className="mt-3 text-sm leading-relaxed text-zinc-300">{isZh ? item.descriptionZh : item.description}</p><dl className="mt-4 grid grid-cols-2 gap-3 text-xs"><div><dt className="text-zinc-500">{isZh ? '输入' : 'Input'}</dt><dd className="mt-1 text-zinc-200">{item.beforeSize}</dd></div><div><dt className="text-zinc-500">{isZh ? '输出' : 'Output'}</dt><dd className="mt-1 text-zinc-200">{item.afterSize}</dd></div></dl>{item.extraInput && <p className="mt-3 text-xs text-zinc-400">{isZh ? '第二张参考：' : 'Second reference: '}<code>{item.extraInput}</code></p>}<details className="mt-4 text-xs text-zinc-400"><summary className="cursor-pointer text-primary">{isZh ? '查看提示词与记录' : 'View prompt and run record'}</summary><p className="mt-2 leading-relaxed"><strong className="text-zinc-200">{isZh ? '提示词：' : 'Prompt: '}</strong>{item.prompt}</p><p className="mt-2 leading-relaxed"><strong className="text-zinc-200">{isZh ? '记录：' : 'Record: '}</strong>{isZh ? item.recordZh : item.record}</p></details><p className="mt-4 text-xs leading-relaxed text-zinc-500"><strong className="text-zinc-300">{isZh ? '边界：' : 'Limit: '}</strong>{isZh ? item.limitZh : item.limit}</p><Link className="mt-4 inline-flex text-xs font-semibold text-primary hover:text-white" to={toolPath(item, isZh)}>{isZh ? `打开${toolLabel(item, true)} →` : `Open ${toolLabel(item, false)} →`}</Link></div>
  </article>;
}

function workflowLabel(outputType: BeforeAfterCase['outputType'], isZh: boolean) {
  if (outputType === 'upscale') return isZh ? '放大' : 'Upscale';
  if (outputType === 'same-size') return isZh ? '同尺寸修复' : 'Same-size retouch';
  return isZh ? '编辑 / 转换' : 'Edit / conversion';
}

function toolPath(item: BeforeAfterCase, isZh: boolean) {
  if (item.category === 'game-frames') return '/game-character-style';
  if (item.category === 'object-cutout') return item.id.startsWith('creative') ? '/image-quality-enhancer' : '/erase-object';
  if (item.category === 'two-reference') return '/image-quality-enhancer';
  if (item.outputType === 'upscale') return '/image-upscaler';
  if (item.outputType === 'same-size') return '/portrait-retouch';
  return '/image-quality-enhancer';
}

function toolLabel(item: BeforeAfterCase, isZh: boolean) {
  if (item.category === 'game-frames') return isZh ? '人物风格工具' : 'character-style tool';
  if (item.category === 'object-cutout' && !item.id.startsWith('creative')) return isZh ? '擦除工具' : 'object eraser';
  if (item.outputType === 'upscale') return isZh ? '图片放大器' : 'image upscaler';
  if (item.outputType === 'same-size') return isZh ? '人像修复工具' : 'portrait retouch tool';
  return isZh ? '视觉增强器' : 'visual enhancer';
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
    'How is this page different from the benchmark center?': '这个页面与基准证据中心有什么区别？',
    'This page is a visual gallery: it pairs existing inputs and outputs so you can inspect edges, faces and composition. The benchmark center defines measurement fields and separates recorded runs from visual references.': '这里是视觉案例库：把现有输入和输出放在一起，方便检查边缘、脸部和构图。基准证据中心定义测量字段，并把有记录的运行与视觉参考分开。',
    'Can I reproduce one of these cases?': '我能复现其中一个案例吗？',
    'Yes. Open the linked tool on a comparable input, use the control shown on the card, and record the original file, output size, model or preset, hardware, driver, date and elapsed time. Results may vary between runs.': '可以。用相近的输入打开卡片链接的工具，按卡片中的控制项运行，并记录原始文件、输出尺寸、模型或预设、硬件、驱动、日期和耗时。不同运行结果可能不同。',
    'Why does this page not use NVIDIA screenshots?': '为什么页面不使用 NVIDIA 截图？',
    'The gallery documents our own image pipeline. Keeping independent assets separate from NVIDIA material makes the provenance clear and avoids presenting a visual reference as an official runtime capture.': '这个案例库记录我们自己的图像管线。把独立素材与 NVIDIA 材料分开，可以明确来源，避免把视觉参考误认为官方运行时画面。',
  };
  return map[value] || value;
}
