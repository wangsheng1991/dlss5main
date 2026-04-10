import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UploadCloud, Cpu, Sparkles,
  Gauge, Zap, ShieldCheck, Shield, ChevronDown
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';
import ImageSlider from '../components/ImageSlider';

const COMMUNITY_EXAMPLES = [
  "https://picsum.photos/seed/dlss1/600/800",
  "https://picsum.photos/seed/dlss2/600/400",
  "https://picsum.photos/seed/dlss3/600/600",
  "https://picsum.photos/seed/dlss4/600/900",
  "https://picsum.photos/seed/dlss5/600/500",
  "https://picsum.photos/seed/dlss6/600/700",
  "https://picsum.photos/seed/dlss7/600/450",
  "https://picsum.photos/seed/dlss8/600/850",
  "https://picsum.photos/seed/dlss9/600/550",
  "https://picsum.photos/seed/dlss10/600/750",
  "https://picsum.photos/seed/dlss11/600/400",
  "https://picsum.photos/seed/dlss12/600/800",
  "https://picsum.photos/seed/dlss13/600/600",
  "https://picsum.photos/seed/dlss14/600/900",
  "https://picsum.photos/seed/dlss15/600/500",
  "https://picsum.photos/seed/dlss16/600/700",
  "https://picsum.photos/seed/dlss17/600/450",
  "https://picsum.photos/seed/dlss18/600/850",
  "https://picsum.photos/seed/dlss19/600/550",
  "https://picsum.photos/seed/dlss20/600/750",
];

