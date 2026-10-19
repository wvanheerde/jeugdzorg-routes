/**
 * Verdieping "Wie heeft het gezag?" (?gezag=samen|ik|ander|onbekend, of van een eerder bezoek): bij "Wij zijn uit elkaar", en bij
 * "Ik wil hulp aanvragen" als de situatie Scheiding gekozen is (blok gezag-beginnen). Eén antwoord voor beide blokken.
 */
import { KIES_ZIN_BIJ } from '../../lib/verdiepingen';
import { keuze, params, zetInUrl } from './gedeeld';

const GZ_KEY = 'jr.gezag';

export const gescheiden = (opnieuw: () => void) => {
  const blokken = Array.from(document.querySelectorAll<HTMLElement>('[data-verdieping="gescheiden"], [data-verdieping="gezag-beginnen"]'));
  const keuzes = (b: HTMLElement) => Array.from(b.querySelectorAll<HTMLButtonElement>('[data-gezag-keuze]'));
  let gezag = params.get('gezag') ?? localStorage.getItem(GZ_KEY) ?? '';
  if (!blokken.length || !keuzes(blokken[0]).some((g) => g.value === gezag)) gezag = '';
  const gewijzigd = () => {
    if (gezag) localStorage.setItem(GZ_KEY, gezag); else localStorage.removeItem(GZ_KEY);
    zetInUrl({ gezag });
    opnieuw();
  };
  blokken.forEach((gzBlok) => {
    // Eén keuze; nog eens klikken haalt hem weg. Na een keuze inklappen, zodat de stappen hoger in beeld komen (zoals bij "De hulp stopt").
    keuzes(gzBlok).forEach((g) => g.addEventListener('click', () => {
      gezag = gezag === g.value ? '' : g.value;
      if (gezag) gzBlok.setAttribute('data-vd-ingeklapt', '');
      gewijzigd();
    }));
    if (gezag) gzBlok.setAttribute('data-vd-ingeklapt', '');
    gzBlok.querySelector('[data-vd-wissen]')?.addEventListener('click', () => {
      gezag = '';
      gzBlok.removeAttribute('data-vd-ingeklapt');
      gewijzigd();
    });
  });
  /** Welke stappen bij het gezag horen (zie GEZAG_STAP in src/lib/verdiepingen.ts), en wie bij KIES toestemming geeft. */
  const teken = () => {
    const alleen = gezag === 'ik' || gezag === 'ander';
    // Bij hulp aanvragen alleen met de situatie Scheiding.
    const scheiding = keuze.sel.includes('scheiding');
    blokken.forEach((gzBlok) => {
      if (gzBlok.dataset.verdieping === 'gezag-beginnen') gzBlok.hidden = !scheiding;
      keuzes(gzBlok).forEach((g) => g.setAttribute('aria-pressed', String(g.value === gezag)));
      const sv = gzBlok.querySelector<HTMLElement>('[data-vd-samenvatting]');
      // De samenvatting herhaalt alleen de keuze: alleen ingeklapt zichtbaar (zie CSS).
      if (sv) { sv.textContent = keuzes(gzBlok).find((g) => g.value === gezag)?.dataset.samenvatting ?? ''; sv.setAttribute('data-alleen-ingeklapt', ''); }
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
      const past = g === 'samen' ? !alleen : g === gezag;
      li.hidden = !past || (li.hasAttribute('data-gezag-bij-aanvraag') && (!gezag || !scheiding));
    });
    const blok = document.querySelector<HTMLElement>('[data-knelpunt-blok="gescheiden"]');
    blok?.querySelectorAll<HTMLElement>('[data-gezag-lead]').forEach((e) => (e.hidden = alleen));
    blok?.querySelectorAll<HTMLElement>('[data-kies-zin]').forEach((e) => (e.textContent = KIES_ZIN_BIJ[gezag] ?? e.dataset.kiesZin!));
  };
  return { teken };
};
