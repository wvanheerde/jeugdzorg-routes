#!/usr/bin/env python3
"""Haal leesbare tekst uit een pdf, zonder pdftotext of pip-pakketten.

Gebruik: python3 scripts/onderzoek/pdftekst.py bestand.pdf [--alle]

Probeert zes extractors (scripts/onderzoek/pdf/) en drukt de uitkomst af met de
meeste leesbare woorden. Met --alle toont het per extractor hoeveel woorden die vond.
Versleutelde pdf's (AES-256, leeg wachtwoord) worden eerst ontsleuteld met ontsleutel.mjs.
Pdf's die alleen uit scans bestaan, leveren geen tekst op: noteer dat als open punt.
"""
import os, re, subprocess, sys, tempfile

MAP = os.path.join(os.path.dirname(os.path.abspath(__file__)), "pdf")
EXTRACTORS = [
    ("tounicode", ["tounicode.py"]),   # subset-fonts met ToUnicode-tabellen
    ("objstm", ["objstm.py"]),         # object-streams en hex-codes (iBabs)
    ("regels", ["regels.py"]),         # Identity-H-fonts, regels op y-positie
    ("ruw", ["ruw.py", "9000000"]),    # eenvoudige Tj/TJ-strings
    ("letterlijk", ["letterlijk.py"]), # één string per letter, kerning als spatie
    ("glyph", ["glyph.py"]),           # glyph-nummers zonder ToUnicode (Microsoft Print To PDF)
]

GEWONE_WOORDEN = set("de het een van en in is op te voor met dat die niet zijn wordt worden ook aan bij of als door naar om er dan nog wel kan hun over deze jeugd jeugdhulp gemeente".split())

def herstel(t):
    """Verwijder nul-bytes en plak losse letters aan elkaar ('C o m m i s s i e' -> 'Commissie')."""
    t = t.replace("\x00", "")  # tekens van twee bytes zonder font-tabel
    t = t.replace("ĳ", "ij").replace("Ĳ", "IJ").replace("ﬁ", "fi").replace("ﬂ", "fl")  # ligaturen, anders vindt grep "wachtlijst" niets
    regels = []
    for regel in t.splitlines():
        tokens = regel.split(" ")
        if len(tokens) > 3 and sum(len(x) == 1 for x in tokens) / len(tokens) > 0.7:
            regel = re.sub(r"(?<=\S) (?=\S)", "", regel)
        regels.append(regel)
    return "\n".join(regels)

PDF_CODES = re.compile(r"(?m)(?:\b(?:BT|ET|EMC|BDC|Tm|Tj|TJ|Tc|Tw|Tf|scn|gs)\s*$|\]TJ|/MCID)")

def woorden(t):
    """Aantal gewone Nederlandse woorden, min pdf-opmaakcodes (ruwe content-streams verliezen zo)."""
    gewoon = sum(1 for w in re.findall(r"[a-zà-ÿ]+", t.lower()) if w in GEWONE_WOORDEN)
    return gewoon - 2 * len(PDF_CODES.findall(t))

def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    if not args:
        sys.exit(__doc__)
    pad = args[0]
    with open(pad, "rb") as f:
        inhoud = f.read()
    if b"/Encrypt" in inhoud:
        tmp = tempfile.NamedTemporaryFile(suffix=".pdf", delete=False).name
        subprocess.run(["node", os.path.join(MAP, "ontsleutel.mjs"), pad, tmp], capture_output=True)
        pad = tmp
    resultaten = []
    for naam, cmd in EXTRACTORS:
        try:
            r = subprocess.run([sys.executable, os.path.join(MAP, cmd[0]), pad, *cmd[1:]],
                               capture_output=True, timeout=180)
            tekst = herstel(r.stdout.decode("utf-8", "replace"))
        except Exception:
            tekst = ""
        resultaten.append((woorden(tekst), naam, tekst))
    resultaten.sort(reverse=True)
    if "--alle" in sys.argv:
        for n, naam, _ in resultaten:
            print(f"{naam}: {n} woorden", file=sys.stderr)
    beste = resultaten[0]
    if beste[0] < 20:
        letters = max((len(re.findall(r"[a-zA-Z]", r[2])) for r in resultaten), default=0)
        if letters > 2000:
            print("Weinig losse woorden maar wel veel letters: waarschijnlijk tekst zonder spaties "
                  "of met vreemde codering, geen scan. Bekijk de uitvoer met --alle.", file=sys.stderr)
        else:
            print("Weinig of geen tekst gevonden; mogelijk een gescande pdf.", file=sys.stderr)
    sys.stdout.write(beste[2])

if __name__ == "__main__":
    main()
