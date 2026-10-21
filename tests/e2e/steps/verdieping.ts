/**
 * Stappen voor de verdiepingen in Mijn overzicht ("Meer passend advies") en de stappenlijst eronder.
 * Het zichtbare verdiepingsblok en de zichtbare stappenlijst horen bij de gekozen vraag.
 */
import { expect, type Page } from '@playwright/test';
import type { DataTable } from 'playwright-bdd';
import { When, Then } from './fixtures';
import { stapContacten, gemeenteSlug } from './inhoud';

const blok = (page: Page) => page.locator('[data-verdieping]').locator('visible=true').first();
const vraagBlok = (page: Page) => page.locator('[data-knelpunt-blok]').locator('visible=true').first();

/** De vetgedrukte begintekst van elke zichtbare hoofdstap (stap 1, de genummerde lijst of de eigen stappen van de situatie),
 *  zonder de ingeklapte "andere stappen". */
const stappen = (page: Page) => vraagBlok(page).locator('ol.stap-een > li, ol[data-aanvraag-stappen] > li, ol[data-situatie-stappen] > li').evaluateAll((lis) =>
  // Niet in een dicht <details>: daar heeft een element in Chromium wel een offsetParent (zoals de stappen voor later bij afgewezen).
  lis.filter((li) => !(li as HTMLElement).hidden && (li as HTMLElement).offsetParent !== null && !li.closest('details:not([open])'))
    .map((li) => {
      // De zichtbare, niet-lege vetgedrukte begintekst; heeft de stap die niet, dan de hele tekst.
      const lead = Array.from(li.querySelectorAll<HTMLElement>(':scope > .stap-lead')).find((e) => !e.hidden && e.textContent!.trim());
      return ((lead ?? li).textContent ?? '').replace(/\s+/g, ' ').trim();
    }));

When('ik als geboortedatum {string} invul', async ({ page }, datum: string) => {
  await page.getByLabel('Wanneer is uw kind geboren?').fill(datum);
});

When('ik als datum van de ingebrekestelling {string} invul', async ({ page }, datum: string) => {
  await page.getByLabel('Al een ingebrekestelling gestuurd? Wanneer kreeg de gemeente die?').fill(datum);
});

When('ik als einddatum van het besluit {string} invul', async ({ page }, datum: string) => {
  await page.getByLabel('Wanneer loopt het besluit af?').fill(datum);
});

When('ik als datum op het besluit {string} invul', async ({ page }, datum: string) => {
  await page.getByLabel('Welke datum staat op het besluit?').fill(datum);
});

When('ik als datum van de aanvraag {string} invul', async ({ page }, datum: string) => {
  await page.getByLabel('Wanneer kreeg de gemeente uw aanvraag?').fill(datum);
});

Then('zie ik het veld {string}', async ({ page }, label: string) => {
  await expect(page.getByLabel(label, { exact: true })).toBeVisible();
});

Then('zie ik het veld {string} niet', async ({ page }, label: string) => {
  await expect(page.getByLabel(label, { exact: true }).locator('visible=true')).toHaveCount(0);
});

/** Een kaart bij "Voorbeeldbrieven" onder de stappen van de gekozen vraag. */
Then('zie ik de voorbeeldbrief {string}', async ({ page }, titel: string) => {
  await expect(vraagBlok(page).locator('[data-brief-kaart]', { hasText: titel }).locator('visible=true')).toHaveCount(1);
});

When('ik open de voorbeeldbrief {string}', async ({ page }, titel: string) => {
  await vraagBlok(page).locator('[data-brief-kaart]', { hasText: titel }).locator('visible=true').first().click();
});

Then('zie ik de voorbeeldbrief {string} niet', async ({ page }, titel: string) => {
  await expect(vraagBlok(page).locator('[data-brief-kaart]', { hasText: titel }).locator('visible=true')).toHaveCount(0);
});

When('ik als verhuisdatum {string} invul', async ({ page }, datum: string) => {
  await page.getByLabel('Wanneer verhuist u ongeveer?').fill(datum);
});

When('ik als nieuwe woonplaats {string} kies', async ({ page }, plaats: string) => {
  const veld = page.getByLabel('Naar welke plaats of gemeente verhuist u?');
  await veld.click();
  await veld.pressSequentially(plaats.slice(0, 4), { delay: 20 });
  await page.locator('.suggesties li').locator('visible=true').filter({ hasText: plaats }).first().click();
});

Then('is de samenvatting {string}', async ({ page }, tekst: string) => {
  await expect(blok(page).locator('[data-vd-samenvatting]')).toHaveText(tekst);
});

Then('is er geen samenvatting', async ({ page }) => {
  await expect(blok(page).locator('[data-vd-samenvatting]')).toBeEmpty();
});

