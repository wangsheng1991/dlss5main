import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { Download, Play, Upload } from 'lucide-react';
import { HIGHLIGHTS_MEDIA } from '../content/videoHighlights';
import { STREET_WINDOWS } from '../content/videoUnderstanding';
import type { VideoPreviewLocale } from '../content/videoStudio';
import type { VideoTool } from '../content/videoTools';

const action = 'rounded-lg border border-white/20 px-3 py-2 text-sm font-semibold text-white hover:border-lime-300 disabled:opacity-40';
const primary = 'inline-flex items-center gap-2 rounded-lg bg-lime-300 px-4 py-2 text-sm font-bold text-black hover:bg-white disabled:opacity-40';
const input = 'rounded-lg border border-white/20 bg-black px-3 py-2 text-sm text-white';
const seconds = (time: number) => time.toFixed(3) + ' s';
type Point = { x: number; y: number };
type EventEntry = { start: number; end?: number; label: string | Record<string, unknown> };
type Source = { name: string; url: string };


function download(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function png(canvas: HTMLCanvasElement, name: string) {
  canvas.toBlob(blob => { if (blob) download(blob, name + '.png'); }, 'image/png');
}

function getCanvas(width: number, height: number) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

function seek(video: HTMLVideoElement, time: number) {
  if (Math.abs(video.currentTime - time) < 0.0001 && !video.seeking) return Promise.resolve();
  return new Promise<void>((resolve, reject) => {
    function finish(event?: Event) {
      window.clearTimeout(timer);
      video.removeEventListener('seeked', finish);
      video.removeEventListener('error', finish);
      if (event?.type === 'seeked') resolve();
      else reject(new Error('Video seek failed'));
    }
    const timer = window.setTimeout(() => finish(), 5000);
    video.addEventListener('seeked', finish);
    video.addEventListener('error', finish);
    video.currentTime = time;
  });
}

function prepareDecoder(media: HTMLVideoElement, url: string, signal: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    const stop = () => finish(false);
    const loaded = () => finish(true);
    function finish(ok: boolean) {
      window.clearTimeout(timer);
      media.removeEventListener('loadeddata', loaded);
      media.removeEventListener('error', stop);
      signal.removeEventListener('abort', stop);
      if (ok) resolve();
      else reject(new Error('Video could not be decoded'));
    }
    const timer = window.setTimeout(stop, 15000);
    media.addEventListener('loadeddata', loaded);
    media.addEventListener('error', stop);
    signal.addEventListener('abort', stop);
    if (signal.aborted) return stop();
    media.preload = 'auto';
    media.src = url;
  });
}

