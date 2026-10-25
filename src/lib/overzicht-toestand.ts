/**
 * Mijn overzicht: wat er zichtbaar is bij de keuzes bovenaan en de antwoorden in de verdiepingen, los van de pagina zelf.
 * src/scripts/overzicht/render.ts zet deze toestand om in de pagina; de regels staan hier, zodat ze zonder browser te testen zijn
 * (tests/e2e/unit/overzicht-toestand.spec.ts). Wat afhangt van wat er in de pagina staat (geladen gemeenteblokken, brieven bij een
 * stap), blijft in render.ts.
 */
import type { SituatieData, KnelpuntData, Namen } from './paginadata';
import { bandVan } from './leeftijden';

export type Keuze = { sel: string[]; gem: string; kp: string; lf: string };
/** Antwoorden uit de verdiepingen die ook de rest van het overzicht veranderen. */
export type Antwoorden = { reden: string; wachtOp: string };
export type OverzichtGegevens = { situaties: Record<string, SituatieData>; knelpunten: Record<string, KnelpuntData>; namen: Namen };

/** Modus van de contactkaart bovenaan: per vraag de juiste ingang (wijkteam, bezwaar of klacht). */
const MODUS: Record<string, string> = { verhuizing: 'verhuizing', afgewezen: 'bezwaar', vastgelopen: 'klacht', wachten: 'wachten' };
/** "Wij wachten te lang": wie op de gemeente wacht, kiest nog geen aanbieder; wie op een aanbieder wacht, stuurt geen ingebrekestelling (postadres). */
const WACHT_NIET: Record<string, string[]> = { gemeente: ['aanbieders'], aanbieder: ['postadres', 'klacht'] };
/** Plek van een therapievorm die bij een gekozen situatie zonder eigen volgorde hoort: na de eerste stappen (= begin van de groep
 *  "kan ook helpen" in rangVan, lib/therapie.ts). Zonder plek: achteraan. */
const NA_EERST = 100;
const GEEN_PLEK = 999;

