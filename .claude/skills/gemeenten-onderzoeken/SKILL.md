---
name: gemeenten-onderzoeken
description: Werkwijze voor de hoofdagent bij een onderzoeks- of redactieronde van gemeentepagina's in Jeugdzorg Routes. Gebruik bij "volgende ronde gemeenten", "onderzoek gemeente X", "review de gemeenten".
---

# Gemeenten onderzoeken en redigeren: werkwijze hoofdagent

Subagents doen het werk (`gemeente-onderzoeker`, `gemeente-redacteur`); de hoofdagent kiest gemeenten, controleert elk resultaat en houdt de gebruiker kort op de hoogte. Kwaliteit komt uit de controle, niet uit vertrouwen in het rapport.

## Voor de ronde
- **Later nakijken**: kijk in `docs/onderzoek/later-nakijken.md` of er punten zijn waarvan de datum voorbij is, en neem die mee.
- **Volgorde**: grootste gemeenten eerst. Haal inwonertallen op bij CBS (tabel 70072ned, `TotaleBevolking_1`, laatste jaar) en neem kale gemeenten: `meta.opmerkingen` begint met "Automatisch aangemaakt". Leg de volgorde vast in de scratchpad.
- **Nieuwe sessie per ronde**: WebSearch heeft 200 zoekopdrachten per sessie, gedeeld door alle agents. Met hooguit 15 per gemeente zijn dat ongeveer 12 gemeenten per sessie. Zeg het de gebruiker als het budget opraakt.
- **Reservekopie** van bestanden die een redacteur gaat bewerken (veel gemeentebestanden staan nog niet in git): kopieer de goedgekeurde conceptversie naar `<scratchpad>/voor/` vlak vóór je de redacteur start, niet de voorbeeldversie aan het begin van de ronde (anders zegt de feitencheck niets).

