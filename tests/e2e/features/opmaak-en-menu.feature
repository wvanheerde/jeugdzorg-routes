# language: nl
Functionaliteit: Opmaak, menu en voettekst
  Elke pagina heeft dezelfde kop met menu en dezelfde voettekst.

  Scenario: De paginatitel eindigt op de naam van de site
    Gegeven ik open de pagina "situaties/"
    Dan heeft de pagina de titel "Situaties en hulpsoorten · Jeugdzorg Routes"

  @desktop
  Scenario: Het hoofdmenu staat open op de laptop en wijst de huidige pagina aan
    Gegeven ik open de pagina "gemeenten/"
    Dan staat in het hoofdmenu:
      | Situaties       |
      | Gemeenten       |
      | Landelijk       |
      | Organisaties    |
      | Therapievormen  |
      | Over deze site  |
    En is "Gemeenten" in het hoofdmenu de huidige pagina

  @mobiel
  Scenario: Op de telefoon gaat het menu open met de knop "Menu"
    Gegeven ik open de voorpagina
    Dan is het menu dicht
    Als ik het menu open
    Dan staat in het hoofdmenu:
      | Situaties      |
      | Gemeenten      |
      | Over deze site |

  Scenario: De voettekst wijst naar de moeilijke woorden en de hulplijnen
    Gegeven ik open de voorpagina
    Dan gaat de link "Moeilijke woorden uitgelegd" naar "begrippen/"
    En zie ik een link om "0800 2000" te bellen
    En zie ik een link om "0800 0113" te bellen

  Scenario: Tussen genummerde stappen staat een lichte lijn, zonder verticale verbindingslijn
    Lijnen tussen de stappen lezen rustiger als er contactregels of vervolgstappen onder een stap staan (19-10).
    Vervolgstappen (A, B) horen bij hun stap en krijgen geen lijn.
    Gegeven ik open het overzicht voor "Hulp is afgewezen of te weinig" in "Utrecht"
    Dan staat tussen de genummerde stappen een lichte lijn
    En staat er geen verticale lijn tussen de genummerde stappen
    En staat tussen de vervolgstappen geen lijn

  Scenario: Staan er alleen verborgen stappen boven een stap, dan staat er geen lijn boven
    Gegeven ik open het overzicht voor "Wij wachten te lang" in "Utrecht"
    Als ik kies "Een plek bij een aanbieder"
    Dan heeft de eerste zichtbare stap geen lijn erboven
