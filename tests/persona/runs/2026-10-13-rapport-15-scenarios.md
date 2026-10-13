# Rapport persona-tests: 15 scenario's (13 oktober 2026)

Dit rapport combineert ronde 10 (scenario's 01–07) en ronde 11 (scenario 08 bijgewerkt en de nieuwe scenario's 09–15). Beide rondes draaiden op dezelfde stand van de site: alle 342 gemeenten onderzocht en geredigeerd, lokale build, browser-driver v3. De beoordeling per scenario staat in de map van de ronde (`<scenario>/beoordeling.md`).

AI-testers zijn geen echte ouders. Een probleem dat bij meerdere persona's terugkomt, is wel betrouwbaar. Daar ligt in dit rapport de nadruk op.

## 1. Uitkomsten in één oogopslag

| # | Persona en vraag | Gemeente | Apparaat | Uitkomst | Moet vinden | Stappen | Gemak | Vertrouwen |
|---|---|---|---|---|---|---|---|---|
| 01 | Sanne: waar begin ik? | Emmen | mobiel | gehaald | 2,5 / 4 | 8 | 6 | 6 |
| 02 | Mark: wachten op de jeugd-GGZ | Utrecht | laptop | gehaald | 3,5 / 4 | 10 | 6 | 5 |
| 03 | Fatima: dubbele kinderbijslag | Rotterdam | mobiel | gehaald | 3,5 / 4 | 11 | 5 | 6 |
| 04 | Peter: zoon wordt 18 | Apeldoorn | laptop | gehaald | 6 / 6 | 6 | 5 | 5 |
| 05 | Anouk: spoed op zaterdagavond | Zwolle | mobiel | deels* | 1 / 1 | 3 | 4 | 4 |
| 06 | Erik: hulp afgewezen, bezwaar | Den Haag | laptop | gehaald | 5 / 5 | 8 | 6 | 6 |
| 07 | Joyce: verhuizen | Amsterdam → Almere | mobiel | gehaald, moeizaam | 4,5 / 5 | 19 | 4 | 5 |
| 08 | Henk: opa zoekt hulp | Aalten | desktop | gehaald | 3 / 4 | 15 | 5 | 6 |
| 09 | Lisa: dochter zit thuis | Haarlem | laptop | gehaald, omweg | 5 / 5 | 19 | 5 | 6 |
| 10 | Ahmed: ex wil geen hulp | Tilburg | mobiel | **deels** | 3 / 4 | 20 (max) | **3** | **3** |
| 11 | Ingrid: pgb | Groningen | laptop | **deels** | 3,5 / 4 | 21 | 4 | 5 |
| 12 | Kees: gemeente beslist niet | Eindhoven | laptop | gehaald | 3,5 / 4 | 9 | 6 | 6 |
| 13 | Naima: hulp werkt niet, EMDR | Leeuwarden | mobiel | **deels** | 2,5 / 4 | 25 (max) | 4 | 4 |
| 14 | Rob: hoe gaat het in Arnhem? | Arnhem | laptop | deels* | 5 / 5 | 9 | 5 | 4 |
| 15 | Monique: zorgen om kinderen van zus | Lelystad | mobiel | **deels** | 0,5 / 2 | 13 | **3** | 4 |

\* Anouk en Rob vonden wat ze moesten vinden; ze missen iets wat de site bewust of noodgedwongen niet geeft (een regionaal spoednummer, een wachttijd in maanden die de gemeente niet publiceert).

**Samengevat:** 9 van de 15 personas halen hun doel. De zes oude scenario's die al vaker draaiden, blijven stabiel en worden sneller (Mark, Erik en Henk met veel minder stappen dan in eerdere rondes). De nieuwe scenario's laten zwakke plekken zien die we nog niet kenden: vier van de zeven halen hun doel maar deels. De inhoud is er meestal wel; het probleem is dat ouders er niet komen.

