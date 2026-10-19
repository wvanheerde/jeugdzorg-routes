/**
 * De verdiepingen in Mijn overzicht: welke stap van een knelpunt bij welk antwoord hoort, gekoppeld via het begin van de stap.
 * De vragen staan in de componenten Verdieping<Vraag>.astro, het script dat de antwoorden verwerkt in src/scripts/overzicht/.
 * Zie CONTENT.md, "Knelpunten: verdieping in Mijn overzicht".
 */
import { alleStappen, hoofdStappen, type Knelpunt } from './stappen';

/** Verhuizing: welke stap wanneer hoort. De kop ("Nu", "Vóór de verhuizing" …) komt pas als de ouder een datum invult. */
export const VERHUIS_MOMENT: [string, 'nu' | 'voor' | 'na' | 'pleeg'][] = [['Meld de verhuizing', 'nu'], ['Vraag het huidige besluit', 'voor'], ['Neem vóór de verhuizing al contact op', 'na'], ['Woont uw kind in een pleeggezin', 'pleeg']];
export const verhuisMoment = (x: string) => VERHUIS_MOMENT.find(([begin]) => x.startsWith(begin))?.[1];
/** "De hulp stopt": per stap de reden waar die bij hoort (verdieping "Waarom stopt de hulp?"). Stappen zonder reden gelden altijd. */
export const HULP_STOPT_REDEN: { id: string; begin: string; label: string }[] = [
  { id: 'aanbieder', begin: 'Stopt de aanbieder', label: 'De aanbieder stopt' },
  { id: 'klaar', begin: 'Vindt de aanbieder', label: 'De aanbieder vindt de hulp klaar' },
  { id: 'gemeente', begin: 'Heeft de gemeente besloten', label: 'De gemeente stopt de hulp' },
  { id: 'besluit', begin: 'Loopt het besluit af', label: 'Het besluit loopt af' },
  { id: 'achttien', begin: 'Wordt uw kind 18', label: 'Mijn kind wordt 18' },
];
export const hulpStoptReden = (x: string) => HULP_STOPT_REDEN.find((r) => x.startsWith(r.begin))?.id;
/**
 * "Mijn kind wordt 18": per stap het moment (het begin van de stap, dat de verdieping vervangt door een datum) en, voor drie
 * stappen, bij welke hulp na 18 de stap hoort. De volgorde in wordt-18.md is die van de uiterste datum (eerst acht, dan zes weken).
 * Stappen zonder soort gelden altijd. weken = hoe lang een besluit mag duren: CIZ (Wlz) zes weken; Wmo zes weken onderzoek plus twee weken beslissen (art. 2.3.2 en 2.3.5); verlengde jeugdhulp acht weken (Awb 4:13).
 */
export const WORDT_18: { begin: string; woorden: string; moment: 'nu' | 'ruim' | 'voor' | 'rond'; soort?: string; weken?: number }[] = [
  { begin: 'Nu: bel het wijkteam', woorden: 'Nu', moment: 'nu' },
  // Alleen zonder geboortedatum: met een datum zeggen de datums bij de stappen al wanneer.
  { begin: 'Wanneer beginnen?', woorden: '', moment: 'nu', soort: 'zonderdatum' },
  { begin: 'Ruim vóór de verjaardag: meld begeleiding', woorden: 'Ruim vóór de verjaardag', moment: 'ruim', soort: 'wmo', weken: 8 },
  { begin: 'Ruim vóór de verjaardag: vraag verlengde jeugdhulp', woorden: 'Ruim vóór de verjaardag', moment: 'ruim', soort: 'verlengd', weken: 8 },
  // Onderdelen onder de stap verlengde jeugdhulp, zonder moment (woorden leeg): bij een pleeggezin of gezinshuis, en als het kind al 18 is.
  { begin: 'Woont uw kind in een pleeggezin of gezinshuis?', woorden: '', moment: 'ruim', soort: 'pleeg' },
  { begin: 'Is uw kind al 18?', woorden: '', moment: 'ruim', soort: 'al18' },
  { begin: 'Ruim vóór de verjaardag: vraag bij blijvend veel zorg', woorden: 'Ruim vóór de verjaardag', moment: 'ruim', soort: 'wlz', weken: 6 },
  { begin: 'Vóór de verjaardag: bespreek met de behandelaar', woorden: 'Vóór de verjaardag', moment: 'voor', soort: 'zvw' },
  { begin: 'Vóór de verjaardag: regel een bewindvoerder', woorden: 'Vóór de verjaardag', moment: 'voor', soort: 'vertegenwoordiging' },
  { begin: 'Rond de verjaardag: zorg dat uw kind een eigen zorgverzekering', woorden: 'Rond de verjaardag', moment: 'rond' },
  { begin: 'Rond de verjaardag: regel geld en papieren', woorden: 'Rond de verjaardag', moment: 'rond' },
  { begin: 'Rond de verjaardag: spreek af hoe u betrokken blijft', woorden: 'Rond de verjaardag', moment: 'rond' },
];
/** Keuzes bij "Welke hulp is na 18 nog nodig?" en welke stappen (soort) daarbij zichtbaar blijven. Bij begeleiding blijft
 * verlengde jeugdhulp staan: past de Wmo niet, dan kan de jeugdhulp soms doorlopen. Bij de Wlz geldt de Jeugdwet niet meer.
 * Pleeggezin of gezinshuis: het kind woont nu al ergens anders binnen de jeugdhulp; dat kan na 18 doorlopen (verlengde jeugdhulp).
 * Ergens anders gaan wonen: het kind woont nu thuis en verhuist na 18 naar begeleid wonen (Wmo) of een woonvorm (Wlz); daarvoor zijn
 * wachtlijsten (zie src/scripts/overzicht/wordt-18.ts). Andere jeugdhulp die moet doorlopen valt onder begeleiding of "Weet ik niet".
 * Mentor, bewind of curatele (soort vertegenwoordiging) is zwaar en alleen nodig als het kind niet zelf kan beslissen: zichtbaar bij
 * blijvend veel zorg, "Weet ik niet", de situatie verstandelijke beperking, of zolang er niets gekozen is (zie src/scripts/overzicht/wordt-18.ts).
 * Bij een verstandelijke beperking blijft ook de Wlz-stap staan: ouders weten vaak niet of die geldt (persona-test Peter r3). */
