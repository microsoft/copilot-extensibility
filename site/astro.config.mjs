// @ts-check
import { defineConfig } from 'astro/config';

// The site is published as a GitHub Pages *project* site:
//   https://microsoft.github.io/copilot-extensibility/
// The deployment workflow overrides these defaults with the actual Pages origin and base path.
const site = process.env.SITE_URL ?? 'https://microsoft.github.io';
const base = process.env.BASE_PATH === undefined ? '/copilot-extensibility' : process.env.BASE_PATH || '/';

export default defineConfig({
  site,
  base,
  trailingSlash: 'ignore',
  devToolbar: {
    enabled: false,
  },
  build: {
    assets: 'assets',
  },
});
