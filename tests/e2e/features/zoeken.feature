# language: nl
Functionaliteit: Zoeken op de site
  Een vergrootglas rechts in het menu opent een zoekbalk op de plek van het menu (24-10). De zoekindex (Pagefind) maakt de build;
  het zoekscript laadt pas bij het openen, zodat de pagina's niet groter worden. Resultaten tonen de soort pagina. Eerst de andere pagina's, dan de
  gemeenten (hooguit drie, de rest achter "Meer gemeenten"), omdat 342 gelijke pagina's anders de lijst vullen; noemt de zoekopdracht een
  gemeente of woonplaats, dan staat die gemeente bovenaan (24-10). Mijn overzicht staat er niet in.

  @desktop
  Scenario: Op de laptop staat het vergrootglas rechts naast "Hulpmiddelen"
    Gegeven ik open de voorpagina
    Dan staat de knop "Zoeken" rechts naast "Hulpmiddelen" in het menu

  Scenario: Het vergrootglas vervangt het menu door een zoekbalk
    Gegeven ik open de voorpagina
    Als ik klik op "Zoeken"
    Dan zie ik het hoofdmenu niet
    En staat de cursor in "Zoek op de site"
    Als ik op "Escape" druk
    Dan zie ik het veld "Zoek op de site" niet
    En staat de cursor op de knop "Zoeken"

  Scenario: Het kruisje sluit de zoekbalk
    Gegeven ik open de voorpagina
    Als ik klik op "Zoeken"
    En ik klik op "Zoeken sluiten"
    Dan zie ik het veld "Zoek op de site" niet

  Scenario: Zoeken op een onderwerp geeft eerst de pagina's daarover, met de soort erbij
    Gegeven ik open de voorpagina
    Als ik klik op "Zoeken"
    En ik "bezwaar" typ in "Zoek op de site"
    Dan zie ik het zoekresultaat "Bezwaar tegen een besluit van de gemeente" met de soort "Voorbeeldbrief"

  Scenario: Zoeken op de naam van een gemeente geeft eerst die gemeente
    Gegeven ik open de voorpagina
    Als ik klik op "Zoeken"
    En ik "Nieuwkoop" typ in "Zoek op de site"
    Dan is het eerste zoekresultaat "Jeugdzorg in Nieuwkoop"

  Scenario: De andere pagina's staan boven de gemeenten
    Wie "bezwaar" zoekt, heeft eerst de algemene uitleg nodig; het stuk van de eigen gemeente komt daarna.
    Gegeven ik open de voorpagina
    Als ik klik op "Zoeken"
    En ik "bezwaar" typ in "Zoek op de site"
    Dan staan de gemeenten onder de andere zoekresultaten

  Abstract Scenario: Noemt de zoekopdracht een gemeente of woonplaats, dan staat die gemeente bovenaan (<zoek>)
    Gegeven ik open de voorpagina
    Als ik klik op "Zoeken"
    En ik "<zoek>" typ in "Zoek op de site"
    Dan is het eerste zoekresultaat "<gemeente>"

    Voorbeelden:
      | zoek            | gemeente               |
      | bezwaar utrecht | Jeugdzorg in Utrecht   |
      | Bilthoven       | Jeugdzorg in De Bilt   |

  Scenario: Met een gemeentenaam erbij staan ook de algemene pagina's over het onderwerp
    Andere pagina's noemen de gemeente niet; die zoekt de site daarom nog eens zonder de plaatsnaam.
    Gegeven ik open de voorpagina
    Als ik klik op "Zoeken"
    En ik "bezwaar utrecht" typ in "Zoek op de site"
    Dan zie ik het zoekresultaat "Bezwaar tegen een besluit van de gemeente" met de soort "Voorbeeldbrief"

  Scenario: Hooguit drie gemeenten tussen de resultaten, de rest achter "Meer gemeenten"
    Gegeven ik open de voorpagina
    Als ik klik op "Zoeken"
    En ik "wijkteam" typ in "Zoek op de site"
    Dan staan er hooguit 3 gemeenten tussen de zoekresultaten
    Als ik klik op "Meer gemeenten"
    Dan staan er meer dan 3 gemeenten tussen de zoekresultaten

  Scenario: Niets gevonden
    Gegeven ik open de voorpagina
    Als ik klik op "Zoeken"
    En ik "xyzzyqq" typ in "Zoek op de site"
    Dan zie ik "Niets gevonden voor “xyzzyqq”."

  Scenario: Mijn overzicht staat niet in de zoekresultaten
    Gegeven ik open de voorpagina
    Als ik klik op "Zoeken"
    En ik "Mijn overzicht" typ in "Zoek op de site"
    Dan gaat geen zoekresultaat naar "overzicht/"

  Abstract Scenario: Ouders vinden een situatie met hun eigen woorden of een hele zin (<zoek>)
    Situaties hebben zoekwoorden zoals ouders ze gebruiken ("slaat", "plast in bed"); woorden die niets zeggen ("mijn", "nog",
    "steeds") telt de zoekfunctie niet mee, en staat niets met alle woorden samen, dan zoekt hij op de losse woorden (24-10).
    Gegeven ik open de voorpagina
    Als ik klik op "Zoeken"
    En ik "<zoek>" typ in "Zoek op de site"
    Dan is het eerste zoekresultaat "<situatie>"

    Voorbeelden:
      | zoek                                       | situatie            |
      | Mijn kind slaat andere kinderen op school  | Gedragsproblemen    |
      | Mijn kind is nog steeds niet zindelijk     | Zindelijkheid       |
      | mijn zoon plast nog in bed                 | Zindelijkheid       |
      | onze dochter wil niet meer naar school     | School loopt vast   |
      | hij gamet de hele dag                      | Verslaving en gamen |

  Scenario: Een situatie in de resultaten opent bij het begin van de pagina
    Het begin van een situatiepagina is de beste ingang; de treffer opende midden op de pagina (Naima, persona-test 24-10).
    Gegeven ik open de voorpagina
    Als ik klik op "Zoeken"
    En ik "mijn zoon slaapt slecht" typ in "Zoek op de site"
    Dan gaat het zoekresultaat "Slaapproblemen" naar "situaties/slaapproblemen/"

  Scenario: Tijdens het laden staat er "Zoeken…"
    De eerste keer laadt de zoekfunctie even; zonder melding leek het alsof er niets gebeurde (Ingrid, persona-test 24-10).
    Gegeven de zoekfunctie laadt traag
    En ik open de voorpagina
    Als ik klik op "Zoeken"
    En ik "bezwaar" typ in "Zoek op de site"
    Dan zie ik "Zoeken…"
    En zie ik het zoekresultaat "Bezwaar tegen een besluit van de gemeente" met de soort "Voorbeeldbrief"

  Scenario: Een situatie die het woord alleen terloops noemt, staat onder de andere pagina's
    Bij "zorgovereenkomst" stonden Zindelijkheid en Autisme boven de uitleg over het pgb (Ingrid, persona-test 24-10). Een situatie gaat
    alleen voor als haar titel of een zoekwoord in de zoekopdracht staat.
    Gegeven ik open de voorpagina
    Als ik klik op "Zoeken"
    En ik "zorgovereenkomst" typ in "Zoek op de site"
    Dan is het eerste zoekresultaat "Zorgovereenkomst"

  Scenario: Een woord uit de begrippenlijst opent bij dat woord
    De treffer opende bovenaan de lijst; Ingrid moest zelf de letter kiezen (persona-test zoeken r3, 24-10).
    Gegeven ik open de voorpagina
    Als ik klik op "Zoeken"
    En ik "zorgovereenkomst" typ in "Zoek op de site"
    Dan gaat het zoekresultaat "Zorgovereenkomst" naar "begrippen/#zorgovereenkomst"

  Scenario: Bij een situatie staat de herkenningszin, niet een stukje tekst
    In het stukje tekst stonden de verborgen vervoegingen ("slaapt wordt wakker", Naima, persona-test zoeken r4, 24-10).
    Gegeven ik open de voorpagina
    Als ik klik op "Zoeken"
    En ik "mijn zoon slaapt slecht" typ in "Zoek op de site"
    Dan staat bij het zoekresultaat "Slaapproblemen" de tekst "Mijn kind slaapt slecht: komt moeilijk in slaap"
    En zie ik "slaapt wordt wakker" niet

  Scenario: Met de gemeente en het probleem in één zin staan de gemeente en de situatie allebei bovenaan
    "ik woon in alphen aan den rijn en mijn dochter heeft last van dyslexie" gaf alleen gemeenten: zonder de plaatsnaam bleef "woon last
    dyslexie" over, en één lange pagina had die drie woorden. Nu tellen "woon" en "last" niet mee, en vindt de zoekfunctie weinig met
    alle woorden samen, dan zoekt hij ook op de losse woorden (24-10).
    Gegeven ik open de voorpagina
    Als ik klik op "Zoeken"
    En ik "ik woon in alphen aan den rijn en mijn dochter heeft last van dyslexie" typ in "Zoek op de site"
    Dan is het eerste zoekresultaat "Jeugdzorg in Alphen aan den Rijn"
    En zie ik het zoekresultaat "Dyslexie en dyscalculie" met de soort "Situatie"

  Scenario: Een treffer op een overzichtspagina opent bij het blok waar het over gaat
    "Therapievormen per situatie" opende bovenaan de pagina (24-10). Ankers staan op de kop, dan linkt de zoekfunctie naar het blok.
    Gegeven ik open de voorpagina
    Als ik klik op "Zoeken"
    En ik "mijn kind heeft moeite met lezen" typ in "Zoek op de site"
    Dan gaat het zoekresultaat "Therapievormen per situatie" naar "therapievormen/#leerstoornissen"

  Abstract Scenario: Op <pagina> staan de ankers op de koppen, zodat een treffer bij het onderdeel opent
    Een anker op het blok in plaats van op de kop kan de zoekfunctie niet gebruiken: de treffer opende dan bovenaan (24-10).
    Gegeven ik open de pagina "<adres>"
    Dan heeft elke kop <kop> in de inhoud een anker
    En wijzen de snelkoppelingen op de pagina naar koppen

    Voorbeelden:
      | pagina                     | adres                       | kop |
      | een gemeentepagina         | gemeenten/utrecht/          | h2  |
      | Organisaties               | organisaties/               | h3  |
      | een therapievorm           | therapievormen/emdr/        | h2  |
      | een hulpsoort              | hulpsoorten/dyslexiezorg/   | h2  |
      | Hulpmiddelen               | hulpmiddelen/               | h2  |

  Scenario: Een organisatie in de resultaten opent bij die organisatie
    Gegeven ik open de voorpagina
    Als ik klik op "Zoeken"
    En ik "kindertelefoon" typ in "Zoek op de site"
    Dan gaat het zoekresultaat "Organisaties" naar "organisaties/#kindertelefoon"

  Scenario: Een gemeente in de resultaten opent bij het onderdeel over het onderwerp, niet bij "Hoe gaat het hier?"
    Dat onderdeel heeft de meeste tekst (raadsstukken, nieuws) en won daardoor bijna altijd; wie "bezwaar utrecht" zoekt, wil weten
    hoe bezwaar maken in Utrecht gaat (24-10).
    Gegeven ik open de voorpagina
    Als ik klik op "Zoeken"
    En ik "bezwaar utrecht" typ in "Zoek op de site"
    Dan gaat het zoekresultaat "Jeugdzorg in Utrecht" naar "gemeenten/utrecht/#rechten"

  Scenario: Wie vraagt wat iets is, komt bij de uitleg ervan
    "wat is emdr" opende bij "Zo vraagt u het aan", omdat daar het woord het vaakst staat. Staan alle woorden die iets zeggen in de
    titel van de pagina, dan opent die bij het eerste onderdeel, de uitleg (24-10).
    Gegeven ik open de voorpagina
    Als ik klik op "Zoeken"
    En ik "wat is emdr" typ in "Zoek op de site"
    Dan gaat het zoekresultaat "EMDR" naar "therapievormen/emdr/#wat"

  Scenario: Buiten de resultaten klikken sluit de lijst; in het zoekveld klikken opent hem weer
    Gegeven ik open de voorpagina
    Als ik klik op "Zoeken"
    En ik "bezwaar" typ in "Zoek op de site"
    Dan zie ik het zoekresultaat "Bezwaar tegen een besluit van de gemeente" met de soort "Voorbeeldbrief"
    Als ik onder de zoekresultaten klik
    Dan zie ik geen zoekresultaten
    En zie ik het veld "Zoek op de site"
    Als ik in het veld "Zoek op de site" klik
    Dan zie ik het zoekresultaat "Bezwaar tegen een besluit van de gemeente" met de soort "Voorbeeldbrief"

  Abstract Scenario: Een treffer opent bij het onderdeel waar de zoekopdracht over gaat (<zoek>)
    De zoekfunctie opende bij het onderdeel waar het woord het vaakst staat ("PMTK" bij de vergoeding, "pgb" bij het pgb-plan). Nu: een
    kop die precies past gaat voor; op een pagina over één onderwerp de uitleg, tenzij de zoekopdracht over een ander onderdeel gaat
    (aanvragen, vergoeding, leeftijd, duur) (24-10).
    Gegeven ik open de voorpagina
    Als ik klik op "Zoeken"
    En ik "<zoek>" typ in "Zoek op de site"
    Dan gaat het zoekresultaat "<resultaat>" naar "<adres>"

    Voorbeelden:
      | zoek           | resultaat                          | adres                                          |
      | PMTK           | Psychomotorische (kinder)therapie  | therapievormen/psychomotorische-therapie/#wat  |
      | emdr aanvragen | EMDR                               | therapievormen/emdr/#aanvragen                 |
      | emdr vergoeding| EMDR                               | therapievormen/emdr/#onderbouwing              |
      | wat is een pgb | Moeilijke woorden uitgelegd        | begrippen/#pgb-persoonsgebonden-budget         |

  Abstract Scenario: Een pagina met het zoekwoord in de titel of een kop staat boven pagina's waar het alleen in de tekst staat (<zoek>)
    "jeugdstem" gaf eerst een klachtbrief, "kinderbijslag" de voorpagina, "oudertraining kosten" Mindfulness (24-10).
    Gegeven ik open de voorpagina
    Als ik klik op "Zoeken"
    En ik "<zoek>" typ in "Zoek op de site"
    Dan is het eerste zoekresultaat "<eerste>"

    Voorbeelden:
      | zoek                 | eerste                |
      | jeugdstem            | Jeugdstem             |
      | kinderbijslag        | kinderbijslag         |
      | oudertraining kosten | Ouder                 |
      | hoe lang duurt emdr  | EMDR                  |

