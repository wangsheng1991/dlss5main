import {chromium} from '/Users/wangsheng/code/ark/roomredeginv2/node_modules/playwright/index.mjs';
import fs from 'node:fs';
const base=process.env.CWV_BASE||'https://www.dlss5nvidia.com', label=process.argv[2]||'before';
const paths=process.env.CWV_PATHS?JSON.parse(process.env.CWV_PATHS):['/','/download','/blog/core-game-frame-style-reference','/blog/core-two-reference-room-workflow','/blog/core-redraw-review-checklist','/visual-enhancer'];
const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});const results=[];
for(const path of paths)for(let run=1;run<=2;run++){
 const ctx=await browser.newContext({viewport:{width:1440,height:900},locale:'en-US'});const page=await ctx.newPage();
 await page.addInitScript(()=>{
  const trace=window.__cwv={navigation:[],lcp:[],shifts:[],dom:[],rects:[]};const rect=e=>{if(!e)return null;const r=e.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height}};
  const desc=e=>e?.nodeType===1?e.tagName+'.'+e.className+' '+e.textContent?.slice(0,100):null;
  new PerformanceObserver(list=>trace.navigation.push(...list.getEntries().map(e=>e.toJSON()))).observe({type:'navigation',buffered:true});
  new PerformanceObserver(list=>trace.lcp.push(...list.getEntries().map(e=>({...e.toJSON(),element:e.element?.outerHTML?.slice(0,700)})))).observe({type:'largest-contentful-paint',buffered:true});
  new PerformanceObserver(list=>trace.shifts.push(...list.getEntries().map(e=>({value:e.value,startTime:e.startTime,hadRecentInput:e.hadRecentInput,sources:e.sources?.map(s=>({node:desc(s.node),previousRect:s.previousRect.toJSON(),currentRect:s.currentRect.toJSON(),observedRect:rect(s.node)}))})))).observe({type:'layout-shift',buffered:true});
  new MutationObserver(records=>{const meaningful=records.filter(r=>r.type==='childList'&&(r.addedNodes.length||r.removedNodes.length));if(meaningful.length)trace.dom.push({time:performance.now(),changes:meaningful.slice(0,20).map(r=>({target:desc(r.target),added:[...r.addedNodes].map(desc).filter(Boolean).slice(0,8),removed:[...r.removedNodes].map(desc).filter(Boolean).slice(0,8)}))});}).observe(document,{subtree:true,childList:true});
  let last='';function sample(){const state={root:rect(document.querySelector('#root')),main:rect(document.querySelector('main')),footer:rect(document.querySelector('footer.bg-surface-lowest')),navLinks:rect(document.querySelector('div.flex.items-center.gap-8')),fallback:[...document.querySelectorAll('div')].find(e=>e.textContent==='Loading…')?.outerHTML};const key=JSON.stringify(state);if(key!==last){trace.rects.push({time:performance.now(),...state});last=key;}requestAnimationFrame(sample)}requestAnimationFrame(sample);
 });
 try{
 const started=new Date().toISOString();const response=await page.goto(base+path,{waitUntil:'load',timeout:60000});await page.waitForTimeout(10000);
 const raw=await page.evaluate(()=>({...window.__cwv,resources:performance.getEntriesByType('resource').map(e=>e.toJSON()),ua:navigator.userAgent}));let cls=0,total=0,start=0,last=0;
 for(const e of raw.shifts.filter(e=>!e.hadRecentInput)){if(e.startTime-last<1000&&e.startTime-start<5000)total+=e.value;else{start=e.startTime;total=e.value;}last=e.startTime;cls=Math.max(cls,total)}
 const result={path,run,started,status:response.status(),ttfb:raw.navigation.at(-1)?.responseStart,lcp:raw.lcp.at(-1)?.startTime,cls,raw};results.push(result);fs.writeFileSync(`/tmp/cwv-layout-fix-20261023/${label}.json`,JSON.stringify(results,null,2));console.log(JSON.stringify({...result,raw:undefined}));
 if(run===1)await page.screenshot({path:`/tmp/cwv-layout-fix-20261023/${label}-${path.replaceAll('/','_')||'home'}.png`});
 }catch(e){console.log(JSON.stringify({path,run,error:e.message}));}finally{await ctx.close()}
}
await browser.close();
