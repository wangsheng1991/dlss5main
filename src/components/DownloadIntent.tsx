import kit from '../content/reviewKit.json';
import { SITE_URL } from '../config/site';

const developer = 'https://developer.nvidia.com/rtx/dlss';
const app = 'https://www.nvidia.com/en-us/geforce/news/dlss-4-5-super-resolution-available-now/';
const questions = ['Can I download DLSS 5?', 'How do I install DLSS 5?', 'Is DLSS 5 available?'];
const answers = {
  en: [
    'You can download the independent review materials below; they do not install DLSS in a game. A standalone consumer DLSS 5 download path is unconfirmed in the official pages checked here. NVIDIA’s developer page describes integration resources, which are separate from this review kit.',
    'This review kit needs no installation. For in-game DLSS, follow the game’s supported update path and NVIDIA’s instructions; NVIDIA documents DLSS 4.5 Super Resolution through the NVIDIA app. A general DLSS 5 installation procedure is unconfirmed here.',
    'DLSS 5 availability for your particular game is unconfirmed here. Check NVIDIA’s official information and the game’s release notes for the supported version. The confirmed NVIDIA app release cited below concerns DLSS 4.5 Super Resolution, not proof that DLSS 5 is enabled in your game.',
  ],
  zh: [
    '可以下载下方独立审阅材料，但它不会为游戏安装 DLSS。就本次核对的官方页面而言，面向普通用户的独立 DLSS 5 下载途径仍未确认。NVIDIA 开发者页面介绍的是集成资源，与本站审阅材料不同。',
    '本站审阅材料无需安装。游戏内的 DLSS 请按游戏支持的更新途径和 NVIDIA 说明处理；NVIDIA 已说明可通过 NVIDIA App 使用 DLSS 4.5 Super Resolution。通用的 DLSS 5 安装步骤在此仍未确认。',
    '你的具体游戏是否已可用 DLSS 5，在此未确认。请核对 NVIDIA 官方信息和该游戏的更新说明，确认支持的版本。下方已核对的 NVIDIA App 发布说明讲的是 DLSS 4.5 Super Resolution，不能据此认定游戏已启用 DLSS 5。',
  ],
};
export default function DownloadIntent({ chinese = false }: { chinese?: boolean }) {
  const language = chinese ? 'zh' : 'en';
  const description = chinese ? '游戏角色风格重绘的独立审阅清单、规划矩阵和空白记录表；不是游戏运行时，无需安装。' : 'Independent game-character redraw review checklists, a planning matrix and a blank decision record; not a game runtime and no installation required.';
  const schema = {
    '@context': 'https://schema.org', '@type': 'DigitalDocument',
    name: chinese ? 'DLSS 5 风格重绘审阅材料' : 'DLSS 5-style review kit', description,
    encodingFormat: 'application/zip', url: `${SITE_URL}${kit.path}`,
    encoding: { '@type': 'MediaObject', contentUrl: `${SITE_URL}${kit.path}`, encodingFormat: 'application/zip', sha256: kit.sha256 },
  };
  return <div data-download-intent className="mb-14 space-y-10 text-zinc-300">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />
    <section aria-labelledby="download-intent-heading">
      <h2 id="download-intent-heading" className="text-2xl font-bold text-white">{chinese ? 'DLSS 5 下载：先回答三个问题' : 'DLSS 5 download: three direct answers'}</h2>
      {questions.map((question, index) => <div key={question} className="mt-5" data-download-paa>
        <h3 className="text-lg font-semibold text-white">{question}{chinese ? `（${['可以下载 DLSS 5 吗？','怎样安装 DLSS 5？','DLSS 5 已经可用了吗？'][index]}）` : ''}</h3>
        <p className="mt-2">{answers[language][index]}</p>
        <p className="mt-2 text-sm">{chinese ? '来源：' : 'Sources: '}<a className="text-primary underline" href={developer}>NVIDIA Developer — DLSS</a> · <a className="text-primary underline" href={app}>NVIDIA App — DLSS 4.5</a> · {chinese ? '核对日期：' : 'Checked: '}2026-10-23</p>
      </div>)}
    </section>
    <section id="review-kit" aria-labelledby="review-kit-heading" className="rounded-xl border border-outline-variant/20 p-6">
      <h2 id="review-kit-heading" className="text-2xl font-bold text-white">{chinese ? '下载游戏角色风格重绘审阅材料' : 'Download the game-character style review kit'}</h2>
      <p className="mt-3">{description}</p>
      <p className="mt-3">{chinese ? '只整理本站已发布的审阅清单、五方向规划矩阵与验收步骤。不是 APK，不含任何 NVIDIA 二进制或 DLL，也不是 Studio 程序。' : 'Compiled from our published review checklist, five-direction planning matrix and acceptance steps. It is not an APK, contains no NVIDIA binaries or DLLs, and is not the Studio application.'}</p>
      <ul className="mt-4 list-disc pl-5">{kit.files.map(file => <li key={file}><code>{file}</code></li>)}</ul>
      <p className="mt-4">{chinese ? '文件大小：' : 'File size: '}{kit.bytes} bytes</p>
      <p className="break-all">SHA-256: <code>{kit.sha256}</code></p>
      <a className="mt-5 inline-block rounded-lg bg-primary px-5 py-3 font-bold text-black" href={kit.path} download="dlss5-review-kit.zip">{chinese ? '下载审阅材料 ZIP（无需安装）' : 'Download review materials ZIP (no installation)'}</a>
    </section>
    <section aria-labelledby="download-facts-heading">
      <h2 id="download-facts-heading" className="text-2xl font-bold text-white">{chinese ? '人们实际在下什么' : 'What people are actually downloading'}</h2>
      <div className="mt-4 overflow-x-auto"><table className="w-full text-left"><thead><tr><th>{chinese ? '项目' : 'Item'}</th><th>{chinese ? '事实与边界' : 'Facts and limits'}</th></tr></thead><tbody>
        <tr><th>NVIDIA App</th><td>{chinese ? 'NVIDIA 官方应用；已核对的发布说明提供 DLSS 4.5 Super Resolution 更新途径。' : 'NVIDIA’s official app; the checked release documents the DLSS 4.5 Super Resolution update path.'} <a href={app} className="text-primary underline">{chinese ? '官方来源' : 'Official source'}</a></td></tr>
        <tr><th>{chinese ? '游戏内 DLSS 更新' : 'In-game DLSS updates'}</th><td>{chinese ? '支持与更新可随游戏补丁提供，具体版本以该游戏更新说明为准；不是通用安装程序。' : 'Support and updates can arrive through game patches; consult that game’s release notes for the version, rather than treating them as a universal installer.'} <a href={app} className="text-primary underline">{chinese ? 'NVIDIA 游戏更新实例' : 'NVIDIA game-update example'}</a></td></tr>
        <tr><th>{chinese ? '第三方 dlss-5-swapper 镜像' : 'Third-party dlss-5-swapper mirrors'}</th><td>{chinese ? 'SourceForge 与 uptodown 存在这类镜像页面。本站不提供、不验证这类第三方注入工具；不推荐、不背书，也不提供链接或安装步骤。' : 'Such mirror pages exist on SourceForge and uptodown. We do not provide or verify these third-party injection tools; we do not recommend or endorse them, or provide links or installation steps.'}</td></tr>
      </tbody></table></div>
      <p className="mt-3 text-sm">Last checked: <time dateTime="2026-10-23">2026-10-23</time>{chinese ? '（最后核对）' : ''}</p>
    </section>
  </div>;
}
