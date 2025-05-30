import { useState, useEffect } from 'react';
import { Vessel } from '../types';

export const useVesselData = (timeRange: { start: string; end: string }) => {
  const [vessels, setVessels] = useState<Vessel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVesselData = async () => {
      try {
        setLoading(true);
        // TODO: Replace with actual API call
        const response = await fetch(`/api/vessels?start=${timeRange.start}&end=${timeRange.end}`);
        const data = await response.json();
        setVessels(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch vessel data');
      } finally {
        setLoading(false);
      }
    };

    fetchVesselData();
  }, [timeRange]);

  return { vessels, loading, error };
}; 