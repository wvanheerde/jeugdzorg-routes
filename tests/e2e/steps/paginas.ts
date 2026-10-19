/**
 * Stappen voor pagina's en onderdelen: koppen, secties, menu, moeilijke woorden, gemeentekeuze, zoeken, brieven.
 * Koppen kunnen zachte afbreekstreepjes bevatten (lib/afbreken.ts); die worden bij het vergelijken weggelaten.
 */
import { expect, type Page } from '@playwright/test';
import type { DataTable } from 'playwright-bdd';
import { Given, When, Then } from './fixtures';
import { gemeenteSlug, situatieId } from './inhoud';
import { noteerBezoek } from '../dekking/opties';

const schoon = (s: string) => s.replace(/\u00ad/g, '').replace(/\s+/g, ' ').trim();
/** Zichtbare koppen, zonder sectienummer (span.section-num, zoals "1" of "→") en zonder zachte afbreekstreepjes. */
const koppen = (page: Page, niveau?: number) => page.locator(niveau ? `h${niveau}` : 'h1, h2, h3, h4').evaluateAll((hs) =>
  hs.filter((h) => (h as HTMLElement).offsetParent !== null).map((h) => {
    const c = h.cloneNode(true) as HTMLElement;
    c.querySelectorAll('.section-num').forEach((n) => n.remove());
    return (c.textContent ?? '').replace(/\u00ad/g, '').replace(/\s+/g, ' ').trim();
  }));

// ---------- bewaarde keuzes ----------
Given('ik heb eerder gekozen voor de gemeente {string}', async ({ page }, gemeente: string) => {
  await page.goto('./');
  await page.evaluate((g) => localStorage.setItem('jr.gemeente', g), gemeenteSlug(gemeente));
});
Given('ik heb eerder de situatie {string} gekozen', async ({ page }, situatie: string) => {
  await page.goto('./');
  await page.evaluate((s) => localStorage.setItem('jr.situaties', s), situatieId(situatie));
});

// ---------- koppen, titels, secties ----------
Then('is de hoofdkop {string}', async ({ page }, tekst: string) => {
  await expect.poll(async () => (await koppen(page, 1))[0]).toBe(tekst);
});
Then('zie ik de kop {string}', async ({ page }, tekst: string) => {
  await expect.poll(async () => (await koppen(page)).some((k) => k === tekst || k.startsWith(tekst)) ? 'ja' : (await koppen(page)).join(' | ')).toBe('ja');
});
Then('zie ik de kop {string} niet', async ({ page }, tekst: string) => {
  await expect.poll(async () => (await koppen(page)).some((k) => k === tekst || k.startsWith(tekst))).toBe(false);
});
Then('heeft de pagina de titel {string}', async ({ page }, titel: string) => {
  await expect(page).toHaveTitle(titel);
});
Then('zie ik de koppen:', async ({ page }, tabel: DataTable) => {
  const echt = await koppen(page);
  for (const [k] of tabel.raw()) expect(echt.some((x) => x === k || x.startsWith(k)), `kop "${k}" in ${echt.join(' | ')}`).toBe(true);
});

