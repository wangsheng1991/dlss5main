/**
 * Renders the GTA VI campaign promo assets from the site's own real duo-portrait runs.
 *
 * Every picture is composed from files that already exist in `public/examples/together/`: the two
 * references that were uploaded and the four stored results of real runs. Nothing is re-generated,
 * upscaled or retouched here — the renderer only lays them out with labels, so a caption can never
 * describe something the file does not contain.
 *
 * Run with the local Playwright install (this repo has no npm network access):
 *   node render-promo-assets.mjs <repoRoot> <outDir>
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { chromium } from '/Users/wangsheng/code/ark/roomredeginv2/node_modules/playwright/index.mjs';

const repo = process.argv[2];
const out = process.argv[3];
mkdirSync(out, { recursive: true });

const asset = name => pathToFileURL(`${repo}/public/examples/together/${name}`).href;

const COPY = {
  zh: {
    eyebrow: '同人双人合影 · GTA6 专页',
    title: '两张参考图，一张同框图',
    sub: '你的照片 + 一张角色截图，选好姿势，一次生成',
    ref1: '① 你的照片',
    ref2: '② 角色截图（主机导出，未裁）',
    result: '一次真实运行的结果',
    arrow: '→',
    pose: '姿势：并肩 · 1024 × 1024',
    note: '未修图、未放大。脸、手、相接的位置会在文里说明哪里会漂。',
    foot: 'dlss5nvidia.com/zh/gta6-character-photo',
    detailTitle: '先看这三处',
    detailSub: '脸 · 手 · 两个人相接的位置',
    detailBody: '合成图在这三处最容易露馅：两张参考图的光不一样时，脸色会和脖子对不上；手搭在肩上的地方，指头数量和袖口边缘最先糊；两个人挨着的位置，衣服和皮肤之间常常没有真正的接触阴影。',
    detailA: '脸（原尺寸）',
    detailB: '相接处（原尺寸）',
    detailC: '手（原尺寸）',
    poses: ['拥抱', '并肩', '背靠背'],
    posesTitle: '同一对人，三个姿势',
  },
  en: {
    eyebrow: 'Fan-made duo portrait · GTA VI page',
    title: 'Two references in. One picture out.',
    sub: 'Your photo plus a console screenshot of the character, one pose, one run',
    ref1: '1 · your photo',
    ref2: '2 · character still (console export)',
    result: 'One real run, not retouched',
    arrow: '→',
    pose: 'Pose: side by side · 1024 × 1024',
    note: 'Not retouched, not upscaled. The article lists where faces, hands and the join can drift.',
    foot: 'dlss5nvidia.com/gta6-character-photo',
    detailTitle: 'Check these three first',
    detailSub: 'face · hands · the join between the two bodies',
    detailBody: 'A composite gives itself away in three places: when the two references were lit differently the face stops matching the neck; where a hand rests on a shoulder, the finger count and the sleeve edge blur first; and along the join there is rarely a real contact shadow between cloth and skin.',
    detailA: 'Face, at output size',
    detailB: 'The join, at output size',
    detailC: 'Hands, at output size',
    poses: ['hugging', 'side by side', 'back to back'],
    posesTitle: 'The same pair, three poses',
  },
};

const css = `
* { margin: 0; padding: 0; box-sizing: border-box; }
body { background: #0b0f0a; color: #f4f4f5; font-family: 'Helvetica Neue', 'PingFang SC', 'Hiragino Sans GB', sans-serif; -webkit-font-smoothing: antialiased; }
.stage { position: relative; overflow: hidden; background: radial-gradient(120% 90% at 78% 8%, #1d2718 0%, #0b0f0a 62%); }
.eyebrow { color: #d9f99d; font-size: 20px; letter-spacing: .22em; text-transform: uppercase; }
h1 { font-weight: 700; letter-spacing: -.02em; line-height: 1.05; }
.sub { color: #c7cbc4; line-height: 1.5; }
.label { font-size: 19px; color: #d4d4d8; font-family: 'SF Mono', Menlo, monospace; letter-spacing: .02em; }
.frame { border: 1px solid rgba(255,255,255,.18); border-radius: 14px; overflow: hidden; background: #10140e; }
.frame img { display: block; width: 100%; height: 100%; object-fit: contain; }
.badge { position: absolute; left: 12px; bottom: 12px; background: #d9f99d; color: #10140e; font-size: 15px; font-weight: 700; padding: 6px 12px; border-radius: 999px; }
.arrow { color: #d9f99d; font-weight: 700; }
.foot { color: #9aa094; font-family: 'SF Mono', Menlo, monospace; font-size: 18px; }
`;

const frame = (src, label, height, extra = '') => `
  <div style="display:flex;flex-direction:column;gap:10px;${extra}">
    <div class="label">${label}</div>
    <div class="frame" style="height:${height}px"><img src="${src}" alt=""></div>
  </div>`;

function card(locale) {
  const c = COPY[locale];
  return `<!doctype html><meta charset="utf-8"><style>${css}
    .stage{width:1080px;height:1440px;padding:64px 64px 56px;display:flex;flex-direction:column}
    h1{font-size:${locale === 'zh' ? 66 : 52}px;margin-top:16px;max-width:940px;line-height:1.08}
    .sub{font-size:25px;margin-top:14px;max-width:900px}
    .refs{display:grid;grid-template-columns:1fr 1fr;gap:22px;margin-top:34px}
    .mid{display:flex;align-items:center;justify-content:center;margin:16px 0;font-size:40px}
    .res{position:relative;width:620px;height:620px;margin:0 auto}
  </style>
  <div class="stage">
    <div class="eyebrow">${c.eyebrow}</div>
    <h1>${c.title}</h1>
    <div class="sub">${c.sub}</div>
    <div class="refs">
      ${frame(asset('you.jpg'), c.ref1, 330)}
      ${frame(asset('character.jpg'), c.ref2, 330)}
    </div>
    <div class="mid arrow">${c.arrow}</div>
    <div class="res frame"><img src="${asset('promo-side.webp')}" alt=""><div class="badge">${c.result}</div></div>
    <div class="label" style="margin-top:26px">${c.pose}</div>
    <div class="sub" style="font-size:22px;margin-top:12px;color:#a1a69c">${c.note}</div>
    <div class="foot" style="margin-top:26px">${c.foot}</div>
  </div>`;
}

function wide(locale, width, height, sizes) {
  const c = COPY[locale];
  const [refW, resW, title, sub] = sizes;
  return `<!doctype html><meta charset="utf-8"><style>${css}
    .stage{width:${width}px;height:${height}px;padding:${height < 700 ? 40 : 56}px ${height < 700 ? 48 : 60}px ${height < 700 ? 34 : 56}px;display:flex;flex-direction:column}
    h1{font-size:${title}px;margin-top:14px;max-width:${width - 120}px}
    .sub{font-size:${sub}px;margin-top:14px}
    .row{display:flex;align-items:center;gap:${height < 700 ? 20 : 28}px;margin-top:${Math.round(height * (height < 700 ? 0.045 : 0.06))}px}
    .refs{display:flex;gap:20px}
    .res{position:relative;width:${resW}px;height:${resW}px;flex:none}
  </style>
  <div class="stage">
    <div class="eyebrow">${c.eyebrow}</div>
    <h1>${c.title}</h1>
    <div class="sub">${c.sub}</div>
    <div class="row">
      <div class="refs">
        ${frame(asset('you.jpg'), c.ref1, refW, height < 700 ? 'max-width:180px' : '')}
        ${frame(asset('character.jpg'), c.ref2, refW, height < 700 ? 'max-width:260px' : '')}
      </div>
      <div class="arrow" style="font-size:${Math.round(resW * 0.1)}px">${c.arrow}</div>
      <div class="res frame"><img src="${asset('promo-side.webp')}" alt=""><div class="badge">${c.result}</div></div>
    </div>
    <div class="label" style="margin-top:${Math.round(height * (height < 700 ? 0.03 : 0.035))}px">${c.pose}</div>
    <div class="foot" style="margin-top:auto">${c.foot}</div>
  </div>`;
}

function poses(locale) {
  const c = COPY[locale];
  const files = ['promo-hug.webp', 'promo-side.webp', 'promo-back.webp'];
  return `<!doctype html><meta charset="utf-8"><style>${css}
    .stage{width:1600px;height:600px;padding:38px 56px 30px;display:flex;flex-direction:column}
    h1{font-size:38px}
    .grid{display:grid;grid-template-columns:repeat(3,1fr);gap:22px;margin-top:20px}
    .cell .label{font-size:17px;margin-bottom:8px}
  </style>
  <div class="stage">
    <div class="eyebrow">${c.eyebrow}</div>
    <h1 style="margin-top:10px">${c.posesTitle}</h1>
    <div class="grid">
      ${files.map((file, index) => `<div class="cell"><div class="label">${c.poses[index]}</div><div class="frame" style="height:400px"><img src="${asset(file)}" alt=""></div></div>`).join('')}
    </div>
    <div class="foot" style="margin-top:auto">${c.foot}</div>
  </div>`;
}

/** True crops: the same pixels at 1:1, framed by a background viewport rather than resized. */
function detail(locale) {
  const c = COPY[locale];
  const crop = (scale, x, y, title) => `
    <div style="display:flex;flex-direction:column;gap:10px">
      <div class="label">${title}</div>
      <div class="frame" style="width:300px;height:300px;background-image:url('${asset('promo-side.webp')}');background-repeat:no-repeat;background-size:${1024 * scale}px ${1024 * scale}px;background-position:${-x * scale}px ${-y * scale}px"></div>
    </div>`;
  return `<!doctype html><meta charset="utf-8"><style>${css}
    .stage{width:1080px;height:1080px;padding:56px;display:flex;flex-direction:column}
    h1{font-size:54px}
    .sub{font-size:25px;margin-top:14px}
    .row{display:flex;gap:20px;margin-top:34px;justify-content:center}
    .cap{font-size:21px;color:#9aa094;margin-top:26px;max-width:960px;line-height:1.55}
    .body{font-size:25px;color:#d4d4d8;line-height:1.62;margin-top:26px;max-width:960px;border-left:3px solid #d9f99d;padding-left:22px}
    .src{display:flex;align-items:center;gap:18px;margin-top:auto}
  </style>
  <div class="stage">
    <div class="eyebrow">${c.eyebrow}</div>
    <h1 style="margin-top:14px">${c.detailTitle}</h1>
    <div class="sub">${c.detailSub}</div>
    <div class="row">
      ${crop(2.4, 320, 165, c.detailA)}
      ${crop(2.4, 700, 300, c.detailB)}
      ${crop(2.4, 755, 880, c.detailC)}
    </div>
    <div class="cap">${c.note}</div>
    <div class="body">${c.detailBody}</div>
    <div class="src">
      <div class="frame" style="width:120px;height:120px;flex:none"><img src="${asset('promo-side.webp')}" alt=""></div>
      <div class="foot">${c.foot}</div>
    </div>
  </div>`;
}

