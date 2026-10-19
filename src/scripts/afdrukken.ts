/**
 * Afdrukken of bewaren als PDF, op elke pagina met de knop (components/AfdrukKnop.astro). De opmaak voor papier staat in
 * global.css (@media print); hier de knop, de regel bovenaan met datum en adres (components/AfdrukKop.astro), en het adres bij
 * elke link naar een andere site (data-adres, getoond via CSS; bij een link "Website" in plaats van het pijltje).
 * Werkt ook bij Ctrl+P of het menu van de browser: alles staat al klaar na het laden.
 */
import { kortAdres } from '../lib/afdrukken';

const q = (s: string) => Array.from(document.querySelectorAll<HTMLElement>(s));
const datum = () => q('[data-afdruk-datum]').forEach((e) => (e.textContent = new Date().toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })));

/** Datum, adres van de pagina en de adressen bij links. Mijn overzicht roept dit na elke keer tekenen opnieuw aan, met het
 *  adres inclusief de keuzes (scripts/overzicht/afdrukken.ts); de blokken van de gemeente komen daar pas later binnen. */
export const bijwerken = (adres = location.href.split('#')[0]) => {
  datum();
  q('[data-afdruk-adres]').forEach((e) => (e.textContent = adres));
  q('a[href^="http"]').forEach((a) => {
    const href = (a as HTMLAnchorElement).href;
    if (new URL(href).origin === location.origin) return;
    a.dataset.adres = kortAdres(href);
    if (/^website/i.test(a.textContent ?? '')) a.dataset.website = '';
  });
};

q('[data-afdrukken]').forEach((b) => b.addEventListener('click', () => window.print()));
// Vlak voor het afdrukken: de datum opnieuw (staat de pagina een nacht open, dan klopt hij toch) en blokken die op papier altijd
// open horen (data-op-papier-open) openklappen. CSS kan een dichte <details> niet in elke browser openen. Daarna weer dicht.
const dichtGeklapt: HTMLDetailsElement[] = [];
window.addEventListener('beforeprint', () => {
  datum();
  q('details[data-op-papier-open]').forEach((d) => {
    if ((d as HTMLDetailsElement).open) return;
    (d as HTMLDetailsElement).open = true;
    dichtGeklapt.push(d as HTMLDetailsElement);
  });
});
window.addEventListener('afterprint', () => dichtGeklapt.splice(0).forEach((d) => (d.open = false)));
bijwerken();
