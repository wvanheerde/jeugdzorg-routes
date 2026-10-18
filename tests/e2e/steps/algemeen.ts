/** Algemene stappen: datum, pagina's openen, kiezen, typen, tekst en url controleren. */
import { expect, type Page } from '@playwright/test';
import { Given, When, Then } from './fixtures';
import { vraagId, situatieId, gemeenteSlug, leeftijdId } from './inhoud';

const MAANDEN = ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'];
/** "18 oktober 2026" → Date (10.00 uur, Nederlandse tijd). */
export const leesNlDatum = (s: string) => {
  const m = /^(\d{1,2}) (\w+) (\d{4})$/.exec(s.trim());
  if (!m || !MAANDEN.includes(m[2])) throw new Error(`Schrijf de datum als "18 oktober 2026", niet "${s}"`);
  return new Date(+m[3], MAANDEN.indexOf(m[2]), +m[1], 10);
};

// "Gegeven het is 18 oktober 2026" (zonder aanhalingstekens, zoals je het zegt).
Given('het is {int} {word} {int}', async ({ page }, dag: number, maand: string, jaar: number) => {
  await page.clock.setFixedTime(leesNlDatum(`${dag} ${maand} ${jaar}`));
});

Given('ik open de voorpagina', async ({ page }) => {
  await page.goto('./');
});

Given('ik open de pagina {string}', async ({ page }, pad: string) => {
  await page.goto(pad.replace(/^\//, ''));
});

const openOverzicht = (page: Page, delen: Record<string, string | undefined>) => {
  const q = new URLSearchParams(Object.entries(delen).filter(([, v]) => v) as [string, string][]);
  return page.goto(`overzicht/?${q}`);
};
Given('ik open het overzicht voor {string} in {string}', async ({ page }, vraag: string, gemeente: string) => {
  await openOverzicht(page, { k: vraagId(vraag), gemeente: gemeenteSlug(gemeente) });
});
Given('ik open het overzicht voor {string} in {string} met de situatie {string}', async ({ page }, vraag: string, gemeente: string, situatie: string) => {
  await openOverzicht(page, { k: vraagId(vraag), gemeente: gemeenteSlug(gemeente), s: situatieId(situatie) });
});
Given('ik open het overzicht voor {string} in {string} met leeftijd {string}', async ({ page }, vraag: string, gemeente: string, leeftijd: string) => {
  await openOverzicht(page, { k: vraagId(vraag), gemeente: gemeenteSlug(gemeente), l: leeftijdId(leeftijd) });
});
Given('ik open het overzicht voor {string} in {string} met de situatie {string} en leeftijd {string}', async ({ page }, vraag: string, gemeente: string, situatie: string, leeftijd: string) => {
  await openOverzicht(page, { k: vraagId(vraag), gemeente: gemeenteSlug(gemeente), s: situatieId(situatie), l: leeftijdId(leeftijd) });
});

/** Zichtbare knop met precies deze naam (keuzeknoppen, "Aanpassen", "Wissen" …). Een aangezette keuzeknop heeft een vinkje
 *  ervoor (CSS ::before, telt mee in de toegankelijke naam): "✓ Begeleiding of dagbesteding". */
const regex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
export const knop = (page: Page, naam: string) => page.getByRole('button', { name: new RegExp(`^(✓ )?${regex(naam)}$`) }).locator('visible=true').first();

When('ik kies {string}', async ({ page }, naam: string) => {
  await knop(page, naam).click();
});

When('ik klik op {string}', async ({ page }, naam: string) => {
  await page.getByRole('link', { name: naam, exact: true }).or(page.getByRole('button', { name: naam, exact: true })).locator('visible=true').first().click();
});

When('ik {string} typ in {string}', async ({ page }, tekst: string, veld: string) => {
  const v = page.getByLabel(veld, { exact: true }).locator('visible=true').first();
  await v.click();
  await v.pressSequentially(tekst, { delay: 20 });
});

When('ik op {string} druk', async ({ page }, toets: string) => {
  const TOETS: Record<string, string> = { 'pijl omlaag': 'ArrowDown', 'pijl omhoog': 'ArrowUp', Enter: 'Enter', Escape: 'Escape', Tab: 'Tab' };
  await page.keyboard.press(TOETS[toets] ?? toets);
});

When('ik de pagina opnieuw open', async ({ page }) => {
  await page.goto(page.url());
});

/** Opnieuw openen zonder de antwoorden van de verdieping in de url: dan gelden de bewaarde antwoorden (localStorage). */
When('ik het overzicht later opnieuw open', async ({ page }) => {
  const u = new URL(page.url());
  for (const p of ['geboren', 'na18', 'naar', 'datum', 'reden']) u.searchParams.delete(p);
  await page.goto(u.toString());
});

Then('zie ik {string}', async ({ page }, tekst: string) => {
  await expect(page.getByText(tekst).locator('visible=true').first()).toBeVisible();
});

Then('zie ik {string} niet', async ({ page }, tekst: string) => {
  await expect(page.getByText(tekst).locator('visible=true')).toHaveCount(0);
});

Then('staat in de url {string}', async ({ page }, stuk: string) => {
  await expect.poll(() => decodeURIComponent(page.url())).toContain(stuk);
});

Then('staat in de url geen {string}', async ({ page }, stuk: string) => {
  await expect.poll(() => decodeURIComponent(page.url())).not.toContain(stuk);
});

Then('is de knop {string} aangezet', async ({ page }, naam: string) => {
  await expect(knop(page, naam)).toHaveAttribute('aria-pressed', 'true');
});

Then('is de knop {string} niet aangezet', async ({ page }, naam: string) => {
  await expect(knop(page, naam)).not.toHaveAttribute('aria-pressed', 'true');
});

Then('staat in {string} de tekst {string}', async ({ page }, veld: string, tekst: string) => {
  await expect(page.getByLabel(veld, { exact: true }).locator('visible=true').first()).toHaveValue(tekst);
});
