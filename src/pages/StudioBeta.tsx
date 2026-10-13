import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CheckCircle2, Lock, Mail } from 'lucide-react';
import SEO from '../components/SEO';
import StudioRequest from '../components/StudioRequest';
import { STUDIO_REQUEST_COPY } from '../content/studioRequest';
import { SITE_URL } from '../config/site';

const COPY = {
  en: {
    title: 'DLSS5 Studio beta request — limited Windows RTX desktop access',
    desc: 'Request a place in the limited DLSS5 Studio beta for Windows RTX machines. Sign in first; invitations are handled in batches and in submission order.',
    eyebrow: 'DLSS5 Studio · limited beta',
    h1: 'Request access to the DLSS5 Studio beta',
    lead: 'DLSS5 Studio is an independent Windows desktop tool for batch image and video processing on an NVIDIA RTX machine. It is being developed as a limited beta: sign in, submit a request, and we reply in submission order as invitation batches are processed.',
    what: 'What this is',
    whatBody: 'A Windows RTX desktop interface for local image and video work. It is a separate third-party tool, not an NVIDIA product, not a driver, and not an Android APK.',
    process: 'How the request works',
    steps: ['Sign in or create an account.', 'Submit one short note about what you want to process and your machine.', 'Requests are reviewed in order and invitations are sent in batches. A missing reply does not mean your request was rejected; you may follow up when your details change.'],
    limits: 'Hardware and measured reference',
    limitsBody: 'The baseline follows the requirements already documented on the download page: Windows 10 1909 or newer (64-bit) or Windows 11, an RTX 20 series or newer GPU, driver 610 or newer for hardware NVENC, 8 GB minimum memory with 16 GB recommended, and about 3 GB free disk space. Source: /download#requirements, reviewed 2026-10-13.',
    measured: 'Our measured reference is one Windows 11 Pro machine with an RTX 4090 24 GB and driver 591.86: a 720p input to 2560×1440 H.264 output took 87.4 seconds (2.43 seconds per frame). This is a single-machine, single-configuration observation, not a real-time performance promise. Source: /download#showcase, reviewed 2026-10-13.',
    detail: 'During the beta, we keep the request path deliberately small: the form asks what you want to process and what machine you will use. That lets us reply with a useful compatibility note instead of sending a generic file. If your hardware or use case changes, add the new detail in a follow-up. The page does not expose a public package, and it does not turn a request into a promise of access. It records interest while the desktop workflow is being prepared and gives the team a clear order in which to respond.',
    request: 'Submit your beta request',
    requestBody: 'The email and request form remain behind the existing sign-in gate. We do not publish a date, price, slot count, or public download while the beta is being prepared.',
    faq: [
      ['Is this the NVIDIA DLSS download?', 'No. This is an independent desktop tool around a local RTX workflow. NVIDIA DLSS itself is not a standalone installer.'],
      ['How are invitations sent?', 'Requests are handled in submission order and invitations are sent in batches. A missing reply does not by itself mean rejection.'],
      ['Can I apply without an RTX machine?', 'The documented baseline starts at an RTX 20 series or newer GPU. Include your operating system and GPU in the request so we can assess the machine.'],
      ['Is there an Android APK?', 'No. This page is for a Windows RTX desktop beta. For browser-based processing, use the online tools linked from the download guide.'],
      ['When will I receive access?', 'No date is promised. We reply when a request reaches a batch that can be processed.'],
      ['Is a public download available?', 'No public file is posted here. Access is handled by request while the beta is in preparation.'],
    ],
    cta: 'Read the download guide',
    ctaCases: 'See measured before-and-after references',
  },
  zh: {
    title: 'DLSS5 Studio 内测申请：有限名额 Windows RTX 桌面工具',
    desc: '申请 DLSS5 Studio Windows RTX 桌面版有限名额内测。登录后提交申请，邀请按批次发放并按提交顺序处理。',
    eyebrow: 'DLSS5 Studio · 有限名额内测',
    h1: '申请 DLSS5 Studio 桌面版内测',
    lead: 'DLSS5 Studio 是面向 NVIDIA RTX 机器的独立 Windows 桌面工具，用于批量处理图片和视频。当前按有限名额内测：登录、提交申请，我们会按提交顺序处理并分批发送邀请。',
    what: '这是什么',
    whatBody: '这是一个在 Windows RTX 机器上运行的本地图片与视频处理界面。它是独立第三方工具，不是 NVIDIA 产品、不是驱动，也不是 Android APK。',
    process: '申请流程',
    steps: ['登录或创建账号。', '填写想处理的内容和机器信息，提交一条简短申请。', '申请按提交顺序处理，邀请分批发出。暂时没有回信不等于被拒；机器信息变化时可以补充申请。'],
    limits: '硬件条件与实测参考',
    limitsBody: '条件沿用下载页已核对的口径：Windows 10 1909 或更高版本（64 位）或 Windows 11，RTX 20 系或更新显卡，使用硬件 NVENC 需要 610 或更新驱动，内存最低 8 GB、建议 16 GB，约 3 GB 可用磁盘空间。来源：/download#requirements，复核日期 2026-10-13。',
    measured: '我们的单机实测来自 Windows 11 Pro、RTX 4090 24 GB、驱动 591.86：720p 输入转为 2560×1440 H.264 输出，用时 87.4 秒（每帧 2.43 秒）。这是单机单配置观察，不是实时性能承诺。来源：/download#showcase，复核日期 2026-10-13。',
    detail: '内测期间申请流程保持简单：表单只询问你想处理什么，以及准备使用哪台机器。这样我们可以回复有用的兼容性说明，而不是发一份没有上下文的文件。如果显卡或用途变化，可以在后续邮件里补充。页面不会公开安装包，也不会把提交申请变成获得内测资格的承诺；它只记录需求，并让我们按顺序回复。',
    request: '提交内测申请',
    requestBody: '邮箱和申请表继续沿用现有登录门槛，登录后才会显示。内测准备期间不公布日期、价格、名额数量，也不提供公开下载文件。',
    faq: [
      ['这是 NVIDIA DLSS 下载吗？', '不是。这是围绕本地 RTX 工作流的独立桌面工具；NVIDIA DLSS 本身没有独立安装包。'],
      ['邀请怎么发？', '申请按提交顺序处理，邀请分批发送。暂时没有回信本身不代表被拒。'],
      ['没有 RTX 显卡可以申请吗？', '已核对的基础条件从 RTX 20 系或更新显卡开始。请在申请中写明系统和显卡，方便我们判断机器条件。'],
      ['有 Android APK 吗？', '没有。本页针对 Windows RTX 桌面内测；需要浏览器处理时，请使用下载指南里的在线工具。'],
      ['什么时候能拿到？', '不承诺日期。申请进入可处理的批次后，我们会回复。'],
      ['现在有公开下载吗？', '没有。内测准备期间通过申请处理，不在本页公开文件。'],
    ],
    cta: '阅读下载指南',
    ctaCases: '查看前后对比实测参考',
  },
} as const;

