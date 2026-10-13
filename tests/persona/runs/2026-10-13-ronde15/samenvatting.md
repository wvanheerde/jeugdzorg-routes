# Samenvatting ronde 15 (2026-10-13): na P, Q, R en zonder oplichten

Alle 15 scenario's, lokale build. De wijzigingen sinds ronde 14 staan in `run.md`.

## Uitkomsten: ronde 14 → ronde 15

| # | Persona | Uitkomst | Stappen | Gemak | Vertrouwen |
|---|---|---|---|---|---|
| 01 | Sanne, beginnen (Emmen) | gehaald → gehaald | 14 → 13 | 5 → 5 | 6 → 5 |
| 02 | Mark, wachten (Utrecht) | gehaald → gehaald | 8 → 13 | 6 → 6 | 6 → 5 |
| 03 | Fatima, kinderbijslag | gehaald → gehaald | 10 → 12 | 5 → **6** | 6 → 6 |
| 04 | Peter, wordt 18 (Apeldoorn) | gehaald → gehaald | 6 → 7 | 6 → 5 | 5 → **6** |
| 05 | Anouk, spoed (Zwolle) | deels* → **gehaald** | 5 → **3** | 4 → **5** | 4 → **6** |
| 06 | Erik, bezwaar (Den Haag) | gehaald → gehaald | 8 → 8 | 6 → 6 | 6 → 6 |
| 07 | Joyce, verhuizen (Almere) | gehaald → gehaald | 21 → **11** | 5 → 5 | 6 → 6 |
| 08 | Henk, opa (Aalten) | gehaald → gehaald | 11 → 11 | 6 → 5 | 6 → 6 |
| 09 | Lisa, thuiszitter (Haarlem) | gehaald, omweg → **gehaald** | 21 → **17** | 5 → 5 | 6 → 6 |
| 10 | Ahmed, scheiding (Tilburg) | gehaald → gehaald | 6 → 8 | 6 → 6 | 6 → 6 |
| 11 | Ingrid, pgb (Groningen) | gehaald → gehaald | 8 → 8 | 6 → 6 | 6 → 6 |
| 12 | Kees, geen besluit (Eindhoven) | gehaald → gehaald | 12 → 11 | 6 → 6 | 6 → 5 |
| 13 | Naima, hulp werkt niet (Leeuwarden) | gehaald → gehaald | 21 → 19 | 5 → 5 | 5 → **6** |
| 14 | Rob, hoe gaat het hier (Arnhem) | gehaald → deels* | 13 → 8 | 6 → 6 | 5 → 4 |
| 15 | Monique, zorgen om kinderen (Lelystad) | gehaald → gehaald | 7 → 5 | 6 → 6 | 6 → 6 |

**Totaal: 14 van 15 gehaald (gelijk aan ronde 13 en 14).** Gemak gemiddeld 5,5 (ronde 14: 5,5). Vertrouwen gemiddeld 5,7 (ronde 14: 5,7).

\* Op de criteria gehaald; de persona noemt het zelf "deels". Rob gaat dit keer via het menu naar de pagina van Arnhem en kiest geen situatie. Daardoor vindt hij niets over dyslexie. Anouk's "deels" in ronde 14 was spreiding: de pagina is niet veranderd.

## Wat de aanpassingen deden

- **Q, links naar voorbeeldbrieven:** Erik, Kees en Mark openden de brief via de nieuwe link achter de stap.
- **Q, samenvatting bij gescheiden:** daar staat nu ook de rechter. Ahmed kwam niet meer op "toestemming van beide ouders" als nee uit.
- **R, Veilig Thuis:** Monique las de nieuwe stap over de naam van de beller. Die werkt wel twee kanten op (zie hieronder).
- **Situaties op de startpagina:** Lisa ging voor het eerst via de situatieknoppen op de startpagina, zonder omweg via het menu.
- **P, zoeken op woonplaats:** niemand gebruikte het zoekveld. Alle testers kenden hun gemeente. Erik zocht dit keer niet op "'s-Gravenhage".

## Wat nog niet goed gaat

1. **Fout in voorstel H: scrollen zonder gemeente (Peter, Ahmed, Ingrid; ernst 2).** Wie een vraagknop kiest zonder gemeente, wordt naar de situaties gescrold. De balk vraagt juist om eerst de gemeente te kiezen, die nu boven beeld staat. Daardoor lijkt het alsof er niets gebeurt. *Hersteld na deze ronde: zonder gemeente scrolt de pagina niet meer.*
2. **Huisarts als eerste stap, geen nummer bovenaan (Sanne, Henk; ernst 2, zelfde als ronde 14).** Dit was voorstel N, nog niet gebouwd.
3. **Lisa: "Begin bij school" terwijl school al nee zei (ernst 2–3).** De rechten, de onderwijsconsulent en de leerplichtambtenaar staan onderaan. Er is geen nummer van de leerplichtambtenaar in Haarlem en ook niet van de onderwijsconsulent.
4. **Monique: de zin over melden kan afschrikken (ernst 2).** "Doet u een melding, dan hoort het gezin … meestal ook van wie" staat midden in de stap. Beter apart, en na de geruststelling over advies vragen.
5. **Kleinere punten:**
   - Het postadres in de voorbeeldbrief is een leeg invulveld, ook als de gemeente bekend is (Kees).
   - Vanaf welke datum de zes weken voor bezwaar tellen (Erik).
   - Wat een kind zelf kan krijgen tijdens het wachten (Mark).
   - "Verwijzer" en "crisisdienst": de uitleg verschijnt pas na een tik (Naima, Anouk).
   - Verhuizen met twee gemeenten (Joyce; voorstel G, bewust niet gebouwd).

## Voorstellen

| # | Voorstel | Lost op | Waar |
|---|---|---|---|
| N | (uit ronde 14) Als de situatie bij de huisarts begint: onder stap 1 "Of bel het wijkteam: [naam], [nummer]". | 2 | `overzicht.astro` |
| S | Bij *School loopt vast*: als eerste stap ook "Zegt school dat het niet lukt? Dan begint de zorgplicht." met de onderwijsconsulent erbij. Leerplicht in de gemeente-onderdelen (link naar de leerplichtpagina van de gemeente, waar bekend). | 3 | `situaties/school-loopt-vast.md`, gemeentedata |
| T | De stap over de naam van de beller splitsen: advies (anoniem, niets gedeeld) en melding (gezin hoort het meestal) als twee aparte stappen. | 4 | `knelpunten/zorgen-om-kind.md` |
| U | In de voorbeeldbrieven het postadres van de gekozen gemeente invullen (als de gemeente bekend is). | 5 | `brieven/[slug].astro` |
