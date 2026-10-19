# language: nl
Functionaliteit: Uw gesprek met het wijkteam voorbereiden
  Een vel om af te drukken en met de hand in te vullen: de contacten in de gemeente, wat er speelt, een dagboek van een
  week met slechte en betere dagen, zinnen die kunnen helpen, vragen om te stellen en ruimte voor afspraken.
  De site bewaart niets van wat de ouder invult: alles gaat op papier. Teksten komen uit de bestaande bronnen (de
  voorbeeldbrief "Hulpvraag aan het wijkteam" en de landelijke uitleg "Hulp vragen"), zodat ze niet uit elkaar lopen.
  Zie docs/onderzoek/concept-gespreksvragen-2026-10-19.md voor de vragen en hun bronnen.

  Scenario: Het vel heeft alle onderdelen
    Gegeven ik open de pagina "gesprek/"
    Dan is de hoofdkop "Uw gesprek met het wijkteam voorbereiden"
    En zie ik de koppen:
      | Uw contacten                  |
      | Uw vraag op papier            |
      | Slechte en betere dagen       |
      | Zinnen die kunnen helpen      |
      | Vragen die u kunt stellen     |
      | Na het gesprek                |

  Scenario: De invulvakken komen uit de voorbeeldbrief, de zinnen uit de landelijke uitleg
    Gegeven ik open de pagina "gesprek/"
    Dan zie ik "Wat wij al geprobeerd hebben"
    En zie ik "Wat wij willen bereiken"
    En zie ik "Ik vraag hulp omdat ik goed voor mijn kind wil blijven zorgen."

  Scenario: Het dagboek heeft een week, met slechte en betere dagen
    Gegeven ik open de pagina "gesprek/"
    Dan heeft het dagboek 7 dagen om in te vullen
    En zie ik "slechte dag"
    En zie ik "betere dag"
    En zie ik "gemiddelde dag" niet

  Scenario: Vragen voor het begin, het gesprek zelf en het eind
    Gegeven ik open de pagina "gesprek/"
    Dan zie ik "Mag ik iemand meenemen"
    En zie ik "Kunnen we zelf een plan maken met mensen om ons heen"
    En zie ik "Wie is mijn vaste contactpersoon"

  Scenario: Zonder gemeente zijn er lege regels voor de contacten
    Gegeven ik open de pagina "gesprek/"
    Dan zie ik "Waar woont u?"
    En staan er geen contacten van een gemeente op het vel

  Scenario: Met een gekozen gemeente staan het wijkteam en de cliëntondersteuner op het vel
    Gegeven ik heb eerder gekozen voor de gemeente "Utrecht"
    En ik open de pagina "gesprek/"
    Dan staan het wijkteam en de cliëntondersteuner van de gemeente op het vel

  Scenario: Op papier geen keuzelijst, wel het vel
    Gegeven ik heb eerder gekozen voor de gemeente "Utrecht"
    En ik open de pagina "gesprek/"
    En ik het afdrukvoorbeeld bekijk
    Dan zie ik "Waar woont u?" niet
    Maar staan het wijkteam en de cliëntondersteuner van de gemeente op het vel
    En zie ik de kop "Vragen die u kunt stellen"

  Scenario: Mijn overzicht en de landelijke uitleg verwijzen naar het vel
    Gegeven ik open het overzicht voor "Ik wil hulp aanvragen" in "Utrecht"
    Dan staat de link "Bereid het gesprek voor" onder de stap "Zet uw vraag op papier"
    En gaat de link "Bereid het gesprek voor" naar "gesprek/"
    Als ik naar de pagina "landelijk/" ga
    Dan gaat de link "vel om uw gesprek voor te bereiden" naar "gesprek/"