export const NA_18: { id: string; label: string; toont: string[] }[] = [
  // Volgorde zo dat korte en lange labels op de telefoon samen op een regel passen; "Weet ik niet" achteraan.
  { id: 'zvw', label: 'Behandeling', toont: ['zvw'] },
  { id: 'wlz', label: 'Veel zorg of toezicht', toont: ['wlz', 'vertegenwoordiging'] },
  { id: 'wmo', label: 'Begeleiding of dagbesteding', toont: ['wmo', 'verlengd'] },
  { id: 'verlengd', label: 'Woont in pleeggezin of gezinshuis', toont: ['verlengd', 'pleeg'] },
  { id: 'wonen', label: 'Gaat begeleid wonen', toont: ['wmo', 'wlz'] },
  { id: 'onbekend', label: 'Weet ik niet', toont: ['wlz', 'wmo', 'verlengd', 'zvw', 'vertegenwoordiging', 'pleeg'] },
];
/**
 * "Wij wachten te lang": per stap de route waar die bij hoort (verdieping "Waarop wacht u?"). Stappen zonder route gelden altijd (school).
 * Met de datum waarop de gemeente de aanvraag kreeg, vervangt de verdieping de zin over de acht weken (Awb 4:13) en het begin van de
 * stap over de ingebrekestelling (Awb 4:17) door datums (lib/termijnen.ts). Met de datum waarop de gemeente de ingebrekestelling
 * kreeg, is die stap gedaan en krijgt de stap daarna een datum (twee weken, Awb 4:17 lid 3 en 6:12 lid 2). Daarom geen rekenhulp
 * onder deze stappen; die staat alleen bij de voorbeeldbrief.
 */
export const WACHT_OP: { begin: string; op: 'gemeente' | 'aanbieder' }[] = [
  { begin: 'Wacht u op een gesprek of een besluit van de gemeente', op: 'gemeente' },
  { begin: 'Wacht u op de aanbieder', op: 'aanbieder' },
  { begin: 'Vraag de huisarts of het wijkteam naar een andere aanbieder', op: 'aanbieder' },
  { begin: 'Helpen bellen en melden niet', op: 'aanbieder' },
];
export const WACHT_KEUZE = [{ id: 'gemeente', label: 'Een gesprek of besluit van de gemeente' }, { id: 'aanbieder', label: 'Een plek bij een aanbieder' }];
/** Bij wachten staat in de klachtbrieven de klacht over de wachttijd al aan (veld klachten in src/content/brieven). */
export const KLACHT_BIJ_WACHTEN: Record<string, string> = { 'klacht-aanbieder': '?klacht=wachten', 'klacht-toegangsteam': '?klacht=duurt-lang' };
export const WACHT_ZIN = 'De gemeente moet in de regel binnen acht weken beslissen.';
export const WACHT_LEAD = { ingebrekestelling: 'Zijn de acht weken na uw aanvraag voorbij?', daarna: 'Komt er twee weken na uw ingebrekestelling nog steeds geen besluit?' } as const;
export const wachtLead = (x: string) => (Object.keys(WACHT_LEAD) as (keyof typeof WACHT_LEAD)[]).find((id) => x.startsWith(WACHT_LEAD[id]));
export const wordt18 = (x: string) => WORDT_18.find((w) => x.startsWith(w.begin));
/**
 * "Hulp is afgewezen of te weinig": wat de gemeente besloot, of het besluit op papier staat, en de datum erop. De stap om het besluit
 * op papier te vragen (rol papier) vervalt als de ouder het heeft; heeft die het niet, dan is alleen die stap nu nodig en staan de
 * andere ingeklapt. De stap over het pgb (rol pgb) hoort bij "past niet": dan direct na het bezwaar, bij een afwijzing weg.
 * Met de datum op het besluit vervangt de verdieping BEZWAAR_ZIN door de laatste dag voor bezwaar (zes weken, Awb 6:7 en 6:8;
 * lib/termijnen.ts). Daarom geen rekenhulp onder deze stappen; die staat alleen bij de voorbeeldbrief.
 */
