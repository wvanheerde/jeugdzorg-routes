# language: nl
Functionaliteit: Leeftijd van het kind
  De leeftijd is niet verplicht. Bij "Mijn kind wordt 18" gaat "12 tot 18" vanzelf aan, zodat hulp voor jonge
  kinderen (zoals vergoede dyslexiezorg tot 13) uit het overzicht valt.

  Scenario: "Mijn kind wordt 18" zet de leeftijd "12 tot 18" aan
    Gegeven ik open de voorpagina
    Als ik kies "Mijn kind wordt 18"
    Dan is de knop "12 tot 18" aangezet

  Scenario: Wie de leeftijd daarna uitzet, houdt hem uit
    Gegeven ik open de voorpagina
    Als ik kies "Mijn kind wordt 18"
    En ik kies "12 tot 18"
    En ik de pagina opnieuw open
    Dan is de knop "12 tot 18" niet aangezet

  Scenario: Een al gekozen leeftijd blijft staan
    Gegeven ik open de voorpagina
    Als ik kies "4 tot 12"
    En ik kies "Mijn kind wordt 18"
    Dan is de knop "4 tot 12" aangezet
    En is de knop "12 tot 18" niet aangezet

  Scenario: Hulp voor jonge kinderen valt weg bij 12 tot 18
    Gegeven ik open het overzicht voor "Mijn kind wordt 18" in "Amsterdam" met de situatie "Dyslexie en dyscalculie" en leeftijd "12 tot 18"
    Dan zie ik de kop "Dyslexiezorg" niet
    En zie ik de kop "Behandeling van ernstige dyslexie" niet

  Scenario: Zonder leeftijd staat hulp voor jonge kinderen er wel
    Gegeven ik open het overzicht voor "Ik wil hulp aanvragen" in "Amsterdam" met de situatie "Dyslexie en dyscalculie"
    Dan zie ik de kop "Dyslexiezorg"
    En zie ik de kop "Behandeling van ernstige dyslexie"

  Scenario: Bij "Mijn kind wordt 18" geen leeftijdstip die naar dezelfde vraag verwijst
    Gegeven ik open het overzicht voor "Mijn kind wordt 18" in "Apeldoorn" met leeftijd "12 tot 18"
    Dan zie ik "Bij deze leeftijd:" niet

  Scenario: Bij andere vragen staat de leeftijdstip er wel
    Gegeven ik open het overzicht voor "Ik wil hulp aanvragen" in "Apeldoorn" met leeftijd "12 tot 18"
    Dan zie ik "Bij deze leeftijd:"
