/**
 * Van leesbare namen in de scenario's naar id's in de url: de titels van vragen (knelpunten) en situaties komen uit
 * src/content, zodat een scenario "Mijn kind wordt 18" kan zeggen in plaats van "wordt-18".
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const CONTENT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../src/content');

const titels = (map: string) => new Map(fs.readdirSync(path.join(CONTENT, map)).filter((f) => f.endsWith('.md')).map((f) => {
  const titel = /^titel:\s*"?(.+?)"?\s*$/m.exec(fs.readFileSync(path.join(CONTENT, map, f), 'utf8'))?.[1] ?? '';
  return [titel, f.replace(/\.md$/, '')] as const;
}));
const VRAGEN = titels('knelpunten');
const SITUATIES = titels('situaties');

const zoek = (map: Map<string, string>, soort: string, naam: string) => {
  const id = map.get(naam);
  if (!id) throw new Error(`Onbekende ${soort} "${naam}". Bekend: ${[...map.keys()].join(', ')}`);
  return id;
};
/** Id's van alle voorbeeldbrieven (src/content/brieven). */
export const brieven = () => fs.readdirSync(path.join(CONTENT, 'brieven')).filter((f) => f.endsWith('.md')).map((f) => f.replace(/\.md$/, ''));
export const vraagId = (titel: string) => zoek(VRAGEN, 'vraag', titel);
export const situatieId = (titel: string) => zoek(SITUATIES, 'situatie', titel);
/** Leeftijdsknoppen zoals op de site ("12 tot 18") → waarde in de url (l=12-18). */
const LEEFTIJDEN: Record<string, string> = { 'Jonger dan 4': '0-4', '4 tot 12': '4-12', '12 tot 18': '12-18', '18 of ouder': '18-99' };
export const leeftijdId = (titel: string) => zoek(new Map(Object.entries(LEEFTIJDEN)), 'leeftijd', titel);
/** "Apeldoorn" → apeldoorn, "Bergen op Zoom" → bergen-op-zoom (zoals de bestandsnamen in src/content/gemeenten). */
export const gemeenteSlug = (naam: string) => naam.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

type Contact = { naam?: string; telefoon?: string; email?: string; url?: string };
const lijst = (c: Contact | Contact[] | undefined): Contact[] => (c ? ([] as Contact[]).concat(c) : []);
/** Wijkteam en cliëntondersteuner van een gemeente zoals ze onder de stappen staan: de naam in de regel en wat er bekend is. */
export const stapContacten = (slug: string) => {
  const d = JSON.parse(fs.readFileSync(path.join(CONTENT, 'gemeenten', `${slug}.json`), 'utf8'));
  const wt = d.toegang.routes.find((r: { type: string }) => r.type === 'wijkteam');
  const co = d.rechten.onafhankelijkeClientondersteuning as Contact;
  return [...(wt ? [{ ...lijst(wt.contact)[0], naam: wt.naam as string }] : []), co].filter((c) => c?.naam) as Contact[];
};

export type Geldregeling = { soort: string; naam: string; inkomensgrens?: number | 'geen'; grondslag?: 'bijstandsnorm' | 'minimumloon'; ouders?: 'ja' | 'nee'; alleenOuder?: true };
type Geld = { overzicht?: { naam: string; url: string }; regelingen: (Geldregeling & { url: string })[] };
const geldVan = (slug: string): Geld | undefined => JSON.parse(fs.readFileSync(path.join(CONTENT, 'gemeenten', `${slug}.json`), 'utf8')).geldregelingen;
export const gemeenteNaam = (slug: string): string => JSON.parse(fs.readFileSync(path.join(CONTENT, 'gemeenten', `${slug}.json`), 'utf8')).naam;
/** De url van de pagina met alle regelingen van de gemeente (geldregelingen.overzicht). */
export const overzichtUrl = (slug: string) => geldVan(slug)?.overzicht?.url;
/** Eerste gemeente (op alfabet) waar precies één regeling, bij een laag inkomen, naar dezelfde pagina linkt als de pagina met alle regelingen
 *  (linken er twee regelingen naartoe, zoals in Barneveld, dan staan er terecht twee links). */
export const gemeenteMetDubbeleOverzichtLink = () => {
  const slug = fs.readdirSync(path.join(CONTENT, 'gemeenten')).map((f) => f.replace(/\.json$/, '')).sort().find((s) => {
    const g = geldVan(s);
    if (!g?.overzicht) return false;
    const naarOverzicht = g.regelingen.filter((r) => r.url === g.overzicht!.url);
    return naarOverzicht.length === 1 && ['zorgverzekering', 'meedoen'].includes(naarOverzicht[0].soort);
  });
  if (!slug) throw new Error('Geen gemeente waar een regeling naar de pagina met alle regelingen linkt');
  return slug;
};
/** De geldregelingen van een gemeente (veld geldregelingen), of een lege lijst. */
export const geldregelingen = (slug: string): Geldregeling[] =>
  JSON.parse(fs.readFileSync(path.join(CONTENT, 'gemeenten', `${slug}.json`), 'utf8')).geldregelingen?.regelingen ?? [];
/** De eerste gemeente (op alfabet) met een regeling die hieraan voldoet; zo hangt een scenario niet aan één gemeente die nog onderzocht wordt. */
export const gemeenteMetRegeling = (past: (r: Geldregeling) => boolean) => {
  const slug = fs.readdirSync(path.join(CONTENT, 'gemeenten')).map((f) => f.replace(/\.json$/, '')).sort().find((s) => geldregelingen(s).some(past));
  if (!slug) throw new Error('Geen gemeente met zo\'n regeling in src/content/gemeenten');
  return slug;
};

/** Alle gemeenten (slug) met hun geldregelingen; zonder het veld: undefined. */
const alleGemeenten = () => fs.readdirSync(path.join(CONTENT, 'gemeenten')).filter((f) => f.endsWith('.json')).map((f) => f.replace(/\.json$/, '')).sort();
/** Namen van de gemeenten die van elke soort minstens één regeling hebben. */
export const gemeentenMetSoorten = (soorten: string[]) => alleGemeenten().filter((s) => soorten.every((soort) => geldregelingen(s).some((r) => r.soort === soort))).map(gemeenteNaam);
export const aantalGemeenten = () => alleGemeenten().length;
export const gemeenteZonderSoort = (soort: string) => alleGemeenten().find((s) => !geldregelingen(s).some((r) => r.soort === soort))!;
