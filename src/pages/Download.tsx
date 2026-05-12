import React from 'react';
import { useTranslation } from 'react-i18next';
import { Download, ExternalLink, Github, AlertTriangle, Cpu, ShieldCheck, Monitor, ChevronDown } from 'lucide-react';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';

const RTX_MODELS = [
  { series: 'RTX 5090', arch: 'Blackwell', dlss5: true, dlss4: true },
  { series: 'RTX 5080', arch: 'Blackwell', dlss5: true, dlss4: true },
  { series: 'RTX 5070 Ti', arch: 'Blackwell', dlss5: true, dlss4: true },
  { series: 'RTX 5070', arch: 'Blackwell', dlss5: true, dlss4: true },
  { series: 'RTX 4090', arch: 'Ada Lovelace', dlss5: false, dlss4: true },
  { series: 'RTX 4080 Super', arch: 'Ada Lovelace', dlss5: false, dlss4: true },
  { series: 'RTX 4080', arch: 'Ada Lovelace', dlss5: false, dlss4: true },
  { series: 'RTX 4070 Ti Super', arch: 'Ada Lovelace', dlss5: false, dlss4: true },
  { series: 'RTX 4070 Super', arch: 'Ada Lovelace', dlss5: false, dlss4: true },
  { series: 'RTX 4070', arch: 'Ada Lovelace', dlss5: false, dlss4: true },
  { series: 'RTX 4060 Ti', arch: 'Ada Lovelace', dlss5: false, dlss4: true },
  { series: 'RTX 4060', arch: 'Ada Lovelace', dlss5: false, dlss4: true },
];

