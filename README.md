# IODarkWatch

A maritime-surveillance concept demo for the Indian Ocean.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## What this is

IODarkWatch is a **demo/portfolio project**, not an operational surveillance system. The dashboard runs entirely
on simulated data — there's no live AIS feed, no live satellite pipeline, and no deployment with any maritime
authority. What it shows is a domain model for maritime dark-vessel detection and a dashboard built around it.

Read [`docs/CASE-STUDY.md`](docs/CASE-STUDY.md) for the full write-up, or `/about` on the running app for the
short version.

## The domain model

Three distinct signals, deliberately kept separate rather than lumped under one "suspicious" flag — see
[`CONTEXT.md`](CONTEXT.md) and [`docs/adr/0001-dark-vessel-terminology.md`](docs/adr/0001-dark-vessel-terminology.md)
for why.

| Term | Meaning | Needs satellite data? |
|---|---|---|
| **Dark Vessel** | Satellite detection with no matching AIS broadcast | Yes |
| **AIS Gap** | A vessel's own transponder has gone silent for 12+ hours | No |
| **Spoofing Signature** | A vessel's own AIS speed/position readings are inconsistent | No |

## What's simulated vs. what's real

| Piece | Status |
|---|---|
| Dashboard, alert list, weekly-brief page | Working, but fed entirely by simulated data ([`app/lib/vessels.ts`](app/lib/vessels.ts)) |
| `GET /api/vessels`, `/api/alerts`, `/api/summary` | Real endpoints, simulated data |
| SAR fetch + YOLOv8 vessel detector (`ml_pipeline/`, `sar_fetcher/`) | Real pipeline, real Sentinel-1 data, but trained on only 25 images — `mAP50: 0.0` in its own deployment config. Not wired into the dashboard. |
| AIS ingest, Postgres/PostGIS, correlator, email mailer | Not built |
| Map view on the dashboard | Placeholder — no real map library wired in currently |

## If this were built for real

The pipeline below is the design a production version would need, not a roadmap this repo is executing:

```
AIS feed ──┐
           ├─▶ Correlator ──▶ Dark Vessel alerts ──▶ Dashboard / API / weekly brief
Satellite ─┘        ▲
                     │
              AIS Gap / Spoofing Signature
              (computed from AIS alone)
```

- **AIS ingest**: terrestrial AIS feed → persistent store (e.g. Postgres/PostGIS)
- **Satellite fetcher**: Sentinel-1/2 tiles, optionally tasked SAR
- **Ship detector**: the YOLOv8 SAR model in `ml_pipeline/`, retrained on far more than 25 images
- **Correlator**: matches satellite detections against AIS positions within a distance/time window to produce real Dark Vessel alerts
- **Dashboard / API / weekly brief**: what already exists here, pointed at real data instead of `app/lib/vessels.ts`

## Tech stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **ML pipeline**: Python, YOLOv8x (Ultralytics), Sentinel Hub API
- **Deployment**: Netlify

## Getting started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

Visit `http://localhost:3000` — `/` for the landing page, `/dashboard` for the demo, `/about` for how it works,
`/brief` for the mock weekly brief.

## Contributing

1. Fork & create a branch (`git checkout -b feature/foo`)
2. Submit a PR describing "why this change?"

## License

MIT — see [LICENSE](LICENSE).

## Contact

[ssattigeri65@gmail.com](mailto:ssattigeri65@gmail.com)
