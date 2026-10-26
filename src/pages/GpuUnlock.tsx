import React from 'react';
import SEO from '../components/SEO';
import GpuUnlockContent from '../components/GpuUnlockContent';
import { GPU_UNLOCK, gpuUnlockSchema } from '../content/gpuUnlock';
export default function GpuUnlock() {
  return <><SEO title={GPU_UNLOCK.title} description={GPU_UNLOCK.description} canonical={GPU_UNLOCK.path} language="zh-CN" keywords={['gpu unlock rtx 30','unlock bf16 rtx 3090']} structuredData={gpuUnlockSchema()}/><GpuUnlockContent/></>;
}
