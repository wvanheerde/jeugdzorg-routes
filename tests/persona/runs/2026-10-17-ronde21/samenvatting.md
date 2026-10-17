# Samenvatting ronde 21 (2026-10-17)

Alle 15 scenario's op de lokale build van commit cd7d23f (zie `run.md`). Wijzigingen sinds ronde 20: rechten, toegang en "Welke hulp is er?" voor alle 342 gemeenten ingekort en herschreven (16-10), situatie Slaapproblemen met drie therapievormen, favicon. Voorpagina, overzicht en knelpunten zijn niet gewijzigd.

| # | Persona | Uitkomst | Moet vinden | Stappen (r20 → r21) | Gemak | Vertrouwen |
|---|---|---|---|---|---|---|
| 01 | Sanne, beginnen (Emmen) | gehaald | 2 + 1 deels / 4 | 9 → 13 | 6 | 6 |
| 02 | Mark, wachten (Utrecht) | gehaald | 4 / 4 | 8 → 11 | 6 | 5 |
| 03 | Fatima, kinderbijslag | gehaald | 3 + 1 deels / 4 | 12 → 12 | 5 | 5 |
| 04 | Peter, wordt 18 (Apeldoorn) | gehaald | 6 / 6 | 8 → 8 | 6 | 5 |
| 05 | Anouk, spoed (Zwolle) | deels | 1 / 1 | 4 → 4 | 5 | 4 |
| 06 | Erik, bezwaar (Den Haag) | gehaald | 5 / 5 | 9 → 7 | 6 | 6 |
| 07 | Joyce, verhuizen (Almere) | gehaald | 4 + 1 deels / 5 | 12 → 10 | 6 | 5 |
| 08 | Henk, opa (Aalten) | gehaald | 2 + 1 deels / 4 | 10 → 9 | 5 | 5 |
| 09 | Lisa, thuiszitter (Haarlem) | gehaald | 5 / 5 | 12 → 23 | 5 | 6 |
| 10 | Ahmed, scheiding (Tilburg) | gehaald | 3 + 1 deels / 4 | 7 → 6 | 6 | 6 |
| 11 | Ingrid, pgb (Groningen) | gehaald | 4 / 4 | 7 → 8 | 6 | 5 |
| 12 | Kees, geen besluit (Eindhoven) | gehaald | 4 / 4 | 8 → 12 | 6 | 6 |
| 13 | Naima, hulp werkt niet (Leeuwarden) | gehaald | 3 / 4 | 22 → 19 | 5 | 5 |
| 14 | Rob, hoe gaat het (Arnhem) | deels | 5 / 5 | 20 → 9 | 6 | 5 |
| 15 | Monique, zorgen (Lelystad) | gehaald | 2 / 2 | 6 → 6 | 6 | 6 |

**13 van 15 gehaald volgens de persona's (gelijk aan r18–r20); op de criteria vonden alle 15 het belangrijkste.** Gemak gemiddeld 5,7 (r20: 5,7), vertrouwen 5,3 (r20: 5,5). Stappen gemiddeld 10,5 (r20: 10,3). Moet vinden: 53 + 5 deels van 61 (r20: 53 + 6 deels). Geen overtredingen van "mag niet".

## Verloop

| Ronde | Gehaald | Gemak | Vertrouwen | Stappen gem. |
|---|---|---|---|---|
| 17 | 15 / 15 | 5,6 | 5,7 | – |
| 18 | 13 / 15 | 5,5 | 5,5 | – |
| 19 | 13 / 15 | 5,3 | 5,6 | 11,2 |
| 20 | 13 / 15 | 5,7 | 5,5 | 10,3 |
| 21 | 13 / 15 | 5,7 | 5,3 | 10,5 |

## Wat het inkorten opleverde of kostte
- **Geen achteruitgang op vindbaarheid.** Elke contactpersoon en elk nummer uit de criteria werd gevonden, behalve het Amsterdamse team bij Joyce (dat stond er in r20 ook niet).
- **Sneller bij het antwoord:** Sanne zag het nummer van De Toegang nu direct bovenaan (r20: na 2 keer scrollen). Rob ging van 20 naar 9 stappen: de uitklapper "Hoe lang duurt het?" en "Hoe gaat het in Arnhem?" brachten hem direct bij het antwoord. Erik had het antwoord bij stap 3.
- **Meer stappen bij Lisa (12 → 23), Kees (8 → 12), Mark en Sanne:** niet door zoeken, maar doordat ze verder lazen (brieven, rechten, uitklappers) nadat ze het antwoord al hadden. Lisa zocht een brief die bij thuiszitten past en die is er niet.
- **Vertrouwen iets lager (5,5 → 5,3):** vooral Naima en Henk (6 → 5). Bij Henk komt dat door een bug op de voorpagina (zie punt 2); bij Naima door de onduidelijkheid of ze EMDR zelf aan de hulpverlener mag vragen.
- **Lokale tekst wordt goed gewaardeerd:** "Vindt u de stap spannend? Dat is begrijpelijk" (Sanne), "Dan begint juist de zorgplicht" (Lisa), "De hulp mag niet zomaar stoppen" (Joyce), de voorbeeldzin bij "De hulp werkt niet" (Naima). Geen enkele persona voelde zich beoordeeld.

