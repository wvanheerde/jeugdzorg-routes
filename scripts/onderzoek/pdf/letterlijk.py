"""Letterlijke strings uit TJ/Tj, tolerant gedecomprimeerd; spatie bij grote kerning. Werkt op pdf's waar elke letter een eigen string is."""
import re, sys, zlib
b = open(sys.argv[1], "rb").read()
uit = []
for m in re.finditer(rb"stream\r?\n(.*?)endstream", b, re.S):
    try:
        d = zlib.decompressobj().decompress(m.group(1))
    except Exception:
        continue
    if b"BT" not in d:
        continue
    for arr, enkel in re.findall(rb"\[((?:\\.|[^\]\\])*)\]\s*TJ|\(((?:\\.|[^)\\])*)\)\s*Tj", d, re.S):
        if arr:
            stukken = []
            for lit, k in re.findall(rb"\(((?:\\.|[^)\\])*)\)|(-?\d+\.?\d*)", arr):
                if lit: stukken.append(lit)
                elif k and float(k) < -200: stukken.append(b" ")
            s = b"".join(stukken)
        else:
            s = enkel
        s = re.sub(rb"\\([()\\])", rb"\1", s)
        uit.append(s.decode("latin1"))
    uit.append("\n")
print(re.sub(r"[ \t]+", " ", " ".join(uit)))
