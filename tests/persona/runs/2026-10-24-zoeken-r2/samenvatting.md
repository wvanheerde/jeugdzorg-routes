# Samenvatting run 2026-10-24-zoeken-r2

Tweede run van 25–28, na de verbeteringen uit r1 (situatie opent bij het begin, "Zoeken…", snelkoppelingen op Hulpmiddelen, zoekvormen).

| # | Persona | r1 → r2 | Stappen r1 → r2 | Gemak r1 → r2 | Vertrouwen r1 → r2 | Zoekfunctie |
|---|---|---|---|---|---|---|
| 25 | Mark, brief terugvinden | gehaald → gehaald | 6 → **3** | 7 → **9** | 9 → 9 | meteen, eerste treffer |
| 26 | Ingrid, woord opzoeken | gehaald → gehaald | 5 → 15 | 8 → 7 | 8 → 8 | ja, twee rondes |
| 27 | Naima, in een zin | deels → deels | 16 → 17 | 6 → 7 | 6 → 6 | ja, eerste treffer goed |
| 28 | Sanne, in een zin | gehaald → gehaald | 9 → 7 | 8 → 8 | 8 → 8 | nee, via situaties |

**Wat beter werkt**
- Mark zocht meteen en vond de brief als eerste treffer.
- Naima's zin gaf Slaapproblemen als eerste treffer, nu bij het begin van de pagina.

**Wat nog beter kan**
1. **De uitleg van "zorgovereenkomst" in de begrippenlijst** noemt niet dat gemeente en SVB hem goedkeuren (Ingrid, ernst 2). Voorstel: dat toevoegen in `src/lib/woorden.ts` (de bron is de landelijke uitleg over het pgb).
2. **Situaties die het woord alleen in een bijzin noemen, staan boven Landelijk en de begrippen** (Ingrid, "zorgovereenkomst"). Voorstel: situaties waarvan geen zoekwoord of titelwoord in de zoekopdracht staat, na de andere soorten pagina's zetten.
3. Klein: stukjes tekst die midden in een zin beginnen (Mark), stukjes van gemeentepagina's (Naima).

Naima's "deels" komt in beide runs door afdwalen naar EMDR (persona-beschrijving); dat weegt lichter.
