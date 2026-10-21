# language: nl
Functionaliteit: Verdieping bij "Mijn kind wordt 18"
  In Mijn overzicht kan de ouder de geboortedatum invullen en kiezen welke hulp na 18 nodig is.
  Dan krijgt elke stap een datum, staan de stappen in de volgorde van die datums,
  en staan stappen die niet bij de keuze passen ingeklapt onder "Andere stappen die soms nodig zijn".
  Zie CONTENT.md, "Knelpunten: verdieping in Mijn overzicht".

  Achtergrond:
    Gegeven het is 18 oktober 2026

  Scenario: Zonder antwoorden staan alle stappen er, zonder datums
    Gegeven ik open het overzicht voor "Mijn kind wordt 18" in "Apeldoorn"
    Dan staan de stappen in deze volgorde:
      | Nu: bel het wijkteam                                  |
      | Ruim vóór de verjaardag: meld begeleiding             |
      | Ruim vóór de verjaardag: vraag verlengde jeugdhulp    |
      | Ruim vóór de verjaardag: vraag bij blijvend veel zorg |
      | Vóór de verjaardag: bespreek met de behandelaar       |
      | Vóór de verjaardag: regel een bewindvoerder           |
      | Rond de verjaardag: zorg dat uw kind                  |
      | Rond de verjaardag: regel geld en papieren            |
      | Rond de verjaardag: spreek af hoe u betrokken blijft  |
    En zie ik "Wanneer beginnen?"
    En is er geen blok "Andere stappen die soms nodig zijn"
    En is er geen samenvatting

  Scenario: De vraag staat als kop, zonder label erbij
    De kop zegt waar het over gaat; "Meer passend advies" en "niet verplicht" werden gemist of overgeslagen (persona-tests ronde 24).
    Ook "u kunt dit overslaan" is weg: de stappen staan er zonder antwoord ook, en het label trok de aandacht van de vraag af.
    Gegeven ik open het overzicht voor "Mijn kind wordt 18" in "Apeldoorn"
    Dan zie ik de kop "Wanneer wordt uw kind 18, en wat is daarna nodig?"
    En zie ik de kop "Meer passend advies" niet
    En staat er geen label bij de kop

  Scenario: Met een geboortedatum krijgt elke stap een datum
    Gegeven ik open het overzicht voor "Mijn kind wordt 18" in "Apeldoorn"
    Als ik als geboortedatum "14-02-2009" invul
    Dan is de samenvatting "Uw kind wordt over ongeveer 17 weken 18 (14 februari 2027)."
    En begint stap 1 met "Nu, deze week: bel het wijkteam"
    En begint stap 2 met "Nu, uiterlijk 20 december 2026: meld begeleiding"
    En begint stap 4 met "Nu, uiterlijk 3 januari 2027: vraag bij blijvend veel zorg"
    En begint stap 6 met "Vóór 14 februari 2027: regel een bewindvoerder"
    En begint stap 7 met "Rond 14 februari 2027: zorg dat uw kind"
    En zie ik "Wanneer beginnen?" niet
    En staat in de url "geboren=2009-02-14"

  Scenario: Wie alleen begeleiding kiest, ziet de andere stappen ingeklapt
    Gegeven ik open het overzicht voor "Mijn kind wordt 18" in "Apeldoorn"
    Als ik als geboortedatum "14-02-2009" invul
    En ik kies "Begeleiding of dagbesteding"
    Dan staan de stappen in deze volgorde:
      | Nu, deze week: bel het wijkteam                                |
      | Nu, uiterlijk 20 december 2026: meld begeleiding               |
      | Nu, uiterlijk 20 december 2026: vraag verlengde jeugdhulp      |
      | Rond 14 februari 2027: zorg dat uw kind                        |
      | Rond 14 februari 2027: regel geld en papieren                  |
      | Rond 14 februari 2027: spreek af hoe u betrokken blijft        |
    En staan onder "Andere stappen die soms nodig zijn" de stappen:
      | Nu, uiterlijk 3 januari 2027: vraag bij blijvend veel zorg |
      | Vóór 14 februari 2027: bespreek met de behandelaar         |
      | Vóór 14 februari 2027: regel een bewindvoerder             |
    En staat in de url "na18=wmo"

  Scenario: Bij een verstandelijke beperking staan de Wlz en het mentorschap in de lijst
    Gegeven ik open het overzicht voor "Mijn kind wordt 18" in "Apeldoorn" met de situatie "Verstandelijke beperking"
    Als ik als geboortedatum "14-02-2009" invul
    En ik kies "Begeleiding of dagbesteding"
    Dan staan de stappen in deze volgorde:
      | Nu, deze week: bel het wijkteam                            |
      | Nu, uiterlijk 20 december 2026: meld begeleiding           |
      | Nu, uiterlijk 20 december 2026: vraag verlengde jeugdhulp  |
      | Nu, uiterlijk 3 januari 2027: vraag bij blijvend veel zorg |
      | Vóór 14 februari 2027: regel een bewindvoerder             |
      | Rond 14 februari 2027: zorg dat uw kind                    |
      | Rond 14 februari 2027: regel geld en papieren              |
      | Rond 14 februari 2027: spreek af hoe u betrokken blijft    |
    En staan onder "Andere stappen die soms nodig zijn" de stappen:
      | Vóór 14 februari 2027: bespreek met de behandelaar |

  Scenario: Een kind dat begeleid gaat wonen: wat een wachtlijst heeft, staat vooraan
    Gegeven ik open het overzicht voor "Mijn kind wordt 18" in "Apeldoorn"
    Als ik als geboortedatum "01-03-2011" invul
    En ik kies "Gaat begeleid wonen"
    Dan begint stap 1 met "Nu: bel het wijkteam"
    En begint stap 2 met "Nu, zo vroeg mogelijk: meld begeleiding"
    En begint stap 3 met "Nu, zo vroeg mogelijk: vraag bij blijvend veel zorg"

  # Eigen vuistregel (geen bron met een leeftijd): wachtlijsten duren "één tot een paar jaar", dus bij veel zorg of
  # begeleid wonen beginnen vanaf drie jaar voor de verjaardag, niet jaren eerder.
  Scenario: Bij veel zorg of begeleid wonen begint het drie jaar voor de verjaardag, niet eerder
    Gegeven ik open het overzicht voor "Mijn kind wordt 18" in "Apeldoorn"
    Als ik als geboortedatum "01-06-2014" invul
    En ik kies "Veel zorg of toezicht"
    Dan begint stap 1 met "Vanaf 1 juni 2029 (drie jaar voor de verjaardag): bel het wijkteam"
    En begint stap 2 met "Vanaf 1 juni 2029 (drie jaar voor de verjaardag): vraag bij blijvend veel zorg"

  Scenario: Een kind van 14 dat begeleid gaat wonen: ook vanaf drie jaar voor de verjaardag
    Gegeven ik open het overzicht voor "Mijn kind wordt 18" in "Apeldoorn"
    Als ik als geboortedatum "01-06-2012" invul
    En ik kies "Gaat begeleid wonen"
    Dan begint stap 1 met "Vanaf 1 juni 2027 (drie jaar voor de verjaardag): bel het wijkteam"
    En begint stap 2 met "Vanaf 1 juni 2027 (drie jaar voor de verjaardag): meld begeleiding"

  Scenario: Voor een kind jonger dan 16 begint het rond de 16e verjaardag
    Gegeven ik open het overzicht voor "Mijn kind wordt 18" in "Apeldoorn"
    Als ik als geboortedatum "01-06-2012" invul
    En ik kies "Begeleiding of dagbesteding"
    Dan is de samenvatting "Uw kind wordt over ongeveer 4 jaar 18 (1 juni 2030)."
    En begint stap 1 met "Vanaf 1 juni 2028 (de 16e verjaardag): bel het wijkteam"
    En begint stap 2 met "Tussen 1 juni 2028 en 6 april 2030: meld begeleiding"

  Scenario: Pleegzorg tot 21 staat er alleen bij een pleeggezin of gezinshuis
    Gegeven ik open het overzicht voor "Mijn kind wordt 18" in "Apeldoorn"
    Als ik kies "Begeleiding of dagbesteding"
    Dan zie ik "Woont uw kind in een pleeggezin of gezinshuis?" niet
    Als ik kies "Woont in pleeggezin of gezinshuis"
    Dan zie ik "Woont uw kind in een pleeggezin of gezinshuis?"

  Scenario: Een kind dat al 18 is
    Gegeven ik open het overzicht voor "Mijn kind wordt 18" in "Apeldoorn"
    Als ik als geboortedatum "01-05-2008" invul
    En ik kies "Woont in pleeggezin of gezinshuis"
    Dan is de samenvatting "Uw kind is op 1 mei 2026 18 geworden."
    En begint stap 2 met "Nu: vraag verlengde jeugdhulp"
    En zie ik "Is uw kind al 18?"

  Scenario: "Weet ik niet" laat alle stappen staan
    Gegeven ik open het overzicht voor "Mijn kind wordt 18" in "Apeldoorn"
    Als ik kies "Begeleiding of dagbesteding"
    En ik kies "Weet ik niet"
    Dan is de knop "Begeleiding of dagbesteding" niet aangezet
    En is er geen blok "Andere stappen die soms nodig zijn"

  Scenario: De link naar de stappen verschijnt pas na een antwoord, naast "Wissen"
    Gegeven ik open het overzicht voor "Mijn kind wordt 18" in "Apeldoorn"
    Dan zie ik de link "De stappen zijn aangepast ↓" niet
    Als ik als geboortedatum "14-02-2009" invul
    Dan staat de link "De stappen zijn aangepast ↓" naast "Wissen"
    Als ik klik op "De stappen zijn aangepast ↓"
    Dan staat het begin van de stappen bovenaan in beeld

  Scenario: Bij een volgend bezoek staat het blok ingeklapt tot de samenvatting
    Gegeven ik open het overzicht voor "Mijn kind wordt 18" in "Apeldoorn"
    Als ik als geboortedatum "14-02-2009" invul
    En ik het overzicht later opnieuw open
    Dan is het verdiepingsblok ingeklapt
    En is de samenvatting "Uw kind wordt over ongeveer 17 weken 18 (14 februari 2027)."
    Als ik kies "Aanpassen"
    Dan staan de vragen van het verdiepingsblok open

  Scenario: Zonder geboortedatum klapt het blok niet in tot een leeg balkje
    Gegeven ik open het overzicht voor "Mijn kind wordt 18" in "Apeldoorn"
    Als ik kies "Begeleiding of dagbesteding"
    En ik het overzicht later opnieuw open
    Dan staan de vragen van het verdiepingsblok open
    En is de knop "Begeleiding of dagbesteding" aangezet

  Scenario: Wissen haalt alle antwoorden weg
    Gegeven ik open het overzicht voor "Mijn kind wordt 18" in "Apeldoorn"
    Als ik als geboortedatum "14-02-2009" invul
    En ik kies "Begeleiding of dagbesteding"
    En ik kies "Wissen"
    Dan is er geen samenvatting
    En is de knop "Begeleiding of dagbesteding" niet aangezet
    En staat in de url geen "geboren="
    En staat in de url geen "na18="

  Scenario: Een geboortedatum in de toekomst geeft een melding
    Gegeven ik open het overzicht voor "Mijn kind wordt 18" in "Apeldoorn"
    Als ik als geboortedatum "01-01-2030" invul
    Dan zie ik bij het verdiepingsblok de melding "Deze datum ligt in de toekomst. Vul de geboortedatum van uw kind in."

  Scenario: Antwoorden in de url worden overgenomen
    Gegeven ik open de pagina "overzicht/?k=wordt-18&gemeente=apeldoorn&geboren=2009-02-14&na18=zvw"
    Dan is het verdiepingsblok ingeklapt
    En begint stap 2 met "Vóór 14 februari 2027: bespreek met de behandelaar"
    Als ik kies "Aanpassen"
    Dan is de knop "Behandeling" aangezet
