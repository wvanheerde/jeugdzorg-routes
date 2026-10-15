# Beoordeling 05-anouk-crisis (ronde 20)

- Uitkomst (persona): deels
- Moet vinden: 1 / 1
- Stappen: 4 (r19: 4); gemak 5 (r19: 4), vertrouwen 4 (r19: 5)
- Mag niet: geen overtredingen

## Moet vinden
- **Huisartsenpost via het nummer van de eigen huisarts, die de crisisdienst inschakelt:** gevonden ("Bel de eigen huisarts: dan hoor ik het nummer van de huisartsenpost, die zo nodig de crisisdienst inschakelt", /overzicht/?s=&k=spoed).

Goed als ook: "bij direct gevaar het alarmnummer" gevonden. Spoedpagina Zwolle en vervolg via wijkteam niet (geen gemeente gekozen; spoed is een uitzondering op de verplichte gemeentekeuze).

## Mag niet
- 113 wordt niet als noodnummer aanbevolen: `SpoedNummers.astro` noemt 113 alleen bij "gedachten aan zelfdoding". Anouk noteert het ook zo.
- Het alarmnummer staat nergens als getal. Geen overtreding.

## Zelf gecontroleerd: staat er echt geen nummer?
Klopt. Op `/overzicht/?k=spoed` staan alleen Veilig Thuis (0800-2000) en 113 (0800-0113) als nummer; de huisartsenpost staat er zonder nummer ("Dat nummer staat ook op de website van uw huisarts"). Ook mét gemeente (`?gemeente=zwolle&k=spoed`) komt er alleen een link "Gemeente Zwolle: meldpunten onveilige situaties" bij; `zwolle.json` heeft geen crisisnummer. `SpoedNummers.astro` en `knelpunten/spoed.md` zijn niet gewijzigd sinds de vorige commit: **in ronde 19 was het precies zo** (zelfde klacht, ernst 3, toen "bekend en bewust"). Opvallend: sommige gemeenten hebben wel een crisisnummer in hun data (Emmen: "Crisis jeugd 0591 709 003" in de bereikbaarheid van De Toegang), maar dat komt niet in het spoedblok.

## Ervaring
- Antwoord na 2 klikken + 1 scroll: binnen het doel (4 acties, ≤ 2 schermen).
- **Ernst 3:** geen tikbaar nummer voor haar situatie (paniek, geen gevaar, 22:30). Bewuste keuze van de site (huisartsenposten verschillen per regio), maar voor de persona blijft het de kern. Twee rondes op rij ernst 3.
- Ernst 2: de bellijst staat pas na een scroll; "Het kan niet wachten" staat midden in 13 knoppen (de nieuwe knop "Ik wil hulp uitbreiden" staat erboven).
- "crisisdienst" heeft nu wel een uitleg in de woordenlijst, maar Anouk zag die niet als klikbaar.

## Onjuistheden
"De knop staat als nummer 12 tussen dertien knoppen": 12 is het klik-nummer van de testtool, niet de plek. In beeld is het de 7e van 13 knoppen. Licht wegen.

## Vertrouwen in de agent
In de rol (snel, moe, wil een nummer). Gemak hoger en vertrouwen lager dan r19: binnen de variatie, dezelfde bevinding.
