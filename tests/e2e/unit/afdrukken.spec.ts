/** Afdrukken van Mijn overzicht (src/lib/afdrukken.ts): het adres bij een website en het adres van het overzicht zelf. */
import { test, expect } from '@playwright/test';
import { kortAdres, overzichtAdres } from '../../../src/lib/afdrukken';

test.describe('kortAdres', () => {
  test('zonder https://, www. en de slash aan het eind', () => {
    expect(kortAdres('https://www.lokalis.nl/')).toBe('lokalis.nl');
    expect(kortAdres('http://impuls-woortblind.nl')).toBe('impuls-woortblind.nl');
  });
  test('het pad en de vraag blijven, het anker niet', () => {
    expect(kortAdres('https://www.utrecht.nl/zorg/jeugd/?wijk=noord#contact')).toBe('utrecht.nl/zorg/jeugd?wijk=noord');
  });
});

test.describe('overzichtAdres', () => {
  test('de keuzes voorop, dan de antwoorden van de verdieping, zonder anker', () => {
    expect(
      overzichtAdres('https://example.nl/overzicht/?gezag=samen&k=gescheiden#stappen', {
        gemeente: 'tilburg',
        k: 'gescheiden',
        s: ['adhd', 'scheiding'],
        l: '4-12',
      }),
    ).toBe('https://example.nl/overzicht/?gemeente=tilburg&k=gescheiden&s=adhd,scheiding&l=4-12&gezag=samen');
  });
  test('keuzes die alleen in de browser bewaard zijn, komen ook in het adres', () => {
    expect(overzichtAdres('https://example.nl/jeugdzorg-routes/overzicht/', { gemeente: 'utrecht', k: '', s: [], l: '' })).toBe(
      'https://example.nl/jeugdzorg-routes/overzicht/?gemeente=utrecht',
    );
  });
});
