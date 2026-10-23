/** Regelingencheck (src/lib/regelingen.ts): wanneer past een regeling, wanneer niet, en wanneer blijft hij open.
 *  Hier ook wat van de gegevens van een gemeente afhangt (mantelzorgwaardering niet voor ouders), want die gegevens veranderen per onderzoeksronde. */
import { test, expect } from '@playwright/test';
import { regelingPast, type Antwoorden } from '../../../src/lib/regelingen';

const leeg: Antwoorden = { zorg: '', dkb: '', alleen: '', inkomen: '', kosten: [], leeftijd: '' };
const met = (a: Partial<Antwoorden>) => ({ ...leeg, ...a });

test('zonder antwoorden is alles nog open', () => {
  for (const rol of ['dkiz', 'extra', 'meerkosten', 'inkomen', 'vervoer', 'mantelzorg', 'wlz', 'aftrek']) expect(regelingPast(rol, leeg)).toBeNull();
});
test('"Weet ik niet" sluit niets uit', () => {
  expect(regelingPast('dkiz', met({ zorg: 'weet-niet' }))).toBeNull();
  expect(regelingPast('mantelzorg', met({ zorg: 'weet-niet' }))).toBeNull();
  expect(regelingPast('inkomen', met({ inkomen: 'weet-niet' }))).toBe(true);
});
test('wie al dubbele kinderbijslag krijgt, heeft die stap gedaan', () => {
  expect(regelingPast('dkiz', met({ zorg: 'ja', dkb: 'ja' }))).toBe('gedaan');
});
test('het extra bedrag past alleen met dubbele kinderbijslag én alleenstaand of alleenverdiener', () => {
  expect(regelingPast('extra', met({ zorg: 'ja', dkb: 'ja', alleen: 'ja' }))).toBe(true);
  expect(regelingPast('extra', met({ zorg: 'ja', dkb: 'ja', alleen: 'nee' }))).toBe(false);
  expect(regelingPast('extra', met({ zorg: 'ja', dkb: 'nee' }))).toBe(false);
});
test('bij een kind van 18 of ouder past dubbele kinderbijslag niet meer', () => {
  expect(regelingPast('dkiz', met({ zorg: 'ja', leeftijd: '18-99' }))).toBe(false);
});
test('geeft de gemeente ouders geen mantelzorgwaardering, dan past die niet, ook bij veel zorg', () => {
  expect(regelingPast('mantelzorg', met({ zorg: 'ja' }), true)).toBe(false);
  expect(regelingPast('mantelzorg', met({ zorg: 'ja' }), false)).toBe(true);
});
test('kosten: leerlingenvervoer bij vervoer naar school, aftrek bij zorgkosten, "Geen van deze" sluit beide uit', () => {
  expect(regelingPast('vervoer', met({ kosten: ['school'] }))).toBe(true);
  expect(regelingPast('aftrek', met({ kosten: ['school'] }))).toBe(false);
  expect(regelingPast('aftrek', met({ kosten: ['ziekte'] }))).toBe(true);
  expect(regelingPast('vervoer', met({ kosten: ['geen'] }))).toBe(false);
});
test('extra kosten door ziekte passen ook zonder veel zorg', () => {
  expect(regelingPast('meerkosten', met({ zorg: 'nee', kosten: ['ziekte'] }))).toBe(true);
  expect(regelingPast('meerkosten', met({ zorg: 'nee', kosten: ['school'] }))).toBe(false);
  expect(regelingPast('meerkosten', met({ zorg: 'nee' }))).toBeNull();
});
