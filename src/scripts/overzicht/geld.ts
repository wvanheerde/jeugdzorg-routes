/**
 * Regelingencheck bij "Extra kosten of kinderbijslag": veel zorg (?zorg=ja|nee|weet-niet), al dubbele kinderbijslag (?dkb=ja|nee),
 * alleenstaand of alleenverdiener (?alleen=ja|nee), welke kosten (?kosten=school,zorg,ziekte|geen) en een laag inkomen (?inkomen=…).
 * Uit de URL of van een eerder bezoek (jr.regelingen). Per stap (rol uit REGELING_STAP in lib/verdiepingen.ts, regel in lib/regelingen.ts): past waarschijnlijk
 * (blijft staan, met "Past waarschijnlijk"), past niet (ingeklapt onder "Andere regelingen die soms passen"), of nog open (blijft staan).
 * Zonder antwoord dat iets uitsluit blijft een regeling staan: of hij past, beslist de SVB, het CIZ of de gemeente.
 */
import { keuze, params, zetInUrl } from './gedeeld';
import { OPSLAG, leesJson, bewaarJson } from '../../lib/opslag';
import { verdieping, zetGedrukt, wissel, wisselMeer, lijstUit } from './verdieping';
import { regelingPast } from '../../lib/regelingen';

const RG_KEY = OPSLAG.regelingen;
const ENKEL = ['zorg', 'dkb', 'alleen', 'inkomen'] as const;
type Enkel = (typeof ENKEL)[number];

export const geld = (opnieuw: () => void) => {
  const rgBewaard = leesJson(RG_KEY);
  const vd = verdieping('geld');
  const rgBlok = vd.blok;
  const knoppen = vd.knoppen('[data-rg-keuze]');
  const kostenKnoppen = vd.knoppen('[data-rg-kosten]');
  const geldig = (vraag: string, v: unknown) => knoppen.some((b) => b.dataset.rgKeuze === vraag && b.value === v);
  const a = Object.fromEntries(
    ENKEL.map((v) => {
      const w = params.get(v) ?? rgBewaard[v];
      return [v, geldig(v, w) ? String(w) : ''];
    }),
  ) as Record<Enkel, string>;
  let kosten = lijstUit('kosten', rgBewaard.kosten, (id) => kostenKnoppen.some((b) => b.value === id));

  /** Welke vragen gelden: dubbele kinderbijslag alleen bij veel zorg (en een kind onder 18), het extra bedrag alleen als de ouder die al krijgt. */
  const geldt = (v: Enkel) => (v === 'dkb' ? a.zorg === 'ja' && keuze.lf !== '18-99' : v === 'alleen' ? a.zorg === 'ja' && a.dkb === 'ja' : true);
  const iets = () => ENKEL.some((v) => a[v] && geldt(v)) || kosten.length > 0;
  /** Alle vragen met één antwoord beantwoord (de kosten mogen leeg blijven: meer keuzes, daar klapt het blok niet op in). */
  const klaar = () => ENKEL.every((v) => !geldt(v) || a[v]);
  const gewijzigd = () => {
    const w = Object.fromEntries(ENKEL.map((v) => [v, geldt(v) ? a[v] : ''])) as Record<Enkel, string>;
    bewaarJson(RG_KEY, iets() ? { ...w, kosten } : null);
    zetInUrl({ ...w, kosten: kosten.join(',') });
    opnieuw();
  };
  if (rgBlok) {
    // Bij een tweede bezoek staat het antwoord voorop, niet de vragen.
    if (iets()) vd.klapIn();
    knoppen.forEach((b) =>
      b.addEventListener('click', () => {
        const v = b.dataset.rgKeuze as Enkel;
        a[v] = wissel(a[v], b.value);
        if (klaar() && a[v]) vd.klapIn();
        gewijzigd();
      }),
    );
    kostenKnoppen.forEach((b) =>
      b.addEventListener('click', () => {
        kosten = wisselMeer(kosten, b.value, 'geen');
        gewijzigd();
      }),
    );
    vd.bijWissen(() => {
      ENKEL.forEach((v) => (a[v] = ''));
      kosten = [];
    }, gewijzigd);
  }

  // De stappen en waar ze stonden, om bij elke keer tekenen terug te kunnen zetten.
  const vraagBlok = document.querySelector<HTMLElement>('[data-knelpunt-blok="geld"]');
  const plekken = Array.from(vraagBlok?.querySelectorAll<HTMLLIElement>('ol.stap-een > li, ol[data-aanvraag-stappen] > li') ?? []).map((li) => ({
    li,
    ol: li.parentElement!,
  }));

  /** Tekent wat de antwoorden doen: welke vervolgvragen er zijn, en welke regelingen bovenaan, ingeklapt of weg. */
  const teken = () => {
    if (!rgBlok || !vraagBlok) return;
    zetGedrukt(knoppen, (b) => a[b.dataset.rgKeuze as Enkel] === b.value);
    zetGedrukt(kostenKnoppen, (b) => kosten.includes(b.value));
    rgBlok.querySelectorAll<HTMLElement>('[data-rg-vraag]').forEach((f) => {
      const v = f.dataset.rgVraag as Enkel;
      if (ENKEL.includes(v)) f.hidden = !geldt(v);
    });

    const anders = vraagBlok.querySelector<HTMLDetailsElement>('[data-rg-anders]');
    const andersLijst = vraagBlok.querySelector<HTMLOListElement>('[data-rg-anders-lijst]');
    // Geeft de gemeente ouders geen mantelzorgwaardering (veld geldregelingen), dan past die stap niet.
    const mantelNee = !!vraagBlok.querySelector('[data-regeling="mantelzorg"][data-ouders="nee"]');
    plekken.forEach(({ li, ol }) => ol.append(li));
    let n = 0;
    plekken.forEach(({ li }) => {
      const rol = li.querySelector<HTMLElement>(':scope > [data-rg-rol]')?.dataset.rgRol;
      const p = rol ? regelingPast(rol, { ...a, kosten, leeftijd: keuze.lf }, mantelNee) : null;
      li.querySelector<HTMLElement>(':scope > [data-stap-past]')?.toggleAttribute('hidden', p !== true);
      // Krijgt de ouder al dubbele kinderbijslag, dan is die stap gedaan (de zichtbaarheid per leeftijd zet render.ts elke keer opnieuw).
      if (p === 'gedaan') li.hidden = true;
      if (p === false) andersLijst?.append(li);
      // Een stap met een variant per leeftijd telt één keer: alleen de zichtbare.
      if (p === true && !li.hidden) n++;
    });
    if (anders) anders.hidden = !andersLijst?.children.length || !Array.from(andersLijst.children).some((li) => !(li as HTMLElement).hidden);

    const samenvatting = !iets()
      ? ''
      : n === 0
        ? 'Geen van de regelingen past zeker. Ze staan er allemaal; kijk wat bij u past.'
        : `${n === 1 ? '1 regeling past' : `${n} regelingen passen`} waarschijnlijk bij u. Ze staan bovenaan.`;
    vd.stand({ samenvatting, ingevuld: iets() });
  };
  return { teken };
};
