/** Wat er onder elke stap van een knelpunt in Mijn overzicht komt (props voor StapInhoud.astro). */
import type { CollectionEntry } from 'astro:content';
import type { ComponentProps } from 'astro/types';
import type StapInhoud from '../components/StapInhoud.astro';
import { genoemdIn } from './genoemd';
import { alleStappen, hoofdStappen, type Knelpunt } from './stappen';
import {
  AFLOOP_ZIN,
  BEZWAAR_ZIN,
  KIES_ZIN,
  KLACHT_BIJ_WACHTEN,
  WACHT_OP,
  WACHT_ZIN,
  afgewezenRol,
  gezagStap,
  hulpStoptReden,
  regelingStap,
  uitbreidenRol,
  verhuisMoment,
  wachtLead,
  wordt18,
} from './verdiepingen';

type Organisatie = CollectionEntry<'organisaties'>;
type Situatie = CollectionEntry<'situaties'>;
/** Per stap de voorbeeldbrief die erbij hoort (alleen brieven van dit knelpunt, elke brief één keer): een link direct achter de stap. */
const STAP_BRIEF: [RegExp, string][] = [
  [/ingebrekestelling/i, 'ingebrekestelling'],
  [/brief waarin u bezwaar maakt/i, 'bezwaar-beschikking'],
  [/klacht in bij de aanbieder/i, 'klacht-aanbieder'],
  [/(dien|dient).{0,40}klacht/i, 'klacht-toegangsteam'],
  [/overdracht/i, 'verhuizing-overdracht'],
  [/één overleg/i, 'gezamenlijk-overleg'],
  [/nieuw gesprek en een nieuw besluit/i, 'verzoek-meer-hulp'],
];
/** Korte naam in de link, zodat twee brieflinks bij elkaar niet hetzelfde heten. */
const BRIEF_LABEL: Record<string, string> = {
  'gesprek-school-opp': 'gesprek met school',
  ingebrekestelling: 'ingebrekestelling',
  'bezwaar-beschikking': 'bezwaar',
  'klacht-toegangsteam': 'klacht aan het wijkteam',
  'klacht-aanbieder': 'klacht aan de aanbieder',
  'verhuizing-overdracht': 'overdracht',
  'gezamenlijk-overleg': 'gezamenlijk overleg',
  'verzoek-meer-hulp': 'meer of andere hulp',
};
/** Vellen om af te drukken bij de stap waar ze horen (vraag of situatie, begin van de stap). Elke regel moet een stap vinden: zie de controle onderaan. */
const BESCHIKKING = { pad: 'beschikking/', tekst: 'Het besluit nalezen: wat hoort erin te staan' };
const VEL_BIJ_STAP: { bij: string; begin: string; vel: { pad: string; tekst: string } }[] = [
  { bij: 'beginnen', begin: 'Vraag na het gesprek om een verslag op papier', vel: BESCHIKKING },
  { bij: 'uitbreiden', begin: 'Vraag om het nieuwe besluit op papier', vel: BESCHIKKING },
  { bij: 'verhuizing', begin: 'Vraag het huidige besluit (de beschikking) op papier', vel: BESCHIKKING },
  { bij: 'afgewezen', begin: 'Stuur binnen zes weken', vel: BESCHIKKING }, // niet bij de eerste stap: die valt weg als de ouder het besluit op papier heeft
  { bij: 'hulp-stopt', begin: 'Loopt het besluit af?', vel: BESCHIKKING },
  { bij: 'beschikking', begin: 'Lees het besluit na', vel: BESCHIKKING },
  { bij: 'hulp-stopt', begin: 'Vraag om een warme overdracht', vel: { pad: 'mijn-kind/', tekst: 'Dit is mijn kind: één vel voor een nieuwe hulpverlener' } },
  { bij: 'school-loopt-vast', begin: 'Vraag na elk gesprek om de afspraken op papier', vel: { pad: 'logboek/', tekst: 'Logboek om af te drukken' } },
];
const velBij = (bij: string, stap: string) => VEL_BIJ_STAP.find((v) => v.bij === bij && stap.startsWith(v.begin))?.vel;
/** Faalt de build als een vel geen stap meer vindt (de tekst van de stap is veranderd). */
export const controleerVellen = (stappen: { id: string; stappen: string[] }[]) =>
  VEL_BIJ_STAP.forEach((v) => {
    const s = stappen.find((x) => x.id === v.bij);
    if (!s || !s.stappen.some((st) => st.startsWith(v.begin)))
      throw new Error(
        `Vel ${v.vel.pad} hoort bij een stap van "${v.bij}" die begint met "${v.begin}", maar die stap is er niet. Pas VEL_BIJ_STAP in src/lib/stap-props.ts aan.`,
      );
  });
