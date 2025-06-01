#!/usr/bin/env python3
"""
IODarkWatch - YOLOv8x Inference Server
Production-ready dark vessel detection API
"""

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from ultralytics import YOLO
import cv2
import numpy as np
import base64
from io import BytesIO
from PIL import Image
import json
from pathlib import Path

app = FastAPI(title="IODarkWatch SAR Detection API", version="1.0.0")

# Load the trained model
MODEL_PATH = "./runs/production_sar_model/weights/best.pt"

try:
    model = YOLO(MODEL_PATH)
    print(f"✅ Model loaded: {MODEL_PATH}")
except Exception as e:
    print(f"❌ Failed to load model: {e}")
    model = None

class DetectionRequest(BaseModel):
    image: str  # Base64 encoded image
    confidence: float = 0.25

class DetectionResponse(BaseModel):
    detections: list
    model_info: dict
    processing_time: float

@app.get("/")
async def root():
    return {
        "service": "IODarkWatch SAR Detection API",
        "model": "YOLOv8x",
        "status": "online" if model else "model_not_loaded",
        "endpoints": ["/detect", "/health", "/model-info"]
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy" if model else "unhealthy",
        "model_loaded": model is not None
    }

@app.get("/model-info")
async def model_info():
    if not model:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    # Load deployment config
    config_path = Path("./deployment_config.json")
    if config_path.exists():
        with open(config_path) as f:
            config = json.load(f)
    else:
        config = {"status": "no_config"}
    
    return {
        "model_type": "YOLOv8x",
        "data_source": "Sentinel-1 SAR",
        "deployment_config": config
    }

@app.post("/detect", response_model=DetectionResponse)
async def detect_vessels(request: DetectionRequest):
    if not model:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    try:
        import time
        start_time = time.time()
        
        # Decode base64 image
        image_data = base64.b64decode(request.image)
        image = Image.open(BytesIO(image_data))
        
        # Convert to numpy array
        img_array = np.array(image)
        
        # Preprocess for SAR data if needed
        if len(img_array.shape) == 2:
            # Grayscale SAR image
            img_array = cv2.cvtColor(img_array, cv2.COLOR_GRAY2RGB)
        
        # Run inference
        results = model(img_array, conf=request.confidence, device='cpu')
        
        # Extract detections
        detections = []
        
        for result in results:
            if result.boxes is not None:
                for box in result.boxes:
                    detection = {
                        'class_id': int(box.cls.item()),
                        'class_name': model.names[int(box.cls.item())],
                        'confidence': float(box.conf.item()),
                        'bbox': {
                            'x1': float(box.xyxy[0][0].item()),
                            'y1': float(box.xyxy[0][1].item()),
                            'x2': float(box.xyxy[0][2].item()),
                            'y2': float(box.xyxy[0][3].item())
                        },
                        'is_dark_vessel': int(box.cls.item()) == 0  # Assuming class 0 is dark_vessel
                    }
                    detections.append(detection)
        
        processing_time = time.time() - start_time
        
        return DetectionResponse(
            detections=detections,
            model_info={
                "model": "YOLOv8x-SAR",
                "confidence_threshold": request.confidence,
                "classes": list(model.names.values()),
                "input_size": img_array.shape
            },
            processing_time=processing_time
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Detection failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting IODarkWatch SAR Detection API...")
    print(f"📊 Model: {MODEL_PATH}")
    print("🌐 API: http://localhost:8000")
    print("📖 Docs: http://localhost:8000/docs")
    
    uvicorn.run(app, host="0.0.0.0", port=8000) 