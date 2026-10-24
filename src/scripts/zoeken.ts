/**
 * Zoeken op de site (zoeken.feature). Het vergrootglas rechts in het menu vervangt het menu door een zoekbalk; Escape of het
 * kruisje zet het menu terug. De index maakt Pagefind bij de build (package.json, "build"); dit script haalt pagefind.js pas
 * op bij het eerste openen, zodat de pagina's niet groter worden.
 * Resultaten: titel, soort pagina (filter "soort", Base.astro) en een stukje tekst. Eerst de andere pagina's, dan de gemeenten,
 * hooguit drie (de rest achter "Meer gemeenten"), anders vullen 342 gelijke pagina's de lijst. Noemt de zoekopdracht een gemeente
 * of woonplaats (meta "plaatsen" op de gemeentepagina), dan staat die gemeente bovenaan. Gaat een treffer over één onderdeel van een lange pagina
 * (zoals Landelijk), dan linkt het resultaat naar dat onderdeel.
 */
type Treffer = { url: string; titel: string; stukje: string; soort: string; score: number; plaatsen: string[]; zoekwoorden: string[]; inKop: number };
type PagefindData = { url: string; meta: { title?: string; plaatsen?: string; zoekwoorden?: string; herkenning?: string }; excerpt: string; filters: Record<string, string[]>; sub_results?: { url: string; title: string; excerpt: string; locations?: number[] }[] };
type Resultaat = { id: string; score: number; data: () => Promise<PagefindData> };
type Uitkomst = { results: Resultaat[]; samen: number };
type Pagefind = { options: (o: object) => Promise<void>; search: (q: string, o?: object) => Promise<Uitkomst>; debouncedSearch: (q: string, o?: object) => Promise<Uitkomst | null> };

const MAX_RESULTATEN = 12;
/** Zoveel pagina's met maar één van de zoekwoorden lezen we er altijd bij. */
const LOS_EXTRA = 6;
const MAX_GEMEENTEN = 3;
/** Minder resultaten dan dit met alle woorden samen: dan ook zoeken op de losse woorden. */
const WEINIG = 3;
/** Zoveel gemeenten extra na "Meer gemeenten". */
const MEER_GEMEENTEN = 20;
const base = import.meta.env.BASE_URL.replace(/\/$/, '');
const kop = document.querySelector<HTMLElement>('.site-header');
const knop = document.querySelector<HTMLButtonElement>('[data-zoek-knop]');
const balk = document.querySelector<HTMLFormElement>('[data-zoekbalk]');
const invoer = document.querySelector<HTMLInputElement>('[data-zoek-invoer]');
const sluitKnop = document.querySelector<HTMLButtonElement>('[data-zoek-sluit]');
const paneel = document.querySelector<HTMLElement>('[data-zoek-paneel]');
const melding = document.querySelector<HTMLElement>('[data-zoek-melding]');
const lijst = document.querySelector<HTMLOListElement>('[data-zoek-resultaten]');

let pagefind: Promise<Pagefind> | null = null;
const laad = () => (pagefind ??= import(/* @vite-ignore */ `${base}/pagefind/pagefind.js`).then(async (p: Pagefind) => {
  await p.options({ baseUrl: `${base}/` });
  return p;
}).catch((e) => { pagefind = null; throw e; }));

const open = () => {
  kop!.classList.add('zoek-open');
  balk!.hidden = false;
  knop!.setAttribute('aria-expanded', 'true');
  invoer!.focus();
  laad().catch(() => { melding!.textContent = 'Zoeken lukt nu niet. Probeer het later opnieuw.'; paneel!.hidden = false; });
};
const sluit = () => {
  kop!.classList.remove('zoek-open');
  balk!.hidden = true;
  paneel!.hidden = true;
  knop!.setAttribute('aria-expanded', 'false');
  knop!.focus();
};

