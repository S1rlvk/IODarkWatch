import { create } from 'zustand';
import { Vessel, Alert } from '../types';
import { sampleVessels, sampleAlerts } from '../data/sampleVessels';

interface VesselState {
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

export const useVesselStore = create<VesselState>((set, get) => ({
  vessels: sampleVessels,
  alerts: sampleAlerts,
  selectedAlert: null,
  filters: {
    status: [],
    type: [],
    dateRange: [null, null]
  },
  setVessels: (vessels: Vessel[]) => set({ vessels }),
  setAlerts: (alerts: Alert[]) => set({ alerts }),
  setSelectedAlert: (alert: Alert | null) => set({ selectedAlert: alert }),
  setFilters: (newFilters: Partial<VesselState['filters']>) => set((state: VesselState) => ({
    filters: { ...state.filters, ...newFilters }
  })),
  getFilteredVessels: () => {
    const { vessels, filters } = get();
    return vessels.filter((vessel: Vessel) => {
      if (filters.status.length && !filters.status.includes(vessel.status)) return false;
      if (filters.type.length && !filters.type.includes(vessel.type)) return false;
      if (filters.dateRange[0] && new Date(vessel.timestamp) < filters.dateRange[0]) return false;
      if (filters.dateRange[1] && new Date(vessel.timestamp) > filters.dateRange[1]) return false;
      return true;
    });
  }
})); 