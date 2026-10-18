#!/usr/bin/env python3
"""
Refresh the real RERA Karnataka sample used by /project-tracker/.

Source: RERA Karnataka public project records, via the open dataset
github.com/Vonter/karnataka-rera-projects (ODbL 1.0), which is built from the
official portal's public pages (rera.karnataka.gov.in). Jagaly is not affiliated
with RERA Karnataka or the dataset maintainer.

Usage:
  python3 scripts/fetch-rera.py                 # download dataset, rebuild sample
  python3 scripts/fetch-rera.py --n 60 --seed 2026
  python3 scripts/fetch-rera.py --verify 5      # also spot-check N records against the
                                                # official certificate pages (needs a network
                                                # that can reach rera.karnataka.gov.in; 2 s delay)

Outputs:
  src/data/rera-projects.json   (used by the site)
  data/rera/projects.csv        (same rows, flat; ODbL)
  --raw-dir/<...>               (raw dataset zip/csv + selected raw rows as JSON)

Rules: only fields present in the record are used. Extension months are computed
only as (current completion date − original completion date at registration).
No delay figures are invented.
"""
import argparse, csv, io, json, os, random, re, sys, time, urllib.request, zipfile
from datetime import date, datetime

DATASET_REPO = "Vonter/karnataka-rera-projects"
API_COMMITS = f"https://api.github.com/repos/{DATASET_REPO}/commits?path=data/rera-projects.csv.zip&per_page=1"
RAW_URL = "https://raw.githubusercontent.com/{repo}/{sha}/data/rera-projects.csv.zip"
CERT_URL = "https://rera.karnataka.gov.in/certificate?CER_NO={reg}"
PORTAL_SEARCH = "https://rera.karnataka.gov.in/viewAllProjects?language=en"
UA = "JagalyPrototype/1.0 (research; polite fetch)"

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def get(url, timeout=60):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.read()

def d(s):
    """Parse YYYY-MM-DD or DD-MM-YYYY or DD/MM/YYYY → date (or None)."""
    s = (s or "").strip()
    for fmt in ("%Y-%m-%d", "%d-%m-%Y", "%d/%m/%Y"):
        try: return datetime.strptime(s, fmt).date()
        except ValueError: pass
    return None

def rng(s):
    """'31-12-2020 - 30-06-2021' → (from, to)."""
    parts = [p.strip() for p in (s or "").split(" - ")]
    return (d(parts[0]), d(parts[1])) if len(parts) == 2 else (None, None)

def months_between(a, b):
    return (b.year - a.year) * 12 + (b.month - a.month) + (1 if b.day - a.day >= 15 else -1 if b.day - a.day <= -15 else 0)

def iso(x): return x.isoformat() if x else None

def to_int(s):
    try: return int(str(s).strip())
    except Exception: return None

