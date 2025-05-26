'use client';

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Vessel } from '../types';
import styles from './MapComponent.module.css';

// Mock data for vessels
const mockVessels: Vessel[] = [
  {
    id: '1',
    mmsi: '123456789',
    name: 'Ocean Voyager',
    type: 'Cargo',
    position: [15.5, 73.8],
    speed: 12,
    course: 45,
    lastUpdate: new Date().toISOString(),
    isDark: false
  },
  {
    id: '2',
    mmsi: '987654321',
    name: 'Deep Sea Explorer',
    type: 'Fishing',
    position: [16.2, 74.5],
    speed: 8,
    course: 90,
    lastUpdate: new Date().toISOString(),
    isDark: true
  },
  {
    id: '3',
    mmsi: '456789123',
    name: 'Maritime Star',
    type: 'Tanker',
    position: [14.8, 72.9],
    speed: 15,
    course: 180,
    lastUpdate: new Date().toISOString(),
    isDark: false
  }
];

interface MapComponentProps {
  onVesselClick?: (vessel: Vessel) => void;
}

const MapComponent: React.FC<MapComponentProps> = ({ onVesselClick }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [selectedVessel, setSelectedVessel] = useState<Vessel | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleVesselClick = (vessel: Vessel) => {
    setSelectedVessel(vessel);
    onVesselClick?.(vessel);
  };

  if (!isMounted) {
    return (
      <div className={styles.mapContainer}>
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingSpinner} />
          <span>Loading map...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.mapContainer}>
      <MapContainer
        center={[15, 73]}
        zoom={5}
        className={`${styles.map} ${styles.leafletOverrides}`}
        scrollWheelZoom={true}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        
        {mockVessels.map((vessel) => (
          <Marker
            key={vessel.id}
            position={vessel.position}
            eventHandlers={{
              click: () => handleVesselClick(vessel)
            }}
          >
            <Popup>
              <div className={styles.popup}>
                <h3>{vessel.name}</h3>
                <p>Type: {vessel.type}</p>
                <p>Speed: {vessel.speed} knots</p>
                <p>Course: {vessel.course}°</p>
                {vessel.isDark && (
                  <div className={styles.darkVesselWarning}>
                    Dark Vessel Detected
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {selectedVessel && (
        <div className={styles.vesselDetails}>
          <h3>{selectedVessel.name}</h3>
          <p>Type: {selectedVessel.type}</p>
          <p>Speed: {selectedVessel.speed} knots</p>
          <p>Course: {selectedVessel.course}°</p>
          <p>Last Update: {new Date(selectedVessel.lastUpdate).toLocaleString()}</p>
          {selectedVessel.isDark && (
            <div className={styles.darkVesselWarning}>
              Dark Vessel Detected
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MapComponent; 