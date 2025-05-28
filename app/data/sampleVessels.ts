export interface Vessel {
  id: string;
  name: string;
  type: string;
  location: {
    lat: number;
    lng: number;
  };
  status: 'active' | 'dark';
  lastSeen: string;
}

export interface Alert {
  id: string;
  type: 'dark_vessel' | 'suspicious_activity';
  severity: 'high' | 'medium' | 'low';
  timestamp: string;
  location: {
    lat: number;
    lng: number;
  };
  description: string;
  vesselId: string;
}

export const sampleVessels: Vessel[] = [
  {
    id: 'v1',
    name: 'MV Ocean Star',
    type: 'Cargo',
    location: { lat: 15.5, lng: 73.8 }, // Off Goa coast
    status: 'dark',
    lastSeen: '2024-03-20T10:30:00Z'
  },
  {
    id: 'v2',
    name: 'FV Sea Hunter',
    type: 'Fishing',
    location: { lat: 8.4, lng: 76.9 }, // Off Kerala coast
    status: 'dark',
    lastSeen: '2024-03-20T09:15:00Z'
  },
  {
    id: 'v3',
    name: 'MV Arabian Pearl',
    type: 'Tanker',
    location: { lat: 12.9, lng: 80.2 }, // Off Chennai coast
    status: 'active',
    lastSeen: '2024-03-20T11:45:00Z'
  },
  {
    id: 'v4',
    name: 'FV Deep Blue',
    type: 'Fishing',
    location: { lat: 19.1, lng: 72.8 }, // Off Mumbai coast
    status: 'dark',
    lastSeen: '2024-03-20T08:30:00Z'
  }
];

export const sampleAlerts: Alert[] = [
  {
    id: 'a1',
    type: 'dark_vessel',
    severity: 'high',
    timestamp: '2024-03-20T10:30:00Z',
    location: { lat: 15.5, lng: 73.8 },
    description: 'Vessel MV Ocean Star has gone dark for over 24 hours. Last known position off Goa coast.',
    vesselId: 'v1'
  },
  {
    id: 'a2',
    type: 'dark_vessel',
    severity: 'medium',
    timestamp: '2024-03-20T09:15:00Z',
    location: { lat: 8.4, lng: 76.9 },
    description: 'Fishing vessel FV Sea Hunter has lost AIS signal. Possible illegal fishing activity.',
    vesselId: 'v2'
  },
  {
    id: 'a3',
    type: 'dark_vessel',
    severity: 'high',
    timestamp: '2024-03-20T08:30:00Z',
    location: { lat: 19.1, lng: 72.8 },
    description: 'FV Deep Blue has been dark for 36 hours. Last seen near Mumbai port.',
    vesselId: 'v4'
  }
]; 