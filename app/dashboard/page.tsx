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
      background: '#111',
      color: '#fff'
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
      color: '#fff',
      background: '#111',
      minHeight: '100vh'
    }}>
      <h1 style={{ fontSize: '24px', marginBottom: '10px', color: '#fff' }}>Maritime Domain Awareness</h1>
      <p style={{ marginBottom: '20px', color: '#ccc' }}>Real-time vessel tracking in the Indian Ocean</p>

      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ marginBottom: '5px', color: '#fff' }}>Active Vessels</h3>
        <p style={{ marginBottom: '15px', color: '#ccc' }}>0</p>

        <h3 style={{ marginBottom: '5px', color: '#fff' }}>Dark Vessels</h3>
        <p style={{ marginBottom: '15px', color: '#ccc' }}>0</p>

        <h3 style={{ marginBottom: '5px', color: '#fff' }}>Alerts</h3>
        <p style={{ marginBottom: '15px', color: '#ccc' }}>0</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button style={{ 
          marginRight: '10px',
          padding: '8px 16px',
          background: '#333',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}>Filter Vessels</button>
        <button style={{ 
          marginRight: '10px',
          padding: '8px 16px',
          background: '#333',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}>View Alerts</button>
        <button style={{ 
          padding: '8px 16px',
          background: '#333',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}>Export Data</button>
      </div>

      <div style={{ height: '600px', width: '100%', background: '#111' }}>
        <MapComponent
          alerts={[]}
          onAlertClick={() => {}}
          selectedAlert={null}
        />
      </div>

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button style={{ 
          padding: '8px 16px',
          background: '#333',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}>Contact Us</button>
      </div>
    </div>
  );
} 