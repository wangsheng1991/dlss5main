import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

/**
 * Vendor modules go into separate long-lived chunks. The app bundle ships as one long-lived
 * chunk too, so a copy change only invalidates the app chunk while a 1 MB vendor chunk stays
 * cached. The browser also downloads the chunks in parallel instead of one serial bundle.
 */
const VENDOR_CHUNKS: Array<[RegExp, string]> = [
  [/[\\/]node_modules[\\/](@?firebase|@firebase)[\\/]/, 'firebase'],
  [/[\\/]node_modules[\\/](react|react-dom|scheduler|react-router|react-router-dom|react-helmet-async)[\\/]/, 'react'],
  [/[\\/]node_modules[\\/](i18next|i18next-browser-languagedetector|react-i18next)[\\/]/, 'i18n'],
  [/[\\/]node_modules[\\/](motion|motion-dom|motion-utils|framer-motion)[\\/]/, 'motion'],
];

export default defineConfig(() => ({
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            const chunk = VENDOR_CHUNKS.find(([pattern]) => pattern.test(id));
            return chunk?.[1];
          },
        },
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
  },
}));
