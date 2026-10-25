/** Stappen voor de gemeentekeuze, zoeken op woonplaats of naam, en de startvragen op de voorpagina. */
import { expect, type Page } from '@playwright/test';
import type { DataTable } from 'playwright-bdd';
import { When, Then } from './fixtures';
import { knop, regex } from './algemeen';

// ---------- gemeentekeuze en zoeken ----------
When('ik als gemeente {string} kies', async ({ page }, naam: string) => {
  await page.locator('select[data-gemeente-keuze]').locator('visible=true').first().selectOption({ label: naam });
});
Then('is als gemeente {string} gekozen', async ({ page }, naam: string) => {
  const sel = page.locator('select[data-gemeente-keuze]').locator('visible=true').first();
  await expect.poll(() => sel.evaluate((s: HTMLSelectElement) => s.selectedOptions[0]?.text)).toBe(naam);
});
When('ik zoek op woonplaats {string}', async ({ page }, plaats: string) => {
  await page.getByRole('button', { name: 'Weet u uw gemeente niet? Zoek op woonplaats' }).locator('visible=true').first().click();
  const veld = page.locator('[data-woonplaats-invoer]').locator('visible=true').first();
  await veld.pressSequentially(plaats, { delay: 20 });
});
When('ik {string} zoek in {string}', async ({ page }, tekst: string, veld: string) => {
  await page.getByLabel(veld, { exact: true }).locator('visible=true').first().fill(tekst);
});
Then('zie ik {int} kaarten met {string}', async ({ page }, n: number, selector: string) => {
  await expect(page.locator(selector).locator('visible=true')).toHaveCount(n);
});
Then('zie ik alleen de gemeente {string}', async ({ page }, naam: string) => {
  const kaarten = page.locator('a.card[data-naam]').locator('visible=true');
  await expect(kaarten).toHaveCount(1);
  await expect(kaarten.first()).toContainText(naam);
});

// ---------- startvragen (voorpagina) ----------
// Eén vraag tegelijk: eerdere antwoorden staan als regel (data-antwoord) met "wijzigen".
const antwoordRegel = (page: Page, tekst: string) =>
  page
    .locator('[data-antwoord]')
    .filter({ has: page.getByText(tekst, { exact: true }) })
    .locator('visible=true')
    .first();
Then('zie ik de knoppen:', async ({ page }, tabel: DataTable) => {
  for (const [naam] of tabel.raw()) await expect(knop(page, naam), naam).toBeVisible();
});
Then('zie ik het antwoord {string}', async ({ page }, tekst: string) => {
  await expect(antwoordRegel(page, tekst)).toBeVisible();
});
Then('zie ik het antwoord {string} niet', async ({ page }, tekst: string) => {
  await expect(
    page
      .locator('[data-antwoord]')
      .filter({ has: page.getByText(tekst, { exact: true }) })
      .locator('visible=true'),
  ).toHaveCount(0);
});
When('ik bij {string} op {string} druk', async ({ page }, tekst: string, naam: string) => {
  await antwoordRegel(page, tekst).getByRole('button', { name: naam }).click();
});
/** De knop staat zichtbaar in het groepje met deze kop (data-groep-kop), zoals "Vaak bij deze leeftijd" of "Gevoel en gedrag". */
Then('staat de knop {string} onder {string}', async ({ page }, naam: string, kop: string) => {
  const groep = page.locator(`[data-groep-kop="${kop}"]`).locator('visible=true');
  await expect(groep).toHaveCount(1);
  await expect(groep.getByRole('button', { name: new RegExp(`^(✓ )?${regex(naam)}$`) })).toBeVisible();
});
Then('staat de knop {string} één keer op de pagina', async ({ page }, naam: string) => {
  await expect(page.getByRole('button', { name: new RegExp(`^(✓ )?${regex(naam)}$`) }).locator('visible=true')).toHaveCount(1);
});
Then('zie ik {int} situaties om te kiezen', async ({ page }, n: number) => {
  await expect(page.locator('[data-startsituatie]').locator('visible=true')).toHaveCount(n);
});
/** Na het schuiven staat de tekst in de bovenste 40% van het scherm (op de telefoon schuift de volgende vraag in beeld). */
Then('staat {string} bovenaan in beeld', async ({ page }, tekst: string) => {
  const el = page.getByText(tekst, { exact: true }).locator('visible=true').first();
  const hoogte = page.viewportSize()!.height;
  await expect
    .poll(async () => {
      const b = await el.boundingBox();
      return b ? b.y >= 0 && b.y < hoogte * 0.4 : false;
    })
    .toBe(true);
});
/** Weinig ruimte tussen een keuzelijst en de tekst eronder (hooguit 40 px). */
Then('staat {string} vlak onder de keuzelijst {string}', async ({ page }, tekst: string, lijst: string) => {
  const onder = (await page.getByLabel(lijst).locator('visible=true').first().boundingBox())!;
  const el = page.getByText(tekst, { exact: true }).locator('visible=true').first();
  await expect
    .poll(async () => {
      const b = (await el.boundingBox())!;
      return Math.round(b.y - (onder.y + onder.height));
    })
    .toBeLessThanOrEqual(40);
});

/** De link staat helemaal in beeld, met de onderkant in het onderste stukje van het scherm (de pagina schoof net genoeg). */
Then('staat de link {string} onderaan in beeld', async ({ page }, naam: string) => {
  const link = page.getByRole('link', { name: naam }).locator('visible=true').first();
  const hoogte = page.viewportSize()!.height;
  await expect
    .poll(async () => {
      const b = (await link.boundingBox())!;
      return b.y >= 0 && b.y + b.height <= hoogte && b.y + b.height > hoogte - 60;
    })
    .toBe(true);
});
/** De link staat in beeld en niet onder de vaste kop: het midden van de link is wat je daar ziet. */
Then('staat de link {string} helemaal in beeld', async ({ page }, naam: string) => {
  const link = page.getByRole('link', { name: naam }).locator('visible=true').first();
  await expect
    .poll(() =>
      link.evaluate((a) => {
        const r = a.getBoundingClientRect();
        const op = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
        return r.top >= 0 && r.bottom <= innerHeight && !!op && a.contains(op);
      }),
    )
    .toBe(true);
});
/** De knop eerst in beeld, dan kiezen: daarna staat de pagina nog op dezelfde plek (op de laptop schuift de site niet). */
When('ik kies {string} en de pagina blijft staan', async ({ page }, naam: string) => {
  const k = knop(page, naam);
  await k.scrollIntoViewIfNeeded();
  const voor = await page.evaluate(() => scrollY);
  // Klikken in het bovenste stukje van de knop, zoals een ouder op het zichtbare deel tikt: onderaan kan het zwevende
  // "Meer op deze pagina" over de knop liggen, en dan schuift Playwright bij een gewone klik zelf de pagina.
  const b = (await k.boundingBox())!;
  await page.mouse.click(b.x + 20, b.y + 8);
  await page.waitForTimeout(700);
  expect(await page.evaluate(() => scrollY), 'schuifpositie na de keuze').toBe(voor);
});
