import { ENHANCER_SHORT_ANSWERS } from '../content/enhancerShortAnswers';
import React from 'react';
import { CHECKED, COMPARISON_ANSWERS, EVIDENCE_SOURCES } from '../content/roiEvidence';
import { VISUAL_ENHANCER_COPY } from '../content/visualEnhancer';
import type { ToolLanding } from '../content/toolLandings';
import { SITE_URL } from '../config/site';
const panel = 'my-8 rounded-xl border border-zinc-700 bg-surface-low p-5 text-zinc-300 [overflow-wrap:anywhere]';
const link = 'text-primary underline break-all';
type Answer = {question:string;answer:string};
function Schema({path,answers}:{path:string;answers:readonly Answer[]}) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({'@context':'https://schema.org','@type':'FAQPage','@id':`${SITE_URL}${path}#faq`,dateModified:CHECKED,mainEntity:answers.map(a=>({'@type':'Question',name:a.question,acceptedAnswer:{'@type':'Answer',text:a.answer}}))}).replace(/</g,'\\u003c')}} />;
}
const chineseAnswers = [
 ['该用 FSR 还是 DLSS？','先看游戏和显卡支持哪一项具体功能，再看你的使用目标。对照 NVIDIA 与 AMD 的功能说明核实游戏设置；仅凭套件名称，不能判断兼容性。两者都能用时，应在相同场景和设置下比较。我们没有核实一个适用于所有情况的赢家。'],
 ['DLSS 4.5 比 DLSS 4 好多少？','NVIDIA 将 DLSS 4.5 超分辨率的更新描述为第二代 Transformer 模型，可用于 GeForce RTX 显卡。但在你的游戏、显卡和设置下提升多少，本站未核实：我们没有做同条件基准测试，因此不给性能百分比。'],
 ['AMD 会推出类似 DLSS 5 的东西吗？','未核实。下方 AMD FSR 资料不能证明 AMD 已有等同于 DLSS 5 的神经渲染产品，也不能证明未来发布时间。请以 AMD 自身的功能与硬件说明为准；超分辨率或帧生成并不等于同类光照、材质渲染能力。'],
 ['DLSS 4 只能用于 RTX 50 系列吗？','不是，要分功能看。NVIDIA 的多帧生成要求 RTX 50；帧生成支持 RTX 40 和 RTX 50。超分辨率、光线重建与 DLAA 的 Transformer 更新面向 GeForce RTX 显卡，但仍取决于游戏是否集成对应功能。不要只凭“DLSS 4”这个总称判断能否使用。'],
 ['DLSS 5 会好多少？','NVIDIA 将 DLSS 5 描述为用于光照与材质的 3D 引导神经渲染；这与超分辨率能带来多少帧不是同一个问题。本站没有同条件游戏基准测试，普遍提升幅度未核实，也不会把厂商演示当成所有游戏都成立的画质或性能结论。'],
 ['哪些 GPU 支持 DLSS 5？','已核对的 NVIDIA 发布资料确认：NBA 2K27 的支持范围包括全部 GeForce RTX 50 系列桌面和笔记本 GPU，另有 GeForce NOW 云端路径。这里的本地电脑结论只覆盖该游戏与该硬件系列，其他本地显卡和游戏组合未核实；云端可用不代表客户端显卡能在本地运行。'],
] as const;
export function ChineseComparison({path,existingFaq}:{path:string;existingFaq:readonly (readonly [string,string])[]}) {
  const offset=path.endsWith('dlss-4-5')?3:0;
  const answers=chineseAnswers.slice(offset,offset+3).map(([question,answer],i)=>({question,answer,sources:COMPARISON_ANSWERS[offset+i].sources,paa:COMPARISON_ANSWERS[offset+i].question}));
  return <section data-layer2="zh-comparison" className={panel} aria-labelledby="zh-checked-heading">
    <Schema path={path} answers={[...existingFaq.map(([question,answer])=>({question,answer})),...answers.map(a=>({question:a.question,answer:`${a.answer} 最后核对：${CHECKED}。来源：${a.sources.map(k=>EVIDENCE_SOURCES[k]).join(' ')}`}))]} />
    <h2 id="zh-checked-heading" className="text-2xl font-bold text-white">按功能与已核对范围作答</h2><p className="mt-3">最后核对：<time dateTime={CHECKED}>{CHECKED}</time></p>
    <p className="mt-3">本站主线是独立的<a className={link} href="/game-character-style">风格转换与神经渲染重绘</a>，由 <a className={link} href="/zh/download">DLSS5 Studio</a> 承接桌面工作流。下列游戏技术资料与本站图片转换能力分开说明。</p>
    {answers.map(a=><article className="mt-6" key={a.question}><h3 className="font-bold text-white">{a.question}</h3><p className="mt-1 text-sm">对应原问：{a.paa}</p><p className="mt-2">{a.answer}</p><p className="mt-2 text-sm">官方来源：{a.sources.map(k=><a key={k} className={`${link} mr-3`} href={EVIDENCE_SOURCES[k]}>{EVIDENCE_SOURCES[k]}</a>)}（核对日：{CHECKED}）</p></article>)}
    <p className="mt-6"><a className={link} href="/zh/blog/dlss5-vs-dlss4-vs-fsr4-comparison-2026">阅读 DLSS 与 FSR 功能对比全文</a> · <a className={link} href="/zh/blog/dlss5-vs-dlss4-vs-fsr4-comparison-2026#feature-picker-heading">按目标、显卡与已核对游戏选择功能</a></p>
  </section>;
}
const enhancerAnswers = [
 {question:'输出尺寸与放大因子有什么限制？',answer:'输出最长边上限为 1536 像素，可选目标因子为 2 / 4；超出上限时会缩小请求比例。这些数值描述目标尺寸，不代表速度或画质提升倍数。'},
 {question:'这是逐像素超分辨率吗？',answer:'不是。模型会重绘细节，不承诺逐像素超分，也不能保证找回原图中不存在的信息。请保留原图，重点检查人脸、文字与边缘。'},
 {question:'超时后能用同一个 task id 恢复吗？',answer:'失败或中断的状态检查会保留提示，可用同一个 task id 继续查询。临时轮询错误或超时不需要另起生成任务；若服务方已判定任务终止失败，再次查询也不保证恢复。'},
 {question:'查看浏览器示例需要 RTX 显卡吗？',answer:'查看缓存示例不要求本地 RTX 显卡。这是独立的浏览器图片流程，并非 NVIDIA DLSS 游戏运行时，也不是 Studio 桌面版。'},
 {question:'安卓手机能试用示例吗？',answer:'可以在手机浏览器查看缓存示例。本页不会安装 NVIDIA 二进制文件，也不提供安卓 APK。处理自己的图片需要登录及可用额度。'},
];
export function ChineseEnhancer() {
 return <section data-layer2="zh-enhancer" data-content-tier="entry-point" className={panel} aria-labelledby="zh-enhancer-checked"><Schema path="/zh/visual-enhancer" answers={[...VISUAL_ENHANCER_COPY.zh.faq.map(([question,answer])=>({question,answer})),...enhancerAnswers,...ENHANCER_SHORT_ANSWERS.zh]} /><h2 id="zh-enhancer-checked" className="text-2xl font-bold text-white">已有图片质量的有限入口</h2><p className="mt-3">最后核对：<time dateTime={CHECKED}>{CHECKED}</time></p><p className="mt-3">本页只承接已有图片质量处理，不是产品主线。我们的主线是<a className={link} href="/game-character-style">风格转换与神经渲染重绘</a>，以及 <a className={link} href="/zh/download">DLSS5 Studio 桌面工作流</a>。</p>{enhancerAnswers.map(a=><article key={a.question} className="mt-6"><h3 className="font-bold text-white">{a.question}</h3><p className="mt-2">{a.answer}</p></article>)}</section>;
}
const toolPurpose:Record<string,string> = {
 '/image-quality-enhancer':'This image-quality workflow is a limited entry point for inspecting texture, edges and compression in an existing image.',
 '/image-upscaler':'This upscaler is a limited entry point for enlarging an existing image and reviewing the result against its source.',
 '/unblur-image':'This unblur workflow is a limited entry point for reviewing mild blur and compression in an existing photo.',
};
export function ToolEvidence({tool}:{tool:ToolLanding}) {
 const purpose=toolPurpose[tool.path];if(!purpose)return null;
 const answer=`${purpose} The product’s main workflow is style conversion and neural-render redraw, with DLSS5 Studio as the desktop handover. Generated detail is an estimate, not pixel-exact recovery or the NVIDIA DLSS game runtime.`;
 return <section data-layer2="tool-entry" data-content-tier="entry-point" className={panel} aria-labelledby="tool-entry-heading"><Schema path={tool.path} answers={[...tool.faqs,{question:'Where does this tool fit in the product?',answer}]} /><h2 id="tool-entry-heading" className="text-2xl font-bold text-white">Where does this tool fit in the product?</h2><p className="mt-3">{answer}</p><p className="mt-3"><a className={link} href="/game-character-style">Explore style conversion and neural-render redraw</a> · <a className={link} href="/download">See the DLSS5 Studio desktop workflow</a></p><p className="mt-3">Last checked: <time dateTime={CHECKED}>{CHECKED}</time></p></section>;
}
