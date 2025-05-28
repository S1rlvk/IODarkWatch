'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import { sampleVessels, sampleAlerts } from '../data/sampleVessels';
import FilterModal from '../components/FilterModal';
import AlertsModal from '../components/AlertsModal';
import ExportModal from '../components/ExportModal';

// Dynamically import MapComponent to avoid SSR issues
const MapComponent = dynamic(() => import('../components/MapComponent').then(mod => mod.default), {
  ssr: false,
  loading: () => (
    <div style={{ 
      height: '600px', 
      width: '100%', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: '#111',
      color: '#fff'
    }}>
      Loading map...
    </div>
  )
});

export default function Dashboard() {
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isAlertsModalOpen, setIsAlertsModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    dateRange: { start: '', end: '' },
    regions: [],
    onlyDarkShips: false,
    confidenceScore: 0.5
  });

  const activeVessels = sampleVessels.filter(v => v.status === 'active').length;
  const darkVessels = sampleVessels.filter(v => v.status === 'dark').length;
  const totalAlerts = sampleAlerts.length;

  const handleFilterApply = (newFilters: any) => {
    setFilters(newFilters);
    // Here you would typically filter the vessels based on the new filters
    // For now, we're just storing the filters
  };

  const handleAlertSelect = (alert: any) => {
    setSelectedAlert(alert);
    setIsAlertsModalOpen(false);
    // Here you would typically zoom the map to the alert location
  };

  const handleExport = (format: string, onlyFlagged: boolean) => {
    // Here you would implement the actual export functionality
    console.log(`Exporting as ${format}, onlyFlagged: ${onlyFlagged}`);
    setIsExportModalOpen(false);
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      width: '100vw',
      background: '#111',
      color: '#fff',
      position: 'fixed',
      top: 0,
      left: 0,
      overflowY: 'auto'
    }}>
      <div style={{ 
        padding: '20px',
        maxWidth: '1200px',
        margin: '0 auto',
      }}>
        <h1 style={{ fontSize: '24px', marginBottom: '10px', color: '#fff' }}>Maritime Domain Awareness</h1>
        <p style={{ marginBottom: '20px', color: '#ccc' }}>Real-time vessel tracking in the Indian Ocean</p>

        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ marginBottom: '5px', color: '#fff' }}>Active Vessels</h3>
          <p style={{ marginBottom: '15px', color: '#ccc' }}>{activeVessels}</p>

          <h3 style={{ marginBottom: '5px', color: '#fff' }}>Dark Vessels</h3>
          <p style={{ marginBottom: '15px', color: '#ccc' }}>{darkVessels}</p>

          <h3 style={{ marginBottom: '5px', color: '#fff' }}>Alerts</h3>
          <p style={{ marginBottom: '15px', color: '#ccc' }}>{totalAlerts}</p>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <button 
            onClick={() => setIsFilterModalOpen(true)}
            style={{ 
              marginRight: '10px',
              padding: '8px 16px',
              background: '#333',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Filter Vessels
          </button>
          <button 
            onClick={() => setIsAlertsModalOpen(true)}
            style={{ 
              marginRight: '10px',
              padding: '8px 16px',
              background: '#333',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            View Alerts
          </button>
          <button 
            onClick={() => setIsExportModalOpen(true)}
            style={{ 
              padding: '8px 16px',
              background: '#333',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Export Data
          </button>
        </div>

        <div style={{ height: '600px', width: '100%', background: '#111' }}>
          <MapComponent
            alerts={sampleAlerts}
            onAlertClick={setSelectedAlert}
            selectedAlert={selectedAlert}
          />
        </div>

        <div style={{ 
          textAlign: 'center', 
          marginTop: '20px',
          padding: '20px 0'
        }}>
          <button style={{ 
            padding: '8px 16px',
            background: '#333',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            minWidth: '120px'
          }}>Contact Us</button>
        </div>
      </div>

      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApply={handleFilterApply}
      />

      <AlertsModal
        isOpen={isAlertsModalOpen}
        onClose={() => setIsAlertsModalOpen(false)}
        alerts={sampleAlerts}
        onAlertSelect={handleAlertSelect}
      />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={handleExport}
        totalRecords={sampleVessels.length}
      />
    </div>
  );
} 