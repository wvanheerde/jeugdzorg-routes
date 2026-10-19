/**
 * Verdieping bij "Wij wachten te lang": waarop wacht u (?wacht=gemeente|aanbieder); bij de gemeente wanneer die de aanvraag kreeg
 * (?aanvraag=jjjj-mm-dd) en, als de acht weken voorbij zijn, wanneer die de ingebrekestelling kreeg (?ingebreke=jjjj-mm-dd).
 * Uit de URL of van een eerder bezoek.
 */
import { dagenTot, leesDatum, beslissenTot, volgendeDag, naIngebrekestelling, schrijf } from '../../lib/termijnen';
import { koppelDatumvelden } from '../../lib/datumveld';
import { params, bewaard, zetInUrl, iso, isoDatum, alsDatum, inVeld, datumKort } from './gedeeld';

const WT_KEY = 'jr.wachten';

export const wachten = (opnieuw: () => void) => {
  const wtBewaard = bewaard(WT_KEY);
  const wtBlok = document.querySelector<HTMLElement>('[data-verdieping="wachten"]');
  const wtKeuzes = Array.from(wtBlok?.querySelectorAll<HTMLButtonElement>('[data-wt-op]') ?? []);
  const wtVeld = wtBlok?.querySelector<HTMLInputElement>('[data-wt-datum]');
  const wtIbVeld = wtBlok?.querySelector<HTMLInputElement>('[data-wt-ingebreke]');
  const wtMelding = wtBlok?.querySelector<HTMLElement>('[data-wt-melding]');
  let aanvraag = isoDatum(params.get('aanvraag') ?? wtBewaard.aanvraag);
  let ingebreke = isoDatum(params.get('ingebreke') ?? wtBewaard.ingebreke);
  // Een datum van de aanvraag hoort altijd bij wachten op de gemeente.
  let wachtOp: string = params.get('wacht') ?? wtBewaard.op ?? (aanvraag ? 'gemeente' : '');
  if (!wtKeuzes.some((b) => b.value === wachtOp)) wachtOp = '';
  /** De termijnen bij de antwoorden. Acht weken na ontvangst van de aanvraag (Awb 4:13, naar de eerstvolgende werkdag); de dag erna is
   *  de gemeente te laat en kan de ingebrekestelling (4:17). Een ingebrekestelling van vóór die dag telt niet mee. */
  const wtTermijn = () => {
    const d = wachtOp === 'gemeente' ? alsDatum(aanvraag) : null;
    const tot = d && beslissenTot(d);
    const vanaf = tot && volgendeDag(tot);
    const voorbij = !!vanaf && dagenTot(vanaf) <= 0;
    const i = alsDatum(ingebreke);
    const ib = voorbij && i && i >= vanaf! && dagenTot(i) <= 0 ? i : null;
    return { d, tot, vanaf, voorbij, ib };
  };
  const wtGewijzigd = () => {
    const { d, ib } = wtTermijn();
    const datum = d ? aanvraag : '', ibDatum = ib ? ingebreke : '';
    if (wachtOp) localStorage.setItem(WT_KEY, JSON.stringify({ op: wachtOp, aanvraag: datum, ingebreke: ibDatum })); else localStorage.removeItem(WT_KEY);
    zetInUrl({ wacht: wachtOp, aanvraag: datum, ingebreke: ibDatum });
    opnieuw();
  };
  // Alles beantwoord, dan inklappen: bij de aanbieder meteen; bij de gemeente na de datum van de aanvraag, maar zijn de acht weken
  // voorbij, dan pas na de ingebrekestelling (die vraag komt er dan bij; leeg laten mag).
  const wtKlapIn = () => {
    const { d, voorbij, ib } = wtTermijn();
    if (wachtOp === 'aanbieder' || (d && (!voorbij || ib))) wtBlok?.setAttribute('data-vd-ingeklapt', '');
  };
  /** Een getypte datum lezen: null als hij (nog) niet klopt, met een melding als er genoeg getypt is. */
  const wtLees = (veld: HTMLInputElement, voorbeeld: string, wat: string, vroegst?: Date | null) => {
    const d = leesDatum(veld.value);
    const toekomst = !!d && dagenTot(d) > 0;
    const teVroeg = !!d && !!vroegst && d < vroegst;
    const melding = toekomst ? `Deze datum ligt in de toekomst. Vul de datum in waarop de gemeente ${wat} kreeg.`
      : teVroeg ? `Deze datum ligt vóór ${schrijf(vroegst!)}, toen de acht weken nog niet voorbij waren. Een te vroege ingebrekestelling telt meestal niet; stuur er zo nodig een nieuwe.`
      : !d && veld.value.replace(/\D/g, '').length >= 8 ? `Vul de datum in als dd-mm-jjjj, bijvoorbeeld ${voorbeeld}.` : '';
    if (wtMelding) { wtMelding.hidden = !melding; wtMelding.textContent = melding; }
    return { iso: d && !toekomst && !teVroeg ? iso(d) : '', leeg: !veld.value.trim() };
  };
  if (wtBlok && wtVeld && wtIbVeld) {
    wtVeld.value = inVeld(aanvraag);
    wtIbVeld.value = inVeld(ingebreke);
    koppelDatumvelden();
    // Bij een tweede bezoek staat het antwoord voorop, niet de vragen.
    if (wachtOp) wtBlok.setAttribute('data-vd-ingeklapt', '');
    // Eén keuze; nog eens klikken haalt hem weg.
    wtKeuzes.forEach((b) => b.addEventListener('click', () => {
      wachtOp = wachtOp === b.value ? '' : b.value;
      wtKlapIn();
      wtGewijzigd();
    }));
    wtVeld.addEventListener('input', () => {
      const { iso: nieuw, leeg } = wtLees(wtVeld, '15-09-2026', 'uw aanvraag');
      if (nieuw !== aanvraag && (nieuw || leeg)) { aanvraag = nieuw; if (nieuw) wtKlapIn(); wtGewijzigd(); }
    });
    wtIbVeld.addEventListener('input', () => {
      const { iso: nieuw, leeg } = wtLees(wtIbVeld, '05-10-2026', 'uw ingebrekestelling', wtTermijn().vanaf);
      if (nieuw !== ingebreke && (nieuw || leeg)) { ingebreke = nieuw; if (nieuw) wtKlapIn(); wtGewijzigd(); }
    });
    wtBlok.querySelector('[data-vd-wissen]')?.addEventListener('click', () => {
      wachtOp = ''; aanvraag = ''; ingebreke = ''; wtVeld.value = ''; wtIbVeld.value = '';
      if (wtMelding) wtMelding.hidden = true;
      wtBlok.removeAttribute('data-vd-ingeklapt');
      wtGewijzigd();
    });
  }
  /** Tekent wat de antwoorden doen: alleen de stappen en brieven van de gekozen route, en met de datums de termijnen bij de stappen. */
  const teken = () => {
    const blok = document.querySelector<HTMLElement>('[data-knelpunt-blok="wachten"]');
    if (!wtBlok || !blok) return;
    wtKeuzes.forEach((b) => b.setAttribute('aria-pressed', String(b.value === wachtOp)));
    const gemeente = wachtOp === 'gemeente';
    const { d, tot, vanaf, voorbij, ib } = wtTermijn();
    wtBlok.querySelector<HTMLElement>('[data-wt-datum-vraag]')!.hidden = !gemeente;
    wtBlok.querySelector<HTMLElement>('[data-wt-ingebreke-vraag]')!.hidden = !voorbij;
    const n = d ? -dagenTot(d) : 0;
    const samenvatting = !wachtOp ? ''
      : !d ? (gemeente ? 'U wacht op een gesprek of besluit van de gemeente.' : 'U wacht op een plek bij een aanbieder.')
      : n === 0 ? 'De gemeente kreeg uw aanvraag vandaag.'
      : `U wacht sinds ${datumKort(d)} op de gemeente (${n < 14 ? `${n} ${n === 1 ? 'dag' : 'dagen'}` : `${Math.floor(n / 7)} weken`})${ib ? `; uw ingebrekestelling kwam aan op ${datumKort(ib)}` : ''}.`;
    const sv = wtBlok.querySelector<HTMLElement>('[data-vd-samenvatting]');
    // Zonder datum herhaalt de samenvatting alleen de keuze: dan alleen ingeklapt zichtbaar (zie CSS).
    if (sv) { sv.textContent = samenvatting; sv.toggleAttribute('data-alleen-ingeklapt', !d); }
    wtBlok.querySelector<HTMLElement>('[data-vd-wissen]')!.hidden = !wachtOp;
    wtBlok.querySelector<HTMLElement>('[data-vd-gevolg]')!.hidden = !wachtOp;
    if (!wachtOp) wtBlok.removeAttribute('data-vd-ingeklapt');
    blok.querySelectorAll<HTMLElement>('[data-wacht-op]').forEach((e) => { e.closest('li')!.hidden = !!wachtOp && e.dataset.wachtOp !== wachtOp; });
    // Brieven aan de gemeente of het wijkteam (ingebrekestelling, klacht over het wijkteam) of aan de aanbieder (klacht) alleen bij die route.
    blok.querySelectorAll<HTMLElement>('[data-brief-kaart]').forEach((a) => { const aan = a.dataset.aan === 'wijkteam' ? 'gemeente' : a.dataset.aan; a.hidden = !!wachtOp && (aan === 'gemeente' || aan === 'aanbieder') && aan !== wachtOp; });
    // De termijnen als datum, gemarkeerd zodat te zien is wat de datum doet.
    const mark = (t: string) => Object.assign(document.createElement('mark'), { className: 'stap-datum', textContent: t });
    blok.querySelectorAll<HTMLElement>('[data-wacht-zin]').forEach((e) => {
      if (!tot) { e.textContent = e.dataset.wachtZin!; return; }
      e.replaceChildren(`De gemeente ${voorbij ? 'had' : 'moet'} in de regel uiterlijk `, mark(schrijf(tot)), `${voorbij ? ' moeten' : ''} beslissen (acht weken na uw aanvraag). Heeft de gemeente u laten weten dat het langer duurt? Dan geldt die datum.`);
    });
    // Twee weken na ontvangst van de ingebrekestelling: dwangsom en rechter (Awb 4:17 lid 3, 6:12 lid 2).
    const rechter = ib && naIngebrekestelling(ib).vanaf;
    blok.querySelectorAll<HTMLElement>('[data-wacht-lead]').forEach((e) => {
      const ingebrekestelling = e.dataset.wachtLead === 'ingebrekestelling';
      const rest = e.parentElement?.querySelector<HTMLElement>(`[data-wacht-rest="${e.dataset.wachtLead}"]`);
      // De ingebrekestelling is al verstuurd: dan is die stap gedaan en hoeft de uitleg om hem te sturen er niet meer bij.
      if (rest) rest.hidden = ingebrekestelling && !!ib;
      if (ingebrekestelling && ib) e.replaceChildren('Gedaan: de gemeente kreeg uw ingebrekestelling op ', mark(schrijf(ib)), '.');
      else if (ingebrekestelling && vanaf) e.replaceChildren(...(voorbij ? [mark('Nu'), ': is er nog geen besluit?'] : ['Is er op ', mark(schrijf(vanaf)), ' nog geen besluit?']));
      else if (!ingebrekestelling && rechter) e.replaceChildren(...(dagenTot(rechter) <= 0 ? [mark('Nu'), ': is er nog steeds geen besluit?'] : ['Is er op ', mark(schrijf(rechter)), ' nog geen besluit?']));
      else e.textContent = e.dataset.origineel!;
    });
  };
  return { teken, wachtOp: () => wachtOp };
};
