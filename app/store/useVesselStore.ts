import { create } from 'zustand';
import { Vessel, Alert } from '../types';

interface VesselState {
  vessels: Vessel[];
  alerts: Alert[];
  selectedAlert: Alert | null;
  filters: {
    status: string[];
    type: string[];
    dateRange: [Date | null, Date | null];
  };
  setSelectedAlert: (alert: Alert | null) => void;
  addVessel: (vessel: Vessel) => void;
  updateVessel: (id: string, vessel: Partial<Vessel>) => void;
  removeVessel: (id: string) => void;
  addAlert: (alert: Alert) => void;
  removeAlert: (id: string) => void;
  getFilteredVessels: () => Vessel[];
}

// Mock data for development
const mockVessels: Vessel[] = [
  {
    id: '1',
    name: 'Ocean Voyager',
    type: 'Cargo',
    status: 'active',
    location: { lat: 1.3521, lng: 103.8198 },
    speed: 12,
    course: 45
  },
  {
    id: '2',
    name: 'Pacific Star',
    type: 'Tanker',
    status: 'dark',
    location: { lat: 1.3521, lng: 104.8198 },
    speed: 0,
    course: 0
  },
  {
    id: '3',
    name: 'Indian Queen',
    type: 'Fishing',
    status: 'alert',
    location: { lat: 1.3521, lng: 102.8198 },
    speed: 8,
    course: 90
  }
];

const mockAlerts: Alert[] = [
  {
    id: '1',
    type: 'Dark Vessel',
    vessel: 'Pacific Star',
    timestamp: '2024-03-20T10:30:00Z',
    description: 'Vessel has gone dark for more than 24 hours',
    severity: 'high',
    location: { lat: 1.3521, lng: 104.8198 }
  },
  {
    id: '2',
    type: 'Suspicious Activity',
    vessel: 'Indian Queen',
    timestamp: '2024-03-20T09:15:00Z',
    description: 'Vessel detected in restricted fishing zone',
    severity: 'medium',
    location: { lat: 1.3521, lng: 102.8198 }
  }
];

export const useVesselStore = create<VesselState>((set, get) => ({
  vessels: mockVessels,
  alerts: mockAlerts,
  selectedAlert: null,
  filters: {
    status: [],
    type: [],
    dateRange: [null, null]
  },
  setSelectedAlert: (alert) => set({ selectedAlert: alert }),
  addVessel: (vessel) => set((state) => ({ vessels: [...state.vessels, vessel] })),
  updateVessel: (id, vessel) =>
    set((state) => ({
      vessels: state.vessels.map((v) => (v.id === id ? { ...v, ...vessel } : v))
    })),
  removeVessel: (id) =>
    set((state) => ({
      vessels: state.vessels.filter((v) => v.id !== id)
    })),
  addAlert: (alert) => set((state) => ({ alerts: [...state.alerts, alert] })),
  removeAlert: (id) =>
    set((state) => ({
      alerts: state.alerts.filter((a) => a.id !== id)
    })),
  getFilteredVessels: () => {
    const state = get();
    let filtered = [...state.vessels];

    // Filter by status
    if (state.filters.status.length > 0) {
      filtered = filtered.filter(vessel => state.filters.status.includes(vessel.status));
    }

    // Filter by type
    if (state.filters.type.length > 0) {
      filtered = filtered.filter(vessel => state.filters.type.includes(vessel.type));
    }

    return filtered;
  }
})); 