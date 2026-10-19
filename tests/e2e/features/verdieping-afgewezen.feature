# language: nl
Functionaliteit: Verdieping bij "Hulp is afgewezen of te weinig"
  De ouder kan zeggen of het besluit op papier staat, welke datum erop staat, en of er geen of te weinig hulp kwam of
  de toegekende hulp niet past. De termijn staat voorop: in de uitleg en als eerste vragen (persona-test Erik, 19-10). Zonder besluit op papier is alleen de eerste stap nu nodig; de
  rest staat ingeklapt. Met de datum staat bij de stap over bezwaar tot en met welke dag bezwaar kan (zes weken, Awb
  art. 6:7 en 6:8; valt de laatste dag in het weekend of op een feestdag, dan de eerstvolgende werkdag, Atw art. 1),
  met een waarschuwing als die dag bijna of al voorbij is. Past de toegekende hulp niet, dan komt de stap over het pgb
  direct na het bezwaar. Zie CONTENT.md, "Knelpunten: verdieping in Mijn overzicht".

  Achtergrond:
    Gegeven het is 18 oktober 2026

  Scenario: Zonder antwoord staan alle stappen er
    Gegeven ik open het overzicht voor "Hulp is afgewezen of te weinig" in "Utrecht"
    Dan staan de stappen in deze volgorde:
      | Heeft de gemeente het alleen gezegd, bijvoorbeeld in een gesprek of aan de telefoon? |
      | Klacht of bezwaar?                                                                   |
      | Stuur binnen zes weken na de datum op het besluit een brief waarin u bezwaar maakt.  |
      | Vraag hulp.                                                                          |
      | Is er wel hulp toegekend, maar past die niet?                                        |
    En is er geen samenvatting
    En zie ik het veld "Welke datum staat op het besluit?" niet

  Scenario: De uitleg en de eerste vragen gaan over de termijn
    Gegeven ik open het overzicht voor "Hulp is afgewezen of te weinig" in "Utrecht"
    Dan zie ik "Vul de datum op het besluit in, dan ziet u tot wanneer u bezwaar kunt maken."
    Als ik kies "Ja"
    Dan staan de vragen van het verdiepingsblok in deze volgorde:
      | Heeft u het besluit op papier?                               |
      | Welke datum staat op het besluit?                            |
      | Kreeg u geen of te weinig hulp, of past de hulp niet?        |

  Scenario: Met alleen de datum blijft het blok open voor de laatste vraag
    Gegeven ik open het overzicht voor "Hulp is afgewezen of te weinig" in "Utrecht"
    Als ik kies "Ja"
    En ik als datum op het besluit "16-10-2026" invul
    Dan staan de vragen van het verdiepingsblok open
    En zie ik "Bezwaar kan tot en met vrijdag 27 november 2026 (zes weken na de datum op het besluit)."
    En staat de link "De stappen zijn aangepast ↓" naast "Wissen"

  Scenario: Het label "niet verplicht" staat rechts naast de kop
    Gegeven ik open het overzicht voor "Hulp is afgewezen of te weinig" in "Utrecht"
    Dan staat het label "niet verplicht" rechts naast de kop

  Scenario: Er staat geen rekenhulp onder de stappen: dat doet de verdieping
    Gegeven ik open het overzicht voor "Hulp is afgewezen of te weinig" in "Utrecht"
    Dan zie ik "Reken uit tot wanneer u bezwaar kunt maken" niet
    En zie ik de voorbeeldbrief "Bezwaar tegen een besluit van de gemeente"

  Scenario: Zonder besluit op papier is alleen de eerste stap nu nodig
    Gegeven ik open het overzicht voor "Hulp is afgewezen of te weinig" in "Utrecht"
    Als ik kies "Nee, alleen gezegd"
    Dan staan de stappen in deze volgorde:
      | Heeft de gemeente het alleen gezegd, bijvoorbeeld in een gesprek of aan de telefoon? |
    En staan onder "Daarna: als u het besluit op papier heeft" de stappen:
      | Klacht of bezwaar?                                                                  |
      | Stuur binnen zes weken na de datum op het besluit een brief waarin u bezwaar maakt. |
      | Vraag hulp.                                                                         |
      | Is er wel hulp toegekend, maar past die niet?                                       |
    En zie ik het veld "Welke datum staat op het besluit?" niet
    En staat in de url "papier=nee"

  Scenario: Met het besluit op papier vervalt de stap om erom te vragen, en komt de vraag naar de datum
    Gegeven ik open het overzicht voor "Hulp is afgewezen of te weinig" in "Utrecht"
    Als ik kies "Ja"
    Dan staan de vragen van het verdiepingsblok open
    En zie ik het veld "Welke datum staat op het besluit?"
    En begint stap 1 met "Klacht of bezwaar?"
    En is er geen blok "Daarna: als u het besluit op papier heeft"
    En staat in de url "papier=ja"

  Scenario: Met de datum op het besluit staat bij de stap tot en met wanneer bezwaar kan
    Gegeven ik open het overzicht voor "Hulp is afgewezen of te weinig" in "Utrecht"
    Als ik kies "Geen of te weinig hulp"
    En ik kies "Ja"
    En ik als datum op het besluit "16-10-2026" invul
    Dan is het verdiepingsblok ingeklapt
    En is de samenvatting "Besluit van 16 oktober 2026: u kreeg geen of te weinig hulp."
    En zie ik "Bezwaar kan tot en met vrijdag 27 november 2026 (zes weken na de datum op het besluit)."
    En zie ik "Stuur uw brief waarin u bezwaar maakt liefst een paar dagen eerder."
    En zie ik "Stuur binnen zes weken na de datum op het besluit" niet
    En staat in de url "besluitdatum=2026-10-16"

  Scenario: Valt de laatste dag in het weekend, dan schuift die naar maandag
    Gegeven ik open het overzicht voor "Hulp is afgewezen of te weinig" in "Utrecht"
    Als ik kies "Ja"
    En ik als datum op het besluit "03-10-2026" invul
    Dan zie ik "Bezwaar kan tot en met maandag 16 november 2026"

  Scenario: Is de laatste dag binnen een week, dan staat er dat het nu moet
    Gegeven ik open het overzicht voor "Hulp is afgewezen of te weinig" in "Utrecht"
    Als ik kies "Ja"
    En ik als datum op het besluit "10-09-2026" invul
    Dan zie ik "Bezwaar kan nog tot en met donderdag 22 oktober 2026, over 4 dagen."
    En zie ik "Stuur uw brief waarin u bezwaar maakt nu."

  Scenario: Is de termijn voorbij, dan staat er wat nog kan
    Gegeven ik open het overzicht voor "Hulp is afgewezen of te weinig" in "Utrecht"
    Als ik kies "Ja"
    En ik als datum op het besluit "01-08-2026" invul
    Dan zie ik "De termijn voor bezwaar liep tot en met maandag 14 september 2026."
    En zie ik "Stuur toch een brief waarin u bezwaar maakt en leg uit waarom het later is: de gemeente beslist of ze het nog behandelt."
    En zie ik "Is er sindsdien iets veranderd? Dan kunt u ook opnieuw hulp aanvragen."

  Scenario: Een datum in de toekomst geeft een melding
    Gegeven ik open het overzicht voor "Hulp is afgewezen of te weinig" in "Utrecht"
    Als ik kies "Ja"
    En ik als datum op het besluit "01-12-2026" invul
    Dan zie ik bij het verdiepingsblok de melding "Deze datum ligt in de toekomst. Vul de datum in die op het besluit staat."
    En zie ik "Stuur binnen zes weken na de datum op het besluit een brief waarin u bezwaar maakt."

  Scenario: Bij geen of te weinig hulp valt de stap over het pgb weg
    Gegeven ik open het overzicht voor "Hulp is afgewezen of te weinig" in "Utrecht"
    Als ik kies "Geen of te weinig hulp"
    Dan staan de vragen van het verdiepingsblok open
    En staan de stappen in deze volgorde:
      | Heeft de gemeente het alleen gezegd, bijvoorbeeld in een gesprek of aan de telefoon? |
      | Klacht of bezwaar?                                                                   |
      | Stuur binnen zes weken na de datum op het besluit een brief waarin u bezwaar maakt.  |
      | Vraag hulp.                                                                          |
    En staat in de url "besluit=afgewezen"

  Scenario: Past de toegekende hulp niet, dan komt het pgb direct na het bezwaar
    Gegeven ik open het overzicht voor "Hulp is afgewezen of te weinig" in "Utrecht"
    Als ik kies "De hulp past niet"
    Dan staan de stappen in deze volgorde:
      | Heeft de gemeente het alleen gezegd, bijvoorbeeld in een gesprek of aan de telefoon? |
      | Klacht of bezwaar?                                                                   |
      | Stuur binnen zes weken na de datum op het besluit een brief waarin u bezwaar maakt.  |
      | Is er wel hulp toegekend, maar past die niet?                                        |
      | Vraag hulp.                                                                          |
    En zie ik de link "Ik wil een pgb"
    En staat in de url "besluit=past-niet"

  Scenario: Zijn alle vragen beantwoord zonder besluit op papier, dan klapt het blok in
    Gegeven ik open het overzicht voor "Hulp is afgewezen of te weinig" in "Utrecht"
    Als ik kies "De hulp past niet"
    En ik kies "Nee, alleen gezegd"
    Dan is het verdiepingsblok ingeklapt
    En is de samenvatting "De toegekende hulp past niet; u heeft het besluit nog niet op papier."

  Scenario: Bij een volgend bezoek staat het antwoord ingeklapt voorop
    Gegeven ik open het overzicht voor "Hulp is afgewezen of te weinig" in "Utrecht"
    Als ik kies "Ja"
    En ik als datum op het besluit "16-10-2026" invul
    En ik het overzicht later opnieuw open
    Dan is het verdiepingsblok ingeklapt
    En is de samenvatting "Besluit van 16 oktober 2026."
    En zie ik "Bezwaar kan tot en met vrijdag 27 november 2026"

  Scenario: Na "Aanpassen" staat de link naar de stappen naast "Wissen"
    Gegeven ik open het overzicht voor "Hulp is afgewezen of te weinig" in "Utrecht"
    Als ik kies "Geen of te weinig hulp"
    En ik kies "Nee, alleen gezegd"
    En ik kies "Aanpassen"
    Dan staat de link "De stappen zijn aangepast ↓" naast "Wissen"

  Scenario: Wissen zet alle stappen terug
    Gegeven ik open het overzicht voor "Hulp is afgewezen of te weinig" in "Utrecht"
    Als ik kies "Geen of te weinig hulp"
    En ik kies "Ja"
    En ik als datum op het besluit "16-10-2026" invul
    En ik kies "Wissen"
    Dan staat in de url geen "besluit="
    En staat in de url geen "papier="
    En staat in de url geen "besluitdatum="
    En begint stap 1 met "Heeft de gemeente het alleen gezegd"
    En zie ik "Stuur binnen zes weken na de datum op het besluit een brief waarin u bezwaar maakt."
