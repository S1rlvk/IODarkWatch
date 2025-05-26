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