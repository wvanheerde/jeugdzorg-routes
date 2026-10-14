# Samenvatting ronde 19 (2026-10-14)

Alle 15 scenario's op de lokale build; wijzigingen sinds ronde 18 in `run.md` (één kleine wijziging tijdens de run, ook daar genoteerd).

| # | Persona | Uitkomst | Moet vinden | Stappen (r18 → r19) | Gemak | Vertrouwen |
|---|---|---|---|---|---|---|
| 01 | Sanne, beginnen (Emmen) | gehaald | 2 + 1 deels / 4 | 12 → 8 | 5 | 5 |
| 02 | Mark, wachten (Utrecht) | gehaald | 4 / 4 | 10 → 9 | 6 | 5 |
| 03 | Fatima, kinderbijslag | gehaald | 4 / 4 | 13 → 14 | 5 | 6 |
| 04 | Peter, wordt 18 (Apeldoorn) | gehaald | 6 / 6 | 5 → 11 | 5 | 5 |
| 05 | Anouk, spoed (Zwolle) | deels | 1 / 1 | 4 → 4 | 4 | 5 |
| 06 | Erik, bezwaar (Den Haag) | gehaald | 5 / 5 | 8 → 7 | 6 | 6 |
| 07 | Joyce, verhuizen (Almere) | gehaald | 5 / 5 | 7 → 13 | 5 | 6 |
| 08 | Henk, opa (Aalten) | gehaald | 3 + 1 deels / 4 | 9 → 12 | 5 | 6 |
| 09 | Lisa, thuiszitter (Haarlem) | gehaald | 5 / 5 | 21 → 18 | 5 | 6 |
| 10 | Ahmed, scheiding (Tilburg) | gehaald | 3 + 1 deels / 4 | 7 → 6 | 6 | 6 |
| 11 | Ingrid, pgb (Groningen) | gehaald | 4 / 4 | 6 → 14 | 5 | 5 |
| 12 | Kees, geen besluit (Eindhoven) | gehaald | 4 / 4 | 10 → 8 | 6 | 6 |
| 13 | Naima, hulp werkt niet (Leeuwarden) | gehaald | 3 / 4 | 18 → 20 | 5 | 6 |
| 14 | Rob, hoe gaat het (Arnhem) | deels | 5 / 5 | 16 → 15 | 5 | 5 |
| 15 | Monique, zorgen (Lelystad) | gehaald | 2 / 2 | 7 → 9 | 6 | 6 |

**13 van 15 gehaald volgens de persona's (gelijk aan ronde 18); op de criteria vonden alle 15 het belangrijkste.** Gemak gemiddeld 5.3 (r18: 5,5), vertrouwen 5.6 (r18: 5,5). Geen overtredingen.

## Verloop

| Ronde | Gehaald | Gemak | Vertrouwen |
|---|---|---|---|
| 17 | 15 / 15 | 5,6 | 5,7 |
| 18 | 13 / 15 | 5,5 | 5,5 |
| 19 | 13 / 15 | 5.3 | 5.6 |

## Wat de wijzigingen sinds ronde 18 opleverden
- **Wijkteam onder stap 1:** Sanne 12 → 8 stappen; Henk zag het Ondersteuningsteam direct.
- **Nieuwe teksten werken:** Kees vond de dwangsom en het beroep (nieuw), Fatima wie het verslag kan geven (nieuw), Naima wie de verwijzer is (nieuw).
- **Zorgen om een kind van een ander:** Monique kreeg geen rechten/regelingen of schooltip meer.
- **Lisa** 21 → 18 stappen; **Peter**, **Joyce**, **Naima** en **Monique** juist iets meer stappen, deels door misklikken (zie hieronder).

## Terugkerende problemen
1. **Verhuizen vraagt twee gemeenten, de site vraagt er één** (Joyce, ernst 3). Ze koos de oude gemeente en kreeg "Nieuwe gemeente Amsterdam".
2. **Overzicht lang, belangrijke tips diep weggestopt** (Henk 16 schermen, Naima EMDR na ~15 schermen, Mark: antwoord is derde van zes punten, Ingrid: verspreid over drie pagina's). Ernst 2.
3. **Moeilijke woorden alleen via een klik uitgelegd** (Henk, Ahmed, Fatima, Ingrid: wijkteam, beschikking, vervangende toestemming, pgb-vaardig). Ernst 2.
4. **Wachttijd en ouderervaringen ontbreken** (Rob ernst 3, Sanne: 'Hoe gaat het' te zwaar). Inhoudelijk gat; de site zegt het eerlijk.
5. **Huisartsenpost zonder nummer** (Anouk, ernst 3; bekend en bewust).

## Testartefact
Peter, Ingrid en Monique klikten na het kiezen van een gemeente op een verkeerd knopnummer, omdat ze nummers van een eerdere `kijk` gebruikten. Echte bezoekers zien geen nummers; dit is licht gewogen. Toegevoegd als valkuil in `.claude/agents/persona-tester.md`. Wel gevonden en hersteld tijdens de run: op de telefoon schoven de knoppen 48px op na de gemeentekeuze (zie `run.md`).

## Verbetervoorstellen
1. `src/content/knelpunten/verhuizing.md` + `src/pages/overzicht.astro`: bij "Wij verhuizen" om de huidige én de nieuwe gemeente vragen, en beide teams tonen.
2. `src/pages/overzicht.astro`: bovenaan een korte "Doe dit eerst"-regel per vraag (1–3 acties), en therapievormen/EMDR hoger zichtbaar bij "De hulp werkt niet".
3. Uitleg van de belangrijkste woorden (wijkteam, beschikking, cliëntondersteuner) direct in de tekst bij het eerste gebruik, niet alleen via een klik.
4. Gemeentepagina: de link "Hoe gaat het in …?" naar een korte samenvatting laten wijzen in plaats van midden in de cijfers.
5. Scenario toevoegen dat via de situatie Scheiding loopt (CJG-blok en lichte start zijn nog niet getest).
