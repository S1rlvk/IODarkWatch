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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="map-wrapper" style={{ 
      height: '100%', 
      width: '100%', 
      position: 'relative',
      opacity: isMounted ? 1 : 0,
      transition: 'opacity 0.5s ease-in-out',
      background: 'var(--card-bg)',
      borderRadius: '8px',
      overflow: 'hidden'
    }}>
      {isLoading && (
        <div className="loading-overlay" style={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          background: 'var(--card-bg)',
          zIndex: 1000,
          transition: 'opacity 0.3s ease-in-out'
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
      )}
      
      <MapContainer
        center={[15, 65]}
        zoom={4}
        style={{ 
          height: '100%', 
          width: '100%',
          background: 'var(--card-bg)'
        }}
        scrollWheelZoom={true}
        whenReady={() => {
          setIsLoading(false);
          setIsMounted(true);
        }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
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
        .leaflet-container {
          background: var(--card-bg) !important;
        }
        
        .leaflet-control-zoom {
          border: none !important;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
        }
        
        .leaflet-control-zoom a {
          background: var(--item-bg) !important;
          color: var(--text-primary) !important;
          border: none !important;
        }
        
        .leaflet-control-zoom a:hover {
          background: var(--primary-color) !important;
        }
        
        .leaflet-popup-content-wrapper {
          background: var(--card-bg) !important;
          color: var(--text-primary) !important;
          border-radius: 8px !important;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
        }
        
        .leaflet-popup-tip {
          background: var(--card-bg) !important;
        }
      `}</style>
    </div>
  );
};

export default MapComponent; 