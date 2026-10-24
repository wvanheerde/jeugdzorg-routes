# language: nl
Functionaliteit: Gemeenten
  Alle gemeenten staan op een lijst met een zoekveld; elke gemeente heeft een eigen pagina.

  Scenario: De lijst met gemeenten doorzoeken
    Gegeven ik open de pagina "gemeenten/"
    Dan is de hoofdkop "Gemeenten"
    Als ik "Noordenveld" zoek in "Zoek gemeente"
    Dan zie ik alleen de gemeente "Noordenveld"

  Abstract Scenario: Zoeken op een woonplaats vindt de gemeente (<pagina>)
    Wie in Huppel of Ter Aar woont, weet niet altijd onder welke gemeente dat valt (24-10). Gezocht wordt op het begin van een woord in de
    woonplaats, met dezelfde namen als op de gemeentepagina (src/lib/woonplaatsen.ts): "Huppel", niet "Winterswijk Huppel".
    Gegeven ik open de pagina "<adres>"
    Als ik "huppel" zoek in "Zoek gemeente"
    Dan zie ik alleen de gemeente "Winterswijk"
    En zie ik "Huppel valt onder deze gemeente."

    Voorbeelden:
      | pagina     | adres      |
      | Gemeenten  | gemeenten/ |
      | voorpagina | /          |

  Scenario: Woonplaatsen die met dezelfde letters beginnen, staan er allebei
    "Ter Aar" (Nieuwkoop) en "Ter Aard" (Assen): bij "ter aar" staan ze er allebei, elk met de woonplaats erbij. Dat is gewenst.
    Gegeven ik open de pagina "gemeenten/"
    Als ik "ter aar" zoek in "Zoek gemeente"
    Dan zie ik "Ter Aar valt onder deze gemeente."
    En zie ik "Ter Aard valt onder deze gemeente."

  Scenario: Wie op de naam van de gemeente zoekt, ziet geen regel over een woonplaats
    Gegeven ik open de pagina "gemeenten/"
    Als ik "Nieuwkoop" zoek in "Zoek gemeente"
    Dan zie ik alleen de gemeente "Nieuwkoop"
    En zie ik "valt onder deze gemeente" niet

  Scenario: De tegels in de lijst noemen geen datum
    De datum van bijwerken helpt ouders niet bij het kiezen; de datum staat op de pagina van de gemeente zelf (21-10).
    Gegeven ik open de pagina "gemeenten/"
    Dan noemen de tegels van de gemeenten geen datum

  Scenario: Geen gemeente gevonden
    Gegeven ik open de pagina "gemeenten/"
    Als ik "Atlantis" zoek in "Zoek gemeente"
    Dan zie ik "Geen gemeente gevonden."

  Scenario: De pagina van een gemeente
    Gegeven ik open de pagina "gemeenten/utrecht/"
    Dan is de hoofdkop "Jeugdzorg in Utrecht"
    En zie ik de kop "Hier meldt u zich in Utrecht"
    En zie ik een belknop
    En zie ik de koppen:
      | Hoe krijg ik hulp?                          |
      | Waar heb ik recht op?                       |
      | Welke hulp is er?                           |
      | Hoe gaat het met de jeugdhulp in Utrecht?   |

  Scenario: Een link naar de ervaringen klapt die open
    Gegeven ik open de pagina "gemeenten/utrecht/#ervaringen"
    Dan staat het onderdeel "Lees wat we vonden" open

  # Het register schrijft verkorte nummers als "(014) 030"; op de site staat het zoals u het intoetst.
  Scenario: Een verkort nummer van de gemeente staat er zoals u het belt
    Gegeven ik open het overzicht voor "Ik wil hulp aanvragen" in "Utrecht" met de situatie "School loopt vast of kind zit thuis"
    Dan zie ik "Bel de gemeente op 14 030"
    En zie ik een link om "14030" te bellen
