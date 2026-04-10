/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_KEY: string;
  readonly VITE_DEFAULT_SEED: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
