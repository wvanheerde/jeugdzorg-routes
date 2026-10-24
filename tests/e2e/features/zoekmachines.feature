# language: nl
Functionaliteit: Zoekmachines en AI-crawlers
  Zoekmachines mogen de site lezen; crawlers die teksten verzamelen om AI te trainen niet.
  Pagina's met persoonlijke keuzes (Mijn overzicht) staan niet in de sitemap.

  Scenario: robots.txt weert trainingscrawlers en wijst naar de sitemap
    Gegeven ik open de voorpagina
    Dan bevat "robots.txt" de regel "User-agent: GPTBot"
    En bevat "robots.txt" de regel "User-agent: *"
    En bevat "robots.txt" de tekst "Sitemap:"

  Scenario: De sitemap bevat de gemeenten maar niet Mijn overzicht
    Gegeven ik open de voorpagina
    Dan bevat "sitemap.xml" de tekst "/gemeenten/utrecht/"
    En bevat "sitemap.xml" niet de tekst "/overzicht/"

  Scenario: Een gemeentepagina is te vinden op "jeugdzorg" en de naam van de gemeente
    Ouders zoeken op "jeugdzorg <gemeente>"; de pagina heette "Jeugdhulp in …" (24-10).
    Gegeven ik open de pagina "gemeenten/utrecht/"
    Dan is de hoofdkop "Jeugdzorg in Utrecht"
    En heeft de pagina de titel "Jeugdzorg in Utrecht: hulp vragen en waar u terechtkunt · Jeugdzorg Routes"
    En begint de beschrijving voor zoekmachines met "Jeugdzorg in Utrecht: u meldt zich bij"
    En is het kruimelpad voor zoekmachines "Jeugdzorg Routes › Gemeenten › Utrecht"

  Scenario: Onder de kop staan de woonplaatsen van de gemeente
    Wie zoekt op "jeugdzorg Bilthoven", vindt zo de pagina van De Bilt.
    Gegeven ik open de pagina "gemeenten/de-bilt/"
    Dan staan de woonplaatsen van de gemeente onder de kop

  Scenario: Woonplaatsen staan er zoals ouders ze kennen, zonder toevoegingen uit de registratie
    De registratie schrijft "Winterswijk Huppel" en "Spijk Gem Zevenaar"; op de pagina van de gemeente is dat dubbel (24-10).
    Gegeven ik open de pagina "gemeenten/winterswijk/"
    Dan zie ik "Huppel"
    Maar zie ik "Winterswijk Huppel" niet

  Scenario: Bij een gemeente met veel woonplaatsen staan de eerste in beeld en de rest achter "en … andere"
    Gegeven ik open de pagina "gemeenten/sudwest-fryslan/"
    Dan staan de woonplaatsen van de gemeente onder de kop
    En zie ik "andere woonplaatsen"

  Scenario: De sitemap zegt per gemeente wanneer de pagina is nagekeken
    Gegeven ik open de voorpagina
    Dan bevat "sitemap.xml" de tekst "<lastmod>"

