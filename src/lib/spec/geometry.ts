/**
 * The arithmetic behind a compliant photo, separated from anything that draws.
 *
 * Nothing here touches a canvas, the DOM or the network: it turns a specification and a head
 * position into rectangles. That is deliberate — a rectangle can be asserted in a test, pixels
 * cannot, and the whole reason this category is worth building is that "did we get it right?" has
 * an answer. The renderer in the dashboard is then a thin adapter that paints these rectangles.
 */

import type { PhotoSpec, Range, SheetId } from './types';

export const MM_PER_INCH = 25.4;

export type Size = { width: number; height: number };

/** Millimetres to whole pixels at a resolution. Half rounds up, because paper is measured. */
export function mmToPx(mm: number, dpi: number): number {
  if (!Number.isFinite(mm) || mm <= 0) throw new Error(`a length must be a positive number of millimetres, got ${mm}`);
  if (!Number.isFinite(dpi) || dpi <= 0) throw new Error(`a resolution must be a positive number of dpi, got ${dpi}`);
  return Math.round((mm / MM_PER_INCH) * dpi);
}

/** The middle of a range — the value to use when a document states bounds instead of a figure. */
export function midpoint(range: Range): number {
  return (range.min + range.max) / 2;
}

/** The pixels a printed size is worth at a resolution. This is what the exported file must be. */
export function specPixels(spec: PhotoSpec, dpi: number): Size {
  return { width: mmToPx(spec.sizeMm.width, dpi), height: mmToPx(spec.sizeMm.height, dpi) };
}

// --- paper -------------------------------------------------------------------

export type Sheet = { id: SheetId; label: string; widthMm: number; heightMm: number };

const SHEETS: Record<SheetId, Sheet> = {
  '4x6in': { id: '4x6in', label: '4 × 6 in', widthMm: 101.6, heightMm: 152.4 },
  '10x15cm': { id: '10x15cm', label: '10 × 15 cm', widthMm: 100, heightMm: 150 },
  a4: { id: 'a4', label: 'A4', widthMm: 210, heightMm: 297 },
};

export function sheet(id: SheetId): Sheet {
  const found = SHEETS[id];
  if (!found) throw new Error(`unknown sheet ${id}`);
  return found;
}

export type Placement = {
  column: number;
  row: number;
  xMm: number;
  yMm: number;
  widthMm: number;
  heightMm: number;
};

/** A tick at a cell corner telling the shop where to cut. Endpoints are in sheet millimetres. */
export type CutMark = { x1Mm: number; y1Mm: number; x2Mm: number; y2Mm: number };

export type SheetLayout = {
  sheet: Sheet;
  cellWidthMm: number;
  cellHeightMm: number;
  marginMm: number;
  gutterMm: number;
  columns: number;
  rows: number;
  count: number;
  cells: Placement[];
  cutMarks: CutMark[];
};

export type LayoutOptions = { marginMm?: number; gutterMm?: number; markMm?: number };

/**
 * Tile one photo across a sheet of paper.
 *
 * A single 30 × 40 mm photo is not something a shop can print — it has no paper that size. What a
 * visitor can actually hand over is an ordinary 10 × 15 or 4 × 6 sheet with the photo repeated and
 * cut marks between the copies, so that is the deliverable.
 */
export function layoutSheet(spec: PhotoSpec, sheetId: SheetId, options: LayoutOptions = {}): SheetLayout {
  // Half the gutter, so the marks of two neighbouring photos meet in the middle instead of
  // reaching into each other's picture.
  const { marginMm = 5, gutterMm = 2, markMm = 1 } = options;
  const paper = sheet(sheetId);
  const cellWidthMm = spec.sizeMm.width;
  const cellHeightMm = spec.sizeMm.height;

  const usableWidth = paper.widthMm - 2 * marginMm;
  const usableHeight = paper.heightMm - 2 * marginMm;
  if (usableWidth < cellWidthMm || usableHeight < cellHeightMm) {
    throw new Error(`${spec.id} (${cellWidthMm}×${cellHeightMm} mm) does not fit on ${paper.label} with a ${marginMm} mm margin`);
  }

  const columns = Math.floor((usableWidth + gutterMm) / (cellWidthMm + gutterMm));
  const rows = Math.floor((usableHeight + gutterMm) / (cellHeightMm + gutterMm));

  // Centre the block on the paper: shops trim by the marks, not by the edge, so an even margin on
  // both sides is what keeps the copies on the same line once the sheet is cut.
  const blockWidth = columns * cellWidthMm + (columns - 1) * gutterMm;
  const blockHeight = rows * cellHeightMm + (rows - 1) * gutterMm;
  const originX = (paper.widthMm - blockWidth) / 2;
  const originY = (paper.heightMm - blockHeight) / 2;

  const cells: Placement[] = [];
  const cutMarks: CutMark[] = [];
  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const xMm = originX + column * (cellWidthMm + gutterMm);
      const yMm = originY + row * (cellHeightMm + gutterMm);
      cells.push({ column, row, xMm, yMm, widthMm: cellWidthMm, heightMm: cellHeightMm });
      for (const cornerX of [xMm, xMm + cellWidthMm]) {
        cutMarks.push(
          { x1Mm: clamp(cornerX - markMm, 0, paper.widthMm), y1Mm: yMm, x2Mm: clamp(cornerX + markMm, 0, paper.widthMm), y2Mm: yMm },
          { x1Mm: cornerX, y1Mm: clamp(yMm - markMm, 0, paper.heightMm), x2Mm: cornerX, y2Mm: clamp(yMm + markMm, 0, paper.heightMm) },
        );
      }
    }
  }

  return {
    sheet: paper, cellWidthMm, cellHeightMm, marginMm, gutterMm,
    columns, rows, count: cells.length, cells, cutMarks,
  };
}

