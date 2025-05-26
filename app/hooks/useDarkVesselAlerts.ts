import { useState, useEffect } from 'react';
import { Alert } from '../types';

export const useDarkVesselAlerts = (timeRange: { start: string; end: string }) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setLoading(true);
        // TODO: Replace with actual API call
        const response = await fetch(`/api/alerts?start=${timeRange.start}&end=${timeRange.end}`);
        const data = await response.json();
        setAlerts(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch alerts');
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, [timeRange]);

  return { alerts, loading, error };
}; 