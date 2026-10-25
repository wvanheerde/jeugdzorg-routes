/** Verdieping bij "De hulp stopt": waarom stopt de hulp? Dan alleen de stappen bij die reden (?reden=, of van een eerder bezoek). */
import { params, zetInUrl } from './gedeeld';
import { OPSLAG, lees, bewaar } from '../../lib/opslag';
import { verdieping, zetGedrukt, wissel } from './verdieping';

const HS_KEY = OPSLAG.hulpStopt;

export const hulpStopt = (opnieuw: () => void) => {
  const vd = verdieping('hulp-stopt');
  const hsKeuzes = vd.knoppen('[data-hs-reden]');
  let reden = params.get('reden') ?? lees(HS_KEY);
  if (!hsKeuzes.some((r) => r.value === reden)) reden = '';
  const redenGewijzigd = () => {
    zetGedrukt(hsKeuzes, (r) => r.value === reden);
    bewaar(HS_KEY, reden);
    zetInUrl({ reden });
    opnieuw();
  };
  if (vd.blok) {
    zetGedrukt(hsKeuzes, (r) => r.value === reden);
    hsKeuzes.forEach((r) =>
      r.addEventListener('click', () => {
        reden = wissel(reden, r.value);
        // Na een keuze meteen inklappen tot de samenvatting, zodat de stappen hoger in beeld komen (persona-tests: Bas moest twee keer scrollen).
        if (reden) vd.klapIn();
        redenGewijzigd();
      }),
    );
    if (reden) vd.klapIn();
    vd.bijWissen(() => (reden = ''), redenGewijzigd);
  }
  const teken = () => {
    const blok = document.querySelector<HTMLElement>('[data-knelpunt-blok="hulp-stopt"]');
    if (!vd.blok || !blok) return;
    const label = hsKeuzes.find((r) => r.value === reden)?.dataset.label ?? '';
    // Alleen ingeklapt zichtbaar (zie CSS); open ziet u de keuze zelf.
    vd.stand({ samenvatting: reden ? `U koos: ${label.toLowerCase()}.` : '', ingevuld: !!reden });
    blok.querySelectorAll<HTMLElement>('[data-reden]').forEach((e) => {
      e.closest('li')!.hidden = !!reden && e.dataset.reden !== reden;
    });
  };
  return { teken, reden: () => reden };
};
