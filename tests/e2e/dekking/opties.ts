/**
 * Dekkingsmeting (npm run dekking in de hoofdmap): welke code van de browserscripts draait tijdens de scenario's,
 * en welke paginasoorten de scenario's bezoeken. Alleen met DEKKING=1; de gewone testrun meet niets.
 * Zie TECHNIEK.md, "Dekking".
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { CoverageReportOptions } from 'monocart-coverage-reports';

export const AAN = !!process.env.DEKKING;
const HIER = path.dirname(fileURLToPath(import.meta.url));
export const RAPPORT = path.resolve(HIER, '../dekking-rapport');
export const BEZOCHT = path.join(RAPPORT, 'bezocht');

export const codeOpties: CoverageReportOptions = {
  name: 'Jeugdzorg Routes: codedekking van de browserscripts',
  outputDir: path.join(RAPPORT, 'code'),
  reports: [['v8'], ['lcovonly'], ['console-summary', { metrics: ['lines', 'functions', 'branches'] }], ['json-summary'], ['markdown-summary']],
  // Alleen de gebundelde scripts van de site (Astro zet ze in /_astro/), niet de browser zelf.
  entryFilter: (e) => e.url.includes('/_astro/'),
  // Na het terugvertalen met sourcemaps: alleen eigen bronbestanden.
  sourceFilter: (p) => /(^|\/)src\//.test(p) && !p.includes('node_modules'),
  // "src/pages/x.astro?astro&type=script&index=0&lang.ts" → "src/pages/x.astro"
  sourcePath: (p) => p.replace(/^.*?(src\/)/, 'src/').replace(/(\.astro).*$/, '$1').replace(/\?.*$/, ''),
};

/** Paden die een scenario bezocht of ophaalde, per testwerker in een eigen bestand (geen gelijktijdig schrijven). */
export const noteerBezoek = (test: string, paden: string[]) => {
  if (!AAN || !paden.length) return;
  fs.mkdirSync(BEZOCHT, { recursive: true });
  fs.appendFileSync(path.join(BEZOCHT, `${process.env.TEST_WORKER_INDEX ?? 0}.jsonl`), JSON.stringify({ test, paden }) + '\n');
};
