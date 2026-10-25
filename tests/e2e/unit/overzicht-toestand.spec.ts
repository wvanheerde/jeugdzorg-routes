/**
 * Mijn overzicht (src/lib/overzicht-toestand.ts): wat zichtbaar is bij welke keuzes, zonder browser. De situaties en vragen hieronder
 * zijn een vast, verzonnen setje met de kenmerken waar het om gaat (lichte start, ingeklapte aanvraag, begin bij school …), zodat de
 * tests niet afhangen van inhoud die per onderzoeksronde verandert.
 */
import { test, expect } from '@playwright/test';
import { toestand, type Keuze, type OverzichtGegevens } from '../../../src/lib/overzicht-toestand';
import type { SituatieData, KnelpuntData } from '../../../src/lib/paginadata';

const sit = (x: Partial<SituatieData>): SituatieData => ({
  voorrang: 2000,
  start: 'wijkteam',
  themas: [],
  hulpsoorten: [],
  routes: ['wijkteam'],
  landelijk: [],
  licht: false,
  jgz: false,
  inklap: false,
  rang: false,
  gelijk: false,
  ...x,
});
const kp = (x: Partial<KnelpuntData>): KnelpuntData => ({
  onderdelen: [],
  landelijk: [],
  zonderGemeente: false,
  wijkteamBovenaan: false,
  situaties: true,
  ...x,
});

const gegevens: OverzichtGegevens = {
  situaties: {
    onveilig: sit({ voorrang: 1, inklap: true, themas: ['veiligheid'] }),
    school: sit({ voorrang: 2003, start: 'school', routes: ['school', 'wijkteam'], inklap: true, themas: ['onderwijs-x'] }),
    gedrag: sit({ voorrang: 2004, routes: ['wijkteam', 'huisarts'], themas: ['gedrag'], hulpsoorten: ['ambulant'], landelijk: ['l-gedrag'], rang: true }),
    adhd: sit({
      voorrang: 2010,
      start: 'huisarts of wijkteam',
      routes: ['huisarts', 'wijkteam'],
      gelijk: true,
      themas: ['adhd'],
      hulpsoorten: ['behandeling'],
      rang: true,
    }),
    scheiding: sit({ voorrang: 3005, licht: true, inklap: true, themas: ['scheiding'] }),
    slaap: sit({ voorrang: 3008, start: 'huisarts', routes: ['huisarts', 'wijkteam'], licht: true, jgz: true, inklap: true }),
  },
  knelpunten: {
    beginnen: kp({ onderdelen: ['toegang', 'aanbieders', 'clientondersteuning'], landelijk: ['l-aanvragen'], wijkteamBovenaan: true }),
    spoed: kp({ onderdelen: ['spoed'] }),
    'hulp-stopt': kp({ onderdelen: ['bezwaar', 'klacht'] }),
    wachten: kp({ onderdelen: ['toegang', 'aanbieders', 'postadres', 'klacht'], situaties: false }),
    afgewezen: kp({ onderdelen: ['bezwaar'] }),
    kinderbijslag: kp({ zonderGemeente: true, wijkteamBovenaan: true }),
    'zorgen-om-kind': kp({ wijkteamBovenaan: true }),
    'wordt-18': kp({ wijkteamBovenaan: true }),
  },
  namen: {
    s: { adhd: 'ADHD', gedrag: 'Gedragsproblemen' },
    k: { wachten: 'Wij wachten te lang' },
    g: { apeldoorn: 'Apeldoorn' },
    l: { '4-12': '4 tot 12 jaar' },
  },
};

const met = (k: Partial<Keuze> = {}, antwoorden: { reden?: string; wachtOp?: string } = {}) =>
  toestand({ sel: [], gem: '', kp: '', lf: '', ...k }, { reden: '', wachtOp: '', ...antwoorden }, gegevens);

test.describe('welke vraag geldt', () => {
  test('zonder keuzes geen vraag; met een situatie of gemeente "Ik wil hulp aanvragen"', () => {
    expect(met().kpActive).toBe('');
    expect(met({ gem: '_overig' }).kpActive).toBe('');
    expect(met({ gem: 'apeldoorn' }).kpActive).toBe('beginnen');
    expect(met({ sel: ['adhd'] }).kpActive).toBe('beginnen');
  });
  test('een onbekende vraag of situatie telt niet mee', () => {
    const t = met({ kp: 'bestaat-niet', sel: ['bestaat-niet', 'adhd'] });
    expect(t.kpGekozen).toBe('');
    expect(t.kpActive).toBe('beginnen');
    expect(t.active).toEqual(['adhd']);
  });
  test('de samenvatting: gemeente, vraag, situaties, leeftijd', () => {
    expect(met({ gem: 'apeldoorn', kp: 'wachten', sel: ['gedrag', 'adhd'], lf: '4-12' }).samenvatting).toBe(
      'Apeldoorn · Wij wachten te lang · Gedragsproblemen · ADHD · 4 tot 12 jaar',
    );
  });
  test('de landelijke rechten van de situaties en van de vraag samen', () => {
    expect([...met({ sel: ['gedrag'] }).land].sort()).toEqual(['l-aanvragen', 'l-gedrag']);
  });
});

