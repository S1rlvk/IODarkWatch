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
      vessel: {
        id: '1',
        name: 'Ocean Voyager',
        type: 'Cargo',
        mmsi: '123456789',
        imo: 'IMO1234567',
        flag: 'Panama',
        position: { lat: 15.5, lng: 73.8 },
        course: 45,
        speed: 12,
        lastUpdate: new Date().toISOString(),
        riskLevel: 'high',
        region: 'Indian Ocean'
      }
    },
    {
      id: '2',
      type: 'Suspicious Activity',
      severity: 'medium',
      timestamp: new Date().toISOString(),
      description: 'Vessel detected in restricted area',
      vessel: {
        id: '2',
        name: 'Deep Sea Explorer',
        type: 'Fishing',
        mmsi: '987654321',
        imo: 'IMO7654321',
        flag: 'Marshall Islands',
        position: { lat: 16.2, lng: 74.5 },
        course: 90,
        speed: 8,
        lastUpdate: new Date().toISOString(),
        riskLevel: 'medium',
        region: 'Indian Ocean'
      }
    }
  ];

  return NextResponse.json(alerts);
} 