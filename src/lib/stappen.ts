/** De stappen van een knelpunt (src/content/knelpunten), zoals Mijn overzicht ze toont. */
import type { CollectionEntry } from 'astro:content';

export type Knelpunt = CollectionEntry<'knelpunten'>;
/** Een stap is tekst, of tekst met vervolgstappen (A, B) die er direct onder horen, zoals de ingebrekestelling na "wacht u op een besluit". */
export const hoofdStappen = (k: Knelpunt) => k.data.stappen.map((s) => (typeof s === 'string' ? s : s.stap));
export const vervolg = (k: Knelpunt, i: number) => { const s = k.data.stappen[i]; return typeof s === 'string' ? [] : s.daarna; };
/** Alle stappen in leesvolgorde, vervolgstappen meegeteld: "de eerste stap die … noemt" telt ook een vervolgstap. */
export const alleStappen = (k: Knelpunt) => k.data.stappen.flatMap((s) => (typeof s === 'string' ? [s] : [s.stap, ...s.daarna]));
