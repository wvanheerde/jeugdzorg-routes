# Samenvatting ronde 18 (2026-10-14)

Alle 15 scenario's draaiden op de lokale build. De wijzigingen sinds ronde 17 staan in `run.md`: CJG/jeugdgezondheidszorg per gemeente, lichte start bij scheiding en hoogbegaafdheid, Direct regelen gefilterd per vraag, therapievormen op volgorde van toepasbaarheid.

| # | Persona | Uitkomst (persona) | Moet vinden | Stappen | Gemak | Vertrouwen |
|---|---|---|---|---|---|---|
| 01 | Sanne, beginnen (Emmen) | gehaald | 2 + 1 deels / 4 | 12 | 5 | 5 |
| 02 | Mark, wachten (Utrecht) | gehaald | 4 / 4 | 10 | 6 | 6 |
| 03 | Fatima, kinderbijslag | gehaald | 3 + 1 deels / 4 | 13 | 5 | 6 |
| 04 | Peter, wordt 18 (Apeldoorn) | gehaald | 6 / 6 | 5 | 6 | 5 |
| 05 | Anouk, spoed (Zwolle) | deels | 1 / 1 | 4 | 5 | 5 |
| 06 | Erik, bezwaar (Den Haag) | gehaald | 5 / 5 | 8 | 6 | 6 |
| 07 | Joyce, verhuizen (Almere) | gehaald | 5 / 5 | 7 | 6 | 6 |
| 08 | Henk, opa (Aalten) | gehaald | 3 + 1 deels / 4 | 9 | 5 | 5 |
| 09 | Lisa, thuiszitter (Haarlem) | gehaald | 5 / 5 | 21 | 5 | 6 |
| 10 | Ahmed, scheiding (Tilburg) | gehaald | 4 / 4 | 7 | 6 | 6 |
| 11 | Ingrid, pgb (Groningen) | gehaald | 4 / 4 | 6 | 6 | 6 |
| 12 | Kees, geen besluit (Eindhoven) | gehaald | 3 + 1 deels / 4 | 10 | 6 | 5 |
| 13 | Naima, hulp werkt niet (Leeuwarden) | gehaald | 3 / 4 | 18 | 5 | 5 |
| 14 | Rob, hoe gaat het hier (Arnhem) | deels | 5 / 5 | 16 | 5 | 4 |
| 15 | Monique, zorgen om kinderen (Lelystad) | gehaald | 2 / 2 | 7 | 6 | 6 |

**Totaal: 13 van 15 gehaald volgens de persona's; op de criteria vonden alle 15 het belangrijkste.** Gemak gemiddeld 5,5, vertrouwen 5,5. Geen overtredingen.

## Verloop

| Ronde | Gehaald | Gemak | Vertrouwen |
|---|---|---|---|
| 16 | 14 / 15 | 5,6 | 5,7 |
| 17 | 15 / 15 | 5,6 | 5,7 |
| 18 | 13 / 15 | 5,5 | 5,5 |

De twee "deels" zijn Anouk (geen nummer van de huisartsenpost; bekend en bewust) en Rob (andere route dan in ronde 17, zie hieronder). Op de criteria vonden beiden alles.

## Terugkerende problemen

1. **"Zoek op woonplaats" wordt aangezien voor de bevestigknop** (5 persona's: Sanne, Lisa, Rob, Monique, en Henk twijfelde). Na het kiezen van een gemeente opent het een leeg invoerveld. Ernst 1–2, maar het komt het vaakst voor. `src/components/GemeenteKeuze.astro`.
2. **Een keuzeknop zonder gemeente lijkt niets te doen** (3: Erik, Ahmed, Joyce). De melding "Kies eerst uw gemeente" staat onderaan of in de balk. Ernst 2. `src/components/Wegwijzer.astro`.
3. **Bij een situatie die bij de huisarts of school begint, staat het wijkteam ver onderaan** (3: Sanne, Henk, Rob). De regel "Liever eerst het wijkteam? … bel …" hoort onder stap 1 te staan, maar komt onder de brieven terecht: in `src/pages/overzicht.astro` wordt `[data-wijkteam-regel]` niet verplaatst (alleen de wijkteamkaart en "Hierbij handig"). Gevolg bij Rob: de uitklapper "Hoe lang duurt het in Arnhem?" zit in de wijkteamkaart en verschijnt dan helemaal niet. Ernst 2–3.
4. **Moeilijke woorden zonder uitleg ter plekke** (Fatima: CIZ, Wlz; Naima: verwijzer; Henk/Sanne: cliëntondersteuner, beschikking). Ernst 2.
5. **Wat er ná een stap gebeurt, blijft vaag** (Peter: termijnen; Kees: dwangsom en beroep; Ahmed: vervangende toestemming aanvragen). Ernst 2.

## Vergelijking met ronde 17

- **Gelijk of beter:** Mark (11→10 stappen), Peter (7→5), Erik (12→8), Joyce (11→7), Kees (13→10), Naima (19→18). Joyce vond onderaan nog "veel tekst over klachten" (bij verhuizen hoort klacht bij de onderdelen).
- **Slechter:** Lisa (15→21 stappen; uitstap naar brieven, inhoud volledig gevonden), Rob (12→16, "deels"; andere startkeuze legt gat 3 bloot), Monique (4→7; per ongeluk "Zoek op woonplaats").
- **Niet getest:** de nieuwe lichte start bij scheiding (Ahmed koos het knelpunt "Wij zijn gescheiden") en bij hoogbegaafdheid (Lisa koos eerst "School loopt vast"). Het CJG-blok kwam in deze run bij geen persona in beeld.
- **Therapievolgorde:** Naima vond EMDR nu op plek 3 bij trauma (was alfabetisch plek 4); geen zichtbaar verschil in stappen.

## Verbetervoorstellen

1. `src/pages/overzicht.astro`: `[data-wijkteam-regel]` na `.stap-een` plaatsen (zoals de wijkteamkaart), en de uitklapper "Hoe lang duurt het in …?" ook in die regel tonen.
2. `src/components/GemeenteKeuze.astro`: "Zoek op woonplaats" verbergen of als tekstlink tonen zodra een gemeente gekozen is.
3. `src/components/Wegwijzer.astro`: bij een klik op een keuzeknop zonder gemeente direct naar de gemeentekeuze scrollen (zoals de balkknop al doet).
4. Scenario toevoegen voor de lichte start bij scheiding via de situatie (niet het knelpunt), zodat het CJG-blok getest wordt. Wijziging in `tests/persona/scenarios/` met regel in `README.md`.
5. Kleiner: wie het verslag voor de dubbele kinderbijslag kan geven (`src/content/landelijk/05-financieel.md`), "verwijzer" uitleggen op therapiepagina's, vervolg na ingebrekestelling (`src/content/brieven/ingebrekestelling.md`).
