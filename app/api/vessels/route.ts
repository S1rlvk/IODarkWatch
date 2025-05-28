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
      location: {
        lat: 20.5937,
        lng: 78.9629
      },
      speed: 12,
      course: 45
    },
    {
      id: '2',
      name: 'Vessel 2',
      type: 'Cargo',
      status: 'dark',
      location: {
        lat: 15.5937,
        lng: 73.9629
      },
      speed: 0,
      course: 0
    }
  ];

  return NextResponse.json(vessels);
} 