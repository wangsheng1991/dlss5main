import {chromium} from '/Users/wangsheng/code/ark/roomredeginv2/node_modules/playwright/index.mjs';
import fs from 'node:fs';import assert from 'node:assert/strict';
const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});const results=[];
for(const [mode,port] of [['old-firebase-blocked',4195],['fixed-slow-route',4194]])for(const path of ['/download','/blog/core-two-reference-room-workflow','/visual-enhancer']){
 const ctx=await browser.newContext({viewport:{width:1440,height:900},locale:'en-US'});const page=await ctx.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>{window.shifts=[];new PerformanceObserver(l=>window.shifts.push(...l.getEntries().filter(e=>!e.hadRecentInput).map(e=>({time:e.startTime,value:e.value,sources:e.sources.map(s=>s.node?.tagName+'.'+s.node?.className)})))).observe({type:'layout-shift',buffered:true})});
 await ctx.route('**/assets/*.js',async route=>{const url=route.request().url();if(mode==='old-firebase-blocked'&&/\/firebase[^/]*\.js/.test(url))return route.abort();if(/\/(Download-|Blog-|VisualEnhancer-)/.test(url))await new Promise(r=>setTimeout(r,3000));return route.continue()});
 await page.goto(`http://127.0.0.1:${port}${path}`,{waitUntil:'domcontentloaded'});
 if(mode==='fixed-slow-route'){
  await page.locator('[data-prerender-fallback] main').waitFor({state:'visible'});const early=await page.evaluate(()=>({main:document.querySelector('main').getBoundingClientRect().toJSON(),footer:document.querySelector('footer.bg-surface-lowest').getBoundingClientRect().toJSON(),text:document.querySelector('[data-prerender-fallback]').textContent}));assert(early.footer.y>900);assert(early.text.length>500);assert(!early.text.includes('Loading…'));
  await page.screenshot({path:`/tmp/cwv-layout-fix-20261023/retained-${path.replaceAll('/','_')}.png`});
  await page.locator('[data-prerender-fallback]').waitFor({state:'detached',timeout:15000});assert.equal(await page.locator('main').count(),1);
 }
 await page.waitForTimeout(7000);const result={mode,path,main:await page.locator('main').count(),shifts:await page.evaluate(()=>window.shifts),errors};results.push(result);console.log(JSON.stringify(result));
 if(mode==='old-firebase-blocked')assert(result.main===1&&result.shifts.some(x=>x.value>.6));else assert(result.shifts.reduce((s,x)=>s+x.value,0)<.1);
 await ctx.close();
}
await browser.close();fs.writeFileSync('/tmp/cwv-layout-fix-20261023/regression.json',JSON.stringify(results,null,2));
