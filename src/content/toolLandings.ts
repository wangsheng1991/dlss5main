import { ENHANCE_MAX_EDGE } from '../config/enhance';
import { SITE_URL } from '../config/site';

export type ToolLanding = {
  path: string;
  locale: 'en' | 'es';
  slug: string;
  dashboardTool: 'upscale' | 'enhance' | 'unblur' | 'cutout' | 'vectorize' | 'erase' | 'tryon' | 'interior' | 'retouch' | 'makeup';
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
  /** The tools other than the enhancer describe themselves: these fields replace its copy. */
  whenToUse?: string;
  sharedNote?: string;
  disclaimer?: string;
  stepsHeading?: string;
  steps?: Array<{ name: string; text: string }>;
  checks?: string[];
  featureList?: string[];
  /** A worked example… or two real frames of one, for the result slider. */
  demo?: { before: string; after: string; beforeLabel: string; afterLabel: string; caption: string; aspectRatio: number; /** A transparent result needs an opaque surface under it, or the input shows through. */
    backdrop?: string; /** Social cards cannot render an SVG, so a vector demo names a raster twin for og:image. */
    social?: string };
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
    ctaNote: 'JPG, PNG and WebP · up to 10 MiB · 1536 px maximum output edge',
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
    path: '/old-photo-restoration',
    locale: 'en',
    slug: 'old-photo-restoration',
    dashboardTool: 'enhance',
    language: 'en-US',
    title: 'Free Old Photo Restoration Online — Repair Faded Family Photos',
    description: 'Preview a free old photo restoration online with AI enhancement. Preserve faces and the original composition while recovering contrast and texture; processing your own image uses the signed-in enhancement workflow.',
    eyebrow: 'AI photo restoration tool',
    heading: 'Old Photo Restoration',
    intro: 'Preview a free restoration example, then give a scanned or compressed family photo a cleaner, more readable version for sharing and archiving. The workflow asks the model to preserve faces and the original scene while repairing softness, contrast and compression damage.',
    cta: 'Restore an old photo',
    ctaNote: 'JPG, PNG and WebP · up to 10 MiB · inspect faces and text before relying on the result',
    resultLabel: 'Restored result',
    originalLabel: 'Faded original',
    prompt: 'Restore this old photo: recover natural contrast, facial detail and film texture, preserve every person, pose, clothing detail and original composition, remove scratches and compression noise where possible, do not invent people or change identities.',
    useCases: ['Family photo scans', 'Faded album pictures', 'Low-resolution archive copies', 'Photos prepared for a memorial or family history'],
    keywords: ['free old photo restoration', 'old photo restoration', 'restore old photos online free', 'AI photo restoration', 'restore faded photo', 'family photo enhancer', 'repair scanned photo'],
    whenToUse: 'Best when the original is recognizable but faded, soft or compressed. A model can make uncertain detail plausible, so keep the scan and compare faces, dates, uniforms and other historical information before sharing it as a record.',
    sharedNote: 'This is a generative restoration workflow, not forensic recovery. It can improve a scan for viewing, but it cannot prove what a damaged or missing detail originally looked like.',
    disclaimer: 'AI restoration may alter faces, text, uniforms and small historical details. Keep the original scan and label the output as enhanced when accuracy matters.',
    stepsHeading: 'How to restore an old photo',
    steps: [
      { name: 'Start with the best scan', text: 'Upload the largest original scan or camera capture you have. Avoid a screenshot of a social-media preview.' },
      { name: 'Run the restoration', text: 'Choose the enhancement workflow and submit the preservation prompt. It uses 1 credit per task.' },
      { name: 'Compare the history', text: 'Inspect faces, handwriting, uniforms, dates and edges at 100%. Keep both the source and the enhanced copy.' },
    ],
    checks: ['Compare every face with the original for identity drift.', 'Check dates, handwriting, badges and signs for invented characters.', 'Keep the source scan and record that the output was AI enhanced.'],
    faqs: [
      { question: 'Can AI restore a completely missing face?', answer: 'No. It can render a plausible face, but it cannot know which features were lost. Treat a heavily damaged result as an artistic reconstruction, not evidence.' },
      { question: 'Will it colorize a black-and-white photo?', answer: 'This page focuses on restoration and contrast. It may preserve the original monochrome appearance; use a separate colorization workflow when color is the goal.' },
      { question: 'Is the result suitable for genealogy or legal records?', answer: 'Use the original scan for records. The enhanced file is useful for viewing, printing and sharing, but generative changes can affect information-sensitive details.' },
    ],
    related: [
      { path: '/image-quality-enhancer', label: 'Image Quality Enhancer' },
      { path: '/unblur-image', label: 'Unblur Image' },
      { path: '/image-upscaler', label: 'AI Image Upscaler' },
    ],
    demo: {
      before: '/examples/sample1-photo-low.webp', after: '/examples/sample1-photo.webp',
      beforeLabel: 'Faded or compressed source', afterLabel: 'Enhanced archive copy',
      caption: 'Illustrative restoration comparison. Review faces, text and historical details against the original scan before treating the result as a record.',
      aspectRatio: 1,
    },
  },
  {
    path: '/ai-headshot',
    locale: 'en',
    slug: 'ai-headshot',
    dashboardTool: 'enhance',
    language: 'en-US',
    title: 'Free AI Headshot Enhancer Online — Clean Up a Professional Portrait',
    description: 'Preview a free AI headshot enhancement online and create a cleaner professional portrait from your own image. Improve sharpness, skin and hair texture while keeping your identity, expression and framing under review.',
    eyebrow: 'Professional portrait workflow',
    heading: 'AI Headshot Enhancer',
    intro: 'Preview a free headshot example, then turn a soft selfie or compressed portrait into a cleaner profile image for a résumé, team page or professional profile. The workflow improves the source portrait instead of replacing your face with a new identity.',
    cta: 'Enhance a headshot',
    ctaNote: 'JPG, PNG and WebP · up to 10 MiB · review identity and skin texture before publishing',
    resultLabel: 'Enhanced headshot',
    originalLabel: 'Original portrait',
    prompt: 'Enhance this professional headshot, preserve the exact facial identity, expression, age, hairline and framing, recover natural skin and hair texture, balance lighting, remove compression noise, do not change face shape, clothing or background.',
    useCases: ['Résumé and CV portraits', 'Team and company profile photos', 'LinkedIn profile images', 'Speaker and author bios'],
    keywords: ['free ai headshot enhancer', 'ai headshot enhancer', 'professional headshot online free', 'linkedin photo enhancer', 'resume photo enhancer', 'portrait quality enhancer'],
    whenToUse: 'Best when you already have a recognizable portrait and need a cleaner, more consistent profile image. It is an enhancement workflow, not a studio replacement or a guarantee of identity preservation.',
    sharedNote: 'The tool improves an existing portrait with a preservation instruction. It does not generate a new wardrobe, pose or background package.',
    disclaimer: 'AI can alter faces and skin texture. Compare the output with the original and do not use it for identity verification or official documents.',
    stepsHeading: 'How to enhance a professional headshot',
    steps: [
      { name: 'Choose a recognizable portrait', text: 'Use a front-facing JPG, PNG or WebP with even light and enough resolution to see the face.' },
      { name: 'Run the enhancement', text: 'Submit the portrait with the identity-preserving enhancement workflow. It uses 1 credit per task.' },
      { name: 'Review before publishing', text: 'Compare eyes, jawline, hairline, skin texture, clothing and background before using the image professionally.' },
    ],
    checks: ['Compare eyes, jawline and hairline against the source.', 'Check skin texture for plastic smoothing or repeated patterns.', 'Confirm the crop and background match the profile where you will use it.'],
    faqs: [
      { question: 'Is this an AI headshot generator?', answer: 'It enhances an existing portrait. It does not promise a new set of poses, outfits or backgrounds, which makes the source identity easier to compare.' },
      { question: 'Can I use the result for a passport or ID?', answer: 'No. Official documents have their own strict requirements. Use the dedicated passport photo tool and the receiving authority’s current rules instead.' },
      { question: 'How do I avoid an over-smoothed face?', answer: 'Start with a sharp, evenly lit source and inspect the output at 100%. If skin texture looks plastic or the face shape moves, keep the original or try another source.' },
    ],
    related: [
      { path: '/image-quality-enhancer', label: 'Image Quality Enhancer' },
      { path: '/unblur-image', label: 'Unblur Image' },
      { path: '/image-upscaler', label: 'AI Image Upscaler' },
    ],
    demo: {
      before: '/examples/case-portrait-low.jpg', after: '/examples/case-portrait.jpg',
      beforeLabel: 'Soft portrait', afterLabel: 'Enhanced portrait',
      caption: 'Illustrative portrait comparison. Review facial identity and expression before using an AI-enhanced headshot in a professional profile.',
      aspectRatio: 0.8,
    },
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
    ctaNote: 'JPG, PNG y WebP · hasta 10 MiB · salida de hasta 1536 px por lado',
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
  {
    path: '/remove-background',
    locale: 'en',
    slug: 'remove-background',
    dashboardTool: 'cutout',
    language: 'en-US',
    title: 'Remove Image Background Online — Transparent PNG',
    description: 'Delete the background from a photo online and download a transparent PNG at the resolution you uploaded. Try the example free, no account needed.',
    eyebrow: 'AI image tool',
    heading: 'Remove Background',
    intro: 'Cut the subject out of a photo and keep it on transparency, at the pixel size you uploaded. The example below runs free, without an account.',
    cta: 'Remove a background',
    ctaNote: 'JPG, PNG and WebP · up to 10 MiB and 16 MP · transparent PNG at the original size',
    resultLabel: 'Cutout result',
    originalLabel: 'Your photo',
    prompt: 'Remove the background and keep the subject on transparency.',
    useCases: ['Product photos for a shop listing', 'Profile pictures and team pages', 'Cutouts for design mockups', 'Objects that become stickers or assets'],
    keywords: ['remove background', 'background remover', 'transparent png', 'cut out image', 'remove image background online'],
    whenToUse: 'Best on a single subject with a reasonably distinct edge — products, people, pets or objects. Very fine detail such as loose hair, glass and motion blur may keep some background, and a see-through subject cannot be cut out cleanly.',
    sharedNote: 'This tool also powers the cutout inside the company tools. It runs in about two seconds and keeps your original pixel size; there is no prompt to write.',
    disclaimer: 'The cut does not change your image size, but the model can still round off very fine edges such as hair or transparent materials. Keep the original file and compare before publishing.',
    stepsHeading: 'How to remove a background',
    steps: [
      { name: 'Choose your image', text: 'Select a JPG, PNG or WebP up to 10 MiB and 16 megapixels. The preview stays in your browser until you submit.' },
      { name: 'Cut the subject out', text: 'Pick Remove background and confirm the task. It takes about two seconds and uses 1 credit per task.' },
      { name: 'Compare and download', text: 'Check the edges at 100%, especially hair and transparent objects, then download the PNG with transparency.' },
    ],
    checks: ['Zoom to the edges and check fine hair or fur.', 'Confirm nothing was cut off the subject itself.', 'Open the PNG on a light and a dark page to see the transparency.'],
    featureList: ['Transparent PNG output', 'Original pixel size kept', 'JPG, PNG and WebP input up to 10 MiB / 16 MP'],
    faqs: [
      { question: 'Does removing the background change the image size?', answer: 'No. The cutout keeps the pixel dimensions of the file you uploaded and only changes what is behind the subject — the output is a PNG with an alpha channel.' },
      { question: 'Can I get a white or coloured background instead?', answer: 'Yes. The API accepts a background colour for the same tool, so a product shot can come back on white without a second step. The studio currently returns transparency.' },
      { question: 'What kind of photo works best?', answer: 'One clear subject with an edge you can already see: a product on a plain surface, a person against a wall, or an object on a table. Busy backgrounds and see-through materials are harder.' },
      { question: 'Is there a size limit on the image I upload?', answer: 'Two: the file is capped at 10 MiB and the picture at 16 megapixels (for example 4928 × 3264), which comfortably covers a 12 MP phone photo and 4K or 5K screenshots. A phone\'s 48 MP high-resolution mode is over both limits, so the studio measures the picture when you pick it and tells you before anything is submitted.' },
    ],
    related: [
      { path: '/erase-object', label: 'Erase Object' },
      { path: '/image-upscaler', label: 'AI Image Upscaler' },
    ],
    demo: {
      before: '/examples/cutout-teapot.jpg', after: '/examples/cutout-teapot-after.jpg',
      beforeLabel: 'Your photo', afterLabel: 'Cutout (transparency shown on white)',
      caption: 'Real output: the teapot was cut out at its original 1024 × 1024 pixels and shows an alpha channel. No background was redrawn.',
      aspectRatio: 1, backdrop: '#ffffff',
    },
  },
  {
    path: '/erase-object',
    locale: 'en',
    slug: 'erase-object',
    dashboardTool: 'erase',
    language: 'en-US',
    title: 'Erase Objects from Photos with AI — Remove Anything Online',
    description: 'Remove an object, watermark or line of text from a photo and let the model rebuild what was behind it. Example pair and full-size sample provided.',
    eyebrow: 'AI image tool',
    heading: 'Erase Object',
    intro: 'Name what should go: the model removes it and rebuilds the surface underneath, keeping the rest of the frame as it was.',
    cta: 'Erase an object',
    ctaNote: 'JPG, PNG and WebP · up to 10 MiB · 1024 × 1024 PNG output, about a minute',
    resultLabel: 'Erased result',
    originalLabel: 'Your photo',
    prompt: 'Remove the spoon from the table and rebuild the wooden surface behind it; keep the mug, the napkin and the lighting exactly as they are.',
    useCases: ['Objects that spoil a photo', 'Watermarks and logos on your own images', 'Text and labels you no longer need', 'Repair work on old photos'],
    keywords: ['erase object from photo', 'remove object from image', 'remove watermark online', 'ai object remover', 'clean up photo'],
    whenToUse: 'Best for an object on a textured or continuous surface — a table, a wall, a floor, sky or grass. The model rebuilds the covered area, so the result is a re-render, not a perfect copy of what was there.',
    sharedNote: 'This is a generative edit: the frame is re-rendered at 1024 × 1024, so a larger photo comes back at that size rather than its original resolution.',
    disclaimer: 'Because the whole frame is re-rendered, fine text and small details elsewhere in the photo can change slightly. Review the result at 100% before you rely on it.',
    stepsHeading: 'How to erase an object',
    steps: [
      { name: 'Choose your image', text: 'Select a JPG, PNG or WebP up to 10 MiB — any pixel size, since the reference is scaled to the model before it renders. Photos with one obvious object work best.' },
      { name: 'Name what should go', text: 'Describe the object to remove in the studio, then submit. The task takes about a minute and uses 1 credit.' },
      { name: 'Compare and download', text: 'Check where the object was and the rest of the frame, then download the 1024 × 1024 PNG.' },
    ],
    checks: ['Zoom into the area the object occupied for seams or repeated texture.', 'Check text, logos and faces elsewhere in the frame for drift.', 'Compare the lighting direction with the original.'],
    featureList: ['Object and watermark removal', 'Rebuilds the surface behind the object', '1024 × 1024 PNG output'],
    faqs: [
      { question: 'Does it work on watermarks and text?', answer: 'Yes, as long as you own the image: describe the watermark or the line of text as the thing to remove. Dense or semi-transparent text over a busy background is the hardest case.' },
      { question: 'Why does the output come back at 1024 × 1024?', answer: 'The model rebuilds the entire frame rather than patching pixels, and it works at a fixed 1024 px square. A larger original is therefore re-rendered at that size.' },
      { question: 'How long does an erase take?', answer: 'About a minute on the shared GPUs behind this site. The task is queued if the hardware is busy, and a confirmed failure is refunded automatically.' },
      { question: 'Is there a size limit on the image I upload?', answer: 'Only one here: the file is capped at 10 MiB, with no pixel ceiling — the reference image is scaled down inside the service before the frame is re-rendered at 1024 × 1024. (The other tools in the studio also cap the picture at 16 megapixels.)' },
    ],
    related: [
      { path: '/remove-background', label: 'Remove Background' },
      { path: '/image-quality-enhancer', label: 'Image Quality Enhancer' },
    ],
    demo: {
      before: '/examples/erase-spoon.jpg', after: '/examples/erase-spoon-after.jpg',
      beforeLabel: 'Your photo', afterLabel: 'Spoon erased',
      caption: 'Real output: the spoon was removed and the wooden surface rebuilt behind it. The mug, the napkin and the light are unchanged.',
      aspectRatio: 1,
    },
  },
  {
    path: '/image-to-svg',
    locale: 'en',
    slug: 'image-to-svg',
    dashboardTool: 'vectorize',
    language: 'en-US',
    title: 'Image to SVG Converter Online — Vectorize a Logo or Icon',
    description: 'Convert a PNG or JPG into a real SVG online. Logos, icons, badges and flat illustrations come back as vector paths you can scale and edit. Try the example free, no account needed.',
    eyebrow: 'AI image tool',
    heading: 'Image to SVG',
    intro: 'Trace a bitmap into an actual vector file — paths, not pixels — at the size you uploaded. The badge example below runs free, without an account.',
    cta: 'Vectorize an image',
    ctaNote: 'JPG, PNG and WebP · up to 10 MiB and 16 MP · SVG output · long edge up to 2048 px',
    resultLabel: 'Traced SVG',
    originalLabel: 'Your bitmap',
    prompt: 'Trace the badge into a clean vector SVG.',
    useCases: ['Logos and brand marks', 'Icons and UI graphics', 'Badges, seals and lettering', 'Flat illustrations for print'],
    keywords: ['image to svg', 'png to svg converter', 'vectorize image online', 'convert jpg to svg', 'logo to vector', 'svg converter free'],
    whenToUse: 'Best on flat artwork with a limited palette: logos, icons, badges, lettering and flat illustration. A photograph traced colour-for-colour would produce an enormous file, so the photo preset limits the palette to 16 colours first — that result is a posterized illustration, not a faithful vector copy of the photograph.',
    sharedNote: 'The trace follows the pixels you upload and respects transparency, so a cut-out PNG comes back as an SVG with no background rectangle.',
    disclaimer: 'Vectorizing redraws the artwork as paths, so very small type, hairlines and anti-aliased edges can shift slightly. Inspect small text at 100% before you send the file to print.',
    stepsHeading: 'How to convert an image to SVG',
    steps: [
      { name: 'Choose your image', text: 'Select a JPG, PNG or WebP up to 10 MiB and 16 megapixels — a logo, an icon or flat artwork at a sensible resolution.' },
      { name: 'Pick a preset', text: 'Logo keeps exact colours and crisp edges, flat illustration smooths curves, photo limits the palette for a photograph. Confirm the 1-credit task.' },
      { name: 'Open the SVG', text: 'Download the file, place it on a page or open it in a vector editor — it stays sharp at any size.' },
    ],
    checks: ['Zoom into small text and thin lines for rounded or merged strokes.', 'Compare the palette with the original — the photo preset limits colours.', 'Scale the SVG up and confirm the edges stay crisp instead of pixelating.'],
    featureList: ['True SVG output (paths, not pixels)', 'Transparency preserved', 'JPG, PNG and WebP input up to 10 MiB / 16 MP'],
    faqs: [
      { question: 'What do I get from converting an image to SVG?', answer: 'An SVG file built from paths and shapes instead of a grid of pixels, so it can be scaled to any size without blurring and edited in vector software. The trace follows the colours and edges of the bitmap you upload.' },
      { question: 'Should I vectorize a photograph?', answer: 'Usually not. A photograph holds thousands of colours, and tracing all of them produces a very large file, so the photo preset limits the palette to 16 colours first. That gives a posterized illustration rather than a faithful copy.' },
      { question: 'Does the SVG keep my image size?', answer: 'The trace runs at your image size up to the long edge you choose — 1024, 1536 or 2048 px. A larger source is scaled down to that edge before tracing, and the SVG states its own width and height.' },
      { question: 'Is this the same as embedding my PNG in an SVG?', answer: 'No. A bitmap wrapped in an SVG tag still contains pixels and blurs when scaled. Here the image is traced into vector paths, which is what makes it editable and resolution-independent.' },
      { question: 'Is there a size limit on the image I upload?', answer: 'Two: the file is capped at 10 MiB and the picture at 16 megapixels (4928 × 3264); the trace itself then runs at up to the 2048 px long edge you choose. The studio measures the picture when you pick it, so an over-sized photo is refused before it is uploaded.' },
    ],
    related: [
      { path: '/remove-background', label: 'Remove Background' },
      { path: '/erase-object', label: 'Erase Object' },
    ],
    demo: {
      before: '/examples/vectorize-badge.png', after: '/examples/vectorize-badge-after.svg',
      beforeLabel: 'Bitmap logo (1024 × 1024 PNG)', afterLabel: 'Traced SVG (24 KB of paths)',
      caption: 'Real output: a 78 KB PNG badge traced with the logo preset into a 24 KB SVG in 0.4 s. Every shape is now a path, the lettering is still legible, and the file scales to any print size.',
      aspectRatio: 1, social: '/examples/vectorize-badge-after.png',
    },
  },
  {
    path: '/virtual-try-on',
    locale: 'en',
    slug: 'virtual-try-on',
    dashboardTool: 'tryon',
    language: 'en-US',
    title: 'Virtual Try-On Online — Preview a Garment on Your Photo',
    description: 'Preview a garment on a person online with AI virtual try-on. Upload a person photo and garment reference, then compare the fit while keeping the face, pose and background.',
    eyebrow: 'AI image tool',
    heading: 'Virtual Try-On',
    intro: 'Test one garment reference on a person photo before you publish a listing or plan an outfit. The studio keeps the person, pose and background as stable as the generative edit allows.',
    cta: 'Open virtual try-on',
    ctaNote: 'Two images required · person first, garment second · about a minute · 1 credit',
    resultLabel: 'Try-on result',
    originalLabel: 'Person and garment references',
    prompt: '',
    useCases: ['Apparel listing previews', 'Outfit planning', 'Fashion concept boards', 'Garment colour and silhouette checks'],
    keywords: ['virtual try on online', 'ai virtual try on', 'garment try on ai', 'clothes changer online', 'virtual fitting room'],
    whenToUse: 'Use a clear, front-facing person photo and a garment reference with enough fabric visible. This is a visual preview, not a measurement or a guarantee of fit, drape or final product colour.',
    sharedNote: 'The person image is uploaded first and the garment image second. Review hands, hems, logos and fabric details before using the result in a product listing.',
    disclaimer: 'Generative try-on can alter seams, hands, logos and small patterns. Do not use it as a sizing, safety or identity decision.',
    stepsHeading: 'How to preview a garment',
    steps: [
      { name: 'Choose the references', text: 'Upload one person photo and one garment photo. Keep the subject visible and use a garment reference with a clear outline.' },
      { name: 'Choose what the garment covers', text: 'Select a whole outfit, top, bottom or dress so the server-side editing recipe knows which clothing area to replace.' },
      { name: 'Compare the preview', text: 'Inspect the face, hands, hem, logos and folds before downloading or sharing the result.' },
    ],
    checks: ['Check the face, hands and pose against the person reference.', 'Inspect hems, logos, seams and repeated patterns at 100%.', 'Compare the garment colour and silhouette with the source item.'],
    featureList: ['Two-reference virtual try-on', 'Whole outfit, top, bottom or dress presets', 'Before-and-after preview in the browser'],
    faqs: [
      { question: 'What images should I upload for virtual try-on?', answer: 'Use a clear person photo and a separate garment reference. The person is uploaded first and the garment second; front-facing images with the clothing outline visible are easiest to compare.' },
      { question: 'Is this a size or fit measurement?', answer: 'No. It is a visual preview of a garment on a person. It cannot measure the body or guarantee physical fit, drape, colour or fabric behaviour.' },
      { question: 'Can I use a result as a product photo?', answer: 'Only after reviewing it carefully and confirming you have the rights to both input images. Check hands, logos, seams, face identity and the garment shape before publishing.' },
    ],
    related: [
      { path: '/portrait-retouch', label: 'Portrait Retouch' },
      { path: '/virtual-makeup', label: 'Virtual Makeup' },
      { path: '/image-quality-enhancer', label: 'Image Quality Enhancer' },
    ],
    demo: {
      before: '/examples/tryon-person.jpg', after: '/examples/tryon-after.jpg',
      beforeLabel: 'Person reference', afterLabel: 'Try-on preview',
      caption: 'Illustrative preview: compare the face, pose and background with the person reference before treating the garment result as usable.',
      aspectRatio: 0.75,
    },
  },
  {
    path: '/interior-design',
    locale: 'en',
    slug: 'interior-design',
    dashboardTool: 'interior',
    language: 'en-US',
    title: 'AI Interior Design Render Online — Restyle a Room Photo',
    description: 'Restyle an empty room photo into an interior design render online. Choose a room and fixed style while preserving walls, windows, camera angle and room geometry.',
    eyebrow: 'AI image tool',
    heading: 'AI Interior Design Render',
    intro: 'Turn an empty or unfinished room photo into a furnishing concept without moving the walls or windows. Pick a room and a named style instead of relying on an opaque free-form prompt.',
    cta: 'Open interior design tool',
    ctaNote: 'One room photo · optional style reference · about a minute · 1 credit',
    resultLabel: 'Interior render',
    originalLabel: 'Room photo',
    prompt: '',
    useCases: ['Real-estate staging concepts', 'Renovation moodboards', 'Furniture layout studies', 'Interior presentation drafts'],
    keywords: ['ai interior design online', 'room restyle ai', 'interior render generator', 'virtual staging ai', 'room makeover ai'],
    whenToUse: 'Use a room photo with visible corners, windows and floor lines. The render is a concept for discussion; it is not a construction drawing, measurement or promise that furniture will fit.',
    sharedNote: 'Choose the room type and a named style. You may add a style reference, but review walls, windows, doors, perspective and furniture scale before sharing.',
    disclaimer: 'Generative interior renders can change materials, proportions and small architectural details. Confirm measurements and finishes against the original room.',
    stepsHeading: 'How to create a room concept',
    steps: [
      { name: 'Upload a room photo', text: 'Choose a view where the walls, floor, windows and doors are visible. Keep the camera angle stable for a useful comparison.' },
      { name: 'Choose room and style', text: 'Pick the room type and a named material recipe such as Nordic, Japandi, industrial or modern Chinese.' },
      { name: 'Check the geometry', text: 'Compare windows, doors, floor lines, furniture scale and lighting before using the render in a presentation.' },
    ],
    checks: ['Check that walls, windows and doors stayed in the same locations.', 'Inspect straight lines, floor perspective and furniture scale.', 'Compare material, lighting and colour with the selected style.'],
    featureList: ['Named interior style recipes', 'Room type presets', 'Optional style reference image'],
    faqs: [
      { question: 'Can this create a real floor plan?', answer: 'No. It creates a visual interior concept from a room photo. Use measured drawings or a design tool for dimensions, construction and furniture fit.' },
      { question: 'Which room styles are available?', answer: 'The studio offers named recipes including Nordic, warm minimal, Japandi, modern Chinese, industrial loft and French classic, plus room-type presets.' },
      { question: 'Will it keep my windows and walls?', answer: 'The workflow asks the model to preserve the room geometry, but generative results can drift. Review straight lines, openings and perspective before sharing.' },
    ],
    related: [
      { path: '/image-quality-enhancer', label: 'Image Quality Enhancer' },
      { path: '/image-quality-enhancer', label: 'Image Quality Enhancer' },
      { path: '/virtual-try-on', label: 'Virtual Try-On' },
    ],
    demo: {
      before: '/examples/interior-room.jpg', after: '/examples/interior-after.jpg',
      beforeLabel: 'Room photo', afterLabel: 'Interior concept',
      caption: 'Illustrative preview: compare the room geometry and openings first, then judge the furniture, materials and lighting concept.',
      aspectRatio: 1.5,
    },
  },
  {
    path: '/portrait-retouch',
    locale: 'en',
    slug: 'portrait-retouch',
    dashboardTool: 'retouch',
    language: 'en-US',
    title: 'AI Portrait Retouch Online — Natural Skin and Eye Enhancement',
    description: 'Retouch a portrait online with AI at light, natural or magazine strength. Keep face shape, expression and identity while improving skin tone, eyes and stray hairs.',
    eyebrow: 'AI image tool',
    heading: 'AI Portrait Retouch',
    intro: 'Clean up a portrait without asking for a new face. Choose a restrained retouch level and compare skin texture, eyes, hair and expression against the source.',
    cta: 'Open portrait retouch',
    ctaNote: 'One portrait · light, natural or magazine level · about a minute · 1 credit',
    resultLabel: 'Retouched portrait',
    originalLabel: 'Portrait source',
    prompt: '',
    useCases: ['Profile photos', 'Creator portraits', 'Portrait portfolio drafts', 'Social image cleanup'],
    keywords: ['ai portrait retouch online', 'natural skin retouch ai', 'photo retouch online', 'portrait enhancer ai', 'face retouch without changing identity'],
    whenToUse: 'Choose natural retouch when identity and skin texture matter. Use the strongest level only for a deliberate editorial look and always compare the eyes, jawline and expression with the source.',
    sharedNote: 'Select light, natural or magazine retouching. The result is generative and can alter skin texture, eyes or hair, so review identity-sensitive details at 100%.',
    disclaimer: 'Retouching can change facial detail even when the workflow asks to preserve identity. Do not use the result for biometric, legal or identity verification purposes.',
    stepsHeading: 'How to retouch a portrait',
    steps: [
      { name: 'Choose a portrait', text: 'Upload a clear portrait with the face visible. The largest original file gives the model more useful texture to work with.' },
      { name: 'Pick a level', text: 'Choose light, natural or magazine. Natural is the default when you want skin grain and face shape to remain believable.' },
      { name: 'Review identity details', text: 'Compare the eyes, jawline, expression, hair and skin texture before downloading the result.' },
    ],
    checks: ['Compare eyes, jawline, expression and face shape with the source.', 'Check skin grain and hair for waxy or invented texture.', 'Review glasses, jewellery, text and other small details.'],
    featureList: ['Light, natural and magazine retouch levels', 'Identity-sensitive review checklist', 'Before-and-after portrait comparison'],
    faqs: [
      { question: 'Will portrait retouch change my face?', answer: 'The workflow asks the model to preserve identity, face shape and expression, but generative editing can still change details. Review the result before publishing.' },
      { question: 'Which retouch level should I choose?', answer: 'Light is best for small blemishes, natural balances skin and eyes while keeping texture, and magazine is a stronger editorial finish. Start with natural.' },
      { question: 'Can I use the result for an ID document?', answer: 'No. Do not use generative retouching for identity verification, passports, legal records or biometric decisions.' },
    ],
    related: [
      { path: '/virtual-makeup', label: 'Virtual Makeup' },
      { path: '/ai-headshot', label: 'AI Headshot Enhancer' },
      { path: '/image-quality-enhancer', label: 'Image Quality Enhancer' },
    ],
    demo: {
      before: '/examples/portrait-source.jpg', after: '/examples/retouch-after.jpg',
      beforeLabel: 'Portrait source', afterLabel: 'Retouched portrait',
      caption: 'Illustrative preview: compare eyes, skin texture, jawline and expression with the portrait source before sharing.',
      aspectRatio: 0.75,
    },
  },
  {
    path: '/virtual-makeup',
    locale: 'en',
    slug: 'virtual-makeup',
    dashboardTool: 'makeup',
    language: 'en-US',
    title: 'Virtual Makeup Try-On Online — Compare Six AI Looks',
    description: 'Try virtual makeup online with six named looks and three intensity levels. Compare foundation, eyes, brows and lips while keeping the portrait expression and face shape in view.',
    eyebrow: 'AI image tool',
    heading: 'Virtual Makeup Try-On',
    intro: 'Preview a makeup direction on a portrait before you recreate it. Choose a named look and intensity so the comparison is repeatable instead of relying on an unstructured prompt.',
    cta: 'Open virtual makeup',
    ctaNote: 'One portrait · six looks · three intensities · about a minute · 1 credit',
    resultLabel: 'Makeup preview',
    originalLabel: 'Portrait source',
    prompt: '',
    useCases: ['Makeup moodboards', 'Creator content planning', 'Bridal look drafts', 'Colour and intensity comparisons'],
    keywords: ['virtual makeup try on online', 'ai makeup filter', 'makeup look generator', 'virtual makeup artist ai', 'try makeup on photo'],
    whenToUse: 'Use a well-lit portrait with the eyes, brows and lips visible. The preview helps compare colour and intensity; it cannot predict exact products, skin response or how makeup will look in person.',
    sharedNote: 'Choose a look and intensity, with an optional makeup reference image. Review the face, expression, skin texture and colour balance against the source.',
    disclaimer: 'AI makeup previews are visual references, not cosmetic, medical or allergy advice. Confirm products and skin compatibility separately.',
    stepsHeading: 'How to preview a makeup look',
    steps: [
      { name: 'Upload a portrait', text: 'Choose a clear, well-lit portrait where the eyes, brows and lips are visible. An optional makeup reference can guide the palette.' },
      { name: 'Choose look and intensity', text: 'Pick everyday, Korean dewy, glam, bridal, latte or retro, then choose subtle, clearly visible or editorial intensity.' },
      { name: 'Compare the details', text: 'Inspect the eyes, brows, lips, skin texture and expression against the original before saving the preview.' },
    ],
    checks: ['Compare eye, brow and lip colour with the source portrait.', 'Check that expression, face shape and skin texture remain believable.', 'Treat the result as a colour reference, not a promise of a physical match.'],
    featureList: ['Six named makeup looks', 'Three intensity levels', 'Optional makeup reference image'],
    faqs: [
      { question: 'Which makeup looks are available?', answer: 'The studio includes soft everyday, Korean dewy, full glam evening, bridal, warm latte and retro looks, each with subtle, clearly visible and editorial intensity.' },
      { question: 'Can the result tell me which product to buy?', answer: 'No. It is a visual reference for colour and placement. It does not identify a product, guarantee a shade match or provide allergy or skin-care advice.' },
      { question: 'Will the face stay the same?', answer: 'The workflow asks the model to preserve face shape and expression, but generated details can drift. Review the eyes, lips, brows and skin texture before sharing.' },
    ],
    related: [
      { path: '/portrait-retouch', label: 'Portrait Retouch' },
      { path: '/virtual-try-on', label: 'Virtual Try-On' },
      { path: '/ai-headshot', label: 'AI Headshot Enhancer' },
    ],
    demo: {
      before: '/examples/portrait-source.jpg', after: '/examples/makeup-after.jpg',
      beforeLabel: 'Portrait source', afterLabel: 'Makeup preview',
      caption: 'Illustrative preview: compare makeup colour and intensity while checking expression, face shape and skin texture.',
      aspectRatio: 0.75,
    },
  },
];

