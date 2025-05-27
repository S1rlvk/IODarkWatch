'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

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
      background: '#1a1a1a',
      color: 'white'
    }}>
      Loading map...
    </div>
  )
});

export default function Dashboard() {
  return (
    <div style={{ 
      padding: '20px',
      maxWidth: '1200px',
      margin: '0 auto',
      color: 'white'
    }}>
      <h1>Maritime Domain Awareness</h1>
      <p>Real-time vessel tracking in the Indian Ocean</p>

      <p>Loading dashboard...</p>

      <h3>Active Vessels</h3>
      <p>0</p>

      <h3>Dark Vessels</h3>
      <p>0</p>

      <h3>Alerts</h3>
      <p>0</p>

      <div style={{ margin: '20px 0' }}>
        <button style={{ marginRight: '10px' }}>Filter Vessels</button>
        <button style={{ marginRight: '10px' }}>View Alerts</button>
        <button>Export Data</button>
      </div>

      <div style={{ height: '600px', width: '100%', background: '#1a1a1a' }}>
        <MapComponent
          alerts={[]}
          onAlertClick={() => {}}
          selectedAlert={null}
        />
      </div>

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button>Contact Us</button>
      </div>
    </div>
  );
} 