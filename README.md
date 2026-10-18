# Pakka — Bangalore real estate platform prototype

**Live demo:** https://2100preet.github.io/pakka-realestate/

A clickable prototype of a Bangalore property platform: locality typeahead search with map, property pages with a "truth score", an owner posting wizard, a RERA project tracker (real RERA Karnataka public records, see below) and draft pricing.

Highlights:
- **Pakka Proof (tiered, owner-friendly):** Tier 1 to list = phone OTP + live in-app video with GPS (no sale deed). Tier 2 optional "Verified Owner" = tax receipt or electricity bill with an in-app blur tool, kept private. Tier 3 = document check at deal stage only (partner lawyers for sales).
- **Deposit Safe (optional):** owners opt in for a badge, higher ranking, a free agreement, AI move-in/move-out video comparison and an optional deposit-free plan. It's never required.
- **Verified Tenant (optional):** mock DigiLocker / Aadhaar offline e-KYC flow via a licensed partner. Aadhaar numbers are never stored.
- **Pakka NRI (planned):** video visits across time zones, remote buying, PoA guidance, property management.
- **Locality typeahead:** ~95 Bangalore localities with approximate coordinates and aliases ("BTM", "E City", "ORR").

> ⚠️ **Sample data only.** All listings, prices, scores, builders, projects, RERA numbers and people are fictional/illustrative and don't refer to real builders or RERA records. Locality coordinates are approximate. Nothing here is a real offer, valuation or legal advice. Forms only save to your browser's localStorage — there is no backend.

**Stack:** Next.js 15 (App Router) + TypeScript 5 + Tailwind 3, static export (`output: 'export'`), Leaflet + OpenStreetMap.

## Run locally

```bash
npm install
npm run dev            # http://localhost:3000
npm run build          # static site -> ./out
npx serve out -l 3001  # serve the static output
```

Note: needs TypeScript 5.x (Next 15 does not load TypeScript 7).

## Deploy

The live site is served by GitHub Pages from the `gh-pages` branch (the static export built with `NEXT_PUBLIC_BASE_PATH=/pakka-realestate` so it works under the project path; locally the base path is empty):

```bash
NEXT_PUBLIC_BASE_PATH=/pakka-realestate npm run build
touch out/.nojekyll
# then publish ./out to the gh-pages branch
```

A ready-made GitHub Actions workflow is in `ci/deploy.yml`. To switch to automatic deploys on every push, move it to `.github/workflows/deploy.yml` (pushing it needs a token with the `workflow` scope) and set Pages → Source to "GitHub Actions".

## RERA project tracker data

`/project-tracker/` shows a random sample of 60 Bengaluru Urban residential projects from **RERA Karnataka public records**, via the open dataset [Vonter/karnataka-rera-projects](https://github.com/Vonter/karnataka-rera-projects) (ODbL 1.0; some contents © Karnataka RERA), which is built from [rera.karnataka.gov.in](https://rera.karnataka.gov.in/viewAllProjects?language=en). Pakka is not affiliated with RERA Karnataka. Each row links to the project's official registration certificate.

- Refresh: `python3 scripts/fetch-rera.py` (stdlib only). This writes `src/data/rera-projects.json` and `data/rera/projects.csv`.
- Extension months = current completion date minus original completion date at registration, taken straight from the record. Nothing is estimated, and promoters are not graded.
- The derived sample in `data/rera/` is published under ODbL 1.0 (share-alike), with attribution as above.

## Where things live

- Brand & feature names: `src/config/brand.ts`
- Sample data: `src/data/listings.ts` (30 listings), `src/data/geo.ts` (localities, aliases, approximate coordinates), `src/data/projects.ts` (fictional projects)
- Routes: `/`, `/search/`, `/property/[id]/`, `/post/`, `/deposit-safe/`, `/verified-tenant/`, `/nri/`, `/project-tracker/`, `/pricing/`, `/about/`, `/legal/`
