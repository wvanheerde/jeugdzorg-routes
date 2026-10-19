# language: nl
Functionaliteit: Verdieping bij "Wij wachten te lang"
  De ouder kiest waarop hij wacht: op de gemeente (een gesprek of besluit) of op een aanbieder. Dan blijven alleen de
  stappen van die route over. Wie op de gemeente wacht, kan de datum invullen waarop de gemeente de aanvraag kreeg;
  dan staat bij de stappen tot wanneer de gemeente in de regel moet beslissen en vanaf wanneer een ingebrekestelling kan
  (Awb art. 4:13 en 4:17; valt de laatste dag in het weekend of op een feestdag, dan de eerstvolgende werkdag, Atw art. 1).
  Zie CONTENT.md, "Knelpunten: verdieping in Mijn overzicht".

  Achtergrond:
    Gegeven het is 18 oktober 2026

  Scenario: Zonder antwoord staan alle stappen er
    Gegeven ik open het overzicht voor "Wij wachten te lang" in "Utrecht"
    Dan begint stap 1 met "Wacht u op een gesprek of een besluit van de gemeente?"
    En begint stap 2 met "Wacht u op de aanbieder, na een verwijzing van de huisarts of de gemeente?"
    En zie ik "De gemeente moet in de regel binnen acht weken beslissen."
    En is er geen samenvatting
    En zie ik het veld "Wanneer kreeg de gemeente uw aanvraag?" niet

  Scenario: Het label "niet verplicht" staat rechts naast de kop
    Gegeven ik open het overzicht voor "Wij wachten te lang" in "Utrecht"
    Dan staat het label "niet verplicht" rechts naast de kop

  Scenario: Wie op een aanbieder wacht, ziet alleen de stappen daarvoor
    Gegeven ik open het overzicht voor "Wij wachten te lang" in "Utrecht"
    Als ik kies "Een plek bij een aanbieder"
    Dan is het verdiepingsblok ingeklapt
    En is de samenvatting "U wacht op een plek bij een aanbieder."
    En staan de stappen in deze volgorde:
      | Wacht u op de aanbieder, na een verwijzing van de huisarts of de gemeente? |
      | Vraag de huisarts of het wijkteam naar een andere aanbieder                |
      | Gaat uw kind niet meer naar school terwijl het wacht?                      |
      | Helpen bellen en melden niet?                                              |
    En zie ik de voorbeeldbrief "Ingebrekestelling: de gemeente beslist niet op tijd" niet
    En staat in de url "wacht=aanbieder"

  Scenario: Wie op de gemeente wacht, ziet alleen de stappen daarvoor en de vraag naar de datum
    Gegeven ik open het overzicht voor "Wij wachten te lang" in "Utrecht"
    Als ik kies "Een gesprek of besluit van de gemeente"
    Dan staan de vragen van het verdiepingsblok open
    En zie ik het veld "Wanneer kreeg de gemeente uw aanvraag?"
    En zie ik "Vraag dan op papier om een besluit"
    En zie ik "Heeft u alleen in een gesprek om hulp gevraagd?" niet
    En staan de stappen in deze volgorde:
      | Wacht u op een gesprek of een besluit van de gemeente? |
      | Gaat uw kind niet meer naar school terwijl het wacht?  |
    En zie ik "Zijn de acht weken na uw aanvraag voorbij?"
    En zie ik de voorbeeldbrief "Ingebrekestelling: de gemeente beslist niet op tijd"
    En staat in de url "wacht=gemeente"

  Scenario: Met de datum van de aanvraag staat bij de stappen tot wanneer de gemeente heeft
    Gegeven ik open het overzicht voor "Wij wachten te lang" in "Utrecht"
    Als ik kies "Een gesprek of besluit van de gemeente"
    En ik als datum van de aanvraag "15-09-2026" invul
    Dan is het verdiepingsblok ingeklapt
    En is de samenvatting "U wacht sinds 15 september 2026 op de gemeente (4 weken)."
    En zie ik "De gemeente moet in de regel uiterlijk dinsdag 10 november 2026 beslissen (acht weken na uw aanvraag)."
    En zie ik "Heeft de gemeente u laten weten dat het langer duurt? Dan geldt die datum."
    En zie ik "Is er op woensdag 11 november 2026 nog geen besluit?"
    En zie ik "Zijn de acht weken na uw aanvraag voorbij?" niet
    En staat in de url "aanvraag=2026-09-15"

  Scenario: Zijn de acht weken voorbij, dan kan de ingebrekestelling nu
    Gegeven ik open het overzicht voor "Wij wachten te lang" in "Utrecht"
    Als ik kies "Een gesprek of besluit van de gemeente"
    En ik als datum van de aanvraag "01-08-2026" invul
    Dan is de samenvatting "U wacht sinds 1 augustus 2026 op de gemeente (11 weken)."
    En zie ik "De gemeente had in de regel uiterlijk maandag 28 september 2026 moeten beslissen (acht weken na uw aanvraag)."
    En zie ik "Nu: is er nog geen besluit?"

  Scenario: Er staat geen rekenhulp onder de stappen: dat doet de verdieping
    Gegeven ik open het overzicht voor "Wij wachten te lang" in "Utrecht"
    Dan zie ik "Reken uit wanneer de gemeente moet beslissen" niet

  Scenario: De vraag naar de ingebrekestelling komt pas als de acht weken voorbij zijn
    Gegeven ik open het overzicht voor "Wij wachten te lang" in "Utrecht"
    Als ik kies "Een gesprek of besluit van de gemeente"
    En ik als datum van de aanvraag "15-09-2026" invul
    En ik kies "Aanpassen"
    Dan zie ik het veld "Al een ingebrekestelling gestuurd? Wanneer kreeg de gemeente die?" niet

  Scenario: Zijn de acht weken voorbij, dan blijft het blok open voor de ingebrekestelling
    Gegeven ik open het overzicht voor "Wij wachten te lang" in "Utrecht"
    Als ik kies "Een gesprek of besluit van de gemeente"
    En ik als datum van de aanvraag "01-08-2026" invul
    Dan staan de vragen van het verdiepingsblok open
    En zie ik het veld "Al een ingebrekestelling gestuurd? Wanneer kreeg de gemeente die?"

  Scenario: Met de datum van de ingebrekestelling staat bij de stappen wat er daarna gebeurt
    Gegeven ik open het overzicht voor "Wij wachten te lang" in "Utrecht"
    Als ik kies "Een gesprek of besluit van de gemeente"
    En ik als datum van de aanvraag "01-08-2026" invul
    En ik als datum van de ingebrekestelling "12-10-2026" invul
    Dan is het verdiepingsblok ingeklapt
    En is de samenvatting "U wacht sinds 1 augustus 2026 op de gemeente (11 weken); uw ingebrekestelling kwam aan op 12 oktober 2026."
    En zie ik "Gedaan: de gemeente kreeg uw ingebrekestelling op maandag 12 oktober 2026."
    En zie ik "Stuur dan een brief waarin u de gemeente laat weten dat ze te laat is" niet
    En zie ik "Is er op dinsdag 27 oktober 2026 nog geen besluit?"
    En zie ik "Komt er twee weken na uw ingebrekestelling nog steeds geen besluit?" niet
    En staat in de url "ingebreke=2026-10-12"

  Scenario: Zijn ook de twee weken na de ingebrekestelling voorbij, dan kan de rechter nu
    Gegeven ik open het overzicht voor "Wij wachten te lang" in "Utrecht"
    Als ik kies "Een gesprek of besluit van de gemeente"
    En ik als datum van de aanvraag "01-08-2026" invul
    En ik als datum van de ingebrekestelling "01-10-2026" invul
    Dan zie ik "Nu: is er nog steeds geen besluit?"

  Scenario: Een ingebrekestelling van vóór het einde van de acht weken geeft een melding
    Gegeven ik open het overzicht voor "Wij wachten te lang" in "Utrecht"
    Als ik kies "Een gesprek of besluit van de gemeente"
    En ik als datum van de aanvraag "01-08-2026" invul
    En ik als datum van de ingebrekestelling "20-09-2026" invul
    Dan zie ik bij het verdiepingsblok de melding "Deze datum ligt vóór dinsdag 29 september 2026, toen de acht weken nog niet voorbij waren. Een te vroege ingebrekestelling telt meestal niet; stuur er zo nodig een nieuwe."
    En zie ik "Komt er twee weken na uw ingebrekestelling nog steeds geen besluit?"

  Scenario: Een datum in de toekomst geeft een melding
    Gegeven ik open het overzicht voor "Wij wachten te lang" in "Utrecht"
    Als ik kies "Een gesprek of besluit van de gemeente"
    En ik als datum van de aanvraag "01-12-2026" invul
    Dan zie ik bij het verdiepingsblok de melding "Deze datum ligt in de toekomst. Vul de datum in waarop de gemeente uw aanvraag kreeg."
    En zie ik "De gemeente moet in de regel binnen acht weken beslissen."

  Scenario: Bij een volgend bezoek staat het antwoord ingeklapt voorop
    Gegeven ik open het overzicht voor "Wij wachten te lang" in "Utrecht"
    Als ik kies "Een gesprek of besluit van de gemeente"
    En ik als datum van de aanvraag "15-09-2026" invul
    En ik het overzicht later opnieuw open
    Dan is het verdiepingsblok ingeklapt
    En is de samenvatting "U wacht sinds 15 september 2026 op de gemeente (4 weken)."

  Scenario: Na "Aanpassen" staat de link naar de stappen naast "Wissen"
    Gegeven ik open het overzicht voor "Wij wachten te lang" in "Utrecht"
    Als ik kies "Een plek bij een aanbieder"
    En ik kies "Aanpassen"
    Dan staat de link "De stappen zijn aangepast ↓" naast "Wissen"

  Scenario: Wissen zet alle stappen terug
    Gegeven ik open het overzicht voor "Wij wachten te lang" in "Utrecht"
    Als ik kies "Een gesprek of besluit van de gemeente"
    En ik als datum van de aanvraag "15-09-2026" invul
    En ik kies "Wissen"
    Dan staat in de url geen "wacht="
    En staat in de url geen "aanvraag="
    En staat in de url geen "ingebreke="
    En begint stap 2 met "Wacht u op de aanbieder, na een verwijzing van de huisarts of de gemeente?"
    En zie ik "De gemeente moet in de regel binnen acht weken beslissen."
