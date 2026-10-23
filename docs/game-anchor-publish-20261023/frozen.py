import pathlib
from html.parser import HTMLParser
class Read(HTMLParser):
 def __init__(self):super().__init__();self.skip=0;self.text=[];self.frozen=[]
 def handle_starttag(self,t,attrs):
  a=dict(attrs)
  if t in ['script','style']:self.skip+=1
  if t=='link' and a.get('rel') in ['canonical','alternate']:self.frozen.append((t,attrs))
  if t=='meta' and a.get('name')=='robots':self.frozen.append((t,attrs))
 def handle_endtag(self,t):
  if t in ['script','style']:self.skip-=1
 def handle_data(self,s):
  if not self.skip and s.strip():self.text.append(s)
a=pathlib.Path('/tmp/game-anchor-publish-20261023/before-dist');changes=[];checked=0
for p in a.rglob('*.html'):
 x,y=Read(),Read();x.feed(p.read_text());y.feed((pathlib.Path('dist')/p.relative_to(a)).read_text());assert x.frozen==y.frozen,str(p);checked+=1
 if x.text!=y.text:
  changes.append(str(p.relative_to(a)));remaining=iter(y.text)
  assert all(any(v==old for v in remaining) for old in x.text),str(p)+' old visible text removed/changed'
assert set(changes)=={'blog/index.html','zh/blog/index.html','game-character-style/index.html','before-after/index.html'},changes
print('FROZEN-TEXT:',checked,'existing HTML; only additive blog-index cards and two approved landing links; frozen fields unchanged')
