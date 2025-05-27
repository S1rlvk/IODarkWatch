export interface Vessel {
  id: string;
  name: string;
  type: string;
  mmsi: string;
  imo: string;
  flag: string;
  position: {
    lat: number;
    lng: number;
  };
  course: number;
  speed: number;
  lastUpdate: string;
  riskLevel: string;
  region: string;
}

export interface Alert {
  id: string;
  type: string;
  severity: string;
  timestamp: string;
  description: string;
  vessel: Vessel;
}

export interface FilterState {
  vesselTypes: string[];
  riskLevels: string[];
  regions: string[];
}

export interface MapComponentProps {
  vessels: Vessel[];
  alerts: Alert[];
  onVesselSelect: (vessel: Vessel) => void;
  selectedVessel: Vessel | null;
}

export interface AlertPanelProps {
  alerts: Alert[];
  selectedVessel: Vessel | null;
}

export interface TimelineViewProps {
  timeRange: [Date, Date];
  onTimeRangeChange: (range: [Date, Date]) => void;
  vessels: Vessel[];
  alerts: Alert[];
} 