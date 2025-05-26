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
  { 
    ssr: false,
    loading: () => (
      <div className={styles.mapContainer}>
        <div style={{ 
          height: '100%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          background: '#f5f5f5',
          borderRadius: '8px'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '4px solid #f3f3f3',
              borderTop: '4px solid #3498db',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
            <span>Loading map...</span>
          </div>
        </div>
      </div>
    )
  }
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

  if (vesselsError || alertsError) {
    return (
      <div className={styles.dashboard}>
        <div style={{ 
          padding: '2rem', 
          textAlign: 'center',
          color: 'var(--danger-color)'
        }}>
          Error loading data. Please try again later.
        </div>
      </div>
    );
  }

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

      <style jsx global>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default MaritimeDashboard; 