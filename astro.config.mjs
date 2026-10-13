// @ts-check
import { defineConfig } from 'astro/config';

// Domein en pad komen uit de omgeving (zie .github/workflows/deploy.yml):
// SITE_URL = volledig domein zonder slash aan het eind, BASE_PATH = '/' bij een eigen domein.
export default defineConfig({
  site: process.env.SITE_URL ?? 'https://www.jeugdzorg-routes.nl',
  base: process.env.BASE_PATH ?? '/',
  output: 'static',
  trailingSlash: 'always',
});
