/**
 * Het gedeelde skelet van de verdiepingen in Mijn overzicht (components/Verdieping.astro): het blok, inklappen, "Wissen", de
 * samenvatting, keuzeknoppen en datumvelden. Wat een vraag eigen heeft (antwoorden, termijnen, welke stappen) staat in het bestand
 * van die vraag (verhuizing.ts, wachten.ts …).
 */
import { leesDatum } from '../../lib/termijnen';
import { params, iso } from './gedeeld';

/**
 * Eén verdiepingsblok ([data-verdieping="id"]). melding: selector van de regel voor een fout in een datum of plaats.
 * Bestaat het blok niet (een andere vraag), dan doen de functies niets.
 */
export const verdieping = (id: string, { melding }: { melding?: string } = {}) => {
  const blok = document.querySelector<HTMLElement>(`[data-verdieping="${id}"]`);
  const el = <T extends HTMLElement = HTMLElement>(s: string) => blok?.querySelector<T>(s) ?? null;
  const meldingEl = melding ? el(melding) : null;
  /** Ingeklapt staat alleen de samenvatting met "Aanpassen" (Verdieping.astro): zo staat het antwoord voorop. */
  const klapIn = () => blok?.setAttribute('data-vd-ingeklapt', '');
  const klapUit = () => blok?.removeAttribute('data-vd-ingeklapt');
  /** De melding tonen; leeg = weg. */
  const meld = (tekst: string) => {
    if (meldingEl) {
      meldingEl.hidden = !tekst;
      meldingEl.textContent = tekst;
    }
  };
  return {
    blok,
    el,
    klapIn,
    klapUit,
    meld,
    knoppen: (s: string) => Array.from(blok?.querySelectorAll<HTMLButtonElement>(s) ?? []),
    /** "Wissen": de antwoorden leeg (leeg, ook de velden), de melding weg, het blok open, en dan bewaren en opnieuw tekenen (gewijzigd). */
    bijWissen: (leeg: () => void, gewijzigd: () => void) =>
      el('[data-vd-wissen]')?.addEventListener('click', () => {
        leeg();
        meld('');
        klapUit();
        gewijzigd();
      }),
    /**
     * Na het tekenen: de samenvatting, en "Wissen" en "De stappen zijn aangepast" alleen met een antwoord. alleenIngeklapt: de
     * samenvatting herhaalt alleen de keuze (zie CSS); niet opgegeven = niet aanpassen. open: het blok openklappen (standaard zonder antwoord).
     */
    stand: ({
      samenvatting,
      ingevuld,
      alleenIngeklapt,
      open = !ingevuld,
    }: {
      samenvatting: string;
      ingevuld: boolean;
      alleenIngeklapt?: boolean;
      open?: boolean;
    }) => {
      const sv = el('[data-vd-samenvatting]');
      if (sv) {
        sv.textContent = samenvatting;
        if (alleenIngeklapt !== undefined) sv.toggleAttribute('data-alleen-ingeklapt', alleenIngeklapt);
      }
      const wissen = el('[data-vd-wissen]'),
        gevolg = el('[data-vd-gevolg]');
      if (wissen) wissen.hidden = !ingevuld;
      if (gevolg) gevolg.hidden = !ingevuld;
      if (open) klapUit();
    },
  };
};

/** Welke keuzeknoppen ingedrukt staan. */
export const zetGedrukt = (knoppen: HTMLButtonElement[], aan: (b: HTMLButtonElement) => boolean) =>
  knoppen.forEach((b) => b.setAttribute('aria-pressed', String(aan(b))));
/** Eén keuze: nog eens klikken haalt hem weg. */
export const wissel = (huidig: string, waarde: string) => (huidig === waarde ? '' : waarde);
/** Meer keuzes tegelijk; een keuze als "Weet ik niet" of "Geen" (alleen) sluit de andere uit, en andersom. */
export const wisselMeer = (lijst: string[], waarde: string, alleen?: string) =>
  lijst.includes(waarde) ? lijst.filter((x) => x !== waarde) : waarde === alleen ? [waarde] : [...lijst.filter((x) => x !== alleen), waarde];
/** Een lijst met antwoorden uit de URL (komma's) of van een eerder bezoek (array), alleen geldige. */
export const lijstUit = (param: string, bewaard: unknown, geldig: (id: string) => boolean) =>
  String(params.get(param) ?? (Array.isArray(bewaard) ? bewaard.join(',') : ''))
    .split(',')
    .filter(geldig);

/**
 * Een getypte datum lezen (dd-mm-jjjj, of uit de kalender, zie lib/datumveld.ts). iso: jjjj-mm-dd, of '' zolang hij niet klopt;
 * melding: de eigen melding van de vraag (fout, zoals "ligt in de toekomst"), of het formaat als er genoeg getypt is.
 * gewijzigd(oud): is er iets veranderd dat telt (een geldige datum, of het veld leeg gemaakt; halverwege getypt telt niet).
 */
export const leesVeld = (veld: HTMLInputElement, voorbeeld: string, fout?: (d: Date) => string) => {
  const d = leesDatum(veld.value);
  const f = d && fout ? fout(d) : '';
  const melding = f || (!d && veld.value.replace(/\D/g, '').length >= 8 ? `Vul de datum in als dd-mm-jjjj, bijvoorbeeld ${voorbeeld}.` : '');
  const nieuw = d && !f ? iso(d) : '';
  return { iso: nieuw, melding, gewijzigd: (oud: string) => nieuw !== oud && (!!nieuw || !veld.value.trim()) };
};

/** Een datum in een stap, gemarkeerd zodat te zien is wat het antwoord doet. */
export const markeer = (tekst: string) => Object.assign(document.createElement('mark'), { className: 'stap-datum', textContent: tekst });
