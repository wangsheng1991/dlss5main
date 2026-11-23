/**
 * Renders one material board (素材对照板) per case in cases.json.
 *
 * A board exists to be circled by a human: it says what the picture should make a viewer understand,
 * then puts 人物 / 场景 / 构图 on one line with exactly two notes each — what the source can provide,
 * and what breaks when it is missing. Nothing here is generated: every thumbnail is an existing file
 * under public/, and an empty slot is drawn as an empty slot.
 *
 * Run with the local Playwright install (this repo has no npm network access):
 *   node render-boards.mjs <repoRoot> <outDir>
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { pathToFileURL } from 'node:url';
import { chromium } from '/Users/wangsheng/code/ark/roomredeginv2/node_modules/playwright/index.mjs';

const repo = process.argv[2];
const out = process.argv[3];
const here = new URL('.', import.meta.url).pathname;
mkdirSync(out, { recursive: true });

const data = JSON.parse(readFileSync(`${here}cases.json`, 'utf8'));
const asset = rel => (rel ? pathToFileURL(`${repo}/public/${rel}`).href : '');

const W = 1600;
const H = 1200;

const STATE = {
  have:       { label: '有 · 自有素材', color: '#d9f99d', ink: '#0b0f0a' },
  half:       { label: '半缺 · 有图但不合格', color: '#fb923c', ink: '#1a0d02' },
  capability: { label: '产品能力 · 不用素材', color: '#93c5fd', ink: '#0b0f0a' },
  selfshot:   { label: '可自拍', color: '#fcd34d', ink: '#0b0f0a' },
  missing:    { label: '缺 · 需外部来源', color: '#f87171', ink: '#1a0b0b' },
  red:        { label: '不能用 · 权利不在我们', color: '#ef4444', ink: '#fff5f5' },
};

const css = `
* { margin:0; padding:0; box-sizing:border-box; }
body { background:#0b0f0a; color:#f4f4f5; font-family:'Helvetica Neue','PingFang SC','Hiragino Sans GB',sans-serif; -webkit-font-smoothing:antialiased; }
.stage { width:${W}px; height:${H}px; padding:48px 56px 40px; display:flex; flex-direction:column;
         background:radial-gradient(120% 90% at 82% 4%, #1b2618 0%, #0b0f0a 60%); }
.top { display:flex; align-items:center; justify-content:space-between; }
.eyebrow { font-family:'SF Mono',Menlo,monospace; font-size:17px; letter-spacing:.18em; color:#d9f99d; text-transform:uppercase; }
.chip { font-family:'SF Mono',Menlo,monospace; font-size:16px; padding:6px 14px; border-radius:999px;
        border:1px solid rgba(255,255,255,.22); color:#c7cbc4; }
.chip.structural { border-color:#ef4444; color:#fca5a5; }
.chip.sourcing { border-color:#fcd34d; color:#fde68a; }
h1 { font-weight:700; letter-spacing:-.02em; line-height:1.14; margin-top:14px; }
.claim { margin-top:10px; font-size:23px; line-height:1.42; color:#a8ada2; max-width:1460px; }
.claim b { color:#d9f99d; font-weight:600; }
.grid { display:flex; gap:16px; margin-top:26px; }
.slot { flex:1; min-width:0; background:rgba(255,255,255,.035); border:1px solid rgba(255,255,255,.10); border-radius:14px; padding:14px 14px 12px; display:flex; flex-direction:column; }
.slot.red-slot { background:rgba(239,68,68,.06); border-color:rgba(239,68,68,.35); }
.kind { font-family:'SF Mono',Menlo,monospace; font-size:14px; letter-spacing:.14em; color:#d9f99d; }
.what { font-size:18px; line-height:1.3; margin-top:6px; height:52px; color:#e8e8e6; font-weight:600; }
.badge { display:inline-block; align-self:flex-start; font-size:14px; font-weight:700; padding:4px 10px; border-radius:999px; margin:2px 0 10px; }
.thumb { height:300px; border-radius:10px; overflow:hidden; background:#10140e; border:1px solid rgba(255,255,255,.16); position:relative; }
.thumb img { width:100%; height:100%; object-fit:cover; display:block; }
.empty { height:300px; border-radius:10px; border:2px dashed rgba(248,113,113,.55); background:rgba(248,113,113,.05);
         display:flex; align-items:center; justify-content:center; font-size:44px; color:rgba(248,113,113,.7); font-weight:700; }
.empty.cap { border-color:rgba(147,197,253,.5); background:rgba(147,197,253,.05); color:rgba(147,197,253,.75); font-size:22px; letter-spacing:.1em; }
.empty.shot { border-color:rgba(252,211,77,.5); background:rgba(252,211,77,.05); color:rgba(252,211,77,.8); font-size:22px; letter-spacing:.1em; }
.notes { margin-top:12px; font-size:16px; line-height:1.5; }
.notes .p { color:#d4d4d8; }
.notes .b { color:#f0a9a9; margin-top:9px; }
.notes .tag { font-family:'SF Mono',Menlo,monospace; font-size:12px; letter-spacing:.1em; color:#8b9186; display:block; margin-bottom:2px; }
.foot { margin-top:22px; display:flex; align-items:flex-end; gap:24px; }
.concl { flex:1; font-size:22px; line-height:1.45; color:#f4f4f5; }
.concl b { color:#d9f99d; }
.circle { margin-top:12px; display:flex; gap:26px; font-family:'SF Mono',Menlo,monospace; font-size:15px; color:#9aa094; }
.circle span { border-bottom:1px dotted rgba(255,255,255,.28); padding-bottom:3px; }
.res { width:180px; flex:none; }
.res .thumb { height:180px; }
.res .cap { font-size:13px; color:#8b9186; margin-top:6px; line-height:1.35; }
.band { margin-top:auto; border-top:1px solid rgba(255,255,255,.12); padding-top:14px; display:flex; gap:30px; align-items:flex-start; }
.band .col { flex:1; font-size:14px; line-height:1.5; color:#8b9186; }
.band .col b { display:block; color:#c7cbc4; font-size:13px; font-family:'SF Mono',Menlo,monospace; letter-spacing:.08em; margin-bottom:4px; }
.band .meta { flex:none; width:250px; text-align:right; font-family:'SF Mono',Menlo,monospace; font-size:13px; color:#6f756a; line-height:1.6; }
`;

const slot = s => {
  const st = STATE[s.state] || STATE.missing;
  const img = s.file
    ? `<div class="thumb"><img src="${asset(s.file)}" alt=""></div>`
    : `<div class="empty ${s.state === 'capability' ? 'cap' : s.state === 'selfshot' ? 'shot' : ''}">${
        s.state === 'capability' ? '无素材需求' : s.state === 'selfshot' ? '自拍 1 张' : '空'}</div>`;
  return `<div class="slot ${s.state === 'red' ? 'red-slot' : ''}">
    <div class="kind">${s.kind}</div>
    <div class="what">${s.label}</div>
    <div class="badge" style="background:${st.color};color:${st.ink}">${st.label}</div>
    ${img}
    <div class="notes">
      <span class="tag">能提供</span><div class="p">${s.provides}</div>
      <span class="tag" style="margin-top:9px">缺了会怎么崩</span><div class="b">${s.breaks}</div>
    </div>
  </div>`;
};

const html = c => `<!doctype html><meta charset="utf-8"><style>${css}
  h1 { font-size:${c.intent.length > 26 ? 40 : 46}px; max-width:${c.intent.length > 30 ? 1400 : 1180}px; }
</style>
<div class="stage">
  <div class="top">
    <div class="eyebrow">素材对照板 · 案例 ${c.id.toUpperCase()}</div>
    <div class="chip ${c.blocking === 'none' ? '' : c.blocking}">${c.runState}${
      c.blocking === 'structural' ? ' · 结构性做不了' : c.blocking === 'sourcing' ? ' · 差一张素材' : ''}</div>
  </div>
  <h1>${c.intent}</h1>
  <div class="claim"><b>要让人看见：</b>${c.claim}</div>
  <div class="grid">${c.slots.map(slot).join('')}</div>
  <div class="foot">
    <div style="flex:1">
      <div class="concl">${c.conclusion}</div>
      <div class="circle"><span>○ 我会用这张（写格号）</span><span>○ 这一组都不行</span><span>○ 可以直接开做，不用再找图</span></div>
    </div>
    ${c.result ? `<div class="res"><div class="thumb"><img src="${asset(c.result.file)}" alt=""></div>
        <div class="cap">${c.result.note}</div></div>` : ''}
  </div>
  <div class="band">
    <div class="col"><b>你圈的落点 → 下一步改什么</b>你会用的图没被搜回来 → 改搜索词和素材来源</div>
    <div class="col"><b>&nbsp;</b>已在候选里却被选错 → 改筛选，并记下淘汰理由</div>
    <div class="col"><b>&nbsp;</b>素材对、生成仍跑偏 → 查模型有没有用对每张参考</div>
    <div class="meta">第 ${data.cases.findIndex(x => x.id === c.id) + 1} / ${data.cases.length} 张<br>${data.generated} · 素材板第一版</div>
  </div>
</div>`;

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const written = [];
for (const c of data.cases) {
  const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 2 });
  // The HTML that a board is rendered from is an intermediate: it goes to the temp dir so the
  // committed folder holds only the plate a human circles.
  const file = `${tmpdir()}/material-board-${c.id}.html`;
  writeFileSync(file, html(c));
  await page.goto(pathToFileURL(file).href, { waitUntil: 'load' });
  await page.evaluate(() => Promise.all([...document.images].map(image => image.decode().catch(() => {}))));
  const name = `${c.id}.png`;
  await page.screenshot({ path: `${out}/${name}`, clip: { x: 0, y: 0, width: W, height: H } });
  if (process.platform === 'darwin') execFileSync('sips', ['--resampleWidth', String(W), `${out}/${name}`, '--out', `${out}/${name}`], { stdio: 'ignore' });
  written.push(name);
  console.log(`${name}  ${W}×${H}  ${c.slots.length} slots  ${c.blocking}`);
  await page.close();
}
await browser.close();

const counts = {};
for (const c of data.cases) {
  for (const s of c.slots) counts[s.state] = (counts[s.state] || 0) + 1;
}
const startable = data.cases.filter(c => c.blocking === 'none').length;
const counts2 = {};
for (const c of data.cases) if (c.blocking !== 'none') counts2[c.blocking] = (counts2[c.blocking] || 0) + 1;
console.log(`\nboards: ${written.length}   cases: ${data.cases.length}   can-start: ${startable}/${data.cases.length}`);
console.log(`slot states: ${Object.entries(counts).map(([k, v]) => `${k}=${v}`).join('  ')}`);
const sceneGap = data.cases.filter(c => c.slots.some(s => s.kind.startsWith('场景') && ['missing', 'red'].includes(s.state))).length;
console.log(`cases with an unfillable scene slot: ${sceneGap}/${data.cases.length}`);
console.log(`blocked by: ${Object.entries(counts2).map(([k, v]) => `${k}=${v}`).join('  ')}`);