/** Tekst veilig als HTML (het stukje tekst wordt als HTML gezet, zie item()). */
const ontsnap = (t: string) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Een treffer: liever het onderdeel van de pagina (een kop met een id) met de meeste gevonden woorden, als dat niet de pagina zelf is. */
/** Pagina's over één onderwerp: daar opent een treffer bij de uitleg, tenzij de zoekopdracht over een ander onderdeel gaat. */
const EEN_ONDERWERP = new Set(['Therapievorm', 'Hulpsoort', 'Voorbeeldbrief', 'Hulpmiddel']);
/** Woorden die naar een vast onderdeel van een therapievorm of hulpsoort wijzen (ankers in therapievormen/[slug] en hulpsoorten/[slug]). */
const ONDERDEEL_WOORDEN: [string, RegExp][] = [
  ['aanvragen', /^(aanvragen|aanvraag|aanmelden|aanmelding|verwijzing|verwijzen|verwijsbrief|krijgen)$/],
  ['onderbouwing', /^(vergoeding|vergoed|vergoedt|kosten|kost|betalen|betaalt|eigen|risico|bewijs|bewezen|onderzoek|effect|effectief)$/],
  ['voorwie', /^(leeftijd|oud|jong|geschikt|wie)$/],
  ['verwachting', /^(duur|duurt|lang|hoelang|sessies|sessie|weken|verschil|verwachten|resultaat)$/],
];
const zonderStreepjes = (t: string) => t.replace(/\u00ad/g, '');
const zonderHaakjes = (t: string) => t.replace(/\s*\(.*?\)/g, '');

/**
 * Een treffer, en bij welk onderdeel (kop met anker) hij opent. Vaste volgorde:
 * 1. een kop die precies past ("pgb" → "Pgb (persoonsgebonden budget)", niet "Pgb-plan"), of waarin alle zoekwoorden staan;
 * 2. een situatie opent altijd bij het begin (Naima, persona-test 24-10);
 * 3. een pagina over één onderwerp (therapievorm, hulpsoort, brief, hulpmiddel) opent bij de uitleg (#wat of het begin), tenzij de
 *    zoekopdracht over een ander onderdeel gaat ("emdr aanvragen", "emdr vergoeding"); "PMTK" opende bij de vergoeding;
 * 4. een pagina over veel onderwerpen (Landelijk, gemeenten, overzichten): het onderdeel met de meeste treffers; bij gelijke stand een
 *    blok met anker; bij een gemeente "Hoe gaat het hier?" (#ervaringen, veel tekst) alleen als geen ander onderdeel past.
 */
