/**
 * Regelingencheck bij "Extra kosten of kinderbijslag" (src/scripts/overzicht/geld.ts): past de regeling van een stap bij de antwoorden?
 * true = past waarschijnlijk, false = past niet (ingeklapt), null = nog open (blijft staan), 'gedaan' = de ouder heeft hem al.
 * Alleen een antwoord dat iets uitsluit geeft false; "Weet ik niet" en geen antwoord sluiten niets uit.
 */
export type Antwoorden = { zorg: string; dkb: string; alleen: string; inkomen: string; kosten: string[]; leeftijd: string };
/** mantelNee: de gemeente geeft ouders van een minderjarig kind geen mantelzorgwaardering (geldregelingen, ouders: "nee"). */
export const regelingPast = (rol: string, a: Antwoorden, mantelNee = false): boolean | null | 'gedaan' => {
  const k = (...ids: string[]) => (a.kosten.length ? a.kosten.some((x) => ids.includes(x)) : null);
  switch (rol) {
    case 'dkiz':
      // Dubbele kinderbijslag is er tot 18 jaar (SVB); de stap zegt dat zelf bij een kind van 18 of ouder.
      if (a.leeftijd === '18-99') return a.zorg ? false : null;
      return a.zorg === 'nee' ? false : a.dkb === 'ja' ? 'gedaan' : a.zorg === 'ja' ? true : null;
    case 'extra': return a.zorg === 'nee' || a.dkb === 'nee' || a.alleen === 'nee' ? false : a.alleen === 'ja' ? true : null;
    case 'meerkosten': return a.zorg === 'ja' || k('zorg', 'ziekte') ? true : a.zorg === 'nee' && k('zorg', 'ziekte') === false ? false : null;
    case 'inkomen': return a.inkomen === 'nee' ? false : a.inkomen ? true : null;
    case 'vervoer': return k('school');
    case 'mantelzorg': return a.zorg === 'nee' || (a.zorg === 'ja' && mantelNee) ? false : a.zorg === 'ja' ? true : null;
    // Wlz: ook bij veel zorg niet "waarschijnlijk"; dag en nacht zorg of toezicht is een zwaardere eis.
    case 'wlz': return a.zorg === 'nee' ? false : null;
    case 'aftrek': return k('zorg', 'ziekte');
    default: return null;
  }
};

/**
 * De soorten geldregelingen van een gemeente (veld geldregelingen, geldSoort in content.config.ts), in de volgorde van de
 * gemeentepagina, met de kop daar en de knop in het filter op de lijst met gemeenten. Eerst wat met de zorg voor het kind te maken
 * heeft; `inkomen`: een regeling voor iedereen met een laag inkomen, op de gemeentepagina onder "Regelingen bij een laag inkomen"
 * (besluit gebruiker 23-10-2026). Zorgkosten alleen voor de ouder zelf (`alleenOuder`) staan daar ook, onder ZORGKOSTEN_OUDER.
 */
export const GELD_SOORTEN: { id: string; label: string; inkomen?: true }[] = [
  { id: 'meerkosten', label: 'Extra kosten bij ziekte of beperking' },
  { id: 'zorgkosten', label: 'Andere zorgkosten' },
  { id: 'kinderopvang', label: 'Kinderopvang om medische of sociale redenen' },
  { id: 'leerlingenvervoer', label: 'Vervoer naar school' },
  { id: 'mantelzorg', label: 'Mantelzorgwaardering' },
  { id: 'zorgverzekering', label: 'Zorgverzekering bij een laag inkomen', inkomen: true },
  { id: 'bijzondere-bijstand', label: 'Bijzondere bijstand', inkomen: true },
  { id: 'meedoen', label: 'Sport, school en cultuur voor kinderen', inkomen: true },
];
/** Kop op de gemeentepagina voor zorgkosten die alleen voor de ouder zelf gelden (alleenOuder), bij de regelingen voor een laag inkomen. */
export const ZORGKOSTEN_OUDER = 'Zorgkosten van uzelf';
/** Zegt de gemeente zelf dat zij een soort niet heeft (nietGevonden), dan één zin; alleen bij soorten die niet overal bestaan. */
export const GEEN_REGELING: Record<string, string> = {
  meerkosten: 'heeft geen aparte regeling voor extra kosten bij ziekte of beperking.',
  zorgverzekering: 'heeft geen collectieve zorgverzekering.',
};
/** Tot welk inkomen, in gewone woorden. */
export const inkomensgrens = (g?: number | 'geen', grondslag?: string) =>
  g === 'geen' ? 'Zonder inkomensgrens.' : g ? `Voor een inkomen tot ${g}% van ${grondslag === 'minimumloon' ? 'het wettelijk minimumloon' : 'het sociaal minimum'}.` : '';
