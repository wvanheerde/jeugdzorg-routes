#!/usr/bin/env node
/**
 * Schrijft public/downloads/dagboek-zorg-twee-weken.docx: een invulbaar dagboek van twee weken
 * voor ouders die dubbele kinderbijslag of andere hulp aanvragen (zie landelijk/05-financieel.md).
 * Geen afhankelijkheden: het script bouwt de Word-XML en de zip zelf. Draai opnieuw na een tekstwijziging:
 *   node scripts/dagboek-docx.mjs
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { deflateRawSync, crc32 } from 'node:zlib';
import dagboek from './data/dagboek.json' with { type: 'json' };

const UIT = 'public/downloads/dagboek-zorg-twee-weken.docx';
const DAGEN = 14;

// ---------- Word-XML ----------

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Externe links in het document; elk adres krijgt een relatie in word/_rels/document.xml.rels.
const links = [];
const linkId = (url) => {
  if (!links.includes(url)) links.push(url);
  return `rIdLink${links.indexOf(url) + 1}`;
};

/** Tekst met **vet** en [link](https://…) erin naar runs. */
function runs(tekst, { size, kleur } = {}) {
  return tekst
    .split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/)
    .filter(Boolean)
    .map((deel) => {
      const link = deel.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (link) {
        const rPr = `<w:color w:val="1F4E5F"/><w:u w:val="single"/>${size ? `<w:sz w:val="${size}"/><w:szCs w:val="${size}"/>` : ''}`;
        return `<w:hyperlink r:id="${linkId(link[2])}"><w:r><w:rPr>${rPr}</w:rPr><w:t xml:space="preserve">${esc(link[1])}</w:t></w:r></w:hyperlink>`;
      }
      const vet = deel.startsWith('**');
      const t = vet ? deel.slice(2, -2) : deel;
      const rPr = [vet && '<w:b/>', kleur && `<w:color w:val="${kleur}"/>`, size && `<w:sz w:val="${size}"/><w:szCs w:val="${size}"/>`]
        .filter(Boolean)
        .join('');
      return `<w:r>${rPr ? `<w:rPr>${rPr}</w:rPr>` : ''}<w:t xml:space="preserve">${esc(t)}</w:t></w:r>`;
    })
    .join('');
}

function p(tekst = '', { stijl, size, kleur, na, pageBreakBefore, keepNext } = {}) {
  const pPr = [
    stijl && `<w:pStyle w:val="${stijl}"/>`,
    keepNext && '<w:keepNext/>',
    pageBreakBefore && '<w:pageBreakBefore/>',
    na !== undefined && `<w:spacing w:after="${na}"/>`,
  ]
    .filter(Boolean)
    .join('');
  return `<w:p>${pPr ? `<w:pPr>${pPr}</w:pPr>` : ''}${runs(tekst, { size, kleur })}</w:p>`;
}

const h1 = (t, opts = {}) => p(t, { stijl: 'Heading1', ...opts });
const h2 = (t) => p(t, { stijl: 'Heading2' });
const bullet = (t) => `<w:p><w:pPr><w:pStyle w:val="ListParagraph"/><w:numPr><w:ilvl w:val="0"/><w:numId w:val="1"/></w:numPr></w:pPr>${runs(t)}</w:p>`;

const BREEDTE = 9638; // A4 min marges van 2 cm, in twips

/**
 * Tabel. kolommen = [{ kop, breedte (deel van 1) }]; rijen = arrays met celtekst ('' = leeg invulvak).
 * hoogte = minimale rijhoogte in twips, zodat er ruimte is om te schrijven.
 */
