# Samenvatting ronde 23 (2026-10-17)

Alle 15 scenario's op de lokale build van 17-10 middag (zie `run.md`): termijnenhulp, vervolgstappen (A, B, C), wachten zonder wijkteamblok bovenaan, aanbiederslink onder de stap, nieuwe klachtbrief voor de aanbieder.

| # | Persona | Uitkomst | Moet vinden | Stappen (r22 → r23) | Gemak | Vertrouwen |
|---|---|---|---|---|---|---|
| 01 | Sanne, beginnen (Emmen) | gehaald | 2 + 1 deels / 4 | 9 → 13 | 6 | 6 |
| 02 | Mark, wachten (Utrecht) | gehaald | 4 / 4 | 11 → 16 | 5 | 5 |
| 03 | Fatima, kinderbijslag | gehaald | **4 / 4** (r22: 3 + 1 deels) | 18 → 16 | 5 | 5 |
| 04 | Peter, wordt 18 (Apeldoorn) | gehaald | 6 / 6 | 6 → 6 | 6 | 5 |
| 05 | Anouk, spoed (Zwolle) | deels (r22: gehaald) | 1 / 1 | 5 → 5 | 4 | 4 |
| 06 | Erik, bezwaar (Den Haag) | gehaald | 5 / 5 | 6 → 9 | 6 | 6 |
| 07 | Joyce, verhuizen (Almere) | gehaald | 5 / 5 | 14 → 12 | 4 | 5 |
| 08 | Henk, opa (Aalten) | gehaald | 3 + 1 deels / 4 | 11 → 14 | 5 | 5 |
| 09 | Lisa, thuiszitter (Haarlem) | gehaald | 5 / 5 | 18 → 14 | 5 | 6 |
| 10 | Ahmed, scheiding (Tilburg) | gehaald | **4 / 4** (r22: 3 + 1 deels) | 10 → 10 | 5 | 6 |
| 11 | Ingrid, pgb (Groningen) | gehaald | 4 / 4 | 12 → 5 | 6 | 5 |
| 12 | Kees, geen besluit (Eindhoven) | gehaald | 4 / 4 | 10 → 6 | **7** | 6 |
| 13 | Naima, hulp werkt niet (Leeuwarden) | deels (r22: gehaald) | 3 / 4 | 25 → 25 | 4 | 5 |
| 14 | Rob, hoe gaat het (Arnhem) | gehaald (r22: deels) | 5 / 5 | 8 → 18 | 5 | 5 |
| 15 | Monique, zorgen (Lelystad) | gehaald | 2 / 2 | 5 → 6 | 6 | 6 |

**13 van 15 gehaald (r22: 14).** Moet vinden: **57 + 2 deels van 61** (r22: 55 + 5), het hoogste tot nu toe. Gemak gemiddeld 5,3 (r22: 5,5), vertrouwen 5,3 (r22: 5,4). Stappen gemiddeld 11,7 (r22: 11,2). Geen overtredingen.

## Verloop

| Ronde | Gehaald | Moet vinden | Gemak | Vertrouwen | Stappen gem. |
|---|---|---|---|---|---|
| 20 | 13 / 15 | 53 + 6 | 5,7 | 5,5 | 10,3 |
| 21 | 13 / 15 | 53 + 5 | 5,7 | 5,3 | 10,5 |
| 22 | 14 / 15 | 55 + 5 | 5,5 | 5,4 | 11,2 |
| 23 | 13 / 15 | 57 + 2 | 5,3 | 5,3 | 11,7 |

## Wat de wijzigingen opleverden
- **Rekenhulp:** Erik gebruikte hem uit zichzelf en kreeg de juiste datum (16 november, nog 30 dagen); zijn r22-klacht "zelf uitrekenen" is weg. Kees opende hem niet, maar kwam toch in 6 stappen met gemak 7 (hoogste score ooit).
- **Vervolgstappen bij wachten:** Kees vond de ingebrekestelling direct als 1A, met "zonder advocaat" en het Juridisch Loket uit 1B. Mark herkende stap 2 als "raak", maar vindt nog steeds dat de eerste punten (gemeentebesluit) niet over hem gaan.
- **Vervolgstappen bij de hulp werkt niet en zorgen om een kind:** de voorbeeldzin staat nu als 1A direct onder "vraag om een gesprek" (Naima: "voel me gesteund"). Bij Monique staat het meldingsstuk nu onder het advies; de zin "liever dat het gezin weet wie meldde" schrikt nog steeds af.
- **Nieuwe klachtbrief voor de aanbieder:** Mark noemde "klacht bij de aanbieder, met voorbeeldbrief". Lisa vond de brief "gezamenlijk overleg" ("precies wat ik wil").
- **Inhoud:** Fatima vond nu dat een Wlz-indicatie niet nodig is, en Ahmed vond KIES. Beide scoorden daardoor volledig.

