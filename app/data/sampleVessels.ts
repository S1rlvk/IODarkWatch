import mockData from './mockVessels.json';

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

export const sampleVessels = mockData.vessels;
export const sampleAlerts = mockData.alerts; 