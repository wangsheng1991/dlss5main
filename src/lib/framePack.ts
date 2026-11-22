/**
 * A frame pack: the stills you picked out of a clip, as one downloadable `.zip` plus a manifest.
 *
 * The browser has no zip writer and no dependency is worth pulling in for a few PNGs, so this is a
 * STORE-only (uncompressed) zip: PNG is already deflated, and storing the bytes keeps the writer
 * small enough to test. Entry timestamps are fixed so the same frames always produce the same
 * bytes — that is what lets a test assert the archive, and what makes two exports comparable.
 *
 * The manifest is the point of the pack: it is the only thing that says which file came from which
 * moment of which clip, and without it a folder of `frame-001.png` is unverifiable later.
 */

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let index = 0; index < 256; index += 1) {
    let value = index;
    for (let bit = 0; bit < 8; bit += 1) value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
    table[index] = value >>> 0;
  }
  return table;
})();

export function crc32(bytes: Uint8Array): number {
  let crc = 0xffffffff;
  for (let index = 0; index < bytes.length; index += 1) crc = CRC_TABLE[(crc ^ bytes[index]) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

export type ZipEntry = { name: string; data: Uint8Array };

/** Fixed 2026-11-22 00:00 in DOS format, so an export is byte-stable across runs. */
const DOS_DATE = (((2026 - 1980) << 9) | (11 << 5) | 22) & 0xffff;
const DOS_TIME = 0;

export function zipStore(entries: ZipEntry[]): Uint8Array {
  const encoder = new TextEncoder();
  const prepared = entries.map(entry => ({
    name: encoder.encode(entry.name),
    data: entry.data,
    crc: crc32(entry.data),
  }));
  const localSize = prepared.reduce((total, entry) => total + 30 + entry.name.length + entry.data.length, 0);
  const centralSize = prepared.reduce((total, entry) => total + 46 + entry.name.length, 0);
  const buffer = new Uint8Array(localSize + centralSize + 22);
  const view = new DataView(buffer.buffer);
  let offset = 0;
  let centralOffset = localSize;
  const centralStart = localSize;

  for (const entry of prepared) {
    view.setUint32(offset, 0x04034b50, true);       // local file header
    view.setUint16(offset + 4, 20, true);           // version needed
    view.setUint16(offset + 6, 0, true);            // flags
    view.setUint16(offset + 8, 0, true);            // method: store
    view.setUint16(offset + 10, DOS_TIME, true);
    view.setUint16(offset + 12, DOS_DATE, true);
    view.setUint32(offset + 14, entry.crc, true);
    view.setUint32(offset + 18, entry.data.length, true);
    view.setUint32(offset + 22, entry.data.length, true);
    view.setUint16(offset + 26, entry.name.length, true);
    view.setUint16(offset + 28, 0, true);           // extra length
    buffer.set(entry.name, offset + 30);
    buffer.set(entry.data, offset + 30 + entry.name.length);
    offset += 30 + entry.name.length + entry.data.length;
  }

  offset = centralOffset;
  for (const entry of prepared) {
    view.setUint32(offset, 0x02014b50, true);       // central directory header
    view.setUint16(offset + 4, 20, true);           // version made by
    view.setUint16(offset + 6, 20, true);           // version needed
    view.setUint16(offset + 8, 0, true);            // flags
    view.setUint16(offset + 10, 0, true);           // method: store
    view.setUint16(offset + 12, DOS_TIME, true);
    view.setUint16(offset + 14, DOS_DATE, true);
    view.setUint32(offset + 16, entry.crc, true);
    view.setUint32(offset + 20, entry.data.length, true);
    view.setUint32(offset + 24, entry.data.length, true);
    view.setUint16(offset + 28, entry.name.length, true);
    view.setUint16(offset + 30, 0, true);           // extra
    view.setUint16(offset + 32, 0, true);           // comment
    view.setUint16(offset + 34, 0, true);           // disk number
    view.setUint16(offset + 36, 0, true);           // internal attributes
    view.setUint32(offset + 38, 0, true);           // external attributes
    view.setUint32(offset + 42, localOffsetsOf(prepared, entry), true);
    buffer.set(entry.name, offset + 46);
    offset += 46 + entry.name.length;
  }

  view.setUint32(offset, 0x06054b50, true);         // end of central directory
  view.setUint16(offset + 4, 0, true);
  view.setUint16(offset + 6, 0, true);
  view.setUint16(offset + 8, prepared.length, true);
  view.setUint16(offset + 10, prepared.length, true);
  view.setUint32(offset + 12, centralSize, true);
  view.setUint32(offset + 16, centralStart, true);
  view.setUint16(offset + 20, 0, true);
  return buffer;
}

/** Offset of each entry's local header, recomputed in order (STORE means sizes are known upfront). */
function localOffsetsOf(prepared: Array<{ name: Uint8Array; data: Uint8Array }>, target: { name: Uint8Array; data: Uint8Array }) {
  let offset = 0;
  for (const entry of prepared) {
    if (entry === target) return offset;
    offset += 30 + entry.name.length + entry.data.length;
  }
  return 0;
}

export type FramePackFrame = {
  /** Seconds into the source clip, rounded to milliseconds. */
  time: number;
  file: string;
  width: number;
  height: number;
};

export type FramePackManifest = {
  format: 'dlss5-frame-pack/v1';
  source: string;
  tool: string;
  exportedAt: string;
  frames: FramePackFrame[];
  note: string;
};

export const FRAME_PACK_NOTE =
  'Frames were decoded in the browser from the source clip at the timestamps listed. Nothing was generated, sharpened or re-encoded; a frame here is what the browser decoded at that time.';

/** The manifest is what makes an exported pack checkable: file → clip → timestamp. */
export function framePackManifest(source: string, tool: string, frames: FramePackFrame[], exportedAt: string): FramePackManifest {
  return { format: 'dlss5-frame-pack/v1', source, tool, exportedAt, frames, note: FRAME_PACK_NOTE };
}

export const frameFileName = (index: number) => `frame-${String(index).padStart(3, '0')}.png`;

/** `01-02.500` — sorts in time order and survives a filesystem without a colon. */
export const timeCode = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const rest = seconds - minutes * 60;
  return `${String(minutes).padStart(2, '0')}-${rest.toFixed(3).padStart(6, '0')}`;
};
