// Snelle controle van de content zonder volledige build: JSON-syntax, verplichte velden,
// datumvolgorde en dubbele CBS-codes. Het volledige schema wordt afgedwongen door `astro build`.
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const dir = 'src/content/gemeenten';
const files = (await readdir(dir)).filter((f) => f.endsWith('.json'));
const codes = new Map();
let errors = 0;
const today = new Date().toISOString().slice(0, 10);

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
}
console.log(errors ? `${errors} fout(en)` : `✓ ${files.length} gemeente(n) gecontroleerd`);
process.exit(errors ? 1 : 0);
