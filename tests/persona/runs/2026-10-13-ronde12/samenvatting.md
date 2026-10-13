# Samenvatting ronde 12 (2026-10-13): na voorstel 1, 2 en 3

Alle 15 scenario's, lokale build. Sinds ronde 10/11 veranderd:
1. De zwevende knop "Toon mijn overzicht" verschijnt pas na een vraag of situatie; onder de gemeentekeuze staat een aanwijzing.
2. Contactkaart "Hier meldt u zich in [gemeente]" bovenaan het overzicht en de gemeentepagina, met de zin "Dit is het wijkteam van …".
3. Drie nieuwe vragen: *Ik maak me zorgen om een kind van een ander*, *Ik wil een pgb*, *Wij zijn gescheiden en het loopt vast*.
Daarnaast zijn de bedragen uit 21 gemeentepagina's gehaald.

## Uitkomsten: ronde 10/11 → ronde 12

| # | Persona | Uitkomst | Stappen | Gemak | Vertrouwen |
|---|---|---|---|---|---|
| 01 | Sanne, beginnen (Emmen) | gehaald → gehaald | 8 → 11 | 6 → 6 | 6 → 5 |
| 02 | Mark, wachten (Utrecht) | gehaald → gehaald | 10 → **7** | 6 → 5 | 5 → 4 |
| 03 | Fatima, kinderbijslag | gehaald → gehaald | 11 → 10 | 5 → **6** | 6 → 6 |
| 04 | Peter, wordt 18 (Apeldoorn) | gehaald → gehaald | 6 → 6 | 5 → **6** | 5 → 5 |
| 05 | Anouk, spoed (Zwolle) | deels* → **gehaald** | 3 → 4 | 4 → **5** | 4 → **5** |
| 06 | Erik, bezwaar (Den Haag) | gehaald → gehaald | 8 → 8 | 6 → 6 | 6 → 6 |
| 07 | Joyce, verhuizen (Almere) | gehaald → gehaald | 19 → **14** | 4 → **5** | 5 → 5 |
| 08 | Henk, opa (Aalten) | gehaald → gehaald | 15 → **7** | 5 → **6** | 6 → 6 |
| 09 | Lisa, thuiszitter (Haarlem) | gehaald, omweg → gehaald, omweg | 19 → 23 | 5 → 5 | 6 → 6 |
| 10 | Ahmed, scheiding (Tilburg) | deels → deels | 20 → **14** | 3 → **4** | 3 → **4** |
| 11 | Ingrid, pgb (Groningen) | deels → **gehaald** | 21 → **9** | 4 → **6** | 5 → 5 |
| 12 | Kees, geen besluit (Eindhoven) | gehaald → gehaald | 9 → 9 | 6 → 6 | 6 → 5 |
| 13 | Naima, hulp werkt niet (Leeuwarden) | deels → **gehaald** | 25 → 21 | 4 → 4 | 4 → **5** |
| 14 | Rob, hoe gaat het hier (Arnhem) | deels* → deels* | 9 → 9 | 5 → 5 | 4 → 4 |
| 15 | Monique, zorgen om kinderen (Lelystad) | deels → **gehaald** | 13 → **4** | 3 → **6** | 4 → **6** |

**Totaal: 13 van 15 gehaald (was 9).** Gemiddeld gemak 5,5 (was 4,7), vertrouwen 5,1 (was 5,0).

## Wat de aanpassingen deden

- **Nieuwe vragen werken.** Monique vond Veilig Thuis in 4 stappen (was 13), met "anoniem" en "advies is geen melding" in beeld. Ingrid had de pgb-stappen in 9 stappen (was 21). Ahmed kwam sneller bij het antwoord over gezag (14 stappen, was 20).
- **Contactkaart bovenaan werkt.** Henk had het team en de eerste stap in 7 stappen (was 15) en begreep dankzij de zin "Dit is het wijkteam van Aalten" wat een wijkteam is. Joyce vond JGZ Almere sneller.
- **Zwevende knop:** niemand klikte meer door naar een leeg overzicht na alleen een gemeente. Wel kozen Ahmed en Joyce een vraag zonder gemeente; het overzicht vraagt dan pas onderaan om een gemeente.

## Wat nog niet goed gaat

1. **Situaties op de voorpagina blijven onzichtbaar** (Lisa, Henk, Rob). Wie een vraagknop kiest, ziet de situaties eronder ("School loopt vast", "Angst of somberheid") niet. Lisa kwam weer via het menu bij *School loopt vast* (23 stappen).
2. **Overzicht zonder gemeente** (Ahmed, Joyce, Monique): de gemeentekeuze zit dan in de dichtgeklapte "Uw keuzes" en onderaan staat alleen "Kies uw gemeente…". Bij *zorgen om een kind van een ander* is die regel overbodig.
3. **Contactkaart past niet bij elke vraag** (Erik): bij *Hulp is afgewezen* stuurt de kaart naar het wijkteam, terwijl bezwaar bij de gemeente loopt. Bij afwijzing, bezwaar en klacht hoort bovenaan het bezwaar- of klachtadres.
4. **Ahmed: "wat mag ik alleen?"** blijft onbeantwoord; de alinea over gezag staat bijna drie keer herhaald (knelpunt, situatie, landelijk).
5. **Naima: het overzicht bij "De hulp werkt niet" noemt geen therapievormen** en leest als een klachtenroute.
6. **Inhoud die ontbreekt:** dyslexie per gemeente (Rob), leerplicht en onderwijsconsulent (Lisa), postadres van de gemeente voor ingebrekestelling en bezwaar (Kees, Erik), Juridisch Loket met nummer in het overzicht (Erik), wie betaalt jeugd-GGZ via de huisarts (Mark), 18-lijst met termijnen en Wmo-loket (Peter), wat er gebeurt met lopende hulp als u overstapt op een pgb (Ingrid).

## Voorstellen voor de volgende stap

| # | Voorstel | Lost op | Waar |
|---|---|---|---|
| A | Situaties direct onder "Waar woont u?" of als tweede vraag ("Wat speelt er bij uw kind?") vóór de vraagknoppen; of na een vraagknop automatisch naar de situaties scrollen. | 1 | `Wegwijzer.astro` |
| B | Overzicht zonder gemeente: bovenaan een open keuzeveld "In welke gemeente woont u?" (niet in de dichtgeklapte keuzes); niet tonen bij landelijke vragen en bij *zorgen om een kind van een ander*. | 2 | `overzicht.astro` |
| C | Contactkaart per vraag: bij afgewezen en bezwaar de bezwaarroute van de gemeente bovenaan; bij klacht het klachtadres; bij wachten de toegang plus "Hoe gaat het hier?" van de gemeente. | 3, Rob | `overzicht.astro`, knelpunten |
| D | Bij *gescheiden*: één blok "Dit kunt u alleen doen" bovenaan (gesprek wijkteam, huisarts, school, advies Juridisch Loket); de gezagsuitleg één keer. | 4 | `knelpunten/gescheiden.md`, `situaties/scheiding.md` |
| E | Bij *De hulp werkt niet* met een situatie: korte kaarten van de passende therapievormen, en een voorbeeldzin om om andere hulp te vragen zonder te klagen. | 5 | `overzicht.astro`, `knelpunten/verkeerde-hulp.md` |
| F | Kleinere inhoud: postadres in het schema per gemeente; Juridisch Loket als contact in het overzicht; leerplicht/onderwijsconsulent op *School loopt vast*; 18-lijst met termijnen. | 6 | schema, content |
