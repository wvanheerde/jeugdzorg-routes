#!/usr/bin/env python3
"""Regionale gegevens per jeugdregio en GGD-regio (scripts/data/regios.json).

Spoed staat hier bewust niet in: de site toont bij spoed alleen vaste landelijke nummers (CONTENT.md).

Gebruik:
  python3 scripts/onderzoek/regio.py <slug>       toon alles wat bekend is voor een gemeente
  python3 scripts/onderzoek/regio.py opbouwen     indeling opnieuw ophalen bij CBS (Gebieden in Nederland);
                                                  ingevulde contactgegevens blijven bewaard

De indeling (welke gemeente in welke regio) komt van CBS. De contactblokken vult de hoofdagent aan
na controle op de eigen website van de instantie; onderzoekers lezen ze en stellen aanvullingen voor.
"""
import json, sys, urllib.request, glob, os

PAD = 'scripts/data/regios.json'
TABEL = '86247NED'  # Gebieden in Nederland 2026
SOORTEN = {  # sleutel in regios.json -> (code-kolom, naam-kolom)
    'jeugdregios': ('Code_18', 'Naam_19'),
    'ggdRegios': ('Code_16', 'Naam_17'),
}
# Velden die per soort regio worden bijgehouden (null = nog niet ingevuld)
VELDEN = {
    'jeugdregios': ['inkoop', 'beschikbaarheidswijzer'],
    'ggdRegios': ['jeugdgezondheidszorg'],
}


def laden():
    if os.path.exists(PAD):
        return json.load(open(PAD))
    return {}


def opbouwen():
    oud = laden()
    url = f'https://opendata.cbs.nl/ODataApi/odata/{TABEL}/TypedDataSet?$format=json'
    rijen = json.load(urllib.request.urlopen(url, timeout=120))['value']
    slugs = {}
    for f in glob.glob('src/content/gemeenten/*.json'):
        d = json.load(open(f))
        slugs[d['cbsCode']] = os.path.basename(f)[:-5]
    data = {
        'toelichting': 'Indeling: CBS ' + TABEL + ' (Gebieden in Nederland 2026). Contactblokken alleen na controle op de eigen website van de instantie; elk blok heeft een bron met datum. Bijwerken: python3 scripts/onderzoek/regio.py opbouwen.',
        'gemeenten': {},
    }
    for soort in SOORTEN:
        data[soort] = {}
    for r in rijen:
        code = r['RegioS'].strip()
        if code not in slugs:
            continue
        g = {'cbsCode': code}
        for soort, (ck, nk) in SOORTEN.items():
            rc, rn = (r[ck] or '').strip(), (r[nk] or '').strip()
            g[soort[:-1]] = rc
            regio = data[soort].setdefault(rc, {'naam': rn, 'gemeenten': []})
            regio['gemeenten'].append(slugs[code])
        data['gemeenten'][slugs[code]] = g
    # ingevulde velden uit de oude versie bewaren
    for soort, velden in VELDEN.items():
        for rc, regio in data[soort].items():
            regio['gemeenten'].sort()
            vorig = oud.get(soort, {}).get(rc, {})
            for v in velden + ['bronnen', 'opmerking']:
                if v in vorig:
                    regio[v] = vorig[v]
                elif v in velden:
                    regio[v] = None
    data['gemeenten'] = dict(sorted(data['gemeenten'].items()))
    ontbreekt = sorted(set(slugs.values()) - set(data['gemeenten']))
    json.dump(data, open(PAD, 'w'), ensure_ascii=False, indent=2)
    open(PAD, 'a').write('\n')
    print(f'{len(data["gemeenten"])} gemeenten, ' + ', '.join(f'{len(data[s])} {s}' for s in SOORTEN))
    if ontbreekt:
        print('niet in CBS-tabel:', ', '.join(ontbreekt))


def tonen(slug):
    data = laden()
    g = data.get('gemeenten', {}).get(slug)
    if not g:
        sys.exit(f'onbekende slug: {slug} (draai eerst: regio.py opbouwen)')
    for soort in SOORTEN:
        rc = g[soort[:-1]]
        regio = data[soort][rc]
        print(f'== {soort[:-1]} {rc}: {regio["naam"]} ({len(regio["gemeenten"])} gemeenten)')
        for v in VELDEN[soort]:
            waarde = regio.get(v)
            print(f'  {v}: ' + (json.dumps(waarde, ensure_ascii=False) if waarde else 'nog niet ingevuld'))
        for b in regio.get('bronnen', []):
            print(f'  bron: {b["titel"]} {b["url"]} ({b["geraadpleegd"]})')
        if regio.get('opmerking'):
            print(f'  opmerking: {regio["opmerking"]}')


if __name__ == '__main__':
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    opbouwen() if sys.argv[1] == 'opbouwen' else tonen(sys.argv[1])
