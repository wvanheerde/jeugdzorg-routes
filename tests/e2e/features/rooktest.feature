# language: nl
Functionaliteit: Rooktest
  Controleert dat de testomgeving werkt: de site laadt en de klok staat vast op 18 oktober 2026.

  Scenario: De voorpagina laadt
    Gegeven ik open de voorpagina
    Dan zie ik "In welke gemeente woont u?"

  Scenario: De datum staat vast
    Gegeven ik open het overzicht voor "Mijn kind wordt 18" in "Apeldoorn"
    Als ik als geboortedatum "14-02-2009" invul
    Dan is de samenvatting "Uw kind wordt over ongeveer 17 weken 18 (14 februari 2027)."
