#!/usr/bin/env node
/**
 * Aandeel jeugdhulptrajecten dat via huisarts, jeugdarts of medisch specialist begint (CBS 85097NED).
 * Gebruik: node scripts/onderzoek/cbs-huisarts.mjs GM0200 [jaar]
 * Zonder jaar: het laatste jaar waarvoor de gemeente cijfers heeft.
 * Geeft JSON in de vorm van ervaringen.transparantie.aandeelHuisarts, plus de ruwe aantallen ter controle.
 */
const [code, jaarArg] = process.argv.slice(2);
if (!/^GM\d{4}$/.test(code ?? '')) {
  console.error('Gebruik: node scripts/onderzoek/cbs-huisarts.mjs GM0200 [jaar]');
  process.exit(1);
}
const API = 'https://opendata.cbs.nl/ODataApi/odata/85097NED/TypedDataSet';
const CODES = { huisarts: 'A044133', jeugdarts: 'A044134', specialist: 'A044136', totaal: 'T001376' };

async function cijfers(regio, jaar) {
  const filter = `Perioden eq '${jaar}JJ00' and substringof('${regio}',RegioS)`;
  const url = `${API}?$filter=${encodeURIComponent(filter)}&$select=RegioS,VerwijzerJeugdzorg,TotaalBegonnenTrajecten_2`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`CBS gaf ${res.status}`);
  const rijen = (await res.json()).value.filter((r) => r.RegioS.trim() === regio);
  // null = geheim (CBS onderdrukt kleine aantallen); niet als 0 tellen.
  const per = Object.fromEntries(rijen.map((r) => [r.VerwijzerJeugdzorg.trim(), r.TotaalBegonnenTrajecten_2]));
  if (!per[CODES.totaal]) return null;
  const delen = [per[CODES.huisarts], per[CODES.jeugdarts], per[CODES.specialist]];
  if (delen.some((x) => x == null)) return { geheim: true, totaal: per[CODES.totaal], per };
  const via = delen[0] + delen[1] + delen[2];
  return { via, totaal: per[CODES.totaal], procent: Math.round((100 * via) / per[CODES.totaal]), per };
}

const start = jaarArg ? Number(jaarArg) : new Date().getFullYear();
for (let jaar = start; jaar >= start - 3; jaar--) {
  const gem = await cijfers(code, jaar);
  if (!gem) continue;
  if (gem.geheim) {
    console.error(`${jaar}: CBS houdt de verwijzercijfers voor ${code} geheim (totaal ${gem.totaal} trajecten). Geen aandeelHuisarts opnemen; meld het in meta.opmerkingen.`);
    process.exit(2);
  }
  const nl = await cijfers('NL01', jaar);
  console.log(JSON.stringify({
    aandeelHuisarts: {
      percentage: gem.procent,
      jaar: String(jaar),
      url: 'https://opendata.cbs.nl/#/CBS/nl/dataset/85097NED/table',
      landelijk: nl?.procent,
    },
    controle: { gemeente: `${gem.via} van ${gem.totaal}`, landelijk: nl ? `${nl.via} van ${nl.totaal}` : null },
  }, null, 2));
  process.exit(0);
}
console.error(`Geen CBS-cijfers gevonden voor ${code}`);
process.exit(1);
