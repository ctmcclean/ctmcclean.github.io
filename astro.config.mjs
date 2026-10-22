// @ts-check
import { defineConfig } from 'astro/config';
import { satteri } from '@astrojs/markdown-satteri';
import { embedsPlugin } from './src/lib/markdown-embeds.mjs';
import { rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { JMED_LIVE } from './src/lib/launch.mjs';

// While JMED is gated (src/lib/launch.mjs), the Atlas and the codebook stay out of the built site even
// if they are present in public/ locally. The page itself renders its placeholder via the same flag.
const jmedGate = () => ({
  name: 'jmed-gate',
  hooks: {
    'astro:build:done': async ({ dir, logger }) => {
      if (JMED_LIVE) return;
      const out = fileURLToPath(dir);
      for (const rel of ['jmed/map', 'jmed/jmed_codebook_v1.0.pdf']) {
        await rm(new URL(rel, dir), { recursive: true, force: true });
      }
      logger.info(`JMED gated: removed jmed/map and the codebook from ${out}`);
    },
  },
});

export default defineConfig({
  site: 'https://charlesmcclean.com',
  trailingSlash: 'always',
  integrations: [jmedGate()],
  redirects: {
    '/book-project': '/book',
  },
  markdown: {
    // Video links on their own line become in-site players; see src/lib/markdown-embeds.mjs.
    processor: satteri({ mdastPlugins: [embedsPlugin] }),
  },
});
