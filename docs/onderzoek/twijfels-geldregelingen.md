# Twijfels geldregelingen (regelingencheck)

Uit de onderzoeksrondes van het veld `geldregelingen`. De gebruiker beslist; tot dan blijft het veld zoals het is.

## Besluiten 23-10-2026 (gebruiker, na alle rondes)

Gelden voor alle gemeenten; de twijfelpunten hieronder worden hiermee gelijkgetrokken (uitvoering: aparte ronde).

1. **Mantelzorg, gezond kind**: sluit de bron alleen de gewone zorg voor een gezond kind uit, dan `ouders: "ja"`. Weglaten als de bron alle zorg tussen ouders en kinderen gebruikelijk noemt; `"nee"` als hij ook een kind met een gezondheidsprobleem uitsluit (heerenveen).
2. **Mantelzorg, bronnen voor `ouders: "ja"`**: gemeentepagina, verordening of beleidsregel, het steunpunt dat de waardering uitvoert, en het aanvraagformulier. Niet: interviews, nieuwsverhalen, citaten (deventer, waalwijk, ooststellingwerf → weglaten tenzij een andere bron het zegt).
3. **Mantelzorg zonder geld** (activiteit, attentie, bijeenkomst): opnemen, en de omschrijving zegt dat het geen geldbedrag is. Schiedam van `nietGevonden` naar opgenomen.
4. **Zorgkosten uit een opsomming op de bijzondere-bijstandspagina**: altijd een eigen zorgkosten-item. Gelijktrekken: borne, putten, staphorst, aa-en-hunze, huizen, castricum (ook kinderopvang, zoals de andere Zaffier-gemeenten), alphen-chaam, baarle-nassau, gilze-en-rijen.
5. **Regeling voor chronisch zieken op een pagina 'voor volwassenen' zonder leeftijd** (heemstede, bloemendaal, ede, duiven): weglaten (zo laten).
6. **Mantelzorgwaardering alleen in de verordening** (reusel-de-mierden, noord-beveland, sluis, urk, zoetermeer, enschede, lelystad): opnemen met de regel als link; `ouders` alleen als de regel er iets over zegt.
7. **Kinderopvang (SMI) op oude regels**: alleen regels van 2019 of later. Regels van 2018 of ouder zonder gemeentepagina eruit (o.a. dongen 2012, oldenzaal 2010, het-hogeland 2017; nalopen); amersfoort (2018) en enschede (2011) niet toevoegen.
8. **Geen collectieve zorgverzekering** ("doet niet mee" en niets op de gemeentesite): altijd `nietGevonden` (o.a. noordoostpolder, breda gelijktrekken).
9. **Inkomensgrens bijzondere bijstand**: alleen invullen als de pagina hem als harde voorwaarde noemt; staat er draagkracht of "daarboven betaalt u een deel", dan weglaten. Nalopen bij gemeenten met een grens (o.a. helmond, sudwest-fryslan, nieuwegein, barneveld, velsen, pijnacker-nootdorp, heumen, roerdalen, hattem, maasdriel, westerwolde, simpelveld).
10. **Tegenstrijdige percentages**: de verordening of beleidsregel gaat voor (niet de gemeentepagina of gezondverzekerd.nl). Nalopen o.a. albrandswaard, rhenen, bunschoten, heemstede, bloemendaal, oegstgeest, sluis, altena, haaksbergen, beverwijk.
11. **Zorgoppas (maasdriel)**: opnemen onder zorgkosten. Niet actief zoeken bij andere gemeenten.
12. **Zelfde uitvoerder, verschil** (gulpen-wittem/eijsden-margraten, rozendaal/rheden, ermelo/harderwijk/zeewolde, westervoort/duiven en verder): de hoofdagent leest de bron opnieuw, trekt gelijk volgens deze afspraken en meldt het in het verslag; bij echte twijfel terug naar de gebruiker.

## Mantelzorgwaardering voor ouders (`ouders`)

**Besloten 21-10-2026:** telt de zorg voor uw kind volgens de bron als mantelzorg (ook alleen in de uitleg), dan `ouders: "ja"`. Toegepast op assen, terneuzen, rotterdam, nijmegen, s-hertogenbosch, zwolle, almere en groningen (naast utrecht, apeldoorn en breda). Nog na te kijken: tilburg (zin alleen op een oude pagina, niet teruggevonden) en eindhoven (zin op een pagina over mantelzorgondersteuning, url niet vastgelegd). De rest hieronder is historie.

Afspraak nu: `ouders: "ja"` alleen als de voorwaarden of de aanvraagpagina zeggen dat de zorg voor uw kind meetelt; `"nee"` als de bron ouders van minderjarige kinderen uitsluit; anders weglaten. Twijfelgevallen:

- **assen**: assen.nl noemt in de uitleg wie mantelzorger is "Ook als het vanzelfsprekend voelt, zoals zorgen voor uw kind of ouder". Niet in de voorwaarden. Nu weggelaten. Is dat "ja"?
- **terneuzen**: aan-z: "Ook wanneer de zorg … voor je kind … ben je mantelzorger" (definitie). Verordening art. 5.3.3: 8 uur per week, 3 maanden, ouders niet uitgesloten. Nu weggelaten.
- **druten**: verordening: zorg die "de gebruikelijke zorg overtreft"; ouders niet genoemd. Nu weggelaten.
- **apeldoorn**: De Kap noemt "uw kind" als voorbeeld; voorwaarde "meer zorg dan de gebruikelijke dagelijkse zorgtaken voor inwonende kinderen". Nu `"ja"`.

- **den-haag**: pagina noemt alleen zorg "voor iemand die ziek of oud is, of een handicap heeft"; ouders niet genoemd. Nu weggelaten. De onderzoeker zag een melding van de Jeugdombudsman (2026) dat een vader van een zoon met autisme de waardering misliep; niet nagezocht.

Vraag: telt "het kind wordt als voorbeeld genoemd" als ja? Dan kunnen assen en terneuzen ook op ja.

**Besloten 21-10-2026 (zorgkosten):** het eigen risico (ook van de ouder zelf) en de gehandicaptenparkeerkaart tellen als `zorgkosten`; kinderopvang om medische of sociale redenen wordt een eigen soort `kinderopvang`. Aanvulronde voor de 30 onderzochte gemeenten.

## Overig

