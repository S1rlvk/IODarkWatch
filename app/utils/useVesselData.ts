import { useState, useEffect } from 'react';

interface Vessel {
  id: string;
  name: string;
  type: string;
  lastKnownPosition: {
    lat: number;
    lng: number;
  };
  lastUpdate: string;
  status: 'active' | 'dark' | 'inactive';
}

interface VesselData {
  vessels: Vessel[];
  loading: boolean;
  error: Error | null;
}

interface UseVesselDataProps {
  timeRange: [Date, Date];
  filters: {
    vesselTypes: string[];
    minSpeed: number;
    maxSpeed: number;
    darkVesselsOnly: boolean;
  };
}

export const useVesselData = ({ timeRange, filters }: UseVesselDataProps): VesselData => {
  const [vessels, setVessels] = useState<Vessel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchVessels = async () => {
      try {
        // TODO: Replace with actual API call
        const mockVessels: Vessel[] = [
          {
            id: '1',
            name: 'Vessel 1',
            type: 'Cargo',
            lastKnownPosition: { lat: 20.5937, lng: 78.9629 },
            lastUpdate: new Date().toISOString(),
            status: 'active',
          },
          // Add more mock vessels as needed
        ];
        
        setVessels(mockVessels);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch vessels'));
        setLoading(false);
      }
    };

    fetchVessels();
  }, [timeRange, filters]);

  return { vessels, loading, error };
}; 