'use client';

import React, { useEffect, useState } from 'react';
import { Marker, Popup } from 'react-leaflet';
import { Icon, LatLngTuple } from 'leaflet';
import { Vessel } from '../types';

interface VesselMarkerProps {
  vessel: Vessel;
  onClick: () => void;
  isSelected: boolean;
}

export const VesselMarker: React.FC<VesselMarkerProps> = ({ vessel, onClick, isSelected }) => {
  const [icon, setIcon] = useState<Icon | null>(null);

  useEffect(() => {
    // Create icon only on client side
    setIcon(new Icon({
      iconUrl: '/vessel-icon.png',
      iconSize: [25, 25],
      iconAnchor: [12, 12],
    }));
  }, []);

  if (!icon) return null;

  // Use lat/lon directly from vessel object
  const position: LatLngTuple = [vessel.lat, vessel.lon];

  return (
    <Marker
      position={position}
      icon={icon}
      eventHandlers={{
        click: onClick
      }}
    >
      <Popup>
        <div className="p-2">
          <h3 className="text-lg font-bold mb-2">{vessel.name}</h3>
          <p className="text-sm text-gray-300">Type: {vessel.type}</p>
          <p className="text-sm text-gray-300">Status: {vessel.status}</p>
          <p className="text-sm text-gray-300">Last Update: {new Date(vessel.timestamp).toLocaleString()}</p>
          {vessel.mmsi && <p className="text-sm text-gray-300">MMSI: {vessel.mmsi}</p>}
          {vessel.imo && <p className="text-sm text-gray-300">IMO: {vessel.imo}</p>}
          {vessel.flag && <p className="text-sm text-gray-300">Flag: {vessel.flag}</p>}
        </div>
      </Popup>
    </Marker>
  );
}; 