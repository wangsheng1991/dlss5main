import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Download, FileImage, LockKeyhole, Printer, UploadCloud } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';
import { layoutSheet, mmToPx, specPixels } from '../lib/spec/geometry';
import { PHOTO_SPECS, publishableSpecs } from '../lib/spec/specs';
import type { PhotoSpec, SheetId } from '../lib/spec/types';
import { SITE_URL } from '../config/site';
import { trackEvent } from '../lib/analytics';
import { PASSPORT_PHOTO_SPEC_PATHS, PASSPORT_PHOTO_SPEC_SLUGS } from '../content/passportPhoto';

const SPECS = publishableSpecs();
const SHEET_LABELS: Record<SheetId, string> = { '10x15cm': '10 × 15 cm', '4x6in': '4 × 6 in', a4: 'A4' };

type Crop = { x: number; y: number; width: number; height: number };

function getSpecFromPath(pathname: string): PhotoSpec {
  const segment = pathname.split('/').filter(Boolean).at(-1) || '';
  const id = pathname === '/tools/passport-photo' ? 'ru-doc-3x4' : PASSPORT_PHOTO_SPEC_PATHS[segment] || segment;
  return PHOTO_SPECS.find(spec => spec.id === id && spec.status === 'verified') || SPECS[0];
}

function cropFor(image: HTMLImageElement, spec: PhotoSpec, zoom: number, xPosition: number, yPosition: number): Crop {
  const ratio = spec.sizeMm.width / spec.sizeMm.height;
  const imageRatio = image.naturalWidth / image.naturalHeight;
  const baseWidth = imageRatio > ratio ? image.naturalHeight * ratio : image.naturalWidth;
  const baseHeight = imageRatio > ratio ? image.naturalHeight : image.naturalWidth / ratio;
  const width = baseWidth / zoom;
  const height = baseHeight / zoom;
  return {
    width,
    height,
    x: (image.naturalWidth - width) * (xPosition / 100),
    y: (image.naturalHeight - height) * (yPosition / 100),
  };
}

function drawPhoto(context: CanvasRenderingContext2D, image: HTMLImageElement, crop: Crop, x: number, y: number, width: number, height: number) {
  context.drawImage(image, crop.x, crop.y, crop.width, crop.height, x, y, width, height);
}

function downloadCanvas(canvas: HTMLCanvasElement, filename: string) {
  canvas.toBlob(blob => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }, 'image/png');
}

function photoSchema(spec: PhotoSpec, canonicalPath: string) {
  const path = canonicalPath;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: 'Free Passport Photo Maker',
        url: `${SITE_URL}${path}`,
        applicationCategory: 'MultimediaApplication',
        operatingSystem: 'Web',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        description: `Create a free ${spec.sizeMm.width} × ${spec.sizeMm.height} mm printable document photo locally in your browser without uploading the source image.`,
      },
      {
        '@type': 'HowTo',
        name: `How to make a ${spec.label}`,
        step: [
          { '@type': 'HowToStep', name: 'Upload a photo', text: 'Choose a clear photo. It stays in your browser.' },
          { '@type': 'HowToStep', name: 'Align the guide', text: 'Adjust the crop so the head fits the published size and headroom guide.' },
          { '@type': 'HowToStep', name: 'Download a print sheet', text: 'Export the exact photo pixels or a sheet with repeated copies and cut marks.' },
        ],
      },
    ],
  };
}

