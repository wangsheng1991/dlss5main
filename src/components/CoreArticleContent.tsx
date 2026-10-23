import { Fragment, type ReactNode } from 'react';

// The approved manuscripts remain plain Markdown. React escapes all text and attributes;
// this renderer supports their images/captions and replay blocks in both SPA and prerender.
function inline(text: string): ReactNode[] {
  return text.split(/(\[[^\]]+\]\(https?:\/\/[^)]+\)|\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g).map((part, i) => {
    const link = part.match(/^\[([^\]]+)\]\((https?:\/\/[^)]+)\)$/);
    if (link) return <a key={i} href={link[2]}>{link[1]}</a>;
    if (part.startsWith('**') && part.endsWith('**')) return <strong key={i}>{part.slice(2, -2)}</strong>;
    if (part.startsWith('`') && part.endsWith('`')) return <code key={i}>{part.slice(1, -1)}</code>;
    if (part.startsWith('*') && part.endsWith('*')) return <em key={i}>{part.slice(1, -1)}</em>;
    return part;
  });
}
export default function CoreArticleContent({ content, assetBase }: {content: string; assetBase: string}) {
  const blocks = content.trim().split(/\n\s*\n/);
  const result: ReactNode[] = [];
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    const picture = block.match(/^!\[([^\]]+)\]\((assets\/[^)]+)\)(?:\n(\*[^\n]+\*))?$/);
    const heading = block.match(/^(#{2,3}) (.+)$/);
    if (picture) {
      const caption = picture[3] || blocks[++i];
      if (!caption?.startsWith('*') || !caption.endsWith('*')) throw new Error('An article image requires its original caption');
      result.push(<figure key={i}><img src={`${assetBase}${picture[2]}`} alt={picture[1]} loading="lazy" className="w-full h-auto" /><figcaption>{inline(caption.slice(1, -1))}</figcaption></figure>);
    } else if (assetBase === '/core-game-character-style-matrix/' && /^\|.+\n\|[ :|\-]+\|/.test(block)) {
      const rows = block.split('\n').map(row => row.split('|').slice(1, -1).map(cell => cell.trim()));
      result.push(<div key={i} className="overflow-x-auto"><table><thead><tr>{rows[0].map((cell, k) => <th key={k}>{inline(cell)}</th>)}</tr></thead><tbody>{rows.slice(2).map((row, r) => <tr key={r}>{row.map((cell, c) => <td key={c}>{inline(cell)}</td>)}</tr>)}</tbody></table></div>);
    } else if (block.startsWith('```')) {
      let fenced = block;
      while (!fenced.trimEnd().endsWith('```') && i + 1 < blocks.length) fenced += `\n\n${blocks[++i]}`;
      result.push(<pre key={i} className="overflow-x-auto"><code>{fenced.replace(/^```[^\n]*\n/, '').replace(/\n```$/, '')}</code></pre>);
    } else if (heading) {
      result.push(heading[1].length === 2 ? <h2 key={i}>{inline(heading[2])}</h2> : <h3 key={i}>{inline(heading[2])}</h3>);
     } else if (block.startsWith('> ')) {
      const lines = block.split('\n').map(line => line.replace(/^> ?/, ''));
      result.push(<blockquote key={i}>{lines.every(line => line.startsWith('- '))
        ? <ul>{lines.map((line, k) => <li key={k}>{inline(line.slice(2))}</li>)}</ul>
        : <p>{inline(lines.join('\n'))}</p>}</blockquote>);
    } else if (/^[-*] /.test(block)) {
      result.push(<ul key={i}>{block.split('\n').map((line, k) => <li key={k}>{inline(line.replace(/^[-*] /, ''))}</li>)}</ul>);
    } else if (/^\d+\. /.test(block)) {
      result.push(<ol key={i}>{block.split('\n').map((line, k) => <li key={k}>{inline(line.replace(/^\d+\. /, ''))}</li>)}</ol>);
    } else result.push(<p key={i}>{inline(block)}</p>);
  }
  return <Fragment>{result}</Fragment>;
}
