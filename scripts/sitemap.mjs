#!/usr/bin/env node
/**
 * Schrijft dist/sitemap.xml na `astro build`: alle gebouwde pagina's (index.html), behalve
 * pagina's met <meta name="robots" content="noindex">. Domein en pad komen uit SITE_URL en BASE_PATH,
 * net als in astro.config.mjs.
 */
import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const DIST = 'dist';
const site = (process.env.SITE_URL ?? 'https://www.jeugdzorg-routes.nl').replace(/\/$/, '');
const base = (process.env.BASE_PATH ?? '/').replace(/\/?$/, '/');

function* paginas(dir) {
  for (const naam of readdirSync(dir)) {
    const pad = join(dir, naam);
    if (statSync(pad).isDirectory()) yield* paginas(pad);
    else if (naam === 'index.html') yield pad;
  }
}

const urls = [];
for (const bestand of paginas(DIST)) {
  const html = readFileSync(bestand, 'utf8');
  if (/<meta name="robots" content="[^"]*noindex/.test(html)) continue;
  const map = relative(DIST, bestand).split(sep).slice(0, -1).join('/');
  urls.push(`${site}${base}${map ? `${map}/` : ''}`);
}
urls.sort();

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...urls.map((u) => `  <url><loc>${u}</loc></url>`),
  '</urlset>',
  '',
].join('\n');
writeFileSync(join(DIST, 'sitemap.xml'), xml);
console.log(`sitemap.xml: ${urls.length} pagina's`);
