#!/usr/bin/env python3
"""Landelijk beeld uit de 342 gemeentepagina's (src/content/gemeenten/*.json): tellingen voor het onderdeel
"Hoe gaat het met de jeugdhulp in Nederland?" op /landelijk/. Schrijft docs/onderzoek/landelijk-beeld-cijfers.md.

Dit zijn eigen tellingen uit het onderzoek per gemeente, geen officiële cijfers. Thema's in de signalen worden herkend aan
trefwoorden (THEMAS hieronder): een gemeente telt mee als minstens één signaal (titel of samenvatting) een trefwoord noemt.
Dat is grof; controleer een steekproef voordat een getal op de site komt. Draaien: python3 scripts/landelijk-beeld.py
"""
import json, glob, re, statistics, collections as C, datetime, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
G = [json.load(open(f)) for f in sorted(glob.glob(str(ROOT / 'src/content/gemeenten/*.json')))]
N = len(G)

THEMAS = {
    'wachten': r'wacht(lijst|tijd|en op|ende)|wachttijd|wachtlijst',
    'geld': r'tekort|overschrijd|bezuinig|budget|kosten (stijg|lop)|meer uitgegeven|financi(ë|e)le druk',
    'specialistisch-of-geen-plek': r'geen (passende )?plek|specialistisch|crisisplek|gesloten jeugdhulp|verblijf',
    'toegang-anders': r'reorganis|nieuwe (toegang|werkwijze|inkoop)|aanbesteding|inkoop|lokale teams? (anders|nieuw)',
    'positief': r'tevreden|positief|rapportcijfer [78]|goed beoordeeld',
}
SOORTEN = ['gemeenteraad', 'clientervaringsonderzoek', 'nieuws', 'rekenkamer', 'inspectie', 'ombudsman', 'rechtspraak']

def tekst(s): return f"{s.get('titel','')} {s.get('samenvatting','')}".lower()

regels = []
w = regels.append
w(f'# Landelijk beeld: eigen tellingen uit {N} gemeentepagina\'s')
w(f'\nGemaakt met `scripts/landelijk-beeld.py` op {datetime.date.today().isoformat()}. Eigen tellingen, geen officiële cijfers.\n')

w('## Openheid')
t = lambda g, k: (g['ervaringen'].get('transparantie') or {}).get(k) or {}
ceo = sum(t(g, 'clientervaringsonderzoek').get('status') == 'ja' for g in G)
dl = sum(t(g, 'doorlooptijden').get('status') == 'ja' for g in G)
w(f'- Cliëntervaringsonderzoek gepubliceerd: {ceo} van {N}')
w(f'- Doorlooptijden of wachttijden gepubliceerd: {dl} van {N}')
ah = sorted(t(g, 'aandeelHuisarts')['percentage'] for g in G if t(g, 'aandeelHuisarts').get('percentage') is not None)
if ah:
    q = statistics.quantiles(ah, n=4)
    w(f'- Aandeel jeugdhulp via de huisarts (CBS 85097NED), bekend voor {len(ah)} gemeenten: laagste {ah[0]}%, hoogste {ah[-1]}%, mediaan {statistics.median(ah):.0f}%, middelste helft {q[0]:.0f}–{q[2]:.0f}%')

w('\n## Signalen')
soort = C.Counter(s.get('soort') for g in G for s in g['ervaringen'].get('signalen', []))
w('- Aantal signalen per soort: ' + ', '.join(f'{k} {soort[k]}' for k in SOORTEN))
for k in SOORTEN:
    n = sum(any(s.get('soort') == k for s in g['ervaringen'].get('signalen', [])) for g in G)
    w(f'  - gemeenten met minstens één signaal van soort {k}: {n}')