**Wat goed gaat**
- Waar een persona via de voorpagina een knelpunt én een gemeente kiest, is het overzicht sterk: Peter (6 stappen), Erik (8), Kees (9) en Mark (10) hadden snel een concreet plan.
- Alle telefoonnummers die personas noteerden, kloppen met de site (gecontroleerd voor Emmen, Utrecht, Den Haag, Aalten, Almere, Eindhoven, Arnhem en Tilburg).
- De toon werkt: "Vindt u de stap spannend? Dat is begrijpelijk", "Wachten hoeft u niet zomaar te accepteren" en de uitleg over terugbetalen bij de kinderbijslag stellen gerust.
- De eerlijkheid in "Hoe gaat het hier?" wordt begrepen: Rob zag dat "niet openbaar" iets anders is dan "slecht".

## 2. De belangrijkste problemen

Geordend op ernst en op het aantal personas dat erop stuit.

### Probleem 1: de wegwijzer op de voorpagina wordt overgeslagen (ernst 3, 5 personas)
Na het kiezen van een gemeente verschijnt een zwevende knop "Toon mijn overzicht →". Lisa, Ahmed en Monique klikten daar meteen op, zonder de vragen eronder ("Waar gaat uw vraag over?" en "Wat speelt er bij uw kind?") te zien. Hun overzicht ging daardoor over "hulp aanvragen voor uw eigen kind" en niet over hun vraag. Alle drie zeggen: "er was geen knop voor mijn situatie". Die knoppen bestaan wél: *School loopt vast*, *Scheiding* en *Onveiligheid thuis* staan op de voorpagina. Sanne en Joyce hadden een vergelijkbaar probleem: het was niet duidelijk dat er na een knop nog iets volgde, of dat je de vragen mocht overslaan.

Gevolg: Ahmed verloor 7 stappen, Monique vond Veilig Thuis alleen via het zoekveld, Lisa kwam via het menu Situaties pas bij haar antwoord.

### Probleem 2: lokale contactgegevens staan te laag (ernst 2–3, 6 personas)
Op het overzicht komt eerst algemeen advies; de nummers van de eigen gemeente pas na 2 à 3 schermen (Sanne, Henk in beide rondes, Erik). Op de gemeentepagina, die op een telefoon zo'n 25 schermen lang is, vond Joyce het nummer van JGZ Almere niet, terwijl het in het contactblok staat. Kees miste het postadres van het college voor zijn ingebrekestelling.

### Probleem 3: belangrijke antwoorden zitten diep in lange pagina's (ernst 3, 4 personas)
- Ahmed: het antwoord over toestemming bij gezamenlijk gezag staat op de situatiepagina *Scheiding* pas na ongeveer 8 schermen, onder "Waar het vaak misgaat".
- Naima: het overzicht voor "De hulp werkt niet" met *Trauma* is op mobiel ongeveer 17 scrolls lang en toont geen therapievormen. De uitleg over EMDR staat op de situatiepagina *Trauma* en op de pagina EMDR, maar daar kwam ze niet meer aan toe.
- Lisa: de sterkste tekst (zorgplicht, "wij kunnen dit niet" is geen eindpunt) staat op de landelijke onderwijspagina, niet op *School loopt vast*.
- Fatima: het antwoord op "moet ik terugbetalen?" kwam pas na 4 keer scrollen op de landelijke financiële pagina.

### Probleem 4: onderwerpen zonder eigen ingang (ernst 3, 3 personas)
"Waar gaat uw vraag over?" heeft knoppen voor beginnen, wachten, afgewezen, vastgelopen, verkeerde hulp, spoed, 18 worden, verhuizen en geld. Er is geen ingang voor:
- **pgb** (Ingrid moest via Gemeenten → Groningen → "Waar heb ik recht op?");
- **"ik maak me zorgen om een kind van iemand anders"** (Monique);
- **toestemming of gezag bij gescheiden ouders** (Ahmed).

