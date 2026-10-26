import {execFileSync} from 'node:child_process';
import fs from 'node:fs';import crypto from 'node:crypto';import assert from 'node:assert/strict';
import {chromium} from '/Users/wangsheng/code/ark/roomredeginv2/node_modules/playwright/index.mjs';
const dir='docs/roi-answer-blocks-20261026',base=JSON.parse(fs.readFileSync(dir+'/head-snapshot.json'));
const studioHead=execFileSync('git',['show','HEAD:src/content/studioPage.ts'],{encoding:'utf8'});
const originalJsH1=[...studioHead.matchAll(/'hero.h1': '([^']+)'/g)].map(m=>m[1].replace(/<[^>]+>/g,''));
const paths=['/download','/zh/download','/visual-enhancer','/zh/visual-enhancer'];
const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
for(const js of [false,true]) for(const path of paths){const context=await browser.newContext({javaScriptEnabled:js,locale:path.startsWith('/zh/')?'zh-CN':'en-US'});const page=await context.newPage();await page.route('**/api/**',r=>r.request().method()==='POST'?r.abort():r.continue());const res=await page.goto('http://127.0.0.1:4319'+path);if(js)await page.waitForTimeout(4000);
const r=await page.evaluate(({path,old})=>{
const selector=path.endsWith('/download')?'[data-download-apk-answer]':'[data-enhancer-short-answers]';const block=document.querySelector(selector);const prior=new DOMParser().parseFromString(old.head+'</head><body>'+old.main+'</body>','text/html');
const headFields=d=>({title:d.querySelector('title').textContent,h1:d.querySelector('h1').textContent,canonical:d.querySelector('link[rel=canonical]')?.getAttribute('href'),alternates:[...d.querySelectorAll('link[hreflang]')].map(x=>x.outerHTML),robots:d.querySelector('meta[name=robots]')?.getAttribute('content')||''});
const schema=[...document.querySelectorAll('script[type="application/ld+json"]')].map(x=>JSON.parse(x.textContent));
const count=s=>path.startsWith('/zh/')?(s.match(/[\u3400-\u9fff]/g)||[]).length:s.trim().split(/\s+/).length;
const text=block?.textContent||'';const answers=[...block.querySelectorAll('article p')].map(x=>x.textContent);
const before=prior.querySelector('main').cloneNode(true),after=document.querySelector('main').cloneNode(true);after.querySelector(selector)?.remove();for(const m of [before,after])m.querySelectorAll('script').forEach(x=>x.remove());
return {h1:document.querySelectorAll('h1').length,main:document.querySelectorAll('main').length,head:headFields(document),priorHead:headFields(prior),text,count:count(text),answerWords:answers.map(a=>a.split(/\s+/).length),faqCount:schema.filter(s=>s['@type']==='FAQPage').length,answersInSchema:answers.every(a=>JSON.stringify(schema).includes(a)),oldMainTextPreserved:before.textContent===after.textContent};
},{path,old:base[path.slice(1)+'/index.html']});assert.equal(res.status(),200);assert.equal(r.h1,1);assert.equal(r.main,1);assert.equal(r.head.title,r.priorHead.title);assert.equal(r.head.h1,js&&path.endsWith('/download')?originalJsH1[path.startsWith('/zh/')?1:0]:r.priorHead.h1);assert.equal(r.head.canonical,r.priorHead.canonical);assert.equal(r.head.robots,r.priorHead.robots);
if(!js){assert(r.oldMainTextPreserved);assert.deepEqual(r.head.alternates,r.priorHead.alternates);}if(path.includes('visual-enhancer')){assert.equal(r.faqCount,1);assert(r.answersInSchema);assert.equal(r.answerWords.length,5);assert(r.answerWords.every(n=>n<=60));}delete r.priorHead;console.log(JSON.stringify({path,js,status:res.status(),...r}));await context.close();}
await browser.close();
const changed=[];for(const [file,b]of Object.entries(base)){const html=fs.readFileSync('dist/'+file,'utf8');const m=html.match(/<main\b[\s\S]*?<\/main>/)?.[0];if(crypto.createHash('sha256').update(m).digest('hex')!==b.sha256)changed.push('/'+file.replace('/index.html',''));}
assert.deepEqual(changed.sort(),paths.sort());console.log('MAIN-SHA256 '+JSON.stringify({changed,unchanged:Object.keys(base).length-changed.length}));
