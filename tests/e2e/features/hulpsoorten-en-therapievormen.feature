# language: nl
Functionaliteit: Hulpsoorten en therapievormen
  Elke soort hulp en elke therapievorm heeft een eigen pagina met wat het is, voor wie en hoe u het aanvraagt.

  Scenario: De pagina van een hulpsoort
    Gegeven ik open de pagina "hulpsoorten/ambulante-begeleiding/"
    Dan is de hoofdkop "Ambulante begeleiding"
    En zie ik de koppen:
      | Wat is het?             |
      | Voor wie is het?        |
      | Wat kunt u verwachten?  |
      | Zo vraagt u het aan     |

  Scenario: Therapievormen per situatie, met een toelichting
    Gegeven ik open de pagina "therapievormen/"
    Dan is de hoofdkop "Therapievormen per situatie"
    En zie ik "Niet volledig en geen behandeladvies."

  Scenario: De pagina van een therapievorm
    Gegeven ik open de pagina "therapievormen/cognitieve-gedragstherapie/"
    Dan is de hoofdkop "Cognitieve gedragstherapie (CGT)"
    En zie ik de koppen:
      | Wat is het en hoe werkt het?  |
      | Zo vraagt u het aan           |
      | Onderbouwing en vergoeding    |
