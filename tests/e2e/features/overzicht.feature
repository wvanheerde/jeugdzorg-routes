# language: nl
Functionaliteit: Mijn overzicht
  Mijn overzicht toont bij de keuzes wat de ouder kan doen, bij wie in de gemeente, welke hulp bestaat en welke rechten gelden.
  Keuzes komen uit de url (?k, ?s, ?gemeente, ?l) of uit eerdere bezoeken. De ouder kiest ze op de voorpagina; in het
  overzicht staan ze alleen als samenvatting, met een link terug naar de voorpagina (20-10: de keuzes op twee plekken
  bijhouden voegde weinig toe).

  Scenario: Bovenaan staat een link terug naar de voorpagina
    Gegeven ik open het overzicht voor "Ik wil hulp aanvragen" in "Utrecht"
    Dan zie ik de link "← Terug naar de voorpagina"

  Scenario: De keuzes zijn in het overzicht niet aan te passen
    Gegeven ik open het overzicht voor "Ik wil hulp aanvragen" in "Utrecht" met de situatie "ADHD en ADD"
    Dan zie ik "Utrecht · Ik heb nog geen hulp · ADHD en ADD"
    En zie ik de link "Keuzes aanpassen" niet
    En zie ik de knop "Keuzes aanpassen" niet
    En zie ik "Waar woont u?" niet
    En zie ik de knop "ADHD en ADD" niet

  Abstract Scenario: "Uw keuzes" noemt de keuze met de woorden van de voorpagina
    Henk en Lisa kozen "Ik zoek hulp voor mijn kind" en lazen hier "Ik wil hulp aanvragen" (ronde 27).
    Gegeven ik open het overzicht voor "<vraag>" in "Utrecht"
    Dan zie ik "Utrecht · <keuze>"

    Voorbeelden:
      | vraag                                       | keuze                                   |
      | Ik wil hulp aanvragen                       | Ik heb nog geen hulp                    |
      | Ik maak me zorgen om een kind van een ander | Ik heb zorgen om een kind van een ander |
      | Wij wachten te lang                         | Wij wachten te lang                     |

  Scenario: Zonder keuzes wijst het overzicht naar de voorpagina
    Gegeven ik open de pagina "overzicht/"
    Dan is de hoofdkop "Mijn overzicht"
    En zie ik "Kies op de voorpagina uw gemeente en uw situatie. Dan ziet u hier wat u kunt doen."
    En zie ik de link "← Terug naar de voorpagina"
    En zie ik de kop "Wat kunt u doen" niet

  Scenario: Het overzicht mag niet in zoekmachines
    Gegeven ik open de pagina "overzicht/"
    Dan mag de pagina niet in zoekmachines

  Scenario: De keuzes staan bovenaan samengevat
    Gegeven ik open het overzicht voor "Mijn kind wordt 18" in "Apeldoorn" met de situatie "Verstandelijke beperking" en leeftijd "12 tot 18"
    Dan zie ik "Apeldoorn · Mijn kind wordt 18 · Verstandelijke beperking · 12 tot 18 jaar"

  Scenario: Hulp aanvragen met een gemeente: eerst het wijkteam, met belknop
    Gegeven ik open het overzicht voor "Ik wil hulp aanvragen" in "Utrecht"
    Dan zie ik de kop "Wat kunt u doen"
    En zie ik de kop "Hier meldt u zich in Utrecht"
    En zie ik een belknop

  Scenario: Een vraag geeft een eigen kop bij "Wat kunt u doen"
    Gegeven ik open het overzicht voor "Wij wachten te lang" in "Utrecht"
    Dan zie ik de kop "Wat kunt u doen: wij wachten te lang"
    En zie ik "Wordt het erger terwijl u wacht?"

  Scenario: Bij "Het kan niet wachten" staan de hulpnummers, ook zonder gemeente
    Gegeven ik open de pagina "overzicht/?k=spoed"
    Dan zie ik een link om "0800 2000" te bellen
    En zie ik "Kies uw gemeente om de contactgegevens te zien." niet

  Scenario: Een gemeente die nog niet op de site staat
    Gegeven ik open de pagina "overzicht/?k=beginnen&gemeente=_overig"
    Dan zie ik "Uw gemeente staat nog niet op deze site."

  Scenario: Met een situatie verschijnen hulp, therapievormen, rechten en organisaties
    Gegeven ik open het overzicht voor "Ik wil hulp aanvragen" in "Utrecht" met de situatie "ADHD en ADD"
    Dan zie ik de koppen:
      | Welke hulp bestaat er?                |
      | Welke therapievormen kunnen passen?   |
      | Verdieping per situatie               |
      | Rechten en regelingen                 |
      | Organisaties die hierbij passen       |

  Scenario: Begint de situatie op school, dan eerst de stappen met school en de aanvraag van jeugdhulp ingeklapt
    Gegeven ik open het overzicht voor "Ik wil hulp aanvragen" in "Alphen aan den Rijn" met de situatie "School loopt vast of kind zit thuis"
    Dan staan de stappen in deze volgorde:
      | Begin bij school.                                   |
      | Vraag school schriftelijk om een gesprek            |
      | Komt u er met school niet uit                       |
      | Speelt er thuis of bij uw kind meer                 |
      | Vraag na elk gesprek om de afspraken op papier      |
    En zie ik "Voorbeeldbrief gesprek met school"
    En zie ik "Is er toch jeugdhulp nodig? Zo vraagt u die aan"
    En zie ik "Vraag vóór het eerste gesprek een cliëntondersteuner" niet
    En zie ik "Vraag ook om het besluit van de gemeente op papier" niet

  Abstract Scenario: Bij twee situaties maakt de volgorde van kiezen niet uit, en stap 1 noemt beide ingangen
    Eerst bepaalde de eerst gekozen situatie het hele advies (23-10). Nu gaat de situatie voor die het meest bepaalt waar u
    begint: onveiligheid thuis, dan wat niet kan wachten (een route met spoed), dan wat geen lichte start heeft, dan de volgorde
    op de voorpagina. Begint de andere situatie ergens anders, dan staat die ingang ook in stap 1. Eigen stappen van een situatie
    (zoals school loopt vast) blijven staan, en de aanvraag van jeugdhulp is alleen ingeklapt als geen enkele situatie erom vraagt.
    Gegeven ik open het overzicht voor "Ik wil hulp aanvragen" in "Alphen aan den Rijn" met de situaties "<eerst>" en "<daarna>"
    Dan staan de stappen in deze volgorde:
      | Begin bij school.                              |
      | Vraag school schriftelijk om een gesprek       |
      | Komt u er met school niet uit                  |
      | Speelt er thuis of bij uw kind meer            |
      | Vraag na elk gesprek om de afspraken op papier |
      | Vraag vóór het eerste gesprek een cliëntondersteuner |
      | Zet uw vraag op papier                         |
      | Vertel eerlijk en volledig                     |
      | Vindt u de stap spannend?                      |
      | Vraag na het gesprek om een verslag op papier  |
    En zie ik "Gedragsproblemen? Ga daarvoor ook naar het wijkteam van uw gemeente."
    En zie ik "Het wijkteam in Alphen aan den Rijn:"
    En zie ik "Is er toch jeugdhulp nodig? Zo vraagt u die aan" niet

    Voorbeelden:
      | eerst                              | daarna                             |
      | School loopt vast of kind zit thuis | Gedragsproblemen                   |
      | Gedragsproblemen                   | School loopt vast of kind zit thuis |

  Abstract Scenario: Een lichte start gaat niet voor een situatie die om jeugdhulp vraagt
    Gegeven ik open het overzicht voor "Ik wil hulp aanvragen" in "Utrecht" met de situaties "<eerst>" en "<daarna>"
    Dan begint stap 1 met "Begin bij het wijkteam van uw gemeente."
    En zie ik "Vraag vóór het eerste gesprek een cliëntondersteuner"
    En zie ik "Is er toch jeugdhulp nodig? Zo vraagt u die aan" niet

    Voorbeelden:
      | eerst            | daarna           |
      | Scheiding        | Gedragsproblemen |
      | Gedragsproblemen | Scheiding        |

  Abstract Scenario: Wat niet kan wachten gaat voor, de eigen stappen van de andere situatie blijven
    Gegeven ik open het overzicht voor "Ik wil hulp aanvragen" in "Utrecht" met de situaties "<eerst>" en "<daarna>"
    Dan begint stap 1 met "Begin bij de huisarts of jeugdarts."
    En zie ik "School loopt vast of kind zit thuis? Ga daarvoor ook naar school."
    En begint stap 2 met "Vraag school schriftelijk om een gesprek"

    Voorbeelden:
      | eerst                               | daarna                              |
      | School loopt vast of kind zit thuis | Eetstoornis                         |
      | Eetstoornis                         | School loopt vast of kind zit thuis |

  Scenario: Bij "Extra kosten of kinderbijslag" blijven alleen de rechten en regelingen
    Gegeven ik open de pagina "overzicht/?k=geld&s=adhd"
    Dan zie ik de kop "Rechten en regelingen"
    En zie ik de kop "Welke hulp bestaat er?" niet

  Scenario: Eerder gekozen gemeente wordt onthouden
    Gegeven ik heb eerder gekozen voor de gemeente "Utrecht"
    Als ik open de pagina "overzicht/?k=beginnen"
    Dan zie ik de kop "Hier meldt u zich in Utrecht"

  @desktop
  Scenario: De zijnavigatie toont alleen de onderdelen die er zijn
    Gegeven ik open het overzicht voor "Ik wil hulp aanvragen" in "Utrecht" met de situatie "ADHD en ADD"
    Dan staat in de zijnavigatie "Welke hulp"
    En staat in de zijnavigatie "Therapievormen"
    Als ik open de pagina "overzicht/?k=geld&s=adhd"
    Dan staat in de zijnavigatie niet "Welke hulp"
    En staat in de zijnavigatie "Rechten en regelingen"

  Scenario: Bij een contact onder een stap staan telefoon, e-mail en website
    Gegeven ik open het overzicht voor "Ik wil hulp aanvragen" in "Utrecht" met de situatie "ADHD en ADD"
    Dan staan bij de contacten onder de stappen telefoon, e-mail en website zoals "Utrecht" ze heeft

  Scenario: Ook in de regel "Liever eerst het wijkteam?" staan telefoon, e-mail en website
    Gegeven ik open het overzicht voor "Ik wil hulp aanvragen" in "Haarlem" met de situatie "Angst of somberheid"
    Dan zie ik "Dat mag ook:"
    En staan bij de contacten onder de stappen telefoon, e-mail en website zoals "Haarlem" ze heeft

  Scenario: Ook bij het wijkteam onder een latere stap staan telefoon, e-mail en website
    Gegeven ik open het overzicht voor "Wij wachten te lang" in "Haarlem"
    Dan staan bij de contacten onder de stappen telefoon, e-mail en website zoals "Haarlem" ze heeft
