/**
 * Hulp bij het afdrukken van Mijn overzicht (src/scripts/overzicht/afdrukken.ts): op papier kunt u niet klikken,
 * dus staat bij een website het adres. Kort, zoals u het intypt: zonder https://, www. en de slash aan het eind.
 */
export const kortAdres = (url: string) => {
  const u = new URL(url);
  const pad = u.pathname.replace(/\/$/, '');
  return `${u.hostname.replace(/^www\./, '')}${pad}${u.search}`;
};

/** Het adres van het overzicht met de keuzes voorop (gemeente, vraag, situaties, leeftijd), daarna de antwoorden van de verdieping. */
export const overzichtAdres = (huidig: string, keuzes: { gemeente: string; k: string; s: string[]; l: string }) => {
  const u = new URL(huidig);
  const p = new URLSearchParams();
  if (keuzes.gemeente) p.set('gemeente', keuzes.gemeente);
  if (keuzes.k) p.set('k', keuzes.k);
  if (keuzes.s.length) p.set('s', keuzes.s.join(','));
  if (keuzes.l) p.set('l', keuzes.l);
  u.searchParams.forEach((v, k) => { if (!['gemeente', 'k', 's', 'l'].includes(k)) p.set(k, v); });
  u.search = p.toString().replace(/%2C/g, ',');
  u.hash = '';
  return u.href;
};
