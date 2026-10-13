# Samenvatting ronde 16 (2026-10-13): na N, S, T en U

Alle 15 scenario's, lokale build. De wijzigingen sinds ronde 15 staan in `run.md`.

## Uitkomsten: ronde 15 → ronde 16

| # | Persona | Uitkomst | Stappen | Gemak | Vertrouwen |
|---|---|---|---|---|---|
| 01 | Sanne, beginnen (Emmen) | gehaald | 13 → 13 | 5 → 5 | 5 → **6** |
| 02 | Mark, wachten (Utrecht) | gehaald | 13 → 13 | 6 → 6 | 5 → 5 |
| 03 | Fatima, kinderbijslag | gehaald | 12 → 11 | 6 → 6 | 6 → 6 |
| 04 | Peter, wordt 18 (Apeldoorn) | gehaald | 7 → **5** | 5 → **6** | 6 → 5 |
| 05 | Anouk, spoed (Zwolle) | gehaald | 3 → 3 | 5 → 5 | 6 → 6 |
| 06 | Erik, bezwaar (Den Haag) | gehaald | 8 → **5** | 6 → 6 | 6 → 6 |
| 07 | Joyce, verhuizen (Almere) | gehaald | 11 → 14 | 5 → **6** | 6 → 6 |
| 08 | Henk, opa (Aalten) | gehaald | 11 → 9 | 5 → 5 | 6 → 6 |
| 09 | Lisa, thuiszitter (Haarlem) | gehaald | 17 → **14** | 5 → 5 | 6 → 6 |
| 10 | Ahmed, scheiding (Tilburg) | gehaald | 8 → 8 | 6 → 6 | 6 → 6 |
| 11 | Ingrid, pgb (Groningen) | gehaald | 8 → **5** | 6 → 6 | 6 → 6 |
| 12 | Kees, geen besluit (Eindhoven) | gehaald | 11 → 14 | 6 → 6 | 5 → 5 |
| 13 | Naima, hulp werkt niet (Leeuwarden) | gehaald | 19 → 21 | 5 → 5 | 6 → 6 |
| 14 | Rob, hoe gaat het hier (Arnhem) | deels* | 8 → 13 | 6 → 5 | 4 → **5** |
| 15 | Monique, zorgen om kinderen (Lelystad) | gehaald | 5 → 6 | 6 → 6 | 6 → 6 |

**Totaal: 14 van 15 gehaald, gelijk aan de vorige drie rondes.** Gemak gemiddeld 5,6 (ronde 15: 5,5). Vertrouwen gemiddeld 5,7 (ronde 15: 5,7). Geen enkel probleem van ernst 3.

\* Rob vindt alles wat hij volgens het scenario moet vinden. Zijn kernvraag, hoe lang het wachten is in Arnhem, kan de site niet beantwoorden: Arnhem publiceert dat niet.

## Wat de aanpassingen deden

- **S, School loopt vast.** Lisa vond de onderwijsconsulent met telefoonnummer, de zorgplicht ("zegt school het niet te kunnen bieden…") en de leerplichtambtenaar. Ze had 14 stappen nodig in plaats van 17.
- **U, postadres in de brief.** Erik en Kees kregen het postadres van hun gemeente al ingevuld.
  - Beiden lazen het als "Postbus 126002500". Dat komt door de testtool: de tekstweergave laat de regelovergang weg.
  - In de browser en bij "Kopieer de brief" staat het adres goed, op twee regels.
- **N, regel met het wijkteam.** Sanne en Henk zagen de regel "Liever eerst het wijkteam? Dat mag ook: …". Ze noemen hem wel "onopvallend". Sanne's vertrouwen ging van 5 naar 6.
- **T, Veilig Thuis in twee stappen.** Monique leest de stap over melden als dreigend voor de band met haar zus. Haar eigenlijke vraag wordt niet beantwoord: hoort mijn zus wie belde?
- **Scrollfix.** Zonder gemeente scrolt de pagina niet meer. Ahmed meldde nog een sprong, maar die komt door de testdriver: een klik scrolt de knop in beeld.

## Wat nog niet goed gaat (allemaal ernst 2 of lager)

1. **Moeilijke woorden** (Fatima, Peter, Naima, Ahmed, Ingrid). De uitleg verschijnt alleen na een tik. Ouders zien niet dat er een uitleg achter het woord zit.
2. **Monique en de melding.** De zin "Veilig Thuis heeft liever dat het gezin weet wie de melding deed" schrikt af. Advies vragen, waar zij om belt, staat goed.
3. **Kees: wat na de ingebrekestelling?** Geen bedrag bij de dwangsom en geen uitleg over de stap naar de rechter.
4. **Mark: wachten na een verwijzing door de huisarts.** De stappen over acht weken en ingebrekestelling passen daar niet bij. Hij mist wat hij concreet kan vragen.
5. **Kleinere punten:**
   - De regel N valt weinig op (Sanne, Henk).
   - Spoed staat tussen 12 vraagknoppen (Anouk).
   - Twee nummers voor het samenwerkingsverband zonder uitleg PO of VO (Lisa).
   - Verhuizen met twee wijkteams (Joyce; voorstel G, bewust niet gebouwd).

## Testtool

De tekstweergave van `tests/persona/tools/browser.mjs` laat `<br>` weg, waardoor regels aan elkaar plakken ("Postbus 901505600 RB"). Dit wordt na deze ronde gerepareerd, met een regel onder "Wijzigingen" in `tests/persona/README.md`.

## Voorstellen

| # | Voorstel | Lost op | Waar |
|---|---|---|---|
| V | Moeilijke woorden herkenbaar maken: een ⓘ-tekentje en een duidelijkere stippellijn. Op desktop verschijnt de uitleg bij muis erop, op een telefoon blijft het tikken. | 1 | `Base.astro`, `global.css` |
| W | Monique: de zin over melden zachter en korter. Bijvoorbeeld "Doet u later toch een melding? Bespreek dan met Veilig Thuis of uw naam bij het gezin bekend wordt." | 2 | `knelpunten/zorgen-om-kind.md` |
| X | Bij de brief ingebrekestelling één alinea "Beslist de gemeente na twee weken nog niet?", met de dwangsom (bedragen uit de Awb) en beroep bij de rechtbank, met bron. | 3 | `brieven/ingebrekestelling.md` |
| Y | Bij wachten de stap "door de huisarts verwezen" als eerste tonen als er een situatie is gekozen die bij de huisarts begint. Daarbij concrete vragen voor overbruggingshulp. | 4 | `knelpunten/wachten.md`, `overzicht.astro` |
| Z | Regel N meer laten opvallen: belknop in plaats van tekstlink. | 5 | `overzicht.astro` |