function tabel(kolommen, rijen, { hoogte = 480, eersteKolomGrijs = true } = {}) {
  const w = kolommen.map((k) => Math.round(k.breedte * BREEDTE));
  const cel = (inhoud, i, { kop = false, grijs = false } = {}) => {
    const shd = kop ? '<w:shd w:val="clear" w:color="auto" w:fill="1F4E5F"/>' : grijs ? '<w:shd w:val="clear" w:color="auto" w:fill="EEF3F4"/>' : '';
    const regels = String(inhoud).split('\n');
    const ps = regels.map((r) => p(r, { size: kop ? 20 : 20, kleur: kop ? 'FFFFFF' : undefined, na: 0 })).join('');
    return `<w:tc><w:tcPr><w:tcW w:w="${w[i]}" w:type="dxa"/>${shd}</w:tcPr>${ps}</w:tc>`;
  };
  const kopRij = `<w:tr><w:trPr><w:tblHeader/><w:cantSplit/></w:trPr>${kolommen.map((k, i) => cel(`**${k.kop}**`, i, { kop: true })).join('')}</w:tr>`;
  const body = rijen
    .map(
      (r) =>
        `<w:tr><w:trPr><w:cantSplit/><w:trHeight w:val="${hoogte}"/></w:trPr>${r
          .map((c, i) => cel(c, i, { grijs: eersteKolomGrijs && i === 0 }))
          .join('')}</w:tr>`,
    )
    .join('');
  const rand = ['top', 'left', 'bottom', 'right', 'insideH', 'insideV'].map((z) => `<w:${z} w:val="single" w:sz="4" w:space="0" w:color="9DB3B9"/>`).join('');
  return `<w:tbl><w:tblPr><w:tblW w:w="${BREEDTE}" w:type="dxa"/><w:tblBorders>${rand}</w:tblBorders><w:tblLayout w:type="fixed"/><w:tblCellMar><w:top w:w="60" w:type="dxa"/><w:left w:w="100" w:type="dxa"/><w:bottom w:w="60" w:type="dxa"/><w:right w:w="100" w:type="dxa"/></w:tblCellMar></w:tblPr><w:tblGrid>${w
    .map((x) => `<w:gridCol w:w="${x}"/>`)
    .join('')}</w:tblGrid>${kopRij}${body}</w:tbl>${p('', { size: 8, na: 0 })}`;
}

// ---------- Inhoud ----------

