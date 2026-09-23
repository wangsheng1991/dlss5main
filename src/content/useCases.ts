import { SITE_URL } from '../config/site';

export type UseCase = {
  path: string;
  slug: string;
  toolPath: string;
  dashboardTool: 'upscale' | 'enhance';
  title: string;
  description: string;
  eyebrow: string;
  heading: string;
  intro: string;
  tldr: string;
  keywords: string[];
  before: string;
  after: string;
  beforeLabel: string;
  afterLabel: string;
  imageAlt: string;
  caption: string;
  useCases: string[];
  steps: Array<{ name: string; text: string }>;
  faqs: Array<{ question: string; answer: string }>;
  related: Array<{ path: string; label: string }>;
};

/**
 * Search-led pages built from real examples already used on the homepage. These pages are deliberately
 * few and specific: each one adds a distinct decision guide instead of manufacturing near-duplicate URLs.
 */
export const USE_CASES: UseCase[] = [
  {
    path: '/use-cases/product-photo-enhancer',
    slug: 'product-photo-enhancer',
    toolPath: '/image-quality-enhancer',
    dashboardTool: 'enhance',
    title: 'Product Photo Enhancer for E-commerce Images',
    description: 'Improve a compressed product photo for an online listing while keeping the product shape, label placement and colors under review.',
    eyebrow: 'E-commerce image workflow',
    heading: 'Product Photo Enhancer',
    intro: 'Make a small marketplace image clearer before you publish it. The workflow focuses on edges, material texture and compression cleanup while asking the model not to redraw the product or its text.',
    tldr: 'Use the image quality enhancer when the product is recognizable but the listing image is soft or compressed. Compare the result at 100% and check labels before publishing.',
    keywords: ['product photo enhancer', 'ecommerce image enhancer', 'marketplace image quality', 'ai product image upscaler', 'shop listing photo enhancer'],
    before: '/examples/case-product-low.jpg',
    after: '/examples/case-product.jpg',
    beforeLabel: 'Compressed product photo',
    afterLabel: 'Enhanced product photo',
    imageAlt: 'Product photo before and after AI image enhancement',
    caption: 'Illustrative product case: the output aims to recover boundaries and material texture. It is not a guarantee that small labels or numbers are reconstructed correctly.',
    useCases: ['Marketplace listing images', 'Catalog thumbnails', 'Product detail pages', 'Compressed supplier photos'],
    steps: [
      { name: 'Start with the largest original', text: 'Upload the original JPG, PNG or WebP instead of a screenshot of a marketplace preview.' },
      { name: 'Choose quality enhancement', text: 'Open the image quality enhancer. It uses the fixed preservation instruction and costs 1 credit per task.' },
      { name: 'Inspect the product', text: 'Compare the silhouette, logo, label text, color and small hardware at 100% before downloading.' },
    ],
    faqs: [
      { question: 'Will the enhancer redesign my product?', answer: 'The workflow asks the model to preserve the product silhouette, label placement and colors, but AI enhancement can still alter uncertain details. Review the result before publishing.' },
      { question: 'Can it make a product photo suitable for every marketplace?', answer: 'It improves pixels; it does not choose marketplace dimensions, background policy or commercial claims. Export and crop to each marketplace specification after checking the result.' },
      { question: 'Should I use upscaling or quality enhancement?', answer: 'Use the quality enhancer when compression and softness are the main problem. Use the image upscaler when you primarily need more pixels and want to preview the output dimensions.' },
    ],
    related: [
      { path: '/image-quality-enhancer', label: 'Image Quality Enhancer' },
      { path: '/image-upscaler', label: 'AI Image Upscaler' },
      { path: '/remove-background', label: 'Remove Background' },
    ],
  },
  {
    path: '/use-cases/architecture-render-upscaler',
    slug: 'architecture-render-upscaler',
    toolPath: '/image-upscaler',
    dashboardTool: 'upscale',
    title: 'Architecture Render Upscaler — Preserve Straight Lines and Materials',
    description: 'Upscale an architecture render or real-estate image online while checking window geometry, perspective and material edges.',
    eyebrow: 'Architecture and real-estate workflow',
    heading: 'Architecture Render Upscaler',
    intro: 'Prepare a small render, exterior photo or interior visualization for a presentation. The useful test is not only sharpness: straight lines, repeated windows and the original perspective must remain stable.',
    tldr: 'Use the image upscaler for architecture visuals that need more pixels. Keep the original perspective, inspect repeated geometry and reject results with halos or invented windows.',
    keywords: ['architecture render upscaler', 'architectural image enhancer', 'real estate photo enhancer', 'interior render upscaler', 'building image upscaler'],
    before: '/examples/case-architecture-low.jpg',
    after: '/examples/case-architecture.jpg',
    beforeLabel: 'Low-resolution architecture image',
    afterLabel: 'Enhanced architecture image',
    imageAlt: 'Architecture image before and after AI upscaling',
    caption: 'Illustrative architecture case: compare the straight edges, window spacing and materials before using the image in a client presentation.',
    useCases: ['Interior design presentations', 'Real-estate listing photos', 'Architectural concept boards', 'Small exterior renders'],
    steps: [
      { name: 'Upload the source render', text: 'Use the original render or camera export. A screenshot of a compressed chat preview gives the model less reliable structure.' },
      { name: 'Set the target scale', text: 'Choose 2× or 4× in the image upscaler. The studio shows the actual output size before the task starts.' },
      { name: 'Audit geometry', text: 'Check window frames, roof lines, railings, repeating facades and perspective at 100% before delivery.' },
    ],
    faqs: [
      { question: 'Can an AI upscaler fix a bad architectural perspective?', answer: 'No. It can improve apparent detail, but it should not be used to correct a camera or perspective error. Keep the source render and fix geometry in the design tool.' },
      { question: 'What should I inspect in an architecture result?', answer: 'Inspect long straight edges, window spacing, thin railings, brick patterns and shadows. Halos or repeated patterns are signs that the source needs another pass.' },
      { question: 'Is this suitable for construction documents?', answer: 'No. The result is a visual enhancement for presentations and references, not a measurement source or a replacement for the original CAD/BIM output.' },
    ],
    related: [
      { path: '/image-upscaler', label: 'AI Image Upscaler' },
      { path: '/image-quality-enhancer', label: 'Image Quality Enhancer' },
      { path: '/unblur-image', label: 'Unblur Image' },
    ],
  },
  {
    path: '/use-cases/portrait-photo-enhancer',
    slug: 'portrait-photo-enhancer',
    toolPath: '/unblur-image',
    dashboardTool: 'enhance',
    title: 'Portrait Photo Enhancer — Improve Soft Faces Without Plastic Skin',
    description: 'Enhance a soft portrait online while checking facial identity, expression, hair and skin texture instead of relying on sharpening alone.',
    eyebrow: 'Portrait restoration workflow',
    heading: 'Portrait Photo Enhancer',
    intro: 'Give a compressed or slightly soft portrait a cleaner starting point for sharing or printing. The safe workflow preserves identity as a review goal and treats every reconstructed detail as an estimate.',
    tldr: 'Use the portrait workflow for mild softness and compression, then inspect eyes, teeth, hair and skin texture. AI cannot reliably recover an identity detail that was never captured.',
    keywords: ['portrait photo enhancer', 'face detail enhancement', 'ai portrait upscaler', 'old portrait restoration', 'improve face photo quality'],
    before: '/examples/case-portrait-low.jpg',
    after: '/examples/case-portrait.jpg',
    beforeLabel: 'Soft portrait',
    afterLabel: 'Enhanced portrait',
    imageAlt: 'Portrait before and after AI face detail enhancement',
    caption: 'Illustrative portrait case: compare expression, face shape, eyes, hair and skin texture rather than judging sharpness alone.',
    useCases: ['Compressed profile photos', 'Family photo copies', 'Portrait print preparation', 'Soft phone snapshots'],
    steps: [
      { name: 'Use the best source', text: 'Choose the largest original portrait and avoid a screenshot or a second-generation social download.' },
      { name: 'Enhance conservatively', text: 'Open the unblur or quality enhancer and start with the lower factor when the face is already recognizable.' },
      { name: 'Check identity-sensitive areas', text: 'Compare eyes, expression, face shape, teeth, hair and jewelry before you share or print the result.' },
    ],
    faqs: [
      { question: 'Can the enhancer restore a face exactly?', answer: 'No. It can improve mild softness and compression, but details that were not captured cannot be recovered with certainty. Treat the output as an enhanced estimate.' },
      { question: 'How do I avoid a plastic-looking portrait?', answer: 'Start with the largest source, use a restrained factor and inspect skin texture at 100%. If the expression or face shape changes, keep the original instead.' },
      { question: 'Is this facial recognition or identity verification?', answer: 'No. This is an image enhancement workflow. It must not be used to identify a person or to make an identity-sensitive decision.' },
    ],
    related: [
      { path: '/unblur-image', label: 'Unblur Image' },
      { path: '/image-quality-enhancer', label: 'Image Quality Enhancer' },
      { path: '/image-upscaler', label: 'AI Image Upscaler' },
    ],
  },
];

export const USE_CASE_BY_PATH = Object.fromEntries(USE_CASES.map(item => [item.path, item])) as Record<string, UseCase>;

export function useCaseSchema(item: UseCase): object {
  const pageUrl = `${SITE_URL}${item.path}`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: item.title,
        description: item.description,
        inLanguage: 'en-US',
        image: `${SITE_URL}${item.after}`,
      },
      {
        '@type': 'SoftwareApplication',
        name: 'DLSS5NVIDIA AI Image Studio',
        applicationCategory: 'MultimediaApplication',
        operatingSystem: 'Web',
        url: `${SITE_URL}${item.toolPath}`,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      },
      {
        '@type': 'FAQPage',
        mainEntity: item.faqs.map(faq => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: { '@type': 'Answer', text: faq.answer },
        })),
      },
    ],
  };
}
