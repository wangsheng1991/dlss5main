import assets from '../content/visualEnhancerLibrary.json';
export default function VisualEnhancerLibrary({locale='en'}: {locale?: 'en'|'zh'}) {
 const zh=locale==='zh';
 return <section data-real-inputs-outputs className="mt-14" aria-labelledby="real-inputs-heading">
  <h2 id="real-inputs-heading" className="text-2xl md:text-3xl font-bold text-white">{zh?'真实输入输出':'Real inputs and outputs'}</h2>
  <p className="mt-4 text-zinc-300 leading-relaxed">{zh?'这些是我们自己引擎的输出，不是 NVIDIA 截图、不是游戏帧、不是基准；每张图左半就是原始输入、右半是对应输出，没有换景。':'These are outputs from our own engine, not NVIDIA screenshots, game frames or benchmarks; each image has the original input on the left and its corresponding output on the right, with no scene substitution.'}</p>
  <p className="mt-3 text-zinc-400">{zh?'这是处理已有图片质量的入口线示例；产品主线仍是游戏人物风格转换与 Studio。':'These examples cover the existing-image quality entry point; game-character style conversion and Studio remain the product’s core.'}</p>
  <p data-library-total className="mt-3 text-zinc-400">{zh?'24 组素材 / 21 个类别，2026-10-26 复跑素材闸门：24 个素材，0 个不合格（判据 R1–R14）':'24 asset sets / 21 categories. Asset gate rerun on 2026-10-26: 24 assets, 0 failing (criteria R1–R14).'}</p>
  <div className="mt-6 grid gap-6 md:grid-cols-2">{assets.map(a=><article key={a.slug} data-library-card={a.slug} className="rounded-xl border border-outline-variant/20 bg-surface-low p-4">
   <h3 className="text-lg font-semibold text-white">{a.category}{zh && a.category!==a.categoryZh ? `（${a.categoryZh}）`:!zh && a.category!==a.categoryEn ? ` (${a.categoryEn})`:''}</h3>
   <figure className="mt-4"><img src={a.src} width={a.width} height={a.height} loading="lazy" className="w-full h-auto" alt={zh?`左：低分辨率输入；右：我们引擎的输出（${a.categoryZh}）`:`Left: low-resolution input; right: our engine’s output (${a.categoryEn})`}/>
    <figcaption className="mt-3 text-sm text-zinc-300 leading-relaxed">{zh?'输入':'Input'} {a.before.join(' × ')} → {zh?'输出':'output'} {a.after.join(' × ')} · {zh?'引擎':'Engine'}: flux-klein via AlphaNet · 2026-10-17 · {zh?'来源许可':'License'}: {a.license}</figcaption>
   </figure>
   <p data-claim-note className="mt-3 text-sm text-zinc-300 leading-relaxed">{zh?'这是模型在更大像素尺寸下重新生成的细节，不是像素级还原；构图与细节可能变化，身份特征与文字不保证 100% 一致。':a.claim}</p>
   <details className="mt-4 text-sm text-zinc-400"><summary className="cursor-pointer">{zh?'完整来源与运行记录（原文）':'Full source and run record (verbatim)'}</summary><pre data-source-record className="mt-3 whitespace-pre-wrap break-words font-sans">{a.source}</pre></details>
  </article>)}</div>
 </section>;
}
