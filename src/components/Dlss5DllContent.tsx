import type { ReactNode } from 'react';
import { DLL_COPY, DLL_ROWS, DLL_SOURCE, type DllLocale } from '../content/dlss5Dll';
export default function Dlss5DllContent({locale='en', request}: {locale?: DllLocale; request?: ReactNode}) {
 const c=DLL_COPY[locale];
 return <main data-dll-page className="pt-28 pb-20 px-6 max-w-6xl mx-auto text-zinc-300">
  <header><h1 className="text-3xl font-bold text-white">{c.title}</h1><div data-dll-assertions className="mt-4 space-y-3">{c.assertions.map(s=><p key={s}>{s}</p>)}</div></header>
  <section className="mt-8"><h2 className="text-2xl font-bold">{c.tableTitle}</h2><p className="mt-3">{c.source} <a className="text-primary underline" href={DLL_SOURCE}>NVIDIA/DLSS</a></p>
   <div className="overflow-x-auto mt-4"><table data-dll-table className="w-full text-left"><thead><tr>{c.headers.map(h=><th className="p-3" key={h}>{h}</th>)}</tr></thead><tbody>{DLL_ROWS.map(row=><tr key={row[0]}>{row.map((cell,i)=><td className="p-3 border-t border-outline-variant/30 break-words" key={i}>{cell}</td>)}</tr>)}</tbody></table></div>
  </section>
  <section className="mt-8"><h2 className="text-2xl font-bold">{c.deliveryTitle}</h2><p className="mt-3">{c.delivery}</p><p className="mt-3">{c.licence}</p><p className="mt-3">{c.boundary}</p>
   <div className="mt-5" data-dll-request>{request ?? <p>{c.login} <a href="/login" className="text-primary underline">{c.loginLink}</a></p>}</div>
  </section>
  <nav className="mt-8 flex flex-wrap gap-4">{['/dlss-checker','/benchmark','/download','/games'].map((path,i)=><a className="text-primary underline" key={path} href={locale==='zh' && i>0 ? '/zh'+path:path}>{c.links[i]}</a>)}<a className="text-primary underline" href="https://github.com/wangsheng1991/dlss-5-studio" rel="noopener noreferrer">{c.repository}</a></nav>
 </main>;
}