/**
 * Wat er bij elke stap hoort (zie StapInhoud.astro):
 * - genoemde landelijke organisaties: nummer en website onder de stap die ze als eerste noemt, niet in de zin (persona-tests ronde 21);
 * - de voorbeeldbrief;
 * - de cliëntondersteuner van de gemeente onder de eerste stap die hem noemt (niet bij een landelijke vraag);
 * - de aanbieders (Beschikbaarheidswijzer of gemeentepagina) onder de eerste stap over een andere aanbieder;
 * - het wijkteam onder de eerste stap die het noemt, als het niet bovenaan staat (wijkteamBovenaan: false);
 * - hoe het in de gemeente gaat onder stap 1 (standInGemeente);
 * - bij "Zet uw vraag op papier" het vel om het gesprek voor te bereiden (/gesprek/); bij andere stappen een ander vel (VEL_BIJ_STAP);
 * - bij "Vindt u de stap spannend?" de tips over hulp vragen;
 * - bij dubbele kinderbijslag de kern in de stap zelf (KinderbijslagKern: aanvragen, wat u opschrijft, terugbetalen) met een link naar de
 *   landelijke uitleg (Fatima, ronde 27 en 29);
 * - bij de verhuizing: de plek van de stap in de tijdlijn en de nieuwe gemeente (zie verdiepingen.ts);
 * - bij extra kosten (regelingencheck): de rol van de stap en de soorten regelingen van de gemeente die eronder komen;
 * - bij wachten, afgewezen, gescheiden en uitbreiden: de route, rol of het gezag van de stap en de zin die een datum uit de verdieping vervangt. Daar staat geen rekenhulp
 *   onder de stappen (die staat bij de voorbeeldbrief): de verdieping rekent zelf.
 */
