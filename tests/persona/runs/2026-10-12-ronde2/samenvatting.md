# Samenvatting ronde 2 (2026-10-12)

Na de verbeteringen 2 t/m 8 uit de basisronde, het onderscheid tussen nood en spoed en de herschrijving naar B1. Driver v2. Vergeleken met run `2026-10-12-basis`.

| Scenario | Basis | Ronde 2 | Stappen basis → ronde 2 | Gemak | Vertrouwen |
|---|---|---|---|---|---|
| 01 Sanne, beginnen | gehaald | gehaald | 18 → 19 | 4 → 4 | 5 → 5 |
| 02 Mark, wachten | deels | **gehaald** | 19 → 12 | 5 → 6 | 4 → 5 |
| 03 Fatima, kinderbijslag | deels | **gehaald** | 17 → 15 | 3 → 5 | 4 → 5 |
| 04 Peter, wordt 18 | deels | **gehaald** | 28 → 5 | 2 → 6 | 3 → 5 |
| 05 Anouk | niet (nood) | niet (**nieuw scenario: spoed**) | – | 1 → 2 | 1 → 2 |
| 06 Erik, afgewezen | gehaald | gehaald | 18 → 13 | 5 → 6 | 6 → 6 |
| 07 Joyce, verhuizen | gehaald | gehaald | 13 → 9 | 5 → 5 | 5 → 5 |
| 08 Henk, Aalten | gehaald | **deels** | 11 → 13 | 5 → 4 | 4 → 4 |

Gemiddeld gemak 3,8 → 4,8. Gemiddeld vertrouwen 4,0 → 4,6. Gehaald 4 → 6 van 8 (05 is een nieuw scenario).

## Wat beter werkte
- **"Waar staat u?" op gemeente- en situatiepagina's.** Peter kwam via deze rij in 5 stappen bij "wordt 18", Joyce via de gemeente bij verhuizen.
- **De verwijzing naar dubbele kinderbijslag op situatiepagina's.** Fatima vond hem op Autisme in één klik.
- **Het knelpunt "wachten" met een eigen stap voor een huisartsverwijzing.** Mark herkende direct zijn situatie.
- **Het verschil tussen klacht en bezwaar in het knelpunt "afgewezen".** Erik had niet meer de landelijke pagina nodig.

## Nieuwe en resterende problemen
1. **Alleen een gemeente kiezen geeft een leeg overzicht** (Sanne, Henk; ernst 3). Dit komt door de nieuwe opbouw "antwoord eerst". Het overzicht toont pas iets bij een situatie of knelpunt. *Regressie.*
2. **"Begin bij de huisarts", maar een grote belknop voor het wijkteam** (Sanne; ernst 3). Dat lijkt tegenstrijdig.
3. **Spoed: "Bel overdag uw huisarts. 's Avonds hoort u daar…" kwam niet over** (Anouk; ernst 4). Ze begreep niet dat ze 's avonds het nummer van haar eigen huisarts kan bellen. Ook stond bovenaan de kaart van het wijkteam, dat 's avonds dicht is.
4. **Angst om terug te moeten betalen blijft onbeantwoord** (Fatima; ernst 3). Dit ligt bij de redactie.
5. **Verhuizing: het overzicht toont één gemeente** (Joyce; ernst 2).
6. **Kleiner (ernst 2):**
   - het Juridisch Loket zonder nummer in het knelpunt;
   - de bezwaartermijn soms "na verzenddatum", soms "na de datum op het besluit";
   - bij "wordt 18" geen tijdlijn;
   - bij de Wmo-melding geen loket.

## Over de testopzet
De driver (v2) zette knoppen in een blok soms vóór de kop. Daardoor leek bij Joyce het nummer los van "Wijkteam in Almere" te staan. Dat is hersteld in driver v3 (README, Wijzigingen).

## Voorstellen voor ronde 3
| # | Voorstel | Waar |
|---|---|---|
| 1 | Alleen een gemeente gekozen? Toon dan de stappen van "Ik wil hulp aanvragen" met de kaart van het wijkteam. | `overzicht.astro` |
| 2 | Is de eerste route de huisarts? Dan krijgt de wijkteamkaart de kop "Of via het wijkteam", met een gewone link in plaats van een grote knop. | `overzicht.astro` |
| 3 | Spoedtekst: "Bel het nummer van uw eigen huisarts, ook 's avonds en in het weekend. U hoort dan het nummer van de huisartsenpost." Bij "Het kan niet wachten" bovenaan de spoedpagina van de gemeente in plaats van de wijkteamkaart. | `SpoedNummers.astro`, `knelpunten/spoed.md`, `overzicht.astro` |
| 4 | Verhuizing: de kop van de kaart wordt "Uw nieuwe gemeente: …". | `overzicht.astro` |
| 5 | Juridisch Loket met nummer; de bezwaartermijn overal "na de datum op het besluit". | `knelpunten/afgewezen.md`, gemeentebestanden |

## Uitgevoerd na ronde 2
- Voorstel 1 t/m 4 zijn doorgevoerd en in de browser gecontroleerd: gemeente alleen, huisarts eerst, spoed en verhuizing. Driver v3.
- Voorstel 5 en de vraag van Fatima over terugbetalen liggen bij de eigenaar.
