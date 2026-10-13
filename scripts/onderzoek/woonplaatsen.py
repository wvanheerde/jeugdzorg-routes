#!/usr/bin/env python3
"""Woonplaatsen per gemeente voor het zoekveld onder de gemeentekeuze (public/woonplaatsen.json).

Bron: export Gemeenten van het Register van Overheidsorganisaties (kolom "Bevat plaatsen").
Gebruik: python3 scripts/onderzoek/woonplaatsen.py [pad-naar-Gemeenten.csv]
Zonder pad wordt de export opgehaald van organisaties.overheid.nl.
"""
import csv, glob, io, json, sys, urllib.request

URL = 'https://organisaties.overheid.nl/export/Gemeenten.csv'
# Namen die ouders gebruiken maar die geen officiële woonplaats zijn.
ALIASSEN = {'Den Bosch': 's-hertogenbosch', 'Den Haag': 'den-haag'}

if len(sys.argv) > 1:
    tekst = open(sys.argv[1], encoding='utf-8').read()
else:
    req = urllib.request.Request(URL, headers={'User-Agent': 'Mozilla/5.0 (jeugdzorg-routes)'})
    tekst = urllib.request.urlopen(req, timeout=60).read().decode('utf-8')

rows = list(csv.reader(io.StringIO(tekst), delimiter=';'))
kop = rows[0]
i_plaatsen, i_einde = kop.index('Bevat plaatsen'), kop.index('Einddatum')
naam2slug = {json.load(open(f, encoding='utf-8'))['naam']: f.split('/')[-1][:-5] for f in glob.glob('src/content/gemeenten/*.json')}

paren = set()
for r in rows[1:]:
    if r[i_einde]:
        continue
    gemeente = r[0].replace('Gemeente ', '', 1)
    slug = naam2slug.get(gemeente)
    if not slug:
        sys.exit(f'Onbekende gemeente in export: {gemeente}')
    for plaats in (p.strip() for p in r[i_plaatsen].split(',')):
        if plaats and plaats != gemeente:
            paren.add((plaats, slug))
for plaats, slug in ALIASSEN.items():
    paren.add((plaats, slug))

# Compact: [woonplaats, slug]; de browser zoekt de gemeentenaam erbij uit de keuzelijst.
uit = sorted(paren, key=lambda p: (p[0].lstrip("'").lower(), p[1]))
json.dump(uit, open('public/woonplaatsen.json', 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
print(f'{len(uit)} woonplaatsen naar public/woonplaatsen.json')
