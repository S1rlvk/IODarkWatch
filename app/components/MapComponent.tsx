'use client';

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Vessel } from '../types';
import { VesselMarker } from './VesselMarker';

interface MapComponentProps {
  vessels: Vessel[];
  onVesselClick: (vessel: Vessel) => void;
}

const MapComponent: React.FC<MapComponentProps> = ({ vessels, onVesselClick }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div style={{ 
      height: '100%', 
      width: '100%', 
      position: 'relative',
      opacity: isMounted ? 1 : 0,
      transition: 'opacity 0.3s ease-in-out'
    }}>
      {!isMounted && (
        <div style={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          background: '#f5f5f5',
          zIndex: 1
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '4px solid #f3f3f3',
              borderTop: '4px solid #3498db',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
            <span>Loading map...</span>
          </div>
        </div>
      )}
      
      <MapContainer
        center={[15, 65]}
        zoom={4}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
        whenReady={() => setIsMounted(true)}
      >
        <TileLayer
          url="https://api.maptiler.com/maps/basic-v2/{z}/{x}/{y}.png?key=YOUR_MAPTILER_KEY"
          attribution='&copy; <a href="https://www.maptiler.com/">MapTiler</a>'
        />
        {vessels.map((vessel) => (
          <VesselMarker
            key={vessel.id}
            vessel={vessel}
            onClick={() => onVesselClick(vessel)}
          />
        ))}
      </MapContainer>

      <style jsx global>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default MapComponent; 