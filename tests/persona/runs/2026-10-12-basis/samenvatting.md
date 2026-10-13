# Samenvatting run 2026-10-12-basis

Eerste volledige run met driver v2: de tester ziet alleen wat in beeld is. Lokale build op commit 513a7cb, met lokale wijzigingen. Dit is het vergelijkingspunt voor volgende runs.

| Scenario | Uitkomst | Moet vinden | Stappen | Scrollen | Gemak | Vertrouwen |
|---|---|---|---|---|---|---|
| 01 Sanne, beginnen (Emmen, mobiel) | gehaald | 2 + 3 deels / 5 | 18/25 | 12 | 4 | 5 |
| 02 Mark, wachten (Utrecht, laptop) | deels | 4 + 1 deels / 6 | 19/25 | 9 | 5 | 4 |
| 03 Fatima, kinderbijslag (Rotterdam, mobiel) | deels | 4 + 1 deels / 5 | 17/25 | 8 | 3 | 4 |
| 04 Peter, wordt 18 (Apeldoorn, laptop) | deels | 3 + 1 deels / 6 | 28/25 (over max) | 21 | 2 | 3 |
| 05 Anouk, crisis (mobiel) | **niet gehaald** | 0 / 1 | 8/8 | 5 | 1 | 1 |
| 06 Erik, afgewezen (Den Haag, laptop) | gehaald | 5 / 5 | 18/25 | 11 | 5 | 6 |
| 07 Joyce, verhuizen (Amsterdam → Almere, mobiel) | gehaald | 3 + 2 deels / 5 | 13/25 | 8 | 5 | 5 |
| 08 Henk, gemeente niet uitgewerkt (Aalten, desktop) | gehaald | 4 / 5 | 11/25 | 5 | 5 | 4 |

Gemiddeld gemak 3,8/7, vertrouwen 4,0/7. Vier van de acht doelen gehaald, drie deels, één niet.

## Terugkerende problemen (op ernst en aantal persona's)

