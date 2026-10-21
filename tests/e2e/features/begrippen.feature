# language: nl
Functionaliteit: Moeilijke woorden
  Moeilijke woorden in de tekst hebben een uitleg die opent met een klik. Alle woorden staan ook op één pagina.

  Scenario: Uitleg bij een moeilijk woord openen en sluiten
    Gegeven ik open de pagina "hulpsoorten/ambulante-begeleiding/"
    Als ik op het moeilijke woord "beschikking" klik
    Dan zie ik bij "beschikking" de uitleg "Het besluit van de gemeente over welke hulp uw kind krijgt"
    Als ik op het moeilijke woord "beschikking" klik
    Dan is de uitleg bij "beschikking" dicht

  Scenario: De lijst met moeilijke woorden doorzoeken
    Gegeven ik open de pagina "begrippen/"
    Dan is de hoofdkop "Moeilijke woorden uitgelegd"
    En staan er geen uitlegknoppen in de lijst met begrippen
    Als ik "beschikking" zoek in "Zoek een woord"
    Dan zie ik "Het besluit van de gemeente over welke hulp uw kind krijgt"

  Scenario: Een woord dat er niet bij staat
    Gegeven ik open de pagina "begrippen/"
    Als ik "xyzzy" zoek in "Zoek een woord"
    Dan zie ik "Dit woord staat er (nog) niet bij."

  Scenario: Griffierecht heeft uitleg, want ouders betalen het als ze naar de rechter gaan
    Gegeven ik open de pagina "brieven/ingebrekestelling/"
    Als ik de tips "Voor u verstuurt" bekijk
    Dan is "griffierecht" een moeilijk woord met uitleg

  Scenario: KIES heeft uitleg, want het wordt genoemd bij scheiden
    Gegeven ik open het overzicht voor "Wij zijn uit elkaar" in "Tilburg"
    Als ik op het moeilijke woord "KIES" klik
    Dan zie ik bij "KIES" de uitleg "kinderen van gescheiden ouders"

  Scenario: Het werkwoord "kies" is geen moeilijk woord
    Alleen KIES in hoofdletters is de naam van de aanpak; "Kies alles wat past" blijft gewone tekst.
    Gegeven ik open het overzicht voor "Ik wil hulp uitbreiden" in "Haarlem"
    Dan zie ik "Kies alles wat past."
    En is "Kies" met precies deze letters geen moeilijk woord
