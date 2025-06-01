import { NextResponse } from 'next/server';

interface Alert {
  id: string;
  type: string;
  severity: string;
  timestamp: string;
  location: {
    lat: number;
    lng: number;
  };
  description: string;
  vessel?: string;
}

export async function GET() {
  // Mock data for alerts
  const alerts: Alert[] = [
    {
      id: '1',
      type: 'Dark Vessel',
      vessel: 'Ocean Voyager',
      severity: 'high',
      timestamp: new Date().toISOString(),
      location: { lat: 1.3521, lng: 103.8198 },
      description: 'Vessel has gone dark for over 12 hours'
    },
    {
      id: '2', 
      type: 'Suspicious Movement',
      vessel: 'Pacific Star',
      severity: 'medium',
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      location: { lat: 1.3521, lng: 104.8198 },
      description: 'Unusual course deviation detected'
    }
  ];

  return NextResponse.json(alerts);
} 