const naarTreffer = (d: PagefindData, score: number, term = ''): Treffer => {
  const titel = zonderStreepjes(d.meta.title ?? d.url);
  const soort = d.filters.soort?.[0] ?? 'Pagina';
  const woorden = term ? kern(term).split(' ') : [];
  const metAnker = (d.sub_results ?? []).filter((x) => x.url.includes('#')).map((x) => ({ ...x, title: zonderStreepjes(x.title) })).filter((x) => x.title !== titel);
  const kopWoorden = (x: { title: string }) => norm(zonderHaakjes(x.title)).trim().split(' ');
  let sub: (typeof metAnker)[number] | undefined;
  if (soort === 'Situatie') sub = undefined;
  else {
    // 1. Een kop die precies past, anders de kortste kop met alle zoekwoorden.
    const precies = metAnker.find((x) => woorden.length && kopWoorden(x).join(' ') === woorden.join(' '));
    const metAlle = metAnker.filter((x) => woorden.length && woorden.every((w) => norm(x.title).includes(` ${w} `))).sort((a, b) => kopWoorden(a).length - kopWoorden(b).length)[0];
    sub = precies ?? metAlle;
    if (!sub && EEN_ONDERWERP.has(soort)) {
      // 3. Pagina over één onderwerp: een onderdeel waar de zoekopdracht over gaat, anders de uitleg.
      const anker = ONDERDEEL_WOORDEN.find(([, re]) => woorden.some((w) => re.test(w)))?.[0];
      sub = metAnker.find((x) => anker && x.url.endsWith(`#${anker}`)) ?? metAnker.find((x) => x.url.endsWith('#wat'));
    } else if (!sub) {
      // 4. Pagina over veel onderwerpen: het onderdeel met de meeste treffers.
      const anderDeel = metAnker.some((x) => !x.url.endsWith('#ervaringen') && (x.locations?.length ?? 0) > 0);
      const subs = (d.sub_results ?? []).filter((x) => !(soort === 'Gemeente' && anderDeel && x.url.endsWith('#ervaringen')));
      const beste = [...subs].sort((a, b) => (b.locations?.length ?? 0) - (a.locations?.length ?? 0) || Number(b.url.includes('#')) - Number(a.url.includes('#')))[0];
      sub = beste && metAnker.find((x) => x.url === beste.url);
    }
  }
  const volledigeTitel = sub ? `${titel} › ${sub.title}` : titel;
  return {
    url: sub?.url ?? d.url,
    titel: volledigeTitel,
    /** Hoeveel zoekwoorden in de titel of de gekozen kop staan: zo'n pagina gaat voor een pagina waar ze alleen in de tekst staan. */
    inKop: woorden.filter((w) => norm(volledigeTitel).includes(` ${w} `)).length,
    // Bij een situatie de herkenningszin: het stukje tekst kon de verborgen zoekvormen tonen ("slaapt wordt wakker").
    stukje: soort === 'Situatie' && d.meta.herkenning ? ontsnap(d.meta.herkenning) : sub?.excerpt ?? d.excerpt,
    soort,
    score,
    plaatsen: (d.meta.plaatsen ?? '').split('|').filter(Boolean),
    zoekwoorden: (d.meta.zoekwoorden ?? '').split('|').filter(Boolean),
  };
};

const item = (t: Treffer) => {
  const li = document.createElement('li');
  li.dataset.soort = t.soort;
  const a = Object.assign(document.createElement('a'), { href: t.url, textContent: t.titel });
  const soort = Object.assign(document.createElement('span'), { className: 'zoek-soort', textContent: t.soort });
  const p = document.createElement('p');
  p.innerHTML = t.stukje; // Pagefind geeft een stukje tekst met <mark> om de gevonden woorden; de tekst zelf is al ontsnapt.
  li.append(soort, a, p);
  return li;
};

const norm = (s: string) => ` ${s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()} `;
/** Noemt de zoekopdracht deze naam als losse woorden ("bezwaar utrecht" noemt Utrecht, "utrechtse heuvelrug" niet)? */
const noemt = (q: string, naam: string) => norm(q).includes(norm(naam));

/** Woorden die in een zin van een ouder niets zeggen over het onderwerp ("Mijn kind is nog steeds niet zindelijk"). */
const STOPWOORDEN = new Set(('mijn ons onze zijn haar hun kind kinderen zoon dochter jongen meisje baby peuter puber is was wordt werd heeft hebben ' +
  'heb doet doen gaat wil wilt kan kunnen moet nog steeds niet geen wel al meer erg heel veel vaak soms altijd nooit hele de het een en of ' +
  'op in aan met van voor naar bij om over uit tot dan dat die dit wat hoe waarom wanneer hij zij ze we wij ik u je jij me mij hem andere anderen ' +
  'dag dagen keer zo ook maar want omdat als woon woont wonen last').split(' '));
/** De woorden die iets zeggen; bij een zin van één of twee woorden de zin zelf. */
const kern = (q: string) => {
  const woorden = norm(q).trim().split(' ').filter((w) => w && !STOPWOORDEN.has(w));
  return woorden.length ? woorden.join(' ') : q;
};

