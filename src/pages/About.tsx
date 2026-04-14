import React from 'react';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';

const TECH_FAQ = [
  {
    q: 'What is NVIDIA DLSS 5?',
    q_zh: '什么是 NVIDIA DLSS 5？',
    a: 'NVIDIA DLSS 5 (Deep Learning Super Sampling 5) is the fifth generation of NVIDIA\'s AI-powered image upscaling technology. It uses deep learning neural networks running on NVIDIA Tensor Cores to reconstruct high-resolution images from lower-resolution inputs, delivering sharper details and better performance than traditional upscaling methods.',
    a_zh: 'NVIDIA DLSS 5（深度学习超级采样第5代）是 NVIDIA 第五代 AI 图像超分辨率技术。它利用运行在 NVIDIA Tensor Core 上的深度学习神经网络，从低分辨率输入重建高分辨率图像，比传统缩放方法提供更清晰的细节和更好的性能。',
  },
  {
    q: 'How does DLSS 5 work on Tensor Cores?',
    q_zh: 'DLSS 5 如何在 Tensor Core 上工作？',
    a: 'DLSS 5 runs dedicated neural networks on NVIDIA Tensor Cores — hardware specifically designed for matrix multiplication operations that deep learning models require. When you enable DLSS 5, the game renders at a lower resolution while the Tensor Cores reconstruct a full-resolution output in real time.',
    a_zh: 'DLSS 5 在 NVIDIA Tensor Core 上运行专用神经网络——Tensor Core 是专为深度学习所需的矩阵乘法运算设计的硬件。当启用 DLSS 5 时，游戏以较低分辨率渲染，而 Tensor Core 实时重建全分辨率输出。',
  },
  {
    q: 'What\'s the difference between DLSS versions?',
    q_zh: 'DLSS 各版本有什么区别？',
    a: 'DLSS 2 introduced smart upscaling with AI reconstruction. DLSS 3 added Frame Generation — creating entirely new frames between rendered ones. DLSS 4 refined frame generation and introduced Multi Frame Generation. DLSS 5 represents a fundamental shift toward neural rendering, focusing on what you see rather than just frame rates.',
    a_zh: 'DLSS 2 引入了 AI 重建智能超分。DLSS 3 添加了帧生成——在渲染帧之间创建全新帧。DLSS 4 改进了帧生成并引入多帧生成。DLSS 5 代表了神经渲染的根本性转变，专注于用户所见，而不仅仅是帧率。',
  },
  {
    q: 'Which NVIDIA GPUs support DLSS 5?',
    q_zh: '哪些 NVIDIA GPU 支持 DLSS 5？',
    a: 'DLSS 5 is supported on NVIDIA RTX 40-series GPUs (RTX 4090, 4080, 4070, etc.) and newer. The technology requires Tensor Cores, which are available on all RTX graphics cards. DLSS 5 neural rendering features are optimized for Ada Lovelace and newer architectures.',
    a_zh: 'DLSS 5 支持 NVIDIA RTX 40 系列 GPU（RTX 4090、4080、4070 等）及更新型号。该技术需要 Tensor Core，所有 RTX 显卡均配备。DLSS 5 神经渲染功能针对 Ada Lovelace 及更新架构优化。',
  },
  {
    q: 'Is DLSS 5 official NVIDIA technology?',
    q_zh: 'DLSS 5 是官方 NVIDIA 技术吗？',
    a: 'This website is an independent, non-official showcase inspired by NVIDIA DLSS technology. NVIDIA, DLSS, and related trademarks belong to NVIDIA Corporation. This tool demonstrates neural super-resolution concepts using a separate AI model.',
    a_zh: '本网站是受 NVIDIA DLSS 技术启发的独立非官方展示。NVIDIA、DLSS 及相关商标归 NVIDIA Corporation 所有。本工具使用独立的 AI 模型演示神经超分辨率概念。',
  },
];

