/** Stappen voor de voorbeeldbrieven: de briefbouwer, de briefpagina en kopiëren (klembord). */
import { expect, type Page } from '@playwright/test';
import { Given, When, Then } from './fixtures';
import { brieven } from './inhoud';
import { schoon } from './algemeen';

// ---------- briefbouwer ----------
/** Zichtbare keuzekaart (hulp of therapievorm) waarvan de kop met deze naam begint (koppen kunnen zachte afbreekstreepjes hebben). */
const keuzeKaart = async (page: Page, naam: string) => {
  const kaarten = page.locator('.brief-keuze').locator('visible=true');
  const n = await kaarten.count();
  for (let i = 0; i < n; i++) if (schoon((await kaarten.nth(i).locator('h3').textContent()) ?? '').startsWith(naam)) return kaarten.nth(i);
  throw new Error(`Geen zichtbare keuzekaart "${naam}"`);
};
When('ik {string} in de brief zet', async ({ page }, naam: string) => {
  await (await keuzeKaart(page, naam)).getByRole('button', { name: 'Zet in de brief' }).click();
});
When('ik {string} uit de brief haal', async ({ page }, naam: string) => {
  await (await keuzeKaart(page, naam)).getByRole('button', { name: 'Haal uit de brief' }).click();
});
When('ik de eerste therapievorm in de brief zet', async ({ page }) => {
  await page.locator('.therapie-keuze').locator('visible=true').first().getByRole('button', { name: 'Zet in de brief' }).click();
});
Then('staat in de brief {string}', async ({ page }, tekst: string) => {
  await expect.poll(async () => schoon((await page.locator('[data-brief]').textContent()) ?? '')).toContain(tekst);
});
Then('staat in de brief niet {string}', async ({ page }, tekst: string) => {
  await expect.poll(async () => schoon((await page.locator('[data-brief]').textContent()) ?? '')).not.toContain(tekst);
});
/** Aantal punten in de lijst direct onder een tussenkop van de brief ("Wat er is gebeurd", "Wat ik vraag"). Het laatste woord
 *  (regels, verzoeken) is alleen voor de leesbaarheid. */
Then('staan in de brief bij {string} {int} {word}', async ({ page }, kop: string, n: number, _soort: string) => {
  await expect
    .poll(() =>
      page.locator('[data-brief]').evaluate((brief, kop) => {
        const p = Array.from(brief.querySelectorAll('p')).find((x) => x.querySelector('strong')?.textContent?.startsWith(kop));
        const lijst = p?.nextElementSibling;
        return lijst && /^(UL|OL)$/.test(lijst.tagName) ? lijst.children.length : -1;
      }, kop),
    )
    .toBe(n);
});
Then('staat de eerste therapievorm in de brief', async ({ page }) => {
  const zin = await page.locator('.therapie-keuze').locator('visible=true').first().locator('[data-zin]').getAttribute('data-zin');
  await expect.poll(async () => schoon((await page.locator('[data-brief]').textContent()) ?? '')).toContain(schoon(zin!).slice(0, 30));
});
Then('zie ik therapievormen om in de brief te noemen', async ({ page }) => {
  await expect(page.locator('[data-therapie-blok]')).toBeVisible();
  await expect(page.locator('.therapie-keuze').locator('visible=true').first()).toBeVisible();
});
Then('zie ik geen therapievormen om in de brief te noemen', async ({ page }) => {
  await expect(page.locator('.therapie-keuze').locator('visible=true')).toHaveCount(0);
});

// ---------- hulpmiddelen (hulpmiddelen/) ----------
Then('staan alle voorbeeldbrieven op de pagina', async ({ page }) => {
  await expect(page.locator('[data-brief-kaart]').locator('visible=true')).toHaveCount(brieven().length);
});

// ---------- briefpagina ----------
const briefTekst = (page: Page) => page.locator('#brief-tekst');
const knopOnderBrief = (page: Page, naam: string) => page.getByRole('button', { name: naam }).locator('visible=true').last();
Then('staat onder de brief de knop {string}', async ({ page }, naam: string) => {
  const [brief, knop] = [await briefTekst(page).boundingBox(), await knopOnderBrief(page, naam).boundingBox()];
  expect(knop!.y, 'knop onder de brief').toBeGreaterThan(brief!.y + brief!.height);
});
When('ik onder de brief op {string} druk', async ({ page }, naam: string) => {
  await knopOnderBrief(page, naam).click();
});
Then('staat {string} boven de brief', async ({ page }, tekst: string) => {
  const [el, brief] = [await page.getByText(tekst, { exact: true }).locator('visible=true').first().boundingBox(), await briefTekst(page).boundingBox()];
  expect(el!.y + el!.height, `"${tekst}" boven de brief`).toBeLessThan(brief!.y);
});

/** Op de laptop staan de tips in de zijkolom; op de telefoon staan ze ingeklapt boven de brief en klapt de ouder ze open. */
When('ik de tips {string} bekijk', async ({ page }, kop: string) => {
  const summary = page.locator('summary', { hasText: kop }).locator('visible=true');
  if (await summary.count()) await summary.first().click();
});

// ---------- klembord (brieven) ----------
Given('de site mag het klembord gebruiken', async ({ context, browserName }) => {
  if (browserName === 'chromium') await context.grantPermissions(['clipboard-read', 'clipboard-write']);
});
Then('staat op het klembord een tekst met {string}', async ({ page }, tekst: string) => {
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toContain(tekst);
});
Then('staat op het klembord geen {string}', async ({ page }, tekst: string) => {
  expect(await page.evaluate(() => navigator.clipboard.readText())).not.toContain(tekst);
});

// ---------- kopiëren zonder klembord ----------
/** Zoals op een toestel of in een browser waar de site niet op het klembord mag schrijven. Vóór het openen van de pagina. */
Given('het klembord werkt niet', async ({ page }) => {
  await page.addInitScript(() => {
    const nee = () => Promise.reject(new Error('geen toegang'));
    Object.defineProperty(navigator, 'clipboard', { value: { write: nee, writeText: nee }, configurable: true });
    document.execCommand = () => false;
  });
});
Then('is de tekst van de brief geselecteerd', async ({ page }) => {
  await expect.poll(() => page.evaluate(() => String(window.getSelection() ?? ''))).toContain('Wat er is gebeurd');
});
