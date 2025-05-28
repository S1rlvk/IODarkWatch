export interface Vessel {
  id: string;
  lat: number;
  lon: number;
  timestamp: string;
  aisMatch: boolean;
  confidence: number;
  type: string;
  name?: string;
  status: 'active' | 'dark';
}

export interface Alert {
  id: string;
  type: string;
  severity: 'high' | 'medium' | 'low';
  timestamp: string;
  location: {
    lat: number;
    lng: number;
  };
  description: string;
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