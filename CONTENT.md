# Inhoud bijwerken (handleiding voor mens én agent)

De informatiestructuur is vastgelegd in `src/content.config.ts` (Zod-schema). `npm run build` faalt als content niet voldoet.

## Bronnen

- Elke pagina toont haar bronnen op dezelfde manier: één blok helemaal onderaan (`<Sources>`, id `bronnen`), met "Bijgewerkt …" en de bronnen ingeklapt onder "Bronnen (n)". Geen losse bronregels of -lijsten elders op de pagina; een korte `<sup>bron</sup>`-link in lopende tekst mag wel.
- Brieven en vragen (knelpunten) krijgen ook bronnen, net als de andere pagina's.

## Collecties

| Map | Formaat | Wat |
|---|---|---|
| `src/content/gemeenten/<slug>.json` | JSON | Eén bestand per gemeente, vaste structuur |
| `src/content/organisaties/<slug>.json` | JSON | Landelijke organisaties, incl. stichtingen die activiteiten of verlichting bieden (`soort: "stichting"`) |
| `src/content/landelijk/NN-<slug>.md` | Markdown + frontmatter | Landelijke rechten en uitleg |
| `src/content/situaties/<slug>.md` | Markdown + frontmatter | Ingang voor ouders: "wat speelt er?". Koppelt via `themas` en `hulpsoorten` |
| `src/content/hulpsoorten/<id>.json` | JSON | Soorten jeugdhulp; gemeenten en situaties verwijzen via het id |
| `src/content/knelpunten/<slug>.md` | Markdown-frontmatter | Tweede as: waar gaat de vraag over (beginnen, wachten, vastgelopen, afgewezen, verkeerde hulp, spoed, 18 worden, verhuizen, geld). Stuurt stappen, brieven en welke gemeente-onderdelen vooraan komen. `zonderGemeente: true` voor een landelijke vraag (zoals geld): het overzicht toont dan niets van de gemeente |
| `src/content/brieven/<slug>.md` | Markdown + frontmatter | Voorbeeldbrieven in gewone taal, invulvelden tussen [haken], gekoppeld aan `situaties` |
| `src/content/therapievormen/<slug>.json` | JSON | Gangbare therapie- en begeleidingsvormen per situatie, neutraal beschreven, met onderbouwing, vergoeding en hoe aan te vragen. Geen behandelaars of praktijken |

## Gemeenten: klacht en bezwaar

- `rechten.klacht` is de klachtenregeling van het **toegangsteam** (niet van de gemeente als bestuursorgaan): naam, klachtadres (e-mail/url), en onder `extern` de onafhankelijke klachtencommissie of ombudsman. Zoek op "<naam team> klacht".
- `rechten.bezwaar` is de bezwaarprocedure van de gemeente, alleen voor beschikkingen. Link naar de specifieke bezwaarpagina, nooit naar de homepage.
- Onder `directRegelen` komt de klachtlink vóór de bezwaarlink; klagen is de laagdrempelige route.

## Gemeenten: aanbod en de Beschikbaarheidswijzer

