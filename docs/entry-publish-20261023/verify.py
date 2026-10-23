import pathlib,json,re,urllib.request,html,hashlib
repo=pathlib.Path('/Users/wangsheng/code/shou/dlss5main');code=(repo/'src/content/articles/entry20261023.ts').read_text();articles=json.loads(code.split('export const ENTRY_ARTICLES: Article[] = ',1)[1].split(';\nexport const ENTRY_COVERS')[0]);base='http://127.0.0.1:4194';rows=[];imagecodes={}
def get(p):
 with urllib.request.urlopen(base+p) as r:return r.status,r.read().decode()
status,sitemap=get('/sitemap.xml');locs=re.findall(r'<loc>(.*?)</loc>',sitemap)
for a in articles:
 folder=next(pathlib.Path('/Users/wangsheng/code/shou/artifacts/content-library').glob('*-'+a['slug']))
 for prefix,lang,suffix in [('', 'en','en'),('/zh','zh','cn')]:
  manuscript=(folder/f'article.{lang}.md').read_text().split('---',2)[2];body=re.sub(r'^\s*# [^\n]+\n','',manuscript).strip();assert a['content_'+suffix].startswith(body+'\n\n## ')
  path=prefix+'/blog/'+a['slug'];status,s=get(path);schemas=[json.loads(x) for x in re.findall(r'<script[^>]*type="application/ld\+json"[^>]*>(.*?)</script>',s,re.S)];nodes=[]
  for sc in schemas:nodes+=sc.get('@graph',[sc])
  article=next(x for x in nodes if x.get('@type')=='Article');assert article['dateModified']=='2026-10-23';assert 'Last checked:' in s
  assert '<link rel="canonical" href="https://www.dlss5nvidia.com'+path+'"' in s
  for locale in ['en','zh-CN','x-default']:assert 'hreflang="'+locale+'"' in s
  assert 'https://www.dlss5nvidia.com'+path in locs
  imgs=re.findall(r'<img[^>]+src="([^"]+)"',s)
  for img in imgs:
   if img not in imagecodes:
    with urllib.request.urlopen(base+html.unescape(img)) as r:imagecodes[img]=r.status
   assert imagecodes[img]==200
  visible=html.unescape(re.sub('<[^>]+>',' ',s));visible=re.sub(r'\s+',' ',visible)
  captions=re.findall(r'!\[[^\]]+\]\(assets/[^)]+\)\s*\n\s*\*([^\n]+)\*',body)
  for c in captions:
   assert re.sub(r'\s+', '', c.replace('`','')) in re.sub(r'\s+', '', visible),(path,c)
  assert s.count('<h1 ')==1 and s.count('<main ')==1
  faq=next((x for x in nodes if x.get('@type')=='FAQPage'),None);assert bool(faq)==bool(a.get('faqs_'+suffix))
  if faq:
   for q in faq['mainEntity']:
    assert q['name'] in visible
    assert re.sub(r'\s+','',q['acceptedAnswer']['text']) in re.sub(r'\s+','',visible)
  rows.append({'path':path,'HTTP':status,'schema':'Article','dateModified':article['dateModified'],'lastChecked':True,'hreflang':True,'images':len(imgs),'imageHTTP':200,'originalBodyPreserved':True,'FAQPage':bool(faq)})
for prefix in ['', '/zh']:
 _,index=get(prefix+'/blog')
 for a in articles:assert a['slug'] in index
json.dump({'sitemapCount':len(locs),'pages':rows},open('/tmp/entry-articles-20261023/local-verification.json','w'),ensure_ascii=False,indent=2)
print('VERIFIED:',len(rows),'URLs; Article/date/hreflang/images/original body/captions; sitemap:',len(locs),'both blog indexes contain all three')
