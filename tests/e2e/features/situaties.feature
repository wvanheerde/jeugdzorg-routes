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

  Scenario: De pagina van een situatie
    Gegeven ik open de pagina "situaties/adhd/"
    Dan is de hoofdkop "ADHD en ADD"
    En zie ik de koppen:
      | Welke route is logisch?                  |
      | Wat helpt, en waar het vaak misgaat      |
      | Welke hulp bestaat er?                   |
      | Voorbeeldbrieven                         |

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

