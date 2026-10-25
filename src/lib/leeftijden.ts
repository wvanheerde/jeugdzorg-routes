/** Leeftijdsbanden (bovengrens exclusief), gedeeld door de leeftijdskeuze in Mijn overzicht en de startvragen op de voorpagina.
 *  titel: op de keuzetegel; samenvatting: in de regel met keuzes bovenaan Mijn overzicht. */
export const BANDEN = [
  { id: '0-4', titel: 'Jonger dan 4', samenvatting: 'jonger dan 4', van: 0, tot: 4 },
  { id: '4-12', titel: '4 tot 12', samenvatting: '4 tot 12 jaar', van: 4, tot: 12 },
  { id: '12-18', titel: '12 tot 18', samenvatting: '12 tot 18 jaar', van: 12, tot: 18 },
  { id: '18-99', titel: '18 of ouder', samenvatting: '18 of ouder', van: 18, tot: 99 },
] as const;

export type BandId = (typeof BANDEN)[number]['id'];
/** De id's op volgorde ('0-4', '4-12' …), ook voor het schema (src/content.config.ts). */
export const BAND_IDS = BANDEN.map((b) => b.id) as [BandId, ...BandId[]];
/** De band bij een id, of undefined (geen of onbekende leeftijd). */
export const bandVan = (id: string) => BANDEN.find((b) => b.id === id);
