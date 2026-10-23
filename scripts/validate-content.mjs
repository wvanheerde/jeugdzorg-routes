// Snelle controle van de content zonder volledige build: JSON-syntax, verplichte velden,
// datumvolgorde, dubbele CBS-codes, het verbod op 112 en 06-nummers, contactgegevens en jargon (waarschuwing). Het volledige schema wordt afgedwongen door `astro build`.
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { jargonCheck } from './jargon.mjs';

const dir = 'src/content/gemeenten';
const files = (await readdir(dir)).filter((f) => f.endsWith('.json'));
const codes = new Map();
let errors = 0;
const today = new Date().toISOString().slice(0, 10);

// Telefoonnummers en e-mailadressen horen in contactblokken (telefoon, email), niet in de tekst.
// In routes: elke instantie die de stappen noemen, heeft een contactblok onder de route; nummers
// staan dus nooit in stappen. Buiten routes: geen herhaling van een nummer uit een contactblok, en
// niets in samenvattingen.
const TEL = /(?<!\d)(?:0\d{1,4}[ -]?\d{2,4}[ -]?\d{2,4}(?:[ -]?\d{2,4})?|14[ -]?0\d{2,3})(?!\d)/g; // ook 14-nummers (14 0164)
const MAIL = /[\w.+-]+@[\w-]+\.[\w.-]*\w/g;
/** Geldregelingen: hooguit zoveel tekens (CONTENT.md, "Gemeenten: geldregelingen"). */
const GELD_OMSCHRIJVING = 180, GELD_AANVRAGEN = 100;
const norm = (x) => (x.includes('@') ? x.toLowerCase() : x.replace(/\D/g, ''));
const ROUTES_MET_CONTACT = ['wijkteam', 'huisarts', 'school', 'spoed'];
function contactCheck(data) {
  const vrij = [], vast = new Set();
  const walk = (x, pad) => {
    if (Array.isArray(x)) x.forEach((v, i) => walk(v, [...pad, i]));
    else if (x && typeof x === 'object') for (const [k, v] of Object.entries(x)) { if (k !== 'meta' && k !== 'bron') walk(v, [...pad, k]); }
    else if (typeof x === 'string') {
      const k = pad.at(-1);
      if (k === 'telefoon' || k === 'email') vast.add(norm(x));
      else if (!['url', 'openingstijden', 'adres'].includes(k)) for (const m of [...x.matchAll(TEL), ...x.matchAll(MAIL)]) vrij.push([norm(m[0]), m[0], pad.join('.')]);
    }
  };
  walk(data, []);
  const inRoute = (pad) => /^toegang\.routes\.\d+\./.test(pad) && !/\.contact\./.test(pad);
  const meldingen = vrij.filter(([n, , pad]) => inRoute(pad) || vast.has(n) || /(^|\.)samenvatting$/.test(pad)).map(([, m, pad]) => `${m} in ${pad}`);
  const zonder = (data.toegang?.routes ?? []).map((r, i) => (ROUTES_MET_CONTACT.includes(r.type) && !r.contact ? `routes.${i} (${r.type})` : null)).filter(Boolean);
  // Spoed: geen telefoonnummers of e-mail (vast landelijk blok op de site); alleen een link naar de gemeente.
  (data.toegang?.routes ?? []).forEach((r, i) => { if (r.type === 'spoed') [].concat(r.contact ?? []).forEach((c) => { if (c.telefoon || c.email) meldingen.push(`${c.naam} in routes.${i}.contact (spoed: alleen een link naar de gemeente)`); }); });
  return { meldingen, zonder };
}

