import { ENHANCE_MAX_EDGE } from '../config/enhance';

export type ToolLanding = {
  path: string;
  locale: 'en' | 'es';
  slug: string;
  dashboardTool: 'upscale' | 'enhance' | 'unblur';
  language: 'en-US' | 'es-ES';
  title: string;
  description: string;
  eyebrow: string;
  heading: string;
  intro: string;
  cta: string;
  ctaNote: string;
  resultLabel: string;
  originalLabel: string;
  prompt: string;
  useCases: string[];
  keywords: string[];
  faqs: Array<{ question: string; answer: string }>;
  related: Array<{ path: string; label: string }>;
};

export const TOOL_LANDINGS: ToolLanding[] = [
  {
    path: '/image-upscaler',
    locale: 'en',
    slug: 'image-upscaler',
    dashboardTool: 'upscale',
    language: 'en-US',
    title: 'AI Image Upscaler Online — Preview Your Output Size',
    description: 'Enlarge small photos with AI using 2x or 4x targets, up to 1536 pixels per edge. Preview the output size, compare the result and download it online.',
    eyebrow: 'AI image tool',
    heading: 'AI Image Upscaler',
    intro: 'Turn a small or compressed image into a larger, cleaner version while keeping the original framing, colors and composition.',
    cta: 'Upload an image',
    ctaNote: 'JPG, PNG and WebP · up to 20 MiB · 1536 px maximum output edge',
    resultLabel: 'Enhanced result',
    originalLabel: 'Original input',
    prompt: 'Upscale 4x, preserve the exact composition and subject identity, recover realistic texture and edges, remove compression noise, do not add objects or change the framing.',
    useCases: ['Small photos', 'Product listings', 'Real estate images', 'Screenshots and scans'],
    keywords: ['ai image upscaler', 'image upscaler online', 'upscale image 2x', 'upscale image 4x', 'increase image resolution'],
    faqs: [
      { question: 'What does an AI image upscaler do?', answer: 'It generates a larger version of an image while reconstructing plausible edges and texture. It is useful for low-resolution photos, screenshots and product images, but it cannot recover detail that was never captured with certainty.' },
      { question: 'Can I upscale an image for free?', answer: 'You can compare the illustrative example without an account. Processing your own image requires sign-in and uses 1 credit per task. Your allowance is shown before you submit.' },
      { question: 'Does upscaling change the composition?', answer: 'The enhancement preset asks the model to keep the composition, framing, colors and subject identity unchanged. Always review faces, text and fine product details before publishing.' },
    ],
    related: [
      { path: '/image-quality-enhancer', label: 'Image Quality Enhancer' },
      { path: '/unblur-image', label: 'Unblur Image' },
    ],
  },
  {
    path: '/image-quality-enhancer',
    locale: 'en',
    slug: 'image-quality-enhancer',
    dashboardTool: 'enhance',
    language: 'en-US',
    title: 'Image Quality Enhancer Online — Make Photos Clearer with AI',
    description: 'Make a blurry, noisy or compressed image clearer online. AI image enhancement restores texture and edge definition while preserving the original scene.',
    eyebrow: 'AI image tool',
    heading: 'Image Quality Enhancer',
    intro: 'Improve the practical quality of a photo before you publish, print or reuse it. The enhancement instruction asks to preserve the scene while improving texture and edges.',
    cta: 'Enhance an image',
    ctaNote: 'JPG, PNG and WebP · 1536 px maximum output edge · 1 credit per task',
    resultLabel: 'Enhanced result',
    originalLabel: 'Original input',
    prompt: 'Enhance image quality 4x, restore realistic texture and sharpness, preserve the original colors, lighting, framing and subject identity, remove JPEG artifacts, do not invent text.',
    useCases: ['Compressed social photos', 'Marketplace product images', 'Old family photos', 'Slides and screenshots'],
    keywords: ['image quality enhancer', 'make image clearer', 'improve photo quality', 'ai photo enhancer', 'enhance image online'],
    faqs: [
      { question: 'What images benefit from quality enhancement?', answer: 'Compressed photos, small product images, screenshots and older scans are good candidates. Start with the original file when available because repeated downloads lose detail.' },
      { question: 'Will the enhancer add fake details?', answer: 'The enhancement instruction asks to preserve the scene, but AI enhancement can make uncertain detail look plausible. Check logos, faces, numbers and other information-sensitive areas at 100%.' },
      { question: 'Is this the same as a simple sharpen filter?', answer: 'No. The model renders a larger image and combines edge, texture and noise recovery. It is still an enhancement estimate rather than a pixel-exact recovery.' },
    ],
    related: [
      { path: '/image-upscaler', label: 'AI Image Upscaler' },
      { path: '/unblur-image', label: 'Unblur Image' },
    ],
  },
  {
    path: '/unblur-image',
    locale: 'en',
    slug: 'unblur-image',
    dashboardTool: 'unblur',
    language: 'en-US',
    title: 'Unblur Image Online — Restore Soft Photos with AI',
    description: 'Unblur a soft or compressed image online with AI enhancement. Restore edge definition and texture while keeping the original subject and framing.',
    eyebrow: 'AI image tool',
    heading: 'Unblur Image Online',
    intro: 'Give a soft photo a cleaner starting point for sharing, printing or editing. Use the before-and-after slider to inspect how much detail the enhancement restores.',
    cta: 'Try the unblur tool',
    ctaNote: 'Best for mild blur and compression · not a substitute for a sharp original capture',
    resultLabel: 'Unblurred result',
    originalLabel: 'Soft input',
    prompt: 'Unblur and upscale 4x, recover natural edge definition and texture, preserve facial identity and the original composition, remove compression noise, do not change the scene.',
    useCases: ['Soft phone photos', 'Mildly soft snapshots', 'Low-resolution portraits', 'Blurred product previews'],
    keywords: ['unblur image online', 'unblur photo ai', 'fix blurry picture', 'sharpen blurry image', 'restore photo detail'],
    faqs: [
      { question: 'Can AI fully fix a blurry photo?', answer: 'It can improve mild blur and compression, but no tool can reliably recover every detail lost during capture. Use the original file and compare the output before relying on it.' },
      { question: 'Does unblurring change faces?', answer: 'The enhancement instruction asks to preserve composition, framing, lighting and colors; identity preservation is not guaranteed. Because enhancement is generative, review faces and text carefully.' },
      { question: 'What is the best input for unblurring?', answer: 'Use the largest original JPEG, PNG or WebP you have. Avoid uploading a screenshot of an already compressed preview.' },
    ],
    related: [
      { path: '/image-quality-enhancer', label: 'Image Quality Enhancer' },
      { path: '/image-upscaler', label: 'AI Image Upscaler' },
    ],
  },
  {
    path: '/es/mejorar-calidad-imagen',
    locale: 'es',
    slug: 'mejorar-calidad-imagen',
    dashboardTool: 'enhance',
    language: 'es-ES',
    title: 'Mejorar la calidad de imagen online con IA',
    description: 'Mejora la calidad de una imagen online con IA. Aumenta la resolución, recupera detalles y reduce artefactos de compresión sin cambiar la composición original.',
    eyebrow: 'Herramienta de imagen con IA',
    heading: 'Mejorar la calidad de imagen',
    intro: 'Convierte una foto pequeña, borrosa o comprimida en una versión más limpia para compartir, imprimir o reutilizar.',
    cta: 'Subir una imagen',
    ctaNote: 'JPG, PNG y WebP · hasta 20 MiB · salida de hasta 1536 px por lado',
    resultLabel: 'Resultado mejorado',
    originalLabel: 'Imagen original',
    prompt: 'Mejora la calidad de la imagen 4x, recupera textura y nitidez realistas, conserva los colores, la iluminación, el encuadre y la identidad del sujeto, elimina artefactos JPEG y no inventes texto.',
    useCases: ['Fotos comprimidas de redes sociales', 'Imágenes de productos', 'Fotos antiguas', 'Capturas de pantalla'],
    keywords: ['mejorar calidad de imagen', 'mejorar imagen online', 'aumentar resolución imagen', 'mejorar foto borrosa', 'mejorar foto con IA'],
    faqs: [
      { question: '¿Qué imágenes se pueden mejorar?', answer: 'Las fotos comprimidas, las imágenes pequeñas de productos, las capturas de pantalla y los escaneos antiguos suelen ser buenos candidatos. Usa el archivo original cuando sea posible.' },
      { question: '¿La IA inventa detalles?', answer: 'La instrucción pide conservar la escena, pero la mejora con IA puede reconstruir detalles inciertos. Revisa logotipos, rostros, números y texto al 100% antes de publicar.' },
      { question: '¿Necesito instalar un programa?', answer: 'No. La herramienta funciona en el navegador. Selecciona tu imagen en esta página, inicia sesión y confirma la mejora. La imagen se envía al servidor solo al iniciar el procesamiento.' },
    ],
    related: [
      { path: '/image-quality-enhancer', label: 'Image Quality Enhancer' },
      { path: '/image-upscaler', label: 'AI Image Upscaler' },
    ],
  },
];

