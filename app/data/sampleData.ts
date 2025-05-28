import { Vessel, Alert } from '../types';

export const sampleVessels: Vessel[] = [
  {
    id: '1',
    name: 'Ocean Voyager',
    type: 'Cargo',
    status: 'active',
    location: { lat: 1.3521, lng: 103.8198 },
    speed: 12,
    course: 45
  },
  {
    id: '2',
    name: 'Pacific Star',
    type: 'Tanker',
    status: 'dark',
    location: { lat: 1.3521, lng: 104.8198 },
    speed: 0,
    course: 0
  },
  {
    id: '3',
    name: 'Indian Queen',
    type: 'Fishing',
    status: 'alert',
    location: { lat: 1.3521, lng: 102.8198 },
    speed: 8,
    course: 90
  }
];

export const sampleAlerts: Alert[] = [
  {
    id: '1',
    type: 'Dark Vessel',
    vessel: 'Pacific Star',
    timestamp: '2024-03-20T10:30:00Z',
    description: 'Vessel has gone dark for more than 24 hours',
    severity: 'high',
    location: { lat: 1.3521, lng: 104.8198 }
  },
  {
    id: '2',
    type: 'Suspicious Activity',
    vessel: 'Indian Queen',
    timestamp: '2024-03-20T09:15:00Z',
    description: 'Vessel detected in restricted fishing zone',
    severity: 'medium',
    location: { lat: 1.3521, lng: 102.8198 }
  }
]; 