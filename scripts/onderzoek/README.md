# Hulpscripts voor onderzoek naar gemeenten

Gebruikt door de subagents in `.claude/agents/` en de werkwijze in `.claude/skills/gemeenten-onderzoeken/`. Alleen standaardbibliotheek van Python 3 en Node; geen pip of npm nodig.

| Script | Wat |
|---|---|
| `pdftekst.py bestand.pdf [--alle]` | Tekst uit een pdf. Probeert zes methoden (`pdf/`), kiest de leesbaarste, ontsleutelt pdf's met een leeg wachtwoord. Meldt het als het waarschijnlijk een scan is. |
| `cbs-huisarts.mjs GM0000 [jaar]` | Aandeel jeugdhulptrajecten via huisarts, jeugdarts of medisch specialist (CBS 85097NED), met landelijk cijfer en ruwe aantallen. |
| `raadsinfo.py ibabs\|parlaeus\|notubiz ...` | Zoeken in het raadsinformatiesysteem van een gemeente zonder browser. |
| `steunpunt.py PLAATS [PLAATS ...]` | Ouder- en jeugdsteunpunt passend onderwijs (PO/VO) per plaats, via de landelijke kaart ouderenjeugdsteunpuntenopdekaart.nl: website, e-mail, telefoon en aantal scholen per steunpunt. |
| `regio.py <slug>` / `regio.py opbouwen` | Gedeelde regionale gegevens (`scripts/data/regios.json`): jeugdregio en GGD-regio per gemeente (CBS 86247NED) met gecontroleerde contactblokken. `opbouwen` vernieuwt de indeling en bewaart ingevulde blokken. |
| `feitencheck.py <map-voor> <slug>...` | Na een redactieronde: welke getallen en URL's in publieke tekst zijn nieuw of verdwenen. |
