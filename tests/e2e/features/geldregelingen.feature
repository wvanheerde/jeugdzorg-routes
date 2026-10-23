# language: nl
Functionaliteit: Geld en regelingen van een gemeente
  Elke gemeentepagina heeft een blok "Geld en regelingen": de regelingen van de gemeente (veld geldregelingen), per soort onder een
  eigen kop. Eerst wat met de zorg voor het kind te maken heeft; daaronder, onder "Regelingen bij een laag inkomen", de regelingen voor
  iedereen met een laag inkomen (zorgverzekering, zorgkosten alleen voor de ouder zelf, bijzondere bijstand, sport, school en
  cultuur), met een zin waarom ze erbij staan. Op de lijst met gemeenten kan de ouder filteren op soort regeling. Alle gemeenten zijn onderzocht; staat een gemeente
  niet in het filter, dan is die regeling daar niet gevonden, en dat zegt de uitleg. Welke gemeente welke regeling heeft,
  verandert per onderzoeksronde; de scenario's kiezen daarom een gemeente uit de gegevens.
  Zie CONTENT.md, "Gemeenten: geldregelingen".

  Scenario: De gemeentepagina toont de regelingen per soort
    Gegeven ik open de pagina van een gemeente met een regeling voor "meerkosten"
    Dan zie ik de kop "Geld en regelingen"
    En staat de regeling van die gemeente voor "meerkosten" onder de kop "Extra kosten bij ziekte of beperking"
    En gaat de link "Welke regelingen passen bij u?" naar de regelingencheck voor die gemeente

  Scenario: Filteren op een soort regeling
    Gegeven ik open de pagina "gemeenten/"
    Als ik kies "Extra kosten bij ziekte of beperking"
    Dan zie ik alleen de gemeenten met een regeling voor "meerkosten"
    En zie ik hoeveel gemeenten er gevonden zijn
    En zie ik "Alle gemeenten zijn onderzocht op regelingen. Staat een gemeente er niet bij, dan is die regeling daar niet gevonden."

  Scenario: Regelingen voor een laag inkomen staan apart, met uitleg waarom ze erbij staan
    Gegeven ik open de pagina van een gemeente met een regeling voor "meedoen"
    Dan staat de regeling van die gemeente voor "meedoen" onder de kop "Sport, school en cultuur voor kinderen"
    En staat de kop "Sport, school en cultuur voor kinderen" onder "Regelingen bij een laag inkomen"
    En zie ik "Zorg voor een kind kost vaak tijd en geld, en leidt soms tot minder inkomen. Deze regelingen zijn er voor iedereen met een laag inkomen; ze kunnen extra kosten helpen dragen."

  Scenario: Een zorgkostenregeling alleen voor de ouder zelf staat bij de regelingen voor een laag inkomen
    Gegeven ik open de pagina van een gemeente met een zorgkostenregeling alleen voor de ouder zelf
    Dan staat die regeling onder "Regelingen bij een laag inkomen"

  Scenario: Een zorgkostenregeling die ook voor het kind geldt, blijft bovenaan
    Gegeven ik open de pagina van een gemeente met een zorgkostenregeling die ook voor het kind geldt
    Dan staat die regeling niet onder "Regelingen bij een laag inkomen"

  Scenario: Regelingen voor de zorg voor het kind staan bovenaan, niet onder het kopje voor een laag inkomen
    Gegeven ik open de pagina van een gemeente met een regeling voor "meerkosten"
    Dan staat de kop "Extra kosten bij ziekte of beperking" niet onder "Regelingen bij een laag inkomen"
    En zie ik "Regelingen van"
    En zie ik "of met een laag inkomen" niet

  @desktop
  Scenario: Op een computer staan de keuzes voor het filter op hooguit drie regels
    Gegeven ik open de pagina "gemeenten/"
    Dan staan de keuzes onder "Gemeenten met een regeling voor:" op hooguit 3 regels

  Scenario: Twee soorten tegelijk: alleen gemeenten die beide hebben
    Gegeven ik open de pagina "gemeenten/"
    Als ik kies "Extra kosten bij ziekte of beperking"
    En ik kies "Zorgverzekering bij een laag inkomen"
    Dan zie ik alleen de gemeenten met een regeling voor "meerkosten" en "zorgverzekering"

  Scenario: Filter en zoekveld samen
    Gegeven ik open de pagina "gemeenten/"
    Als ik kies "Extra kosten bij ziekte of beperking"
    En ik zoek de naam van een gemeente zonder regeling voor "meerkosten" in "Zoek gemeente"
    Dan zie ik "Geen gemeente gevonden."

  Scenario: Het filter weer uitzetten toont alle gemeenten
    Gegeven ik open de pagina "gemeenten/"
    Als ik kies "Extra kosten bij ziekte of beperking"
    En ik kies "Extra kosten bij ziekte of beperking"
    Dan zie ik alle gemeenten
    En zie ik "Alle gemeenten zijn onderzocht op regelingen" niet
