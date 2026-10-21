/**
 * Verdieping "Wie heeft het gezag?" (?gezag=samen|ik|ander|onbekend, of van een eerder bezoek): bij "Wij zijn uit elkaar", en bij
 * "Ik wil hulp aanvragen" (blok gezag-beginnen, ingeklapt; open met de situatie Scheiding of een antwoord). Eén antwoord voor beide blokken.
 * Bij "Weet ik niet" twee vervolgvragen (?getrouwd=ja|nee&erkend=ander|ik|2023|onbekend): de uitkomst zegt welk gezag waarschijnlijk
 * geldt, en de stappen volgen die uitkomst (gezagUitkomst in src/lib/verdiepingen.ts).
 */
import { KIES_ZIN_BIJ, gezagUitkomst } from '../../lib/verdiepingen';
import { keuze, params, zetInUrl } from './gedeeld';

const GZ_KEY = 'jr.gezag';
const WEG_KEY = 'jr.gezagweg';

export const gescheiden = (opnieuw: () => void) => {
  const blokken = Array.from(document.querySelectorAll<HTMLElement>('[data-verdieping="gescheiden"], [data-verdieping="gezag-beginnen"]'));
  const keuzes = (b: HTMLElement) => Array.from(b.querySelectorAll<HTMLButtonElement>('[data-gezag-keuze]'));
  let gezag = params.get('gezag') ?? localStorage.getItem(GZ_KEY) ?? '';
  if (!blokken.length || !keuzes(blokken[0]).some((g) => g.value === gezag)) gezag = '';
  // De vervolgvragen bij "Weet ik niet"; bij een ander antwoord gelden ze niet.
  const bewaard = (() => { try { return JSON.parse(localStorage.getItem(WEG_KEY) ?? '{}'); } catch { return {}; } })();
  let getrouwd: string = params.get('getrouwd') ?? bewaard.getrouwd ?? '';
  let erkend: string = params.get('erkend') ?? bewaard.erkend ?? '';
  if (gezag !== 'onbekend' || !['ja', 'nee'].includes(getrouwd)) getrouwd = '';
  if (getrouwd !== 'nee') erkend = '';
  /** Is de vraag af? Bij "Weet ik niet" pas na de vervolgvragen; dan klapt het blok in. */
  const klaar = () => gezag !== '' && (gezag !== 'onbekend' || getrouwd === 'ja' || erkend !== '');
  const gewijzigd = () => {
    if (gezag) localStorage.setItem(GZ_KEY, gezag); else localStorage.removeItem(GZ_KEY);
    if (getrouwd) localStorage.setItem(WEG_KEY, JSON.stringify({ getrouwd, erkend })); else localStorage.removeItem(WEG_KEY);
    zetInUrl({ gezag, getrouwd, erkend });
    opnieuw();
  };
  const klapIn = () => blokken.forEach((b) => { if (klaar()) b.setAttribute('data-vd-ingeklapt', ''); });
  blokken.forEach((gzBlok) => {
    // Eén keuze; nog eens klikken haalt hem weg. Na een keuze inklappen, zodat de stappen hoger in beeld komen (zoals bij "De hulp stopt");
    // bij "Weet ik niet" pas na de vervolgvragen.
    keuzes(gzBlok).forEach((g) => g.addEventListener('click', () => {
      gezag = gezag === g.value ? '' : g.value;
      getrouwd = ''; erkend = '';
      klapIn();
      gewijzigd();
    }));
    gzBlok.querySelectorAll<HTMLButtonElement>('[data-gz-getrouwd]').forEach((b) => b.addEventListener('click', () => {
      getrouwd = getrouwd === b.value ? '' : b.value;
      erkend = '';
      klapIn();
      gewijzigd();
    }));
    gzBlok.querySelectorAll<HTMLButtonElement>('[data-gz-erkend]').forEach((b) => b.addEventListener('click', () => {
      erkend = erkend === b.value ? '' : b.value;
      klapIn();
      gewijzigd();
    }));
    if (klaar()) gzBlok.setAttribute('data-vd-ingeklapt', '');
    gzBlok.querySelector('[data-vd-wissen]')?.addEventListener('click', () => {
      gezag = ''; getrouwd = ''; erkend = '';
      blokken.forEach((b) => b.removeAttribute('data-vd-ingeklapt'));
      gewijzigd();
    });
  });
  let plek: Text | undefined;
  /** Welke stappen bij het gezag horen (zie GEZAG_STAP in src/lib/verdiepingen.ts), en wie bij KIES toestemming geeft. */
  const teken = () => {
    // Bij "Weet ik niet" met een uitkomst gelden de stappen van het waarschijnlijke gezag.
    const uitkomst = gezag === 'onbekend' ? gezagUitkomst(getrouwd, erkend) : undefined;
    const eff = uitkomst?.gezag ?? gezag;
    const alleen = eff === 'ik' || eff === 'ander';
    // Bij hulp aanvragen alleen met de situatie Scheiding.
    const scheiding = keuze.sel.includes('scheiding');
    blokken.forEach((gzBlok) => {
      keuzes(gzBlok).forEach((g) => g.setAttribute('aria-pressed', String(g.value === gezag)));
      const sv = gzBlok.querySelector<HTMLElement>('[data-vd-samenvatting]');
      // De samenvatting herhaalt alleen de keuze: alleen ingeklapt zichtbaar (zie CSS).
      if (sv) { sv.textContent = uitkomst?.samenvatting ?? keuzes(gzBlok).find((g) => g.value === gezag)?.dataset.samenvatting ?? ''; sv.setAttribute('data-alleen-ingeklapt', ''); }
      gzBlok.querySelector<HTMLElement>('[data-gz-getrouwd-vraag]')!.hidden = gezag !== 'onbekend';
      gzBlok.querySelector<HTMLElement>('[data-gz-erkend-vraag]')!.hidden = gezag !== 'onbekend' || getrouwd !== 'nee';
      gzBlok.querySelectorAll<HTMLButtonElement>('[data-gz-getrouwd]').forEach((b) => b.setAttribute('aria-pressed', String(b.value === getrouwd)));
      gzBlok.querySelectorAll<HTMLButtonElement>('[data-gz-erkend]').forEach((b) => b.setAttribute('aria-pressed', String(b.value === erkend)));
      const uk = gzBlok.querySelector<HTMLElement>('[data-gz-uitkomst]')!;
      uk.hidden = !uitkomst;
      uk.querySelector('[data-gz-uitkomst-tekst]')!.textContent = uitkomst?.uitleg ?? '';
      gzBlok.querySelector<HTMLElement>('[data-vd-wissen]')!.hidden = !gezag;
      gzBlok.querySelector<HTMLElement>('[data-vd-gevolg]')!.hidden = !gezag;
      if (!gezag) gzBlok.removeAttribute('data-vd-ingeklapt');
    });
    // Welke stappen bij het gezag horen (zie GEZAG_STAP in src/lib/verdiepingen.ts). Gezamenlijk gezag geldt bij "Wij zijn uit elkaar"
    // ook zonder antwoord en bij "Weet ik niet"; de andere stappen alleen bij hun eigen keuze. Bij hulp aanvragen staat zonder antwoord
    // niets extra (de pagina blijft gelijk).
    document.querySelectorAll<HTMLElement>('[data-knelpunt-blok] [data-gezag]').forEach((e) => {
      const li = e.closest('li')!;
      const g = e.dataset.gezag;
      const past = g === 'samen' ? !alleen : g === eff;
      li.hidden = !past || (li.hasAttribute('data-gezag-bij-aanvraag') && !gezag);
    });
    // Bij hulp aanvragen: de ingeklapte gezagsvraag open met de situatie Scheiding of een antwoord. Alleen openen, nooit dichtdoen:
    // wat de ouder zelf openklapte, blijft open.
    const inklap = document.querySelector<HTMLDetailsElement>('[data-gezag-inklap]');
    if (inklap && (scheiding || gezag)) inklap.open = true;
    const blok = document.querySelector<HTMLElement>('[data-knelpunt-blok="gescheiden"]');
    // Bij "Weet ik niet" komt de uitleg over het gezag direct na stap 1, vóór de tips (persona-test Linda, ronde 24), zoals bij hulp
    // aanvragen. Anders staat de stap weer op zijn eigen plek; een lege tekstknoop houdt die plek vast.
    const onbekend = blok?.querySelector<HTMLElement>('[data-gezag="onbekend"]')?.closest('li');
    const rest = blok?.querySelector<HTMLOListElement>('ol[data-aanvraag-stappen]');
    if (onbekend && rest) {
      plek ??= onbekend.parentNode!.insertBefore(document.createTextNode(''), onbekend);
      if (eff === 'onbekend') rest.prepend(onbekend);
      else plek.parentNode!.insertBefore(onbekend, plek);
    }
    blok?.querySelectorAll<HTMLElement>('[data-gezag-lead]').forEach((e) => (e.hidden = alleen));
    blok?.querySelectorAll<HTMLElement>('[data-kies-zin]').forEach((e) => (e.textContent = KIES_ZIN_BIJ[eff] ?? e.dataset.kiesZin!));
  };
  return { teken };
};
