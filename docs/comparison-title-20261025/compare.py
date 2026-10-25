from pathlib import Path
import re
old=Path('/tmp/comparison-title-before')
targets={'blog/dlss5-vs-dlss4-vs-fsr4-comparison-2026/index.html','zh/blog/dlss5-vs-dlss4-vs-fsr4-comparison-2026/index.html'}
n=0
for p in old.rglob('*.html'):
 rel=str(p.relative_to(old));a=p.read_text();b=(Path('dist')/rel).read_text()
 for pattern,label in [(r'<main\b[\s\S]*?</main>','main'),(r'<script[^>]*type="application/ld\+json"[^>]*>[\s\S]*?</script>','JSON-LD'),(r'<link[^>]*rel="(?:canonical|alternate)"[^>]*>','canonical/hreflang')]:
  assert re.findall(pattern,a)==re.findall(pattern,b),(rel,label)
 if rel not in targets:
  for pattern in [r'<title>[\s\S]*?</title>',r'<meta name="description"[^>]*>']:
   assert re.findall(pattern,a)==re.findall(pattern,b),(rel,pattern)
 n+=1
assert (old/'sitemap.xml').read_bytes()==Path('dist/sitemap.xml').read_bytes()
print(f'PASS: {n} pages main/H1/body/JSON-LD/canonical/hreflang unchanged; other pages title/description unchanged; sitemap byte-identical')
