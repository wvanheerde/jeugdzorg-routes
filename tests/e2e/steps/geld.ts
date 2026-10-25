/** Stappen voor geld en regelingen: het blok op de gemeentepagina en het filter op de lijst met gemeenten. */
import { expect, type Page } from '@playwright/test';
import { Given, When, Then } from './fixtures';
import { type Geldregeling, gemeenteMetRegeling, geldregelingen, gemeentenMetSoorten, aantalGemeenten, gemeenteZonderSoort, gemeenteNaam } from './inhoud';

Given('ik open de pagina van een gemeente met een regeling voor {string}', async ({ page }, soort: string) => {
  await page.goto(`gemeenten/${gemeenteMetRegeling((r) => r.soort === soort)}/`);
});
const slugUitPad = (page: Page) => new URL(page.url()).pathname.split('/').filter(Boolean).pop()!;
Then('staat de regeling van die gemeente voor {string} onder de kop {string}', async ({ page }, soort: string, kop: string) => {
  const r = geldregelingen(slugUitPad(page)).find((x) => x.soort === soort)!;
  const groep = page.locator('section:has(> h2#geld) [data-geld-soort]', { has: page.locator('h3, h4', { hasText: kop }) });
  await expect(groep.getByRole('link', { name: r.naam })).toBeVisible();
});
const krapBlok = (page: Page, krap: string) => page.locator('section:has(> h2#geld) [data-geld-krap]', { has: page.locator('h3', { hasText: krap }) });
let geldNaam = '';
Given('ik open de pagina van een gemeente met een zorgkostenregeling alleen voor de ouder zelf', async ({ page }) => {
  const past = (r: Geldregeling) => r.soort === 'zorgkosten' && r.alleenOuder === true;
  const slug = gemeenteMetRegeling(past);
  geldNaam = geldregelingen(slug).find(past)!.naam;
  await page.goto(`gemeenten/${slug}/`);
});
Given('ik open de pagina van een gemeente met een zorgkostenregeling die ook voor het kind geldt', async ({ page }) => {
  const past = (r: Geldregeling) => r.soort === 'zorgkosten' && !r.alleenOuder;
  const slug = gemeenteMetRegeling(past);
  geldNaam = geldregelingen(slug).find(past)!.naam;
  await page.goto(`gemeenten/${slug}/`);
});
Then('staat die regeling onder {string}', async ({ page }, krap: string) => {
  await expect(krapBlok(page, krap).getByRole('link', { name: geldNaam }).first()).toBeVisible();
});
Then('staat die regeling niet onder {string}', async ({ page }, krap: string) => {
  await expect(page.locator('section:has(> h2#geld)').getByRole('link', { name: geldNaam }).first()).toBeVisible();
  await expect(page.locator('section:has(> h2#geld) [data-geld-krap]').getByRole('link', { name: geldNaam })).toHaveCount(0);
});
Then('staat de kop {string} onder {string}', async ({ page }, kop: string, krap: string) => {
  await expect(krapBlok(page, krap).locator('[data-geld-soort] h4', { hasText: kop })).toBeVisible();
});
Then('staat de kop {string} niet onder {string}', async ({ page }, kop: string, krap: string) => {
  await expect(page.locator('section:has(> h2#geld) [data-geld-soort]', { hasText: kop }).first()).toBeVisible();
  await expect(page.locator('section:has(> h2#geld) [data-geld-krap] [data-geld-soort]', { hasText: kop })).toHaveCount(0);
});
Then('gaat de link {string} naar de regelingencheck voor die gemeente', async ({ page }, naam: string) => {
  const href = await page.getByRole('link', { name: naam }).first().getAttribute('href');
  expect(href).toContain(`overzicht/?k=geld&gemeente=${slugUitPad(page)}`);
});
const zichtbareGemeenten = (page: Page) =>
  page.locator('a.card[data-naam]').evaluateAll((as) => as.filter((a) => !(a as HTMLElement).hidden).map((a) => (a as HTMLElement).dataset.naam!));
const vergelijk = async (page: Page, soorten: string[]) => {
  const verwacht = gemeentenMetSoorten(soorten)
    .map((n) => n.toLowerCase())
    .sort();
  expect(verwacht.length, 'er is geen gemeente met deze regelingen').toBeGreaterThan(0);
  await expect.poll(async () => (await zichtbareGemeenten(page)).sort()).toEqual(verwacht);
};
Then('zie ik alleen de gemeenten met een regeling voor {string}', async ({ page }, soort: string) => vergelijk(page, [soort]));
Then('zie ik alleen de gemeenten met een regeling voor {string} en {string}', async ({ page }, a: string, b: string) => vergelijk(page, [a, b]));
When('ik zoek de naam van een gemeente zonder regeling voor {string} in {string}', async ({ page }, soort: string, veld: string) => {
  await page
    .getByLabel(veld, { exact: true })
    .locator('visible=true')
    .first()
    .fill(gemeenteNaam(gemeenteZonderSoort(soort)));
});
Then('staan de keuzes onder {string} op hooguit {int} regels', async ({ page }, kop: string, max: number) => {
  const knoppen = page.locator(`[aria-labelledby="${await page.getByText(kop, { exact: true }).getAttribute('id')}"] button`);
  await expect(knoppen.first()).toBeVisible();
  const regels = new Set(await knoppen.evaluateAll((bs) => bs.map((b) => Math.round(b.getBoundingClientRect().top))));
  expect(regels.size, `${regels.size} regels`).toBeLessThanOrEqual(max);
});
Then('zie ik alle gemeenten', async ({ page }) => {
  await expect.poll(async () => (await zichtbareGemeenten(page)).length).toBe(aantalGemeenten());
});
Then('zie ik hoeveel gemeenten er gevonden zijn', async ({ page }) => {
  const n = (await zichtbareGemeenten(page)).length;
  await expect(page.locator('[data-geld-aantal]')).toHaveText(`${n} ${n === 1 ? 'gemeente' : 'gemeenten'} gevonden`);
});
