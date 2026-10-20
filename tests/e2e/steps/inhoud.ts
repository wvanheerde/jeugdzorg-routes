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