- **amsterdam**: inkomensgrenzen in procent van het bruto wettelijk minimumloon (Stadspas en zorgverzekering 150% voor een gezin met kinderen, CVDR645453; meerkosten 130%, CVDR741677). Opgenomen met `grondslag: "minimumloon"`.
- **amsterdam**: meerkostenregeling sluit kinderen niet uit maar noemt ze ook niet; de omschrijving zegt "vraag na of het ook voor de kosten van uw kind kan".
- **assen**: bijzondere bijstand zonder inkomensgrens (boven 120% betaalt u waarschijnlijk een deel zelf; geen harde grens).
- **apeldoorn**: geen meerkostenregeling voor kinderen (alleen een tegemoetkoming in het eigen risico, 18+); geen collectieve zorgverzekering sinds 2020.
- **den-haag**: alles via archiefkopieën (denhaag.nl gaf 403/502). Zorgverzekering "tot 150%" terwijl de premietabel bij 110% begint; 150 aangehouden. Leergeld zonder grens, url naar het Ooievaarsoverzicht.
- **rotterdam**: mantelzorgcadeau: "Of als uw kind extra zorg nodig heeft" staat in de uitleg wie mantelzorger is; nu weggelaten. Geen meerkostenregeling meer; opgenomen als meerkosten: "Bijzondere bijstand voor extra kosten door ziekte of handicap" (of het voor kosten van een kind geldt, zegt de bron niet).
- **almere**: geen eigen meerkostenregeling meer (vervallen 1-9-2025, CVDR671997); kosten bij ziekte via bijzondere bijstand, pagina noemt alleen aanvragers van 18+. Meerkosten weggelaten, niet in nietGevonden: wordt het nietGevonden? Mantelzorg: "bijvoorbeeld voor je ouders en kind" (uitleg); weggelaten.
- **breda**: mantelzorg `ouders: "ja"` op "Bijvoorbeeld voor je partner, kind, ouder" en "zorgen voor je kind met een beperking" ("minderjarig" staat er niet). Collectieve zorgverzekering: waarschijnlijk gestopt (motie 2024, geen primaire bron); weggelaten, niet in nietGevonden.
- **utrecht**: mantelzorg `ouders: "ja"` op "Voor uw gehandicapte kind" in de uitleg wie mantelzorger is (mantelzorgpagina gemeente). Dat is dezelfde soort zin als bij assen en rotterdam, waar het weggelaten is: onderzoekers lezen de regel verschillend. Na uw besluit maak ik het gelijk. Meerkosten: "Zorgkosten, extra bedrag" is geen regeling voor chronische ziekte maar voor zorgkosten bij een laag inkomen (ook voor kinderen); opgenomen als meerkosten. U-pas: grens 125% alleen in een oude bron, weggelaten. Collectieve zorgverzekering (U-polis) afgeschaft per 1-1-2025.
- **nijmegen**: beleidsregels jeugdhulp 2025 (CVDR736243): "Dit geldt ook wanneer het een eigen kind is" (uitleg mantelzorg); weggelaten. url van het mantelzorgcompliment wijst naar een algemene mantelzorgpagina die het compliment niet noemt (aanvraagpagina niet gevonden). Geen inkomensgrenzen in procenten (alleen bedragen). Meerkosten niet zeker, weggelaten.
- **groningen**: meerkostenregeling 120% van het minimumloon volgens de verordening, maar de toelichting bij een minderjarig kind noemt 120% van de bijstandsnorm; minimumloon aangehouden. Collectieve zorgverzekering waarschijnlijk gestopt per 2023 (raadsbrieven achter bot-controle); in nietGevonden. Meedoen: geen actuele regeling gevonden (Stadjerspas mogelijk gestopt); weggelaten. Mantelzorg: formulier biedt "Kind" als zorgontvanger; weggelaten.
- **tilburg**: mantelzorg: "Denk bijvoorbeeld aan de zorg voor uw kind" op een oude pagina (uitleg); weggelaten. Collectieve zorgverzekering alleen voor 18 jaar en ouder (kinderen zijn gratis meeverzekerd).
- **haarlem**: mantelzorg in nietGevonden (geen waardering in de regelgeving; afschaffing alleen uit een zoekresultaat). Meerkosten weggelaten: alleen een vergoeding van eigen risico en Wmo-bijdrage (in de praktijk voor volwassenen). Grens 130% voor Leergeld en Jeugdfonds afgeleid van de HaarlemPas.
- **amersfoort**: Jeugdfonds grens "rond 120%" (in overleg) ingevuld als 120: zachte grens. Meerkosten nietGevonden.
- **zaanstad**: mantelzorg: "gaat verder dan de gebruikelijke zorg … van partners, ouders, kinderen"; weggelaten. Meerkosten nietGevonden (niet helemaal zeker).
- **s-hertogenbosch**: Meedoentegoed: grens is 120% van de bijstandsnorm plus € 150 of € 300; ingevuld als 120 (iets strenger dan echt). Mantelzorg: "Of u zorgt voor uw kind dat verstandelijk of lichamelijk beperkt is" (uitleg); weggelaten.
- **ede**: "Tegemoetkoming hoge zorgkosten" (150%) op de volwassenenpagina; of die ook voor kosten van een kind geldt, zegt de bron niet. Meerkosten weggelaten.
- **dordrecht**: kindtegoed Dordtpas 150% bij een kind van 12 of ouder, 140% voor de rest; 140 ingevuld. Mantelzorg: alleen algemene begripsomschrijving; weggelaten.
- **zwolle**: mantelzorg: "partner, ouder, kind of ander familielid" (uitleg); ouders weggelaten.
- **zoetermeer**: leerlingenvervoer: pagina noemt 1 juli, beleidsregels 2023 noemen 1 juni (pagina aangehouden). Medische kosten: gemeentepagina zegt "geen bijzondere bijstand", beleidsregels 2026 noemen bril, hulpmiddelen en tandarts wel. Mantelzorgwaardering (in natura, verordening art. 13.1) zonder gemeentepagina: niet opgenomen.
- **emmen**: mantelzorgcompliment: iemand anders draagt de mantelzorger voor; ouders van een minderjarig kind niet genoemd. Zorgverzekering nietGevonden (afgeschaft per 2018 volgens een zoekresultaat).
- **amersfoort/zaanstad (zorgkosten)**: niet opgenomen: kinderopvang bij een sociaal-medische indicatie (Amersfoort, CVDR609770) en bijdrage gehandicaptenparkeerkaart (Zaanstad). Horen die erbij? Kinderopvang op sociaal-medische indicatie kan voor ouders van een kind met veel zorg relevant zijn.
- **zorgkosten, ongelijk gelezen**: apeldoorn kreeg "Vergoeding legeskosten gehandicaptenparkeerkaart" (130%), zaanstad niet (parkeerkaart). haarlem kreeg "Vergoeding kosten eigen risico en Wmo-bijdrage" (eigen risico van de ouder zelf), apeldoorn niet (tegemoetkoming eigen risico, "18 jaar of ouder"). Ook nijmegen heeft een kinderopvangvergoeding bij sociaal-medische indicatie (niet opgenomen). Vraag: horen parkeerkaart, eigen risico van de ouder en kinderopvang op sociaal-medische indicatie erbij?
- **groningen**: tandarts en mondhygiënist via bijzondere bijstand (tot € 1.000): of het ook voor kinderen geldt zegt de bron niet; opgenomen. Overzichtspagina vervangen door "Regelingen en vergoedingen" (minimaloket gaf 404).
- **amsterdam (zorgkosten)**: in de beleidsregels bijzondere bijstand (CVDR679865) staan aanvullende bijzondere bijstand naast de meerkostenregeling (art. 7.4 lid 3) en reiskosten ziekenbezoek (art. 7.8 lid 4), niet op een gemeentepagina; niet opgenomen. **rotterdam**: dieet, eigen bijdrage Zvw en maaltijdvoorziening (beleidsregels) niet opgenomen; onduidelijk of een kind meetelt.
- **s-hertogenbosch, zoetermeer, haarlemmermeer (zorgkosten)**: bijzondere-bijstandsonderdelen uit de beleidsregels; of ze voor een kind gelden zegt de bron niet. Bij 's-Hertogenbosch "u of uw kind" teruggezet naar "vraag na of dit ook voor uw kind kan" (de bron noemt kinderen niet).
- **ede (zorgkosten)**: "Maatwerk hoge zorgkosten" (150%) staat bij volwassenen; of kosten van een kind meetellen niet bevestigd. Ook parkeerkaart opgenomen (zie vraag hierboven). **emmen**: dieet/wassen alleen in beleidsregels.
- **delft (zorgkosten)**: grens 110% weggelaten bij de drie bijzondere-bijstandsonderdelen, net als bij de bijzondere bijstand zelf (daarboven soms een deel vergoed: geen harde grens).
- **amersfoort (kinderopvang)**: beleidsregel sociaal-medische indicatie (CVDR609770, 2018) zonder gemeentepagina; niet opgenomen (bij venlo, druten en zwolle wel, met de beleidsregel als url). **arnhem**: zorgkostenregeling (€ 190, 18+, alleen met Wmo-voorziening of Wlz-indicatie) niet opgenomen.

