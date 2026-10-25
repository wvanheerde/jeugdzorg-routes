/**
 * Wat de site bewaart in de browser van de bezoeker (localStorage), op één plek: de sleutels en hoe ze gelezen en geschreven
 * worden. Niets hiervan verlaat de browser.
 */
export const OPSLAG = {
  /** Keuzes op de voorpagina en in Mijn overzicht. */
  gemeente: 'jr.gemeente',
  knelpunt: 'jr.knelpunt',
  /** Vlak op de voorpagina waar de vraag onder valt (een vraag kan onder meer vlakken staan). */
  startvlak: 'jr.startvlak',
  leeftijd: 'jr.leeftijd',
  situaties: 'jr.situaties',
  /** Antwoorden in de verdiepingen van Mijn overzicht. */
  verhuizing: 'jr.verhuizing',
  hulpStopt: 'jr.hulpstopt',
  wordt18: 'jr.wordt18',
  wachten: 'jr.wachten',
  afgewezen: 'jr.afgewezen',
  gezag: 'jr.gezag',
  gezagWeg: 'jr.gezagweg',
  uitbreiden: 'jr.uitbreiden',
  regelingen: 'jr.regelingen',
} as const;

export type OpslagSleutel = (typeof OPSLAG)[keyof typeof OPSLAG];

/** Bewaarde tekst, of ''. */
export const lees = (k: OpslagSleutel) => localStorage.getItem(k) ?? '';
/** Bewaarde lijst (komma's), zoals de gekozen situaties. */
export const leesLijst = (k: OpslagSleutel) => lees(k).split(',').filter(Boolean);
/** Wat een verdieping bewaarde (JSON), of {}. */
export const leesJson = (k: OpslagSleutel) => {
  try {
    return JSON.parse(localStorage.getItem(k) ?? '{}');
  } catch {
    return {};
  }
};
/** Uit de URL (een gedeelde link) als die de parameter heeft, anders wat bewaard is. */
export const uitUrlOfOpslag = (param: string, k: OpslagSleutel) => new URLSearchParams(location.search).get(param) ?? lees(k);

/** Tekst bewaren; leeg = sleutel weg. */
export const bewaar = (k: OpslagSleutel, v: string) => (v ? localStorage.setItem(k, v) : localStorage.removeItem(k));
/** Antwoorden van een verdieping bewaren als JSON; null = sleutel weg (niets beantwoord). */
export const bewaarJson = (k: OpslagSleutel, v: object | null) => (v ? localStorage.setItem(k, JSON.stringify(v)) : localStorage.removeItem(k));

/** "Keuzes wissen": alles behalve de gemeente (die verandert zelden; dan hoeft de ouder hem niet opnieuw te zoeken). */
export const wisKeuzes = () =>
  Object.values(OPSLAG)
    .filter((k) => k !== OPSLAG.gemeente)
    .forEach((k) => localStorage.removeItem(k));
