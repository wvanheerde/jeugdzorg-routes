/**
 * Het vel "Uw gesprek met het wijkteam voorbereiden" (src/pages/gesprek.astro). De vragen staan hier; de andere teksten komen
 * uit bestaande bronnen, zodat ze niet uit elkaar lopen. Verdwijnt een kop of zin die het vel nodig heeft, dan faalt de build.
 * Vragen en hun bronnen: docs/onderzoek/concept-gespreksvragen-2026-10-19.md (akkoord beheerder 19-10-2026).
 */

/** Vragen per moment. Elke vraag belooft niets; de ouder vraagt het na. */
export const VRAGEN: { moment: string; vragen: string[] }[] = [
  {
    moment: 'Bij het maken van de afspraak',
    vragen: [
      'Mag ik iemand meenemen, zoals een cliëntondersteuner of iemand uit mijn omgeving?',
      'Kan ik mijn vraag vooraf op papier sturen? Naar welk adres?',
    ],
  },
  {
    moment: 'In het gesprek',
    vragen: [
      'Welke hulp kunt u zelf geven, en voor welke hulp is een besluit van de gemeente nodig?',
      'Wat heeft u nog van mij nodig, zoals een verslag van school of van een behandelaar?',
      'Bij welke aanbieders kan mijn kind terecht, en mag ik kiezen?',
      'Hoe lang is de wachttijd, en is er hulp in de tussentijd?',
      'Wilt u een pgb? Vraag dan: kan dat voor wat wij nodig hebben, en wat moet ik daarvoor doen?',
      'Kunnen we zelf een plan maken met mensen om ons heen (een familiegroepsplan)?',
    ],
  },
  {
    moment: 'Aan het eind van het gesprek',
    vragen: [
      'Wat gebeurt er na dit gesprek, en wanneer hoor ik iets?',
      'Krijg ik een verslag van dit gesprek? Mag ik dat aanvullen als er iets mist?',
      'Krijg ik het besluit van de gemeente op papier?',
      'Wie is mijn vaste contactpersoon, en hoe bereik ik die?',
      'Wat kan ik doen als ik het niet eens ben met het besluit?',
    ],
  },
];

const fout = (wat: string, waar: string) => {
  throw new Error(`Vel gespreksvoorbereiding: "${wat}" niet gevonden in ${waar}. Pas src/lib/gesprek.ts aan.`);
};

/** De tekst onder een kop (## kop) in markdown, tot de volgende kop van hetzelfde niveau. */
export const sectie = (body: string, kop: string, waar: string) => {
  const m = body.match(new RegExp(`^## ${kop.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*$([\\s\\S]*?)(?=^## |(?![\\s\\S]))`, 'm'));
  return m ? m[1].trim() : fout(kop, waar);
};

/** De alinea die met deze woorden begint. */
export const alinea = (body: string, begin: string, waar: string) =>
  body
    .split(/\n\s*\n/)
    .map((a) => a.trim())
    .find((a) => a.startsWith(begin)) ?? fout(begin, waar);

/** Kopjes van de voorbeeldbrief (**Kopje.** [uitleg]) met de uitleg tussen de haken, in de volgorde van de brief. */
export const briefKopjes = (body: string, kopjes: string[], waar: string) =>
  kopjes.map((kop) => {
    const m = body.match(new RegExp(`\\*\\*${kop}\\.\\*\\* \\[([^\\]]+)\\]`));
    return { kop, uitleg: m ? m[1] : fout(kop, waar) };
  });

/** Eenvoudige markdown (alinea's, lijstjes met "- ", **vet**) naar blokken; meer staat er in deze stukken niet. */
export type Blok = { soort: 'p'; tekst: string } | { soort: 'ul'; items: string[] };
export const blokken = (md: string): Blok[] =>
  md.split(/\n\s*\n/).map((deel) => {
    const regels = deel.trim().split('\n');
    return regels.every((r) => r.startsWith('- '))
      ? { soort: 'ul' as const, items: regels.map((r) => r.slice(2).trim()) }
      : { soort: 'p' as const, tekst: regels.join(' ') };
  });
/** Tekst met **vet** in stukken, voor in de pagina (zonder set:html). */
export const vet = (tekst: string) =>
  tekst
    .split(/(\*\*[^*]+\*\*)/)
    .filter(Boolean)
    .map((d) => (d.startsWith('**') ? { vet: true, tekst: d.slice(2, -2) } : { vet: false, tekst: d }));
