#!/usr/bin/env node
// Node.js 18+, built-ins only. Measures encoded dimensions; no EXIF rotation or quality inference.
import { readFileSync, writeFileSync, mkdtempSync } from 'node:fs';
import { basename, resolve, join } from 'node:path';
import { createHash } from 'node:crypto';

function dimensions(b) {
  if (b.length >= 24 && b.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])) && b.toString('ascii',12,16)==='IHDR')
    return {format:'png',width:b.readUInt32BE(16),height:b.readUInt32BE(20)};
  if (b.length>=12 && b.toString('ascii',0,4)==='RIFF' && b.toString('ascii',8,12)==='WEBP') {
    for(let p=12;p+8<=b.length;) {
      const type=b.toString('ascii',p,p+4),size=b.readUInt32LE(p+4),start=p+8;
      if(start+size>b.length)throw new Error('Truncated WebP chunk');
      if(type==='VP8X'&&size>=10)return {format:'webp',width:1+b.readUIntLE(start+4,3),height:1+b.readUIntLE(start+7,3)};
      if(type==='VP8 '&&size>=10&&b.toString('hex',start+3,start+6)==='9d012a')return {format:'webp',width:b.readUInt16LE(start+6)&0x3fff,height:b.readUInt16LE(start+8)&0x3fff};
      if(type==='VP8L'&&size>=5&&b[start]===0x2f){const bits=b.readUInt32LE(start+1);return {format:'webp',width:(bits&0x3fff)+1,height:((bits>>>14)&0x3fff)+1};}
      p=start+size+(size%2);
    }
  }
  if(b.length>=4&&b[0]===0xff&&b[1]===0xd8) {
    const sof=new Set([0xc0,0xc1,0xc2,0xc3,0xc5,0xc6,0xc7,0xc9,0xca,0xcb,0xcd,0xce,0xcf]);
    let p=2;
    while(p<b.length) {
      if(b[p++]!==0xff)throw new Error('Invalid JPEG marker');
      while(b[p]===0xff)p++;
      const marker=b[p++];if(marker===0xda||marker===0xd9)break;
      if(marker===0x01||(marker>=0xd0&&marker<=0xd7))continue;
      if(p+2>b.length)break;
      const size=b.readUInt16BE(p);if(size<2||p+size>b.length)throw new Error('Truncated JPEG segment');
      if(sof.has(marker)&&size>=8)return {format:'jpg',width:b.readUInt16BE(p+5),height:b.readUInt16BE(p+3)};
      p+=size;
    }
  }
  throw new Error('Unsupported or invalid image: JPEG, PNG and WebP headers only');
}
function inspect(file) {
  const bytes=readFileSync(file),size=dimensions(bytes);
  if(!size.width||!size.height)throw new Error('Invalid zero dimensions');
  return {bytes,metadata:{file:basename(file),...size,bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex')}};
}
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
try {
  if(process.argv.length!==4)throw new Error('Usage: node review-pair.mjs <source> <candidate>');
  const source=inspect(resolve(process.argv[2])),candidate=inspect(resolve(process.argv[3]));
  const directory=mkdtempSync(resolve('review-pair-'));
  const pair={generatedAt:new Date().toISOString(),dimensionsMeaning:'Encoded pixel dimensions; EXIF orientation is not applied.',source:source.metadata,candidate:candidate.metadata,decision:'',acceptRejectReason:''};
  for(const [name,item] of [['source',source],['candidate',candidate]])writeFileSync(join(directory,`${name}.${item.metadata.format}`),item.bytes);
  writeFileSync(join(directory,'pair.json'),JSON.stringify(pair,null,2)+'\n');
  const figures=[['source',source],['candidate',candidate]].map(([name,item])=>`<figure><img src="${name}.${item.metadata.format}" alt="${escape(name)}: ${escape(item.metadata.file)}"><figcaption>${escape(name)} — ${escape(item.metadata.file)}; ${item.metadata.width} × ${item.metadata.height} encoded pixels; ${item.metadata.bytes} bytes</figcaption></figure>`).join('');
  writeFileSync(join(directory,'index.html'),`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Local review pair</title><style>body{font-family:system-ui;margin:2rem}main{display:grid;grid-template-columns:1fr 1fr;gap:1rem}figure{margin:0;min-width:0}img{max-width:100%;height:auto}pre{white-space:pre-wrap;overflow-wrap:anywhere}@media(max-width:600px){main{grid-template-columns:1fr}}</style><h1>Local review pair / 本地并排审阅</h1><p>Metadata only. No quality score or similarity conclusion. Images stay local. / 只记录元数据，不评价画质或相似度，图片不上传。</p><main>${figures}</main><p>Record your decision and reason in pair.json. / 请在 pair.json 填写决定及理由。</p><pre>${escape(JSON.stringify(pair,null,2))}</pre></html>\n`);
  console.log(JSON.stringify({directory,...pair},null,2));
} catch(error){console.error(error.message);process.exitCode=1;}