## Ronde 22-10-2026 (enschede..hengelo)

Mantelzorg en `ouders`:
- **hoeksche-waard**: `ouders: "ja"` op "Bent u mantelzorger van een jeugdige? Dan kunt u ondersteuning krijgen vanuit SamenWaard" (pagina Informatie mantelzorger); de regeling zelf noemt alleen "iemand die door een ziekte of beperking iets niet zelf kan". Telt "jeugdige" als kind? Anders `ouders` weglaten.
- **deventer**: `ouders: "ja"` op een interview op de gemeentesite ("ouders die mantelzorgen voor hun kind"); de waarderingspagina van Carinova noemt kinderen niet. Het besluit (2020) zegt: "Het verlenen van gebruikelijke zorg valt niet onder mantelzorg."
- **amstelveen**: `ouders: "ja"` op de homepage van Mantelzorg & Meer ("partner, ouder, kind"); url van de waardering is die homepage (gemeentepagina noemt de waardering niet).
- **alkmaar, alphen-aan-den-rijn, land-van-cuijk, meierijstad, hilversum**: `ouders: "ja"` op een opsomming met "kind" in de uitleg wie mantelzorger is (volgens het besluit van 21-10).
- **enschede, purmerend, lelystad, nissewaard**: mantelzorg weggelaten (niet zeker). Enschede: verordening noemt "een blijk van waardering", geen aanvraagpagina; mogelijk afgeschaft (2019). Purmerend: compliment alleen in berichten uit 2025, afschaffing mogelijk. Lelystad: verordening noemt een Lelypas of geldbedrag, nadere regels niet gevonden.
- **oss, leeuwarden**: de "waardering" bestaat alleen uit activiteiten (Dag van de Mantelzorg), geen geld of bon. Toch opgenomen als mantelzorg; liever weglaten?
- **hengelo**: mantelzorg in nietGevonden; Wmo-verordening 2025 art. 4.5.1: "Het college voorziet niet in een vaste financiële tegemoetkoming of standaard waardering voor alle mantelzorgers".

Overig:
- **deventer, land-van-cuijk**: DOE MEE Tegoed (Deventer) en Meedoenregeling (Land van Cuijk) zijn alleen voor 18+; opgenomen met "voor kinderen is er …" in de tekst.
- **helmond**: bijzondere bijstand met grens 130% (de pagina noemt het als voorwaarde); bij andere gemeenten weggelaten als draagkrachtgrens. Ook **sudwest-fryslan** 110%.
- **hoeksche-waard**: "Bijdrage zorgkosten" (130%) staat als meerkosten; de pagina zegt 18+, maar een indicatie intensieve jeugdhulp voor een thuiswonend kind telt als voorwaarde. "Premiebijdrage aanvullende zorgverzekering" staat als zorgkosten.
- **enschede**: bijzondere bijstand voor medische kosten volgens beleidsregels 2022 wel mogelijk, gemeentepagina zegt van niet; niet opgenomen. Kinderopvang (SMI) alleen in een verordening uit 2004/2011; weggelaten.
- **dijk-en-waard, purmerend, sittard-geleen, sudwest-fryslan**: kinderopvang (SMI) met de verordening of beleidsregel als url (geen gemeentepagina).
- **lelystad**: Leergeld-grens 150% van de site van Leergeld zelf; reiskosten ziekenbezoek alleen bij verblijf in een instelling buiten Lelystad.
- **hengelo**: "Nadere Regeling BSO+ 2027" (subsidie voor buitenschoolse opvang voor kinderen met extra begeleiding) niet als kinderopvang opgenomen: subsidie aan aanbieders, geen tegemoetkoming voor ouders.
- **helmond**: kinderopvang in nietGevonden (SMI-verordening 2011 vervallen 2017).

## Ronde 22-10-2026 middag (schiedam..barneveld)

Mantelzorg en `ouders`:
- **Waardering zonder geld of bon** (alleen activiteiten): vlaardingen opgenomen (Dag van de Mantelzorger), schiedam in nietGevonden. Beide vallen onder dezelfde regels (Maassluis Vlaardingen Schiedam 2025, CVDR733476, nadere regel 1.3.2: "een waarderingsweek … met nader in te vullen waarderingsactiviteiten"). Samen met oss en leeuwarden (ochtendronde): opnemen of niet? Na uw besluit maak ik ze gelijk.
- **bergen-op-zoom**: `ouders: "ja"` op de definitie in de Integrale Verordening Sociaal Domein ("… partner, (schoon)ouder, kind of ander familielid"); de gemeentepagina noemt de waardering zonder voorwaarden. Steunpunt niet bereikbaar.
- **katwijk**: `ouders` weggelaten; nadere regels definiëren mantelzorg als "hulp ten behoeve van … jeugdhulp, het opvoeden en opgroeien van jeugdigen", maar de pagina noemt kinderen niet. Is dat "ja"?
- **roosendaal**: `ouders: "ja"` op "Vaak gaat het om iemand in je familie zoals een ouder of kind"; dezelfde pagina noemt "opvoeding van gezonde kinderen" gebruikelijke zorg.
- **westerkwartier**: `ouders: "ja"` op het formulier ("Kind" als keuze) en de gemeentepagina; inhoud van de waardering zelf onbekend (pagina niet in het archief).
- **veenendaal, stichtse-vecht, voorne-aan-zee, capelle-aan-den-ijssel, zeist, nieuwegein, vlaardingen, hoorn**: `ouders: "ja"` op "kind" in de uitleg wie mantelzorger is (besluit 21-10).
- **lansingerland**: mantelzorg weggelaten (steunpunt noemt geen waardering). **almelo**: nietGevonden ("Er zijn geen speciale vergoedingen voor mantelzorg"). **hardenberg**: `ouders` weggelaten; de pagina zegt "Het gaat niet om de normale, dagelijkse zorg die partners, ouders, kinderen … aan elkaar geven".

Overig:
- **almelo**: meedoen weggelaten (de gemeente verwijst alleen naar de Sociale Kaart; geen kindpakket of Leergeld-pagina gevonden).
- **nieuwegein, barneveld, velsen**: bijzondere bijstand met grens (150% "geen bijzondere bijstand", 110% als voorwaarde, 110%); bij andere gemeenten weggelaten als draagkrachtgrens.
- **schiedam**: tegemoetkoming meerkosten (Wmo- of Wlz-indicatie) opgenomen; kinderen niet uitgesloten, niet genoemd.
- **veenendaal**: meerkostenregeling alleen voor volwassenen ("Volwassenen met een chronische ziekte of handicap"): nietGevonden.
- **hoorn**: kinderopvang toegevoegd op "Heeft u door sociale of medische redenen problemen met de opvang … Neem contact op met 1.Hoorn" (geen uitgewerkte regeling).
- **roosendaal, leidschendam-voorburg, barneveld**: kinderopvang of meedoen met de regeling (CVDR) als url, geen gemeentepagina. Leidschendam-Voorburg: beleidsregel kinderopvang uit 2020; geldt hij nog?
- **westerkwartier**: "Tegemoetkoming gemeentelijke belastingen en participatiefonds" (130%) als meedoen opgenomen.

