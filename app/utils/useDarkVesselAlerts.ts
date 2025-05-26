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

interface Alert {
  id: string;
  vessel: Vessel;
  type: 'dark_mode' | 'suspicious_activity' | 'zone_violation';
  severity: 'low' | 'medium' | 'high';
  timestamp: string;
  location: {
    lat: number;
    lng: number;
  };
  description: string;
}

interface AlertData {
  alerts: Alert[];
  loading: boolean;
  error: Error | null;
}

interface UseDarkVesselAlertsProps {
  timeRange: [Date, Date];
}

export const useDarkVesselAlerts = ({ timeRange }: UseDarkVesselAlertsProps): AlertData => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        // TODO: Replace with actual API call
        const mockAlerts: Alert[] = [
          {
            id: '1',
            vessel: {
              id: '1',
              mmsi: '123456789',
              name: 'Vessel 1',
              type: 'Tanker',
              position: [20.5937, 78.9629],
              speed: 15,
              course: 180,
              lastUpdate: new Date().toISOString(),
              isDark: true,
            },
            type: 'dark_mode',
            severity: 'high',
            timestamp: new Date().toISOString(),
            location: { lat: 20.5937, lng: 78.9629 },
            description: 'Vessel operating in dark mode for more than 24 hours',
          },
          // Add more mock alerts as needed
        ];
        
        setAlerts(mockAlerts);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch alerts'));
        setLoading(false);
      }
    };

    fetchAlerts();
  }, [timeRange]);

  return { alerts, loading, error };
}; 