export function toestand({ sel, gem, kp, lf }: Keuze, { reden, wachtOp }: Antwoorden, { situaties: data, knelpunten: knel, namen }: OverzichtGegevens) {
  const active = sel.filter((id) => data[id]);
  // Bij meer situaties gaat de situatie voor die het meest bepaalt waar u begint (voorrang, overzicht.astro), niet de eerst gekozen:
  // de volgorde van kiezen verandert het overzicht niet.
  const opVoorrang = [...active].sort((a, b) => data[a].voorrang - data[b].voorrang);
  const voorop: string | undefined = opVoorrang[0];
  const themas = new Set(active.flatMap((id) => data[id].themas));
  const hulp = new Set(active.flatMap((id) => data[id].hulpsoorten));
  const land = new Set(active.flatMap((id) => data[id].landelijk));

  // Zonder gekozen knelpunt gelden de stappen van "Ik wil hulp aanvragen" (met de situatie als eerste stap).
  const kpGekozen = kp && knel[kp] ? kp : '';
  const iets = active.length > 0 || (!!gem && gem !== '_overig');
  const kpActive = kpGekozen || (iets ? 'beginnen' : '');
  const samenvatting = [namen.g[gem], namen.k[kpGekozen], ...active.map((id) => namen.s[id]), namen.l[lf]].filter(Boolean).join(' · ');
  if (kpActive) knel[kpActive].landelijk.forEach((l) => land.add(l));
  // Landelijke vraag (zoals kinderbijslag): geen wijkteam, "hierbij handig" of andere ingangen van de gemeente,
  // en van de verdieping alleen de rechten en regelingen (geen hulpsoorten, therapievormen of organisaties).
  const zonderGemeente = !!kpActive && knel[kpActive].zonderGemeente;
  // Zorgen om een kind van een ander: de situatie gaat over dat kind, niet over hulp voor uw eigen kind. Dan geen rechten en
  // regelingen van de situatie (zoals "u mag de aanbieder kiezen") en geen leeftijdstips over school.
  const andermansKind = kpActive === 'zorgen-om-kind';
  /** De secties van de verdieping (#hulp, #situaties, #regelingen, #organisaties, #tips). */
  const sectieVerborgen = (id: string) => active.length === 0 || andermansKind || (zonderGemeente && id !== 'regelingen');
  // Lichte start (zoals scheiding): op zich geen reden voor jeugdhulp. Uitleg en CJG voorop, de aanvraag ingeklapt.
  const licht = kpActive === 'beginnen' && !!voorop && data[voorop].licht;
  // Ingeklapte aanvraag zonder lichte start (zoals onveilig thuis): eigen inleiding en de aanvraagstappen ingeklapt, het wijkteam blijft voorop.
  // Heeft de situatie eigen stappen (zoals school loopt vast), dan staan die vóór de ingeklapte aanvraag. Vraagt een andere gekozen
  // situatie wel om een aanvraag (zoals gedragsproblemen), dan staat de aanvraag open.
  const inklap = kpActive === 'beginnen' && !!voorop && active.every((id) => data[id].inklap);
  // Begint de situatie bij school (zoals thuiszitten), dan is "welke aanbieders kunt u kiezen" bij de start nog niet aan de orde.
  const schoolEerst = inklap && data[voorop!].routes[0] === 'school';
  // "De hulp stopt" met een andere reden dan een besluit van de gemeente: bezwaar (blok en brief) hoort er dan niet bij.
  const geenBezwaar = kpActive === 'hulp-stopt' && !!reden && reden !== 'gemeente';
  const wachtNiet = kpActive === 'wachten' ? (WACHT_NIET[wachtOp] ?? []) : [];
  /** Onderdelen van de gemeente bij deze vraag ("Hierbij handig", direct regelen). */
  const onderdelen = !kpActive
    ? []
    : licht
      ? ['toegang']
      : knel[kpActive].onderdelen.filter((o) => !(schoolEerst && o === 'aanbieders') && !(geenBezwaar && o === 'bezwaar') && !wachtNiet.includes(o));
  const situatieWint = kpActive === 'beginnen' && !!voorop;
  // Begint de situatie bij het consultatiebureau of de jeugdarts (zoals slaap) en heeft de gemeente geen CJG-blok: dan de JGZ boven het wijkteam.
  const jgzVoorop = licht && data[voorop!].jgz;
  // Begint een andere gekozen situatie ergens anders (gedragsproblemen bij het wijkteam, naast school loopt vast), dan noemt stap 1 die ingang ook.
  const ook = situatieWint ? opVoorrang.slice(1).filter((id) => data[id].start !== data[voorop!].start) : [];
  // Waar stap 1 naartoe wijst (alle ingangen): wijst die al naar school, dan zegt de leeftijdstip niet nog eens "informeer ook school".
  const startTypes = situatieWint ? [voorop!, ...ook].map((id) => data[id].routes[0]) : [];
  // Eerste ingang: het wijkteam, tenzij de situatie bij de huisarts of school begint. Die staat dan alleen in blok 2.
  const eersteRoute = situatieWint ? data[voorop!].routes[0] : 'wijkteam';
  // Bij spoed en bij zorgen om een kind van een ander is het wijkteam niet de eerste plek om te bellen.
  const nietVoorEigenKind = kpActive === 'spoed' || kpActive === 'zorgen-om-kind';
  const wijkteamBovenaan = !nietVoorEigenKind && eersteRoute === 'wijkteam' && (!kpActive || knel[kpActive].wijkteamBovenaan);
  // Noemt stap 1 het wijkteam al als gelijkwaardige ingang (bv. ADHD, of een tweede situatie die bij het wijkteam begint), dan niet
  // "Liever eerst het wijkteam?" maar gewoon de contactgegevens.
  const wijkteamGelijk = situatieWint && (data[voorop!].gelijk || startTypes.includes('wijkteam'));
  // De leeftijdstip ("Bij deze leeftijd") niet bij "Mijn kind wordt 18": die verwijst daar zelf naartoe, en wat erin staat staat in de stappen.
  // Ook niet bij vragen waar de voorpagina niet vraagt wat er speelt (startSituaties uit, zoals wachten): daar verandert de leeftijd niets.
  const geenLeeftijdstip = andermansKind || kpActive === 'wordt-18' || (!!kpActive && knel[kpActive].situaties === false);
  const modus = MODUS[kpActive] ?? '';
  // "Hier meldt u zich" alleen bij hulp aanvragen (of zonder vraag). Bij andere vragen kent de ouder het wijkteam al (wachten, uitbreiden, 18 worden …).
  const eigenKop = ['verhuizing', 'bezwaar', 'klacht'].includes(modus);
  const kopNuDoen = kpActive && kpActive !== 'beginnen' && !eigenKop ? 'wijkteam' : '';

  // Blok 2: alle ingangen behalve de eerste; bij situaties in hun volgorde (de situatie met voorrang eerst). Niet bij spoed.
  const routeVolgorde = voorop ? [...new Set(opVoorrang.flatMap((id) => data[id].routes))] : ['wijkteam', 'huisarts', 'school'];
  const gemeenteVerborgen = nietVoorEigenKind || zonderGemeente;
  const kopGemeente = namen.g[gem] ? (wijkteamBovenaan ? `Andere ingangen in ${namen.g[gem]}` : `Waar u terechtkunt in ${namen.g[gem]}`) : 'Waar u terechtkunt';
  /** Een ingang in blok 2: verborgen of niet, en de plek (9 = achteraan). */
  const route = (type: string) => {
    const i = routeVolgorde.indexOf(type);
    return { verborgen: (wijkteamBovenaan && type === 'wijkteam') || (active.length > 0 && i < 0 && type !== 'wijkteam'), plek: i < 0 ? 9 : i };
  };

  // Leeftijd voor het filteren (bij "Mijn kind wordt 18" zet de voorpagina vanzelf 12-18, VASTE_LEEFTIJD in lib/startvragen.ts).
  const band = bandVan(lf);
  /** Past een leeftijdsrange (van een vorm of hulpsoort, uit de data-attributen) bij de gekozen band: meer dan één jaar overlap. */
  const inBand = (van?: string, tot?: string) => !band || (Number(van) < band.tot - 1 && Number(tot) > band.van + 1);
  const heeftThema = (lijst: string) => lijst.split(' ').some((t) => themas.has(t));
  const bijGekozen = (lijst: string) => lijst.split(' ').some((id) => active.includes(id));
  /** Therapievormen op volgorde van toepasbaarheid: de beste plek over de gekozen situaties met een volgorde ("adhd:3 autisme:101",
   *  zie lib/therapie.ts). Hoort de kaart bij een gekozen situatie zonder volgorde, dan na de eerste stappen; verder op alfabet. */
  const tipPlek = (rang: string, situaties: string) => {
    const r = rang
      .split(' ')
      .filter(Boolean)
      .map((x) => x.split(':'))
      .filter(([sit]) => active.includes(sit))
      .map(([, n]) => Number(n));
    const tipSits = situaties.split(' ');
    if (active.some((id) => !data[id].rang && tipSits.includes(id))) r.push(NA_EERST);
    return r.length ? Math.min(...r) : GEEN_PLEK;
  };
  /** Lokale steun: eerst wat bij de gekozen situaties past (hooguit 4); is dat minder dan 2, dan aanvullen met hooguit 2 "voor alle
   *  gezinnen". Zonder situatie alleen bij "Ik wil hulp aanvragen" (dan alleen de algemene). Het CJG vervalt als het CJG-blok al
   *  bovenaan staat (lichte start). */
  const kiesLokaal = <T>(items: T[], kenmerk: (i: T) => LokaalKenmerk) => {
    const bruikbaar = items.filter((i) => !(licht && kenmerk(i).cjg));
    const past = (i: T) => {
      const k = kenmerk(i);
      return k.gelabeld ? bijGekozen(k.situaties) : heeftThema(k.themas);
    };
    const specifiek = bruikbaar.filter(past).slice(0, 4);
    const magAlgemeen = active.length > 0 || kpActive === 'beginnen';
    const aanvulling = specifiek.length < 2 && magAlgemeen ? bruikbaar.filter((i) => kenmerk(i).iedereen && !specifiek.includes(i)).slice(0, 2) : [];
    return [...specifiek, ...aanvulling];
  };

  return {
    active,
    opVoorrang,
    voorop,
    hulp,
    land,
    kpGekozen,
    kpActive,
    samenvatting,
    zonderGemeente,
    andermansKind,
    sectieVerborgen,
    licht,
    inklap,
    geenBezwaar,
    onderdelen,
    situatieWint,
    jgzVoorop,
    ook,
    startTypes,
    nietVoorEigenKind,
    wijkteamBovenaan,
    wijkteamGelijk,
    geenLeeftijdstip,
    modus,
    kopNuDoen,
    gemeenteVerborgen,
    kopGemeente,
    route,
    inBand,
    heeftThema,
    bijGekozen,
    tipPlek,
    kiesLokaal,
  };
}

/** Wat render.ts van een item bij lokale steun doorgeeft (uit de data-attributen van gemeente-blokken/[slug].astro). */
export type LokaalKenmerk = { cjg: boolean; gelabeld: boolean; situaties: string; iedereen: boolean; themas: string };
export type Toestand = ReturnType<typeof toestand>;
