/** Stappen voor zoekmachines: robots.txt, sitemap, beschrijving, kruimelpad, woonplaatsen, noindex. */
import { readFileSync } from 'node:fs';
import { expect, type Page } from '@playwright/test';
import { Then } from './fixtures';
import { woonplaatsenVoor } from '../../../src/lib/woonplaatsen';
import { noteerBezoek } from '../dekking/opties';
import { regex } from './algemeen';

// ---------- bestanden voor zoekmachines ----------
const haal = async (page: Page, baseURL: string | undefined, bestand: string) => {
  const url = new URL(bestand, baseURL);
  noteerBezoek(`bestand › ${bestand}`, [url.pathname]);
  return (await page.request.get(url.toString())).text();
};
Then('bevat {string} de regel {string}', async ({ page, baseURL }, bestand: string, regel: string) => {
  expect((await haal(page, baseURL, bestand)).split('\n').map((r) => r.trim())).toContain(regel);
});
Then('bevat {string} de tekst {string}', async ({ page, baseURL }, bestand: string, stuk: string) => {
  expect(await haal(page, baseURL, bestand)).toContain(stuk);
});
Then('bevat {string} niet de tekst {string}', async ({ page, baseURL }, bestand: string, stuk: string) => {
  expect(await haal(page, baseURL, bestand)).not.toContain(stuk);
});
Then('begint de beschrijving voor zoekmachines met {string}', async ({ page }, begin: string) => {
  expect(await page.locator('meta[name="description"]').getAttribute('content')).toMatch(new RegExp(`^${regex(begin)}`));
});
/** Het kruimelpad uit de gestructureerde gegevens (schema.org BreadcrumbList), met " › " tussen de namen. */
Then('is het kruimelpad voor zoekmachines {string}', async ({ page }, pad: string) => {
  const blokken = await page.locator('script[type="application/ld+json"]').allTextContents();
  const lijst = blokken
    .map((b) => JSON.parse(b))
    .flatMap((j) => (Array.isArray(j['@graph']) ? j['@graph'] : [j]))
    .find((j) => j['@type'] === 'BreadcrumbList');
  expect((lijst?.itemListElement ?? []).map((i: { name: string }) => i.name).join(' › ')).toBe(pad);
});
/** Alle woonplaatsen van de gemeente (public/woonplaatsen.json) staan in het kopblok, ook die achter de uitklapper. */
Then('staan de woonplaatsen van de gemeente onder de kop', async ({ page }) => {
  const slug = new URL(page.url()).pathname.split('/').filter(Boolean).at(-1)!;
  const paren: [string, string][] = JSON.parse(readFileSync(new URL('../../../public/woonplaatsen.json', import.meta.url), 'utf8'));
  const gemeente = (await page.locator('h1').textContent())!.replace(/^Jeugdzorg in /, '').trim();
  const namen = woonplaatsenVoor(paren, slug, gemeente);
  expect(namen.length).toBeGreaterThan(0);
  const tekst = (await page.locator('.page-head [data-woonplaatsen]').textContent()) ?? '';
  for (const n of namen) expect(tekst, n).toContain(n);
});
Then('mag de pagina niet in zoekmachines', async ({ page }) => {
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
});