## Wat slechter ging
- **Rob (ernst 3, door een wijziging van vandaag):** hij koos "Wij wachten te lang". Doordat het wijkteamblok daar niet meer bovenaan staat, zijn ook "Hoe lang duurt het in Arnhem?" en "Hoe gaat het in Arnhem?" verdwenen. Hij zocht 13 stappen en opende toen zelf de gemeentepagina (8 → 18 stappen).
- **Joyce (ernst 3, open sinds r19):** ze koos de huidige gemeente en kreeg "Nieuwe gemeente Amsterdam"; gemak 6 → 4.
- **Naima (ernst 3, open sinds r19):** EMDR nog steeds op scherm ~15; Jeugdstem deze keer niet opgepikt.
- **Anouk:** zelfde route en inhoud als r22, uitkomst nu "deels". Variatie van de agent; de spoedroute is bewust niet veranderd.

## Fout in de site gevonden
- **Woordenlijst markeert tekst voor schermlezers** (Henk). In de legenda van de hulpsoorten staat tekst die alleen voor schermlezers is (`.sr-only`). De woordenlijst maakte daar een onzichtbare uitlegknop "wijkteam" van, buiten beeld. Gevolg: in die sectie telt dat onzichtbare woord als "eerste keer", zodat het zichtbare woord geen uitleg krijgt. Henk probeerde de onzichtbare knop te klikken. Oplossing: `.sr-only` toevoegen aan de lijst `overslaan` in `src/layouts/Base.astro`. Uitgesteld tot na deze ronde.

## Terugkerende problemen (op ernst)
1. **"Hoe gaat het in …?" weg bij wachten** (Rob, ernst 3, nieuw): de link (en eventueel de uitklapper over doorlooptijd) terugzetten, bijvoorbeeld onder stap 1 of onder het knelpunt.
2. **Verhuizen: één gemeente** (Joyce, ernst 3, sinds r19).
3. **EMDR te diep bij "de hulp werkt niet"** (Naima, ernst 3, sinds r19).
4. **Wachten: volgorde** (Mark, ernst 2): zijn geval (verwezen door de huisarts) staat als stap 2. Mogelijk stap 2 vóór stap 1, of beide als gelijke keuze met een tussenkop.
5. **Kinderbijslag: lange landelijke pagina** (Fatima, ernst 2–3).
6. **Wordt 18: tijdlijn en Wmo-loket** (Peter, ernst 2).
7. **Pgb bij een bestaande toewijzing** (Ingrid, ernst 2).
8. **Rekenhulp dichtgeklapt** (Erik, Kees, ernst 1–2): Erik vond hem wel, Kees niet nodig.

## Vertrouwen in de agents
Joyce en Rob pasten zelf de url aan (licht uit de rol); bij beiden wijst dat op een echt gat (tweede gemeente, link naar "Hoe gaat het"). Henk's mislukte klik komt door de site (zie boven).

## Verbetervoorstellen
1. `src/layouts/Base.astro`: `.sr-only` overslaan in de woordenlijst.
2. `src/pages/overzicht.astro` / gemeente-blokken: bij een vraag met `wijkteamBovenaan: false` de regel "Hoe lang duurt het in …? · Hoe gaat het in …?" onder de stappen of het knelpunt tonen.
3. `src/content/knelpunten/wachten.md`: overwegen om "Bent u door de huisarts verwezen …" als stap 1 te zetten en "Wacht u op de gemeente …" (met A en B) als stap 2, of beide gelijkwaardig aankondigen.
4. Bekende open punten (verhuizen, EMDR, kinderbijslag, wordt 18, pgb) blijven geparkeerd volgens de afspraak van 17-10.
