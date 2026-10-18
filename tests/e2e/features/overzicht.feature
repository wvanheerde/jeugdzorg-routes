# language: nl
Functionaliteit: Mijn overzicht
  Mijn overzicht toont bij de keuzes wat de ouder kan doen, bij wie in de gemeente, welke hulp bestaat en welke rechten gelden.
  Keuzes komen uit de url (?k, ?s, ?gemeente, ?l) of uit eerdere bezoeken.

  Scenario: Zonder keuzes vraagt het overzicht om een keuze
    Gegeven ik open de pagina "overzicht/"
    Dan is de hoofdkop "Mijn overzicht"
    En zie ik "nog niets gekozen"
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

  @mobiel
  Scenario: Verder op de pagina opent een zwevende knop de keuzes
    Gegeven ik open het overzicht voor "Ik wil hulp aanvragen" in "Utrecht" met de situatie "ADHD en ADD"
    Als ik een stuk naar beneden scroll
    En ik op de zwevende knop "Keuzes aanpassen" druk
    Dan staan de keuzes open
