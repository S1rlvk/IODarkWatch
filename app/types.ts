export interface Vessel {
  id: string;
  mmsi: string;
  name: string;
  type: string;
  position: [number, number]; // [latitude, longitude]
  speed: number;
  course: number;
  lastUpdate: string;
  isDark: boolean;
}

export interface Alert {
  id: string;
  vessel: Vessel;
  type: 'dark_vessel' | 'suspicious_activity' | 'zone_violation';
  timestamp: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
} 