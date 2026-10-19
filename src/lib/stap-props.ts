/** Wat er onder elke stap van een knelpunt in Mijn overzicht komt (props voor StapInhoud.astro). */
import type { CollectionEntry } from 'astro:content';
import type { ComponentProps } from 'astro/types';
import type StapInhoud from '../components/StapInhoud.astro';
import { genoemdIn } from './genoemd';
import { alleStappen, hoofdStappen, type Knelpunt } from './stappen';
import { AFLOOP_ZIN, BEZWAAR_ZIN, KIES_ZIN, KLACHT_BIJ_WACHTEN, WACHT_OP, WACHT_ZIN, afgewezenRol, gezagStap, hulpStoptReden, uitbreidenRol, verhuisMoment, wachtLead, wordt18 } from './verdiepingen';

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
const BRIEF_LABEL: Record<string, string> = { 'gesprek-school-opp': 'gesprek met school', ingebrekestelling: 'ingebrekestelling', 'bezwaar-beschikking': 'bezwaar', 'klacht-toegangsteam': 'klacht', 'klacht-aanbieder': 'klacht', 'verhuizing-overdracht': 'overdracht', 'gezamenlijk-overleg': 'gezamenlijk overleg', 'verzoek-meer-hulp': 'meer of andere hulp' };
/**
 * Wat er bij elke stap hoort (zie StapInhoud.astro):
 * - genoemde landelijke organisaties: nummer en website onder de stap die ze als eerste noemt, niet in de zin (persona-tests ronde 21);
 * - de voorbeeldbrief;
 * - de cliëntondersteuner van de gemeente onder de eerste stap die hem noemt (niet bij een landelijke vraag);
 * - de aanbieders (Beschikbaarheidswijzer of gemeentepagina) onder de eerste stap over een andere aanbieder;
 * - het wijkteam onder de eerste stap die het noemt, als het niet bovenaan staat (wijkteamBovenaan: false);
 * - hoe het in de gemeente gaat onder stap 1 (standInGemeente);
 * - bij "Zet uw vraag op papier" het vel om het gesprek voor te bereiden (/gesprek/);
 * - bij "Vindt u de stap spannend?" de tips over hulp vragen;
 * - bij de verhuizing: de plek van de stap in de tijdlijn en de nieuwe gemeente (zie verdiepingen.ts);
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
      const brief = new Map(alle.map((x) => {
        const hit = STAP_BRIEF.find(([re, id]) => re.test(x) && k.data.brieven.includes(id) && !gebruikt.has(id));
        if (hit) gebruikt.add(hit[1]);
        // Bij wachten gaat een klacht over de wachttijd: die klacht staat in de brief dan al aan (KLACHT_BIJ_WACHTEN).
        return [x, hit ? { id: hit[1], label: BRIEF_LABEL[hit[1]], zoek: k.id === 'wachten' ? KLACHT_BIJ_WACHTEN[hit[1]] : undefined } : undefined];
      }));
      const metGemeente = !k.data.zonderGemeente;
      const co = metGemeente ? alle.find((x) => x.includes('cliëntondersteuner')) : undefined;
      const aanb = metGemeente && k.data.gemeenteOnderdelen.includes('aanbieders') ? alle.find((x) => x.includes('andere aanbieder')) : undefined;
      // Liever onder een hoofdstap dan onder een vervolgstap: bij wachten noemt de klachtstap (1A, alleen route gemeente) het wijkteam eerder
      // dan de stap over de aanbieder, en dan verdween het contact bij wachten op een aanbieder.
      const wt = metGemeente && !k.data.wijkteamBovenaan ? hoofdStappen(k).find((x) => x.includes('wijkteam')) ?? alle.find((x) => x.includes('wijkteam')) : undefined;
      stapPropsPer.set(k.id, (x: string) => ({
        tekst: x,
        orgs: orgs.get(x) ?? [],
        brief: brief.get(x),
        co: x === co,
        aanbieders: x === aanb,
        wijkteam: x === wt,
        stand: metGemeente && x === alle[0] ? k.data.standInGemeente : undefined,
        gesprek: k.id === 'beginnen' && x.startsWith('Zet uw vraag op papier'),
        tips: k.id === 'beginnen' && x.startsWith('Vindt u de stap spannend'),
        moment: k.id === 'verhuizing' ? verhuisMoment(x) : undefined,
        nieuw: k.id === 'verhuizing' && verhuisMoment(x) === 'na',
        reden: k.id === 'hulp-stopt' ? hulpStoptReden(x) : undefined,
        wanneer: k.id === 'wordt-18' ? wordt18(x) : undefined,
        afgewezen: k.id === 'afgewezen' ? { rol: afgewezenRol(x), zin: x.startsWith(BEZWAAR_ZIN) ? BEZWAAR_ZIN : undefined } : undefined,
        uitbreiden: k.id === 'uitbreiden' ? { rol: uitbreidenRol(x), zin: x.includes(AFLOOP_ZIN) ? AFLOOP_ZIN : undefined } : undefined,
        gescheiden: k.id === 'gescheiden' ? { gezag: gezagStap(x), zin: x.includes(KIES_ZIN) ? KIES_ZIN : undefined } : undefined,
        wacht: k.id === 'wachten' ? { op: WACHT_OP.find((w) => x.startsWith(w.begin))?.op, zin: x.includes(WACHT_ZIN) ? WACHT_ZIN : undefined, lead: wachtLead(x) } : undefined,
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
    return { tekst: stap, orgs: genoemdIn(stap, organisaties, gehad), brief: brief ? { id: brief, label: BRIEF_LABEL[brief] } : undefined, co: stap === co };
  });
};
