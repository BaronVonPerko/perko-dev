/// <reference types="vitest" />

import { defineConfig } from 'vite';
import analog from '@analogjs/platform';
import {extractRoutesToPrerender} from './vite-prerender.utils';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  publicDir: 'src/assets',
  build: {
    target: ['es2022'],
  },
  resolve: {
    mainFields: ['module'],
  },
  css: {
    preprocessorOptions: {
      scss: {
        silenceDeprecations: ['if-function'],
      },
    },
  },
  plugins: [analog({
    static: true,
    content: {
      highlighter: 'prism',
      prismOptions: {
        additionalLangs: [
          'scss'
        ]
      }
    },
    vite: {
      inlineStylesExtension: 'scss',
    },
    prerender: {
      routes: extractRoutesToPrerender(),
      sitemap: {
        host: 'https://perko.dev',
      },
      discover: true,
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
