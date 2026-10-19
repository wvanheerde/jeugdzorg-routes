/**
 * Gedeeld door de onderdelen van het script van Mijn overzicht (src/pages/overzicht.astro): de keuzes bovenaan, de namen
 * uit de pagina, en hulpjes voor datums, de URL en wat de browser bewaart.
 */
type Namen = { s: Record<string, string>; k: Record<string, string>; g: Record<string, string>; l: Record<string, string> };

export const params = new URLSearchParams(location.search);
export const namen = (window as any).__jrNamen as Namen;
export const q = (s: string) => Array.from(document.querySelectorAll<HTMLElement>(s));

// Beginstand uit URL of localStorage; de keuzecomponenten sturen daarna events bij wijziging (zie index.ts).
export const keuze = {
  sel: (params.get('s') ?? localStorage.getItem('jr.situaties') ?? '').split(',').filter(Boolean),
  gem: params.get('gemeente') ?? localStorage.getItem('jr.gemeente') ?? '',
  kp: params.get('k') ?? localStorage.getItem('jr.knelpunt') ?? '',
  lf: params.get('l') ?? localStorage.getItem('jr.leeftijd') ?? '',
};

/** Wat een verdieping bij een eerder bezoek bewaarde (JSON), of {}. */
export const bewaard = (key: string) => { try { return JSON.parse(localStorage.getItem(key) ?? '{}'); } catch { return {}; } };
/** Antwoorden in de URL, zodat het overzicht te bewaren en te delen is. Leeg = parameter weg. */
export const zetInUrl = (waarden: Record<string, string>) => {
  const u = new URL(location.href);
  Object.entries(waarden).forEach(([k, v]) => (v ? u.searchParams.set(k, v) : u.searchParams.delete(k)));
  history.replaceState(history.state, '', u);
};

export const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
export const isoDatum = (s: unknown) => (typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s) ? s : '');
export const alsDatum = (s: string) => (s ? new Date(+s.slice(0, 4), +s.slice(5, 7) - 1, +s.slice(8, 10)) : null);
/** jjjj-mm-dd → dd-mm-jjjj, zoals in het datumveld. */
export const inVeld = (s: string) => (s ? s.split('-').reverse().join('-') : '');
export const datumKort = (d: Date) => d.toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' });
export const over = (n: number) => (n === 0 ? 'vandaag' : n === 1 ? 'morgen' : n < 14 ? `over ${n} dagen` : n < 120 ? `over ongeveer ${Math.round(n / 7)} weken` : n < 548 ? `over ongeveer ${Math.round(n / 30)} maanden` : `over ongeveer ${Math.round(n / 365)} jaar`);
