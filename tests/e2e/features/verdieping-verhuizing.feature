# language: nl
Functionaliteit: Verdieping bij "Wij verhuizen"
  De ouder kan de nieuwe gemeente en de verhuisdatum invullen. De stappen krijgen dan een moment
  en het wijkteam van de nieuwe gemeente staat bij de stap waar het hoort.

  Achtergrond:
    Gegeven het is 18 oktober 2026

  Scenario: Zonder antwoorden staan de gewone stappen er
    Gegeven ik open het overzicht voor "Wij verhuizen" in "Utrecht"
    Dan begint stap 1 met "Meld de verhuizing"
    En is er geen samenvatting

  Scenario: Een nieuwe gemeente kiezen uit de suggesties
    Gegeven ik open het overzicht voor "Wij verhuizen" in "Utrecht"
    Als ik als nieuwe woonplaats "Almere" kies
    Dan staat in de url "naar=almere"
    En is de samenvatting "U verhuist van Utrecht naar Almere. Het wijkteam daar staat nu bij stap 3. Vul ook de datum in, dan ziet u wat u wanneer regelt."

  Scenario: Met een verhuisdatum krijgen de stappen een moment
    Gegeven ik open het overzicht voor "Wij verhuizen" in "Utrecht"
    Als ik als nieuwe woonplaats "Almere" kies
    En ik als verhuisdatum "01-12-2026" invul
    Dan begint stap 1 met "Nu, u verhuist over ongeveer 6 weken:"
    En begint stap 2 met "Vóór de verhuizing:"
    En begint stap 3 met "Rond de verhuizing (1 december 2026):"

  Scenario: Verhuizen binnen dezelfde gemeente is één stap
    Gegeven ik open het overzicht voor "Wij verhuizen" in "Utrecht"
    Als ik als nieuwe woonplaats "Utrecht" kies
    Dan begint stap 1 met "U verhuist binnen Utrecht."

  Scenario: De link naar de stappen verschijnt na een antwoord, naast "Wissen"
    Gegeven ik open het overzicht voor "Wij verhuizen" in "Utrecht"
    Dan zie ik de link "De stappen zijn aangepast ↓" niet
    Als ik als verhuisdatum "01-12-2026" invul
    Dan staat de link "De stappen zijn aangepast ↓" naast "Wissen"

  Scenario: Een onbekende plaats geeft een melding
    Gegeven ik open het overzicht voor "Wij verhuizen" in "Utrecht"
    Als ik "Xyzzy" typ in "Naar welke plaats of gemeente verhuist u?"
    En ik op "Tab" druk
    Dan zie ik bij het verdiepingsblok de melding "Deze plaats kennen we niet. Typ de eerste letters en kies uit de lijst die verschijnt."
