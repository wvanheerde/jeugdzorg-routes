/**
 * Stappen voor pagina's en onderdelen: koppen, secties, menu, moeilijke woorden, gemeentekeuze, zoeken, brieven.
 * Koppen kunnen zachte afbreekstreepjes bevatten (lib/afbreken.ts); die worden bij het vergelijken weggelaten.
 */
import { expect, type Page } from '@playwright/test';
import type { DataTable } from 'playwright-bdd';
import { Given, When, Then } from './fixtures';
import { gemeenteSlug, situatieId, brieven } from './inhoud';
import { noteerBezoek } from '../dekking/opties';
import { knop } from './algemeen';

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
// Het menu heeft ook een link "Hulpmiddelen"; deze stap kijkt alleen in het bovenste blok van de voorpagina.
Then('gaat de link {string} in de hero naar {string}', async ({ page }, naam: string, doel: string) => {
  const link = page.locator('.hero').getByRole('link', { name: naam, exact: true }).locator('visible=true').first();
  await expect(link).toHaveAttribute('href', new RegExp(`${doel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`));
});
When('ik met de muis op de link {string} ga', async ({ page }, naam: string) => {
  await page.getByRole('link', { name: naam }).locator('visible=true').first().hover();
});
Then('is de tekst van de link {string} wit', async ({ page }, naam: string) => {
  await expect.poll(() => page.getByRole('link', { name: naam }).locator('visible=true').first().evaluate((a) => getComputedStyle(a).color)).toBe('rgb(255, 255, 255)');
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
Then('staat {string} niet in het hoofdmenu', async ({ page }, naam: string) => {
  await expect(page.locator('#hoofdnavigatie').getByRole('link', { name: naam, exact: true })).toHaveCount(0);
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
Then('is {string} met precies deze letters geen moeilijk woord', async ({ page }, w: string) => {
  await expect(page.locator('main span.woord[role="button"]').filter({ hasText: new RegExp(`^${w}$`) })).toHaveCount(0);
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

// ---------- startvragen (voorpagina) ----------
// Eén vraag tegelijk: eerdere antwoorden staan als regel (data-antwoord) met "wijzigen".
const antwoordRegel = (page: Page, tekst: string) => page.locator('[data-antwoord]').filter({ has: page.getByText(tekst, { exact: true }) }).locator('visible=true').first();
Then('zie ik de knoppen:', async ({ page }, tabel: DataTable) => {
  for (const [naam] of tabel.raw()) await expect(knop(page, naam), naam).toBeVisible();
});
Then('zie ik het antwoord {string}', async ({ page }, tekst: string) => {
  await expect(antwoordRegel(page, tekst)).toBeVisible();
});
Then('zie ik het antwoord {string} niet', async ({ page }, tekst: string) => {
  await expect(page.locator('[data-antwoord]').filter({ has: page.getByText(tekst, { exact: true }) }).locator('visible=true')).toHaveCount(0);
});
When('ik bij {string} op {string} druk', async ({ page }, tekst: string, naam: string) => {
  await antwoordRegel(page, tekst).getByRole('button', { name: naam }).click();
});
/** De knop staat zichtbaar in het groepje met deze kop (data-groep-kop), zoals "Vaak bij deze leeftijd" of "Gevoel en gedrag". */
Then('staat de knop {string} onder {string}', async ({ page }, naam: string, kop: string) => {
  const groep = page.locator(`[data-groep-kop="${kop}"]`).locator('visible=true');
  await expect(groep).toHaveCount(1);
  await expect(groep.getByRole('button', { name: new RegExp(`^(✓ )?${naam.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`) })).toBeVisible();
});
Then('staat de knop {string} één keer op de pagina', async ({ page }, naam: string) => {
  await expect(page.getByRole('button', { name: new RegExp(`^(✓ )?${naam.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`) }).locator('visible=true')).toHaveCount(1);
});
Then('zie ik {int} situaties om te kiezen', async ({ page }, n: number) => {
  await expect(page.locator('[data-startsituatie]').locator('visible=true')).toHaveCount(n);
});
/** Na het schuiven staat de tekst in de bovenste 40% van het scherm (op de telefoon schuift de volgende vraag in beeld). */
Then('staat {string} bovenaan in beeld', async ({ page }, tekst: string) => {
  const el = page.getByText(tekst, { exact: true }).locator('visible=true').first();
  const hoogte = page.viewportSize()!.height;
  await expect.poll(async () => { const b = await el.boundingBox(); return b ? b.y >= 0 && b.y < hoogte * 0.4 : false; }).toBe(true);
});
/** Weinig ruimte tussen een keuzelijst en de tekst eronder (hooguit 40 px). */
Then('staat {string} vlak onder de keuzelijst {string}', async ({ page }, tekst: string, lijst: string) => {
  const onder = (await page.getByLabel(lijst).locator('visible=true').first().boundingBox())!;
  const el = page.getByText(tekst, { exact: true }).locator('visible=true').first();
  await expect.poll(async () => { const b = (await el.boundingBox())!; return Math.round(b.y - (onder.y + onder.height)); }).toBeLessThanOrEqual(40);
});

/** De link staat helemaal in beeld, met de onderkant in het onderste stukje van het scherm (de pagina schoof net genoeg). */
Then('staat de link {string} onderaan in beeld', async ({ page }, naam: string) => {
  const link = page.getByRole('link', { name: naam }).locator('visible=true').first();
  const hoogte = page.viewportSize()!.height;
  await expect.poll(async () => { const b = (await link.boundingBox())!; return b.y >= 0 && b.y + b.height <= hoogte && b.y + b.height > hoogte - 60; }).toBe(true);
});
/** De link staat in beeld en niet onder de vaste kop: het midden van de link is wat je daar ziet. */
Then('staat de link {string} helemaal in beeld', async ({ page }, naam: string) => {
  const link = page.getByRole('link', { name: naam }).locator('visible=true').first();
  await expect.poll(() => link.evaluate((a) => {
    const r = a.getBoundingClientRect();
    const op = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
    return r.top >= 0 && r.bottom <= innerHeight && !!op && a.contains(op);
  })).toBe(true);
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

Then('is het onderdeel {string} dicht', async ({ page }, tekst: string) => {
  await expect(page.locator('details', { has: page.locator('summary', { hasText: tekst }) }).locator('visible=true').first()).not.toHaveAttribute('open', '');
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