// Onderdelen, volgorde en namen zijn gelijk aan het CIZ-vragenformulier (versie CIZ-Buk.VF.26mei2023), onderdeel 6 en 7.
// "telt" en "niet" zijn het CIZ-beoordelingskader DKIZ (februari 2025) in gewone taal: "score 1" en "geen score" per functie.
// Verandert het CIZ formulier of kader, pas dan deze lijsten aan, en ook "Dit schrijft u op" in landelijk/05-financieel.md.
const CIZ_FORMULIER = 'https://www.ciz.nl/download-vragenformulier-dkiz';
const CIZ_KADER = 'https://ciz.nl/beoordelingskader-dubbele-kinderbijslag';
const VERZORGING = [
  {
    naam: 'Lichaamshygiëne',
    telt: 'U moet (bijna) alles voor uw kind doen: wassen, aankleden, tanden poetsen. Of uw kind kan het wel zelf, maar alleen als u er de hele tijd bij blijft en zegt wat het moet doen.',
    niet: 'Uw kind doet het grotendeels zelf. U geeft af en toe uitleg, spoort aan of controleert achteraf.',
  },
  {
    naam: 'Zindelijkheid',
    telt: "Uw kind is overdag én 's nachts niet zindelijk. Of u moet bij elk wc-bezoek de hele tijd bij uw kind blijven.",
    niet: "Alleen 's nachts een luier. Regelmatig een ongelukje. Hulp bij afvegen of bij de menstruatie. Herinneren dat het naar de wc moet.",
  },
  {
    naam: 'Eten en drinken',
    telt: 'Sondevoeding. U moet helpen met eten. Een eetstoornis die een kinderarts of psychiater vaststelde en die langer dan een jaar duurt. Altijd erbij blijven omdat uw kind zich kan verslikken. De hele dag letten op wat uw kind eet, door een medisch dieet of diabetes, of door een psychiatrische aandoening of gedragsproblemen.',
    niet: 'Af en toe aansporen of afremmen. Aangepast bestek of servies. U maakt het eten klaar, maar uw kind eet zelf.',
  },
  {
    naam: 'Mobiliteit (lopen)',
    telt: 'Uw kind kan niet lopen. Of het zit in een rolstoel en heeft hulp nodig bij verplaatsen en overstappen. Of het kan alleen lopen als iemand steeds helpt. Of het heeft buiten altijd een rolstoel nodig die iemand duwt, omdat het te weinig energie heeft.',
    niet: 'Uw kind rijdt zelf in de rolstoel. Of het loopt in huis zelf en heeft alleen voor lange stukken een rolstoel nodig. Gedrag of slecht zien of horen telt hier niet.',
  },
  {
    naam: 'Medische verzorging',
    telt: 'Langer dan een jaar veel verpleging thuis. Bijvoorbeeld: de hele dag letten op ademhaling, slikken of bewustzijn en meteen ingrijpen. Of de hele dag in de buurt zijn voor handelingen zoals zuurstof, beademing, infuus, canule of katheter. Of een dieet van de arts dat veel tijd kost om klaar te maken. **Bij heel intensieve medische zorg kan dit onderdeel alleen al genoeg zijn.**',
    niet: 'Elke dag medicijnen geven of controleren. Oefeningen van de fysiotherapeut. Elke dag de huid verzorgen. Een keer per maand naar het ziekenhuis. Kant-en-klare sondevoeding.',
  },
];
const OPPASSING = [
  {
    naam: 'Gedrag',
    telt: 'Iemand moet de hele dag opletten, omdat er steeds gedragsproblemen kunnen ontstaan. U moet ingrijpen, omdat uw kind zijn gedrag zelf niet kan regelen. Er is een diagnose van bijvoorbeeld een kinderpsychiater of gedragsdeskundige.',
    niet: 'Ernstige gedragsproblemen, maar u hoeft niet de hele dag op te letten. Alleen reacties op een situatie, of gedrag dat bij de puberteit hoort.',
  },
  {
    naam: 'Communicatie (praten)',
    telt: 'Uw kind kan niet praten. Of alleen u begrijpt wat het zegt. Of het praat met losse woorden of gebaren. Of het reageert bijna nooit op vragen. Of het begrijpt anderen (bijna) niet.',
    niet: 'Anderen begrijpen uw kind. Uw kind gebruikt gebarentaal. Problemen met lezen of schrijven tellen hier niet.',
  },
  {
    naam: 'Alleen thuis zijn',
    telt: 'Uw kind kan niet langer dan 30 minuten alleen thuis zijn, door zijn ziekte of stoornis. Het gaat om wat uw kind kán, niet om wat u toestaat.',
    niet: "Uw kind kan langer dan 30 minuten alleen zijn. Ook als dat alleen overdag lukt en 's avonds niet.",
  },
  {
    naam: 'Begeleiding buitenshuis',
    telt: 'Uw kind kan niet alleen naar buiten. Of het kan alleen in een afgesloten tuin spelen. Of alleen buiten als u het de hele tijd kunt zien. Ook opletten op afstand telt, bijvoorbeeld met een gps-tracker.',
    niet: 'Uw kind speelt in de buurt en u kijkt af en toe. Het kan niet veilig alleen aan het verkeer meedoen. Het gaat zelf naar vriendjes, school of club.',
  },
  {
    naam: 'Bezighouden, handreikingen',
    telt: 'Uw kind heeft de hele dag een vaste indeling nodig, met steeds persoonlijke aandacht. Het kan zich helemaal niet alleen bezighouden. U moet alles in huis regelen en begeleiden. Het leven van uw gezin is helemaal aangepast.',
    niet: 'Uw kind heeft structuur en voorbereiding nodig, maar kan zich ook een tijdje alleen vermaken. Af en toe uitleg of geruststelling.',
  },
];

const ZORGKOLOMMEN = [
  { kop: 'Onderdeel', breedte: 0.28 },
  { kop: 'Wat deed u extra?', breedte: 0.36 },
  { kop: 'Hoe vaak?', breedte: 0.14 },
  { kop: 'Erbij blijven?', breedte: 0.22 },
];
// Het CIZ telt geen minuten, maar kijkt of een ouder erbij moet blijven of af en toe kijken genoeg is.
const ERBIJ = '☐ hele tijd  ☐ even';

