#!/usr/bin/env python3
"""Vergelijk getallen en URL's in de publieke tekst van gemeentebestanden voor en na een redactieronde.

Gebruik: python3 scripts/onderzoek/feitencheck.py <map-met-kopieen-van-voor> <slug> [<slug> ...]
Toont per gemeente wat NIEUW is (mag niet: een redacteur voegt geen feiten toe) en wat weg is
(verwacht bij verwijderde financiële signalen; anders nakijken). meta.* wordt overgeslagen.
"""
import json,re,sys
def walk(o,pad=""):
    if isinstance(o,dict):
        for k,v in o.items(): yield from walk(v,pad+"."+k)
    elif isinstance(o,list):
        for i,v in enumerate(o): yield from walk(v,pad+f"[{i}]")
    elif isinstance(o,str): yield pad,o
def feiten(j):
    s=set()
    for p,t in walk(j):
        if p.startswith(".meta"): continue
        for u in re.findall(r"https?://\S+",t): s.add(("url",u))
        t2=re.sub(r"https?://\S+","",t)
        for n in re.findall(r"\d[\d.,]*\d|\d",t2): s.add(("getal",n.rstrip(".,")))
    return s
for slug in sys.argv[2:]:
    a=json.load(open(f"{sys.argv[1]}/{slug}.json")); b=json.load(open(f"src/content/gemeenten/{slug}.json"))
    fa,fb=feiten(a),feiten(b)
    nieuw=sorted(fb-fa); weg=sorted(fa-fb)
    print(f"== {slug}: nieuw {len(nieuw)}, weg {len(weg)}")
    if nieuw: print("  NIEUW:",nieuw)
    if weg: print("  weg:",weg[:40])
