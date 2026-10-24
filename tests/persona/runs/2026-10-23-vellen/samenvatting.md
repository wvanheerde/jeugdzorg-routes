# Samenvatting run 2026-10-23-vellen

Eerste run van de scenario's 21–24 voor de vellen om af te drukken (logboek, beschikking nalezen, Dit is mijn kind). Lokale preview, met de wijzigingen van 23-10 (nog niet gecommit). Er is geen vorige run om mee te vergelijken.

| Scenario | Uitkomst | Moet vinden | Stappen | Gemak | Vertrouwen |
|---|---|---|---|---|---|
| 21 Sanne, besluit nalezen (Emmen, mobiel) | gehaald | 2,5 van 3 | 19/20 | 6 | 8 |
| 22 Fatima, besluit begrijpen (Rotterdam, mobiel) | gehaald | 4 van 4 | 22/25 | 5 | 7 |
| 23 Lisa, logboek (Haarlem, desktop) | gehaald | 2,5 van 3 | 11/20 | 8 | 8 |
| 24 Naima, Dit is mijn kind (Leeuwarden, mobiel) | gehaald | 4 van 4 | 11/20 | 8 | 8 |

## Terugkerende problemen
1. **De controlelijst is alleen te vinden via Hulpmiddelen** (Sanne en Fatima, ernst 3). Ouders met een brief in de hand kiezen "Hulp is afgewezen of te weinig" of "De hulp stopt" → "Het besluit loopt af". Daar staat geen link naar `/beschikking/`. De link staat alleen bij aanvragen, uitbreiden en verhuizen.
2. **Geen ingang "ik heb een brief of besluit gekregen"** (Sanne en Fatima, ernst 2–3). Ze moeten eerst een knelpunt, leeftijd en situatie kiezen.
3. **Op /beschikking/ staat het belangrijkste voor wie het eens is onderaan** (Fatima, ernst 2). Bezwaar staat bovenaan, "ruim op tijd melden" onderaan. "Verordening jeugdhulp", "Kenmerk" en "Een bezwaar zet het besluit niet stil" zijn moeilijk (Sanne en Fatima).
4. **Kleinere punten bij de vellen** (ernst 1–2, één persona): geen regel voor de leerplichtambtenaar in het logboek (Lisa); hoe je het vel zonder printer gebruikt (Naima); voorbeeldregels (Lisa, Naima).

## Verbetervoorstellen (niet doorgevoerd, eerst akkoord)
1. `src/lib/stap-props.ts`, `VEL_BIJ_STAP`: de controlelijst ook onder een stap bij "afgewezen" en bij "hulp-stopt" (besluit loopt af). Eerst een scenario in `vellen.feature`.
2. `src/pages/beschikking.astro`: bovenaan één korte regel "Bent u het eens? Schrijf de einddatum op en bewaar de brief. Niet eens? Zie hieronder." Lastige woorden eenvoudiger maken ("kenmerk" → "nummer van de brief"; de zin over "zet niet stil" herschrijven), of opnemen in de begrippenlijst.
3. `src/pages/logboek.astro`: regel "Leerplichtambtenaar" bij "Wie zijn er betrokken?" (school loopt vast); controleren of het vel dan nog past.
4. `src/pages/mijn-kind.astro` en `logboek.astro`: één zin voor wie geen printer heeft (bijvoorbeeld afdrukken bij de bibliotheek, of de hulpverlener vragen het af te drukken). Dat is een tip, geen bron nodig.
5. Een ingang "Ik heb een brief van de gemeente" op de voorpagina is een grotere keuze (voorpagina-route); voorleggen aan de gebruiker.

## Doorgevoerd (23-10, met akkoord)
- Voorstel 1: de link "Het besluit nalezen" staat nu ook bij "Hulp is afgewezen of te weinig" (eerste stap) en bij "De hulp stopt" onder "Loopt het besluit af?". Scenario in `tests/e2e/features/vellen.feature`. Voorstel 5 (ingang op de voorpagina) later.
- Voorstel 2–4 (23-10, met akkoord): op /beschikking/ bovenaan "Bent u het eens…?" met daaronder de weg naar bezwaar, eenvoudiger woorden (nummer van de brief, "geldt het besluit tot de gemeente opnieuw beslist", regels voor jeugdhulp); logboek met regel Leerplichtambtenaar; tip "Geen printer?" op logboek en Dit is mijn kind. Alle vellen blijven 2 A4.