## Terugkerende problemen (op ernst, dan aantal persona's)
1. **Spoed zonder nummer van de huisartsenpost** (Anouk, ernst 3, derde ronde op rij). `SpoedNummers.astro` is ongewijzigd. Ze koos geen gemeente, dus ook een gemeentelijk crisisnummer had haar niet bereikt. Daarbij komt dat het antwoord in een lange eerste bullet staat en dat ze na "Het kan niet wachten" nog naar "Toon mijn overzicht" moet.
2. **Bug op de voorpagina: na een vraagknop valt de leeftijdsrij achter de vaste kopbalk** (Henk, Ahmed; ernst 2). Zelf gemeten op desktop (1366×800). Na de vraagknop scrolt `Wegwijzer.astro` r65 de rij "Wat speelt er bij uw kind?" naar boven (`block: 'start'`). De leeftijdsknoppen staan dan op y 46–82, onder de kopbalk van 82 px. Wie een leeftijd kiest, scrolt omhoog en verliest de situatierij uit beeld. Henk kon daardoor "Angst" niet kiezen en kreeg een overzicht zonder angst- of schooldeel; Ahmed kon "Slaapproblemen" niet kiezen. Ook op mobiel staat de leeftijdsrij na het scrollen onder de kop (y = 2). De testtool versterkt het effect (Playwright scrolt het afgedekte element in beeld), maar ook een echte bezoeker ziet de leeftijdsvraag na het automatische scrollen niet.
3. **Het kernantwoord staat diep of tussen veel bullets, zonder volgorde** (ernst 2; Mark, Peter, Ahmed, Naima, Monique, Kees, Anouk; 7 persona's). Mark: "zes acties zonder volgorde". Peter: "geen termijnen in maanden". Monique: nummer op het derde scherm. Naima: EMDR op scherm 14–16 van 27.
4. **Ontbrekende contactgegevens bij een stap** (ernst 2; Joyce: Amsterdams team, Kees: e-mailadres van het wijkteam, Peter: CIZ en kantonrechter, Ingrid: tarieven en welk WIJ-team; 4 persona's).
5. **De startknoppen dekken de vraag niet** (ernst 2; Lisa: thuiszitten, Henk: angstig en wil niet naar school; 2 persona's, ook in r20).
6. **Moeilijke woorden niet in de zin uitgelegd** (ernst 1–2; Fatima: Wlz-indicatie, declareert, oppassing; Peter: CIZ, curatele; Ahmed: vervangende toestemming, toevoeging; Naima: verwijzer, zorgstandaard; Lisa: handelingsdeel, onderwijs-zorgarrangement; Erik: kenmerk, hoorzitting; Ingrid: zorgovereenkomst, SVB; Rob: keukentafelgesprek; Henk: Beschikbaarheidswijzer, intern begeleider; 9 persona's).
7. **Kijken naar de knelpunt-tekst zelf:**
   - Mark: welke punten gelden bij een verwijzing door de huisarts en welke bij een aanvraag bij de gemeente?
   - Ingrid: "vraag eerst jeugdhulp aan" past niet als je al een toewijzing hebt.
   - Erik: wat gebeurt er na het bezwaar?
   - Monique: de zin "liever dat het gezin weet wie meldde" schrikt af bij een vraag om advies.
8. **Wachttijd en ouderervaringen ontbreken** (Rob ernst 2, Mark, Sanne). Inhoudelijk gat, eerlijk benoemd. De uitklapper "Hoe lang duurt het?" gaat bij Almere over raadsrapportages (Joyce) en bij Utrecht alleen over het buurtteam (Mark).
9. **Geen brief voor thuiszitten** (Lisa, ernst 2–3). De brief "gesprek met school en OPP" past bij een kind dat nog op school zit.
10. **Jeugdstem niet opgepikt bij "De hulp werkt niet"** (Naima, derde ronde op rij).

## Onjuistheden en tekstfouten
- `src/pages/gemeenten/[slug].astro` r185: "Wachttijden bij aanbieders en aantallen klachten publiceert geen enkele gemeente." Dit is een absolute bewering zonder bron, en de Arnhem-pagina noemt zelf 58 klachten in 2025.
- Restanten van de vervanging "consulent → medewerker jeugd": `almere.json` r101 "uw jeugd- en medewerker jeugd" (Joyce las het) en `wijdemeren.json` r426 "het team van de Wmo- en medewerkers jeugd".

## Vergelijking met ronde 20
- **Beter:** Rob (20 → 9 stappen, gemak 5 → 6), Sanne (nummer direct bovenaan), Mark en Joyce (gemak 5 → 6). De ernst 3 bij Joyce kwam niet terug, maar dat komt doordat ze nu de nieuwe gemeente koos; de oorzaak is niet opgelost.
- **Gelijk:** 13/15 gehaald, gemak 5,7, moet vinden 53 van 61. Anouk krijgt exact dezelfde uitkomst.
- **Slechter:** vertrouwen 5,5 → 5,3. Henk en Naima scoren lager. De bug op de voorpagina viel deze ronde voor het eerst op; de code is sinds r20 niet gewijzigd, dus de fout zat er waarschijnlijk al.
- **Conclusie:** het inkorten heeft de vindbaarheid niet geschaad en het eerste antwoord vaak dichterbij gebracht. De resterende winst zit in de voorpagina en de opbouw van het overzicht, niet in de gemeentetekst.

## Vertrouwen in de agents
Alle 15 bleven in hun rol. Joyce koos zelf de nieuwe gemeente; dat is een redelijke keuze voor een echte ouder, maar niet afgedwongen door de site. Henk en Ahmed rapporteerden "de knoppen verdwenen". Dat is nagemeten en klopt deels (zie punt 2).

## Verbetervoorstellen
1. **Voorpagina-bug** — `src/components/Wegwijzer.astro` r65: scroll naar de leeftijdsrij in plaats van naar de situatierij, of geef de doelrij `scroll-margin-top` gelijk aan de kophoogte (`--kop-hoogte`), zodat leeftijd en situaties allebei in beeld blijven.
2. **Spoed** — `src/components/SpoedNummers.astro`, `src/content/knelpunten/spoed.md`:
   - de knop "Het kan niet wachten" direct naar het spoedblok laten gaan, zonder "Toon mijn overzicht";
   - als eerste regel kort en vet: "Huisarts dicht? Bel het nummer van uw huisarts: u hoort dan het nummer van de huisartsenpost";
   - een woonplaats- of postcodeveld dat de huisartsenpost van de regio toont (dat moet als data worden toegevoegd);
   - een paar zinnen over wat u nu kunt doen (bij uw kind blijven, rustig ademen).
3. **"Doe dit eerst" bovenaan het overzicht** — `src/pages/overzicht.astro` en de knelpunten:
   - 2–3 genummerde acties met nummer;
   - bij "wordt 18" een tijdlijn (nu / 3 maanden voor / rond de verjaardag);
   - bij "wachten" scheiden wat geldt bij een verwijzing door de huisarts en wat bij een aanvraag bij de gemeente;
   - bij "zorgen om een kind van een ander" het nummer van Veilig Thuis bovenaan.
4. **Verhuizen: beide gemeenten** — `verhuizing.md`, `overzicht.astro`, `gemeente-blokken/[slug].astro`: vraag ook de andere gemeente en toon beide teams (open sinds r19).
5. **Startknoppen** — `KnelpuntKeuze.astro`/knelpunten: een korte toelichting onder elke knop, of synoniemen ("mijn kind zit thuis", "wil niet naar school", "gemeente beslist niet").
6. **Contact bij elke stap** — e-mailadres van het wijkteam in de gemeentedata waar het openbaar is (Kees); CIZ en Juridisch Loket/kantonrechter met link bij "wordt 18"; het oude team bij verhuizen.
7. **Knelpunt-teksten** —
   - `pgb.md`: een regel voor wie al een toewijzing heeft;
   - `afgewezen.md`: "Wat gebeurt er na het bezwaar?";
   - `zorgen-om-kind.md`: de zin over "wie meldde" naar het deel over melden;
   - `verkeerde-hulp.md`: Jeugdstem als hulp bij het gesprek;
   - `therapievormen/[slug].astro`: "U mag dit ook aan uw huidige hulpverlener vragen".
8. **Brief voor thuiszitters** — `src/content/brieven/`: een brief aan school en samenwerkingsverband over zorgplicht en een passende plek, met leerplicht in cc. Of de brief "gezamenlijk overleg" zichtbaar maken bij "School loopt vast".
9. **Dagboek voor dubbele kinderbijslag** — een versie op de pagina of als pdf, naast het Word-bestand (Fatima).
10. **Tekstfouten** — r185 in `gemeenten/[slug].astro` afzwakken ("publiceren gemeenten zelden"); `almere.json` r101 en `wijdemeren.json` r426 herstellen.
