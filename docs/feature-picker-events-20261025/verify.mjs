import { chromium } from '/Users/wangsheng/code/ark/roomredeginv2/node_modules/playwright/index.mjs';
import assert from 'node:assert/strict';
const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const base=process.argv[2]||'http://127.0.0.1:5173';
for(const prefix of ['', '/zh']) {
 const context=await browser.newContext({locale:'en-US'});const page=await context.newPage();
 await page.goto(`${base}${prefix}/blog/dlss5-vs-dlss4-vs-fsr4-comparison-2026`,{waitUntil:'domcontentloaded'});
 const picker=page.locator('[data-feature-picker]');const sels=picker.locator('select');await sels.first().waitFor();
 const events=()=>page.evaluate(()=>Array.from(window.dataLayer||[]).map(x=>Array.from(x)).filter(x=>String(x[1]).startsWith('feature_picker_')));
 assert.equal((await events()).length,0);
 await sels.nth(0).selectOption('speed');await sels.nth(1).selectOption('50');assert.equal((await events()).length,0);
 await sels.nth(2).selectOption('yes');await page.waitForTimeout(100);assert.equal((await events()).length,1);
 await sels.nth(2).selectOption('yes');await page.waitForTimeout(100);assert.equal((await events()).length,1);
 await sels.nth(2).selectOption('unknown');await page.waitForTimeout(100);
 await sels.nth(2).selectOption('yes');await page.waitForTimeout(100);assert.equal((await events()).length,3);
 await page.evaluate(()=>document.addEventListener('click',e=>{if(e.target.closest('a'))e.preventDefault();},true));
 await picker.locator('[data-feature-results] a').filter({hasText:'NVIDIA DLSS 5'}).first().click();
 const actual=await events();assert.equal(actual.length,4);assert.equal(actual[3][1],'feature_picker_source_click');
 console.log(prefix||'EN',JSON.stringify(actual));console.log('PASS: no initial/partial event; complete once; unchanged deduped; A→B→A reports; source click reports');await context.close();
}
for(const prefix of ['', '/zh']){
 const context=await browser.newContext({javaScriptEnabled:false,locale:'en-US'});const page=await context.newPage();await page.goto(`https://www.dlss5nvidia.com${prefix}/blog/dlss5-vs-dlss4-vs-fsr4-comparison-2026`,{waitUntil:'domcontentloaded'});
 const picker=page.locator('[data-feature-picker]');console.log('NO-JS',prefix||'EN',await picker.count()?await picker.innerText():'JS 关闭时不可读');await context.close();
}
await browser.close();