export default function Download() {
  const { t, i18n } = useTranslation();
  const isZh = i18n.language.startsWith('zh');

  const faqs = [
    {
      q: isZh ? 'DLSS 5 官方下载在哪里？' : 'Where can I download DLSS 5 officially?',
      a: isZh
        ? 'DLSS 5 不是一个独立下载的软件。它集成在支持的游戏和 NVIDIA GeForce Experience / NVIDIA App 中。当你在 RTX 50 系列显卡上运行支持的游戏时，DLSS 5 会自动启用。'
        : 'DLSS 5 is not a standalone download. It is built into supported games and the NVIDIA app. When you run a supported game on an RTX 50 series GPU, DLSS 5 activates automatically.',
    },
    {
      q: isZh ? 'DLSS 在哪里可以下载？是免费的吗？' : 'Is DLSS free to download? Where do I get it?',
      a: isZh
        ? 'DLSS 是 NVIDIA 显卡的免费功能。只要你有一张支持的 NVIDIA RTX 显卡，DLSS 就在 NVIDIA 驱动程序中可用，无需单独下载任何东西。'
        : 'DLSS is a free feature of NVIDIA GPUs. If you have a supported NVIDIA RTX graphics card, DLSS comes bundled in the NVIDIA driver — no separate download needed.',
    },
    {
      q: isZh ? 'DLSS 有 GitHub 吗？是开源的吗？' : 'Is DLSS on GitHub? Is it open source?',
      a: isZh
        ? '不是。DLSS 不是开源项目，NVIDIA 也没有在 GitHub 上发布 DLSS 代码。NVIDIA 只在部分 SDK 中提供了 DLSS 的集成接口，供游戏开发者使用。如果你在 GitHub 上看到标榜"DLSS"的项目，它们通常是第三方开源实现，不是 NVIDIA 官方产品。'
        : 'No. DLSS is not open source and NVIDIA has not released DLSS source code on GitHub. NVIDIA provides DLSS integration through their SDK for game developers. Any "DLSS" projects on GitHub are third-party implementations, not official NVIDIA releases.',
    },
    {
      q: isZh ? '哪些游戏支持 DLSS 5？' : 'Which games support DLSS 5?',
      a: isZh
        ? '截至 2026 年，DLSS 5 已确认支持的游戏包括 RTX 50 系列发布时的首发阵容中的 15+ 款游戏。完整列表请查看 NVIDIA 官方页面。DLSS 4/4.5 支持 950+ 款游戏。'
        : 'As of 2026, DLSS 5 has been confirmed for 15+ titles in the RTX 50 series launch lineup. DLSS 4/4.5 supports 950+ games. Check NVIDIA\'s official page for the full list.',
    },
    {
      q: isZh ? '没有 NVIDIA 显卡能用 DLSS 吗？' : 'Can I use DLSS without an NVIDIA GPU?',
      a: isZh
        ? '不能原生使用。DLSS 是 NVIDIA专有技术，仅在 RTX 系列显卡上可用。不过，你仍然可以使用基于 AI 的在线图像增强工具（如我们的工具），它们在任何设备、任何浏览器上都能工作。'
        : 'Not natively. DLSS is proprietary NVIDIA technology, exclusive to RTX GPUs. However, you can still use AI-powered online image enhancement tools — like our DLSS-style upscaler — which work on any device with a browser.',
    },
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": isZh
      ? 'DLSS 5 下载完整指南：官方下载、RTX 兼容列表及常见问题'
      : 'DLSS 5 Download Guide: Official Sources, RTX Compatibility & FAQ',
    "description": isZh
      ? '了解如何获取 NVIDIA DLSS 5，完整 RTX 显卡兼容列表，以及关于 DLSS 下载和 GitHub 的常见问题解答。'
      : 'Learn how to get NVIDIA DLSS 5, full RTX GPU compatibility list, and answers to common questions about DLSS downloads and GitHub.',
    "about": {
      "@type": "SoftwareApplication",
      "name": "NVIDIA DLSS",
      "applicationCategory": "MultimediaApplication",
      "operatingSystem": "Windows"
    },
    "genre": "Technology Guide",
    "datePublished": "2026-04-01",
    "dateModified": "2026-04-27"
  };

  return (
    <main className="pt-32 pb-24 px-6 max-w-[900px] mx-auto">
      <SEO
        title={isZh
          ? 'DLSS 5 下载完整指南 | RTX 显卡兼容列表及常见问题'
          : 'DLSS 5 Download Guide — Official Sources, RTX Compatibility & FAQ'}
        description={isZh
          ? '了解 DLSS 5 官方下载方式（无独立下载包）、RTX 50/40 系列显卡 DLSS 5 兼容列表，以及 DLSS GitHub 常见问题的权威解答。'
          : 'Official DLSS 5 guide: no standalone download exists. RTX 50/40 compatibility explained. Is DLSS on GitHub? Answers to the most common DLSS download questions.'}
        canonical="/download"
        structuredData={structuredData}
      />

      {/* Hero */}
      <section className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-nvidia-green/10 border border-nvidia-green/20 rounded-full text-nvidia-green text-sm font-label uppercase tracking-widest mb-6">
          <Download className="w-4 h-4" />
          {isZh ? '下载指南' : 'Download Guide'}
        </div>
        <h1 className="text-4xl md:text-5xl font-headline font-bold text-white mb-6 leading-tight">
          {isZh ? 'DLSS 5 下载指南' : 'DLSS 5 Download Guide'}
          <br />
          <span className="text-nvidia-green">{isZh ? '官方下载与常见问题' : 'Official Sources & FAQ'}</span>
        </h1>
        <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
          {isZh
            ? 'NVIDIA DLSS 不是独立软件，而是集成在 RTX 显卡驱动和游戏中的技术。本指南解答所有关于 DLSS 下载、安装和兼容性的常见问题。'
            : 'NVIDIA DLSS is not standalone software — it lives inside RTX drivers and supported games. This guide answers every common question about DLSS downloads, installation, and compatibility.'}
        </p>
      </section>

      {/* Important Notice */}
      <section className="mb-12 p-6 bg-amber-500/10 border border-amber-500/20 rounded-xl">
        <div className="flex items-start gap-4">
          <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <h2 className="text-white font-bold text-lg mb-2">
              {isZh ? '重要：DLSS 没有独立下载包' : 'Important: No Standalone DLSS Download Exists'}
            </h2>
            <p className="text-zinc-300">
              {isZh
                ? 'DLSS 是 NVIDIA 的专有技术，集成在 RTX 显卡驱动中。它不是一个可以单独下载和安装的应用程序。如果有人让你"下载 DLSS"，请谨慎甄别。唯一合法的 DLSS 官方来源是 NVIDIA GeForce Experience / NVIDIA App 和支持 DLSS 的游戏。'
                : 'DLSS is proprietary NVIDIA technology bundled into RTX GPU drivers. There is no standalone installer. If someone tells you to "download DLSS", be cautious — the only legitimate DLSS sources are the NVIDIA app and DLSS-enabled games.'}
            </p>
          </div>
        </div>
      </section>

      {/* Official NVIDIA Links */}
      <section className="mb-16">
        <h2 className="text-2xl font-headline font-bold text-white mb-6">
          {isZh ? '官方 NVIDIA 下载资源' : 'Official NVIDIA Download Resources'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="https://www.nvidia.com/download/index.aspx"
            target="_blank"
            rel="noopener noreferrer"
            className="p-5 bg-surface-low rounded-xl border border-outline-variant/20 hover:border-nvidia-green/50 transition-colors group"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-nvidia-green/20 rounded-lg flex items-center justify-center">
                <Download className="w-5 h-5 text-nvidia-green" />
              </div>
              <div>
                <h3 className="text-white font-bold group-hover:text-nvidia-green transition-colors">
                  {isZh ? 'NVIDIA 驱动程序下载' : 'NVIDIA Driver Download'}
                </h3>
                <p className="text-xs text-zinc-500">nvidia.com</p>
              </div>
              <ExternalLink className="w-4 h-4 text-zinc-500 ml-auto" />
            </div>
            <p className="text-sm text-zinc-400">
              {isZh
                ? '下载最新 NVIDIA GeForce 驱动程序。DLSS 包含在所有 RTX 显卡驱动中。'
                : 'Download the latest NVIDIA GeForce driver. DLSS is included in all RTX GPU drivers.'}
            </p>
          </a>

          <a
            href="https://www.nvidia.com/download/index.aspx"
            target="_blank"
            rel="noopener noreferrer"
            className="p-5 bg-surface-low rounded-xl border border-outline-variant/20 hover:border-nvidia-green/50 transition-colors group"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-surface-high rounded-lg flex items-center justify-center">
                <Monitor className="w-5 h-5 text-zinc-400" />
              </div>
              <div>
                <h3 className="text-white font-bold group-hover:text-nvidia-green transition-colors">
                  {isZh ? 'NVIDIA App（新）' : 'NVIDIA App (New)'}
                </h3>
                <p className="text-xs text-zinc-500">nvidia.com</p>
              </div>
              <ExternalLink className="w-4 h-4 text-zinc-500 ml-auto" />
            </div>
            <p className="text-sm text-zinc-400">
              {isZh
                ? 'NVIDIA App 是驱动更新和 DLSS 游戏管理的官方工具。'
                : 'The NVIDIA App is the official tool for driver updates and DLSS game management.'}
            </p>
          </a>
        </div>
      </section>

      {/* RTX Compatibility Table */}
      <section className="mb-16">
        <h2 className="text-2xl font-headline font-bold text-white mb-6">
          {isZh ? 'RTX 显卡 DLSS 5 兼容列表' : 'RTX GPU DLSS 5 Compatibility'}
        </h2>
        <div className="overflow-x-auto rounded-xl border border-outline-variant/20">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-high border-b border-outline-variant/20">
                <th className="px-5 py-4 text-xs font-label uppercase tracking-widest text-primary">
                  {isZh ? '显卡型号' : 'GPU'}
                </th>
                <th className="px-5 py-4 text-xs font-label uppercase tracking-widest text-primary">
                  {isZh ? '架构' : 'Architecture'}
                </th>
                <th className="px-5 py-4 text-xs font-label uppercase tracking-widest text-primary">
                  DLSS 5
                </th>
                <th className="px-5 py-4 text-xs font-label uppercase tracking-widest text-primary">
                  DLSS 4/4.5
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {RTX_MODELS.map(gpu => (
                <tr key={gpu.series} className="hover:bg-surface-low transition-colors">
                  <td className="px-5 py-4 text-sm text-white font-medium">{gpu.series}</td>
                  <td className="px-5 py-4 text-sm text-zinc-400">{gpu.arch}</td>
                  <td className="px-5 py-4">
                    {gpu.dlss5 ? (
                      <span className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-nvidia-green/20 text-nvidia-green rounded">
                        <ShieldCheck className="w-3 h-3" /> {isZh ? '支持' : 'Supported'}
                      </span>
                    ) : (
                      <span className="text-xs text-zinc-500">{isZh ? '不支持' : 'Not supported'}</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-nvidia-green/20 text-nvidia-green rounded">
                      <ShieldCheck className="w-3 h-3" /> {isZh ? '支持' : 'Supported'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-zinc-500 mt-3">
          {isZh
            ? 'DLSS 5 需要 RTX 50 系列（Blackwell 架构）。RTX 40 系列最高支持 DLSS 4.5。RTX 30 及更早不支持 DLSS 4/5。'
            : 'DLSS 5 requires RTX 50 Series (Blackwell). RTX 40 maxes out at DLSS 4.5. RTX 30 and older do not support DLSS 4 or 5.'}
        </p>
      </section>

      {/* GitHub Warning */}
      <section className="mb-16 p-6 bg-surface-low rounded-xl border border-outline-variant/20">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-surface-high rounded-lg flex items-center justify-center shrink-0">
            <Github className="w-5 h-5 text-zinc-400" />
          </div>
          <div>
            <h2 className="text-white font-bold text-lg mb-2">
              {isZh ? 'DLSS 不在 GitHub 上 — 解释清楚' : 'DLSS Is NOT on GitHub — Here\'s Why'}
            </h2>
            <p className="text-zinc-300 mb-3">
              {isZh
                ? 'NVIDIA 从未在 GitHub 上发布 DLSS 源代码。DLSS 是专有的商业技术，其核心算法属于 NVIDIA 商业机密。GitHub 上所有标榜"DLSS"的项目均为第三方逆向工程或开源复现，并非 NVIDIA 官方产品。'
                : 'NVIDIA has never released DLSS source code on GitHub. DLSS is proprietary commercial technology. Any "DLSS" projects you find on GitHub are third-party reverse-engineered implementations or open-source replicas — not official NVIDIA products.'}
            </p>
            <p className="text-zinc-400 text-sm">
              {isZh
                ? '如果你想体验类 DLSS 的 AI 图像增强功能，无需购买显卡：直接使用我们的在线工具，任何浏览器都能用，完全免费。'
                : 'If you want DLSS-style AI image enhancement without buying an RTX GPU: use our online tool. It works in any browser, on any device, for free.'}
            </p>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 bg-nvidia-green text-black text-sm font-bold rounded-lg hover:bg-nvidia-green/90 transition-colors"
            >
              {isZh ? '立即体验免费 DLSS 风格增强' : 'Try Free DLSS-Style Enhancement Now'}
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mb-16">
        <h2 className="text-2xl font-headline font-bold text-white mb-6">
          {isZh ? '常见问题' : 'Frequently Asked Questions'}
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <details
              key={i}
              className="group bg-surface-low rounded-xl border border-outline-variant/20 overflow-hidden"
            >
              <summary className="flex items-center justify-between cursor-pointer p-5 text-white font-medium hover:bg-surface-highest transition-colors list-none">
                <span>{faq.q}</span>
                <ChevronDown className="w-5 h-5 text-zinc-500 group-open:rotate-180 transition-transform shrink-0" />
              </summary>
              <div className="px-5 pb-5 text-zinc-300 text-sm leading-relaxed border-t border-outline-variant/10 pt-4">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center p-8 bg-gradient-to-br from-nvidia-green/10 to-primary/5 rounded-2xl border border-nvidia-green/20">
        <h2 className="text-2xl font-headline font-bold text-white mb-3">
          {isZh ? '不想等待？立即体验 AI 增强' : 'Don\'t Want to Wait? Experience AI Enhancement Now'}
        </h2>
        <p className="text-zinc-400 mb-6">
          {isZh
            ? '无需下载，无需安装，无需 RTX 显卡。在任何浏览器中打开即可使用 DLSS 风格的 AI 图像增强。'
            : 'No download, no installation, no RTX GPU required. Open in any browser to use DLSS-style AI image enhancement instantly.'}
        </p>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-8 py-4 bg-nvidia-green text-black text-lg font-bold rounded-xl hover:bg-nvidia-green/90 transition-colors"
        >
          <Cpu className="w-5 h-5" />
          {isZh ? '立即使用免费工具' : 'Use Free Tool Now'}
        </Link>
      </section>
    </main>
  );
}
