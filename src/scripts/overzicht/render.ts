/**
 * Tekent Mijn overzicht bij de keuzes bovenaan (gemeente, vraag, situaties, leeftijd) en de antwoorden in de verdiepingen:
 * welke blokken, stappen en contacten zichtbaar zijn, en in welke volgorde. Elke keer helemaal opnieuw, na elke wijziging.
 */
import { keuze, namen, q } from './gedeeld';
import type { verhuizing } from './verhuizing';
import type { hulpStopt } from './hulp-stopt';
import type { wordt18 } from './wordt-18';
import type { wachten } from './wachten';
import type { afgewezen } from './afgewezen';

type Sit = { themas: string[]; hulpsoorten: string[]; routes: string[]; landelijk: string[]; licht: boolean; jgz: boolean; inklap: boolean; rang: boolean; gelijk: boolean };
type Verdiepingen = { verhuizing: ReturnType<typeof verhuizing>; hulpStopt: ReturnType<typeof hulpStopt>; wordt18: ReturnType<typeof wordt18>; wachten: ReturnType<typeof wachten>; afgewezen: ReturnType<typeof afgewezen> };

// Gegevens uit de pagina (zie het inline-script in overzicht.astro).
const data = (window as any).__jrSituaties as Record<string, Sit>;
const knel = (window as any).__jrKnelpunten as Record<string, { onderdelen: string[]; landelijk: string[]; zonderGemeente: boolean; wijkteamBovenaan: boolean }>;
const KLACHT_WACHTEN = (window as any).__jrKlachtWachten as Record<string, string>;
const BAND: Record<string, [number, number]> = { '0-4': [0, 4], '4-12': [4, 12], '12-18': [12, 18], '18-99': [18, 99] };

