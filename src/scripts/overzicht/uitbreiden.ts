/**
 * Verdieping bij "Ik wil hulp uitbreiden": wat speelt er (?nodig=meer,afloop) en wanneer loopt het besluit af (?einde=jjjj-mm-dd).
 * Uit de URL of van een eerder bezoek.
 */
import { beslissenTot, dagenTot, meldenVoor, schrijf } from '../../lib/termijnen';
import { koppelDatumvelden } from '../../lib/datumveld';
import { params, zetInUrl, isoDatum, alsDatum, inVeld, datumKort, over } from './gedeeld';
import { OPSLAG, leesJson, bewaarJson } from '../../lib/opslag';
import { verdieping, zetGedrukt, wisselMeer, lijstUit, leesVeld, markeer } from './verdieping';

const UB_KEY = OPSLAG.uitbreiden;

export const uitbreiden = (opnieuw: () => void) => {
  const ubBewaard = leesJson(UB_KEY);
  const vd = verdieping('uitbreiden', { melding: '[data-ub-melding]' });
  const ubBlok = vd.blok;
  const ubKeuzes = vd.knoppen('[data-ub-nodig]');
  const ubVeld = vd.el<HTMLInputElement>('[data-ub-einde]');
  let einde = isoDatum(params.get('einde') ?? ubBewaard.einde);
  let nodig = lijstUit('nodig', ubBewaard.nodig, (id) => ubKeuzes.some((b) => b.value === id));
  // Een einddatum hoort bij een besluit dat afloopt.
  if (einde && !nodig.includes('afloop')) nodig = [...nodig, 'afloop'];
  /** De einddatum telt alleen als het besluit afloopt. */
  const eindDatum = () => (nodig.includes('afloop') ? alsDatum(einde) : null);
  const gewijzigd = () => {
    const e = eindDatum() ? einde : '';
    bewaarJson(UB_KEY, nodig.length ? { nodig, einde: e } : null);
    zetInUrl({ nodig: nodig.join(','), einde: e });
    opnieuw();
  };
  if (ubBlok && ubVeld) {
    ubVeld.value = inVeld(einde);
    koppelDatumvelden();
    // Bij een tweede bezoek staat het antwoord voorop, niet de vragen.
    if (nodig.length) vd.klapIn();
    // Meer keuzes tegelijk; niet inklappen na een keuze (er kan er nog een bij). Wel na de einddatum, de laatste vraag.
    ubKeuzes.forEach((b) =>
      b.addEventListener('click', () => {
        nodig = wisselMeer(nodig, b.value);
        gewijzigd();
      }),
    );
    ubVeld.addEventListener('input', () => {
      const r = leesVeld(ubVeld, '31-01-2027');
      vd.meld(r.melding);
      if (r.gewijzigd(einde)) {
        einde = r.iso;
        if (r.iso) vd.klapIn();
        gewijzigd();
      }
    });
    vd.bijWissen(() => {
      nodig = [];
      einde = '';
      ubVeld.value = '';
    }, gewijzigd);
  }
  /** Tekent wat de antwoorden doen: waar de stap over het aflopen staat, en met de einddatum tot wanneer de ouder het meldt. */
  const teken = () => {
    const blok = document.querySelector<HTMLElement>('[data-knelpunt-blok="uitbreiden"]');
    if (!ubBlok || !blok) return;
    zetGedrukt(ubKeuzes, (b) => nodig.includes(b.value));
    const afloop = nodig.includes('afloop'),
      meer = nodig.includes('meer');
    ubBlok.querySelector<HTMLElement>('[data-ub-datum-vraag]')!.hidden = !afloop;
    const e = eindDatum();
    const n = e ? dagenTot(e) : 0;
    const samenvatting = e
      ? n > 0
        ? `Het besluit loopt af op ${datumKort(e)} (${over(n)}).`
        : n === 0
          ? `Het besluit loopt vandaag af (${datumKort(e)}).`
          : `Het besluit liep af op ${datumKort(e)}.`
      : afloop && meer
        ? 'Het besluit loopt af en er is meer of andere hulp nodig.'
        : afloop
          ? 'Het besluit loopt af.'
          : meer
            ? 'Er is meer of andere hulp nodig.'
            : '';
    // Zonder einddatum herhaalt de samenvatting alleen de keuzes: dan alleen ingeklapt zichtbaar (zie CSS).
    vd.stand({ samenvatting, ingevuld: nodig.length > 0, alleenIngeklapt: !e });

    // De stap over het aflopen: bovenaan bij "loopt af", ingeklapt bij alleen "meer", anders op zijn plek (de eerste na stap 1).
    const stap = blok.querySelector('[data-ub-rol="afloop"]')?.closest('li');
    const een = blok.querySelector<HTMLOListElement>('ol.stap-een');
    const lijst = blok.querySelector<HTMLOListElement>('ol[data-aanvraag-stappen]');
    const anders = blok.querySelector<HTMLDetailsElement>('[data-ub-anders]');
    const andersLijst = blok.querySelector<HTMLOListElement>('[data-ub-anders-lijst]');
    if (stap && een && lijst && anders && andersLijst) {
      if (afloop) een.prepend(stap);
      else if (meer) andersLijst.append(stap);
      else lijst.prepend(stap);
      anders.hidden = !(meer && !afloop);
    }

    // De einddatum: tot wanneer melden (acht weken ervoor, lib/termijnen.ts), gemarkeerd (markeer) zodat te zien is wat de datum doet.
    blok.querySelectorAll<HTMLElement>('[data-afloop-zin]').forEach((z) => {
      const na = z.nextElementSibling as HTMLElement | null;
      if (!e) {
        if (na?.hasAttribute('data-zin-na')) na.hidden = false;
        z.textContent = z.dataset.afloopZin!;
        return;
      }
      const uiterlijk = meldenVoor(e);
      // Meldt de ouder het vandaag, dan mag de gemeente in de regel tot acht weken daarna beslissen (Awb 4:13, lib/termijnen.ts).
      const beslist = beslissenTot(new Date());
      const krap = n >= 0 && dagenTot(uiterlijk) < 0;
      // Bij krap staat de vraag om door te lopen al in de nieuwe tekst; is de einddatum voorbij, dan past de rest van de stap niet meer.
      if (na?.hasAttribute('data-zin-na')) na.hidden = n < 0 || (krap && beslist > e);
      // Links naar een andere vraag in Mijn overzicht, met het antwoord dat daar past al gekozen; dezelfde vorm als de andere
      // verwijzingen naar een vraag (titel tussen aanhalingstekens, zie StapInhoud.astro), met "de vraag" erbij (persona-test Yvonne r2).
      const naar = (zoek: string, titel: string) =>
        Object.assign(document.createElement('a'), { href: `${location.pathname}${zoek}`, textContent: `"${titel}"` });
      if (n < 0)
        z.replaceChildren(
          'Het besluit liep af op ',
          markeer(schrijf(e)),
          '. Is er nog geen nieuw besluit? Lees dan bij de vraag ',
          naar('?k=hulp-stopt&reden=besluit', 'De hulp stopt'),
          ' wat u kunt doen.',
        );
      else if (krap) {
        // Krap: zeg dat er een gat kan vallen en wat de ouder dan kan doen (persona-tests Yvonne, 19-10).
        z.replaceChildren(
          'Meld vandaag dat de hulp nog nodig is: het besluit loopt af op ',
          markeer(schrijf(e)),
          '.',
          ...(beslist > e
            ? [
                ' Meldt u het vandaag, dan mag de gemeente in de regel tot ',
                markeer(schrijf(beslist)),
                ' beslissen: dat is na de einddatum. Vraag daarom of de hulp kan doorlopen tot het nieuwe besluit er is.',
              ]
            : []),
          ' Beslist de gemeente niet op tijd? Lees dan bij de vraag ',
          naar('?k=wachten&wacht=gemeente', 'Wij wachten te lang'),
          ' wat u kunt doen.',
        );
      } else
        z.replaceChildren(
          'Meld nu dat de hulp nog nodig is, liefst ruim van tevoren en uiterlijk ',
          markeer(schrijf(uiterlijk)),
          ' (acht weken vóór de einddatum: zo lang mag de gemeente in de regel over een besluit doen).',
        );
    });
  };
  return { teken };
};
