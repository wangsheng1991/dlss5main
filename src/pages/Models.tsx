import React from 'react';
import { useTranslation } from 'react-i18next';

const MODELS_DATA = [
  { key: 'ada50', typeKey: 'generalPurpose' },
  { key: 'hopper21', typeKey: 'cinematicArt' },
  { key: 'turingLegacy', typeKey: 'highSpeed' },
  { key: 'lovelaceText', typeKey: 'documentOcr' }
];

export default function Models() {
  const { t } = useTranslation();

  return (
    <main className="pt-32 pb-24 px-6 max-w-[1440px] mx-auto min-h-[80vh]">
      <div className="mb-12">
        <span className="text-nvidia-green font-label text-xs uppercase tracking-[0.2em] mb-4 block">{t('models.architecture')}</span>
        <h1 className="text-4xl font-headline font-bold text-white mb-6">{t('models.title')}</h1>
        <p className="text-zinc-400 max-w-2xl leading-relaxed">{t('models.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MODELS_DATA.map((model, i) => (
          <article key={i} className="bg-surface-low p-8 rounded-xl border border-outline-variant/20 hover:border-primary/30 transition-colors">
            <h3 className="text-xs font-label uppercase tracking-widest text-primary mb-2">{t(`models.${model.typeKey}`)}</h3>
            <h4 className="text-2xl font-headline font-bold text-white mb-4">{t(`models.${model.key}`)}</h4>
            <p className="text-zinc-400 text-sm leading-relaxed">{t(`models.${model.key}Desc`)}</p>
          </article>
        ))}
      </div>
    </main>
  );
}
