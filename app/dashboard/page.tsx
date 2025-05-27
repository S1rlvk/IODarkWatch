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
      background: '#000',
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
      color: 'white',
      background: '#000',
      minHeight: '100vh'
    }}>
      <h1 style={{ fontSize: '24px', marginBottom: '10px' }}>Maritime Domain Awareness</h1>
      <p style={{ marginBottom: '20px' }}>Real-time vessel tracking in the Indian Ocean</p>

      <p style={{ marginBottom: '20px' }}>Loading dashboard...</p>

      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ marginBottom: '5px' }}>Active Vessels</h3>
        <p style={{ marginBottom: '15px' }}>0</p>

        <h3 style={{ marginBottom: '5px' }}>Dark Vessels</h3>
        <p style={{ marginBottom: '15px' }}>0</p>

        <h3 style={{ marginBottom: '5px' }}>Alerts</h3>
        <p style={{ marginBottom: '15px' }}>0</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button style={{ marginRight: '10px' }}>Filter Vessels</button>
        <button style={{ marginRight: '10px' }}>View Alerts</button>
        <button>Export Data</button>
      </div>

      <div style={{ height: '600px', width: '100%', background: '#000' }}>
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