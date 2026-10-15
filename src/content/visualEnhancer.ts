import { SITE_URL } from '../config/site';

export type VisualEnhancerLocale = 'en' | 'zh';

export const VISUAL_ENHANCER_COPY = {
  en: {
    path: '/visual-enhancer',
    title: 'DLSS 5 Visual Enhancer Online — Free AI Image Quality Tool',
    description: 'Try a free DLSS 5-style visual enhancer online. Run a cached example, inspect the before-and-after result, then improve your own blurry or compressed image in the browser.',
    eyebrow: 'Free browser visual enhancer',
    heading: 'DLSS 5 Visual Enhancer Online',
    lead: 'Run a visual-enhancement example before you upload anything. The independent browser workflow re-renders edges, texture and noise while asking the scene, framing and identity to stay recognizable.',
    sampleHeading: 'Run a free example first',
    sampleIntro: 'No account and no upload are needed for this cached example. Inspect the output, download it, or continue with your own image in the studio.',
    run: 'Run this example · free',
    running: 'Preparing the example…',
    baseLabel: 'Input image',
    resultLabel: 'Enhanced result',
    compareLabel: 'Visual enhancement comparison',
    download: 'Download the result',
    own: 'Enhance your own image',
    desktop: 'Need batch processing? See DLSS5 Studio',
    explainHeading: 'What this visual enhancer does',
    explain: 'This page targets practical image quality work: a soft, compressed or small image goes through an independent image-edit model that renders a larger result with plausible edge and texture detail. It is a visual estimate, not pixel-exact recovery and not the NVIDIA DLSS game runtime.',
    onlineHeading: 'Online first, desktop when needed',
    onlineText: 'The free browser example is the fastest way to inspect the visual change: click once, compare the result, and download it without signing in. If you need to process your own files or review the desktop workflow, continue to the DLSS5 Studio request page.',
    workflowHeading: 'A simple review workflow',
    steps: [
      ['1. Start with the original', 'Use the largest JPEG, PNG or WebP you have. A social preview or screenshot has already discarded information.'],
      ['2. Run and compare', 'Use the cached example here, then compare your own output with the source at 100% zoom.'],
      ['3. Check sensitive detail', 'Inspect faces, text, logos, hands and straight edges before you publish or rely on the result.'],
    ],
    limitsHeading: 'Honest limits',
    limits: 'The model can make uncertain detail look plausible. It cannot prove what a blurred face, tiny label or missing texture originally contained. The browser path is independent, does not install NVIDIA binaries and does not claim official NVIDIA support.',
    faqHeading: 'Frequently asked questions',
    faq: [
      ['Is this an official NVIDIA visual enhancer?', 'No. This is an independent browser tool inspired by the visual goal of clearer game and image references. It does not distribute NVIDIA binaries or run the official DLSS runtime.'],
      ['What does the model enhance?', 'It re-renders an image at a larger output size while asking the composition, colors, lighting and subject identity to remain stable.'],
      ['Can it recover details that were never captured?', 'No. The output is an estimate. Keep the original and review information-sensitive areas such as faces, text and logos.'],
      ['Can I try it without signing in?', 'Yes. The cached sample on this page is free and does not require an account. Your own upload uses the signed-in studio workflow.'],
      ['Does this page enhance video?', 'The free browser example on this page is an image workflow. For the desktop workflow and current availability of broader processing, see the DLSS5 Studio request page.'],
      ['What is the difference from an in-game DLSS feature?', 'DLSS 5 is an NVIDIA game-rendering technology. This page runs a separate image workflow on a supplied picture; it is not an in-game integration.'],
    ],
    linksHeading: 'Continue with the right workflow',
    links: [
      ['/image-quality-enhancer', 'Open the image quality enhancer'],
      ['/image-upscaler', 'Compare the image upscaler'],
      ['/unblur-image', 'Try the unblur workflow'],
      ['/download', 'See the DLSS5 Studio desktop path'],
    ],
  },
  zh: {
    path: '/zh/visual-enhancer',
    title: 'DLSS 5 视觉增强器在线使用：免费 AI 图像质量工具',
    description: '免费试用独立的 DLSS 5 风格视觉增强器。先运行缓存示例查看前后结果，再在浏览器中处理自己的模糊或压缩图片。',
    eyebrow: '免费浏览器视觉增强器',
    heading: 'DLSS 5 视觉增强器在线使用',
    lead: '先运行一个视觉增强示例，再决定是否上传。这个独立浏览器工作流会重新渲染边缘、纹理与噪声，同时要求场景、构图和身份保持可识别。',
    sampleHeading: '先免费运行一个示例',
    sampleIntro: '缓存示例不需要登录，也不需要上传。查看结果、下载结果，或继续在工作室处理自己的图片。',
    run: '免费试用示例 · 一键运行',
    running: '正在准备示例…',
    baseLabel: '输入图片',
    resultLabel: '增强结果',
    compareLabel: '视觉增强前后对比',
    download: '下载结果',
    own: '增强自己的图片',
    desktop: '需要批量处理？查看 DLSS5 Studio',
    explainHeading: '这个视觉增强器做什么',
    explain: '本页面向实际图像质量任务：模糊、压缩或尺寸较小的图片会经过独立图像编辑模型，生成带有合理边缘与纹理细节的更大结果。这是视觉估计，不是逐像素恢复，也不是 NVIDIA DLSS 游戏运行时。',
    onlineHeading: '先在线试，再按需要使用桌面版',
    onlineText: '免费浏览器示例适合先看效果：点击一次、对比结果并下载，不需要登录。需要处理自己的文件或了解桌面工作流时，再进入 DLSS5 Studio 索取页面。',
    workflowHeading: '简单的复核流程',
    steps: [
      ['1. 从原图开始', '使用手上最大的 JPEG、PNG 或 WebP。社交平台预览图或截图已经丢失了一部分信息。'],
      ['2. 运行并比较', '先查看这里的缓存示例，再把自己的输出与原图并排放大到 100% 比较。'],
      ['3. 检查敏感细节', '发布或依赖结果前，检查脸部、文字、标志、手部和直线边缘。'],
    ],
    limitsHeading: '诚实边界',
    limits: '模型可能让不确定的细节看起来合理，但无法证明模糊脸部、细小标签或缺失纹理原本是什么。浏览器路径是独立工作流，不安装 NVIDIA 二进制，也不声称获得 NVIDIA 官方支持。',
    faqHeading: '常见问题',
    faq: [
      ['这是 NVIDIA 官方视觉增强器吗？', '不是。这是受清晰视觉效果启发的独立浏览器工具，不分发 NVIDIA 二进制，也不运行官方 DLSS 运行时。'],
      ['模型会增强什么？', '它会以更大的输出尺寸重新渲染图片，同时要求构图、色彩、光照和主体身份保持稳定。'],
      ['能恢复从未拍到的细节吗？', '不能。输出是估计结果。请保留原图，并检查脸部、文字和标志等信息敏感区域。'],
      ['可以免登录试用吗？', '可以。本页的缓存示例免费且无需账号；处理自己的图片时使用登录后的工作室流程。'],
      ['这个页面能增强视频吗？', '本页的免费浏览器示例是图片工作流。更广泛的处理能力和桌面版当前可用情况，请查看 DLSS5 Studio 索取页面。'],
      ['它与游戏内 DLSS 功能有什么区别？', 'DLSS 5 是 NVIDIA 的游戏渲染技术。本页处理的是上传图片的独立图像工作流，不是游戏内集成。'],
    ],
    linksHeading: '继续使用合适的工作流',
    links: [
      ['/image-quality-enhancer', '打开图像质量增强器'],
      ['/image-upscaler', '对比图片放大器'],
      ['/unblur-image', '尝试去模糊工作流'],
      ['/zh/download', '查看 DLSS5 Studio 桌面版路径'],
    ],
  },
} as const;

export function visualEnhancerSchema(locale: VisualEnhancerLocale) {
  const copy = VISUAL_ENHANCER_COPY[locale];
  const url = `${SITE_URL}${copy.path}`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebPage', '@id': `${url}#webpage`, url, name: copy.heading, description: copy.description, inLanguage: locale === 'zh' ? 'zh-CN' : 'en-US' },
      { '@type': 'BreadcrumbList', '@id': `${url}#breadcrumb`, itemListElement: [{ '@type': 'ListItem', position: 1, name: 'DLSS5NVIDIA', item: `${SITE_URL}/` }, { '@type': 'ListItem', position: 2, name: copy.heading, item: url }] },
      { '@type': 'FAQPage', '@id': `${url}#faq`, mainEntity: copy.faq.map(([question, answer]) => ({ '@type': 'Question', name: question, acceptedAnswer: { '@type': 'Answer', text: answer } })) },
    ],
  };
}
