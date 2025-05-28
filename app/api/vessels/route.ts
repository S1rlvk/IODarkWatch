import { NextResponse } from 'next/server';
import { Vessel } from '@/app/types';

export async function GET() {
  // Mock data for demonstration
  const vessels: Vessel[] = [
    {
      id: '1',
      name: 'Vessel 1',
      type: 'Tanker',
      status: 'active',
      lat: 20.5937,
      lon: 78.9629,
      timestamp: new Date().toISOString(),
      confidence: 0.95,
      mmsi: '123456789',
      imo: 'IMO1234567',
      flag: 'Panama'
    },
    {
      id: '2',
      name: 'Vessel 2',
      type: 'Cargo',
      status: 'dark',
      lat: 15.5937,
      lon: 73.9629,
      timestamp: new Date().toISOString(),
      confidence: 0.85,
      mmsi: '987654321',
      imo: 'IMO7654321',
      flag: 'Liberia'
    }
  ];

  return NextResponse.json(vessels);
} 