export const maakStapProps = (organisaties: Organisatie[]) => {
  const stapPropsPer = new Map<string, (st: string) => ComponentProps<typeof StapInhoud>>();
  return (k: Knelpunt, st: string) => {
    if (!stapPropsPer.has(k.id)) {
      const alle = alleStappen(k);
      const gehad = new Set<string>();
      const orgs = new Map(alle.map((x) => [x, genoemdIn(x, organisaties, gehad)]));
      const gebruikt = new Set<string>();
      const brief = new Map(
        alle.map((x) => {
          const hit = STAP_BRIEF.find(([re, id]) => re.test(x) && k.data.brieven.includes(id) && !gebruikt.has(id));
          if (hit) gebruikt.add(hit[1]);
          // Bij wachten gaat een klacht over de wachttijd: die klacht staat in de brief dan al aan (KLACHT_BIJ_WACHTEN).
          return [x, hit ? { id: hit[1], label: BRIEF_LABEL[hit[1]], zoek: k.id === 'wachten' ? KLACHT_BIJ_WACHTEN[hit[1]] : undefined } : undefined];
        }),
      );
      const metGemeente = !k.data.zonderGemeente;
      const co = metGemeente ? alle.find((x) => x.includes('cliëntondersteuner')) : undefined;
      const aanb = metGemeente && k.data.gemeenteOnderdelen.includes('aanbieders') ? alle.find((x) => x.includes('andere aanbieder')) : undefined;
      // Liever onder een hoofdstap dan onder een vervolgstap: bij wachten noemt de klachtstap (1A, alleen route gemeente) het wijkteam eerder
      // dan de stap over de aanbieder, en dan verdween het contact bij wachten op een aanbieder.
      const wt =
        metGemeente && !k.data.wijkteamBovenaan ? (hoofdStappen(k).find((x) => x.includes('wijkteam')) ?? alle.find((x) => x.includes('wijkteam'))) : undefined;
      stapPropsPer.set(k.id, (x: string) => ({
        tekst: x,
        orgs: orgs.get(x) ?? [],
        brief: brief.get(x),
        co: x === co,
        aanbieders: x === aanb,
        wijkteam: x === wt,
        stand: metGemeente && x === alle[0] ? k.data.standInGemeente : undefined,
        gesprek: k.id === 'beginnen' && x.startsWith('Zet uw vraag op papier'),
        vel: velBij(k.id, x),
        tips: k.id === 'beginnen' && x.startsWith('Vindt u de stap spannend'),
        kinderbijslag: k.id === 'geld' && x.includes('Vraag dan dubbele kinderbijslag aan'),
        moment: k.id === 'verhuizing' ? verhuisMoment(x) : undefined,
        nieuw: k.id === 'verhuizing' && verhuisMoment(x) === 'na',
        reden: k.id === 'hulp-stopt' ? hulpStoptReden(x) : undefined,
        wanneer: k.id === 'wordt-18' ? wordt18(x) : undefined,
        afgewezen: k.id === 'afgewezen' ? { rol: afgewezenRol(x), zin: x.startsWith(BEZWAAR_ZIN) ? BEZWAAR_ZIN : undefined } : undefined,
        regeling: k.id === 'geld' ? regelingStap(x) : undefined,
        uitbreiden: k.id === 'uitbreiden' ? { rol: uitbreidenRol(x), zin: x.includes(AFLOOP_ZIN) ? AFLOOP_ZIN : undefined } : undefined,
        gescheiden: k.id === 'gescheiden' ? { gezag: gezagStap(x), zin: x.includes(KIES_ZIN) ? KIES_ZIN : undefined } : undefined,
        wacht:
          k.id === 'wachten'
            ? { op: WACHT_OP.find((w) => x.startsWith(w.begin))?.op, zin: x.includes(WACHT_ZIN) ? WACHT_ZIN : undefined, lead: wachtLead(x) }
            : undefined,
      }));
    }
    return stapPropsPer.get(k.id)!(st);
  };
};

/** De eigen stappen van een situatie bij "Ik wil hulp aanvragen" (veld stappen): genoemde organisaties, de brief en de cliëntondersteuner
 *  onder de eerste stap die hem noemt. */
export const situatieStapProps = (organisaties: Organisatie[], sit: Situatie): ComponentProps<typeof StapInhoud>[] => {
  const gehad = new Set<string>();
  const stappen = (sit.data.stappen ?? []).map((s) => (typeof s === 'string' ? { stap: s, brief: undefined } : s));
  const co = stappen.find((s) => s.stap.includes('cliëntondersteuner'))?.stap;
  return stappen.map(({ stap, brief }) => {
    if (brief && !BRIEF_LABEL[brief]) throw new Error(`${sit.id}.md: geen korte naam voor de brief "${brief}" (zie BRIEF_LABEL in src/lib/stap-props.ts)`);
    return {
      tekst: stap,
      orgs: genoemdIn(stap, organisaties, gehad),
      brief: brief ? { id: brief, label: BRIEF_LABEL[brief] } : undefined,
      co: stap === co,
      vel: velBij(sit.id, stap),
    };
  });
};
