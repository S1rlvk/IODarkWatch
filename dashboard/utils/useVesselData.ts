import { useState, useEffect } from 'react';

interface Vessel {
  id: string;
  mmsi: string;
  name: string;
  type: string;
  position: [number, number];
  speed: number;
  course: number;
  lastUpdate: string;
  isDark: boolean;
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

export const useVesselData = ({ timeRange, filters }: UseVesselDataProps) => {
  const [vessels, setVessels] = useState<Vessel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVessels = async () => {
      setLoading(true);
      try {
        // TODO: Replace with actual API call
        const response = await fetch('/api/vessels?' + new URLSearchParams({
          start: timeRange[0].toISOString(),
          end: timeRange[1].toISOString(),
          types: filters.vesselTypes.join(','),
          minSpeed: filters.minSpeed.toString(),
          maxSpeed: filters.maxSpeed.toString(),
          darkOnly: filters.darkVesselsOnly.toString(),
        }));
        const data = await response.json();
        setVessels(data);
      } catch (error) {
        console.error('Error fetching vessels:', error);
        setVessels([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVessels();
  }, [timeRange, filters]);

  return { vessels, loading };
}; 