# language: nl
Functionaliteit: Klachtbrief samenstellen
  Bij de klachtbrieven (aan de aanbieder en aan het wijkteam) kiest de ouder waarover de klacht gaat. Per keuze komt bij
  "Wat er is gebeurd" een regel om in te vullen en bij "Wat ik vraag" een passend verzoek. De voorbeeldregels die er
  zonder keuze staan, verdwijnen dan. De keuzes staan in de brief zelf (src/content/brieven, veld klachten).

  Scenario: Zonder keuze staan de voorbeeldregels in de brief
    Gegeven ik open de pagina "brieven/klacht-aanbieder/"
    Dan zie ik de kop "Waarover gaat uw klacht?"
    En staat in de brief "[aantal] verschillende hulpverleners"

  Scenario: Een klacht kiezen zet de regel en het verzoek in de brief, zonder de voorbeeldregels
    Gegeven ik open de pagina "brieven/klacht-aanbieder/"
    Als ik kies "Slecht bereikbaar"
    Dan staat in de brief "Ik heb [aantal] keer gebeld en [aantal] e-mails gestuurd"
    En staat in de brief "Eén vast aanspreekpunt"
    En staat in de brief "Een reactie op deze klacht binnen [twee] weken."
    En staat in de brief niet "[aantal] verschillende hulpverleners"
    En staat in de url "klacht=bereikbaar"

  Scenario: Meer klachten tegelijk, in de volgorde van de keuzes op de pagina
    Gegeven ik open de pagina "brieven/klacht-aanbieder/"
    Als ik kies "Beloften worden niet nagekomen"
    En ik kies "Afspraken gaan niet door"
    Dan staan in de brief bij "Wat er is gebeurd" 2 regels
    En staan in de brief bij "Wat ik vraag" 3 verzoeken

  Scenario: Nog eens klikken haalt de klacht weg en zet de voorbeeldregels terug
    Gegeven ik open de pagina "brieven/klacht-aanbieder/"
    Als ik kies "Slecht bereikbaar"
    En ik kies "Slecht bereikbaar"
    Dan staat in de brief "[aantal] verschillende hulpverleners"
    En staat in de brief niet "Eén vast aanspreekpunt"
    En staat in de url geen "klacht="

  Scenario: De gekozen klachten gaan mee bij het kopiëren
    Gegeven de site mag het klembord gebruiken
    En ik open de pagina "brieven/klacht-aanbieder/"
    Als ik kies "Slecht bereikbaar"
    En ik klik op "Kopieer de brief"
    Dan staat op het klembord een tekst met "Ik heb [aantal] keer gebeld"
    En staat op het klembord geen "[aantal] verschillende hulpverleners"

  Scenario: Vanuit "Wij wachten te lang" staat de klacht over wachten al aan
    Gegeven ik open het overzicht voor "Wij wachten te lang" in "Utrecht"
    Als ik kies "Een plek bij een aanbieder"
    En ik klik op "Voorbeeldbrief klacht →"
    Dan is de knop "We wachten te lang op een plek" aangezet
    En staat in de brief "op uw wachtlijst"

  Scenario: De klachtbrief aan het wijkteam heeft eigen klachten
    Gegeven ik open de pagina "brieven/klacht-toegangsteam/"
    Als ik kies "Van het kastje naar de muur"
    Dan staat in de brief "zonder dat iemand mijn vraag oppakte"
    En staat in de brief niet "Tot vandaag, [datum], is dat niet gebeurd."
    En zie ik de knop "We wachten te lang op een plek" niet

  Scenario: Wie op de gemeente wacht, vindt de klachtbrief aan het wijkteam, met "Het duurt te lang" al aan
    Gegeven ik open het overzicht voor "Wij wachten te lang" in "Emmen"
    Als ik kies "Een gesprek of besluit van de gemeente"
    En ik open de voorbeeldbrief "Klacht bij het wijkteam of jeugdteam"
    Dan is de knop "Het duurt te lang" aangezet

  # Geen dubbele link: de brief staat bij deze vraag al onder de stappen of bij "Voorbeeldbrieven".
  Scenario: Het klachtblok van de gemeente heet "Klacht over het wijkteam", zonder dubbele link naar de brief
    Gegeven ik open het overzicht voor "Wij wachten te lang" in "Emmen"
    Dan zie ik "Klacht over het wijkteam"
    En zie ik de link "Voorbeeldbrief klacht over het wijkteam →" niet

  # De klachtbrief aan de aanbieder staat al bij de stappen en de voorbeeldbrieven; een aparte tegel daarover was dubbel.
  # De klacht gaat dan over de aanbieder; het klachtblok en de klachtbrief van het wijkteam brachten Mark aan het twijfelen.
  Scenario: Wie op een aanbieder wacht, ziet geen klacht over het wijkteam
    Gegeven ik open het overzicht voor "Wij wachten te lang" in "Emmen"
    Als ik kies "Een plek bij een aanbieder"
    Dan zie ik "Klacht over het wijkteam" niet
    En zie ik de voorbeeldbrief "Klacht bij het wijkteam of jeugdteam" niet
    En zie ik "Klacht over de aanbieder" niet
    En staat het contact van het wijkteam onder stap 1

  Scenario: Wie op de gemeente wacht, ziet een stap over een klacht bij het wijkteam, met de brief erbij
    Gegeven ik open het overzicht voor "Wij wachten te lang" in "Emmen"
    Als ik kies "Een gesprek of besluit van de gemeente"
    Dan zie ik "Hoort u niets meer of belt niemand terug?"
    Als ik klik op "Voorbeeldbrief klacht →"
    Dan is de knop "Het duurt te lang" aangezet

  Scenario: Het klachtadres van de gekozen gemeente staat al in de brief aan het wijkteam
    Gegeven ik heb eerder gekozen voor de gemeente "Emmen"
    En ik open de pagina "brieven/klacht-toegangsteam/"
    Dan staat in de brief niet "[e-mailadres voor klachten, zie de gemeentepagina]"
    En staat in de brief "Aan: de klachtenfunctionaris"
    En staat in de brief niet "[naam organisatie]"
    En zie ik "staat al in de brief"

  Scenario: Na het kiezen van klachten zegt een link hoeveel er in de brief staan
    Gegeven ik open de pagina "brieven/klacht-toegangsteam/"
    Dan zie ik de link "1 klacht toegevoegd ↓" niet
    Als ik kies "Slecht bereikbaar"
    Dan zie ik de link "1 klacht toegevoegd ↓"
    Als ik kies "Geen verslag of plan op papier"
    Dan zie ik de link "2 klachten toegevoegd ↓"

  Scenario: Twee klachten vragen niet twee keer hetzelfde
    Gegeven ik open de pagina "brieven/klacht-toegangsteam/"
    Als ik kies "Slecht bereikbaar"
    En ik kies "Van het kastje naar de muur"
    Dan staat in de brief "Eén vaste contactpersoon"
    En staat in de brief "Dat mijn vraag wordt opgepakt"

  Scenario: De brief zegt niet dat de ouder de vertrouwenspersoon al heeft gevraagd
    Gegeven ik open de pagina "brieven/klacht-toegangsteam/"
    Dan staat in de brief "van Jeugdstem vragen mij hierbij te ondersteunen."
    En staat in de brief niet "Ik heb de vertrouwenspersoon"

  Scenario: Staat het klachtadres al in de brief, dan verwijst de tip niet naar de gemeentepagina
    Gegeven ik heb eerder gekozen voor de gemeente "Emmen"
    En ik open de pagina "brieven/klacht-toegangsteam/"
    Dan zie ik "Stuur de klacht per e-mail naar het klachtadres dat in de brief staat."
    En zie ik "Dat adres staat op de pagina van uw gemeente." niet

  Scenario: Lukt kopiëren niet, dan staat de brief geselecteerd
    Gegeven het klembord werkt niet
    En ik open de pagina "brieven/klacht-aanbieder/"
    Als ik klik op "Kopieer de brief"
    Dan zie ik "De brief is geselecteerd. Kies Kopiëren (of Ctrl+C) en plak hem in een e-mail."
    En is de tekst van de brief geselecteerd