export const AFGEWEZEN_STAP: { begin: string; rol: 'papier' | 'pgb' }[] = [
  { begin: 'Heeft de gemeente het alleen gezegd', rol: 'papier' },
  { begin: 'Is er wel hulp toegekend, maar past die niet', rol: 'pgb' },
];
export const afgewezenRol = (x: string) => AFGEWEZEN_STAP.find((a) => x.startsWith(a.begin))?.rol;
export const BESLUIT_KEUZE = [{ id: 'afgewezen', label: 'Geen of te weinig hulp' }, { id: 'past-niet', label: 'De hulp past niet' }];
export const PAPIER_KEUZE = [{ id: 'ja', label: 'Ja' }, { id: 'nee', label: 'Nee, alleen gezegd' }];
export const BEZWAAR_ZIN = 'Stuur binnen zes weken na de datum op het besluit een brief waarin u bezwaar maakt.';

/** Bij de build: begint geen stap meer met een begin hierboven, dan faalt de build (anders valt de verdieping stil weg). */
export const controleerVerdiepingen = (knelpunten: Knelpunt[]) => {
  // Veranderen de stappen van de verhuizing, dan moet de tijdlijn mee; anders valt de verdieping stil zonder dat iemand het ziet.
  const verhuisStappen = alleStappen(knelpunten.find((k) => k.id === 'verhuizing')!);
  VERHUIS_MOMENT.forEach(([begin]) => { if (!verhuisStappen.some((x) => x.startsWith(begin))) throw new Error(`verhuizing.md: geen stap begint met "${begin}" (zie VERHUIS_MOMENT in src/lib/verdiepingen.ts)`); });
  const hulpStoptStappen = hoofdStappen(knelpunten.find((k) => k.id === 'hulp-stopt')!);
  HULP_STOPT_REDEN.forEach((r) => { if (!hulpStoptStappen.some((x) => x.startsWith(r.begin))) throw new Error(`hulp-stopt.md: geen stap begint met "${r.begin}" (zie HULP_STOPT_REDEN in src/lib/verdiepingen.ts)`); });
  const wordt18Stappen = alleStappen(knelpunten.find((k) => k.id === 'wordt-18')!);
  WORDT_18.forEach((w) => { if (!wordt18Stappen.some((x) => x.startsWith(w.begin))) throw new Error(`wordt-18.md: geen stap begint met "${w.begin}" (zie WORDT_18 in src/lib/verdiepingen.ts)`); });
  const wachtStappen = alleStappen(knelpunten.find((k) => k.id === 'wachten')!);
  WACHT_OP.forEach((w) => { if (!wachtStappen.some((x) => x.startsWith(w.begin))) throw new Error(`wachten.md: geen stap begint met "${w.begin}" (zie WACHT_OP in src/lib/verdiepingen.ts)`); });
  if (!wachtStappen.some((x) => x.includes(WACHT_ZIN))) throw new Error(`wachten.md: geen stap bevat "${WACHT_ZIN}" (zie WACHT_ZIN in src/lib/verdiepingen.ts)`);
  const afgewezenStappen = hoofdStappen(knelpunten.find((k) => k.id === 'afgewezen')!);
  AFGEWEZEN_STAP.forEach((a) => { if (!afgewezenStappen.some((x) => x.startsWith(a.begin))) throw new Error(`afgewezen.md: geen stap begint met "${a.begin}" (zie AFGEWEZEN_STAP in src/lib/verdiepingen.ts)`); });
  if (!afgewezenStappen.some((x) => x.startsWith(BEZWAAR_ZIN))) throw new Error(`afgewezen.md: geen stap begint met "${BEZWAAR_ZIN}" (zie BEZWAAR_ZIN in src/lib/verdiepingen.ts)`);
  Object.values(WACHT_LEAD).forEach((begin) => { if (!wachtStappen.some((x) => x.startsWith(begin))) throw new Error(`wachten.md: geen stap begint met "${begin}" (zie WACHT_LEAD in src/lib/verdiepingen.ts)`); });
};
