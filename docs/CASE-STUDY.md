# IODarkWatch: a case study

*Draft — written to be reviewed and personalized before anyone else reads it.*

## What this is

IODarkWatch started from a real premise: ships trying to avoid detection turn off their AIS transponder, and if
you can see the sea some other way — satellite imagery — you can spot the mismatch between what's out there and
what's broadcasting. That's the "dark vessel" problem, and it's a real thing maritime authorities deal with in
the Arabian Sea, the Gulf of Aden, and other Indian Ocean corridors.

What's in this repo is not that system. It's a demo: a dashboard, a domain model, and a small real ML
experiment, built to show how the pieces would fit together and what I learned trying to build one of them for
real. Nothing here talks to a live AIS feed or a live satellite tasking pipeline. Where the earlier version of
this README implied otherwise — a roadmap with milestones, a "pilot with INCOIS/Naval cell," a 96.8%-accurate
production model — that was aspirational language that had outrun what the code actually did. This write-up is
the corrected version.

## Getting the terminology right

The first problem wasn't technical, it was definitional. Three different behaviors were all getting called
"dark vessel" somewhere in the codebase or docs:

1. A vessel spotted by satellite with no AIS broadcast at that position at all
2. A vessel whose own AIS transponder had gone quiet for 12+ hours
3. A vessel whose AIS was still transmitting but reporting speed and position that didn't agree with each other

These aren't the same claim. The first says *this vessel is untracked, period* — it needs a satellite pass and a
correlation step. The second and third only need the vessel's own AIS history; no satellite involved. Collapsing
all three into a single `isDark` boolean is exactly how the README (which described option 1) and the actual
detection code (which implemented options 2 and 3) ended up disagreeing with each other.

I split them into **Dark Vessel**, **AIS Gap**, and **Spoofing Signature** — full definitions in
[`CONTEXT.md`](../CONTEXT.md), reasoning in [ADR-0001](adr/0001-dark-vessel-terminology.md). The dashboard, the
API responses, and the mock data generator ([`app/lib/vessels.ts`](../app/lib/vessels.ts)) all use these three
terms now, consistently, from one shared source of truth instead of three copies of the same mock array that
could — and did — drift apart.

## What's actually running

The live dashboard is a Next.js app. `/api/vessels`, `/api/alerts`, and `/api/summary` are real endpoints, but
they all generate their data from the same simulated dataset — vessels placed at real coordinates (Arabian Sea
off Mumbai, Bay of Bengal off Chennai, the Gulf of Aden approach, the northern Malacca Strait) with small random
jitter to look like movement. There's a `/brief` page that mocks up what a weekly digest email might contain,
and an `/about` page that says all of this plainly instead of leaving a visitor to assume otherwise.

The map view on the dashboard is a placeholder box, not an actual map. Earlier iterations of this project did
wire up Leaflet with real tile layers and vessel markers; later redesigns dropped it in favor of a plain CSS
rebuild and it was never reconnected. I'm noting that here rather than quietly leaving the README's old claim of
an "interactive maritime map" standing.

## The ML pipeline: real work, weak results

`ml_pipeline/` and `sar_fetcher/` are the one part of this project that touches real data. `sar_fetcher` pulled
an actual Sentinel-1 SAR product from the Copernicus/Sentinel Hub API. `ml_pipeline` trained a YOLOv8x model on
it to try to detect vessels in SAR imagery.

The result, straight from that run's own `deployment_config.json`:

```json
{
  "performance_metrics": { "mAP50": 0.0, "precision": 0.0, "recall": 0.0, "accuracy_grade": "C" },
  "training_data": { "total_images": 25, "train_images": 20, "val_images": 5 },
  "deployment": { "ready": false, "status": "beta_ready" }
}
```

25 images is nowhere near enough to train a detector like this from scratch, and the numbers say so plainly —
`mAP50: 0.0`. The module's own README claimed "96.8% mAP@0.5, Production-Ready," a number that doesn't appear
anywhere in the actual training output. I've since corrected that file. Digging into why the dashboard displayed
a "Production Ready — 96.8%" model card for months turned up the actual bug: the status API had
`config.deployment?.ready || true` in it — a `false` from a real config falls through `||` straight to `true`.
The fallback silently overrode the real result every time.

I removed that status endpoint, the detection endpoint, and the dashboard component that called them
(`app/components/ml/VesselDetection.tsx`) rather than leave them half-wired and quietly wrong. The pipeline
itself — fetch real SAR data, prep it for YOLO, train, emit a deployment config, serve inference over FastAPI —
is legitimate, reusable engineering. It's just attached to a model that needs a couple orders of magnitude more
labeled data before it detects anything.

## What a production version would actually need

Roughly, in the order I'd tackle it:

1. **A real AIS ingest.** Terrestrial AIS feeds exist for free at limited range; wider coverage costs money.
   Needs a persistent store — Postgres/PostGIS is the obvious choice given the geospatial queries involved.
2. **A dataset big enough to train on.** Hundreds to low thousands of labeled SAR chips, not 25. This is mostly
   a data-acquisition and labeling problem, not a modeling one.
3. **A correlator.** Given a satellite detection and the AIS positions active at that time and place, flag the
   ones with no match within some distance/time window. This is the piece that actually produces a Dark Vessel
   alert; nothing in this repo does it today.
4. **Everything already here, pointed at real data** instead of `app/lib/vessels.ts`.

None of that is scheduled. This repo is a demo of the idea and a record of one real, honestly-reported attempt
at the hardest part of it.