- Is de jeugdzorgregio aangesloten op beschikbaarheidswijzer.nl (regiolijst op de homepage), gebruik dan `https://beschikbaarheidswijzer.nl/jeugdhulp/<regio>` als `gecontracteerdeAanbiedersUrl` en voeg dezelfde link toe onder `directRegelen`. Anders de regionale inkooporganisatie of de gemeentepagina.
- De Beschikbaarheidswijzer is **openbaar, zonder inloggen**. De site is een JavaScript-app: de kale HTML toont alleen een knop "Inloggen" en "Laden...", maar aanbieders en wachttijden staan al in de serverrespons. Schrijf dus nooit "alleen voor verwijzers" of "achter inlog" en voeg geen `nodig: "Verwijzer met inlog"` toe. Vaste formulering onder `directRegelen`: "Openbaar, zonder inloggen."
- De Beschikbaarheidswijzer is een product van een commerciële partij in opdracht van de regio's. We linken ernaar; we lezen de gegevens niet in en nemen geen wachttijden of aanbiederslijsten over in onze content.
- **"Welke hulp is er?" kort en lokaal.** Voorbeeld: `src/content/gemeenten/tilburg.json`.
  - `aanbod.samenvatting` is hooguit drie zinnen: waarvoor de ouder zelf terechtkan zonder aanvraag, met welke regio de gemeente specialistische hulp inkoopt, en (alleen als de regio niet op de Beschikbaarheidswijzer staat) waar de ouder naar wachttijden vraagt. Geen uitleg over de Beschikbaarheidswijzer: de site zet onder het blok een vaste link met "Openbaar, zonder inloggen". Geen opsomming van organisaties die al in de categorieën staan, geen herhaling van "Hoe krijg ik hulp?".
  - Categorie-`naam` in gewone taal, zonder segmentnummers, perceelnamen of namen van inkoopverbanden (zoals "Crossroads").
  - Categorie-`omschrijving` is één, hooguit twee korte zinnen: eerst wat de hulp is, dan wat lokaal geldt (wie de hulp geeft, hoe u er komt, wat eerst bekeken wordt, welke vormen er zijn). Geen tekorten die overal spelen (pleeggezinnen, wachttijden in het algemeen), geen inkooptaal. Elke categorie heeft een omschrijving. Haal lokale details uit de regionale inkoop- of aanbodpagina en de gemeentesite, en zet die bron in `meta.bronnen`.
  - Schrijf niet "zonder besluit" of "zonder beschikking", maar "u kunt zelf terecht, zonder aanvraag (bij de gemeente)".
  - Ernstige dyslexie als eigen categorie als de regio die inkoopt, niet verstopt onder jeugd-ggz. `hulpsoorten`-tags blijven kloppen bij de categorie waar de hulp staat.
  - **Volledig.** Loop alle hulpsoorten in `src/content/hulpsoorten/` langs. Elke hulpsoort die de gemeente of regio aanbiedt, staat bij een categorie met een omschrijving; situatiepagina's tonen het aanbod via deze tags, dus een ontbrekende tag betekent een leeg blok. Crisishulp en jeugdbescherming zijn er in elke regio (crisisdienst, gecertificeerde instelling): zoek op wie het doet en noem die. Jeugdbescherming krijgt een eigen categorie achteraan: wat het is (na een maatregel van de kinderrechter begeleidt een jeugdbeschermer het gezin) en welke gecertificeerde instelling het in de regio doet. Persoonlijke verzorging staat altijd bij de begeleidingscategorie: koopt de gemeente of regio het als eigen product in, noem dat; anders de vaste zin "Verzorging bij ziekte loopt meestal via de zorgverzekering; hulp bij verzorging door een beperking via de gemeente." Ontbreekt een hulpsoort echt, noteer dat in het verslag.

## Gemeenten: "Hoe gaat het hier?" (`ervaringen`)

- Alleen openbare, herleidbare en gedateerde bronnen: inspectierapporten (IGJ), het jaarlijkse cliëntervaringsonderzoek Jeugd van de gemeente, rekenkamer- en ombudsmanrapporten, rechterlijke uitspraken, raadsstukken en regionale journalistiek. Geen anonieme reviews, geen sociale media, geen individuele klachten.
- Elke `signalen`-regel heeft precies één bron met URL en datum. De `samenvatting` is neutraal en feitelijk: wat de bron zegt, niet wat wij ervan vinden. Positieve signalen even goed opnemen als negatieve.
- De `samenvatting` bestaat uit **twee alinea's**, gescheiden door een lege regel (`\n\n` in JSON): de eerste beschrijft wat er speelt, de tweede wat de ouder ermee kan (schriftelijk vastleggen, cliëntondersteuner meenemen, meldpunt gebruiken). Elke alinea maximaal vier zinnen.
- Verouderde signalen (ouder dan drie jaar) verwijderen of expliciet als historie markeren. `laatstBijgewerkt` bijwerken bij elke wijziging.
- **Vaste controle bij elke gemeente** (vul `ervaringen.transparantie` in, nooit op `onbekend` laten staan na een bijwerkronde):
  1. *Cliëntervaringsonderzoek Jeugd.* Zoek in het raadsinformatiesysteem van de gemeente (meestal `<gemeente>.bestuurlijkeinformatie.nl` of `.raadsinformatie.nl`) en op de gemeentesite op "cliëntervaringsonderzoek jeugd", "CEO jeugd", "MCJO". Gevonden: `status: ja`, jaar, url en één zin met de kern (bijv. rapportcijfer, respons). Niet gevonden na gericht zoeken: `status: nee`. Is het nieuwste onderzoek ouder dan drie jaar (meetjaar meer dan drie jaar voor nu), dan ook `status: nee`, zonder `jaar`; noem het oude onderzoek met jaartal in de samenvatting en laat de url staan. Ook `status: nee` bij een te dunne meting: een handvol reacties of gesprekken, een onderzoek dat de bron zelf niet representatief noemt, of alleen een eigen meting van de uitvoerder. Beschrijf de meting dan in de samenvatting.
  2. *Doorlooptijden van de toegang.* Zoek op "doorlooptijd", "wachttijd toegang", "tijd tot eerste gesprek", "beslistermijn" in kwartaal- en jaarrapportages sociaal domein. Zelfde regels. `status: ja` alleen bij gemeten cijfers; een toezegging ("binnen vijf werkdagen contact") of de wettelijke termijn is geen meting en hoort in de samenvatting.
  3. *Aandeel via huisarts.* CBS StatLine tabel 85097NED (Jeugdhulptrajecten in natura; verwijzer, regio), periode `<jaar>JJ00`, voor de gemeentecode. Bereken: (Huisarts + Jeugdarts + Medisch specialist) / Totaal verwijzer, over **begonnen trajecten** (`TotaalBegonnenTrajecten_2`), afgerond op hele procenten. Houdt CBS een van de drie verwijzers geheim (kleine aantallen), dan geen `aandeelHuisarts` en geen percentage in de tekst; reden in `meta.opmerkingen`. Via de OData-API (`opendata.cbs.nl/ODataApi/odata/85097NED/TypedDataSet`), nooit overtikken uit een pdf.
  Wat gevonden wordt, komt daarnaast als signaal met bron in de tijdlijn (soort `clientervaringsonderzoek` of `gemeenteraad`).
