'use client';

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Vessel, MapComponentProps } from '../types';
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

const MapComponent: React.FC<MapComponentProps> = ({ vessels, alerts, onVesselSelect, selectedVessel }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleVesselClick = (vessel: Vessel) => {
    onVesselSelect(vessel);
  };

  if (!isMounted) return null;

  return (
    <MapContainer
      center={[0, 0]}
      zoom={2}
      className={styles.mapContainer}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {vessels.map((vessel) => (
        <Marker
          key={vessel.id}
          position={[vessel.position.lat, vessel.position.lng]}
          eventHandlers={{
            click: () => handleVesselClick(vessel)
          }}
        >
          <Popup>
            <div>
              <h3>{vessel.name}</h3>
              <p>Type: {vessel.type}</p>
              <p>Speed: {vessel.speed} knots</p>
              <p>Course: {vessel.course}°</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapComponent; 