test.describe('voorrang bij meer situaties', () => {
  test('de volgorde van kiezen verandert niets', () => {
    expect(met({ sel: ['adhd', 'school'] }).voorop).toBe('school');
    expect(met({ sel: ['school', 'adhd'] }).voorop).toBe('school');
    expect(met({ sel: ['scheiding', 'onveilig'] }).voorop).toBe('onveilig');
  });
  test('begint een andere situatie ergens anders, dan noemt stap 1 die ingang ook', () => {
    const t = met({ sel: ['school', 'gedrag'] });
    expect(t.ook).toEqual(['gedrag']);
    expect(t.startTypes).toEqual(['school', 'wijkteam']);
    expect(t.wijkteamGelijk).toBe(true);
  });
  test('zelfde begin: geen tweede ingang', () => {
    expect(met({ sel: ['onveilig', 'gedrag'] }).ook).toEqual([]);
  });
});

test.describe('lichte start en ingeklapte aanvraag', () => {
  test('lichte start: alleen de toegang, aanvraag ingeklapt', () => {
    const t = met({ sel: ['scheiding'] });
    expect(t.licht).toBe(true);
    expect(t.inklap).toBe(true);
    expect(t.onderdelen).toEqual(['toegang']);
    expect(t.jgzVoorop).toBe(false);
  });
  test('lichte start bij de jeugdgezondheidszorg: JGZ voorop', () => {
    expect(met({ sel: ['slaap'] }).jgzVoorop).toBe(true);
  });
  test('lichte start geldt alleen bij "Ik wil hulp aanvragen"', () => {
    expect(met({ sel: ['scheiding'], kp: 'wachten' }).licht).toBe(false);
  });
  test('vraagt een andere situatie wel om een aanvraag, dan staat de aanvraag open', () => {
    expect(met({ sel: ['onveilig'] }).inklap).toBe(true);
    expect(met({ sel: ['onveilig', 'gedrag'] }).inklap).toBe(false);
  });
  test('begint de situatie bij school, dan nog geen aanbieders kiezen', () => {
    expect(met({ sel: ['school'] }).onderdelen).toEqual(['toegang', 'clientondersteuning']);
  });
});

test.describe('onderdelen bij de antwoorden in de verdieping', () => {
  test('"De hulp stopt" om een andere reden dan de gemeente: geen bezwaar', () => {
    expect(met({ kp: 'hulp-stopt' }, { reden: 'aanbieder' }).onderdelen).toEqual(['klacht']);
    expect(met({ kp: 'hulp-stopt' }, { reden: 'gemeente' }).onderdelen).toEqual(['bezwaar', 'klacht']);
    expect(met({ kp: 'hulp-stopt' }).onderdelen).toEqual(['bezwaar', 'klacht']);
  });
  test('wachten op de gemeente: nog geen aanbieders; op een aanbieder: geen postadres en klacht', () => {
    expect(met({ kp: 'wachten' }, { wachtOp: 'gemeente' }).onderdelen).toEqual(['toegang', 'postadres', 'klacht']);
    expect(met({ kp: 'wachten' }, { wachtOp: 'aanbieder' }).onderdelen).toEqual(['toegang', 'aanbieders']);
    expect(met({ kp: 'wachten' }).onderdelen).toEqual(['toegang', 'aanbieders', 'postadres', 'klacht']);
  });
});

test.describe('het wijkteam bovenaan', () => {
  test('bij hulp aanvragen het wijkteam bovenaan, met "Andere ingangen" in blok 2', () => {
    const t = met({ sel: ['gedrag'], gem: 'apeldoorn' });
    expect(t.wijkteamBovenaan).toBe(true);
    expect(t.kopGemeente).toBe('Andere ingangen in Apeldoorn');
    expect(t.route('wijkteam').verborgen).toBe(true);
  });
  test('begint de situatie bij de huisarts of school, dan niet', () => {
    expect(met({ sel: ['adhd'] }).wijkteamBovenaan).toBe(false);
    expect(met({ sel: ['school'] }).wijkteamBovenaan).toBe(false);
    expect(met({ sel: ['adhd'] }).kopGemeente).toBe('Waar u terechtkunt');
  });
  test('bij spoed en bij zorgen om een kind van een ander niet, en geen blok met ingangen', () => {
    for (const vraag of ['spoed', 'zorgen-om-kind']) {
      const t = met({ kp: vraag, sel: ['gedrag'] });
      expect(t.wijkteamBovenaan).toBe(false);
      expect(t.nietVoorEigenKind).toBe(true);
      expect(t.gemeenteVerborgen).toBe(true);
    }
  });
  test('ingangen in blok 2 in de volgorde van de situaties; wat geen situatie noemt, valt weg (behalve het wijkteam)', () => {
    const t = met({ sel: ['school', 'gedrag'] });
    expect(['school', 'wijkteam', 'huisarts'].map((r) => t.route(r).plek)).toEqual([0, 1, 2]);
    expect(met({ sel: ['onveilig'] }).route('huisarts')).toEqual({ verborgen: true, plek: 9 });
    expect(met({ gem: 'apeldoorn' }).route('school').verborgen).toBe(false);
  });
});