export default function VideoToolWorkspace({ tool, locale }: { tool: VideoTool; locale: VideoPreviewLocale }) {
  const zh = locale === 'zh';
  const t = (en: string, cn: string) => zh ? cn : en;
  const mode = tool.slug;
  const compare = mode === 'before-after-comparison';
  const cropMode = mode === 'vertical-crop-preview';
  const boxMode = mode === 'object-box-annotator';
  const diff = mode === 'scene-change-review';
  const sheet = mode === 'contact-sheet';
  const video = useRef<HTMLVideoElement>(null);
  const reference = useRef<HTMLVideoElement>(null);
  const cropPreview = useRef<HTMLCanvasElement>(null);
  const sheetPreview = useRef<HTMLCanvasElement>(null);
  const objectUrls = useRef(new Map<number, string>());
  const painting = useRef<Point | null>(null);
  const scanning = useRef<AbortController | null>(null);
  const sampleLoad = useRef<AbortController | null>(null);
  const [clip, setClip] = useState<Source>();
  const [second, setSecond] = useState<Source>();
  const [metadata, setMetadata] = useState<{ width: number; height: number; duration: number }>();
  const [secondDuration, setSecondDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [ratio, setRatio] = useState(9 / 16);
  const [offset, setOffset] = useState(0.5);
  const [count, setCount] = useState(9);
  const [speed, setSpeed] = useState(1);
  const [range, setRange] = useState<{ start?: number; end?: number }>({});
  const [events, setEvents] = useState<EventEntry[]>([]);
  const [label, setLabel] = useState('');
  const [changes, setChanges] = useState<number[]>();
  const [box, setBox] = useState<{ left: number; top: number; width: number; height: number; time: number }>();
  const [hasSheet, setHasSheet] = useState(false);
  const [busy, setBusy] = useState(false);
  const [sampleLoading, setSampleLoading] = useState(false);
  const [error, setError] = useState(false);
  const urls = objectUrls.current;
  useEffect(() => () => {
    scanning.current?.abort();
    sampleLoad.current?.abort();
    sampleLoad.current = null;
    urls.forEach(url => URL.revokeObjectURL(url));
  }, [urls]);

  function load(next: Source, side: number) {
    const old = urls.get(side);
    if (old) URL.revokeObjectURL(old);
    urls.delete(side);
    if (next.url.startsWith('blob:')) urls.set(side, next.url);
    setError(false);
    if (side === 1) {
      setSecondDuration(0);
      setSecond(next);
      return;
    }
    setMetadata(undefined);
    setPosition(0);
    setRange({});
    setEvents([]);
    setChanges(undefined);
    setBox(undefined);
    setHasSheet(false);
    setClip(next);
  }

  async function sample() {
    if (sampleLoad.current) return;
    const controller = new AbortController();
    sampleLoad.current = controller;
    const timer = window.setTimeout(() => controller.abort(), 25000);
    setSampleLoading(true);
    setError(false);
    const sampleBase = '/examples/video-workbench/';
    const names = compare ? ['street-bicubic.mp4', 'street-candidate.mp4']
      : [diff ? 'street-highlights.mp4' : 'street-source.mp4'];
    try {
      // Buffer the short stock examples once. Subsequent scrubs and frame scans use this copy.
      const files = await Promise.all(names.map(async name => {
        const response = await fetch(sampleBase + name + '?v=20261120', { signal: controller.signal });
        if (!response.ok) throw new Error('Video fetch failed');
        return { bytes: await response.blob(), name };
      }));
      controller.signal.throwIfAborted();
      files.forEach(({ bytes, name }, side) => load({ url: URL.createObjectURL(bytes), name }, side));
      if (mode === 'event-timeline') setEvents(STREET_WINDOWS.map(window => ({ start: window.start, end: window.end, label: JSON.parse(window.raw) })));
    } catch {
      if (sampleLoad.current === controller) setError(true);
    } finally {
      window.clearTimeout(timer);
      controller.abort();
      if (sampleLoad.current === controller) {
        sampleLoad.current = null;
        setSampleLoading(false);
      }
    }
  }

  function saveJSON(value: unknown) {
    download(new Blob([JSON.stringify(value, null, 2) + '\n'], { type: 'application/json' }), mode + '.json');
  }

  function currentFrame(destination: HTMLCanvasElement, framing: boolean) {
    const media = video.current;
    if (!media || media.readyState < 2) return;
    const { videoWidth: w, videoHeight: h } = media;
    const width = framing ? Math.min(w, Math.round(h * ratio)) : w;
    const height = framing ? Math.min(h, Math.round(w / ratio)) : h;
    const left = Math.round((w - width) * offset);
    const top = Math.round((h - height) / 2);
    destination.width = width;
    destination.height = height;
    destination.getContext('2d')?.drawImage(media, left, top, width, height, 0, 0, width, height);
  }

  useEffect(() => {
    if (cropPreview.current) currentFrame(cropPreview.current, true);
  }, [metadata, position, ratio, offset]);

  function navigate(time: number) {
    if (!video.current || !metadata) return;
    const end = compare && secondDuration ? Math.min(metadata.duration, secondDuration) : metadata.duration;
    const target = Math.max(0, Math.min(time, Math.max(0, end - 0.001)));
    video.current.pause();
    video.current.currentTime = target;
    if (compare && secondDuration && reference.current) {
      reference.current.pause();
      reference.current.currentTime = target;
    }
    setPosition(target);
    setBox(undefined);
  }

  async function scan() {
    if (!clip || !metadata || scanning.current || sampleLoad.current) return;
    const controller = new AbortController();
    scanning.current = controller;
    setBusy(true);
    setError(false);
    video.current?.pause();
    const media = document.createElement('video');
    try {
      // A separate decoder leaves the visible player at the paused timestamp.
      await prepareDecoder(media, clip.url, controller.signal);
      const tiles = sheetPreview.current;
      const frame = getCanvas(48, 27);
      const sampleContext = frame.getContext('2d', { willReadFrequently: true });
      const tileContext = tiles?.getContext('2d');
      const samples = sheet ? count : Math.max(2, Math.min(90, Math.ceil(metadata.duration * 4)));
      const tileWidth = 320;
      const tileHeight = Math.round(320 * metadata.height / metadata.width);
      const gutter = tileHeight + 25;
      const columns = samples === 4 ? 2 : 3;
      if (sheet && tiles) {
        tiles.width = columns * tileWidth;
        tiles.height = Math.ceil(samples / columns) * gutter;
      }
      let last: Uint8ClampedArray | undefined;
      const found = [];
      for (let i = 0; i < samples; i++) {
        const time = (i + (sheet ? .5 : 0)) / samples * metadata.duration;
        controller.signal.throwIfAborted();
        await seek(media, time);
        if (sheet && tileContext) {
          const x = i % columns * tileWidth;
          const y = Math.floor(i / columns) * gutter;
          tileContext.fillStyle = '#111710';
          tileContext.fillRect(x, y, tileWidth, gutter);
          tileContext.drawImage(media, x, y, tileWidth, tileHeight);
          tileContext.fillStyle = '#d9f99d';
          tileContext.font = '14px monospace';
          tileContext.fillText(seconds(time), x + 10, y + tileHeight + 17);
        }
        if (diff && sampleContext) {
          sampleContext.drawImage(media, 0, 0, frame.width, frame.height);
          const pixels = sampleContext.getImageData(0, 0, frame.width, frame.height).data;
          if (last) {
            let delta = 0;
            for (let index = 0; index < pixels.length; index += 4) {
              for (let channel = 0; channel < 3; channel++) delta += Math.abs(pixels[index + channel] - last[index + channel]);
            }
            if (delta / (frame.width * frame.height * 3) >= 33) found.push(time);
          }
          last = pixels;
        }
      }
      if (sheet) setHasSheet(true);
      if (diff) setChanges(found);
    } catch {
      if (!controller.signal.aborted) setError(true);
    } finally {
      media.removeAttribute('src');
      media.load();
      scanning.current = null;
      if (!controller.signal.aborted) setBusy(false);
    }
  }

  function pointerPosition(event: PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const clamp = (value: number) => Math.max(0, Math.min(1, value));
    return { x: clamp((event.clientX - rect.left) / rect.width), y: clamp((event.clientY - rect.top) / rect.height) };
  }

  function drawBox(event: PointerEvent<HTMLDivElement>) {
    const start = painting.current;
    if (!start || !video.current) return;
    const end = pointerPosition(event);
    setBox({ left: Math.min(start.x, end.x), top: Math.min(start.y, end.y), width: Math.abs(start.x - end.x), height: Math.abs(start.y - end.y), time: video.current.currentTime });
  }

  function fileInput(side: number) {
    return <label className={action + ' inline-flex cursor-pointer items-center gap-2 focus-within:ring-2 focus-within:ring-lime-300'}>
      <Upload size={16} aria-hidden="true" />{side === 1 ? t('Open comparison file', '打开对照视频') : t('Open video file', '打开视频文件')}
      <input className="sr-only" type="file" accept="video/*,.mp4,.webm,.mov" disabled={busy || sampleLoading} onChange={event => {
        const file = event.currentTarget.files?.[0];
        if (file) load({ name: file.name, url: URL.createObjectURL(file) }, side);
        event.currentTarget.value = '';
      }} />
    </label>;
  }

  const ready = Boolean(metadata && clip);
  const validRange = range.start !== undefined && range.end !== undefined && range.start < range.end;
  const duration = metadata ? (compare && secondDuration ? Math.min(metadata.duration, secondDuration) : metadata.duration) : 0;
  return <>
    <div className="mb-4 flex flex-wrap items-center gap-3">
      <button className={primary} disabled={busy || sampleLoading} onClick={() => void sample()}><Play size={16} aria-hidden="true" />
        {sampleLoading ? t('Loading sample…', '正在加载样片…') : t('Open sample', '打开样片')}</button>
      {fileInput(0)}{compare && fileInput(1)}
      {clip && <span className="min-w-0 break-all text-sm text-zinc-400">{clip.name}</span>}
    </div>
    {!clip && !second && <img className="mx-auto aspect-video w-full max-w-2xl rounded-xl bg-black object-contain"
      src={HIGHLIGHTS_MEDIA.poster} alt={t('A street scene from the sample footage', '演示样片中的路口画面')} />}
    <div className={compare || cropMode ? 'grid items-start gap-4 sm:grid-cols-2' : 'mx-auto max-w-3xl'}>
      {clip && <figure className="min-w-0">
        {compare && <figcaption className="mb-2 text-sm text-zinc-300">{t('Left clip', '左侧视频')}</figcaption>}
        <div className="relative" style={{ aspectRatio: boxMode && metadata ? metadata.width / metadata.height : undefined }}>
          <video key={clip.url} ref={video} src={clip.url} preload="auto" controls={!compare && !boxMode && !busy} playsInline
            className={'w-full rounded-xl bg-black object-contain ' + (boxMode && metadata ? 'block h-full' : 'max-h-[58vh]')}
            onLoadedData={event => {
              const media = event.currentTarget;
              if (!Number.isFinite(media.duration) || !media.videoWidth) { setError(true); return; }
              media.playbackRate = speed;
              setMetadata({ width: media.videoWidth, height: media.videoHeight, duration: media.duration });
            }}
            onError={() => { setError(true); setMetadata(undefined); }}
            onSeeked={() => { if (cropPreview.current) currentFrame(cropPreview.current, true); }}
            onTimeUpdate={event => setPosition(event.currentTarget.currentTime)} />
          {boxMode && ready && <div className="absolute inset-0 cursor-crosshair touch-none" onPointerDown={event => {
            event.currentTarget.setPointerCapture(event.pointerId);
            painting.current = pointerPosition(event);
            drawBox(event);
          }} onPointerMove={drawBox} onPointerUp={event => { drawBox(event); painting.current = null; }}
            onPointerCancel={() => { painting.current = null; setBox(undefined); }}>
            {box && <div className="pointer-events-none absolute border-2 border-lime-300 bg-lime-300/10"
              style={{ left: box.left * 100 + '%', top: box.top * 100 + '%', width: box.width * 100 + '%', height: box.height * 100 + '%' }} />}
          </div>}
        </div>
      </figure>}
      {compare && second && <figure className="min-w-0">
        <figcaption className="mb-2 break-all text-sm text-zinc-300">{t('Right clip', '右侧视频')} · {second.name}</figcaption>
        <video key={second.url} ref={reference} src={second.url} preload="auto" playsInline className="max-h-[58vh] w-full rounded-xl bg-black object-contain"
          onLoadedMetadata={event => setSecondDuration(Number.isFinite(event.currentTarget.duration) ? event.currentTarget.duration : 0)}
          onError={() => { setError(true); setSecondDuration(0); }} />
      </figure>}
      {cropMode && ready && <canvas ref={cropPreview} className="mx-auto block max-h-[58vh] max-w-full rounded-xl bg-black object-contain" />}
    </div>
    {ready && clip && metadata && <div className="mt-4 rounded-xl border border-white/10 bg-[#1a2018] p-4 sm:p-5">
      <label className="grid grid-cols-[1fr_auto] gap-2 text-sm text-zinc-300">
        {t('Review time', '查看时间')} <output className="font-mono text-lime-300">{seconds(position)}</output>
        <input className="col-span-2 w-full accent-lime-300" type="range" min={0} max={duration} step={0.01}
          value={Math.min(position, duration)} disabled={busy} onChange={event => navigate(Number(event.currentTarget.value))} />
      </label>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        {(mode === 'frame-extractor' || cropMode) && <button className={primary} onClick={() => {
          const frame = getCanvas(1, 1);
          currentFrame(frame, cropMode);
          if (frame.width > 1) png(frame, cropMode ? 'crop-preview' : 'video-frame');
        }}><Download size={16} aria-hidden="true" />{t('Save PNG', '保存 PNG')}</button>}
        {cropMode && <>
          <label className="flex items-center gap-2 text-sm text-zinc-300">{t('Aspect ratio', '画幅')}
            <select className={input} value={ratio} onChange={event => setRatio(Number(event.currentTarget.value))}>
              <option value={9 / 16}>9:16</option><option value={1}>1:1</option>
            </select>
          </label>
          <label className="flex items-center gap-2 text-sm text-zinc-300">{t('Horizontal position', '水平取景')}
            <input className="w-24 accent-lime-300" type="range" min={0} max={1} step={.01} value={offset} onChange={event => setOffset(Number(event.currentTarget.value))} />
          </label>
        </>}
        {mode === 'metadata-viewer' && <>
          <dl className="flex flex-wrap gap-4 text-sm text-white">
            <div><dt className="text-zinc-400">{t('Resolution', '分辨率')}</dt><dd>{metadata.width} × {metadata.height}</dd></div>
            <div><dt className="text-zinc-400">{t('Aspect ratio', '画幅比例')}</dt><dd>{(metadata.width / metadata.height).toFixed(4)}:1</dd></div>
            <div><dt className="text-zinc-400">{t('Duration', '时长')}</dt><dd>{seconds(metadata.duration)}</dd></div>
          </dl>
          <button className={primary} onClick={() => saveJSON({ file: clip.name, ...metadata })}>{t('Save metadata JSON', '保存规格 JSON')}</button>
        </>}
        {sheet && <label className="flex items-center gap-2 text-sm text-zinc-300">{t('Tiles', '画面数量')}
          <select className={input} value={count} disabled={busy} onChange={event => { setCount(Number(event.currentTarget.value)); setHasSheet(false); }}>
            <option>4</option><option>9</option><option>12</option>
          </select>
        </label>}
        {(sheet || diff) && <button className={primary} disabled={busy || sampleLoading} onClick={() => void scan()}>{busy ? t('Reading frames…', '正在读取画面…') : sheet ? t('Build contact sheet', '生成缩略图总览') : t('Find cut candidates', '查找切镜候选')}</button>}
        {hasSheet && <button className={action} onClick={() => { if (sheetPreview.current) png(sheetPreview.current, 'video-contact-sheet'); }}>{t('Save sheet PNG', '保存总览 PNG')}</button>}
        {mode === 'clip-range-planner' && <>
          <button className={action} onClick={() => setRange({ ...range, start: position })}>{t('Mark start', '标记起点')}</button>
          <button className={action} onClick={() => setRange({ ...range, end: position })}>{t('Mark end', '标记终点')}</button>
          <output className="font-mono text-sm text-lime-300">{range.start === undefined ? '—' : seconds(range.start)} → {range.end === undefined ? '—' : seconds(range.end)}</output>
          <button className={primary} disabled={!validRange} onClick={() => saveJSON({ file: clip.name, ...range })}>{t('Save edit range', '保存选段清单')}</button>
        </>}
        {mode === 'slow-motion-review' && <>
          <label className="flex items-center gap-2 text-sm text-zinc-300">{t('Playback speed', '播放速度')}
            <select className={input} value={speed} onChange={event => {
              const next = Number(event.currentTarget.value);
              setSpeed(next);
              if (video.current) video.current.playbackRate = next;
            }}><option value=".25">0.25×</option><option value=".5">0.5×</option><option value=".75">0.75×</option><option value="1">1×</option></select>
          </label>
          <button className={action} onClick={() => navigate((video.current?.currentTime ?? position) - .04)}>{t('Back 40 ms', '后退 40 毫秒')}</button>
          <button className={action} onClick={() => navigate((video.current?.currentTime ?? position) + .04)}>{t('Forward 40 ms', '前进 40 毫秒')}</button>
        </>}
        {boxMode && <button className={primary} disabled={!box || box.width < .005 || box.height < .005} onClick={() => saveJSON({ file: clip.name, ...metadata, box })}>{t('Save box JSON', '保存标注框 JSON')}</button>}
        {mode === 'event-timeline' && <>
          <input className={input + ' max-w-full'} aria-label={t('Event label', '事件标签')} placeholder={t('Event label', '事件标签')} value={label} maxLength={120} onChange={event => setLabel(event.currentTarget.value)} />
          <button className={action} disabled={!label.trim()} onClick={() => {
            setEvents([...events, { start: position, label: label.trim() }].sort((a, b) => a.start - b.start));
            setLabel('');
          }}>{t('Add event', '添加事件')}</button>
          <button className={primary} disabled={!events.length} onClick={() => saveJSON({ file: clip.name, events })}>{t('Save event list', '保存事件列表')}</button>
        </>}
      </div>
      {sheet && <canvas ref={sheetPreview} hidden={!hasSheet} className="mt-4 max-h-[80vh] max-w-full object-contain" />}
      {changes && <div className="mt-4 flex flex-wrap gap-2" aria-live="polite">{changes.length
        ? changes.map(time => <button key={time} className={action} onClick={() => navigate(time)}>{seconds(time)}</button>)
        : <p className="text-sm text-zinc-300">{t('No cut candidates at this threshold.', '当前阈值下未发现切镜候选。')}</p>}</div>}
      {events.length > 0 && <ol className="mt-4 max-h-72 divide-y divide-white/10 overflow-y-auto">
        {events.map((event, i) => <li key={i} className="flex flex-wrap items-start gap-2 py-2">
          <button className={action + ' font-mono'} onClick={() => navigate(event.start)}>{seconds(event.start)}{event.end === undefined ? '' : ' – ' + seconds(event.end)}</button>
          <code lang={typeof event.label === 'string' ? undefined : 'zh-CN'} className="max-w-full break-words pt-2 text-sm text-lime-100">{typeof event.label === 'string' ? event.label : JSON.stringify(event.label)}</code>
        </li>)}
      </ol>}
    </div>}
    {error && <p role="alert" className="mt-4 rounded-lg border border-rose-400/30 p-3 text-sm text-rose-200">{t('This browser could not read part of the video. Try a shorter H.264 MP4 or open the sample.', '浏览器未能读取部分画面。试试更短的 H.264 MP4 或打开样片。')}</p>}
  </>;
}