export const TOOL_LANDING_BY_PATH = Object.fromEntries(TOOL_LANDINGS.map(tool => [tool.path, tool])) as Record<string, ToolLanding>;

export const TOOL_BASE_URL = SITE_URL;

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
  // Tools other than the enhancer bring their own steps; the enhancer's are shared by its three pages.
  if (tool.steps) return tool.steps;
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

export type ToolLongForm = {
  definition: string;
  workflow: string;
  inputs: string;
  fit: string;
  limits: string;
  cost: string;
  review: string;
};

/**
 * Search visitors need more than a title, a slider and a FAQ. These paragraphs are deliberately
 * generated from each tool's own contract so the static page and the hydrated React page describe
 * the same workflow without creating a second content source in the prerender script.
 */
export function toolLongForm(tool: ToolLanding): ToolLongForm {
  const mode = tool.dashboardTool;
  const modeCopy: Record<ToolLanding['dashboardTool'], { verb: string; noun: string; risk: string }> = {
    upscale: { verb: 'enlarge', noun: 'image upscaling', risk: 'large edges, repeated geometry and output dimensions' },
    enhance: { verb: 'improve', noun: 'image quality enhancement', risk: 'faces, labels, text and uncertain texture' },
    unblur: { verb: 'clean up', noun: 'soft-image enhancement', risk: 'halos, face identity and unreadable details' },
    cutout: { verb: 'remove the background from', noun: 'subject cutout', risk: 'hair, transparent edges and small objects' },
    vectorize: { verb: 'trace', noun: 'raster-to-vector conversion', risk: 'tiny marks, open paths and colour boundaries' },
    erase: { verb: 'remove an object from', noun: 'object erasing', risk: 'the rebuilt background and any nearby text' },
    tryon: { verb: 'preview clothing on', noun: 'virtual try-on', risk: 'garment boundaries, pose and face identity' },
    interior: { verb: 'visualize an interior from', noun: 'interior render generation', risk: 'walls, windows, perspective and furniture scale' },
    retouch: { verb: 'refine', noun: 'portrait retouching', risk: 'skin texture, face shape and expression' },
    makeup: { verb: 'preview makeup on', noun: 'virtual makeup', risk: 'face shape, expression and colour spill' },
  };
  const copy = modeCopy[mode];
  const targets = tool.useCases.join(', ');
  return {
    definition: `${tool.heading} is a browser-based ${copy.noun} workflow for people who already have a source image and need a controlled visual change. It uses a task-specific instruction rather than a blank prompt, so the requested output starts from the existing composition, subject or material. The page's before-and-after example is an illustrative reference; the result from your own file depends on its resolution, lighting, crop and visible detail.`,
    workflow: `The workflow has three decisions. First, choose the largest original file instead of a screenshot or a second-generation social download. Next, confirm what is allowed to change and what must remain anchored: the task prompt is written for ${copy.noun}, while the page shows the applicable input and output limits before submission. Finally, compare the source and result at 100 percent and download only after the information-sensitive areas pass your review. This order matters because a plausible AI result can look polished while still changing a face, label, edge or background.`,
    inputs: `Use a clear JPG, PNG or WebP with enough pixels for the details you care about. For this page, the published intake note is: ${tool.ctaNote}. A clean input gives the model stronger evidence about edges, colour and texture. If the source is already heavily compressed, crop it tightly or find the original before spending a credit. Keep the source file beside the output; the service is an enhancement estimate, not a reversible edit history.`,
    fit: `This workflow is a good fit for ${targets}. It is especially useful when the subject is already recognizable and the job is to ${copy.verb} it while preserving the scene's main structure. It is less useful when the source has no recoverable detail, when the requested change is an exact measurement, or when the output will be used as an official record. In those cases, use the original capture, a design or editing application, or the receiving authority's own specification.`,
    limits: `${tool.whenToUse ?? `AI can change uncertain details, so ${copy.risk} need a deliberate check.`} ${tool.disclaimer ?? 'Do not treat a generated result as pixel-exact recovery. If a detail cannot be verified against the original, keep the original or run another source through the workflow.'} The service cannot guarantee that a small character, logo, number, face or repeated pattern will remain unchanged. A larger output also does not create new factual evidence; it creates a more usable visual estimate.`,
    cost: `Your allowance and the task cost are shown before a signed-in job starts. The public example is available for comparison, while processing a personal file uses the displayed credit amount. A failed generation on our side is handled by the account workflow according to the billing policy. Check the output target and the source dimensions first so a task is not spent on a size you cannot use. For batch or API work, compare the per-image cost with storage, retries and your own review time.`,
    review: `Before publishing, compare the result with the original in a fixed order: overall composition, subject identity, long straight edges, small text or labels, repeated texture, colour and shadows. Zooming to 100 percent exposes halos and invented marks that a thumbnail hides. For portraits, check eyes, teeth, hairline and skin texture. For products or architecture, check logos, windows, perspective and material boundaries. For generated edits, check that the requested change is present without unrelated objects or background drift.`,
  };
}

