# Beoordeling 08-henk-onbekende-gemeente (ronde 21)

- Uitkomst (persona): gehaald
- Moet vinden: 2 + 1 deels / 4
- Stappen: 9 (r20: 10); gemak 5 (r20: 6), vertrouwen 5 (r20: 6)
- Mag niet: geen overtredingen

## Moet vinden
- **Ondersteuningsteam Oost Achterhoek, 085 124 7077:** gevonden, met uitleg dat dit het wijkteam is (log stap 20).
- **Huisarts of jeugdarts mag ook verwijzen:** gevonden ("beide routes zijn even goed").
- **School/intern begeleider en oudersteunpunt SWV:** deels. "Informeer ook de intern begeleider", geen steunpunt. Omdat hij geen situatie kon kiezen (zie onder) kwam het school- en angstdeel niet in het overzicht.
- **Gratis cliëntondersteuning (MEE Samen):** gevonden.

## Ervaring
- **Ernst 2, echte fout (ook bij Ahmed):** na "Ik wil hulp aanvragen" scrolt de voorpagina naar de rij "Wat speelt er bij uw kind?" (`Wegwijzer.astro` r65, `scrollIntoView({block:'start'})`). Op desktop valt de leeftijdsrij daarbij precies onder de vaste kopbalk (knop op y 46–82, kop 82 px; zelf gemeten). Wie dan een leeftijd kiest, komt bovenaan uit en ziet de situatierij niet meer. Henk koos daardoor geen "Angst of somberheid" (overzicht met `s=` leeg). Deels testtool (Playwright scrolt het afgedekte element in beeld), maar ook een echte gebruiker ziet de leeftijdsvraag niet na het automatische scrollen.
- Ernst 2: dertien vraagknoppen zonder uitleg; geen knop die past bij "angstig, wil niet naar school".
- Ernst 1: "Beschikbaarheidswijzer" en "intern begeleider" niet uitgelegd.

## Onjuistheden
Geen.

## Vertrouwen in de agent
Goed in de rol (voorzichtig, geen zoekveld).
