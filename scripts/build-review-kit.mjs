import { SAMPLES } from '../src/config/samples.ts';
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
function buildChecklistFiles() {
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
return files;
}
const files = buildChecklistFiles();
files['accept-reject-record.csv'] = 'source / 原图,requested change / 目标变化,protected feature / 不变项,observed difference / 实际差异,accept or reject / 接受或拒收,reason / 原因,reviewer / 审阅人,date / 日期\n,,,,,,,\n';
files['README.md'] = '# DLSS 5-style review kit / 风格重绘审阅材料\n\nIndependent review material for game-character style conversion, extracted from our published articles. This is not a game runtime, not an APK, and contains no NVIDIA binaries or DLLs. No installation is required: extract the ZIP and read the Markdown files or fill in the blank CSV. It does not install or enable DLSS in a game.\n\n这是独立的游戏角色风格重绘审阅材料，摘自本站已上线文章。不是游戏运行时，不是 APK，不含任何 NVIDIA 二进制或 DLL，无需安装。解压后阅读 Markdown 或填写空白 CSV；它不会为游戏安装或启用 DLSS。本站独立运营，与 NVIDIA 无隶属关系。\n\nThe five directions are a planning matrix, not five completed generations. Historical examples remain historical; this kit adds no experiment or performance claim.\n五方向是规划矩阵，不是五次已完成生成。历史样例仍是历史样例，本材料没有新增实验或性能声明。\n\n## Files / 文件\n'+Object.keys(files).sort().map(name=>`- ${name}`).join('\n')+'\n';
function writeZip(files, name) {
 mkdirSync('public/downloads', {recursive:true});
 const target='public/downloads/'+name;
 // Fixed file order, DOS mtime, mode and ZIP_STORED are independent of compressor versions.
 execFileSync('python3',['-c',`import sys,json,zipfile
files=json.load(sys.stdin)
with zipfile.ZipFile(sys.argv[1],'w',compression=zipfile.ZIP_STORED) as z:
 for name in sorted(files):
  info=zipfile.ZipInfo(name,date_time=(2026,10,23,0,0,0));info.create_system=3;info.external_attr=0o100644<<16;info.compress_type=zipfile.ZIP_STORED
  z.writestr(info,files[name].encode('utf-8'))
`,target],{input:JSON.stringify(files)});
 const bytes=readFileSync(target);
 return {path:'/downloads/'+name,bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex'),files:Object.keys(files).sort()};
}
const previous=writeZip(files,'dlss5-review-kit.zip');
const recipeFiles=Object.fromEntries(Object.entries(buildChecklistFiles()).map(([name,body])=>['checklists/'+name,body]));
recipeFiles['accept-reject-record.csv']=files['accept-reject-record.csv'];
recipeFiles['tools/review-pair.mjs']=readFileSync('scripts/review-kit/review-pair.mjs','utf8');
const promptRecords=['characterStyle','sample1','sample2'].map(id=>{
 const sample=SAMPLES[id];
 recipeFiles[`prompts/${id}.txt`]=sample.prompt;
 return {sample:id,promptFile:`prompts/${id}.txt`,source:sample.src,output:`/api/image-edit/samples?sample=${id}`,definition:'src/config/samples.ts',article:id==='characterStyle'?'/blog/core-game-frame-style-reference':'/blog/core-redraw-review-checklist',relationship:id==='characterStyle'?'Article discusses this fixed-prompt cached character example; no new generation in this kit.':'Article discusses this source image in a separate historical room/kitchen task. Its recorded task prompt differs; do not attribute that article output to this fixed sample prompt.'};
});
recipeFiles['prompts/catalog.json']=JSON.stringify(promptRecords,null,2)+'\n';
recipeFiles['prompts/README.md']='# Fixed public style-sample prompts / 公开风格样例固定提示词\n\nThe .txt files are exact prompt strings from src/config/samples.ts, used by the public image-edit sample path. catalog.json identifies each source, cached output URL and related published discussion. The output endpoint can change as the site cache is refreshed; this package does not run a model or guarantee reproduction.\n\n.txt 逐字导出样例定义中的提示词；catalog.json 标注输入、缓存输出地址和文章关系。characterStyle 的文章讨论对应固定提示词样例。sample1、sample2 的审阅文章使用相同源图，但讨论的是另一组历史任务，提示词不同，不能把文章配图归因于这两条固定提示词。缓存地址可能随样例更新而变化，本包没有新跑模型，也不保证复现效果。\n\nOnly the three image style-conversion samples are included. Tool-catalog labels for cutout, erasing and vectorization are not presented as verified style recipes. / 仅收录三条图像风格转换样例；去背景、抹除、矢量化的工具说明不冒充风格配方。\n';
recipeFiles['prompts/five-direction-brief-template.md']='# Five-direction brief template / 五方向简报模板\n\nTemplate, effects not verified. / 模板，未验证效果。\nSource: https://www.dlss5nvidia.com/blog/core-game-character-style-matrix\n中文：https://www.dlss5nvidia.com/zh/blog/core-game-character-style-matrix\nRead the unchanged bilingual planning matrix in checklists/ before filling this form. These are review briefs, not completed generations or tested prompts. / 先读 checklists/ 中原样收录的双语规划矩阵。这里是审阅简报，不是已完成生成或经过效果验证的提示词。\n\n'+['Cyberpunk / 赛博朋克','Fantasy / 奇幻','Science fiction / 科幻','Anime / 动漫','Realistic / 写实'].map(direction=>'## '+direction+'\n\n- Source image / 源图：\n- Protected identity, costume and camera / 保留身份、服装、镜头：\n- Intended light / 光照目标：\n- Intended material / 材质目标：\n- Intended palette / 配色目标：\n- Reject if / 拒收条件：\n- Review notes / 审阅记录：\n').join('\n');
recipeFiles['README.md']='# DLSS 5-style recipe kit v2 / 风格重绘配方包 v2\n\nOwn fixed sample prompts, unchanged bilingual review excerpts, an unverified planning template, a blank record and a local metadata viewer. No model is called. / 包含自有固定样例提示词、原样双语审阅段、未验证模板、空白记录与本地元数据查看脚本，不调用模型。\n\n## Usage / 用法\n\nExtract the ZIP. Read prompts/catalog.json for source and output relationships. The room/kitchen article records are different tasks, not evidence for the fixed sample prompts. / 解压后先读提示词目录中的对应关系，室内文章记录不能当作固定样例提示词的效果证据。\n\nWith Node.js 18 or later, put your two images beside tools/review-pair.mjs and run from that folder: / 安装 Node.js 18 或更新版，把自己的两张图放在 tools/review-pair.mjs 旁，在该目录运行：\n\n```sh\nnode review-pair.mjs source.jpg result.webp\n```\n\nThe zero-dependency script creates a fresh review-pair-* directory with index.html, pair.json and unchanged local image copies. Open index.html for a side-by-side view. It reports encoded JPEG/PNG/WebP dimensions, bytes, SHA-256 and actual generation time; EXIF rotation is not applied. Fill decision and acceptRejectReason yourself. No quality score or similarity conclusion is produced. / 零依赖脚本生成新的 review-pair-* 目录，含并排网页、pair.json 与原样图片副本。只测编码像素尺寸、字节数、哈希与实际生成时间，不应用 EXIF 旋转；接受或拒收理由由你填写，不给画质或相似度结论。图片不上传。\n\n## Boundaries and permission / 边界与许可\n\nThese materials are our own content and may be freely used for your own project reviews. This permission does not license third-party material. Independent of NVIDIA: not a game runtime, not an APK, no NVIDIA binaries or DLLs. No installation into a game is required or performed. Historical examples remain historical; templates have unverified effects. / 材料为我们自有内容，可自由用于自己的项目评审；许可不涵盖第三方材料。本站与 NVIDIA 无隶属关系。本包不是运行时、不是 APK，不含任何 NVIDIA 二进制或 DLL，不需要也不会向游戏安装内容。历史样例仍是历史样例，模板未验证效果。\n';
const meta={...writeZip(recipeFiles,'dlss5-style-recipe-kit-v2.zip'),previous};
writeFileSync('src/content/reviewKit.json',JSON.stringify(meta,null,2)+'\n');
console.log(JSON.stringify(meta,null,2));
