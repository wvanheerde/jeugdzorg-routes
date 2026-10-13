# Samenvatting ronde 7 (2026-10-12): telefoongebruikers

Na de aanpassingen voor de telefoon:
- menu-knop;
- kleinere kop op de voorpagina, zonder de eerste zin van de inleiding;
- knelpunten op het eerste scherm.

| Scenario | Vorige ronde | Ronde 7 | Stappen | Gemak | Vertrouwen |
|---|---|---|---|---|---|
| 01 Sanne | gehaald (r5) | gehaald | 9 → 8 | 6 → 6 | 6 → 6 |
| 03 Fatima | deels (r5) | **gehaald** | 14 → 9 | 4 → 5 | 4 → **6** |
| 05 Anouk | deels (r5) | deels* | 5 → 4 | 4 → 5 | 5 → 5 |
| 07 Joyce | gehaald (r6) | gehaald | 12 → 18 | 6 → 5 | 6 → 6 |

\*Volgens de criteria gehaald. Zonder eigen nummer voor de huisartsenpost blijft de persona "deels" zeggen. Dat is een ontwerpkeuze.

## Wat beter ging
- **Knelpunten op het eerste scherm:** Sanne, Anouk en Joyce tikten allemaal direct op hun knop ("Ik wil hulp aanvragen", "Het kan niet wachten", "Wij verhuizen").
- **Fatima:** de nieuwe tekst over kinderbijslag werkt. Het antwoord over terugbetalen stelde haar gerust ("eerlijk = niets fout"). Ze vond het via Menu, dan Landelijk, dan Financiële regelingen. De menu-knop gaf geen problemen.

## Problemen
1. **Verhuizing, kop "Nieuwe gemeente X"** (Joyce, ernst 3). Kiest u bij verhuizing uw huidige gemeente, dan staat er "Nieuwe gemeente Amsterdam". Samen met het terugkerende punt "het overzicht toont één gemeente" is dit nu het grootste punt bij verhuizen.
2. **Geen ingang voor geld op de voorpagina** (Fatima, ernst 2). Ze moest raden dat kinderbijslag onder Landelijk staat.
3. **Kleiner (ernst 1–2):**
   - geen advies tussen huisarts en wijkteam bij ADHD en school (Sanne);
   - vaktaal: Wlz-indicatie, "toezicht", "(zie hieronder)" (Fatima);
   - het lokale blok onderaan zonder gemeente (Anouk).

## Voorstellen (niet uitgevoerd)
| # | Voorstel | Waar |
|---|---|---|
| 1 | Bij verhuizing twee keuzes: "Waar woont u nu?" en "Waar gaat u wonen?". Het overzicht toont dan het team van beide gemeenten. Een snelle tussenoplossing: de kop neutraal maken ("Wijkteam in X"). | `overzicht.astro`, `GemeenteKeuze.astro` |
| 2 | Een knelpunt of knop voor geld, zoals "Extra kosten of kinderbijslag", die naar de financiële regelingen leidt. | `knelpunten/`, `KnelpuntKeuze.astro` |
