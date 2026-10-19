/**
 * Verdieping bij de verhuizing: naar welke gemeente en wanneer (beide optioneel). Uit de URL (?naar=, ?datum=) of van een
 * eerder bezoek; bij een wijziging gaan ze in de URL, zodat het overzicht te bewaren en te delen is.
 */
import { laadNieuweGemeente } from '../../lib/gemeente-blokken';
import { dagenTot, leesDatum } from '../../lib/termijnen';
import { koppelDatumvelden } from '../../lib/datumveld';
import { koppelSuggesties } from '../../lib/suggesties';
import { params, namen, keuze, bewaard, zetInUrl, iso, isoDatum, alsDatum, inVeld, datumKort, over } from './gedeeld';

const VH_KEY = 'jr.verhuizing';
const VER_WEG = 91; // dagen; zie teken

export const verhuizing = (opnieuw: () => void) => {
  const vhBewaard = bewaard(VH_KEY);
  let naar: string = params.get('naar') ?? vhBewaard.naar ?? '';
  let verhuisdatum = isoDatum(params.get('datum') ?? vhBewaard.datum);
  if (!namen.g[naar]) naar = '';
  const vhBlok = document.querySelector<HTMLElement>('[data-verdieping="verhuizing"]');
  const naarVeld = vhBlok?.querySelector<HTMLInputElement>('[data-vh-naar]');
  const datumVeld = vhBlok?.querySelector<HTMLInputElement>('[data-vh-datum]');
  const vhMelding = vhBlok?.querySelector<HTMLElement>('[data-vh-melding]');
  // Plaatsnaam → gemeente: eerst de gemeenten zelf; bij het eerste gebruik ook de woonplaatsen (zoals bij de gemeentekeuze).
  // Een woonplaats in twee gemeenten alleen met de gemeente erbij ("Plaats (gemeente X)").
  const plaatsen = new Map(Object.entries(namen.g).map(([slug, naam]) => [naam.toLowerCase(), slug]));
  // Keuzes voor de suggestielijst (lib/suggesties.ts): eerst de gemeenten, na het laden ook de woonplaatsen.
  const plaatsLabels = Object.values(namen.g);
  const vhSuggesties = naarVeld ? koppelSuggesties(naarVeld, () => plaatsLabels) : null;
  let woonplaatsen: Promise<void> | null = null;
  const laadWoonplaatsen = () => (woonplaatsen ??= fetch(`${import.meta.env.BASE_URL.replace(/\/$/, '')}/woonplaatsen.json`).then((r) => r.json()).then((paren: [string, string][]) => {
    const per = new Map<string, Set<string>>();
    paren.forEach(([plaats, slug]) => per.set(plaats.toLowerCase(), (per.get(plaats.toLowerCase()) ?? new Set()).add(slug)));
    const opties = paren.filter(([, slug]) => namen.g[slug]).map(([plaats, slug]) => {
      const label = `${plaats} (gemeente ${namen.g[slug]})`;
      plaatsen.set(label.toLowerCase(), slug);
      if (per.get(plaats.toLowerCase())!.size === 1 && !plaatsen.has(plaats.toLowerCase())) plaatsen.set(plaats.toLowerCase(), slug);
      // "Almere (gemeente Almere)" niet naast "Almere": dat is dezelfde keuze.
      return plaats === namen.g[slug] ? '' : label;
    }).filter(Boolean);
    plaatsLabels.push(...opties);
    vhSuggesties?.ververs();
  }).catch(() => { woonplaatsen = null; }));
  const bewaarVerhuizing = () => {
    if (naar || verhuisdatum) localStorage.setItem(VH_KEY, JSON.stringify({ naar, datum: verhuisdatum })); else localStorage.removeItem(VH_KEY);
    zetInUrl({ naar, datum: verhuisdatum });
  };
  const verhuizingGewijzigd = () => { bewaarVerhuizing(); laadNieuweGemeente(naar).then((ok) => ok && opnieuw()); };
  // Beide vragen beantwoord: inklappen tot de samenvatting, zodat de stappen hoger in beeld komen. Niet tijdens het typen van de plaats.
  const klapIn = () => { if (naar && verhuisdatum) vhBlok?.setAttribute('data-vd-ingeklapt', ''); };
  if (naarVeld && datumVeld) {
    naarVeld.value = namen.g[naar] ?? '';
    datumVeld.value = inVeld(verhuisdatum);
    koppelDatumvelden();
    // Bij een tweede bezoek staat het antwoord voorop, niet de vragen.
    if (naar || verhuisdatum) vhBlok!.setAttribute('data-vd-ingeklapt', '');
    naarVeld.addEventListener('focus', laadWoonplaatsen);
    naarVeld.addEventListener('input', () => {
      const slug = plaatsen.get(naarVeld.value.trim().toLowerCase());
      if (vhMelding) vhMelding.hidden = true;
      if (slug && slug !== naar) { naar = slug; verhuizingGewijzigd(); }
    });
    // Pas bij verlaten van het veld (of Enter) melden dat een plaats onbekend is; tijdens het typen niet.
    naarVeld.addEventListener('change', async () => {
      const tekst = naarVeld.value.trim().toLowerCase();
      if (tekst) await laadWoonplaatsen();
      const slug = plaatsen.get(tekst) ?? '';
      if (vhMelding) {
        vhMelding.hidden = !tekst || !!slug;
        vhMelding.textContent = 'Deze plaats kennen we niet. Typ de eerste letters en kies uit de lijst die verschijnt.';
      }
      if (slug !== naar) { naar = slug; verhuizingGewijzigd(); }
      klapIn();
    });
    // dd-mm-jjjj (getypt of uit de kalender, zie lib/datumveld.ts); bewaard als jjjj-mm-dd.
    datumVeld.addEventListener('input', () => {
      const d = leesDatum(datumVeld.value);
      const nieuw = d ? iso(d) : '';
      const fout = !d && datumVeld.value.replace(/\D/g, '').length >= 8;
      if (vhMelding) { vhMelding.hidden = !fout; if (fout) vhMelding.textContent = 'Vul de datum in als dd-mm-jjjj, bijvoorbeeld 01-12-2026.'; }
      // Leeg gemaakt: datum weg. Halverwege getypt: niets veranderen.
      if (nieuw !== verhuisdatum && (d || !datumVeld.value.trim())) { verhuisdatum = nieuw; verhuizingGewijzigd(); if (d) klapIn(); }
    });
    vhBlok!.querySelector('[data-vd-wissen]')?.addEventListener('click', () => {
      naar = ''; verhuisdatum = ''; naarVeld.value = ''; datumVeld.value = '';
      if (vhMelding) vhMelding.hidden = true;
      vhBlok!.removeAttribute('data-vd-ingeklapt');
      verhuizingGewijzigd();
    });
  }
  /** Tekent wat de antwoorden van de verdieping met de stappen doen. Alleen zichtbaar bij "Wij verhuizen". */
  const teken = () => {
    const blok = document.querySelector<HTMLElement>('[data-knelpunt-blok="verhuizing"]');
    if (!vhBlok || !blok) return;
    const huidig = namen.g[keuze.gem] ?? '';
    const nieuweNaam = namen.g[naar] ?? '';
    const binnen = !!naar && naar === keuze.gem;
    const nieuw = !!naar && !binnen;
    const datum = alsDatum(verhuisdatum);
    const dagen = datum ? dagenTot(datum) : null;
    const verhuisd = dagen !== null && dagen < 0;
    // Nog ver weg: dan hoeft de ouder nu nog niets te doen. Drie maanden is een praktische vuistregel (geen wettelijke termijn):
    // genoeg tijd voor het overdragen, en dicht genoeg bij de verhuizing dat het besluit dan nog loopt.
    const verWeg = dagen !== null && dagen > VER_WEG;
    const beginOp = datum && new Date(datum.getFullYear(), datum.getMonth(), datum.getDate() - VER_WEG);
    const nogNiets = verWeg && beginOp ? ` U hoeft nu nog niets te regelen: begin rond ${datumKort(beginOp)}. Loopt het huidige besluit voor die tijd af? Vraag dan gewoon een nieuw besluit aan bij ${huidig || 'uw gemeente'}.` : '';
    const ingevuld = !!naar || !!datum;
    // Samenvatting boven de vragen (en ingeklapt in plaats van de vragen).
    const van = huidig && nieuw ? ` van ${huidig}` : '';
    const samenvatting = !ingevuld ? ''
      : binnen ? `U verhuist binnen ${huidig}. De gemeente blijft dezelfde, dus er hoeft niets overgedragen te worden.`
      : nieuw && datum && verhuisd ? `U bent op ${datumKort(datum)} verhuisd${van} naar ${nieuweNaam}. De stappen hieronder zijn daarop aangepast: meld u nu bij het wijkteam van ${nieuweNaam} (stap 3).`
      : nieuw && datum ? `U verhuist ${over(dagen!)}${van} naar ${nieuweNaam} (${datumKort(datum)}). De stappen hieronder zijn daarop aangepast.${nogNiets}`
      : nieuw ? `U verhuist${van} naar ${nieuweNaam}. Het wijkteam daar staat nu bij stap 3. Vul ook de datum in, dan ziet u wat u wanneer regelt.`
      : `${verhuisd ? `U bent op ${datumKort(datum!)} verhuisd` : `U verhuist ${over(dagen!)} (${datumKort(datum!)})`}.${nogNiets} Vul ook de nieuwe gemeente in, dan ziet u daar het wijkteam.`;
    const sv = vhBlok.querySelector<HTMLElement>('[data-vd-samenvatting]');
    if (sv) sv.textContent = samenvatting;
    vhBlok.querySelector<HTMLElement>('[data-vd-wissen]')!.hidden = !ingevuld;
    vhBlok.querySelector<HTMLElement>('[data-vd-gevolg]')!.hidden = !ingevuld;
    if (!ingevuld) vhBlok.removeAttribute('data-vd-ingeklapt');
    // Tijdlijn: alleen met een datum een kop per stap.
    const label: Record<string, string> = !datum ? {} : verhuisd
      ? { nu: `Nog niet gedaan? Doe het alsnog${huidig && nieuw ? ` bij ${huidig}` : ''}:`, voor: 'Nog niet gedaan? Doe het alsnog:', na: 'Doe dit nu:' }
      : { nu: verWeg ? `Vanaf ${datumKort(beginOp!)}, ongeveer drie maanden voor de verhuizing:` : `Nu, u verhuist ${over(dagen!)}:`, voor: 'Vóór de verhuizing:', na: `Rond de verhuizing (${datumKort(datum)}):` };
    blok.querySelectorAll<HTMLElement>('[data-moment]').forEach((e) => { const t = label[e.dataset.moment!]; e.hidden = !t; e.textContent = t ?? ''; });
    // Binnen dezelfde gemeente: geen overdracht en geen andere gemeente die verantwoordelijk kan worden, dus één stap.
    blok.querySelectorAll<HTMLElement>('[data-moment="nu"], [data-moment="voor"], [data-moment="na"], [data-moment="pleeg"]').forEach((e) => { e.closest('li')!.hidden = binnen; });
    blok.querySelectorAll<HTMLElement>('[data-vh-binnen]').forEach((li) => {
      li.hidden = !binnen;
      li.replaceChildren(Object.assign(document.createElement('strong'), { className: 'stap-lead', textContent: `U verhuist binnen ${huidig}.` }), ' Dan blijft de gemeente dezelfde en loopt de hulp gewoon door. Geef uw nieuwe adres door aan het wijkteam en aan de aanbieder van de hulp.');
    });
    // De nieuwe gemeente onder de stap "Meld u na uw inschrijving"; het huidige wijkteam staat onder stap 1.
    blok.querySelectorAll<HTMLElement>('[data-nieuw-stap]').forEach((e) => (e.hidden = !nieuw || !e.querySelector('[data-geladen]')));
  };
  return { teken, naar: () => naar };
};
