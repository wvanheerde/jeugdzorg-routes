# language: nl
Functionaliteit: Regelingencheck bij "Extra kosten of kinderbijslag"
  De ouder beantwoordt een paar vragen. Dan staan de regelingen die waarschijnlijk passen bovenaan, met "Past waarschijnlijk"
  erbij, en de regelingen die niet passen ingeklapt onder "Andere regelingen die soms passen" (niet weg: of iets past, beslist
  de SVB, het CIZ of de gemeente). Zonder antwoord blijft een regeling gewoon staan. Onder de stappen staan de regelingen van
  de gekozen gemeente (veld geldregelingen). De antwoorden blijven in de browser (url en localStorage).
  De scenario's over de vragen zelf gebruiken geen gemeente: de regelingen van een gemeente (zoals geen mantelzorgwaardering
  voor ouders) veranderen bij elke onderzoeksronde.
  Zie CONTENT.md, "Knelpunten: verdieping in Mijn overzicht" en "Gemeenten: geldregelingen".

  Scenario: Zonder antwoord staan alle regelingen er
    Gegeven ik open het overzicht voor "Extra kosten of kinderbijslag" zonder gemeente
    Dan staan de stappen in deze volgorde:
      | Is uw kind 3 tot 18 jaar en heeft het veel meer zorg nodig dan andere kinderen? |
      | Bent u alleenstaande ouder, of heeft uw partner weinig of geen inkomen?         |
      | Maakt u extra kosten door de ziekte of beperking van uw kind?                   |
      | Is het met uw inkomen soms krap?                                                             |
      | Gaat uw kind naar speciaal onderwijs of naar een school ver weg?                |
      | Zorgt u veel meer voor uw kind dan bij andere kinderen?                         |
      | Heeft uw kind altijd 24 uur per dag zorg of toezicht nodig?                     |
      | Betaalt u zelf zorgkosten die niemand vergoedt?                                 |
      | Voor jeugdhulp betaalt u geen eigen bijdrage.                                   |
      | Heeft u een pgb?                                                                |
    En is er geen blok "Andere regelingen die soms passen"
    En zie ik "Past waarschijnlijk" niet
    En is er geen samenvatting

  Scenario: De vraag staat als kop; de vervolgvragen komen pas als ze ertoe doen
    Gegeven ik open het overzicht voor "Extra kosten of kinderbijslag" zonder gemeente
    Dan zie ik de kop "Welke regelingen passen bij u?"
    En staat er geen label bij de kop
    En zie ik "Uw antwoorden blijven op dit apparaat." niet
    En staan de vragen van het verdiepingsblok in deze volgorde:
      | Heeft uw kind veel meer zorg of toezicht nodig dan andere kinderen van die leeftijd? |
      | Welke kosten heeft u? Kies alles wat past.                                           |
      | Is het met uw inkomen soms krap?                                                                  |

  Scenario: Krijgt de ouder al dubbele kinderbijslag, dan gaat het om het extra bedrag
    Gegeven ik open het overzicht voor "Extra kosten of kinderbijslag" zonder gemeente
    Als ik bij "Heeft uw kind veel meer zorg" kies "Ja"
    En ik bij "Krijgt u al dubbele kinderbijslag?" kies "Ja"
    En ik bij "Bent u alleenstaande ouder" kies "Ja"
    Dan begint stap 1 met "Bent u alleenstaande ouder, of heeft uw partner weinig of geen inkomen?"
    En staat bij stap 1 "Past waarschijnlijk"
    En zie ik "Vraag dan dubbele kinderbijslag aan" niet
    En staat in de url "zorg=ja&dkb=ja&alleen=ja"

  Scenario: Heeft het kind niet veel meer zorg nodig, dan staan de regelingen voor zorg ingeklapt
    Gegeven ik open het overzicht voor "Extra kosten of kinderbijslag" zonder gemeente
    Als ik bij "Heeft uw kind veel meer zorg" kies "Nee"
    Dan staan onder "Andere regelingen die soms passen" de stappen:
      | Is uw kind 3 tot 18 jaar en heeft het veel meer zorg nodig dan andere kinderen? |
      | Bent u alleenstaande ouder, of heeft uw partner weinig of geen inkomen?         |
      | Zorgt u veel meer voor uw kind dan bij andere kinderen?                         |
      | Heeft uw kind altijd 24 uur per dag zorg of toezicht nodig?                     |
    En begint stap 1 met "Maakt u extra kosten door de ziekte of beperking van uw kind?"
    En zie ik het veld "Krijgt u al dubbele kinderbijslag?" niet

  Scenario: Met veel zorg past dubbele kinderbijslag waarschijnlijk, ook zonder de andere antwoorden
    Gegeven ik open het overzicht voor "Extra kosten of kinderbijslag" zonder gemeente met leeftijd "4 tot 12"
    Als ik bij "Heeft uw kind veel meer zorg" kies "Ja"
    Dan begint stap 1 met "Heeft uw kind veel meer zorg nodig dan andere kinderen?"
    En staat bij stap 1 "Past waarschijnlijk"
    En is er geen blok "Andere regelingen die soms passen"
    En zie ik het veld "Krijgt u al dubbele kinderbijslag?"
    En zie ik het veld "Bent u alleenstaande ouder, of heeft uw partner weinig of geen inkomen?" niet

  Scenario: Bij een kind van 18 of ouder past dubbele kinderbijslag niet meer
    Gegeven ik open het overzicht voor "Extra kosten of kinderbijslag" zonder gemeente met leeftijd "18 of ouder"
    Als ik bij "Heeft uw kind veel meer zorg" kies "Ja"
    Dan staan onder "Andere regelingen die soms passen" de stappen:
      | Dubbele kinderbijslag is er voor kinderen van 3 tot 18 jaar |
    En zie ik het veld "Krijgt u al dubbele kinderbijslag?" niet

  Scenario: Alleen vervoer naar school: leerlingenvervoer past, de belastingaftrek staat ingeklapt
    Gegeven ik open het overzicht voor "Extra kosten of kinderbijslag" zonder gemeente
    Als ik kies "Vervoer naar school"
    Dan staat bij de stap "Gaat uw kind naar speciaal onderwijs of naar een school ver weg?" "Past waarschijnlijk"
    En staan onder "Andere regelingen die soms passen" de stappen:
      | Betaalt u zelf zorgkosten die niemand vergoedt? |
    En staat in de url "kosten=school"

  Scenario: "Geen van deze" zet de andere kosten uit
    Gegeven ik open het overzicht voor "Extra kosten of kinderbijslag" zonder gemeente
    Als ik kies "Vervoer naar school"
    En ik kies "Geen van deze"
    Dan is de knop "Vervoer naar school" niet aangezet
    En staan onder "Andere regelingen die soms passen" de stappen:
      | Gaat uw kind naar speciaal onderwijs of naar een school ver weg? |
      | Betaalt u zelf zorgkosten die niemand vergoedt?                  |

  Scenario: Met alle vragen beantwoord klapt het blok in, met hoeveel regelingen waarschijnlijk passen
    Gegeven ik open het overzicht voor "Extra kosten of kinderbijslag" zonder gemeente met leeftijd "4 tot 12"
    Als ik bij "Heeft uw kind veel meer zorg" kies "Ja"
    En ik bij "Krijgt u al dubbele kinderbijslag?" kies "Nee"
    En ik kies "Reizen naar zorg of behandeling"
    En ik bij "Is het met uw inkomen soms krap?" kies "Nee"
    Dan is het verdiepingsblok ingeklapt
    En is de samenvatting "4 regelingen passen waarschijnlijk bij u. Ze staan bovenaan."
    En staan de stappen in deze volgorde:
      | Heeft uw kind veel meer zorg nodig dan andere kinderen?       |
      | Maakt u extra kosten door de ziekte of beperking van uw kind? |
      | Zorgt u veel meer voor uw kind dan bij andere kinderen?       |
      | Heeft uw kind altijd 24 uur per dag zorg of toezicht nodig?   |
      | Betaalt u zelf zorgkosten die niemand vergoedt?               |
      | Voor jeugdhulp betaalt u geen eigen bijdrage.                 |
      | Heeft u een pgb?                                              |
    En staan onder "Andere regelingen die soms passen" de stappen:
      | Bent u alleenstaande ouder, of heeft uw partner weinig of geen inkomen? |
      | Is het met uw inkomen soms krap?                                                     |
      | Gaat uw kind naar speciaal onderwijs of naar een school ver weg?        |

  Scenario: Bij een volgend bezoek staan de antwoorden ingeklapt voorop
    Gegeven ik open het overzicht voor "Extra kosten of kinderbijslag" zonder gemeente
    Als ik bij "Heeft uw kind veel meer zorg" kies "Nee"
    En ik bij "Is het met uw inkomen soms krap?" kies "Ja"
    En ik het overzicht later opnieuw open
    Dan is het verdiepingsblok ingeklapt
    En staat bij de stap "Is het met uw inkomen soms krap?" "Past waarschijnlijk"

  Scenario: Bij de mantelzorgwaardering staat dat ook kinderen mantelzorger kunnen zijn
    Kinderen die zorgen voor een zieke ouder, broer of zus krijgen vaak ook een waardering (gebruiker, 21-10).
    Gegeven ik open het overzicht voor "Extra kosten of kinderbijslag" zonder gemeente
    Dan zie ik "Ook kinderen kunnen mantelzorger zijn, bijvoorbeeld voor een zieke ouder, broer of zus."

  Scenario: Wissen zet alle regelingen terug
    Gegeven ik open het overzicht voor "Extra kosten of kinderbijslag" zonder gemeente
    Als ik bij "Heeft uw kind veel meer zorg" kies "Nee"
    En ik bij "Is het met uw inkomen soms krap?" kies "Nee"
    En ik kies "Wissen"
    Dan is er geen blok "Andere regelingen die soms passen"
    En is er geen samenvatting
    En staat in de url geen "zorg="

  Scenario: De regelingen van de gemeente staan onder de stap waar ze bij horen, onder één kopje
    Niet voor elke regeling "In <gemeente>:" ervoor; één kopje boven de regelingen bij de stap leest rustiger (gebruiker, 21-10).
    Gegeven ik open het overzicht voor "Extra kosten of kinderbijslag" in een gemeente met een regeling voor "meerkosten"
    Dan staat de regeling van die gemeente voor "meerkosten" onder de stap "Maakt u extra kosten door de ziekte of beperking van uw kind?"
    En staat boven de regelingen bij die stap "Deze lokale regelingen zijn mogelijk ook interessant:"
    En staat bij die regeling tot welk inkomen hij geldt, als de gemeente dat noemt
    En staat er geen "In <gemeente>:" voor elke regeling
    En hebben de lokale regelingen geen stapnummer

  Scenario: De pagina met alle regelingen staat er niet nog eens als een regeling er al naartoe linkt
    Gegeven ik open het overzicht voor "Extra kosten of kinderbijslag" in een gemeente waar een regeling naar de pagina met alle regelingen linkt
    Dan linkt bij de stap "Is het met uw inkomen soms krap?" maar één link naar die pagina

  # Geeft de gemeente ouders van een minderjarig kind geen mantelzorgwaardering (geldregelingen, ouders: "nee"), dan staat die stap
  # ingeklapt, met die zin erbij. Welke gemeente dat doet, verandert per onderzoeksronde; de regel staat daarom in tests/e2e/unit/regelingen.spec.ts.

  Scenario: Keuzes wissen op de voorpagina wist ook de antwoorden van de regelingencheck
    Gegeven ik heb eerder gekozen voor de gemeente "Utrecht"
    En ik heb eerder de vraag "Extra kosten of kinderbijslag" gekozen met leeftijd "4 tot 12"
    En ik open het overzicht voor "Extra kosten of kinderbijslag" in "Utrecht"
    Als ik bij "Is het met uw inkomen soms krap?" kies "Ja"
    En ik open de voorpagina
    En ik kies "Keuzes wissen"
    Dan is er niets bewaard onder "jr.regelingen"
