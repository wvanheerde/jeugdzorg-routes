# Beoordeling 07-joyce-verhuizen (ronde 20)

- Uitkomst (persona): gehaald
- Moet vinden: 4 + 1 deels / 5
- Stappen: 12 (r19: 13); gemak 5 (r19: 5), vertrouwen 6 (r19: 6)
- Mag niet: geen overtredingen

## Moet vinden
- **Nu melden bij het huidige team (Amsterdam, OKT) en om warme overdracht vragen:** deels. Ze weet dat ze Amsterdam moet bellen en een overdracht moet vragen (met brief), maar noteert het nummer van het Ouder- en Kindteam niet: het stond onder de verkeerde kop "Nieuwe gemeente Amsterdam" en na wisselen naar Almere staat het er niet meer. In r19 had ze het wel (020 555 5961).
- **Beschikking blijft geldig tot einddatum; nieuwe gemeente neemt over:** gevonden.
- **Almere: JGZ Almere 088 002 9990:** gevonden.
- **Is de aanbieder ook in Almere gecontracteerd:** gevonden.
- **Voorbeeldbrief overdracht:** gevonden.

## Ervaring
- Eerste bruikbare antwoord (stappen) na 4 klikken; het Almere-nummer pas na 12 stappen.
- **Ernst 3, zelfde probleem als ronde 19:** de site vraagt één gemeente ("Waar woont u?"); Joyce koos haar huidige woonplaats en kreeg "Nieuwe gemeente Amsterdam" met het Amsterdamse team (`/overzicht/?gemeente=amsterdam&k=verhuizing`). Zelf nagekeken: de kop komt ongewijzigd uit `src/pages/gemeente-blokken/[slug].astro` (`<span class="kop-verhuizing">Nieuwe gemeente {d.naam}</span>`), en de tekst "Het nummer van het andere wijkteam vindt u via Gemeenten in het menu" staat er nog. Er is niets aan veranderd sinds r19.
- Ernst 2: geen termijn ("hoeveel weken van tevoren melden"); veel scrollen langs klachtenblokken.

## Onjuistheden
Geen in wat ze noteerde.

## Vertrouwen in de agent
**Uit de rol:** ze paste het adres in de adresbalk aan naar `gemeente=almere` (log stap 19) in plaats van "Keuzes aanpassen" te gebruiken; ze zegt het zelf. Een echte ouder had via "Keuzes aanpassen" gemoeten, en daar bleef in r19 de pagina op het formulier staan zodat het leek alsof er niets gebeurde (ernst 2). De echte kosten liggen dus hoger dan 12 stappen. De hoofdbevinding (ernst 3) is wel betrouwbaar: tweede ronde op rij, zelfde plek.
