/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DEFAULT_SEED: string;
  readonly VITE_GENERATION_API_BASE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
