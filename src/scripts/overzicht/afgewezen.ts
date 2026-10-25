/**
 * Verdieping bij "Hulp is afgewezen of te weinig": wat de gemeente besloot (?besluit=afgewezen|past-niet), of het besluit op papier
 * staat (?papier=ja|nee) en, als het op papier staat, de datum erop (?besluitdatum=jjjj-mm-dd). Uit de URL of van een eerder bezoek.
 */
import { dagenTot, bezwaarTot, schrijf } from '../../lib/termijnen';
import { koppelDatumvelden } from '../../lib/datumveld';
import { params, zetInUrl, isoDatum, alsDatum, inVeld, datumKort } from './gedeeld';
import { OPSLAG, leesJson, bewaarJson } from '../../lib/opslag';
import { verdieping, zetGedrukt, wissel, leesVeld, markeer } from './verdieping';

const AF_KEY = OPSLAG.afgewezen;
/** Eigen vuistregel (geen bron): ligt de laatste dag binnen een week, dan "stuur nu". Een brief per post is soms dagen onderweg. */
const BIJNA_DAGEN = 7;

export const afgewezen = (opnieuw: () => void) => {
  const afBewaard = leesJson(AF_KEY);
  const vd = verdieping('afgewezen', { melding: '[data-af-melding]' });
  const afBlok = vd.blok;
  const besluitKeuzes = vd.knoppen('[data-af-besluit]');
  const papierKeuzes = vd.knoppen('[data-af-papier]');
  const afVeld = vd.el<HTMLInputElement>('[data-af-datum]');
  let datum = isoDatum(params.get('besluitdatum') ?? afBewaard.datum);
  let besluit: string = params.get('besluit') ?? afBewaard.besluit ?? '';
  if (!besluitKeuzes.some((b) => b.value === besluit)) besluit = '';
  // Een datum op het besluit betekent dat het besluit op papier staat.
  let papier: string = params.get('papier') ?? afBewaard.papier ?? (datum ? 'ja' : '');
  if (!papierKeuzes.some((b) => b.value === papier)) papier = '';
  /** De datum telt alleen als het besluit op papier staat. */
  const besluitDatum = () => (papier === 'ja' ? alsDatum(datum) : null);
  const afGewijzigd = () => {
    const d = besluitDatum() ? datum : '';
    bewaarJson(AF_KEY, besluit || papier ? { besluit, papier, datum: d } : null);
    zetInUrl({ besluit, papier, besluitdatum: d });
    opnieuw();
  };
  // Inklappen als alles beantwoord is: wat er besloten is, en "nee" of de datum.
  const afKlapIn = () => {
    if (besluit && (papier === 'nee' || besluitDatum())) vd.klapIn();
  };
  if (afBlok && afVeld) {
    afVeld.value = inVeld(datum);
    koppelDatumvelden();
    // Bij een tweede bezoek staat het antwoord voorop, niet de vragen.
    if (besluit || papier) vd.klapIn();
    // Eén keuze per vraag; nog eens klikken haalt hem weg.
    besluitKeuzes.forEach((b) =>
      b.addEventListener('click', () => {
        besluit = wissel(besluit, b.value);
        afKlapIn();
        afGewijzigd();
      }),
    );
    papierKeuzes.forEach((b) =>
      b.addEventListener('click', () => {
        papier = wissel(papier, b.value);
        afKlapIn();
        afGewijzigd();
      }),
    );
    afVeld.addEventListener('input', () => {
      const r = leesVeld(afVeld, '16-10-2026', (d) => (dagenTot(d) > 0 ? 'Deze datum ligt in de toekomst. Vul de datum in die op het besluit staat.' : ''));
      vd.meld(r.melding);
      if (r.gewijzigd(datum)) {
        datum = r.iso;
        if (r.iso) afKlapIn();
        afGewijzigd();
      }
    });
    vd.bijWissen(() => {
      besluit = '';
      papier = '';
      datum = '';
      afVeld.value = '';
    }, afGewijzigd);
  }
  /** Tekent wat de antwoorden doen: welke stappen nu nodig zijn, het pgb op zijn plek, en de laatste dag voor bezwaar. */
  const teken = () => {
    const blok = document.querySelector<HTMLElement>('[data-knelpunt-blok="afgewezen"]');
    if (!afBlok || !blok) return;
    zetGedrukt(besluitKeuzes, (b) => b.value === besluit);
    zetGedrukt(papierKeuzes, (b) => b.value === papier);
    afBlok.querySelector<HTMLElement>('[data-af-datum-vraag]')!.hidden = papier !== 'ja';
    const d = besluitDatum();
    const zin = { afgewezen: 'u kreeg geen of te weinig hulp', 'past-niet': 'de toegekende hulp past niet' }[besluit] ?? '';
    const hoofd = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);
    const samenvatting = d
      ? `Besluit van ${datumKort(d)}${zin ? `: ${zin}` : ''}.`
      : papier === 'nee'
        ? `${zin ? `${hoofd(zin)}; u` : 'U'} heeft het besluit nog niet op papier.`
        : papier === 'ja'
          ? `${zin ? `${hoofd(zin)}; u` : 'U'} heeft het besluit op papier.`
          : zin
            ? `${hoofd(zin)}.`
            : '';
    // Zonder datum herhaalt de samenvatting alleen de keuzes: dan alleen ingeklapt zichtbaar (zie CSS).
    vd.stand({ samenvatting, ingevuld: !!(besluit || papier), alleenIngeklapt: !d });

    // Met het besluit op papier vervalt de stap om erom te vragen; bij een afwijzing past het pgb niet.
    blok.querySelectorAll<HTMLElement>('[data-af-rol]').forEach((e) => {
      e.closest('li')!.hidden = (e.dataset.afRol === 'papier' && papier === 'ja') || (e.dataset.afRol === 'pgb' && besluit === 'afgewezen');
    });
    const lijst = blok.querySelector<HTMLOListElement>('ol[data-aanvraag-stappen]');
    const later = blok.querySelector<HTMLDetailsElement>('[data-af-later]');
    if (lijst) {
      // Past de toegekende hulp niet, dan staat het pgb direct na de stap over bezwaar; anders op zijn plek in afgewezen.md.
      const lis = Array.from(lijst.children) as HTMLElement[];
      lis.forEach((li, i) => (li.dataset.orig ??= String(i)));
      const naBezwaar = +(lis.find((li) => li.querySelector('[data-bezwaar-zin]'))?.dataset.orig ?? 0) + 0.5;
      const plek = (li: HTMLElement) => (besluit === 'past-niet' && li.querySelector('[data-af-rol="pgb"]') ? naBezwaar : +li.dataset.orig!);
      lis.sort((x, y) => plek(x) - plek(y)).forEach((li) => lijst.append(li));
      // Zonder besluit op papier is alleen stap 1 nu nodig: de rest ingeklapt, voor later.
      if (later) {
        if (papier === 'nee') later.append(lijst);
        else later.before(lijst);
        later.hidden = papier !== 'nee';
      }
    }

    // De zes weken als datum (Awb 6:7, 6:8; naar de eerstvolgende werkdag), gemarkeerd (markeer) zodat te zien is wat de datum doet.
    const vet = (...delen: (string | Node)[]) => {
      const s = document.createElement('strong');
      s.append(...delen);
      return s;
    };
    blok.querySelectorAll<HTMLElement>('[data-bezwaar-zin]').forEach((e) => {
      if (!d) {
        e.textContent = e.dataset.bezwaarZin!;
        return;
      }
      const tot = bezwaarTot(d);
      const n = dagenTot(tot);
      // Voorbij: te laat bezwaar kan de gemeente toch behandelen (Awb 6:11); met nieuwe feiten kan een nieuwe aanvraag (Awb 4:6).
      if (n < 0)
        e.replaceChildren(
          vet('De termijn voor bezwaar liep tot en met ', markeer(schrijf(tot)), '.'),
          ' Stuur toch een brief waarin u bezwaar maakt en leg uit waarom het later is: de gemeente beslist of ze het nog behandelt. Is er sindsdien iets veranderd? Dan kunt u ook opnieuw hulp aanvragen.',
        );
      else if (n <= BIJNA_DAGEN)
        e.replaceChildren(
          vet('Bezwaar kan nog tot en met ', markeer(schrijf(tot)), `, ${n === 0 ? 'dat is vandaag' : n === 1 ? 'dat is morgen' : `over ${n} dagen`}.`),
          ' Stuur uw brief waarin u bezwaar maakt nu.',
        );
      else
        e.replaceChildren(
          vet('Bezwaar kan tot en met ', markeer(schrijf(tot)), ' (zes weken na de datum op het besluit).'),
          ' Stuur uw brief waarin u bezwaar maakt liefst een paar dagen eerder.',
        );
    });
  };
  return { teken };
};
