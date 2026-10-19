---
onderwerp: Concept: vragen die u het wijkteam kunt stellen (pagina "Uw gesprek voorbereiden")
datum: "2026-10-19"
status: vragen in de basis akkoord (19-10); vraag 3 geschrapt, 9 blijft; A nuanceren op de pagina, C overnemen
aanleiding: Drempelonderzoek (drempels-hulp-vragen.md) raadt "een checklist, een dagboek-sjabloon en voorbeeldzinnen" aan.
---

# Concept: vragen voor het gesprek met het wijkteam

Uitgangspunt: elke vraag steunt op iets wat de site al zegt, met de bron die daar al bij staat. Er komt dus geen nieuwe bewering over rechten of termijnen bij. Een vraag zelf belooft niets; de ouder vraagt het na. Vragen zonder steun op de site staan gemarkeerd als **eigen voorstel**.

Op papier staan de vragen met een vakje ervoor, zodat de ouder aankruist wat voor hem of haar past, en met ruimte voor het antwoord.

## Bij het maken van de afspraak

| # | Vraag | Steunt op |
|---|---|---|
| 1 | Mag ik iemand meenemen, zoals een cliëntondersteuner of iemand uit mijn omgeving? | `landelijk/02-toegang.md` (recht op cliëntondersteuner), `02b-hulp-vragen.md` ("U hoeft het niet alleen te doen"); Wmo 2015 art. 2.2.4 (drempelonderzoek) |
| 2 | Kan ik mijn vraag vooraf op papier sturen? Naar welk adres? | `knelpunten/beginnen.md` stap 3 ("Stuur dat vóór het gesprek op") |

## In het gesprek

| # | Vraag | Steunt op |
|---|---|---|
| 4 | Welke hulp kunt u zelf geven, en voor welke hulp is een besluit van de gemeente nodig? | hulpsoorten (toegangslabels "vrij toegankelijk" / "toestemming gemeente nodig"); NJi, *De Jeugdwet en beslissen over hulp* (bron bij `02-toegang.md`) |
| 5 | Wat heeft u nog van mij nodig, zoals een verslag van school of van een behandelaar? | `02b-hulp-vragen.md` ("Verslagen van behandelaars of school die hetzelfde laten zien helpen daarbij") |
| 6 | Bij welke aanbieders kan mijn kind terecht, en mag ik kiezen? | `knelpunten/wachten.md` ("U mag kiezen uit de aanbieders waar de gemeente een contract mee heeft"); blok "Welke aanbieders kunt u kiezen?" per gemeente |
| 7 | Hoe lang is de wachttijd, en is er hulp in de tussentijd? | `knelpunten/wachten.md` stap 1 (overbruggingshulp) |
| 8 | Wilt u een pgb? Vraag dan: kan dat voor wat wij nodig hebben, en wat moet ik daarvoor doen? | `knelpunten/pgb.md` stap 2 ("Zeg in het gesprek dat u een pgb wilt, en waarom") |
| 9 | Kunnen we zelf een plan maken met mensen om ons heen (een familiegroepsplan)? | `02-toegang.md` ("De gemeente moet dat plan met u bespreken"); Jeugdwet (bron bij `beginnen.md`) |

## Aan het eind van het gesprek

| # | Vraag | Steunt op |
|---|---|---|
| 10 | Wat gebeurt er na dit gesprek, en wanneer hoor ik iets? | `02-toegang.md` (beschikking "in principe binnen acht weken"); `wachten.md` (Awb 4:13). De vraag noemt zelf geen termijn. |
| 11 | Krijg ik een verslag van dit gesprek? Mag ik dat aanvullen als er iets mist? | `02-toegang.md` (recht op verslag op papier), `02b-hulp-vragen.md` ("Geef dat door, dan kan het worden aangepast of aangevuld") — **zie twijfel A** |
| 12 | Krijg ik het besluit van de gemeente op papier? | `beginnen.md` stap 6 ("Vraag ook om het besluit van de gemeente op papier (de beschikking)") |
| 13 | Wie is mijn vaste contactpersoon, en hoe bereik ik die? | `knelpunten/spoed.md` en `vastgelopen.md` ("vraag om één vaste contactpersoon"); geen recht, alleen een verzoek |
| 14 | Wat kan ik doen als ik het niet eens ben met het besluit? | `landelijk/07-klacht-of-bezwaar.md` |

## Twijfels voor de beheerder

- **A. Vraag 11: "mag ik aanvullen".** De site zegt in `02b` dat het verslag "kan worden aangepast of aangevuld". Een harde wettelijke grondslag voor aanvullen van een gespreksverslag heb ik daar niet bij gezien (AVG art. 16 gaat over onjuiste gegevens). Als vraag is het veilig, maar de stelligheid in `02b` zelf verdient een check.
- **B. Lengte.** Veertien vragen is op papier ongeveer één A4. Liever korter? Voorstel bij inkorten: 3 en 9 eruit (de minst algemene), en 8 alleen als een pgb speelt.
- **C. Het dagboek in het Word-bestand gebruikt "betere / gemiddelde / zware dag".** Het drempelonderzoek raadt "slechte dagen / betere dagen" aan en waarschuwt juist voor "normale dag"; "gemiddelde dag" lijkt daar sterk op. Voor de nieuwe pagina stel ik "slechte dag / betere dag" voor, en dan zou ik het Word-bestand gelijk trekken (één gedeelde lijst met labels, zie hieronder).

## Hergebruik (om uit elkaar lopen te voorkomen)

