/**
 * Gegevens die een pagina bij het bouwen meegeeft aan haar browserscript. Ze staan als JSON in de pagina
 * (<script type="application/json" id="jr-data-…">); het type hieronder geldt aan beide kanten, zodat de pagina en het script
 * niet stil uit elkaar lopen. Constanten uit src/lib kan een script gewoon importeren; dit is alleen voor wat uit de content komt.
 */

/** Mijn overzicht: per situatie wat het script nodig heeft om te kiezen wat zichtbaar is (src/pages/overzicht.astro). */
export type SituatieData = {
  /** Lager = gaat voor bij meer gekozen situaties. */
  voorrang: number;
  /** Waar de situatie begint: type van de eerste route of de eigen tekst (beginBij). */
  start: string;
  themas: string[];
  hulpsoorten: string[];
  routes: string[];
  landelijk: string[];
  licht: boolean;
  jgz: boolean;
  inklap: boolean;
  /** Heeft een eigen volgorde van therapievormen. */
  rang: boolean;
  /** Eerste route heeft een eigen tekst (beginBij): dan staat het wijkteam ernaast als gelijkwaardige ingang. */
  gelijk: boolean;
};

/** Mijn overzicht: per knelpunt (vraag op de voorpagina). */
export type KnelpuntData = { onderdelen: string[]; landelijk: string[]; zonderGemeente: boolean; wijkteamBovenaan: boolean; situaties: boolean };

/** Namen voor de samenvatting van de keuzes: situaties, knelpunten, gemeenten, leeftijden (id → naam). */
export type Namen = { s: Record<string, string>; k: Record<string, string>; g: Record<string, string>; l: Record<string, string> };

export type PaginaData = {
  overzicht: { situaties: Record<string, SituatieData>; knelpunten: Record<string, KnelpuntData>; namen: Namen };
  /** Voorbeeldbrieven aan de gemeente: per gemeente [naam, postadres]. */
  postadressen: Record<string, [string, string]>;
  /** Klachtbrief wijkteam: per gemeente [naam, omschrijving regeling, e-mail of adres, url]. */
  klachtadressen: Record<string, [string, string, string, string]>;
};

export type PaginaDataNaam = keyof PaginaData;

export const dataId = (naam: PaginaDataNaam) => `jr-data-${naam}`;

/** Bij het bouwen (components/PaginaData.astro): de JSON voor in de pagina, met "<" geëscapet (als unicode-escape), zodat tekst als "</script>" het blok niet afbreekt. */
export const alsJson = (data: unknown) => JSON.stringify(data).replace(/</g, '\\u003c');

/** In de browser: de gegevens die de pagina meegaf, of undefined als de pagina ze niet heeft. */
export function leesData<K extends PaginaDataNaam>(naam: K): PaginaData[K] | undefined {
  const el = document.getElementById(dataId(naam));
  return el?.textContent ? (JSON.parse(el.textContent) as PaginaData[K]) : undefined;
}
