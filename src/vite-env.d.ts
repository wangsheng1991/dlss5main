/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DEFAULT_SEED: string;
  readonly VITE_GENERATION_API_BASE?: string;
  /** Public Microsoft Clarity project ID; leave unset to disable Clarity. */
  readonly VITE_CLARITY_PROJECT_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
