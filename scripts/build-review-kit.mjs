import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
// Extract only checked-in, published article bodies. Fail if the module format or headings change.
const articles = ['core20261023', 'gameAnchor20261023'].flatMap(name => JSON.parse(readFileSync(`src/content/articles/${name}.ts`, 'utf8').split('Article[] = ')[1].split(';\n\nexport const')[0]));
const specs = [
 ['core-redraw-review-checklist', ['## TL;DR','## Small text: compare meaning before appearance','## Logos and symbols: shape alone is insufficient','## Identity: familiarity needs a separate check','## Exact proportions: a concept is not a measurement','## Write a decision someone else can use','## Technical context and limits'], ['## TL;DR','## 小字要按内容检查','## Logo 和符号要核内部结构','## 身份要单独验收','## 精确比例不能靠可信观感决定','## 写出别人能使用的决定','## 技术背景与边界']],
 ['core-game-character-style-matrix', ['## The five-direction planning matrix','## When to stop and what to hand over','## Disclosure'], ['## 五方向规划矩阵','## 什么时候停手，最后交付什么','## 独立性声明']],
 ['core-game-frame-style-reference', ['### Make the review concrete','## Boundaries and independence'], ['### 按顺序做一次检查','## 边界与独立性']],
];
const files = {};
for (const [slug, en, zh] of specs) {
 const article = articles.find(a => a.slug === slug);
 if (!article) throw new Error(`Missing article: ${slug}`);
 for (const [locale, headings, field] of [['en',en,'content_en'],['zh',zh,'content_cn']]) {
  const body = article[field];
  const excerpts = headings.map(heading => {
   const start = body.indexOf(heading+'\n');
   if (start < 0) throw new Error(`Missing ${slug}: ${heading}`);
   const level = heading.startsWith('###') ? 3 : 2;
   const rest = body.slice(start+heading.length+1);
   const next = new RegExp(`^#{1,${level}} `,'m').exec(rest);
   return (heading+'\n'+rest.slice(0,next?.index ?? rest.length)).trimEnd();
  });
  files[`${slug}.${locale}.md`] = `# ${article[locale==='en'?'title_en':'title_cn']}\n\nSource: https://www.dlss5nvidia.com/${locale==='zh'?'zh/':''}blog/${slug}\n\n${excerpts.join('\n\n')}\n`;
 }
}
files['accept-reject-record.csv'] = 'source / 原图,requested change / 目标变化,protected feature / 不变项,observed difference / 实际差异,accept or reject / 接受或拒收,reason / 原因,reviewer / 审阅人,date / 日期\n,,,,,,,\n';
files['README.md'] = '# DLSS 5-style review kit / 风格重绘审阅材料\n\nIndependent review material for game-character style conversion, extracted from our published articles. This is not a game runtime, not an APK, and contains no NVIDIA binaries or DLLs. No installation is required: extract the ZIP and read the Markdown files or fill in the blank CSV. It does not install or enable DLSS in a game.\n\n这是独立的游戏角色风格重绘审阅材料，摘自本站已上线文章。不是游戏运行时，不是 APK，不含任何 NVIDIA 二进制或 DLL，无需安装。解压后阅读 Markdown 或填写空白 CSV；它不会为游戏安装或启用 DLSS。本站独立运营，与 NVIDIA 无隶属关系。\n\nThe five directions are a planning matrix, not five completed generations. Historical examples remain historical; this kit adds no experiment or performance claim.\n五方向是规划矩阵，不是五次已完成生成。历史样例仍是历史样例，本材料没有新增实验或性能声明。\n\n## Files / 文件\n'+Object.keys(files).sort().map(name=>`- ${name}`).join('\n')+'\n';
mkdirSync('public/downloads', {recursive:true});
const target='public/downloads/dlss5-review-kit.zip';
// ZIP_STORED avoids compressor-version differences; timestamps/order/mode are fixed.
execFileSync('python3',['-c',`import sys,json,zipfile
files=json.load(sys.stdin)
with zipfile.ZipFile(sys.argv[1],'w',compression=zipfile.ZIP_STORED) as z:
 for name in sorted(files):
  info=zipfile.ZipInfo(name,date_time=(2026,10,23,0,0,0));info.create_system=3;info.external_attr=0o100644<<16;info.compress_type=zipfile.ZIP_STORED
  z.writestr(info,files[name].encode('utf-8'))
`,target],{input:JSON.stringify(files)});
const bytes=readFileSync(target); const meta={path:'/downloads/dlss5-review-kit.zip',bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex'),files:Object.keys(files).sort()};
writeFileSync('src/content/reviewKit.json',JSON.stringify(meta,null,2)+'\n');
console.log(JSON.stringify(meta,null,2));