## Tijdens de ronde
- **Gelijktijdig**: hooguit 5 agents (afspraak met de gebruiker), doorlopend: start een nieuwe zodra je er een hebt goedgekeurd. Een tweede ronde telt mee.
- **Starten**: `subagent_type: "gemeente-onderzoeker"`, prompt met gemeentenaam, slug en het scratchpad-pad. Unieke `name` per agent (de slug).
- **Controle per gemeente, altijd:**
  1. CBS-aandeel zelf narekenen: `node scripts/onderzoek/cbs-huisarts.mjs <cbsCode>`, vergelijk met het bestand. Exitcode 2 (verwijzers geheim): dan hoort er geen `aandeelHuisarts` in het bestand.
  2. De steekproef-bewering uit het rapport letterlijk terugzoeken in de bron (pdf's met `scripts/onderzoek/pdftekst.py`).
  3. `meta.opmerkingen` lezen: hooguit drie zinnen, geen zoekverslag.
  4. **Geen 112**: `node scripts/validate-content.mjs` faalt op elke vermelding in publieke tekst. Elke vermelding van het alarmnummer haal je weg, ook "Levensbedreigend: bel 112" in de spoedroute (komt uit het oude scaffold-sjabloon).
  5. **Geen persoonlijke contactgegevens**: `grep -oE '[a-z]{1,2}\.[a-z]+@[^" ]+' src/content/gemeenten/<slug>.json`. E-mailadressen op naam van een medewerker haal je weg (alleen algemene adressen zoals `info@`).
  6. **Contactblok bij elke instantie**: `node scripts/validate-content.mjs 2>&1 | grep <slug>` mag geen waarschuwing "in tekst" of "route zonder contactblok" geven (uitzondering: spoed, als de gemeente geen geschikte spoed- of crisispagina heeft en dat in `meta.opmerkingen` staat). Kijk daarnaast zelf of elke instantie in de stappen van toegang, huisarts en school een blok heeft; dat kan de validator niet zien (zie CONTENT.md). Steekproef: één nummer uit een contactblok terugzoeken op de contactpagina van de instantie zelf. Spoedroute: geen telefoonnummers, wel een werkende link naar de spoedpagina van de gemeente (openen en kijken of hij over spoed of crisis gaat).
  7. Snel scannen op financiën, jargon ("gerealiseerd", "x 1.000 euro", taakveld) en onderzoeksverslag in publieke tekst. Kleine dingen zelf verbeteren.
  8. Open punten kritisch bekijken: "geblokkeerd", "pdf niet leesbaar", "raadsinformatie niet doorzoekbaar" en "jaarstukken niet gevonden" bleken eerder vaak onterecht. Probeer zelf even (curl met browser-User-Agent, `raadsinfo.py`, `pdftekst.py`). Lukt het wel, stuur de agent terug voor een tweede ronde met concrete aanwijzingen.
- **Regiobestand bijwerken** (`scripts/data/regios.json`, gedeeld per jeugdregio en GGD-regio): heeft de onderzoeker een `<scratchpad>/regio-<slug>.json` gemaakt, controleer elk blok op de eigen website van de instantie en zet het dan in het regiobestand (met `bronnen`). Alleen jij schrijft in dat bestand; agents stellen voor. Beschikbaarheidswijzer alleen invullen als de link voor de hele jeugdregio geldt (anders een `opmerking`). Indeling vernieuwen: `python3 scripts/onderzoek/regio.py opbouwen` (bewaart ingevulde blokken).
- **Vaste spoednummers** (`src/components/SpoedNummers.astro`) gelden op elke pagina: controleer ze af en toe op veiligthuis.nl en 113.nl.
- **Goedgekeurd**: agent stoppen met TaskStop, volgende starten, de gebruiker in een paar regels melden (wat gecontroleerd is en klopt, wat opvalt). Uitgebreid alleen bij een tweede ronde of een opvallende vondst.
- **Nieuwe valkuil gevonden**: zet hem in `.claude/agents/gemeente-onderzoeker.md` (en vertel het de gebruiker), zodat volgende agents hem kennen.

## Redactieronde
- `subagent_type: "gemeente-redacteur"`, ongeveer acht gemeenten per agent, verslagen naar `<scratchpad>/review/verslag/`.
- Na afloop: `node scripts/validate-content.mjs` (ook de 112-controle; geen waarschuwingen over contactgegevens voor de geredigeerde gemeenten) en `python3 scripts/onderzoek/feitencheck.py <scratchpad>/voor <slugs...>`. "Nieuw" moet leeg zijn; "weg" mag alleen bedragen en bronnen van verwijderde financiële signalen bevatten, plus telefoonnummers en e-mailadressen die nu in een contactblok staan.
- Verzamel de twijfels uit de verslagen voor de gebruiker; die besluit.

## Afronden
- `node scripts/validate-content.mjs` en `npm run build` (bouwt naar `dist/`; naar een andere schijf faalt het).
- Overzicht voor de gebruiker: per gemeente de transparantie-uitkomsten en het CBS-aandeel, wat is bijgestuurd, wat open staat.
- Punten die pas na een datum of gebeurtenis na te kijken zijn: in `docs/onderzoek/later-nakijken.md` zetten.
- Niet committen: dat doet de gebruiker zelf.

## Geldregelingen-ronde (veld `geldregelingen`, regelingencheck)
- **Stand 23-10-2026:** alle 342 gemeenten zijn onderzocht en het veld is verplicht in het schema. Een nieuwe gemeente (bv. na een herindeling) krijgt het meteen; de build faalt anders.
- Agent `regelingen-onderzoeker`, één per gemeente, hooguit 5 tegelijk (tel de lopende agents vóór je een nieuwe start). Gemeenten met dezelfde uitvoerder (sociale dienst, ISD, werkplein) samen of na elkaar, met een tip in de prompt welke buurgemeente al klaar is; dan blijven ze gelijk. Aanvullende afspraken voor een ronde in één bestand in de scratchpad zetten en de agents dat laten lezen.
- WebSearch is vaak op (sessiebudget); agents kunnen zonder (curl, sitemap, SRU, gezondverzekerd.nl).
- **De afspraken** staan in CONTENT.md ("Gemeenten: geldregelingen") en in `.claude/agents/regelingen-onderzoeker.md` ("Afspraken van 23-10-2026"); de besluiten met toelichting bovenaan `docs/onderzoek/twijfels-geldregelingen.md`.
- **Controle per gemeente:** één inkomensgrens en (als die er is) de aanvraagtermijn van leerlingenvervoer letterlijk terugzoeken op de bron; `ouders` bij mantelzorg nagaan tegen de afspraken; `nietGevonden` kritisch bekijken (zoek zelf op de gemeentesite naar "mantelzorg" of "collectieve zorgverzekering"); bedragen alleen met jaartal; geen Wmo- of Jeugdwet-voorzieningen; afkortingen voluit (validate waarschuwt bij 3+ bestanden). `node scripts/validate-content.mjs` moet slagen. Wijzig bestanden met `json.dumps(d, ensure_ascii=False, indent=2) + "\n"` na een roundtrip-controle.
- **Gelijktrekken na een besluit:** maak een werklijst per gemeente (deels automatisch uit de gegevens, bv. jaartal van een regel via de SRU: `query=dcterms.identifier="CVDR123456_1"`), verdeel in groepjes van ±5 gemeenten (zelfde uitvoerder bij elkaar) en laat agents alleen die punten nakijken. Verslag per gemeente onderaan de twijfellijst.
- Twijfels in `docs/onderzoek/twijfels-geldregelingen.md`; de gebruiker beslist. Inkomensgrenzen en bedragen veranderen per 1 januari: herinneringen in `docs/onderzoek/later-nakijken.md` (controleronde in januari).
