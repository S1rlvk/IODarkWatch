import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { imageData, confidence = 0.25 } = await request.json()
    
    // Call Python inference service
    const response = await fetch('http://localhost:8000/detect', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        image: imageData, 
        confidence: confidence 
      }),
    })
    
    if (!response.ok) {
      throw new Error('Inference service unavailable')
    }
    
    const detections = await response.json()
    
    // Add metadata
    const result = {
      ...detections,
      model_info: {
        model: 'YOLOv8x-SAR',
        data_source: 'Sentinel-1',
        confidence_threshold: confidence,
        timestamp: new Date().toISOString()
      }
    }
    
    return NextResponse.json(result)
    
  } catch (error) {
    console.error('Detection API error:', error)
    return NextResponse.json(
      { error: 'Dark vessel detection failed' }, 
      { status: 500 }
    )
  }
} 