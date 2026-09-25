export type VideoDemo = {
  src: string;
  poster: string;
  name: string;
  description: string;
  alt: string;
};

export const VIDEO_LONG_FORM = {
  definition: 'AI video upscaling is a frame-by-frame reconstruction workflow that enlarges a finished clip and estimates cleaner edges, texture and motion detail. It is different from native 4K rendering: the model can make a shot more usable, but it cannot prove detail that was absent from the source. The safest workflow keeps the original clip beside every enhanced export.',
  preview: 'A low-cost preview is useful when the creative decision is still changing. Generate at 480p or 720p, settle the prompt, camera move, reference images and timing, then choose the few frames that represent the shot. This avoids spending final-resolution credits on an idea that will be discarded.',
  checks: 'Video quality is judged across time as well as in a single frame. Inspect faces, hands, typography, UI, hair, thin geometry and high-contrast edges at 100 percent. Scrub forward and backward around cuts and fast motion to catch flicker, warping, duplicate limbs or a subject whose identity drifts.',
  delivery: 'For a finished export, record the source resolution, target resolution, provider or model, frame rate and any crop. Keep an untouched master and label the result as AI-enhanced when the reconstruction changes uncertain detail. A 4K file is a delivery size, not a guarantee that every pixel is factual.',
  sceneNotes: 'Different scenes fail in different ways. Faces and hands expose identity errors; subtitles and game HUDs expose invented characters; foliage, hair and rain expose temporal shimmer; buildings and product edges expose ringing or oversharpening. Use a short representative clip from the hardest scene, rather than judging a clean establishing shot only.',
  costNotes: 'A cost comparison should include generation, retries, storage and the time spent checking bad frames. The preview-plus-finish route is useful when most ideas are rejected early, while native high-resolution generation may be simpler for a single approved shot. Keep the same prompt and frame-rate assumptions when comparing providers.',
  handoff: 'When a clip moves from generation to enhancement, pass along the original frame rate, aspect ratio, intended crop and any text-safe area. Do not silently change these between stages: a resize can make a timing problem look like a sharpness problem, and a crop can make a stable character appear to drift. Save a small contact sheet of approved key frames with the export so another editor can audit the result.',
  checklist: 'Before publishing, write down the source and target dimensions, the frame rate, the number of frames processed and the review result for the hardest shot. Watch once with sound muted to focus on temporal structure, once at normal speed for motion, and once frame by frame around faces, text and fast cuts. This small record makes a later revision easier and keeps a cost comparison honest. It also gives a teammate enough context to reproduce the decision without guessing which version was approved.',
} as const;

export const VIDEO_LANDING = {
  path: '/video-upscaler',
  title: 'AI Video Upscaler Online — 4K Frame Enhancement Workflow',
  description: 'Explore a cost-aware AI video super-resolution workflow for low-resolution drafts, frame checks and 1080p or 4K finishing. Try the image frame workflow today and review the video demos.',
  heading: 'AI Video Upscaler and Super-Resolution Workflow',
  intro: 'Generate or edit a short clip at a practical preview resolution, inspect the frames that matter, then finish the approved shot for delivery. This page shows the workflow and original reference demos while the live workspace currently processes still image frames.',
  keywords: [
    'ai video upscaler',
    'video super resolution',
    '4k video enhancer',
    'video frame enhancement',
    'seedance 2.5 video upscaling',
    'low resolution to 4k video',
    'game video enhancer',
  ],
  demos: [
    {
      src: '/examples/dlss5-upscale-before-after-demo.mp4',
      poster: '/examples/generated/architecture-1-after.jpg',
      name: 'AI image upscaling before and after demo',
      description: 'Original silent reference transition from a soft source frame to a sharper enhancement preview.',
      alt: 'Six-second AI image upscaling before and after video demo',
    },
    {
      src: '/examples/dlss5-game-style-transition.mp4',
      poster: '/examples/generated/game-cyber-1-after.jpg',
      name: 'Game character style conversion reference',
      description: 'Original silent game-character reference showing a stable pose with a changed lighting and material direction.',
      alt: 'Six-second game character style conversion video reference',
    },
  ] as VideoDemo[],
  faqs: [
    {
      question: 'Can I upload a video and receive a finished 4K file now?',
      answer: 'The public workspace currently supports still-image enhancement. This page documents the video workflow and shows original reference demos; use the frame workflow to test a representative shot while the video provider adapter is being connected.',
    },
    {
      question: 'Why generate at 480p or 720p before video super-resolution?',
      answer: 'Lower-resolution previews make prompt, camera and timing iterations cheaper. Once a shot is approved, a separate super-resolution pass can finish the frames for 1080p or 4K delivery, with flicker and invented-detail checks before publishing.',
    },
    {
      question: 'Does video super-resolution equal native 4K generation?',
      answer: 'No. It can recover and reconstruct useful detail, but small text, hair, thin lines and fast motion can change between frames. Keep the source clip, compare key frames at 100% and label the result as AI-enhanced.',
    },
  ],
} as const;

export function videoLandingSchema(siteUrl = 'https://www.dlss5nvidia.com') {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: VIDEO_LANDING.title,
        url: `${siteUrl}${VIDEO_LANDING.path}`,
        description: VIDEO_LANDING.description,
        inLanguage: 'en-US',
        isPartOf: { '@type': 'WebSite', name: 'DLSS5NVIDIA', url: `${siteUrl}/` },
      },
      ...VIDEO_LANDING.demos.map((demo) => ({
        '@type': 'VideoObject',
        name: demo.name,
        description: demo.description,
        contentUrl: `${siteUrl}${demo.src}`,
        thumbnailUrl: `${siteUrl}${demo.poster}`,
        uploadDate: '2026-09-25',
        embedUrl: `${siteUrl}${VIDEO_LANDING.path}`,
      })),
      {
        '@type': 'FAQPage',
        mainEntity: VIDEO_LANDING.faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: { '@type': 'Answer', text: faq.answer },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'DLSS5NVIDIA', item: `${siteUrl}/` },
          { '@type': 'ListItem', position: 2, name: VIDEO_LANDING.heading, item: `${siteUrl}${VIDEO_LANDING.path}` },
        ],
      },
    ],
  };
}
