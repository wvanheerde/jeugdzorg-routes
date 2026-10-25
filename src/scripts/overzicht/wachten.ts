/**
 * Verdieping bij "Wij wachten te lang": waarop wacht u (?wacht=gemeente|aanbieder); bij de gemeente wanneer die de aanvraag kreeg
 * (?aanvraag=jjjj-mm-dd) en, als de acht weken voorbij zijn, wanneer die de ingebrekestelling kreeg (?ingebreke=jjjj-mm-dd).
 * Uit de URL of van een eerder bezoek.
 */
import { dagenTot, beslissenTot, volgendeDag, naIngebrekestelling, schrijf } from '../../lib/termijnen';
import { koppelDatumvelden } from '../../lib/datumveld';
import { params, zetInUrl, isoDatum, alsDatum, inVeld, datumKort } from './gedeeld';
import { OPSLAG, leesJson, bewaarJson } from '../../lib/opslag';
import { verdieping, zetGedrukt, wissel, leesVeld, markeer } from './verdieping';

const WT_KEY = OPSLAG.wachten;

export const wachten = (opnieuw: () => void) => {
  const wtBewaard = leesJson(WT_KEY);
  const vd = verdieping('wachten', { melding: '[data-wt-melding]' });
  const wtBlok = vd.blok;
  const wtKeuzes = vd.knoppen('[data-wt-op]');
  const wtVeld = vd.el<HTMLInputElement>('[data-wt-datum]');
  const wtIbVeld = vd.el<HTMLInputElement>('[data-wt-ingebreke]');
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
    const datum = d ? aanvraag : '',
      ibDatum = ib ? ingebreke : '';
    bewaarJson(WT_KEY, wachtOp ? { op: wachtOp, aanvraag: datum, ingebreke: ibDatum } : null);
    zetInUrl({ wacht: wachtOp, aanvraag: datum, ingebreke: ibDatum });
    opnieuw();
  };
  // Alles beantwoord, dan inklappen: bij de aanbieder meteen; bij de gemeente na de datum van de aanvraag, maar zijn de acht weken
  // voorbij, dan pas na de ingebrekestelling (die vraag komt er dan bij; leeg laten mag).
  const wtKlapIn = () => {
    const { d, voorbij, ib } = wtTermijn();
    if (wachtOp === 'aanbieder' || (d && (!voorbij || ib))) vd.klapIn();
  };
  /** Een getypte datum lezen (verdieping.ts): niet in de toekomst, en een ingebrekestelling niet vóór de acht weken voorbij waren. */
  const wtLees = (veld: HTMLInputElement, voorbeeld: string, wat: string, vroegst?: Date | null) => {
    const r = leesVeld(veld, voorbeeld, (d) =>
      dagenTot(d) > 0
        ? `Deze datum ligt in de toekomst. Vul de datum in waarop de gemeente ${wat} kreeg.`
        : vroegst && d < vroegst
          ? `Deze datum ligt vóór ${schrijf(vroegst)}, toen de acht weken nog niet voorbij waren. Een te vroege ingebrekestelling telt meestal niet; stuur er zo nodig een nieuwe.`
          : '',
    );
    vd.meld(r.melding);
    return r;
  };
  if (wtBlok && wtVeld && wtIbVeld) {
    wtVeld.value = inVeld(aanvraag);
    wtIbVeld.value = inVeld(ingebreke);
    koppelDatumvelden();
    // Bij een tweede bezoek staat het antwoord voorop, niet de vragen.
    if (wachtOp) vd.klapIn();
    // Eén keuze; nog eens klikken haalt hem weg.
    wtKeuzes.forEach((b) =>
      b.addEventListener('click', () => {
        wachtOp = wissel(wachtOp, b.value);
        wtKlapIn();
        wtGewijzigd();
      }),
    );
    wtVeld.addEventListener('input', () => {
      const r = wtLees(wtVeld, '15-09-2026', 'uw aanvraag');
      if (r.gewijzigd(aanvraag)) {
        aanvraag = r.iso;
        if (r.iso) wtKlapIn();
        wtGewijzigd();
      }
    });
    wtIbVeld.addEventListener('input', () => {
      const r = wtLees(wtIbVeld, '05-10-2026', 'uw ingebrekestelling', wtTermijn().vanaf);
      if (r.gewijzigd(ingebreke)) {
        ingebreke = r.iso;
        if (r.iso) wtKlapIn();
        wtGewijzigd();
      }
    });
    vd.bijWissen(() => {
      wachtOp = '';
      aanvraag = '';
      ingebreke = '';
      wtVeld.value = '';
      wtIbVeld.value = '';
    }, wtGewijzigd);
  }
  /** Tekent wat de antwoorden doen: alleen de stappen en brieven van de gekozen route, en met de datums de termijnen bij de stappen. */
  const teken = () => {
    const blok = document.querySelector<HTMLElement>('[data-knelpunt-blok="wachten"]');
    if (!wtBlok || !blok) return;
    zetGedrukt(wtKeuzes, (b) => b.value === wachtOp);
    const gemeente = wachtOp === 'gemeente';
    const { d, tot, vanaf, voorbij, ib } = wtTermijn();
    wtBlok.querySelector<HTMLElement>('[data-wt-datum-vraag]')!.hidden = !gemeente;
    wtBlok.querySelector<HTMLElement>('[data-wt-ingebreke-vraag]')!.hidden = !voorbij;
    const n = d ? -dagenTot(d) : 0;
    const samenvatting = !wachtOp
      ? ''
      : !d
        ? gemeente
          ? 'U wacht op een gesprek of besluit van de gemeente.'
          : 'U wacht op een plek bij een aanbieder.'
        : n === 0
          ? 'De gemeente kreeg uw aanvraag vandaag.'
          : `U wacht sinds ${datumKort(d)} op de gemeente (${n < 14 ? `${n} ${n === 1 ? 'dag' : 'dagen'}` : `${Math.floor(n / 7)} weken`})${ib ? `; uw ingebrekestelling kwam aan op ${datumKort(ib)}` : ''}.`;
    // Zonder datum herhaalt de samenvatting alleen de keuze: dan alleen ingeklapt zichtbaar (zie CSS).
    vd.stand({ samenvatting, ingevuld: !!wachtOp, alleenIngeklapt: !d });
    blok.querySelectorAll<HTMLElement>('[data-wacht-op]').forEach((e) => {
      e.closest('li')!.hidden = !!wachtOp && e.dataset.wachtOp !== wachtOp;
    });
    // Brieven aan de gemeente of het wijkteam (ingebrekestelling, klacht over het wijkteam) of aan de aanbieder (klacht) alleen bij die route.
    blok.querySelectorAll<HTMLElement>('[data-brief-kaart]').forEach((a) => {
      const aan = a.dataset.aan === 'wijkteam' ? 'gemeente' : a.dataset.aan;
      a.hidden = !!wachtOp && (aan === 'gemeente' || aan === 'aanbieder') && aan !== wachtOp;
    });
    // De termijnen als datum, gemarkeerd (markeer) zodat te zien is wat de datum doet.
    blok.querySelectorAll<HTMLElement>('[data-wacht-zin]').forEach((e) => {
      if (!tot) {
        e.textContent = e.dataset.wachtZin!;
        return;
      }
      e.replaceChildren(
        `De gemeente ${voorbij ? 'had' : 'moet'} in de regel uiterlijk `,
        markeer(schrijf(tot)),
        `${voorbij ? ' moeten' : ''} beslissen (acht weken na uw aanvraag). Heeft de gemeente u laten weten dat het langer duurt? Dan geldt die datum.`,
      );
    });
    // Twee weken na ontvangst van de ingebrekestelling: dwangsom en rechter (Awb 4:17 lid 3, 6:12 lid 2).
    const rechter = ib && naIngebrekestelling(ib).vanaf;
    blok.querySelectorAll<HTMLElement>('[data-wacht-lead]').forEach((e) => {
      const ingebrekestelling = e.dataset.wachtLead === 'ingebrekestelling';
      const rest = e.parentElement?.querySelector<HTMLElement>(`[data-wacht-rest="${e.dataset.wachtLead}"]`);
      // De ingebrekestelling is al verstuurd: dan is die stap gedaan en hoeft de uitleg om hem te sturen er niet meer bij.
      if (rest) rest.hidden = ingebrekestelling && !!ib;
      if (ingebrekestelling && ib) e.replaceChildren('Gedaan: de gemeente kreeg uw ingebrekestelling op ', markeer(schrijf(ib)), '.');
      else if (ingebrekestelling && vanaf)
        e.replaceChildren(...(voorbij ? [markeer('Nu'), ': is er nog geen besluit?'] : ['Is er op ', markeer(schrijf(vanaf)), ' nog geen besluit?']));
      else if (!ingebrekestelling && rechter)
        e.replaceChildren(
          ...(dagenTot(rechter) <= 0 ? [markeer('Nu'), ': is er nog steeds geen besluit?'] : ['Is er op ', markeer(schrijf(rechter)), ' nog geen besluit?']),
        );
      else e.textContent = e.dataset.origineel!;
    });
  };
  return { teken, wachtOp: () => wachtOp };
};