### Probleem 5: het overzicht zonder gemeente loopt dood (ernst 3, 1 persona, maar zwaar)
"Kies uw gemeente om de contactgegevens te zien" staat er zonder keuzeveld of link (Joyce verloor 5 stappen). Bij verhuizen zijn bovendien twee gemeenten nodig; het overzicht kent er één.

### Probleem 6: woorden en namen zonder uitleg (ernst 2, 7 personas)
- "Wijkteam" terwijl de gemeente een eigen naam gebruikt (Ondersteuningsteam Oost Achterhoek, JGZ Almere, Toegang Tilburg). Henk en Joyce wisten niet of het hetzelfde was.
- Beschikking, Beschikbaarheidswijzer, CIZ, Wlz-indicatie, gecertificeerde instelling, en lokale namen als KOOS en Spoor030.
- De algemene tekst over wachten noemt de Beschikbaarheidswijzer ook in gemeenten die er geen hebben (Mark, Utrecht).

### Probleem 7: inhoudelijke gaten (ernst 2–3)
- **Leerplichtambtenaar**: wat die mag en wil, en wat u kunt verwachten (Lisa, ernst 3).
- **Wat één ouder met gezag alleen mag**: een gesprek bij het wijkteam, de huisarts, een groep als KIES (Ahmed).
- **Veilig Thuis anoniem**: de organisatiekaart noemt "Onderzoek na melding" maar niet dat advies vragen anoniem kan en tot niets verplicht (Monique). Op de situatiepagina staat het wel.
- **Pgb per gemeente**: waar u het budgetplan indient en of een zorgverlener zonder contract mag (Ingrid). De link "Wat een pgb van u vraagt" landt bovenaan de landelijke pagina in plaats van bij het pgb-blok.
- **18 worden**: alles staat onder "Ruim vóór de verjaardag", zonder volgorde of termijnen; geen contact bij CIZ, kantonrechter of het Wmo-loket (Peter).
- **Bezwaar**: Juridisch Loket zonder nummer; "datum op het besluit" en "verzenddatum" door elkaar; niet gezegd dat het besluit tijdens bezwaar blijft gelden (Erik).
- **Dyslexie** staat niet op de gemeentepagina, dus Rob wist niet of het via school of de gemeente gaat.
- **Spoed**: geen spoedinformatie op het eerste scherm van de voorpagina (Anouk).

### Probleem 8: een onjuiste zin op elke gemeentepagina
Onder "Hoe gaat het hier?" staat vast: "Wachttijden bij aanbieders en aantallen klachten publiceert geen enkele gemeente." Dat klopt niet: Arnhem (58 klachten) en Eindhoven (74 meldingen) publiceren klachtenaantallen, en de pagina zelf noemt ze. Rob merkte de tegenspraak op.

## 3. Verbetervoorstellen

Op volgorde van verwacht effect. Niets is uitgevoerd; elk voorstel wacht op akkoord.