## Ronde 23-10-2026 (vijfheerenlanden..heerenveen)

Mantelzorg en `ouders`:
- **heerenveen**: `ouders` weggelaten. De pagina rekent "de verzorging, opvoeding en begeleiding van een jong kind, ook als het kind een probleem heeft met de gezondheid" tot gebruikelijke zorg. Wordt dat `"nee"`?
- **gooise-meren**: `ouders: "ja"` gezet door de hoofdagent: de voorwaarde is een indicatie van de zorgontvanger van minstens 371 dagen, uitdrukkelijk ook "volgens de Jeugdwet".
- **Waardering alleen activiteiten** (vraag van 22-10): ook hoogeveen (Mantelzorg-Vitaal), woerden (Maand van de Mantelzorger) en pijnacker-nootdorp (collectief, `ouders` weggelaten). Allemaal opgenomen.
- **vijfheerenlanden, west-betuwe, maashorst, krimpenerwaard, den-helder, de-fryske-marren**: `ouders` weggelaten (geen kind in de bron). **midden-groningen**: mantelzorg weggelaten (niets gevonden).
- **altena, doetinchem, kampen, oosterhout, roermond, rijswijk, smallingerland, goeree-overflakkee**: `ouders: "ja"` op kind in de uitleg of een voorbeeld ("een kind met autisme", "voor uw kind met een beperking").

Overig:
- **woerden**: meerkosten (TMZ, 140%) noemt kinderen niet; tekst zegt "Vraag na of het ook voor uw kind kan".
- **altena**: Kindpakket 130% (beleidsregels) tegenover 120% op de minimapagina; 130 aangehouden.
- **de-fryske-marren**: zorgverzekering 130% (gemeente) tegenover 120% in een zoekresultaat; 130 aangehouden.
- **vijfheerenlanden**: Leergeld "120% van het minimumloon" op één pagina, 130% bijstandsnorm op andere; grens weggelaten.
- **roermond**: kinderopvang (SMI) alleen op de inkomenskaart 2026, geen geldende regeling in de SRU; url de pagina bijzondere bijstand.
- **kampen**: zorgverzekering zonder grens (pagina zegt "minimuminkomen").
- **gooise-meren**: geen collectieve zorgverzekering (niet aangesloten bij gezondverzekerd.nl); de premietegemoetkoming staat bij zorgkosten.
- **maashorst**: kinderopvang eerst ten onrechte in nietGevonden; toegevoegd na controle (Beleidsregels SMI 2024, CVDR716056).
- **pijnacker-nootdorp**: bijzondere bijstand 110% als grens (pagina: "Personen vanaf 21 jaar met een inkomen tot maximaal 110%").

## Ronde 23-10-2026 middag (noordoostpolder..heusden)

Mantelzorg en `ouders`:
- **Waardering zonder geld** (vraag van 22-10): ook zuidplas (twee waarderingsmomenten via het steunpunt) en lingewaard (compliment van € 140 gestopt per 1-1-2026; nu een presentje rond de Dag van de Mantelzorg via Incluzio). Beide opgenomen met `ouders: "ja"`.
- **waalwijk**: `ouders: "ja"` op een citaat van de wethouder ("Voor hun partner, vader, moeder, broer, zus, kind, buur of vriend"), geen voorwaardentekst.
- **het-hogeland**: `ouders: "ja"` op het aanmeldformulier ("Kind" als keuze); bedrag en voorwaarden van de waardering niet gevonden.
- **utrechtse-heuvelrug**: twee items mantelzorg: Mantelzorgcompliment (`ouders: "ja"`, "Ouders met zorgtaken voor hun gehandicapte zoon of dochter") en Tegemoetkoming mantelzorg (kosten, 120%, `ouders` weggelaten).
- **schagen**: mantelzorg weggelaten; de verordening (CVDR755077, art. 5.3.2) noemt een cadeaubon of activiteit, maar er is geen gemeentepagina en de tekst verwijst naar de verordening van Den Helder.
- **noordoostpolder**: mantelzorg weggelaten (geen waardering op de pagina).
- **veldhoven, overbetuwe**: veldhoven en overbetuwe rekenen zorg van "partners of ouders en inwonende kinderen" (veldhoven) of "een partner, ouder of volwassen kind" (overbetuwe) tot gebruikelijke zorg; `ouders` weggelaten.

Overig:
- **noordoostpolder, waadhoeke**: geen collectieve zorgverzekering (gezondverzekerd.nl: "deze gemeente doet niet mee"); noordoostpolder weggelaten, waadhoeke in nietGevonden. Graag gelijktrekken.
- **overbetuwe**: zorgverzekering in nietGevonden (Gemeentepolis vervangen door compensatie eigen risico, staat bij zorgkosten).
- **barendrecht**: kinderopvang in nietGevonden; buurgemeente Ridderkerk heeft wel SMI-beleidsregels (CVDR762298, 2026).
- **soest, weert**: kinderopvang (SMI) niet gevonden (weggelaten resp. nietGevonden).
- **het-hogeland**: kinderopvang op een beleidsregel uit 2017 van de vier oude gemeenten (CVDR602602); wordt hij nog uitgevoerd?
- **houten, veldhoven, soest**: de Leergeld-site zegt "In jouw gemeente is (nog) geen lokale Leergeldstichting actief" (waarschijnlijk sjabloontekst); item verwijst naar de gemeentepagina of homepage.
- **weert**: Kindpakket "120% of 130%" per onderdeel; 130 aangehouden.
- **zutphen, het-hogeland**: bedragen zonder jaartal weggehaald door de hoofdagent (onderzoekers vergeten dit nog vaak).

## Rondes 23-10-2026 (noordwijk..aalten, 100 gemeenten)

Algemeen:
- **WebSearch-budget op** halverwege (vanaf Vught): de rest is alleen via gemeentesites, sitemaps, sociale diensten, gezondverzekerd.nl en de SRU onderzocht.
- **Kinderopvang (SMI) alleen op een oude regel of zonder gemeentepagina**: url is de verordening of beleidsregel bij o.a. vlissingen (bijzondere bijstand bij dringende situatie, geen eigen regeling), hof-van-twente (bijdrage met werk/studie-voorwaarden), epe (alleen een mandaatbesluit), dongen (beleidsregel 2012), oldenzaal (2010), buren ("Kinderdagverblijf Plus", extra begeleiding, geen SMI), montferland, meppel, zwijndrecht, tiel, waddinxveen, heemskerk, de-ronde-venen, horst-aan-de-maas, nunspeet. **oisterwijk**: kinderopvang weggehaald door de hoofdagent (alleen een verordening uit 2010; SMI-regelingen per 2026 vervallen).
- **Zorgverzekering via gezondverzekerd.nl "doet niet mee"**: venray, edam-volendam, rheden, renkum, buren, dalfsen in nietGevonden. Let op: bij papendrecht en hendrik-ido-ambacht stuurt gezondverzekerd.nl ook door naar "offline", maar loopt de Gemeentepolis Drechtsteden via de sociale dienst (hendrik-ido-ambacht door de hoofdagent toegevoegd).

