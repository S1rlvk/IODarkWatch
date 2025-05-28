import { create } from 'zustand';
import { Vessel, Alert, VesselState } from '../types';
import mockData from '../data/mockVessels.json';

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
  vessels: mockData.vessels.map(v => ({
    id: v.id,
    name: v.name,
    type: v.type,
    status: v.status as 'active' | 'dark' | 'alert',
    location: {
      lat: v.lat,
      lng: v.lon
    },
    speed: 0, // Default values since not in mock data
    course: 0
  })),
  alerts: mockData.alerts || [],
  selectedAlert: null,
  filters: {
    status: [],
    type: [],
    dateRange: [null, null]
  },
  setVessels: (vessels) => set({ vessels }),
  setAlerts: (alerts) => set({ alerts }),
  setSelectedAlert: (alert) => set({ selectedAlert: alert }),
  setFilters: (filters) => set((state) => ({
    filters: { ...state.filters, ...filters }
  })),
  getFilteredVessels: () => {
    const { vessels, filters } = get();
    return vessels.filter(vessel => {
      if (filters.status.length && !filters.status.includes(vessel.status)) return false;
      if (filters.type.length && !filters.type.includes(vessel.type)) return false;
      return true;
    });
  }
})); 