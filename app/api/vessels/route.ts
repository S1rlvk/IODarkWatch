import { NextResponse } from 'next/server';
import { Vessel } from '../../types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const start = searchParams.get('start');
  const end = searchParams.get('end');

  // Mock data
  const mockVessels: Vessel[] = [
    {
      id: '1',
      mmsi: '123456789',
      name: 'Vessel 1',
      type: 'Tanker',
      position: [20.5937, 78.9629],
      speed: 15,
      course: 180,
      lastUpdate: new Date().toISOString(),
      isDark: true,
    },
    {
      id: '2',
      mmsi: '987654321',
      name: 'Vessel 2',
      type: 'Cargo',
      position: [15.5937, 73.9629],
      speed: 10,
      course: 90,
      lastUpdate: new Date().toISOString(),
      isDark: false,
    },
    {
      id: '3',
      mmsi: '456789123',
      name: 'Vessel 3',
      type: 'Fishing',
      position: [12.5937, 80.9629],
      speed: 5,
      course: 270,
      lastUpdate: new Date().toISOString(),
      isDark: true,
    },
  ];

  return NextResponse.json(mockVessels);
} 