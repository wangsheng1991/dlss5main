/**
 * Document-photo specifications, as data.
 *
 * A passport photo is not a matter of taste: it is a set of measurements a clerk can check with a
 * ruler. That is what makes this the one category in the product where "correct" has a single
 * answer — and therefore the one category whose correctness can be asserted by a machine instead
 * of judged by eye.
 *
 * Every number below is a claim about the outside world, so every number carries the page it came
 * from, quoted. `tests/run.ts` refuses a row with no quote; `npm run test:online` re-fetches each
 * page and refuses a quote the page no longer contains.
 */

/** A page a number was read from, and the text it was read in. */
export type SpecSource = {
  url: string;
  /** Text copied from that page — a quotation, not a summary. Compared with whitespace removed. */
  quote: string;
  /** ISO date the page was read. A spec nobody re-read since is a spec nobody can trust. */
  retrievedAt: string;
};

/** Millimetres. A range when the sources state one — most do, because paper and heads vary. */
export type Range = { min: number; max: number };

/**
 * The only three papers this engine lays out on. A photo kiosk in Russia prints 10×15 cm, an
 * office printer in most of the world prints A4, and 4×6 in is the default abroad; those are the
 * three a visitor can actually walk into a shop with.
 */
export type SheetId = '4x6in' | '10x15cm' | 'a4';

/**
 * Whether a page may be published from this row.
 *
 * `verified`      — two independent sources, and every disagreement between them recorded with a
 *                   resolution. This is the only status a live landing page may use.
 * `single-source` — one page said so. Fine for a draft, never for something a stranger acts on.
 * `disputed`      — the sources disagree and nobody has yet decided which one governs. Blocks.
 */
export type SpecStatus = 'verified' | 'single-source' | 'disputed';

export type Conflict = {
  /** Which field the sources disagree about, by the name used on this type. */
  field: string;
  /** The figure that was NOT adopted, as the page wrote it. */
  value: string;
  /** The page that says it. Must be one of `sources`. */
  source: string;
  /** Why the other figure was adopted instead. Required for a row to reach `verified`. */
  resolution?: string;
};

export type PhotoSpec = {
  /** Stable slug; it names the URL and the file, so it never changes once published. */
  id: string;
  /** What the photo is called in the language of the people who need it, not in English. */
  label: string;
  locale: string;
  /** One line: which documents this size is accepted for. */
  purpose: string;
  /** The printed size the document requires. Everything else is derived from this. */
  sizeMm: { width: number; height: number };
  /** Crown to chin, in millimetres. */
  headHeightMm: Range | null;
  /** Empty space between the top edge of the frame and the crown. */
  headroomMm: Range | null;
  /** Printed background, as the hex a printer should actually lay down. */
  background: string;
  /** The lowest resolution any source accepts. The engine may emit more. */
  minDpi: number;
  sheets: SheetId[];
  status: SpecStatus;
  sources: SpecSource[];
  /** Where the sources contradict each other. The losing figure is kept, never deleted. */
  conflicts?: Conflict[];
};
