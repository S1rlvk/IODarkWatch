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

  const handleContactClick = () => {
    window.location.href = 'mailto:ssattigeri65@gmail.com';
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
      padding: '2rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background gradient effect */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at top right, rgba(59, 130, 246, 0.1), transparent 50%)',
        pointerEvents: 'none'
      }} />

      {showWelcome && (
        <div className={styles.welcomeOverlay}>
          <div className="card glass" style={{ 
            padding: '3rem',
            maxWidth: '800px',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, var(--primary-color), var(--secondary-color))'
            }} />
            <h2 className="gradient-text" style={{ 
              fontSize: '3rem',
              marginBottom: '1.5rem',
              fontWeight: '700'
            }}>
              Welcome to IODarkWatch
            </h2>
            <p style={{ 
              fontSize: '1.25rem',
              color: 'var(--text-secondary)',
              marginBottom: '2.5rem',
              lineHeight: '1.6'
            }}>
              Your maritime domain awareness platform for the Indian Ocean
            </p>
            <div className={styles.quickActions} style={{
              display: 'flex',
              gap: '1.5rem',
              justifyContent: 'center'
            }}>
              <button 
                className="button hover-lift"
                onClick={() => setShowTutorial(true)}
                style={{
                  background: 'var(--secondary-color)'
                }}
              >
                <span>Start Tutorial</span>
              </button>
              <button 
                className="button hover-lift"
                onClick={() => setShowWelcome(false)}
              >
                <span>Get Started</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {showTutorial && (
        <div className={styles.tutorialOverlay}>
          <div className="card glass" style={{ 
            padding: '2.5rem',
            maxWidth: '500px',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1000
          }}>
            <h3 className="gradient-text" style={{ 
              fontSize: '1.75rem',
              marginBottom: '2rem',
              fontWeight: '600'
            }}>Quick Tour</h3>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
              marginBottom: '2.5rem'
            }}>
              {[
                'Use the map to view vessel positions',
                'Filter vessels by type and status',
                'Check alerts for dark vessel detection',
                'Use the timeline to track events'
              ].map((text, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.25rem'
                }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                  }}>{index + 1}</div>
                  <p style={{ 
                    color: 'var(--text-secondary)',
                    fontSize: '1.1rem',
                    lineHeight: '1.5'
                  }}>{text}</p>
                </div>
              ))}
            </div>
            <button 
              className="button hover-lift"
              onClick={handleTutorialComplete}
              style={{
                width: '100%',
                padding: '1rem'
              }}
            >
              <span>Got it!</span>
            </button>
          </div>
        </div>
      )}

      <div className={styles.mapContainer} style={{
        height: 'calc(100vh - 4rem)',
        borderRadius: '16px',
        overflow: 'hidden',
        border: '1px solid var(--border-color)',
        background: 'var(--card-bg)',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
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
        width: '360px',
        zIndex: 100
      }}>
        <div className="card glass" style={{ 
          padding: '1.5rem',
          marginBottom: '1.5rem'
        }}>
          <FilterControls
            timeRange={timeRange}
            onTimeRangeChange={setTimeRange}
          />
          <div style={{ 
            marginTop: '1.5rem', 
            padding: '1.5rem',
            background: 'var(--item-bg)',
            borderRadius: '12px',
            textAlign: 'center',
            border: '1px solid var(--border-color)'
          }}>
            <h3 className="gradient-text" style={{ 
              marginBottom: '1rem',
              fontSize: '1.25rem',
              fontWeight: '600'
            }}>
              Learn More About Dark Vessels
            </h3>
            <p style={{ 
              marginBottom: '1.5rem',
              color: 'var(--text-secondary)',
              fontSize: '1rem',
              lineHeight: '1.6'
            }}>
              Discover the impact of dark vessels on maritime security
            </p>
            <button 
              className="button hover-lift"
              onClick={handleDarkVesselsClick}
              style={{ 
                width: '100%',
                padding: '1rem',
                marginBottom: '1rem'
              }}
            >
              <span>Explore Dark Vessels</span>
            </button>
            <button 
              className="button hover-lift"
              onClick={handleContactClick}
              style={{ 
                width: '100%',
                padding: '1rem',
                background: 'var(--primary-color)'
              }}
            >
              <span>Contact Us</span>
            </button>
          </div>
        </div>
        
        <div className="card glass" style={{ 
          flex: 1
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
        height: '140px',
        zIndex: 100
      }}>
        <div className="card glass" style={{ 
          height: '100%',
          padding: '1rem'
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