let laatste = '';
const zoek = async () => {
  const q = invoer!.value.trim();
  laatste = q;
  if (!q) { paneel!.hidden = true; lijst!.replaceChildren(); return; }
  // Melding tot de resultaten er zijn: de eerste keer laadt de zoekfunctie even (Ingrid, persona-test 24-10).
  if (!lijst!.children.length) { melding!.textContent = 'Zoeken…'; paneel!.hidden = false; }
  const p = await laad();
  /** Zoeken op alle woorden samen. Staat er weinig met alle woorden (een lange pagina heeft ze soms toevallig allemaal), dan ook op
   *  de losse woorden, met de scores opgeteld; wat alle woorden heeft, blijft bovenaan. Met `altijdLos` ook als er genoeg is: de pagina
   *  over EMDR heeft "duurt" niet ("hoe lang duurt emdr"), maar hoort wel in de lijst. */
  const vind = async (term: string, filters: object, wacht = false, altijdLos = false): Promise<Uitkomst | null> => {
    const u = wacht ? await p.debouncedSearch(term, { filters }) : await p.search(term, { filters });
    const woorden = term.split(' ');
    if (!u || (u.results.length >= WEINIG && !altijdLos) || woorden.length < 2) return u && { ...u, samen: u.results.length };
    const per = new Map<string, Resultaat>();
    for (const w of woorden) for (const r of (await p.search(w, { filters })).results) {
      const al = per.get(r.id);
      per.set(r.id, al ? { ...al, score: al.score + r.score } : r);
    }
    const alle = new Set(u.results.map((r) => r.id));
    return { results: [...u.results, ...[...per.values()].filter((r) => !alle.has(r.id)).sort((a, b) => b.score - a.score)], samen: u.results.length };
  };
  const term = kern(q);
  // Twee keer zoeken: de andere pagina's en de gemeenten apart, anders verdringen 342 gelijke gemeentepagina's de rest.
  const anders = await vind(term, { not: { soort: 'Gemeente' } }, true, true);
  if (!anders || q !== laatste) return; // Er is intussen verder getypt.
  const gemeenteUitkomst = (await vind(term, { soort: 'Gemeente' }))!;
  const lees = (u: Uitkomst, n: number) => Promise.all(u.results.slice(0, n).map(async (r) => naarTreffer(await r.data(), r.score, term)));
  // Van de andere pagina's: wat alle woorden heeft, plus een paar met één woord; die laatste komen alleen naar voren met het woord in een kop.
  const leesAnders = (u: Uitkomst, t = term) => Promise.all([...u.results.slice(0, Math.min(u.samen, MAX_RESULTATEN)), ...u.results.slice(u.samen, u.samen + Math.max(LOS_EXTRA, MAX_RESULTATEN - u.samen))]
    .map(async (r) => naarTreffer(await r.data(), r.score, t)));
  // Van de gemeenten alleen de eerste drie ophalen (elk stukje is een apart bestand); de rest pas bij "Meer gemeenten".
  const [andereTreffers, gemeenteTreffers] = await Promise.all([leesAnders(anders), lees(gemeenteUitkomst, MAX_GEMEENTEN)]);
  let eerst = andereTreffers;
  if (q !== laatste) return;
  // Volgorde: eerst gemeenten die de zoekopdracht noemt (naam of woonplaats), dan de andere pagina's, dan de overige gemeenten.
  const genoemd = (t: Treffer) => t.plaatsen.some((pl) => noemt(q, pl));
  // "bezwaar utrecht": de andere pagina's noemen Utrecht niet. Zoek die daarom nog eens zonder de genoemde plaats.
  const plaats = gemeenteTreffers.flatMap((t) => t.plaatsen).find((pl) => noemt(q, pl));
  const zonderPlaats = plaats ? kern(norm(q).replace(norm(plaats), ' ')) : '';
  if (zonderPlaats.trim()) {
    eerst = await leesAnders((await vind(zonderPlaats, { not: { soort: 'Gemeente' } }, false, true))!);
    if (q !== laatste) return;
  }
  // Een situatie waarvan een zoekwoord letterlijk in de zoekopdracht staat ("gamet", "slaat"), gaat voor de andere pagina's.
  const woorden = new Set(norm(term).trim().split(' '));
  // Alleen de woorden die iets zeggen tellen, aan beide kanten ("wil niet naar school" telt als "school").
  const herkend = (t: Treffer) => t.soort === 'Situatie' && [...t.zoekwoorden, t.titel].some((z) => kern(z).split(' ').every((w) => woorden.has(w)));
  // Een situatie die het woord alleen terloops noemt ("zorgovereenkomst" bij Zindelijkheid), komt na de andere soorten pagina's.
  const terloops = (t: Treffer) => t.soort === 'Situatie' && !herkend(t);
  // Daarna: zoekwoorden in de titel of een kop ("jeugdstem", "kinderbijslag") gaan voor zoekwoorden alleen in de tekst (sort is stabiel).
  const midden = eerst.filter((t) => !herkend(t) && !terloops(t)).sort((a, b) => b.inKop - a.inKop);
  eerst = [...eerst.filter(herkend), ...midden, ...eerst.filter(terloops)].slice(0, MAX_RESULTATEN);
  const treffers = [...gemeenteTreffers.filter(genoemd), ...eerst, ...gemeenteTreffers.filter((t) => !genoemd(t))];
  const meerGemeenten = gemeenteUitkomst.results.slice(MAX_GEMEENTEN, MAX_GEMEENTEN + MEER_GEMEENTEN);
  paneel!.hidden = false;
  if (!treffers.length) {
    melding!.textContent = `Niets gevonden voor “${q}”.`;
    lijst!.replaceChildren();
    return;
  }
  melding!.textContent = '';
  lijst!.replaceChildren(...treffers.map((t) => item(t)));
  if (meerGemeenten.length) {
    const meer = Object.assign(document.createElement('button'), { type: 'button', className: 'linkknop zoek-meer', textContent: 'Meer gemeenten ' });
    meer.append(Object.assign(document.createElement('span'), { textContent: `(${gemeenteUitkomst.results.length - MAX_GEMEENTEN})` }));
    meer.lastElementChild!.setAttribute('aria-hidden', 'true');
    const rij = Object.assign(document.createElement('li'), { className: 'zoek-meer-rij' });
    meer.addEventListener('click', async () => {
      meer.disabled = true;
      const extra = await Promise.all(meerGemeenten.map(async (r) => naarTreffer(await r.data(), r.score, term)));
      if (q !== laatste) return;
      rij.replaceWith(...extra.map((t) => item(t)));
    });
    rij.append(meer);
    lijst!.append(rij);
  }
};

if (kop && knop && balk && invoer && sluitKnop && paneel && melding && lijst) {
  knop.hidden = false;
  knop.addEventListener('click', open);
  sluitKnop.addEventListener('click', sluit);
  invoer.addEventListener('input', () => { zoek().catch(() => { melding.textContent = 'Zoeken lukt nu niet. Probeer het later opnieuw.'; paneel.hidden = false; }); });
  balk.addEventListener('submit', () => { zoek().catch(() => { melding.textContent = 'Zoeken lukt nu niet. Probeer het later opnieuw.'; paneel.hidden = false; }); });
  // Buiten de kopbalk klikken sluit de lijst met resultaten; de zoekbalk blijft open. In het zoekveld klikken opent hem weer.
  document.addEventListener('click', (e) => { if (!paneel.hidden && !kop.contains(e.target as Node)) paneel.hidden = true; });
  invoer.addEventListener('click', () => { if (invoer.value.trim() && lijst.children.length) paneel.hidden = false; });
  kop.addEventListener('keydown', (e) => { if (e.key === 'Escape' && kop.classList.contains('zoek-open')) sluit(); });
}
