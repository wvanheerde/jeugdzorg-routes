# Verbetervoorstellen na ronde 24 (2026-10-20)

Uitwerking van de voorstellen in `samenvatting.md`.

**Stand 20-10:** 1, 2, 3, 4 en 5 (alleen KIES en EMDR) zijn uitgevoerd, met scenario's. 6 is nagekeken: de pagina verspringt niet (zie onderaan). JGZ Almere is niet aangepast.

Afwijkingen van het plan hieronder: bij 2 staat de gezagsstap direct ná stap 1 (het wijkteam), niet helemaal vooraan, zoals bij hulp aanvragen. Bij 5 heeft KIES `hoofdletters: true` gekregen, zodat het werkwoord "kies" geen uitleg krijgt.

Oorspronkelijk plan: Per voorstel: wat er misgaat, wat er verandert, welke bestanden en welk scenario, en wat het kost. Na akkoord komt eerst het scenario, dan de code (CLAUDE.md).

---

## 1. Verdieping: de vraag zelf als kop

**Wat er misgaat** (06, 10, 19, 20; minder sterk 02, 04, 12, 16)
Op de telefoon staat eerst het wijkteamblok (naam, belknop, website, uitklappers), daarna een blok met de kop "Meer passend advies" en het label *niet verplicht*, dan een zin uitleg, en pas dan de vraag ("Wie heeft het gezag over uw kind?"). De vraag zelf valt onder het eerste scherm. "Meer passend advies" zegt niet waar het over gaat, en *niet verplicht* nodigt uit om het over te slaan. Ahmed: "ik had het bijna gemist." Erik vindt de kop vaag. Mark en Kees zagen zonder antwoord alleen algemene stappen.

**Voorstel**
- De kop wordt de vraag zelf. De uitleg blijft één korte zin over wat een antwoord oplevert. Een tweede vraagtekst binnen het blok vervalt als die gelijk is aan de kop.

  | Verdieping | Nu | Nieuwe kop |
  |---|---|---|
  | wachten | Meer passend advies | Waarop wacht u? |
  | hulp-stopt | Meer passend advies | Waarom stopt de hulp? |
  | gescheiden, gezag-beginnen | Meer passend advies | Wie heeft het gezag over uw kind? |
  | afgewezen | Meer passend advies | Wat staat er in het besluit? |
  | uitbreiden | Meer passend advies | Wat speelt er bij de hulp? |
  | verhuizing | Meer passend advies bij verhuizen | Waar en wanneer verhuist u? |
  | wordt-18 | Meer passend advies bij de overgang naar 18 | Wanneer wordt uw kind 18, en wat is daarna nodig? |

- Het label *niet verplicht* wordt *u kunt dit overslaan*: dezelfde boodschap, maar het klinkt minder als "dit is niet belangrijk". Dit is een keuze in de toon; als u *niet verplicht* liever houdt, blijft het staan.
- Bij Erik ("Ja" bij "Heeft u het besluit op papier?" en dan lijkt er niets te gebeuren): opent een antwoord een nieuw veld, dan komt de focus in dat veld en scrolt de pagina ernaar. Dat geldt ook voor de datumvelden bij wachten en uitbreiden.

**Wat ik niet voorstel:** de verdieping boven het wijkteamblok zetten. Dan zakt het telefoonnummer op de telefoon een heel scherm, en juist dat nummer bovenaan prezen Sanne (01), Mark (02) en Bas (16). Met de nieuwe kop valt de vraag ook zonder verplaatsen op. Lijkt dat in de volgende ronde niet genoeg, dan is verplaatsen de volgende stap.

**Bestanden**
- `src/components/Verdieping.astro`: de kop wordt verplicht (`titel`), het label krijgt de nieuwe tekst.
- `src/components/Verdieping*.astro` (zeven bestanden): nieuwe titel; de vraagtekst binnen het blok vervalt waar die gelijk is aan de kop.
- `src/scripts/overzicht/afgewezen.ts`, `wachten.ts`, `uitbreiden.ts`: focus op het veld dat opengaat.
- `CONTENT.md` regel 86 en 89: de beschrijving van het blok.

**Scenario's**
- In de verdiepingsfeatures (`verdieping-*.feature`) een kopcontrole, bijvoorbeeld:
  ```gherkin
  Scenario: De vraag staat als kop boven de keuzes
    Gegeven ik open het overzicht voor "Wij zijn uit elkaar" in "Tilburg"
    Dan zie ik de kop "Wie heeft het gezag over uw kind?"
    En zie ik de kop "Meer passend advies" niet
  ```
- In `verdieping-afgewezen.feature`:
  ```gherkin
  Scenario: Na "Ja" staat de cursor in het datumveld
    Gegeven ik open het overzicht voor "Hulp is afgewezen of te weinig" in "Den Haag"
    Als ik kies "Ja"
    Dan staat de cursor in "Welke datum staat op het besluit?"
  ```
- Bestaande scenario's die op "Meer passend advies" zoeken, gaan mee.

**Wat het kost:** klein tot middel: zeven componenten, één regel CSS, drie scripts, scenario's.

---