export default function PassportPhoto() {
  const { pathname } = useLocation();
  const { i18n } = useTranslation();
  const spec = getSpecFromPath(pathname);
  const [file, setFile] = useState<File | null>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [zoom, setZoom] = useState(1);
  const [xPosition, setXPosition] = useState(50);
  const [yPosition, setYPosition] = useState(50);
  const [dpi, setDpi] = useState(spec.minDpi);
  const [sheetId, setSheetId] = useState<SheetId>('10x15cm');
  const previewRef = useRef<HTMLCanvasElement>(null);
  const isZh = i18n.language.startsWith('zh');
  const output = useMemo(() => specPixels(spec, dpi), [spec, dpi]);
  const crop = image ? cropFor(image, spec, zoom, xPosition, yPosition) : null;
  const headMm = spec.headHeightMm ? (spec.headHeightMm.min + spec.headHeightMm.max) / 2 : null;
  const headroomMm = spec.headroomMm ? (spec.headroomMm.min + spec.headroomMm.max) / 2 : 0;
  const pagePath = pathname === '/tools/passport-photo' ? '/tools/passport-photo' : `/tools/passport-photo/${PASSPORT_PHOTO_SPEC_SLUGS[spec.id]}`;

  useEffect(() => {
    trackEvent('micro_tool_view', { tool: 'passport-photo', spec: spec.id });
  }, [spec.id]);

  useEffect(() => {
    setDpi(spec.minDpi);
    setZoom(1);
    setXPosition(50);
    setYPosition(50);
  }, [spec.id, spec.minDpi]);

  useEffect(() => {
    if (!file) {
      setImage(null);
      return;
    }
    const url = URL.createObjectURL(file);
    const next = new Image();
    next.onload = () => { setImage(next); };
    next.onerror = () => { URL.revokeObjectURL(url); setImage(null); };
    next.src = url;
    return () => URL.revokeObjectURL(url);
  }, [file]);

  useEffect(() => {
    const canvas = previewRef.current;
    if (!canvas || !image || !crop) return;
    const maxEdge = 720;
    const scale = Math.min(maxEdge / output.width, maxEdge / output.height);
    canvas.width = Math.max(1, Math.round(output.width * scale));
    canvas.height = Math.max(1, Math.round(output.height * scale));
    const context = canvas.getContext('2d');
    if (!context) return;
    context.fillStyle = spec.background;
    context.fillRect(0, 0, canvas.width, canvas.height);
    drawPhoto(context, image, crop, 0, 0, canvas.width, canvas.height);
    if (headMm) {
      const top = (headroomMm / spec.sizeMm.height) * canvas.height;
      const bottom = ((headroomMm + headMm) / spec.sizeMm.height) * canvas.height;
      context.strokeStyle = '#b1fa50';
      context.setLineDash([8, 6]);
      context.lineWidth = Math.max(2, canvas.width / 240);
      context.beginPath();
      context.moveTo(0, top); context.lineTo(canvas.width, top);
      context.moveTo(0, bottom); context.lineTo(canvas.width, bottom);
      context.stroke();
      context.setLineDash([]);
    }
  }, [image, crop, output, spec, headMm, headroomMm]);

  const changeSpec = (next: PhotoSpec) => {
    window.history.pushState({}, '', `/tools/passport-photo/${PASSPORT_PHOTO_SPEC_SLUGS[next.id]}`);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const chooseFile = (candidate: File | undefined) => {
    if (!candidate || !candidate.type.startsWith('image/') || candidate.size > 10 * 1024 * 1024) return;
    setFile(candidate);
    trackEvent('micro_tool_file_selected', { tool: 'passport-photo', file_type: candidate.type, file_size: Math.round(candidate.size / 1024) });
  };

  const exportPhoto = () => {
    if (!image || !crop) return;
    const canvas = document.createElement('canvas');
    canvas.width = output.width; canvas.height = output.height;
    const context = canvas.getContext('2d');
    if (!context) return;
    context.fillStyle = spec.background; context.fillRect(0, 0, canvas.width, canvas.height);
    drawPhoto(context, image, crop, 0, 0, canvas.width, canvas.height);
    downloadCanvas(canvas, `${spec.id}-${output.width}x${output.height}.png`);
    trackEvent('micro_tool_export', { tool: 'passport-photo', output: 'single', spec: spec.id, dpi });
  };

  const exportSheet = () => {
    if (!image || !crop) return;
    const layout = layoutSheet(spec, sheetId);
    const canvas = document.createElement('canvas');
    canvas.width = mmToPx(layout.sheet.widthMm, dpi); canvas.height = mmToPx(layout.sheet.heightMm, dpi);
    const context = canvas.getContext('2d');
    if (!context) return;
    context.fillStyle = '#fff'; context.fillRect(0, 0, canvas.width, canvas.height);
    for (const cell of layout.cells) {
      drawPhoto(context, image, crop, mmToPx(cell.xMm, dpi), mmToPx(cell.yMm, dpi), mmToPx(cell.widthMm, dpi), mmToPx(cell.heightMm, dpi));
    }
    context.strokeStyle = '#555'; context.lineWidth = Math.max(1, dpi / 300);
    for (const mark of layout.cutMarks) {
      context.beginPath();
      context.moveTo(mmToPx(mark.x1Mm, dpi), mmToPx(mark.y1Mm, dpi));
      context.lineTo(mmToPx(mark.x2Mm, dpi), mmToPx(mark.y2Mm, dpi));
      context.stroke();
    }
    downloadCanvas(canvas, `${spec.id}-${sheetId}-${dpi}dpi.png`);
    trackEvent('micro_tool_export', { tool: 'passport-photo', output: 'sheet', spec: spec.id, sheet: sheetId, dpi });
  };

  return <>
    <SEO
      title={`Free ${spec.label} Online — Printable Passport Photo Maker`}
      description={`Create a ${spec.sizeMm.width} × ${spec.sizeMm.height} mm ${spec.label.toLowerCase()} online. Align the head guide and download a printable sheet locally without uploading your photo.`}
      keywords={['free passport photo online', 'free passport photo maker', `${spec.sizeMm.width}x${spec.sizeMm.height} photo free`, ...(['passport photo', '3x4 photo online free', '35x45 passport photo free', 'фото 3 на 4 онлайн'] as const)]}
      canonical={pagePath}
      structuredData={photoSchema(spec, pagePath)}
      language={isZh ? 'zh-CN' : 'en-US'}
    />
    <main className="pt-28 sm:pt-32 pb-24 px-5 max-w-[1200px] mx-auto w-full">
      <nav className="mb-8 text-sm text-zinc-500" aria-label="Breadcrumb"><a href="/" className="hover:text-primary">DLSS5NVIDIA</a><span className="mx-2">/</span><span>Passport Photo</span></nav>
      <header className="max-w-3xl mb-10">
        <p className="text-primary font-label text-xs uppercase tracking-[0.2em] mb-4">Free small tool · local processing</p>
        <h1 className="text-4xl md:text-5xl font-headline font-bold tracking-tight text-white leading-tight">Free {spec.label} online</h1>
        <p className="mt-5 text-lg leading-relaxed text-zinc-300">Create a free exact-size document photo from your own image. Choose a verified specification, align the head guide and download a single photo or a print sheet with cut marks; no account, upload or credits are required.</p>
        <div className="mt-5 flex flex-wrap gap-3 text-sm text-zinc-400"><span className="rounded-full bg-surface-low px-3 py-2">free · no account</span><span className="rounded-full bg-surface-low px-3 py-2">{spec.sizeMm.width} × {spec.sizeMm.height} mm</span><span className="rounded-full bg-surface-low px-3 py-2">minimum {spec.minDpi} DPI</span><span className="rounded-full bg-surface-low px-3 py-2"><LockKeyhole className="inline w-4 h-4 mr-1"/>photo stays in browser</span></div>
      </header>

      <section id="tool" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 rounded-2xl border border-outline-variant/20 bg-surface-low p-5 sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5"><div><h2 className="text-xl font-headline font-bold text-white">1. Choose a specification</h2><p className="text-sm text-zinc-500 mt-1">Only verified rows are published.</p></div><a href="/tools/passport-photo" className="text-sm text-primary">All sizes</a></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{SPECS.map(item => <button key={item.id} type="button" onClick={() => changeSpec(item)} className={`text-left rounded-xl border p-4 transition-colors ${item.id === spec.id ? 'border-primary bg-primary/10' : 'border-outline-variant/20 bg-surface-high hover:border-primary/50'}`}><span className="block text-white font-semibold">{item.label}</span><span className="block mt-2 text-xs text-zinc-400">{item.sizeMm.width} × {item.sizeMm.height} mm · {item.minDpi} DPI</span><span className="block mt-2 text-xs text-zinc-500">{item.purpose}</span></button>)}</div>

          <div className="mt-8"><h2 className="text-xl font-headline font-bold text-white">2. Upload and align</h2><p className="text-sm text-zinc-400 mt-2">The preview lines show the target head height and headroom. They are a guide, not an automatic government approval.</p><label className="mt-4 flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-primary/40 bg-primary/5 px-5 text-center hover:bg-primary/10"><UploadCloud className="w-8 h-8 text-primary mb-2"/><span className="font-semibold text-white">{file ? file.name : 'Choose a JPG, PNG or WebP'}</span><span className="mt-2 text-xs text-zinc-500">Up to 10 MiB · no upload to our server</span><input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={event => chooseFile(event.target.files?.[0])}/></label></div>

          {image && <div className="mt-8"><div className="flex items-center justify-between gap-3"><h2 className="text-xl font-headline font-bold text-white">3. Adjust the crop</h2><span className="text-xs text-zinc-500">{image.naturalWidth} × {image.naturalHeight}px source</span></div><div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4"><label className="text-xs text-zinc-400">Zoom <input type="range" min="1" max="2.5" step="0.01" value={zoom} onChange={event => setZoom(Number(event.target.value))} className="mt-2 w-full accent-[var(--color-primary,#b1fa50)]"/></label><label className="text-xs text-zinc-400">Horizontal <input type="range" min="0" max="100" value={xPosition} onChange={event => setXPosition(Number(event.target.value))} className="mt-2 w-full accent-[var(--color-primary,#b1fa50)]"/></label><label className="text-xs text-zinc-400">Vertical <input type="range" min="0" max="100" value={yPosition} onChange={event => setYPosition(Number(event.target.value))} className="mt-2 w-full accent-[var(--color-primary,#b1fa50)]"/></label></div><div className="mt-5 flex justify-center rounded-xl bg-[#111] p-4"><canvas ref={previewRef} aria-label="Passport photo crop preview" className="max-h-[520px] max-w-full rounded-lg"/></div><p className="mt-3 text-xs leading-relaxed text-zinc-500">Align the crown and chin between the green guide lines. Avoid sunglasses, heavy shadows and cropped hair when the receiving authority requires a neutral document photo.</p></div>}
        </div>

        <aside className="lg:col-span-5 rounded-2xl border border-outline-variant/20 bg-surface-low p-5 sm:p-7 lg:sticky lg:top-24"><h2 className="text-xl font-headline font-bold text-white">4. Download a finished file</h2><div className="mt-5 grid grid-cols-2 gap-3"><label className="text-xs text-zinc-400">Resolution<select value={dpi} onChange={event => setDpi(Number(event.target.value))} className="mt-2 w-full rounded-lg border border-outline-variant/30 bg-surface-high px-3 py-3 text-sm text-white">{[300, 600].filter(value => value >= spec.minDpi).map(value => <option key={value} value={value}>{value} DPI · {specPixels(spec, value).width} × {specPixels(spec, value).height}px</option>)}</select></label><label className="text-xs text-zinc-400">Print sheet<select value={sheetId} onChange={event => setSheetId(event.target.value as SheetId)} className="mt-2 w-full rounded-lg border border-outline-variant/30 bg-surface-high px-3 py-3 text-sm text-white">{spec.sheets.map(id => <option key={id} value={id}>{SHEET_LABELS[id]}</option>)}</select></label></div><div className="mt-5 rounded-xl bg-surface-high p-4"><p className="text-sm text-white"><FileImage className="inline w-4 h-4 mr-2 text-primary"/>Single photo: {output.width} × {output.height}px</p><p className="mt-2 text-sm text-zinc-400"><Printer className="inline w-4 h-4 mr-2 text-primary"/>Sheet: repeated copies with cut marks</p></div><div className="mt-5 grid gap-3"><button type="button" disabled={!image} onClick={exportPhoto} className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 font-bold text-black disabled:cursor-not-allowed disabled:opacity-40"><Download className="w-4 h-4"/>Download exact-size photo</button><button type="button" disabled={!image} onClick={exportSheet} className="inline-flex items-center justify-center gap-2 rounded-lg border border-primary/40 px-5 py-3 font-semibold text-primary disabled:cursor-not-allowed disabled:opacity-40"><Printer className="w-4 h-4"/>Download printable sheet</button></div><p className="mt-5 text-xs leading-relaxed text-zinc-500">The tool creates a file; it does not certify that a particular authority will accept it. Check the receiving authority's current rules before submitting.</p></aside>
      </section>

      <section className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6"><article className="rounded-xl border border-outline-variant/20 bg-surface-low p-6"><h2 className="text-2xl font-headline font-bold text-white">Published specification</h2><dl className="mt-5 grid grid-cols-2 gap-y-3 text-sm"><dt className="text-zinc-500">Printed size</dt><dd className="text-white">{spec.sizeMm.width} × {spec.sizeMm.height} mm</dd><dt className="text-zinc-500">Background</dt><dd className="text-white">{spec.background}</dd><dt className="text-zinc-500">Head height</dt><dd className="text-white">{spec.headHeightMm ? `${spec.headHeightMm.min}–${spec.headHeightMm.max} mm` : 'Not stated'}</dd><dt className="text-zinc-500">Headroom</dt><dd className="text-white">{spec.headroomMm ? `${spec.headroomMm.min}–${spec.headroomMm.max} mm` : 'Not stated'}</dd></dl><p className="mt-5 text-xs text-zinc-500">Verified {spec.sources.length > 1 ? 'against multiple sources' : 'from one source'} · checked {spec.sources[0]?.retrievedAt}</p></article><article className="rounded-xl border border-outline-variant/20 bg-surface-low p-6"><h2 className="text-2xl font-headline font-bold text-white">What to check</h2><ul className="mt-5 space-y-3 text-sm text-zinc-300"><li>✓ Face the camera with even lighting and no strong shadows.</li><li>✓ Keep the crown and chin between the guide lines.</li><li>✓ Confirm the destination authority accepts this exact format.</li></ul><div className="mt-5 flex flex-wrap gap-3">{spec.sources.map(source => <a key={source.url + source.quote} href={source.url} target="_blank" rel="noreferrer" className="text-xs text-primary underline">Source ↗</a>)}</div></article></section>
    </main>
  </>;
}