w('- Thema\'s (gemeenten met minstens één signaal dat het thema noemt; trefwoorden, grof):')
voorbeelden = {}
for th, re_ in THEMAS.items():
    hit = [g for g in G if any(re.search(re_, tekst(s)) for s in g['ervaringen'].get('signalen', []))]
    w(f'  - {th}: {len(hit)} van {N}')
    voorbeelden[th] = [g['naam'] for g in hit[:: max(1, len(hit) // 5)][:5]]

w('\n## Indeling van de signalen (docs/onderzoek/landelijk-beeld/indeling.json, regels in regels.md)')
ind = json.load(open(ROOT / 'docs/onderzoek/landelijk-beeld/indeling.json'))
w(f'- Ingedeeld: {len(ind)} gemeenten')
wa = C.Counter(o['wachten'] for o in ind)
w('- Wachten: ' + ', '.join(f'{k} {wa[k]}' for k in ['oplopend', 'wisselend', 'genoemd', 'dalend', 'niet genoemd']) + f' (oplopend of wisselend samen: {wa["oplopend"] + wa["wisselend"]})')
for k, t in [('geenPlek', 'geen passende plek of te weinig aanbod'), ('strengerToegang', 'toegang strenger (vastgesteld)'), ('nieuweToegangOfInkoop', 'nieuwe toegang of inkoop 2025–2027'), ('geldDruk', 'geldzorgen (onderschat: financiële signalen zijn bij de redactie weggehaald; niet op de site gebruiken)')]:
    w(f'- {t}: {sum(bool(o[k]) for o in ind)} van {len(ind)}')
ce = C.Counter(o['clientervaring'] for o in ind)
w(f'- Cliëntervaring (ouders en jongeren zelf gevraagd): positief {ce["positief"]}, gemengd {ce["gemengd"]}, negatief {ce["negatief"]}, geen onderzoek {ce["geen"]}')

w('\n## Toegang')
w(f'- Jeugdzorgregio\'s: {len(set(g["jeugdzorgregio"] for g in G))}')
naam = C.Counter()
for g in G:
    r = next(x for x in g['toegang']['routes'] if x['type'] == 'wijkteam')['naam'].lower()
    soort_ = ('sociaal team' if 'sociaal' in r or 'sociale' in r else 'jeugdteam of jeugd- en gezinsteam' if 'jeugd' in r else
              'cjg' if 'cjg' in r or 'centrum voor jeugd' in r else 'wijk-, gebieds- of dorpsteam' if re.search(r'wijk|gebied|dorp|buurt', r) else
              'loket of medewerkers van de gemeente' if re.search(r'loket|medewerker|gemeente|zorgloket|plein', r) else 'anders')
    naam[soort_] += 1
w('- Waar de ouder zich meldt (naam van het eerste team, ingedeeld): ' + ', '.join(f'{k} {v}' for k, v in naam.most_common()))
cjg = C.Counter(g['cjg'].get('soort') for g in G)
w(f'- Voor opvoedvragen: CJG {cjg["cjg"]}, wijkteam {cjg["wijkteam"]}, jeugdgezondheidszorg {cjg["jgz"]}')

w('\n## Steun en geld')
oco = C.Counter(re.split(r' [–(-]', g['rechten']['onafhankelijkeClientondersteuning'].get('naam', ''))[0] for g in G)
w(f'- Onafhankelijke cliëntondersteuning: bij alle {N} gevonden; meest genoemde organisaties: ' + ', '.join(f'{k} {v}' for k, v in oco.most_common(6)))
w(f'- Pgb mogelijk: {sum(bool(g["rechten"].get("pgb", {}).get("mogelijk")) for g in G)} van {N}')
gr = C.Counter(r['soort'] for g in G for r in g['geldregelingen'].get('regelingen', []))
ng = C.Counter(x for g in G for x in g['geldregelingen'].get('nietGevonden', []))
for k in ['meerkosten', 'zorgkosten', 'zorgverzekering', 'kinderopvang', 'mantelzorg', 'leerlingenvervoer', 'bijzondere-bijstand']:
    n = sum(any(r['soort'] == k for r in g['geldregelingen'].get('regelingen', [])) for g in G)
    w(f'  - geldregeling {k}: gevonden in {n} gemeenten, niet gevonden in {ng[k]}')
alg = sum(any(i.get('voorIedereen') for i in g['lokaleInitiatieven'] if not i.get('verbergen')) for g in G)
w(f'- Gemeenten met lokale steun voor alle gezinnen (lokaleInitiatieven.voorIedereen, niet verborgen): {alg} van {N}; zonder: {N - alg}')

w('\n## Steekproef (controleer deze gemeenten per thema)')
for th, v in voorbeelden.items(): w(f'- {th}: ' + ', '.join(v))

out = ROOT / 'docs/onderzoek/landelijk-beeld-cijfers.md'
out.write_text('\n'.join(regels) + '\n')
print(out.read_text())
