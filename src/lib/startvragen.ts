/**
 * Startvragen op de voorpagina (components/Startvragen.astro): één vraag tegelijk. Eerst de situatie (de vlakken
 * hieronder, pas na de gemeente), dan zo nodig de precieze vraag (de knelpunten met dat vlak in `startgroepen`), dan de leeftijd
 * en dan wat er speelt (bovenaan wat bij de gekozen leeftijd vaak speelt: `vaakBij`; de rest op alfabet). Leeftijd en wat er speelt vraagt de
 * site alleen waar ze het overzicht veranderen (`startSituaties`, `leeftijdsstappen` per knelpunt); de leeftijd is dan niet over te slaan.
 */
import type { CollectionEntry } from 'astro:content';

/** De vlakken bij "Wat is uw situatie?" (de titels sluiten aan op die vraag). 'ander' heeft één vraag en is die vraag dus zelf. */
export const HOOFDKEUZES = [
  {
    id: 'hulp',
    titel: 'Ik zoek hulp voor mijn kind',
    uitleg: 'Er is nog geen hulp, u weet niet waar u moet beginnen of u wacht al lang. Ook als het op school vastloopt.',
  },
  { id: 'al', titel: 'Er is al hulp, maar…', uitleg: 'Het duurt te lang, het loopt vast, het is te weinig, het stopt of u wilt een klacht indienen.' },
  { id: 'verandert', titel: 'Er verandert iets', uitleg: 'Uw kind wordt 18, u verhuist of u gaat uit elkaar.' },
  { id: 'geld', titel: 'Ik heb een financiële vraag', uitleg: 'Extra kosten, kinderbijslag of een pgb.' },
  { id: 'ander', titel: 'Ik heb zorgen om een kind van een ander', uitleg: 'Een kind in uw familie, buurt of omgeving.' },
] as const;

/** De vraag na een vlak met meer vragen. */
export const VERVOLGVRAAG: Record<string, string> = {
  hulp: 'Hoe ver bent u?',
  al: 'Wat speelt er?',
  verandert: 'Wat verandert er?',
  geld: 'Waar gaat het om?',
};

/** Een eigen naam voor een vraag op de voorpagina, waar de titel van de vraag daar niet past. Onder "Ik zoek hulp voor mijn kind"
 *  staat "Ik heb nog geen hulp" naast "Wij wachten te lang" (Kees, ronde 27: wie op een besluit wacht, heeft nog geen hulp). */
export const STARTTITEL: Record<string, string> = { beginnen: 'Ik heb nog geen hulp' };

/** De naam van een vraag zoals de ouder hem op de voorpagina koos: de eigen naam, of het vlak als dat de vraag zelf is.
 *  "Uw keuzes" in Mijn overzicht gebruikt die naam (Henk en Lisa, ronde 27). */
export const startNaam = (k: CollectionEntry<'knelpunten'>) =>
  STARTTITEL[k.id] ?? HOOFDKEUZES.find((h) => !(h.id in VERVOLGVRAAG) && k.data.startgroepen.includes(h.id as never))?.titel ?? k.data.titel;

/** Bij deze vraag staat de leeftijd vast; de vraag naar de leeftijd vervalt. */
export const VASTE_LEEFTIJD: Record<string, string> = { 'wordt-18': '12-18' };

/** Per leeftijd 3 tot 7 situaties bovenaan: minder heeft weinig zin, meer maakt het blok weer lang. */
const VAAK_MIN = 3,
  VAAK_MAX = 7;

/** Controle bij het bouwen: elk vlak met een vervolgvraag heeft vragen, en elke leeftijd een passend aantal situaties. */
export const controleerStartvragen = (knelpunten: CollectionEntry<'knelpunten'>[], situaties: CollectionEntry<'situaties'>[], banden: string[]) => {
  for (const id of Object.keys(VERVOLGVRAAG))
    if (!knelpunten.some((k) => k.data.startgroepen.includes(id as never)))
      throw new Error(`Startvragen: geen vraag met "${id}" in startgroepen (src/content/knelpunten).`);
  for (const id of ['ander', 'spoed']) {
    const n = knelpunten.filter((k) => k.data.startgroepen.includes(id as never)).length;
    if (n !== 1) throw new Error(`Startvragen: "${id}" in startgroepen moet bij precies één vraag staan, nu ${n} (src/content/knelpunten).`);
  }
  for (const b of banden) {
    const n = situaties.filter((s) => s.data.vaakBij.includes(b as never)).length;
    if (n < VAAK_MIN || n > VAAK_MAX)
      throw new Error(
        `Startvragen: bij leeftijd ${b} staan ${n} situaties onder "Vaak bij deze leeftijd"; dat moeten er ${VAAK_MIN} tot ${VAAK_MAX} zijn (vaakBij in src/content/situaties).`,
      );
  }
};
