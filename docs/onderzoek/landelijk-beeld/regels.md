# Regels voor de indeling van de signalen (landelijk beeld)

Vastgesteld 23-10-2026 na de eerste indeling door vijf agents, om hun keuzes gelijk te trekken. Gebruik deze regels bij elke nieuwe indeling (zie skill `gemeenten-onderzoeken`, "Afronden"). Bron is alleen `src/content/gemeenten/<slug>.json` (`ervaringen.samenvatting`, `ervaringen.signalen`, `ervaringen.transparantie`). Bij twijfel de voorzichtige waarde, met een `twijfel`-zin.

**wachten** (alleen jeugdhulp; Veilig Thuis, jeugdbescherming, maatschappelijk werk en Wmo tellen niet)
- `oplopend`: wachtlijst of wachttijd groeit, of de wachttijd is maanden (drie maanden of meer).
- `genoemd`: er is een wachtlijst of wachttijd, maar zonder lengte of groei, of in weken zonder groei.
- `dalend`: wachtlijst kleiner of weggewerkt (ook als die eerst opliep).
- `wisselend`: beide richtingen, of per soort hulp anders (bv. korter voor lichte hulp, maanden voor specialistische).
- `niet genoemd`.

**geenPlek**: een signaal zegt dat kinderen geen passende (specialistische) plek of hulp vinden, of dat aanbieders van jeugdhulp te weinig plek of personeel hebben. Onderbezetting van het eigen toegangsteam telt niet (dat zit in wachten). Beleidstaal over "specialistische hulp" zonder tekort telt niet; personeelstekort buiten de jeugdhulp (onderwijs, JGZ) telt niet.

**geldDruk**: de jeugdhulp kost meer dan begroot, een tekort, een overschrijding of een bezuiniging op jeugdhulp. Financiële problemen van één aanbieder en een pgb-budgetplan tellen niet.

**strengerToegang**: vastgestelde maatregelen om minder, kortere of lichtere hulp in te zetten (kritischer toetsen, normeren, eerst eigen netwerk of groepsaanbod, minder automatische verlenging, strengere verordening). Voorstellen die nog niet zijn vastgesteld, visies en alleen preventie (zoals een praktijkondersteuner jeugd bij de huisarts) tellen niet.

**nieuweToegangOfInkoop**: de toegang wordt opnieuw ingericht of de hulp opnieuw ingekocht, besloten of gestart, met ingang in 2025, 2026 of 2027. Ingang in 2028 of later, plannen zonder datum, losse proeven en "onderzoeken" tellen niet. Een nieuwe regionale inkooporganisatie telt alleen als de nieuwe contracten in 2025–2027 ingaan.

**clientervaring**: alleen wat ouders en jongeren zelf over de hulp zeggen, uit een cliëntervaringsonderzoek dat in `transparantie.clientervaringsonderzoek` op `ja` staat, of uit een rapport van rekenkamer of ombudsman dat ouders of jongeren heeft gevraagd. Kleine of eigen metingen die het bestand "niet representatief" noemt, inspecties over jeugdbescherming of Veilig Thuis, en oordelen van een rekenkamer over de werkwijze van de gemeente tellen niet (`geen`). `positief`, `gemengd` (duidelijk positief én duidelijk kritisch) of `negatief`.

**bewijs**: letterlijke titel van het signaal; bij twee titels gescheiden door "; ". Alleen bij `clientervaring` mag het verwijzen naar `transparantie` als er geen signaal is.
