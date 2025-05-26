import { NextResponse } from 'next/server';
import { Alert } from '../../types';

export async function GET() {
  // Mock data for alerts
  const alerts: Alert[] = [
    {
      id: '1',
      vessel: {
        id: '1',
        mmsi: '123456789',
        name: 'Ocean Voyager',
        type: 'Cargo',
        position: [15.5, 73.8],
        speed: 12,
        course: 45,
        lastUpdate: new Date().toISOString(),
        isDark: true,
      },
      type: 'dark_vessel',
      severity: 'high',
      timestamp: new Date().toISOString(),
      description: 'Vessel detected operating without AIS transmission'
    },
    {
      id: '2',
      vessel: {
        id: '2',
        mmsi: '987654321',
        name: 'Deep Sea Explorer',
        type: 'Fishing',
        position: [16.2, 74.5],
        speed: 8,
        course: 90,
        lastUpdate: new Date().toISOString(),
        isDark: false,
      },
      type: 'suspicious_activity',
      severity: 'medium',
      timestamp: new Date().toISOString(),
      description: 'Unusual vessel movement pattern detected'
    }
  ];

  return NextResponse.json(alerts);
} 