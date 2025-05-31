# IODarkWatch

Open-Source Maritime Domain Awareness for the Indian Ocean

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## About

IODarkWatch is an open-source project focused on maritime domain awareness in the Indian Ocean region. Real-time detection of "dark" vessels—ships whose satellite signatures have no matching AIS broadcast—in the Arabian Sea, Bay of Bengal, and wider Indian Ocean.

The project fuses free AIS feeds, public Sentinel-2 imagery, and tip-and-cue SAR snapshots, then surfaces alerts via a live map, REST API, and weekly brief.

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

## 🏗️ Architecture Snapshot

```
AIS → ETL (Lambda) → PostgreSQL/PostGIS
↑
Sentinel-2 ↗ |
SAR (opt.) ↗ ML (Detector) → Correlator → Alerts
↘
Dashboard / API / Email
```

## 🚀 Roadmap

- **M1–M2** Cloud infra + AIS map (Arabian Sea)
- **M3–M4** 200 labelled Sentinel chips · baseline detector
- **M5–M6** Dark-ship correlator · public beta dashboard
- **M7–M9** Coverage → Bay of Bengal + IOR corridors · REST API · email brief
- **M10–M12** 1 TB AIS · 1,500 detections/day · 250 dark alerts/day · pilot with INCOIS/Naval cell

See docs/ROADMAP.md for full timeline and KPIs.

## 🖇️ Contributing

1. Fork & create branch (`git checkout -b feature/foo`)
2. Run `pre-commit install` (lints & tests must pass)
3. Submit a PR and describe "Why this change?"
4. All discussion in Discussions – newcomers welcome!

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📧 Contact

For any queries or collaboration opportunities, please reach out to [ssattiger65@gmail.com](mailto:ssattiger65@gmail.com)

*Latest Update: Dark vessel detection system with comprehensive AIS gap analysis and suspicious movement patterns - deployed with enhanced visual indicators and real-time monitoring capabilities.*

## 🚢 Overview

IODarkWatch leverages advanced algorithms to identify suspicious maritime activities by analyzing:
- AIS transmission gaps (vessels going dark for 12+ hours)
- Suspicious movement patterns (speed vs. position discrepancies)
- Historical vessel behavior analysis
- Real-time monitoring and alerting

## 🔍 Dark Vessel Detection Features

### AIS Gap Detection
- Monitors vessels that haven't transmitted AIS signals for 12+ hours
- Tracks last known transmission timestamps
- Identifies previously active vessels that have gone silent

### Suspicious Movement Analysis
- Detects vessels reporting speed = 0 but showing position changes
- Analyzes historical position data for movement patterns
- Flags erratic behavior and course deviations

### Visual Indicators
- **Red markers**: Dark vessels (AIS gap > 12 hours)
- **Orange markers**: Suspicious behavior detected
- **Green markers**: Normal active vessels
- Enhanced popup information with analysis details

## 🛠 Technology Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Mapping**: Leaflet with custom vessel markers
- **Real-time Updates**: Custom hooks for live data streaming
- **Analysis Engine**: Custom dark vessel detection algorithms
- **Deployment**: Netlify with continuous integration

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

Visit `http://localhost:3000` to access the dashboard.

## 📊 Key Features

- **Interactive Maritime Map**: Real-time vessel tracking with custom markers
- **Dark Vessel Dashboard**: Comprehensive analytics and detection metrics
- **Alert System**: Automated notifications for suspicious activities
- **Historical Analysis**: Vessel behavior patterns and trend analysis
- **Export Capabilities**: Data export for further analysis

## 🔄 Deployment Status

> **Current Deployment**: Dark vessel detection system with enhanced AIS monitoring - Force deployment trigger at 2025-01-21

## 📈 Monitoring Capabilities

- Real-time vessel position tracking
- AIS transmission gap analysis
- Suspicious movement pattern detection
- Historical behavior comparison
- Automated alert generation
- Comprehensive reporting dashboard

---

**IODarkWatch** - Securing maritime borders through intelligent vessel monitoring.