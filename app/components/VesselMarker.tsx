'use client';

import React, { useEffect, useState } from 'react';
import { Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
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

  return (
    <Marker
      position={[vessel.position.lat, vessel.position.lng]}
      icon={icon}
      eventHandlers={{
        click: onClick
      }}
    >
      <Popup>
        <div>
          <h3>{vessel.name}</h3>
          <p>Type: {vessel.type}</p>
          <p>Speed: {vessel.speed} knots</p>
          <p>Course: {vessel.course}°</p>
          <p>Risk Level: {vessel.riskLevel}</p>
          <p>Region: {vessel.region}</p>
        </div>
      </Popup>
    </Marker>
  );
}; 