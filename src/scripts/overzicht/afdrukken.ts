/**
 * Afdrukken van Mijn overzicht: het algemene deel staat in scripts/afdrukken.ts. Hier alleen het adres op papier, met de
 * keuzes erin (die kunnen ook alleen in de browser bewaard zijn), na elke keer tekenen.
 */
import { overzichtAdres } from '../../lib/afdrukken';
import { bijwerken } from '../afdrukken';
import { keuze } from './gedeeld';

export const afdrukken = (kp: string) => bijwerken(overzichtAdres(location.href, { gemeente: keuze.gem, k: kp, s: keuze.sel, l: keuze.lf }));