| # | Voorstel | Lost op | Waar |
|---|---|---|---|
| 1 | **Zwevende knop pas na een knelpunt of situatie.** Toon "Toon mijn overzicht" niet zodra alleen een gemeente is gekozen, of laat de knop eerst naar de vraag "Waar gaat uw vraag over?" scrollen. Zet onder de gemeentekeuze één zin: "Kies hieronder wat er speelt, dan krijgt u een overzicht dat bij u past." | 1 (5 personas) | `src/components/Wegwijzer.astro`, `GemeenteKeuze.astro` |
| 2 | **Contactkaart bovenaan.** Op het overzicht en op de gemeentepagina eerst een vaste kaart "Hier meldt u zich in [gemeente]" met naam, telefoon, tijden en e-mail van het toegangsteam, plus één zin: "Dit is het wijkteam van [gemeente]." Pas daarna het algemene advies. | 2, 6 | `src/pages/overzicht.astro`, `src/pages/gemeenten/[slug].astro` |
| 3 | **Drie nieuwe ingangen bij "Waar gaat uw vraag over?"**: *Ik wil een pgb*, *Ik maak me zorgen om een kind van een ander* (direct naar Veilig Thuis, anoniem advies) en *Wij zijn gescheiden en het loopt vast* (toestemming en gezag). | 4 | `src/content/knelpunten/` (drie nieuwe), `KnelpuntKeuze.astro` |
| 4 | **Overzicht korter en gerichter.** Bovenaan "Wat u nu doet" (hooguit drie stappen), daaronder in- en uitklapbare blokken. Neem bij een gekozen situatie de therapievormen op (korte kaart met link), en zet bij een situatie het belangrijkste uit "Waar het vaak misgaat" hoger. | 3 | `src/pages/overzicht.astro` |
| 5 | **Keuzeveld voor de gemeente in het overzicht** als er geen is gekozen, en bij *verhuizen* een tweede veld "naar gemeente", zodat beide contactkaarten naast elkaar staan. | 5 | `src/pages/overzicht.astro` |
| 6 | **Situatiepagina's: antwoord eerst.** Bij *Scheiding* bovenaan: "Hebben jullie samen het gezag? Dan moeten jullie allebei instemmen met behandeling. Wat u alleen kunt doen: …". Bij *School loopt vast* de kern uit de landelijke onderwijspagina overnemen en een blok "De leerplichtambtenaar" toevoegen. | 3, 7 | `src/content/situaties/scheiding.md`, `school-loopt-vast.md` |
| 7 | **Woorden uitleggen waar ze staan**: korte uitleg bij beschikking, Beschikbaarheidswijzer, CIZ en Wlz (bijvoorbeeld een stippellijn met uitleg). De wachttekst noemt de Beschikbaarheidswijzer alleen als de gemeente er een heeft. | 6 | knelpunten, `landelijk/05-financieel.md`, `overzicht.astro` |
| 8 | **Kleine inhoudelijke aanvullingen**: Veilig Thuis-kaart met "advies vragen kan anoniem en verplicht tot niets"; Juridisch Loket met nummer; bij bezwaar uitleg over de ingangsdatum en dat het besluit blijft gelden; postadres van het college op de gemeentepagina (voor bezwaar en ingebrekestelling); de 18-lijst met termijnen (6 maanden ervoor, 3 maanden ervoor, rond de verjaardag). | 7 | `organisaties/veilig-thuis.json`, `landelijk/07-klacht-of-bezwaar.md`, `knelpunten/wordt-18.md`, gemeentebestanden |
| 9 | **Pgb per gemeente concreter**: in het pgb-blok "waar dient u het in" en een link die direct naar de pgb-uitleg springt. | 7 | `src/pages/gemeenten/[slug].astro`, schema `rechten.pgb` |
| 10 | **Onjuiste vaste zin aanpassen** naar bijvoorbeeld: "Wachttijden per aanbieder publiceert bijna geen enkele gemeente." Klachtenaantallen weglaten uit die zin. | 8 | `src/pages/gemeenten/[slug].astro` |
| 11 | **Spoed op het eerste scherm**: één regel bovenaan de voorpagina: "Kan het niet wachten? Zo vindt u nu hulp →". | 7 | `src/pages/index.astro` |

## 4. Vervolg

- Voorstellen 1 en 2 raken bijna alle personas en zijn relatief klein. Daarna is een herhaling van de 15 scenario's nuttig om te zien of "deels" verandert in "gehaald".
- De nieuwe scenario's 09–15 hebben nu één run. Draai ze na de aanpassingen nog een keer; een probleem dat dan terugkomt, is zeker.
- Los van deze test: de samenvattingen "Hoe gaat het hier?" van Tilburg en Leeuwarden noemen nog bedragen (bijvoorbeeld "6,7 miljoen euro"). Dat past niet bij de afspraak om geen financiële cijfers te noemen.
