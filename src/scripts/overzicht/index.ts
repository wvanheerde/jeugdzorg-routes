/**
 * Script van Mijn overzicht (src/pages/overzicht.astro): het keuzeblok bovenaan, de verdiepingen bij de knelpunten
 * (elk in een eigen bestand) en het tekenen (render.ts). De keuzecomponenten sturen events bij een wijziging.
 */
import { laadGemeente, laadNieuweGemeente } from '../../lib/gemeente-blokken';
import { keuze } from './gedeeld';
import { verhuizing } from './verhuizing';
import { hulpStopt } from './hulp-stopt';
import { wordt18 } from './wordt-18';
import { wachten } from './wachten';
import { afgewezen } from './afgewezen';
import { gescheiden } from './gescheiden';
import { maakRender } from './render';

const keuzes = document.querySelector<HTMLDetailsElement>('[data-keuzes]');
// Antwoord eerst: is er al iets gekozen, dan staan de keuzes ingeklapt en begint de pagina met het resultaat.
// Uitklappen terwijl de balk vast staat: spring naar de keuzes, anders openen ze ver boven het scherm.
keuzes?.addEventListener('toggle', () => { if (keuzes.open) requestAnimationFrame(() => keuzes.scrollIntoView({ block: 'start' })); });
// "Keuzes aanpassen" (zijnavigatie en knop rechtsonder): keuzeblok openen; de toggle hierboven scrolt er dan naartoe.
document.querySelectorAll<HTMLElement>('[data-keuzes-aanpassen]').forEach((el) => el.addEventListener('click', (e) => {
  if (!keuzes) return;
  e.preventDefault();
  if (keuzes.open) keuzes.scrollIntoView({ block: 'start' }); else keuzes.open = true;
}));
// Knop rechtsonder (alleen telefoon, zie CSS): pas tonen als het keuzeblok uit beeld is en er iets gekozen is.
const knop = document.querySelector<HTMLElement>('[data-keuzes-knop]');
if (keuzes && knop && 'IntersectionObserver' in window) new IntersectionObserver(([e]) => { knop.hidden = e.isIntersecting || !!document.querySelector('[data-inhoud][hidden]'); }).observe(keuzes);

// De verdiepingen tekenen na een antwoord de hele pagina opnieuw (render staat hieronder, pas na de verdiepingen).
const opnieuw = () => render();
const v = { verhuizing: verhuizing(opnieuw), hulpStopt: hulpStopt(opnieuw), wordt18: wordt18(opnieuw), wachten: wachten(opnieuw), afgewezen: afgewezen(opnieuw), gescheiden: gescheiden(opnieuw) };
const render = maakRender(v);

if (keuzes && (keuze.sel.length || keuze.kp || keuze.gem)) { keuzes.open = false; document.querySelectorAll<HTMLElement>('[data-intro]').forEach((e) => (e.hidden = true)); }
document.addEventListener('jr:situaties', (e) => { keuze.sel = (e as CustomEvent).detail; render(); });
// Pas tekenen als de blokken van de gemeente er zijn; is er intussen een andere gekozen, dan tekent die.
document.addEventListener('jr:gemeente', (e) => { keuze.gem = (e as CustomEvent).detail; laadGemeente(keuze.gem).then((ok) => ok && render()); });
document.addEventListener('jr:knelpunt', (e) => { keuze.kp = (e as CustomEvent).detail; render(); });
document.addEventListener('jr:leeftijd', (e) => { keuze.lf = (e as CustomEvent).detail; render(); });
Promise.all([laadGemeente(keuze.gem), laadNieuweGemeente(v.verhuizing.naar())]).then(() => {
  render();
  document.documentElement.classList.remove('jr-laden');
});
