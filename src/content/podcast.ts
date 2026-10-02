export interface PodcastChapter {
  start: string;
  title: string;
}

export interface PodcastSource {
  label: string;
  url: string;
}

export interface PodcastEpisode {
  slug: string;
  title: string;
  description: string;
  published: string;
  duration: string;
  cover: string;
  coverAlt: string;
  keywords: string[];
  chapters: PodcastChapter[];
  transcript: string[];
  sources: PodcastSource[];
  ctaLabel: string;
  ctaPath: string;
  audioSrc?: string;
}

/**
 * Editorial podcast scripts are kept as crawlable text first. Audio files can be attached later by
 * adding an audioSrc without changing the URLs, titles, transcripts or structured data contract.
 */
export const PODCAST_EPISODES: PodcastEpisode[] = [
  {
    slug: 'gpt-6-astra-vs-claude-opus-5-5-dlss-5-style-prompts',
    title: 'GPT-6 Astra vs Claude Opus 5.5 for DLSS 5 Style Prompts',
    description: 'A practical comparison of GPT-6 Astra and Claude Opus 5.5 for turning a game frame into a controlled DLSS 5-style visual conversion brief.',
    published: '2026-10-02',
    duration: 'PT11M',
    cover: '/blog/gpt6-dlss5-workflow.png',
    coverAlt: 'A reasoning model workflow connected to a DLSS 5-style visual conversion reference',
    keywords: ['gpt-6 astra dlss 5', 'claude opus 5.5 image prompts', 'dlss 5 style converter', 'game character style conversion'],
    chapters: [
      { start: '00:00', title: 'What the comparison is actually testing' },
      { start: '02:10', title: 'Prompt structure: constraints before adjectives' },
      { start: '05:25', title: 'Identity, pose and material checks' },
      { start: '08:20', title: 'Where the browser converter fits' },
      { start: '10:15', title: 'A repeatable review checklist' },
    ],
    transcript: [
      'Today we are comparing two current model families as prompt and workflow assistants, not as replacement renderers. OpenAI lists GPT-6 Astra as its flagship model for demanding reasoning and coding, while Anthropic presents Claude Opus 5.5 as a high-capability model for long-running work. Their product pages change over time, so this episode is dated and links to the official model pages rather than treating a model name as a permanent benchmark.',
      'The useful question for a DLSS 5-style conversion is not which model writes the most cinematic adjectives. It is which model turns a visual goal into constraints that can be checked after generation. A good brief starts with what must stay stable: camera angle, silhouette, pose, costume landmarks, face identity and object count. Only then does it describe the change: warmer rim light, wet asphalt, brushed metal, neon bounce or a different palette. This order gives the image model fewer ways to quietly redesign the subject.',
      'For the same game frame, ask both assistants for three outputs: a short production prompt, a negative constraint list and a review checklist. The checklist should mention eyes, hands, logos, weapon geometry, cloth seams and background lines. It should also say what the conversion is allowed to change. This makes the before-and-after slider a useful review instrument instead of a decoration. We do not publish a vendor score here because a single generated image cannot establish a model ranking.',
      'The browser workflow then handles the part that should be visible to the user: upload the frame, select the character-style path, run a cached example or submit the user image, compare the input and reference, and download only after inspection. The site is an independent DLSS 5-style effect converter; it does not claim to run the official NVIDIA DLSS runtime. The prompt assistant and the image converter are separate roles, and keeping them separate makes mistakes easier to find.',
      'The final takeaway is simple. Use GPT-6 Astra or Claude Opus 5.5 to structure the brief, then judge the pixels yourself. Preserve identity and geometry as explicit constraints, show the prompt beside the comparison, and record the model name and date. That is more useful for a production team than declaring a winner from one attractive frame.',
    ],
    sources: [
      { label: 'OpenAI API model directory', url: 'https://developers.openai.com/api/docs/models' },
      { label: 'Anthropic Claude Opus models', url: 'https://www.anthropic.com/claude/opus' },
      { label: 'DLSS 5-style game character workflow', url: '/game-character-style' },
    ],
    ctaLabel: 'Try the character style converter',
    ctaPath: '/dashboard?tool=game-character-style&sample=characterStyle',
  },
  {
    slug: 'gpt-6-dlss-5-convert-game-frame-workflow',
    title: 'GPT-6 + DLSS 5 Convert: From Game Frame to Style Reference',
    description: 'A step-by-step workflow for using a reasoning model to plan a DLSS 5-style conversion while keeping the actual image result reviewable.',
    published: '2026-10-02',
    duration: 'PT9M',
    cover: '/examples/generated/game-cyber-1-after.jpg',
    coverAlt: 'Cyberpunk game character style conversion reference with preserved silhouette',
    keywords: ['gpt-6 dlss 5 convert', 'dlss 5 convert workflow', 'game frame style conversion', 'ai image generator workflow'],
    chapters: [
      { start: '00:00', title: 'The convert-first mental model' },
      { start: '01:40', title: 'Extracting visual constraints' },
      { start: '04:05', title: 'Writing a prompt that does not overreach' },
      { start: '06:10', title: 'Comparing the original and converted reference' },
      { start: '08:00', title: 'When to upscale after conversion' },
    ],
    transcript: [
      'A game frame contains more than a subject and a background. It contains camera position, silhouette, costume shapes, readable props, light direction and a set of relationships that viewers recognize immediately. A convert-first workflow starts by naming those relationships. It does not begin with “make it photorealistic” and hope the generator guesses what matters.',
      'Use GPT-6 as a planning layer: describe the frame, ask for stable anchors, then ask for one visual direction at a time. For example, “keep the character three-quarter view, preserve the shoulder armor outline and the orange scarf, change only the lighting to cool moonlight with a warm shop-window bounce.” The resulting prompt is intentionally narrower than a marketing slogan. Narrow prompts make before-and-after review possible.',
      'The converter should expose the original beside the result. Check face identity, hands, silhouette, costume landmarks, weapon edges, text and straight lines. If one of those changes unexpectedly, lower the prompt scope or try another source frame. An attractive output is not automatically a faithful conversion. The point of the workflow is to make the trade-off visible before anyone downloads or publishes the reference.',
      'Only after the style direction is accepted should you run a separate upscale or restoration step. Upscaling can recover apparent edge and texture detail, but it should not be used to hide a changed face or redesigned prop. Keeping convert and upscale as separate actions also lets a user compare cost, latency and visual changes for each stage.',
      'This is the practical role for GPT-6: it can help turn a vague art note into a constrained brief and a review checklist. It does not make the independent browser tool an official NVIDIA implementation, and it does not remove the need for a human to inspect the pixels. The best result is a repeatable handoff between an art direction note, a prompt, a before-and-after slider and a saved reference.',
    ],
    sources: [
      { label: 'OpenAI API model directory', url: 'https://developers.openai.com/api/docs/models' },
      { label: 'DLSS 5 game character cases', url: '/game-character-style' },
      { label: 'Independent DLSS 5-style converter', url: '/' },
    ],
    ctaLabel: 'Open DLSS 5 convert',
    ctaPath: '/dashboard?tool=game-character-style&sample=characterStyle',
  },
  {
    slug: 'claude-sonnet-5-5-character-identity-preservation',
    title: 'Claude Sonnet 5.5 and Character Identity: What to Check After Conversion',
    description: 'A review-led episode about using Claude Sonnet 5.5 to plan identity-sensitive image edits without confusing a prompt assistant with a renderer.',
    published: '2026-10-02',
    duration: 'PT10M',
    cover: '/examples/generated/game-fantasy-1-after.jpg',
    coverAlt: 'Fantasy game character style conversion reference for identity review',
    keywords: ['claude sonnet 5.5 image workflow', 'character identity ai conversion', 'dlss 5 character style', 'ai image review checklist'],
    chapters: [
      { start: '00:00', title: 'Why identity needs explicit checks' },
      { start: '02:00', title: 'Prompting for stable anchors' },
      { start: '04:30', title: 'The face, hands and costume checklist' },
      { start: '07:00', title: 'What a slider reveals that a prompt cannot' },
      { start: '09:05', title: 'A safe download decision' },
    ],
    transcript: [
      'Character style conversion is where a visually impressive result can still fail the brief. A different face shape, missing accessory or changed hand position may be acceptable for exploration, but it is not identity preservation. Claude Sonnet 5.5 is useful here as a planning and critique assistant: ask it to list the visual anchors that must survive, then turn those anchors into a short prompt and a post-run checklist.',
      'The checklist should be concrete. Compare eye spacing, hairline, jaw shape, skin marks, earrings, armor plates, logos, gloves, weapon length and the direction of the torso. Check the negative space around the silhouette as well; a changed shoulder outline can make a familiar character feel like someone else. Ask for one style change at a time so a failed result has a diagnosable cause.',
      'A before-and-after slider is more honest than a single final image. Move the divider slowly over the face, hands, costume seams and background geometry. If the result adds fingers, rewrites a label or changes a prop, keep the original and revise the prompt. Do not describe those changes as “enhancement” just because they look polished. The site presents these outputs as independent visual references, not official DLSS captures.',
      'Sonnet 5.5 can help write an editorial note that explains what changed and what did not. That note belongs beside the image, with the model name, date, prompt and limitations. It gives a designer a useful handoff and gives a search visitor a reason to stay on the page. The strongest SEO asset is not the model name alone; it is the evidence that the workflow can be inspected.',
      'Use the converter for a free cached example before uploading your own frame. When the result passes the identity checklist, download the reference. When it does not, the right action is to keep the original and try a narrower direction, not to pretend the changed details are faithful.',
    ],
    sources: [
      { label: 'Anthropic Claude Sonnet 5 research release', url: 'https://www.anthropic.com/research/claude-sonnet-5' },
      { label: '20 game character before-and-after cases', url: '/game-character-style' },
      { label: 'Free cached style example', url: '/dashboard?tool=game-character-style&sample=characterStyle' },
    ],
    ctaLabel: 'Review a character example',
    ctaPath: '/dashboard?tool=game-character-style&sample=characterStyle',
  },
  {
    slug: 'ai-image-generator-vs-visual-enhancer-vs-converter',
    title: 'AI Image Generator vs Visual Enhancer vs Image Converter',
    description: 'A plain-language guide to the three search intents behind DLSS 5 image generator, visual enhancer and image converter queries.',
    published: '2026-10-02',
    duration: 'PT8M',
    cover: '/blog/dlss5-neural-rendering.png',
    coverAlt: 'Neural rendering reference showing the difference between conversion and enhancement',
    keywords: ['dlss 5 image generator', 'dlss 5 visual enhancer online', 'dlss 5 image converter', 'ai image generator comparison'],
    chapters: [
      { start: '00:00', title: 'Three phrases, three jobs' },
      { start: '01:35', title: 'What an image generator changes' },
      { start: '03:10', title: 'What an enhancer should preserve' },
      { start: '05:10', title: 'Why convert comes before upscale' },
      { start: '07:00', title: 'Choosing the right entry point' },
    ],
    transcript: [
      'Searchers use “image generator,” “visual enhancer” and “image converter” as if they mean the same thing. They do not. An image generator creates a new visual direction from an input and instruction. A visual enhancer aims to improve an existing image while making fewer compositional changes. A converter describes the transition itself: input, selected direction, output and comparison.',
      'For a game frame, the converter is the clearest first step. You can preserve the character silhouette and camera while changing style, lighting or material direction. The result should be shown next to the input, with a prompt and a note that the reference is independent and non-official. That language protects trust and makes the page useful for both a person and a crawler.',
      'Enhancement is a separate decision. If a face, logo or architectural edge already changed during conversion, an upscale pass will not make it faithful again. Inspect the converted reference first, then use an upscale or restoration tool for edges and texture. This separation also makes cost and latency understandable: the user can decide whether the second stage is worth running.',
      'The practical answer to all three search intents is one honest flow: try a cached example without an account, upload your own image after signing in, compare the result, and download only after checking identity, text, geometry and texture. The page should never imply that a browser upload is an official NVIDIA runtime or that a plausible detail was recovered from information the source never contained.',
      'That is why the homepage now names all three jobs but keeps DLSS 5 convert as the primary path. A good SEO page answers the query quickly, then gives the visitor a concrete way to test the claim.',
    ],
    sources: [
      { label: 'DLSS 5 online image upscaler guide', url: '/blog/dlss-5-online-image-upscaler-guide' },
      { label: 'DLSS 5-style converter homepage', url: '/' },
      { label: 'Image quality enhancer workflow', url: '/image-quality-enhancer' },
    ],
    ctaLabel: 'Try the online converter',
    ctaPath: '/dashboard?tool=game-character-style&sample=characterStyle',
  },
  {
    slug: 'gpt-6-claude-dlss-5-evaluation-method',
    title: 'A Fair GPT-6, Claude and DLSS 5 Evaluation Method',
    description: 'How to compare AI-assisted visual workflows with the same source, constraints and review criteria instead of relying on a single impressive screenshot.',
    published: '2026-10-02',
    duration: 'PT12M',
    cover: '/examples/generated/game-anime-4-after.jpg',
    coverAlt: 'Game character conversion reference used for a repeatable evaluation workflow',
    keywords: ['gpt-6 claude dlss 5 comparison', 'ai image workflow evaluation', 'dlss 5 before after test', 'visual conversion benchmark'],
    chapters: [
      { start: '00:00', title: 'Why one screenshot is not a benchmark' },
      { start: '02:30', title: 'Freeze the source and the brief' },
      { start: '05:00', title: 'Score identity, geometry and materials' },
      { start: '08:00', title: 'Record cost, latency and retries' },
      { start: '10:20', title: 'Publish an honest comparison' },
    ],
    transcript: [
      'AI model comparisons often fail before the first prompt is written. One model gets a cinematic input, another gets a compressed frame, and the author declares a winner from two unrelated outputs. A fair DLSS 5-style evaluation freezes the source image, aspect ratio, target direction, constraint list and review criteria before any assistant or converter is used.',
      'The prompt assistant can be GPT-6 Astra, Claude Opus 5.5, Claude Sonnet 5.5 or another model, but the record must show which one, with the date and settings. Ask each model to produce the same fields: stable anchors, permitted changes, negative constraints and review checks. Do not allow an assistant to rewrite the task after seeing the result; that makes the comparison circular.',
      'Score the output in separate categories. Identity covers face, hair, costume marks and pose. Geometry covers straight edges, props, hands and background structure. Material and lighting cover surface response, shadows and palette. Usability covers whether the result can be downloaded, reused and explained. A beautiful image can score well on atmosphere and poorly on identity. That is a useful result, not an embarrassment to hide.',
      'Record operational facts as well: queue wait, generation time, retries, credits consumed and whether a second upscale was needed. These measurements are local to the test and should never be presented as an official NVIDIA benchmark or as a permanent model ranking. Publish the original beside every result, include the prompt, and say when a result was made with a cached example rather than a user upload.',
      'This method gives DLSS5NVIDIA a defensible editorial position. We are not claiming that a browser reference is the official DLSS runtime. We are showing how a person can move from an art brief to a visual conversion, inspect what changed, and make a download decision with evidence. That is the kind of comparison that earns links and repeat visits.',
    ],
    sources: [
      { label: 'OpenAI model directory', url: 'https://developers.openai.com/api/docs/models' },
      { label: 'Anthropic Claude models', url: 'https://www.anthropic.com/claude/opus' },
      { label: 'NVIDIA 3D-Guided Neural Rendering reference', url: 'https://www.nvidia.com/en-us/geforce/news/dlss-5-3d-guided-neural-rendering/' },
    ],
    ctaLabel: 'Run a reviewable example',
    ctaPath: '/dashboard?tool=game-character-style&sample=characterStyle',
  },
];

export const PODCAST_INDEX_DESCRIPTION = 'Source-led podcast scripts about GPT-6, Claude, DLSS 5-style conversion, visual enhancement and reviewable AI image workflows.';
