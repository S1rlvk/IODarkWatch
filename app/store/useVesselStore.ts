import { create } from 'zustand';
import { sampleVessels, sampleAlerts } from '../data/sampleVessels';

interface Vessel {
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

interface Alert {
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

interface Filters {
  dateRange: {
    start: string;
    end: string;
  };
  regions: string[];
  onlyDarkShips: boolean;
  confidenceScore: number;
}

interface VesselStore {
  vessels: Vessel[];
  alerts: Alert[];
  filters: Filters;
  selectedAlert: Alert | null;
  setFilters: (filters: Partial<Filters>) => void;
  setSelectedAlert: (alert: Alert | null) => void;
  getFilteredVessels: () => Vessel[];
}

export const useVesselStore = create<VesselStore>((set, get) => ({
  vessels: sampleVessels,
  alerts: sampleAlerts,
  filters: {
    dateRange: {
      start: '',
      end: ''
    },
    regions: [],
    onlyDarkShips: false,
    confidenceScore: 0.5
  },
  selectedAlert: null,

  setFilters: (newFilters) => set((state) => ({
    filters: { ...state.filters, ...newFilters }
  })),

  setSelectedAlert: (alert) => set({ selectedAlert: alert }),

  getFilteredVessels: () => {
    const { vessels, filters } = get();
    return vessels.filter(vessel => {
      if (filters.onlyDarkShips && vessel.status !== 'dark') return false;
      if (filters.confidenceScore > vessel.confidence) return false;
      if (filters.regions.length > 0) {
        // TODO: Implement region filtering
        return true;
      }
      if (filters.dateRange.start && filters.dateRange.end) {
        const vesselDate = new Date(vessel.timestamp);
        const startDate = new Date(filters.dateRange.start);
        const endDate = new Date(filters.dateRange.end);
        if (vesselDate < startDate || vesselDate > endDate) return false;
      }
      return true;
    });
  }
})); 