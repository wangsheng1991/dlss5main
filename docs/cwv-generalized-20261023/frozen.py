import pathlib,re,json
from html.parser import HTMLParser
class Read(HTMLParser):
 def __init__(self):super().__init__();self.skip=0;self.text=[];self.frozen=[]
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if tag in ['script','style']:self.skip+=1
  if tag=='link' and a.get('rel') in ['canonical','alternate']:self.frozen.append((tag,attrs))
  if tag=='meta' and a.get('name')=='robots':self.frozen.append((tag,attrs))
 def handle_endtag(self,tag):
  if tag in ['script','style']:self.skip-=1
 def handle_data(self,data):
  if not self.skip and data.strip():self.text.append(data)
a=pathlib.Path('/tmp/cwv-generalized-20261023/before-dist');b=pathlib.Path('dist');checked=0
for p in a.rglob('*.html'):
 q=b/p.relative_to(a)
 if not q.exists():raise Exception(str(q)+' removed')
 x,y=Read(),Read();x.feed(p.read_text());y.feed(q.read_text())
 assert x.text==y.text and x.frozen==y.frozen,str(q)+' changed frozen text/fields'
 checked+=1
print('FROZEN-TEXT: '+str(checked)+' HTML files unchanged (visible text/title/H1/canonical/hreflang/robots)')
