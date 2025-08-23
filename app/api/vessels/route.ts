import { NextResponse } from 'next/server';

interface Vessel {
  id: string;
  name: string;
  type: string;
  mmsi: string;
  lat: number;
  lng: number;
  speed: number;
  heading: number;
  length: number;
  confidence: number;
  lastSeen: number;
  risk: 'high' | 'medium' | 'low';
  riskLevel: string;
  riskReason: string;
  isDark?: boolean;
  lastAisTransmission?: string;
  suspicious?: boolean;
}

// Enhanced vessel data generator with realistic maritime patterns
const generateVesselData = (): Vessel[] => {
  const now = Date.now();
  
  return [
    {
      id: 'DS001', 
      name: 'MV Horizon', 
      type: 'Cargo', 
      mmsi: '123456789',
      lat: 40.7128 + (Math.random() - 0.5) * 0.01, 
      lng: -74.0060 + (Math.random() - 0.5) * 0.01, 
      speed: 12.5 + (Math.random() - 0.5) * 2, 
      heading: 45 + (Math.random() - 0.5) * 10, 
      length: 180,
      confidence: 0.92, 
      lastSeen: now - 1000 * 60 * (30 + Math.random() * 30), 
      risk: 'high' as const,
      riskLevel: 'HIGH', 
      riskReason: 'AIS silent for 20 hours, suspicious movement pattern',
      isDark: true, 
      lastAisTransmission: new Date(now - 1000 * 60 * 60 * 20).toISOString()
    },
    {
      id: 'DS002', 
      name: 'Pacific Star', 
      type: 'Tanker', 
      mmsi: '987654321',
      lat: 34.0522 + (Math.random() - 0.5) * 0.01, 
      lng: -118.2437 + (Math.random() - 0.5) * 0.01, 
      speed: 8.2 + (Math.random() - 0.5) * 1.5, 
      heading: 120 + (Math.random() - 0.5) * 8, 
      length: 220,
      confidence: 0.87, 
      lastSeen: now - 1000 * 60 * (45 + Math.random() * 30), 
      risk: 'high' as const,
      riskLevel: 'HIGH', 
      riskReason: 'AIS silent for 15 hours, was previously active',
      isDark: true, 
      lastAisTransmission: new Date(now - 1000 * 60 * 60 * 15).toISOString()
    },
    {
      id: 'DS003', 
      name: 'Suspicious Vessel', 
      type: 'Unknown', 
      mmsi: '555666777',
      lat: 25.7617 + (Math.random() - 0.5) * 0.005, 
      lng: -80.1918 + (Math.random() - 0.5) * 0.005, 
      speed: 0, 
      heading: 0, 
      length: 0,
      confidence: 0.78, 
      lastSeen: now - 1000 * 60 * (15 + Math.random() * 20), 
      risk: 'medium' as const,
      riskLevel: 'MEDIUM', 
      riskReason: 'Speed 0 but position changing (spoofing behavior)',
      suspicious: true
    },
    {
      id: 'DS004', 
      name: 'F/V Atlantic', 
      type: 'Fishing', 
      mmsi: '111222333',
      lat: 51.5074 + (Math.random() - 0.5) * 0.008, 
      lng: -0.1278 + (Math.random() - 0.5) * 0.008, 
      speed: 6.8 + (Math.random() - 0.5) * 1, 
      heading: 90 + (Math.random() - 0.5) * 15, 
      length: 45,
      confidence: 0.65, 
      lastSeen: now - 1000 * 60 * (60 + Math.random() * 60), 
      risk: 'medium' as const,
      riskLevel: 'MEDIUM', 
      riskReason: 'Erratic movement pattern detected'
    },
    {
      id: 'DS005', 
      name: 'MV Coastal', 
      type: 'Cargo', 
      mmsi: '444555666',
      lat: 48.8566 + (Math.random() - 0.5) * 0.006, 
      lng: 2.3522 + (Math.random() - 0.5) * 0.006, 
      speed: 14.2 + (Math.random() - 0.5) * 1.5, 
      heading: 180 + (Math.random() - 0.5) * 12, 
      length: 150,
      confidence: 0.45, 
      lastSeen: now - 1000 * 60 * (90 + Math.random() * 60), 
      risk: 'low' as const,
      riskLevel: 'LOW', 
      riskReason: 'Routine monitoring, minor AIS discrepancy'
    },
    {
      id: 'DS006', 
      name: 'MV Northern Light', 
      type: 'Tanker', 
      mmsi: '456123789',
      lat: 64.1466 + (Math.random() - 0.5) * 0.004, 
      lng: -21.9426 + (Math.random() - 0.5) * 0.004, 
      speed: 12.1 + (Math.random() - 0.5) * 1, 
      heading: 200 + (Math.random() - 0.5) * 10, 
      length: 175,
      confidence: 0.22, 
      lastSeen: now - 1000 * 60 * (120 + Math.random() * 60), 
      risk: 'low' as const,
      riskLevel: 'LOW', 
      riskReason: 'Standard patrol detection'
    },
    {
      id: 'DS007', 
      name: 'S/V Wind Spirit', 
      type: 'Pleasure Craft', 
      mmsi: '891234567',
      lat: 25.7617 + (Math.random() - 0.5) * 0.003, 
      lng: -80.1918 + (Math.random() - 0.5) * 0.003, 
      speed: 6.8 + (Math.random() - 0.5) * 0.5, 
      heading: 135 + (Math.random() - 0.5) * 8, 
      length: 18,
      confidence: 0.38, 
      lastSeen: now - 1000 * 60 * (240 + Math.random() * 60), 
      risk: 'low' as const,
      riskLevel: 'LOW', 
      riskReason: 'Unusual nighttime activity'
    },
    {
      id: 'DS008', 
      name: 'F/V Golden Wave', 
      type: 'Fishing', 
      mmsi: '912345678',
      lat: -33.8688 + (Math.random() - 0.5) * 0.005, 
      lng: 151.2093 + (Math.random() - 0.5) * 0.005, 
      speed: 5.4 + (Math.random() - 0.5) * 0.8, 
      heading: 280 + (Math.random() - 0.5) * 12, 
      length: 38,
      confidence: 0.31, 
      lastSeen: now - 1000 * 60 * (300 + Math.random() * 60), 
      risk: 'low' as const,
      riskLevel: 'LOW', 
      riskReason: 'Minor AIS discrepancy'
    }
  ];
};

export async function GET() {
  const vessels = generateVesselData();
  
  const response = {
    vessels,
    lastUpdated: new Date().toISOString(),
    count: vessels.length,
    summary: {
      high: vessels.filter(v => v.risk === 'high').length,
      medium: vessels.filter(v => v.risk === 'medium').length,
      low: vessels.filter(v => v.risk === 'low').length,
      dark: vessels.filter(v => v.isDark).length,
      total: vessels.length
    }
  };

  return NextResponse.json(response);
} 