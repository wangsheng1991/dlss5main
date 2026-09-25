/**
 * The studio's case book: real input → output pairs, one entry per run that actually happened.
 *
 * The point is not decoration. A visitor (and the team) should be able to see, before spending a
 * credit, what each tool does at which settings and where it stops. So every entry names the exact
 * controls of its run, the geometry the service really returned, the wall clock it really took, and
 * what the reader should look at — plus, where a reader would otherwise over-read the result, the
 * limit it does not prove.
 *
 * The numbers are measurements, not round numbers: `seconds` is the wall clock of that run on the
 * shared GPU, and `output.width/height` is the size the service produced. They are worth keeping
 * honest, because the panel is the one place in the product that promises a result rather than a
 * prompt. Update the entry when a measurement is superseded, and never invent one.
 *
 * The images under `/public/examples` are web-sized copies (a card is a thumbnail, not a download);
 * the real output is the resolution printed on the card. Where the real output is not a raster
 * image at all — the cutout's alpha channel, the vectorizer's SVG — the copy is shown flattened or
 * as a raster twin, and the card says so.
 */

import { TOOL_SUMMARY, type ToolId } from './tools';

export type ShowcaseInput = { src: string; label: string };
export type ShowcaseOutput = {
  /** The file the card shows. */
  src: string;
  label: string;
  /** The geometry the service returned, not the size of this copy. */
  width: number;
  height: number;
  /** The real deliverable when the card cannot show it (an SVG), with the words for the link. */
  file?: string;
  fileLabel?: string;
};
export type ShowcaseCase = {
  id: string;
  mode: ToolId;
  title: string;
  /** The controls as they were set for this run, in the words the panel uses. */
  choices: string[];
  /** The same choices as the values the studio submits, so the card can be loaded back into it. */
  options?: Record<string, string>;
  /** Interior only: the free-text brief that was folded into the server-side prompt. */
  extra?: string;
  /** Erase only: the instruction that was submitted. */
  prompt?: string;
  inputs: ShowcaseInput[];
  output: ShowcaseOutput;
  /** Measured wall clock of the run, rounded. */
  seconds: string;
  /** What to look at in the output — the reason this case is in the book. */
  look: string[];
  /** What the case does not prove, when a reader would otherwise over-read it. */
  limit?: string;
  measured: string;
};

/** The line every card sits under: copies are copies, and a case is one run, not a guarantee. */
export const SHOWCASE_NOTE =
  'Each card is one real run at the settings it names. The pictures are web-size copies; the real output is the resolution printed on the card, and a different photo of the same kind can come out better or worse.';

