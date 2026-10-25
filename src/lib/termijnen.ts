/**
 * Termijnen rond besluiten van de gemeente, alleen in de browser uitgerekend (component TermijnenHulp).
 * Bronnen (geraadpleegd 2026-10-17): Awb art. 4:13, 4:14, 4:17, 6:7, 6:8, 6:12; Algemene termijnenwet art. 1 en 3.
 */

const dag = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const zelfde = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

/** Eerste Paasdag (gregoriaans, anonieme algoritme). */
const pasen = (j: number) => {
  const a = j % 19,
    b = Math.floor(j / 100),
    c = j % 100,
    d = Math.floor(b / 4),
    e = b % 4;
  const f = Math.floor((b + 8) / 25),
    g = Math.floor((b - f + 1) / 3),
    h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4),
    k = c % 4,
    l = (32 + 2 * e + 2 * i - h - k) % 7,
    m = Math.floor((a + 11 * h + 22 * l) / 451);
  const maand = Math.floor((h + l - 7 * m + 114) / 31),
    dg = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(j, maand - 1, dg);
};

/** Algemeen erkende feestdagen (Atw art. 3), inclusief Goede Vrijdag (art. 3 lid 2). */
export const feestdagen = (j: number) => {
  const p = pasen(j);
  const koning = new Date(j, 3, 27);
  return [
    new Date(j, 0, 1),
    dag(p, -2),
    dag(p, 1),
    koning.getDay() === 0 ? new Date(j, 3, 26) : koning,
    new Date(j, 4, 5),
    dag(p, 39),
    dag(p, 50),
    new Date(j, 11, 25),
    new Date(j, 11, 26),
  ];
};

const vrij = (d: Date) => d.getDay() === 0 || d.getDay() === 6 || feestdagen(d.getFullYear()).some((f) => zelfde(f, d));

/** Atw art. 1: eindigt een wettelijke termijn op een zaterdag, zondag of feestdag, dan op de eerstvolgende werkdag. */
const naarWerkdag = (d: Date) => {
  let x = d;
  while (vrij(x)) x = dag(x, 1);
  return x;
};

/** Laatste dag om bezwaar te maken: zes weken, vanaf de dag na de datum op het besluit (Awb 6:7, 6:8). */
export const bezwaarTot = (besluit: Date) => naarWerkdag(dag(besluit, 42));

/** Laatste dag van de beslistermijn als er geen andere termijn geldt: acht weken na ontvangst van de aanvraag (Awb 4:13). */
export const beslissenTot = (ontvangen: Date) => naarWerkdag(dag(ontvangen, 56));

/** Na de ingebrekestelling heeft de gemeente twee weken (Awb 4:17 lid 3, 6:12 lid 2). */
export const naIngebrekestelling = (ontvangen: Date) => ({ laatsteDag: dag(ontvangen, 14), vanaf: dag(ontvangen, 15) });

export const volgendeDag = (d: Date) => dag(d, 1);

/** Uiterlijk melden dat de hulp nog nodig is: acht weken vóór de einddatum van het besluit, want zo lang mag de gemeente in de regel
 *  over een besluit doen (Awb 4:13). Valt die dag in het weekend of op een feestdag, dan de werkdag ervoor. Eigen vuistregel: de wet
 *  telt vooruit vanaf de aanvraag, niet terug vanaf de einddatum. */
export const meldenVoor = (einde: Date) => {
  let x = dag(einde, -56);
  while (vrij(x)) x = dag(x, -1);
  return x;
};

/** Hele dagen van vandaag tot d (negatief als d voorbij is). */
export const dagenTot = (d: Date, vandaag = new Date()) => {
  const v = new Date(vandaag.getFullYear(), vandaag.getMonth(), vandaag.getDate());
  return Math.round((d.getTime() - v.getTime()) / 86400000);
};

/** Datum zoals ouders hem typen: dd-mm-jjjj (ook met / . of spatie, of acht cijfers ddmmjjjj). Null als het geen echte datum is. */
export const leesDatum = (s: string) => {
  const t = s.trim();
  const m = /^(\d{1,2})[-./ ](\d{1,2})[-./ ](\d{4})$/.exec(t) ?? /^(\d{2})(\d{2})(\d{4})$/.exec(t);
  if (!m) return null;
  const d = new Date(+m[3], +m[2] - 1, +m[1]);
  return d.getDate() === +m[1] && d.getMonth() === +m[2] - 1 ? d : null;
};

export const schrijf = (d: Date) => d.toLocaleDateString('nl-NL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
