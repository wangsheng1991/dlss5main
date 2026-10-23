// Run from assets/ after installing playwright-core in an external work directory.
// PLAYWRIGHT_MODULE=/absolute/path/to/playwright-core/index.js CHROME_PATH=/path/to/chrome node reproduce-capture.mjs
import fs from 'node:fs';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE || 'playwright-core');
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH});
const page=await browser.newPage({viewport:{width:1280,height:820},deviceScaleFactor:1});
await page.setContent(fs.readFileSync('audit.html','utf8'));
await page.locator('img').evaluateAll(imgs=>Promise.all(imgs.map(x=>x.decode())));
await page.screenshot({path:'reproduced-reference.png'});
await page.screenshot({path:'reproduced-compressed.jpg',type:'jpeg',quality:25});
console.log(JSON.stringify({browser:browser.version(),viewport:[1280,820],deviceScaleFactor:1,jpegQuality:25}));
await browser.close();