export const SHOWCASE: ShowcaseCase[] = [
  {
    id: 'tryon-top',
    mode: 'tryon',
    title: 'A product shot put onto a person',
    choices: ['Garment: a top', 'References: person, then garment'],
    options: { garment_type: 'top' },
    inputs: [
      { src: '/examples/tryon-person.jpg', label: 'Person photo' },
      { src: '/examples/tryon-garment.jpg', label: 'Garment product shot' },
    ],
    output: { src: '/examples/tryon-after.jpg', label: 'Wearing the jacket', width: 768, height: 1024 },
    seconds: '58 s',
    look: [
      'The rust colour, the ribbed cuffs and the zip come from the garment photo, not from the person photo.',
      'Face, hair, pose and the plain studio background are the ones in the person photo.',
      'The trousers the person already wore are untouched — a top replaces a top.',
    ],
    limit: 'One garment per run. The reference is read as a single piece, so a top and a bottom need two runs.',
    measured: '2026-09-25',
  },
  {
    id: 'interior-nordic',
    mode: 'interior',
    title: 'An empty room rendered in a Nordic style',
    choices: ['Style: Nordic / Scandinavian', 'Room: living room', 'Brief: light oak flooring, a linen sofa, a round wooden coffee table, a woven rug, a floor lamp and green plants'],
    options: { style: 'nordic', room_type: 'living_room' },
    extra: 'light oak flooring, a linen sofa, a round wooden coffee table, a woven rug, a floor lamp and green plants',
    inputs: [{ src: '/examples/interior-room.jpg', label: 'Empty room' }],
    output: { src: '/examples/interior-after.jpg', label: 'Finished living room', width: 1152, height: 768 },
    seconds: '58 s',
    look: [
      'The window, the door and the ceiling line sit exactly where the photograph has them.',
      'One-point perspective and the camera height are unchanged.',
      'Furniture is at a believable scale — check it against the door height.',
    ],
    limit: 'Start from the emptiest frame you have: a room that is already furnished comes back redesigned rather than built on.',
    measured: '2026-09-25',
  },
  {
    id: 'interior-japandi-ref',
    mode: 'interior',
    title: 'A style reference photo drives the palette',
    choices: ['Style: Japandi', 'Room: living room', 'Second reference: a style photo'],
    options: { style: 'japandi', room_type: 'living_room' },
    inputs: [
      { src: '/examples/interior-room.jpg', label: 'Empty room' },
      { src: '/examples/interior-style-ref.jpg', label: 'Style reference' },
    ],
    output: { src: '/examples/interior-ref-after.jpg', label: 'Japandi render', width: 1152, height: 768 },
    seconds: '60 s',
    look: [
      'The reference’s muted palette and material mood show up in the render.',
      'Its layout is not copied — the room is still the one in the first photo.',
      'Architecture held once more: same window, same camera, same floor plane.',
    ],
    limit: 'The second image steers palette and materials only; it cannot add a wall or move a window.',
    measured: '2026-09-25',
  },
  {
    id: 'retouch-natural',
    mode: 'retouch',
    title: 'A portrait retouched at the natural level',
    choices: ['Level: natural'],
    options: { level: 'natural' },
    inputs: [{ src: '/examples/portrait-source.jpg', label: 'Portrait' }],
    output: { src: '/examples/retouch-after.jpg', label: 'Retouched', width: 768, height: 1152 },
    seconds: '59 s',
    look: [
      'Skin tone and blotchy texture are evened out while grain and pores stay visible.',
      'Under-eye darkness is reduced and the eyes are defined a little.',
      'Same face, same hair, same jacket, same street behind — nothing reshaped or replaced.',
    ],
    limit: 'Retouching will not slim a face, widen the eyes or change a hairstyle: that is the instruction, not a setting.',
    measured: '2026-09-25',
  },
  {
    id: 'makeup-korean',
    mode: 'makeup',
    title: 'The Korean dewy look, clearly visible',
    choices: ['Look: Korean dewy', 'Intensity: clearly visible (medium)'],
    options: { look: 'korean', intensity: 'medium' },
    inputs: [{ src: '/examples/portrait-source.jpg', label: 'Portrait' }],
    output: { src: '/examples/makeup-after.jpg', label: 'Korean dewy look', width: 768, height: 1152 },
    seconds: '61 s',
    look: [
      'Luminous base, peach blush placed high, a soft brown wing and a gradient coral lip.',
      'Eye shape, jaw and lips are the original ones — makeup is added, not a new face.',
      'Skin still shows texture instead of a flat beauty filter.',
    ],
    limit: 'A look is a fixed recipe, not a brand shade: use it to compare directions, not to promise a product match.',
    measured: '2026-09-25',
  },
  {
    id: 'makeup-glam-ref',
    mode: 'makeup',
    title: 'A makeup reference translated onto a face',
    choices: ['Look: full glam evening', 'Intensity: editorial (strong)', 'Second reference: a makeup photo'],
    options: { look: 'glam', intensity: 'strong' },
    inputs: [
      { src: '/examples/portrait-source.jpg', label: 'Portrait' },
      { src: '/examples/makeup-ref-source.jpg', label: 'Makeup reference' },
    ],
    output: { src: '/examples/makeup-ref-after.jpg', label: 'Reference look applied', width: 1024, height: 1024 },
    seconds: '62 s',
    look: [
      'The reference’s palette and placement — strong contour, smoky brown eye, winged liner, matte red lip — are matched onto this face.',
      'The face underneath is still the portrait’s own: same expression, hair and framing.',
      'This run asked for a square frame, so the output is 1024 × 1024 rather than the photo’s shape.',
    ],
    limit: 'Colour is matched to this person’s undertone and the original lighting, so the same reference gives a different result on another photo.',
    measured: '2026-09-25',
  },
  {
    id: 'cutout-teapot',
    mode: 'cutout',
    title: 'Background removed, pixel size kept',
    choices: ['No controls — the instruction is fixed'],
    inputs: [{ src: '/examples/cutout-teapot.jpg', label: 'Photo' }],
    output: { src: '/examples/cutout-teapot-after.jpg', label: 'Cutout (transparency shown on white)', width: 1024, height: 1024 },
    seconds: '2 s',
    look: [
      'The teapot keeps its original 1024 × 1024 pixels — the cut is the same size as the input.',
      'The real file is a PNG with an alpha channel; this card shows it flattened onto white.',
      'Nothing behind the subject was redrawn: what is left is transparency, not a new background.',
    ],
    limit: 'Loose hair, glass and motion blur keep some background, and a see-through subject cannot be cut cleanly.',
    measured: '2026-09-25',
  },
  {
    id: 'vectorize-badge',
    mode: 'vectorize',
    title: 'A badge traced into real vector paths',
    choices: ['Preset: Logo / icon', 'Long edge: 1024 px'],
    inputs: [{ src: '/examples/vectorize-badge.png', label: 'Bitmap badge (78 KB PNG)' }],
    output: {
      src: '/examples/vectorize-badge-after.png',
      label: 'Traced SVG (shown as a raster copy)',
      width: 1024,
      height: 1024,
      file: '/examples/vectorize-badge-after.svg',
      fileLabel: 'Open the SVG · 24 KB of paths',
    },
    seconds: '0.4 s',
    look: [
      'Every shape is a path now, so the file scales to any print size without blurring.',
      'The palette and the lettering survive the trace at the 1024 px edge.',
      'The SVG declares its own size — 1024 × 1024 here.',
    ],
    limit: 'Do not vectorise a photograph expecting a copy: it is limited to 16 colours first and comes back posterised.',
    measured: '2026-09-25',
  },
  {
    id: 'erase-spoon',
    mode: 'erase',
    title: 'An object erased and the surface rebuilt',
    choices: ['Instruction: remove the spoon and rebuild the table behind it'],
    prompt: 'Remove the spoon from the table and rebuild the wooden surface behind it; keep the mug, the napkin and the lighting exactly as they are.',
    inputs: [{ src: '/examples/erase-spoon.jpg', label: 'Photo' }],
    output: { src: '/examples/erase-spoon-after.jpg', label: 'Spoon gone', width: 1024, height: 1024 },
    seconds: '60 s',
    look: [
      'The wooden surface is rebuilt where the spoon lay, with no visible patch or seam.',
      'The mug and the napkin stay put and keep their shadows.',
      'Light direction and colour still match the original frame.',
    ],
    limit: 'The whole frame is re-rendered at 1024 × 1024, so fine text elsewhere can drift and a larger original comes back at that size.',
    measured: '2026-09-25',
  },
];

/** The cases of one tool, in the order the panel shows them. */
export const casesForTool = (mode: string): ShowcaseCase[] => SHOWCASE.filter(entry => entry.mode === mode);

/** The tools that have a case, in the order the case book introduces them. */
export const SHOWCASE_TOOLS: ToolId[] = [...new Set(SHOWCASE.map(entry => entry.mode))];

/** The tool's cases, plus the label its chip carries. */
export const showcaseTools = (): Array<{ id: ToolId; label: string; count: number }> =>
  SHOWCASE_TOOLS.map(tool => ({ id: tool, label: TOOL_SUMMARY[tool].short, count: casesForTool(tool).length }));
