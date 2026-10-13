# Samenvatting ronde 10 (2026-10-13)

Lokale build (http://127.0.0.1:4329), driver v3, alle 8 scenario's. Grootste wijziging sinds de vorige rondes: alle 342 gemeenten zijn onderzocht en geredigeerd (o.a. Aalten, Emmen, Almere), plus SEO, licentie en aangescherpte transparantie-regels.

## Per scenario

| Scenario | Vorige ronde | Ronde 10 | Moet vinden | Stappen | Gemak | Vertrouwen |
|---|---|---|---|---|---|---|
| 01 Sanne | gehaald (r9) | gehaald | 2,5 / 4 | 8 → 8 | 6 → 6 | 6 → 6 |
| 02 Mark | gehaald (r5) | gehaald | 3,5 / 4 | 16 → 10 | 6 → 6 | 5 → 5 |
| 03 Fatima | gehaald (r7) | gehaald | 3,5 / 4 | 9 → 11 | 5 → 5 | 6 → 6 |
| 04 Peter | gehaald (r5) | gehaald | 6 / 6 | 6 → 6 | 6 → 5 | 5 → 5 |
| 05 Anouk | deels* (r7) | deels* | 1 / 1 | 4 → 3 | 5 → 4 | 5 → 4 |
| 06 Erik | gehaald (r5) | gehaald | 5 / 5 | 13 → 8 | 6 → 6 | 6 → 6 |
| 07 Joyce | gehaald (r7) | gehaald, moeizaam | 4,5 / 5 | 18 → 19 | 5 → 4 | 6 → 5 |
| 08 Henk | deels* (r6) | gehaald | 4 / 4 (1 n.v.t.) | 16 → 10 | 5 → 5 | 5 → 5 |

\* Anouk: inhoudelijk gevonden (huisarts bellen → huisartsenpost); de persona mist een concreet nummer, wat de site bewust niet geeft.
Henk: Aalten is nu uitgewerkt, dus het scenario is achterhaald (zie hieronder); de uitkomst is niet vergelijkbaar met eerdere rondes.

## Terugkerende problemen (op ernst en aantal persona's)

1. **Lokale contactgegevens staan te laag of zijn niet te vinden** (Sanne, Henk, Joyce, Erik). Op het overzicht komt eerst algemeen advies, de nummers van de gemeente pas na 2–3 scrolls. Joyce vond op de Almere-pagina (~25 schermen op mobiel) het nummer van JGZ Almere niet, terwijl het er staat. Ernst 2–3.
2. **Overzicht zonder gemeente is een doodlopende weg** (Joyce, ernst 3). "Kies uw gemeente om de contactgegevens te zien" zonder keuzeveld of link. Bij verhuizen zijn bovendien twee gemeenten nodig.
3. **Onbekende namen en woorden** (Sanne, Mark, Henk, Joyce, Fatima). "Wijkteam" terwijl de gemeente het Ondersteuningsteam of JGZ Almere noemt; beschikking, Beschikbaarheidswijzer, CIZ/Wlz, KOOS/Spoor030, gezinswerker. Ernst 2.
4. Kleiner: lijst "18 worden" zonder volgorde of termijnen (Peter); Juridisch Loket zonder contact en onduidelijke ingangsdatum van de bezwaartermijn (Erik); geen spoedinfo op het eerste scherm (Anouk); de algemene wachttekst noemt de Beschikbaarheidswijzer ook waar die er niet is (Mark, Utrecht).

## Vergelijking met de vorige rondes

- Stabiel: zeven van acht gehaald, Anouk blijft deels* om dezelfde reden.
- Beter: Mark (16 → 10 stappen), Erik (13 → 8), Henk (16 → 10, nu met echte Aalten-nummers in plaats van "nog niet uitgewerkt"). De uitgewerkte gemeentepagina's leveren overal kloppende nummers op (steekproef Emmen, Utrecht, Den Haag, Aalten, Almere: alle genoemde nummers staan op de site).
- Slechter: Joyce (gemak 5 → 4); zij koos dit keer geen gemeente vóór het overzicht en liep vast op de melding zonder keuzeveld. Peter en Anouk een punt lager op gemak, binnen de gebruikelijke spreiding.

## Verbetervoorstellen (niet uitgevoerd, wacht op akkoord)

| # | Voorstel | Waar |
|---|---|---|
| 1 | Op het overzicht een keuzeveld voor de gemeente tonen als er geen gekozen is (in plaats van alleen de melding); bij knelpunt "verhuizing" een tweede keuzeveld "naar gemeente". | `src/pages/overzicht.astro` |
| 2 | Op het overzicht het contactblok van de gemeente (toegangsteam met telefoon) bovenaan zetten, vóór het algemene advies. | `src/pages/overzicht.astro` |
| 3 | Bij het toegangsteam één zin: "Dit is het wijkteam van [gemeente]: hier meldt u zich voor jeugdhulp." De eigen teamnaam koppelen aan het woord wijkteam. | `overzicht.astro`, `gemeenten/[slug].astro` |
| 4 | Op de gemeentepagina het contactblok van de toegang hoog in beeld (bv. een vaste "Bel of meld u hier"-kaart bovenaan). | `src/pages/gemeenten/[slug].astro` |
| 5 | Lijst "18 worden": volgorde met termijnen (bv. 6 maanden ervoor: Wlz/Wmo; 3 maanden: mentorschap; rond 18: zorgverzekering, DigiD). | `src/content/knelpunten/` (wordt-18) |
| 6 | Woordenlijst-uitleg bij beschikking, Beschikbaarheidswijzer, CIZ/Wlz inline; de wachttekst alleen "Beschikbaarheidswijzer" noemen als de gemeente die heeft. | knelpunten/landelijk, `overzicht.astro` |

## Scenario bijwerken

Scenario 08 (Henk) toetst "de pagina van Aalten is nog niet uitgewerkt; de site zegt dat eerlijk". Dat geldt niet meer. Voorstel: het scenario richten op begrijpelijkheid van "wijkteam" en de eigen teamnaam, met de Aalten-gegevens als moet-vinden. Alleen bewust wijzigen, met een regel in `tests/persona/README.md`.
