/**
 * Tekent Mijn overzicht bij de keuzes bovenaan (gemeente, vraag, situaties, leeftijd) en de antwoorden in de verdiepingen:
 * welke blokken, stappen en contacten zichtbaar zijn, en in welke volgorde. Elke keer helemaal opnieuw, na elke wijziging.
 */
import { keuze, namen, pagina, q } from './gedeeld';
import { toestand } from '../../lib/overzicht-toestand';
import type { verhuizing } from './verhuizing';
import type { hulpStopt } from './hulp-stopt';
import type { wordt18 } from './wordt-18';
import type { wachten } from './wachten';
import type { afgewezen } from './afgewezen';
import type { gescheiden } from './gescheiden';
import type { uitbreiden } from './uitbreiden';
import type { geld } from './geld';
import { afdrukken } from './afdrukken';
import { KLACHT_BIJ_WACHTEN } from '../../lib/verdiepingen';

type Verdiepingen = {
  verhuizing: ReturnType<typeof verhuizing>;
  hulpStopt: ReturnType<typeof hulpStopt>;
  wordt18: ReturnType<typeof wordt18>;
  wachten: ReturnType<typeof wachten>;
  afgewezen: ReturnType<typeof afgewezen>;
  gescheiden: ReturnType<typeof gescheiden>;
  uitbreiden: ReturnType<typeof uitbreiden>;
  geld: ReturnType<typeof geld>;
};

