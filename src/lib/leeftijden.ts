/** Leeftijdsbanden (bovengrens exclusief), gedeeld door de leeftijdskeuze in Mijn overzicht en de startvragen op de voorpagina. */
export const BANDEN = [
  { id: '0-4', titel: 'Jonger dan 4', van: 0, tot: 4 },
  { id: '4-12', titel: '4 tot 12', van: 4, tot: 12 },
  { id: '12-18', titel: '12 tot 18', van: 12, tot: 18 },
  { id: '18-99', titel: '18 of ouder', van: 18, tot: 99 },
] as const;
