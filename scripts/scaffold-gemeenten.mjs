// Maakt een kaal gemeentebestand (status 'voorbeeld') voor elke Nederlandse gemeente
// die nog geen bestand heeft in src/content/gemeenten. Bestaande bestanden worden nooit overschreven.
//
// Bron: scripts/data/gemeenten-register.json (uittreksel uit het Register van Overheidsorganisaties,
// organisaties.overheid.nl). Gebruik: npm run scaffold
//
// De kale pagina bevat alleen wat landelijk voor elke gemeente geldt (Jeugdwet) plus de contactgegevens
// van de gemeente uit het register. Alles wat lokaal verschilt (naam van het toegangsteam, klachtenregeling,
// cliëntondersteuning, aanbod) wordt pas ingevuld bij onderzoek; zie CONTENT.md.
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const dir = 'src/content/gemeenten';
const register = JSON.parse(await readFile('scripts/data/gemeenten-register.json', 'utf8'));
const vandaag = new Date().toISOString().slice(0, 10);

const bestaand = new Map();
for (const f of (await readdir(dir)).filter((f) => f.endsWith('.json'))) {
  const d = JSON.parse(await readFile(join(dir, f), 'utf8'));
  bestaand.set(d.cbsCode, f);
}

const slugify = (naam) =>
  naam
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/^'s-/, 's-')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const skelet = (g) => ({
  naam: g.naam,
  cbsCode: g.cbsCode,
  provincie: g.provincie,
  websiteJeugd: g.website,
  toegang: {
    samenvatting: `Voor ${g.naam} is de lokale invulling nog niet onderzocht. Hieronder staat wat landelijk voor elke gemeente geldt: de gemeente heeft een toegangsteam (vaak wijkteam, CJG of jeugdteam genoemd) en de huisarts mag rechtstreeks verwijzen. Zoek op de website van de gemeente op "jeugdhulp" voor de lokale naam en contactgegevens van het toegangsteam.`,
    routes: [
      {
        type: 'wijkteam',
        naam: 'Toegangsteam van de gemeente',
        omschrijving: 'Elke gemeente heeft een team dat aanvragen voor jeugdhulp beoordeelt en een beschikking afgeeft. De lokale naam en werkwijze zijn voor deze gemeente nog niet nagezocht.',
        stappen: [
          `Bel de gemeente of zoek op de website op "jeugdhulp" naar het toegangsteam.`,
          'Vraag om een gesprek; u mag iemand meenemen, bijvoorbeeld een onafhankelijke cliëntondersteuner.',
          'Vraag na het gesprek om een schriftelijk verslag en, bij specialistische hulp, om een beschikking.',
        ],
        contact: {
          naam: `Gemeente ${g.naam}`,
          ...(g.telefoon ? { telefoon: g.telefoon } : {}),
          url: g.website,
        },
      },
      {
        type: 'huisarts',
        naam: 'Via huisarts, jeugdarts of medisch specialist',
        omschrijving: 'Volgens de Jeugdwet mogen huisarts, jeugdarts en medisch specialist rechtstreeks verwijzen naar jeugdhulp die de gemeente heeft ingekocht. Dit is een gelijkwaardige route naast het toegangsteam.',
        stappen: [
          'Bespreek uw zorgen met de huisarts of de jeugdarts van de GGD.',
          'De arts verwijst naar een door de gemeente gecontracteerde aanbieder.',
          'De aanbieder meldt de start van de hulp bij de gemeente; u hoeft zelf geen aanvraag te doen.',
        ],
      },
      {
        type: 'spoed',
        naam: 'Spoedeisende hulp',
        omschrijving: 'Bij onveiligheid of een psychische crisis, buiten de gewone route om. De nummers hieronder gelden overal in Nederland.',
        stappen: [
          'Krijgt uw kind al jeugdhulp? Bel dan eerst de eigen zorgaanbieder.',
          'Kijk op de website van de gemeente onder "spoed" of "crisis" welke crisisdiensten er in uw regio zijn.',
        ],
      },
    ],
  },
  rechten: {
    onafhankelijkeClientondersteuning: {
      naam: 'Onafhankelijke cliëntondersteuning (via de gemeente)',
      toelichting: 'Elke gemeente moet gratis en onafhankelijke cliëntondersteuning aanbieden (Wmo 2015). Wie dit in deze gemeente uitvoert, bijvoorbeeld MEE of Zorgbelang, is nog niet nagezocht. Vraag het toegangsteam ernaar of zoek op de gemeentesite op "cliëntondersteuning".',
    },
    klacht: {
      naam: 'Klacht bij het toegangsteam of de gemeente',
      toelichting: 'Bespreek het eerst met de medewerker. Komt u er niet uit, dan kunt u een klacht indienen bij de gemeente; die moet een klachtenregeling hebben (Algemene wet bestuursrecht). De lokale klachtenregeling van het toegangsteam is nog niet nagezocht.',
      extern: { naam: 'Nationale ombudsman of lokale ombudsman', url: 'https://www.nationaleombudsman.nl/' },
    },
    bezwaar: {
      toelichting: 'Tegen een beschikking (besluit) van de gemeente kunt u binnen 6 weken na verzending bezwaar maken. Het adres staat onderaan het besluit. Daarna staat beroep open bij de rechtbank.',
    },
    pgb: {
      mogelijk: true,
      toelichting: 'Een persoonsgebonden budget is in elke gemeente mogelijk als u kunt uitleggen waarom zorg in natura niet passend is en u het budget kunt beheren (Jeugdwet artikel 8.1.1). De lokale voorwaarden en tarieven zijn nog niet nagezocht.',
    },
    vertrouwenspersoon: {
      naam: 'Jeugdstem (voorheen AKJ)',
      omschrijving: 'Onafhankelijke vertrouwenspersoon voor ouders en jongeren in de jeugdhulp.',
      telefoon: '088 555 1000',
      url: 'https://jeugdstem.nl/',
    },
  },
  aanbod: {
    samenvatting: 'Het lokale aanbod en de lijst van gecontracteerde aanbieders zijn voor deze gemeente nog niet nagezocht.',
    categorieen: [],
  },
  lokaleInitiatieven: [],
  directRegelen: [
    { naam: 'Vertrouwenspersoon Jeugdstem inschakelen', url: 'https://jeugdstem.nl/contact' },
  ],
  meta: {
    laatstGecontroleerd: vandaag,
    status: 'voorbeeld',
    bronnen: [
      { titel: 'Register van Overheidsorganisaties – gemeenten (naam, website, telefoon)', url: 'https://organisaties.overheid.nl/', geraadpleegd: register.geraadpleegd },
    ],
    opmerkingen: `Automatisch aangemaakt op ${vandaag} uit het Register van Overheidsorganisaties. Alleen landelijke regels en de algemene contactgegevens van de gemeente; websiteJeugd is de homepage van de gemeente, niet een jeugdpagina. Nog niet onderzocht: toegangsteam, klachtenregeling, cliëntondersteuning, pgb-voorwaarden, aanbod, lokale initiatieven en ervaringen.`,
  },
});

let n = 0;
for (const g of register.gemeenten) {
  if (bestaand.has(g.cbsCode)) continue;
  if (!g.website || !g.provincie) { console.warn(`! ${g.naam} (${g.cbsCode}) overgeslagen: website of provincie ontbreekt`); continue; }
  const file = join(dir, `${slugify(g.naam)}.json`);
  await writeFile(file, JSON.stringify(skelet(g), null, 2) + '\n');
  n++;
}
console.log(`✓ ${n} kale gemeentebestand(en) aangemaakt, ${bestaand.size} bestonden al`);
