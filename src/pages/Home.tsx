import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  UploadCloud, Cpu, Sparkles,
  Gauge, Zap, ShieldCheck, Shield, ChevronDown, FileImage
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';
import ImageSlider from '../components/ImageSlider';
import { FEATURED_ARTICLES } from '../content/articles/featured';
import { TOOL_LANDINGS } from '../content/toolLandings';
import { USE_CASES } from '../content/useCases';
import { MICRO_TOOLS } from '../content/microTools';
import { SITE_URL } from '../config/site';
import { SITE_PROFILE, brandCopy, profileHas } from '../config/profile';
import { trackEvent } from '../lib/analytics';

const COMMUNITY_EXAMPLES = [
  "https://picsum.photos/seed/upscale1/600/800",
  "https://picsum.photos/seed/upscale2/600/400",
  "https://picsum.photos/seed/upscale3/600/600",
  "https://picsum.photos/seed/upscale4/600/900",
  "https://picsum.photos/seed/upscale5/600/500",
  "https://picsum.photos/seed/upscale6/600/700",
  "https://picsum.photos/seed/upscale7/600/450",
  "https://picsum.photos/seed/upscale8/600/850",
  "https://picsum.photos/seed/upscale9/600/550",
  "https://picsum.photos/seed/upscale10/600/750",
  "https://picsum.photos/seed/upscale11/600/400",
  "https://picsum.photos/seed/upscale12/600/800",
  "https://picsum.photos/seed/upscale13/600/600",
  "https://picsum.photos/seed/upscale14/600/900",
  "https://picsum.photos/seed/upscale15/600/500",
  "https://picsum.photos/seed/upscale16/600/700",
  "https://picsum.photos/seed/upscale17/600/450",
  "https://picsum.photos/seed/upscale18/600/850",
  "https://picsum.photos/seed/upscale19/600/550",
  "https://picsum.photos/seed/upscale20/600/750",
];

/** Search-led before/after cases. Keep the prompt language visible so the gallery can rank for
 * practical intent queries such as "portrait upscaler", "product photo enhancer" and "architecture
 * image upscaling" instead of presenting unexplained decorative images. */
const SEARCH_CASES = [
  {
    id: 'kitchen',
    title: 'Interior render to clean photo',
    titleZh: '室内效果图转清晰照片',
    description: 'Recover cabinet edges, countertop texture and window light while keeping the room layout unchanged.',
    descriptionZh: '保留房间布局，增强柜体边缘、台面纹理和窗光层次。',
    prompt: 'Upscale 4x, preserve the exact kitchen layout and geometry, recover wood grain and countertop edges, keep lighting natural, do not add objects.',
    keywords: ['interior render upscaler', 'architecture image enhancer', '4k room photo'],
    highRes: '/examples/sample1-photo.webp',
    lowRes: '/examples/sample1-photo-low.webp',
    alt: 'Kitchen image before and after AI upscaling',
    useCasePath: '/use-cases/architecture-render-upscaler',
  },
  {
    id: 'portrait',
    title: 'Portrait and face detail',
    titleZh: '人像与面部细节',
    description: 'Use a restrained prompt for eyes, hair and skin texture so the face stays recognizable instead of becoming plastic.',
    descriptionZh: '用克制的提示词恢复眼睛、头发和皮肤纹理，尽量保持人物身份，不做塑料磨皮。',
    prompt: 'Upscale 4x, preserve facial identity and expression, recover natural hair and skin texture, remove compression noise, do not change age or face shape.',
    keywords: ['portrait upscaler', 'face detail enhancement', 'photo restoration'],
    highRes: '/examples/case-portrait.jpg',
    lowRes: '/examples/case-portrait-low.jpg',
    alt: 'Portrait before and after AI face detail enhancement',
    useCasePath: '/use-cases/portrait-photo-enhancer',
  },
  {
    id: 'architecture',
    title: 'Architecture and straight edges',
    titleZh: '建筑与直线边缘',
    description: 'Prioritize straight lines, window frames and repeated geometry; inspect the result at 100% before publishing.',
    descriptionZh: '优先处理直线、窗框和重复几何结构，发布前建议在 100% 比例检查结果。',
    prompt: 'Upscale 4x, preserve straight architectural lines and window geometry, sharpen edges without halos, keep the original perspective and materials.',
    keywords: ['architecture upscaler', 'real estate photo enhancer', 'building detail recovery'],
    highRes: '/examples/case-architecture.jpg',
    lowRes: '/examples/case-architecture-low.jpg',
    alt: 'Architecture image before and after AI upscaling',
    useCasePath: '/use-cases/architecture-render-upscaler',
  },
  {
    id: 'product',
    title: 'Product photo and material texture',
    titleZh: '商品图与材质纹理',
    description: 'Recover crisp product boundaries and surface texture from a compressed marketplace image without inventing a new product shape.',
    descriptionZh: '从压缩后的电商图片中恢复商品轮廓和表面材质，避免生成一个不同的商品形状。',
    prompt: 'Upscale 4x, preserve the product silhouette, label placement and colors, recover material texture, remove JPEG artifacts, do not invent text.',
    keywords: ['product photo upscaler', 'ecommerce image enhancer', 'marketplace image quality'],
    highRes: '/examples/case-product.jpg',
    lowRes: '/examples/case-product-low.jpg',
    alt: 'Product photo before and after AI texture enhancement',
    useCasePath: '/use-cases/product-photo-enhancer',
  },
] as const;