export const maakRender = (v: Verdiepingen) => () => {
  const { gem, lf } = keuze;
  // De regels (wat zichtbaar is bij welke keuze) staan in lib/overzicht-toestand.ts; hier alleen de pagina.
  const t = toestand(keuze, { reden: v.hulpStopt.reden(), wachtOp: v.wachten.wachtOp() }, { ...pagina, namen });
  const {
    active,
    voorop,
    hulp,
    land,
    kpGekozen,
    kpActive,
    zonderGemeente,
    licht,
    inklap,
    geenBezwaar,
    onderdelen,
    situatieWint,
    ook,
    wijkteamBovenaan,
    nietVoorEigenKind,
    geenLeeftijdstip,
  } = t;
  const hasThema = (el: HTMLElement) => t.heeftThema(el.dataset.themas ?? '');
  q('[data-keuzes-samenvatting]').forEach((e) => (e.textContent = t.samenvatting));
  q('[data-inhoud]').forEach((e) => (e.hidden = !kpActive));
  q('[data-knelpunt-wrap]').forEach((e) => (e.hidden = !kpActive));
  q('[data-knelpunt-blok]').forEach((e) => (e.hidden = e.dataset.knelpuntBlok !== kpActive));
  q('[data-knelpunt-bronnen]').forEach((e) => (e.hidden = e.dataset.knelpuntBronnen !== kpActive));
  q('#hulp, #situaties, #regelingen, #organisaties, #tips').forEach((e) => (e.hidden = t.sectieVerborgen(e.id)));
  // De link naar de klachtbrief in het klachtblok van de gemeente: bij wachten met de klacht over de wachttijd al aan.
  (q('a[data-klachtbrief]') as HTMLAnchorElement[]).forEach((a) => {
    const u = new URL(a.href);
    u.search = kpActive === 'wachten' ? KLACHT_BIJ_WACHTEN['klacht-toegangsteam'] : '';
    a.href = u.toString();
  });
  q('[data-eerste-contact], [data-knelpunt-gemeente]').forEach((e) => (e.hidden = zonderGemeente));
  // Staat de cliëntondersteuner al onder een stap, dan niet nog eens in "Hierbij handig".
  const coBijStap = !!kpActive && !!document.querySelector(`[data-knelpunt-blok="${kpActive}"] [data-co-stap] [data-geladen]`);
  const aanbiedersBijStap = !!kpActive && !!document.querySelector(`[data-knelpunt-blok="${kpActive}"] [data-aanbieders-stap] [data-geladen]`);
  q('[data-knelpunt-gemeente] .onderdeel').forEach(
    (e) =>
      (e.hidden =
        !onderdelen.includes(e.dataset.onderdeel!) ||
        (coBijStap && e.dataset.onderdeel === 'clientondersteuning') ||
        (aanbiedersBijStap && e.dataset.onderdeel === 'aanbieders')),
  );
  q('[data-knelpunt-gemeente] .gemeente-blok').forEach(
    (b) => (b.hidden = b.dataset.gemeente !== (q('[data-knelpunt-gemeente] .gemeente-blok').some((x) => x.dataset.gemeente === gem && gem) ? gem : '')),
  );
  // Spoed zonder gemeente: geen melding "Kies uw gemeente" (bij nood moet niemand eerst een gemeente zoeken).
  if (kpActive === 'spoed' && (!gem || gem === '_overig')) q('[data-knelpunt-gemeente] .gemeente-blok[data-gemeente=""]').forEach((b) => (b.hidden = true));
  // Lege "Hierbij handig"-blokken verbergen.
  q('[data-knelpunt-gemeente] .gemeente-blok[data-gemeente]:not([data-gemeente=""])').forEach((b) => {
    if (!b.hidden) b.hidden = !Array.from(b.querySelectorAll<HTMLElement>('.onderdeel')).some((o) => !o.hidden);
  });
  q('[data-generieke-lead]').forEach((e) => (e.hidden = inklap));
  q('[data-situatie-lead]').forEach((e) => (e.hidden = !inklap || e.dataset.situatieLead !== voorop));
  q('[data-aanvraag-stappen]').forEach((e) => (e.hidden = inklap));
  q('[data-aanvraag-inklap]').forEach((e) => (e.hidden = !inklap));
  // Eigen stappen van elke gekozen situatie, ook als een andere situatie voorgaat (school loopt vast bij een eetstoornis).
  q('[data-situatie-stappen]').forEach((e) => (e.hidden = !situatieWint || !active.includes(e.dataset.situatieStappen!)));
  q('[data-ec-cjg]').forEach((e) => (e.hidden = !licht));
  // Begint de situatie bij het consultatiebureau of de jeugdarts (zoals slaap) en heeft de gemeente geen CJG-blok: dan de JGZ boven het wijkteam.
  const jgzVoorop = t.jgzVoorop;
  q('[data-ec-jgz], [data-kop-jgz]').forEach((e) => (e.hidden = !jgzVoorop));
  q('[data-kop-standaard]').forEach((e) => (e.hidden = licht));
  q('[data-kop-licht]').forEach((e) => (e.hidden = !licht || (jgzVoorop && !!e.parentElement?.querySelector('[data-kop-jgz]'))));
  // Direct regelen: alleen de links bij de onderdelen van deze vraag. De rest staat op de pagina van de gemeente.
  q('[data-regel-soort]').forEach((e) => (e.hidden = !onderdelen.includes(e.dataset.regelSoort!)));
  q('[data-direct-regelen]').forEach((e) => (e.hidden = !e.querySelector('[data-regel-soort]:not([hidden])')));
  q('[data-meer-op-pagina]').forEach((e) => (e.hidden = onderdelen.includes('klacht') || onderdelen.includes('bezwaar')));
  q('[data-generieke-stap]').forEach((e) => (e.hidden = situatieWint));
  q('[data-situatie-stap]').forEach((e) => (e.hidden = !situatieWint || e.dataset.situatieStap !== voorop));
  // Begint een andere gekozen situatie ergens anders (gedragsproblemen bij het wijkteam, naast school loopt vast), dan noemt stap 1 die ingang ook.
  const ookHouder = document.querySelector('[data-ook-houder]');
  q('[data-situatie-ook]').forEach((e) => ookHouder?.appendChild(e));
  const stap1 = q('[data-situatie-stap]').find((e) => !e.hidden);
  ook.forEach((id) => {
    const e = ookHouder?.querySelector(`[data-situatie-ook="${id}"]`);
    if (e && stap1) stap1.appendChild(e);
  });
  // Wijst stap 1 al naar school, dan zegt de leeftijdstip niet nog eens "informeer ook school".
  q('[data-tip-school]').forEach((e) => (e.hidden = t.startTypes.includes('school')));
  const eigenBrieven = situatieWint && q('[data-situatie-brieven]').some((e) => e.dataset.situatieBrieven === voorop);
  q('[data-situatie-brieven]').forEach((e) => (e.hidden = !eigenBrieven || e.dataset.situatieBrieven !== voorop));
  q('[data-generieke-brieven]').forEach((e) => (e.hidden = eigenBrieven));
  // Bij een lichte start geen aanvraagbrieven; wel brieven die bij de situatie zelf horen (zoals aan school).
  q('[data-brieven-blok]').forEach((e) => (e.hidden = (licht && !eigenBrieven) || (geenBezwaar && !!e.closest('[data-knelpunt-blok="hulp-stopt"]'))));
  q('[data-eerste-contact] .gemeente-blok').forEach((b) => (b.hidden = b.dataset.gemeente !== gem || !wijkteamBovenaan));
  q('[data-leerplicht]').forEach((e) => (e.hidden = e.dataset.leerplicht !== gem || !active.includes('school-loopt-vast')));
  q('[data-wijkteam-regel] .gemeente-blok').forEach((b) => (b.hidden = b.dataset.gemeente !== gem || wijkteamBovenaan || nietVoorEigenKind || !situatieWint));
  q('[data-wijkteam-regel]').forEach((e) => e.toggleAttribute('data-gelijk', t.wijkteamGelijk));
  // Een stap die zich aan de leeftijd aanpast (zoals bij kinderbijslag): de variant van de gekozen leeftijd, anders de gewone stap.
  q('[data-lf-groep]').forEach((e) => {
    const variant = q(`[data-lf-groep="${e.dataset.lfGroep}"][data-lf-band="${lf}"]`).length > 0;
    e.hidden = e.dataset.lfBand ? e.dataset.lfBand !== lf : variant;
  });
  // Contactkaart bovenaan: de ingang bij deze vraag (modus) en de kop ("Hier meldt u zich").
  q('#nu-doen').forEach((e) => {
    e.dataset.modus = t.modus;
    e.dataset.kop = t.kopNuDoen;
  });
  q('[data-vs-leeftijd]').forEach((e) => (e.hidden = e.dataset.vsLeeftijd !== lf || geenLeeftijdstip));

  // Blok 2: alle ingangen behalve de eerste, in de volgorde van de situaties. Niet bij spoed.
  q('#gemeente').forEach((e) => (e.hidden = t.gemeenteVerborgen));
  q('[data-kop-gemeente]').forEach((e) => (e.textContent = t.kopGemeente));
  q('.routes-lijst [data-route]').forEach((e) => {
    const r = t.route(e.dataset.route!);
    e.hidden = r.verborgen;
    e.style.order = String(r.plek); // alleen als sorteersleutel; de volgorde wordt hieronder in de HTML gezet
  });
  // Zijnavigatie volgt zichtbare secties
  q('[data-nav]').forEach((a) => {
    const sectie = document.getElementById(a.dataset.nav!);
    a.hidden = !sectie || sectie.hidden;
  });
  q('[data-inhoud] [data-situatie]').forEach((e) => (e.hidden = !active.includes(e.dataset.situatie!)));
  // Zichtbaar als de leeftijdsrange van de vorm of hulpsoort past bij de gekozen leeftijd.
  const inBand = (e: HTMLElement) => t.inBand(e.dataset.van, e.dataset.tot);
  q('[data-hulpsoort]').forEach((e) => (e.hidden = !hulp.has(e.dataset.hulpsoort!) || (e.dataset.van !== undefined && !inBand(e))));
  q('[data-landelijk]').forEach((e) => (e.hidden = !land.has(e.dataset.landelijk!)));
  q('#organisaties [data-themas]').forEach((e) => (e.hidden = !hasThema(e)));
  q('[data-tip-situaties]').forEach((e) => (e.hidden = !t.bijGekozen(e.dataset.tipSituaties ?? '') || !inBand(e)));
  q('[data-vs-leeftijd]').forEach((e) => (e.hidden = e.dataset.vsLeeftijd !== lf || geenLeeftijdstip));
  // Therapievormen op volgorde van toepasbaarheid (tipPlek in lib/overzicht-toestand.ts), bij gelijke plek op alfabet (tipI).
  const plek = (e: HTMLElement) => t.tipPlek(e.dataset.tipRang ?? '', e.dataset.tipSituaties ?? '');
  const tipGrid = document.querySelector('[data-tip-grid]');
  q('[data-tip-situaties]')
    .map((e) => [e, plek(e), Number(e.dataset.tipI)] as const)
    .sort((a, b) => a[1] - b[1] || a[2] - b[2])
    .forEach(([e]) => tipGrid?.appendChild(e));
  q('[data-tips-wrap]').forEach((w) => (w.hidden = zonderGemeente || !q('[data-tip-situaties]').some((e) => !e.hidden)));
  const tipsZichtbaar = q('[data-tips-wrap]').some((w) => !w.hidden);
  // Kaart Behandeling: naar de therapievormen hieronder als daar een vorm uit die hulpsoort staat, anders naar de algemene pagina.
  q('a[data-naar-tips]').forEach((el) => {
    const kaart = el as HTMLAnchorElement;
    const id = kaart.dataset.hulpsoort!;
    const hier = tipsZichtbaar && q('[data-tip-hulpsoorten]').some((e) => !e.hidden && (e.dataset.tipHulpsoorten ?? '').split(' ').includes(id));
    kaart.href = hier ? '#tips' : kaart.dataset.naarTips!;
    const pijl = kaart.querySelector('.arrow');
    if (pijl) pijl.textContent = hier ? 'Welke behandelingen passen bij uw situatie ↓' : 'Wat is het en hoe vraag ik het aan →';
  });
  q('[data-tips-link]').forEach((e) => (e.hidden = !tipsZichtbaar));
  q('[data-tips-link-alg]').forEach((e) => (e.hidden = tipsZichtbaar));

  // Nummers doortellen over de zichtbare secties (zijnavigatie én koppen), anders sprong de nummering bv. van → naar 4.
  q('[data-nav]')
    .filter((a) => a.dataset.nav !== 'nu-doen')
    .forEach((a) => {
      const sectie = document.getElementById(a.dataset.nav!);
      a.hidden = !sectie || sectie.hidden;
    });
  let nr = 0;
  q('[data-nav]')
    .filter((a) => a.dataset.nav !== 'nu-doen' && !a.hidden)
    .forEach((a) => {
      nr++;
      const n = a.querySelector('.n');
      if (n) n.textContent = String(nr);
      const kop = document.getElementById(a.dataset.nav!)?.querySelector(':scope > h2 .section-num');
      if (kop) kop.textContent = String(nr);
    });
  const known = q('#gemeente .gemeente-blok').some((b) => b.dataset.gemeente === gem && gem !== '');
  q('#gemeente .gemeente-blok').forEach((b) => (b.hidden = b.dataset.gemeente !== (known || gem === '_overig' ? gem : '')));
  q('[data-routes-algemeen]').forEach((e) => (e.hidden = known));
  // Lokale steun: welke items en in welke volgorde (kiesLokaal in lib/overzicht-toestand.ts).
  q('.gemeente-blok [data-lokaal-wrap]').forEach((w) => {
    const items = Array.from(w.querySelectorAll<HTMLElement>('[data-li]'));
    const lijst = w.querySelector('ul');
    const tonen = t.kiesLokaal(items, (i) => ({
      cjg: !!i.dataset.liCjg,
      gelabeld: !!i.dataset.liGelabeld,
      situaties: i.dataset.liSits ?? '',
      iedereen: !!i.dataset.liIedereen,
      themas: i.dataset.themas ?? '',
    }));
    items.forEach((i) => (i.hidden = !tonen.includes(i)));
    tonen.forEach((i) => lijst?.appendChild(i));
    w.hidden = tonen.length === 0;
  });
  v.verhuizing.teken();
  v.hulpStopt.teken();
  v.wordt18.teken();
  v.wachten.teken();
  v.afgewezen.teken();
  v.gescheiden.teken();
  v.uitbreiden.teken();
  v.geld.teken();
  // Nummering: de lijsten na stap 1 (start="2") tellen verder vanaf het aantal zichtbare stappen in de eerste lijst. Die kan leeg zijn
  // (stap 1 valt weg bij "De hulp stopt", wachten of afgewezen) of een stap extra hebben (gezag bij hulp aanvragen). Staan er twee
  // zichtbare lijsten onder elkaar (eigen stappen van een situatie en de aanvraag), dan telt de tweede door na de eerste. Een lijst
  // in een ingeklapt blok is een andere weg en telt vanaf stap 1.
  q('[data-knelpunt-blok]').forEach((b) => {
    const n1 = Array.from(b.querySelectorAll<HTMLElement>('.stap-een > li')).filter((li) => !li.hidden).length;
    let n = n1;
    b.querySelectorAll<HTMLElement>('ol.steps[start="2"]').forEach((ol) => {
      const apart = !!ol.closest('details');
      ol.style.counterReset = `step ${apart ? n1 : n}`;
      if (!apart && !ol.hidden) n += Array.from(ol.children).filter((li) => !(li as HTMLElement).hidden).length;
    });
  });
  // Een link naar een klachtbrief in "Hierbij handig" alleen als die brief niet al bij de stappen of de voorbeeldbrieven staat.
  const opPagina = (pad: string) =>
    !!q(`[data-knelpunt-blok="${kpActive}"] a.stap-brief, [data-knelpunt-blok="${kpActive}"] a[data-brief-kaart]`).find(
      (x) => !x.closest('[hidden]') && new URL((x as HTMLAnchorElement).href).pathname === pad,
    );
  (q('a[data-klachtbrief]') as HTMLAnchorElement[]).forEach((a) => {
    a.parentElement!.hidden = opPagina(new URL(a.href).pathname);
  });
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
    if (na2 && hd) {
      na2.after(hd);
      if (lft) hd.before(lft);
    }
  }
  // Blok 2 op volgorde zetten, en elk contact maar één keer tonen (ook niet als het al onder stap 1 staat).
  const gezien = new Set<string>();
  q('[data-eerste-contact] .gemeente-blok')
    .filter((b) => !b.hidden)
    .forEach((b) => b.querySelectorAll<HTMLAnchorElement>('a[href^="tel:"]').forEach((a) => gezien.add(a.getAttribute('href')!)));
  q('.routes-lijst').forEach((lijst) => {
    const rs = Array.from(lijst.querySelectorAll<HTMLElement>(':scope > [data-route]')).sort((x, y) => Number(x.style.order) - Number(y.style.order));
    const eerstAnders = lijst.querySelector(':scope > :not([data-route])');
    rs.forEach((r) => lijst.insertBefore(r, eerstAnders));
    if (lijst.hidden) return;
    // Het wijkteam eerst ontdubbelen: een contact dat ook bij het wijkteam hoort, blijft daar staan.
    [...rs]
      .sort((x, y) => Number(y.dataset.route === 'wijkteam') - Number(x.dataset.route === 'wijkteam'))
      .filter((r) => !r.hidden)
      .forEach((r) =>
        r.querySelectorAll<HTMLElement>('.contact').forEach((c) => {
          const sleutel = c.querySelector('a[href^="tel:"]')?.getAttribute('href') ?? c.querySelector('strong')?.textContent ?? '';
          c.hidden = !!sleutel && gezien.has(sleutel);
          if (sleutel) gezien.add(sleutel);
        }),
      );
  });
  // Voor op papier: datum, adres van het overzicht en het adres bij elke website.
  afdrukken(kpGekozen);
  // Klaar met tekenen: de uitleg bij moeilijke woorden (Base.astro) kan nu de zichtbare tekst nalopen.
  document.dispatchEvent(new CustomEvent('jr:getekend'));
};