## 2. Gezag bij "Weet ik niet": het gevolg erbij

**Wat er misgaat** (19, Linda)
Linda las "Niet getrouwd, en uw kind erkend vóór 2023? Dan heeft alleen de moeder het gezag" en concludeerde terecht "dat ben ik dus waarschijnlijk". Maar wat dat betekent (u geeft zelf toestemming, de vader hoeft niet in te stemmen) staat alleen bij de keuze "Alleen ik", en die koos ze niet. Ook stonden bij "Weet ik niet" eerst drie losse tips en pas daarna de uitleg over het gezag, drie keer scrollen verder.

**Voorstel**
- In `src/content/knelpunten/gescheiden.md`, bij de stap "Weet u niet wie het gezag heeft?", een laatste regel onder het uittreksel:
  > Staat in het uittreksel dat u alleen het gezag heeft? Dan geeft u zelf toestemming voor hulp aan uw kind. Hebben jullie samen het gezag, dan moeten jullie allebei instemmen.

  De bronnen staan al bij de vraag (BW 1:251b, 1:253b, rechtspraak.nl).
- Bij het antwoord "Weet ik niet" komt die stap als eerste, vóór de drie tips "Dit kunt u zelf doen". Bij de andere antwoorden en zonder antwoord blijft de volgorde zoals nu.
- Hoe lang het uittreksel duurt staat er niet bij. Dat zou een termijn zijn, en die mag alleen met een bron. Als rechtspraak.nl dat noemt, zet ik het erbij; anders niet.

**Bestanden:** `src/content/knelpunten/gescheiden.md`, `src/scripts/overzicht/gescheiden.ts` (volgorde bij "Weet ik niet"), eventueel `src/lib/verdiepingen.ts` (`GEZAG_STAP`).

**Scenario's** (in `verdieping-gescheiden.feature`)
```gherkin
Scenario: Bij "Weet ik niet" staat de uitleg over het gezag voorop, met wat het betekent
  Gegeven ik open het overzicht voor "Wij zijn uit elkaar" in "Amersfoort"
  Als ik kies "Weet ik niet"
  Dan is de eerste zichtbare stap "Weet u niet wie het gezag heeft? Zo gaat het meestal:"
  En zie ik "Dan geeft u zelf toestemming voor hulp aan uw kind."
```

**Wat het kost:** klein.

---

## 3. Briefpagina: een kopieerknop ook onder de brief, tips eerder

**Wat er misgaat** (12, 18)
De knop "Kopieer de brief" staat direct boven de brief. Een brief is op de telefoon drie tot vier schermen lang: wie de brief leest, is aan het eind de knop uit het oog verloren. Sanne: "geen knop om te kopiëren gezien." De tips "Voor u verstuurt" staan op de telefoon onder de brief, terwijl ze over het versturen gaan (aangetekend, e-mailadres, "klacht" in het onderwerp).

**Voorstel**
- Een tweede knop "Kopieer de brief" direct onder de brieftekst, met dezelfde werking en dezelfde melding.
- Op de telefoon de tips boven de brief, ingeklapt als "Voor u verstuurt (4 tips)". Op de laptop blijven ze in de zijkolom.

**Bestanden:** `src/pages/brieven/[slug].astro` (tweede knop; het kopieerscript pakt nu alleen de eerste `[data-kopieer]`, dat wordt `querySelectorAll`), `src/styles/global.css` (de ingeklapte tips op de telefoon).

**Scenario's** (in `brieven.feature`)
```gherkin
Scenario: Onder de brief staat ook een knop om te kopiëren
  Gegeven de site mag het klembord gebruiken
  En ik open de pagina "brieven/klacht-toegangsteam/"
  Als ik de knop "Kopieer de brief" onder de brief gebruik
  Dan staat op het klembord een tekst met "klacht"

@mobiel
Scenario: Op de telefoon staan de tips boven de brief
  Gegeven ik open de pagina "brieven/ingebrekestelling/"
  Dan staat "Voor u verstuurt" boven de brief
```

**Wat het kost:** klein. Op papier verandert niets: de knoppen worden niet afgedrukt.

---

## 4. Voorpagina: een ingang voor klachten en brieven

**Wat er misgaat** (17, 18; 08, 09)
Wie een klacht wil indienen, vindt op de voorpagina geen knop die daarop lijkt. Mark (17) ging zelf naar Hulpmiddelen, Sanne (18) koos "Wij wachten te lang" op gevoel. Henk (08) en Lisa (09) misten de tweede rij ("Wat speelt er bij uw kind?"), waar "School loopt vast of kind zit thuis" staat.

**Voorstel**
- Onder de knoppen een regel:
  > Wilt u een klacht indienen of iets op papier vragen? Bij de [hulpmiddelen](/hulpmiddelen/) staan voorbeeldbrieven.

  Er komt geen nieuwe knop (geen nieuwe vraag), en de rij met knoppen blijft gelijk. Dit sluit aan op de pagina Hulpmiddelen van vandaag.
- Over de tweede rij: eerst nakijken of die echt pas na een keuze verschijnt, of dat hij buiten beeld valt (zie voorstel 6). Daarna een apart voorstel. Bij de journey-ronde van 17-10 hebt u verdere aanpassingen aan de voorpagina geparkeerd; daarom zet ik dat deel niet op de lijst.