Then('staan de stappen in deze volgorde:', async ({ page }, tabel: DataTable) => {
  const verwacht = tabel.raw().map((r) => r[0]);
  await expect.poll(async () => {
    const echt = await stappen(page);
    return echt.length === verwacht.length && verwacht.every((v, i) => echt[i].startsWith(v)) ? 'ok' : echt;
  }).toBe('ok');
});

Then('begint stap {int} met {string}', async ({ page }, nr: number, tekst: string) => {
  await expect.poll(async () => (await stappen(page))[nr - 1] ?? '').toMatch(new RegExp(`^${tekst.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`));
});

/** Een link binnen een stap zelf (niet ergens onder de lijst): Fatima (ronde 27) moest daarvoor ver omlaag. */
Then('staat in stap {int} de link {string}', async ({ page }, nr: number, naam: string) => {
  const lis = vraagBlok(page).locator('ol.stap-een > li, ol[data-aanvraag-stappen] > li, ol[data-situatie-stappen] > li').locator('visible=true');
  await expect(lis.nth(nr - 1).getByRole('link', { name: naam })).toBeVisible();
});

Then('staan onder {string} de stappen:', async ({ page }, kop: string, tabel: DataTable) => {
  const anders = vraagBlok(page).locator('details', { has: page.locator('summary', { hasText: kop }) });
  await expect(anders).toBeVisible();
  // De ingeklapte lijst: bij 18 worden en uitbreiden de andere stappen (steps-anders), bij afgewezen de stappen voor later (de hele genummerde lijst).
  const echt = await anders.locator('ol.steps-anders > li, ol[data-aanvraag-stappen] > li').evaluateAll((lis) =>
    lis.filter((li) => !(li as HTMLElement).hidden).map((li) => (li.querySelector(':scope > .stap-lead')?.textContent || li.textContent || '').replace(/\s+/g, ' ').trim()));
  const verwacht = tabel.raw().map((r) => r[0]);
  expect(echt.length, `ingeklapte stappen: ${echt.join(' | ')}`).toBe(verwacht.length);
  verwacht.forEach((v, i) => expect(echt[i]).toContain(v));
});

/** De eerste lijst na stap 1 (start="2", ook als die ingeklapt staat) telt verder vanaf het aantal zichtbare stappen erboven. */
Then('loopt de nummering van de stappen daarna door bij {int}', async ({ page }, nr: number) => {
  await expect.poll(() => vraagBlok(page).locator('ol.steps[start="2"]').evaluateAll((ols) => {
    const ol = ols.find((o) => !o.closest('[hidden]'));
    return ol ? getComputedStyle(ol).counterReset : 'geen lijst';
  })).toBe(`step ${nr - 1}`);
});

/** De vette begintekst van de vervolgstappen (A, B …) onder de zichtbare stap die met deze tekst begint. */
Then('staan onder stap {string} de vervolgstappen:', async ({ page }, stap: string, tabel: DataTable) => {
  const verwacht = tabel.raw().map((r) => r[0]);
  await expect.poll(() => vraagBlok(page).locator('ol.steps > li').evaluateAll((lis, begin) => {
    const li = lis.find((l) => (l as HTMLElement).offsetParent !== null && (l.querySelector(':scope > .stap-lead')?.textContent ?? '').trim().startsWith(begin));
    if (!li) return 'stap niet gevonden';
    return Array.from(li.querySelectorAll(':scope > ol.steps-sub > li > .stap-lead')).map((e) => (e.textContent ?? '').replace(/\s+/g, ' ').trim());
  }, stap)).toEqual(verwacht);
});

/** Het contactregeltje van een organisatie (naam en website, OrgRegel) staat onder deze vervolgstap, en nergens anders in de vraag. */
// Contactregels onder de stappen (wijkteam, cliëntondersteuner): telefoon, e-mail en website, voor zover de gemeente die heeft.
Then('staan bij de contacten onder de stappen telefoon, e-mail en website zoals {string} ze heeft', async ({ page }, gemeente: string) => {
  const bekend = stapContacten(gemeenteSlug(gemeente));
  const regels = page.locator('#nu-doen .stap-org').locator('visible=true');
  await expect.poll(() => regels.count()).toBeGreaterThan(0);
  let getoetst = 0;
  for (const r of await regels.all()) {
    // Zonder naam (zoals de link naar de aanbieders) is het geen contact.
    if (!(await r.locator('strong').count())) continue;
    const naam = (await r.locator('strong').first().textContent())?.trim();
    const c = bekend.find((x) => x.naam === naam);
    if (!c) continue;
    getoetst++;
    if (c.telefoon) await expect(r.locator('a[href^="tel:"]'), `telefoon bij ${naam}`).toHaveCount(1);
    if (c.email) await expect(r.locator('a[href^="mailto:"]'), `e-mail bij ${naam}`).toHaveCount(1);
    if (c.url) await expect(r.locator('a[href^="http"]'), `website bij ${naam}`).toHaveCount(1);
  }
  expect(getoetst, 'contactregels van de gemeente onder de stappen').toBeGreaterThan(0);
});

