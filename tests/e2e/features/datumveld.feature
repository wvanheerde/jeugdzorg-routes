# language: nl
Functionaliteit: Datumveld
  Een datum typt u als dd-mm-jjjj; de streepjes komen vanzelf. Alleen de kalenderknop opent de kalender
  van het toestel. Een datum uit de kalender wordt pas doorgegeven als u even stilstaat.
  Zie src/lib/datumveld.ts.

  Scenario: Typen zonder streepjes
    Gegeven ik open het overzicht voor "Mijn kind wordt 18" in "Apeldoorn"
    Als ik "14022009" typ in "Wanneer is uw kind geboren?"
    Dan staat in "Wanneer is uw kind geboren?" de tekst "14-02-2009"
    En staat in de url "geboren=2009-02-14"

  Scenario: Typen met streepjes telt de streepjes niet dubbel
    Gegeven ik open het overzicht voor "Mijn kind wordt 18" in "Apeldoorn"
    Als ik "14-02-2009" typ in "Wanneer is uw kind geboren?"
    Dan staat in "Wanneer is uw kind geboren?" de tekst "14-02-2009"
    En staat in de url "geboren=2009-02-14"

  Scenario: Typen met punten of schuine strepen
    Gegeven ik open het overzicht voor "Mijn kind wordt 18" in "Apeldoorn"
    Als ik "14/02/2009" typ in "Wanneer is uw kind geboren?"
    Dan staat in "Wanneer is uw kind geboren?" de tekst "14-02-2009"

  @desktop
  Scenario: Een klik in het veld opent geen kalender, de kalenderknop wel
    Gegeven ik open het overzicht voor "Mijn kind wordt 18" in "Apeldoorn"
    Als ik in het veld "Wanneer is uw kind geboren?" klik
    Dan is de kalender 0 keer geopend
    Als ik op de kalenderknop bij "Wanneer is uw kind geboren?" klik
    Dan is de kalender 1 keer geopend

  @desktop
  Scenario: De kalender voor de geboortedatum loopt van 23 jaar geleden tot vandaag en opent bij 16 jaar geleden
    Gegeven ik open het overzicht voor "Mijn kind wordt 18" in "Apeldoorn"
    Als ik op de kalenderknop bij "Wanneer is uw kind geboren?" klik
    Dan loopt de kalender bij "Wanneer is uw kind geboren?" van "2003-10-18" tot "2026-10-18"
    En opent de kalender bij "Wanneer is uw kind geboren?" op "2010-10-18"

  @desktop
  Scenario: Met een ingevulde datum opent de kalender op die datum
    Gegeven ik open het overzicht voor "Mijn kind wordt 18" in "Apeldoorn"
    Als ik als geboortedatum "14-02-2009" invul
    En ik op de kalenderknop bij "Wanneer is uw kind geboren?" klik
    Dan opent de kalender bij "Wanneer is uw kind geboren?" op "2009-02-14"

  @desktop
  Scenario: De kalender voor de verhuisdatum loopt van een jaar terug tot twee jaar vooruit
    Gegeven ik open het overzicht voor "Wij verhuizen" in "Utrecht"
    Dan loopt de kalender bij "Wanneer verhuist u ongeveer?" van "2025-10-18" tot "2028-10-18"

  @mobiel
  Scenario: Op een aanraakscherm ligt de kalender alleen op de knop, zodat u in het veld kunt typen
    Gegeven ik open het overzicht voor "Mijn kind wordt 18" in "Apeldoorn"
    Dan ligt de kalender bij "Wanneer is uw kind geboren?" alleen op de kalenderknop
    Als ik op een aanraakscherm de kalenderknop bij "Wanneer is uw kind geboren?" aantik
    Dan opent de kalender bij "Wanneer is uw kind geboren?" op "2010-10-18"

  Scenario: Snel wisselende datums uit de kalender worden één keer doorgegeven
    Gegeven ik open het overzicht voor "Mijn kind wordt 18" in "Apeldoorn"
    Als de kalender bij "Wanneer is uw kind geboren?" snel achter elkaar de datums "2009-02-10, 2009-02-11, 2009-02-12, 2009-02-14" doorgeeft
    Dan staat in "Wanneer is uw kind geboren?" de tekst "14-02-2009"
    En staat in de url geen "geboren="
    En staat in de url "geboren=2009-02-14"

  Scenario: Bij het sluiten van de kalender wordt de datum meteen doorgegeven
    Gegeven ik open het overzicht voor "Mijn kind wordt 18" in "Apeldoorn"
    Als de kalender bij "Wanneer is uw kind geboren?" de datum "2009-02-14" doorgeeft en sluit
    Dan staat "geboren=2009-02-14" meteen in de url
