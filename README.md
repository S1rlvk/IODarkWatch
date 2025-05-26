# IODarkWatch
Open-Source Maritime Domain-Awareness for the Indian Ocean


Real-time detection of “dark” vessels—ships whose satellite signatures have no matching AIS broadcast—in the Arabian Sea, Bay of Bengal, and wider Indian Ocean.  
The project fuses free AIS feeds, public Sentinel-2 imagery, and tip-and-cue SAR snapshots, then surfaces alerts via a live map, REST API, and weekly brief.

---

## ✨ Features
| Module | What it does |
|--------|--------------|
| **AIS Ingest** | Nightly scraper pulls terrestrial AIS packets → Postgres + PostGIS |
| **Satellite Fetcher** | Downloader for Sentinel-2 tiles (Copernicus OpenHub) + optional SAR snippets (Iceye/Umbra) |
| **Ship Detector** | YOLOv8 fine-tuned on labelled Sentinel chips (mAP ≥ 0.60 target) |
| **Correlator** | Flags satellite detections with no AIS match within ≤ 2 NM / ≤ 30 min |
| **Dashboard** | Streamlit/Next.js map with heat-layer, timeline, and event table |
| **API** | `GET /dark?date=YYYY-MM-DD` returns JSON/CSV of dark-ship events |
| **Weekly Brief** | Mailer sends top anomalies + trend chart to subscribers |

---

## 🏗️ Architecture Snapshot
AIS → ETL (Lambda) → PostgreSQL/PostGIS
↑
Sentinel-2 ↗ |
SAR (opt.) ↗ ML (Detector) → Correlator → Alerts
↘
Dashboard / API / Email


---

M1–M2 Cloud infra + AIS map (Arabian Sea)
M3–M4 200 labelled Sentinel chips · baseline detector
M5–M6 Dark-ship correlator · public beta dashboard
M7–M9 Coverage → Bay of Bengal + IOR corridors · REST API · email brief
M10–M12 1 TB AIS · 1 500 detections / day · 250 dark alerts / day · pilot with INCOIS/Naval cell
See docs/ROADMAP.md for full timeline and KPIs.

🖇️ Contributing

Fork & create branch (git checkout -b feature/foo).
Run pre-commit install (lints & tests must pass).
Submit a PR and describe Why this change?
All discussion in Discussions – newcomers welcome!