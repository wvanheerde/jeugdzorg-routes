# language: nl
Functionaliteit: Gemeenten
  Alle gemeenten staan op een lijst met een zoekveld; elke gemeente heeft een eigen pagina.

  Scenario: De lijst met gemeenten doorzoeken
    Gegeven ik open de pagina "gemeenten/"
    Dan is de hoofdkop "Gemeenten"
    Als ik "Noordenveld" zoek in "Zoek gemeente"
    Dan zie ik alleen de gemeente "Noordenveld"

  Scenario: Geen gemeente gevonden
    Gegeven ik open de pagina "gemeenten/"
    Als ik "Atlantis" zoek in "Zoek gemeente"
    Dan zie ik "Geen gemeente gevonden."

  Scenario: De pagina van een gemeente
    Gegeven ik open de pagina "gemeenten/utrecht/"
    Dan is de hoofdkop "Jeugdhulp in Utrecht"
    En zie ik de kop "Hier meldt u zich in Utrecht"
    En zie ik een belknop
    En zie ik de koppen:
      | Hoe krijg ik hulp?                          |
      | Waar heb ik recht op?                       |
      | Welke hulp is er?                           |
      | Hoe gaat het met de jeugdhulp in Utrecht?   |

  Scenario: Een link naar de ervaringen klapt die open
    Gegeven ik open de pagina "gemeenten/utrecht/#ervaringen"
    Dan staat het onderdeel "Lees wat we vonden" open
