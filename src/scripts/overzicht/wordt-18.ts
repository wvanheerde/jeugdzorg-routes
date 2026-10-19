/**
 * Verdieping bij "Mijn kind wordt 18": de geboortedatum (dan een datum bij elke stap) en welke hulp na 18 nog nodig is
 * (dan alleen die stappen). Uit de URL (?geboren=jjjj-mm-dd&na18=wmo,zvw) of van een eerder bezoek.
 */
import { dagenTot, leesDatum } from '../../lib/termijnen';
import { koppelDatumvelden } from '../../lib/datumveld';
import { params, keuze, bewaard, zetInUrl, iso, isoDatum, alsDatum, inVeld, datumKort, over } from './gedeeld';

const W18_KEY = 'jr.wordt18';

export const wordt18 = (opnieuw: () => void) => {
  const w18Bewaard = bewaard(W18_KEY);
  const w18Blok = document.querySelector<HTMLElement>('[data-verdieping="wordt-18"]');
  const w18Keuzes = Array.from(w18Blok?.querySelectorAll<HTMLButtonElement>('[data-w18-soort]') ?? []);
  const w18Veld = w18Blok?.querySelector<HTMLInputElement>('[data-w18-datum]');
  const w18Melding = w18Blok?.querySelector<HTMLElement>('[data-w18-melding]');
  let geboren = isoDatum(params.get('geboren') ?? w18Bewaard.geboren);
  let na18: string[] = String(params.get('na18') ?? (Array.isArray(w18Bewaard.na18) ? w18Bewaard.na18.join(',') : '')).split(',').filter((id) => w18Keuzes.some((b) => b.value === id));
  const w18Gewijzigd = () => {
    if (geboren || na18.length) localStorage.setItem(W18_KEY, JSON.stringify({ geboren, na18 })); else localStorage.removeItem(W18_KEY);
    zetInUrl({ geboren, na18: na18.join(',') });
    opnieuw();
  };
  if (w18Blok && w18Veld) {
    w18Veld.value = inVeld(geboren);
    koppelDatumvelden();
    // Bij een tweede bezoek staat het antwoord voorop, niet de vragen.
    // Alleen met een geboortedatum: zonder datum is er geen samenvatting om ingeklapt te tonen.
    if (geboren) w18Blok.setAttribute('data-vd-ingeklapt', '');
    w18Veld.addEventListener('input', () => {
      const d = leesDatum(w18Veld.value);
      const toekomst = !!d && dagenTot(d) > 0;
      const fout = toekomst || (!d && w18Veld.value.replace(/\D/g, '').length >= 8);
      if (w18Melding) { w18Melding.hidden = !fout; if (fout) w18Melding.textContent = toekomst ? 'Deze datum ligt in de toekomst. Vul de geboortedatum van uw kind in.' : 'Vul de datum in als dd-mm-jjjj, bijvoorbeeld 14-02-2009.'; }
      const nieuw = d && !toekomst ? iso(d) : '';
      if (nieuw !== geboren && (nieuw || !w18Veld.value.trim())) { geboren = nieuw; w18Gewijzigd(); }
    });
    // Meer keuzes tegelijk; "Weet ik niet" sluit de andere uit, en andersom. Niet inklappen na een keuze: er kan er nog een bij.
    // Ingeklapt staat het blok pas bij een volgend bezoek.
    w18Keuzes.forEach((b) => b.addEventListener('click', () => {
      const id = b.value;
      na18 = na18.includes(id) ? na18.filter((x) => x !== id) : id === 'onbekend' ? ['onbekend'] : [...na18.filter((x) => x !== 'onbekend'), id];
      w18Gewijzigd();
    }));
    w18Blok.querySelector('[data-vd-wissen]')?.addEventListener('click', () => {
      geboren = ''; na18 = []; w18Veld.value = '';
      if (w18Melding) w18Melding.hidden = true;
      w18Blok.removeAttribute('data-vd-ingeklapt');
      w18Gewijzigd();
    });
  }
  /** Tekent wat de antwoorden doen: stappen verbergen die niet passen en het moment van elke stap als datum. */
  const teken = () => {
    const blok = document.querySelector<HTMLElement>('[data-knelpunt-blok="wordt-18"]');
    if (!w18Blok || !blok) return;
    w18Keuzes.forEach((b) => b.setAttribute('aria-pressed', String(na18.includes(b.value))));
    const d = alsDatum(geboren);
    const op = (jaar: number) => (d ? new Date(d.getFullYear() + jaar, d.getMonth(), d.getDate()) : null);
    const b15 = op(15), b16 = op(16), b18 = op(18), b23 = op(23);
    const dagen = b18 ? dagenTot(b18) : null;
    const al18 = dagen !== null && dagen <= 0;
    const al23 = !!b23 && dagenTot(b23) <= 0;
    const voor16 = !!b16 && dagenTot(b16) > 0;
    // Bij een wachtlijst (veel zorg, begeleid wonen) eerder beginnen dan 16, maar niet jaren eerder: vanaf drie jaar voor de
    // verjaardag. Eigen vuistregel: de bron zegt alleen "nog eerder" en "wachtlijsten duren vaak één tot een paar jaar".
    const voor15 = !!b15 && dagenTot(b15) > 0;
    const veelZorg = na18.includes('wlz');
    const wonen = na18.includes('wonen');
    // Stappen bij een soort hulp: alleen zichtbaar als die bij een gekozen hulp hoort. Verlengde jeugdhulp kan tot 23 (Jeugdwet art. 1.1).
    const toont = new Set(w18Keuzes.filter((b) => na18.includes(b.value)).flatMap((b) => b.dataset.toont!.split(' ').filter(Boolean)));
    const vb = keuze.sel.includes('verstandelijke-beperking');
    const zichtbaar = (soort: string) => soort === 'al18' ? al18
      : soort === 'zonderdatum' ? !b18
      : soort === 'vertegenwoordiging' ? toont.has(soort) || vb || (!na18.length && !keuze.sel.length)
      : !na18.length || toont.has(soort) || (soort === 'wlz' && vb);
    // Hoofdstappen die niet passen gaan naar "Andere stappen die soms nodig zijn" (ingeklapt); onderdelen eronder (pleegzorg, al 18,
    // wanneer beginnen) en verlengde jeugdhulp vanaf 23 verdwijnen gewoon.
    const hoofdLijst = blok.querySelector<HTMLOListElement>('ol[data-aanvraag-stappen]');
    const andersBlok = blok.querySelector<HTMLDetailsElement>('[data-w18-anders]');
    const andersLijst = blok.querySelector<HTMLOListElement>('[data-w18-anders-lijst]');
    hoofdLijst?.querySelectorAll<HTMLElement>(':scope > li').forEach((li, i) => (li.dataset.orig ??= String(i)));
    blok.querySelectorAll<HTMLElement>('[data-soort]').forEach((e) => {
      const li = e.closest('li')!;
      const past = zichtbaar(e.dataset.soort!);
      const weg = e.dataset.soort === 'verlengd' && al23;
      if (li.parentElement === hoofdLijst || li.parentElement === andersLijst) {
        li.hidden = weg;
        (past || weg ? hoofdLijst : andersLijst)?.append(li);
      } else li.hidden = !past;
    });
    if (andersBlok && andersLijst) andersBlok.hidden = !Array.from(andersLijst.children).some((li) => !(li as HTMLElement).hidden);
    // Het moment van elke stap als datum, gemarkeerd zodat te zien is wat de geboortedatum doet. Waarom die datum staat in de stap zelf.
    // "Ruim vóór": uiterlijk zo lang vóór de verjaardag als een besluit mag duren (zes of acht weken, zie WORDT_18 in src/lib/verdiepingen.ts);
    // met een wachtlijst (Wlz bij blijvend veel zorg, Wmo en Wlz bij ergens anders gaan wonen) vanaf drie jaar voor de verjaardag
    // (voor15, eigen vuistregel), daarna zo vroeg mogelijk. Anders het liefst beginnen rond 16 (stap 1, Regelhulp).
    blok.querySelectorAll<HTMLElement>('[data-wanneer]').forEach((e) => {
      const m = e.dataset.wanneer, weken = +(e.dataset.weken || 8);
      const soort = e.closest('li')?.querySelector('[data-soort]')?.getAttribute('data-soort');
      const wachtlijst = (veelZorg && soort === 'wlz') || (wonen && (soort === 'wlz' || soort === 'wmo'));
      const later = voor16 && !((veelZorg || wonen) && m === 'nu') && !wachtlijst;
      const uiterlijk = b18 && new Date(b18.getFullYear(), b18.getMonth(), b18.getDate() - 7 * weken);
      const [datum, uitleg] = !b18 ? [null, '']
        : al18 ? ['Nu', '']
        : m === 'nu' ? (later ? [`Vanaf ${datumKort(b16!)}`, ' (de 16e verjaardag)']
          : (veelZorg || wonen) && voor15 ? [`Vanaf ${datumKort(b15!)}`, ' (drie jaar voor de verjaardag)']
          : dagen! < 183 ? ['Nu, deze week', ''] : ['Nu', ''])
        : m === 'ruim' && wachtlijst ? (voor15 ? [`Vanaf ${datumKort(b15!)}`, ' (drie jaar voor de verjaardag)'] : ['Nu, zo vroeg mogelijk', ''])
        : m === 'ruim' ? (dagenTot(uiterlijk!) <= 0 ? ['Zo snel mogelijk', ''] : [later ? `Tussen ${datumKort(b16!)} en ${datumKort(uiterlijk!)}` : `Nu, uiterlijk ${datumKort(uiterlijk!)}`, ''])
        : m === 'voor' ? [`Vóór ${datumKort(b18)}`, '']
        : [`Rond ${datumKort(b18)}`, ''];
      // Sorteersleutel: eerst wat nu moet (wachtlijst of stap 1), dan op uiterste datum; gelijke datums in de volgorde van wordt-18.md.
      const li = e.closest('li')!;
      li.dataset.sleutel = String(!b18 || al18 ? 0 : m === 'nu' || (m === 'ruim' && wachtlijst) ? -1 : m === 'ruim' ? uiterlijk!.getTime() : b18.getTime() + (m === 'rond' ? 1 : 0));
      if (!datum) { e.textContent = e.dataset.woorden!; return; }
      const mark = Object.assign(document.createElement('mark'), { className: 'stap-datum', textContent: datum });
      e.replaceChildren(mark, ...(uitleg ? [Object.assign(document.createElement('span'), { className: 'stap-datum-uitleg', textContent: uitleg })] : []));
    });
    // Stappen in de volgorde van hun datum (de lijst na stap 1); zonder datum de volgorde van wordt-18.md.
    blok.querySelectorAll<HTMLOListElement>('ol[data-aanvraag-stappen], [data-w18-anders-lijst]').forEach((ol) => {
      const lis = Array.from(ol.children) as HTMLElement[];
      lis.sort((x, y) => +(x.dataset.sleutel ?? 0) - +(y.dataset.sleutel ?? 0) || +(x.dataset.orig ?? 0) - +(y.dataset.orig ?? 0)).forEach((li) => ol.append(li));
    });
    // Samenvatting: alleen wanneer. Wat dat betekent (wachtlijsten, al 18, pleegzorg tot 21) staat bij de stappen zelf.
    const ingevuld = !!b18 || na18.length > 0;
    const samenvatting = !b18 ? ''
      : al23 ? `Uw kind is 23 of ouder (18 geworden op ${datumKort(b18)}).`
      : al18 ? `Uw kind is op ${datumKort(b18)} 18 geworden.`
      : `Uw kind wordt ${over(dagen!)} 18 (${datumKort(b18)}).`;
    const sv = w18Blok.querySelector<HTMLElement>('[data-vd-samenvatting]');
    if (sv) sv.textContent = samenvatting;
    w18Blok.querySelector<HTMLElement>('[data-vd-wissen]')!.hidden = !ingevuld;
    // Link naar de stappen naast "Wissen" (niet ingeklapt, zie CSS).
    w18Blok.querySelector<HTMLElement>('[data-vd-gevolg]')!.hidden = !ingevuld;
    if (!ingevuld || !samenvatting) w18Blok.removeAttribute('data-vd-ingeklapt');
  };
  return { teken };
};
