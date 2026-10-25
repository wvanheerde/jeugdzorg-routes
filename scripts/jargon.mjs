// Jargoncontrole voor alle content (CONTENT.md, "Geen jargon zonder uitleg"). Gebruikt door validate-content.mjs.
// - Beleidstaal uit `herschrijven` (src/lib/woorden.ts): herschrijven naar wat ouders merken.
// - Afkortingen die de site niet uitlegt: niet in de begrippenlijst, geen bekende naam, en nergens in hetzelfde bestand
//   voluit geschreven ("ABC (...)" of "(ABC"). Alleen afkortingen die in meer bestanden terugkomen; losse teamnamen controleert de redacteur.
import { readdirSync, readFileSync } from 'node:fs';
import { woorden, herschrijven } from '../src/lib/woorden.ts';

const ROOT = 'src/content';
// Velden die niet als lopende tekst op de site staan.
const OVERSLAAN = new Set([
  'meta',
  'bron',
  'bronnen',
  'url',
  'email',
  'telefoon',
  'website',
  'slug',
  'cbsCode',
  'id',
  'adres',
  'openingstijden',
  'icoon',
  'kleur',
]);
// Afkortingen die ouders kennen, namen van therapieën (met eigen pagina) en partijen.
const BEKEND = new Set([
  'ADHD',
  'GGD',
  'DUO',
  'UWV',
  'CBS',
  'EMDR',
  'CGT',
  'ACT',
  'MST',
  'MDFT',
  'FFT',
  'IPT',
  'PMT',
  'DGT',
  'VVD',
  'CDA',
  'PVV',
  'PVDA',
  'PDF',
  'ID',
  'VWS',
  'IGJ',
  'ICD',
  'DSM',
]);
// Namen van regionale organisaties, teams en samenwerkingsverbanden die vaak terugkomen; de tekst zegt er zelf bij wat ze doen.
const NAMEN = new Set([
  'SAVE',
  'XONAR',
  'KIES',
  'RSV',
  'OCRN',
  'RID',
  'OCO',
  'RIOZ',
  'ABC',
  'RIGG',
  'BMC',
  'PPO',
  'ZIEN',
  'WBO',
  'JOSEE',
  'MAGIS',
  'PRO',
  'ISD',
  'ONS',
  'SMWO',
  'VIA',
  'WIJ',
  'JONK',
  'WIL',
]);
// Namen van teams en overleggen met een beleidswoord erin; de naam blijft, de tekst zegt erbij wat het team doet.
const EIGENNAMEN = ['Regionale Toeleidings Tafel', 'Triageteam', 'Triagetafel Jeugd'];

const vormen = new Set(woorden.flatMap((w) => w.vormen.map((v) => v.toLowerCase())));
const tekstUit = (x, uit = []) => {
  if (Array.isArray(x)) x.forEach((v) => tekstUit(v, uit));
  else if (x && typeof x === 'object')
    for (const [k, v] of Object.entries(x)) {
      if (!OVERSLAAN.has(k)) tekstUit(v, uit);
    }
  else if (typeof x === 'string' && !/^https?:/.test(x)) uit.push(x);
  return uit;
};
const mdTekst = (t) => {
  const [, fm = '', body = t] = t.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/) ?? [];
  const regels = fm
    .split('\n')
    .filter((r) => !/^\s*-?\s*(url|titel|geraadpleegd|slug|id|bijgewerkt|volgorde|icoon)\s*:/.test(r))
    .map((r) => r.replace(/^\s*-?\s*[\w]+\s*:\s*/, ''));
  return [...regels, body.replace(/\]\([^)]*\)/g, ']')];
};
const organisatieNamen = readdirSync(`${ROOT}/organisaties`)
  .map((f) => {
    const o = JSON.parse(readFileSync(`${ROOT}/organisaties/${f}`, 'utf8'));
    return [o.naam, ...(o.genoemdAls ?? [])].join(' ');
  })
  .join(' ');

