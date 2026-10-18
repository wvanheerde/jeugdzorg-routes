/** Tekstfuncties: afbreken van lange woorden in koppen (src/lib/afbreken.ts) en organisaties herkennen (src/lib/genoemd.ts). */
import { test, expect } from '@playwright/test';
import { afbreken } from '../../../src/lib/afbreken';
import { korteNaam, genoemdIn } from '../../../src/lib/genoemd';

const ZACHT = '­';

test.describe('afbreken', () => {
  test('zachte afbreekstreep vóór het laatste deel van een lange samenstelling', () => {
    expect(afbreken('Zindelijkheidstraining')).toBe(`Zindelijkheids${ZACHT}training`);
    expect(afbreken('Taalontwikkelingsstoornis')).toBe(`Taalontwikkelings${ZACHT}stoornis`);
  });
  test('korte woorden en woorden zonder bekend laatste deel blijven heel', () => {
    expect(afbreken('Speltherapie')).toBe('Speltherapie'); // korter dan 13 letters
    expect(afbreken('Jeugdgezondheid')).toBe('Jeugdgezondheid');
  });
  test('alleen het woord dat lang is, de rest van de zin blijft gelijk', () => {
    expect(afbreken('Training en sociale vaardigheidstraining')).toBe(`Training en sociale vaardigheids${ZACHT}training`);
  });
  test('vanaf 13 letters, met minstens 5 letters ervoor', () => {
    expect(afbreken('Oudertraining')).toBe(`Ouder${ZACHT}training`); // precies 13
    expect(afbreken('Gezinstraining')).toBe(`Gezins${ZACHT}training`);
  });
});

test.describe('genoemdIn', () => {
  const org = (id: string, naam: string, genoemdAls: string[] = []) => ({ id, data: { naam, genoemdAls } });
  const lijst = [org('jl', 'Het Juridisch Loket'), org('vt', 'Veilig Thuis'), org('ks', 'Kindertelefoon', ['De Kindertelefoon'])];

  test('korteNaam laat "Het" en een toelichting tussen haakjes weg', () => {
    expect(korteNaam('Het Juridisch Loket')).toBe('Juridisch Loket');
    expect(korteNaam('CIZ (Centrum indicatiestelling zorg)')).toBe('CIZ');
  });
  test('vindt organisaties die in de tekst genoemd worden', () => {
    expect(genoemdIn('Bel het Juridisch Loket of Veilig Thuis.', lijst).map((o) => o.id)).toEqual(['jl', 'vt']);
  });
  test('per lijst maar één keer (gehad)', () => {
    const gehad = new Set<string>();
    expect(genoemdIn('Juridisch Loket', lijst, gehad).map((o) => o.id)).toEqual(['jl']);
    expect(genoemdIn('Nog eens het Juridisch Loket', lijst, gehad)).toEqual([]);
  });
});
