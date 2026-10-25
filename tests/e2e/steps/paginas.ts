/**
 * Stappen voor pagina's en onderdelen: bewaarde keuzes, koppen, links en knoppen, het menu, inklapbare onderdelen,
 * snelkoppelingen en de opmaak van genummerde stappen. Koppen kunnen zachte afbreekstreepjes bevatten (lib/afbreken.ts);
 * die worden bij het vergelijken weggelaten.
 */
import { expect, type Page } from '@playwright/test';
import type { DataTable } from 'playwright-bdd';
import { Given, When, Then } from './fixtures';
import { regex } from './algemeen';
import { gemeenteSlug, situatieId, vraagId, leeftijdId } from './inhoud';

/** Zichtbare koppen, zonder sectienummer (span.section-num, zoals "1" of "→") en zonder zachte afbreekstreepjes. */
const koppen = (page: Page, niveau?: number) =>
  page.locator(niveau ? `h${niveau}` : 'h1, h2, h3, h4').evaluateAll((hs) =>
    hs
      .filter((h) => (h as HTMLElement).offsetParent !== null)
      .map((h) => {
        const c = h.cloneNode(true) as HTMLElement;
        c.querySelectorAll('.section-num').forEach((n) => n.remove());
        return (c.textContent ?? '')
          .replace(/\u00ad/g, '')
          .replace(/\s+/g, ' ')
          .trim();
      }),
  );

// ---------- bewaarde keuzes ----------
Given('ik heb eerder gekozen voor de gemeente {string}', async ({ page }, gemeente: string) => {
  await page.goto('./');
  await page.evaluate((g) => localStorage.setItem('jr.gemeente', g), gemeenteSlug(gemeente));
});
Given('ik heb eerder de situatie {string} gekozen', async ({ page }, situatie: string) => {
  await page.goto('./');
  await page.evaluate((s) => localStorage.setItem('jr.situaties', s), situatieId(situatie));
});

Given('ik heb eerder de vraag {string} gekozen met leeftijd {string}', async ({ page }, vraag: string, leeftijd: string) => {
  await page.goto('./');
  await page.evaluate(
    ([k, l]) => {
      localStorage.setItem('jr.knelpunt', k);
      localStorage.setItem('jr.leeftijd', l);
    },
    [vraagId(vraag), leeftijdId(leeftijd)],
  );
});

// ---------- koppen, titels, secties ----------
Then('is de hoofdkop {string}', async ({ page }, tekst: string) => {
  await expect.poll(async () => (await koppen(page, 1))[0]).toBe(tekst);
});
Then('zie ik de kop {string}', async ({ page }, tekst: string) => {
  await expect.poll(async () => ((await koppen(page)).some((k) => k === tekst || k.startsWith(tekst)) ? 'ja' : (await koppen(page)).join(' | '))).toBe('ja');
});
Then('zie ik de kop {string} niet', async ({ page }, tekst: string) => {
  await expect.poll(async () => (await koppen(page)).some((k) => k === tekst || k.startsWith(tekst))).toBe(false);
});
Then('heeft de pagina de titel {string}', async ({ page }, titel: string) => {
  await expect(page).toHaveTitle(titel);
});
Then('zie ik de koppen:', async ({ page }, tabel: DataTable) => {
  const echt = await koppen(page);
  for (const [k] of tabel.raw())
    expect(
      echt.some((x) => x === k || x.startsWith(k)),
      `kop "${k}" in ${echt.join(' | ')}`,
    ).toBe(true);
});