def build_row(x, snapshot):
    original = d(x["proposed_completion_date"])            # completion date at registration
    current = d(x["project_completion_date"]) or original  # current proposed completion (after extensions)
    cov_from, cov_to = rng(x.get("covid_19_extension_date"))
    s6_from, s6_to = rng(x.get("section_6_extension_date"))
    extensions = []
    if cov_from and cov_to:
        extensions.append({"type": "COVID-19 general extension", "from": iso(cov_from), "to": iso(cov_to)})
    if s6_from and s6_to:
        extensions.append({"type": "Section 6 extension", "from": iso(s6_from), "to": iso(s6_to), "approved_on": iso(d(x.get("ext_approved_on")))})
    last_itemised = max([e for e in (cov_to, s6_to) if e], default=original)
    if current and last_itemised and current > last_itemised:
        extensions.append({"type": "Further extension (not itemised in dataset; see official record)", "from": iso(last_itemised), "to": iso(current)})
    ext_months = months_between(original, current) if original and current and current > original else 0
    m = re.search(r"(\d{2}/\d{2}/\d{4})", x.get("completion_applied_text") or "")
    completion_applied_on = iso(d(m.group(1))) if m else None
    if completion_applied_on:
        record_status = "Completion applied"
    elif current and current < snapshot:
        record_status = "Completion date passed, no completion application in record"
    else:
        record_status = "Within current completion date"
    return {
        "project_id": x["project_id"],
        "reg_number": x["reg_number"],
        "project_name": (x.get("project_name_full") or x["project_name"]).strip(),
        "promoter": (x.get("promoter_name_detail") or x["promoter_name"]).strip(),
        "district": x["district"], "taluk": x["taluk"], "pin_code": x.get("project_pin_code") or None,
        "project_type": x["project_type"],
        "registration_status": x["status"],
        "project_status_at_registration": x.get("project_status") or None,
        "registration_date": iso(d(x["registration_date"])),
        "original_completion_date": iso(original),
        "current_completion_date": iso(current),
        "extensions": extensions,
        "extension_months": ext_months,
        "completion_applied_on": completion_applied_on,
        "occupancy_certificate_received": {"true": True, "false": False}.get((x.get("comp_oc_received") or "").lower()),
        "complaints_on_project": to_int(x.get("complaints_against_project")),
        "record_status": record_status,
        "official_certificate_url": CERT_URL.format(reg=x["reg_number"]),
        "official_search_url": PORTAL_SEARCH,
    }

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--n", type=int, default=60)
    ap.add_argument("--seed", type=int, default=2026)
    ap.add_argument("--district", default="Bengaluru Urban")
    ap.add_argument("--type", default="Residential/Group Housing")
    ap.add_argument("--registered-from", default="2018-01-01")
    ap.add_argument("--registered-to", default="2024-12-31")
    ap.add_argument("--raw-dir", default=os.environ.get("RERA_RAW_DIR", "/workspace/realestate/rera"))
    ap.add_argument("--verify", type=int, default=0, help="spot-check N rows against official certificate pages")
    a = ap.parse_args()

    fetched_on = date.today()
    meta = json.loads(get(API_COMMITS))[0]
    sha, snap_iso = meta["sha"], meta["commit"]["committer"]["date"][:10]
    snapshot = d(snap_iso)
    src = RAW_URL.format(repo=DATASET_REPO, sha=sha)
    print(f"dataset commit {sha[:7]} ({snap_iso}) → {src}", file=sys.stderr)
    blob = get(src)
    os.makedirs(os.path.join(a.raw_dir, "source"), exist_ok=True)
    open(os.path.join(a.raw_dir, "source", "rera-projects.csv.zip"), "wb").write(blob)
    z = zipfile.ZipFile(io.BytesIO(blob))
    name = [n for n in z.namelist() if n.endswith(".csv")][0]
    csv.field_size_limit(10**9)
    rows = list(csv.DictReader(io.TextIOWrapper(z.open(name), encoding="utf-8")))

    lo, hi = d(a.registered_from), d(a.registered_to)
    pool = [x for x in rows if x["district"] == a.district and x["project_type"] == a.type and x["status"] == "APPROVED"
            and d(x["registration_date"]) and lo <= d(x["registration_date"]) <= hi and x["reg_number"]]
    pool.sort(key=lambda x: x["project_id"])
    pick = random.Random(a.seed).sample(pool, min(a.n, len(pool)))
    out = [build_row(x, snapshot) for x in pick]
    out.sort(key=lambda r: (-r["extension_months"], r["project_name"]))
    for r in out:
        r["source_url"] = src
        r["source_snapshot_date"] = snap_iso
        r["fetched_on"] = fetched_on.isoformat()

    verification = []
    if a.verify:
        for r in out[: a.verify]:
            time.sleep(2)
            try:
                html = get(r["official_certificate_url"], timeout=30).decode("utf-8", "ignore")
                text = re.sub(r"<[^>]+>", " ", html)
                ok_reg = r["reg_number"] in text
                rd = datetime.fromisoformat(r["registration_date"]).strftime("%d-%m-%Y")
                verification.append({"reg_number": r["reg_number"], "reg_number_found": ok_reg, "registration_date_found": rd in text})
            except Exception as e:
                verification.append({"reg_number": r["reg_number"], "error": str(e)[:200]})
        print(json.dumps(verification, indent=1), file=sys.stderr)

    site_json = os.path.join(ROOT, "src", "data", "rera-projects.json")
    if not verification and os.path.exists(site_json):
        try:  # keep earlier spot-check results for reg numbers still in the sample
            keep = {r["reg_number"] for r in out}
            verification = [v for v in json.load(open(site_json))["meta"].get("verification", []) if v.get("reg_number") in keep]
        except Exception:
            pass
    meta_out = {
        "source": "RERA Karnataka public project records via open dataset github.com/Vonter/karnataka-rera-projects (ODbL 1.0)",
        "dataset_commit": sha, "source_url": src, "source_snapshot_date": snap_iso, "fetched_on": fetched_on.isoformat(),
        "selection": f"Random sample (seed {a.seed}) of {len(out)} of {len(pool)} projects: district={a.district}, type={a.type}, registration status APPROVED, registered {a.registered_from}..{a.registered_to}",
        "method": {
            "original_completion_date": "Completion date at registration (proposed_completion_date in the listing)",
            "current_completion_date": "Current proposed completion date on the project detail page (project_completion_date)",
            "extension_months": "Whole months from original to current completion date; 0 if not later. Includes COVID-19 general extensions granted by the Authority, which were not project-specific.",
            "record_status": "'Completion applied' if the record shows a completion application date; else 'Completion date passed, no completion application in record' if the current completion date is before the dataset snapshot date; else 'Within current completion date'.",
            "not_available": "Quarterly progress reports are filed as documents and are not included as structured data; construction progress is therefore not shown.",
        },
        "license": "ODbL 1.0 (https://opendatacommons.org/licenses/odbl/1-0/). Some contents © Karnataka RERA.",
        "count": len(out), "verification": verification,
    }
    json.dump({"meta": meta_out, "projects": out}, open(site_json, "w"), indent=1, ensure_ascii=False)
    os.makedirs(os.path.join(ROOT, "data", "rera"), exist_ok=True)
    cols = ["reg_number", "project_name", "promoter", "district", "taluk", "pin_code", "project_type", "registration_status", "registration_date",
            "original_completion_date", "current_completion_date", "extension_months", "extensions", "completion_applied_on",
            "occupancy_certificate_received", "complaints_on_project", "record_status", "official_certificate_url", "source_url", "source_snapshot_date", "fetched_on"]
    for path in (os.path.join(ROOT, "data", "rera", "projects.csv"), os.path.join(a.raw_dir, "projects.csv")):
        with open(path, "w", newline="", encoding="utf-8") as f:
            w = csv.DictWriter(f, fieldnames=cols); w.writeheader()
            for r in out: w.writerow({k: (json.dumps(r[k], ensure_ascii=False) if k == "extensions" else r[k]) for k in cols})
    json.dump({"meta": meta_out, "projects": out}, open(os.path.join(a.raw_dir, "projects.json"), "w"), indent=1, ensure_ascii=False)
    json.dump(pick, open(os.path.join(a.raw_dir, "raw-selected-rows.json"), "w"), indent=1, ensure_ascii=False)
    print(f"wrote {len(out)} projects (pool {len(pool)}) → {site_json}", file=sys.stderr)

if __name__ == "__main__":
    main()
