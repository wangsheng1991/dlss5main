import { chromium } from '/Users/wangsheng/code/ark/roomredeginv2/node_modules/playwright/index.mjs';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const url = process.argv[2] || 'https://www.dlss5nvidia.com/download';
const out = process.argv[3] || '/tmp/download-fold-b.png';
const browser = await chromium.launch({ executablePath: CHROME, headless: true });
const ctx = await browser.newContext({
  viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, locale: 'en-US',
  userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
});
const page = await ctx.newPage();
await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 90000 });
await page.waitForTimeout(7000);

const r = await page.evaluate(() => {
  const vh = window.innerHeight;
  const box = (el) => { const b = el.getBoundingClientRect(); return { top: Math.round(b.top), bottom: Math.round(b.bottom), h: Math.round(b.height) }; };
  const inFold = (el) => { const b = el.getBoundingClientRect(); return b.top < vh && b.bottom > 0; };
  const main = document.querySelector('main');
  const h1 = main.querySelector('h1');
  const heroLinks = [...main.querySelectorAll('section a')].filter(a => a.closest('section') === main.querySelector('section'));
  const answerGrid = main.querySelector('section[aria-label]');
  const intent = document.querySelector('[data-download-intent]');
  const kitDl = document.querySelector('[data-download-intent] a[download]');
  return {
    vh,
    h1Count: document.querySelectorAll('h1').length,
    mainCount: document.querySelectorAll('main').length,
    panel: document.querySelector('[data-download-action-panel]') ? box(document.querySelector('[data-download-action-panel]')) : null,
    actionLinks: [...document.querySelectorAll('[data-download-action-panel] [data-action]')].map(a=>({action:a.dataset.action,...box(a),inFold:inFold(a)})),
    h1: { ...box(h1), text: h1.textContent.trim().slice(0, 90) },
    heroSub: main.querySelector('h1 + p, h1 ~ p') ? box(main.querySelector('h1 ~ p')) : null,
    answerGrid: answerGrid ? { ...box(answerGrid), label: answerGrid.getAttribute('aria-label'), cards: answerGrid.children.length } : null,
    heroLinks: heroLinks.map(a => ({ text: a.textContent.trim().slice(0, 40), href: a.getAttribute('href'), ...box(a), inFold: inFold(a) })),
    heroFigure: main.querySelector('figure') ? box(main.querySelector('figure')) : null,
    intent: intent ? box(intent) : null,
    kitDl: kitDl ? { text: kitDl.textContent.trim().slice(0, 50), ...box(kitDl), inFold: inFold(kitDl) } : null,
    anyLinkInFold: [...main.querySelectorAll('a')].filter(inFold).map(a => ({ text: a.textContent.trim().slice(0, 40), href: a.getAttribute('href'), ...box(a) })),
    anyButtonInFold: [...main.querySelectorAll('button')].filter(inFold).map(b => ({ text: b.textContent.trim().slice(0, 40), ...box(b) })),
    horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth + 1,
    scrollWidth: document.documentElement.scrollWidth,
  };
});
await page.screenshot({ path: out, fullPage: false });
console.log(JSON.stringify(r, null, 2));
await browser.close();