**Bestanden:** `src/components/Wegwijzer.astro` (één regel), eventueel `src/styles/global.css`.

**Scenario's** (in `voorpagina.feature`)
```gherkin
Scenario: De voorpagina wijst naar de voorbeeldbrieven
  Gegeven ik open de voorpagina
  Dan gaat de link "hulpmiddelen" naar "hulpmiddelen/"
```

**Wat het kost:** heel klein.

---

## 5. Kleine teksten

| Wat | Waarom | Voorstel | Bestand |
|---|---|---|---|
| KIES uitleggen | Ahmed (10): "niet uitgelegd wat het is" | In de woordenlijst: "KIES: een groep voor kinderen van gescheiden ouders, waarin ze met andere kinderen praten over de scheiding. Via school of het wijkteam." Bron: kiesvoorhetkind.nl (nog te controleren). | `src/lib/woorden.ts` |
| EMDR: u mag er zelf om vragen | Naima (13) moest dat afleiden; "verwijzer" werd pas verderop uitgelegd | Het veld `aanvragen` begint met: "U mag zelf om EMDR vragen, bij de huisarts, de jeugdarts of het wijkteam. Die verwijzen u door." Daarna de bestaande zin. Als dat beter past, dezelfde opbouw ook bij de andere therapievormen. | `src/content/therapievormen/emdr.json` |
| JGZ Almere | Joyce (07): "JGZ ken ik als consultatiebureau", ernst 2–3 | Dit gaat over gegevens van een gemeente. Daarom eerst op de twijfellijst (`docs/onderzoek/`), niet zelf aanpassen. Mogelijke zin bij het contact: "JGZ Almere doet in Almere ook de aanmelding voor jeugdhulp." | `src/content/gemeenten/almere.json`, na akkoord |

**Scenario's:** de KIES-uitleg krijgt een regel in `begrippen.feature` ("is "KIES" een moeilijk woord met uitleg"). De andere twee zijn inhoud; die controleert `npm run validate`.

---

## 6. Nakijken: verspringt de voorpagina?

**Wat er gebeurde** (04, 13)
Peter klikte per ongeluk "Begeleiding of dagbesteding" omdat "de nummers verschoven". Naima zag hetzelfde na het kiezen van de gemeente. De nummers zijn de nummering van de testbrowser (`kijk` nummert de knoppen). Als er na een keuze iets bij komt, schuiven die nummers op, ook als er op het scherm niets verspringt.

**Voorstel:** eerst meten, dan pas beslissen. Een scenario dat de plek van de eerste knop van "Wat speelt er" meet, vóór en na de gemeentekeuze; zo is er een vergelijkbaar scenario voor de lijn tussen stappen. Verspringt die knop niet, dan noteer ik het in `.claude/agents/persona-tester.md` als valkuil van de tester ("kijk opnieuw na een klik; nummers kunnen verschuiven"). Verspringt hij wel, dan volgt een apart voorstel.

**Wat het kost:** klein.

---

## Niet voorgesteld (wel open)

- **05, nummer van de huisartsenpost:** de spoedroute blijft landelijk; dat is een eerdere keuze.
- **11, omzetten van zorg in natura naar een pgb:** kan, maar vraagt een bron (verordening of NJi) en een stap in `pgb.md`. Dit valt onder inhoudsonderzoek, niet onder een snelle aanpassing.
- **15, de zin over anoniem blijven:** in r23 bewust zo gelaten. Sinds r22 komt hij steeds terug als schrikmoment. Herschrijven kan ("Een adviesgesprek bereikt uw zus niet. Pas bij een melding …"), maar dat moet kloppen met wat Veilig Thuis zegt. Ik doe het alleen als u dat wilt.
- **09, de brief aan school gaat uit van een kind dat nog naar school gaat:** een eigen brief voor thuiszitters, of een regel "Zit uw kind thuis? …" in de brief. Dit hoort bij de eigen stappen per situatie, die u later wilde bekijken.

## Uitkomst van 6 (gemeten 20-10)

Gemeten in Chromium, op de telefoon (390 px) en de laptop (1280 px):
- Voorpagina, na de gemeentekeuze: de vraagknoppen blijven op dezelfde plek (574 → 574 px).
- Overzicht "Mijn kind wordt 18" (Apeldoorn): de keuzeknoppen staan na 0,2 en na 2,7 seconden op dezelfde plek, ook nadat de gegevens van de gemeente geladen zijn.
- Cumulative Layout Shift zonder klik: 0,0098 (telefoon) en 0,0032 (laptop). Onder 0,1 geldt als goed.
- Alleen na een klik op een vraagknop schuift wat eronder staat omlaag (90 px op de telefoon), omdat de toelichting bij de vraag verschijnt. Dat is het gevolg van de klik zelf; de browser telt het niet als verspringen.

"Nummers verschoven" komt dus van de testbrowser, die bij elke `kijk` opnieuw nummert. Dat staat nu duidelijker als valkuil in `.claude/agents/persona-tester.md`.
