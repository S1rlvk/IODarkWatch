export interface Vessel {
  id: string;
  mmsi: string;
  name: string;
  type: string;
  position: [number, number];
  speed: number;
  course: number;
  lastUpdate: string;
  isDark: boolean;
}

export interface Alert {
  id: string;
  vessel: Vessel;
  type: 'dark_mode' | 'suspicious_activity' | 'zone_violation';
  severity: 'low' | 'medium' | 'high';
  timestamp: string;
  location: {
    lat: number;
    lng: number;
  };
  description: string;
} 