#!/usr/bin/env python3
"""Zoek in het raadsinformatiesysteem van een gemeente, zonder browser.

Gebruik:
  python3 scripts/onderzoek/raadsinfo.py ibabs <subdomein> "<zoekterm>" [pagina]
      iBabs: https://<subdomein>.bestuurlijkeinformatie.nl (bv. westland, hilversum)
  python3 scripts/onderzoek/raadsinfo.py parlaeus <host> "<zoekterm>" [vanaf JJJJ-MM-DD]
      Parlaeus: bv. besluitvorming.purmerend.nl
  python3 scripts/onderzoek/raadsinfo.py notubiz <organisatie> "<zoekterm>" [vanaf JJJJ-MM-DD]
      Notubiz: organisatie-id of naam (bv. 544 of "Haarlem"); zoekt in titels van agendapunten en documenten.
      Eerste keer per gemeente traag (alle vergaderingen sinds 'vanaf'); daarna uit de cache.

Uitvoer: per resultaat datum, titel en downloadlink. Pdf's lezen: scripts/onderzoek/pdftekst.py.
Sites met een bot-controle (rekenpuzzel, Cloudflare-challenge) omzeilen we niet.
"""
import datetime, html, json, os, re, ssl, subprocess, sys, tempfile, time, urllib.parse, urllib.request

UA = "Mozilla/5.0 (X11; Linux x86_64) Chrome/120"
VANDAAG = datetime.date.today().isoformat()

def get(url, data=None, headers=None, verify=True, verplicht=True):
    req = urllib.request.Request(url, data=data, headers={"User-Agent": UA, **(headers or {})})
    ctx = None if verify else ssl._create_unverified_context()
    for poging in range(3):
        try:
            with urllib.request.urlopen(req, timeout=60, context=ctx) as r:
                return r.read().decode("utf-8", "replace")
        except Exception as e:
            fout = e
            if getattr(e, "code", None) in (401, 403, 404):
                break
            time.sleep(1)
    if not verplicht:
        return None
    raise SystemExit(f"Ophalen mislukt: {url} ({fout})")

def ibabs(sub, term, pagina="1"):
    url = f"https://{sub}.bestuurlijkeinformatie.nl/Search?q={urllib.parse.quote_plus(term)}&page={pagina}"
    s = get(url)
    totaal = re.search(r"van\s+(\d[\d.]*)\s+resultaten", s)
    print(f"{totaal.group(1) if totaal else '?'} resultaten (pagina {pagina})")
    for blok in s.split('<div class="panel" aria-live="off">')[1:]:
        a = re.search(r'<a href="([^"]+)"[^>]*>(.*?)</a>', blok, re.S)
        if not a:
            continue
        titel = re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", a.group(2)))).strip()
        link = html.unescape(a.group(1))
        if link.startswith("/"):
            link = f"https://{sub}.bestuurlijkeinformatie.nl{link}"
        tekst = re.search(r'<div class="col-12 text">(.*?)</div>', blok, re.S)
        fragment = re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", tekst.group(1)))).strip() if tekst else ""
        print(f"- {titel}\n  {link}\n  {fragment[:220]}")

def parlaeus(host, term, vanaf="2025-01-01"):
    body = {"text": term, "where": "", "categories": [], "commissions": [], "modules": [],
            "dates": {"from": vanaf, "until": VANDAAG}, "documentTypes": [], "locations": [],
            "casecode": "", "media": False, "party": [], "person": [], "onlyTitle": False, "secties": ""}
    s = get(f"https://{host}/vji/public/search/action=doSearch", data=json.dumps(body).encode(),
            headers={"Content-Type": "application/json", "Accept": "application/json"}, verify=False)
    try:
        rijen = json.loads(s)
    except ValueError:
        raise SystemExit(s[:500])
    if isinstance(rijen, dict):  # bij precies één treffer geeft de API een los object
        rijen = [rijen]
    print(f"{len(rijen)} resultaten")
    for r in rijen[:40]:
        if str(r.get("url", "")).startswith("/"):
            r["url"] = f"https://{host}{r['url']}"
        print("- " + " | ".join(str(r[k]) if k == "url" else str(r[k])[:200] for k in ("date", "title", "name", "type", "url") if r.get(k)))

def notubiz_id(org):
    if org.isdigit():
        return org
    s = get("https://api.notubiz.nl/organisations")
    for oid, naam in re.findall(r'<organisation id="(\d+)".*?<name><!\[CDATA\[(.*?)\]\]>', s, re.S):
        if naam.strip().lower() in (org.lower(), f"gemeente {org.lower()}"):
            return oid
    raise SystemExit(f"Notubiz-organisatie niet gevonden: {org}")

def notubiz(org, term, vanaf="2025-01-01"):
    oid = notubiz_id(org)
    cache = os.path.join(tempfile.gettempdir(), f"notubiz-{oid}-{vanaf}.json")
    if os.path.exists(cache) and time.time() - os.path.getmtime(cache) < 86400:
        items = json.load(open(cache))
    else:
        items, overgeslagen = [], 0
        d = datetime.date.fromisoformat(vanaf)
        while d <= datetime.date.today():
            n = (d.replace(day=28) + datetime.timedelta(days=4)).replace(day=1)
            ev = json.loads(get(f"https://api.notubiz.nl/events?organisation_id={oid}&version=1.10.8"
                                f"&date_from={d}%2000:00:00&date_to={n}%2000:00:00&format=json"))
            for e in ev.get("events", []):
                if e.get("canceled"):
                    continue
                ruw = get(f"https://api.notubiz.nl/events/meetings/{e['id']}?version=1.10.8&format=json", verplicht=False)
                if ruw is None:
                    overgeslagen += 1
                    continue
                m = json.loads(ruw)["meeting"]
                datum = (m.get("plannings") or [{}])[0].get("start_date", "")[:10]
                def walk(punten):
                    for p in punten:
                        titel = " ".join(str(a.get("value", "")) for a in p.get("type_data", {}).get("attributes", []) if a.get("id") == 1)
                        for doc in p.get("documents", []):
                            items.append({"datum": datum, "punt": titel, "titel": doc.get("title"), "url": doc.get("url")})
                        walk(p.get("agenda_items", []))
                walk(m.get("agenda_items", []))
                for doc in m.get("documents", []):
                    items.append({"datum": datum, "punt": "", "titel": doc.get("title"), "url": doc.get("url")})
            print(f"{d}: {len(items)} documenten", file=sys.stderr)
            d = n
        if overgeslagen:
            print(f"{overgeslagen} vergadering(en) niet openbaar (401/403/404), overgeslagen", file=sys.stderr)
        json.dump(items, open(cache, "w"))
    woorden = term.lower().split()
    hits = [i for i in items if all(w in f"{i['punt']} {i['titel']}".lower() for w in woorden)]
    print(f"{len(hits)} van {len(items)} documenten (organisatie {oid})")
    for i in sorted(hits, key=lambda x: x["datum"], reverse=True)[:40]:
        print(f"- {i['datum']} | {i['titel']} | {i['punt'][:80]}\n  {i['url']}")

if __name__ == "__main__":
    if len(sys.argv) < 4 or sys.argv[1] not in ("ibabs", "parlaeus", "notubiz"):
        sys.exit(__doc__)
    {"ibabs": ibabs, "parlaeus": parlaeus, "notubiz": notubiz}[sys.argv[1]](*sys.argv[2:])
