import { chromium } from '/Users/wangsheng/code/ark/roomredeginv2/node_modules/playwright/index.mjs';
const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
try {
  for (const route of ['/download', '/zh/download']) {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 }, locale: 'en-US' });
    await page.goto('http://127.0.0.1:5173' + route, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(7000);
    await page.evaluate(() => {
      window.__actionEvents = [];
      window.gtag = (...args) => window.__actionEvents.push(args);
      // Stop only test navigation/download; React's onClick still runs through the real bridge.
      document.addEventListener('click', e => { if (e.target.closest('a')) e.preventDefault(); }, true);
    });
    for (const action of ['browser', 'kit', 'studio']) await page.locator(`[data-download-action-panel] [data-action="${action}"]`).click();
    await page.locator('[data-download-intent] a[download="dlss5-style-recipe-kit-v2.zip"]').click();
    const events = await page.evaluate(() => window.__actionEvents.filter(e => ['tool_cta_click','download_click','studio_request_click'].includes(e[1])).map(e=>({name:e[1],...e[2]})));
    const expected = [ ['tool_cta_click','download_hero','game-character-style'], ['download_click','download_hero','recipe-kit-v2'], ['studio_request_click','download_hero',null], ['download_click','kit_section','recipe-kit-v2'] ];
    if (events.length !== expected.length || events.some((e,i)=>e.name!==expected[i][0]||e.surface!==expected[i][1]||(expected[i][2]&&(e.tool||e.file)!==expected[i][2]))) throw new Error(JSON.stringify(events));
    console.log(JSON.stringify({route,events}));
    await page.close();
  }
  const page=await browser.newPage({viewport:{width:1440,height:900},locale:'en-US'});
  await page.goto('http://127.0.0.1:5173/download',{waitUntil:'domcontentloaded'});await page.waitForTimeout(7000);
  console.log(JSON.stringify({desktopColumns:await page.locator('[data-download-action-panel] .grid').evaluate(e=>getComputedStyle(e).gridTemplateColumns)}));
  await page.screenshot({path:'/tmp/download-action-panel-20261023/local-desktop.png'});
} finally { await browser.close(); }