export default function StudioBeta({ forceLocale }: { forceLocale?: 'zh' | 'en' } = {}) {
  const { i18n } = useTranslation();
  const isZh = forceLocale === 'zh' || (!forceLocale && i18n.language?.startsWith('zh'));
  const copy = isZh ? COPY.zh : COPY.en;
  const requestCopy = isZh ? STUDIO_REQUEST_COPY['zh-CN'] : STUDIO_REQUEST_COPY['en-US'];
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebPage', '@id': `${SITE_URL}${isZh ? '/zh/studio-beta' : '/studio-beta'}#webpage`, url: `${SITE_URL}${isZh ? '/zh/studio-beta' : '/studio-beta'}`, name: copy.h1, description: copy.desc, inLanguage: isZh ? 'zh-CN' : 'en-US' },
      { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'DLSS5NVIDIA', item: `${SITE_URL}/` }, { '@type': 'ListItem', position: 2, name: copy.h1, item: `${SITE_URL}${isZh ? '/zh/studio-beta' : '/studio-beta'}` }] },
      { '@type': 'FAQPage', mainEntity: copy.faq.map(([question, answer]) => ({ '@type': 'Question', name: question, acceptedAnswer: { '@type': 'Answer', text: answer } })) },
    ],
  };
  const t = (key: string) => (requestCopy as Record<string, string>)[key] ?? key;
  return <main className="pt-32 pb-24 px-6 max-w-[1000px] mx-auto">
    <SEO title={copy.title} description={copy.desc} canonical={isZh ? '/zh/studio-beta' : '/studio-beta'} language={isZh ? 'zh-CN' : 'en-US'} keywords={isZh ? ['DLSS5 Studio 内测', 'DLSS 5 Windows 下载', 'RTX 桌面工具申请'] : ['DLSS5 Studio beta', 'DLSS 5 Windows desktop beta', 'RTX tool request']} structuredData={structuredData} alternates={[{ hrefLang: 'en', href: `${SITE_URL}/studio-beta` }, { hrefLang: 'zh-CN', href: `${SITE_URL}/zh/studio-beta` }, { hrefLang: 'x-default', href: `${SITE_URL}/studio-beta` }]} />
    <nav className="mb-8 text-sm text-zinc-500"><Link to={isZh ? '/zh/download' : '/download'}>{isZh ? '返回下载指南' : 'Back to download guide'}</Link><span aria-hidden="true"> / </span><span>{copy.h1}</span></nav>
    <header className="max-w-3xl"><p className="text-primary uppercase tracking-widest text-xs">{copy.eyebrow}</p><h1 className="text-4xl md:text-5xl font-headline font-bold text-white mt-4">{copy.h1}</h1><p className="text-lg leading-relaxed text-zinc-300 mt-5">{copy.lead}</p></header>
    <section className="mt-12 grid md:grid-cols-2 gap-5"><article className="rounded-xl border border-outline-variant/20 bg-surface-low p-6"><h2 className="text-2xl font-bold text-white">{copy.what}</h2><p className="mt-4 text-zinc-300 leading-relaxed">{copy.whatBody}</p></article><article className="rounded-xl border border-primary/25 bg-primary/5 p-6"><h2 className="text-2xl font-bold text-white">{copy.process}</h2><ol className="mt-4 space-y-3 text-zinc-300">{copy.steps.map((step, index) => <li key={step}><span className="text-primary font-semibold">{index + 1}.</span> {step}</li>)}</ol></article></section>
    <section className="mt-12 rounded-xl border border-outline-variant/20 bg-surface-low p-6"><h2 className="text-2xl font-bold text-white">{copy.limits}</h2><p className="mt-4 text-zinc-300 leading-relaxed">{copy.limitsBody}</p><p className="mt-4 text-zinc-300 leading-relaxed">{copy.measured}</p><p className="mt-4"><Link className="text-primary hover:underline" to={isZh ? '/zh/download#requirements' : '/download#requirements'}>{copy.cta} →</Link></p></section>
    <section className="mt-12 rounded-xl border border-outline-variant/20 bg-surface-low p-6"><h2 className="text-2xl font-bold text-white">{isZh ? '提交后会发生什么' : 'What happens after you submit'}</h2><p className="mt-4 text-zinc-300 leading-relaxed">{copy.detail}</p></section>
    <section id="request" className="mt-12"><div className="flex items-center gap-2 text-primary text-xs uppercase tracking-widest"><Lock className="w-4 h-4" aria-hidden="true" /> {copy.request}</div><p className="mt-3 text-zinc-400 leading-relaxed">{copy.requestBody}</p><div className="mt-6"><StudioRequest t={t} /></div></section>
    <section className="mt-12" id="faq"><h2 className="text-2xl font-bold text-white">{isZh ? '常见问题' : 'Frequently asked questions'}</h2><div className="mt-5 grid gap-4">{copy.faq.map(([question, answer]) => <article key={question} className="rounded-xl border border-outline-variant/20 bg-surface-low p-5"><h3 className="text-white font-semibold">{question}</h3><p className="mt-3 text-sm leading-relaxed text-zinc-300">{answer}</p></article>)}</div></section>
    <section className="mt-12 flex flex-wrap gap-4 text-sm"><Link className="text-primary hover:underline" to={isZh ? '/zh/download' : '/download'}><Mail className="inline w-4 h-4 mr-1" aria-hidden="true" />{copy.cta} →</Link><Link className="text-primary hover:underline" to={isZh ? '/zh/before-after' : '/before-after'}><CheckCircle2 className="inline w-4 h-4 mr-1" aria-hidden="true" />{copy.ctaCases} →</Link></section>
  </main>;
}
