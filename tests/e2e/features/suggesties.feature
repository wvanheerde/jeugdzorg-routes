# language: nl
Functionaliteit: Suggestielijst bij plaatsen
  Bij het typen van een plaats verschijnen hooguit acht treffers: eerst wat met de letters begint.
  Gezocht wordt in de plaatsnaam, niet in "(gemeente …)". Zie src/lib/suggesties.ts.

  Scenario: Treffers voor "alm"
    Gegeven ik open het overzicht voor "Wij verhuizen" in "Utrecht"
    Als ik "alm" typ in "Naar welke plaats of gemeente verhuist u?"
    Dan zie ik de suggesties:
      | Almelo                     |
      | Almere                     |
      | Almen (gemeente Lochem)    |
      | Almkerk (gemeente Altena)  |

  Scenario: Hooguit acht treffers
    Gegeven ik open het overzicht voor "Wij verhuizen" in "Utrecht"
    Als ik "be" typ in "Naar welke plaats of gemeente verhuist u?"
    Dan zie ik 8 kaarten met ".suggesties:not([hidden]) li"

  Scenario: Een gemeente niet dubbel als woonplaats
    Gegeven ik open het overzicht voor "Wij verhuizen" in "Utrecht"
    Als ik "almere" typ in "Naar welke plaats of gemeente verhuist u?"
    Dan zie ik geen suggesties

  @desktop
  Scenario: Kiezen met de pijltjes en Enter
    Gegeven ik open het overzicht voor "Wij verhuizen" in "Utrecht"
    Als ik "rod" typ in "Naar welke plaats of gemeente verhuist u?"
    Dan zie ik de suggestie "Roden (gemeente Noordenveld)"
    Als ik op "pijl omlaag" druk
    Dan is de suggestie "Roden (gemeente Noordenveld)" gemarkeerd
    Als ik op "Enter" druk
    Dan staat in de url "naar=noordenveld"
    En zie ik geen suggesties

  Scenario: Escape sluit de lijst
    Gegeven ik open het overzicht voor "Wij verhuizen" in "Utrecht"
    Als ik "rod" typ in "Naar welke plaats of gemeente verhuist u?"
    En ik op "Escape" druk
    Dan zie ik geen suggesties

  Abstract Scenario: Woonplaatsen staan er zonder de toevoegingen uit de registratie (<plek>)
    De registratie schrijft "Winterswijk Huppel" en "Spijk Gem Zevenaar"; met de gemeente erachter is dat dubbel (24-10, src/lib/woonplaatsen.ts).
    Gegeven <begin>
    Als <typen>
    Dan zie ik de suggestie "Huppel (gemeente Winterswijk)"
    Maar zie ik "Winterswijk Huppel" niet

    Voorbeelden:
      | plek            | begin                                                        | typen                                                       |
      | voorpagina      | ik open de voorpagina                                        | ik zoek op woonplaats "hupp"                                |
      | bij verhuizen   | ik open het overzicht voor "Wij verhuizen" in "Utrecht"      | ik "hupp" typ in "Naar welke plaats of gemeente verhuist u?" |

  Scenario: "Gem" en de provinciecode staan niet in de suggestie
    Gegeven ik open de voorpagina
    Als ik zoek op woonplaats "spijk"
    Dan zie ik de suggestie "Spijk (gemeente Zevenaar)"
    Maar zie ik "Spijk Gem Zevenaar" niet

