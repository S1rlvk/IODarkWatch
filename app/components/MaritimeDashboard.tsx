'use client';

import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import styles from '../styles/Dashboard.module.css';
import { Vessel, Alert } from '../types';
import { useVesselData } from '../hooks/useVesselData';
import { useDarkVesselAlerts } from '../hooks/useDarkVesselAlerts';
import { TimelineView } from './TimelineView';
import { FilterControls } from './FilterControls';
import { AlertPanel } from './AlertPanel';

// Dynamically import the map component with no SSR
const MapComponent = dynamic(
  () => import('./MapComponent'),
  { ssr: false }
);

const MaritimeDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState<[Date, Date]>([
    new Date(Date.now() - 24 * 60 * 60 * 1000),
    new Date()
  ]);
  const [selectedVessel, setSelectedVessel] = useState<Vessel | null>(null);

  const { vessels, loading: vesselsLoading, error: vesselsError } = useVesselData({
    start: timeRange[0].toISOString(),
    end: timeRange[1].toISOString()
  });

  const { alerts, loading: alertsLoading, error: alertsError } = useDarkVesselAlerts({
    start: timeRange[0].toISOString(),
    end: timeRange[1].toISOString()
  });

  if (vesselsLoading || alertsLoading) return <div>Loading...</div>;
  if (vesselsError || alertsError) return <div>Error loading data</div>;

  return (
    <div className={styles.dashboard}>
      <div className={styles.mapContainer}>
        <MapComponent
          vessels={vessels}
          onVesselClick={setSelectedVessel}
        />
      </div>

      <div className={styles.controls}>
        <FilterControls
          timeRange={timeRange}
          onTimeRangeChange={setTimeRange}
        />
        
        <AlertPanel
          alerts={alerts}
          loading={alertsLoading}
          onAlertClick={(alert) => {
            setSelectedVessel(alert.vessel);
          }}
        />
      </div>

      <div className={styles.timeline}>
        <TimelineView
          timeRange={timeRange}
          onTimeRangeChange={setTimeRange}
          events={alerts}
        />
      </div>
    </div>
  );
};

export default MaritimeDashboard; 