// ---------- links en knoppen ----------
Then('gaat de link {string} naar {string}', async ({ page }, naam: string, doel: string) => {
  const link = page.getByRole('link', { name: naam }).locator('visible=true').first();
  await expect(link).toHaveAttribute('href', new RegExp(regex(doel)));
});
// Het menu heeft ook een link "Hulpmiddelen"; deze stap kijkt alleen in het bovenste blok van de voorpagina.
Then('gaat de link {string} in de hero naar {string}', async ({ page }, naam: string, doel: string) => {
  const link = page.locator('.hero').getByRole('link', { name: naam, exact: true }).locator('visible=true').first();
  await expect(link).toHaveAttribute('href', new RegExp(`${regex(doel)}$`));
});
When('ik met de muis op de link {string} ga', async ({ page }, naam: string) => {
  await page.getByRole('link', { name: naam }).locator('visible=true').first().hover();
});
Then('is de tekst van de link {string} wit', async ({ page }, naam: string) => {
  await expect
    .poll(() =>
      page
        .getByRole('link', { name: naam })
        .locator('visible=true')
        .first()
        .evaluate((a) => getComputedStyle(a).color),
    )
    .toBe('rgb(255, 255, 255)');
});
Then('zie ik een belknop', async ({ page }) => {
  await expect(page.locator('a.btn.bel[href^="tel:"], a[href^="tel:"].btn').locator('visible=true').first()).toBeVisible();
});
Then('zie ik een link om {string} te bellen', async ({ page }, nummer: string) => {
  await expect(
    page
      .locator(`a[href="tel:${nummer.replace(/\s/g, '')}"]`)
      .locator('visible=true')
      .first(),
  ).toBeVisible();
});
Then('zie ik de knop {string}', async ({ page }, naam: string) => {
  await expect(page.getByRole('button', { name: naam }).locator('visible=true').first()).toBeVisible();
});
Then('zie ik de knop {string} niet', async ({ page }, naam: string) => {
  await expect(page.getByRole('button', { name: naam }).locator('visible=true')).toHaveCount(0);
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

// ---------- inklapbare onderdelen ----------
When('ik het onderdeel {string} open', async ({ page }, tekst: string) => {
  await page.locator('summary', { hasText: tekst }).locator('visible=true').first().click();
});
Then('staat het onderdeel {string} open', async ({ page }, tekst: string) => {
  await expect(page.locator('details', { has: page.locator('summary', { hasText: tekst }) }).first()).toHaveAttribute('open', '');
});

Then('is het onderdeel {string} dicht', async ({ page }, tekst: string) => {
  await expect(
    page
      .locator('details', { has: page.locator('summary', { hasText: tekst }) })
      .locator('visible=true')
      .first(),
  ).not.toHaveAttribute('open', '');
});

// Opmaak van genummerde stappen (Mijn overzicht): lijn tussen de stappen, geen verbindingslijn, geen lijn tussen vervolgstappen.
const stapStijl = (page: Page, selector: string) =>
  page
    .locator(selector)
    .evaluateAll((lis) =>
      lis
        .filter((li) => (li as HTMLElement).offsetParent !== null)
        .map((li) => ({ boven: getComputedStyle(li).borderTopStyle, lijn: getComputedStyle(li, '::after').content })),
    );

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

/** Tegels in de lijst met gemeenten: geen "Bijgewerkt …" (de voettekst noemt "bijgewerkt" wel, daarom alleen de tegels). */
Then('noemen de tegels van de gemeenten geen datum', async ({ page }) => {
  await expect(page.locator('a.card.link').first()).toBeVisible();
  await expect(page.locator('a.card.link', { hasText: 'Bijgewerkt' })).toHaveCount(0);
});

/** Een kaart is één grote link (kop, tekst en pijl); de naam van de link is de hele kaart, daarom op de kop. */
When('ik de kaart {string} open', async ({ page }, kop: string) => {
  await page
    .locator('a.card', { has: page.locator('h3', { hasText: kop }) })
    .locator('visible=true')
    .first()
    .click();
});

/** Snelkoppelingen bovenaan een pagina (nav.toc, "Snel naar"). */
Then('staat bovenaan de snelkoppeling {string} naar {string}', async ({ page }, naam: string, anker: string) => {
  const link = page.locator('nav.toc').getByRole('link', { name: naam, exact: true });
  await expect(link).toBeVisible();
  await expect(link).toHaveAttribute('href', new RegExp(`${anker}$`));
});
/** Zoals "gaat de link … naar …", maar alleen een link met precies deze tekst ("Trauma", niet "Traumagerichte therapie"). */
Then('gaat de link met precies de tekst {string} naar {string}', async ({ page }, naam: string, doel: string) => {
  const link = page.getByRole('link', { name: naam, exact: true }).locator('visible=true').first();
  // Het adres waar de link echt naartoe gaat (ook bij een relatief adres als "../trauma/").
  expect(await link.evaluate((a) => (a as HTMLAnchorElement).href)).toMatch(new RegExp(`${regex(doel)}$`));
});
/** Elke kop van dit niveau in de inhoud heeft een id (anker); de zoekfunctie (Pagefind) linkt alleen naar koppen met een anker. */
Then('heeft elke kop {word} in de inhoud een anker', async ({ page }, kop: string) => {
  const zonder = await page
    .locator(`main ${kop}`)
    .evaluateAll((hs) => hs.filter((h) => !h.id && !h.closest('[data-pagefind-ignore]')).map((h) => h.textContent?.trim()));
  expect(zonder, 'koppen zonder anker').toEqual([]);
});
/** Snelkoppelingen naar een plek op de pagina (inhoudsopgave, zijnavigatie) wijzen naar een kop, niet naar een blok (behalve blokken buiten de zoekindex). */
Then('wijzen de snelkoppelingen op de pagina naar koppen', async ({ page }) => {
  const fout = await page.locator('nav a[href^="#"]').evaluateAll((as) =>
    as
      .map((a) => a.getAttribute('href')!.slice(1))
      .filter((id) => {
        const doel = document.getElementById(id);
        // Blokken die niet in de zoekindex staan (zoals de bronnen) mogen een anker op het blok houden.
        return id && !!doel && !/^H[1-6]$/.test(doel.tagName) && !doel.closest('[data-pagefind-ignore]');
      }),
  );
  expect(fout, 'snelkoppelingen naar een blok').toEqual([]);
});

Given('het scherm is {int} pixels breed', async ({ page }, breedte: number) => {
  await page.setViewportSize({ width: breedte, height: 700 });
});

const knopEnVergrootglas = async (page: Page, naam: string) => ({
  knop: (await page.locator('.site-header').getByRole('button', { name: naam, exact: true }).boundingBox())!,
  zoek: (await page.locator('.site-header [data-zoek-knop]').boundingBox())!,
  breedte: page.viewportSize()!.width,
});

Then('staat de knop {string} links naast het vergrootglas', async ({ page }, naam: string) => {
  const { knop, zoek, breedte } = await knopEnVergrootglas(page, naam);
  expect(Math.abs(knop.y + knop.height / 2 - (zoek.y + zoek.height / 2))).toBeLessThan(4);
  expect(knop.x + knop.width).toBeLessThan(zoek.x + 1);
  // Het vergrootglas staat rechts, vlak bij de rand (binnen de marge van de kop).
  expect(breedte - (zoek.x + zoek.width)).toBeLessThan(28);
});

Then('staat de knop {string} rechts onder het vergrootglas', async ({ page }, naam: string) => {
  const { knop, zoek, breedte } = await knopEnVergrootglas(page, naam);
  expect(knop.y).toBeGreaterThan(zoek.y + zoek.height - 1);
  expect(breedte - (knop.x + knop.width)).toBeLessThan(28);
  expect(breedte - (zoek.x + zoek.width)).toBeLessThan(28);
});

/** De lead onder de hoofdkop van een situatie: tel de zinnen (een punt, vraagteken of uitroepteken aan het eind van een woord). */
Then('heeft de inleiding onder de hoofdkop hooguit {int} zinnen', async ({ page }, max: number) => {
  const tekst = (await page.locator('.page-head .lead').innerText()).trim();
  const zinnen = tekst.split(/(?<=[.!?])\s+/).filter(Boolean);
  expect(zinnen.length, tekst).toBeLessThanOrEqual(max);
});
Then('staat onder {string} vóór de routes {string}', async ({ page }, kop: string, tekst: string) => {
  const sectie = page.locator('section', { has: page.getByRole('heading', { name: kop }) });
  const inleiding = sectie.locator('[data-route-inleiding]');
  await expect(inleiding).toContainText(tekst);
  const voorRoute = await inleiding.evaluate((el) => {
    const route = el.parentElement!.querySelector('.route');
    return !!route && !!(el.compareDocumentPosition(route) & Node.DOCUMENT_POSITION_FOLLOWING);
  });
  expect(voorRoute).toBe(true);
});

/** Op de pagina Situaties: een groep is een section met een kop en daaronder de tegels. */
const groep = (page: Page, kop: string) => page.locator('section', { has: page.getByRole('heading', { level: 2, name: kop, exact: true }) });
Then('staat de tegel {string} onder de kop {string}', async ({ page }, tegel: string, kop: string) => {
  await expect(groep(page, kop).getByRole('heading', { level: 3, name: tegel, exact: true })).toBeVisible();
});
Then('staat onder de kop {string} eerst de tegel {string}', async ({ page }, kop: string, tegel: string) => {
  await expect(groep(page, kop).getByRole('heading', { level: 3 }).first()).toHaveText(tegel);
});
