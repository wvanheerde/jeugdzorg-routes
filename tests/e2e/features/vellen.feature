# language: nl
Functionaliteit: Vellen om af te drukken: logboek, beschikking nalezen en "Dit is mijn kind"
  Drie hulpmiddelen naast het vel voor het gesprek (23-10), elk om af te drukken en met de hand in te vullen. De site bewaart
  niets van wat de ouder invult. Het logboek hoort bij "houd een logboek bij" (school loopt vast), de controlelijst bij het besluit
  op papier (hulp aanvragen, uitbreiden, verhuizen, afgewezen, het besluit loopt af), "Dit is mijn kind" bij een nieuwe hulpverlener (warme overdracht).

  Scenario: Het logboek heeft de contacten en een tabel om elk contact op te schrijven
    Gegeven ik open de pagina "logboek/"
    Dan is de hoofdkop "Logboek van afspraken en contacten"
    En zie ik de koppen:
      | Wie zijn er betrokken?         |
      | Elk contact op een rij         |
      | Zo heeft u er het meest aan    |
    En zie ik "Leerplichtambtenaar"
    En heeft het logboek 12 regels om in te vullen
    En zie ik "Vraag na elk gesprek om de afspraken op papier."

  Scenario: Met een gekozen gemeente staan het wijkteam en de cliëntondersteuner in het logboek
    Gegeven ik heb eerder gekozen voor de gemeente "Utrecht"
    En ik open de pagina "logboek/"
    Dan staan het wijkteam en de cliëntondersteuner van de gemeente op het vel

  Scenario: De controlelijst voor de beschikking noemt wat erin hoort te staan
    Gegeven ik open de pagina "beschikking/"
    Dan is de hoofdkop "Uw beschikking nalezen"
    En zie ik de koppen:
      | Uw besluit                     |
      | Staat dit erin?                |
      | Bent u het er niet mee eens?   |
      | Loopt het besluit af?          |
    En zie ik "Hoeveel hulp"
    En zie ik "Waarom de gemeente zo besliste"
    En zie ik "Hoe u bezwaar maakt"
    En zie ik "Wat er precies in het besluit moet staan, regelt uw gemeente zelf, in haar regels voor jeugdhulp (de verordening)."
    En gaat de link "Voorbeeldbrief bezwaar" naar "brieven/bezwaar-beschikking/"

  Scenario: Bij het veld "Bezwaar uiterlijk" staat wanneer u het invult, en waar u meer leest
    Gegeven ik open de pagina "beschikking/"
    Dan zie ik "Vul onderstaand veld in als u het niet met het besluit eens bent."
    En zie ik "Bezwaar uiterlijk"
    En gaat de link "Bent u het er niet mee eens?" naar "#niet-eens"
    En zie ik "Nummer van de brief"
    En zie ik "Ook als u bezwaar maakt, geldt het besluit tot de gemeente opnieuw beslist."
    Maar zie ik "Bent u het eens met het besluit?" niet

  Scenario: Op het scherm rekent de controlelijst uit tot wanneer u bezwaar kunt maken
    Gegeven ik open de pagina "beschikking/"
    Als ik het onderdeel "Reken uit tot wanneer u bezwaar kunt maken" open
    En ik "01-10-2026" typ in "Datum op het besluit"
    Dan zie ik "Uw bezwaar moet uiterlijk donderdag 12 november 2026 binnen zijn."

  Scenario: Op papier geen rekenhulp, wel de lijst
    Gegeven ik open de pagina "beschikking/"
    En ik het afdrukvoorbeeld bekijk
    Dan zie ik "Reken uit tot wanneer u bezwaar kunt maken" niet
    Maar zie ik de kop "Staat dit erin?"

  Scenario: "Dit is mijn kind" heeft ruimte voor wat helpt en wat het kind zelf wil zeggen
    Gegeven ik open de pagina "mijn-kind/"
    Dan is de hoofdkop "Dit is mijn kind"
    En zie ik de koppen:
      | Over mijn kind                       |
      | Waar mijn kind goed in is            |
      | Wat helpt                            |
      | Wat niet helpt                       |
      | Zo praat u het best met mijn kind    |
      | Wat we al geprobeerd hebben          |
      | Wie er al helpen                     |
      | Wat mijn kind zelf wil zeggen        |
    En zie ik "U beslist zelf wat u invult en aan wie u het geeft."

  Abstract Scenario: Op <pagina> staat een tip voor wie geen printer heeft
    Gegeven ik open de pagina "<adres>"
    Dan zie ik "Geen printer? Bewaar het vel als PDF en druk het af bij de bibliotheek."
    Als ik het afdrukvoorbeeld bekijk
    Dan zie ik "Geen printer?" niet

    Voorbeelden:
      | pagina           | adres      |
      | het logboek      | logboek/   |
      | Dit is mijn kind | mijn-kind/ |

  @desktop
  Abstract Scenario: Het menu wijst "Hulpmiddelen" aan op <pagina>
    Gegeven ik open de pagina "<adres>"
    Dan is "Hulpmiddelen" in het hoofdmenu de huidige pagina

    Voorbeelden:
      | pagina                      | adres        |
      | het logboek                 | logboek/     |
      | de controlelijst beschikking | beschikking/ |
      | Dit is mijn kind            | mijn-kind/   |

  Scenario: Bij "houd een logboek bij" staat de link naar het logboek
    Gegeven ik open het overzicht voor "Ik wil hulp aanvragen" in "Utrecht" met de situatie "School loopt vast of kind zit thuis"
    Dan staat de link "Logboek om af te drukken" onder de stap "Vraag na elk gesprek om de afspraken op papier"
    En gaat de link "Logboek om af te drukken" naar "logboek/"

  Abstract Scenario: Bij het besluit op papier staat de link naar de controlelijst (<vraag>: <stap>)
    Gegeven ik open het overzicht voor "<vraag>" in "Utrecht"
    Dan staat de link "Het besluit nalezen: wat hoort erin te staan" onder de stap "<stap>"
    En gaat de link "Het besluit nalezen: wat hoort erin te staan" naar "beschikking/"

    Voorbeelden:
      | vraag                           | stap                                          |
      | Ik wil hulp aanvragen           | Vraag na het gesprek om een verslag op papier |
      | Ik wil hulp uitbreiden          | Vraag om het nieuwe besluit op papier         |
      | Wij verhuizen                   | Vraag het huidige besluit                     |
      | Hulp is afgewezen of te weinig  | Stuur binnen zes weken                        |
      | De hulp stopt                   | Loopt het besluit af?                         |
      | Ik heb een beschikking gekregen | Lees het besluit na                           |

  Scenario: Wie het besluit op papier heeft, ziet de link naar de controlelijst ook
    Bij "Nee" of "Ja" valt een stap weg; de link staat daarom bij de stap over bezwaar, die altijd blijft (persona-test 23-10, Sanne).
    Gegeven ik open het overzicht voor "Hulp is afgewezen of te weinig" in "Utrecht"
    Als ik kies "Ja"
    Dan staat de link "Het besluit nalezen: wat hoort erin te staan" onder de stap "Stuur binnen zes weken"

  Scenario: Bij een nieuwe hulpverlener staat de link naar "Dit is mijn kind"
    Gegeven ik open het overzicht voor "De hulp stopt" in "Utrecht"
    Dan staat de link "Dit is mijn kind: één vel voor een nieuwe hulpverlener" onder de stap "Stopt de aanbieder met de hulp"
