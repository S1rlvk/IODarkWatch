# IODarkWatch ML Pipeline

## Early-stage YOLOv8x SAR vessel detector — not production-ready

An end-to-end pipeline for detecting vessels in Sentinel-1 SAR imagery: fetch → train → deployment config →
FastAPI inference server. It runs, but the model it produces doesn't detect anything reliably yet — see the
numbers below. It is **not** wired into the IODarkWatch dashboard (`app/`); see
[`docs/CASE-STUDY.md`](../docs/CASE-STUDY.md) for the full story, including why this file used to claim
otherwise.

### Actual model performance

Straight from this pipeline's own `deployment_config.json`, not aspirational numbers:

- **mAP@0.5**: 0.0
- **Precision / Recall**: 0.0 / 0.0
- **Training data**: 25 images (20 train / 5 validation) — far too small to train a detector like this from
  scratch
- **Deployment status**: not ready (`beta_ready`)

### Quick start

```bash
pip install -r requirements.txt
python inference_server.py
```

```bash
curl -X POST http://localhost:8000/detect \
  -H "Content-Type: application/json" \
  -d '{"image": "base64_image_data", "confidence": 0.25}'
```

Runs the server and lets you hit the detect endpoint; the results won't be accurate given the current model.

### Model details

- **Architecture**: YOLOv8x
- **Training data**: a single Sentinel-1 SAR product (VH polarization), 25 labeled 640×640 tiles
- **Classes**: `dark_vessel`, `vessel`, `background`
- **Input**: SAR satellite images
- **Output**: bounding boxes with confidence scores

### What it would take to make this real

More labeled data — hundreds to low thousands of tiles, not 25 — is the main blocker. See
[`docs/CASE-STUDY.md`](../docs/CASE-STUDY.md) for the rest of what a production version would need.

### File structure

```
ml_pipeline/
├── data/                     # Raw Sentinel-1 product + YOLO-format tiles/labels used for the one training run
├── inference_server.py       # FastAPI inference service
├── train_yolov8x_live.py     # Training script
├── requirements.txt          # Dependencies
└── deployment_config.json    # Output of the actual training run — the real numbers
```
