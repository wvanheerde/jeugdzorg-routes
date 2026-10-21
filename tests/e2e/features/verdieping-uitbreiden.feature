# language: nl
Functionaliteit: Verdieping bij "Ik wil hulp uitbreiden"
  De ouder kiest wat er speelt: er is meer of andere hulp nodig, het besluit loopt af, of allebei. Loopt het besluit af,
  dan komt die stap bovenaan en kan de ouder de einddatum invullen. Dan staat bij de stap tot wanneer de ouder het moet
  melden: acht weken vóór de einddatum, zo lang mag de gemeente in de regel over een besluit doen (Awb art. 4:13).
  Terugrekenen vanaf de einddatum, en een weekend of feestdag naar de werkdag ervoor, is een eigen vuistregel.
  Zie CONTENT.md, "Knelpunten: verdieping in Mijn overzicht".

  Achtergrond:
    Gegeven het is 19 oktober 2026

  Scenario: Zonder antwoord staan alle stappen er
    Gegeven ik open het overzicht voor "Ik wil hulp uitbreiden" in "Haarlem"
    Dan staan de stappen in deze volgorde:
      | Bespreek met de hulpverlener die nu helpt wat er extra nodig is. |
      | Loopt het besluit bijna af?                                      |
      | Vraag een cliëntondersteuner                                     |
      | Vraag om het nieuwe besluit op papier.                           |
    En zie ik "bijvoorbeeld drie maanden van tevoren"
    En is er geen samenvatting
    En zie ik het veld "Wanneer loopt het besluit af?" niet

  Scenario: De vraag staat als kop, zonder label erbij
    De kop zegt waar het over gaat; "Meer passend advies" en "niet verplicht" werden gemist of overgeslagen (persona-tests ronde 24).
    Ook "u kunt dit overslaan" is weg: de stappen staan er zonder antwoord ook, en het label trok de aandacht van de vraag af.
    Gegeven ik open het overzicht voor "Ik wil hulp uitbreiden" in "Haarlem"
    Dan zie ik de kop "Wat speelt er bij de hulp?"
    En zie ik de kop "Meer passend advies" niet
    En staat er geen label bij de kop

  Scenario: Na "Het besluit loopt af" staat de cursor in het datumveld
    Gegeven ik open het overzicht voor "Ik wil hulp uitbreiden" in "Haarlem"
    Als ik kies "Het besluit loopt af"
    Dan staat de cursor in "Wanneer loopt het besluit af?"

  Scenario: Is er alleen meer hulp nodig, dan staat de stap over het aflopen ingeklapt
    Gegeven ik open het overzicht voor "Ik wil hulp uitbreiden" in "Haarlem"
    Als ik kies "Er is meer of andere hulp nodig"
    Dan staan de vragen van het verdiepingsblok open
    En staan de stappen in deze volgorde:
      | Bespreek met de hulpverlener die nu helpt wat er extra nodig is. |
      | Vraag een cliëntondersteuner                                     |
      | Vraag om het nieuwe besluit op papier.                           |
    En staan onder "Andere stappen die soms nodig zijn" de stappen:
      | Loopt het besluit bijna af? |
    En staat in de url "nodig=meer"

  Scenario: Loopt het besluit af, dan komt die stap bovenaan en de vraag naar de einddatum
    Gegeven ik open het overzicht voor "Ik wil hulp uitbreiden" in "Haarlem"
    Als ik kies "Het besluit loopt af"
    Dan zie ik het veld "Wanneer loopt het besluit af?"
    En staan de stappen in deze volgorde:
      | Loopt het besluit bijna af?                                      |
      | Bespreek met de hulpverlener die nu helpt wat er extra nodig is. |
      | Vraag een cliëntondersteuner                                     |
      | Vraag om het nieuwe besluit op papier.                           |
    En loopt de nummering van de stappen daarna door bij 3
    En is er geen blok "Andere stappen die soms nodig zijn"
    En staat in de url "nodig=afloop"

  Scenario: Met een einddatum ver genoeg weg staat tot wanneer de ouder het moet melden
    Gegeven ik open het overzicht voor "Ik wil hulp uitbreiden" in "Haarlem"
    Als ik kies "Het besluit loopt af"
    En ik als einddatum van het besluit "31-01-2027" invul
    Dan is het verdiepingsblok ingeklapt
    En is de samenvatting "Het besluit loopt af op 31 januari 2027 (over ongeveer 15 weken)."
    En zie ik "Meld nu dat de hulp nog nodig is, liefst ruim van tevoren en uiterlijk vrijdag 4 december 2026"
    En zie ik "(acht weken vóór de einddatum: zo lang mag de gemeente in de regel over een besluit doen)."
    En zie ik "bijvoorbeeld drie maanden van tevoren" niet
    En zie ik "Beslist de gemeente niet op tijd?" niet
    En staat in de url "einde=2027-01-31"

  Scenario: Is de einddatum minder dan acht weken weg, dan moet het vandaag
    Gegeven ik open het overzicht voor "Ik wil hulp uitbreiden" in "Haarlem"
    Als ik kies "Het besluit loopt af"
    En ik als einddatum van het besluit "30-11-2026" invul
    Dan zie ik "Meld vandaag dat de hulp nog nodig is: het besluit loopt af op maandag 30 november 2026."
    En zie ik "Meldt u het vandaag, dan mag de gemeente in de regel tot maandag 14 december 2026 beslissen: dat is na de einddatum. Vraag daarom of de hulp kan doorlopen tot het nieuwe besluit er is."
    En zie ik "Vraag ook of de hulp kan doorlopen tot het nieuwe besluit er is." niet
    En zie ik "Beslist de gemeente niet op tijd? Lees dan bij de vraag"
    En gaat de link "\"Wij wachten te lang\"" naar "/overzicht/?k=wachten&wacht=gemeente"

  Scenario: Is de einddatum voorbij, dan verwijst de stap naar "De hulp stopt"
    Gegeven ik open het overzicht voor "Ik wil hulp uitbreiden" in "Haarlem"
    Als ik kies "Het besluit loopt af"
    En ik als einddatum van het besluit "01-10-2026" invul
    Dan zie ik "Het besluit liep af op donderdag 1 oktober 2026."
    En zie ik "Is er nog geen nieuw besluit? Lees dan bij de vraag"
    En gaat de link "\"De hulp stopt\"" naar "/overzicht/?k=hulp-stopt&reden=besluit"
    En zie ik "Vraag ook of de hulp kan doorlopen tot het nieuwe besluit er is." niet

  Scenario: Speelt allebei, dan staan alle stappen er, met het aflopen bovenaan
    Gegeven ik open het overzicht voor "Ik wil hulp uitbreiden" in "Haarlem"
    Als ik kies "Er is meer of andere hulp nodig"
    En ik kies "Het besluit loopt af"
    Dan staan de stappen in deze volgorde:
      | Loopt het besluit bijna af?                                      |
      | Bespreek met de hulpverlener die nu helpt wat er extra nodig is. |
      | Vraag een cliëntondersteuner                                     |
      | Vraag om het nieuwe besluit op papier.                           |
    En staat in de url "nodig=meer,afloop"

  Scenario: Bij een volgend bezoek staat het antwoord ingeklapt voorop
    Gegeven ik open het overzicht voor "Ik wil hulp uitbreiden" in "Haarlem"
    Als ik kies "Het besluit loopt af"
    En ik als einddatum van het besluit "31-01-2027" invul
    En ik het overzicht later opnieuw open
    Dan is het verdiepingsblok ingeklapt
    En is de samenvatting "Het besluit loopt af op 31 januari 2027 (over ongeveer 15 weken)."

  Scenario: Na "Aanpassen" staat de link naar de stappen naast "Wissen"
    Gegeven ik open het overzicht voor "Ik wil hulp uitbreiden" in "Haarlem"
    Als ik kies "Het besluit loopt af"
    En ik als einddatum van het besluit "31-01-2027" invul
    En ik kies "Aanpassen"
    Dan staat de link "De stappen zijn aangepast ↓" naast "Wissen"

  Scenario: Wissen zet alle stappen terug
    Gegeven ik open het overzicht voor "Ik wil hulp uitbreiden" in "Haarlem"
    Als ik kies "Het besluit loopt af"
    En ik als einddatum van het besluit "31-01-2027" invul
    En ik kies "Wissen"
    Dan staat in de url geen "nodig="
    En staat in de url geen "einde="
    En begint stap 2 met "Loopt het besluit bijna af?"
    En zie ik "bijvoorbeeld drie maanden van tevoren"
