# Beoordeling 08-henk-onbekende-gemeente (ronde 23)

- Uitkomst (persona): gehaald
- Moet vinden: 3 + 1 deels / 4 (r22: 3 + 1 deels)
- Stappen: 14 (r22: 11); gemak 5 (r22: 5), vertrouwen 5 (r22: 5)
- Mag niet: geen overtredingen

## Moet vinden
- Ondersteuningsteam Oost Achterhoek 085 124 7077 en Vraag & Advies Team 0543 49 33 33: gevonden.
- Huisarts/jeugdarts (GGD 088 443 3000): gevonden. Met "Angst" als eerste situatie begint stap 1 bij de huisarts.
- School: deels (intern begeleider, geen steunpunt).
- MEE Samen: gevonden.

## Ervaring
- **Fout in de site gevonden (ernst 2):** de woordenlijst markeert ook woorden in tekst die alleen voor schermlezers is (`.sr-only` in de legenda van de hulpsoorten). Daar stond een onzichtbare uitlegknop "wijkteam" buiten beeld (x ≈ 1709 px); Henk probeerde die twee keer te klikken (time-out, "span.dot intercepts pointer events"). Zelf nagemeten. Gevolg voor echte bezoekers: in die sectie telt het onzichtbare woord als "eerste keer", zodat een zichtbaar "wijkteam" daar geen uitleg krijgt. Oplossing: `.sr-only` toevoegen aan de lijst die de woordenlijst overslaat (Base.astro). Uitgesteld tot na deze ronde.
- Ernst 2: lang overzicht met vakwoorden (VAT, GGD, jeugd-GGZ, praktijkondersteuner jeugd).

## Onjuistheden
Geen.

## Vertrouwen in de agent
Goed in de rol; de mislukte klik komt door de site (zie boven), deels versterkt door de testtool die ook onzichtbare knoppen opsomt.
