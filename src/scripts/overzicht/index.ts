/**
 * Script van Mijn overzicht (src/pages/overzicht.astro): de verdiepingen bij de knelpunten (elk in een eigen bestand) en het
 * tekenen (render.ts). De keuzes zelf komen uit de url of van de voorpagina (scripts/overzicht/gedeeld.ts); hier zijn ze niet aan te passen.
 */
import { laadGemeente, laadNieuweGemeente } from '../../lib/gemeente-blokken';
import { keuze } from './gedeeld';
import { verhuizing } from './verhuizing';
import { hulpStopt } from './hulp-stopt';
import { wordt18 } from './wordt-18';
import { wachten } from './wachten';
import { afgewezen } from './afgewezen';
import { gescheiden } from './gescheiden';
import { uitbreiden } from './uitbreiden';
import { maakRender } from './render';

// De verdiepingen tekenen na een antwoord de hele pagina opnieuw (render staat hieronder, pas na de verdiepingen).
const opnieuw = () => render();
const v = { verhuizing: verhuizing(opnieuw), hulpStopt: hulpStopt(opnieuw), wordt18: wordt18(opnieuw), wachten: wachten(opnieuw), afgewezen: afgewezen(opnieuw), gescheiden: gescheiden(opnieuw), uitbreiden: uitbreiden(opnieuw) };
const render = maakRender(v);

Promise.all([laadGemeente(keuze.gem), laadNieuweGemeente(v.verhuizing.naar())]).then(() => {
  render();
  document.documentElement.classList.remove('jr-laden');
});
