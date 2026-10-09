/**
 * 读出这台机器里真实的显卡 —— 这是竞品的检测器做不到的一步（它只认用户手输的型号）。
 *
 * 三级回退：WebGPU → WebGL(debug_renderer_info) → User-Agent。
 * 全部失败时返回 `source: 'none'`，页面必须给出可执行的提示，不许静默失败。
 *
 * TODO(王胜)：
 *   - 显存估算（WebGPU 的 `adapter.limits.maxBufferSize` 只能间接推，别吹成精确值）
 *   - 驱动版本 / 架构名（`adapter.info.architecture` 在部分浏览器为 undefined）
 *   - Safari 的 WebGPU 已开但 `info` 字段缺失时的降级策略
 */

export type DetectSource = 'webgpu' | 'webgl' | 'user-agent' | 'none';

export type DetectedGpu = {
  /** 原始字符串，页面要展示它，方便用户对照。 */
  renderer: string;
  vendor: string | null;
  source: DetectSource;
  /** 读不到卡时给用户的可执行提示。 */
  hint?: string;
};

type WebGpuAdapterInfo = {
  vendor?: string;
  architecture?: string;
  device?: string;
  description?: string;
};

const NOT_DETECTED_HINT =
  'We could not read your GPU here. Open this page in Chrome or Edge on the machine you care about, or pick your card from the list below.';

/** WebGL 的 renderer 字符串里常带 "ANGLE (NVIDIA, NVIDIA GeForce RTX 4070 Direct3D11 ...)" 这类噪声。 */
export function cleanWebglRenderer(raw: string): string {
  const angloMatch = raw.match(/ANGLE \(([^)]*)\)/);
  const inner = angloMatch ? angloMatch[1] : raw;
  return inner.split(',').map((part) => part.trim()).filter(Boolean).join(' ').trim();
}

/**
 * 只做检测，不做判定：判定在 `verdict.ts`，两者分开是为了能在测试里单独验证。
 * 这个函数只在浏览器里调用（`DlssChecker.tsx` 的点击处理里），不要在渲染期调用。
 */
export async function detectLocalGpu(): Promise<DetectedGpu> {
  if (typeof navigator === 'undefined') return { renderer: '', vendor: null, source: 'none', hint: NOT_DETECTED_HINT };

  const gpu = (navigator as Navigator & { gpu?: { requestAdapter: () => Promise<{ info?: WebGpuAdapterInfo } | null> } }).gpu;
  if (gpu) {
    try {
      const adapter = await gpu.requestAdapter();
      const info = adapter?.info as WebGpuAdapterInfo | undefined;
      const label = info?.description || info?.device || info?.architecture || '';
      if (label) {
        return { renderer: label, vendor: info?.vendor ?? null, source: 'webgpu' };
      }
    } catch {
      // WebGPU 在无头/受限环境会抛错，继续往下回退，不要中断检测。
    }
  }

  if (typeof document !== 'undefined') {
    try {
      const canvas = document.createElement('canvas');
      const gl = (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null;
      const debugInfo = gl?.getExtension('WEBGL_debug_renderer_info') as { UNMASKED_VENDOR_WEBGL: number; UNMASKED_RENDERER_WEBGL: number } | null;
      if (gl && debugInfo) {
        const renderer = String(gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) ?? '');
        const vendor = String(gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) ?? '');
        const cleaned = cleanWebglRenderer(renderer);
        if (cleaned) return { renderer: cleaned, vendor: vendor || null, source: 'webgl' };
      }
    } catch {
      // 同上：回退而不是抛错。
    }
  }

  const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
  if (/Macintosh|Intel Mac/i.test(ua)) {
    return { renderer: ua ? 'Apple / Intel graphics (from user agent)' : '', vendor: 'Apple', source: 'user-agent', hint: 'Generic GPU family only — open this page in Chrome or Edge for an exact model.' };
  }

  return { renderer: '', vendor: null, source: 'none', hint: NOT_DETECTED_HINT };
}