export function toolSchema(tool: ToolLanding) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebApplication', '@id': `${TOOL_BASE_URL}${tool.path}#application`, name: tool.heading,
        url: `${TOOL_BASE_URL}${tool.path}`, applicationCategory: 'MultimediaApplication', operatingSystem: 'Web',
        description: tool.description, inLanguage: tool.locale,
        featureList: tool.featureList ?? [`2× / 4× targets, up to ${ENHANCE_MAX_EDGE} px per edge`, 'JPEG, PNG and WebP input'],
        provider: { '@type': 'Organization', name: 'DLSS5NVIDIA', url: TOOL_BASE_URL },
      },
      { '@type': 'HowTo', name: tool.heading, description: tool.intro, inLanguage: tool.locale,
        step: toolSteps(tool).map(step => ({ '@type': 'HowToStep', ...step })),
      },
      { '@type': 'FAQPage', mainEntity: tool.faqs.map(faq => ({ '@type': 'Question', name: faq.question, acceptedAnswer: { '@type': 'Answer', text: faq.answer } })) },
      { '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'DLSS5NVIDIA', item: `${TOOL_BASE_URL}/` },
        { '@type': 'ListItem', position: 2, name: tool.heading, item: `${TOOL_BASE_URL}${tool.path}` },
      ] },
    ],
  };
}
