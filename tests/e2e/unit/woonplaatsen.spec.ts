/** Woonplaatsen onder de kop van een gemeentepagina (src/lib/woonplaatsen.ts): de namen uit de registratie, zoals ouders ze kennen. */
import { test, expect } from '@playwright/test';
import { toonNaam, woonplaatsenVoor } from '../../../src/lib/woonplaatsen';

test.describe('toonNaam', () => {
  test('zonder provinciecode', () => {
    expect(toonNaam('Afferden GLD', 'Druten')).toBe('Afferden');
    expect(toonNaam('Bergen NH', 'Bergen (NH)')).toBe('Bergen');
  });
  test('zonder "Gem" en de gemeente', () => {
    expect(toonNaam('Spijk Gem Zevenaar', 'Zevenaar')).toBe('Spijk');
    expect(toonNaam('Alteveer Gem de Wolden', 'De Wolden')).toBe('Alteveer');
  });
  test('zonder de gemeentenaam ervoor, als er één woord achter staat', () => {
    expect(toonNaam('Winterswijk Huppel', 'Winterswijk')).toBe('Huppel');
    expect(toonNaam('Bergen aan Zee', 'Bergen (NH)')).toBe('Bergen aan Zee');
  });
  test('gewone namen blijven', () => {
    expect(toonNaam('Hollandsche Rading', 'De Bilt')).toBe('Hollandsche Rading');
    expect(toonNaam('1e Exloermond', 'Borger-Odoorn')).toBe('1e Exloermond');
  });
});

test.describe('woonplaatsenVoor', () => {
  const lijst: [string, string][] = [['Hoorn NH', 'hoorn'], ['Zwaag', 'hoorn'], ['Blokker', 'hoorn'], ['Spijk Gem Zevenaar', 'zevenaar'], ['Spijk', 'zevenaar']];
  test('op alfabet, zonder de gemeente zelf en zonder dubbele namen', () => {
    expect(woonplaatsenVoor(lijst, 'hoorn', 'Hoorn')).toEqual(['Blokker', 'Zwaag']);
    expect(woonplaatsenVoor(lijst, 'zevenaar', 'Zevenaar')).toEqual(['Spijk']);
  });
});
