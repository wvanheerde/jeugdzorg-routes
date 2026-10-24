# language: nl
Functionaliteit: Leeftijd van het kind
  De leeftijd is niet verplicht. Bij "Mijn kind wordt 18" is de leeftijd vanzelf "12 tot 18", zodat hulp voor jonge
  kinderen (zoals vergoede dyslexiezorg tot 13) uit het overzicht valt.

  Scenario: Bij "Mijn kind wordt 18" vraagt de voorpagina niet naar de leeftijd: die is 12 tot 18
    Gegeven ik open de voorpagina
    En ik als gemeente "Apeldoorn" kies
    Als ik kies "Er verandert iets"
    En ik kies "Mijn kind wordt 18"
    Dan zie ik de knop "12 tot 18" niet
    En gaat de link "Toon mijn overzicht" naar "l=12-18"

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

  Scenario: Bij 4 tot 12 noemt de leeftijdstip school
    Gegeven ik open het overzicht voor "Ik wil hulp aanvragen" in "Alphen aan den Rijn" met de situatie "Gedragsproblemen" en leeftijd "4 tot 12"
    Dan zie ik "informeer ook school"

  Scenario: Wijst stap 1 al naar school, dan zegt de leeftijdstip niet nog eens "informeer ook school"
    Gegeven ik open het overzicht voor "Ik wil hulp aanvragen" in "Alphen aan den Rijn" met de situaties "School loopt vast of kind zit thuis" en "Gedragsproblemen" en leeftijd "4 tot 12"
    Dan zie ik "Bij deze leeftijd:"
    En zie ik "vergoed dyslexieonderzoek tot 13 jaar"
    En zie ik "informeer ook school" niet

  # Bij vragen over de gang van zaken, regels of geld vraagt de voorpagina niet naar de leeftijd. Dan verandert die het
  # overzicht ook niet, ook niet als hij van een eerder bezoek nog bewaard is (startVervolgvragen in src/content/knelpunten).
  Scenario: Bij wachten staat geen leeftijdstip
    Gegeven ik open het overzicht voor "Wij wachten te lang" in "Utrecht" met leeftijd "4 tot 12"
    Dan zie ik "Bij deze leeftijd:" niet

  # Bij extra kosten of kinderbijslag hangt dubbele kinderbijslag af van de leeftijd (3 tot 18 jaar, SVB). Dan past de stap
  # zelf zich aan de leeftijd aan, zoals bij de verdiepingen (leeftijdsstap in src/content/knelpunten/geld.md).
  Scenario: Bij kinderbijslag zonder leeftijd noemt stap 1 de leeftijdsgrens
    Gegeven ik open het overzicht voor "Extra kosten of kinderbijslag" in "Utrecht"
    Dan begint stap 1 met "Is uw kind 3 tot 18 jaar"

  Scenario: Bij kinderbijslag en een kind van 4 tot 12 vraagt stap 1 alleen naar de zorg
    Gegeven ik open het overzicht voor "Extra kosten of kinderbijslag" in "Utrecht" met leeftijd "4 tot 12"
    Dan begint stap 1 met "Heeft uw kind veel meer zorg nodig dan andere kinderen?"
    En zie ik "Is uw kind 3 tot 18 jaar" niet
    En zie ik "Bij deze leeftijd:" niet

  Scenario: Bij kinderbijslag staat de kern in stap 1 zelf, met een link naar meer uitleg
    Fatima (ronde 27) moest ver omlaag naar de link; in ronde 29 bracht de link haar bovenaan de lange uitleg over geld en zocht ze zes schermen
    naar wat ze wilde weten: wat ze opschrijft en of ze moet terugbetalen.
    Gegeven ik open het overzicht voor "Extra kosten of kinderbijslag" in "Rotterdam" met leeftijd "4 tot 12"
    Dan staat in stap 1 de tekst "Schrijf op wat u extra doet"
    En staat in stap 1 de tekst "Beschrijft u eerlijk wat u doet? Dan doet u niets fout."
    En staat in stap 1 de link "Meer over dubbele kinderbijslag →"
    En gaat de link "Meer over dubbele kinderbijslag →" naar "landelijk/#dubbele-kinderbijslag-bij-intensieve-zorg"
    En zie ik "via de link onder deze stappen" niet

  Scenario: Bij kinderbijslag en een jong kind zegt stap 1 dat het vanaf 3 jaar kan
    Gegeven ik open het overzicht voor "Extra kosten of kinderbijslag" in "Utrecht" met leeftijd "Jonger dan 4"
    Dan begint stap 1 met "Is uw kind 3 jaar"
    En zie ik "Is uw kind jonger dan 3, dan kan dat nog niet."

  Scenario: Bij kinderbijslag en een kind van 18 of ouder zegt stap 1 dat het niet meer kan
    Gegeven ik open het overzicht voor "Extra kosten of kinderbijslag" in "Utrecht" met leeftijd "18 of ouder"
    Dan begint stap 1 met "Dubbele kinderbijslag is er voor kinderen van 3 tot 18 jaar"
    En zie ik de link "Mijn kind wordt 18"
    En zie ik "Bij deze leeftijd:" niet
