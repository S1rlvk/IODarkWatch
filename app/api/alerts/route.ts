import { NextResponse } from 'next/server';
import { Alert } from '../../types';

export async function GET() {
  // Mock data for alerts
  const alerts: Alert[] = [
    {
      id: '1',
      type: 'Dark Vessel',
      severity: 'high',
      timestamp: new Date().toISOString(),
      description: 'Vessel detected operating without AIS',
      location: { lat: 15.5, lng: 73.8 }
    },
    {
      id: '2',
      type: 'Suspicious Activity',
      severity: 'medium',
      timestamp: new Date().toISOString(),
      description: 'Vessel detected in restricted area',
      location: { lat: 16.2, lng: 74.5 }
    }
  ];

  return NextResponse.json(alerts);
} 