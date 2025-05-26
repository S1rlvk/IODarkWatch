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
import { useRouter } from 'next/router';

// Dynamically import the map component with no SSR
const MapComponent = dynamic(
  () => import('./MapComponent'),
  { 
    ssr: false,
    loading: () => (
      <div className={styles.mapContainer}>
        <div className="card" style={{ 
          height: '100%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          background: 'var(--card-bg)',
          borderRadius: '8px'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <div className="loading-spinner" />
            <span style={{ color: 'var(--text-primary)' }}>Loading map...</span>
          </div>
        </div>
      </div>
    )
  }
);

const MaritimeDashboard: React.FC = () => {
  const router = useRouter();
  const [timeRange, setTimeRange] = useState<[Date, Date]>([
    new Date(Date.now() - 24 * 60 * 60 * 1000),
    new Date()
  ]);
  const [selectedVessel, setSelectedVessel] = useState<Vessel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(true);
  const [showTutorial, setShowTutorial] = useState(true);

  const { vessels, loading: vesselsLoading, error: vesselsError } = useVesselData({
    start: timeRange[0].toISOString(),
    end: timeRange[1].toISOString()
  });

  const { alerts, loading: alertsLoading, error: alertsError } = useDarkVesselAlerts({
    start: timeRange[0].toISOString(),
    end: timeRange[1].toISOString()
  });

  useEffect(() => {
    if (!vesselsLoading && !alertsLoading) {
      setIsLoading(false);
    }
  }, [vesselsLoading, alertsLoading]);

  useEffect(() => {
    // Check if user has seen the tutorial before
    const hasSeenTutorial = localStorage.getItem('hasSeenTutorial');
    if (hasSeenTutorial) {
      setShowTutorial(false);
    }
  }, []);

  const handleTutorialComplete = () => {
    setShowTutorial(false);
    localStorage.setItem('hasSeenTutorial', 'true');
  };

  const handleDarkVesselsClick = () => {
    router.push('/dark-vessels');
  };

  if (vesselsError || alertsError) {
    return (
      <div className={styles.dashboard}>
        <div className="card" style={{ 
          padding: '2rem', 
          textAlign: 'center',
          color: 'var(--danger-color)',
          background: 'var(--card-bg)',
          borderRadius: '8px',
          margin: '1rem'
        }}>
          Error loading data. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className={styles.dashboard} style={{
      opacity: isLoading ? 0 : 1,
      transition: 'opacity 0.5s ease-in-out'
    }}>
      {showWelcome && (
        <div className={styles.welcomeOverlay}>
          <div className="card" style={{ 
            padding: '2rem',
            maxWidth: '600px',
            textAlign: 'center'
          }}>
            <h2>Welcome to IODarkWatch</h2>
            <p>Your maritime domain awareness platform for the Indian Ocean</p>
            <div className={styles.quickActions}>
              <button 
                className="button"
                onClick={() => setShowTutorial(true)}
              >
                Start Tutorial
              </button>
              <button 
                className="button"
                onClick={() => setShowWelcome(false)}
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      )}

      {showTutorial && (
        <div className={styles.tutorialOverlay}>
          <div className="card" style={{ 
            padding: '2rem',
            maxWidth: '400px',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1000
          }}>
            <h3>Quick Tour</h3>
            <p>1. Use the map to view vessel positions</p>
            <p>2. Filter vessels by type and status</p>
            <p>3. Check alerts for dark vessel detection</p>
            <p>4. Use the timeline to track events</p>
            <button 
              className="button"
              onClick={handleTutorialComplete}
            >
              Got it!
            </button>
          </div>
        </div>
      )}

      <div className={styles.mapContainer}>
        <MapComponent
          vessels={vessels}
          onVesselClick={setSelectedVessel}
        />
      </div>

      <div className={styles.controls}>
        <div className="card" style={{ padding: '1rem', marginBottom: '1rem' }}>
          <FilterControls
            timeRange={timeRange}
            onTimeRangeChange={setTimeRange}
          />
          <button 
            className="button"
            onClick={handleDarkVesselsClick}
            style={{ marginTop: '1rem', width: '100%' }}
          >
            Learn About Dark Vessels
          </button>
        </div>
        
        <div className="card" style={{ flex: 1 }}>
          <AlertPanel
            alerts={alerts}
            loading={alertsLoading}
            onAlertClick={(alert) => {
              setSelectedVessel(alert.vessel);
            }}
          />
        </div>
      </div>

      <div className={styles.timeline}>
        <div className="card" style={{ height: '100%' }}>
          <TimelineView
            timeRange={timeRange}
            onTimeRangeChange={setTimeRange}
            events={alerts}
          />
        </div>
      </div>
    </div>
  );
};

export default MaritimeDashboard; 