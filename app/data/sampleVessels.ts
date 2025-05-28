import { Vessel, Alert } from '../types';

export const sampleVessels: Vessel[] = [
  {
    id: '123456789',
    name: 'Ocean Voyager',
    type: 'Cargo',
    status: 'active',
    lat: 15.5,
    lon: 73.8,
    timestamp: '2024-03-20T10:00:00Z',
    confidence: 0.95
  },
  {
    id: '987654321',
    name: 'Sea Explorer',
    type: 'Tanker',
    status: 'dark',
    lat: 16.2,
    lon: 74.1,
    timestamp: '2024-03-20T09:30:00Z',
    confidence: 0.85
  },
  {
    id: '456789123',
    name: 'Maritime Star',
    type: 'Fishing',
    status: 'active',
    lat: 15.8,
    lon: 73.5,
    timestamp: '2024-03-20T10:15:00Z',
    confidence: 0.92
  }
];

export const sampleAlerts: Alert[] = [
  {
    id: '1',
    type: 'Dark Vessel',
    severity: 'high',
    location: {
      lat: 16.2,
      lng: 74.1
    },
    timestamp: '2024-03-20T09:30:00Z',
    description: 'Vessel has gone dark in a high-risk area',
    vesselId: '987654321'
  },
  {
    id: '2',
    type: 'Speed Anomaly',
    severity: 'medium',
    location: {
      lat: 15.5,
      lng: 73.8
    },
    timestamp: '2024-03-20T10:00:00Z',
    description: 'Unusual speed pattern detected',
    vesselId: '123456789'
  },
  {
    id: '3',
    type: 'Area Violation',
    severity: 'low',
    location: {
      lat: 15.8,
      lng: 73.5
    },
    timestamp: '2024-03-20T10:15:00Z',
    description: 'Vessel entered restricted fishing zone',
    vesselId: '456789123'
  }
]; 