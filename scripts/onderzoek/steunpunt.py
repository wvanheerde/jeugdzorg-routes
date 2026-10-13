#!/usr/bin/env python3
"""Ouder- en jeugdsteunpunt passend onderwijs per plaats, uit ouderenjeugdsteunpuntenopdekaart.nl.

Gebruik: python3 scripts/onderzoek/steunpunt.py <plaats> [<plaats> ...]

De landelijke kaart koppelt elke school aan het steunpunt van haar samenwerkingsverband.
Dit script zoekt de scholen in de opgegeven plaatsen op en telt per steunpunt (PO/VO) hoeveel
scholen erbij horen. Geef alle grote kernen van de gemeente op: één gemeente kan onder
meer samenwerkingsverbanden vallen. Telefoon is vaak een 06-nummer; dat nemen we niet over.
"""
import json
import sys
import urllib.parse
import urllib.request
from collections import defaultdict

URL = ("https://www.ouderenjeugdsteunpuntenopdekaart.nl/wp-admin/admin-ajax.php"
       "?swp_form%5Bform_id%5D=1&s={q}&action=searchwp_live_search&swpengine=default&swpquery={q}&format=json")


def zoek(term):
    q = urllib.parse.quote(term)
    req = urllib.request.Request(URL.format(q=q), headers={"User-Agent": "Mozilla/5.0"})
    return json.load(urllib.request.urlopen(req, timeout=60))


def main(plaatsen):
    if not plaatsen:
        print(__doc__)
        sys.exit(1)
    punten = {}
    scholen = defaultdict(lambda: defaultdict(list))
    for plaats in plaatsen:
        for s in zoek(plaats):
            if s.get("post_type") != "school" or (s.get("plaats") or "").upper() != plaats.upper():
                continue
            soort = "/".join(s.get("tags") or []) or "?"
            for p in s.get("jeugdsteunpunten") or []:
                punten[p["ID"]] = p
                scholen[p["ID"]][soort].append(s["post_title"])
    if not punten:
        print("Geen scholen gevonden; controleer de plaatsnaam (zoals op de kaart, bv. 'KAMPEN').")
        return
    for pid, p in punten.items():
        tel = p.get("telefoon") or ""
        mobiel = tel.replace(" ", "").startswith("06")
        print(f"== {p['post_title']} ({'/'.join(p.get('tags') or [])})")
        print(f"   website: {p.get('website')}\n   e-mail: {p.get('email')}\n   formulier: {p.get('contactformulier')}")
        print(f"   telefoon: {tel}{'  (06-nummer: niet overnemen)' if mobiel else ''}")
        for soort, lijst in scholen[pid].items():
            print(f"   {soort}: {len(lijst)} scholen, bv. {', '.join(lijst[:3])}")
    print("\nDe zoekfunctie geeft hooguit 20 treffers per zoekterm; zoek bij twijfel ook op een schoolnaam.")


if __name__ == "__main__":
    main(sys.argv[1:])
