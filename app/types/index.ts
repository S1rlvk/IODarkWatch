export interface Location {
  lat: number;
  lng: number;
}

export interface Vessel {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'dark';
  lat: number;
  lon: number;
  timestamp: string;
  confidence: number;
}

export interface Alert {
  id: string;
  type: string;
  severity: 'high' | 'medium' | 'low';
  location: Location;
  timestamp: string;
  description: string;
  vesselId?: string;
}

export interface VesselState {
  vessels: Vessel[];
  alerts: Alert[];
  selectedAlert: Alert | null;
  filters: {
    status: string[];
    type: string[];
    dateRange: [Date | null, Date | null];
  };
  setVessels: (vessels: Vessel[]) => void;
  setAlerts: (alerts: Alert[]) => void;
  setSelectedAlert: (alert: Alert | null) => void;
  setFilters: (filters: Partial<VesselState['filters']>) => void;
  getFilteredVessels: () => Vessel[];
}

export interface Filters {
  dateRange: {
    start: string;
    end: string;
  };
  regions: string[];
  onlyDarkShips: boolean;
  confidenceScore: number;
} 