# language: nl
Functionaliteit: Hulpmiddelen
  Alle hulpmiddelen van de site staan bij elkaar op één pagina, zodat een ouder ze terugvindt zonder de route opnieuw te
  lopen: het vel voor het gesprek, het dagboek in Word, de moeilijke woorden en alle voorbeeldbrieven (20-10).
  De moeilijke woorden zijn te lang voor deze pagina; daar gaat een link heen.

  Scenario: De pagina toont de hulpmiddelen om voor te bereiden en alle voorbeeldbrieven
    Gegeven ik open de pagina "hulpmiddelen/"
    Dan is de hoofdkop "Hulpmiddelen"
    En zie ik de koppen:
      | Voorbereiden     |
      | Voorbeeldbrieven |
    En gaat de link "Uw gesprek voorbereiden" naar "gesprek/"
    En gaat de link "Dagboek van twee weken" naar "downloads/dagboek-zorg-twee-weken.docx"
    En gaat de link "Moeilijke woorden uitgelegd" naar "begrippen/"
    En staan alle voorbeeldbrieven op de pagina

  @desktop
  Abstract Scenario: Op <pagina> wijst het menu "Hulpmiddelen" aan
    Gegeven ik open de pagina "<adres>"
    Dan is "Hulpmiddelen" in het hoofdmenu de huidige pagina

    Voorbeelden:
      | pagina                       | adres                          |
      | de pagina hulpmiddelen       | hulpmiddelen/                  |
      | een voorbeeldbrief           | brieven/bezwaar-beschikking/   |
      | het vel voor het gesprek     | gesprek/                       |
      | de moeilijke woorden         | begrippen/                     |

  Scenario: Het adres brieven/ gaat naar de voorbeeldbrieven op de pagina hulpmiddelen
    Gegeven ik open de pagina "brieven/"
    Dan staat in de url "hulpmiddelen/#brieven"
