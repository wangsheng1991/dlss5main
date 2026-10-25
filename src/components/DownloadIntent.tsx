import { trackEvent } from '../lib/analytics';
import kit from '../content/reviewKit.json';
import { SITE_URL } from '../config/site';

const developer = 'https://developer.nvidia.com/rtx/dlss';
const app = 'https://www.nvidia.com/en-us/geforce/news/dlss-4-5-super-resolution-available-now/';
const officialDownloads = [
  {url: 'https://www.nvidia.com/en-us/software/nvidia-app/', name: 'NVIDIA App', en: 'Official NVIDIA app, including the documented DLSS 4.5 Super Resolution update path.', zh: 'NVIDIA 官方应用，包含已说明的 DLSS 4.5 Super Resolution 更新途径。'},
  {url: app, name: 'DLSS 4.5 Super Resolution', en: 'Official release notes for that update.', zh: '该更新的官方发布说明。'},
  {url: developer, name: 'NVIDIA Developer — DLSS', en: 'Developer integration resources, not a consumer installer.', zh: '开发者集成资源，不是消费端安装包。'},
];
const communityDownloads = [
  {url: 'https://github.com/Merserk/dlss5-visual-enhancer', name: 'dlss5-visual-enhancer', en: 'A third-party GitHub repository.', zh: '第三方 GitHub 仓库。'},
  {url: 'https://sourceforge.net/projects/dlss-5-swapper.mirror/', name: 'SourceForge — dlss-5-swapper', en: 'A third-party mirror page on SourceForge.', zh: 'SourceForge 上的第三方镜像页。'},
  {url: 'https://dlss-5-swapper.en.uptodown.com/windows', name: 'uptodown — DLSS 5 Swapper', en: 'A third-party distribution page on uptodown.', zh: 'uptodown 上的第三方分发页。'},
  {url: 'https://www.nexusmods.com/site/mods/2228', name: 'Nexus Modding Tools', en: 'A third-party modding-tool page on Nexus Mods.', zh: 'Nexus Mods 上的第三方模组工具页面。'},
];
const dlss5Release = 'https://www.nvidia.com/en-us/geforce/news/nba-2k27-dlss-5-3d-guided-neural-rendering-geforce-game-ready-driver/';
const questions = ['Can I download DLSS 5?', 'How do I install DLSS 5?', 'Is DLSS 5 available?'];
const answers = {
  en: [
    'For supported in-game use, NVIDIA’s September 3, 2026 release documents DLSS 5 in NBA 2K27 on GeForce RTX 50 Series GPUs, with Game Ready Driver 616.64. Use NVIDIA’s app or driver website for its driver downloads; developer plugins are separate integration resources, not a universal consumer installer. Our downloadable recipe and review kit is independent reference material, not a driver, game runtime or Studio installer.',
    'For the NBA 2K27 configuration documented by NVIDIA, obtain the appropriate Game Ready driver through the NVIDIA app or NVIDIA’s driver website, then open the game and enable “DLSS Neural Rendering” in Video Settings. Follow NVIDIA’s current requirements and the game’s updates; this is not a procedure for every game or GPU. Our review kit needs no installation. Third-party programs are separate, untested projects here; this page provides no DLL replacement or injection instructions.',
    'Yes, NVIDIA’s September 3, 2026 announcement confirms DLSS 5 in NBA 2K27 on GeForce RTX 50 Series GPUs. That is a documented release, not proof of support for every title or older RTX card; check the specific game’s release notes. Our DLSS5 Studio is a separate, independent Windows RTX style-conversion and neural-render redraw tool: sign in and use the request form below to apply for access. A request does not guarantee access or a delivery date. We provide no public Studio installer or Android APK; the browser example is a separate workflow, not NVIDIA DLSS running in a phone game.',
  ],
  zh: [
    '游戏内的已发布途径有明确实例：NVIDIA 2026 年 9 月 3 日的公告说明，NBA 2K27 在 GeForce RTX 50 系列上提供 DLSS 5，并发布了 Game Ready 616.64 驱动。驱动请从 NVIDIA App 或 NVIDIA 驱动网站获取；开发者插件是另一类集成资源，不是通用消费端安装程序。本站可下载的配方与审阅材料是独立参考资料，不是驱动、游戏运行时或 Studio 安装包。',
    '对于 NVIDIA 文档所说明的 NBA 2K27 配置，请从 NVIDIA App 或 NVIDIA 驱动网站获取适用的 Game Ready 驱动，再进入游戏的视频设置，开启“DLSS Neural Rendering”。请同时核对 NVIDIA 当前要求与游戏更新；这不是适用于所有游戏或显卡的安装步骤。本站审阅材料无需安装。第三方程序是独立项目，本站未测试；本页不提供替换 DLL 或注入的操作说明。',
    '已有明确发布的实例：NVIDIA 2026 年 9 月 3 日公告确认，NBA 2K27 在 GeForce RTX 50 系列上提供 DLSS 5。这不等于所有游戏或更早的 RTX 显卡都支持，具体仍需核对游戏更新说明。本站 DLSS5 Studio 是独立的 Windows RTX 风格转换与神经渲染重绘工具，请登录后使用下方表单申请；申请不保证获准，也不承诺交付日期。本站不提供公开的 Studio 安装包或安卓 APK；浏览器示例是另一条工作流，不是在手机游戏里运行 NVIDIA DLSS。',
  ],
};
export default function DownloadIntent({ chinese = false }: { chinese?: boolean }) {
  const language = chinese ? 'zh' : 'en';
  const description = chinese ? '游戏角色风格重绘的独立审阅清单、规划矩阵和空白记录表；不是游戏运行时，无需安装。' : 'Independent game-character redraw review checklists, a planning matrix and a blank decision record; not a game runtime and no installation required.';
  const schema = {
    '@context': 'https://schema.org', '@type': 'DigitalDocument',
    name: chinese ? 'DLSS 5 风格配方与审阅材料 v2' : 'DLSS 5-style recipe and review kit v2', description,
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
        <p className="mt-2 text-sm">{chinese ? '来源：' : 'Sources: '}<a className="text-primary underline" href={dlss5Release}>NVIDIA — NBA 2K27 / DLSS 5 (2026-09-03)</a> · <a className="text-primary underline" href={developer}>NVIDIA Developer — DLSS</a> · {chinese ? '核对日期：' : 'Checked: '}<time dateTime="2026-10-25">2026-10-25</time></p>
      </div>)}
    </section>
    <section id="review-kit" aria-labelledby="review-kit-heading" className="rounded-xl border border-outline-variant/20 p-6">
      <h2 id="review-kit-heading" className="text-2xl font-bold text-white">{chinese ? '下载游戏角色风格配方与审阅材料 v2' : 'Download the game-character recipe and review kit v2'}</h2>
      <p className="mt-3">{description}</p>
      <p className="mt-3">{chinese ? '只整理本站已发布的审阅清单、五方向规划矩阵与验收步骤。不是 APK，不含任何 NVIDIA 二进制或 DLL，也不是 Studio 程序。' : 'Compiled from our published review checklist, five-direction planning matrix and acceptance steps. It is not an APK, contains no NVIDIA binaries or DLLs, and is not the Studio application.'}</p>
      <p className="mt-3">{chinese ? 'v2 另含三条公开风格样例的固定提示词原文、标为未验证效果的五方向简报模板，以及只读取图片元数据的本地脚本。提示词与文章所讨论任务的对应关系见包内目录；不保证生成效果。' : 'v2 adds the exact fixed prompts from three public style samples, a five-direction brief template with unverified effects, and a local image-metadata script. See the prompt catalog for its relationship to the article tasks; generation results are not guaranteed.'}</p>
      <p className="mt-3">{chinese ? '可选本地审阅：使用 Node.js 18 或更新版，把两张图放在解压后的 tools/review-pair.mjs 旁，在该目录运行。脚本零依赖、不上传图片，不给画质或相似度结论。' : 'Optional local review: with Node.js 18 or later, place two images beside the extracted tools/review-pair.mjs and run from that directory. The script has no dependencies, uploads nothing, and gives no quality or similarity verdict.'}</p>
      <pre className="mt-3 overflow-x-auto"><code>node review-pair.mjs source.jpg result.webp</code></pre>
      <ul className="mt-4 list-disc pl-5">{kit.files.map(file => <li key={file}><code>{file}</code></li>)}</ul>
      <p className="mt-4">{chinese ? '文件大小：' : 'File size: '}{kit.bytes} bytes</p>
      <p className="break-all">SHA-256: <code>{kit.sha256}</code></p>
      <a className="mt-5 inline-block rounded-lg bg-primary px-5 py-3 font-bold text-black" href={kit.path} download="dlss5-style-recipe-kit-v2.zip" onClick={() => trackEvent('download_click', { file: 'recipe-kit-v2', surface: 'kit_section' })}>{chinese ? '下载配方与审阅材料 v2 ZIP' : 'Download recipe and review kit v2 ZIP'}</a>
      <p className="mt-3"><a className="text-primary underline" href={kit.previous.path} download="dlss5-review-kit.zip">{chinese ? '上一版：审阅材料 v1' : 'Previous version: review kit v1'}</a></p>
    </section>
    <section data-official-directory aria-labelledby="official-downloads-heading">
      <h2 id="official-downloads-heading" className="text-2xl font-bold text-white">{chinese ? '官方能下到的东西' : 'What you can download from official channels'}</h2>
      <p className="mt-3">{chinese ? '这些都是官方渠道，能下到的是 DLSS 4.5 这类已发布组件与开发资源；面向普通用户的 DLSS 5 独立下载仍未确认。' : 'These are official channels for released components such as DLSS 4.5 and developer resources; a standalone consumer DLSS 5 download remains unconfirmed.'}</p>
      <ul className="mt-4 space-y-4">{officialDownloads.map(item => <li key={item.url}><a className="text-primary underline" href={item.url} target="_blank" rel="noopener noreferrer">{item.name}</a><p className="text-sm break-all">{item.url}</p><p>{chinese ? item.zh : item.en}</p></li>)}</ul>
    </section>
    <section data-community-directory aria-labelledby="community-downloads-heading">
      <h2 id="community-downloads-heading" className="text-2xl font-bold text-white">{chinese ? '社区工具在哪下' : 'Where to find community tools'}</h2>
      <ul className="mt-4 space-y-4">{communityDownloads.map(item => <li key={item.url}><a className="text-primary underline" href={item.url} target="_blank" rel="noopener noreferrer nofollow">{item.name}</a><p>{chinese ? item.zh : item.en}</p><p>{chinese ? '第三方 / 非本站提供 / 未经验证：我们没测过该工具。' : 'Third-party / not provided by us / unverified: we have not tested this tool.'}</p></li>)}</ul>
      <p className="mt-4">{chinese ? '通用风险提示：第三方下载可能含捆绑内容或触发游戏反作弊，请自行判断。' : 'General risk notice: third-party downloads may include bundled content or trigger game anti-cheat systems; use your own judgment.'}</p>
      <p className="mt-3">{chinese ? '出于许可与安全原因，本站只提供目录外链，不托管、不镜像、不重新分发任何第三方二进制或 NVIDIA DLL，也不对工具可用性、安全性背书。' : 'For licensing and safety reasons, this directory only links out: we do not host, mirror or redistribute any third-party binaries or NVIDIA DLLs, or endorse their functionality or safety.'}</p>
    </section>
    <section aria-labelledby="download-facts-heading">
      <h2 id="download-facts-heading" className="text-2xl font-bold text-white">{chinese ? '人们实际在下什么' : 'What people are actually downloading'}</h2>
      <div className="mt-4 overflow-x-auto"><table className="w-full text-left"><thead><tr><th>{chinese ? '项目' : 'Item'}</th><th>{chinese ? '事实与边界' : 'Facts and limits'}</th></tr></thead><tbody>
        <tr><th>NVIDIA App</th><td>{chinese ? 'NVIDIA 官方应用；已核对的发布说明提供 DLSS 4.5 Super Resolution 更新途径。' : 'NVIDIA’s official app; the checked release documents the DLSS 4.5 Super Resolution update path.'} <a href={app} className="text-primary underline">{chinese ? '官方来源' : 'Official source'}</a></td></tr>
        <tr><th>{chinese ? '游戏内 DLSS 更新' : 'In-game DLSS updates'}</th><td>{chinese ? '支持与更新可随游戏补丁提供，具体版本以该游戏更新说明为准；不是通用安装程序。' : 'Support and updates can arrive through game patches; consult that game’s release notes for the version, rather than treating them as a universal installer.'} <a href={app} className="text-primary underline">{chinese ? 'NVIDIA 游戏更新实例' : 'NVIDIA game-update example'}</a></td></tr>
        <tr><th>{chinese ? '第三方 dlss-5-swapper 镜像' : 'Third-party dlss-5-swapper mirrors'}</th><td>{chinese ? 'SourceForge 与 uptodown 存在这类镜像页面。本站不提供、不验证这类第三方注入工具；不推荐、不背书，不提供二进制文件或安装步骤；目录外链见上方。' : 'Such mirror pages exist on SourceForge and uptodown. We do not provide or verify these third-party injection tools; we do not recommend or endorse them, or provide binaries or installation steps; directory links appear above.'}</td></tr>
      </tbody></table></div>
      <p className="mt-3 text-sm">Last checked: <time dateTime="2026-10-23">2026-10-23</time>{chinese ? '（最后核对）' : ''}</p>
    </section>
  </div>;
}
