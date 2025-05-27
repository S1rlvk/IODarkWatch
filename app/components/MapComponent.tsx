'use client';

import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Vessel, Alert } from '../types';
import { VesselMarker } from './VesselMarker';
import { AlertMarker } from './AlertMarker';

interface MapComponentProps {
  vessels: Vessel[];
  alerts: Alert[];
  onVesselSelect: (vessel: Vessel) => void;
  selectedVessel: Vessel | null;
}

const MapComponent: React.FC<MapComponentProps> = ({
  vessels,
  alerts,
  onVesselSelect,
  selectedVessel
}) => {
  const mapRef = useRef<L.Map>(null);

  // Mock data for testing
  const mockVessel: Vessel = {
    id: '1',
    name: 'Ocean Voyager',
    type: 'Cargo',
    mmsi: '123456789',
    imo: 'IMO1234567',
    flag: 'Panama',
    position: { lat: 15.5, lng: 73.8 },
    speed: 12,
    course: 45,
    lastUpdate: new Date().toISOString(),
    riskLevel: 'low',
    region: 'Indian Ocean'
  };

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.invalidateSize();
    }
  }, []);

  return (
    <MapContainer
      center={[15.5, 73.8]}
      zoom={5}
      style={{ height: '100%', width: '100%' }}
      ref={mapRef}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      />
      
      {vessels.map((vessel) => (
        <VesselMarker
          key={vessel.id}
          vessel={vessel}
          onClick={() => onVesselSelect(vessel)}
          isSelected={selectedVessel?.id === vessel.id}
        />
      ))}
      
      {alerts.map((alert) => (
        <AlertMarker
          key={alert.id}
          alert={alert}
          onClick={() => onVesselSelect(alert.vessel)}
          isSelected={selectedVessel?.id === alert.vessel.id}
        />
      ))}
    </MapContainer>
  );
};

export default MapComponent; 