/** Geeft per bestand meldingen over beleidstaal, plus één regel met afkortingen die in `MIN_BESTANDEN` of meer bestanden zonder uitleg staan. */
const MIN_BESTANDEN = 3;
export function jargonCheck() {
  const meldingen = [],
    afkortingen = new Map();
  for (const map of readdirSync(ROOT))
    for (const f of readdirSync(`${ROOT}/${map}`)) {
      const pad = `${ROOT}/${map}/${f}`;
      const ruw = readFileSync(pad, 'utf8');
      const tekst = (f.endsWith('.json') ? tekstUit(JSON.parse(ruw)) : mdTekst(ruw)).join('\n');
      const zonderNamen = EIGENNAMEN.reduce((t, n) => t.replaceAll(n, ''), tekst);
      const beleid = herschrijven.filter((h) => new RegExp(`(?<!\\p{L})${h.vorm}`, 'iu').test(zonderNamen)).map((h) => `${h.vorm} (liever: ${h.liever})`);
      if (beleid.length) meldingen.push(`${pad}: beleidstaal: ${beleid.join('; ')}`);
      // Postcodeletters (1234 AB) tellen niet mee.
      for (const [a] of tekst.replace(/\b\d{4} ?[A-Z]{2}\b/g, '').matchAll(/(?<![\p{L}\d&/-])[A-Z]{2,5}(?![\p{L}\d&-])/gu)) {
        if (vormen.has(a.toLowerCase()) || BEKEND.has(a) || NAMEN.has(a) || organisatieNamen.includes(a)) continue;
        if (tekst.includes(`(${a}`) || tekst.includes(`${a} (`)) continue;
        (afkortingen.get(a) ?? afkortingen.set(a, new Set()).get(a)).add(pad);
      }
    }
  const vaak = [...afkortingen].filter(([, p]) => p.size >= MIN_BESTANDEN).sort((a, b) => b[1].size - a[1].size);
  if (vaak.length)
    meldingen.push(
      `afkortingen zonder uitleg (in ${MIN_BESTANDEN}+ bestanden; zet ze in src/lib/woorden.ts of schrijf ze voluit): ${vaak.map(([a, p]) => `${a} (${p.size}, bv. ${[...p][0]})`).join('; ')}`,
    );
  return meldingen;
}

// "Jeugdzorg" is het geheel van jeugdhulp, jeugdbescherming en jeugdreclassering (NJi); voor ouders gaat het bijna altijd om jeugdhulp,
// het woord uit de Jeugdwet (CONTENT.md, "Jeugdhulp of jeugdzorg"). Niet gemeld: namen, zinnen die ook over jeugdbescherming of
// jeugdreclassering gaan, signalen en ervaringen en het landelijk beeld (cijfers en beleid: die volgen het woord van de bron) en
// organisaties (die beschrijven zich in hun eigen woorden).
const JEUGDZORG_NAMEN = /Bureau Jeugdzorg|Jeugdzorgplus|Bijstand in jeugdzorg|Jeugdzorg Nederland|Jeugdzorg Routes|toegangsteam jeugdzorg/gi;
const JEUGDZORG_BREED = /jeugdbescherm|jeugdreclassering|Jeugdstem|Hervormingsagenda/i;
const JEUGDZORG_OVERSLAAN = new Set([...OVERSLAAN, 'signalen', 'ervaringen', 'titel', 'jeugdzorgregio', 'websiteJeugd', 'contact']);
const tekstMetVeld = (x, veld = '', uit = []) => {
  if (Array.isArray(x)) x.forEach((v) => tekstMetVeld(v, veld, uit));
  else if (x && typeof x === 'object')
    for (const [k, v] of Object.entries(x)) {
      if (!JEUGDZORG_OVERSLAAN.has(k)) tekstMetVeld(v, veld ? `${veld}.${k}` : k, uit);
    }
  else if (typeof x === 'string' && !/^https?:/.test(x)) uit.push([veld, x]);
  return uit;
};
/** Meldt "jeugdzorg" in lopende tekst waar waarschijnlijk jeugdhulp bedoeld is. */
export function jeugdzorgCheck() {
  const meldingen = [];
  for (const map of readdirSync(ROOT).filter((m) => m !== 'organisaties'))
    for (const f of readdirSync(`${ROOT}/${map}`).filter((f) => !f.includes('landelijk-beeld'))) {
      const pad = `${ROOT}/${map}/${f}`;
      const ruw = readFileSync(pad, 'utf8');
      const delen = f.endsWith('.json') ? tekstMetVeld(JSON.parse(ruw)) : mdTekst(ruw).map((t) => ['', t]);
      for (const [veld, tekst] of delen)
        for (const zin of tekst.replace(JEUGDZORG_NAMEN, '').split(/(?<=[.?!])\s+/)) {
          if (!/(?<!\p{L})jeugdzorg/iu.test(zin) || JEUGDZORG_BREED.test(zin)) continue;
          meldingen.push(`${pad}${veld ? ` (${veld})` : ''}: "jeugdzorg" in de tekst, bedoelt u jeugdhulp? "${zin.trim().slice(0, 120)}"`);
        }
    }
  return meldingen;
}
