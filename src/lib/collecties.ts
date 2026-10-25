/**
 * Collecties in hun vaste volgorde: gemeenten, organisaties en therapievormen op naam; de rest op het veld volgorde.
 * Zo staat die afspraak op één plek in plaats van in elke pagina.
 */
import { getCollection, type CollectionEntry } from 'astro:content';

type OpNaam = 'gemeenten' | 'organisaties' | 'therapievormen';
type OpVolgorde = 'situaties' | 'hulpsoorten' | 'knelpunten' | 'landelijk' | 'brieven';

export const opNaam = (a: { data: { naam: string } }, b: { data: { naam: string } }) => a.data.naam.localeCompare(b.data.naam);
export const opVolgorde = (a: { data: { volgorde: number } }, b: { data: { volgorde: number } }) => a.data.volgorde - b.data.volgorde;

const SORTERING: Record<OpNaam | OpVolgorde, (a: any, b: any) => number> = {
  gemeenten: opNaam,
  organisaties: opNaam,
  therapievormen: opNaam,
  situaties: opVolgorde,
  hulpsoorten: opVolgorde,
  knelpunten: opVolgorde,
  landelijk: opVolgorde,
  brieven: opVolgorde,
};

/** De hele collectie, gesorteerd. */
export async function gesorteerd<C extends OpNaam | OpVolgorde>(naam: C): Promise<CollectionEntry<C>[]> {
  return ((await getCollection(naam)) as CollectionEntry<C>[]).sort(SORTERING[naam]);
}
