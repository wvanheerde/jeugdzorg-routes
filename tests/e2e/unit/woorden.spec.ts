/** De lijst met moeilijke woorden (src/lib/woorden.ts): elk woord één keer, en elke uitleg een volledige zin. */
import { test, expect } from '@playwright/test';
import { woorden } from '../../../src/lib/woorden';

test('elke woordvorm komt maar één keer voor', () => {
  const alle = woorden.flatMap((w) => w.vormen.map((v) => v.toLowerCase()));
  const dubbel = alle.filter((v, i) => alle.indexOf(v) !== i);
  expect(dubbel).toEqual([]);
});

test('elke uitleg is een volledige zin', () => {
  const fout = woorden.filter((w) => !/^[A-ZÀ-Ý0-9"'(]/.test(w.uitleg) || !/[.!?]$/.test(w.uitleg.trim())).map((w) => w.vormen[0]);
  expect(fout).toEqual([]);
});