function dagpagina(n) {
  return [
    h1(`Dag ${n}`, { pageBreakBefore: true }),
    tabel(
      [
        { kop: 'Datum', breedte: 0.3 },
        { kop: 'Wat voor dag was het?', breedte: 0.7 },
      ],
      [['', dagboek.soortenDag.map((d) => `☐ ${d}`).join('     ')]],
      { hoogte: 480, eersteKolomGrijs: false },
    ),
    h2('Verzorging'),
    tabel(
      ZORGKOLOMMEN,
      VERZORGING.map((o) => [o.naam, '', '', ERBIJ]),
    ),
    h2('Oppassing (toezicht)'),
    tabel(
      ZORGKOLOMMEN,
      OPPASSING.map((o) => [o.naam, '', '', ERBIJ]),
    ),
    h2('De nacht'),
    tabel(
      [
        { kop: 'Keer wakker', breedte: 0.2 },
        { kop: 'Wat deed u?', breedte: 0.6 },
        { kop: 'Hoe lang?', breedte: 0.2 },
      ],
      [['', '', '']],
      { hoogte: 700, eersteKolomGrijs: false },
    ),
    h2('Moeilijke momenten'),
    tabel(
      [
        { kop: 'Hoe laat?', breedte: 0.12 },
        { kop: 'Wat gebeurde er?', breedte: 0.4 },
        { kop: 'Wat deed u?', breedte: 0.33 },
        { kop: 'Hoe lang?', breedte: 0.15 },
      ],
      [
        ['', '', '', ''],
        ['', '', '', ''],
      ],
      { hoogte: 600, eersteKolomGrijs: false },
    ),
    h2('Wat wilt u nog kwijt over vandaag?'),
    tabel([{ kop: 'Bijvoorbeeld: wat het met u of het gezin deed', breedte: 1 }], [['']], {
      hoogte: 700,
      eersteKolomGrijs: false,
    }),
  ].join('');
}

const intro = [
  p('Dagboek: de zorg voor mijn kind in twee weken', { stijl: 'Title' }),
  p(
    'Vraagt u dubbele kinderbijslag aan, of andere hulp voor uw kind? Dan wil de beoordelaar weten hoeveel **extra** zorg uw kind nodig heeft. Dat is zorg die een ander kind van dezelfde leeftijd niet nodig heeft. Met dit dagboek schrijft u twee weken lang op wat u elke dag doet. Dan hoeft u later niet uit uw geheugen te putten.',
  ),
  p(
    `**Dit dagboek is een hulpmiddel. Het is geen formulier van het CIZ of de SVB.** Invullen is niet verplicht. Voor dubbele kinderbijslag vult u het [vragenformulier van het CIZ](${CIZ_FORMULIER}) in. De onderdelen in dit dagboek hebben dezelfde namen als in dat formulier. Wat u hier opschrijft, kunt u gebruiken bij de vakken **Uitleg** in het formulier.`,
  ),
  h2('Zo vult u het in'),
  bullet('Vul elke dag één pagina in, op de computer of op papier. Liefst dezelfde dag, of de ochtend erna.'),
  bullet('Schrijf alleen op wat u **extra** doet. Het gewone werk van ouders hoeft er niet in.'),
  bullet('Schrijf op wat u echt doet. Ook wat voor u gewoon is geworden. Maak het niet kleiner dan het is.'),
  bullet(
    'Kruis bij **Erbij blijven?** aan of u de hele tijd bij uw kind moest blijven, of dat even kijken genoeg was. Dat vindt het CIZ belangrijk. Vult u het in op de computer? Wis dan het antwoord dat niet past.',
  ),
  bullet('Ging er een onderdeel goed die dag? Laat het vak dan leeg.'),
  bullet('Vul ook de betere dagen in. Ook dan doet u vaak meer dan andere ouders.'),
  h2('Voorbeeld van één regel'),
  tabel(ZORGKOLOMMEN, [
    [
      'Lichaamshygiëne',
      'Kleding klaarleggen en stap voor stap zeggen wat ze moet doen. Ze raakt in paniek van de sokken, ik trek ze aan.',
      '2 keer',
      '☒ hele tijd  ☐ even',
    ],
    ['Gedrag', 'Woedeaanval na school. Bij haar blijven tot ze rustig was, broertje uit de kamer gehaald.', '1 keer', '☒ hele tijd  ☐ even'],
  ]),
  h2('Over uw kind'),
  tabel(
    [
      { kop: 'Vraag', breedte: 0.35 },
      { kop: 'Antwoord', breedte: 0.65 },
    ],
    [
      ['Naam van uw kind', ''],
      ['Leeftijd', ''],
      ['Diagnose of klachten (als u die weet)', ''],
      ['Begin- en einddatum van het dagboek', ''],
      ['Wie zorgt er voor uw kind? (u, partner, opa en oma, oppas)', ''],
    ],
  ),
  p(
    'Achterin staat een pagina om de twee weken samen te vatten. Stuur het dagboek mee met uw aanvraag, of neem het mee naar het gesprek. Laat iemand meelezen als u dat fijn vindt, bijvoorbeeld een cliëntondersteuner, Balans of Per Saldo.',
  ),
].join('');

