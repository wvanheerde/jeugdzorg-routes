# language: nl
Functionaliteit: Afdrukken of bewaren als PDF
  Een ouder kan Mijn overzicht, een gemeentepagina, een therapievorm en de landelijke rechten afdrukken of als PDF bewaren,
  bijvoorbeeld om mee te nemen naar een gesprek. De knop staat rechts boven het eerste blok.
  Op papier staat wat bij de keuzes hoort, zonder menu, knoppen en keuzevelden. Bovenaan staan de datum en het adres
  van het overzicht, want contactgegevens kunnen veranderen. Wat dichtgeklapt is, blijft van papier; wat de ouder
  openklapt, komt mee. Bij een website staat het adres, want op papier kunt u niet klikken. Kaarten worden op papier
  een lijst; voorbeeldbrieven en "Direct regelen" (om online iets te doen) blijven weg.
  "Ik bekijk het afdrukvoorbeeld" toont de pagina zoals de printer hem krijgt (ook via Ctrl+P of het menu van de browser).

  Scenario: Met keuzes is er een knop om af te drukken
    Gegeven ik open het overzicht voor "Ik wil hulp aanvragen" in "Utrecht"
    Dan staat de knop "Afdrukken of bewaren als PDF" rechts boven "Wat kunt u doen"
    Als ik klik op "Afdrukken of bewaren als PDF"
    Dan opent het afdrukvenster

  Scenario: Zonder keuzes is er niets om af te drukken
    Gegeven ik open de pagina "overzicht/"
    Dan zie ik de knop "Afdrukken of bewaren als PDF" niet

  Scenario: Op papier geen menu, knoppen of keuzevelden
    Gegeven ik open het overzicht voor "Ik wil hulp aanvragen" in "Utrecht" met de situatie "ADHD en ADD"
    Als ik het afdrukvoorbeeld bekijk
    Dan zie ik het hoofdmenu niet
    En zie ik de knop "Afdrukken of bewaren als PDF" niet
    En zie ik de link "Keuzes aanpassen" niet
    En zie ik de knop "Keuzes aanpassen" niet
    Maar zie ik "Utrecht · Ik wil hulp aanvragen · ADHD en ADD"
    En zie ik de kop "Wat kunt u doen"
    En zie ik de kop "Welke hulp bestaat er?"

  Scenario: Op papier een lijst in plaats van kaarten, zonder voorbeeldbrieven en "Direct regelen"
    Gegeven ik open het overzicht voor "Ik wil hulp aanvragen" in "Utrecht" met de situatie "ADHD en ADD"
    Als ik het afdrukvoorbeeld bekijk
    Dan staan de kaarten en blokken onder elkaar
    En zie ik de kop "Voorbeeldbrieven" niet
    En zie ik de kop "Direct regelen" niet

  Scenario: Op papier staan de datum en het adres om het overzicht terug te vinden
    Gegeven ik open het overzicht voor "Ik wil hulp aanvragen" in "Utrecht" met de situatie "ADHD en ADD"
    Dan zie ik "kunnen veranderen" niet
    Als ik het afdrukvoorbeeld bekijk
    Dan zie ik "Afgedrukt op 18 oktober 2026"
    En zie ik "overzicht/?gemeente=utrecht&k=beginnen&s=adhd"

  Scenario: Wat dichtgeklapt is, komt niet op papier; wat de ouder openklapt wel
    Gegeven ik open het overzicht voor "Ik wil hulp aanvragen" in "Utrecht" met de situatie "Scheiding"
    Als ik het afdrukvoorbeeld bekijk
    Dan zie ik "Is er toch jeugdhulp nodig?" niet
    Als ik het scherm weer gewoon bekijk
    En ik het onderdeel "Is er toch jeugdhulp nodig? Zo vraagt u die aan" open
    En ik het afdrukvoorbeeld bekijk
    Dan zie ik "Is er toch jeugdhulp nodig?"

  Scenario: Op papier staat bij een website het adres
    Gegeven ik open het overzicht voor "Ik wil hulp aanvragen" in "Utrecht" met de situatie "ADHD en ADD"
    Als ik het afdrukvoorbeeld bekijk
    Dan staat bij elke website het adres

  Scenario: Van de verdieping staat het antwoord op papier, niet de vragen
    Gegeven ik open het overzicht voor "Wij zijn uit elkaar" in "Tilburg"
    Als ik het afdrukvoorbeeld bekijk
    Dan zie ik de kop "Meer passend advies" niet
    Als ik het scherm weer gewoon bekijk
    En ik kies "Wij samen"
    En ik het afdrukvoorbeeld bekijk
    Dan zie ik "Jullie hebben samen het gezag."
    En zie ik de knop "Aanpassen" niet
    En zie ik de knop "Wissen" niet

  Abstract Scenario: Ook <pagina> kan op papier
    Gegeven ik open de pagina "<adres>"
    Dan staat de knop "Afdrukken of bewaren als PDF" rechts boven "<eerste blok>"
    Als ik klik op "Afdrukken of bewaren als PDF"
    Dan opent het afdrukvenster
    Als ik het afdrukvoorbeeld bekijk
    Dan zie ik het hoofdmenu niet
    En zie ik de knop "Afdrukken of bewaren als PDF" niet
    En zie ik "Afgedrukt op 18 oktober 2026"
    En zie ik "<adres>"

    Voorbeelden:
      | pagina                         | adres                         | eerste blok                       |
      | een gemeentepagina             | gemeenten/utrecht/            | Hier meldt u zich in Utrecht      |
      | een therapievorm               | therapievormen/cgt-insomnie/  | Wat is het en hoe werkt het?      |
      | de pagina met landelijke rechten | landelijk/                  | De Jeugdwet in het kort           |

  Scenario: Een gemeentepagina op papier: lijsten, adressen, zonder "Direct regelen" en de knoppen naar de onderdelen
    Gegeven ik open de pagina "gemeenten/utrecht/"
    Als ik het afdrukvoorbeeld bekijk
    Dan staan de kaarten en blokken onder elkaar
    En staat bij elke website het adres
    En zie ik de kop "Direct regelen" niet
    En zie ik de link "1. Hoe krijg ik hulp?" niet

  Scenario: "Hoe gaat het met de jeugdhulp" op een gemeentepagina komt opengeklapt op papier, ook als het dicht staat
    Gegeven ik open de pagina "gemeenten/utrecht/"
    Dan zie ik "Gebaseerd op openbare bronnen" niet
    Als ik het afdrukvoorbeeld bekijk
    Dan zie ik de kop "Hoe gaat het met de jeugdhulp in Utrecht?"
    En zie ik "Gebaseerd op openbare bronnen"
    En zie ik "Lees wat we vonden" niet
    Als ik het scherm weer gewoon bekijk
    Dan zie ik "Gebaseerd op openbare bronnen" niet

  Scenario: Een therapievorm op papier houdt de kanttekening, zonder de terug-link
    Gegeven ik open de pagina "therapievormen/cgt-insomnie/"
    Als ik het afdrukvoorbeeld bekijk
    Dan zie ik "Niet volledig en geen behandeladvies"
    En zie ik de link "← Terug naar situaties" niet