function clamp(value: number, low: number, high: number): number {
  return Math.min(high, Math.max(low, value));
}

// --- framing -----------------------------------------------------------------

/**
 * Where the head is, in source pixels: `top` is the crown including hair, `bottom` the chin,
 * `centerX` the midline of the face. Finding this is the detector's job — deciding what to do with
 * it is this file's job, and the two are kept apart on purpose.
 */
export type HeadBox = { top: number; bottom: number; centerX: number };

export type CropPlan = {
  /** The rectangle to read out of the source, in source pixels. */
  rect: { x: number; y: number; width: number; height: number };
  /** The size that rectangle is drawn at. Exactly the specification's pixel size. */
  output: Size;
  /** Enlargement applied to fill the frame; above 1 the source is being upscaled. */
  scale: number;
  /** The head size and headroom the plan was built for, in millimetres. */
  headMm: number;
  headroomMm: number;
  /** The source is smaller than the frame: the rule cannot be met at any framing. Refuse. */
  insufficient: boolean;
  /** Non-fatal: met the size, but the source cannot supply the detail, or the head had to move. */
  warnings: string[];
};

export type CropOptions = { dpi: number; head: HeadBox; headMm?: number; headroomMm?: number };

/**
 * Frame a head into a specification.
 *
 * Two rules define the result and they are independent: the head must be a stated number of
 * millimetres tall, and there must be a stated gap between the crown and the top edge. The first
 * fixes the enlargement, the second fixes the vertical position — so scale is derived, never
 * chosen, which is why two different implementations of this agree.
 */
export function cropPlan(source: Size, spec: PhotoSpec, options: CropOptions): CropPlan {
  const { dpi, head } = options;
  const output = specPixels(spec, dpi);
  const warnings: string[] = [];

  const headMm = options.headMm ?? (spec.headHeightMm ? midpoint(spec.headHeightMm) : null);
  if (headMm === null || headMm === undefined) {
    throw new Error(`${spec.id} states no head height — pass one explicitly before framing`);
  }
  const headroomMm = options.headroomMm ?? (spec.headroomMm ? midpoint(spec.headroomMm) : 0);

  const sourceHeadPx = head.bottom - head.top;
  if (!(sourceHeadPx > 0)) throw new Error(`the head box is empty (top ${head.top}, bottom ${head.bottom})`);

  const scale = mmToPx(headMm, dpi) / sourceHeadPx;
  const rectWidth = output.width / scale;
  const rectHeight = output.height / scale;

  const idealX = head.centerX - rectWidth / 2;
  const idealY = head.top - mmToPx(headroomMm, dpi) / scale;

  const insufficient = rectWidth > source.width || rectHeight > source.height;
  const x = clamp(idealX, 0, Math.max(0, source.width - rectWidth));
  const y = clamp(idealY, 0, Math.max(0, source.height - rectHeight));

  if (x !== idealX || y !== idealY) {
    warnings.push('the source is framed at its edge, so the head could not be placed exactly where the document asks');
  }
  if (insufficient) {
    warnings.push(`the source is ${source.width}×${source.height} px and the frame needs ${Math.round(rectWidth)}×${Math.round(rectHeight)} px`);
  }
  if (scale > 1.05) {
    warnings.push(`the source is enlarged ${scale.toFixed(2)}× — the extra detail is invented, not recovered`);
  }

  return {
    rect: { x, y, width: rectWidth, height: rectHeight },
    output,
    scale,
    headMm,
    headroomMm,
    insufficient,
    warnings,
  };
}

/**
 * The reverse of `cropPlan`, for checking one: where a point of the source lands in the output.
 * Tests use it to confirm the head really is the size and position the specification asked for,
 * rather than confirming that the code returns what the code computed.
 */
export function sourceToOutput(plan: CropPlan, point: { x: number; y: number }): { x: number; y: number } {
  return { x: (point.x - plan.rect.x) * plan.scale, y: (point.y - plan.rect.y) * plan.scale };
}
