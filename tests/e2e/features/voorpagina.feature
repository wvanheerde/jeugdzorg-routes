# language: nl
Functionaliteit: Voorpagina en wegwijzer
  Op de voorpagina kiest de ouder de gemeente, de vraag, de leeftijd en wat er speelt.
  Daarna opent "Toon mijn overzicht" Mijn overzicht met die keuzes.

  Scenario: De voorpagina toont de wegwijzer
    Gegeven ik open de voorpagina
    Dan is de hoofdkop "Wegwijs in de jeugdzorg, per gemeente"
    En zie ik "Waar woont u?"
    En zie ik de knop "Mijn kind wordt 18"
    En zie ik de knop "12 tot 18"

  Scenario: De gekozen vraag wordt toegelicht
    Gegeven ik open de voorpagina
    Als ik kies "Mijn kind wordt 18"
    Dan zie ik "De jeugdhulp stopt bij 18 jaar, maar de hulp is nog nodig."

  Scenario: "Toon mijn overzicht" neemt de keuzes mee
    Gegeven ik open de voorpagina
    Als ik als gemeente "Apeldoorn" kies
    En ik kies "Mijn kind wordt 18"
    En ik kies "Verstandelijke beperking"
    Dan gaat de link "Toon mijn overzicht" naar "gemeente=apeldoorn"
    En gaat de link "Toon mijn overzicht" naar "k=wordt-18"
    En gaat de link "Toon mijn overzicht" naar "s=verstandelijke-beperking"
    En gaat de link "Toon mijn overzicht" naar "l=12-18"

  Scenario: Zonder gemeente vraagt de site eerst om de gemeente
    Gegeven ik open de voorpagina
    Als ik kies "Mijn kind wordt 18"
    Dan zie ik "Kies eerst uw gemeente. Dan ziet u wie u daar kunt bellen."

  Scenario: Bij geld is een gemeente niet nodig
    Gegeven ik open de voorpagina
    Als ik kies "Extra kosten of kinderbijslag"
    Dan zie ik "Kies eerst uw gemeente." niet

  Scenario: De gemeente zoeken op woonplaats
    Gegeven ik open de voorpagina
    Als ik zoek op woonplaats "Roden"
    En ik de suggestie "Roden (gemeente Noordenveld)" kies
    Dan is als gemeente "Noordenveld" gekozen
    En zie ik "Gekozen: gemeente Noordenveld."

  Scenario: Bij verhuizen vraagt de site waar u nu woont
    Gegeven ik open de voorpagina
    Als ik kies "Wij verhuizen"
    Dan zie ik "Waar woont u nu?"

  Scenario: Keuzes worden onthouden en zijn te wissen
    Gegeven ik open de voorpagina
    Als ik als gemeente "Apeldoorn" kies
    En ik kies "Mijn kind wordt 18"
    En ik de pagina opnieuw open
    Dan is als gemeente "Apeldoorn" gekozen
    En is de knop "Mijn kind wordt 18" aangezet
    Als ik kies "Keuzes wissen"
    Dan is als gemeente "Kies uw gemeente…" gekozen
    En is de knop "Mijn kind wordt 18" niet aangezet

  Scenario: Gemeenten zoeken op provincie
    Gegeven ik open de voorpagina
    Als ik "Drenthe" zoek in "Zoek gemeente"
    Dan zie ik 12 kaarten met "a.card[data-naam]"

  @mobiel
  Scenario: Na een keuze staat onderaan een balk naar het overzicht
    Gegeven ik open de voorpagina
    Als ik als gemeente "Apeldoorn" kies
    En ik kies "Mijn kind wordt 18"
    Dan zie ik onderaan de balk "Gekozen: Apeldoorn · Mijn kind wordt 18"

  @mobiel
  Scenario: De hint "Meer op deze pagina" verdwijnt na scrollen
    Gegeven ik open de voorpagina
    Dan zie ik de hint "Meer op deze pagina"
    Als ik een stuk naar beneden scroll
    Dan zie ik de hint niet meer
