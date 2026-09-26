export interface ArticleCover {
  src: string;
  ogSrc?: string;
  alt: string;
}

export const ARTICLE_COVERS: Record<string, ArticleCover> = {
  'seedance-2-5-video-super-resolution-cost-guide-2026': {
    src: '/blog/seedance25-video-superres.png',
    alt: 'Low-resolution AI video passing through a neural super-resolution pipeline into a crisp 4K frame',
  },
  'what-is-dlss-5-neural-rendering-guide': {
    src: '/blog/dlss5-neural-rendering.webp',
    ogSrc: '/blog/dlss5-neural-rendering.png',
    alt: 'DLSS 5 neural rendering transforming a wireframe city into a cinematic scene',
  },
  'dlss5-vs-dlss4-vs-fsr4-comparison-2026': {
    // Was NVIDIA's own og:image, hotlinked off their CDN — a third-party asset on an independent,
    // non-official site, and one that can disappear without warning. Use our own artwork instead.
    src: '/blog/dlss5-neural-rendering.webp',
    ogSrc: '/blog/dlss5-neural-rendering.png',
    alt: 'DLSS 5, DLSS 4.5 and FSR 4 compared over the same rendered scene',
  },
  'crimson-desert-pc-optimization-dlss-fsr-guide-2026': {
    src: '/examples/sample2.jpg',
    alt: 'Game scene optimization guide',
  },
  'best-ai-image-upscaler-2026-comparison': {
    src: '/examples/sample1-photo.webp',
    alt: 'AI image enhancement comparison',
  },
  'dlss5-artistic-vision-debate-honest-assessment': {
    src: '/blog/dlss5-neural-rendering.webp',
    ogSrc: '/blog/dlss5-neural-rendering.png',
    alt: 'DLSS 5 visual fidelity and artistic direction',
  },
  'dlss-5-online-image-upscaler-guide': {
    src: '/examples/sample2.jpg',
    alt: 'Online AI image upscaling workflow',
  },
  'dlss-5-gpt-6-astra-ai-rendering-workflow-2026': {
    src: '/blog/gpt6-dlss5-workflow.webp',
    ogSrc: '/blog/gpt6-dlss5-workflow.png',
    alt: 'GPT-6 reasoning workflow connected to a DLSS 5 neural rendering scene',
  },
  'dlss-5-latest-news-september-2026': {
    src: '/blog/dlss5-neural-rendering.webp',
    ogSrc: '/blog/dlss5-neural-rendering.png',
    alt: 'Latest DLSS 5 neural rendering briefing',
  },
};
