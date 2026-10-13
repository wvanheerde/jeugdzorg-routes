# Persona-tests

Herhaalbare tests van de site vanuit het perspectief van ouders. AI-agents spelen verzonnen ouders (persona's) met een concreet doel (scenario) en gebruiken de site in een echte browser, op een telefoon- of laptopscherm. Ze denken hardop en schrijven een ervaringsverslag. De hoofdagent beoordeelt daarna tegen vaste criteria: heeft de ouder gevonden wat de site moet bieden, en hoe ging dat?

Dit vervangt geen test met echte ouders. Het vindt wel snel en goedkoop struikelpunten, en laat zien of een wijziging de site beter of slechter maakt. De scenario's zijn ook bruikbaar als takenlijst voor een gebruikerstest met echte ouders.

## Opbouw
| Pad | Wat |
|---|---|
| `personas.md` | De persona's: wie, apparaat, leesniveau, ervaring, gemoed, gedrag |
| `scenarios/*.md` | Per scenario: persona, startpagina, opdracht voor de tester, en de beoordelingscriteria (die de tester niet ziet) |
| `tools/browser.mjs` | Browser-driver die agents stap voor stap bedienen (`kijk`, `klik`, `scroll`, `foto`, `notitie`) en die elke stap logt |
| `tools/setup.sh` | Zet Playwright en Chromium klaar, ook in een container zonder root |
| `runs/<datum>-<label>/` | Uitkomsten per run: log, verslag en beoordeling per scenario, en een samenvatting |

Werkwijze voor een ronde: skill `site-testen` (`.claude/skills/site-testen/SKILL.md`). Agent: `.claude/agents/persona-tester.md`.

## Draaien
In Claude Code: "draai de persona-tests" of `/site-testen`. Handmatig de browser proberen:

```bash
tests/persona/tools/setup.sh
npm run build && npx astro preview --port 4329 --host 127.0.0.1 &
node tests/persona/tools/browser.mjs start proef mobiel /tmp/proef
node tests/persona/tools/browser.mjs proef open http://127.0.0.1:4329/
node tests/persona/tools/browser.mjs proef kijk
node tests/persona/tools/browser.mjs proef stop
```

## Een scenario toevoegen
Kopieer een bestaand scenario. Houd "Voor de tester" in de taal en kennis van de persona, zonder te verraden waar het antwoord staat. Zet onder "Beoordeling" alleen wat nu echt op de site staat of moet staan, controleer dat vooraf.

## Wijzigingen
- 2026-10-12: eerste versie, 8 persona's en 8 scenario's.
- 2026-10-12: browser-driver v2: `kijk` toont alleen wat in beeld is, `scroll` toont het nieuwe beeld. Runs vóór "2026-10-12-basis" gebruikten v1 (hele pagina in één keer).
- 2026-10-12: scenario 05 omgebouwd van nood (dochter wil er niet meer zijn) naar spoed (paniekaanval in het weekend). De site is niet bedoeld voor nood; runs vóór deze datum zijn voor 05 niet vergelijkbaar.
- 2026-10-12: browser-driver v3: tekst en knoppen in documentvolgorde (v2 zette knoppen in een blok soms vóór de kop). Runs tot en met "2026-10-12-ronde2" gebruikten v2.
- 2026-10-12: scenario 04 (Peter) begint op de voorpagina in plaats van op de gemeentepagina van Apeldoorn. De site is ingericht op de route vanaf de voorpagina. Runs vóór deze datum zijn voor 04 niet vergelijkbaar op stappen.
- 2026-10-13: scenario 08 (Henk) bijgewerkt: Aalten is sinds 2026-10-12 onderzocht, dus de beoordeling toetst nu de Aalten-gegevens en of "wijkteam" en de eigen teamnaam begrijpelijk zijn. Runs vóór ronde 10 zijn voor 08 niet vergelijkbaar.
- 2026-10-13: 7 persona's en scenario's toegevoegd (09 Lisa thuiszitter, 10 Ahmed scheiding, 11 Ingrid pgb, 12 Kees geen besluit, 13 Naima hulp werkt niet/EMDR, 14 Rob "Hoe gaat het hier?", 15 Monique zorgen om kinderen van haar zus). Totaal 15.
- 2026-10-13 (na ronde 16): `kijk` toont een regelovergang (`<br>`) als " / ". Daarvoor plakten regels aan elkaar ("Postbus 901505600 RB"); runs tot en met ronde 16 lazen adressen in brieven zo.