test.describe('secties, leeftijdstip en contactkaart', () => {
  test('landelijke vraag: van de verdieping alleen de regelingen', () => {
    const t = met({ kp: 'kinderbijslag', sel: ['gedrag'] });
    expect(t.sectieVerborgen('regelingen')).toBe(false);
    expect(t.sectieVerborgen('hulp')).toBe(true);
    expect(t.gemeenteVerborgen).toBe(true);
  });
  test('zorgen om een kind van een ander: geen secties over de situatie', () => {
    expect(met({ kp: 'zorgen-om-kind', sel: ['gedrag'] }).sectieVerborgen('regelingen')).toBe(true);
  });
  test('geen leeftijdstip bij "Mijn kind wordt 18", een kind van een ander, of een vraag zonder situaties', () => {
    expect(met({ sel: ['gedrag'] }).geenLeeftijdstip).toBe(false);
    expect(met({ kp: 'wordt-18' }).geenLeeftijdstip).toBe(true);
    expect(met({ kp: 'zorgen-om-kind' }).geenLeeftijdstip).toBe(true);
    expect(met({ kp: 'wachten' }).geenLeeftijdstip).toBe(true);
  });
  test('contactkaart: eigen modus bij afgewezen en wachten; "Hier meldt u zich" niet bij hulp aanvragen', () => {
    expect(met({ kp: 'afgewezen' })).toMatchObject({ modus: 'bezwaar', kopNuDoen: '' });
    expect(met({ kp: 'wachten' })).toMatchObject({ modus: 'wachten', kopNuDoen: 'wijkteam' });
    expect(met({ sel: ['gedrag'] })).toMatchObject({ modus: '', kopNuDoen: '' });
  });
});

test.describe('leeftijd, therapievormen en lokale steun', () => {
  test('zonder leeftijd past alles; anders meer dan één jaar overlap', () => {
    expect(met().inBand('16', '23')).toBe(true);
    const t = met({ lf: '4-12' });
    expect(t.inBand('0', '6')).toBe(true);
    expect(t.inBand('0', '5')).toBe(false);
    expect(t.inBand('11', '18')).toBe(false);
  });
  test('therapievormen: beste plek over de gekozen situaties met een volgorde, anders na de eerste stappen, anders achteraan', () => {
    const t = met({ sel: ['gedrag', 'adhd', 'scheiding'] });
    expect(t.tipPlek('gedrag:4 adhd:2 autisme:1', 'gedrag adhd autisme')).toBe(2);
    expect(t.tipPlek('', 'scheiding')).toBe(100);
    expect(t.tipPlek('autisme:1', 'autisme')).toBe(999);
  });
  test('lokale steun: hooguit 4 die passen, aangevuld tot 2 met steun voor alle gezinnen', () => {
    const item = (naam: string, x: { situaties?: string; themas?: string; iedereen?: boolean; cjg?: boolean } = {}) => ({
      naam,
      k: { cjg: !!x.cjg, gelabeld: x.situaties !== undefined || !!x.iedereen, situaties: x.situaties ?? '', iedereen: !!x.iedereen, themas: x.themas ?? '' },
    });
    const kies = (t: ReturnType<typeof met>, items: ReturnType<typeof item>[]) => t.kiesLokaal(items, (i) => i.k).map((i) => i.naam);
    const veel = ['a', 'b', 'c', 'd', 'e'].map((n) => item(n, { situaties: 'gedrag' }));
    expect(kies(met({ sel: ['gedrag'] }), [...veel, item('alg', { iedereen: true })])).toEqual(['a', 'b', 'c', 'd']);
    const weinig = [item('alg1', { iedereen: true }), item('thema', { themas: 'gedrag' }), item('alg2', { iedereen: true }), item('alg3', { iedereen: true })];
    expect(kies(met({ sel: ['gedrag'] }), weinig)).toEqual(['thema', 'alg1', 'alg2']);
    // Zonder situatie alleen bij hulp aanvragen; bij een lichte start valt het CJG weg.
    expect(kies(met({ kp: 'wachten' }), weinig)).toEqual([]);
    expect(kies(met({ gem: 'apeldoorn' }), weinig)).toEqual(['alg1', 'alg2']);
    expect(kies(met({ sel: ['scheiding'] }), [item('cjg', { situaties: 'scheiding', cjg: true }), item('steun', { situaties: 'scheiding' })])).toEqual([
      'steun',
    ]);
  });
});
