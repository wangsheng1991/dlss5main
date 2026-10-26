import React, { useEffect, useState } from 'react';
import { dlss45Copy, dlss45Text } from '../content/dlss45';
export default function Dlss45Content({ locale = 'en' }: { locale?: 'en' | 'zh' }) {
  const t = (text: string) => dlss45Text(locale, text);
  const { page: page, rows: DLSS45_ROWS, faq: DLSS45_FAQ } = dlss45Copy(locale);
  const [ready,setReady]=useState(false);
  useEffect(()=>setReady(true),[]);
  return <main data-dlss45 data-ready={ready} className="pt-32 pb-24 px-6 max-w-6xl mx-auto text-zinc-300">
    <header><h1 className="text-4xl font-bold text-white">{page.title}</h1><p className="mt-5 text-lg">{page.intro}</p></header>
    <section className="mt-10" aria-labelledby="dlss45-table-heading"><h2 id="dlss45-table-heading" className="text-2xl font-bold text-white">{t("原文日期、部件、显卡与状态分开看")}</h2>
      <p className="mt-4">{t("以下为 NVIDIA 的说法，我们没有在游戏里复现。唯一来源：")}<a className="text-primary underline" href={page.source}>{t("NVIDIA 的 DLSS 4.5 公告")}</a>{t("，署名 Henry Lin &amp; Andrew Burnes，January 06, 2026；核对日 ")}<time dateTime={page.checked}>{page.checked}</time>{t("。英文栏保留原文，中文栏仅作解释。")}</p>
      <div className="mt-5 overflow-x-auto"><table data-dlss45-table className="w-full min-w-[900px] text-left"><thead><tr>{[t("部件"),t("原文怎么说（英文）"),t("适用显卡"),t("状态（按 2026-01-06 原文）")].map(h=><th key={h} className="p-4 text-primary">{h}</th>)}</tr></thead><tbody>{DLSS45_ROWS.map(row=><tr key={row.component} className="border-t border-outline-variant/30"><th scope="row" className="p-4">{row.component}</th><td className="p-4" data-verbatim-quote>{row.quote}</td><td className="p-4">{row.gpu}</td><td className="p-4"><p>{row.status}</p><p className="mt-3 text-sm">{page.attribution}</p></td></tr>)}</tbody></table></div>
    </section>
    <section className="mt-10"><h2 className="text-2xl font-bold text-white">{t("倍率、时间与本站工作流的边界")}</h2><p className="mt-4">{t("6X 是每个原生帧最多生成 5 个额外帧的倍率口径，不是画质或延迟结论。")}</p><p className="mt-4" data-dlss45-boundary>{page.boundary}</p><p className="mt-4">{t("本站的游戏人物风格转换与 Studio 图像工作流独立于 NVIDIA 游戏运行时。浏览器图片结果和本地批处理都不能证明游戏内的功能或性能。")}</p></section>
    <nav className="mt-8 flex flex-wrap gap-4" aria-label={t("相关资料")}><a className="text-primary underline" href="/vs/dlss-5-vs-dlss-4-5">{t("DLSS 5 与 DLSS 4.5 差别")}</a><a className="text-primary underline" href="/dlss-checker">{t("DLSS 兼容性检测：显卡范围与我们的软件分开核对")}</a><a className="text-primary underline" href="/download">{t("DLSS 下载路径与独立 Studio")}</a><a className="text-primary underline" href="/games">{t("DLSS 支持游戏与公告状态")}</a></nav>
    <section className="mt-10" data-dlss45-faq><h2 className="text-2xl font-bold text-white">{t("常见问题")}</h2>{DLSS45_FAQ.map(f=><article key={f.q} className="mt-5"><h3 className="text-lg font-bold text-white">{f.q}</h3><p className="mt-2">{f.a}</p></article>)}</section>
  </main>;
}
