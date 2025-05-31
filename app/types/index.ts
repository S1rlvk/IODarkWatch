export interface Location {
  lat: number;
  lng: number;
}

export interface Vessel {
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
  confidence?: number;
  aisMatch?: boolean;
  timestamp?: string;
  lastAisTransmission?: string;
  previousPositions?: Array<{
    lat: number;
    lng: number;
    timestamp: string;
    speed: number;
  }>;
  suspicious?: boolean;
}

export interface Alert {
  id: string;
  type: string;
  severity: string;
  timestamp: string;
  location: {
    lat: number;
    lng: number;
  };
  description: string;
  vessel?: string;
}

export interface AlertPanelProps {
  alerts: Alert[];
  selectedVessel: Vessel | null;
}

export interface TimelineViewProps {
  timeRange: [Date | null, Date | null];
  onTimeRangeChange: (range: [Date | null, Date | null]) => void;
  vessels: Vessel[];
  alerts: Alert[];
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