const UITLEGKOLOMMEN = [
  { kop: 'Onderdeel', breedte: 0.2 },
  { kop: 'Het CIZ telt dit mee als ...', breedte: 0.46 },
  { kop: 'Meestal niet genoeg', breedte: 0.34 },
];
const onderdelen = [
  h1('Hoe beslist het CIZ?', { pageBreakBefore: true }),
  p(`Het CIZ gebruikt een [beoordelingskader](${CIZ_KADER}). Hier staat in gewone woorden wat daarin staat. Het CIZ kijkt in twee stappen:`),
  bullet(
    '**Heeft uw kind een ziekte of stoornis?** Een arts of behandelaar moet dat hebben vastgesteld, bijvoorbeeld een kinderarts of psychiater. Stuur die brief mee. Zonder vastgestelde ziekte of stoornis is het advies van het CIZ negatief.',
  ),
  bullet(
    '**Hoeveel zorg heeft uw kind nodig?** Het CIZ kijkt naar tien onderdelen: vijf voor verzorging en vijf voor oppassing (toezicht). Bij elk onderdeel beslist het CIZ: telt dit mee, ja of nee.',
  ),
  p('Hoeveel onderdelen moeten meetellen? Dat hangt af van de leeftijd van uw kind:'),
  tabel(
    [
      { kop: 'Leeftijd van uw kind', breedte: 0.5 },
      { kop: 'Aantal onderdelen dat moet meetellen', breedte: 0.5 },
    ],
    [
      ['3 tot en met 5 jaar', '5'],
      ['6 tot en met 9 jaar', '4'],
      ['10 tot en met 17 jaar', '3'],
    ],
    { hoogte: 400 },
  ),
  h2('Waar let het CIZ op?'),
  bullet('**Moet u erbij blijven, of is af en toe kijken genoeg?** Dat maakt bij bijna elk onderdeel het verschil. Schrijf het daarom steeds op.'),
  bullet(
    '**Het CIZ telt geen minuten.** Daarom vraagt dit dagboek niet hoeveel minuten elk onderdeel kost. Bij de nacht en moeilijke momenten schrijft u wel op hoe lang het duurde.',
  ),
  bullet('**Het gaat om wat uw kind kán.** Niet om wat u uw kind (nog) niet laat doen.'),
  bullet('**Het gaat om zorg die blijft.** Een korte moeilijke periode telt niet.'),
  p(
    'Op de volgende pagina\'s staat per onderdeel wat meetelt. Herkent u uw kind niet precies? Schrijf toch op wat u doet, en vraag het toch aan. Het CIZ beslist. Ook de voorbeelden bij "meestal niet genoeg" zijn geen harde regels.',
  ),
  h1('Wat telt mee? Verzorging', { pageBreakBefore: true }),
  tabel(
    UITLEGKOLOMMEN,
    VERZORGING.map((o) => [`**${o.naam}**`, o.telt, o.niet]),
  ),
  h1('Wat telt mee? Oppassing (toezicht)', { pageBreakBefore: true }),
  tabel(
    UITLEGKOLOMMEN,
    OPPASSING.map((o) => [`**${o.naam}**`, o.telt, o.niet]),
  ),
  h2('De nacht en moeilijke momenten'),
  p(
    "Op elke dagpagina staan ook vakken voor de nacht en voor moeilijke momenten. Het CIZ vraagt daar niet apart naar. Schrijf het op bij het onderdeel waar het bij hoort. Bijvoorbeeld: een luier 's nachts hoort bij zindelijkheid, een woedeaanval bij gedrag. Past het nergens? Schrijf het dan bij **Overige informatie** in het formulier.",
  ),
].join('');