Mantelzorg en `ouders`:
- **Waardering zonder geld** (vraag van 22-10): ook maassluis (zelfde regels als Schiedam/Vlaardingen), renkum (activiteit), oldenzaal (alleen cursussen en mantelzorgcafé: weggelaten), zuidplas.
- **`ouders: "ja"` door de hoofdagent gezet** bij zwijndrecht en schouwen-duiveland ("Dit kan een partner, ouder of kind zijn" in de definitie).
- **ermelo**: "partner, kind, ouder, vriend(in)…" kan ook het kind als mantelzorger bedoelen; `ouders: "ja"` gelaten. **gilze-en-rijen**: "kind" kan een volwassen kind zijn.
- **oldambt**: Wmo-regels zeggen "ouders zijn niet op te vatten als mantelzorgers" (voor de Wmo-indicatie), het steunpunt noemt "kind" wel; `ouders: "ja"`.
- **noardeast-fryslan**: gemeente sluit "alledaagse zorg voor een gezond kind" uit; `ouders: "ja"` (kind met extra zorg).
- Mantelzorg weggelaten (geen waardering gevonden of niet zeker): oisterwijk, raalte, veendam, dongen, wassenaar, oldenzaal. huizen: in nietGevonden ("in 2021 gestopt met het mantelzorgcompliment").

Meerkosten en zorgkosten:
- **Meerkostenregeling alleen 18+** → als zorgkosten met "Alleen voor uzelf (18 jaar of ouder), niet voor uw kind" (vaste afspraak sinds 23-10): o.a. tiel, waddinxveen, midden-drenthe (4 items), drimmelen, achtkarspelen, buren, rheden, landgraaf (21+), nunspeet (21+).
- **ermelo**: tegemoetkoming bij chronische ziekte (Meerinzicht, 130%) als meerkosten opgenomen, omdat dubbele kinderbijslag voor een thuiswonend gehandicapt kind meetelt. **harderwijk** (zelfde Meerinzicht-regeling) staat als zorgkosten "alleen vanaf 19 jaar": gelijktrekken?
- **"Vraag na of het ook voor uw kind kan"** toegevoegd door de hoofdagent bij wageningen, leusden, dalfsen (meerkosten noemt kinderen niet).
- **bodegraven-reeuwijk**: "Extra premiebijdrage chronisch zieken" (Ferm Werk) als meerkosten, zonder inkomensgrens; geldt hij voor kinderen?
- **steenwijkerland**: "Bijdrage premie aanvullende zorgverzekering" (18+) niet opgenomen; bij gooise-meren staat zo'n bijdrage wel als zorgkosten.

Overig:
- **boxtel**: Welzijnsfonds € 351 (2026, gemeentepagina) tegenover € 243 (verordening).
- **beverwijk**: gemeentepagina's 110%, beleidsregels 2024 120% (sport/cultuur) en 130% (polis).
- **drimmelen**: geen kindpakket of Leergeld gevonden (meedoen weggelaten).
- **vlissingen**: Leergeld Walcheren is niet actief in Vlissingen; Leergeld-sites zeggen vaker "geen lokale stichting actief" (houten, veldhoven, soest, papendrecht, halderberge): waarschijnlijk een sjabloon.

## Ronde 23-10-2026 middag (heemstede..hillegom, 50 gemeenten)

Algemeen:
- **WebSearch-budget op** vanaf ongeveer Baarn; alles via gemeentesites, sitemaps, sociale diensten, gezondverzekerd.nl en de SRU.
- **Zorgkosten uit de bijzondere bijstand**: halverwege de ronde heb ik de agents gevraagd posten uit een opsomming op de bijzondere-bijstandspagina wel op te nemen (zoals de agentinstructie zegt) en posten die alleen in beleidsregels staan weg te laten (niet in `nietGevonden`). Eerder in de ronde niet opgenomen terwijl de pagina ze noemt: **borne** (dieet), **putten** (tandarts, orthodontie, bril), **aa-en-hunze** ("reiskosten", staat in `nietGevonden`). Bij **voorst** heb ik `zorgkosten` uit `nietGevonden` gehaald (alleen in beleidsregels).
- **"Vraag na of het ook voor uw kind kan"** gezet door de hoofdagent bij **de-wolden** (meerkosten noemt alleen "u en uw partner"); weggehaald bij zorgkosten uit de bijzondere bijstand (loon-op-zand, steenbergen), want die geldt voor het gezin.
- **Kinderopvang (SMI) alleen op een verordening of beleidsregel, zonder gemeentepagina**: hulst, heemstede, albrandswaard, maasdriel (alleen indicatie voor de ouder, Wmo-verordening art. 20), aa-en-hunze, neder-betuwe, wierden, voorschoten (2020, grens bruto € 45.000), duiven (oud), stein (2021), zwartewaterland, laarbeek, westerwolde, bloemendaal, reimerswaal, rucphen, zundert, oegstgeest (2022).
- **Kinderopvang niet opgenomen**: tholen (alleen bij re-integratie of opleiding, weggelaten), baarn (idem, weggelaten); `nietGevonden` bij weststellingwerf, wijdemeren, oldebroek, nuenen (alleen vervallen regel uit 2010), sluis (alleen bij werk of activiteit).
- **Zorgverzekering via gezondverzekerd.nl "doet niet mee"** (`nietGevonden`): borger-odoorn (net als Emmen), neder-betuwe, putten, eijsden-margraten. **duiven**: collectieve verzekering gestopt per 1-1-2026.

Mantelzorg en `ouders`:
- **`ouders: "ja"` op zwakke grond** (graag bevestigen): sliedrecht (Mantelzorgtest: "een ziek kind naar het ziekenhuis brengen"), stein (alleen steunpunt Mantelzorg Zuid: "ouder, partner of kind"), voorst (algemene mantelzorgpagina; waarderingspagina noemt geen voorwaarden), goirle ("buurman, partner, kind of familielid").
- **ooststellingwerf**: `ouders` weggelaten, maar de gemeentesite heeft het verhaal "Mantelzorger Jacintha zorgt voor haar zoon Koen". Genoeg voor `"ja"`?
- **brunssum**: pagina noemt zorg voor kinderen "normale dagelijkse zorg"; `ouders` weggelaten. **loon-op-zand**: beleidsregels noemen zorg tussen ouders en inwonende kinderen gebruikelijk; weggelaten.
- **Waardering zonder geld** (open vraag van 22-10): wierden (activiteiten), voorschoten (verrassingsactie), rucphen (bedankmiddag), bloemendaal (Dag van de Mantelzorg via Tandem).
- **Mantelzorg weggelaten** (geen waardering gevonden of niet zeker): dinkelland (alleen een waarderingsmoment; beleid 2026-2030 onderzoekt steun voor ouders van zorgintensieve kinderen), de-wolden, wijdemeren, steenbergen (bot-controle), elburg, sluis (verordening belooft een waardering, geen pagina). `nietGevonden`: reimerswaal.

