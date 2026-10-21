---
name: site-testen
description: Persona-testronde voor Jeugdzorg Routes. Agents spelen ouders (tests/persona/personas.md) die met een concreet doel de site gebruiken in een echte browser; de hoofdagent beoordeelt de uitkomst tegen vaste criteria en vergelijkt met eerdere runs. Gebruik bij "test de site", "persona-test", "draai de scenario's".
---

# Site testen met persona's: werkwijze hoofdagent

Agents (`persona-tester`) spelen de persona's. De hoofdagent zet de ronde op, geeft elke agent alleen wat de persona weet, en beoordeelt daarna zelf tegen de criteria. Zo blijft de test eerlijk en herhaalbaar.

## Voorbereiden
1. **Browser:** `tests/persona/tools/setup.sh` (herhaalbaar; slaat over wat er al is).
2. **Site:** `npm run build`, dan `npx astro preview --port 4329 --host 127.0.0.1` op de achtergrond. Basis-url `http://127.0.0.1:4329`. Test je de live site, gebruik dan de GitHub Pages-url als basis en noteer dat in de samenvatting.
3. **Run-map:** `tests/persona/runs/<JJJJ-MM-DD>-<label>/`, per scenario een submap `<scenario-id>/` (logmap). Schermafbeeldingen (`screens/`) staan in `.gitignore`; logs en verslagen niet.
4. Noteer in `<run>/run.md`: datum, git-commit (`git rev-parse --short HEAD`, plus "met lokale wijzigingen" als `git status` niet leeg is), basis-url, welke scenario's.

## Agents starten
- Hooguit 5 tegelijk. `subagent_type: "persona-tester"`, `name`: het scenario-id.
- **Geef alleen door wat de persona weet:** het persona-blok uit `personas.md`, het deel "Voor de tester" uit het scenario, en uit de kop `apparaat`, `start`, `maxStappen`. Plus: sessienaam (scenario-id), logmap, basis-url. **Nooit het deel "Beoordeling"**: dan test je niet meer de site maar het geheugen van de agent.
- Prompt-sjabloon:
  > Je speelt deze persona: <persona-blok>. Opdracht: <Voor de tester>. Apparaat: <apparaat>. Begin op <basis-url><start>. Maximaal <maxStappen> stappen. Sessie: <id>. Logmap: <run>/<id>.

## Beoordelen (per scenario, door de hoofdagent)
Lees `verslag.md` en `log.jsonl`, bekijk een paar foto's. Schrijf `<run>/<id>/beoordeling.md`:
- **Moet vinden:** per punt uit het scenario `gevonden` / `deels` / `niet`, met bewijs (citaat uit het verslag of de url uit het log). Is iets niet gevonden, zoek dan zelf uit of het op de site staat (dan is het een vindbaarheidsprobleem) of ontbreekt (dan een inhoudsprobleem).
- **Mag niet:** overtredingen.
- **Ervaring:** stappen tot het eerste belangrijke antwoord (uit het log), scrollen, de scores van de persona, en de problemen met ernst 3–4.
- **Onjuistheden:** klopt wat de persona "vond" met de site? Een persona die een verkeerd nummer noteert wijst vaak op een onduidelijke pagina.
- **Vertrouwen in de agent:** een agent kan uit zijn rol vallen (te slim, te snel, te geduldig). Benoem dat als het gebeurde, en weeg de bevinding dan lichter.

## Samenvatten
`<run>/samenvatting.md`:
1. Tabel per scenario: uitkomst, moet-vinden (x van y), stappen, gemak, vertrouwen (rapportcijfers 1–10; tot en met ronde 24 was het 1–7, zie "Herhaalbaarheid").
2. **Terugkerende problemen** over persona's heen, geordend op ernst en aantal persona's dat erop stuit. Dat zijn de belangrijkste verbeterpunten.
3. **Vergelijking met de vorige run** (zelfde scenario's): wat is beter of slechter geworden, met de commit ertussen.
4. Concrete verbetervoorstellen, per voorstel welk bestand of component.

Meld de gebruiker kort: tabel, top 3 problemen, wat beter of slechter is dan de vorige run. **Pas de site niet aan zonder akkoord**; dat is een aparte stap.

**Van bevinding naar afspraak.** Gaat de gebruiker akkoord met een verbetering, leg het nieuwe gedrag dan eerst vast als gedragsscenario in `tests/e2e/features/` (Nederlands, Gherkin; zie TECHNIEK.md, "Tests" en CLAUDE.md), en pas daarna de site aan. Zo blijft een verbetering uit een persona-test behouden, ook als niemand die persona opnieuw draait.

## Herhaalbaarheid
- Scenario's en persona's wijzigen alleen bewust, met een regel in `tests/persona/README.md` onder "Wijzigingen". Anders zijn runs niet vergelijkbaar.
- Scores: sinds 2026-10-20 (na ronde 24) een rapportcijfer van 1 tot 10, daarvoor 1 tot 7. Vergelijk je met een oudere run, reken de oude score dan om met `1 + (x − 1) × 1,5` (7 → 10, 5 → 7, 4 → 5,5) en zeg erbij dat het een omrekening is: een persona geeft op een andere schaal niet precies hetzelfde.
- LLM-gedrag varieert. Draai bij twijfel een scenario twee keer; een probleem dat bij beide runs of bij meerdere persona's terugkomt is betrouwbaar.
- Nieuwe valkuil in de werkwijze van de tester gevonden: zet hem in `.claude/agents/persona-tester.md`.

## Afronden
Stop alle browsers (`node tests/persona/tools/browser.mjs <sessie> stop`, sessies staan in `$TMPDIR/jr-browser/`) en de preview. Stop de preview op proces-id, niet met `pkill -f "astro preview"`: dat treft ook de shell die het commando uitvoert, en dan blijft de server draaien. Bijvoorbeeld: `for p in $(ps -eo pid,args | grep "astro.mjs preview --port 4329" | grep -v grep | awk '{print $1}'); do kill $p; done`. Controleer daarna met `ps` dat er geen preview meer draait: achtergebleven servers (13 stuks op 19-10) vraten het geheugen van de container op, waarna gedragstests willekeurig faalden en Chromium crashte. Niet committen: dat doet de gebruiker zelf.
