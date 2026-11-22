import assert from 'node:assert/strict';
import { crc32, FRAME_PACK_NOTE, frameFileName, framePackManifest, timeCode, zipStore } from '../src/lib/framePack';
import { test } from './harness';

const encoder = new TextEncoder();
const png = (fill: number, size = 12) => new Uint8Array(size).fill(fill);

/** Reads a STORE-only archive back the way an unzip tool would, so the writer is checked by parser, not by eye. */
function readZip(bytes: Uint8Array) {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const eocd = bytes.length - 22;
  assert.equal(view.getUint32(eocd, true), 0x06054b50, 'end of central directory signature');
  const count = view.getUint16(eocd + 10, true);
  const centralSize = view.getUint32(eocd + 12, true);
  const centralStart = view.getUint32(eocd + 16, true);
  assert.equal(centralStart + centralSize, eocd, 'central directory ends where the EOCD begins');
  const entries: Array<{ name: string; data: Uint8Array; crc: number }> = [];
  let offset = centralStart;
  for (let index = 0; index < count; index += 1) {
    assert.equal(view.getUint32(offset, true), 0x02014b50, 'central directory header signature');
    const method = view.getUint16(offset + 10, true);
    const crc = view.getUint32(offset + 16, true);
    const size = view.getUint32(offset + 20, true);
    const nameLength = view.getUint16(offset + 28, true);
    const name = new TextDecoder().decode(bytes.subarray(offset + 46, offset + 46 + nameLength));
    const local = view.getUint32(offset + 42, true);
    assert.equal(method, 0, 'entries are stored, never deflated');
    assert.equal(view.getUint32(local, true), 0x04034b50, `local header for ${name}`);
    assert.equal(view.getUint32(local + 14, true), crc, `local CRC for ${name}`);
    assert.equal(view.getUint32(local + 18, true), size, `local size for ${name}`);
    const localNameLength = view.getUint16(local + 26, true);
    assert.equal(new TextDecoder().decode(bytes.subarray(local + 30, local + 30 + localNameLength)), name);
    entries.push({ name, crc, data: bytes.subarray(local + 30 + localNameLength, local + 30 + localNameLength + size) });
    offset += 46 + nameLength;
  }
  return { count, centralStart, centralSize, entries };
}

test('crc32 matches the reference vector', () => {
  assert.equal(crc32(encoder.encode('123456789')), 0xcbf43926);
  assert.equal(crc32(new Uint8Array()), 0);
  assert.equal(crc32(encoder.encode('a')), 0xe8b7be43);
});

test('a frame pack reads back as a stored zip with the frames in order', () => {
  const frames = [png(1), png(2, 32), png(3, 7)];
  const names = frames.map((_, index) => frameFileName(index + 1));
  const archive = zipStore([...frames.map((data, index) => ({ name: names[index], data }))]);
  const read = readZip(archive);
  assert.equal(read.count, 3);
  assert.deepEqual(read.entries.map(entry => entry.name), ['frame-001.png', 'frame-002.png', 'frame-003.png']);
  read.entries.forEach((entry, index) => {
    assert.equal(entry.data.length, frames[index].length);
    assert.deepEqual(Array.from(entry.data), Array.from(frames[index]));
    assert.equal(entry.crc, crc32(frames[index]));
  });
  assert.equal(read.entries[1].data.length, 32, 'a larger frame is not truncated');
});

test('an export is byte-stable, so two runs of the same picks are comparable', () => {
  const entries = [{ name: 'frame-001.png', data: png(9) }, { name: 'manifest.json', data: encoder.encode('{"a":1}') }];
  const first = zipStore(entries);
  const second = zipStore(entries);
  assert.deepEqual(Array.from(first), Array.from(second));
});

test('the manifest names the clip, the tool and every timestamp', () => {
  const frames = [{ time: 1.5, file: frameFileName(1), width: 1280, height: 720 }];
  const manifest = framePackManifest('street-source.mp4', 'frame-extractor', frames, '2026-11-22T00:00:00.000Z');
  assert.equal(manifest.format, 'dlss5-frame-pack/v1');
  assert.equal(manifest.source, 'street-source.mp4');
  assert.equal(manifest.tool, 'frame-extractor');
  assert.equal(manifest.exportedAt, '2026-11-22T00:00:00.000Z');
  assert.deepEqual(manifest.frames, frames);
  assert.equal(manifest.note, FRAME_PACK_NOTE);
  assert.match(manifest.note, /decoded in the browser/);
  assert.match(manifest.note, /Nothing was generated/);
  assert.equal(JSON.stringify(manifest).includes('undefined'), false);
});

test('file names and time codes sort in capture order', () => {
  assert.equal(frameFileName(1), 'frame-001.png');
  assert.equal(frameFileName(12), 'frame-012.png');
  assert.equal(timeCode(0), '00-00.000');
  assert.equal(timeCode(5), '00-05.000');
  assert.equal(timeCode(62.5), '01-02.500');
  const codes = [12, 3, 0].map(timeCode).sort();
  assert.deepEqual(codes, ['00-00.000', '00-03.000', '00-12.000']);
});
