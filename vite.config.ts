import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.VITE_API_KEY': JSON.stringify(env.VITE_API_KEY),
      'process.env.VITE_DEFAULT_SEED': JSON.stringify(env.VITE_DEFAULT_SEED || '42'),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      proxy: {
        '/api/gpu': {
          target: 'https://gpu-api.alphanetplus.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/gpu/, '')
        },
        '/api/oss': {
          target: 'https://oss.alphanetplus.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/oss/, '')
        }
      }
    },
  };
});
