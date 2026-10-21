# Samenvatting ronde 27 (2026-10-21)

Alle 20 scenario's op de lokale build van 21-10 (zie `run.md`). Nieuw sinds ronde 25/26: *Toon mijn overzicht* schuift na een keuze net in beeld, en de link bij het gezagsregister heet "Uittreksel aanvragen". Tijdens de ronde is één fout in dat schuiven hersteld (na Monique, 15); 16–20 draaiden op de herstelde build. Scores 1–10.

| # | Persona | Uitkomst (r25 → r27) | Moet vinden | Stappen (r25 → r27) | Gemak | Vertrouwen |
|---|---|---|---|---|---|---|
| 01 | Sanne, beginnen | gehaald | 2 / 4 | 9 → 8 | 8 | 8 |
| 02 | Mark, wachten | gehaald | 4 / 4 | 8 → 7 | 8 | 7 |
| 03 | Fatima, kinderbijslag | gehaald | 3 + 1 deels / 4 | 11 → 15 | 7 | 8 |
| 04 | Peter, wordt 18 | gehaald | 6 / 6 | 11 → 6 | 8 | 8 |
| 05 | Anouk, spoed | gehaald → **deels** | 1 / 1 | 4 → 4 | 7 | 5 |
| 06 | Erik, bezwaar | gehaald | 5 / 5 | 13 → 13 | 8 | 8 |
| 07 | Joyce, verhuizen | gehaald | 4 + 1 deels / 5 | 11 → 14 | 7 | 6 |
| 08 | Henk, opa | gehaald | 3 + 1 deels / 4 | 11 → 10 | 8 | 8 |
| 09 | Lisa, thuiszitter | gehaald | 4 + 1 deels / 5 | 17 → 14 | 8 | 8 |
| 10 | Ahmed, scheiding | gehaald | 4 / 4 | 9 → 9 | 8 | 8 |
| 11 | Ingrid, pgb | gehaald | 4 / 4 | 7 → 8 | 8 | 8 |
| 12 | Kees, geen besluit | gehaald | 3 + 1 deels / 4 | 12 → 10 | 8 | 8 |
| 13 | Naima, hulp werkt niet | gehaald | 3 / 4 | 23 → 19 | 8 | 8 |
| 14 | Rob, hoe gaat het | gehaald → **deels** | 5 / 5 | 9 → 11 | 8 | 6 |
| 15 | Monique, kind van een ander | gehaald | 2 / 2 | 7 → 8 | 8 | 9 |
| 16 | Bas, aanbieder stopt | gehaald | 4 / 5 | 10 → 10 | 8 | 8 |
| 17 | Mark, klacht aanbieder | gehaald | 4 / 4 | 11 → 11 | 8 | 8 |
| 18 | Sanne, klacht wijkteam | gehaald | 4 / 4 | 16 → 20 | 7 | 8 |
| 19 | Linda, gezag onbekend | niet gehaald → **gehaald** | 4 / 4 | 20 → 10 | 8 | 8 |
| 20 | Yvonne, uitbreiden | gehaald | 4 / 4 | 12 → 10 | 8 | 8 |

**18 van 20 gehaald** volgens de persona's (r25: 19). Moet vinden 73 + 5 deels van 82 (r25: 73 + 4). Gemak gemiddeld 7,8, vertrouwen 7,7 (r25: 7,6 en 7,7). Stappen gemiddeld 10,9 (r25: 11,6). Geen overtredingen.

De twee "deels" (Anouk, Rob) vonden alles wat ze moesten vinden; ze misten iets wat de site bewust niet geeft (een nummer van de huisartsenpost; een wachttijd voor Arnhem zonder bron). De pagina's zijn sinds r25 niet veranderd; in r25 noemden dezelfde persona's dit wel, maar woog het lichter. Zie de beoordelingen.