- **Altijd de nieuwste bron.** Gemeentelijke jaarstukken verschijnen in een vaste cyclus: de programma- of jaarrekening over jaar N in mei-juli van N+1, de begroting voor N+1 in oktober-november van N, de kadernota in juni. Zoek eerst op de financiënpagina van de gemeente (`/financien`, `/begroting`) en in het raadsinformatiesysteem naar de meest recente editie en citeer díe; vervang bij elke bijwerkronde oudere edities door nieuwere, tenzij het oudere document een feit bevat dat in het nieuwe ontbreekt (dan beide noemen, met jaartal). Voor CBS altijd de laatste volledige jaarperiode (`<jaar>JJ00`); het `landelijk`-cijfer met dezelfde formule en hetzelfde jaar berekenen (RegioS `NL01  `).

## Gemeenten: schrijven voor ouders

De lezer is een ouder van een kind dat hulp nodig heeft: vaak gestrest, zonder kennis van gemeentelijk jargon, meestal op een telefoon. Elke alinea, stap en signaal moet die ouder helpen iets te begrijpen of te doen in deze gemeente.

- **Taal B1.** Korte zinnen (richtlijn hooguit twintig woorden), één gedachte per zin, actieve vorm, "u" voor de ouder. Geen stapelzinnen met puntkomma's en haakjes. Stappen in routes beginnen met een werkwoord ("Bel ...", "Vraag om ...").
- **Geen jargon zonder uitleg.** Vertaal of leg uit bij eerste gebruik: beschikking (besluit), indicatie, zorg in natura, maatwerkvoorziening, casusregisseur, verwijzer (huisarts, jeugdarts of medisch specialist), instroom, normaliseren, taakveld, gerealiseerd. Afkortingen (JGZ, POH, GR, KPI, teamafkortingen) de eerste keer voluit. Lokale teamnamen wel gebruiken, met een korte uitleg wat het team doet. Woorden die ouders tóch moeten herkennen (uit brieven en gesprekken) staan in de centrale begrippenlijst `src/lib/woorden.ts`: de site legt ze automatisch uit bij het eerste gebruik per hoofdstuk en toont ze allemaal op `/begrippen/`. Een nieuw vakwoord dat vaker terugkomt? Zet het daar, met een uitleg van één of twee zinnen in B1. Beleidstaal die beter herschreven kan worden (instroom, toeleiding, triage) staat in `herschrijven` in hetzelfde bestand; `npm run validate` waarschuwt daarvoor, en voor afkortingen die in meer bestanden zonder uitleg staan.
- **Geen "consulent".** Moeilijk woord: schrijf "medewerker" ("medewerker jeugd", "medewerker jeugd op school", "preventiemedewerker"). Alleen een officiële naam van een team of organisatie blijft staan.
- **Bestuurstaal vertalen naar wat ouders merken.** Niet "de gemeente zet in op normaliseren", maar "de gemeente kijkt vaker eerst naar lichte hulp, school of het eigen netwerk voordat zij specialistische hulp inzet". Plannen alleen als ze ouders nu of binnenkort raken, en dan als plan benoemd ("vanaf 2028 wil de gemeente ...").
- **Geen financiën.** Geen begrotingstekorten, overschrijdingen, budgetten, uitgaven, kosten per traject of besparingsprogramma's; dat zegt hooguit indirect iets over toegang en kwaliteit. Uitzondering: een financieel besluit dat ouders direct merken (een aanbieder stopt, de toegang wordt strenger, aanbod verdwijnt, er ontstaat een wachtlijst). Beschrijf dan het gevolg, niet het bedrag.
- **Geen onderzoeksverslag in publieke tekst.** "Niet gevonden", "pdf niet leesbaar", "via zoekmachines" en "geraadpleegd" horen in `meta.opmerkingen`, niet op de site. Maak een negatieve uitkomst niet sterker dan het onderzoek: "is niet openbaar te vinden", niet "de gemeente publiceert geen". Zet er een tip achter ("Vraag bij het eerste gesprek hoe lang het duurt.").
- **Cijfers zoals de bron ze noemt.** Respons, rapportcijfers en aantallen overnemen, niet zelf narekenen of omrekenen (alleen het CBS-aandeel via de huisarts wordt berekend). Wel leesbaar: "ruim 2.500 jeugdigen", nooit "x 1.000 euro".
- **Signalen**: titel kort en feitelijk in gewone taal; samenvatting hooguit drie zinnen, met het gevolg voor ouders. Een signaal rust op een bron die echt gelezen is, niet op een zoekfragment of een samenvatting van een betaalmuur-artikel.
- **Toon**: neutraal en zakelijk, niet alarmerend en niet geruststellend. Geen oordeel van ons.
- **Beladen woorden vermijden en omvormen.** Ouders lezen deze site vaak met angst om beoordeeld te worden of hun kind kwijt te raken. Schrijf daarom wat er gebeurt in gewone, neutrale woorden, ook als de bron het anders zegt (feiten en cijfers blijven gelijk; titels van brondocumenten in `bronnen` blijven letterlijk):
  - "uithuisplaatsing", "uit huis geplaatst" → "(tijdelijk) buiten het gezin wonen"; "om uithuisplaatsing te voorkomen" → "zodat het kind thuis kan blijven wonen".
  - "kwetsbare gezinnen/kinderen" → "gezinnen die het zwaar hebben", "kinderen die extra steun nodig hebben".
  - Beleidswoorden die de zorg van ouders klein of duur laten klinken ("normaliseren", "voorliggend veld", "dure jeugdzorg beperken", "eigen kracht") → wat ouders merken: "eerst gewone steun, zoals van school of het wijkteam", "hulp zonder besluit van de gemeente", "eerst kijken wat u zelf en uw omgeving kunnen". De naam van de organisatie Eigen Kracht (Centrale) blijft.
  - Voorwaarden die ouders kunnen stigmatiseren (bij een pgb: schulden, verslaving, fraude, taal) niet in één opsomming. Eerst wat de gemeente wil weten en welke oplossing er is ("Lukt dat niet zelf? Dan mag iemand anders het budget beheren"), dan in een aparte, zakelijke zin de uitsluitingsgronden die de regels noemen.
  - Geen schrikbeelden als argument ("wijs op gesloten plaatsing"). Een ouder onderbouwt een aanvraag met wat al geprobeerd is en wat het kind nodig heeft.
  - Woorden die nodig zijn om iets te kunnen regelen (Veilig Thuis, melding, jeugdbescherming, crisis) blijven, zakelijk en zonder dreiging.