Meerkosten en zorgkosten:
- **heemstede, bloemendaal (IASZ)**: "Bijdrage chronisch zieken en gehandicapten" (€ 385 in 2026, gelijk aan het eigen risico, 130%) staat onder "Regelingen volwassenen" en noemt geen kinderen; weggelaten. Opnemen als zorgkosten "Alleen voor uzelf"? Bij heemstede staat `zorgkosten` in `nietGevonden`.
- **duiven**: meerkostenregeling (€ 300/€ 150, 120/140%): de minimapagina zegt "21 jaar of ouder", de regeling zelf alleen "inwoner"; weggelaten.
- **zwartewaterland**: verordening art. 7.6.3 kent een tegemoetkoming (120% WML), maar de beleidsregel (CVDR639292) rust op het vervallen art. 7.6.2; weggelaten. Wordt hij nog uitgevoerd?
- **rucphen**: Wmo-verordening 2025 art. 17 maakt een tegemoetkoming meerkosten mogelijk, zonder uitwerking of pagina; weggelaten.
- **Meerkosten alleen 18+ → zorgkosten "Alleen voor uzelf"**: borger-odoorn, neder-betuwe, westerwolde, oldebroek, zeewolde (Meerinzicht, zoals harderwijk; ermelo heeft hem als meerkosten: gelijktrekken), eijsden-margraten (zorgverzekeringsbudget, geen collectieve polis), brunssum (eigen risico, 21+).
- **borsele**: omschrijving gelijkgetrokken met goes ("Hebt u of uw kind …"), zelfde pagina van GR de Bevelanden (telt dubbele kinderbijslag mee).
- **maasdriel**: de **Zorgoppas** (oppas voor kinderen met een beperking, gemeente betaalt een deel) past in geen soort en staat er niet in. Nieuwe soort, of onder zorgkosten?
- **zundert**: "Financiering van een sporthulpmiddel" weggehaald door de hoofdagent (Wmo-voorziening).

Overig:
- **albrandswaard**: zorgpolis 120% (gemeente en beleidsregels 6-10-2026) tegenover 130% op gezondverzekerd.nl.
- **heemstede, bloemendaal**: zorgverzekering 130% (gezondverzekerd.nl); IASZ noemt 120%, en 130% voor chronisch zieken en 65-plussers.
- **oegstgeest**: zorgverzekering 120% (AV Standaard) en 130% (AV Top); 130 gekozen.
- **sluis**: verordening noemt 130% voor het minimabeleid, de pagina's 120%; pagina's gevolgd.
- **haaksbergen**: Jeugdfonds 115% op een oudere gemeentepagina, 120% in de verordening; bedragen zonder jaar door de hoofdagent weggehaald.
- **hillegom**: inhoud overgenomen van lisse (zelfde ISD Bollenstreek en Welzijnskwartier); url's en de Hillegom-folder door de hoofdagent gecontroleerd. **lisse, hillegom**: hoge zorgkosten alleen in de ISD-folder, url is de bijzondere-bijstandspagina (zoals teylingen).
- **wijk-bij-duurstede**: RSD-pagina /mantelzorgregeling (€ 100, 120%) lijkt voor Utrechtse Heuvelrug; niet opgenomen.

## Ronde 23-10-2026 avond (bunschoten..gulpen-wittem, 50 gemeenten)

Algemeen:
- Afspraken vooraf aan de agents meegegeven (zorgkosten uit een opsomming op de bijzondere-bijstandspagina wel, uit alleen beleidsregels niet; "Vraag na of het ook voor uw kind kan" alleen bij meerkosten; SMI ook met alleen een beleidsregel; Wmo- en Jeugdwet-voorzieningen geen geldregeling; buurgemeenten met dezelfde uitvoerder gelijk houden).
- **Door de hoofdagent aangepast**: woensdrecht ("in 2026 € 50 per kind" weg, bron noemt geen jaar), meerssen ("maximaal € 80 per persoon per jaar" weg), woudenberg ("rond 10 november" → "rond de Dag van de Mantelzorg"), midden-delfland (Jeugdwetvervoer weggehaald), drechterland en asten (`zorgkosten` uit `nietGevonden`), rhenen (inkomensgrens zorgverzekering 120, zoals gemeentepagina en veenendaal), duiven en westervoort ("RSD" voluit).

Mantelzorg en `ouders`:
- **`ouders: "ja"` door de hoofdagent gezet** bij **dantumadiel** en **someren**: de bron sluit alleen de zorg voor een gezond kind uit, zoals bij noardeast-fryslan. Graag bevestigen.
- **`ouders: "ja"` op smalle grond**: lopik (alleen steunpuntpagina "ouder, partner, vriend(in), kind…"), valkenburg-aan-de-geul (beschikking jeugdzorg als bewijsstuk, zoals eijsden-margraten), woudenberg (aanmeldformulier steunpunt), hardinxveld-giessendam (nadere regels noemen kind als zorgontvanger, sluiten gebruikelijke zorg uit), gulpen-wittem ("uw zieke partner, kind", maar regels sluiten gebruikelijke hulp van ouders uit; meerssen met dezelfde uitvoerder weggelaten).
- **texel**: `ouders` weggelaten, maar de regeling (2018) noemt "jeugdhulp, het opvoeden en opgroeien van jeugdigen" in de definitie van mantelzorg. "Ja"?
- **Mantelzorg weggelaten** (geen waardering gevonden of niet zeker): tubbergen (zoals dinkelland), eersel, waterland, nederweert, gennep (pagina 404), urk (alleen in verordening, geen pagina). `nietGevonden`: rhenen (alleen activiteiten; veenendaal heeft wel een compliment), zandvoort.
- **beek**: waardering in 2026 niet aan te vragen; omschrijving zegt dat.

Meerkosten en zorgkosten:
- **westervoort tegenover duiven** (beide RSD de Liemers): westervoort heeft de meerkostenregeling opgenomen met "Vraag na…", duiven niet (minimapagina zegt "21 jaar of ouder"). Gelijktrekken?
- **westervoort**: nieuwsbericht (3-6-2026) noemt bijzondere bijstand voor bril, hoortoestel, tandarts, orthodontie en kraamzorg; niet op de gemeentepagina, niet opgenomen.
- **staphorst**: bijzondere-bijstandspagina noemt bril en tandarts, niet als zorgkosten opgenomen (zelfde als borne en putten in de vorige ronde).
- **harlingen**: vergoeding medische kosten staat als 18+, maar de pagina noemt ook "orthodontie (tot 18 jaar)".
- **urk**: tegemoetkoming zorgkosten opgenomen met "Vraag na…"; de beleidsregels noemen ook een Jeugdwet-indicatie als route, dus mogelijk geldt hij voor een kind.
- **waalre**: geen meerkostenregeling; de Meedoenbijdrage noemt "volwassenen en chronisch zieken".

Kinderopvang:
- **urk**: SMI staat alleen in een alinea van de beleidsregels Jeugdhulp 2025; weggelaten (elders nemen we een beleidsregel wel op).
- **hardinxveld-giessendam**: geen eigen SMI-regel gevonden; de andere Drechtsteden hebben elk een eigen regel.
- `nietGevonden`: alblasserdam (alleen voor werkende ouders), heerde, gennep, nederweert, heeze-leende, waalre.

Zorgverzekering:
- **gulpen-wittem tegenover eijsden-margraten** (zelfde uitvoerder): gulpen-wittem heeft VGZ Zuid-Limburg 150% via de pagina van Sociale Zaken Maastricht-Heuvelland; eijsden-margraten staat op `nietGevonden` (gezondverzekerd.nl offline). Gelijktrekken.
- **west-maas-en-waal**: `nietGevonden` (gezondverzekerd.nl offline, niets op de site; door de hoofdagent nagekeken), terwijl tiel en culemborg (ook Rivierenland) wel een Gemeentepolis hebben.
- **bunschoten**: 130% (gezondverzekerd.nl, zoals baarn en soest) tegenover 115% in de minimatabel voor de vergoeding van € 120.
- Gestopt per 1-1-2026: duiven, westervoort. "Doet niet mee": urk, harlingen.

Overig:
- **oirschot**: meedoen weggelaten; het beleidsplan noemt een "Participatieregeling 18- (Stichting Leergeld)", maar er is geen Leergeld-afdeling of pagina gevonden.
- **veere**: Leergeld Walcheren noemt Veere niet bij naam (wel via Orionis).

