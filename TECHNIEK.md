# Techniek

Hoe de site gebouwd, gecontroleerd en gepubliceerd wordt. Over de inhoud zelf: zie [README.md](README.md); over het bijwerken van inhoud: [CONTENT.md](CONTENT.md).

- **Stack:** [Astro](https://astro.build) 7, statisch gebouwd, content collections met een Zod-schema. Geen frontend-framework; een paar kleine scripts voor het menu, de gemeentezoeker en de keuzes op *Mijn overzicht* (die alleen in de browser van de bezoeker worden bewaard).
- **Hosting:** GitHub Pages via `.github/workflows/deploy.yml`.

```bash
npm install
npm run dev        # http://localhost:4321
npm run validate   # snelle contentcheck (schema, 112, 06-nummers, contactblokken)
npm run build      # volledige build + sitemap -> dist/
npm run links      # alle URL's in de content op bereikbaarheid controleren
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
tests/persona/                 persona-tests in een echte browser (zie de README daar)
.claude/                       instructies voor de AI-agents die onderzoek en redactie doen
```

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

Astro ondersteunt "islands": voeg bijvoorbeeld `@astrojs/react` of `@astrojs/svelte` toe en plaats een component met `client:load` op een pagina. De JSON-data per gemeente is daarbij direct bruikbaar als input.