## Grenzen van de inhoud (voor mens én agent)

- Geen diagnoses, geen behandeladvies, geen oordeel over medicatie. Wel: welke hulp bestaat, wie erover beslist, en wat de ouder mag vragen.
- Medische beweringen alleen met verwijzing naar een arts ("alleen de huisarts kan dit vaststellen") of naar een richtlijn, met bron.
- `regelingen` bevat alleen rechten, wetten, procedures en geld. Hulplijnen en organisaties horen in `src/content/organisaties/` met de juiste `themas`, zodat ze automatisch bij de situatie verschijnen.
- Noem nooit behandelaars of praktijken; therapievormen worden generiek beschreven in `src/content/therapievormen/`.

## Situaties: "Wat helpt vaak" en "Waar het vaak misgaat"

1. Elk punt is óf een recht, óf een vraag die de ouder kan stellen, óf een verwijzing naar een richtlijn of officiële instantie. Geen eigen behandeladvies.
2. Methodes bij naam alleen met "volgens de richtlijn", "erkend door het NJi" of "aangeboden via het wijkteam", en met een bronlink.
3. Bij acute situaties staat de verwijzing naar de professional vóór het gedragsadvies, nooit erna.
4. Geen absolute woorden: niet "werkt" maar "wordt aanbevolen" of "kan helpen"; niet "voorkomt" maar "helpt voorkomen".
5. Bronlink inline, subtiel, aan het eind van de zin: ` <sup><a class="bron" href="URL" target="_blank" rel="noopener">bron</a></sup>`. Alleen officiële bronnen: richtlijnenjeugdhulp.nl, ggzstandaarden.nl, nji.nl, de betrokken landelijke organisatie.