/** No words at all: the article cover has to read the same in both languages. */
function plain() {
  return `<!doctype html><meta charset="utf-8"><style>${css}
    .stage{width:1600px;height:900px;padding:40px;display:flex;align-items:center;justify-content:center;gap:34px}
    .refs{display:flex;flex-direction:column;gap:16px}
    .res{position:relative;width:660px;height:660px;flex:none}
  </style>
  <div class="stage">
    <div class="refs">
      <div class="frame" style="width:330px;height:290px"><img src="${asset('you.jpg')}" alt=""></div>
      <div class="frame" style="width:330px;height:290px"><img src="${asset('character.jpg')}" alt=""></div>
    </div>
    <div class="arrow" style="font-size:54px">→</div>
    <div class="res frame"><img src="${asset('promo-side.webp')}" alt=""></div>
  </div>`;
}

const shots = [
  ['compare-plain-1600x900.png', 1600, 900, () => plain()],
  ['card-zh-1080x1440.png', 1080, 1440, () => card('zh')],
  ['card-en-1080x1440.png', 1080, 1440, () => card('en')],
  ['compare-zh-1600x900.png', 1600, 900, () => wide('zh', 1600, 900, [330, 520, 52, 24])],
  ['compare-en-1600x900.png', 1600, 900, () => wide('en', 1600, 900, [330, 520, 52, 24])],
  ['og-zh-1200x630.png', 1200, 630, () => wide('zh', 1200, 630, [170, 300, 38, 20])],
  ['og-en-1200x630.png', 1200, 630, () => wide('en', 1200, 630, [170, 300, 38, 20])],
  ['poses-zh-1600x600.png', 1600, 600, () => poses('zh')],
  ['poses-en-1600x600.png', 1600, 600, () => poses('en')],
  ['detail-zh-1080x1080.png', 1080, 1080, () => detail('zh')],
  ['detail-en-1080x1080.png', 1080, 1080, () => detail('en')],
];

const browser = await chromium.launch({ channel: 'chrome', headless: true });
for (const [name, width, height, html] of shots) {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 2 });
  const file = `${out}/${name.replace(/\.png$/, '')}.html`;
  writeFileSync(file, html());
  await page.goto(pathToFileURL(file).href, { waitUntil: 'load' });
  await page.evaluate(() => Promise.all([...document.images].map(image => image.decode().catch(() => {}))));
  await page.screenshot({ path: `${out}/${name}`, clip: { x: 0, y: 0, width, height } });
  // Screenshots are taken at deviceScaleFactor 2 for crisp text, then resampled to the posting size
  // so the file the manifest declares is the file that ships. sips is macOS-only; elsewhere the
  // 2× file stays and the gate will say so.
  if (process.platform === 'darwin') execFileSync('sips', ['--resampleWidth', String(width), `${out}/${name}`, '--out', `${out}/${name}`], { stdio: 'ignore' });
  console.log(`${name}  ${width}×${height}`);
  await page.close();
}
await browser.close();
