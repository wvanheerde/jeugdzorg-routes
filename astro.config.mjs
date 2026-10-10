// @ts-check
import { defineConfig } from 'astro/config';

// Pas `site` en `base` aan bij publicatie op GitHub Pages:
// site: 'https://<gebruiker>.github.io', base: '/jeugdzorg-routes'
export default defineConfig({
  site: 'https://example.github.io',
  base: process.env.BASE_PATH ?? '/',
  output: 'static',
  trailingSlash: 'always',
});
