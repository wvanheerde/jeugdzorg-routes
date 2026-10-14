import type { CollectionEntry } from 'astro:content';

type Therapie = CollectionEntry<'therapievormen'>;
type Situatie = CollectionEntry<'situaties'>;

const GROEPEN = ['eerst', 'ook', 'bijkomend'] as const;

/**
 * Plek van een therapievorm in de volgorde van een situatie als sorteersleutel: groep × 100 + plek in de groep
 * (eerst 0–99, ook 100–199, bijkomend 200–299). Null als de situatie geen volgorde heeft of de vorm er niet in staat.
 */
export function rangVan(s: Situatie, id: string): number | null {
  const r = s.data.therapievormen;
  if (!r) return null;
  for (const [g, key] of GROEPEN.entries()) {
    const i = r[key].findIndex((x) => x.id === id);
    if (i >= 0) return g * 100 + i;
  }
  return null;
}

/**
 * Therapievormen bij een situatie: in de volgorde van de situatie (situaties.therapievormen), anders op alfabet.
 * Faalt bij een gekoppelde vorm die ontbreekt of dubbel staat, zodat koppeling (therapievormen.situaties) en volgorde niet uit elkaar lopen.
 */
export function therapieVolgorde(s: Situatie, alle: Therapie[]): Therapie[] {
  const gekoppeld = alle.filter((t) => t.data.situaties.includes(s.id)).sort((a, b) => a.data.naam.localeCompare(b.data.naam));
  const r = s.data.therapievormen;
  if (!r) return gekoppeld;
  const ids = GROEPEN.flatMap((g) => r[g].map((x) => x.id));
  const dubbel = ids.filter((id, i) => ids.indexOf(id) !== i);
  const mist = gekoppeld.filter((t) => !ids.includes(t.id)).map((t) => t.id);
  const teveel = ids.filter((id) => !gekoppeld.some((t) => t.id === id));
  if (dubbel.length || mist.length || teveel.length)
    throw new Error(`Volgorde therapievormen bij situatie "${s.id}" klopt niet met therapievormen.situaties. Dubbel: ${dubbel.join(', ') || '-'}; niet ingedeeld: ${mist.join(', ') || '-'}; niet gekoppeld: ${teveel.join(', ') || '-'}.`);
  return ids.map((id) => gekoppeld.find((t) => t.id === id)!);
}
