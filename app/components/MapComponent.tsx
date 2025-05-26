'use client';

import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Vessel } from '../types';
import { VesselMarker } from './VesselMarker';

interface MapComponentProps {
  vessels: Vessel[];
  onVesselClick: (vessel: Vessel) => void;
}

const MapComponent: React.FC<MapComponentProps> = ({ vessels, onVesselClick }) => {
  return (
    <MapContainer
      center={[15, 65]}
      zoom={4}
      style={{ height: '100%', width: '100%' }}
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
  );
};

export default MapComponent; 