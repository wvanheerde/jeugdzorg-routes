/** Contact van een route als lijst (het veld mag één blok of een lijst zijn). */
export const contacten = <T,>(c: T | T[] | undefined): T[] => (c ? ([] as T[]).concat(c) : []);

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
  nee: { kort: 'Direct beschikbaar', lang: 'Geen besluit van de gemeente nodig; u kunt direct terecht.' },
  soms: { kort: 'Via arts direct, anders via gemeente', lang: 'Verwijst de huisarts, jeugdarts of specialist, dan is geen besluit van de gemeente nodig. Via het wijkteam wel.' },
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