export const TOOL_LANDING_BY_PATH = Object.fromEntries(TOOL_LANDINGS.map(tool => [tool.path, tool])) as Record<string, ToolLanding>;

export const TOOL_BASE_URL = 'https://www.dlss5nvidia.com';

/** Only the enhancer has a translated equivalent. Distinct tools are not language alternates. */
export function toolAlternates(tool: ToolLanding) {
  if (!['/image-quality-enhancer', '/es/mejorar-calidad-imagen'].includes(tool.path)) return [];
  return [
    { hrefLang: 'en', href: `${TOOL_BASE_URL}/image-quality-enhancer` },
    { hrefLang: 'es', href: `${TOOL_BASE_URL}/es/mejorar-calidad-imagen` },
    { hrefLang: 'x-default', href: `${TOOL_BASE_URL}/image-quality-enhancer` },
  ];
}

export function toolSteps(tool: ToolLanding) {
  return tool.locale === 'es' ? [
    { name: 'Selecciona tu imagen', text: 'Selecciona un JPG, PNG o WebP y revisa sus dimensiones. La vista previa es local.' },
    { name: 'Confirma el tamaño', text: `Elige un objetivo de 2× o 4×. La salida está limitada a ${ENHANCE_MAX_EDGE} px por lado. Inicia sesión y confirma el uso de 1 crédito.` },
    { name: 'Compara y descarga', text: 'Revisa el resultado al 100%, especialmente los rostros y el texto, y descarga la imagen.' },
  ] : [
    { name: 'Choose your image', text: 'Select a JPG, PNG or WebP and check its dimensions. The preview stays in your browser.' },
    { name: 'Confirm the output size', text: `Choose a 2× or 4× target, capped at ${ENHANCE_MAX_EDGE} px per edge. Sign in and confirm the 1-credit task.` },
    { name: 'Compare and download', text: 'Review the result at 100%, especially faces and text, then download your image.' },
  ];
}

export function toolSchema(tool: ToolLanding) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebApplication', '@id': `${TOOL_BASE_URL}${tool.path}#application`, name: tool.heading,
        url: `${TOOL_BASE_URL}${tool.path}`, applicationCategory: 'MultimediaApplication', operatingSystem: 'Web',
        description: tool.description, inLanguage: tool.locale, featureList: [`2× / 4× targets, up to ${ENHANCE_MAX_EDGE} px per edge`, 'JPEG, PNG and WebP input'],
        provider: { '@type': 'Organization', name: 'DLSS5NVIDIA', url: TOOL_BASE_URL },
      },
      { '@type': 'HowTo', name: tool.heading, description: tool.intro, inLanguage: tool.locale,
        step: toolSteps(tool).map(step => ({ '@type': 'HowToStep', ...step })),
      },
      { '@type': 'FAQPage', mainEntity: tool.faqs.map(faq => ({ '@type': 'Question', name: faq.question, acceptedAnswer: { '@type': 'Answer', text: faq.answer } })) },
    ],
  };
}
