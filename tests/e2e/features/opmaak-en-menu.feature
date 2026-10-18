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
