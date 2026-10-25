/**
 * Terugknop ([data-terug]) op therapievorm-, brief- en hulpsoortpagina's: terug naar de pagina waar de bezoeker vandaan kwam.
 * - Van Mijn overzicht: terug naar precies die pagina (met de keuzes in de URL), bij data-anchor-overzicht.
 * - Van een situatiepagina: terug naar die situatie, bij data-anchor.
 * - Van een andere pagina op de site: "Terug naar de vorige pagina".
 * - Van buiten de site: naar de eerst gekozen situatie die bij deze pagina hoort (data-situaties), tenzij data-alleen-herkomst;
 *   anders blijft de standaardlink staan.
 */
import { base } from '../site';
import { OPSLAG, leesLijst } from './opslag';

export function zetTerugLink() {
  const a = document.querySelector<HTMLAnchorElement>('[data-terug]');
  if (!a) return;
  const opties = (a.dataset.situaties ?? '')
    .split(';')
    .filter(Boolean)
    .map((x) => x.split('|'));
  let van: URL | undefined;
  try {
    van = document.referrer ? new URL(document.referrer) : undefined;
  } catch {
    van = undefined;
  }
  if (van && van.origin === location.origin && van.pathname !== location.pathname) {
    const pad = van.pathname.slice(base.length);
    if (pad.startsWith('/overzicht')) {
      a.href = `${van.pathname}${van.search}${a.dataset.anchorOverzicht ?? ''}`;
      a.textContent = '← Terug naar Mijn overzicht';
      return;
    }
    const sit = pad.match(/^\/situaties\/([^/]+)\/?$/)?.[1];
    const titel = sit && opties.find(([id]) => id === sit)?.[1];
    if (sit) {
      a.href = `${van.pathname}${a.dataset.anchor ?? ''}`;
      a.textContent = titel ? `← Terug naar ${titel}` : '← Terug naar de situatie';
      return;
    }
    a.href = `${van.pathname}${van.search}${van.hash}`;
    a.textContent = '← Terug naar de vorige pagina';
    return;
  }
  if (a.hasAttribute('data-alleen-herkomst')) return;
  const gekozen = leesLijst(OPSLAG.situaties);
  const hit = opties.find(([id]) => gekozen.includes(id)) ?? (opties.length === 1 ? opties[0] : undefined);
  if (hit) {
    a.href = a.href.replace(/\/situaties\/.*$/, `/situaties/${hit[0]}/${a.dataset.anchor}`);
    a.textContent = `← Terug naar ${hit[1]}`;
  }
}
