'use client';

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';
import styles from './Dashboard.module.css';
import { Vessel, Alert } from '../types';
import { useVesselData } from '../hooks/useVesselData';
import { useDarkVesselAlerts } from '../hooks/useDarkVesselAlerts';
import TimelineView from './TimelineView';
import FilterControls from './FilterControls';
import AlertPanel from './AlertPanel';

const MaritimeDashboard: React.FC = () => {
  const { vessels, loading, error } = useVesselData();
  const { alerts } = useDarkVesselAlerts();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Indian Ocean Maritime Domain Awareness</h1>
        <FilterControls />
      </div>
      <div className="dashboard-content">
        <div className="timeline-section">
          <TimelineView vessels={vessels} />
        </div>
        <div className="alerts-section">
          <AlertPanel alerts={alerts} />
        </div>
      </div>
    </div>
  );
};

export default MaritimeDashboard; 