## Ronde 23-10-2026 laat (laatste 32: montfoort..schiermonnikoog) → alle 342 gemeenten gedaan

Door de hoofdagent aangepast:
- **uitgeest**: zorgkosten (extra kosten door ziekte, bijzondere bijstand) en kinderopvang (eigen bijdrage bij sociaal-medische indicatie) toegevoegd, gelijk aan heiloo, alkmaar, bergen-nh en dijk-en-waard (de Zaffier-pagina noemt beide). **castricum** mist deze twee nog: toevoegen?
- **opmeer**: zorgkosten-item toegevoegd (bijzondere-bijstandspagina noemt brillen en tandartskosten).
- **zoeterwoude**: ontbrekende `laatstGecontroleerd` aangevuld (de build faalde erop).
- **goes, kapelle, reimerswaal**: "GR de Bevelanden" in de tekst vervangen door "de sociale dienst De Bevelanden"; **blaricum, eemnes, huizen, laren**: "Meedoen HBEL" uit naam en aanvragen gehaald (validate-waarschuwing afkortingen).

Gelijktrekken:
- **huizen**: `zorgkosten` in `nietGevonden`, terwijl dezelfde bijzondere-bijstandspagina (maatschappelijkezaken.nl) medische kosten noemt; blaricum, eemnes en laren hebben het item wel.
- **rozendaal en rheden**: rozendaal noemt een "Collectieve aanvullende zorgverzekering" en een "Kindpakket", rheden heeft zorgverzekering op `nietGevonden`. Beide nakijken.
- **alphen-chaam, baarle-nassau, gilze-en-rijen**: bijzondere-bijstandspagina noemt de tandarts; geen zorgkosten-item.
- **schiermonnikoog**: meerkostenregeling uit 2016 (CVDR431316, ook voor de oude gemeenten Dantumadiel, Dongeradeel e.a.) als zorgkosten 18+; dantumadiel en noardeast-fryslan hebben meerkosten op `nietGevonden`. Geldt die regeling nog?

Mantelzorg:
- **`ouders: "ja"`** bij o.a. hattem ("partner, kind, ouder"), blaricum, laren, eemnes (sluiten alleen gewone zorg tussen gezinsleden uit), terschelling ("zoon of dochter met een beperking"), vlieland ("Mijn (pleeg)kind" in het formulier), renswoude en zoeterwoude (letterlijk ouders van een kind), schiermonnikoog, oudewater (oude bronnen).
- **Weggelaten** (geen waardering of geen voorwaarden): reusel-de-mierden en noord-beveland (verordening belooft een waardering, geen pagina), pekela (alleen een middag op de Dag van de Mantelzorg). `nietGevonden`: beesel, ameland.
- **Waardering zonder geld**: voerendaal (attentie en abonnement).

## Gelijktrekronde 23-10-2026 (uitvoering besluiten 1-12, 99 gemeenten)

