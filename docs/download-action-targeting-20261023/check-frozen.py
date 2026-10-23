from pathlib import Path
from html.parser import HTMLParser
class Read(HTMLParser):
 def __init__(self):super().__init__();self.skip=0;self.intent=0;self.text=[];self.frozen=[]
 def handle_starttag(self,t,attrs):
  a=dict(attrs)
  if t in ['script','style']:self.skip+=1
  if t=='div' and ('data-download-action-panel' in a or self.intent):self.intent+=1
  if t=='link' and a.get('rel') in ['canonical','alternate']:self.frozen.append((t,attrs))
  if t=='meta' and a.get('name') in ['robots','description','keywords']:self.frozen.append((t,attrs))
 def handle_endtag(self,t):
  if t in ['script','style']:self.skip-=1
  if t=='div' and self.intent:self.intent-=1
 def handle_data(self,s):
  if not self.skip and not self.intent and s.strip():self.text.append(s)
old=Path('/tmp/download-action-targeting-before');n=0
for p in old.rglob('*.html'):
 x,y=Read(),Read();x.feed(p.read_text());y.feed((Path('dist')/p.relative_to(old)).read_text());assert x.frozen==y.frozen,p;assert x.text==y.text,p;n+=1
print(f'FROZEN: {n} HTML pages; all text outside new action-panel block unchanged; frozen head fields unchanged')
