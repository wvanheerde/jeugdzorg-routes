# language: nl
Functionaliteit: Situaties
  Per situatie staat welke route logisch is, wat helpt, welke hulp er is en wie u in uw gemeente belt.

  Scenario: De lijst met situaties en soorten hulp, zonder de vragen van ouders
    De vragen ("Ik wil hulp aanvragen" …) staan alleen op de voorpagina: dat is de ingang naar Mijn overzicht (24-10).
    Gegeven ik open de pagina "situaties/"
    Dan is de hoofdkop "Situaties"
    En zie ik de kop "Welke soorten jeugdhulp bestaan er?"
    En zie ik de kop "Waar gaat uw vraag over?" niet
    En zie ik "Wat kan ik nu doen" niet

  Scenario: Op de pagina Situaties staan de situaties in groepen
    De tegels stonden in de volgorde waarin ze erbij kwamen en liepen door elkaar. Nu in vaste groepen met een kop,
    binnen een groep op alfabet (25-10). De voorpagina en Mijn overzicht houden hun eigen volgorde.
    Gegeven ik open de pagina "situaties/"
    Dan zie ik de koppen:
      | Ontwikkeling en leren  |
      | Gevoelens en gedrag    |
      | Lichaam en gezondheid  |
      | Gezin                  |
      | Veiligheid             |
      | Online en verslaving   |
    En staat de tegel "Dwang en tics" onder de kop "Gevoelens en gedrag"
    En staat de tegel "Baby huilt veel" onder de kop "Lichaam en gezondheid"
    En staat onder de kop "Gezin" eerst de tegel "Mantelzorg in het gezin"

  Scenario: De pagina van een situatie
    Gegeven ik open de pagina "situaties/adhd/"
    Dan is de hoofdkop "ADHD en ADD"
    En zie ik de koppen:
      | Welke route is logisch?                  |
      | Wat helpt, en waar het vaak misgaat      |
      | Welke hulp bestaat er?                   |
      | Voorbeeldbrieven                         |

  Scenario: Bovenaan staat een korte inleiding, de rest staat bij de routes
    De inleiding onder de kop was vaak lang; ouders lezen dan niet door naar de routes. Bovenaan hooguit twee zinnen
    (samenvatting), de rest (inleiding) staat onder "Welke route is logisch?", vóór de routes (25-10).
    Gegeven ik open de pagina "situaties/slaapproblemen/"
    Dan heeft de inleiding onder de hoofdkop hooguit 2 zinnen
    En staat onder "Welke route is logisch?" vóór de routes "Snurkt uw kind veel"

  Scenario: Na het kiezen van de gemeente verschijnen de contactgegevens
    Gegeven ik open de pagina "situaties/adhd/"
    Als ik als gemeente "Utrecht" kies
    Dan zie ik "In Utrecht"

  Scenario: Onder de kop staat waar ouders de situatie aan herkennen
    De woorden die ouders zelf gebruiken ("slaan", "driftbuien"); de zoekfunctie telt ze zwaar mee (24-10). Vervoegingen ("slaat") tellen
    alleen in de zoekindex mee, niet zichtbaar: "slaan, slaat" las vreemd.
    Gegeven ik open de pagina "situaties/gedragsproblemen/"
    Dan zie ik "Ook bij:"
    En zie ik "driftbuien"
    En zie ik "spugen"
    Maar zie ik "slaan, slaat" niet

  Scenario: Op een situatiepagina vraagt de keuzelijst in welke gemeente u woont
    "Waar woont u?" werd gelezen als vraag naar de woonplaats; de keuzelijst bevat gemeenten (24-10).
    Gegeven ik open de pagina "situaties/gedragsproblemen/"
    Dan zie ik "In welke gemeente woont u?"

  Scenario: Bij slaapproblemen staat een verwijzing naar trauma
    Nachtmerries of angst sinds iets ergs (zoals een ongeluk) horen eerder bij Trauma; een ouder die "slaapt slecht" zoekt,
    komt bij Slaapproblemen en vond die weg niet (Naima, persona-test zoeken, 24-10).
    Gegeven ik open de pagina "situaties/slaapproblemen/"
    Dan zie ik "sinds het iets ergs heeft meegemaakt"
    En gaat de link met precies de tekst "Trauma" naar "situaties/trauma/"

