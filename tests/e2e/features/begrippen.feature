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
    Dan is "griffierecht" een moeilijk woord met uitleg
