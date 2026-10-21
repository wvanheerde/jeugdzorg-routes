# language: nl
Functionaliteit: Voorbeeldbrieven
  Een voorbeeldbrief is te kopiëren. Bij bezwaar rekent de site uit tot wanneer het kan,
  en het postadres van de gekozen gemeente staat al in de brief.

  Scenario: De brief kopiëren
    Gegeven de site mag het klembord gebruiken
    En ik open de pagina "brieven/bezwaar-beschikking/"
    Als ik kies "Kopieer de brief"
    Dan zie ik "Gekopieerd. Plak de tekst in een e-mail of document."
    En staat op het klembord een tekst met "bezwaar"

  Scenario: Uitrekenen tot wanneer bezwaar kan
    Gegeven ik open de pagina "brieven/bezwaar-beschikking/"
    Als ik het onderdeel "Reken uit tot wanneer u bezwaar kunt maken" open
    En ik "01-10-2026" typ in "Datum op het besluit"
    Dan zie ik "Uw bezwaar moet uiterlijk donderdag 12 november 2026 binnen zijn."
    En zie ik "De datum staat nu ook in de brief hieronder."

  Scenario: Valt de laatste dag in het weekend, dan schuift die naar maandag
    Gegeven ik open de pagina "brieven/bezwaar-beschikking/"
    Als ik het onderdeel "Reken uit tot wanneer u bezwaar kunt maken" open
    En ik "03-10-2026" typ in "Datum op het besluit"
    Dan zie ik "Uw bezwaar moet uiterlijk maandag 16 november 2026 binnen zijn."

  Scenario: Het postadres van de gekozen gemeente staat in de brief
    Gegeven ik heb eerder gekozen voor de gemeente "Utrecht"
    Als ik open de pagina "brieven/bezwaar-beschikking/"
    Dan zie ik "Naam en postadres van de gemeente Utrecht staan al in de brief"

  Scenario: Hulp en een therapievorm in de brief zetten
    Gegeven ik heb eerder de situatie "ADHD en ADD" gekozen
    Als ik open de pagina "brieven/aanvraag-jeugdhulp/"
    En ik "Behandeling" in de brief zet
    Dan staat in de brief "Behandeling – dit past omdat"
    En zie ik therapievormen om in de brief te noemen
    Als ik de eerste therapievorm in de brief zet
    Dan staat de eerste therapievorm in de brief

  Scenario: Hulp weer uit de brief halen haalt ook de therapievormen eronder weg
    Gegeven ik heb eerder de situatie "ADHD en ADD" gekozen
    Als ik open de pagina "brieven/aanvraag-jeugdhulp/"
    En ik "Behandeling" in de brief zet
    En ik de eerste therapievorm in de brief zet
    En ik "Behandeling" uit de brief haal
    Dan staat in de brief niet "Behandeling – dit past omdat"
    En zie ik geen therapievormen om in de brief te noemen

  Scenario: Zonder situatie vraagt de briefbouwer eerst om een situatie
    Gegeven ik open de pagina "brieven/aanvraag-jeugdhulp/"
    Dan zie ik "Kies eerst een situatie op de"

  Scenario: Bij bezwaar zonder situatie is het noemen van hulp weggelaten
    Gegeven ik open de pagina "brieven/bezwaar-beschikking/"
    Dan zie ik de kop "Welke hulp wilt u noemen?" niet
    En staat in de brief "Noem de hulp en waarom die past bij uw kind."

  Scenario: Een verlopen bezwaartermijn
    Gegeven ik open de pagina "brieven/bezwaar-beschikking/"
    Als ik het onderdeel "Reken uit tot wanneer u bezwaar kunt maken" open
    En ik "01-08-2026" typ in "Datum op het besluit"
    Dan zie ik "De termijn liep tot en met maandag 14 september 2026."

  Scenario: Een datum die niet bestaat geeft een melding
    Gegeven ik open de pagina "brieven/bezwaar-beschikking/"
    Als ik het onderdeel "Reken uit tot wanneer u bezwaar kunt maken" open
    En ik "31-02-2026" typ in "Datum op het besluit"
    Dan zie ik "Vul de datum in als dd-mm-jjjj, bijvoorbeeld 03-10-2026."

  Scenario: Uitrekenen wanneer de gemeente had moeten beslissen
    Gegeven ik open de pagina "brieven/ingebrekestelling/"
    Als ik het onderdeel "Reken uit wanneer de gemeente moet beslissen" open
    En ik "01-08-2026" typ in "Datum waarop de gemeente uw aanvraag kreeg"
    Dan zie ik "De gemeente moet in de regel uiterlijk maandag 28 september 2026 beslissen."
    En zie ik "Is er nog geen besluit? Dan kunt u de gemeente nu in gebreke stellen."

  Scenario: De datum op het besluit uit Mijn overzicht staat al in de rekenhulp en in de brief
    Gegeven het is 18 oktober 2026
    En ik open het overzicht voor "Hulp is afgewezen of te weinig" in "Utrecht"
    Als ik kies "Ja"
    En ik als datum op het besluit "16-10-2026" invul
    En ik open de pagina "brieven/bezwaar-beschikking/"
    Dan staat het onderdeel "Reken uit tot wanneer u bezwaar kunt maken" open
    En staat in "Datum op het besluit" de tekst "16-10-2026"
    En zie ik "Uw bezwaar moet uiterlijk vrijdag 27 november 2026 binnen zijn."
    En staat in de brief "16 oktober 2026"

  Scenario: De datum van de aanvraag uit Mijn overzicht staat al in de rekenhulp en in de brief
    Gegeven ik open het overzicht voor "Wij wachten te lang" in "Utrecht"
    Als ik kies "Een gesprek of besluit van de gemeente"
    En ik als datum van de aanvraag "01-08-2026" invul
    En ik open de pagina "brieven/ingebrekestelling/"
    Dan staat het onderdeel "Reken uit wanneer de gemeente moet beslissen" open
    En staat in "Datum waarop de gemeente uw aanvraag kreeg" de tekst "01-08-2026"
    En zie ik "De gemeente moet in de regel uiterlijk maandag 28 september 2026 beslissen."
    En staat in de brief "1 augustus 2026"

  Scenario: Ook de datum van de ingebrekestelling uit Mijn overzicht staat al in de rekenhulp
    Gegeven ik open het overzicht voor "Wij wachten te lang" in "Utrecht"
    Als ik kies "Een gesprek of besluit van de gemeente"
    En ik als datum van de aanvraag "01-08-2026" invul
    En ik als datum van de ingebrekestelling "12-10-2026" invul
    En ik open de pagina "brieven/ingebrekestelling/"
    Dan staat in "Al een ingebrekestelling gestuurd? Datum waarop de gemeente die kreeg" de tekst "12-10-2026"
    En zie ik "De gemeente heeft tot en met maandag 26 oktober 2026 om alsnog te beslissen."

  Scenario: Uitrekenen wat er na de ingebrekestelling gebeurt
    Gegeven ik open de pagina "brieven/ingebrekestelling/"
    Als ik het onderdeel "Reken uit wanneer de gemeente moet beslissen" open
    En ik "02-11-2026" typ in "Al een ingebrekestelling gestuurd? Datum waarop de gemeente die kreeg"
    Dan zie ik "De gemeente heeft tot en met maandag 16 november 2026 om alsnog te beslissen."
    En zie ik "vanaf dinsdag 17 november 2026 de rechter vragen"
    En zie ik "U heeft dan ook recht op een dwangsom van hooguit € 1.442. Gemeenten betalen die niet altijd uit zichzelf; vraag er dan schriftelijk om."

  Scenario: Ook onder de brief staat een knop om te kopiëren
    Een brief is op de telefoon drie tot vier schermen lang; wie hem gelezen heeft, zag de knop erboven niet meer (Kees en Sanne, ronde 24).
    Gegeven de site mag het klembord gebruiken
    En ik open de pagina "brieven/klacht-toegangsteam/"
    Dan staat onder de brief de knop "Kopieer de brief"
    Als ik onder de brief op "Kopieer de brief" druk
    Dan zie ik "Gekopieerd. Plak de tekst in een e-mail of document."
    En staat op het klembord een tekst met "klacht"

  @mobiel
  Scenario: Op de telefoon staan de tips voor het versturen ingeklapt boven de brief
    Gegeven ik open de pagina "brieven/ingebrekestelling/"
    Dan staat "Voor u verstuurt" boven de brief
    En is het onderdeel "Voor u verstuurt" dicht
    Als ik het onderdeel "Voor u verstuurt" open
    Dan zie ik "Stuur de brief aangetekend naar het postadres."

  Scenario: De brief aan school past ook als het kind thuiszit
    Lisa (ronde 27) vond in de brief niets voor een kind dat niet meer naar school gaat.
    Gegeven ik open de pagina "brieven/gesprek-school-opp/"
    Dan zie ik "gaat sinds [datum] niet meer naar school"
    Als ik de tips "Voor u verstuurt" bekijk
    Dan zie ik "Vertel dan dat u school om een gesprek heeft gevraagd."
