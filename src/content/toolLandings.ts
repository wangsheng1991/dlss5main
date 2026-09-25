import { ENHANCE_MAX_EDGE } from '../config/enhance';
import { SITE_URL } from '../config/site';

export type ToolLanding = {
  path: string;
  locale: 'en' | 'es';
  slug: string;
  dashboardTool: 'upscale' | 'enhance' | 'unblur' | 'cutout' | 'vectorize' | 'erase'
    | 'virtual-try-on' | 'interior-design' | 'portrait-retouch' | 'virtual-makeup';
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
    dashboardTool: 'virtual-try-on',
    language: 'en-US',
    title: 'AI Virtual Try-On Online — Put a Garment on a Photo',
    description: 'Put a photographed garment on a person with AI. Upload the person and the garment; the result keeps the face, pose, body and background, and reproduces the garment’s colour, fabric and details.',
    eyebrow: 'AI fashion tool',
    heading: 'Virtual Try-On',
    intro: 'Upload two photos — the person, then the garment on its own — and get the same person wearing it. The model reproduces the garment’s colour, fabric, pattern, seams and length, and is asked to leave the face, hairstyle, pose, body proportions and background exactly as they were.',
    cta: 'Put a garment on a photo',
    ctaNote: '2 images · JPG, PNG or WebP up to 10 MiB each · about a minute · 1 credit per task',
    resultLabel: 'Person wearing the garment',
    originalLabel: 'Your person photo',
    prompt: 'Fixed by the server: dress the person in the garment shown in the second image, reproduce its colour, fabric and details exactly, and keep the person’s face, hair, skin tone, pose and background unchanged.',
    useCases: ['Shop listings on a human model without a shoot', 'Lookbooks and outfit previews', 'Marketplace listings for a single garment', 'Checking a purchase against a product photo'],
    keywords: ['ai virtual try on', 'virtual try on online', 'put clothes on a photo', 'ai clothes changer', 'outfit swap photo', 'virtual fitting room'],
    whenToUse: 'Best with a clean, front-facing product shot of the garment and a full-body or three-quarter photo of the person with even light. Layered outfits, heavy shadows across the garment and unusual poses are the hard cases.',
    sharedNote: 'This is a generative edit, so it renders a new image rather than compositing a cutout: the garment is drawn onto the body, and fine details of the original can shift slightly.',
    disclaimer: 'The output is a synthetic photograph and must not be presented as a real photo of that person wearing the product. Check logos, prints, buttons, zips and the garment length against the product photo before publishing.',
    stepsHeading: 'How to put a garment on a photo',
    steps: [
      { name: 'Upload the person', text: 'The first image is the subject: a JPG, PNG or WebP of the person, ideally full body and facing the camera. The output keeps its shape.' },
      { name: 'Upload the garment', text: 'The second image is the garment on its own — a product or flat-lay photo works best. The order matters: person first, garment second.' },
      { name: 'Say what it covers', text: 'Choose a whole outfit, a top, trousers or a skirt, or a dress, then run the task. It takes about a minute and uses 1 credit.' },
    ],
    checks: ['Compare the print, colour and material of the garment with the product photo.', 'Check hands, jewellery, hair and any accessory for drift.', 'Confirm the pose, framing and background match the original photo.'],
    featureList: ['Two-image try-on: person + garment', 'Keeps the face, pose, body and background', 'Garment colour, fabric and details reproduced'],
    faqs: [
      { question: 'What do the two images have to be?', answer: 'The first is the person, ideally standing and facing the camera with even light; the second is the garment on its own, like the product shot from a shop. The order is fixed — the first image is the body, the second is what it wears.' },
      { question: 'Does it keep my face and body?', answer: 'The prompt asks the model to keep the face, hairstyle, skin tone, body shape, pose and background unchanged, and to change only the clothing. Because it re-renders the whole frame, small differences in hair, hands or background detail are possible, so review the result at 100% before you use it.' },
      { question: 'Can it show a whole new outfit?', answer: 'One garment reference is read per task, so pick what that garment covers: a top keeps the trousers or skirt, a dress replaces the whole outfit, and the outfit setting treats the reference as a complete top-and-bottom set. Two separate pieces need two tasks.' },
      { question: 'Is there a size limit on the images I upload?', answer: 'Each file is capped at 10 MiB and must be a JPG, PNG or WebP. There is no pixel ceiling here — the references are scaled down inside the service before the frame is rendered.' },
    ],
    related: [
      { path: '/portrait-retouch', label: 'Portrait Retouch' },
      { path: '/remove-background', label: 'Remove Background' },
    ],
    demo: {
      before: '/examples/tryon-person.jpg', after: '/examples/tryon-after.jpg',
      beforeLabel: 'Your person photo', afterLabel: 'Wearing the garment',
      caption: 'Real output: a rust bomber jacket from a separate product photo, on the same person. The face, hair, pose, body and the studio background are unchanged; the trousers are the ones the person already wore.',
      aspectRatio: 0.75,
    },
  },
  {
    path: '/interior-design',
    locale: 'en',
    slug: 'interior-design',
    dashboardTool: 'interior-design',
    language: 'en-US',
    title: 'AI Interior Design Render — Empty Room to Furnished Photo',
    description: 'Turn a photo of an empty or unfinished room into a photorealistic interior render. Pick a style and room, and the walls, windows, doors and camera angle stay identical.',
    eyebrow: 'AI interior tool',
    heading: 'Interior Design Render',
    intro: 'Photograph a bare room — new build, shell, or simply empty — and see it finished. The render keeps the architecture exactly where it is: same walls, window position and size, doors, ceiling, floor level and camera angle, with furniture and finishes placed inside them.',
    cta: 'Render an empty room',
    ctaNote: '1–2 images · JPG, PNG or WebP up to 10 MiB each · about a minute · 1 credit per task',
    resultLabel: 'Finished interior render',
    originalLabel: 'Your empty room',
    prompt: 'Fixed by the server: finish this exact room in the chosen style and room type, keep every wall, window, door, opening, beam and the camera position identical, and furnish it at realistic scale with correct perspective and contact shadows.',
    useCases: ['Empty or unfinished rooms before a viewing', 'Client previews for a renovation', 'Property listings that need a furnished frame', 'Comparing finishes before buying furniture'],
    keywords: ['ai interior design', 'interior design render', 'empty room to furnished', 'virtual room design', 'interior visualisation online', 'ai room renderer'],
    whenToUse: 'Built for the before-and-after of a renovation: a shell, an empty flat, or a room photographed for a listing. A room that is already furnished comes back redesigned rather than built on top of what is there, so start from the emptiest frame you have.',
    sharedNote: 'The two extra controls are a fixed recipe, not free text: six styles and eight room types. The one free-text line is capped at 120 characters so it cannot override the parts of the instruction that hold the room in place.',
    disclaimer: 'This is a visualisation, not a measured plan. A render can move a socket, assume a floor covering or invent furniture proportions that do not match your building — use it to agree on a direction, not as a construction drawing.',
    stepsHeading: 'How to render an empty room',
    steps: [
      { name: 'Photograph the room', text: 'Stand in a corner and use one-point perspective: camera level, both side walls visible, the window and the doors in frame. A phone photo is fine.' },
      { name: 'Pick the style and the room', text: 'Choose one of six styles and the room type, and optionally add a style reference photo or a short line about materials.' },
      { name: 'Compare with the photo', text: 'Put the render beside the original and check the window, the doors, the ceiling line and the camera angle, then download the PNG.' },
    ],
    checks: ['Check that every window and door is in the same place and the same size.', 'Check the ceiling line, the floor plane and the perspective against the photo.', 'Check the scale of the furniture against the door height.'],
    featureList: ['Empty or unfinished room to a rendered interior', 'Architecture and camera angle preserved', 'Six styles, eight room types, optional style reference'],
    faqs: [
      { question: 'Will it keep my walls, windows and doors?', answer: 'The instruction holds the architecture fixed: walls, ceiling, floor plane and level, window position and size, doors, openings, columns and beams, plus the camera position, height, angle and perspective. It is a generative render, so compare the result against the photo before you rely on a detail.' },
      { question: 'Can I influence the furniture and materials?', answer: 'Yes, in three fixed ways: the style chooses a recipe of materials, furniture and lighting; the room type decides what is furnished; and the optional short brief lets you name a few things you want to see. A long paragraph would fight the instruction that keeps the room in place, so it is capped at 120 characters.' },
      { question: 'What is the second image for?', answer: 'It is an optional style reference — a room, a palette or a material board you like. The render follows its palette, materials and mood but fits them into your room rather than copying its layout.' },
      { question: 'Can I use the render in a listing or a client document?', answer: 'Yes, with a note that it is an AI visualisation. Many portals require that for a rendered interior, and it also protects you if a detail of the render does not match the real room.' },
    ],
    related: [
      { path: '/erase-object', label: 'Erase Object' },
      { path: '/image-upscaler', label: 'AI Image Upscaler' },
    ],
    demo: {
      before: '/examples/interior-room.jpg', after: '/examples/interior-after.jpg',
      beforeLabel: 'Empty, unfinished room', afterLabel: 'Nordic render (living room)',
      caption: 'Real output: a bare room with its work light and chair in frame, rendered as a finished Nordic living room. The window, both doors, the ceiling and the camera position are the same in both frames.',
      aspectRatio: 1.5,
    },
  },
  {
    path: '/portrait-retouch',
    locale: 'en',
    slug: 'portrait-retouch',
    dashboardTool: 'portrait-retouch',
    language: 'en-US',
    title: 'AI Portrait Retouching Online — Natural Skin, Same Face',
    description: 'Retouch a portrait online with AI: even skin and texture, fewer blemishes, brighter eyes — while the identity, face shape, expression and clothing stay untouched.',
    eyebrow: 'AI portrait tool',
    heading: 'Portrait Retouch',
    intro: 'Clean up a portrait the way a retoucher would, without turning it into a different person. Three levels, one instruction: the face, its shape, the expression, the hairstyle, the clothing and the lighting are asked to stay exactly as they are.',
    cta: 'Retouch a portrait',
    ctaNote: '1 portrait · JPG, PNG or WebP up to 10 MiB · about a minute · 1 credit per task',
    resultLabel: 'Retouched portrait',
    originalLabel: 'Your portrait',
    prompt: 'Fixed by the server: retouch the portrait at the chosen level — even skin tone and texture, remove temporary blemishes, clear the under-eye area, define the eyes and tidy stray hairs — while keeping the identity, face shape, expression, hair and clothing unchanged.',
    useCases: ['Profile and team photos', 'Client portraits and headshots', 'Event and wedding galleries', 'Product photos with a model’s face'],
    keywords: ['ai portrait retouching', 'retouch portrait online', 'skin retouching ai', 'photo retoucher online', 'natural portrait retouch', 'blemish removal ai'],
    whenToUse: 'Best on a sharp, evenly lit portrait where the face is clearly visible. It removes temporary blemishes and unevenness — it is not intended for deep skin correction, and it will not reshape a face or a body, by design.',
    sharedNote: 'Skin grain is kept on purpose: the instruction asks for evenness, not for the plastic surface that over-smoothing produces. Compare the result at 100% to see the difference.',
    disclaimer: 'Retouching changes how a person appears in a photograph. Keep the original file, and get consent before publishing an altered portrait of someone else — beauty, medical and dating contexts have their own rules about retouched images.',
    stepsHeading: 'How to retouch a portrait',
    steps: [
      { name: 'Upload one portrait', text: 'One image per task: a JPG, PNG or WebP up to 10 MiB. A front-facing portrait with even light retouches most predictably.' },
      { name: 'Choose a level', text: 'Light corrects only obvious temporary blemishes. Natural evens the skin tone and brightens the eyes. Magazine is the fully polished level.' },
      { name: 'Compare at 100%', text: 'Check the jawline, the hairline, the eyes and the skin texture against the original, then download the PNG.' },
    ],
    checks: ['Compare the jawline, nose and eyes with the original for any reshaping.', 'Look at the skin at 100% — even tone, still visible grain.', 'Check stray hairs, glasses and jewellery for artefacts.'],
    featureList: ['Three retouching levels', 'Identity, expression and clothing preserved', 'Skin grain kept instead of smoothed away'],
    faqs: [
      { question: 'Will it change my face?', answer: 'The instruction forbids it: no change to identity, facial features, face shape or bone structure, and no slimming, widening or reshaping of the face, nose, jaw, chin, eyes or body. Because a generative model renders the result, always compare the output with the original before publishing.' },
      { question: 'What is the difference between the three levels?', answer: 'Light corrects only obvious temporary blemishes and slight unevenness. Natural evens the skin tone and texture, softens under-eye shadows, reduces redness and shine, defines the eyes and eyelashes and tidies stray hairs. Magazine refines the skin further, clears blemishes and scars, and improves clarity and colour balance — it is noticeably stronger, so compare it first.' },
      { question: 'Can it add makeup or change my hair colour?', answer: 'No. Retouching here is limited to skin, eyes and stray hair without changing the hairstyle or its colour; for makeup there is the separate virtual makeup tool, which applies a named look to the same face.' },
      { question: 'Is there a limit on the portrait I upload?', answer: 'One file per task, JPG, PNG or WebP, up to 10 MiB. No pixel ceiling: the reference is scaled down inside the service before the frame is re-rendered.' },
    ],
    related: [
      { path: '/virtual-makeup', label: 'Virtual Makeup' },
      { path: '/ai-headshot', label: 'AI Headshot Enhancer' },
      { path: '/image-quality-enhancer', label: 'Image Quality Enhancer' },
    ],
    demo: {
      before: '/examples/portrait-source.jpg', after: '/examples/retouch-after.jpg',
      beforeLabel: 'Original portrait', afterLabel: 'Retouched at the natural level',
      caption: 'Real output at the natural level: even skin tone and texture, cleaner under-eye area, defined eyes — the same face, hair, clothing and street background, with skin grain still visible.',
      aspectRatio: 0.667,
    },
  },
  {
    path: '/virtual-makeup',
    locale: 'en',
    slug: 'virtual-makeup',
    dashboardTool: 'virtual-makeup',
    language: 'en-US',
    title: 'Virtual Makeup Online — Try a Makeup Look on a Photo',
    description: 'Apply a makeup look to a photo with AI. Choose a look and an intensity; the makeup is added to your own face, with the identity, expression, hair and lighting unchanged.',
    eyebrow: 'AI beauty tool',
    heading: 'Virtual Makeup',
    intro: 'See a makeup look on your own face before you commit to it. Six looks, three intensities, one instruction: only makeup is added — the face, its shape, the eye shape and colour, the expression, the hair, the clothing and the background stay as they are.',
    cta: 'Try a makeup look',
    ctaNote: '1–2 images · JPG, PNG or WebP up to 10 MiB each · about a minute · 1 credit per task',
    resultLabel: 'Portrait with makeup',
    originalLabel: 'Your portrait',
    prompt: 'Fixed by the server: apply the chosen makeup look at the chosen intensity — base, contour, blush, brows, eyeshadow, liner, lashes and lip — and keep the identity, features, expression, hairstyle, clothing, framing and lighting unchanged.',
    useCases: ['Choosing a look before an event', 'Bridal and party previews', 'Beauty content and look boards', 'A reference photo translated onto your own face'],
    keywords: ['virtual makeup', 'try makeup online', 'ai makeup try on', 'virtual makeup simulator', 'apply makeup to photo', 'makeup look preview'],
    whenToUse: 'Best on a front-facing portrait with even light and clean skin. The tool adds makeup, so it does not replace retouching — run the retouch first if the photo needs cleaning up, then try the look on the result.',
    sharedNote: 'Each look is a fixed recipe — base, contour, blush, brows, eyeshadow, eyeliner, lashes and lip — and the intensity decides how visible it is. The optional second image is a makeup reference: its palette, finish and placement are matched onto your face.',
    disclaimer: 'A virtual look is an estimate: real product colours depend on skin undertone, lighting, finish and how the product is applied. Use it to compare directions, not to promise an exact brand shade.',
    stepsHeading: 'How to try makeup on a photo',
    steps: [
      { name: 'Upload one portrait', text: 'One image: a JPG, PNG or WebP up to 10 MiB, face clearly visible and evenly lit.' },
      { name: 'Pick a look and an intensity', text: 'Soft everyday, Korean dewy, full glam, bridal, warm latte or retro — then subtle, clearly visible or editorial.' },
      { name: 'Add a reference if you have one', text: 'A second image is optional: a makeup photo whose palette and finish should be matched onto your face.' },
    ],
    checks: ['Compare the eye shape, lips and jawline with the original for reshaping.', 'Check that skin still shows texture instead of a flat filter.', 'Check that the hair, clothing and background are unchanged.'],
    featureList: ['Six makeup looks, three intensities', 'Makeup added to your own face, identity kept', 'Optional makeup reference image'],
    faqs: [
      { question: 'Does it change the face?', answer: 'No. The instruction adds makeup and forbids everything else: identity, facial features, face shape, eye shape and colour, nose, jaw, chin, expression, gaze, hairstyle, hair colour, clothing, pose, framing, crop, background and the original lighting all stay. As with any generative tool, compare the result with the original.' },
      { question: 'Which looks are available?', answer: 'Six: soft everyday, Korean dewy, full glam evening, bridal, warm latte and retro. Each one is a fixed recipe of base, contour, blush, brows, eyeshadow, eyeliner, lashes and lip, so the same look gives a comparable result on different photos.' },
      { question: 'What can I do with the second image?', answer: 'It is an optional makeup reference. The model matches its colour palette, finish and placement of the makeup onto your face — useful when you have a photo of the look you want rather than just a name for it.' },
      { question: 'Is there a limit on the image I upload?', answer: 'Each file is capped at 10 MiB and must be JPG, PNG or WebP. There is no pixel ceiling; references are scaled down inside the service before rendering.' },
    ],
    related: [
      { path: '/portrait-retouch', label: 'Portrait Retouch' },
      { path: '/ai-headshot', label: 'AI Headshot Enhancer' },
    ],
    demo: {
      before: '/examples/portrait-source.jpg', after: '/examples/makeup-after.jpg',
      beforeLabel: 'Original portrait', afterLabel: 'Korean dewy look, clearly visible',
      caption: 'Real output: the Korean dewy look at a clearly visible intensity — luminous base, peach blush, soft brown wing and a gradient coral lip, on the same face, hair, clothing and background.',
      aspectRatio: 0.667,
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
    ],
  };
}
