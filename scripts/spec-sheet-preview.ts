/**
 * Draw a print sheet from the specification table, as SVG.
 *
 * The geometry is asserted in `tests/run.ts`, but a suite can only confirm the numbers it was told
 * to expect — it cannot notice that a sheet looks wrong. This renders the same rectangles the
 * export will draw, at true millimetre scale, so the layout can be looked at before anything is
 * printed. It draws the rule (head height, headroom) rather than a photograph, so it also serves
 * as the reference the renderer has to match.
 *
 * Usage: npx tsx scripts/spec-sheet-preview.ts <spec-id> <sheet-id> <out.svg>
 */

import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { layoutSheet, midpoint } from '../src/lib/spec/geometry';
import { findSpec } from '../src/lib/spec/specs';
import type { SheetId } from '../src/lib/spec/types';

const PAPER = '#ffffff';
const PAPER_EDGE = '#c8c8c8';
const PHOTO = '#e8f0fe';
const PHOTO_EDGE = '#1a56db';
const HEAD = '#93b4fa';
const GUIDE = '#1a56db';
const CUT = '#9aa0a6';
const INK = '#111827';

const [specId, sheetId, outPath] = process.argv.slice(2);
if (!specId || !sheetId || !outPath) {
  console.error('usage: npx tsx scripts/spec-sheet-preview.ts <spec-id> <sheet-id> <out.svg>');
  process.exit(2);
}

const spec = findSpec(specId);
const layout = layoutSheet(spec, sheetId as SheetId);
const { widthMm, heightMm } = layout.sheet;

const headCm = spec.headHeightMm ? midpoint(spec.headHeightMm) : 0;
const headroomMm = spec.headroomMm ? midpoint(spec.headroomMm) : 0;

const parts: string[] = [];
parts.push(`<rect x="0" y="0" width="${widthMm}" height="${heightMm}" fill="${PAPER}" stroke="${PAPER_EDGE}" stroke-width="0.4"/>`);

for (const cell of layout.cells) {
  parts.push(
    `<rect x="${cell.xMm}" y="${cell.yMm}" width="${cell.widthMm}" height="${cell.heightMm}" fill="${PHOTO}" stroke="${PHOTO_EDGE}" stroke-width="0.35"/>`,
  );
  if (headCm > 0) {
    // The head, centred on the midline, its crown one headroom below the top edge — the two rules
    // the crop has to satisfy, drawn where the document asks for them.
    const headWidth = headCm * 0.72;
    const headX = cell.xMm + (cell.widthMm - headWidth) / 2;
    const headY = cell.yMm + headroomMm;
    parts.push(
      `<rect x="${headX}" y="${headY}" width="${headWidth}" height="${headCm}" rx="${headCm * 0.32}" fill="${HEAD}" fill-opacity="0.55" stroke="${GUIDE}" stroke-width="0.25"/>`,
      `<line x1="${cell.xMm}" y1="${headY}" x2="${cell.xMm + cell.widthMm}" y2="${headY}" stroke="${GUIDE}" stroke-width="0.2" stroke-dasharray="1 1"/>`,
      `<line x1="${cell.xMm}" y1="${headY + headCm}" x2="${cell.xMm + cell.widthMm}" y2="${headY + headCm}" stroke="${GUIDE}" stroke-width="0.2" stroke-dasharray="1 1"/>`,
      `<text x="${cell.xMm + cell.widthMm / 2}" y="${cell.yMm + cell.heightMm - 1.2}" font-size="2.4" fill="${GUIDE}" text-anchor="middle">${spec.sizeMm.width}×${spec.sizeMm.height} mm</text>`,
    );
  }
}

for (const mark of layout.cutMarks) {
  parts.push(
    `<line x1="${mark.x1Mm}" y1="${mark.y1Mm}" x2="${mark.x2Mm}" y2="${mark.y2Mm}" stroke="${CUT}" stroke-width="0.2"/>`,
  );
}

const title = `${spec.label} — ${layout.count} × on ${layout.sheet.label} (${layout.columns}×${layout.rows}), head ${headCm} mm, headroom ${headroomMm} mm`;
// The paper sits in a margin of its own so the caption has somewhere to live: a sheet rendered
// edge to edge looks identical to a sheet rendered empty.
const PAD = 12;
const svg = [
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${-PAD} ${-PAD} ${widthMm + 2 * PAD} ${heightMm + 2 * PAD}" width="${(widthMm + 2 * PAD) * 6}" height="${(heightMm + 2 * PAD) * 6}">`,
  `<rect x="${-PAD}" y="${-PAD}" width="${widthMm + 2 * PAD}" height="${heightMm + 2 * PAD}" fill="#f3f4f6"/>`,
  `<rect x="0" y="0" width="${widthMm}" height="${heightMm}" fill="${PAPER}" stroke="${PAPER_EDGE}" stroke-width="0.3"/>`,
  ...parts,
  `<text x="${widthMm / 2}" y="${-4}" font-size="3.2" fill="${INK}" text-anchor="middle" font-family="system-ui, sans-serif">${title}</text>`,
  '</svg>',
].join('\n');

writeFileSync(resolve(outPath), svg);
console.log(`wrote ${resolve(outPath)} — ${layout.count} photos on ${layout.sheet.label}`);