export default function About() {
  const { t, i18n } = useTranslation();
  const isZh = i18n.language.startsWith('zh');

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "name": "NVIDIA DLSS 5 — Complete Technical Guide",
    "description": "In-depth explanation of NVIDIA DLSS 5 neural rendering technology. How Tensor Cores power AI upscaling, and what makes DLSS 5 different from previous generations.",
    "about": {
      "@type": "Thing",
      "name": "NVIDIA DLSS 5"
    }
  };

  return (
    <main className="pt-32 pb-24 px-6 max-w-[900px] mx-auto">
      <SEO
        title="NVIDIA DLSS 5 — Neural Rendering Technology & Tensor Core Guide"
        description="Complete guide to NVIDIA DLSS 5 neural rendering. Learn how DLSS 5 uses Tensor Cores for AI upscaling, supported RTX GPUs, and how it differs from DLSS 4 and FSR 4."
        canonical="/about"
        structuredData={structuredData}
      />

      <h1 className="text-4xl md:text-5xl font-headline font-bold text-white mb-6 leading-tight">
        {isZh ? 'NVIDIA DLSS 5 技术详解' : 'NVIDIA DLSS 5 — Neural Rendering Explained'}
      </h1>
      <p className="text-zinc-400 text-lg leading-relaxed mb-12">
        {isZh
          ? '深入解析 NVIDIA DLSS 5 神经渲染技术：工作原理、Tensor Core 加速、版本对比，以及它与传统图像缩放的本质区别。'
          : 'A deep dive into NVIDIA DLSS 5 neural rendering: how it works, what Tensor Cores do, how versions differ, and why it changes everything about AI image upscaling.'}
      </p>

      <section className="mb-16">
        <h2 className="text-2xl font-headline font-bold text-white mb-6">
          {isZh ? 'DLSS 5 核心原理' : 'How DLSS 5 Works'}
        </h2>
        <div className="space-y-6 text-zinc-300 leading-relaxed">
          <p>
            {isZh
              ? 'DLSS（Deep Learning Super Sampling，深度学习超级采样）是 NVIDIA 专有的 AI 图像重建技术。与传统的双线性或双三次插值缩放不同，DLSS 利用在数百万张图像上训练的神经网络，在 Tensor Core 上实时推理，预测并重建高分辨率像素。'
              : 'DLSS (Deep Learning Super Sampling) is NVIDIA\'s proprietary AI image reconstruction technology. Unlike traditional bilinear or bicubic interpolation, DLSS uses a neural network trained on millions of images to predict and reconstruct high-resolution pixels in real time on Tensor Cores.'}
          </p>
          <p>
            {isZh
              ? 'DLSS 5 代表了与之前版本的根本性转变：它不再只关注帧率，而是改变渲染范式——从确定性计算转向学习型重建。游戏在低分辨率下渲染，Tensor Core 实时输出全分辨率结果，大幅降低 GPU 计算负担。'
              : 'DLSS 5 represents a fundamental shift from previous versions: instead of focusing solely on frame rates, it changes the rendering paradigm — from deterministic computation to learned reconstruction. Games render at lower resolutions while Tensor Cores output full-resolution results in real time, dramatically reducing GPU load.'}
          </p>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-headline font-bold text-white mb-6">
          {isZh ? 'Tensor Core 在 DLSS 5 中的作用' : 'The Role of Tensor Cores in DLSS 5'}
        </h2>
        <div className="bg-surface-low rounded-xl border border-outline-variant/20 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-4">
              <div className="text-3xl font-headline font-bold text-nvidia-green mb-2">RTX 4090</div>
              <div className="text-sm text-zinc-400">544 Tensor Cores</div>
              <div className="text-xs text-zinc-500 mt-1">1321 AI TOPS</div>
            </div>
            <div className="p-4 border-x border-outline-variant/20">
              <div className="text-3xl font-headline font-bold text-nvidia-green mb-2">RTX 4080</div>
              <div className="text-sm text-zinc-400">304 Tensor Cores</div>
              <div className="text-xs text-zinc-500 mt-1">836 AI TOPS</div>
            </div>
            <div className="p-4">
              <div className="text-3xl font-headline font-bold text-nvidia-green mb-2">RTX 4070</div>
              <div className="text-sm text-zinc-400">184 Tensor Cores</div>
              <div className="text-xs text-zinc-500 mt-1">466 AI TOPS</div>
            </div>
          </div>
        </div>
        <p className="text-zinc-300 text-sm leading-relaxed">
          {isZh
            ? 'NVIDIA RTX GPU 上的专用 Tensor Core 硬件是 DLSS 的核心。所有 RTX 显卡均支持 DLSS，但最新一代（Ada Lovelace / RTX 40 系列）的第五代 Tensor Core 提供了最强的 AI 推理性能。'
            : 'Dedicated Tensor Core hardware on NVIDIA RTX GPUs is the engine behind DLSS. All RTX graphics cards support DLSS, but the latest generation (Ada Lovelace / RTX 40 series) fifth-generation Tensor Cores deliver the strongest AI inference performance.'}
        </p>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-headline font-bold text-white mb-6">
          {isZh ? 'DLSS 版本对比：从 DLSS 2 到 DLSS 5' : 'DLSS Version Comparison: DLSS 2 vs DLSS 3 vs DLSS 4 vs DLSS 5'}
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-high border-b border-outline-variant/20">
                <th className="px-4 py-3 text-xs font-label uppercase tracking-widest text-primary">Version</th>
                <th className="px-4 py-3 text-xs font-label uppercase tracking-widest text-zinc-400">Core Technology</th>
                <th className="px-4 py-3 text-xs font-label uppercase tracking-widest text-zinc-400">Frame Generation</th>
                <th className="px-4 py-3 text-xs font-label uppercase tracking-widest text-zinc-400">Best For</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              <tr>
                <td className="px-4 py-4 text-sm font-medium text-white">DLSS 2</td>
                <td className="px-4 py-4 text-sm text-zinc-300">AI Upscaling (4x max)</td>
                <td className="px-4 py-4 text-sm text-zinc-500">—</td>
                <td className="px-4 py-4 text-sm text-zinc-300">General gaming</td>
              </tr>
              <tr>
                <td className="px-4 py-4 text-sm font-medium text-white">DLSS 3</td>
                <td className="px-4 py-4 text-sm text-zinc-300">Upscaling + Optical Flow</td>
                <td className="px-4 py-4 text-sm text-nvidia-green font-semibold">✅ 1x</td>
                <td className="px-4 py-4 text-sm text-zinc-300">High fps gaming</td>
              </tr>
              <tr>
                <td className="px-4 py-4 text-sm font-medium text-white">DLSS 3.5</td>
                <td className="px-4 py-4 text-sm text-zinc-300">Ray Reconstruction</td>
                <td className="px-4 py-4 text-sm text-nvidia-green font-semibold">✅ Enhanced</td>
                <td className="px-4 py-4 text-sm text-zinc-300">Ray tracing titles</td>
              </tr>
              <tr>
                <td className="px-4 py-4 text-sm font-medium text-white">DLSS 4</td>
                <td className="px-4 py-4 text-sm text-zinc-300">Multi Frame Generation</td>
                <td className="px-4 py-4 text-sm text-nvidia-green font-semibold">✅ 1-3x</td>
                <td className="px-4 py-4 text-sm text-zinc-300">Flagship performance</td>
              </tr>
              <tr>
                <td className="px-4 py-4 text-sm font-medium text-white">DLSS 5</td>
                <td className="px-4 py-4 text-sm text-nvidia-green font-semibold">Neural Rendering (full shift)</td>
                <td className="px-4 py-4 text-sm text-nvidia-green font-semibold">✅ Multi ×4</td>
                <td className="px-4 py-4 text-sm text-zinc-300">Neural reconstruction era</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-headline font-bold text-white mb-6">
          {isZh ? '常见问题 (FAQ)' : 'Frequently Asked Questions'}
        </h2>
        <div className="space-y-4">
          {TECH_FAQ.map((faq, i) => (
            <details key={i} className="group bg-surface-low rounded-xl border border-outline-variant/10">
              <summary className="flex justify-between items-center p-6 cursor-pointer list-none">
                <h3 className="text-white font-medium text-base">{isZh ? faq.q_zh : faq.q}</h3>
                <div className="w-5 h-5 text-primary shrink-0 ml-4 group-open:rotate-180 transition-transform">▼</div>
              </summary>
              <div className="px-6 pb-6 text-zinc-400 text-sm leading-relaxed">
                {isZh ? faq.a_zh : faq.a}
              </div>
            </details>
          ))}
        </div>
      </section>

      <section className="mt-12 p-6 bg-surface-low rounded-xl border border-outline-variant/20 text-center">
        <h2 className="text-xl font-headline font-bold text-white mb-4">
          {isZh ? '立即体验 NVIDIA DLSS 5 风格 AI 超分' : 'Experience NVIDIA DLSS 5-Style AI Upscaling Now'}
        </h2>
        <p className="text-zinc-400 text-sm mb-6">
          {isZh
            ? '无需 NVIDIA GPU，无需安装。直接在浏览器中体验基于神经超分辨率的 AI 图像增强。'
            : 'No NVIDIA GPU required, no installation. Experience AI image enhancement powered by neural super-resolution directly in your browser.'}
        </p>
        <a
          href="/dashboard"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-black font-bold rounded-lg hover:bg-primary-container transition-colors"
        >
          {isZh ? '立即试用免费工具' : 'Try Free Tool Now'}
        </a>
      </section>
    </main>
  );
}
