# Dark Vessel Detection Implementation

## Overview

This implementation adds comprehensive dark vessel detection logic to the IODarkWatch system, identifying vessels that exhibit suspicious behavior or have stopped transmitting AIS signals.

## Features Implemented

### 1. Dark Vessel Criteria

#### AIS Transmission Gap Detection
- **Threshold**: 12+ hours without AIS transmission
- **Logic**: If a vessel was previously active but hasn't transmitted AIS signals for 12+ hours, it's marked as "dark"
- **Data Field**: `lastAisTransmission` timestamp

#### Suspicious Movement Detection
- **Criteria**: Speed reported as 0 but position is changing
- **Logic**: Analyzes position history to detect movement despite zero speed reports
- **Flag**: Sets `suspicious` field to true

#### Additional Patterns
- **Erratic Movement**: Dramatic speed variations or impossible speed changes
- **AIS Mismatch**: No AIS match for previously active vessels
- **Position Spoofing**: Calculated speed differs significantly from reported speed

### 2. Visual Indicators

#### Color Coding
- 🔴 **Red (`#ef4444`)**: Dark vessels (AIS silent 12+ hours)
- 🟠 **Orange (`#f59e0b`)**: Suspicious/Alert vessels
- 🟢 **Green (`#39FF14`)**: Active vessels

#### Marker Enhancements
- **Size**: Dark vessels have larger markers (18px vs 12px)
- **Animation**: Pulsing rings for dark vessels (double ring)
- **Animation**: Single pulse for suspicious vessels

### 3. Data Structure Enhancements

#### New Vessel Fields
```typescript
interface Vessel {
  // ... existing fields
  lastAisTransmission?: string;     // Last AIS transmission timestamp
  previousPositions?: Array<{       // Position history for analysis
    lat: number;
    lng: number;
    timestamp: string;
    speed: number;
  }>;
  suspicious?: boolean;             // Suspicious behavior flag
}
```

### 4. Analysis Engine

#### Core Functions
- `analyzeDarkVessel(vessel)`: Main analysis function
- `updateVesselStatus(vessel)`: Updates vessel status based on analysis
- `processVesselsForDarkDetection(vessels)`: Batch processing function

#### Analysis Results
```typescript
interface DarkVesselAnalysis {
  isDark: boolean;
  isSuspicious: boolean;
  reason: string[];
  lastTransmissionHours?: number;
}
```

### 5. Enhanced UI Components

#### Popup Information
- Last AIS transmission time (with color coding)
- AIS match status
- Alert reasons (detailed explanations)
- Position coordinates
- Enhanced status badges

#### Map Legend
- Visual indicators for each vessel type
- Explanatory text for detection criteria
- Animated legend items matching vessel markers

## Implementation Files

### Core Logic
- `app/utils/darkVesselDetection.ts` - Detection algorithms
- `app/types/index.ts` - Enhanced type definitions

### API Updates
- `app/api/vessels/route.ts` - Sample data with dark vessel scenarios

### UI Components
- `app/components/VesselMarker.tsx` - Enhanced marker component
- `app/dashboard/VesselMapClient.tsx` - Main map with dark vessel support
- `app/components/MapComponentClient.tsx` - Alternative map implementation

### Styling
- `app/styles/globals.css` - Pulse animations and vessel styling

## Sample Dark Vessel Scenarios

The implementation includes realistic test scenarios:

1. **MV Horizon**: AIS silent for 20 hours, suspicious movement pattern
2. **Pacific Star**: AIS silent for 15 hours, was previously active
3. **Suspicious Vessel**: Speed 0 but position changing (spoofing behavior)

## Technical Details

### Detection Thresholds
- **AIS Gap**: 12 hours (43,200,000 ms)
- **Position Change**: 0.001° (~100m minimum movement)
- **Speed Variation**: 20+ knots difference triggers erratic flag
- **Speed Accuracy**: 15+ knots difference between calculated vs reported

### Performance Considerations
- Analysis runs on each vessel update
- Efficient position history management (limited to recent positions)
- Optimized distance calculations using Haversine formula

## Usage

The dark vessel detection runs automatically when vessel data is fetched. Dark vessels will:
- Appear as larger red markers with pulsing animation
- Show detailed alert information in popups
- Be clearly labeled in the vessel status table
- Include time since last AIS transmission

## Monitoring Dashboard

The system provides real-time monitoring of:
- Total dark vessels count
- Suspicious vessel alerts
- AIS transmission gap analysis
- Position anomaly detection

This implementation provides comprehensive dark vessel detection capabilities suitable for maritime surveillance and security applications. 