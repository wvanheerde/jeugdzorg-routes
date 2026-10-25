/** Stappen voor zoeken op de site (zoeken.feature, src/scripts/zoeken.ts). */
import { expect, type Page } from '@playwright/test';
import { Given, When, Then } from './fixtures';
import { regex } from './algemeen';

const zoekResultaten = (page: Page) => page.locator('[data-zoek-resultaten] li[data-soort]').locator('visible=true');
Then('staat de knop {string} rechts naast {string} in het menu', async ({ page }, knop: string, link: string) => {
  const [k, l] = [
    await page.getByRole('button', { name: knop, exact: true }).locator('visible=true').first().boundingBox(),
    await page.locator('#hoofdnavigatie').getByRole('link', { name: link, exact: true }).boundingBox(),
  ];
  expect(k!.x, 'rechts van de link').toBeGreaterThanOrEqual(l!.x + l!.width);
  expect(k!.y < l!.y + l!.height && l!.y < k!.y + k!.height, 'op dezelfde regel').toBe(true);
});
Then('staat de cursor op de knop {string}', async ({ page }, knop: string) => {
  await expect(page.getByRole('button', { name: knop, exact: true }).locator('visible=true').first()).toBeFocused();
});
Then('zie ik het zoekresultaat {string} met de soort {string}', async ({ page }, titel: string, soort: string) => {
  const r = zoekResultaten(page)
    .filter({ has: page.getByRole('link', { name: titel }) })
    .first();
  await expect(r).toBeVisible();
  await expect(r).toHaveAttribute('data-soort', soort);
});
Then('is het eerste zoekresultaat {string}', async ({ page }, titel: string) => {
  await expect(zoekResultaten(page).first().getByRole('link')).toContainText(titel);
});
Then('staan er hooguit {int} gemeenten tussen de zoekresultaten', async ({ page }, n: number) => {
  await expect(zoekResultaten(page).first()).toBeVisible();
  expect(await zoekResultaten(page).and(page.locator('[data-soort="Gemeente"]')).count()).toBeLessThanOrEqual(n);
});
Then('staan er meer dan {int} gemeenten tussen de zoekresultaten', async ({ page }, n: number) => {
  await expect.poll(() => page.locator('[data-zoek-resultaten] li[data-soort="Gemeente"]').locator('visible=true').count()).toBeGreaterThan(n);
});
Then('gaat geen zoekresultaat naar {string}', async ({ page }, pad: string) => {
  await expect(zoekResultaten(page).first()).toBeVisible();
  for (const href of await zoekResultaten(page)
    .getByRole('link')
    .evaluateAll((as) => as.map((a) => a.getAttribute('href') ?? '')))
    expect(href, href).not.toContain(pad);
});
Then('staan de gemeenten onder de andere zoekresultaten', async ({ page }) => {
  await expect(zoekResultaten(page).first()).toBeVisible();
  const soorten = await zoekResultaten(page).evaluateAll((lis) => lis.map((li) => (li as HTMLElement).dataset.soort));
  const eersteGemeente = soorten.indexOf('Gemeente');
  expect(
    soorten.some((x) => x !== 'Gemeente'),
    'er zijn andere resultaten',
  ).toBe(true);
  expect(eersteGemeente === -1 || soorten.slice(eersteGemeente).every((x) => x === 'Gemeente'), soorten.join(', ')).toBe(true);
});
Then('gaat het zoekresultaat {string} naar {string}', async ({ page }, titel: string, pad: string) => {
  const link = zoekResultaten(page).getByRole('link', { name: titel }).first();
  await expect(link).toBeVisible();
  expect(new URL((await link.getAttribute('href'))!, page.url()).pathname + new URL((await link.getAttribute('href'))!, page.url()).hash).toMatch(
    new RegExp(`${regex(pad)}$`),
  );
});
/** Vertraagt het laden van de zoekfunctie (pagefind.js), zodat te zien is wat er staat terwijl die laadt. */
Given('de zoekfunctie laadt traag', async ({ page }) => {
  await page.route('**/pagefind/pagefind.js', async (route) => {
    await new Promise((r) => setTimeout(r, 1500));
    await route.continue();
  });
});
Then('staat bij het zoekresultaat {string} de tekst {string}', async ({ page }, titel: string, tekst: string) => {
  const r = zoekResultaten(page)
    .filter({ has: page.getByRole('link', { name: titel }) })
    .first();
  await expect(r.locator('p')).toContainText(tekst);
});
/** Klik op de pagina onder het paneel met resultaten (onderaan het scherm). */
When('ik onder de zoekresultaten klik', async ({ page }) => {
  const h = page.viewportSize()!.height;
  await page.mouse.click(5, h - 5);
});
Then('zie ik geen zoekresultaten', async ({ page }) => {
  await expect(page.locator('[data-zoek-paneel]')).toBeHidden();
});
