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
      | Hulpmiddelen    |
    En staat "Over deze site" niet in het hoofdmenu
    En is "Gemeenten" in het hoofdmenu de huidige pagina

  @mobiel
  Scenario: Op de telefoon gaat het menu open met de knop "Menu"
    Gegeven ik open de voorpagina
    Dan is het menu dicht
    Als ik het menu open
    Dan staat in het hoofdmenu:
      | Situaties      |
      | Gemeenten      |
      | Hulpmiddelen   |

  @mobiel
  Abstract Scenario: Op de telefoon staat de knop "Menu" links naast het vergrootglas, op een heel smal scherm eronder (<breedte> pixels)
    Zoals op de laptop: het menu links van het vergrootglas, beide rechts (24-10). Op de iPhone 13 stond Menu eerst onder het logo.
    Gegeven het scherm is <breedte> pixels breed
    En ik open de voorpagina
    Dan staat de knop "Menu" <plek> het vergrootglas

    Voorbeelden:
      | breedte | plek         |
      | 360     | links naast  |
      | 390     | links naast  |
      | 320     | rechts onder |

  Scenario: De voettekst wijst naar over deze site, de moeilijke woorden en de hulplijnen
    "Over deze site" staat alleen in de voettekst, niet in het hoofdmenu (20-10).
    Gegeven ik open de voorpagina
    Dan gaat de link "Over deze site" naar "over/"
    En gaat de link "Moeilijke woorden uitgelegd" naar "begrippen/"
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