Wat er gebeurd is (per gemeente):
- R7 (kinderopvang op regel ≤2018 zonder gemeentepagina) weggehaald: barneveld (2018), dongen (2012), heemskerk (2018), nunspeet (2018), oldenzaal (2009/2010), renkum (2017), zwartewaterland (2016). het-hogeland gehouden: de regel is van 2017, maar de Beleidsregels Participatiewet (versie 15-4-2025, par. 13.10) verwijzen er nog naar; beide als bron. Graag bevestigen. Overige 104 kinderopvang-items op een CVDR-regel: laatste versie 2019 of later (automatisch via SRU).
- houten, ijsselstein, nieuwegein, lopik (WIL): grens 150% bij bijzondere bijstand weg (pagina noemt draagkracht); omschrijving houten/lopik gelijk aan ijsselstein.
- alphen-chaam, baarle-nassau, gilze-en-rijen: zorgkosten-item "Bijzondere bijstand voor zorgkosten, zoals de tandarts" (pagina bijzondere bijstand); harlingen: zorgkosten-item reiskosten medisch specialist.
- ermelo/harderwijk/zeewolde (Meerinzicht): tegemoetkoming chronisch zieken overal zorgkosten "Alleen voor uzelf (19 jaar of ouder)"; ermelo van meerkosten naar zorgkosten (+ meerkosten in nietGevonden).
- duiven: meerkostenregeling toegevoegd als meerkosten met "Vraag na…" (pagina gelijk aan westervoort, noemt geen leeftijd; "21 jaar" stond op een andere pagina). Zorgverzekering blijft nietGevonden (duiven.nl/einde-collectieve-zorgverzekering: gestopt per 1-1-2026, door hoofdagent nagekeken).
- aa-en-hunze: bijz.-bijstandsgrens 130 weg (WPDA: daarboven "waarschijnlijk een deel"); zorgkosten blijft nietGevonden (opsomming noemt alleen algemene reiskosten). albrandswaard, altena: percentages kloppen met de geldende regels. barneveld (110) en beekdaelen (120): harde voorwaarde, grens blijft.
- heemstede, bloemendaal: zorgverzekering 130% klopt met beleidsregels minimabeleid 2025 (art. 3). bloemendaal: mantelzorg "Geen geldbedrag." toegevoegd. huizen: zorgkosten-item medische kosten en mondzorg (uit nietGevonden). castricum: zorgkosten + kinderopvang zoals heiloo (Zaffier).
- heerenveen: mantelzorg ouders "nee" (voetnoot: "verzorging, opvoeding en begeleiding van een jong kind, ook als het kind een probleem heeft met de gezondheid" = gebruikelijke zorg). hardenberg: ouders blijft weg (algemene uitsluiting, geen kind als zorgontvanger). haaksbergen: percentages kloppen met regels. hattem, hellendoorn: bijstandsgrens 120 is harde voorwaarde.
- borne: zorgkosten-item dieetkosten (bijz.-bijstandpagina). breda: zorgverzekering → nietGevonden (gezondverzekerd "doet niet mee", niets op breda.nl). brunssum: ouders "ja" ("Dit kan een partner, ouder of kind zijn"; sluit alleen gewone zorg uit) — lichte twijfel: "zorg voor de kinderen" kan alle kinderzorg bedoelen. beverwijk, bunschoten: percentages kloppen.
- eijsden-margraten: collectieve zorgverzekering VGZ Zuid-Limburg 150% toegevoegd (SZMH-pagina + vgz.nl/zuidlimburg noemt de gemeente), gelijk aan gulpen-wittem. rozendaal: zorgverzekering → nietGevonden (opsomming wijst naar oude Rheden-pagina's; rheden heeft geen polis). rheden: blijft nietGevonden.
- echt-susteren, geldrop-mierlo, gouda: bijstandsgrens is harde voorwaarde. eersel: mantelzorg toegevoegd (jaarlijks "in het zonnetje", activiteiten + Mantelzorgcompliment, geen bedrag); ouders weggelaten ("partner, kind, vader of moeder" — zorgvrager of mantelzorger onduidelijk). enschede: mantelzorg toegevoegd op Wmo-verordening 2026 art. 31 (aanvraagroute onbekend).
- helmond 130, heumen 110, hof-van-twente 120, horst-aan-de-maas 130: bijstandsgrens harde voorwaarde, blijft. hoogeveen: mantelzorg "Geen geldbedrag, maar activiteiten…".
- de-fryske-marren: zorgverzekering 130 klopt (beleidsregels bijz. bijstand 2026). deurne: bijstandsgrens 110 weg (beleidsregels: "draagkrachtloos inkomen"). deventer: ouders "ja" nu op Besluit Wmo 2020 art. 23 (mantelzorg omvat "het opvoeden en opgroeien van jeugdigen"); interviewbron weg. dinkelland: mantelzorg opgenomen (jaarlijks waarderingsmoment, zonder geld), ouders "ja" (gemeentepagina: "een kind met extra zorgbehoeften"). dordrecht: kindtegoed 140 blijft (150 alleen tweeoudergezin met kind 12+).
- OPEN VRAAG: definitie "het opvoeden en opgroeien van jeugdigen" als grond voor ouders "ja"? Nu ja bij deventer en scherpenzeel, weggelaten bij texel en katwijk.
- hulst 120, leidschendam-voorburg 110: harde voorwaarde, blijft. kapelle, leeuwarden: mantelzorg-omschrijving zegt nu "geen geldbedrag". lelystad: mantelzorg toegevoegd op Wmo-verordening 2024 art. 27 (Lelypas met budget of geldbedrag); ouders weggelaten.
- lingewaard: mantelzorg → nietGevonden (gemeente: "Sinds 1 januari 2026 is het niet langer mogelijk om een mantelzorgcompliment aan te vragen"; presentje niet gevonden). maasdriel: Zorgoppas als zorgkosten; bijstandsgrens 110 harde voorwaarde. maasgouw 130 blijft. maassluis: "Geen geldbedrag genoemd." loon-op-zand: ouders blijft weg (regel noemt kind niet als zorgontvanger).
- nederweert: mantelzorg toegevoegd (attentie aan huis rond 10 november via Punt Welzijn), ouders weg. noord-beveland: mantelzorg toegevoegd op Wmo-verordening art. 19; hoofdagent zette ouders "ja" op steunpuntpagina ("Een kind blijkt gehandicapt"). noordoostpolder: zorgverzekering → nietGevonden. oegstgeest: zorgverzekering 130 → 120 (regeling CVDR613854: 120% AV Standaard, 130% AV Top alleen bij hoge zorgvraag). oisterwijk: bijstandsgrens weg (gedeeltelijk recht bij hoger inkomen).
- reusel-de-mierden: mantelzorg toegevoegd op Wmo-verordening 2024 art. 23 (geen geld), ouders weg. rhenen: mantelzorg opgenomen (zonder geld, Welzijn Rivierstroom), ouders "ja" ("partner, kinderen, ouders"); Doe mee 130% liep af 30-6-2026, 120 klopt. roerdalen 120 harde voorwaarde. rucphen: omschrijving "jaarlijkse bijeenkomst"; of er iets van waarde wordt gegeven staat er niet. s-hertogenbosch: percentages kloppen.
- oss, pijnacker-nootdorp, renkum: omschrijving zegt geen geldbedrag. putten: zorgkosten-item (bril, tandarts, reiskosten). pekela: hoofdagent voegde mantelzorg toe (middag + mantelzorgcompliment rond 10 november, via De Badde; url is nieuwsbericht 2026 → in 2027 nakijken).
- terneuzen: bijstandsgrens weg (draagkrachtberekening). sudwest-fryslan 110, tynaarlo 120: harde voorwaarde. tubbergen: mantelzorg opgenomen (jaarlijks waarderingsmoment, beleidsnota 2026-2030, geen geld), ouders "ja" (gemeentepagina: "een kind met extra zorgbehoeften"); geen aanvraagwijze. urk: url mantelzorg = beleidsregels Wmo 2025 art. 5.3.2.
- zaltbommel: bijstandsgrens 110 blijft (pagina: harde voorwaarde; beleidsregels: boven 110% telt 100% als draagkracht = in de praktijk hard). zoetermeer: mantelzorg toegevoegd (Wmo-besluit 2026 h. 8: € 200 per jaar), ouders weg. zuidplas: omschrijving "twee bijeenkomsten per jaar; geen geldbedrag".
- schiedam: mantelzorg opgenomen (waarderingsweek met activiteiten, regel CVDR733476 nadere regel 1.3.2; geen geld), uit nietGevonden. simpelveld 120, someren 110: harde voorwaarde. sluis: mantelzorg opgenomen op Integrale Verordening 2026 art. 5.5.1; percentages gelaten (verordening noemt 130% als bovengrens met "specifieke voorwaarden per voorziening"; pagina's 120%). staphorst: zorgkosten-item brillen en tandarts.
- velsen 110, voerendaal 120, voorschoten 110: bijstandsgrens harde voorwaarde. vijfheerenlanden: Leergeld-grens blijft weg (120% minimumloon vs 130% bijstandsnorm op twee pagina's, geen geldende regel). vlaardingen, voerendaal, voorschoten: mantelzorg-omschrijving zegt geen geldbedrag.
- waalwijk: ouders "ja" weg (alleen wethoudercitaat; regels en pagina noemen geen kind), zin "ook als ze voor hun kind zorgen" weg. weert: percentages gelaten (geen regel voor Kindpakket; 130 merendeel). westerwolde 110 harde voorwaarde. wierden, woerden: mantelzorg-omschrijving zegt geen geldbedrag.

Nog open (de gebruiker beslist):
- **Definitie "het opvoeden en opgroeien van jeugdigen"** in de regels als grond voor `ouders: "ja"`: nu "ja" bij deventer en scherpenzeel, weggelaten bij texel en katwijk. Gelijktrekken naar "ja" of naar weglaten?
- **het-hogeland**: kinderopvang staat op een regel uit 2017 (valt onder besluit 7), maar de beleidsregels van 2025 verwijzen er nog naar; laten staan?
- **brunssum**: `ouders: "ja"` met lichte twijfel ("zorg voor de kinderen" als gewone zorg kan alle kinderzorg bedoelen).
- **eersel**: `ouders` weggelaten; bron noemt "partner, kind, vader of moeder" zonder te zeggen of dat de zorgontvanger is.
- **sluis, weert**: percentages gelaten: verordening noemt een algemene bovengrens (sluis 130%) of er is geen regel per regeling (weert Kindpakket 120/130 per onderdeel).
- **zaltbommel**: bijstandsgrens 110 gelaten (boven 110% telt 100% als draagkracht: in de praktijk een harde grens).

## Besluiten open punten 23-10-2026 (gebruiker) en uitvoering

13. **Definitie "het opvoeden en opgroeien van jeugdigen"** in de regel (de omschrijving van mantelzorg uit de Wmo): genoeg voor `ouders: "ja"`. Toegepast op texel, katwijk (eerder weggelaten) en, na een automatische zoektocht in de regels bij mantelzorg zonder `ouders`, op beekdaelen, dordrecht, emmen, rucphen, sluis, urk, westland en zaanstad (zin in de omschrijving van mantelzorg nagekeken; druten niet: daar staat de zin elders). Deventer en scherpenzeel stonden al op "ja". Let op: dit is de wettelijke omschrijving, dus elke gemeente waarvan de regel hem citeert, komt op "ja".
- **het-hogeland**: kinderopvang op de regel van 2017 blijft staan (de beleidsregels van 2025 verwijzen ernaar).
- **eersel**: `ouders: "ja"` ("De meeste mensen worden vanzelf mantelzorger als partner, kind, vader of moeder ziek of hulpbehoevend wordt", steunpunt).
- **brunssum**: `ouders: "ja"` blijft.
- **sluis, weert**: percentages blijven; weert: omschrijving Kindpakket noemt dat kledingdag en zomerpakket tot 120% gaan.
- **zaltbommel**: bijstandsgrens 110 blijft.
