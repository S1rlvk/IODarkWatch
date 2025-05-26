'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import styles from './Dashboard.module.css';

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
  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <h1>Maritime Domain Awareness</h1>
        <p>Real-time vessel tracking in the Indian Ocean</p>
      </header>

      <main className={styles.main}>
        <div className={styles.mapWrapper}>
          <MapComponent />
        </div>

        <div className={styles.sidebar}>
          <div className={styles.stats}>
            <div className={styles.statCard}>
              <h3>Active Vessels</h3>
              <p className={styles.statValue}>3</p>
            </div>
            <div className={styles.statCard}>
              <h3>Dark Vessels</h3>
              <p className={styles.statValue}>1</p>
            </div>
            <div className={styles.statCard}>
              <h3>Alerts</h3>
              <p className={styles.statValue}>2</p>
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