# Techniek

Hoe de site gebouwd, gecontroleerd en gepubliceerd wordt. Over de inhoud zelf: zie [README.md](README.md); over het bijwerken van inhoud: [CONTENT.md](CONTENT.md).

- **Stack:** [Astro](https://astro.build) 7, statisch gebouwd, content collections met een Zod-schema. Geen frontend-framework; een paar kleine scripts voor het menu, de gemeentezoeker en de keuzes op *Mijn overzicht* (die alleen in de browser van de bezoeker worden bewaard).
- **Hosting:** GitHub Pages via `.github/workflows/deploy.yml`.

```bash
npm install
npm run dev        # http://localhost:4321
npm run validate   # snelle contentcheck (schema, 112, 06-nummers, contactblokken, jargon)
npm run build      # volledige build + sitemap -> dist/
npm run links      # alle URL's in de content op bereikbaarheid controleren
npm test           # gedragstests tegen dist/ (eerst npm run build), zie "Tests"
```

## Structuur

```
src/content.config.ts          schema (bron van waarheid voor alle inhoud)
src/content/gemeenten/         één JSON per gemeente (342)
src/content/situaties/         situaties (markdown), bv. ADHD, wachten, 18 worden
src/content/knelpunten/        knelpunten: beginnen, wachten, afgewezen, vastgelopen …
src/content/hulpsoorten/       soorten hulp (JSON)
src/content/therapievormen/    therapievormen (JSON)
src/content/brieven/           voorbeeldbrieven (markdown)
src/content/landelijk/         landelijke rechten (markdown)
src/content/organisaties/      landelijke organisaties (JSON)
src/pages/                     routes: /, /gemeenten/, /situaties/, /landelijk/, /organisaties/,
                               /therapievormen/, /brieven/, /overzicht/, /over/, robots.txt
src/layouts, src/components    opmaak
src/site.ts                    repository-link en GoatCounter-code
scripts/                       validatie, linkcheck, sitemap, scaffold, dagboek-docx (bouwt public/downloads/dagboek-zorg-twee-weken.docx)
scripts/data/                  register van gemeenten en gedeelde regiogegevens (jeugdregio, GGD)
scripts/onderzoek/             hulpscripts voor het onderzoek per gemeente (zie de README daar)
tests/e2e/                     gedragstests: scenario's in het Nederlands (Gherkin) en unit-tests, zie "Tests"
tests/persona/                 persona-tests in een echte browser (zie de README daar)
.claude/                       instructies voor de AI-agents die onderzoek en redactie doen
```

## Tests

Het gedrag van de site ligt vast in scenario's in het Nederlands. Ze draaien snel en geven elke keer dezelfde uitkomst, lokaal en in GitHub Actions. Faalt er één, dan gaat er niets live.

```bash
npm run build                 # de tests draaien tegen dist/
cd tests/e2e
npm ci                        # eenmalig (eigen package.json, los van de site)
npx playwright install chromium   # eenmalig
npm test                      # alles: unit, laptop, telefoon
npx playwright test --project=desktop -g "datumveld"   # een deel
npm run test:ui               # stap voor stap meekijken
npm run rapport               # het rapport van de laatste run
```

**Opbouw (`tests/e2e/`)**
- `features/*.feature`: de scenario's, in Gherkin met `# language: nl` (Functionaliteit, Achtergrond, Scenario, Gegeven, Als, Dan, En). Eén bestand per onderdeel: voorpagina, overzicht, elke verdieping, datumveld, suggestielijst, leeftijd, gemeenten, situaties, hulpsoorten en therapievormen, brieven, moeilijke woorden, overige pagina's, zoekmachines, opmaak en menu.
- `steps/*.ts`: de stappen achter de zinnen (Playwright via [playwright-bdd](https://vitalets.github.io/playwright-bdd/)). Hergebruik een bestaande zin waar dat kan; een nieuwe zin hoort in het bestand van het onderwerp (`algemeen`, `verdieping`, `velden`, `paginas`).
- `steps/inhoud.ts`: scenario's gebruiken gewone namen ("Mijn kind wordt 18", "ADHD en ADD", "Apeldoorn", "12 tot 18"); de bijbehorende id's komen uit `src/content`.
- `unit/*.spec.ts`: losse functies uit `src/lib` (termijnen en feestdagen, datums lezen, afbreken, organisaties herkennen, de woordenlijst), zonder browser.
- `server.mjs`: serveert `dist/`, ook onder het subpad van GitHub Pages (`BASE_PATH`).

**Altijd dezelfde uitkomst** (`steps/fixtures.ts`, `playwright.config.ts`)
- De datum staat vast op 18 oktober 2026, 10.00 uur, tijdzone Amsterdam, taal nl-NL. "Gegeven het is 1 maart 2027" zet een andere datum. Timers lopen gewoon (wachten op een vertraging werkt).
- Geen verkeer naar buiten; elke test begint met een lege browser (geen bewaarde keuzes).
- Elk scenario draait op laptop (Desktop Chrome) en telefoon (iPhone 13-scherm, Chromium). `@desktop` of `@mobiel` boven een scenario beperkt het tot één van beide.
- Geen herhaalpogingen: een test die soms faalt is een fout (in de site of in de test), geen pech. Wacht in een scenario op wat een gebruiker ziet ("Dan zie ik de suggestie …") voordat je verder klikt.

**Werkwijze: eerst het scenario**
Beschrijf nieuw of gewijzigd gedrag eerst als scenario, draai het (het moet falen om de goede reden), en schrijf dan de code tot het slaagt. Het scenario is de afspraak; de code voert hem uit. Een wijziging is pas klaar als `validate`, `check`, `build` en `npm test` slagen. Zie ook CLAUDE.md.

**Wanneer een scenario toevoegen**
Bij nieuw gedrag of een nieuwe afspraak over gedrag (zoals in CONTENT.md) hoort een scenario, in dezelfde wijziging. Verandert bewust gedrag, pas dan het scenario aan. Inhoud zelf (teksten van gemeenten, bronnen) controleert `npm run validate`; die controles herhalen de scenario's niet. Schrijf verwachtingen op wat vastligt (koppen, gedrag, datums die de site uitrekent), niet op inhoud die bij een onderzoeksronde verandert, zoals telefoonnummers van een gemeente.

**In GitHub Actions** (`.github/workflows/test.yml`)
Bij elke pull request en push buiten `main`: `validate`, `astro check`, en dan in één stap de meetbuild (met hetzelfde subpad als de echte site) met alle gedragstests en de dekkingsmeting (zie "Dekking"). Lokaal draait `npm test` tegen de gewone build. Runner: `ubuntu-24.04` (vast, niet `ubuntu-latest`), Node 24. `deploy.yml` roept deze workflow eerst aan; pas als alles slaagt wordt er gebouwd en gepubliceerd. Faalt er iets, dan staat het rapport als download (`testrapport`) bij de run.

**Dekking** (`npm run dekking` in de hoofdmap)
Bouwt de site apart met sourcemaps (en zonder scripts in de HTML), draait alle tests en meet daarbij:
- welke regels, functies en takken van de browserscripts in `src/` uitgevoerd zijn (`tests/e2e/dekking-rapport/code/index.html`, per bronbestand met de regels die niet draaien);
- welke paginasoorten (`src/pages`) door scenario's bezocht of opgehaald worden (`dekking-rapport/paginas.md`).

Alleen de scripts in de browser worden gemeten; wat Astro bij het bouwen al als HTML neerzet, valt erbuiten (dat toetsen de scenario's wel, maar het telt niet mee in het percentage). Door het terugvertalen van verkleinde code wijzen enkele regels naar commentaar of imports; kijk per bestand naar het geheel. In GitHub Actions is dit de teststap zelf (één build, één testronde), met een ondergrens van 85% van de regels (gemeten op 18 oktober 2026: 86,5%) (`DEKKING_MINIMUM`) en elke paginasoort minstens één keer bezocht; het rapport staat als download (`dekkingsrapport`) en de samenvatting bij de run. Zakt de dekking door nieuw gedrag zonder scenario, dan faalt de run.

**Persona-tests zijn iets anders.** Die (in `tests/persona/`) laten een AI-agent als ouder de site gebruiken en beoordelen of iemand het juiste vindt en hoe het voelt. Ze zijn nuttig voor ontwerpvragen, maar niet herhaalbaar. Wat daaruit als afspraak overblijft, leg je vast in een scenario.

## Hoe de inhoud wordt onderzocht

Gemeentepagina's worden onderzocht en geschreven door AI-agents (`.claude/agents/gemeente-onderzoeker.md`) en daarna geredigeerd (`gemeente-redacteur.md`). De werkwijze voor de hoofdagent staat in `.claude/skills/gemeenten-onderzoeken/`. De beheerder controleert per gemeente een steekproef van beweringen in de bron en beslist over twijfelgevallen. De schrijfregels staan in [CONTENT.md](CONTENT.md).

## Publiceren op GitHub Pages

1. Activeer in de repository-instellingen *Pages → Source: GitHub Actions*.
2. Eigen domein (bv. `www.jeugdzorg-routes.nl`): vul het in onder *Pages → Custom domain*, zet de DNS-records (CNAME `www` naar `wvanheerde.github.io`) en maak een repository-variabele `SITE_URL` met het volledige adres (`https://www.jeugdzorg-routes.nl`). De workflow bouwt dan met pad `/`. Zonder `SITE_URL` bouwt hij voor `https://wvanheerde.github.io/jeugdzorg-routes/`.
3. Push naar `main`.

Domein wijzigen: alleen `SITE_URL` (en het custom domain in de Pages-instellingen) aanpassen.

## Statistieken

Maak een gratis account op [goatcounter.com](https://www.goatcounter.com) (voor niet-commercieel gebruik), kies een code, en zet die als repository-variabele `GOATCOUNTER_CODE` (of in `src/site.ts`). Zonder code wordt er niets geladen. GoatCounter gebruikt geen cookies.

## Zoekmachines en AI-crawlers

- `npm run build` schrijft ook `dist/sitemap.xml` (`scripts/sitemap.mjs`); pagina's met `noindex` (zoals *Mijn overzicht*) staan er niet in.
- `src/pages/robots.txt.ts`: zoekmachines en live AI-zoekfuncties die met een link citeren zijn welkom; crawlers die verzamelen voor AI-training worden geweigerd (lijst bovenin het bestand). Dit is een verzoek; niet iedere scraper houdt zich eraan. robots.txt werkt alleen in de hoofdmap van een domein, dus pas met een eigen domein.
- Voorbehoud tekst- en datamining (art. 15o Auteurswet): `public/.well-known/tdmrep.json` en de metatag `tdm-reservation` in `src/layouts/Base.astro`. Zie ook [LICENSE-INHOUD.md](LICENSE-INHOUD.md).

## Uitbreiden met interactie

Mijn overzicht heeft al een eigen vorm van interactie: de **verdieping** (optionele vragen die de stappen aanpassen, zonder framework). Werkwijze en regels: [CONTENT.md, "Knelpunten: verdieping in Mijn overzicht"](CONTENT.md#knelpunten-verdieping-in-mijn-overzicht).

Astro ondersteunt "islands": voeg bijvoorbeeld `@astrojs/react` of `@astrojs/svelte` toe en plaats een component met `client:load` op een pagina. De JSON-data per gemeente is daarbij direct bruikbaar als input.