for (const f of files) {
  const path = join(dir, f);
  let data;
  try { data = JSON.parse(await readFile(path, 'utf8')); }
  catch (e) { console.error(`✗ ${path}: ongeldige JSON (${e.message})`); errors++; continue; }

  const slug = f.replace(/\.json$/, '');
  if (!/^[a-z0-9-]+$/.test(slug)) { console.error(`✗ ${path}: bestandsnaam moet kebab-case zijn`); errors++; }
  if (codes.has(data.cbsCode)) { console.error(`✗ ${path}: cbsCode ${data.cbsCode} ook in ${codes.get(data.cbsCode)}`); errors++; }
  codes.set(data.cbsCode, path);
  if (data.meta?.laatstGecontroleerd > today) { console.error(`✗ ${path}: laatstGecontroleerd ligt in de toekomst`); errors++; }
  for (const b of data.meta?.bronnen ?? []) if (b.geraadpleegd > data.meta.laatstGecontroleerd) { console.error(`✗ ${path}: bron '${b.titel}' geraadpleegd na laatstGecontroleerd`); errors++; }
  if (!data.toegang?.routes?.some((r) => r.type === 'wijkteam')) console.warn(`! ${path}: geen route van type 'wijkteam'`);
  if (!data.toegang?.routes?.some((r) => r.type === 'spoed')) console.warn(`! ${path}: geen route van type 'spoed'`);
  // 112 nooit noemen: de site toont bij spoed vaste landelijke nummers (SpoedNummers.astro).
  const { meta, ...publiek } = data;
  const { meldingen, zonder } = contactCheck(data);
  if (meldingen.length) console.warn(`! ${path}: telefoon/e-mail in tekst (hoort in een contactblok): ${meldingen.join('; ')}`);
  if (zonder.length) console.warn(`! ${path}: route zonder contactblok: ${zonder.join(', ')}`);
  if (/(?<![\d\w])112(?![\d\w])/.test(JSON.stringify(publiek).replace(/https?:[^"]*|Postbus 112/g, ''))) { console.error(`✗ ${path}: noemt 112`); errors++; }
  // Beladen woorden (CONTENT.md, "Beladen woorden vermijden en omvormen"): waarschuwing, de redacteur vormt ze om.
  // Titels van brondocumenten en URL's tellen niet mee; "Eigen Kracht" met hoofdletters is een organisatie.
  const zichtbaar = JSON.stringify(publiek).replace(/https?:[^"]*/g, '').replace(/"bron":\{"titel":"[^"]*"/g, '');
  const beladen = zichtbaar.match(/uithuisplaats\w*|uit huis (?:ge)?plaatst|kwetsba\w*|normalis\w*|voorliggend\w* veld|dure (?:jeugd)?(?:zorg|hulp)|eigen kracht/g);
  if (beladen) console.warn(`! ${path}: beladen woorden (zie CONTENT.md): ${[...new Set(beladen)].join(', ')}`);
  // Geen 06-nummers om te bellen: vaak van één medewerker, en ze veranderen ongemerkt. Een WhatsApp-nummer mag wel.
  const mobiel = JSON.stringify(publiek).replace(/https?:[^"]*/g, '').replace(/WhatsApp:? (?:\+31 ?6|06)[ -]?(?:\d[ -]?){7}\d/g, '').match(/(?<!\d)(?:\+31 ?6|06)[ -]?(?:\d[ -]?){7}\d(?!\d)/g);
  if (mobiel) { console.error(`✗ ${path}: 06-nummer: ${mobiel.join('; ')}`); errors++; }
  // Geldregelingen (regelingencheck, CONTENT.md "Gemeenten: geldregelingen"): geen nummers in de tekst, ouders alleen bij mantelzorg,
  // een soort niet tegelijk gevonden en niet gevonden, en geen bron van na de controledatum.
  const geld = data.geldregelingen;
  if (geld) {
    for (const r of geld.regelingen ?? []) {
      // Kort, en zonder contactgegevens of websitenamen: de link bij de naam is genoeg (gebruiker, 22-10-2026).
      const tekst = `${r.omschrijving} ${r.aanvragen ?? ''}`;
      const contact = [...(tekst.match(/[\w.-]+@[\w.-]+|(?<!\d)0\d{1,3}[ -]?\d{3}[ \d]{2,}|\b14 ?0\d{2,3}\b|\bpostbus\b|\b[\w-]+\.(?:nl|eu|com|org)\b/gi) ?? []), ...(tekst.match(/\b\d{4} ?[A-Z]{2}\b(?! ?[a-z])/g) ?? [])];
      if (contact.length) console.warn(`! ${path}: geldregeling '${r.naam}': contactgegevens of website in de tekst: ${contact.join('; ')}`);
      if (r.omschrijving.length > GELD_OMSCHRIJVING) console.warn(`! ${path}: geldregeling '${r.naam}': omschrijving ${r.omschrijving.length} tekens (hooguit ${GELD_OMSCHRIJVING})`);
      if ((r.aanvragen ?? '').length > GELD_AANVRAGEN) console.warn(`! ${path}: geldregeling '${r.naam}': aanvragen ${r.aanvragen.length} tekens (hooguit ${GELD_AANVRAGEN})`);
      if (r.ouders && r.soort !== 'mantelzorg') { console.error(`✗ ${path}: geldregeling '${r.naam}': 'ouders' hoort alleen bij mantelzorg`); errors++; }
      if (r.alleenOuder && r.soort !== 'zorgkosten') { console.error(`✗ ${path}: geldregeling '${r.naam}': 'alleenOuder' hoort alleen bij zorgkosten`); errors++; }
      if (r.soort === 'zorgkosten' && !r.alleenOuder && /alleen voor u ?zelf/i.test(r.omschrijving)) console.warn(`! ${path}: geldregeling '${r.naam}': omschrijving zegt "alleen voor uzelf" maar alleenOuder ontbreekt`);
      if ((r.bronnen ?? []).some((b) => b.geraadpleegd > geld.laatstGecontroleerd)) { console.error(`✗ ${path}: geldregeling '${r.naam}': bron geraadpleegd na laatstGecontroleerd`); errors++; }
    }
    const dubbel = (geld.nietGevonden ?? []).filter((s) => geld.regelingen?.some((r) => r.soort === s));
    if (dubbel.length) { console.error(`✗ ${path}: geldregelingen: ${dubbel.join(', ')} staat bij regelingen én bij nietGevonden`); errors++; }
    if (geld.laatstGecontroleerd > today) { console.error(`✗ ${path}: geldregelingen.laatstGecontroleerd ligt in de toekomst`); errors++; }
  }
  // Netnummer van vier cijfers (0543, 0599) hoort niet als "054 349 3333" gegroepeerd te worden.
  const tweeCijferig = /^0(10|13|15|20|23|24|26|30|33|35|36|38|40|43|45|46|50|53|55|58|7\d|8[2-8]|9[17]|6)/;
  const scheef = (JSON.stringify(publiek).match(/"telefoon":"0\d\d \d{3} \d{4}"/g) ?? []).map((t) => t.slice(12, -1)).filter((t) => !tweeCijferig.test(t.replace(/\s/g, '')));
  if (scheef.length) console.warn(`! ${path}: telefoonnummer met netnummer van vier cijfers verkeerd gegroepeerd (bv. 0543 49 33 33): ${scheef.join('; ')}`);
}
// Jargon in alle content (ook situaties, landelijk, brieven): waarschuwing, zie scripts/jargon.mjs.
for (const m of jargonCheck()) console.warn(`! ${m}`);
console.log(errors ? `${errors} fout(en)` : `✓ ${files.length} gemeente(n) gecontroleerd`);
process.exit(errors ? 1 : 0);
