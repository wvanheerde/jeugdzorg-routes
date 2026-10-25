/** Stappen voor moeilijke woorden met uitleg (lib/woorden.ts) en de begrippenlijst. */
import { expect, type Page } from '@playwright/test';
import { When, Then } from './fixtures';

// ---------- moeilijke woorden ----------
const woord = (page: Page, w: string) =>
  page
    .locator('main span.woord[role="button"]')
    .filter({ hasText: new RegExp(`^${w}$`, 'i') })
    .locator('visible=true')
    .first();
When('ik op het moeilijke woord {string} klik', async ({ page }, w: string) => {
  await woord(page, w).click();
});
Then('zie ik bij {string} de uitleg {string}', async ({ page }, w: string, uitleg: string) => {
  const id = await woord(page, w).getAttribute('aria-controls');
  await expect(page.locator(`#${id}`)).toBeVisible();
  await expect(page.locator(`#${id}`)).toContainText(uitleg);
  await expect(woord(page, w)).toHaveAttribute('aria-expanded', 'true');
});
Then('is de uitleg bij {string} dicht', async ({ page }, w: string) => {
  const id = await woord(page, w).getAttribute('aria-controls');
  await expect(page.locator(`#${id}`)).toBeHidden();
  await expect(woord(page, w)).toHaveAttribute('aria-expanded', 'false');
});
Then('is {string} met precies deze letters geen moeilijk woord', async ({ page }, w: string) => {
  await expect(page.locator('main span.woord[role="button"]').filter({ hasText: new RegExp(`^${w}$`) })).toHaveCount(0);
});
Then('is {string} een moeilijk woord met uitleg', async ({ page }, w: string) => {
  await expect(woord(page, w)).toBeVisible();
});
Then('staan er geen uitlegknoppen in de lijst met begrippen', async ({ page }) => {
  await expect(page.locator('#begrippen-lijst span.woord[role="button"]')).toHaveCount(0);
});
