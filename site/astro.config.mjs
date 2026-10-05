// @ts-check
import { defineConfig } from 'astro/config';

// The site is published as a GitHub Pages *project* site:
//   https://microsoft.github.io/copilot-extensibility/
// Override with SITE_URL / BASE_PATH (e.g. for forks or a custom domain, where BASE_PATH should be "/").
const site = process.env.SITE_URL ?? 'https://microsoft.github.io';
const base = process.env.BASE_PATH ?? '/copilot-extensibility';

export default defineConfig({
  site,
  base,
  trailingSlash: 'ignore',
  build: {
    assets: 'assets',
  },
});
