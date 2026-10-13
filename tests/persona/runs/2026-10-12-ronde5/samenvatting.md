# Samenvatting ronde 5 (2026-10-12)

Alle 8 scenario's. Wat er sinds ronde 4 veranderde:
- vaste keuzebalk op Mijn overzicht;
- "Hoe gaat het hier?" en de bronnen zijn ingeklapt op gemeentepagina's;
- de rij "Waar staat u?" is weg van gemeente- en situatiepagina's;
- het blok aanbieders in het overzicht is korter;
- scenario 04 begint op de voorpagina.

Driver v3.

| Scenario | Vorige ronde | Ronde 5 | Stappen | Gemak | Vertrouwen |
|---|---|---|---|---|---|
| 01 Sanne | gehaald (r4) | gehaald | 11 → 9 | 6 → 6 | 6 → 6 |
| 02 Mark | gehaald (r4) | gehaald | 14 → 16 | 6 → 6 | 5 → 5 |
| 03 Fatima | gehaald (r3) | deels* | 13 → 14 | 5 → **4** | 5 → **4** |
| 04 Peter | gehaald (r2, start gemeentepagina) | **gehaald, start voorpagina** | 5 → 6 | 6 → 6 | 5 → 5 |
| 05 Anouk | deels (r3) | deels* | 5–6 → 5 | 4 → 4 | 5 → 5 |
| 06 Erik | gehaald (r4) | gehaald | 10 → 13 | 6 → 6 | 6 → 6 |
| 07 Joyce | gehaald (r4) | **niet** | 13 → 23 | 5 → **3** | 6 → **3** |
| 08 Henk | deels (r4) | deels* | 12 → 16 | 5 → 5 | 4 → 4 |

\*Volgens de criteria (grotendeels) gehaald:
- Fatima mist alleen een antwoord op haar angst om terug te moeten betalen.
- Anouk mist een spoedknop op de voorpagina. Dat is bewust zo gekozen.
- Henk mist lokale gegevens, want Aalten is nog niet onderzocht.

## Belangrijkste bevindingen
1. **Joyce loopt vast: ze vindt het knelpunt "verhuizen" niet meer** (ernst 4). Ze zoekt "verhuizen" en klikt meteen op Situaties. Dat deed ze in 4 van 5 runs. In ronde 2 tot en met 4 bracht de rij "Waar staat u?" (op de gemeentepagina of de Situaties-index) haar terug naar het knelpunt. Die rij is nu weg, en ze vond niets. Alles wat ze nodig heeft staat wel op de site. Oorzaak: op het eerste mobiele scherm van de voorpagina staat alleen "Waar woont u?", en de knelpunten staan daaronder.
2. **Fatima: de financiële uitleg is te zwaar voor A2–B1, en terugbetalen blijft onbeantwoord** (ernst 3, terugkerend sinds de basisronde). Woorden: CIZ, Wlz-indicatie, oppassing, negatief advies. Wat ze moet opschrijven staat verspreid. De zin "Verandert er later iets?" leest ze als een plicht om iets door te geven, niet als geruststelling.
3. **Vaktaal blijft opvallen** (ernst 2, Henk, Peter, Sanne, Erik): wijkteam, curatele, Wmo-melding, hoorzitting, Beschikbaarheidswijzer. Henk zag niet dat hij op het onderstreepte woord kon klikken.

## Wat beter ging
- Peter, nu vanaf de voorpagina: knop "Mijn kind wordt 18", dan Apeldoorn, dan het overzicht. Een volledig lijstje in 6 stappen, alle 6 punten gevonden.
- Sanne, Mark en Erik blijven stabiel op 6/6/6.
- Niemand klaagde over de ingeklapte blokken op de gemeentepagina. Joyce scrolde wel door de lange pagina van Almere.

## Kleinere punten (ernst 2)
- **Brief bezwaar:** onderaan staat "Welke hulpvorm wilt u noemen?", dat zonder gekozen situatie bijna leeg is (Erik). Dit blok past niet bij een bezwaarbrief.
- **Mark:** wie bepaalt de wachttijd bij de jeugd-GGZ, en is er een maximum? En wat te doen als Lotte erger wordt (alleen 113 onderaan)?
- **Peter:** geen volgorde of termijnen ("nu / binnen 2 maanden / vóór 18").
- **Sanne:** niets over kosten. Is jeugdhulp gratis?
- **Henk:** het is niet duidelijk of de extra keuzes op de voorpagina nodig zijn. Hij sloeg ze over en miste school en angst.
- **Termijn bezwaar:** "datum op het besluit" naast "verzenddatum" (ligt al bij de eigenaar).

## Tijdens de run hersteld
Het nieuwe aanbiedersblok zei bij Utrecht "U mag kiezen uit de aanbieders … Lijst met aanbieders bekijken", maar Utrecht heeft geen lijst. Gemeenten zonder Beschikbaarheidswijzer krijgen nu een neutrale tekst: "Welke aanbieders zijn er? … Aanbieders in X bekijken".

## Voorstellen (niet uitgevoerd)
| # | Voorstel | Waar |
|---|---|---|
| 1 | Verhuizen weer vindbaar maken, zonder de rij "Waar staat u?". Opties: (a) op mobiel de knelpuntknoppen hoger op de voorpagina, of één regel onder "Waar woont u?" zoals "Of kies wat er speelt: wachten, verhuizen, 18 worden, afgewezen …"; (b) op de Situaties-index één zin met een link naar de voorpagina: "Gaat het niet om een diagnose maar om iets dat vastloopt? Begin op de voorpagina." | `index.astro`, `situaties/index.astro` |
| 2 | Kinderbijslag in 05-financieel naar A2–B1: een korte checklist "Dit schrijft u op" en een eerlijke zin over terugbetalen in de toon van de site. | `landelijk/05-financieel.md` |
| 3 | Het blok "Welke hulpvorm wilt u noemen?" niet tonen op de bezwaarbrief, of alleen als er een situatie gekozen is. | `brieven/[slug].astro` of het bestand van de brief |
| 4 | Bij "wordt 18" een volgorde in de stappen (nu / binnen een paar maanden / vóór de verjaardag). | `knelpunten/wordt-18.md` |