// Een link bij een stap (zoals naar het vel om het gesprek voor te bereiden): onder welke genummerde stap staat hij?
Then('staat de link {string} onder de stap {string}', async ({ page }, naam: string, stap: string) => {
  const link = page.getByRole('link', { name: naam }).locator('visible=true');
  await expect(link).toHaveCount(1);
  const tekst = await link.evaluate((a) => a.closest('ol.steps > li')?.textContent?.trim() ?? 'niet onder een stap');
  expect(tekst.startsWith(stap), tekst.slice(0, 80)).toBe(true);
});

Then('staat de link naar {string} onder de vervolgstap {string}', async ({ page }, org: string, stap: string) => {
  const regels = vraagBlok(page).locator('.stap-org', { has: page.locator('strong', { hasText: org }) }).locator('visible=true');
  await expect(regels).toHaveCount(1);
  const lead = await regels.first().evaluate((e) => e.closest('ol.steps-sub > li')?.querySelector(':scope > .stap-lead')?.textContent?.trim() ?? 'niet onder een vervolgstap');
  expect(lead.startsWith(stap), lead).toBe(true);
});

Then('is er geen blok {string}', async ({ page }, kop: string) => {
  await expect(vraagBlok(page).locator('details', { has: page.locator('summary', { hasText: kop }) }).locator('visible=true')).toHaveCount(0);
});

Then('staat de link {string} naast {string}', async ({ page }, link: string, naast: string) => {
  const rij = blok(page).locator('.vd-acties');
  const a = rij.getByRole('link', { name: link }), b = rij.getByRole('button', { name: naast, exact: true });
  await expect(a).toBeVisible();
  await expect(b).toBeVisible();
  const [ra, rb] = [await a.boundingBox(), await b.boundingBox()];
  expect(ra!.y < rb!.y + rb!.height && rb!.y < ra!.y + ra!.height, 'op dezelfde regel').toBe(true);
  expect(ra!.x, 'link links van de knop').toBeLessThan(rb!.x);
});

Then('zie ik de link {string}', async ({ page }, link: string) => {
  await expect(page.getByRole('link', { name: link }).locator('visible=true').first()).toBeVisible();
});

Then('zie ik de link {string} niet', async ({ page }, link: string) => {
  await expect(page.getByRole('link', { name: link }).locator('visible=true')).toHaveCount(0);
});

Then('staat het begin van de stappen bovenaan in beeld', async ({ page }) => {
  const doel = vraagBlok(page).locator('[id^="stappen-"]');
  await expect.poll(async () => Math.round((await doel.boundingBox())!.y)).toBeLessThan(160);
});

/** De zichtbare vragen (labels) van het verdiepingsblok, van boven naar beneden. */
Then('staan de vragen van het verdiepingsblok in deze volgorde:', async ({ page }, tabel: DataTable) => {
  const echt = await blok(page).locator('.vd-velden > .field:visible > :first-child').allTextContents();
  expect(echt.map((t) => t.trim())).toEqual(tabel.raw().map((r) => r[0]));
});

Then('is het verdiepingsblok ingeklapt', async ({ page }) => {
  await expect(blok(page)).toHaveAttribute('data-vd-ingeklapt', '');
  await expect(blok(page).getByRole('button', { name: 'Aanpassen', exact: true })).toBeVisible();
});

Then('staan de vragen van het verdiepingsblok open', async ({ page }) => {
  await expect(blok(page)).not.toHaveAttribute('data-vd-ingeklapt', '');
  await expect(blok(page).locator('[data-vd-vragen]')).toBeVisible();
});

Then('staat er geen label bij de kop', async ({ page }) => {
  await expect(blok(page).locator('h3')).toBeVisible();
  await expect(blok(page).locator('h3 .vd-optioneel')).toHaveCount(0);
});

Then('zie ik bij het verdiepingsblok de melding {string}', async ({ page }, tekst: string) => {
  await expect(blok(page).locator('.vd-melding').locator('visible=true')).toHaveText(tekst);
});

/** De contactregel van het wijkteam (uit de blokken van de gemeente) staat zichtbaar onder deze zichtbare hoofdstap. */
Then('staat het contact van het wijkteam onder stap {int}', async ({ page }, nr: number) => {
  await expect.poll(() => vraagBlok(page).locator('ol.stap-een > li, ol[data-aanvraag-stappen] > li').evaluateAll((lis, nr) => {
    const zichtbaar = lis.filter((li) => !(li as HTMLElement).hidden && (li as HTMLElement).offsetParent !== null);
    return !!zichtbaar[nr - 1]?.querySelector(':scope > [data-wijkteam-stap] [data-geladen]');
  }, nr)).toBe(true);
});
