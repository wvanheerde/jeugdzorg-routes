# language: nl
Functionaliteit: Verdieping bij "Wij zijn uit elkaar"
  De ouder kiest wie het gezag heeft: samen, alleen de ouder zelf, alleen de andere ouder, of weet het niet. Toestemming
  van beide ouders en de rechter (vervangende toestemming, BW 1:253a) horen alleen bij gezamenlijk gezag; ook bij KIES
  geven de ouders met gezag toestemming. Heeft één ouder het gezag, dan valt dat weg en ziet de ouder wat bij die situatie
  hoort (BW 1:377b en 1:377c). Bij "Weet ik niet" stelt de site twee korte vragen over huwelijk en erkenning; daaruit volgt wie
  waarschijnlijk het gezag heeft, met het uittreksel uit het gezagsregister om het zeker te weten.
  Zie CONTENT.md, "Knelpunten: verdieping in Mijn overzicht".

  Scenario: Zonder antwoord staan de gewone stappen er
    Gegeven ik open het overzicht voor "Wij zijn uit elkaar" in "Tilburg"
    Dan staan de stappen in deze volgorde:
      | Dit kunt u zelf doen:                   |
      | Dit kunt u ook zelf doen:               |
      | Dit kunt u ook zelf doen:               |
      | Hebben jullie samen het gezag?          |
      | Wilt u weten wat u mag, of naar de rechter? |
      | Lukt praten met de andere ouder niet?   |
    En zie ik "vraagt wel toestemming van beide ouders."
    En zie ik "wel toestemming van beide ouders nodig. Weigert de andere ouder?"
    En is er geen samenvatting

  Scenario: De vraag staat als kop, zonder label erbij
    De kop zegt waar het over gaat; "Meer passend advies" en "niet verplicht" werden gemist of overgeslagen (persona-tests ronde 24).
    Ook "u kunt dit overslaan" is weg: de stappen staan er zonder antwoord ook, en het label trok de aandacht van de vraag af.
    Gegeven ik open het overzicht voor "Wij zijn uit elkaar" in "Tilburg"
    Dan zie ik de kop "Wie heeft het gezag over uw kind?"
    En zie ik de kop "Meer passend advies" niet
    En staat er geen label bij de kop

  Scenario: Bij gezamenlijk gezag blijven de stappen over toestemming en de rechter
    Gegeven ik open het overzicht voor "Wij zijn uit elkaar" in "Tilburg"
    Als ik kies "Wij samen"
    Dan is het verdiepingsblok ingeklapt
    En is de samenvatting "Jullie hebben samen het gezag."
    En staan de stappen in deze volgorde:
      | Dit kunt u zelf doen:                   |
      | Dit kunt u ook zelf doen:               |
      | Dit kunt u ook zelf doen:               |
      | Hebben jullie samen het gezag?          |
      | Wilt u weten wat u mag, of naar de rechter? |
      | Lukt praten met de andere ouder niet?   |
    En staat in de url "gezag=samen"

  Scenario: Heeft de ouder alleen het gezag, dan vallen toestemming en de rechter weg
    Gegeven ik open het overzicht voor "Wij zijn uit elkaar" in "Tilburg"
    Als ik kies "Alleen ik"
    Dan is de samenvatting "U heeft alleen het gezag."
    En staan de stappen in deze volgorde:
      | Dit kunt u zelf doen:                   |
      | Dit kunt u ook zelf doen:               |
      | Dit kunt u ook zelf doen:               |
      | Heeft u alleen het gezag?               |
      | Wilt u weten wat u mag, of naar de rechter? |
      | Lukt praten met de andere ouder niet?   |
    En zie ik "zoals KIES, vraagt toestemming van de ouder met gezag: dat bent u."
    En zie ik "vraagt wel toestemming van beide ouders" niet
    En zie ik "vervangende toestemming" niet
    En zie ik "U kunt al veel doen, ook zonder de andere ouder"
    En zie ik "wel toestemming van beide ouders nodig" niet
    En staat in de url "gezag=ik"

  Scenario: Heeft alleen de andere ouder het gezag, dan staat wat de ouder wel kan
    Gegeven ik open het overzicht voor "Wij zijn uit elkaar" in "Tilburg"
    Als ik kies "Alleen de andere ouder"
    Dan is de samenvatting "Alleen de andere ouder heeft het gezag."
    En staan de stappen in deze volgorde:
      | Dit kunt u zelf doen:                   |
      | Dit kunt u ook zelf doen:               |
      | Dit kunt u ook zelf doen:               |
      | Heeft alleen de andere ouder het gezag? |
      | Wilt u weten wat u mag, of naar de rechter? |
      | Lukt praten met de andere ouder niet?   |
    En zie ik "zoals KIES, vraagt toestemming van de ouder met gezag: dat is de andere ouder."
    En zie ik "vervangende toestemming" niet
    En zie ik "wel toestemming van beide ouders nodig" niet
    En staat in de url "gezag=ander"

  Scenario: Bij gezamenlijk gezag zegt de stap in gewone woorden wat de rechter kan
    Gegeven ik open het overzicht voor "Wij zijn uit elkaar" in "Tilburg"
    Als ik kies "Wij samen"
    Dan zie ik "Weigert de andere ouder? Dan kan de rechter toestemming geven, zodat de hulp toch kan beginnen"

  Scenario: Weet de ouder het niet, dan staat na stap 1 hoe het na te gaan is en wat het betekent
    Linda (ronde 24) moest na "Weet ik niet" eerst langs drie tips, en zag niet wat het uittreksel voor haar betekent.
    In ronde 27 zocht ze het antwoord op "mag ik zonder de andere ouder?" onderaan: dat staat nu bovenaan de stap.
    Stap 1 (het wijkteam, met het contact eronder) blijft voorop, zoals bij hulp aanvragen.
    Gegeven ik open het overzicht voor "Wij zijn uit elkaar" in "Tilburg"
    Als ik kies "Weet ik niet"
    Dan is de samenvatting "U weet niet wie het gezag heeft."
    En staan de stappen in deze volgorde:
      | Dit kunt u zelf doen:                   |
      | Weet u niet wie het gezag heeft?        |
      | Dit kunt u ook zelf doen:               |
      | Dit kunt u ook zelf doen:               |
      | Hebben jullie samen het gezag?          |
      | Wilt u weten wat u mag, of naar de rechter? |
      | Lukt praten met de andere ouder niet?   |
    En staan onder stap "Weet u niet wie het gezag heeft?" de vervolgstappen:
      | Getrouwd of geregistreerd partner, bij de geboorte of later? |
      | Niet getrouwd, en uw kind erkend vóór 2023?                  |
      | Niet getrouwd, en uw kind erkend vanaf 2023?                 |
      | Wilt u het zeker weten?                                      |
    En zie ik "Wie het gezag heeft, geeft toestemming voor hulp: heeft u alleen het gezag, dan beslist u zelf; hebben jullie het samen, dan moeten jullie allebei instemmen."
    En staat de link naar "Gezagsregister" onder de vervolgstap "Wilt u het zeker weten?"
    En gaat de link "Uittreksel aanvragen" naar "rechtspraak.nl/zelf-regelen/uittreksel-gezagsregister"
    En staat in de url "gezag=onbekend"

  Scenario: Bij een volgend bezoek staat het antwoord ingeklapt voorop
    Gegeven ik open het overzicht voor "Wij zijn uit elkaar" in "Tilburg"
    Als ik kies "Alleen ik"
    En ik het overzicht later opnieuw open
    Dan is het verdiepingsblok ingeklapt
    En is de samenvatting "U heeft alleen het gezag."
    En zie ik "vervangende toestemming" niet

  Scenario: Na "Aanpassen" staat de link naar de stappen naast "Wissen"
    Gegeven ik open het overzicht voor "Wij zijn uit elkaar" in "Tilburg"
    Als ik kies "Alleen ik"
    En ik kies "Aanpassen"
    Dan staat de link "De stappen zijn aangepast ↓" naast "Wissen"

  Scenario: Wissen zet alle stappen terug
    Gegeven ik open het overzicht voor "Wij zijn uit elkaar" in "Tilburg"
    Als ik kies "Alleen ik"
    En ik kies "Wissen"
    Dan staat in de url geen "gezag="
    En begint stap 4 met "Hebben jullie samen het gezag?"
    En zie ik "vraagt wel toestemming van beide ouders."

  # Bij "Ik wil hulp aanvragen" staat dezelfde vraag als de situatie Scheiding gekozen is (persona-test Linda, 19-10: zij koos
  # niet de vraag over uit elkaar zijn, maar hulp aanvragen, en vond niets over gezag). Het antwoord geldt voor beide.

  Scenario: Bij hulp aanvragen met de situatie Scheiding staat de vraag naar het gezag
    Gegeven ik open het overzicht voor "Ik wil hulp aanvragen" in "Amersfoort" met de situatie "Scheiding"
    Dan zie ik "Mag u hulp regelen zonder de andere ouder?"
    En staan de stappen in deze volgorde:
      | Begin bij |
    En is er geen samenvatting

  Scenario: Bij hulp aanvragen zonder de situatie Scheiding staat de gezagsvraag ingeklapt
    Wie hulp zoekt en niet samenwoont met de andere ouder, wil weten of die moet meebeslissen, ook als het geen
    "scheiding" was (persona-test Linda, ronde 25: niet getrouwd, al uit elkaar, koos "Ik zoek hulp" en vond niets).
    Gegeven ik open het overzicht voor "Ik wil hulp aanvragen" in "Amersfoort" met de situatie "Angst of somberheid"
    Dan zie ik "Woont u niet samen met de andere ouder? Kijk dan of die moet meebeslissen."
    En zie ik "Wie heeft het gezag over uw kind?" niet
    Als ik het onderdeel "Woont u niet samen met de andere ouder?" open
    En ik kies "Weet ik niet"
    Dan begint stap 1 met "Begin bij"
    En begint stap 2 met "Weet u niet wie het gezag heeft?"

  Scenario: Bij hulp aanvragen komt na stap 1 de stap die bij het gezag hoort
    Gegeven ik open het overzicht voor "Ik wil hulp aanvragen" in "Amersfoort" met de situatie "Scheiding"
    Als ik kies "Weet ik niet"
    Dan staan de vragen van het verdiepingsblok open
    En is de samenvatting "U weet niet wie het gezag heeft."
    En staan de stappen in deze volgorde:
      | Begin bij                               |
      | Weet u niet wie het gezag heeft?        |
      | Hebben jullie samen het gezag?          |
    En staan onder stap "Weet u niet wie het gezag heeft?" de vervolgstappen:
      | Getrouwd of geregistreerd partner, bij de geboorte of later? |
      | Niet getrouwd, en uw kind erkend vóór 2023?                  |
      | Niet getrouwd, en uw kind erkend vanaf 2023?                 |
      | Wilt u het zeker weten?                                      |
    En loopt de nummering van de stappen daarna door bij 4
    En staat in de url "gezag=onbekend"

  Scenario: Het antwoord bij hulp aanvragen geldt ook bij de vraag over uit elkaar zijn
    Gegeven ik open het overzicht voor "Ik wil hulp aanvragen" in "Amersfoort" met de situatie "Scheiding"
    Als ik kies "Alleen ik"
    Dan staan de stappen in deze volgorde:
      | Begin bij                 |
      | Heeft u alleen het gezag? |
    Als ik open het overzicht voor "Wij zijn uit elkaar" in "Amersfoort"
    Dan is het verdiepingsblok ingeklapt
    En is de samenvatting "U heeft alleen het gezag."

  # Bij "Weet ik niet" stelt de site twee korte vragen en geeft een waarschijnlijke uitkomst (persona-test Linda, ronde 27 en
  # 28: ze moest haar eigen geval uit een lijst halen). Wie het kind erkende, zegt wie de moeder is: die heeft bij erkenning
  # vóór 2023 zonder huwelijk alleen het gezag (BW 1:253b). Het uittreksel blijft de manier om het zeker te weten.

  Scenario: Bij "Weet ik niet" vraagt de site of de ouders getrouwd waren
    Gegeven ik open het overzicht voor "Wij zijn uit elkaar" in "Tilburg"
    Als ik kies "Weet ik niet"
    Dan zie ik "Waren jullie getrouwd of geregistreerd partner?"
    En zie ik "Wanneer is uw kind erkend, en door wie?" niet
    Als ik kies "Nee"
    Dan zie ik de knoppen:
      | Vóór 2023, door de andere ouder |
      | Vóór 2023, door mij             |
      | In 2023 of later                |
      | Dat weet ik niet                |

  Abstract Scenario: Uit de antwoorden volgt wie waarschijnlijk het gezag heeft
    Gegeven ik open het overzicht voor "Wij zijn uit elkaar" in "Tilburg"
    Als ik kies "Weet ik niet"
    En ik kies "Nee"
    En ik kies "<erkend>"
    Dan is het verdiepingsblok ingeklapt
    En is de samenvatting "<samenvatting>"
    En zie ik "<uitleg>"
    En begint stap 4 met "<stap>"
    En gaat de link "Vraag een gratis uittreksel aan uit het gezagsregister" naar "rechtspraak.nl/zelf-regelen/uittreksel-gezagsregister"
    En staat in de url "erkend=<url>"

    Voorbeelden:
      | erkend                          | samenvatting                                          | uitleg                                              | stap                                    | url    |
      | Vóór 2023, door de andere ouder | Waarschijnlijk heeft u alleen het gezag.              | Dan heeft alleen de moeder het gezag: dat bent u.    | Heeft u alleen het gezag?               | ander  |
      | Vóór 2023, door mij             | Waarschijnlijk heeft alleen de andere ouder het gezag. | Dan heeft alleen de moeder het gezag.               | Heeft alleen de andere ouder het gezag? | ik     |
      | In 2023 of later                | Waarschijnlijk hebben jullie samen het gezag.         | tenzij bij de erkenning iets anders is vastgelegd.  | Hebben jullie samen het gezag?          | 2023   |

  Scenario: Getrouwd of geregistreerd partner: waarschijnlijk samen gezag, zonder tweede vraag
    Gegeven ik open het overzicht voor "Wij zijn uit elkaar" in "Tilburg"
    Als ik kies "Weet ik niet"
    En ik kies "Ja"
    Dan is het verdiepingsblok ingeklapt
    En is de samenvatting "Waarschijnlijk hebben jullie samen het gezag."
    En zie ik "Dan hebben jullie samen het gezag, ook na de scheiding."
    En begint stap 4 met "Hebben jullie samen het gezag?"
    En staat in de url "getrouwd=ja"

  Scenario: Weet de ouder ook niet wanneer het kind erkend is, dan blijft de uitleg over hoe het meestal gaat
    Gegeven ik open het overzicht voor "Wij zijn uit elkaar" in "Tilburg"
    Als ik kies "Weet ik niet"
    En ik kies "Nee"
    En ik kies "Dat weet ik niet"
    Dan is het verdiepingsblok ingeklapt
    En is de samenvatting "U weet niet wie het gezag heeft."
    En begint stap 2 met "Weet u niet wie het gezag heeft?"

  Scenario: De uitkomst geldt ook bij hulp aanvragen en blijft bewaard
    Linda (ronde 28) zocht hulp, was niet getrouwd en de vader erkende haar dochter in 2018.
    Gegeven ik open het overzicht voor "Ik wil hulp aanvragen" in "Amersfoort" met de situatie "Scheiding"
    Als ik kies "Weet ik niet"
    En ik kies "Nee"
    En ik kies "Vóór 2023, door de andere ouder"
    Dan staan de stappen in deze volgorde:
      | Begin bij                 |
      | Heeft u alleen het gezag? |
    Als ik het overzicht later opnieuw open
    Dan is het verdiepingsblok ingeklapt
    En is de samenvatting "Waarschijnlijk heeft u alleen het gezag."
    En zie ik "Dan heeft alleen de moeder het gezag: dat bent u."

  Scenario: Wissen haalt ook de antwoorden op de vervolgvragen weg
    Gegeven ik open het overzicht voor "Wij zijn uit elkaar" in "Tilburg"
    Als ik kies "Weet ik niet"
    En ik kies "Ja"
    En ik kies "Wissen"
    Dan staat in de url geen "getrouwd="
    En is er geen samenvatting
    En begint stap 4 met "Hebben jullie samen het gezag?"
