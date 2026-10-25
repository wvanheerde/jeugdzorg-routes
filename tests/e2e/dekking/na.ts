/**
 * Na de testrun: het rapport van de codedekking, en een overzicht per paginasoort (src/pages) met het aantal scenario's
 * dat die soort bezocht of ophaalde. Schrijft dekking-rapport/paginas.md en dekking-rapport/samenvatting.md.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CoverageReport } from 'monocart-coverage-reports';
import { AAN, RAPPORT, BEZOCHT, codeOpties } from './opties';

const PAGES = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../src/pages');

/** src/pages/gemeenten/[slug].astro → { route: '/gemeenten/[slug]/', re: /^\/gemeenten\/[^/]+\/$/ } */
const routes = () => {
  const uit: { route: string; re: RegExp }[] = [];
  const loop = (map: string) =>
    fs.readdirSync(path.join(PAGES, map), { withFileTypes: true }).forEach((f) => {
      const rel = path.join(map, f.name);
      if (f.isDirectory()) return loop(rel);
      let r = '/' + rel.replace(/\\/g, '/').replace(/\.(astro|ts)$/, '');
      r = r.replace(/\/index$/, '/');
      if (!/\.\w+$/.test(r) && !r.endsWith('/')) r += '/';
      const re = new RegExp('^' + r.replace(/[.*+?^${}()|\\]/g, '\\$&').replace(/\\\[[^\]]+\]|\[[^\]]+\]/g, '[^/]+') + '$');
      uit.push({ route: r, re });
    });
  loop('.');
  return uit.sort((a, b) => a.route.localeCompare(b.route));
};

export default async function () {
  if (!AAN) return;
  const code = await new CoverageReport(codeOpties).generate();

  const base = (process.env.BASE_PATH ?? '/').replace(/\/?$/, '/');
  const bezoeken = fs.existsSync(BEZOCHT)
    ? fs.readdirSync(BEZOCHT).flatMap((f) =>
        fs
          .readFileSync(path.join(BEZOCHT, f), 'utf8')
          .trim()
          .split('\n')
          .filter(Boolean)
          .map((r) => JSON.parse(r) as { test: string; paden: string[] }),
      )
    : [];
  const rijen = routes().map(({ route, re }) => {
    const tests = new Set(bezoeken.filter((b) => b.paden.some((p) => re.test('/' + p.replace(base, '').replace(/^\//, '')))).map((b) => b.test));
    return { route, n: tests.size };
  });
  const paginas = [
    '# Dekking per paginasoort',
    '',
    'Aantal scenario-uitvoeringen (laptop en telefoon apart) dat de paginasoort bezocht of ophaalde.',
    '',
    '| Paginasoort | Scenario-uitvoeringen |',
    '|---|---|',
    ...rijen.map((r) => `| \`${r.route}\` | ${r.n === 0 ? '**0, niet getest**' : r.n} |`),
  ].join('\n');
  fs.writeFileSync(path.join(RAPPORT, 'paginas.md'), paginas + '\n');

  const s = code?.summary as any;
  const pct = (m: string) => (s?.[m]?.pct ?? 0).toFixed(1);
  const samenvatting = [
    '# Dekkingsmeting',
    '',
    `- Regels: ${pct('lines')}%`,
    `- Functies: ${pct('functions')}%`,
    `- Takken: ${pct('branches')}%`,
    `- Paginasoorten getest: ${rijen.filter((r) => r.n).length} van ${rijen.length}`,
    '',
    'Details: `code/index.html` (per bronbestand, met niet-uitgevoerde regels) en `paginas.md`.',
  ].join('\n');
  fs.writeFileSync(path.join(RAPPORT, 'samenvatting.md'), samenvatting + '\n');
  console.log('\n' + samenvatting + '\n\n' + paginas + '\n');
  // In GitHub Actions: samenvatting bij de run zetten.
  if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, samenvatting + '\n\n' + paginas + '\n');

  // Ondergrens (DEKKING_MINIMUM, percentage regels): zakt de dekking eronder, dan faalt de meting.
  // Ook elke paginasoort moet door minstens één scenario bezocht worden.
  const min = Number(process.env.DEKKING_MINIMUM ?? 0);
  const regels = s?.lines?.pct ?? 0;
  const zonder = rijen.filter((r) => !r.n).map((r) => r.route);
  if (regels < min)
    throw new Error(
      `Codedekking ${regels.toFixed(1)}% is lager dan de ondergrens van ${min}%. Schrijf scenario's voor de code die niet draait (zie dekking-rapport/code/index.html).`,
    );
  if (min && zonder.length) throw new Error(`Paginasoorten zonder scenario: ${zonder.join(', ')}`);
}
