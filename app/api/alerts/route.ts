import { NextResponse } from 'next/server';
import { Alert } from '../../types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const start = searchParams.get('start');
  const end = searchParams.get('end');

  // Mock data
  const mockAlerts: Alert[] = [
    {
      id: '1',
      vessel: {
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
      type: 'dark_mode',
      severity: 'high',
      timestamp: new Date().toISOString(),
      location: { lat: 20.5937, lng: 78.9629 },
      description: 'Vessel operating in dark mode for more than 24 hours',
    },
    {
      id: '2',
      vessel: {
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
      type: 'suspicious_activity',
      severity: 'medium',
      timestamp: new Date().toISOString(),
      location: { lat: 15.5937, lng: 73.9629 },
      description: 'Unusual speed pattern detected',
    },
  ];

  return NextResponse.json(mockAlerts);
} 