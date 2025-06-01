import { NextResponse } from 'next/server';

interface Vessel {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'dark' | 'alert';
  location: {
    lat: number;
    lng: number;
  };
  speed: number;
  course: number;
  confidence: number;
  timestamp: string;
  lastAisTransmission: string;
}

// Simple vessel data generator
const generateVesselData = (): Vessel[] => {
  const now = new Date();
  const nowIso = now.toISOString();
  
  const baseVessels = [
    {
      id: '1',
      name: 'Ocean Voyager',
      type: 'Cargo',
      status: 'active' as const,
      location: { lat: 1.3521, lng: 103.8198 },
      speed: 12,
      course: 45,
      confidence: 0.95,
      timestamp: nowIso,
      lastAisTransmission: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '2', 
      name: 'Pacific Star',
      type: 'Tanker',
      status: 'dark' as const,
      location: { lat: 1.3521, lng: 104.8198 },
      speed: 0,
      course: 0,
      confidence: 0.78,
      timestamp: nowIso,
      lastAisTransmission: new Date(now.getTime() - 15 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '3',
      name: 'Indian Queen', 
      type: 'Fishing',
      status: 'alert' as const,
      location: { lat: 1.3521, lng: 102.8198 },
      speed: 8,
      course: 90,
      confidence: 0.87,
      timestamp: nowIso,
      lastAisTransmission: new Date(now.getTime() - 30 * 60 * 1000).toISOString(),
    }
  ];

  // Add some random movement to simulate real-time position updates
  return baseVessels.map(vessel => {
    const movement = {
      lat: (Math.random() - 0.5) * 0.001, // Small random movement
      lng: (Math.random() - 0.5) * 0.001
    };
    
    return {
      ...vessel,
      location: {
        lat: vessel.location.lat + movement.lat,
        lng: vessel.location.lng + movement.lng
      },
      // Randomly adjust speed for active vessels
      speed: vessel.status === 'active' 
        ? Math.max(0, vessel.speed + (Math.random() - 0.5) * 2)
        : vessel.speed,
      timestamp: nowIso
    };
  });
};

export async function GET() {
  const vessels = generateVesselData();
  
  const response = {
    vessels,
    lastUpdated: new Date().toISOString(),
    count: vessels.length
  };

  return NextResponse.json(response);
} 