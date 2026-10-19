# Samenvatting run 2026-10-18-klachtbrief

Twee nieuwe scenario's voor de klachtbrieven met keuzes (zie `run.md`).

| # | Persona | Uitkomst | Moet vinden | Stappen | Gemak | Vertrouwen |
|---|---|---|---|---|---|---|
| 17 | Mark, klacht aan de aanbieder (laptop) | gehaald | 4 / 4 | 19 (brief na 8) | 6 | 6 |
| 18 | Sanne, klacht bij het wijkteam (telefoon) | deels | 3 + 1 deels / 4 | 20 (op) | 3 | 5 |

**Werkt de keuze in de brief?** Ja, bij allebei.
- Mark kwam via "Wij wachten te lang" → "Een plek bij een aanbieder" → "Voorbeeldbrief klacht" binnen, met "wachten" al aan (`?klacht=wachten`). Hij zette er zelf "Slecht bereikbaar" en "Beloften worden niet nagekomen" bij en citeert de regels die in de brief kwamen.
- Sanne koos "Geen verslag of plan op papier" en "Van het kastje naar de muur". Ze vond de brief "winst", maar schrok van de invulvelden tussen haken.

**Problemen**
1. **Klachtbrief aan het wijkteam ontbreekt bij "Wij wachten te lang"** (Sanne, ernst 3). Ze koos "Wij wachten te lang" (zes weken niets gehoord), zag daar het klachtadres van De Toegang Emmen, maar bij de voorbeeldbrieven alleen de ingebrekestelling. Ze vond de brief pas via Menu → Landelijk → "Klacht of bezwaar". Voorstel: `klacht-toegangsteam` toevoegen aan `brieven` in `wachten.md` (route gemeente, met `?klacht=duurt-lang`), en een link naar de brief in het klachtblok onder "Hierbij handig".
2. **Adres niet ingevuld** (Sanne, ernst 3): de brief begint met "Aan: [naam organisatie] … [e-mailadres voor klachten, zie de gemeentepagina]", terwijl de site het klachtadres van Emmen kent. Voorstel: zoals het postadres bij de ingebrekestelling, het klachtadres van de gekozen gemeente in de brief zetten.
3. **Kopiëren mislukte** (Mark, ernst 2): in de testbrowser mag de site niet op het klembord schrijven; de melding zegt "selecteer de tekst", maar dan is niet duidelijk waar de brief begint en eindigt. Voorstel: bij een mislukte kopie de brief zelf selecteren, zodat Ctrl+C of "Kopiëren" meteen werkt.
4. **Waar de klacht aan de aanbieder heen moet** (Mark, ernst 2): dat staat op de site van de aanbieder; de site kent het niet. Verwarrend is dat "Klacht indienen" onder "Hierbij handig" over het wijkteam gaat (Lokalis). Voorstel: bij wachten op een aanbieder dat blok kopje "Klacht over het wijkteam" geven, of weglaten.
5. **Veel invulvelden** (Sanne, ernst 2): "[geen antwoord / pas na [aantal] weken antwoord]" is voor haar zwaar. Mogelijke vereenvoudiging: minder keuzes tussen haken per regel.

Sanne zat aan het maximum van 20 stappen, waarvan 8 keer scrollen op de telefoon; de omweg via Landelijk kostte ongeveer 8 stappen.
