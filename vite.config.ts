/// <reference types="vitest" />

import { defineConfig } from 'vite';
import analog from '@analogjs/platform';
import {extractRoutesToPrerender} from './vite-prerender.utils';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  publicDir: 'src/assets',
  build: {
    target: ['es2020'],
  },
  resolve: {
    mainFields: ['module'],
  },
  plugins: [analog({
    static: true,
    content: {
      prismOptions: {
        additionalLangs: [
          'scss'
        ]
      }
    },
    vite: {
      inlineStylesExtension: 'scss',
      experimental: {
        supportAnalogFormat: true,
      }
    },
    prerender: {
      routes: extractRoutesToPrerender(),
      sitemap: {
        host: 'https://perko.dev',
      },
    }
  })],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/test.ts'],
    include: ['**/*.spec.ts'],
  },
  define: {
    'import.meta.vitest': mode !== 'production',
  },
}));