export default function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": "DLSS 5 Neural Super-Resolution (Non-Official)",
        "applicationCategory": "MultimediaApplication",
        "operatingSystem": "Web",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "description": "AI image upscaling tool inspired by NVIDIA DLSS 5 technology. Neural Super-Resolution for 4X image enhancement using Tensor Cores. Non-official showcase."
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": t('home.faqHowToUpscale'),
            "acceptedAnswer": {
              "@type": "Answer",
              "text": t('home.faqHowToUpscaleAns')
            }
          },
          {
            "@type": "Question",
            "name": t('home.faqProfessional'),
            "acceptedAnswer": {
              "@type": "Answer",
              "text": t('home.faqProfessionalAns')
            }
          },
          {
            "@type": "Question",
            "name": t('home.faqNeuralSr'),
            "acceptedAnswer": {
              "@type": "Answer",
              "text": t('home.faqNeuralSrAns')
            }
          },
          {
            "@type": "Question",
            "name": t('home.faqApi'),
            "acceptedAnswer": {
              "@type": "Answer",
              "text": t('home.faqApiAns')
            }
          }
        ]
      }
    ]
  };

  return (
    <main className="pt-32 pb-24 px-6 max-w-[1440px] mx-auto overflow-hidden">
      <SEO
        title="NVIDIA DLSS 5 (Non-Official) | AI Image Upscaling & Super Resolution"
        description="Experience NVIDIA DLSS 5-style AI image upscaling. Neural Super-Resolution powered by NVIDIA Tensor Cores for instant 4X upscaling. Not official NVIDIA product."
        structuredData={structuredData}
      />
      <section className="text-center mb-16 relative">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/10 blur-[120px] rounded-full pointer-events-none"></div>
        
        <h1 className="text-5xl md:text-7xl font-headline font-bold tracking-tight text-white mb-6 leading-[1.1]">
          {t('home.title').split(' ').slice(0, 2).join(' ')} <br/> <span className="text-nvidia-green">{t('home.title').split(' ').slice(2).join(' ')}</span>
        </h1>
        <p className="text-on-surface-variant text-lg max-w-2xl mx-auto font-light leading-relaxed mb-12">
          {t('home.subtitle').split('.')[0]}. <br/>
          {t('home.subtitle').split('.').slice(1).join('.').trim()}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start text-left">
          <div className="lg:col-span-7 bg-surface-low rounded-xl border border-outline-variant/20 overflow-hidden relative group h-full">
            <div className="p-8 h-full flex flex-col">
              <div 
                onClick={() => navigate('/dashboard')}
                className="flex-1 border-2 border-dashed border-outline-variant rounded-xl p-12 flex flex-col items-center justify-center transition-all duration-500 hover:border-nvidia-green/50 hover:bg-nvidia-green/5 group-hover:scale-[1.01] cursor-pointer"
              >
                <div className="w-16 h-16 bg-surface-high rounded-full flex items-center justify-center mb-6">
                  <UploadCloud className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-xl font-headline font-semibold text-white mb-2">{t('dashboard.uploadAreaTitle')}</h2>
                <p className="text-zinc-500 text-sm mb-6 font-label">{t('home.uploadHint')}</p>
                <button className="bg-white text-black px-8 py-3 rounded-lg font-bold hover:bg-primary transition-all duration-300">
                  {t('home.uploadButton')}
                </button>
              </div>
              <div className="mt-4 flex justify-between items-center text-[10px] uppercase tracking-widest text-zinc-500 font-label">
                <span>{t('home.faqProfessionalWorkflows')}</span>
                <span className="text-nvidia-green">{t('home.instantInference')}</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-6 h-full">
            <div className="bg-surface-high rounded-xl p-1 overflow-hidden relative group aspect-[4/3] glow-border flex-1">
              <ImageSlider 
                highRes="https://lh3.googleusercontent.com/aida-public/AB6AXuAgMs1RSg3O_1Sa3p30fgI3YUHwQQfFs07kGZMGKyFyoEQm-OV9Q80s9L_VAjq6PPIL4xtaTqR0T9Spv2YqokmfgYPWeEDIaoQr-b_cWhfmnIgq8aEqqG60kty-pmpK8FVMaWQnJO_alw5WYwG3TGhDdxNpx_ZwZgY2ckp1k1TV_tLi7iFmt5rkfCNyQR5qc2MSI7WWxfd4pus_zzslLB6bpO80SJcRC5MWqi1CClqIJAQIYCs8gvSG8VE1od87qiiz6z58h1Ej7OY"
                lowRes="https://lh3.googleusercontent.com/aida-public/AB6AXuBX0NBLbz6dfCyZtZSBqUaNkc7P42wSPQbQ4Dlon60UOsPWWNKWQuKfUQpS7W0JjQLC3viWlcObRSBXdZoKxfShQc5rKpEFd14ybi0f6lrVILfPPqUzCpI4RKNVfJZaBujlW9Kwoj_v2zIAZrGl__FsvSDBWpYZVFvYhRo3X1Mltv4NxGiocHN_LB1gYNWDNgZCcs9SYcDfTtz733YHMkTIqJu7I9DkQt4LheM4Hcvd9IQIMZrXgvZQBI83SUxc5HPx8VnYchvzMCI"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-surface-low p-4 rounded-xl flex flex-col gap-1 border border-outline-variant/10">
                <span className="text-[10px] text-primary font-label uppercase tracking-widest">Inference Time</span>
                <div className="text-xl font-headline font-bold text-white">0.8s</div>
              </div>
              <div className="bg-surface-low p-4 rounded-xl flex flex-col gap-1 border border-outline-variant/10">
                <span className="text-[10px] text-primary font-label uppercase tracking-widest">Core Version</span>
                <div className="text-xl font-headline font-bold text-white">Ada-5.0</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Showcase Section */}
      <section className="mt-32">
        <div className="mb-12 text-center">
          <span className="text-nvidia-green font-label text-xs uppercase tracking-[0.2em] mb-4 block">{t('home.featuredShowcase')}</span>
          <h2 className="text-4xl font-headline font-bold text-white mb-6">{t('home.transformations')}</h2>
          <p className="text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Experience the power of Neural Super-Resolution. Drag the slider to compare the original low-resolution input with our AI-enhanced output.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-surface-low rounded-xl border border-outline-variant/10 overflow-hidden flex flex-col">
            <div className="h-[300px] relative">
              <ImageSlider 
                highRes="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1024&q=100"
                lowRes="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=10&blur=10"
              />
            </div>
            <div className="p-6">
              <h3 className="text-lg font-headline font-bold text-white mb-2">{t('home.portraitTextures')}</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">
                {t('home.portraitDesc')}
              </p>
            </div>
          </div>

          <div className="bg-surface-low rounded-xl border border-outline-variant/10 overflow-hidden flex flex-col">
            <div className="h-[300px] relative">
              <ImageSlider 
                highRes="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1024&q=100"
                lowRes="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=256&q=10&blur=10"
              />
            </div>
            <div className="p-6">
              <h3 className="text-lg font-headline font-bold text-white mb-2">{t('home.architecturalGeometry')}</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">
                {t('home.archDesc')}
              </p>
            </div>
          </div>

          <div className="bg-surface-low rounded-xl border border-outline-variant/10 overflow-hidden flex flex-col">
            <div className="h-[300px] relative">
              <ImageSlider 
                highRes="https://images.unsplash.com/photo-1618365908648-e71bd5716cba?auto=format&fit=crop&w=1024&q=100"
                lowRes="https://images.unsplash.com/photo-1618365908648-e71bd5716cba?auto=format&fit=crop&w=256&q=10&blur=10"
              />
            </div>
            <div className="p-6">
              <h3 className="text-lg font-headline font-bold text-white mb-2">{t('home.macroTextures')}</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">
                {t('home.macroDesc')}
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <button 
            onClick={() => navigate('/dashboard')}
            className="bg-primary text-black px-8 py-3 rounded-lg font-bold hover:bg-primary-container transition-all duration-300"
          >
            {t('home.tryIt')}
          </button>
        </div>
      </section>

      <section className="mt-32">
        <div className="mb-12">
          <span className="text-nvidia-green font-label text-xs uppercase tracking-[0.2em] mb-4 block">{t('home.performanceMetrics')}</span>
          <h2 className="text-4xl font-headline font-bold text-white mb-6">{t('home.dlssVsStandard')}</h2>
          <p className="text-zinc-400 max-w-2xl leading-relaxed">Our proprietary neural engine outperforms traditional methods by reconstructing missing data using trained AI models rather than simple pixel stretching.</p>
        </div>
        
        <div className="bg-surface-low rounded-xl border border-outline-variant/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-surface-high border-b border-outline-variant/20">
                  <th className="px-6 py-4 text-xs font-label uppercase tracking-widest text-primary">Feature</th>
                  <th className="px-6 py-4 text-xs font-label uppercase tracking-widest text-zinc-400">{t('home.bicubicScaling')}</th>
                  <th className="px-6 py-4 text-xs font-label uppercase tracking-widest text-white">{t('home.dlssNeural')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                <tr>
                  <td className="px-6 py-5 text-sm font-medium text-white">{t('home.edgePreservation')}</td>
                  <td className="px-6 py-5 text-sm text-zinc-500">{t('home.edgeBlurred')}</td>
                  <td className="px-6 py-5 text-sm text-primary font-semibold">{t('home.edgeSharp')}</td>
                </tr>
                <tr>
                  <td className="px-6 py-5 text-sm font-medium text-white">{t('home.noiseHandling')}</td>
                  <td className="px-6 py-5 text-sm text-zinc-500">{t('home.noiseAmplified')}</td>
                  <td className="px-6 py-5 text-sm text-primary font-semibold">{t('home.noiseDenoise')}</td>
                </tr>
                <tr>
                  <td className="px-6 py-5 text-sm font-medium text-white">{t('home.textureDetail')}</td>
                  <td className="px-6 py-5 text-sm text-zinc-500">{t('home.textureLost')}</td>
                  <td className="px-6 py-5 text-sm text-primary font-semibold">{t('home.textureReconstruct')}</td>
                </tr>
                <tr>
                  <td className="px-6 py-5 text-sm font-medium text-white">{t('home.hardware')}</td>
                  <td className="px-6 py-5 text-sm text-zinc-500">{t('home.hardwareCpu')}</td>
                  <td className="px-6 py-5 text-sm text-primary font-semibold">{t('home.hardwareGpu')}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="mt-32">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div className="max-w-xl">
            <span className="text-nvidia-green font-label text-xs uppercase tracking-[0.2em] mb-4 block">{t('home.engineeredPerformance')}</span>
            <h2 className="text-4xl font-headline font-bold text-white">{t('home.neuralMonolith')}</h2>
          </div>
          <div className="text-zinc-500 font-label text-sm uppercase tracking-widest border-l border-zinc-800 pl-6 h-12 flex items-center">
            001 // SYSTEM OVERVIEW
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-surface-lowest p-8 rounded-xl relative group overflow-hidden border border-outline-variant/5 hover:border-primary/20 transition-colors">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Cpu className="w-24 h-24 text-white" />
            </div>
            <div className="w-10 h-10 bg-nvidia-green/10 rounded flex items-center justify-center mb-6">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-xl font-headline font-bold text-white mb-4">{t('home.recursiveUpscaling')}</h3>
            <p className="text-zinc-500 text-sm leading-relaxed">{t('home.recursiveDesc')}</p>
          </div>
          
          <div className="bg-surface-lowest p-8 rounded-xl relative group overflow-hidden border border-outline-variant/5 hover:border-primary/20 transition-colors">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Gauge className="w-24 h-24 text-white" />
            </div>
            <div className="w-10 h-10 bg-nvidia-green/10 rounded flex items-center justify-center mb-6">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-xl font-headline font-bold text-white mb-4">{t('home.tensorPerformance')}</h3>
            <p className="text-zinc-500 text-sm leading-relaxed">{t('home.tensorDesc')}</p>
          </div>
          
          <div className="bg-surface-lowest p-8 rounded-xl relative group overflow-hidden border border-outline-variant/5 hover:border-primary/20 transition-colors">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <ShieldCheck className="w-24 h-24 text-white" />
            </div>
            <div className="w-10 h-10 bg-nvidia-green/10 rounded flex items-center justify-center mb-6">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-xl font-headline font-bold text-white mb-4">{t('home.dataPrivacy')}</h3>
            <p className="text-zinc-500 text-sm leading-relaxed">{t('home.privacyDesc')}</p>
          </div>
        </div>
      </section>

      <section className="mt-32">
        <h3 className="text-center text-zinc-500 font-label uppercase tracking-[0.3em] mb-12 text-xs">{t('home.communityUpscaled')}</h3>
        
        <div className="relative">
          <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4 max-h-[800px] overflow-hidden">
            {COMMUNITY_EXAMPLES.map((url, idx) => (
              <div key={idx} className="break-inside-avoid rounded-xl overflow-hidden relative group bg-surface-low border border-outline-variant/10">
                <img 
                  src={url} 
                  alt={`Community Generation ${idx + 1}`} 
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105" 
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-[10px] font-bold text-black">
                      {String.fromCharCode(65 + (idx % 26))}
                    </div>
                    <span className="text-xs font-bold text-white">User_{Math.floor(Math.random() * 9000) + 1000}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-[#09090b] to-transparent flex items-end justify-center pb-8 pointer-events-none">
            <button 
              onClick={() => navigate('/dashboard')}
              className="pointer-events-auto bg-surface-high text-white px-8 py-3 rounded-full font-bold hover:bg-primary hover:text-black transition-all duration-300 border border-outline-variant/20 shadow-2xl flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              {t('home.joinCommunity')}
            </button>
          </div>
        </div>
      </section>

      <section className="mt-32 max-w-4xl mx-auto">
        <h2 className="text-3xl font-headline font-bold text-white mb-12 text-center">{t('home.faq')}</h2>
        <div className="space-y-4">
          <details className="group bg-surface-low rounded-xl border border-outline-variant/10">
            <summary className="flex justify-between items-center p-6 cursor-pointer list-none">
              <span className="text-white font-medium">{t('home.faqHowToUpscale')}</span>
              <ChevronDown className="w-5 h-5 text-primary group-open:rotate-180 transition-transform" />
            </summary>
            <div className="px-6 pb-6 text-zinc-400 text-sm leading-relaxed">
              {t('home.faqHowToUpscaleAns')}
            </div>
          </details>

          <details className="group bg-surface-low rounded-xl border border-outline-variant/10">
            <summary className="flex justify-between items-center p-6 cursor-pointer list-none">
              <span className="text-white font-medium">{t('home.faqProfessional')}</span>
              <ChevronDown className="w-5 h-5 text-primary group-open:rotate-180 transition-transform" />
            </summary>
            <div className="px-6 pb-6 text-zinc-400 text-sm leading-relaxed">
              {t('home.faqProfessionalAns')}
            </div>
          </details>

          <details className="group bg-surface-low rounded-xl border border-outline-variant/10">
            <summary className="flex justify-between items-center p-6 cursor-pointer list-none">
              <span className="text-white font-medium">{t('home.faqNeuralSr')}</span>
              <ChevronDown className="w-5 h-5 text-primary group-open:rotate-180 transition-transform" />
            </summary>
            <div className="px-6 pb-6 text-zinc-400 text-sm leading-relaxed">
              {t('home.faqNeuralSrAns')}
            </div>
          </details>

          <details className="group bg-surface-low rounded-xl border border-outline-variant/10">
            <summary className="flex justify-between items-center p-6 cursor-pointer list-none">
              <span className="text-white font-medium">{t('home.faqApi')}</span>
              <ChevronDown className="w-5 h-5 text-primary group-open:rotate-180 transition-transform" />
            </summary>
            <div className="px-6 pb-6 text-zinc-400 text-sm leading-relaxed">
              {t('home.faqApiAns')}
            </div>
          </details>
        </div>
      </section>
    </main>
  );
}
