/**
 * Verdieping "Wie heeft het gezag?" (?gezag=samen|ik|ander|onbekend, of van een eerder bezoek): bij "Wij zijn uit elkaar", en bij
 * "Ik wil hulp aanvragen" (blok gezag-beginnen, ingeklapt; open met de situatie Scheiding of een antwoord). Eén antwoord voor beide blokken.
 * Bij "Weet ik niet" twee vervolgvragen (?getrouwd=ja|nee&erkend=ander|ik|2023|onbekend): de uitkomst zegt welk gezag waarschijnlijk
 * geldt, en de stappen volgen die uitkomst (gezagUitkomst in src/lib/verdiepingen.ts).
 */
import { KIES_ZIN_BIJ, gezagUitkomst } from '../../lib/verdiepingen';
import { keuze, params, zetInUrl } from './gedeeld';
import { OPSLAG, lees, leesJson, bewaar, bewaarJson } from '../../lib/opslag';
import { verdieping, zetGedrukt, wissel } from './verdieping';

const GZ_KEY = OPSLAG.gezag;
const WEG_KEY = OPSLAG.gezagWeg;

export const gescheiden = (opnieuw: () => void) => {
  // Twee blokken met dezelfde vraag, met één antwoord.
  const blokken = ['gescheiden', 'gezag-beginnen'].map((id) => verdieping(id)).filter((vd) => vd.blok);
  const keuzes = (vd: (typeof blokken)[number]) => vd.knoppen('[data-gezag-keuze]');
  let gezag = params.get('gezag') ?? lees(GZ_KEY);
  if (!blokken.length || !keuzes(blokken[0]).some((g) => g.value === gezag)) gezag = '';
  // De vervolgvragen bij "Weet ik niet"; bij een ander antwoord gelden ze niet.
  const bewaard = leesJson(WEG_KEY);
  let getrouwd: string = params.get('getrouwd') ?? bewaard.getrouwd ?? '';
  let erkend: string = params.get('erkend') ?? bewaard.erkend ?? '';
  if (gezag !== 'onbekend' || !['ja', 'nee'].includes(getrouwd)) getrouwd = '';
  if (getrouwd !== 'nee') erkend = '';
  /** Is de vraag af? Bij "Weet ik niet" pas na de vervolgvragen; dan klapt het blok in. */
  const klaar = () => gezag !== '' && (gezag !== 'onbekend' || getrouwd === 'ja' || erkend !== '');
  const gewijzigd = () => {
    bewaar(GZ_KEY, gezag);
    bewaarJson(WEG_KEY, getrouwd ? { getrouwd, erkend } : null);
    zetInUrl({ gezag, getrouwd, erkend });
    opnieuw();
  };
  const klapIn = () =>
    blokken.forEach((vd) => {
      if (klaar()) vd.klapIn();
    });
  blokken.forEach((vd) => {
    // Eén keuze; nog eens klikken haalt hem weg. Na een keuze inklappen, zodat de stappen hoger in beeld komen (zoals bij "De hulp stopt");
    // bij "Weet ik niet" pas na de vervolgvragen.
    keuzes(vd).forEach((g) =>
      g.addEventListener('click', () => {
        gezag = wissel(gezag, g.value);
        getrouwd = '';
        erkend = '';
        klapIn();
        gewijzigd();
      }),
    );
    vd.knoppen('[data-gz-getrouwd]').forEach((b) =>
      b.addEventListener('click', () => {
        getrouwd = wissel(getrouwd, b.value);
        erkend = '';
        klapIn();
        gewijzigd();
      }),
    );
    vd.knoppen('[data-gz-erkend]').forEach((b) =>
      b.addEventListener('click', () => {
        erkend = wissel(erkend, b.value);
        klapIn();
        gewijzigd();
      }),
    );
    if (klaar()) vd.klapIn();
    // Wissen in het ene blok wist ook het andere (één antwoord).
    vd.bijWissen(() => {
      gezag = '';
      getrouwd = '';
      erkend = '';
      blokken.forEach((x) => x.klapUit());
    }, gewijzigd);
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
    blokken.forEach((vd) => {
      const gzBlok = vd.blok!;
      zetGedrukt(keuzes(vd), (g) => g.value === gezag);
      // De samenvatting herhaalt alleen de keuze: alleen ingeklapt zichtbaar (zie CSS).
      vd.stand({
        samenvatting: uitkomst?.samenvatting ?? keuzes(vd).find((g) => g.value === gezag)?.dataset.samenvatting ?? '',
        ingevuld: !!gezag,
        alleenIngeklapt: true,
      });
      gzBlok.querySelector<HTMLElement>('[data-gz-getrouwd-vraag]')!.hidden = gezag !== 'onbekend';
      gzBlok.querySelector<HTMLElement>('[data-gz-erkend-vraag]')!.hidden = gezag !== 'onbekend' || getrouwd !== 'nee';
      zetGedrukt(vd.knoppen('[data-gz-getrouwd]'), (b) => b.value === getrouwd);
      zetGedrukt(vd.knoppen('[data-gz-erkend]'), (b) => b.value === erkend);
      const uk = gzBlok.querySelector<HTMLElement>('[data-gz-uitkomst]')!;
      uk.hidden = !uitkomst;
      uk.querySelector('[data-gz-uitkomst-tekst]')!.textContent = uitkomst?.uitleg ?? '';
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