| Onderdeel op de nieuwe pagina | Bron (één plek) | Hoe |
|---|---|---|
| Voorbeeldzinnen | `landelijk/02b-hulp-vragen.md`, kop "Vertel wat uw kind nodig heeft" | De pagina toont die sectie uit hetzelfde bestand; de build faalt als de kop verdwijnt. |
| "Wat er speelt / geprobeerd / bereiken" | Voorbeeldbrief `aanvraag-jeugdhulp.md` (de vetgedrukte kopjes) | Dezelfde kopjes als invulvakken, gelezen uit de brief. |
| Dagboek (soorten dagen) | Nieuwe gedeelde lijst, gebruikt door de pagina én `scripts/dagboek-docx.mjs` | Eén definitie van de labels; het Word-bestand wordt opnieuw gebouwd. |
| Wijkteam en cliëntondersteuner | Gemeentegegevens via `gemeente-blokken` (zoals Mijn overzicht) | Geen nieuwe gegevens. |
| Vragen | Deze lijst, na akkoord in één databestand | Alleen op deze pagina. |
| Afdrukken | `AfdrukKnop` / `AfdrukKop` | Bestaand. |

## Soort bron per vraag (19-10)

Wettekst zelf nagekeken op wetten.overheid.nl (Jeugdwet, versie 19-10-2026) waar "gezien" staat.

| # | Vraag (kort) | Soort bron | Bron |
|---|---|---|---|
| 1 | Iemand meenemen | wet + overheid | Wmo 2015 art. 2.2.4 en 1.1.1 (cliëntondersteuning, ook voor jeugdhulp; gezien in drempelonderzoek). De Jeugdwet zelf noemt cliëntondersteuning niet. |
| 2 | Vraag vooraf op papier sturen | praktijkadvies + belangenorganisatie | Drempelonderzoek: Contact (VK) en WRR "Weten is nog geen doen" (doenvermogen onder stress). Geen recht; het wijkteam kan nee zeggen. |
| 4 | Wat kunt u zelf, wat vraagt een besluit | wet + kennisinstituut | Jeugdwet art. 2.3 (individuele voorziening na oordeel college, gezien); NJi, *De Jeugdwet en beslissen over hulp*. |
| 5 | Wat heeft u nog van mij nodig | praktijkadvies + overheid | Drempelonderzoek: CIZ-beoordelingskader (kijkt naar het structurele beeld) en Contact (VK). |
| 6 | Bij welke aanbieders, mag ik kiezen | afgeleid, geen wettekst | Volgt uit de contracten van de gemeente (Jeugdwet art. 2.6 lid 1a: toereikend aanbod, gezien). "Kiezen uit gecontracteerde aanbieders" staat niet letterlijk in de wet. |
| 7 | Wachttijd en hulp in de tussentijd | afgeleid, geen wettekst | Jeugdwet art. 2.3 en 2.6 lid 1a (jeugdhulpplicht, toereikend aanbod; gezien). Overbruggingshulp is geen apart recht. |
| 8 | Pgb | wet + overheid + belangenorganisatie | Jeugdwet art. 8.1.1; Rijksoverheid (pgb-vaardigheid); Per Saldo. |
| 9 | Familiegroepsplan | wet | Jeugdwet art. 1.1 (definitie), 2.1 onder g (gemeente bevordert familiegroepsplannen) en 4.1.2 (de **aanbieder** biedt eerst de mogelijkheid; gezien). |
| 10 | Wat gebeurt er na het gesprek | wet + overheid | Awb art. 4:13 (beslistermijn); Regelhulp (VWS). |
| 11 | Verslag, aanvullen | **niet in de Jeugdwet** | Het verslag staat in de verordening jeugdhulp van de gemeente (VNG-model); niet zelf nagekeken. Aanvullen: geen grondslag gevonden. Als vraag akkoord (A). |
| 12 | Besluit op papier | wet | Awb art. 1:3 (een besluit is een schriftelijke beslissing); Regelhulp. |
| 13 | Vaste contactpersoon | praktijkadvies, geen bron | Staat als advies in `spoed.md` en `vastgelopen.md`, zonder bron. |
| 14 | Niet eens met het besluit | wet + kennisinstituut + ombudsman | Awb (bezwaar binnen zes weken); NJi, Jeugdstem, Nationale ombudsman (bronnen bij `07-klacht-of-bezwaar.md`). |

## Nieuwe twijfels uit deze check (bestaande pagina's)

- **D. `landelijk/02-toegang.md` zegt "U heeft dan recht op een verslag op papier".** Dat staat niet in de Jeugdwet; het hangt af van de verordening van de gemeente (de meeste volgen het VNG-model). Bron bij die pagina is alleen NJi. Voorstel: "In de meeste gemeenten krijgt u een verslag op papier; vraag erom."
- **E. Zelfde pagina: "De gemeente moet dat plan [familiegroepsplan] met u bespreken."** De Jeugdwet legt de plicht om eerst de mogelijkheid te bieden bij de jeugdhulpaanbieder (art. 4.1.2); de gemeente "bevordert" familiegroepsplannen (art. 2.1 g). Voorstel: zin nuanceren in die richting.

**Besluit 19-10:** D en E aangepast in `landelijk/02-toegang.md` zoals voorgesteld (bron Jeugdwet toegevoegd).

**Gebouwd 19-10:** vragen staan in `src/lib/gesprek.ts`, op het vel `/gesprek/` (`src/pages/gesprek.astro`). Dagboek en Word-bestand gebruiken nu "slechte dag / betere dag" (C).
