/** Stappen voor het afdrukken (afdrukvoorbeeld, opmaak op papier) en de vellen om in te vullen (gesprek/, logboek/). */
import { expect, type Page } from '@playwright/test';
import { When, Then } from './fixtures';

// ---------- afdrukken ----------
// Het afdrukvoorbeeld: de pagina met de opmaak voor papier (@media print), zoals bij Ctrl+P. De browser meldt dat vooraf
// (beforeprint) en achteraf (afterprint); dat doet emulateMedia niet zelf.
When('ik het afdrukvoorbeeld bekijk', async ({ page }) => {
  await page.evaluate(() => dispatchEvent(new Event('beforeprint')));
  await page.emulateMedia({ media: 'print' });
});
When('ik het scherm weer gewoon bekijk', async ({ page }) => {
  await page.emulateMedia({ media: 'screen' });
  await page.evaluate(() => dispatchEvent(new Event('afterprint')));
});
Then('opent het afdrukvenster', async ({ page }) => {
  await expect.poll(() => page.evaluate(() => (window as any).__afdrukken)).toBe(1);
});
Then('zie ik het hoofdmenu niet', async ({ page }) => {
  await expect(page.locator('#hoofdnavigatie')).toBeHidden();
  await expect(page.locator('[data-menu-knop]')).toBeHidden();
});
Then('staat de knop {string} rechts boven {string}', async ({ page }, naam: string, kop: string) => {
  const knop = await page.getByRole('button', { name: naam }).locator('visible=true').first().boundingBox();
  // Het blok om de kop heen: een sectie, of de contactkaart bovenaan een gemeentepagina.
  const blok = await page
    .getByRole('heading', { name: kop })
    .locator('visible=true')
    .first()
    .locator('xpath=ancestor::*[self::section or contains(@class, "eerste-contact")][1]')
    .boundingBox();
  expect(knop!.y + knop!.height, 'knop boven het blok').toBeLessThanOrEqual(blok!.y);
  expect(Math.abs(knop!.x + knop!.width - (blok!.x + blok!.width)), 'rechts uitgelijnd met het blok').toBeLessThan(2);
});
// Kaarten en blokken die op het scherm naast elkaar staan, staan op papier onder elkaar (een lijst): alles op dezelfde x.
Then('staan de kaarten en blokken onder elkaar', async ({ page }) => {
  const rijen = await page
    .locator('.grid, .linklist, .onderdelen')
    .locator('visible=true')
    .evaluateAll((lijsten) =>
      lijsten.map((l) => [...l.children].filter((c) => (c as HTMLElement).offsetParent !== null).map((c) => Math.round(c.getBoundingClientRect().left))),
    );
  expect(rijen.filter((r) => r.length > 1).length, 'lijsten met meer dan één onderdeel').toBeGreaterThan(0);
  for (const r of rijen) expect(new Set(r).size, `links: ${r.join(', ')}`).toBeLessThanOrEqual(1);
});
// Op papier kunt u niet klikken: bij elke zichtbare link "Website" staat het adres erachter (CSS ::after met data-adres).
Then('staat bij elke website het adres', async ({ page }) => {
  const links = page.getByRole('link', { name: /^website/i }).locator('visible=true');
  await expect.poll(() => links.count()).toBeGreaterThan(0);
  for (const link of await links.all()) {
    const adres = await link.getAttribute('data-adres');
    expect(adres, `adres bij ${await link.getAttribute('href')}`).toBeTruthy();
    expect(await link.evaluate((a) => getComputedStyle(a, '::after').content)).toContain(adres!);
  }
});

// ---------- gespreksvoorbereiding (gesprek/) ----------
Then('heeft het dagboek {int} dagen om in te vullen', async ({ page }, n: number) => {
  await expect(page.locator('[data-dagboek] tbody tr').locator('visible=true')).toHaveCount(n);
});
Then('heeft het logboek {int} regels om in te vullen', async ({ page }, n: number) => {
  await expect(page.locator('[data-logboek] tbody tr').locator('visible=true')).toHaveCount(n);
});
// De contacten komen uit de gemeenteblokken (zoals in Mijn overzicht): wijkteam en cliëntondersteuner.
const contactenOpVel = (page: Page) => page.locator('[data-vel-contacten] .stap-contact').locator('visible=true');
Then('staan er geen contacten van een gemeente op het vel', async ({ page }) => {
  await expect(contactenOpVel(page)).toHaveCount(0);
});
Then('staan het wijkteam en de cliëntondersteuner van de gemeente op het vel', async ({ page }) => {
  await expect(contactenOpVel(page)).toHaveCount(2);
});
