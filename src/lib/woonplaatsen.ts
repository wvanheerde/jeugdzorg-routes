/**
 * Woonplaatsen onder de kop van een gemeentepagina ("Ook voor …"), uit public/woonplaatsen.json (dezelfde lijst als het zoeken op
 * woonplaats). De registratie houdt dubbele namen uit elkaar met toevoegingen die op de pagina van de gemeente dubbel zijn:
 * een provinciecode ("Afferden GLD"), "Gem" met de gemeente ("Spijk Gem Zevenaar") of de gemeentenaam ervoor ("Winterswijk Huppel").
 */
const PROVINCIECODE = /\s(GLD|LB|NB|OV|DR|GN|NH|ZH|UT|FR|ZL|FL)$/;
const GEM = /\s[Gg]em\.?\s.*$/;
/** De naam van de gemeente zonder toevoeging tussen haakjes: "Bergen (NH)" wordt "Bergen". */
const kaal = (gemeente: string) => gemeente.replace(/\s*\(.*?\)/g, '').trim();

/** De naam zoals ouders hem kennen. De gemeentenaam vooraan valt alleen weg als er één woord met een hoofdletter achter staat. */
export const toonNaam = (woonplaats: string, gemeente: string) => {
  const naam = woonplaats.replace(PROVINCIECODE, '').replace(GEM, '').trim();
  const rest = naam.startsWith(`${kaal(gemeente)} `) ? naam.slice(kaal(gemeente).length + 1) : '';
  return /^[A-Z][a-zà-ÿ'-]+$/.test(rest) ? rest : naam;
};

/** De woonplaatsen van een gemeente op alfabet, zonder de gemeente zelf en zonder dubbele namen. */
export const woonplaatsenVoor = (lijst: [string, string][], slug: string, gemeente: string) =>
  [...new Set(lijst.filter(([, s]) => s === slug).map(([w]) => toonNaam(w, gemeente)))]
    .filter((w) => w !== kaal(gemeente))
    .sort((a, b) => a.localeCompare(b, 'nl'));