const samenvatting = [
  h1('Samenvatting van de twee weken', { pageBreakBefore: true }),
  p(
    `Tel per onderdeel op hoeveel dagen uw kind hulp nodig had. En hoe vaak u de hele tijd erbij moest blijven. Gebruik de getallen en voorbeelden bij de vakken **Uitleg** in het [vragenformulier van het CIZ](${CIZ_FORMULIER}). Bijvoorbeeld: "Bij aankleden moest ik 13 van de 14 dagen de hele tijd erbij blijven."`,
  ),
  tabel(
    [
      { kop: 'Onderdeel', breedte: 0.34 },
      { kop: 'Op hoeveel van de 14 dagen nodig?', breedte: 0.33 },
      { kop: 'Hoe vaak de hele tijd erbij?', breedte: 0.33 },
    ],
    [...VERZORGING, ...OPPASSING].map((o) => [o.naam, '', '']),
    { hoogte: 440 },
  ),
  tabel(
    [
      { kop: 'Vraag', breedte: 0.55 },
      { kop: 'Antwoord', breedte: 0.45 },
    ],
    [
      ['Hoeveel slechte dagen waren er?', ''],
      ['Hoeveel nachten was uw kind wakker en had het u nodig?', ''],
      ['Hoe lang was u in die nachten bij elkaar wakker?', ''],
      ['Hoeveel moeilijke momenten waren er?', ''],
      ['Waren deze twee weken gewoon voor uw kind, of juist beter of zwaarder dan anders?', ''],
    ],
  ),
  h2('Wat wilt u de beoordelaar nog vertellen?'),
  tabel([{ kop: 'Bijvoorbeeld: wat er gebeurt als u er niet bent, of wat u al lang niet meer kunt doen', breedte: 1 }], [['']], {
    hoogte: 2400,
    eersteKolomGrijs: false,
  }),
  p('Dit dagboek komt van Jeugdzorg Routes (www.jeugdzorg-routes.nl). U mag het delen en aanpassen, niet commercieel (licentie CC BY-NC-SA 4.0).', {
    size: 18,
    kleur: '5A6B70',
  }),
].join('');

const sectPr =
  '<w:sectPr><w:footerReference w:type="default" r:id="rIdFooter"/><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1134" w:header="567" w:footer="567" w:gutter="0"/></w:sectPr>';

const NS =
  'xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"';

const document = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document ${NS}><w:body>${intro}${onderdelen}${Array.from({ length: DAGEN }, (_, i) => dagpagina(i + 1)).join('')}${samenvatting}${sectPr}</w:body></w:document>`;

const styles = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles ${NS}>
<w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri" w:cs="Calibri" w:eastAsia="Calibri"/><w:sz w:val="22"/><w:szCs w:val="22"/><w:lang w:val="nl-NL"/></w:rPr></w:rPrDefault><w:pPrDefault><w:pPr><w:spacing w:after="120" w:line="264" w:lineRule="auto"/></w:pPr></w:pPrDefault></w:docDefaults>
<w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/></w:style>
<w:style w:type="paragraph" w:styleId="Title"><w:name w:val="Title"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:pPr><w:spacing w:after="240"/></w:pPr><w:rPr><w:b/><w:color w:val="1F4E5F"/><w:sz w:val="40"/><w:szCs w:val="40"/></w:rPr></w:style>
<w:style w:type="paragraph" w:styleId="Heading1"><w:name w:val="heading 1"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:pPr><w:keepNext/><w:spacing w:before="0" w:after="100"/><w:outlineLvl w:val="0"/></w:pPr><w:rPr><w:b/><w:color w:val="1F4E5F"/><w:sz w:val="32"/><w:szCs w:val="32"/></w:rPr></w:style>
<w:style w:type="paragraph" w:styleId="Heading2"><w:name w:val="heading 2"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:pPr><w:keepNext/><w:spacing w:before="120" w:after="60"/><w:outlineLvl w:val="1"/></w:pPr><w:rPr><w:b/><w:color w:val="1F4E5F"/><w:sz w:val="24"/><w:szCs w:val="24"/></w:rPr></w:style>
<w:style w:type="paragraph" w:styleId="ListParagraph"><w:name w:val="List Paragraph"/><w:basedOn w:val="Normal"/><w:pPr><w:spacing w:after="60"/><w:ind w:left="360" w:hanging="360"/></w:pPr></w:style>
<w:style w:type="paragraph" w:styleId="Footer"><w:name w:val="footer"/><w:basedOn w:val="Normal"/><w:pPr><w:jc w:val="center"/><w:spacing w:after="0"/></w:pPr><w:rPr><w:color w:val="5A6B70"/><w:sz w:val="18"/><w:szCs w:val="18"/></w:rPr></w:style>
</w:styles>`;

