# language: nl
Functionaliteit: Landelijk, organisaties en over deze site

  Scenario: Landelijke rechten
    Gegeven ik open de pagina "landelijk/"
    Dan is de hoofdkop "Waar u landelijk recht op heeft"
    En zie ik de kop "De Jeugdwet in het kort"

  Scenario: Bij de rechten als ouder staat wie toestemming geeft voor hulp
    Ook wie niet via "Wij zijn uit elkaar" komt, vindt daar of de andere ouder moet meebeslissen (Linda, ronde 25).
    Gegeven ik open de pagina "landelijk/"
    Dan zie ik de kop "Wie geeft toestemming voor hulp? (gezag)"
    En zie ik "vraag dan een gratis uittreksel aan uit het gezagsregister"

  Scenario: Op Landelijk staat hoe het met de jeugdhulp in Nederland gaat, uit het onderzoek bij alle gemeenten
    Het beeld komt uit de 342 gemeentepagina's en landelijke bronnen (23-10). Eigen tellingen staan er als eigen telling, met de datum. Elk onderwerp sluit af met een korte conclusie, zonder links (24-10).
    Gegeven ik open de pagina "landelijk/"
    Dan zie ik de kop "Hoe gaat het met de jeugdhulp in Nederland?"
    En zie ik de koppen:
      | Wachten                |
      | Hoe de toegang werkt   |
      | Ervaringen van ouders  |
      | Steun en geld          |
      | Zo hebben we geteld    |
    En zie ik "Dit zijn onze eigen tellingen"
    En zie ik "Kort gezegd: wachten op jeugdhulp speelt in veel gemeenten"
    Maar zie ik "Wat betekent dit voor u?" niet

  @mobiel
  Scenario: Op de telefoon schuift de inhoudsopgave met pijlknoppen
    Gegeven ik open de pagina "landelijk/"
    Dan heeft de inhoudsopgave rechts een pijl "Meer onderwerpen"
    Als ik op de pijl "Meer onderwerpen" druk
    Dan heeft de inhoudsopgave links een pijl "Vorige onderwerpen"

  Scenario: Organisaties doorzoeken
    Gegeven ik open de pagina "organisaties/"
    Dan is de hoofdkop "Organisaties die u verder helpen"
    Als ik "xyzzy" zoek in "Zoek organisatie"
    Dan zie ik "Geen organisatie gevonden."

  Scenario: Over deze site
    Gegeven ik open de pagina "over/"
    Dan is de hoofdkop "Over deze site"
    En zie ik de koppen:
      | Een fout melden |
      | Privacy         |
