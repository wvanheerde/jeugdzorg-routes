# Samenvatting run 2026-10-18-wachten-r4

| # | Persona | Uitkomst | Stappen (r23 → r1 → r2 → r3 → r4) | Gemak | Vertrouwen |
|---|---|---|---|---|---|
| 02 | Mark, wachten op aanbieder (Utrecht) | gehaald, 4 / 4 | 16 → 12 → 12 → 13 → 10 | 5 → 6 → 6 → 5 → 6 | 5 → 6 → 5 → 5 → 5 |

Mark koos "Een plek bij een aanbieder" en had in 10 stappen vijf acties met telefoonnummers. Hij zag de klachtstap ("klacht bij de aanbieder, met voorbeeldbrief, zo staat op papier hoe lang we wachten") maar opende de brief deze keer niet. De nieuwe klachtbrief is in deze run dus niet getest.

**Problemen**
1. **Leerplicht Utrecht "(014) 030"** (ernst 2): het register schrijft verkorte nummers met haakjes; ook de belknop werkte niet. Opgelost in `src/pages/gemeente-blokken/[slug].astro` (zes gemeenten met 14 0xx, plus de 0800- en 0900-notatie), met scenario in `gemeenten.feature`.
2. Zonder de keuze "Waarop wacht u?" is het advies algemener (ernst 1). Zo bedoeld: de vraag is niet verplicht.
3. Jargon: "handelingsdeel", "ontwikkelingsperspectief" en "overbruggingshulp" hebben wel uitleg (woordenlijst); Mark opende die niet. "artikel 5 onder a" (bij "School loopt vast") heeft geen uitleg.
4. Geen norm voor hoe lang wachten mag (terugkerend). Daar is voor jeugdhulp geen wettelijke norm voor.
