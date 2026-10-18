# Jeugdzorg Routes: werkafspraken voor agents

Een site die ouders wegwijs maakt in de jeugdzorg, per gemeente. Gebouwd met Astro, gepubliceerd via GitHub Pages.
Deze afspraken gelden voor elke sessie en elke agent. Details staan in de documenten hieronder; lees die voordat je iets wijzigt.

## Waar staat wat

- [CONTENT.md](CONTENT.md): hoe inhoud en gedrag eruit moeten zien (bronnen, toon, verdiepingen, knelpunten, therapievormen …).
- [TECHNIEK.md](TECHNIEK.md): bouwen, testen ("Tests"), publiceren, structuur van de code.
- [README.md](README.md): wat de site is en niet is.
- `.claude/agents/` en `.claude/skills/`: werkwijze voor onderzoek per gemeente, redactie en persona-tests.
- `docs/onderzoek/`: verslagen, twijfellijsten en "later nakijken".

## Gedrag veranderen: eerst het scenario (BDD)

Het gedrag van de site ligt vast in scenario's in het Nederlands (`tests/e2e/features/*.feature`, Gherkin met `# language: nl`). Werk zo:

1. **Eerst het scenario.** Beschrijf nieuw of gewijzigd gedrag als scenario (Gegeven / Als / Dan) vóór je de code schrijft. Het scenario is de afspraak; de code voert hem uit. Draai het: het moet eerst falen om de goede reden.
2. **Dan de code**, tot het scenario slaagt. Hergebruik bestaande stappen (`tests/e2e/steps/`); een nieuwe zin hoort in het bestand van het onderwerp.
3. **Klaar is pas klaar als alles groen is:** `npm run validate`, `npm run check`, `npm run build` en `npm test` (zie TECHNIEK.md, "Tests"). Bij nieuw of veranderd script-gedrag ook `npm run dekking`: de dekking mag niet onder de ondergrens zakken (85% van de regels) en elke paginasoort heeft een scenario. Meld de uitkomst eerlijk, ook als iets faalt.
4. **Verandert een afspraak, dan verandert het scenario mee**, in dezelfde wijziging. Een afspraak in CONTENT.md zonder scenario is onaf.
5. **Een test die soms faalt is een fout**, in de site of in de test, nooit pech. Zoek de oorzaak; zet geen herhaalpogingen aan.
6. **Persona-tests** (`tests/persona/`, skill `site-testen`) beoordelen of ouders de weg vinden. Wat daaruit als afspraak overblijft, leg je vast als scenario. Pas de site na een persona-test pas aan als de gebruiker akkoord geeft.

Inhoud zelf (teksten, bronnen, contactgegevens van gemeenten) controleert `npm run validate`; scenario's toetsen gedrag en vaste teksten, niet inhoud die bij een onderzoeksronde verandert.

## Git en omgeving

- **Niet committen.** Laat wijzigingen in de werkmap; de gebruiker commit en pusht zelf. De standaardbranch heet `main` (nooit `master`).
- **`node_modules` in de hoofdmap is gedeeld** met de Mac van de gebruiker (darwin-arm64) en deze Linux-container. Draai daar nooit `rm -rf node_modules`, `npm ci` of `npm install`, behalve als de gebruiker om een nieuwe dependency vraagt. Ontbreekt een Linux-binding, haal het `*linux-*`-pakket met `npm pack` en pak het uit in `node_modules/<pakket>`.
- Testgereedschap heeft een eigen `package.json` (`tests/e2e/`, `tests/persona/tools/`); daar mag `npm ci` wel.
- In de container heeft Chromium systeembibliotheken nodig: draai eerst `tests/persona/tools/setup.sh` (zonder root, slaat over wat er al is).

## Schrijven voor ouders (aanvullend op CONTENT.md)

- Schrijf vanuit de ouder: praktisch, drempels verlagend, feitelijk zorgvuldig. Geen ouder-tegen-overheid-toon ("iemand die aan uw kant staat", "grip houden"), geen waarschuwingen als "overdrijf niet" (liever: "maak het niet kleiner dan het is"). De site is geen partij en doet nooit een melding.
- Ervaringen van ouders zijn **ervaringskennis** of een **praktijksignaal**, niet "anekdotisch". Houd wel uit elkaar wat bronnen bewijzen en wat ervaring laat zien.
- Noem **Thuisarts** nooit in lopende tekst; als bron mag het wel.
- Schrijf **medewerker jeugd**, niet "consulent" of "jeugdconsulent" (teamnamen blijven zoals ze zijn).
- Therapievormen: de **richtlijn of zorgstandaard is leidend** (dan NJi, Kenniscentrum KJP, grote overzichten in lijn daarmee). Losse afwijkende studies horen in een verslag, niet op de pagina. De site toont één lijst op volgorde van toepasbaarheid, zonder kopjes of labels.
- Geen rij "Waar staat u?" (knelpuntknoppen) op gemeente- of situatiepagina's: de route loopt via de voorpagina naar Mijn overzicht.
- Termijnen en tijdsgrenzen alleen met een bron; een eigen vuistregel zeg je in de code en meld je aan de gebruiker.

## Onderzoek met agents

- Hooguit vijf onderzoeksagents tegelijk; controleer het werk van elke agent steekproefsgewijs (skill `gemeenten-onderzoeken`).
- WebSearch heeft een limiet per sessie (ongeveer 200 zoekopdrachten, gedeeld met subagents; reken op 15 per gemeente).
- Meldt een agent dat een site "alleen na inloggen" of "leeg" is, controleer dan zelf de ruwe respons. Veel sites laden hun gegevens met JavaScript; de Beschikbaarheidswijzer is openbaar (zie CONTENT.md).
- Twijfels over gegevens van gemeenten meld je aan de gebruiker (twijfellijst in `docs/onderzoek/`); los ze niet op eigen houtje op.
