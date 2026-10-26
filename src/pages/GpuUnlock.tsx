import React from 'react';
import SEO from '../components/SEO';
import GpuUnlockContent from '../components/GpuUnlockContent';
import { gpuUnlockCopy, gpuUnlockSchema, GPU_UNLOCK_ALTERNATES } from '../content/gpuUnlock';
export default function GpuUnlock({ locale = 'en' }: { locale?: 'en' | 'zh' }) {
 const page = gpuUnlockCopy(locale).page;
 return <><SEO title={page.title} description={page.description} canonical={page.path} language={locale === 'zh' ? 'zh-CN' : 'en-US'} alternates={GPU_UNLOCK_ALTERNATES} keywords={['gpu unlock rtx 30','unlock bf16 rtx 3090']} structuredData={gpuUnlockSchema(locale)}/><GpuUnlockContent locale={locale}/></>;
}
