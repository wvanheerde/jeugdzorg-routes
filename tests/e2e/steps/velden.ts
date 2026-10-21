/** Stappen voor het datumveld (lib/datumveld.ts) en de suggestielijst bij plaatsen (lib/suggesties.ts). */
import { expect, type Page } from '@playwright/test';
import type { DataTable } from 'playwright-bdd';
import { When, Then } from './fixtures';

const datumVeld = (page: Page, label: string) => page.locator('.th-veld', { has: page.getByLabel(label, { exact: true }) });

When('ik in het veld {string} klik', async ({ page }, label: string) => {
  await page.getByLabel(label, { exact: true }).click();
});

When('ik op de kalenderknop bij {string} klik', async ({ page }, label: string) => {
  await datumVeld(page, label).getByRole('button', { name: 'Kies een datum in de kalender' }).click();
});

When('ik op een aanraakscherm de kalenderknop bij {string} aantik', async ({ page }, label: string) => {
  // Op een aanraakscherm ligt het echte datumveld onzichtbaar op de knop; de tik komt daar aan.
  await datumVeld(page, label).locator('[data-th-datum]').dispatchEvent('pointerdown');
});

When('de kalender bij {string} snel achter elkaar de datums {string} doorgeeft', async ({ page }, label: string, lijst: string) => {
  const datum = datumVeld(page, label).locator('[data-th-datum]');
  for (const d of lijst.split(',').map((x) => x.trim())) {
    await datum.evaluate((e: HTMLInputElement, v) => { e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); e.dispatchEvent(new Event('change', { bubbles: true })); }, d);
    await page.waitForTimeout(80);
  }
});

Then('is de kalender {int} keer geopend', async ({ page }, n: number) => {
  await expect.poll(() => page.evaluate(() => (window as any).__kalender)).toBe(n);
});

Then('opent de kalender bij {string} op {string}', async ({ page }, label: string, iso: string) => {
  await expect(datumVeld(page, label).locator('[data-th-datum]')).toHaveValue(iso);
});

Then('loopt de kalender bij {string} van {string} tot {string}', async ({ page }, label: string, van: string, tot: string) => {
  const d = datumVeld(page, label).locator('[data-th-datum]');
  await expect(d).toHaveAttribute('min', van);
  await expect(d).toHaveAttribute('max', tot);
});

Then('ligt de kalender bij {string} alleen op de kalenderknop', async ({ page }, label: string) => {
  const veld = datumVeld(page, label);
  const tekst = await veld.locator('[data-th-invoer]').boundingBox(), knop = await veld.locator('[data-th-kalender]').boundingBox();
  const bovenop = (x: number, y: number) => page.evaluate(([x, y]) => {
    const e = document.elementFromPoint(x, y) as HTMLElement | null;
    return e?.hasAttribute('data-th-datum') ? 'kalender' : e?.hasAttribute('data-th-invoer') ? 'tekstveld' : e?.tagName ?? '';
  }, [x, y]);
  expect(await bovenop(tekst!.x + 20, tekst!.y + tekst!.height / 2)).toBe('tekstveld');
  expect(await bovenop(knop!.x + knop!.width / 2, knop!.y + knop!.height / 2)).toBe('kalender');
});

Then('zie ik de suggesties:', async ({ page }, tabel: DataTable) => {
  await expect(page.locator('.suggesties').locator('visible=true').locator('li')).toHaveText(tabel.raw().map((r) => r[0]));
});

Then('zie ik de suggestie {string}', async ({ page }, tekst: string) => {
  await expect(page.locator('.suggesties').locator('visible=true').locator('li', { hasText: tekst }).first()).toBeVisible();
});

Then('zie ik geen suggesties', async ({ page }) => {
  await expect(page.locator('.suggesties').locator('visible=true')).toHaveCount(0);
});

When('ik de suggestie {string} kies', async ({ page }, tekst: string) => {
  await page.locator('.suggesties').locator('visible=true').locator('li', { hasText: tekst }).first().click();
});

Then('is de suggestie {string} gemarkeerd', async ({ page }, tekst: string) => {
  await expect(page.locator('.suggesties li[aria-selected="true"]')).toHaveText(tekst);
});

// ---------- cursor ----------
/** Het zichtbare veld met dit label heeft de focus (bijvoorbeeld een datumveld dat na een antwoord opengaat). */
Then('staat de cursor in {string}', async ({ page }, label: string) => {
  await expect(page.getByLabel(label, { exact: true }).locator('visible=true').first()).toBeFocused();
});
Then('staat de cursor niet in {string}', async ({ page }, label: string) => {
  await expect(page.getByLabel(label, { exact: true }).locator('visible=true').first()).not.toBeFocused();
});
