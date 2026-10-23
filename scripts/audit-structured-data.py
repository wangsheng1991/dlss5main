#!/usr/bin/env python3
"""Audit every sitemap URL, accepting attributes after JSON-LD's type.
Usage: python3 scripts/audit-structured-data.py /tmp/schema-audit
Writes raw HTML, parsed results, malformed graphs, HTTP errors and zero-schema URLs.
exactTagZero is diagnostic only: exact opening-tag matching misses data-rh attributes.
"""
import subprocess,re,json,sys
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
if len(sys.argv) != 2: raise SystemExit('Usage: python3 scripts/audit-structured-data.py OUTPUT_DIR')
out=Path(sys.argv[1]);out.mkdir(parents=True,exist_ok=True)
xml=subprocess.check_output(['curl','-sSL','--max-time','30','https://www.dlss5nvidia.com/sitemap.xml'],text=True);urls=re.findall(r'<loc>(.*?)</loc>',xml)
def scan(u):
 name=u.split('dlss5nvidia.com')[-1].strip('/').replace('/','_') or 'home';f=out/(name+'.html');r=subprocess.run(['curl','-sSL','--retry','1','--max-time','35','-w','%{http_code}',u,'-o',str(f)],capture_output=True,text=True);s=f.read_text() if f.exists() else ''; tags=re.findall(r'<script\b[^>]*\btype\s*=\s*[\"\']application/ld\+json[\"\'][^>]*>(.*?)</script>',s,re.S|re.I);nodes=[];errors=[]
 for t in tags:
  try:
   j=json.loads(t);nodes.extend(j.get('@graph',[j]) if isinstance(j,dict) else j)
  except Exception as e:errors.append(str(e))
 return {'url':u,'status':r.stdout,'scripts':len(tags),'exactTagCount':s.count('<script type="application/ld+json">'),'types':[n.get('@type') for n in nodes if isinstance(n,dict)],'errors':errors}
with ThreadPoolExecutor(max_workers=8) as pool:rows=list(pool.map(scan,urls))
summary={'total':len(rows),'zero':len([r for r in rows if not r['scripts']]),'exactTagZero':len([r for r in rows if not r['exactTagCount']]),'remaining':[r for r in rows if not r['scripts']],'badStatus':[r for r in rows if r['status']!='200'],'malformed':[r for r in rows if r['errors']]}
(out/'results.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2));(out/'summary.json').write_text(json.dumps(summary,ensure_ascii=False,indent=2));print(json.dumps(summary,ensure_ascii=False,indent=2))
