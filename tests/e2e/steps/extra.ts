/** Stappen voor de briefbouwer, de terug-link, scrollen, de balk onderaan, de zijnavigatie en de inhoudsopgave. */
import { expect, type Page } from '@playwright/test';
import { Given, When, Then } from './fixtures';

const schoon = (s: string) => s.replace(/­/g, '').replace(/\s+/g, ' ').trim();

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
  await expect.poll(() => page.locator('[data-brief]').evaluate((brief, kop) => {
    const p = Array.from(brief.querySelectorAll('p')).find((x) => x.querySelector('strong')?.textContent?.startsWith(kop));
    const lijst = p?.nextElementSibling;
    return lijst && /^(UL|OL)$/.test(lijst.tagName) ? lijst.children.length : -1;
  }, kop)).toBe(n);
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
  await expect(a).toHaveAttribute('href', new RegExp(doel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
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

// ---------- datumveld: kalender sluiten ----------
When('de kalender bij {string} de datum {string} doorgeeft en sluit', async ({ page }, label: string, iso: string) => {
  const datum = page.locator('.th-veld', { has: page.getByLabel(label, { exact: true }) }).locator('[data-th-datum]');
  await datum.evaluate((e: HTMLInputElement, v) => {
    e.value = v;
    e.dispatchEvent(new Event('input', { bubbles: true }));
    e.dispatchEvent(new Event('change', { bubbles: true }));
    e.dispatchEvent(new FocusEvent('blur'));
  }, iso);
});
Then('staat {string} meteen in de url', async ({ page }, stuk: string) => {
  // Sneller dan de wachttijd van 800 ms: bij het sluiten van de kalender geeft het veld de datum direct door.
  await expect.poll(() => decodeURIComponent(page.url()), { timeout: 400 }).toContain(stuk);
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
