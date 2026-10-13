# Samenvatting proefronde 2026-10-12

Twee scenario's, om de opzet te controleren. Lokale build op commit 513a7cb, met lokale wijzigingen.

| Scenario | Uitkomst | Moet vinden | Stappen | Gemak | Vertrouwen |
|---|---|---|---|---|---|
| 05-anouk-crisis | deels | 1/1, te laat | 7/8 | 2 | 5 |
| 01-sanne-beginnen | gehaald | 2 + 1 deels / 4 | 14/25 | 4 | 5 |

## Terugkerende problemen
1. **Het overzicht ("Mijn overzicht") begint met de keuzes, niet met het antwoord.** Bij beide persona's stonden eerst de keuzelijst en ongeveer 19 knoppen, en kwam het nummer pas op scherm 3 of later. Na een keuze gebeurt er zichtbaar niets. (2 van 2 persona's; ernst 3)
2. **Geen directe spoedingang op de homepage.** Voor een crisis op de telefoon blokkerend. (ernst 4, 1 persona)
3. **Vaktaal voorop.** "Begin via de medische route", diagnostiek, beschikking. Het eerste wat een ouder leest, is jargon. (2 van 2)
4. **Brieven en de pagina "Hulp vragen" alleen zichtbaar als een knelpunt is gekozen.** Wie alleen een situatie kiest, ziet ze niet. (1 persona, vindbaarheid)

## Losse vondst (niet uit een persona)
- Tekstfout in het overzicht: "Begin via de **via school**." `src/pages/overzicht.astro` regel 67 en 92 zetten "Begin via de" vóór `routeLabel`, en het label voor school is al "Via school". Dat geeft dus "via de via school".

## Verbetervoorstellen (nog niet uitgevoerd)
- Overzicht: zet "Uw volgende stap" met naam en (tikbaar) telefoonnummer bovenaan, en de keuzes eronder of inklapbaar. Na een keuze direct naar het resultaat scrollen. (`src/pages/overzicht.astro`)
- Homepage en overzicht: een vaste, korte spoedregel op het eerste scherm, met 113 en "bel uw huisarts", zonder het alarmnummer. (`src/pages/index.astro`, `src/components/SpoedNummers.astro`)
- "Begin via de medische route" herschrijven in oudertaal, bijvoorbeeld "Begin bij de huisarts". (`src/lib/routes.ts`, `overzicht.astro`)
- Brieven en "Hulp vragen" ook tonen zonder gekozen knelpunt, bijvoorbeeld als standaard "Ik wil hulp aanvragen".
- Taalfout "via de via school" oplossen.

## Over de opzet
- Browser, log, foto's en hardop denken werken. De verslagen zijn concreet en te controleren tegen het log.
- De uitleg over de opdrachtsyntax in `persona-tester.md` is verduidelijkt na een vraag van een tester.
- Voor een volgende run: het agenttype `persona-tester` is nu geladen en kan direct gebruikt worden.
