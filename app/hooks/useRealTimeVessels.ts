import { useState, useEffect, useCallback } from 'react';
import useSWR from 'swr';
import { Vessel } from '../types';
import { useVesselStore } from '../store/useVesselStore';

const fetcher = (url: string) => fetch(url).then(res => res.json());

const REFRESH_INTERVAL = 30000; // 30 seconds

interface VesselResponse {
  vessels: Vessel[];
  lastUpdated: string;
}

export const useRealTimeVessels = () => {
  const [isManualRefreshing, setIsManualRefreshing] = useState(false);
  const [lastFetchTime, setLastFetchTime] = useState<Date | null>(null);
  const [currentTime, setCurrentTime] = useState(Date.now());
  
  const setVessels = useVesselStore(state => state.setVessels);
  
  // Update current time every second for accurate countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  // SWR for automatic data fetching with 30-second intervals
  const { data, error, isLoading, mutate } = useSWR<VesselResponse>(
    '/api/vessels',
    fetcher,
    {
      refreshInterval: REFRESH_INTERVAL,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      onSuccess: (data) => {
        if (data?.vessels) {
          setVessels(data.vessels);
          setLastFetchTime(new Date());
        }
      }
    }
  );

  // Manual refresh function
  const refreshData = useCallback(async () => {
    setIsManualRefreshing(true);
    try {
      await mutate();
    } finally {
      setTimeout(() => {
        setIsManualRefreshing(false);
      }, 1000); // Keep spinner visible for at least 1 second for UX
    }
  }, [mutate]);

  // Calculate time since last update using current time for real-time updates
  const timeSinceLastUpdate = lastFetchTime 
    ? Math.floor((currentTime - lastFetchTime.getTime()) / 1000)
    : null;

  // Check if data is stale (older than refresh interval + buffer)
  const isDataStale = timeSinceLastUpdate 
    ? timeSinceLastUpdate > (REFRESH_INTERVAL / 1000) + 10
    : false;

  return {
    vessels: data?.vessels || [],
    lastUpdated: data?.lastUpdated || lastFetchTime?.toISOString(),
    isLoading: isLoading || isManualRefreshing,
    isManualRefreshing,
    isDataStale,
    timeSinceLastUpdate,
    error,
    refreshData,
    nextRefreshIn: timeSinceLastUpdate 
      ? Math.max(0, (REFRESH_INTERVAL / 1000) - timeSinceLastUpdate)
      : REFRESH_INTERVAL / 1000
  };
}; 