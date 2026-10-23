import kit from '../content/reviewKit.json';

/** The same additive guide is rendered in React and in crawler-facing HTML. */
export default function DownloadUsageGuide({ chinese = false }: { chinese?: boolean }) {
  const downloadPath = chinese ? '/zh/download' : '/download';
  const returnPath = encodeURIComponent(`${downloadPath}#request`);
  const t = (en: string, zh: string) => chinese ? zh : en;
  const linkClass = 'text-primary underline underline-offset-4 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4';
  const steps = [
    [
      t('Open the browser example', '先打开浏览器示例'),
      t('Use the game-character example for a style, lighting and material reference. For an image-enhancement example, use the separate visual enhancer. These supplied examples can be tried without signing in; your phone does not install a DLSS runtime.', '想看角色风格、光照和材质变化，打开游戏角色示例；想看图片增强，使用单独的视觉增强示例。内置示例可免登录试用，手机不会因此安装 DLSS 运行时。'),
    ],
    [
      t('Run the example and inspect the result', '运行示例，再查看真实返回结果'),
      t('Choose the example’s run action and wait for its result. If a limit or an error is shown, follow that message rather than assuming the task finished. A cached example illustrates the workflow; it is not a new run of your own picture.', '使用示例的运行入口，等待结果返回。遇到限额或错误时以界面提示为准，不把等待状态当成已完成。缓存示例用于体验流程，并不等于重新处理了你自己的图片。'),
    ],
    [
      t('Compare before downloading', '对比后再下载图片'),
      t('Drag the input/output comparison and check faces, hands, text, object outlines and materials. The result can invent detail; keep the source. Use the result’s download link only when it is ready. An image download is not an Android app.', '拖动输入/输出对比，检查人脸、手部、文字、物体轮廓和材质。结果可能生成原图没有的细节，请保留源图。结果就绪后再用下载链接；下载图片不等于下载安卓应用。'),
    ],
    [
      t('Sign in for your own files', '处理自己的图片时再登录'),
      t('Your own upload uses the signed-in workspace. Read its file, credit and output limits before submitting. The browser service and the Windows tool are different processing paths; neither enables a DLSS feature inside a phone game.', '上传自己的图片需要进入已登录工作区；提交前查看页面的文件、积分和输出限制。浏览器服务与 Windows 工具是不同处理路径，都不能替手机游戏开启 DLSS 功能。'),
    ],
  ];
  const requestSteps = [
    [t('Register or sign in, then return here', '注册或登录后返回本页'), t('Use the existing request area on this page, or sign in through the link below. The request email and form stay behind the account gate.', '使用本页原有申请区，或通过下方入口登录后返回。索取邮箱和申请表仍仅对已登录账号显示。')],
    [t('Describe the machine and the job', '写清机器与用途'), t('In the existing form, state your Windows version, RTX model, and whether you want to process images or video. Check the published system requirements below; do not infer compatibility from the browser example.', '在原有表单里填写 Windows 版本、RTX 型号，以及图片或视频用途；按本页原有系统要求核对，不从浏览器示例推断本地兼容性。')],
    [t('Submit once and read the actual confirmation', '提交一次，读取实际回执'), t('A received request is not a public installer or an immediate software download. If the form reports an error or unconfirmed delivery, use the guidance it shows. Follow the email reply for availability and compatibility; this guide adds no delivery date, price or support promise.', '申请被接收不等于拿到公开安装包，也不等于立即下载软件。表单提示错误或邮件投递未确认时，按它的说明处理。可用性和兼容性以邮件回复为准；本指南不新增交付日期、价格或支持承诺。')],
  ];
  const rows = [
    [t('Android APK / app installer', 'Android APK / 应用安装包'), t('Not provided by this site. The browser example does not require installing an APK.', '本站不提供。浏览器示例不要求安装 APK。')],
    [t('Browser example', '浏览器示例'), t('Try a supplied example, compare its image result, and sign in for your own upload. This is an independent image workflow, not NVIDIA DLSS.', '先运行内置示例、对比图片结果，再登录上传自己的图片。这是独立图像工作流，不是 NVIDIA DLSS。')],
    [t('Recipe and review ZIP', '配方与审阅 ZIP'), t('Reference materials and commands listed in the kit. Not an APK, driver, game patch or Windows Studio installer.', '内容为材料包列出的参考资料与命令，不是 APK、驱动、游戏补丁或 Windows Studio 安装器。')],
    [t('Windows Studio', 'Windows Studio'), t('A separate local-tool request path. Register or sign in to use the existing request form; receiving access is not automatic.', '独立本地工具的申请路径。注册或登录后使用原有申请表，不会自动获得访问。')],
  ];
  const renderSteps = (items: string[][]) => <ol className="mt-5 space-y-4 list-decimal pl-6">{items.map(([heading, body]) => <li key={heading} className="pl-2"><h3 className="font-semibold text-white">{heading}</h3><p className="mt-2 text-sm leading-relaxed text-zinc-300">{body}</p></li>)}</ol>;
  return <div data-download-usage-guide className="mb-16 space-y-10">
    <nav aria-label={t('Download questions', '下载问题导航')} className="flex flex-wrap gap-x-5 gap-y-3 text-sm">
      <a href="#android-apk-boundary" className={linkClass}>{t('Android / APK boundaries', '安卓 / APK 边界')}</a>
      <a href="#mobile-browser-steps" className={linkClass}>{t('Use a phone browser', '手机浏览器怎么用')}</a>
      <a href="#studio-application-steps" className={linkClass}>{t('Request Windows Studio', 'Windows Studio 怎么申请')}</a>
    </nav>
    <section id="android-apk-boundary" className="scroll-mt-28 rounded-2xl border border-outline-variant/20 bg-surface-low p-5 sm:p-8">
      <h2 className="text-2xl font-bold text-white">{t('DLSS 5 APK or Android download: what does this site provide?', 'DLSS 5 APK / Android 下载：本站实际提供什么？')}</h2>
      <p className="mt-4 leading-relaxed text-zinc-300">{t('Searching for “DLSS 5 APK”, “DLSS 5 mobile download” or “DLSS 5 download Android” can mean different jobs. Here you can try a browser workflow or download our review materials; neither installs DLSS in a game. DLSS5 Studio has its own Windows request path. This is an independent site, not affiliated with NVIDIA.', '搜索“DLSS 5 APK”“DLSS 5 mobile download”或“DLSS 5 download Android”可能是在找不同的东西。本站提供浏览器工作流和可下载审阅材料，两者都不会为游戏安装 DLSS；DLSS5 Studio 则走独立的 Windows 申请路径。本站为独立项目，与 NVIDIA 无关联。')}</p>
      <div className="mt-5 overflow-x-auto"><table className="w-full min-w-[360px] text-left text-sm"><caption className="sr-only">{t('Different downloads and what they mean', '下载对象与实际用途')}</caption><thead><tr className="border-b border-outline-variant/30"><th scope="col" className="py-3 pr-5 text-white">{t('What you are looking for', '你在找什么')}</th><th scope="col" className="py-3 text-white">{t('What is available here', '本站实际提供什么')}</th></tr></thead><tbody>{rows.map(([name, body]) => <tr key={name} className="border-b border-outline-variant/15"><th scope="row" className="py-4 pr-5 font-medium text-white">{name}</th><td className="py-4 leading-relaxed text-zinc-300">{body}</td></tr>)}</tbody></table></div>
      <p className="mt-5 text-sm"><a className={linkClass} href={kit.path} download>{t('Download the existing recipe and review kit (ZIP)', '下载现有配方与审阅材料（ZIP）')}</a>{' · '}<a className={linkClass} href={chinese ? '/zh/dlss-5-apk' : '/dlss-5-apk'}>{t('Read the Android / APK status guide', '查看安卓 / APK 状态说明')}</a></p>
    </section>
    <section id="mobile-browser-steps" className="scroll-mt-28 rounded-2xl border border-outline-variant/20 bg-surface-low p-5 sm:p-8">
      <h2 className="text-2xl font-bold text-white">{t('How to use the browser workflow on a phone', '手机浏览器怎么使用？')}</h2>
      {renderSteps(steps)}
      <p className="mt-6 flex flex-wrap gap-4 text-sm"><a className={linkClass} href="/dashboard?tool=game-character-style&sample=characterStyle">{t('Open the game-character browser example', '打开游戏角色浏览器示例')}</a><a className={linkClass} href={chinese ? '/zh/visual-enhancer' : '/visual-enhancer'}>{t('Try the separate visual enhancer example', '试用单独的视觉增强示例')}</a></p>
    </section>
    <section id="studio-application-steps" className="scroll-mt-28 rounded-2xl border border-outline-variant/20 bg-surface-low p-5 sm:p-8">
      <h2 className="text-2xl font-bold text-white">{t('How to request Windows DLSS5 Studio', 'Windows DLSS5 Studio 怎么申请？')}</h2>
      {renderSteps(requestSteps)}
      <p className="mt-6 flex flex-wrap gap-4 text-sm"><a className={linkClass} href={`/login?next=${returnPath}`}>{t('Sign in and return to the request area', '登录并返回申请区')}</a><a className={linkClass} href={chinese ? '/zh/system-requirements' : '/system-requirements'}>{t('Read the system requirements and boundaries', '查看系统要求与边界')}</a></p>
    </section>
  </div>;
}
