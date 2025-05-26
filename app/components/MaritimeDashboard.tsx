'use client';

import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import styles from '../styles/Dashboard.module.css';
import { Vessel, Alert } from '../types';
import { useVesselData } from '../hooks/useVesselData';
import { useDarkVesselAlerts } from '../hooks/useDarkVesselAlerts';
import { TimelineView } from './TimelineView';
import { FilterControls } from './FilterControls';
import { AlertPanel } from './AlertPanel';
import { VesselMarker } from './VesselMarker';

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
        <MapContainer
          center={[15, 65]}
          zoom={4}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://api.maptiler.com/maps/basic-v2/{z}/{x}/{y}.png?key=YOUR_MAPTILER_KEY"
            attribution='&copy; <a href="https://www.maptiler.com/">MapTiler</a>'
          />
          {vessels.map((vessel) => (
            <VesselMarker
              key={vessel.id}
              vessel={vessel}
              onClick={() => setSelectedVessel(vessel)}
            />
          ))}
        </MapContainer>
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