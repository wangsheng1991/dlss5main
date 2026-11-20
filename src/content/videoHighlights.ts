export const HIGHLIGHTS_MEDIA = {
  source: '/examples/video-highlights/street-source.mp4',
  edit: '/examples/video-highlights/street-highlights.mp4',
  poster: '/examples/video-highlights/poster.jpg',
} as const;

// G:/llava-ov25/demo/out/bus_windows.json, sha256 7d140b4cdbb9b0c5db2581384956fc38d3141b0929c7abbe5c705030239bb91f.
const sourceWindows = [
  [0, 1.5, true],
  [1.5, 3, true],
  [3, 4.5, false],
  [4.5, 6, false],
  [6, 7.5, true],
  [7.5, 9, true],
  [9, 10.5, false],
  [10.5, 12, true],
  [12, 13.5, true],
  [13.5, 15, true],
  [15, 16.5, true],
  [16.5, 18, true],
  [18, 19.5, false],
] as const;

let editedTime = 0;
export const HIGHLIGHT_WINDOWS = sourceWindows.map(([start, end, selected], index) => {
  const editStart = selected ? editedTime : null;
  if (selected) editedTime += end - start;
  return { index, start, end, editStart };
});
