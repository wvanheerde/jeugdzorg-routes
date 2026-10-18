# language: nl
Functionaliteit: Situaties
  Per situatie staat welke route logisch is, wat helpt, welke hulp er is en wie u in uw gemeente belt.

  Scenario: De lijst met situaties en soorten hulp
    Gegeven ik open de pagina "situaties/"
    Dan is de hoofdkop "Situaties"
    En zie ik de kop "Welke soorten jeugdhulp bestaan er?"

  Scenario: De pagina van een situatie
    Gegeven ik open de pagina "situaties/adhd/"
    Dan is de hoofdkop "ADHD en ADD"
    En zie ik de koppen:
      | Welke route is logisch?                  |
      | Wat helpt, en waar het vaak misgaat      |
      | Welke hulp bestaat er?                   |
      | Voorbeeldbrieven                         |

  Scenario: Na het kiezen van de gemeente verschijnen de contactgegevens
    Gegeven ik open de pagina "situaties/adhd/"
    Als ik als gemeente "Utrecht" kies
    Dan zie ik "In Utrecht"
