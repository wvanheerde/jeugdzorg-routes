/**
 * Groepen op de pagina Situaties (25-10): elke situatie hoort bij één groep (`groep` in src/content/situaties). De pagina toont de
 * groepen in deze volgorde, met een kop, en binnen een groep de situaties op alfabet. De voorpagina en Mijn overzicht houden hun
 * eigen volgorde (`vaakBij`, alfabet, `volgorde`).
 */
export const SITUATIE_GROEPEN = [
  { id: 'ontwikkeling', titel: 'Ontwikkeling en leren' },
  { id: 'gevoelens', titel: 'Gevoelens en gedrag' },
  { id: 'lichaam', titel: 'Lichaam en gezondheid' },
  { id: 'gezin', titel: 'Gezin' },
  { id: 'veiligheid', titel: 'Veiligheid' },
  { id: 'online', titel: 'Online en verslaving' },
] as const;

export type SituatieGroep = (typeof SITUATIE_GROEPEN)[number]['id'];
export const GROEP_IDS = SITUATIE_GROEPEN.map((g) => g.id) as [SituatieGroep, ...SituatieGroep[]];