## Situaties: routes

- `routes` is "Waar begint u": alleen ingangen waar een ouder zelf naartoe kan en die voor de meeste gezinnen in deze situatie zinvol zijn. De eerste route krijgt op de site het label "Begin hier"; zet dus de beste start bovenaan.
- Voorwaardelijke stappen ("als er klachten ontstaan", "als de rechter beslist") horen niet in `routes` maar in de tekst, bij voorkeur met een link naar de passende situatie.
- Jeugdbescherming (`gecertificeerde-instelling`) is vrijwel nooit een startroute.

## Voorbeeldbrieven

- Gewone taal, korte zinnen, genummerde verzoeken. Geen juridisch jargon tenzij de ontvanger het nodig heeft (bv. "kenmerk", "beschikking").
- Invulvelden altijd tussen vierkante haken met een hint: `[naam kind]`, `[datum besluit]`. Optionele alinea's tussen haken met "Als ...:".
- Elke brief vraagt om iets schriftelijks terug (verslag, beschikking, datum), zodat de ouder iets in handen heeft.
- Brieven hebben geen eigen overzichtspagina en staan niet in het menu; ze bestaan alleen als onderdeel van situaties. Koppel elke brief aan minstens één situatie en verwijs vanuit stappen in de situatietekst met een relatieve link `../../brieven/<slug>/`.
- `aan` geeft de ontvanger: `school`, `gemeente`, `wijkteam`, `huisarts`, `aanbieder` of `overig`. Bij het knelpunt "Ik wil hulp aanvragen" toont het overzicht de brieven waarvan `aan` overeenkomt met een route van de gekozen situatie, in volgorde van die routes. Zorg dus dat elke startroute (school, wijkteam, huisarts) een brief heeft.

## Therapievormen

