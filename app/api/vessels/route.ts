import { NextResponse } from 'next/server';
import { Vessel } from '@/app/types';
import { processVesselsForDarkDetection } from '@/app/utils/darkVesselDetection';

// Simulate vessel data with movement for real-time updates
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
      timestamp: nowIso,
      lastAisTransmission: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      previousPositions: [
        {
          lat: 1.3521,
          lng: 103.8198,
          timestamp: new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString(),
          speed: 12
        },
        {
          lat: 1.3500,
          lng: 103.8150,
          timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
          speed: 11
        }
      ]
    },
    {
      id: '2', 
      name: 'Pacific Star',
      type: 'Tanker',
      status: 'dark' as const,
      location: { lat: 1.3521, lng: 104.8198 },
      speed: 0,
      course: 0,
      timestamp: nowIso,
      lastAisTransmission: new Date(now.getTime() - 15 * 60 * 60 * 1000).toISOString(), // 15 hours ago - should be dark
      aisMatch: false,
      previousPositions: [
        {
          lat: 1.3521,
          lng: 104.8198,
          timestamp: new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString(),
          speed: 0
        },
        {
          lat: 1.3500,
          lng: 104.8150,
          timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
          speed: 8
        },
        {
          lat: 1.3480,
          lng: 104.8100,
          timestamp: new Date(now.getTime() - 10 * 60 * 60 * 1000).toISOString(),
          speed: 12
        }
      ]
    },
    {
      id: '3',
      name: 'Indian Queen', 
      type: 'Fishing',
      status: 'alert' as const,
      location: { lat: 1.3521, lng: 102.8198 },
      speed: 8,
      course: 90,
      timestamp: nowIso,
      lastAisTransmission: new Date(now.getTime() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
      previousPositions: [
        {
          lat: 1.3521,
          lng: 102.8198,
          timestamp: new Date(now.getTime() - 30 * 60 * 1000).toISOString(),
          speed: 8
        },
        {
          lat: 1.3520,
          lng: 102.8190,
          timestamp: new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString(),
          speed: 7
        }
      ]
    },
    {
      id: '4',
      name: 'MV Horizon',
      type: 'Cargo',
      status: 'dark' as const,
      location: { lat: 13.05, lng: 74.7 },
      speed: 0,
      course: 0,
      confidence: 0.82,
      aisMatch: false,
      timestamp: nowIso,
      lastAisTransmission: new Date(now.getTime() - 20 * 60 * 60 * 1000).toISOString(), // 20 hours ago - definitely dark
      previousPositions: [
        {
          lat: 13.05,
          lng: 74.7,
          timestamp: new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString(),
          speed: 0
        },
        {
          lat: 13.048,
          lng: 74.698,
          timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
          speed: 0 // Speed 0 but position changed - suspicious
        },
        {
          lat: 13.046,
          lng: 74.696,
          timestamp: new Date(now.getTime() - 3 * 60 * 60 * 1000).toISOString(),
          speed: 0
        }
      ]
    },
    {
      id: '5',
      name: 'MT Energy Carrier',
      type: 'Tanker', 
      status: 'active' as const,
      location: { lat: 12.85, lng: 74.8 },
      speed: 15,
      course: 180,
      confidence: 0.95,
      aisMatch: true,
      timestamp: nowIso,
      lastAisTransmission: new Date(now.getTime() - 5 * 60 * 1000).toISOString(), // 5 minutes ago - active
      previousPositions: [
        {
          lat: 12.85,
          lng: 74.8,
          timestamp: new Date(now.getTime() - 15 * 60 * 1000).toISOString(),
          speed: 15
        },
        {
          lat: 12.848,
          lng: 74.798,
          timestamp: new Date(now.getTime() - 30 * 60 * 1000).toISOString(),
          speed: 14
        }
      ]
    },
    {
      id: '6',
      name: 'Suspicious Vessel',
      type: 'Unknown',
      status: 'alert' as const,
      location: { lat: 10.5, lng: 76.2 },
      speed: 0, // Reports speed 0 but position changes
      course: 0,
      confidence: 0.7,
      aisMatch: false,
      timestamp: nowIso,
      lastAisTransmission: new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
      previousPositions: [
        {
          lat: 10.5,
          lng: 76.2,
          timestamp: new Date(now.getTime() - 30 * 60 * 1000).toISOString(),
          speed: 0
        },
        {
          lat: 10.498,
          lng: 76.198,
          timestamp: new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString(),
          speed: 0 // Position changed but speed reported as 0 - suspicious
        },
        {
          lat: 10.496,
          lng: 76.196,
          timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
          speed: 0
        }
      ]
    }
  ];

  // Add some random movement to simulate real-time position updates
  const vesselsWithMovement = baseVessels.map(vessel => {
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

  // Apply dark vessel detection logic
  return processVesselsForDarkDetection(vesselsWithMovement);
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