import { NextResponse } from 'next/server';
import { Vessel } from '../../types';

export async function GET() {
  // Mock data for vessels
  const vessels: Vessel[] = [
    {
      id: '1',
      name: 'Vessel 1',
      type: 'Tanker',
      mmsi: '123456789',
      imo: 'IMO1234567',
      flag: 'Panama',
      position: { lat: 20.5937, lng: 78.9629 },
      speed: 15,
      course: 180,
      lastUpdate: new Date().toISOString(),
      riskLevel: 'low',
      region: 'Indian Ocean'
    },
    {
      id: '2',
      name: 'Vessel 2',
      type: 'Cargo',
      mmsi: '987654321',
      imo: 'IMO7654321',
      flag: 'Marshall Islands',
      position: { lat: 15.5937, lng: 73.9629 },
      speed: 12,
      course: 90,
      lastUpdate: new Date().toISOString(),
      riskLevel: 'medium',
      region: 'Indian Ocean'
    }
  ];

  return NextResponse.json(vessels);
} 