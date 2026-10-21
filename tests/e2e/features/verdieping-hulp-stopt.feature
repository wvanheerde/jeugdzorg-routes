# language: nl
Functionaliteit: Verdieping bij "De hulp stopt"
  De ouder kiest waarom de hulp stopt. Dan blijven alleen de stappen bij die reden over.

  Scenario: De vraag staat als kop
    Gegeven ik open het overzicht voor "De hulp stopt" in "Zwolle"
    Dan zie ik de kop "Waarom stopt de hulp?"
    En zie ik de kop "Meer passend advies" niet

  Scenario: Zonder reden staan alle stappen er
    Gegeven ik open het overzicht voor "De hulp stopt" in "Utrecht"
    Dan begint stap 1 met "Stopt de aanbieder"
    En zie ik "Vindt de aanbieder dat de hulp klaar is"

  Scenario: Een reden kiezen laat alleen de stappen daarbij staan en klapt het blok in
    Gegeven ik open het overzicht voor "De hulp stopt" in "Utrecht"
    Als ik kies "De gemeente stopt de hulp"
    Dan is het verdiepingsblok ingeklapt
    En is de samenvatting "U koos: de gemeente stopt de hulp."
    En begint stap 1 met "Heeft de gemeente besloten"
    En zie ik "Vindt de aanbieder dat de hulp klaar is" niet
    En staat in de url "reden=gemeente"

  Scenario: Na "Aanpassen" staat de link naar de stappen naast "Wissen"
    Gegeven ik open het overzicht voor "De hulp stopt" in "Utrecht"
    Als ik kies "De aanbieder stopt"
    En ik kies "Aanpassen"
    Dan staat de link "De stappen zijn aangepast ↓" naast "Wissen"

  Scenario: Nog eens klikken haalt de reden weg
    Gegeven ik open het overzicht voor "De hulp stopt" in "Utrecht"
    Als ik kies "De aanbieder stopt"
    En ik kies "Aanpassen"
    En ik kies "De aanbieder stopt"
    Dan staat in de url geen "reden="
    En zie ik "Vindt de aanbieder dat de hulp klaar is"
