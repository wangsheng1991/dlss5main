/**
 * Microsoft Clarity is opt-in at build time: the script is only injected when a public project
 * ID is configured. The ID is not a secret, but keeping it in an environment variable lets each
 * deployment choose its own Clarity project (or stay completely analytics-free).
 */
type ClarityQueue = ((...args: unknown[]) => void) & { q?: unknown[][] };

declare global {
  interface Window {
    clarity?: ClarityQueue;
  }
}

const SCRIPT_ID = 'microsoft-clarity-script';

function projectId() {
  const value = (import.meta.env.VITE_CLARITY_PROJECT_ID || '').trim();
  // Clarity IDs are opaque identifiers. Restrict the value before putting it in a script URL.
  return /^[A-Za-z0-9_-]{6,80}$/.test(value) ? value : '';
}

/** Inject the official async loader once, without blocking the app or creating a hard dependency. */
export function initClarity() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  const id = projectId();
  if (!id || document.getElementById(SCRIPT_ID)) return;

  const clarity: ClarityQueue = ((...args: unknown[]) => {
    clarity.q = clarity.q || [];
    clarity.q.push(args);
  }) as ClarityQueue;
  window.clarity = clarity;

  const script = document.createElement('script');
  script.id = SCRIPT_ID;
  script.async = true;
  script.src = `https://www.clarity.ms/tag/${encodeURIComponent(id)}`;
  script.crossOrigin = 'anonymous';
  document.head.appendChild(script);
}