## Wat beter werkt
- **Linda (gezag):** van "niet gehaald" in r25 naar gehaald in 10 stappen; de ingeklapte vraag "Woont u niet samen met de andere ouder?" sprak haar direct aan.
- **"Toon mijn overzicht" in beeld:** in r25 en r26 klaagden zes persona's dat de knop onder de situaties uit beeld stond. Nu niemand meer van hen (Sanne: "knop Toon mijn overzicht verschenen"; Henk, Peter en Bas klikten meteen door).
- **Minder stappen** bij Peter (11 → 6), Linda, Lisa, Naima en Yvonne.

## Terugkerende problemen
1. **Schuiven na de onderste keuze op de telefoon (ernst 2; Monique).** De knop stond boven het scherm. Een fout in het nieuwe schuiven; **tijdens de ronde hersteld** met scenario. Peter (ernst 1) miste na zijn klik een zichtbare bevestiging: de gekozen situatie schuift omhoog als de knop in beeld komt.
2. **Welk vlak past? (ernst 1–2; Kees, Ingrid, Sanne-klacht, Yvonne).** Kees wacht op een besluit en heeft nog geen hulp, maar moest "Er is al hulp, maar…" kiezen voor "Wij wachten te lang". Ingrid zocht pgb eerst onder "Er is al hulp". Sanne zag het woord "klacht" nergens. Yvonne twijfelde tussen uitbreiden en stoppen.
3. **Lange overzichten, belangrijke link laag (ernst 2; Fatima, Lisa, Mark-klacht, Sanne-klacht, Naima, Yvonne, Peter).** De link "wat u opschrijft" (Fatima), de klachtbrief (Mark, Sanne), EMDR (Naima) en de knop "Het besluit loopt af" (Yvonne) staan laag. Bekend uit eerdere rondes.
4. **"Uw keuzes" noemt de vraag, niet het vlak (ernst 1; Henk, Lisa).** Zij kozen "Ik zoek hulp voor mijn kind" en lazen "Ik wil hulp aanvragen".
5. **Inhoud (ernst 2, één persona elk):** "JGZ Almere" als toegang zonder uitleg (Joyce); de brief over school gaat niet over thuiszitten (Lisa); wat te doen als er al begeleiding is toegewezen bij een pgb (Ingrid); een korte conclusie bovenaan het gezagblok (Linda).

## Voorstellen
1. **Vlakken aanvullen** (`src/content/knelpunten/*.md`, `startgroepen`; `src/lib/startvragen.ts`, uitleg bij de vlakken):
   - "Wij wachten te lang" ook onder "Ik zoek hulp voor mijn kind" (Kees).
   - "Ik wil een pgb" ook onder "Er is al hulp, maar…" (Ingrid).
   - In de uitleg bij "Er is al hulp, maar…" het woord klacht: bijvoorbeeld *"Het duurt te lang, het loopt vast, het is te weinig, het stopt of u wilt een klacht indienen."* (Sanne).
2. **"Uw keuzes" met de woorden van de voorpagina** (`src/scripts/overzicht/render.ts`): bij "Ik zoek hulp voor mijn kind" niet "Ik wil hulp aanvragen" tonen (Henk, Lisa).
3. **Gezag: één zin conclusie bovenaan** de uitleg na "Weet ik niet" (`VerdiepingGescheiden.astro`): *"Niet getrouwd en erkend vóór 2023? Dan heeft u waarschijnlijk alleen het gezag en beslist u zelf. Zeker weten: vraag een uittreksel aan."* (Linda).
4. **Inhoud nakijken:** Almere (waarom JGZ de toegang is), de brief `gesprek-school-opp` (een zin voor een kind dat thuiszit), Arnhem (bij het cijfer 8,0 zeggen dat het over de wijkteams gaat).
5. **Fatima:** de link "wat u opschrijft en hoe u aanvraagt" in stap 1 zelf zetten in plaats van "via de link onder deze stappen" (`src/content/knelpunten/geld.md`).

Niet voorgesteld: een nummer van de huisartsenpost bij spoed (spoed blijft landelijk, afspraak van 17-10) en een wachttijd zonder bron.
