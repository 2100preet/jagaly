"""Convert BBMP / KSRSAC flood KMLs (OpenCity, public domain) into a compact JSON for the site.
Source: https://data.opencity.in/dataset/flooding-locations-in-bengaluru-urban  (licence: Other (Public Domain))
Run: python3 scripts/build-flood.py"""
import json, re, os, xml.etree.ElementTree as ET
D = os.path.join(os.path.dirname(__file__), '..', 'data', 'flood')
NS = {'k': 'http://www.opengis.net/kml/2.2'}
FILES = [('vulnerable.kml', 'v'), ('flood-prone.kml', 'f'), ('low-lying.kml', 'l')]
pts = []
for fn, t in FILES:
    root = ET.parse(os.path.join(D, fn)).getroot()
    for pm in root.iter('{http://www.opengis.net/kml/2.2}Placemark'):
        c = pm.find('.//k:Point/k:coordinates', NS)
        if c is None: continue
        lng, lat = [float(x) for x in c.text.strip().split(',')[:2]]
        if lat != lat or lng != lng or not (12.6 < lat < 13.4 and 77.3 < lng < 77.9): continue  # skip NaN / out-of-area coordinates
        data = {sd.get('name'): (sd.text or '').strip() for sd in pm.iter('{http://www.opengis.net/kml/2.2}SimpleData')}
        name = data.get('LocationName') or data.get('Name') or data.get('NAME') or (pm.findtext('k:name', '', NS) or '').strip()
        if not name:
            name = next((v for k, v in data.items() if k.lower() in ('location', 'loc_name', 'place', 'area', 'locality')), '')
        ward = data.get('WARD_NAME') or data.get('Ward_Name') or data.get('WARD') or ''
        name = re.sub(r'\s+', ' ', name).strip()[:80]
        pts.append([round(lat, 5), round(lng, 5), t, name, ward.strip()[:40]])
out = os.path.join(os.path.dirname(__file__), '..', 'src', 'data', 'flood-points.json')
json.dump({'source': 'BBMP / KSRSAC via OpenCity (data.opencity.in), public domain; dataset last updated 27 Nov 2025; fetched 18 Oct 2026',
           'types': {'v': 'Vulnerable to flooding (BBMP)', 'f': 'Flood-prone location (BBMP)', 'l': 'Low-lying area (BBMP)'},
           'points': pts}, open(out, 'w'), ensure_ascii=False, separators=(',', ':'), allow_nan=False)
print(len(pts), 'points', {t: sum(1 for p in pts if p[2] == t) for _, t in FILES}, os.path.getsize(out), 'bytes')
print([p for p in pts if p[2] == 'f'][:3]); print([p for p in pts if p[2] == 'l'][:3])