const numbering = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:numbering ${NS}><w:abstractNum w:abstractNumId="0"><w:lvl w:ilvl="0"><w:start w:val="1"/><w:numFmt w:val="bullet"/><w:lvlText w:val="•"/><w:lvlJc w:val="left"/><w:pPr><w:ind w:left="360" w:hanging="360"/></w:pPr></w:lvl></w:abstractNum><w:num w:numId="1"><w:abstractNumId w:val="0"/></w:num></w:numbering>`;

const footer = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:ftr ${NS}><w:p><w:pPr><w:pStyle w:val="Footer"/></w:pPr><w:r><w:t xml:space="preserve">Dagboek zorg voor mijn kind – pagina </w:t></w:r><w:r><w:fldChar w:fldCharType="begin"/></w:r><w:r><w:instrText xml:space="preserve"> PAGE </w:instrText></w:r><w:r><w:fldChar w:fldCharType="separate"/></w:r><w:r><w:t>1</w:t></w:r><w:r><w:fldChar w:fldCharType="end"/></w:r></w:p></w:ftr>`;

const contentTypes = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/><Override PartName="/word/numbering.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml"/><Override PartName="/word/footer1.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml"/><Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/></Types>`;

const rels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/></Relationships>`;

const docRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rIdStyles" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/><Relationship Id="rIdNum" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/numbering" Target="numbering.xml"/><Relationship Id="rIdFooter" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/footer" Target="footer1.xml"/>${links
  .map(
    (url, i) =>
      `<Relationship Id="rIdLink${i + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink" Target="${esc(url)}" TargetMode="External"/>`,
  )
  .join('')}</Relationships>`;

const core = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:title>Dagboek: de zorg voor mijn kind in twee weken</dc:title><dc:creator>Jeugdzorg Routes</dc:creator><dc:language>nl-NL</dc:language></cp:coreProperties>`;

// ---------- Zip (deflate, vaste datum zodat de uitvoer niet bij elke run verandert) ----------

function zip(bestanden) {
  const lokaal = [];
  const centraal = [];
  let offset = 0;
  const DOS_TIJD = 0;
  const DOS_DATUM = ((2026 - 1980) << 9) | (1 << 5) | 1;
  for (const [naam, inhoud] of bestanden) {
    const data = Buffer.from(inhoud, 'utf8');
    const comp = deflateRawSync(data, { level: 9 });
    const crc = crc32(data);
    const naamBuf = Buffer.from(naam, 'utf8');
    const kop = Buffer.alloc(30);
    kop.writeUInt32LE(0x04034b50, 0);
    kop.writeUInt16LE(20, 4);
    kop.writeUInt16LE(0x0800, 6);
    kop.writeUInt16LE(8, 8);
    kop.writeUInt16LE(DOS_TIJD, 10);
    kop.writeUInt16LE(DOS_DATUM, 12);
    kop.writeUInt32LE(crc, 14);
    kop.writeUInt32LE(comp.length, 18);
    kop.writeUInt32LE(data.length, 22);
    kop.writeUInt16LE(naamBuf.length, 26);
    lokaal.push(kop, naamBuf, comp);
    const c = Buffer.alloc(46);
    c.writeUInt32LE(0x02014b50, 0);
    c.writeUInt16LE(20, 4);
    c.writeUInt16LE(20, 6);
    c.writeUInt16LE(0x0800, 8);
    c.writeUInt16LE(8, 10);
    c.writeUInt16LE(DOS_TIJD, 12);
    c.writeUInt16LE(DOS_DATUM, 14);
    c.writeUInt32LE(crc, 16);
    c.writeUInt32LE(comp.length, 20);
    c.writeUInt32LE(data.length, 24);
    c.writeUInt16LE(naamBuf.length, 28);
    c.writeUInt32LE(offset, 42);
    centraal.push(c, naamBuf);
    offset += kop.length + naamBuf.length + comp.length;
  }
  const cd = Buffer.concat(centraal);
  const eind = Buffer.alloc(22);
  eind.writeUInt32LE(0x06054b50, 0);
  eind.writeUInt16LE(bestanden.length, 8);
  eind.writeUInt16LE(bestanden.length, 10);
  eind.writeUInt32LE(cd.length, 12);
  eind.writeUInt32LE(offset, 16);
  return Buffer.concat([...lokaal, cd, eind]);
}

mkdirSync('public/downloads', { recursive: true });
writeFileSync(
  UIT,
  zip([
    ['[Content_Types].xml', contentTypes],
    ['_rels/.rels', rels],
    ['word/document.xml', document],
    ['word/_rels/document.xml.rels', docRels],
    ['word/styles.xml', styles],
    ['word/numbering.xml', numbering],
    ['word/footer1.xml', footer],
    ['docProps/core.xml', core],
  ]),
);
console.log(`Geschreven: ${UIT}`);