export const maakRender = (v: Verdiepingen) => () => {
  const { sel, gem, kp, lf } = keuze;
  const reden = v.hulpStopt.reden();
  const wachtOp = v.wachten.wachtOp();
  const active = sel.filter((id) => data[id]);
  const themas = new Set(active.flatMap((id) => data[id].themas));
  const hulp = new Set(active.flatMap((id) => data[id].hulpsoorten));
  const land = new Set(active.flatMap((id) => data[id].landelijk));
  const hasThema = (el: HTMLElement) => (el.dataset.themas ?? '').split(' ').some((t) => themas.has(t));

  // Zonder gekozen knelpunt gelden de stappen van "Ik wil hulp aanvragen" (met de situatie als eerste stap).
  const kpGekozen = kp && knel[kp] ? kp : '';
  const iets = active.length > 0 || (!!gem && gem !== '_overig');
  const kpActive = kpGekozen || (iets ? 'beginnen' : '');
  const delen = [namen.g[gem], namen.k[kpGekozen], ...active.map((id) => namen.s[id]), namen.l[lf]].filter(Boolean);
  q('[data-keuzes-samenvatting]').forEach((e) => (e.textContent = delen.length ? delen.join(' · ') : 'nog niets gekozen'));
  if (kpActive) knel[kpActive].landelijk.forEach((l) => land.add(l));
  q('[data-leeg]').forEach((e) => (e.hidden = !!kpActive));
  q('[data-inhoud]').forEach((e) => (e.hidden = !kpActive));
  q('[data-knelpunt-wrap]').forEach((e) => (e.hidden = !kpActive));
  q('[data-knelpunt-blok]').forEach((e) => (e.hidden = e.dataset.knelpuntBlok !== kpActive));
  q('[data-knelpunt-bronnen]').forEach((e) => (e.hidden = e.dataset.knelpuntBronnen !== kpActive));
  // Landelijke vraag (zoals kinderbijslag): geen wijkteam, "hierbij handig" of andere ingangen van de gemeente,
  // en van de verdieping alleen de rechten en regelingen (geen hulpsoorten, therapievormen of organisaties).
  const zonderGemeente = !!kpActive && knel[kpActive].zonderGemeente;
  // Zorgen om een kind van een ander: de situatie gaat over dat kind, niet over hulp voor uw eigen kind. Dan geen rechten en
  // regelingen van de situatie (zoals "u mag de aanbieder kiezen") en geen leeftijdstips over school.
  const andermansKind = kpActive === 'zorgen-om-kind';
  q('#hulp, #situaties, #regelingen, #organisaties, #tips').forEach((e) => (e.hidden = active.length === 0 || andermansKind || (zonderGemeente && e.id !== 'regelingen')));
  // Lichte start (zoals scheiding): op zich geen reden voor jeugdhulp. Uitleg en CJG voorop, de aanvraag ingeklapt.
  const licht = kpActive === 'beginnen' && !!active[0] && data[active[0]].licht;
  // Ingeklapte aanvraag zonder lichte start (zoals onveilig thuis): eigen inleiding en de aanvraagstappen ingeklapt, het wijkteam blijft voorop.
  // Heeft de situatie eigen stappen (zoals school loopt vast), dan staan die vóór de ingeklapte aanvraag.
  const inklap = kpActive === 'beginnen' && !!active[0] && data[active[0]].inklap;
  // Begint de situatie bij school (zoals thuiszitten), dan is "welke aanbieders kunt u kiezen" bij de start nog niet aan de orde.
  const schoolEerst = kpActive === 'beginnen' && !!active[0] && data[active[0]].routes[0] === 'school';
  // "De hulp stopt" met een andere reden dan een besluit van de gemeente: bezwaar (blok en brief) hoort er dan niet bij.
  const geenBezwaar = kpActive === 'hulp-stopt' && !!reden && reden !== 'gemeente';
  // "Wij wachten te lang": wie op de gemeente wacht, kiest nog geen aanbieder; wie op een aanbieder wacht, stuurt geen ingebrekestelling (postadres).
  const wachtNiet = kpActive === 'wachten' ? ({ gemeente: ['aanbieders'], aanbieder: ['postadres', 'klacht'] } as Record<string, string[]>)[wachtOp] ?? [] : [];
  const onderdelen = !kpActive ? [] : licht ? ['toegang'] : knel[kpActive].onderdelen.filter((o) => !(schoolEerst && o === 'aanbieders') && !(geenBezwaar && o === 'bezwaar') && !wachtNiet.includes(o));
  // De link naar de klachtbrief in het klachtblok van de gemeente: bij wachten met de klacht over de wachttijd al aan.
  (q('a[data-klachtbrief]') as HTMLAnchorElement[]).forEach((a) => { const u = new URL(a.href); u.search = kpActive === 'wachten' ? KLACHT_WACHTEN['klacht-toegangsteam'] : ''; a.href = u.toString(); });
  q('[data-eerste-contact], [data-knelpunt-gemeente]').forEach((e) => (e.hidden = zonderGemeente));
  // Staat de cliëntondersteuner al onder een stap, dan niet nog eens in "Hierbij handig".
  const coBijStap = !!kpActive && !!document.querySelector(`[data-knelpunt-blok="${kpActive}"] [data-co-stap] [data-geladen]`);
  const aanbiedersBijStap = !!kpActive && !!document.querySelector(`[data-knelpunt-blok="${kpActive}"] [data-aanbieders-stap] [data-geladen]`);
  q('[data-knelpunt-gemeente] .onderdeel').forEach((e) => (e.hidden = !onderdelen.includes(e.dataset.onderdeel!) || (coBijStap && e.dataset.onderdeel === 'clientondersteuning') || (aanbiedersBijStap && e.dataset.onderdeel === 'aanbieders')));
  q('[data-knelpunt-gemeente] .gemeente-blok').forEach((b) => (b.hidden = b.dataset.gemeente !== (q('[data-knelpunt-gemeente] .gemeente-blok').some((x) => x.dataset.gemeente === gem && gem) ? gem : '')));
  // Spoed zonder gemeente: geen melding "Kies uw gemeente" (bij nood moet niemand eerst een gemeente zoeken).
  if (kpActive === 'spoed' && (!gem || gem === '_overig')) q('[data-knelpunt-gemeente] .gemeente-blok[data-gemeente=""]').forEach((b) => (b.hidden = true));
  // Lege "Hierbij handig"-blokken verbergen.
  q('[data-knelpunt-gemeente] .gemeente-blok[data-gemeente]:not([data-gemeente=""])').forEach((b) => { if (!b.hidden) b.hidden = !Array.from(b.querySelectorAll<HTMLElement>('.onderdeel')).some((o) => !o.hidden); });
  const situatieWint = kpActive === 'beginnen' && !!active[0];
  q('[data-generieke-lead]').forEach((e) => (e.hidden = inklap));
  q('[data-situatie-lead]').forEach((e) => (e.hidden = !inklap || e.dataset.situatieLead !== active[0]));
  q('[data-aanvraag-stappen]').forEach((e) => (e.hidden = inklap));
  q('[data-aanvraag-inklap]').forEach((e) => (e.hidden = !inklap));
  q('[data-situatie-stappen]').forEach((e) => (e.hidden = !inklap || e.dataset.situatieStappen !== active[0]));
  q('[data-ec-cjg]').forEach((e) => (e.hidden = !licht));
  // Begint de situatie bij het consultatiebureau of de jeugdarts (zoals slaap) en heeft de gemeente geen CJG-blok: dan de JGZ boven het wijkteam.
  const jgzVoorop = licht && data[active[0]].jgz;
  q('[data-ec-jgz], [data-kop-jgz]').forEach((e) => (e.hidden = !jgzVoorop));
  q('[data-kop-standaard]').forEach((e) => (e.hidden = licht));
  q('[data-kop-licht]').forEach((e) => (e.hidden = !licht || (jgzVoorop && !!e.parentElement?.querySelector('[data-kop-jgz]'))));
  // Direct regelen: alleen de links bij de onderdelen van deze vraag. De rest staat op de pagina van de gemeente.
  q('[data-regel-soort]').forEach((e) => (e.hidden = !onderdelen.includes(e.dataset.regelSoort!)));
  q('[data-direct-regelen]').forEach((e) => (e.hidden = !e.querySelector('[data-regel-soort]:not([hidden])')));
  q('[data-meer-op-pagina]').forEach((e) => (e.hidden = onderdelen.includes('klacht') || onderdelen.includes('bezwaar')));
  q('[data-generieke-stap]').forEach((e) => (e.hidden = situatieWint));
  q('[data-situatie-stap]').forEach((e) => (e.hidden = !situatieWint || e.dataset.situatieStap !== active[0]));
  const eigenBrieven = situatieWint && q('[data-situatie-brieven]').some((e) => e.dataset.situatieBrieven === active[0]);
  q('[data-situatie-brieven]').forEach((e) => (e.hidden = !eigenBrieven || e.dataset.situatieBrieven !== active[0]));
  q('[data-generieke-brieven]').forEach((e) => (e.hidden = eigenBrieven));
  // Bij een lichte start geen aanvraagbrieven; wel brieven die bij de situatie zelf horen (zoals aan school).
  q('[data-brieven-blok]').forEach((e) => (e.hidden = (licht && !eigenBrieven) || (geenBezwaar && !!e.closest('[data-knelpunt-blok="hulp-stopt"]'))));
  // Eerste ingang: het wijkteam, tenzij de situatie bij de huisarts of school begint. Die staat dan alleen in blok 2.
  const eersteRoute = situatieWint ? data[active[0]].routes[0] : 'wijkteam';
  // Bij spoed en bij zorgen om een kind van een ander is het wijkteam niet de eerste plek om te bellen.
  const nietVoorEigenKind = kpActive === 'spoed' || kpActive === 'zorgen-om-kind';
  const wijkteamBovenaan = !nietVoorEigenKind && eersteRoute === 'wijkteam' && (!kpActive || knel[kpActive].wijkteamBovenaan);
  q('[data-eerste-contact] .gemeente-blok').forEach((b) => (b.hidden = b.dataset.gemeente !== gem || !wijkteamBovenaan));
  q('[data-leerplicht]').forEach((e) => (e.hidden = e.dataset.leerplicht !== gem || !active.includes('school-loopt-vast')));
  q('[data-wijkteam-regel] .gemeente-blok').forEach((b) => (b.hidden = b.dataset.gemeente !== gem || wijkteamBovenaan || nietVoorEigenKind || !situatieWint));
  // Noemt stap 1 het wijkteam al als gelijkwaardige ingang (bv. ADHD), dan niet "Liever eerst het wijkteam?" maar gewoon de contactgegevens.
  q('[data-wijkteam-regel]').forEach((e) => e.toggleAttribute('data-gelijk', situatieWint && !!data[active[0]]?.gelijk));
  // De leeftijdstip ("Bij deze leeftijd") niet bij "Mijn kind wordt 18": die verwijst daar zelf naartoe, en wat erin staat staat in de stappen.
  // Modus van de contactkaart bovenaan: per vraag de juiste ingang (wijkteam, bezwaar of klacht).
  const MODUS: Record<string, string> = { verhuizing: 'verhuizing', afgewezen: 'bezwaar', vastgelopen: 'klacht', wachten: 'wachten' };
  q('#nu-doen').forEach((e) => (e.dataset.modus = MODUS[kpActive] ?? ''));
  // "Hier meldt u zich" alleen bij hulp aanvragen (of zonder vraag). Bij andere vragen kent de ouder het wijkteam al (wachten, uitbreiden, 18 worden …).
  const eigenKop = ['verhuizing', 'bezwaar', 'klacht'].includes(MODUS[kpActive] ?? '');
  q('#nu-doen').forEach((e) => (e.dataset.kop = kpActive && kpActive !== 'beginnen' && !eigenKop ? 'wijkteam' : ''));
  q('[data-vs-leeftijd]').forEach((e) => (e.hidden = e.dataset.vsLeeftijd !== lf || andermansKind || kpActive === 'wordt-18'));

  // Blok 2: alle ingangen behalve de eerste; bij een situatie in de volgorde van die situatie. Niet bij spoed.
  const volgorde = active[0] ? data[active[0]].routes : ['wijkteam', 'huisarts', 'school'];
  q('#gemeente').forEach((e) => (e.hidden = nietVoorEigenKind || zonderGemeente));
  q('[data-kop-gemeente]').forEach((e) => (e.textContent = namen.g[gem] ? (wijkteamBovenaan ? `Andere ingangen in ${namen.g[gem]}` : `Waar u terechtkunt in ${namen.g[gem]}`) : 'Waar u terechtkunt'));
  q('.routes-lijst [data-route]').forEach((e) => {
    const t = e.dataset.route!;
    const i = volgorde.indexOf(t);
    e.hidden = (wijkteamBovenaan && t === 'wijkteam') || (active.length > 0 && i < 0 && t !== 'wijkteam');
    e.style.order = String(i < 0 ? 9 : i); // alleen als sorteersleutel; de volgorde wordt hieronder in de HTML gezet
  });
  // Zijnavigatie volgt zichtbare secties
  q('[data-nav]').forEach((a) => { const t = document.getElementById(a.dataset.nav!); a.hidden = !t || t.hidden; });
  q('[data-inhoud] [data-situatie]').forEach((e) => (e.hidden = !active.includes(e.dataset.situatie!)));
  // Leeftijd voor het filteren (bij "Mijn kind wordt 18" zet LeeftijdKeuze vanzelf 12-18 aan).
  const band = BAND[lf];
  // Zichtbaar als de leeftijdsrange van de vorm of hulpsoort meer dan één jaar overlapt met de gekozen band.
  const inBand = (e: HTMLElement) => !band || (Number(e.dataset.van) < band[1] - 1 && Number(e.dataset.tot) > band[0] + 1);
  q('[data-hulpsoort]').forEach((e) => (e.hidden = !hulp.has(e.dataset.hulpsoort!) || (e.dataset.van !== undefined && !inBand(e))));
  q('[data-landelijk]').forEach((e) => (e.hidden = !land.has(e.dataset.landelijk!)));
  q('#organisaties [data-themas]').forEach((e) => (e.hidden = !hasThema(e)));
  q('[data-tip-situaties]').forEach((e) => (e.hidden = !(e.dataset.tipSituaties ?? '').split(' ').some((id) => active.includes(id)) || !inBand(e)));
  q('[data-vs-leeftijd]').forEach((e) => (e.hidden = e.dataset.vsLeeftijd !== lf || andermansKind || kpActive === 'wordt-18'));
  // Therapievormen op volgorde van toepasbaarheid: per kaart de beste plek over de gekozen situaties met een volgorde
  // (zie lib/therapie.ts). Hoort de kaart bij een gekozen situatie zonder volgorde, dan na de eerste stappen; verder op alfabet.
  const NA_EERST = 100; // = begin van de groep "kan ook helpen" in rangVan
  const plek = (e: HTMLElement) => {
    const r = (e.dataset.tipRang ?? '').split(' ').filter(Boolean).map((x) => x.split(':')).filter(([sit]) => active.includes(sit)).map(([, n]) => Number(n));
    const tipSits = (e.dataset.tipSituaties ?? '').split(' ');
    if (active.some((id) => !data[id].rang && tipSits.includes(id))) r.push(NA_EERST);
    return r.length ? Math.min(...r) : 999;
  };
  const tipGrid = document.querySelector('[data-tip-grid]');
  q('[data-tip-situaties]').map((e) => [e, plek(e), Number(e.dataset.tipI)] as const).sort((a, b) => a[1] - b[1] || a[2] - b[2]).forEach(([e]) => tipGrid?.appendChild(e));
  q('[data-tips-wrap]').forEach((w) => (w.hidden = zonderGemeente || !q('[data-tip-situaties]').some((e) => !e.hidden)));
  const tipsZichtbaar = q('[data-tips-wrap]').some((w) => !w.hidden);
  // Kaart Behandeling: naar de therapievormen hieronder als daar een vorm uit die hulpsoort staat, anders naar de algemene pagina.
  q('a[data-naar-tips]').forEach((el) => {
    const kaart = el as HTMLAnchorElement;
    const id = kaart.dataset.hulpsoort!;
    const hier = tipsZichtbaar && q('[data-tip-hulpsoorten]').some((e) => !e.hidden && (e.dataset.tipHulpsoorten ?? '').split(' ').includes(id));
    kaart.href = hier ? '#tips' : kaart.dataset.naarTips!;
    const pijl = kaart.querySelector('.arrow'); if (pijl) pijl.textContent = hier ? 'Welke behandelingen passen bij uw situatie ↓' : 'Wat is het en hoe vraag ik het aan →';
  });
  q('[data-tips-link]').forEach((e) => (e.hidden = !tipsZichtbaar));
  q('[data-tips-link-alg]').forEach((e) => (e.hidden = tipsZichtbaar));

  // Nummers doortellen over de zichtbare secties (zijnavigatie én koppen), anders sprong de nummering bv. van → naar 4.
  q('[data-nav]').filter((a) => a.dataset.nav !== 'nu-doen').forEach((a) => {
    const t = document.getElementById(a.dataset.nav!);
    a.hidden = !t || t.hidden;
  });
  let nr = 0;
  q('[data-nav]').filter((a) => a.dataset.nav !== 'nu-doen' && !a.hidden).forEach((a) => {
    nr++;
    const n = a.querySelector('.n'); if (n) n.textContent = String(nr);
    const kop = document.getElementById(a.dataset.nav!)?.querySelector(':scope > h2 .section-num'); if (kop) kop.textContent = String(nr);
  });
  const known = q('#gemeente .gemeente-blok').some((b) => b.dataset.gemeente === gem && gem !== '');
  q('#gemeente .gemeente-blok').forEach((b) => (b.hidden = b.dataset.gemeente !== (known || gem === '_overig' ? gem : '')));
  q('[data-routes-algemeen]').forEach((e) => (e.hidden = known));
  // Lokale steun: eerst wat bij de gekozen situaties past (hooguit 4); is dat minder dan 2, dan aanvullen met hooguit 2 "voor alle gezinnen".
  // Zonder situatie alleen bij "Ik wil hulp aanvragen" (dan alleen de algemene). Het CJG vervalt als het CJG-blok al bovenaan staat.
  q('.gemeente-blok [data-lokaal-wrap]').forEach((w) => {
    const items = Array.from(w.querySelectorAll<HTMLElement>('[data-li]'));
    const lijst = w.querySelector('ul');
    const bruikbaar = items.filter((i) => !(licht && i.dataset.liCjg));
    const past = (i: HTMLElement) => i.dataset.liGelabeld ? (i.dataset.liSits ?? '').split(' ').some((id) => active.includes(id)) : hasThema(i);
    const specifiek = bruikbaar.filter(past).slice(0, 4);
    const magAlgemeen = active.length > 0 || kpActive === 'beginnen';
    const aanvulling = specifiek.length < 2 && magAlgemeen ? bruikbaar.filter((i) => i.dataset.liIedereen && !specifiek.includes(i)).slice(0, 2) : [];
    const tonen = [...specifiek, ...aanvulling];
    items.forEach((i) => (i.hidden = !tonen.includes(i)));
    tonen.forEach((i) => lijst?.appendChild(i));
    w.hidden = tonen.length === 0;
  });
  v.verhuizing.teken();
  v.hulpStopt.teken();
  v.wordt18.teken();
  v.wachten.teken();
  v.afgewezen.teken();
  // Een link naar een klachtbrief in "Hierbij handig" alleen als die brief niet al bij de stappen of de voorbeeldbrieven staat.
  const opPagina = (pad: string) => !!q(`[data-knelpunt-blok="${kpActive}"] a.stap-brief, [data-knelpunt-blok="${kpActive}"] a[data-brief-kaart]`).find((x) => !x.closest('[hidden]') && new URL((x as HTMLAnchorElement).href).pathname === pad);
  (q('a[data-klachtbrief]') as HTMLAnchorElement[]).forEach((a) => { a.parentElement!.hidden = opPagina(new URL(a.href).pathname); });
  // Pas aan het eind: hieronder hangt af van wat hierboven zichtbaar is gemaakt.
  // Echte volgorde in de HTML (ook voor schermlezers): contact direct onder de kop, vóór de uitleg en de stappen
  // (persona-tests: ouders zoeken eerst wie ze moeten bellen); "hierbij handig" na de overige stappen.
  const blok = q('[data-knelpunt-blok]').find((e) => !e.hidden);
  if (blok) {
    const na1 = blok.querySelector('.stap-een') ?? blok.querySelector('.o2');
    const kop = blok.querySelector('h2');
    const ec = document.querySelector('[data-eerste-contact]');
    if (kop && ec) kop.after(ec);
    // Begint de situatie bij huisarts of school, dan staat het wijkteam direct onder stap 1 (persona-tests: stond onder de brieven).
    const wr = document.querySelector('[data-wijkteam-regel]');
    if (na1 && wr) na1.after(wr);
    // Na het laatste blok met stappen of links onder de stappen (bij "hulp aanvragen" staat de ingeklapte versie vóór de gewone lijst).
    // Alleen blokken direct in de vraag: bij afgewezen kan de lijst met stappen in een ingeklapt blok staan.
    const na2 = Array.from(blok.querySelectorAll(':scope > .o4, :scope > .o5')).pop() ?? na1;
    const hd = document.querySelector('[data-knelpunt-gemeente]');
    const lft = document.querySelector('.o5b');
    // Eerst de tip bij de leeftijd (hoort bij de stappen), dan "Hierbij handig".
    if (na2 && hd) { na2.after(hd); if (lft) hd.before(lft); }
  }
  // Blok 2 op volgorde zetten, en elk contact maar één keer tonen (ook niet als het al onder stap 1 staat).
  const gezien = new Set<string>();
  q('[data-eerste-contact] .gemeente-blok').filter((b) => !b.hidden).forEach((b) => b.querySelectorAll<HTMLAnchorElement>('a[href^="tel:"]').forEach((a) => gezien.add(a.getAttribute('href')!)));
  q('.routes-lijst').forEach((lijst) => {
    const rs = Array.from(lijst.querySelectorAll<HTMLElement>(':scope > [data-route]')).sort((x, y) => Number(x.style.order) - Number(y.style.order));
    const eerstAnders = lijst.querySelector(':scope > :not([data-route])');
    rs.forEach((r) => lijst.insertBefore(r, eerstAnders));
    if (lijst.hidden) return;
    // Het wijkteam eerst ontdubbelen: een contact dat ook bij het wijkteam hoort, blijft daar staan.
    [...rs].sort((x, y) => Number(y.dataset.route === 'wijkteam') - Number(x.dataset.route === 'wijkteam')).filter((r) => !r.hidden).forEach((r) => r.querySelectorAll<HTMLElement>('.contact').forEach((c) => {
      const sleutel = c.querySelector('a[href^="tel:"]')?.getAttribute('href') ?? c.querySelector('strong')?.textContent ?? '';
      c.hidden = !!sleutel && gezien.has(sleutel);
      if (sleutel) gezien.add(sleutel);
    }));
  });
  // Klaar met tekenen: de uitleg bij moeilijke woorden (Base.astro) kan nu de zichtbare tekst nalopen.
  document.dispatchEvent(new CustomEvent('jr:getekend'));
};
