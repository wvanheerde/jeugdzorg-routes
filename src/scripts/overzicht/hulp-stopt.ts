/** Verdieping bij "De hulp stopt": waarom stopt de hulp? Dan alleen de stappen bij die reden (?reden=, of van een eerder bezoek). */
import { params, zetInUrl } from './gedeeld';

const HS_KEY = 'jr.hulpstopt';

export const hulpStopt = (opnieuw: () => void) => {
  const hsBlok = document.querySelector<HTMLElement>('[data-verdieping="hulp-stopt"]');
  const hsKeuzes = Array.from(hsBlok?.querySelectorAll<HTMLButtonElement>('[data-hs-reden]') ?? []);
  let reden = params.get('reden') ?? localStorage.getItem(HS_KEY) ?? '';
  if (!hsKeuzes.some((r) => r.value === reden)) reden = '';
  const redenGewijzigd = () => {
    hsKeuzes.forEach((r) => r.setAttribute('aria-pressed', String(r.value === reden)));
    if (reden) localStorage.setItem(HS_KEY, reden); else localStorage.removeItem(HS_KEY);
    zetInUrl({ reden });
    opnieuw();
  };
  if (hsBlok) {
    hsKeuzes.forEach((r) => { r.setAttribute('aria-pressed', String(r.value === reden)); r.addEventListener('click', () => {
      reden = reden === r.value ? '' : r.value;
      // Na een keuze meteen inklappen tot de samenvatting, zodat de stappen hoger in beeld komen (persona-tests: Bas moest twee keer scrollen).
      if (reden) hsBlok.setAttribute('data-vd-ingeklapt', '');
      redenGewijzigd();
    }); });
    if (reden) hsBlok.setAttribute('data-vd-ingeklapt', '');
    hsBlok.querySelector('[data-vd-wissen]')?.addEventListener('click', () => {
      reden = '';
      hsBlok.removeAttribute('data-vd-ingeklapt');
      redenGewijzigd();
    });
  }
  const teken = () => {
    const blok = document.querySelector<HTMLElement>('[data-knelpunt-blok="hulp-stopt"]');
    if (!hsBlok || !blok) return;
    const label = hsKeuzes.find((r) => r.value === reden)?.dataset.label ?? '';
    const sv = hsBlok.querySelector<HTMLElement>('[data-vd-samenvatting]');
    if (sv) sv.textContent = reden ? `U koos: ${label.toLowerCase()}.` : ''; // alleen ingeklapt zichtbaar (zie CSS); open ziet u de keuze zelf
    hsBlok.querySelector<HTMLElement>('[data-vd-wissen]')!.hidden = !reden;
    hsBlok.querySelector<HTMLElement>('[data-vd-gevolg]')!.hidden = !reden;
    if (!reden) hsBlok.removeAttribute('data-vd-ingeklapt');
    blok.querySelectorAll<HTMLElement>('[data-reden]').forEach((e) => { e.closest('li')!.hidden = !!reden && e.dataset.reden !== reden; });
  };
  return { teken, reden: () => reden };
};
