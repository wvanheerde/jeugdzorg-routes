/** Stappen voor de terug-link, scrollen, de balk onderaan, de zijnavigatie en de inhoudsopgave. */
import { expect } from '@playwright/test';
import { When, Then } from './fixtures';
import { regex, schoon } from './algemeen';

// ---------- terug-link ----------
When('ik de eerste therapievorm open', async ({ page }) => {
  await page.locator('[data-tip-situaties]').locator('visible=true').first().getByRole('link').first().click();
});
When('ik de hulpsoort {string} open', async ({ page }, naam: string) => {
  const links = page.locator('main a[href*="/hulpsoorten/"]').locator('visible=true');
  const n = await links.count();
  for (let i = 0; i < n; i++) if (schoon((await links.nth(i).textContent()) ?? '').includes(naam)) return links.nth(i).click();
  throw new Error(`Geen link naar de hulpsoort "${naam}"`);
});
Then('is de terug-link {string} naar {string}', async ({ page }, tekst: string, doel: string) => {
  const a = page.locator('[data-terug]');
  await expect(a).toHaveText(tekst);
  await expect(a).toHaveAttribute('href', new RegExp(regex(doel)));
});

// ---------- scrollen en vaste onderdelen ----------
When('ik een stuk naar beneden scroll', async ({ page }) => {
  await page.mouse.wheel(0, 900);
  await page.evaluate(() => window.scrollBy(0, 900));
  await page.waitForTimeout(150);
});
Then('zie ik de hint {string}', async ({ page }, tekst: string) => {
  await expect(page.locator('[data-meer-hint]')).toBeVisible();
  await expect(page.locator('[data-meer-hint]')).toContainText(tekst);
});
Then('zie ik de hint niet meer', async ({ page }) => {
  await expect(page.locator('[data-meer-hint]')).toBeHidden();
});
Then('staat in de zijnavigatie {string}', async ({ page }, naam: string) => {
  await expect(page.locator('nav[data-zijnav]').getByRole('link', { name: naam }).locator('visible=true').first()).toBeVisible();
});
Then('staat in de zijnavigatie niet {string}', async ({ page }, naam: string) => {
  await expect(page.locator('nav[data-zijnav]').getByRole('link', { name: naam }).locator('visible=true')).toHaveCount(0);
});

// ---------- inhoudsopgave met pijlknoppen ----------
Then('heeft de inhoudsopgave rechts een pijl {string}', async ({ page }, label: string) => {
  await expect(page.locator('.toc-wrap')).toHaveAttribute('data-meer-rechts', '');
  await expect(page.getByRole('button', { name: label })).toBeVisible();
});
When('ik op de pijl {string} druk', async ({ page }, label: string) => {
  await page.getByRole('button', { name: label }).click();
});
Then('heeft de inhoudsopgave links een pijl {string}', async ({ page }, label: string) => {
  await expect(page.locator('.toc-wrap')).toHaveAttribute('data-meer-links', '');
  await expect(page.getByRole('button', { name: label })).toBeVisible();
});
