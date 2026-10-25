/**
 * Termijnen uit src/lib/termijnen.ts (rekenhulp bij brieven en verdiepingen). Bronnen: Awb 4:13, 4:17, 6:7, 6:8, 6:12;
 * Algemene termijnenwet art. 1 en 3. Datums zijn lokale datums; alleen de dag telt.
 */
import { test, expect } from '@playwright/test';
import { leesDatum, dagenTot, feestdagen, bezwaarTot, beslissenTot, naIngebrekestelling } from '../../../src/lib/termijnen';

const d = (j: number, m: number, dg: number) => new Date(j, m - 1, dg);
const iso = (x: Date) => `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}-${String(x.getDate()).padStart(2, '0')}`;

test.describe('leesDatum', () => {
  test('leest dd-mm-jjjj, met en zonder streepjes', () => {
    expect(iso(leesDatum('14-02-2009')!)).toBe('2009-02-14');
    expect(iso(leesDatum('14022009')!)).toBe('2009-02-14');
    expect(iso(leesDatum('1.2.2027')!)).toBe('2027-02-01');
    expect(iso(leesDatum('1/2/2027')!)).toBe('2027-02-01');
  });
  test('weigert een datum die niet bestaat of onvolledig is', () => {
    expect(leesDatum('31-02-2026')).toBeNull();
    expect(leesDatum('14-02')).toBeNull();
    expect(leesDatum('')).toBeNull();
  });
});

test.describe('dagenTot', () => {
  test('telt hele dagen vanaf vandaag, ongeacht het uur', () => {
    const vandaag = new Date(2026, 9, 18, 23, 30);
    expect(dagenTot(d(2026, 10, 18), vandaag)).toBe(0);
    expect(dagenTot(d(2027, 2, 14), vandaag)).toBe(119);
    expect(dagenTot(d(2026, 10, 1), vandaag)).toBe(-17);
  });
});

test.describe('feestdagen (Atw art. 3)', () => {
  test('2026: Pasen valt op 5 april', () => {
    expect(feestdagen(2026).map(iso)).toEqual([
      '2026-01-01',
      '2026-04-03',
      '2026-04-06',
      '2026-04-27',
      '2026-05-05',
      '2026-05-14',
      '2026-05-25',
      '2026-12-25',
      '2026-12-26',
    ]);
  });
  test('Koningsdag op zondag schuift naar zaterdag 26 april (2025)', () => {
    expect(feestdagen(2025).map(iso)).toContain('2025-04-26');
    expect(feestdagen(2025).map(iso)).not.toContain('2025-04-27');
  });
});

test.describe('bezwaarTot: zes weken, naar de eerstvolgende werkdag', () => {
  test('gewone werkdag', () => expect(iso(bezwaarTot(d(2026, 10, 1)))).toBe('2026-11-12'));
  test('valt op zaterdag: maandag', () => expect(iso(bezwaarTot(d(2026, 10, 3)))).toBe('2026-11-16'));
  test('valt op Eerste Kerstdag: na het weekend', () => expect(iso(bezwaarTot(d(2026, 11, 13)))).toBe('2026-12-28'));
});

test.describe('beslistermijn en ingebrekestelling', () => {
  test('acht weken na ontvangst', () => expect(iso(beslissenTot(d(2026, 10, 1)))).toBe('2026-11-26'));
  test('twee weken na de ingebrekestelling, dwangsom vanaf de dag erna', () => {
    const { laatsteDag, vanaf } = naIngebrekestelling(d(2026, 11, 2));
    expect(iso(laatsteDag)).toBe('2026-11-16');
    expect(iso(vanaf)).toBe('2026-11-17');
  });
});
