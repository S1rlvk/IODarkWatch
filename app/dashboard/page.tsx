'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import styles from './Dashboard.module.css';
import { Vessel, Alert } from '../types';

// Dynamically import the MapComponent to avoid SSR issues with Leaflet
const MapComponent = dynamic(() => import('../components/MapComponent'), {
  ssr: false,
  loading: () => (
    <div className={styles.loadingContainer}>
      <div className={styles.loadingSpinner} />
      <span>Loading dashboard...</span>
    </div>
  ),
});

export default function Dashboard() {
  const [vessels, setVessels] = useState<Vessel[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [selectedVessel, setSelectedVessel] = useState<Vessel | null>(null);

  const handleVesselSelect = (vessel: Vessel) => {
    setSelectedVessel(vessel);
  };

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <h1>Maritime Domain Awareness</h1>
        <p>Real-time vessel tracking in the Indian Ocean</p>
      </header>

      <main className={styles.main}>
        <div className={styles.mapWrapper}>
          <MapComponent 
            vessels={vessels}
            alerts={alerts}
            onVesselSelect={handleVesselSelect}
            selectedVessel={selectedVessel}
          />
        </div>

        <div className={styles.sidebar}>
          <div className={styles.stats}>
            <div className={styles.statCard}>
              <h3>Active Vessels</h3>
              <p className={styles.statValue}>{vessels.length}</p>
            </div>
            <div className={styles.statCard}>
              <h3>Dark Vessels</h3>
              <p className={styles.statValue}>
                {vessels.filter(v => v.riskLevel === 'high').length}
              </p>
            </div>
            <div className={styles.statCard}>
              <h3>Alerts</h3>
              <p className={styles.statValue}>{alerts.length}</p>
            </div>
          </div>

          <div className={styles.controls}>
            <button className={styles.controlButton}>
              Filter Vessels
            </button>
            <button className={styles.controlButton}>
              View Alerts
            </button>
            <button className={styles.controlButton}>
              Export Data
            </button>
          </div>
        </div>
      </main>
    </div>
  );
} 