- Doel: ouders laten begrijpen welke vormen bestaan, zodat zij een onderbouwde wens kunnen formuleren richting gemeente of verwijzer. Geen behandeladvies, geen ranglijst.
- Vormen uit een zorgstandaard, jeugdhulprichtlijn of de NJi-databank krijgen `onderbouwing.label` richtlijn of erkend. `erkend` alleen als het NJi de vorm effectief vindt (eerste, goede of sterke aanwijzingen); staat er alleen "goed onderbouwd", gebruik dan `onderbouwd`. In de toelichting mag een verwijzing naar een andere vorm als `[tekst](/therapievormen/slug/)`. Regelmatig toegepaste vormen met minder of omstreden bewijs mogen erin met het label `gangbaar`, mits de toelichting eerlijk zegt wat de richtlijn ervan vindt. Zo weet een ouder wat wordt aangeboden én hoe het is onderbouwd. Een vorm die de richtlijn niet aanbeveelt omdat goed onderzoek geen effect vindt (zoals neurofeedback bij ADHD), krijgt geen eigen pagina; noem dat zo nodig in de `toelichting` van de situatie.
- Noem Thuisarts niet in lopende tekst ("Thuisarts adviseert …"); het mag wel als bron in `bronnen`.
- **Nooit** namen van behandelaars, praktijken of commerciële aanbieders. Beroepsverenigingen en registers (VGCt, NVRG, Vaktherapie Nederland, NVPMT, NKD) mogen wel, als vindplaats.
- Vaste velden: wat is het, hoe werkt het, voor wie, wat kunt u verwachten (duur, frequentie, rol ouders), onderbouwing, vergoeding, hoe aanvragen, overwegingen (wanneer wel/niet). Minstens één officiële bron.
- `leeftijd` (van/tot in jaren, tot exclusief) alleen invullen als de vorm echt leeftijdsgebonden is; het overzicht verbergt vormen buiten de gekozen leeftijdsband.
- Medicatie wordt niet als therapievorm beschreven; alleen hoe het gesprek erover hoort te gaan.
- Verdieping (optioneel, alleen op de eigen pagina, niet op de kaarten): `sessie` (wat er in de kamer gebeurt), `programmas` (varianten of programma's, geen aanbieders), `vraagt` (wat het van kind en gezin vraagt, ook tussen de sessies), `voortgang` (wanneer u verschil merkt, en wat als dat uitblijft), `effect` (wat onderzoek laat zien: om hoeveel kinderen het ging, hoe snel, hoe blijvend, en wat nog weinig onderzocht is) en `vragen` (voor de behandelaar). Alleen wat een richtlijn, het NJi, een beroepsvereniging of gepubliceerd onderzoek zegt, met de bron in `bronnen`. Cijfers altijd met de groep erbij ("bij 103 kinderen van 8 tot 18 jaar"). Voorbeeld: `emdr.json`.
  - Kort: `verwachting`, `vraagt`, `voortgang` en `effect` elk twee tot drie zinnen; `sessie` hooguit vijf; `programmas` hooguit drie; `vragen` hooguit vijf. Niets herhalen dat al in een ander veld staat.
  - Vaktermen en namen van andere behandelingen in een paar woorden uitleggen ("schrijftherapie, waarbij het kind opschrijft wat er gebeurde"). Alleen naar een andere therapievorm op de site verwijzen als het echt dezelfde behandeling is.
  - Geen detailcijfers die een ouder niet helpen kiezen (effectgroottes, behandeltijd in minuten). Wel: hoeveel kinderen vooruitgaan, na hoeveel sessies, hoe blijvend, en voor wie het minder onderzocht is.

## Voorbeeldbrieven

- Gewone taal, korte zinnen, genummerde verzoeken. Geen juridisch jargon tenzij de ontvanger het nodig heeft (bv. "kenmerk", "beschikking").
- Invulvelden altijd tussen vierkante haken met een hint: `[naam kind]`, `[datum besluit]`. Optionele alinea's tussen haken met "Als ...:".
- Elke brief vraagt om iets schriftelijks terug (verslag, beschikking, datum), zodat de ouder iets in handen heeft.
- Brieven hebben geen eigen overzichtspagina en staan niet in het menu; ze bestaan alleen als onderdeel van situaties. Koppel elke brief aan minstens één situatie en verwijs vanuit stappen in de situatietekst met een relatieve link `../../brieven/<slug>/`.

## Hulpsoorten

- Doel: ouders laten zien wat ze bij de gemeente (of via een andere wet) kunnen aanvragen, en hoe. Geen aanbieders noemen; beroepsverenigingen, kenniscentra en landelijke organisaties (Per Saldo, CIZ, VNG, NJi) mogen wel.
- De kaart (`omschrijving`, `voorWie`, `voorbeelden`, `beschikkingNodig`, `toegangVia`) blijft kort. Een uitgewerkte hulpsoort heeft `inDePraktijk` en krijgt dan een eigen pagina (`/hulpsoorten/<id>/`); de kaarten linken ernaartoe.
- Uitwerking: `inDePraktijk` (wie, waar, hoe vaak), `nietVoor` (wanneer iets anders past of eerst komt), `verwachting` (duur, evaluatie, wat er gebeurt als de beschikking afloopt), `vragen` (hooguit vijf, voor het wijkteam), `bronnen`, `laatstGecontroleerd`. Aanvragen, pgb en rechten staan op de landelijke pagina's en worden per hulpsoort niet herhaald; de pagina verwijst ernaar.
- Therapievormen vallen onder een of meer hulpsoorten (`hulpsoorten` in de therapievorm; `zorgverzekering: true` als het (ook) via de zorgverzekering loopt). De hulpsoortpagina toont de vormen die eronder vallen. Een situatie toont automatisch ook de hulpsoorten waar haar therapievormen onder vallen; zet in `hulpsoorten` van de situatie alleen wat daarnaast past (bv. Behandeling bij "School loopt vast", voor onderzoek).
  - Elk tekstveld twee tot vier zinnen; niets herhalen.
  - Bronnen: wet en regelgeving (Jeugdwet, Wlz, Wmo), Rijksoverheid, VNG, NJi, Zorginstituut, CIZ, Per Saldo, Kenniscentrum KJP, Thuisarts. Lokale verschillen benoemen ("verschilt per gemeente") in plaats van één gemeente als norm te nemen.
  - Geen bedragen of aantallen uren als norm, tenzij een landelijke bron ze noemt.

## Tips van ouders

- Een tip komt uit **ervaring** van een ouder, maar wordt zakelijk beschreven: geen citaten. `omschrijving`, `hoeVinden` en `vergoeding` zijn feitelijk en gecontroleerd.
- Noem nooit namen van ouders of kinderen; `ingezondenDoor` is bv. "een ouder uit Alphen aan den Rijn".
- Praktijken: vermeld `regio` en controleer dat de website bestaat. Een agent voegt **geen** praktijken toe op eigen initiatief; die komen alleen van ouders.

## Koppeling via tags

- `themas` is de gedeelde woordenlijst voor situaties, organisaties en `lokaleInitiatieven` van gemeenten. Gebruik bestaande tags (zie `src/content/situaties/*.md`) voordat u een nieuwe introduceert; kleine letters, enkelvoud waar mogelijk.
- Lokale initiatieven verschijnen in Mijn overzicht via `situaties`, `voorIedereen` of `verbergen` (zie `src/content.config.ts` en `.claude/agents/gemeente-onderzoeker.md`, onderdeel 2); `themas` is dan alleen nog een terugvaloptie voor ongelabelde items.
- `hulpsoorten` verwijst naar bestandsnamen in `src/content/hulpsoorten/`. Tag het gemeentelijk aanbod (`aanbod.categorieen[].hulpsoorten`) zodat situatiepagina's het juiste aanbod per gemeente tonen.

## Een gemeente toevoegen of bijwerken

Alle 342 gemeenten hebben een bestand. Kale bestanden zijn gemaakt met `npm run scaffold` uit `scripts/data/gemeenten-register.json` (uittreksel van het Register van Overheidsorganisaties: naam, CBS-code, provincie, website, telefoon). Het script slaat bestaande bestanden over; na een herindeling: register bijwerken en opnieuw draaien. Een kale pagina bevat alleen landelijke regels; onderzoek vult de lokale invulling in. Een kaal bestand herkent u aan `meta.opmerkingen` dat begint met "Automatisch aangemaakt".

1. Kopieer `src/content/gemeenten/amsterdam.json` naar `<slug>.json` (kebab-case, bv. `den-haag.json`).
2. Vul alle secties in; houd de volgorde en sleutels exact aan.
3. Vul `meta.laatstGecontroleerd` en `meta.bronnen` (met `geraadpleegd`-datum).
5. Draai `npm run validate && npm run build`.

## Instructies voor een agent

Onderzoek en redactie van gemeenten lopen via vaste subagents: `.claude/agents/gemeente-onderzoeker.md` (onderzoeken en uitschrijven) en `.claude/agents/gemeente-redacteur.md` (eindredactie). De hoofdagent volgt `.claude/skills/gemeenten-onderzoeken/SKILL.md`. Hulpscripts staan in `scripts/onderzoek/`.


- Raadpleeg uitsluitend officiële bronnen: de website van de gemeente, het toegangsteam, de jeugdzorgregio, MEE/cliëntondersteuning. Neem elke gebruikte URL op in `meta.bronnen`.
- Verander **nooit** de sleutels of de volgorde in het JSON-bestand; vul alleen waarden in. Onbekend en optioneel? Laat het veld weg. Onbekend en verplicht? Vul een korte tekst in en noteer het in `meta.opmerkingen`.
- **Later nakijken.** Klopt iets nu, maar verandert het na een datum of gebeurtenis (een fusie, een nieuw team per 1 januari, een begroting die nog moet verschijnen, een wachttijdcijfer met jaartal)? Zet het dan in `docs/onderzoek/later-nakijken.md`, onder de juiste datum.
- `meta.opmerkingen` is een **intern** onderhoudsveld en wordt niet op de site getoond. Houd het kort (maximaal drie zinnen): alleen wat nog openstaat of wat een volgende bewerker moet weten. Geen verificatieverslag, geen herberekeningen, geen opsomming van wat is gecontroleerd; dat blijkt al uit `meta.bronnen`.
- `toegang.routes` bevat minimaal `wijkteam`, `huisarts` en `spoed`. Gebruik de lokale naam van het team in `naam` (bv. "Buurtteam", "CJG", "WIJ-team").
- **Nooit 112 noemen**, ook niet in de spoedroute of in een contactblok. Iedereen kent het, en voor jeugdhulp is de lokale route de juiste.
- **Geen 06-nummers om te bellen**, ook niet in openingstijden. Ze horen vaak bij één medewerker en veranderen ongemerkt. Een WhatsApp-nummer van de organisatie mag wel, met het woord "WhatsApp" ervoor (bv. in `openingstijden`). Heeft een instantie alleen een 06-nummer, laat dan `telefoon` weg en geef e-mail en de contactpagina. De validator faalt op elk 06-nummer in publieke tekst.
- **Geen persoonlijke gegevens van medewerkers**: geen persoonlijke e-mailadressen (`p.jansen@...`), directe nummers of namen van individuele medewerkers. Alleen algemene adressen en nummers van de organisatie (`info@`, `klachten@`, het algemene telefoonnummer). Is er alleen een persoonlijk adres, laat het contactveld dan weg en link naar de pagina.
- **Contactblok bij elke instantie.** In de routes voor toegang (`wijkteam`), huisarts en school krijgt elke instantie die de omschrijving of stappen noemen een eigen contactblok onder de route (`contact`; meerdere instanties = een lijst van blokken). De stappen zelf bevatten geen telefoonnummers of e-mailadressen: daar staat wie de ouder benadert ("Meld u aan bij het CJG."), het blok eronder geeft nummer, website en bereikbaarheid. Hetzelfde blok mag bij meer routes staan (bv. het toegangsteam ook in de schoolroute). Geen blok nodig voor wat persoonlijk is en dat de ouder zelf al heeft: de eigen huisarts, de school van het kind, de eigen zorgaanbieder. Wel voor regionale instanties zoals de jeugdgezondheidszorg (GGD) en het samenwerkingsverband passend onderwijs. Buiten de routes geldt: geen nummers in `toegang.samenvatting`, en geen herhaling in toelichtingen, `directRegelen` of `ervaringen` van een nummer dat al in een contactblok staat. Dubbele nummers in de tekst blazen hem op, lezen rommelig en zetten ouders te snel aan tot bellen. `node scripts/validate-content.mjs` waarschuwt bij nummers in stappen en bij routes zonder contactblok.
- **"Hoe krijg ik hulp?" kort houden.** `toegang.samenvatting` is hooguit twee zinnen: waar meldt de ouder zich, en is een verwijzing nodig. Geen herhaling van de routes en geen wachttijd. De wachttijd (of dat die niet openbaar is) staat alleen in `doorlooptijd` van de wijkteamroute, in één of twee zinnen. Per route: `omschrijving` hooguit drie zinnen, hooguit drie `stappen` (vier alleen als het echt niet anders kan). Herhaal niet wat een andere route of een ander deel van de pagina al zegt: "meld u ook zelf bij het wijkteam" in de huisarts- of schoolroute, de cliëntondersteuner (staat bij rechten), "leg afspraken schriftelijk vast". Het contactblok van het wijkteam toont de site alleen bij de wijkteamroute en in de kaart bovenaan; bij andere routes wordt het verborgen. Voorbeeld: `src/content/gemeenten/altena.json`.
- **Spoed: alleen landelijk, plus een link naar de gemeente.** Een verkeerd nummer bij spoed is de schadelijkste fout die de site kan maken, en lokale crisisnummers veranderen zonder dat wij het merken. De spoedroute bevat daarom geen telefoonnummers (geen regionale Veilig Thuis, crisisdienst, huisartsenpost of jeugdbescherming). Onder elke spoedroute toont de site een vast blok (`src/components/SpoedNummers.astro`), op één plek beheerd en gecontroleerd. Het maakt onderscheid tussen **nood** (direct gevaar: "bel meteen het alarmnummer", zonder het nummer; daar is de site niet voor) en **spoed** (kan niet wachten, geen direct gevaar: eigen huisarts of huisartsenpost, eigen hulpverlener, Veilig Thuis voor advies, 113 om te praten). Beveel 113 nooit aan als nummer voor nood. Lokaal staat er alleen één contactblok met `naam` en `url` naar de spoed- of crisispagina van de gemeente, die de gemeente zelf bijhoudt; de site toont het als "Meer crisisdiensten in <gemeente>". `omschrijving` en `stappen` van de spoedroute worden niet getoond en hebben in alle gemeenten dezelfde vaste tekst; pas ze niet aan.
- `directRegelen`: alleen rechtstreekse links naar formulieren, aanmeld- of bezwaarpagina's, nooit naar een homepage. Controleer dat de URL een 200 geeft en noteer in `nodig` wat de ouder bij de hand moet hebben (bv. DigiD).
- Telefoonnummers: netnummer van twee cijfers als `0XX XXX XXXX` (bv. `030 740 0500`, ook `088`, `085`), netnummer van drie cijfers als `0XXX XX XX XX` (bv. `0543 49 33 33`). URL's inclusief `https://`.
- Landelijke feiten (bezwaartermijn, Jeugdstem, cliëntondersteuning) horen in `src/content/landelijk/`, niet per gemeente herhaald, tenzij de gemeente er een eigen invulling aan geeft.
- In markdown-frontmatter moeten datums én zinnen met een dubbele punt tussen aanhalingstekens staan, bv. `laatstGecontroleerd: "2026-10-10"` en `waarom: "Begin bij de huisarts: die sluit ... uit."`.
