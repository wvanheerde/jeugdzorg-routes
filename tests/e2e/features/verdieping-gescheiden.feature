# language: nl
Functionaliteit: Verdieping bij "Wij zijn uit elkaar"
  De ouder kiest wie het gezag heeft: samen, alleen de ouder zelf, alleen de andere ouder, of weet het niet. Toestemming
  van beide ouders en de rechter (vervangende toestemming, BW 1:253a) horen alleen bij gezamenlijk gezag; ook bij KIES
  geven de ouders met gezag toestemming. Heeft één ouder het gezag, dan valt dat weg en ziet de ouder wat bij die situatie
  hoort (BW 1:377b en 1:377c). Bij "Weet ik niet" staat hoe u het gezag nagaat (gezagsregister).
  Zie CONTENT.md, "Knelpunten: verdieping in Mijn overzicht".

  Scenario: Zonder antwoord staan de gewone stappen er
    Gegeven ik open het overzicht voor "Wij zijn uit elkaar" in "Tilburg"
    Dan staan de stappen in deze volgorde:
      | Dit kunt u zelf doen:                   |
      | Dit kunt u ook zelf doen:               |
      | Dit kunt u ook zelf doen:               |
      | Hebben jullie samen het gezag?          |
      | Wilt u weten wat u mag, of naar de rechter? |
      | Lukt praten met de andere ouder niet?   |
    En zie ik "zoals KIES, vraagt wel toestemming van beide ouders."
    En zie ik "wel toestemming van beide ouders nodig. Weigert de andere ouder?"
    En is er geen samenvatting

  Scenario: Het label "niet verplicht" staat rechts naast de kop
    Gegeven ik open het overzicht voor "Wij zijn uit elkaar" in "Tilburg"
    Dan staat het label "niet verplicht" rechts naast de kop

  Scenario: Bij gezamenlijk gezag blijven de stappen over toestemming en de rechter
    Gegeven ik open het overzicht voor "Wij zijn uit elkaar" in "Tilburg"
    Als ik kies "Wij samen"
    Dan is het verdiepingsblok ingeklapt
    En is de samenvatting "Jullie hebben samen het gezag."
    En staan de stappen in deze volgorde:
      | Dit kunt u zelf doen:                   |
      | Dit kunt u ook zelf doen:               |
      | Dit kunt u ook zelf doen:               |
      | Hebben jullie samen het gezag?          |
      | Wilt u weten wat u mag, of naar de rechter? |
      | Lukt praten met de andere ouder niet?   |
    En staat in de url "gezag=samen"

  Scenario: Heeft de ouder alleen het gezag, dan vallen toestemming en de rechter weg
    Gegeven ik open het overzicht voor "Wij zijn uit elkaar" in "Tilburg"
    Als ik kies "Alleen ik"
    Dan is de samenvatting "U heeft alleen het gezag."
    En staan de stappen in deze volgorde:
      | Dit kunt u zelf doen:                   |
      | Dit kunt u ook zelf doen:               |
      | Dit kunt u ook zelf doen:               |
      | Heeft u alleen het gezag?               |
      | Wilt u weten wat u mag, of naar de rechter? |
      | Lukt praten met de andere ouder niet?   |
    En zie ik "zoals KIES, vraagt toestemming van de ouder met gezag: dat bent u."
    En zie ik "vraagt wel toestemming van beide ouders" niet
    En zie ik "vervangende toestemming" niet
    En zie ik "U kunt al veel doen, ook zonder de andere ouder"
    En zie ik "wel toestemming van beide ouders nodig" niet
    En staat in de url "gezag=ik"

  Scenario: Heeft alleen de andere ouder het gezag, dan staat wat de ouder wel kan
    Gegeven ik open het overzicht voor "Wij zijn uit elkaar" in "Tilburg"
    Als ik kies "Alleen de andere ouder"
    Dan is de samenvatting "Alleen de andere ouder heeft het gezag."
    En staan de stappen in deze volgorde:
      | Dit kunt u zelf doen:                   |
      | Dit kunt u ook zelf doen:               |
      | Dit kunt u ook zelf doen:               |
      | Heeft alleen de andere ouder het gezag? |
      | Wilt u weten wat u mag, of naar de rechter? |
      | Lukt praten met de andere ouder niet?   |
    En zie ik "zoals KIES, vraagt toestemming van de ouder met gezag: dat is de andere ouder."
    En zie ik "vervangende toestemming" niet
    En zie ik "wel toestemming van beide ouders nodig" niet
    En staat in de url "gezag=ander"

  Scenario: Bij gezamenlijk gezag zegt de stap in gewone woorden wat de rechter kan
    Gegeven ik open het overzicht voor "Wij zijn uit elkaar" in "Tilburg"
    Als ik kies "Wij samen"
    Dan zie ik "Weigert de andere ouder? Dan kan de rechter toestemming geven, zodat de hulp toch kan beginnen"

  Scenario: Weet de ouder het niet, dan staat hoe het na te gaan is
    Gegeven ik open het overzicht voor "Wij zijn uit elkaar" in "Tilburg"
    Als ik kies "Weet ik niet"
    Dan is de samenvatting "U weet niet wie het gezag heeft."
    En staan de stappen in deze volgorde:
      | Dit kunt u zelf doen:                   |
      | Dit kunt u ook zelf doen:               |
      | Dit kunt u ook zelf doen:               |
      | Weet u niet wie het gezag heeft?        |
      | Hebben jullie samen het gezag?          |
      | Wilt u weten wat u mag, of naar de rechter? |
      | Lukt praten met de andere ouder niet?   |
    En staan onder stap "Weet u niet wie het gezag heeft?" de vervolgstappen:
      | Getrouwd of geregistreerd partner, bij de geboorte of later? |
      | Niet getrouwd, en uw kind erkend vóór 2023?                  |
      | Niet getrouwd, en uw kind erkend vanaf 2023?                 |
      | Wilt u het zeker weten?                                      |
    En staat de link naar "Gezagsregister" onder de vervolgstap "Wilt u het zeker weten?"
    En staat in de url "gezag=onbekend"

  Scenario: Bij een volgend bezoek staat het antwoord ingeklapt voorop
    Gegeven ik open het overzicht voor "Wij zijn uit elkaar" in "Tilburg"
    Als ik kies "Alleen ik"
    En ik het overzicht later opnieuw open
    Dan is het verdiepingsblok ingeklapt
    En is de samenvatting "U heeft alleen het gezag."
    En zie ik "vervangende toestemming" niet

  Scenario: Na "Aanpassen" staat de link naar de stappen naast "Wissen"
    Gegeven ik open het overzicht voor "Wij zijn uit elkaar" in "Tilburg"
    Als ik kies "Alleen ik"
    En ik kies "Aanpassen"
    Dan staat de link "De stappen zijn aangepast ↓" naast "Wissen"

  Scenario: Wissen zet alle stappen terug
    Gegeven ik open het overzicht voor "Wij zijn uit elkaar" in "Tilburg"
    Als ik kies "Alleen ik"
    En ik kies "Wissen"
    Dan staat in de url geen "gezag="
    En begint stap 4 met "Hebben jullie samen het gezag?"
    En zie ik "zoals KIES, vraagt wel toestemming van beide ouders."

  # Bij "Ik wil hulp aanvragen" staat dezelfde vraag als de situatie Scheiding gekozen is (persona-test Linda, 19-10: zij koos
  # niet de vraag over uit elkaar zijn, maar hulp aanvragen, en vond niets over gezag). Het antwoord geldt voor beide.

  Scenario: Bij hulp aanvragen met de situatie Scheiding staat de vraag naar het gezag
    Gegeven ik open het overzicht voor "Ik wil hulp aanvragen" in "Amersfoort" met de situatie "Scheiding"
    Dan zie ik "Mag u hulp regelen zonder de andere ouder?"
    En staan de stappen in deze volgorde:
      | Begin bij |
    En is er geen samenvatting

  Scenario: Bij hulp aanvragen zonder de situatie Scheiding staat de vraag er niet
    Gegeven ik open het overzicht voor "Ik wil hulp aanvragen" in "Amersfoort" met de situatie "ADHD en ADD"
    Dan zie ik "Wie heeft het gezag over uw kind?" niet

  Scenario: Bij hulp aanvragen komt na stap 1 de stap die bij het gezag hoort
    Gegeven ik open het overzicht voor "Ik wil hulp aanvragen" in "Amersfoort" met de situatie "Scheiding"
    Als ik kies "Weet ik niet"
    Dan is het verdiepingsblok ingeklapt
    En is de samenvatting "U weet niet wie het gezag heeft."
    En staan de stappen in deze volgorde:
      | Begin bij                               |
      | Weet u niet wie het gezag heeft?        |
      | Hebben jullie samen het gezag?          |
    En staan onder stap "Weet u niet wie het gezag heeft?" de vervolgstappen:
      | Getrouwd of geregistreerd partner, bij de geboorte of later? |
      | Niet getrouwd, en uw kind erkend vóór 2023?                  |
      | Niet getrouwd, en uw kind erkend vanaf 2023?                 |
      | Wilt u het zeker weten?                                      |
    En loopt de nummering van de stappen daarna door bij 4
    En staat in de url "gezag=onbekend"

  Scenario: Het antwoord bij hulp aanvragen geldt ook bij de vraag over uit elkaar zijn
    Gegeven ik open het overzicht voor "Ik wil hulp aanvragen" in "Amersfoort" met de situatie "Scheiding"
    Als ik kies "Alleen ik"
    Dan staan de stappen in deze volgorde:
      | Begin bij                 |
      | Heeft u alleen het gezag? |
    Als ik open het overzicht voor "Wij zijn uit elkaar" in "Amersfoort"
    Dan is het verdiepingsblok ingeklapt
    En is de samenvatting "U heeft alleen het gezag."
