# language: nl
Functionaliteit: Voorpagina en startvragen
  Op de voorpagina kiest de ouder de gemeente en daarna één vraag tegelijk: eerst de situatie (vijf vlakken), dan zo nodig
  de precieze vraag, en dan, waar dat het overzicht verandert, de leeftijd en wat er speelt. Eerdere antwoorden blijven
  staan als regel met "wijzigen". Op de telefoon schuift de volgende vraag in beeld, op de laptop niet. "Toon mijn overzicht" opent Mijn overzicht met die keuzes. Spoed staat apart bovenaan.
  Aanleiding: veertig knoppen tegelijk waren te veel (persona-tests ronde 24; schets 3 getest op 20-10).

  Scenario: Bij de start staat alleen de gemeente; daarna de vijf vlakken
    "Wat is uw situatie?" is ook een vervolgstap: zo kiest niemand een vlak zonder gemeente en hoeft niemand twee keer op
    "Toon mijn overzicht" (Joyce, ronde 25).
    Gegeven ik open de voorpagina
    Dan is de hoofdkop "Wegwijs in de jeugdzorg, per gemeente"
    En zie ik "Uw gemeente regelt jeugdhulp, en iedere gemeente doet dat anders."
    En zie ik "Waar woont u?"
    En zie ik "Wat is uw situatie?" niet
    En zie ik de knop "Ik zoek hulp voor mijn kind" niet
    Als ik als gemeente "Utrecht" kies
    Dan zie ik "Wat is uw situatie?"
    En zie ik de knoppen:
      | Ik zoek hulp voor mijn kind             |
      | Er is al hulp, maar…                    |
      | Er verandert iets                       |
      | Ik heb een financiële vraag             |
      | Ik heb zorgen om een kind van een ander |
    En zie ik "Er is nog geen hulp, u weet niet waar u moet beginnen of u wacht al lang. Ook als het op school vastloopt."
    En zie ik "Het duurt te lang, het loopt vast, het is te weinig, het stopt of u wilt een klacht indienen."
    En zie ik de knop "Wij wachten te lang" niet
    En zie ik de knop "12 tot 18" niet
    En zie ik de knop "ADHD en ADD" niet
    En zie ik de link "Toon mijn overzicht" niet

  @mobiel
  Scenario: Op de telefoon staat de volgende vraag direct onder de gekozen gemeente
    De verborgen link "Zoek op woonplaats" hield daar ruimte vrij (21-10).
    Gegeven ik open de voorpagina
    Als ik als gemeente "Utrecht" kies
    Dan staat "Wat is uw situatie?" vlak onder de keuzelijst "Waar woont u?"

  Scenario: Spoed staat apart bovenaan, zonder gemeente
    Gegeven ik open de voorpagina
    Dan gaat de link "Kan het niet wachten?" naar "overzicht/?k=spoed"

  @desktop
  Scenario: Met de muis op "Kan het niet wachten?" blijft de tekst wit
    Daarvoor werd de tekst donker op de donkere achtergrond (20-10).
    Gegeven ik open de voorpagina
    Als ik met de muis op de link "Kan het niet wachten?" ga
    Dan is de tekst van de link "Kan het niet wachten?" wit

  Scenario: Bij zorgen om een kind van een ander gaat de ouder na de keuze meteen naar het overzicht
    Monique (schets 3) koos zonder dit vlak de verkeerde route. De leeftijd en wat er speelt veranderen dat overzicht niet.
    Gegeven ik open de voorpagina
    En ik als gemeente "Utrecht" kies
    Als ik kies "Ik heb zorgen om een kind van een ander"
    Dan zie ik de link "Toon mijn overzicht"
    En zie ik "Hoe oud is het kind?" niet
    En gaat de link "Toon mijn overzicht" naar "k=zorgen-om-kind"

  Abstract Scenario: Bij "<vraag>" vraagt de site <wel of niet> naar de leeftijd en wat er speelt
    De leeftijd en wat er speelt veranderen het overzicht alleen bij vragen over de hulp zelf (welke hulp, welke therapie);
    bij vragen over de gang van zaken, regels of geld niet (20-10). Per vraag: startSituaties in src/content/knelpunten.
    Gegeven ik open de voorpagina
    En ik als gemeente "Utrecht" kies
    Als ik kies "<vlak>"
    En ik kies "<vraag>"
    Dan <leeftijd>

    Voorbeelden:
      | vlak                        | vraag                         | wel of niet | leeftijd                                  |
      | Er is al hulp, maar…        | De hulp werkt niet            | wel         | zie ik "Hoe oud is uw kind?"              |
      | Er is al hulp, maar…        | Wij wachten te lang           | niet        | zie ik de link "Toon mijn overzicht"      |
      | Er is al hulp, maar…        | De gesprekken lopen vast      | niet        | zie ik de link "Toon mijn overzicht"      |
      | Er verandert iets           | Wij verhuizen                 | niet        | zie ik de link "Toon mijn overzicht"      |

  Scenario: Bij extra kosten of kinderbijslag vraagt de site de leeftijd, maar niet wat er speelt
    Dubbele kinderbijslag is er voor kinderen van 3 tot 18 jaar; de eerste stap past zich aan de leeftijd aan (leeftijdsstap).
    Gegeven ik open de voorpagina
    En ik als gemeente "Utrecht" kies
    Als ik kies "Ik heb een financiële vraag"
    En ik kies "Extra kosten of kinderbijslag"
    Dan zie ik "Hoe oud is uw kind?"
    Als ik kies "18 of ouder"
    Dan zie ik de link "Toon mijn overzicht"
    En zie ik "Wat speelt er bij uw kind? Kies alles wat past." niet
    En gaat de link "Toon mijn overzicht" naar "l=18-99"

  Scenario: Zonder leeftijd en situaties staan die vragen er ook niet
    Gegeven ik open de voorpagina
    En ik als gemeente "Utrecht" kies
    Als ik kies "Er is al hulp, maar…"
    En ik kies "Wij wachten te lang"
    Dan zie ik "Hoe oud is uw kind?" niet
    En zie ik "Wat speelt er bij uw kind? Kies alles wat past." niet

  Scenario: Eén vraag tegelijk, met de eerdere antwoorden als regel
    Gegeven ik open de voorpagina
    En ik als gemeente "Utrecht" kies
    Als ik kies "Er is al hulp, maar…"
    Dan zie ik de knoppen:
      | Wij wachten te lang            |
      | De gesprekken lopen vast       |
      | Hulp is afgewezen of te weinig |
      | Ik wil hulp uitbreiden         |
      | De hulp werkt niet             |
      | De hulp stopt                  |
      | Ik wil een pgb                 |
    En zie ik de knop "Ik zoek hulp voor mijn kind" niet
    En zie ik het antwoord "Er is al hulp, maar…"
    Als ik kies "De hulp werkt niet"
    Dan zie ik het antwoord "De hulp werkt niet"
    En zie ik de knoppen:
      | Jonger dan 4 |
      | 4 tot 12     |
      | 12 tot 18    |
      | 18 of ouder  |
    Als ik kies "4 tot 12"
    Dan zie ik het antwoord "4 tot 12"
    En zie ik "Wat speelt er bij uw kind? Kies alles wat past."
    En zie ik de link "Toon mijn overzicht"

  Scenario: Bij "Ik zoek hulp voor mijn kind" vraagt de site eerst of er al een aanvraag loopt
    Wie nog op een besluit wacht, heeft nog geen hulp en zocht "Wij wachten te lang" niet onder "Er is al hulp, maar…"
    (persona-test Kees, ronde 27).
    Gegeven ik open de voorpagina
    En ik als gemeente "Utrecht" kies
    Als ik kies "Ik zoek hulp voor mijn kind"
    Dan zie ik "Hoe ver bent u?"
    En zie ik de knoppen:
      | Ik heb nog geen hulp |
      | Wij wachten te lang  |
    En zie ik de knop "Wij zijn uit elkaar" niet
    En zie ik de knop "Jonger dan 4" niet
    Als ik kies "Ik heb nog geen hulp"
    Dan zie ik het antwoord "Ik heb nog geen hulp"
    En zie ik de knop "Jonger dan 4"
    Als ik kies "4 tot 12"
    Dan gaat de link "Toon mijn overzicht" naar "k=beginnen"

  Scenario: Wie op hulp wacht, gaat na "Wij wachten te lang" meteen naar het overzicht
    Gegeven ik open de voorpagina
    En ik als gemeente "Utrecht" kies
    Als ik kies "Ik zoek hulp voor mijn kind"
    En ik kies "Wij wachten te lang"
    Dan zie ik de link "Toon mijn overzicht"
    En zie ik "Hoe oud is uw kind?" niet
    En gaat de link "Toon mijn overzicht" naar "k=wachten"

  Scenario: Met "wijzigen" kiest de ouder opnieuw
    Gegeven ik open de voorpagina
    En ik als gemeente "Utrecht" kies
    Als ik kies "Er verandert iets"
    En ik bij "Er verandert iets" op "wijzigen" druk
    Dan zie ik de knop "Ik zoek hulp voor mijn kind"
    En zie ik de knop "Wij verhuizen" niet

  Scenario: De leeftijd is een stap die niet over te slaan is
    Gegeven ik open de voorpagina
    En ik als gemeente "Utrecht" kies
    Als ik kies "Ik zoek hulp voor mijn kind"
    En ik kies "Ik heb nog geen hulp"
    Dan zie ik "Hoe oud is uw kind?"
    En zie ik de knop "Overslaan" niet
    En zie ik de link "Toon mijn overzicht" niet
    En zie ik "Wat speelt er bij uw kind? Kies alles wat past." niet

  Scenario: Met een leeftijd staan de situaties die daarbij vaak spelen bovenaan, de rest eronder
    Er verdwijnt niets: een situatie staat één keer op het scherm, bovenaan of in zijn groep (20-10).
    Gegeven ik open de voorpagina
    En ik als gemeente "Utrecht" kies
    Als ik kies "Ik zoek hulp voor mijn kind"
    En ik kies "Ik heb nog geen hulp"
    En ik kies "4 tot 12"
    Dan staat de knop "ADHD en ADD" onder "Vaak bij deze leeftijd"
    En staat de knop "ADHD en ADD" één keer op de pagina
    En staat de knop "Eetstoornis" onder "Andere situaties"
    En zie ik 20 situaties om te kiezen

  Scenario: Een gekozen situatie blijft gekozen als de leeftijd verandert
    Gegeven ik open de voorpagina
    En ik als gemeente "Utrecht" kies
    Als ik kies "Ik zoek hulp voor mijn kind"
    En ik kies "Ik heb nog geen hulp"
    En ik kies "4 tot 12"
    En ik kies "ADHD en ADD"
    En ik bij "4 tot 12" op "wijzigen" druk
    En ik kies "12 tot 18"
    Dan is de knop "ADHD en ADD" aangezet
    En staat de knop "ADHD en ADD" onder "Andere situaties"

  Scenario: "Toon mijn overzicht" neemt de keuzes mee
    Bij "Mijn kind wordt 18" is er geen vraag naar de leeftijd: die is 12 tot 18.
    Gegeven ik open de voorpagina
    Als ik als gemeente "Apeldoorn" kies
    En ik kies "Er verandert iets"
    En ik kies "Mijn kind wordt 18"
    Dan zie ik de knop "Jonger dan 4" niet
    Als ik kies "Verstandelijke beperking"
    Dan gaat de link "Toon mijn overzicht" naar "gemeente=apeldoorn"
    En gaat de link "Toon mijn overzicht" naar "k=wordt-18"
    En gaat de link "Toon mijn overzicht" naar "s=verstandelijke-beperking"
    En gaat de link "Toon mijn overzicht" naar "l=12-18"

  Scenario: Met "Mijn gemeente staat er niet bij" verschijnen de vlakken ook
    Gegeven ik open de voorpagina
    Als ik als gemeente "Mijn gemeente staat er niet bij" kies
    Dan zie ik "Wat is uw situatie?"

  Scenario: De gemeente zoeken op woonplaats
    Gegeven ik open de voorpagina
    Als ik zoek op woonplaats "Roden"
    En ik de suggestie "Roden (gemeente Noordenveld)" kies
    Dan is als gemeente "Noordenveld" gekozen
    En zie ik "Gekozen: gemeente Noordenveld."

  Scenario: Bij verhuizen vraagt de site waar u nu woont
    Gegeven ik open de voorpagina
    En ik als gemeente "Utrecht" kies
    Als ik kies "Er verandert iets"
    En ik kies "Wij verhuizen"
    Dan zie ik "Waar woont u nu?"

  Scenario: Keuzes worden onthouden en zijn te wissen, behalve de gemeente
    De gemeente blijft staan: die verandert zelden, en de ouder hoeft hem dan niet opnieuw te zoeken (20-10).
    Gegeven ik open de voorpagina
    Als ik als gemeente "Apeldoorn" kies
    En ik kies "Er verandert iets"
    En ik kies "Mijn kind wordt 18"
    En ik de pagina opnieuw open
    Dan is als gemeente "Apeldoorn" gekozen
    En zie ik het antwoord "Mijn kind wordt 18"
    Als ik kies "Keuzes wissen"
    Dan is als gemeente "Apeldoorn" gekozen
    En zie ik de knop "Ik zoek hulp voor mijn kind"
    En zie ik het antwoord "Mijn kind wordt 18" niet

  @mobiel
  Scenario: Op de telefoon komt na een keuze de volgende vraag in beeld
    Op de telefoon viel de volgende vraag anders buiten beeld (Monique en Sanne, ronde 25).
    Gegeven ik open de voorpagina
    En ik als gemeente "Utrecht" kies
    Als ik kies "Er is al hulp, maar…"
    Dan staat "Wat speelt er?" bovenaan in beeld

  @mobiel
  Scenario: Na de laatste keuze schuift de pagina net genoeg om "Toon mijn overzicht" te laten zien
    De knop stond onder de lange lijst situaties buiten beeld (zes persona's in ronde 25 en 26). Alleen als hij niet in beeld
    staat, en net zo ver dat de onderkant van de knop bij de onderkant van het scherm staat.
    Gegeven ik open de voorpagina
    En ik als gemeente "Utrecht" kies
    En ik kies "Ik zoek hulp voor mijn kind"
    En ik kies "Ik heb nog geen hulp"
    En ik kies "4 tot 12"
    Als ik kies "ADHD en ADD"
    Dan staat de link "Toon mijn overzicht" onderaan in beeld

  @mobiel
  Scenario: Na de onderste keuze op de telefoon schuift de pagina terug naar "Toon mijn overzicht"
    De vlakken verdwijnen na de keuze en de pagina wordt korter; de knop stond dan boven het scherm (persona-test Monique,
    ronde 27). De pagina schuift terug tot de gekozen situatie en de knop in beeld staan.
    Gegeven ik open de voorpagina
    En ik als gemeente "Utrecht" kies
    Als ik kies "Ik heb zorgen om een kind van een ander"
    Dan staat de link "Toon mijn overzicht" helemaal in beeld
    En staat "Ik heb zorgen om een kind van een ander" bovenaan in beeld

  @desktop
  Scenario: Staat "Toon mijn overzicht" al in beeld, dan schuift de pagina niet
    Gegeven ik open de voorpagina
    En ik als gemeente "Utrecht" kies
    En ik kies "Er is al hulp, maar…"
    Als ik kies "Wij wachten te lang" en de pagina blijft staan
    Dan zie ik de link "Toon mijn overzicht"

  @desktop
  Scenario: Op de laptop schuift de pagina na een keuze niet
    Daar past alles in beeld; meeschuiven was niet nodig (20-10).
    Gegeven ik open de voorpagina
    En ik als gemeente "Utrecht" kies
    Als ik kies "Er is al hulp, maar…" en de pagina blijft staan

  Scenario: Gemeenten zoeken op provincie
    Gegeven ik open de voorpagina
    Als ik "Drenthe" zoek in "Zoek gemeente"
    Dan zie ik 12 kaarten met "a.card[data-naam]"

  Scenario: Onder de keuzes wijst de voorpagina ook naar de hulpmiddelen en de gemeenten
    Voor een klacht is er geen eigen vraag; Mark en Sanne (ronde 24) zochten er wel een. De verwijzing staat rustig
    onder de link naar wat landelijk geldt, niet tussen de keuzes (20-10).
    Gegeven ik open de voorpagina
    Dan gaat de link "wat landelijk voor iedereen geldt" naar "landelijk/"
    En zie ik "Ook handig: hulpmiddelen om zelf mee aan de slag te gaan, en alle gemeenten op een rij."
    En gaat de link "hulpmiddelen" in de hero naar "hulpmiddelen/"
    En gaat de link "alle gemeenten op een rij" naar "gemeenten/"

  @mobiel
  Scenario: De hint "Meer op deze pagina" verdwijnt na scrollen
    Gegeven ik open de voorpagina
    Dan zie ik de hint "Meer op deze pagina"
    Als ik een stuk naar beneden scroll
    Dan zie ik de hint niet meer
