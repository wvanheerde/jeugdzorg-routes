# Inhoud bijwerken (handleiding voor mens én agent)

De informatiestructuur is vastgelegd in `src/content.config.ts` (Zod-schema). `npm run build` faalt als content niet voldoet.

## Collecties

| Map | Formaat | Wat |
|---|---|---|
| `src/content/gemeenten/<slug>.json` | JSON | Eén bestand per gemeente, vaste structuur |
| `src/content/organisaties/<slug>.json` | JSON | Landelijke organisaties |
| `src/content/landelijk/NN-<slug>.md` | Markdown + frontmatter | Landelijke rechten en uitleg |

## Een gemeente toevoegen of bijwerken

1. Kopieer `src/content/gemeenten/amsterdam.json` naar `<slug>.json` (kebab-case, bv. `den-haag.json`).
2. Vul alle secties in; houd de volgorde en sleutels exact aan.
3. Zet `meta.status` op `concept` als de bronnen zijn geraadpleegd, op `gecontroleerd` als een mens de pagina heeft nagekeken.
4. Vul `meta.laatstGecontroleerd` en `meta.bronnen` (met `geraadpleegd`-datum).
5. Draai `npm run validate && npm run build`.

## Instructies voor een agent

- Raadpleeg uitsluitend officiële bronnen: de website van de gemeente, het toegangsteam, de jeugdzorgregio, MEE/cliëntondersteuning. Neem elke gebruikte URL op in `meta.bronnen`.
- Verander **nooit** de sleutels of de volgorde in het JSON-bestand; vul alleen waarden in. Onbekend en optioneel? Laat het veld weg. Onbekend en verplicht? Vul een korte tekst in en noteer het in `meta.opmerkingen`.
- `toegang.routes` bevat minimaal `wijkteam`, `huisarts` en `spoed`. Gebruik de lokale naam van het team in `naam` (bv. "Buurtteam", "CJG", "WIJ-team").
- Telefoonnummers in de vorm `0XX XXX XXXX`; URL's inclusief `https://`.
- Zet `meta.status` nooit zelf op `gecontroleerd`; dat doet een mens.
- Landelijke feiten (bezwaartermijn, Jeugdstem, cliëntondersteuning) horen in `src/content/landelijk/`, niet per gemeente herhaald, tenzij de gemeente er een eigen invulling aan geeft.
- In markdown-frontmatter moeten datums tussen aanhalingstekens staan: `laatstGecontroleerd: "2026-10-10"`.
