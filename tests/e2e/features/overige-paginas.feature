# language: nl
Functionaliteit: Landelijk, organisaties en over deze site

  Scenario: Landelijke rechten
    Gegeven ik open de pagina "landelijk/"
    Dan is de hoofdkop "Waar u landelijk recht op heeft"
    En zie ik de kop "De Jeugdwet in het kort"

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