// ---------- links en knoppen ----------
Then('gaat de link {string} naar {string}', async ({ page }, naam: string, doel: string) => {
  const link = page.getByRole('link', { name: naam }).locator('visible=true').first();
  await expect(link).toHaveAttribute('href', new RegExp(doel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
});
Then('zie ik een belknop', async ({ page }) => {
  await expect(page.locator('a.btn.bel[href^="tel:"], a[href^="tel:"].btn').locator('visible=true').first()).toBeVisible();
});
Then('zie ik een link om {string} te bellen', async ({ page }, nummer: string) => {
  await expect(page.locator(`a[href="tel:${nummer.replace(/\s/g, '')}"]`).locator('visible=true').first()).toBeVisible();
});
Then('zie ik de knop {string}', async ({ page }, naam: string) => {
  await expect(page.getByRole('button', { name: naam }).locator('visible=true').first()).toBeVisible();
});
Then('zie ik de knop {string} niet', async ({ page }, naam: string) => {
  await expect(page.getByRole('button', { name: naam }).locator('visible=true')).toHaveCount(0);
});

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
  const blok = await page.getByRole('heading', { name: kop }).locator('visible=true').first()
    .locator('xpath=ancestor::*[self::section or contains(@class, "eerste-contact")][1]').boundingBox();
  expect(knop!.y + knop!.height, 'knop boven het blok').toBeLessThanOrEqual(blok!.y);
  expect(Math.abs(knop!.x + knop!.width - (blok!.x + blok!.width)), 'rechts uitgelijnd met het blok').toBeLessThan(2);
});
// Kaarten en blokken die op het scherm naast elkaar staan, staan op papier onder elkaar (een lijst): alles op dezelfde x.
Then('staan de kaarten en blokken onder elkaar', async ({ page }) => {
  const rijen = await page.locator('.grid, .linklist, .onderdelen').locator('visible=true').evaluateAll((lijsten) => lijsten.map((l) =>
    [...l.children].filter((c) => (c as HTMLElement).offsetParent !== null).map((c) => Math.round(c.getBoundingClientRect().left))));
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
When('ik naar de pagina {string} ga', async ({ page }, pad: string) => {
  await page.goto(pad.replace(/^\//, ''));
});
Then('heeft het dagboek {int} dagen om in te vullen', async ({ page }, n: number) => {
  await expect(page.locator('[data-dagboek] tbody tr').locator('visible=true')).toHaveCount(n);
});
// De contacten komen uit de gemeenteblokken (zoals in Mijn overzicht): wijkteam en cliëntondersteuner.
const contactenOpVel = (page: Page) => page.locator('[data-vel-contacten] .stap-contact').locator('visible=true');
Then('staan er geen contacten van een gemeente op het vel', async ({ page }) => {
  await expect(contactenOpVel(page)).toHaveCount(0);
});
Then('staan het wijkteam en de cliëntondersteuner van de gemeente op het vel', async ({ page }) => {
  await expect(contactenOpVel(page)).toHaveCount(2);
});

// ---------- menu ----------
When('ik het menu open', async ({ page }) => {
  await page.locator('[data-menu-knop]').click();
});
Then('staat in het hoofdmenu:', async ({ page }, tabel: DataTable) => {
  const nav = page.locator('#hoofdnavigatie');
  for (const [naam] of tabel.raw()) await expect(nav.getByRole('link', { name: naam, exact: true })).toBeVisible();
});
Then('is {string} in het hoofdmenu de huidige pagina', async ({ page }, naam: string) => {
  await expect(page.locator('#hoofdnavigatie').getByRole('link', { name: naam, exact: true })).toHaveAttribute('aria-current', 'page');
});
Then('is het menu dicht', async ({ page }) => {
  await expect(page.locator('[data-menu-knop]')).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('#hoofdnavigatie')).toBeHidden();
});

// ---------- moeilijke woorden ----------
const woord = (page: Page, w: string) => page.locator('main span.woord[role="button"]').filter({ hasText: new RegExp(`^${w}$`, 'i') }).locator('visible=true').first();
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
Then('is {string} een moeilijk woord met uitleg', async ({ page }, w: string) => {
  await expect(woord(page, w)).toBeVisible();
});
Then('staan er geen uitlegknoppen in de lijst met begrippen', async ({ page }) => {
  await expect(page.locator('#begrippen-lijst span.woord[role="button"]')).toHaveCount(0);
});

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

// ---------- tekst op een plek ----------
Then('staat in {string} de tekst {string} te lezen', async ({ page }, selector: string, tekst: string) => {
  await expect.poll(async () => schoon((await page.locator(selector).locator('visible=true').first().textContent()) ?? '')).toContain(tekst);
});

// ---------- inklapbare onderdelen ----------
When('ik het onderdeel {string} open', async ({ page }, tekst: string) => {
  await page.locator('summary', { hasText: tekst }).locator('visible=true').first().click();
});
Then('staat het onderdeel {string} open', async ({ page }, tekst: string) => {
  await expect(page.locator('details', { has: page.locator('summary', { hasText: tekst }) }).first()).toHaveAttribute('open', '');
});

// ---------- bestanden voor zoekmachines ----------
const haal = async (page: Page, baseURL: string | undefined, bestand: string) => {
  const url = new URL(bestand, baseURL);
  noteerBezoek(`bestand › ${bestand}`, [url.pathname]);
  return (await page.request.get(url.toString())).text();
};
Then('bevat {string} de regel {string}', async ({ page, baseURL }, bestand: string, regel: string) => {
  expect((await haal(page, baseURL, bestand)).split('\n').map((r) => r.trim())).toContain(regel);
});
Then('bevat {string} de tekst {string}', async ({ page, baseURL }, bestand: string, stuk: string) => {
  expect(await haal(page, baseURL, bestand)).toContain(stuk);
});
Then('bevat {string} niet de tekst {string}', async ({ page, baseURL }, bestand: string, stuk: string) => {
  expect(await haal(page, baseURL, bestand)).not.toContain(stuk);
});
Then('mag de pagina niet in zoekmachines', async ({ page }) => {
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
});

// Opmaak van genummerde stappen (Mijn overzicht): lijn tussen de stappen, geen verbindingslijn, geen lijn tussen vervolgstappen.
const stapStijl = (page: Page, selector: string) => page.locator(selector).evaluateAll((lis) => lis
  .filter((li) => (li as HTMLElement).offsetParent !== null)
  .map((li) => ({ boven: getComputedStyle(li).borderTopStyle, lijn: getComputedStyle(li, '::after').content })));

Then('staat tussen de genummerde stappen een lichte lijn', async ({ page }) => {
  // Alle stappen na stap 1, ook stap 2 (die staat in een eigen lijst, onder het contact).
  const s = await stapStijl(page, '[data-knelpunt-blok]:not([hidden]) ol[data-aanvraag-stappen] > li');
  expect(s.length).toBeGreaterThan(0);
  s.forEach((x) => expect(x.boven).toBe('solid'));
});

Then('staat er geen verticale lijn tussen de genummerde stappen', async ({ page }) => {
  const s = await stapStijl(page, '[data-knelpunt-blok]:not([hidden]) ol[data-aanvraag-stappen] > li');
  s.forEach((x) => expect(x.lijn).toBe('none'));
});

Then('heeft de eerste zichtbare stap geen lijn erboven', async ({ page }) => {
  const s = await page.locator('[data-knelpunt-blok]:not([hidden]) ol.steps > li').evaluateAll((lis) => {
    const li = lis.find((l) => (l as HTMLElement).offsetParent !== null);
    return li ? getComputedStyle(li).borderTopStyle : 'geen stap';
  });
  expect(s).toBe('none');
});

Then('staat tussen de vervolgstappen geen lijn', async ({ page }) => {
  const s = await stapStijl(page, '[data-knelpunt-blok]:not([hidden]) ol.steps-sub > li + li');
  expect(s.length).toBeGreaterThan(0);
  s.forEach((x) => expect(x.boven).toBe('none'));
});