1. **Crisis: geen directe weg naar een nummer.** De homepage heeft op het eerste scherm niets voor spoed. "Het is nu acuut" leidt naar een overzicht dat eerst weer om keuzes vraagt. Anouk vond in 8 stappen geen nummer. *(ernst 4, 1 persona, maar het zwaarste scenario)*
2. **Het overzicht ("Mijn overzicht") begint met het formulier, niet met het antwoord.** Na het kiezen van een gemeente, knelpunt of situatie op de homepage gebeurt zichtbaar niets. "Toon mijn overzicht" staat 3 à 4 schermen lager. Op het overzicht staat het formulier opnieuw bovenaan, en het antwoord komt pas op scherm 3 à 4. *(ernst 2–3; Sanne, Anouk, Joyce, Henk, Mark)*
3. **Vaktaal zonder uitleg.** Beschikking, cliëntondersteuner, wijkteam/toegangsteam, medische route, diagnostiek, jeugd-GGZ, overbruggingshulp, warme overdracht, gezinsplan, pgb, hoorzitting, ingebrekestelling, CIZ, Wlz, Wmo. *(ernst 2–3; alle 8)*
4. **Informatie staat er wel, maar niet waar de ouder binnenkomt.**
   - Gemeentepagina → "Mijn kind wordt 18" (Peter).
   - Situatie Autisme → dubbele kinderbijslag (Fatima).
   - Overzicht → steunpunt passend onderwijs en voorbeeldbrief, die te laag staan of alleen met een knelpunt verschijnen (Sanne).
   - Verschil klacht/bezwaar alleen op Landelijk (Erik).

   *(ernst 3; 4 persona's)*
5. **Knelpunttekst past niet bij veelvoorkomende varianten.**
   - "Wij wachten te lang" gaat uit van een aanvraag bij de gemeente, niet van een huisartsverwijzing en wachten op een aanbieder (Mark).
   - "Mijn kind wordt 18" geeft geen "wat nu eerst" voor wie nog maar een paar maanden heeft (Peter).

   *(ernst 3; 2 persona's)*
6. **Onbeantwoorde zorg.**
   - Fatima: "moet ik terugbetalen als ik iets fout doe?" staat nergens.
   - Erik: "Stapel niet, begin laag op de ladder" (`/landelijk/#07-klacht-of-bezwaar`) kan een ouder de bezwaartermijn laten missen.

   *(ernst 3)*
7. **Vertrouwen.** Het label "concept" op situatiepagina's (Sanne, Mark) en "voorbeeldgegevens, nog niet geverifieerd" op niet-uitgewerkte gemeenten (Henk) wekken twijfel. *(ernst 1–3)*

## Losse vondsten
- **Tekstfout** "Begin via de via school" (`src/pages/overzicht.astro` r. 67 en 92, combinatie met `routeLabel.school = 'Via school'`).
- **Telefoonnummers in het register verkeerd gegroepeerd** bij viercijferige netnummers. "054 349 3333" moet "0543 49 33 33" zijn. Ongeveer 130 gemeenten in `scripts/data/gemeenten-register.json`. De cijfers zijn goed, de opmaak misleidt. Zichtbaar op gemeentepagina's met status "voorbeeld".
- **Verhuizing:** het overzicht kan maar één gemeente tonen. Joyce miste daardoor het contact in Amsterdam.

## Vergelijking met eerdere runs
De proefronde en de afgebroken run gebruikten driver v1 (hele pagina zichtbaar) en zijn niet goed vergelijkbaar op stappen en scrollen. De inhoudelijke problemen 1 t/m 5 kwamen daar ook al voor; ze zijn dus stabiel over runs heen. Anouk ging van "deels" (v1) naar "niet gehaald" (v2). Met een realistischer beeld is de crisisroute slechter dan gedacht.

## Verbetervoorstellen (nog niet uitgevoerd)
| # | Voorstel | Waar |
|---|---|---|
| 1 | Vaste spoedregel op het eerste scherm van elke pagina: "Nu in nood? 113 (dag en nacht) · of bel uw huisarts". Zonder het alarmnummer. "Het is nu acuut" springt direct naar die nummers. | `Base.astro` of `index.astro`, `SpoedNummers.astro`, `KnelpuntKeuze.astro` |
| 2 | Overzicht: antwoord eerst. "Uw volgende stap" met naam en tikbaar nummer bovenaan, keuzes daaronder of inklapbaar. Na een keuze op de homepage direct naar het overzicht, of een zichtbare bevestiging. | `overzicht.astro`, `index.astro`, keuzecomponenten |
| 3 | Woordenlijst met korte uitleg bij eerste gebruik: beschikking, cliëntondersteuner, toegangsteam, enzovoort. Bijvoorbeeld als `<abbr>`/tooltip, of een "Wat betekent dit?"-link. "Begin via de medische route" wordt "Begin bij de huisarts". | `src/lib/routes.ts`, nieuwe component, CONTENT.md |
| 4 | Kruisverwijzingen: gemeentepagina → knelpunten (vooral "wordt 18" en "acuut"). Situatiepagina's → financiële regelingen. Brieven en "Hulp vragen" ook zonder gekozen knelpunt. | `gemeenten/[slug].astro`, `situaties/[slug].astro`, `overzicht.astro` |
| 5 | Knelpunt "wachten": aparte stappen voor "verwezen door de huisarts, wacht op aanbieder", met daarbij school en thuiszitten. Knelpunt "wordt 18": een kort "als het binnen een half jaar is: doe eerst …". | `knelpunten/wachten.md`, `knelpunten/wordt-18.md` |
| 6 | Klacht of bezwaar: duidelijk zeggen dat de bezwaartermijn doorloopt. Dubbele kinderbijslag: een korte geruststelling over eerlijk invullen, plus een directe SVB-link in de tekst. | `landelijk/07-klacht-of-bezwaar.md`, `landelijk/05-financieel.md` |
| 7 | Tekstfout "via de via school" en de telefoongroepering in het register oplossen. | `overzicht.astro`, `gemeenten-register.json`, scaffold-script |
| 8 | Labels "concept" en "voorbeeld" vriendelijker formuleren, of alleen in de broncontrole tonen. | situatie- en gemeentepagina's |

## Over de testers
- Peter (04) ging over het maximum aantal stappen. Bevindingen na stap 25 tellen niet mee. De tester-instructie vraagt nu om hardop te tellen.
- De overige testers bleven in hun rol. De routes in de verslagen komen overeen met de logs.
