# Beoordeling 07-joyce-verhuizen (ronde 4, 18-10)

Build met: wijkteams als regel onder stap 1 en 3, uitlegzin bij teams zonder "wijkteam", ingekorte stap 3 (afspraak tussen gemeenten, geen pgb), kopieerbare moeilijke woorden.

- Uitkomst (persona): gehaald (r3: gehaald)
- Moet vinden: 5 / 5 (r3: 5 / 5)
- Stappen: 10 (r3: 8); gemak 6 (r3: 6), vertrouwen 5 (r3: 6)
- Mag niet: geen overtredingen; URL niet zelf aangepast.

## Bevindingen
- Ernst 2: "JGZ Almere" voelt als consultatiebureau. De uitlegzin ("JGZ Almere is in Almere het team waar u zich meldt voor jeugdhulp") staat er wel (nagekeken); in r3 nam die de twijfel weg, nu niet helemaal. Ruis tussen runs.
- Ernst 2: "Volgens de afspraak uit stap 2" — de testbrowser leest geen stapnummers (CSS-tellers, `textContent`), dus deels een artefact. Wel kwetsbaar: bij een verhuizing binnen de gemeente of met verborgen stappen klopt het nummer niet altijd. Beter zonder nummer verwijzen.
- Ernst 1: "Loopt het besluit langer dan een jaar, dan mag de nieuwe gemeente daarna opnieuw kijken" is onduidelijk.
