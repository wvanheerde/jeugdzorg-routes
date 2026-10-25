/** Contact van een route als lijst (het veld mag één blok of een lijst zijn). */
export const contacten = <T>(c: T | T[] | undefined): T[] => (c ? ([] as T[]).concat(c) : []);

/** Korte label per route, in oudertaal (badges). */
export const routeLabel: Record<string, string> = {
  wijkteam: 'Via het wijkteam',
  huisarts: 'Via de huisarts',
  school: 'Via school',
  'gecertificeerde-instelling': 'Jeugdbescherming',
  spoed: 'Spoed',
  overig: 'Overig',
};
/** Zinsdeel na "Begin bij …" in de volgende-stapteksten. */
export const beginBij: Record<string, string> = {
  wijkteam: 'het wijkteam van uw gemeente',
  huisarts: 'de huisarts of jeugdarts',
  school: 'school',
  'gecertificeerde-instelling': 'de jeugdbeschermer',
  spoed: 'uw huisarts',
  overig: 'het wijkteam van uw gemeente',
};
/** In oudertaal: moet de gemeente eerst toestemming geven? kort = past op één regel, lang = tooltip. */
export const beschikking: Record<string, { kort: string; lang: string }> = {
  ja: { kort: 'Toestemming gemeente nodig', lang: 'De gemeente moet eerst een besluit nemen (een beschikking) voordat deze hulp start.' },
  nee: { kort: 'Vrij toegankelijk', lang: 'Geen verwijzing en geen besluit van de gemeente nodig; u kunt zelf contact opnemen.' },
  soms: {
    kort: 'Soms toestemming gemeente nodig',
    lang: 'Of de gemeente eerst een besluit (beschikking) neemt, hangt af van de route. Via de huisarts, jeugdarts of specialist, of bij lichte hulp, is dat vaak niet nodig; via het wijkteam vaak wel.',
  },
  spoed: { kort: 'Bij spoed direct, zonder besluit', lang: 'Bij acute nood start de hulp meteen, zonder besluit van de gemeente vooraf.' },
  rechter: { kort: 'Besluit van de kinderrechter', lang: 'Deze hulp vraagt u niet zelf aan: de kinderrechter beslist erover.' },
};

/** Thema's die te algemeen zijn om organisaties aan een situatie te koppelen. */
export const GENERIEKE_THEMAS = ['gezin', 'opvoeden', 'onderwijs', 'beperking', 'ontwikkelingsproblemen', 'ggz', 'crisis', 'zelfbeeld'];
export const koppelThemas = (themas: string[]) => themas.filter((t) => !GENERIEKE_THEMAS.includes(t));

const MAANDEN = ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'];
/** "2026-10-12" → "12 oktober 2026" (ook "2026-10" → "oktober 2026"). */
export const datum = (iso: string) => {
  const [j, m, d] = iso.split('-').map(Number);
  return [d, MAANDEN[(m || 1) - 1], j].filter(Boolean).join(' ');
};

/**
 * Bij welk onderdeel (zie knelpunten.gemeenteOnderdelen) een link uit "Direct regelen" hoort, op basis van de naam.
 * Zo toont het overzicht alleen de links die bij de gekozen vraag passen: geen klacht of bezwaar bij een eerste hulpvraag.
 */
export const regelSoort = (naam: string) =>
  /klacht|niet tevreden|ombuds|meldpunt (zorg|signalen)|melding slechte|vastgelopen/i.test(naam)
    ? 'klacht'
    : /bezwaar|verordening|beleidsregels/i.test(naam)
      ? 'bezwaar'
      : /vertrouwens/i.test(naam)
        ? 'vertrouwenspersoon'
        : /\bpgb\b|persoonsgebonden/i.test(naam)
          ? 'pgb'
          : /crisis|spoed|veilig thuis/i.test(naam)
            ? 'spoed'
            : /cli[eë]ntondersteun/i.test(naam)
              ? 'clientondersteuning'
              : /aanbieder|wachttijd|beschikbaarheid/i.test(naam)
                ? 'aanbieders'
                : 'toegang';
