'use client';

import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
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
      transition: 'opacity 0.5s ease-in-out',
      background: 'var(--bg-primary)',
      minHeight: '100vh',
      padding: '2rem'
    }}>
      {showWelcome && (
        <div className={styles.welcomeOverlay}>
          <div className="card" style={{ 
            padding: '3rem',
            maxWidth: '800px',
            textAlign: 'center',
            background: 'var(--card-bg)',
            border: '1px solid var(--border-color)'
          }}>
            <h2 style={{ 
              fontSize: '2.5rem',
              marginBottom: '1rem',
              background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Welcome to IODarkWatch
            </h2>
            <p style={{ 
              fontSize: '1.2rem',
              color: 'var(--text-secondary)',
              marginBottom: '2rem'
            }}>
              Your maritime domain awareness platform for the Indian Ocean
            </p>
            <div className={styles.quickActions} style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center'
            }}>
              <button 
                className="button"
                onClick={() => setShowTutorial(true)}
                style={{
                  background: 'var(--secondary-color)'
                }}
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
            maxWidth: '500px',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1000,
            background: 'var(--card-bg)',
            border: '1px solid var(--border-color)'
          }}>
            <h3 style={{ 
              fontSize: '1.5rem',
              marginBottom: '1.5rem',
              color: 'var(--text-primary)'
            }}>Quick Tour</h3>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              marginBottom: '2rem'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'var(--primary-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold'
                }}>1</div>
                <p style={{ color: 'var(--text-secondary)' }}>Use the map to view vessel positions</p>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'var(--primary-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold'
                }}>2</div>
                <p style={{ color: 'var(--text-secondary)' }}>Filter vessels by type and status</p>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'var(--primary-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold'
                }}>3</div>
                <p style={{ color: 'var(--text-secondary)' }}>Check alerts for dark vessel detection</p>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'var(--primary-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold'
                }}>4</div>
                <p style={{ color: 'var(--text-secondary)' }}>Use the timeline to track events</p>
              </div>
            </div>
            <button 
              className="button"
              onClick={handleTutorialComplete}
              style={{
                width: '100%'
              }}
            >
              Got it!
            </button>
          </div>
        </div>
      )}

      <div className={styles.mapContainer} style={{
        height: 'calc(100vh - 4rem)',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid var(--border-color)',
        background: 'var(--card-bg)'
      }}>
        <MapComponent
          onVesselClick={setSelectedVessel}
        />
      </div>

      <div className={styles.controls} style={{
        position: 'fixed',
        right: '2rem',
        top: '50%',
        transform: 'translateY(-50%)',
        width: '320px',
        zIndex: 100
      }}>
        <div className="card" style={{ 
          padding: '1.5rem',
          marginBottom: '1rem',
          background: 'var(--card-bg)',
          border: '1px solid var(--border-color)'
        }}>
          <FilterControls
            timeRange={timeRange}
            onTimeRangeChange={setTimeRange}
          />
          <div style={{ 
            marginTop: '1.5rem', 
            padding: '1.5rem',
            background: 'var(--item-bg)',
            borderRadius: '8px',
            textAlign: 'center',
            border: '1px solid var(--border-color)'
          }}>
            <h3 style={{ 
              marginBottom: '0.75rem',
              color: 'var(--text-primary)',
              fontSize: '1.2rem'
            }}>
              Learn More About Dark Vessels
            </h3>
            <p style={{ 
              marginBottom: '1.5rem',
              color: 'var(--text-secondary)',
              fontSize: '0.95rem',
              lineHeight: '1.5'
            }}>
              Discover the impact of dark vessels on maritime security
            </p>
            <button 
              className="button"
              onClick={handleDarkVesselsClick}
              style={{ 
                width: '100%',
                padding: '1rem',
                fontSize: '0.95rem',
                background: 'var(--primary-color)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              Explore Dark Vessels
            </button>
          </div>
        </div>
        
        <div className="card" style={{ 
          flex: 1,
          background: 'var(--card-bg)',
          border: '1px solid var(--border-color)'
        }}>
          <AlertPanel
            alerts={alerts}
            loading={alertsLoading}
            onAlertClick={(alert) => {
              setSelectedVessel(alert.vessel);
            }}
          />
        </div>
      </div>

      <div className={styles.timeline} style={{
        position: 'fixed',
        bottom: '2rem',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'calc(100% - 4rem)',
        maxWidth: '1200px',
        height: '120px',
        zIndex: 100
      }}>
        <div className="card" style={{ 
          height: '100%',
          background: 'var(--card-bg)',
          border: '1px solid var(--border-color)'
        }}>
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