export default function Home() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isZh = i18n.language.startsWith('zh');

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        "name": SITE_PROFILE.orgName,
        "url": `${SITE_URL}/`,
        "description": "Independent, non-official AI image upscaling and neural super-resolution showcase."
      },
      {
        "@type": "SoftwareApplication",
        "name": SITE_PROFILE.softwareName,
        "applicationCategory": "MultimediaApplication",
        "operatingSystem": "Web",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "description": "Free online DLSS-style image converter and visual enhancer powered by AI neural super-resolution. Upscale, sharpen and enhance images to 4K quality in a browser. No GPU or download required. Non-official showcase."
      },
      {
        "@type": "WebApplication",
        "name": "Free DLSS Image Upscaler Online",
        "applicationCategory": "MultimediaApplication",
        "operatingSystem": "All",
        "description": "Looking for a DLSS 5 image converter or visual enhancer? Instantly upscale and enhance any image using AI-powered neural super-resolution. Free online — no GPU or installation required.",
        "browserRequirements": "Requires a modern web browser. Works on all operating systems.",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        }
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": t('home.faqHowToUpscale'),
            "acceptedAnswer": {
              "@type": "Answer",
              "text": t('home.faqHowToUpscaleAns')
            }
          },
          {
            "@type": "Question",
            "name": t('home.faqProfessional'),
            "acceptedAnswer": {
              "@type": "Answer",
              "text": t('home.faqProfessionalAns')
            }
          },
          {
            "@type": "Question",
            "name": t('home.faqNeuralSr'),
            "acceptedAnswer": {
              "@type": "Answer",
              "text": t('home.faqNeuralSrAns')
            }
          },
          {
            "@type": "Question",
            "name": t('home.faqApi'),
            "acceptedAnswer": {
              "@type": "Answer",
              "text": t('home.faqApiAns')
            }
          }
        ]
      }
    ]
  };

  return (
    <main className="pt-32 pb-24 px-6 max-w-[1440px] mx-auto overflow-hidden">
      <SEO
        title="DLSS 5 Image Upscaler & Converter Online — Free AI Visual Enhancer"
        description="Use a browser-based DLSS-style image converter and visual enhancer to upscale, sharpen and restore images to 4K. Free online tool with no RTX GPU or download required. Independent, non-official showcase."
        keywords={['dlss 5 image converter', 'dlss 5 visual enhancer', 'dlss 5 online', 'dlss 5 upscaler', 'dlss5 upscaler', 'dlss 5 upscaling', 'dlss image upscaler', 'dlss upscaler', 'ai image upscaler', 'free image upscaler', '4k image upscaler', 'ai super resolution', 'neural rendering', 'dlss 4.5', 'fsr 4']}
        canonical="/"
        structuredData={structuredData}
      />
      <section className="text-center mb-16 relative">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/10 blur-[120px] rounded-full pointer-events-none"></div>
        
        <h1 className="text-3xl sm:text-5xl md:text-7xl font-headline font-bold tracking-tight text-white mb-6 leading-[1.1] break-words">
          {t('home.title').split(' ').slice(0, 2).join(' ')} <br/> <span className="text-nvidia-green">{t('home.title').split(' ').slice(2).join(' ')}</span>
        </h1>
        <p className="text-on-surface-variant text-lg max-w-2xl mx-auto font-light leading-relaxed mb-12">
          {t('home.subtitle').split('.')[0]}. <br/>
          {t('home.subtitle').split('.').slice(1).join('.').trim()}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start text-left">
          <div className="lg:col-span-7 bg-surface-low rounded-xl border border-outline-variant/20 overflow-hidden relative group h-full">
            <div className="p-8 h-full flex flex-col">
              <div 
                onClick={() => navigate('/dashboard')}
                className="flex-1 border-2 border-dashed border-outline-variant rounded-xl p-12 flex flex-col items-center justify-center transition-all duration-500 hover:border-nvidia-green/50 hover:bg-nvidia-green/5 group-hover:scale-[1.01] cursor-pointer"
              >
                <div className="w-16 h-16 bg-surface-high rounded-full flex items-center justify-center mb-6">
                  <UploadCloud className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-xl font-headline font-semibold text-white mb-2">{t('dashboard.uploadAreaTitle')}</h2>
                <p className="text-zinc-500 text-sm mb-6 font-label">{t('home.uploadHint')}</p>
                <button className="bg-white text-black px-8 py-3 rounded-lg font-bold hover:bg-primary transition-all duration-300">
                  {t('home.uploadButton')}
                </button>
              </div>
              <div className="mt-4 flex justify-between items-center text-[10px] uppercase tracking-widest text-zinc-500 font-label">
                <span>{t('home.faqProfessionalWorkflows')}</span>
                <span className="text-nvidia-green">{t('home.instantInference')}</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-6 h-full">
            <div className="bg-surface-high rounded-xl p-1 overflow-hidden relative group aspect-[4/3] glow-border flex-1">
              <ImageSlider 
                highRes="/examples/sample1-photo.webp"
                lowRes="/examples/sample1-photo-low.webp"
                alt="Kitchen photo restored from its low-resolution copy"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-surface-low p-4 rounded-xl flex flex-col gap-1 border border-outline-variant/10">
                <span className="text-[10px] text-primary font-label uppercase tracking-widest">Inference Time</span>
                <div className="text-xl font-headline font-bold text-white">0.8s</div>
              </div>
              <div className="bg-surface-low p-4 rounded-xl flex flex-col gap-1 border border-outline-variant/10">
                <span className="text-[10px] text-primary font-label uppercase tracking-widest">Core Version</span>
                <div className="text-xl font-headline font-bold text-white">Ada-5.0</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="mt-20 mb-16">
        <h2 className="text-2xl md:text-3xl font-headline font-bold text-white mb-10 text-center">
          {brandCopy(isZh ? '如何使用 DLSS 图像放大器' : 'How to Use Our DLSS Image Upscaler')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-surface-low rounded-xl border border-outline-variant/20 p-6 text-center">
            <div className="w-12 h-12 bg-nvidia-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-nvidia-green font-headline font-bold text-xl">1</span>
            </div>
            <h3 className="text-white font-semibold mb-2">
              {isZh ? '上传图片' : 'Upload Image'}
            </h3>
            <p className="text-zinc-400 text-sm">
              {isZh ? '选择或拖放任意 JPG、PNG、WEBP 图片（最大 5MB）' : 'Select or drag & drop any JPG, PNG, WEBP image (up to 5MB)'}
            </p>
          </div>
          <div className="bg-surface-low rounded-xl border border-outline-variant/20 p-6 text-center">
            <div className="w-12 h-12 bg-nvidia-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-nvidia-green font-headline font-bold text-xl">2</span>
            </div>
            <h3 className="text-white font-semibold mb-2">
              {isZh ? '选择放大倍数' : 'Choose Upscale Factor'}
            </h3>
            <p className="text-zinc-400 text-sm">
              {isZh ? '选择 2× 或 4× 放大倍数，点击"超分辨率图片"' : 'Select 2× or 4× upscale factor, click "Upscale Image"'}
            </p>
          </div>
          <div className="bg-surface-low rounded-xl border border-outline-variant/20 p-6 text-center">
            <div className="w-12 h-12 bg-nvidia-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-nvidia-green font-headline font-bold text-xl">3</span>
            </div>
            <h3 className="text-white font-semibold mb-2">
              {isZh ? '下载增强结果' : 'Download Enhanced Result'}
            </h3>
            <p className="text-zinc-400 text-sm">
              {isZh ? '几秒后即可下载 AI 增强后的高分辨率图片' : 'AI-enhanced high-resolution image ready in seconds — download instantly'}
            </p>
          </div>
        </div>
      </section>

      {/* Featured Showcase Section */}
      <section className="mt-32" aria-labelledby="before-after-cases-heading">
        <div className="mb-12 text-center">
          <span className="text-nvidia-green font-label text-xs uppercase tracking-[0.2em] mb-4 block">{t('home.featuredShowcase')}</span>
          <h2 id="before-after-cases-heading" className="text-4xl font-headline font-bold text-white mb-6">{isZh ? 'AI 图片放大前后案例' : 'AI Image Upscaling Before & After Cases'}</h2>
          <p className="text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            {isZh ? '拖动对比线查看输入与输出；每个案例同时公开适合搜索和复用的提示词。' : 'Drag the comparison line to inspect the low-resolution input and enhanced output. Every case also shows a reusable prompt.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SEARCH_CASES.map((item) => (
            <article key={item.id} className="bg-surface-low rounded-xl border border-outline-variant/10 overflow-hidden flex flex-col">
              <div className="h-[320px] relative bg-black">
                <ImageSlider highRes={item.highRes} lowRes={item.lowRes} alt={item.alt} />
              </div>
              <div className="p-6 flex flex-col gap-4">
                <div>
                  <p className="text-[10px] text-primary font-label uppercase tracking-widest mb-2">{isZh ? '输入 → 输出 · 提示词案例' : 'Input → Output · Prompt case'}</p>
                  <h3 className="text-lg font-headline font-bold text-white mb-2">{isZh ? item.titleZh : item.title}</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">{isZh ? item.descriptionZh : item.description}</p>
                </div>
                <div className="rounded-lg bg-surface-lowest border border-outline-variant/10 p-4">
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-2">{isZh ? '推荐提示词' : 'Prompt to try'}</p>
                  <p className="text-xs text-zinc-300 leading-relaxed">{item.prompt}</p>
                </div>
                <div className="flex flex-wrap gap-2" aria-label={isZh ? '搜索关键词' : 'Search keywords'}>
                  {item.keywords.map(keyword => <span key={keyword} className="rounded-full bg-surface-high px-3 py-1 text-[11px] text-zinc-400">{keyword}</span>)}
                </div>
                <Link to={item.useCasePath} className="text-sm text-primary font-semibold hover:text-white">{isZh ? '查看完整场景指南 →' : 'Open the full workflow guide →'}</Link>
              </div>
            </article>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <button 
            onClick={() => navigate('/dashboard')}
            className="bg-primary text-black px-8 py-3 rounded-lg font-bold hover:bg-primary-container transition-all duration-300"
          >
            {isZh ? '用自己的图片试试' : 'Try your own image'}
          </button>
        </div>
      </section>

      {profileHas('useCases') && (
        <section className="mt-32" aria-labelledby="use-cases-heading">
          <div className="mb-12 max-w-2xl">
            <span className="text-nvidia-green font-label text-xs uppercase tracking-[0.2em] mb-4 block">{t('navbar.useCases')}</span>
            <h2 id="use-cases-heading" className="text-4xl font-headline font-bold text-white mb-6">{isZh ? '按工作场景选择图像工具' : 'Start with the job, then choose the tool'}</h2>
            <p className="text-zinc-400 leading-relaxed">{isZh ? '真实前后案例、操作步骤和发布前检查，帮助你判断增强结果是否适合商品、建筑和人像场景。' : 'Real before-and-after cases, practical steps and publishing checks for product, architecture and portrait workflows.'}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {USE_CASES.map(item => <Link key={item.path} to={item.path} onClick={() => trackEvent('use_case_card_click', { use_case: item.slug })} className="group rounded-xl border border-outline-variant/20 bg-surface-low overflow-hidden hover:border-primary/50 transition-colors">
              <img src={item.after} alt={item.imageAlt} className="w-full aspect-[3/2] object-cover" loading="lazy" />
              <div className="p-5"><p className="text-[10px] uppercase tracking-widest text-primary mb-2">{item.eyebrow}</p><h3 className="text-lg font-headline font-bold text-white group-hover:text-primary transition-colors">{item.heading}</h3><p className="mt-3 text-sm leading-relaxed text-zinc-400 line-clamp-3">{item.tldr}</p><span className="inline-block mt-4 text-sm text-primary font-semibold">{isZh ? '查看指南 →' : 'Read the guide →'}</span></div>
            </Link>)}
          </div>
        </section>
      )}

      {profileHas('microTools') && (
        <section className="mt-32" aria-labelledby="small-tools-heading">
          <div className="mb-12 max-w-2xl">
            <span className="text-nvidia-green font-label text-xs uppercase tracking-[0.2em] mb-4 block">{t('navbar.smallTools')}</span>
            <h2 id="small-tools-heading" className="text-4xl font-headline font-bold text-white mb-6">{isZh ? '格式明确的小工具' : 'Small tools with a finished file at the end'}</h2>
            <p className="text-zinc-400 leading-relaxed">{isZh ? '证件照这类任务不需要生成式模型。上传、对齐规格，直接得到可下载的成品；图片只在本地浏览器处理。' : 'Some jobs need an exact file, not a model prompt. Upload, align the published specification and download the finished file; the photo stays in your browser.'}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {MICRO_TOOLS.map(item => <Link key={item.path} to={item.path} onClick={() => trackEvent('micro_tool_card_click', { tool: item.slug })} className="group rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 via-surface-low to-surface-low p-6 hover:border-primary transition-colors">
              <div className="flex items-start gap-4"><div className="w-12 h-12 shrink-0 rounded-xl bg-primary/15 flex items-center justify-center"><FileImage className="w-6 h-6 text-primary" /></div><div><p className="text-[10px] uppercase tracking-widest text-primary mb-2">Local browser utility</p><h3 className="text-xl font-headline font-bold text-white group-hover:text-primary transition-colors">{item.heading}</h3><p className="mt-3 text-sm leading-relaxed text-zinc-400">{isZh ? '制作 3×4 或 35×45 mm 证件照，显示头部参考线，并导出单张 PNG 或可打印排版。' : item.description}</p><span className="inline-block mt-5 text-sm text-primary font-semibold">{isZh ? '打开证件照工具 →' : 'Open passport photo maker →'}</span></div></div>
            </Link>)}
          </div>
        </section>
      )}

      {/* The free tools: single-purpose pages that answer one search each. A deployment without them
          does not advertise them. */}
      {profileHas('tools') && (
      <section className="mt-32" aria-labelledby="free-tools-heading">
        <div className="mb-12 max-w-2xl">
          <span className="text-nvidia-green font-label text-xs uppercase tracking-[0.2em] mb-4 block">{t('navbar.tools')}</span>
          <h2 id="free-tools-heading" className="text-4xl font-headline font-bold text-white mb-6">
            {isZh ? '一件工具解决一件事' : 'One tool for one job'}
          </h2>
          <p className="text-zinc-400 leading-relaxed">
            {isZh
              ? '放大、增强、去模糊、转 SVG、去背景、擦除物体——每个工具只做一件事，页面上写清了输入限制和输出尺寸。我们的示例图不用注册就能跑，物体擦除那一个除外。'
              : 'Upscaling, enhancement, deblurring, vectorizing, background removal and object erasing — each tool does one thing and states its input limits and output size. Our example images run without an account; the object eraser is the one that asks you to sign in.'}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TOOL_LANDINGS.map(tool => (
            <Link key={tool.path} to={tool.path} className="group bg-surface-low rounded-xl border border-outline-variant/20 p-6 hover:border-primary/50 transition-colors flex flex-col">
              <span className="text-nvidia-green font-label text-xs uppercase tracking-[0.2em] mb-3 block">{tool.eyebrow}</span>
              <h3 className="text-lg font-headline font-bold text-white group-hover:text-primary transition-colors">{tool.heading}</h3>
              <p className="mt-3 text-sm text-zinc-400 leading-relaxed line-clamp-3">{tool.intro}</p>
              <span className="mt-4 inline-block text-primary text-sm font-semibold">{isZh ? '打开工具 →' : 'Open the tool →'}</span>
            </Link>
          ))}
        </div>
      </section>
      )}

      <section className="mt-32">
        <div className="mb-12">
          <span className="text-nvidia-green font-label text-xs uppercase tracking-[0.2em] mb-4 block">{t('home.performanceMetrics')}</span>
          <h2 className="text-4xl font-headline font-bold text-white mb-6">{t('home.dlssVsStandard')}</h2>
          <p className="text-zinc-400 max-w-2xl leading-relaxed">Our proprietary neural engine outperforms traditional methods by reconstructing missing data using trained AI models rather than simple pixel stretching.</p>
        </div>
        
        <div className="bg-surface-low rounded-xl border border-outline-variant/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-surface-high border-b border-outline-variant/20">
                  <th className="px-6 py-4 text-xs font-label uppercase tracking-widest text-primary">Feature</th>
                  <th className="px-6 py-4 text-xs font-label uppercase tracking-widest text-zinc-400">{t('home.bicubicScaling')}</th>
                  <th className="px-6 py-4 text-xs font-label uppercase tracking-widest text-white">{t('home.dlssNeural')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                <tr>
                  <td className="px-6 py-5 text-sm font-medium text-white">{t('home.edgePreservation')}</td>
                  <td className="px-6 py-5 text-sm text-zinc-500">{t('home.edgeBlurred')}</td>
                  <td className="px-6 py-5 text-sm text-primary font-semibold">{t('home.edgeSharp')}</td>
                </tr>
                <tr>
                  <td className="px-6 py-5 text-sm font-medium text-white">{t('home.noiseHandling')}</td>
                  <td className="px-6 py-5 text-sm text-zinc-500">{t('home.noiseAmplified')}</td>
                  <td className="px-6 py-5 text-sm text-primary font-semibold">{t('home.noiseDenoise')}</td>
                </tr>
                <tr>
                  <td className="px-6 py-5 text-sm font-medium text-white">{t('home.textureDetail')}</td>
                  <td className="px-6 py-5 text-sm text-zinc-500">{t('home.textureLost')}</td>
                  <td className="px-6 py-5 text-sm text-primary font-semibold">{t('home.textureReconstruct')}</td>
                </tr>
                <tr>
                  <td className="px-6 py-5 text-sm font-medium text-white">{t('home.hardware')}</td>
                  <td className="px-6 py-5 text-sm text-zinc-500">{t('home.hardwareCpu')}</td>
                  <td className="px-6 py-5 text-sm text-primary font-semibold">{t('home.hardwareGpu')}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="mt-32">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div className="max-w-xl">
            <span className="text-nvidia-green font-label text-xs uppercase tracking-[0.2em] mb-4 block">{t('home.engineeredPerformance')}</span>
            <h2 className="text-4xl font-headline font-bold text-white">{t('home.neuralMonolith')}</h2>
          </div>
          <div className="text-zinc-500 font-label text-sm uppercase tracking-widest border-l border-zinc-800 pl-6 h-12 flex items-center">
            001 // SYSTEM OVERVIEW
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-surface-lowest p-8 rounded-xl relative group overflow-hidden border border-outline-variant/5 hover:border-primary/20 transition-colors">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Cpu className="w-24 h-24 text-white" />
            </div>
            <div className="w-10 h-10 bg-nvidia-green/10 rounded flex items-center justify-center mb-6">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-xl font-headline font-bold text-white mb-4">{t('home.recursiveUpscaling')}</h3>
            <p className="text-zinc-500 text-sm leading-relaxed">{t('home.recursiveDesc')}</p>
          </div>
          
          <div className="bg-surface-lowest p-8 rounded-xl relative group overflow-hidden border border-outline-variant/5 hover:border-primary/20 transition-colors">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Gauge className="w-24 h-24 text-white" />
            </div>
            <div className="w-10 h-10 bg-nvidia-green/10 rounded flex items-center justify-center mb-6">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-xl font-headline font-bold text-white mb-4">{t('home.tensorPerformance')}</h3>
            <p className="text-zinc-500 text-sm leading-relaxed">{t('home.tensorDesc')}</p>
          </div>
          
          <div className="bg-surface-lowest p-8 rounded-xl relative group overflow-hidden border border-outline-variant/5 hover:border-primary/20 transition-colors">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <ShieldCheck className="w-24 h-24 text-white" />
            </div>
            <div className="w-10 h-10 bg-nvidia-green/10 rounded flex items-center justify-center mb-6">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-xl font-headline font-bold text-white mb-4">{t('home.dataPrivacy')}</h3>
            <p className="text-zinc-500 text-sm leading-relaxed">{t('home.privacyDesc')}</p>
          </div>
        </div>
      </section>

      <section className="mt-32">
        <h3 className="text-center text-zinc-500 font-label uppercase tracking-[0.3em] mb-12 text-xs">{t('home.communityUpscaled')}</h3>
        
        <div className="relative">
          <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4 max-h-[800px] overflow-hidden">
            {COMMUNITY_EXAMPLES.map((url, idx) => (
              <div key={idx} className="break-inside-avoid rounded-xl overflow-hidden relative group bg-surface-low border border-outline-variant/10">
                <img 
                  src={url} 
                  alt={`Community Generation ${idx + 1}`} 
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105" 
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-[10px] font-bold text-black">
                      {String.fromCharCode(65 + (idx % 26))}
                    </div>
                    <span className="text-xs font-bold text-white">User_{Math.floor(Math.random() * 9000) + 1000}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-[#09090b] to-transparent flex items-end justify-center pb-8 pointer-events-none">
            <button 
              onClick={() => navigate('/dashboard')}
              className="pointer-events-auto bg-surface-high text-white px-8 py-3 rounded-full font-bold hover:bg-primary hover:text-black transition-all duration-300 border border-outline-variant/20 shadow-2xl flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              {t('home.joinCommunity')}
            </button>
          </div>
        </div>
      </section>

      {/* The research desk is the blog; a deployment without one does not advertise it. */}
      {profileHas('blog') && (
      <section className="mt-32" aria-labelledby="featured-research-heading">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
          <div className="max-w-2xl">
            <span className="text-nvidia-green font-label text-xs uppercase tracking-[0.2em] mb-4 block">Research desk</span>
            <h2 id="featured-research-heading" className="text-4xl font-headline font-bold text-white mb-4">
              {isZh ? '最新 DLSS 5 技术与工作流' : 'Latest DLSS 5 research and workflows'}
            </h2>
            <p className="text-zinc-400 leading-relaxed">
              {isZh ? '从 Seedance 2.5 视频超分，到 GPT-6 图像工作流，阅读有来源、有成本拆解的实用内容。' : 'Source-led guides covering Seedance 2.5 video super-resolution, GPT-6 workflows and practical image upscaling.'}
            </p>
          </div>
          <Link to={isZh ? '/zh/blog' : '/blog'} className="text-primary text-sm font-semibold hover:text-white transition-colors">
            {isZh ? '查看全部文章 →' : 'View all articles →'}
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FEATURED_ARTICLES.map(article => (
            <Link key={article.slug} to={`${isZh ? '/zh' : ''}/blog/${article.slug}`} className="group bg-surface-low rounded-xl border border-outline-variant/20 overflow-hidden hover:border-primary/50 transition-colors">
              <div className="aspect-[16/9] overflow-hidden bg-surface-high">
                <img src={article.image} alt={article.alt} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="p-5">
                <h3 className="text-lg font-headline font-bold text-white group-hover:text-primary transition-colors">{isZh ? article.title_cn : article.title}</h3>
                <p className="mt-3 text-sm text-zinc-400 leading-relaxed">{isZh ? article.description_cn : article.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
      )}

      <section className="mt-32 max-w-4xl mx-auto">
        <h2 className="text-3xl font-headline font-bold text-white mb-12 text-center">{t('home.faq')}</h2>
        <div className="space-y-4">
          <details className="group bg-surface-low rounded-xl border border-outline-variant/10">
            <summary className="flex justify-between items-center p-6 cursor-pointer list-none">
              <h3 className="text-white font-medium text-base">{t('home.faqHowToUpscale')}</h3>
              <ChevronDown className="w-5 h-5 text-primary group-open:rotate-180 transition-transform" />
            </summary>
            <div className="px-6 pb-6 text-zinc-400 text-sm leading-relaxed">
              {t('home.faqHowToUpscaleAns')}
            </div>
          </details>

          <details className="group bg-surface-low rounded-xl border border-outline-variant/10">
            <summary className="flex justify-between items-center p-6 cursor-pointer list-none">
              <h3 className="text-white font-medium text-base">{t('home.faqProfessional')}</h3>
              <ChevronDown className="w-5 h-5 text-primary group-open:rotate-180 transition-transform" />
            </summary>
            <div className="px-6 pb-6 text-zinc-400 text-sm leading-relaxed">
              {t('home.faqProfessionalAns')}
            </div>
          </details>

          <details className="group bg-surface-low rounded-xl border border-outline-variant/10">
            <summary className="flex justify-between items-center p-6 cursor-pointer list-none">
              <h3 className="text-white font-medium text-base">{t('home.faqNeuralSr')}</h3>
              <ChevronDown className="w-5 h-5 text-primary group-open:rotate-180 transition-transform" />
            </summary>
            <div className="px-6 pb-6 text-zinc-400 text-sm leading-relaxed">
              {t('home.faqNeuralSrAns')}
            </div>
          </details>

          <details className="group bg-surface-low rounded-xl border border-outline-variant/10">
            <summary className="flex justify-between items-center p-6 cursor-pointer list-none">
              <h3 className="text-white font-medium text-base">{t('home.faqApi')}</h3>
              <ChevronDown className="w-5 h-5 text-primary group-open:rotate-180 transition-transform" />
            </summary>
            <div className="px-6 pb-6 text-zinc-400 text-sm leading-relaxed">
              {t('home.faqApiAns')}
            </div>
          </details>
        </div>
      </section>
    </main>
  );
}
